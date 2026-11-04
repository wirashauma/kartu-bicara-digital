import http from "http";
import { Server } from "socket.io";
import app from "./app.js";
import { config } from "./config/index.js";
import { setupSessionSockets } from "./sockets/sessionSocket.js";

const server = http.createServer(app);

// Setup Socket.io
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

setupSessionSockets(io);

// Start listening
server.listen(config.port, () => {
  console.log("==================================================");
  console.log(`🚀 Kartu Bicara Digital Backend Server Running!`);
  console.log(`🌐 REST API:    http://localhost:${config.port}`);
  console.log(`⚡ WebSocket:   ws://localhost:${config.port} (Socket.io)`);
  console.log(`🏥 Health:      http://localhost:${config.port}/api/health`);
  console.log(`📚 Endpoints:   http://localhost:${config.port}/api/classes`);
  console.log("==================================================");
});

// Graceful Shutdown
process.on("SIGTERM", () => {
  console.log("Menerima sinyal SIGTERM, menutup server secara aman...");
  server.close(() => {
    console.log("Server ditutup.");
    process.exit(0);
  });
});

