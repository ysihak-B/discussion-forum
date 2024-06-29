import express from "express";
import connectDB from "./connect.js";
import authRoutes from "./routers/auth.routes.js"
import questionRoutes from "./routers/question.routes.js"
import userRoutes from "./routers/user.routes.js"
import cors from "cors";
import { Server } from "socket.io";

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use("/", authRoutes)
app.use("/", questionRoutes)
app.use("/", userRoutes)

app.get("/", (req, res) => {
  res.send("Hello World");
});

const server = app.listen(PORT, () => {
  connectDB();
  console.log(`Server running on port ${PORT}`);
});

const io = new Server(server, {
  secure: true,
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("socket connected");
  const users = [];

  for (let [id, socket] of io.of("/").sockets) {
    if (socket.handshake.auth._id)
      users.push({
        ...socket.handshake.auth,
        socketId: socket.handshake.auth._id,
      });
  }

  console.log("users", users);
  io.emit("user-connected", users);

  socket.on("join-room", ({ room, user }) => {
    users[user._id] = user;
    socket.join(room);
    socket.broadcast.to(room).emit("user-connected", users);
  });

  socket.on("send-message", ({ message, room, user }) => {
    console.log("message", message, room, user);
    io.to(room).emit("receive-message", { message, user, room });
  });

  socket.on("disconnect", () => {
    console.log("disconnected");
    const delUser = users.filter(
      (user) => user.socketId !== socket.handshake.auth._id
    );
    console.log("disconnected users", delUser);
    io.emit("user-disconnected", delUser);
  });
});

export default app;
