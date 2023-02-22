const createSessionButton = document.querySelector("#create-session-button");
const sendMessageButton = document.querySelector("#send-message-button");
const recipientInput = document.querySelector("#recipient");
const messageInput = document.querySelector("#message");
const sentMessagesList = document.querySelector("#sent-messages");
const sessionArea = document.querySelector("#session-area");
const createSessionArea = document.querySelector("#create-session-area");


createSessionButton.addEventListener("click", async () => {
  const response = await fetch("http://localhost:8080/session", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const { sessionId } = await response.json();
  document.cookie = `sessionId=${sessionId}`;
  sessionArea.style.display = "block";
  createSessionArea.style.display = "none";
});

const sendMessage = async () => {
  const recipient = "admin";
  const message = messageInput.value;

  if (!sessionId || !message) {
    return;
  }

  const response = await fetch("http://localhost:8080/message", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      recipient,
      message,
      sessionId,
    }),
  });

  if (response.status === 200) {
    messageInput.value = "";
    const sentMessage = document.createElement("div");
    sentMessage.innerHTML = `
      <p class="sentMessage">You: ${message}</p>
    `;
    messageContainer.appendChild(sentMessage);
  }
};

const readMessages = async () => {
  const response = await fetch(`http://localhost:8080/messages?sessionId=${sessionId}`);
  const messages = await response.json();

  messages.forEach(({ recipient, message }) => {
    const receivedMessage = document.createElement("div");
    receivedMessage.innerHTML = `
      <p class="receivedMessage">${recipient}: ${message}</p>
    `;
    messageContainer.appendChild(receivedMessage);
  });
};

sendMessageButton.addEventListener("click", sendMessage);

readMessages();
