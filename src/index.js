const { Server } = require("socket.io");
const express = require("express");
const { createServer } = require("http");
const path = require("path");
const { generateMessage, generateLocation } = require("./utils/message");
const {
  getUser,
  getUsersInRoom,
  removeUser,
  addUser,
} = require("./utils/user");

const app = express();
const server = createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;
const publicDirPath = path.join(__dirname, "..", "public");

app.use(express.static(publicDirPath));

io.on("connection", (socket) => {
  socket.on("join", ({ username, room }, callback) => {
    const { error, user } = addUser({ id: socket.id, username, room });

    if (error) {
      return callback(error);
    }

    socket.join(user.room);
    socket.emit("message", generateMessage("Welcome", "Admin"));
    socket.broadcast
      .to(user.room)
      .emit("message", generateMessage(`${user.username} has joined!`));

    io.to(user.room).emit("chatData", {
      users: getUsersInRoom(user.room),
      room: user.room,
    });

    callback();
  });

  socket.on("sendMessage", (eventData, callback) => {
    const user = getUser(socket.id);

    if (user) {
      // if some error throw error with callback
      io.to(user.room).emit(
        "message",
        generateMessage(eventData, user.username)
      );
      callback();
    }
  });

  socket.on("sendLocation", (latitude, longitude, callback) => {
    const user = getUser(socket.id);
    if (user) {
      io.to(user.room).emit(
        "location",
        generateLocation(
          `https://google.com/maps?q=${latitude},${longitude}`,
          user.username
        )
      );
      callback();
    }
  });

  socket.on("disconnect", () => {
    const user = removeUser(socket.id);

    if (user) {
      io.to(user.room).emit(
        "message",
        generateMessage(`${user.username} has left.`)
      );
      io.to(user.room).emit("chatData", {
        users: getUsersInRoom(user.room),
        room: user.room,
      });
    }
  });
});

server.listen(PORT, () => console.log(`Server is up and running ${PORT} !!!`));

// comment
