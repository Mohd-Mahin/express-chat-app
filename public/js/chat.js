const socket = io();

const $messageForm = document.querySelector("#message-form");

$messageForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const inputValue = e.target.elements["chat-box"].value;
  socket.emit("emitMessage", inputValue);
});

socket.on("message", (wlcmMsg) => {
  console.log(wlcmMsg);
});
