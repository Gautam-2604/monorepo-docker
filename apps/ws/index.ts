import { WebSocketServer } from "ws";
import { prismaClient } from "db/client";
import http from "http";

// Create a basic HTTP server (needed to handle upgrade requests for ws)
const server = http.createServer((req: any, res: { writeHead: (arg0: number) => void; end: (arg0: string) => void; }) => {
  res.writeHead(200);
  res.end("WebSocket server running");
});

// Attach WebSocket server
const wss = new WebSocketServer({ server });

// Handle connections
wss.on("connection", (ws:any) => {
  console.log("Client connected");

  ws.on("message", async (message: String) => {
    try {
      // Create a user in DB
      await prismaClient.user.create({
        data: {
          username: Math.random().toString(),
          password: Math.random().toString(),
        },
      });

      // Echo back message
      ws.send(message.toString());
    } catch (err) {
      console.error("DB error:", err);
      ws.send("Error saving user");
    }
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });
});

// Start listening
const PORT = 8081;
server.listen(PORT, () => {
  console.log(`WebSocket server running on ws://localhost:${PORT}`);
});
