const { Server } = require("socket.io");
const express = require("express");
const { createServer } = require("http");
const path = require("path");

const app = express();
const server = createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;
const publicDirPath = path.join(__dirname, "..", "public");

app.use(express.static(publicDirPath));

io.on("connection", (socket) => {
  socket.emit("message", "Welcome to the Chat App");

  socket.on("emitMessage", (eventData) => {
    io.emit("message", eventData);
  });
});

server.listen(PORT, () => console.log(`Server is up and running ${PORT} !!!`));
