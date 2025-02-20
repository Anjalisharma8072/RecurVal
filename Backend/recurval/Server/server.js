const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const http = require("http"); // Add this
const routes = require("../routes/routes");
const { Server } = require("socket.io");
const cors = require("cors");
const nodemailer = require("nodemailer");
const {PDFDocument, StandardFonts, rgb } = require("pdf-lib");
const db = process.env.MONGO_URI;
const jobDetails = require("../model/job")
const Scorecard = require("../model/ScoreCard")
const fs = require("fs");
const path = require("path");
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
const roomInitiators = new Map(); // Track initiators per room

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
    // Check if this user was the call initiator
    let roomToClose = null;
    for (let [room, initiator] of roomInitiators.entries()) {
      if (initiator === socket.id) {
        roomToClose = room;
        break;
      }
    }
      if (roomToClose) {
        io.to(roomToClose).emit("call:ended", {
          message: "Call ended as the host left.",
        });
        io.in(roomToClose).socketsLeave(roomToClose); // Disconnect all users
        roomInitiators.delete(roomToClose); // Remove the room tracking
      }
  });

  socket.on("user:call", ({ to, offer ,room}) => {
    io.to(to).emit("incomming:call", { from: socket.id, offer });
    // Store initiator of the call for that room
    if (!roomInitiators.has(room)) {
      roomInitiators.set(room, socket.id);
    }
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

let candidateEmail = "anjalihai123@gmail.com"

// Generate PDF
async function createPDF(evaluations, finalDecision, candidateEmail) {
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontSize = 12;
  const margin = 50;
  const lineHeight = fontSize + 5;
  const pageWidth = 600; // Adjust as needed

  let page = pdfDoc.addPage([pageWidth, 800]); // Set page size
  let y = page.getHeight() - margin;

  function addText(text, x, y, maxWidth) {
    const words = text.split(" ");
    let line = "";
    for (let i = 0; i < words.length; i++) {
      const testLine = line + words[i] + " ";
      const textWidth = font.widthOfTextAtSize(testLine, fontSize);
      if (textWidth > maxWidth) {
        page.drawText(line, {
          x,
          y,
          size: fontSize,
          font,
          color: rgb(0, 0, 0),
        });
        y -= lineHeight;
        line = words[i] + " ";
      } else {
        line = testLine;
      }
    }
    if (line) {
      page.drawText(line, { x, y, size: fontSize, font, color: rgb(0, 0, 0) });
      y -= lineHeight;
    }
    return y;
  }

  // Add title
  y = addText("Candidate Evaluation Report", margin, y, pageWidth - 2 * margin);
  y -= 10;

  evaluations.forEach((evaluation, index) => {
    if (y < margin) {
      page = pdfDoc.addPage([pageWidth, 800]);
      y = page.getHeight() - margin;
    }

    y = addText(
      `Question ${index + 1}: ${evaluation.question}`,
      margin,
      y,
      pageWidth - 2 * margin
    );
    y = addText(
      `Answer: ${evaluation.answer}`,
      margin,
      y,
      pageWidth - 2 * margin
    );
    y = addText(
      `Score: ${evaluation.score}/10`,
      margin,
      y,
      pageWidth - 2 * margin
    );
    y = addText(
      `Areas of Improvement: ${evaluation.areas_of_improvement}`,
      margin,
      y,
      pageWidth - 2 * margin
    );
    y -= 10; // Extra spacing between questions
  });

  if (y < margin) {
    page = pdfDoc.addPage([pageWidth, 800]);
    y = page.getHeight() - margin;
  }

  // Add final decision
  y = addText(
    `Final Decision: ${finalDecision}`,
    margin,
    y,
    pageWidth - 2 * margin
  );

  // Save PDF
  const pdfBytes = await pdfDoc.save();
  const filePath = path.join(__dirname, `${candidateEmail}_evaluation.pdf`);
  fs.writeFileSync(filePath, pdfBytes);
  return filePath;
}
// Send email with PDF attachment
async function sendEmailWithPDF(email, pdfPath) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER, // Your email
      pass: process.env.EMAIL_PASSWORD, // Your email password
    },
    
  });
  console.log("Email User:", process.env.EMAIL_USER);
  console.log("Email Password:", process.env.EMAIL_PASSWORD);

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your Interview Evaluation",
    text: "Please find your interview evaluation attached.",
    attachments: [
      {
        filename: "evaluation.pdf",
        path: pdfPath,
      },
    ],
  };

  await transporter.sendMail(mailOptions);
}

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
  const { messages} = req.body;
  // let candidateEmail = "anjalihai123@gmail.com"
  // console.log(candidateEmail)

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
           Authorization: `Bearer ${process.env.OpenAI_API_KEY}`,
           "Content-Type": "application/json",
         },
         body: JSON.stringify({
           model: "meta-llama/llama-3.3-70b-instruct:free",
           messages: fullMessages,
         }),
       }
     );

     const result = await response.json();
     if (result.error) {
       return res.status(500).json({ error: result.error });
     }

     // Step 2: Extract AI response
     const aiContent = result.choices[0].message.content;

     // Step 3: Clean AI response (remove extra markdown)
     const cleanContent = aiContent
       .replace(/```json/g, "")
       .replace(/```/g, "")
       .trim();

     // Step 4: Parse response as JSON
     const content = JSON.parse(cleanContent);
     return res.json(content); // ✅ Only return JSON, no email sending
   } catch (error) {
     console.error("Error:", error);
     return res.status(500).json({ error: "Failed to evaluate candidate." });
   }
});

app.post("/send-report", async (req, res) => {
  const { candidateEmail, evaluations, final_decision } = req.body;

  try {
    if (!candidateEmail || !evaluations || !final_decision) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Step 1: Generate PDF
    const pdfPath = await createPDF(
      evaluations,
      final_decision,
      candidateEmail
    );

    // Step 2: Send email with the PDF
    await sendEmailWithPDF(candidateEmail, pdfPath);

    return res.json({ message: "Evaluation report sent successfully." });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: "Failed to send report." });
  }
});



// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
