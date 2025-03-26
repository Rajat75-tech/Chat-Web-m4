let chatSessions = [];
window.addEventListener("DOMContentLoaded", () => {
  fetch("./data.json")
    .then((response) => response.json())
    .then((data) => {
      chatSessions = data.chatSessions;
      renderSessionList();
    })
    .catch((error) => {
      console.error("Error fetching chat data:", error);
    });
});

function renderSessionList() {
  const sessionList = document.getElementById("sessionList");
  sessionList.innerHTML = "";

  chatSessions.forEach((session) => {
    const item = document.createElement("div");
    item.className = "session-item";
    item.dataset.id = session.id;

    item.innerHTML = `
      <img src="${session.avatar}" alt="${session.name}" />
      <div>
        <div class="session-name">${session.name}</div>
        <div class="session-last-msg">${session.lastMessage}</div>
      </div>
    `;

    item.addEventListener("click", () => loadChatDetails(session.id));
    sessionList.appendChild(item);
  });
}

function loadChatDetails(sessionId) {
  const session = chatSessions.find((s) => s.id === sessionId);
  const chatHeaderUser = document.getElementById("chatHeaderUser");
  const chatAvatar = document.getElementById("chatAvatar");
  const statusDot = document.getElementById("statusDot");
  const chatTitle = document.getElementById("chatTitle");
  const chatSubtitle = document.getElementById("chatSubtitle");

  if (!session) {
    chatHeaderUser.classList.add("hidden");
    return;
  }

  chatHeaderUser.classList.remove("hidden");

  chatAvatar.src = session.avatar;
  chatTitle.textContent = session.name;
  chatSubtitle.textContent = session.role;

  statusDot.classList.remove("online", "offline", "busy");

  if (session.status === "online") {
    statusDot.classList.add("online");
  } else if (session.status === "offline") {
    statusDot.classList.add("offline");
  } else if (session.status === "busy") {
    statusDot.classList.add("busy");
  }

  const chatContent = document.getElementById("chatContent");
  chatContent.innerHTML = "";

  session.messages.forEach((msg) => {
    const bubble = document.createElement("div");
    bubble.classList.add("message-bubble", msg.type);

    if (msg.type === "from-other") {
      const senderElem = document.createElement("div");
      senderElem.className = "message-sender";
      senderElem.textContent = msg.sender;
      bubble.appendChild(senderElem);
    }

    const textElem = document.createElement("div");
    textElem.textContent = msg.text;
    bubble.appendChild(textElem);

    if (msg.time) {
      const timeElem = document.createElement("div");
      timeElem.className = "message-time";
      timeElem.textContent = msg.time;
      bubble.appendChild(timeElem);
    }

    if (msg.image) {
      const imgElem = document.createElement("img");
      imgElem.src = msg.image;
      imgElem.alt = "Attached Image";
      imgElem.style.display = "block";
      imgElem.style.marginTop = "0.5rem";
      imgElem.style.maxWidth = "250px";
      bubble.appendChild(imgElem);
    }

    chatContent.appendChild(bubble);
  });
  if (window.innerWidth <= 768) {
    const sidebar = document.querySelector(".sidebar");
    sidebar.classList.add("hidden");
  }
}
function backToChatList() {
  const sidebar = document.querySelector(".sidebar");
  sidebar.classList.remove("hidden");
}
function closeChat() {
  const chatHeaderUser = document.getElementById("chatHeaderUser");
  chatHeaderUser.classList.add("hidden");

  const chatContent = document.getElementById("chatContent");
  chatContent.innerHTML =
    "<div class='placeholder-text'>Select a chat session from the left to view messages.</div>";
}

function toggleMenu() {
  const menuDropdown = document.getElementById("menuDropdown");
  menuDropdown.classList.toggle("hidden");
}

function searchUser(event) {
  const searchTerm = event.target.value.toLowerCase();
  const sessionList = document.getElementById("sessionList");
  const items = sessionList.querySelectorAll(".session-item");

  items.forEach((item) => {
    const nameElem = item.querySelector(".session-name");
    if (nameElem && nameElem.textContent.toLowerCase().includes(searchTerm)) {
      item.style.display = "flex";
    } else {
      item.style.display = "none";
    }
  });
}

const allThemes = [
  "theme-dark",
  "theme-teal",
  "theme-pink",
  "theme-purple",
  "theme-orange",
  "theme-green",
  "theme-blue",
  "theme-red",
  "theme-black",
];

function changeTheme(event) {
  const selectedTheme = event.target.value;
  const body = document.body;

  allThemes.forEach((themeClass) => {
    body.classList.remove(themeClass);
  });

  if (selectedTheme === "" || selectedTheme === "default") {
    return;
  }

  body.classList.add(`theme-${selectedTheme}`);
}

function changeBackground(event) {
  const bgValue = event.target.value;
  const chatArea = document.querySelector(".chat-area");

  chatArea.style.backgroundImage = "none";

  switch (bgValue) {
    case "bg1":
      chatArea.style.backgroundImage = "url('./Images/bg1.jpg')";
      chatArea.style.backgroundSize = "cover";
      break;
    case "bg2":
      chatArea.style.backgroundImage = "url('./Images/bg4.jpg')";
      chatArea.style.backgroundSize = "cover";
      break;
    case "bg3":
      chatArea.style.backgroundImage = "url('./Images/bg3.jpg')";
      chatArea.style.backgroundSize = "contain";
      break;
    case "bg4":
      chatArea.style.backgroundImage = "url('./Images/bg6.jpg')";
      chatArea.style.backgroundSize = "contain";
      break;
    case "bg5":
      chatArea.style.backgroundImage = "url('./Images/bg7.jpg')";
      chatArea.style.backgroundSize = "contain";
      break;
    case "bg6":
      chatArea.style.backgroundImage = "url('./Images/bg9.jpg')";
      chatArea.style.backgroundSize = "contain";
      break;
    default:
      break;
  }
}

function updateCharCount(inputElem) {
  const text = inputElem.value;
  const charCount = text.length;
  const wordCount = text
    .trim()
    .split(/\s+/)
    .filter((w) => w).length;

  const charCounter = document.getElementById("charCounter");
  charCounter.textContent = `Current characters: ${charCount} | Current words: ${wordCount}`;
}

function formatTime(date) {
  let hours = date.getHours();
  let minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  if (hours === 0) hours = 12;
  minutes = minutes < 10 ? "0" + minutes : minutes;
  return `${hours}:${minutes} ${ampm}`;
}

function sendMessage() {
  const input = document.getElementById("messageInput");
  const text = input.value.trim();
  if (!text) return;

  const now = new Date();
  const timestamp = formatTime(now);

  const chatTitle = document.getElementById("chatTitle").textContent;
  const session = chatSessions.find((s) => s.name === chatTitle);
  if (!session) return;

  session.messages.push({
    sender: "You",
    text,
    type: "from-user",
    time: timestamp,
  });

  loadChatDetails(session.id);

  input.value = "";
  updateCharCount(input);
}
