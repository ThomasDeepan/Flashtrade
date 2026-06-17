# ⚡ FlashTrade — High-Throughput Mock Trading Engine

A full-stack trading platform simulating real brokerage infrastructure:
live price streaming via WebSockets, async order processing with Redis-backed
queues, and MongoDB aggregation pipelines for portfolio analytics.

## 🎯 Why this project

Most CRUD projects don't demonstrate how real fintech systems handle:

- Real-time data at scale (WebSockets vs polling)
- Concurrent write conflicts (distributed locks)
- Burst traffic (async job queues)
- Complex financial calculations (aggregation pipelines)

This project builds all four from scratch.

## 🏗️ Architecture

React (Zustand) ←─ WebSocket ─── Socket.io Server

│

    Express API

         │

┌────────┴────────┐

Redis Lock BullMQ Queue

(idempotency) (order worker)

│

MongoDB

## ✨ Features

- [x] Live price ticks every 500ms via Socket.io rooms (per-symbol subscriptions)
- [x] Zustand store with per-row selectors — only changed prices re-render
- [x] Order placement API with balance validation
- [ ] Redis distributed lock to prevent duplicate order submission
- [ ] BullMQ async order processing queue
- [ ] MongoDB aggregation pipeline for Realized/Unrealized P&L

## 🛠️ Tech Stack

**Backend:** Node.js, Express, Socket.io, MongoDB (Mongoose), Redis, BullMQ
**Frontend:** React, Zustand, Socket.io-client

## 🚀 Running Locally

### Prerequisites

- Node.js, MongoDB, Redis running locally

### Backend

\`\`\`bash
cd backend
npm install
cp .env.example .env
npm run dev
\`\`\`

### Frontend

\`\`\`bash
cd frontend
npm install
npm run dev
\`\`\`

## 📌 Key Design Decisions

### Why Socket.io rooms instead of broadcasting to everyone?

Each client subscribes only to symbols in their watchlist. At scale,
this keeps bandwidth proportional to a user's portfolio size, not the
entire market.

### Why Zustand over Context/useState?

Lifting price state to a parent causes the entire watchlist to re-render
on every tick. Zustand selectors let each row subscribe independently —
only the changed row re-renders.
