const generateMessage = (text, name) => {
  return {
    message: text,
    ...(name && { name: name.charAt(0).toUpperCase() + name.slice(1) }),
    createdAt: new Date().getTime(),
  };
};

const generateLocation = (location, name) => {
  return {
    location,
    name: name.charAt(0).toUpperCase() + name.slice(1),
    createdAt: new Date().getTime(),
  };
};

module.exports = {
  generateMessage,
  generateLocation,
};
