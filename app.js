require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const http = require("http");
const socketIO = require("socket.io");
const path = require("path");
const authRoutes = require('./src/routes/auth.routes');
const userRoutes = require('./src/routes/user.routes');
const messageRoutes = require('./src/routes/message.routes');
const chatRoutes = require('./src/routes/chat.routes');
const cors = require('cors');
// console.log("🔍 Environment Variables Loaded:", process.env.PORT);

// const db = require('./src/models/index');
// console.log("📦 Sequelize Models:", Object.keys(db));

const socketHandler = require("./src/socket/index");
app.use(cors({
    origin: "http://localhost:3003", // React app URL
    credentials: true // allow cookies / auth headers
}));
app.use(express.json());
app.get('/', (req, res) => {
  res.send('Welcome to the Chat API Gateway v1');
});
const OpenAI = require("openai");

// const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
// app.post("/ask", async (req, res) => {
//   try {
//     const { message } = req.body;

//     if (!message) {
//       return res.status(400).json({ error: "Message is required" });
//     }

//     const response = await client.chat.completions.create({
//       model: "gpt-5.1",
//       messages: [{ role: "user", content: message }],
//     });

//     res.json({
//       success: true,
//       response: response.choices[0].message.content,
//     });

//   } catch (error) {
//     console.error("AI Error:", error.message);
//     res.status(500).json({ error: "Internal server error", details: error.message });
//   }
// });
// Serve uploaded files
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// app.use('/api/auth', authRoutes);
// app.use('/api/users', userRoutes);
// app.use('/api/messages', messageRoutes);
// app.use('/api/chats', chatRoutes);
// DB Connection
// db.sequelize.authenticate()
//   .then(() => console.log('✅ MySQL connected'))
//   .catch(err => {
//     console.error('❌ DB connection failed:', err);
//     process.exit(1); // Stop app if DB fails
//   });

// // Sync models
// db.sequelize.sync({ alter: false })
//   .then(() => console.log("✅ Models synced"))
//   .catch(err => console.error("❌ Model sync failed:", err));

// Create HTTP server & Socket.IO
// const server = http.createServer(app);
// const io = socketIO(server, { cors: { origin: "*" } });

// // Socket.IO events
// socketHandler(io);
// 552796
// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 API Gateway running on port ${PORT}`);
});
