const socket = io();

// elements
const $messageForm = document.querySelector("#message-form");
const $messageFormInput = $messageForm.querySelector("input");
const $messageFormButton = $messageForm.querySelector("button");
const $sendLocationBtn = document.querySelector("#send-location");
const $messages = document.querySelector("#messages");

// templates
const $messageTemplate = document.querySelector("#message-template").innerHTML;
const $locationTemplate =
  document.querySelector("#location-template").innerHTML;

// Options
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

$messageForm.addEventListener("submit", (e) => {
  e.preventDefault();
  $messageFormButton.setAttribute("disabled", true);
  const inputValue = e.target.elements["chat-box"].value;
  socket.emit("sendMessage", inputValue, (error) => {
    if (error) console.log(error);
    else console.log("Message was delivered...");

    $messageFormButton.removeAttribute("disabled");
    $messageFormInput.value = "";
    $messageFormInput.focus();
  });
});

$sendLocationBtn.addEventListener("click", function () {
  if (!navigator.geolocation)
    return alert("Geolocation is not supported by your browser.");

  this.setAttribute("disabled", true);
  navigator.geolocation.getCurrentPosition((position) => {
    const { latitude, longitude } = position.coords || {};
    socket.emit("sendLocation", latitude, longitude, (error) => {
      if (error) console.log(error);
      else console.log("Delivered!!!");

      this.removeAttribute("disabled");
    });
  });
});

socket.on("message", (message) => {
  const html = Mustache.render($messageTemplate, {
    ...message,
    createdAt: moment(message.createdAt).format("h:mm a"),
  });
  $messages.insertAdjacentHTML("beforeend", html);
});

socket.on("location", (location) => {
  const html = Mustache.render($locationTemplate, {
    ...location,
    createdAt: moment(location.createdAt).format("h:mm a"),
  });
  $messages.insertAdjacentHTML("beforeend", html);
});

socket.emit("join", { username, room });
