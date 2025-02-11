const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const http = require("http"); // Add this
const routes = require("../routes/routes");
const { Server } = require("socket.io");
const cors = require("cors");
const db = process.env.MONGO_URI;
require("dotenv").config();

const app = express();
const PORT = 8000;
app.use(cors()); 

// Create an HTTP server and attach Express to it
const server = http.createServer(app);

// Attach Socket.IO to the HTTP server
const io = new Server(server, {
  cors: {
    origin: "*", 
    methods: ["GET", "POST"],
  },
});


const emailToSocketIdMap = new Map();
const socketidToEmailMap = new Map();

io.on("connection", (socket) => {
  console.log(`Socket Connected`, socket.id);

  socket.on("room:join", (data) => {
    const { email, room } = data;
    emailToSocketIdMap.set(email, socket.id);
    socketidToEmailMap.set(socket.id, email);
    io.to(room).emit("user:joined", { email, id: socket.id });
    socket.join(room);
    io.to(socket.id).emit("room:join", data);
  });


  socket.on("message:send", ({ room, message, email }) => {
    console.log(`Message from ${email} in ${room}: ${message}`);

 
    io.to(room).emit("message:receive", { email, message });
  });
  socket.on('transcript:send', ({ room, transcript, email }) => {
    io.to(room).emit('transcript:receive', { email, transcript });
  })


  socket.on("disconnect", () => {
    console.log(`User Disconnected: ${socket.id}`);
    const email = socketidToEmailMap.get(socket.id);
    if (email) {
      emailToSocketIdMap.delete(email);
      socketidToEmailMap.delete(socket.id);
    }
  });

  socket.on("user:call", ({ to, offer }) => {
    io.to(to).emit("incomming:call", { from: socket.id, offer });
  });

  socket.on("call:accepted", ({ to, ans }) => {
    io.to(to).emit("call:accepted", { from: socket.id, ans });
  });

  socket.on("peer:nego:needed", ({ to, offer }) => {
    console.log("peer:nego:needed", offer);
    io.to(to).emit("peer:nego:needed", { from: socket.id, offer });
  });

  socket.on("peer:nego:done", ({ to, ans }) => {
    console.log("peer:nego:done", ans);
    io.to(to).emit("peer:nego:final", { from: socket.id, ans });
  });
});

// MongoDB connection
mongoose
  .connect(db)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.log(err);
  });

// Express Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api", routes);

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.post("/evaluate", async (req, res) => {
  const { messages } = req.body;

  // System instruction should be an object
  const systemPrompt = {
    role: "system",
    content: `You are an AI interviewer assistant evaluating a candidate's responses.
You must return a **valid JSON response** following this exact structure:

{
  "evaluations": [
    {
      "question": "Original question asked by the interviewer",
      "answer": "Refined candidate response (fix grammar, repetition and correct spelling only)",
      "score": "Score out of 10 based on clarity, correctness, and depth",
      "areas_of_improvement": "Suggestions for improvement, if necessary"
    }
  ],
  "final_decision": "Hire or Not Hire"
}

### **Instructions:**
1️⃣ **DO NOT** include any extra text, explanations, or formatting outside of JSON.  
2️⃣ **DO NOT** use Markdown, bullet points, or natural language responses—return only JSON.  
3️⃣ Ensure the JSON is **well-formed** with correct keys, values, and structure.

Your task is to analyze the candidate’s responses and return a structured JSON evaluation. If the response is incomplete or irrelevant, indicate appropriate feedback.

Strictly output only JSON. No extra explanations.`,
  };

  const fullMessages = [
    systemPrompt, 
    ...messages.map((msg) => ({
      role: "user",
      content: `${msg.email}: ${msg.content}`,
    })),
  ];

  console.log("Full Messages:", JSON.stringify(fullMessages, null, 2));

  try {
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OpenAI_API_KEY}`, // Use ENV variable
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "meta-llama/llama-3.3-70b-instruct:free",
          messages: fullMessages,
        }),
      }
    );

    const result = await response.json();
    console.log("AI Response:", JSON.stringify(result, null, 2));

    if (result.error) {
      return res.status(500).json({ error: result.error });
    }

    return res.json(result);
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: "Failed to evaluate responses" });
  }
});



// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
