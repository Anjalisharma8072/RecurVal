const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const http = require("http"); // Add this
const routes = require("../routes/routes");
const { Server } = require("socket.io");
const cors = require("cors");
const db = process.env.MONGO_URI;
const jobDetails = require("../model/job")
const Scorecard = require("../model/ScoreCard")
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

app.post("/api/job-post",async (req,res)=>{
  try{
    const job = new jobDetails(req.body);
    console.log(job);
    await job.save();
    res.status(201).json(job);
  }catch(error){
    res.status(400).json({error:error.message});
  }

})
app.get("/api/job-list",async (req,res)=>{
  try{
    const jobs = await jobDetails.find();
    res.status(200).json(jobs);
  }catch(error){
    res.status(400).json({error:error.message});
  }
})

app.patch("/api/job-update/:jobId",async(req,res)=>{
  try{
    const {jobId} = req.params;
    console.log( "*******",jobId);
    const updates = req.body;
    const updatedJob = await jobDetails.findByIdAndUpdate(jobId,updates,{
      new:true,
      runValidators:true,
    });
    if(!updatedJob){
      return res.status(404),json({error:"Job not found"});
    }
    res.status(200).json(updatedJob);
  }catch(error){
    res.status(400).json({error:error.message});
  }
})
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


  try {
    // Step 1: Call the AI API for evaluation
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

    // Step 2: Extract the content from the AI response
    const aiContent = result.choices[0].message.content;

    // Step 3: Remove Markdown code block syntax (if present)
    const cleanContent = aiContent
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    // Step 4: Parse the cleaned content as JSON
    const content = JSON.parse(cleanContent);
    const { evaluations, final_decision } = content;

    // Step 5: Save all evaluations and final_decision as a single document
    const scorecard = new Scorecard({
      evaluations,
      final_decision,
    });

    await scorecard.save();

    // Step 6: Return the AI response to the client
    return res.json(content);
  } catch (error) {
    console.error("Error:", error);
    return res
      .status(500)
      .json({ error: "Failed to evaluate and save responses" });
  }
});


// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
