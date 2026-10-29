const form = document.getElementById("chatForm");
const input = document.getElementById("messageInput");
const messagesBox = document.getElementById("chatMessages");
const send = document.getElementById("sendButton");
const clear = document.getElementById("clearChat");
const typing = document.getElementById("typingIndicator");

const STORAGE_KEY = "level2_chat_history";

let conversation = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");

function getCookie(name) {
  for (const cookie of document.cookie.split(";")) {
    const trimmed = cookie.trim();
    if (trimmed.startsWith(name + "=")) {
      return decodeURIComponent(trimmed.slice(name.length + 1));
    }
  }
  return null;
}

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(conversation));
}

function addMessage(role, content) {
  const isUser = role === "user";

  const row = document.createElement("div");
  row.className = "message-row " + (isUser ? "user-row" : "bot-row");

  const box = document.createElement("div");
  box.className = "message " + (isUser ? "user-message" : "bot-message");

  const text = document.createElement("p");
  text.textContent = content;

  box.appendChild(text);
  row.appendChild(box);
  messagesBox.appendChild(row);
  messagesBox.scrollTop = messagesBox.scrollHeight;
}

function render() {
  messagesBox.innerHTML = "";

  if (!conversation.length) {
    addMessage("assistant", "Hello! 👋 I’m your AI assistant. Ask me anything.");
    return;
  }

  conversation.forEach((message) => addMessage(message.role, message.content));
}

function setLoading(isLoading) {
  send.disabled = isLoading;
  input.disabled = isLoading;
  typing.classList.toggle("hidden", !isLoading);
}

function resizeInput() {
  input.style.height = "auto";
  input.style.height = Math.min(input.scrollHeight, 140) + "px";
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const content = input.value.trim();
  if (!content || send.disabled) return;

  conversation.push({ role: "user", content });
  addMessage("user", content);
  save();

  input.value = "";
  resizeInput();
  setLoading(true);

  try {
    const response = await fetch("/api/chat/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": getCookie("csrftoken"),
      },
      body: JSON.stringify({ messages: conversation }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "Something went wrong.");
    }

    conversation.push({ role: "assistant", content: data.reply });
    addMessage("assistant", data.reply);
    save();
  } catch (error) {
    addMessage("assistant", "Sorry, I could not complete that request.\n\n" + error.message);
  } finally {
    setLoading(false);
    input.focus();
  }
});

input.addEventListener("input", resizeInput);

input.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    form.requestSubmit();
  }
});

clear.addEventListener("click", () => {
  conversation = [];
  localStorage.removeItem(STORAGE_KEY);
  render();
  input.focus();
});

render();
resizeInput();
input.focus();
