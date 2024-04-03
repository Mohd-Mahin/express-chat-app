const { Server } = require("socket.io");
const express = require("express");
const { createServer } = require("http");
const path = require("path");
const { generateMessage, generateLocation } = require("./utils/message");

const app = express();
const server = createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;
const publicDirPath = path.join(__dirname, "..", "public");

app.use(express.static(publicDirPath));

io.on("connection", (socket) => {
  socket.on("join", ({ username, room }) => {
    socket.join(room);

    socket.emit("message", generateMessage("Welcome"));
    socket.broadcast
      .to(room)
      .emit("message", generateMessage(`${username} has joined!`));
  });

  socket.on("sendMessage", (eventData, callback) => {
    // if some error throw error with callback
    io.emit("message", generateMessage(eventData));
    callback();
  });

  socket.on("sendLocation", (latitude, longitude, callback) => {
    io.emit(
      "location",
      generateLocation(`https://google.com/maps?q=${latitude},${longitude}`)
    );
    callback();
  });

  socket.on("disconnect", () => {
    io.emit("message", generateMessage("A user has left!!!"));
  });
});

server.listen(PORT, () => console.log(`Server is up and running ${PORT} !!!`));

// comment
