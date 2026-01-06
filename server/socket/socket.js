import http from "http";
import express from "express";
import { Server } from "socket.io";

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST"],
  },
});

export const getReceiverSocketId = (receiverId) => {
  return userSocketMap[receiverId];
};
const userSocketMap = {};

io.on("connection", (socket) => {
  console.log("New socket connection attempt:", socket.id);
  const userId = socket.handshake.query.userId;
  console.log("Socket Handshake userId:", userId);

  if (userId != "undefined" && userId) {
    userSocketMap[userId] = socket.id;
    console.log(`Mapped User ${userId} to Socket ${socket.id}`);
  } else {
    console.log("User ID invalid or undefined during handshake");
  }

  //io.emit() is used to send events to all the connected clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  //socket.on() is used to listen to the events. can be used both client and server side
  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export const sendNotification = (receiverId, data) => {
  const receiverSocketId = getReceiverSocketId(receiverId);
  console.log(`Attempting to send notification to User ${receiverId}. Socket ID: ${receiverSocketId}`);
  if (receiverSocketId) {
    io.to(receiverSocketId).emit("newNotification", data);
    console.log("Notification emitted to socket:", receiverSocketId);
  } else {
    console.log(`User ${receiverId} is not online (no socket ID found).`);
  }
};

export const broadcastNotification = (data) => {
  io.emit("newNotification", data);
};

export { app, io, server };
