import { Server } from "socket.io";
import { saveMessage } from "../controllers/chatController.js";
import Call from "../models/call.js";

const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  // Store active users and their socket connections
  const activeUsers = new Map();
  // Store active calls
  const activeCalls = new Map();

  io.on("connection", (socket) => {
    // Handle user connection
    socket.on("user_connected", (userId) => {
      activeUsers.set(userId, socket.id);
      io.emit("user_status", { userId, status: "online" });
    });

    // Handle joining job-specific chat room
    socket.on("join_job_chat", (jobId) => {
      socket.join(`job_${jobId}`);
    });

    // Handle new message
    socket.on("send_message", async (messageData) => {
      try {
        const savedMessage = await saveMessage(messageData);
        io.to(`job_${messageData.jobId}`).emit("receive_message", savedMessage);
      } catch (error) {
        socket.emit("error", error.message);
      }
    });

    // Handle typing status
    socket.on("typing", ({ jobId, userId }) => {
      socket.to(`job_${jobId}`).emit("user_typing", { userId });
    });

    // Handle WebRTC signaling
    socket.on("call:initiate", async ({ receiverId, callId, callType }) => {
      const receiverSocketId = activeUsers.get(receiverId);
      if (receiverSocketId) {
        activeCalls.set(callId, { caller: socket.id, receiver: receiverSocketId });
        socket.to(receiverSocketId).emit("call:incoming", { callId, callType });
      }
    });

    socket.on("call:accept", ({ callId }) => {
      const call = activeCalls.get(callId);
      if (call) {
        io.to(call.caller).emit("call:accepted", { callId });
      }
    });

    socket.on("call:reject", ({ callId }) => {
      const call = activeCalls.get(callId);
      if (call) {
        io.to(call.caller).emit("call:rejected", { callId });
        activeCalls.delete(callId);
      }
    });

    socket.on("call:offer", ({ callId, offer }) => {
      const call = activeCalls.get(callId);
      if (call) {
        socket.to(call.receiver).emit("call:offer", { callId, offer });
      }
    });

    socket.on("call:answer", ({ callId, answer }) => {
      const call = activeCalls.get(callId);
      if (call) {
        socket.to(call.caller).emit("call:answer", { callId, answer });
      }
    });

    socket.on("call:ice-candidate", ({ callId, candidate }) => {
      const call = activeCalls.get(callId);
      if (call) {
        const targetId = socket.id === call.caller ? call.receiver : call.caller;
        socket.to(targetId).emit("call:ice-candidate", { callId, candidate });
      }
    });

    socket.on("call:end", ({ callId }) => {
      const call = activeCalls.get(callId);
      if (call) {
        const targetId = socket.id === call.caller ? call.receiver : call.caller;
        socket.to(targetId).emit("call:ended", { callId });
        activeCalls.delete(callId);
      }
    });

    // Handle user disconnection
    socket.on("disconnect", () => {
      let disconnectedUserId;
      for (const [userId, socketId] of activeUsers.entries()) {
        if (socketId === socket.id) {
          disconnectedUserId = userId;
          break;
        }
      }
      if (disconnectedUserId) {
        activeUsers.delete(disconnectedUserId);
        io.emit("user_status", { userId: disconnectedUserId, status: "offline" });
      }
    });
  });

  return io;
};

export default initializeSocket;