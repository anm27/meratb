const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const travelRoutes = require("./routes/travelDetails");
const chatRoutes = require("./routes/chat");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const TravelDetails = require("./models/TravelDetails");

const JWT_SECRET = "Nitrobaba@272#$%&";

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

connectDB();

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use("/auth", authRoutes);
app.use("/travel", travelRoutes);
app.use("/chat", chatRoutes);

io.on("connection", (socket) => {
  console.log("New client connected", socket.id);

  // Join the socket room with user ID
  socket.on("join", (token) => {
    if (token) {
      jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
          console.log("Token verification failed", err);
          return;
        }
        const userId = decoded.id;
        console.log(`User ${userId} connected with socket ID ${socket.id}`);
        socket.join(userId);
      });
    } else {
      console.log("No token provided");
    }
  });

  socket.on("sendTravelRequest", (data) => {
    const { recipientId, senderId, pickupLocation, dropLocation } = data;
    console.log(`Received travel request from ${senderId} to ${recipientId}`);
    io.to(recipientId).emit("receiveTravelRequest", {
      senderId,
      pickupLocation,
      dropLocation,
    });
  });

  socket.on("acceptTravelRequest", async (data) => {
    const { recipientId, senderId } = data;

    try {
      await TravelDetails.updateMany(
        { userId: { $in: [recipientId, senderId] } },
        {
          matchedAt: new Date(),
          expireAt: new Date(Date.now() + 2 * 60 * 60 * 1000),
        } // Set expireAt to 2 hours from now
      );

      console.log(`Travel request from ${senderId} accepted by ${recipientId}`);
      console.log(
        `Emitting requestAccepted event to ${recipientId} and ${senderId}`
      );
      io.to(recipientId).emit("requestAccepted", { senderId, recipientId });
      io.to(senderId).emit("requestAccepted", { senderId, recipientId });
    } catch (err) {
      console.error("Error updating matched travel details:", err);
    }
  });

  socket.on("sendMessage", (data) => {
    const { recipientId, message, token } = data;
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        console.log("Token verification failed", err);
        socket.emit("errorMessage", "Invalid token");
        return;
      }
      const senderId = decoded.id;
      console.log(`Message from ${senderId} to ${recipientId}: ${message}`);
      io.to(recipientId).emit("receiveMessage", {
        text: message,
        sender: senderId,
      });
      io.to(senderId).emit("receiveMessage", {
        text: message,
        sender: senderId,
      });
      console.log(
        `Emitted receiveMessage event to ${recipientId} with text: ${message} and sender: ${senderId}`
      );
    });
  });

  socket.on("typing", ({ recipientId, senderId, isTyping }) => {
    io.to(recipientId).emit("typing", { senderId, isTyping });
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected", socket.id);
  });
});

// Function and interval to delete expired matched travel details
const deleteExpiredMatchedTravelDetails = async () => {
  const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
  try {
    await TravelDetails.deleteMany({ matchedAt: { $lte: twoHoursAgo } });
    console.log("Deleted travel details matched over 2 hours ago");
  } catch (err) {
    console.error("Error deleting expired matched travel details:", err);
  }
};

setInterval(deleteExpiredMatchedTravelDetails, 3600000); // Run every hour

server.listen(4000, () => console.log("Server is running on port 4000"));
