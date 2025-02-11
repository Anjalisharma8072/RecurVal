



const prompt = `
You are an AI interviewer assistant evaluating a candidate's responses.
- Structure the response as an array where each object contains:
  1. "question" - The interviewer's question.
  2. "answer" - The candidate's refined response (fix repetition, grammar).
  3. "score" - A score out of 10 based on clarity, correctness, and depth.
  4. "areas_of_improvement" - If necessary, provide concise improvements.
- Provide a final hiring decision ("Hire" / "Not Hire").
Return the response in JSON format.
`;

const messages = [
  { role: "system", content: prompt },
  {
    role: "user",
    content:
      "admin@gmail.com: Hello, welcome to the interview! Can you introduce yourself?",
  },
  {
    role: "user",
    content:
      "candidate123@gmail.com: Hello sir, I am John Doe, a Computer Science student at XYZ University. I have experience with Node.js, Express, and MongoDB. I built a REST API for a project where users could register, log in, and perform CRUD operations.",
  },
  {
    role: "user",
    content:
      "admin@gmail.com: Can you explain how authentication works in a backend system?",
  },
  {
    role: "user",
    content:
      "candidate123@gmail.com: Authentication uses JWT. When a user logs in, the server generates a token, sent to the client, which includes it in headers for protected routes. The server verifies it before granting access.",
  },
  {
    role: "user",
    content:
      "admin@gmail.com: How would you handle rate-limiting in an API to prevent abuse?",
  },
  {
    role: "user",
    content:
      "candidate123@gmail.com: I would use express-rate-limit middleware in Node.js and Redis for high-performance rate-limiting.",
  },
];
console.log(messages)
async function evaluateCandidate() {
  try {
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${"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"}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "meta-llama/llama-3.3-70b-instruct:free",
          messages: messages,
        }),
      }
    );

    const result = await response.json();
    console.log("AI Response:", JSON.stringify(result, null, 2)); // Pretty print JSON response
  } catch (error) {
    console.error("Error:", error);
  }
}

evaluateCandidate();
