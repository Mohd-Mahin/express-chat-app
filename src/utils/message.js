const generateMessage = (text) => {
  return {
    message: text,
    createdAt: new Date().getTime(),
    // createdAt: moment().format("h:mm a"),
  };
};

const generateLocation = (location) => {
  return {
    location,
    createdAt: new Date().getTime(),
  };
};

module.exports = {
  generateMessage,
  generateLocation,
};
