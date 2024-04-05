const users = [];

// addUser, removeUser, getUser, getUsersInRoom

const addUser = ({ id, username, room }) => {
  username = username.toLowerCase().trim();
  room = room.toLowerCase().trim();

  if (!username || !room)
    return {
      error: "Username and Room is required",
    };

  // check duplicate user
  const existingUser = users.find(
    (user) => user.room === room && user.username === username
  );

  if (existingUser)
    return {
      error: "Usernme in use",
    };

  const user = {
    id,
    username,
    room,
  };

  users.push(user);
  return { user };
};

const removeUser = (id) => {
  const userIndex = users.findIndex((user) => user.id === id);
  if (userIndex != -1) {
    return users.splice(userIndex, 1)[0];
  }
};

const getUser = (id) => {
  const user = users.find((user) => user.id === id);

  if (!user) return undefined;
  return user;
};

const getUsersInRoom = (room) => {
  room = room.trim().toLowerCase();
  const userList = users.filter((user) => user.room === room);
  if (!userList) return [];
  return userList;
};

module.exports = {
  getUser,
  getUsersInRoom,
  removeUser,
  addUser,
};
