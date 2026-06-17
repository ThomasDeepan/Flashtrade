import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import { Portfolio } from "./models/Portfolio.js";
import { startPriceEmitter } from "./sockets/priceEmitter.js";
import "dotenv/config";

const app = express();
app.use(express.json());

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    // origin: ["http://localhost:5173", "null", null],
    origin: "*",
    methods: ["GET", "POST"],
  },
});

//---Mongodb connection

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ Error connecting to MongoDB:", error.message);
    process.exit(1);
  }
}

async function start() {
  await connectDB();
  startPriceEmitter(io); // ← add this line
  httpServer.listen(process.env.PORT, () => {
    console.log(`🚀 Server running on http://localhost:${process.env.PORT}`);
  });
}

// ── Socket.io ───────────────────────────────────────────
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  // Client sends ['AAPL', 'TSLA'] → we add them to those rooms
  socket.on("subscribe", (symbols) => {
    symbols.forEach((symbol) => {
      socket.join(`tick:${symbol}`);
      console.log(`${socket.id} subscribed to ${symbol}`);
    });
  });

  // Client leaves a room when they remove a stock from watchlist
  socket.on("unsubscribe", (symbols) => {
    symbols.forEach((symbol) => {
      socket.leave(`tick:${symbol}`);
    });
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// ── Test route ──────────────────────────────────────────
app.get("/api/health", (req, res) => {
  res.json({
    status: "running",
    db: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  });
});

// // Temporary test route — we'll delete this later
app.get("/api/seed", async (req, res) => {
  const testUser = await Portfolio.findOneAndUpdate(
    { userId: "testuser1" },
    { userId: "testuser1", cashBalance: 100000 },
    { upsert: true, new: true }, // create if doesn't exist
  );
  res.json(testUser);
});

// ── Start everything ────────────────────────────────────
// async function start() {
//   await connectDB();
//   httpServer.listen(process.env.PORT, () => {
//     console.log(`🚀 Server running on http://localhost:${process.env.PORT}`);
//   });
// }

start();
