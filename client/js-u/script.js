import config from "./config.js";

const inputs = [...document.querySelectorAll(".fancyInput")];
const data = {
  name: "",
  password: "",
};
const user = {};

const attachListeners = (i) => {
  const input = i.querySelector("input");

  input.addEventListener("focus", (e) => {
    handleInputEnter(e.target.closest(".fancyInput"));
  });

  input.addEventListener("blur", (e) => {
    handleInputLeave(e.target.closest(".fancyInput"));
  });

  input.addEventListener("input", (e) => {
    handleInputChange(e.target.closest(".fancyInput"));
  });
};

inputs.forEach((i) => {
  attachListeners(i);
});

const handleInputEnter = (i) => {
  const placeholder = i.querySelector("#placeholder");
  const input = i.querySelector("input");

  if (!i.dataset.error) {
    input.style.borderColor = "#97acdf";
    placeholder.style.color = "#97acdf";
  }

  placeholder.style.fontSize = "0.8rem";
  placeholder.style.top = "0";
  placeholder.style.width = "auto";
};

const handleInputLeave = (i) => {
  const placeholder = i.querySelector("#placeholder");
  const input = i.querySelector("input");

  if (!i.dataset.error) {
    placeholder.style.color = "#a4a4a4";
    input.style.borderColor = "#b9b9b9";
  }

  if (!i.querySelector("input").value) {
    placeholder.style.fontSize = "1rem";
    placeholder.style.top = "50%";
  }
};

const handleInputError = (field, message) => {
  const i = inputs.find((i) => {
    return i.dataset.field === field;
  });
  if (!i) return;
  i.dataset.error = 1;

  const placeholder = i.querySelector("#placeholder");
  const input = i.querySelector("input");
  placeholder.style.color = "#ef5f5f";
  input.style.borderColor = "#ef5f5f";
  input.style.borderRadius = "2px 2px 0 0";
  const errorArea = i.querySelector(".errorArea");
  errorArea.querySelector("h6").innerText = message;
  errorArea.classList.remove("hidden");
};

const handleInputChange = (i) => {
  const placeholder = i.querySelector("#placeholder");
  const input = i.querySelector("input");
  const errorArea = i.querySelector(".errorArea");

  data[i.dataset.field] = input.value;

  if (input === document.activeElement) {
    input.style.borderColor = "#97acdf";
    placeholder.style.color = "#97acdf";
  } else {
    placeholder.style.color = "#a4a4a4";
    input.style.borderColor = "#b9b9b9";
  }
  input.style.borderRadius = "2px";
  errorArea.classList.add("hidden");
  errorArea.querySelector("h6").innerText = "";
  delete i.dataset?.error;
};

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const sessionId = urlParams.get("sessionId");

const ws = new WebSocket(config.wsUrl);

ws.addEventListener("message", (e) => {
  const message = JSON.parse(e.data);
  if (message.type === "userAuthorized") {
    const authSuc = document.querySelector(".authorizeSuccess");
    authSuc.classList.add("active");
    authSuc.innerText =
      "Station authorized successfully. Closing tab in 2 seconds.";
    setTimeout(() => {
      window.close();
    }, 2 * 1000);
    return;
  }
  if (message.type === "error") {
    const errDiv = document.querySelector(".authorizeError");
    errDiv.classList.add("active");
    errDiv.innerText = message.message;
    return;
  }
  if (message.type === "redirectUser") {
    return window.open(message.target, "_blank");
  }
});

ws.addEventListener("open", () => {
  console.log("Connection to server open");
});

const resetStatus = () => {
  document.querySelector(".authorizeError").classList.remove("active");
  document.querySelector(".authorizeSuccess").classList.remove("active");
};

let loggedIn = true;

const handleLogin = () => {
  resetStatus();
  loggedIn = true;

  // temporary
  if (data.name) {
    user.name = data.name;
  } else {
    user.name = "Anonymous";
  }
  saveUser(user);

  switchPages();
};

const handleSwitchAccount = () => {
  resetStatus();
  loggedIn = false;
  switchPages();
};

const switchPages = () => {
  resetStatus();
  document.querySelector(".container").style.transform = `translateX(${
    loggedIn ? "-100%" : "0"
  })`;
  document.getElementById("usernameDisplay").innerText = user.name;
  document.querySelector(".authorizeError").innerText = "";
  document.querySelector(".authorizeSuccess").innerText = "";
};

const handleAuthorize = () => {
  resetStatus();
  if (!sessionId) return;
  ws.send(JSON.stringify({ type: "authorizeStation", sessionId, user }));
};

const loginButton = document.getElementById("loginButton");
loginButton.addEventListener("click", handleLogin);

const switchAccountButton = document.getElementById("switchAccountButton");
switchAccountButton.addEventListener("click", handleSwitchAccount);

const authorizeButton = document.querySelector("#authorizeStation");
authorizeButton.addEventListener("click", handleAuthorize);

const loadUser = () => {
  return JSON.parse(window.localStorage.getItem("user"));
};

const saveUser = (data) => {
  window.localStorage.setItem("user", JSON.stringify(data));
};

const loaded = loadUser();
if (loaded.name) {
  loggedIn = true;
  user.name = loaded.name;
  switchPages();
}
