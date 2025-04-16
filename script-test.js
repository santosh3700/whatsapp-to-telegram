// Debug configuration
const config = {
  botToken: localStorage.getItem("botToken") || "",
  chatId: localStorage.getItem("chatId") || "",
};

// DOM elements
const botTokenInput = document.getElementById("botToken");
const chatIdInput = document.getElementById("chatId");
const saveConfigBtn = document.getElementById("saveConfig");
const testBotBtn = document.getElementById("testBot");
const testNotifBtn = document.getElementById("testNotif");
const realNotifBtn = document.getElementById("realNotif");
const clearLogBtn = document.getElementById("clearLog");
const checkPermsBtn = document.getElementById("checkPerms");
const notifPermStatus = document.getElementById("notifPermStatus");
const notifTitleInput = document.getElementById("notifTitle");
const notifBodyInput = document.getElementById("notifBody");
const logDiv = document.getElementById("log");

// Initialize
function init() {
  botTokenInput.value = config.botToken;
  chatIdInput.value = config.chatId;

  // Event listeners
  saveConfigBtn.addEventListener("click", saveConfig);
  testBotBtn.addEventListener("click", testTelegramBot);
  testNotifBtn.addEventListener("click", testNotification);
  realNotifBtn.addEventListener("click", testRealWhatsAppNotification);
  clearLogBtn.addEventListener("click", clearLog);
  checkPermsBtn.addEventListener("click", checkPermissions);

  log("Debug console initialized");
}

// Log messages to console and UI
function log(message, isError = false) {
  const timestamp = new Date().toLocaleTimeString();
  const logEntry = document.createElement("div");
  logEntry.innerHTML = `<span class="timestamp">[${timestamp}]</span> ${message}`;
  logEntry.className = isError ? "error" : "";
  logDiv.appendChild(logEntry);
  logDiv.scrollTop = logDiv.scrollHeight;
  console.log(message);
}

function clearLog() {
  logDiv.innerHTML = "";
}

// Save configuration
function saveConfig() {
  config.botToken = botTokenInput.value.trim();
  config.chatId = chatIdInput.value.trim();

  localStorage.setItem("botToken", config.botToken);
  localStorage.setItem("chatId", config.chatId);

  log("Configuration saved successfully");
}

// Test Telegram bot
async function testTelegramBot() {
  if (!config.botToken || !config.chatId) {
    log("Error: Please configure bot token and chat ID first", true);
    return;
  }

  try {
    const testMessage = `🔧 Test message from debug console\nTimestamp: ${new Date().toLocaleString()}`;
    const success = await forwardToTelegram(testMessage);

    if (success) {
      log("Test message sent successfully to Telegram");
    } else {
      log("Failed to send test message", true);
    }
  } catch (error) {
    log(`Telegram test failed: ${error.message}`, true);
  }
}

// Forward message to Telegram
async function forwardToTelegram(message) {
  try {
    const url = `https://api.telegram.org/bot${config.botToken}/sendMessage`;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: config.chatId,
        text: message,
      }),
    });

    const data = await response.json();
    if (data.ok) {
      log(`Message forwarded to Telegram: "${message}"`);
      return true;
    } else {
      log(`Telegram API error: ${data.description}`, true);
      return false;
    }
  } catch (error) {
    log(`Forwarding error: ${error.message}`, true);
    return false;
  }
}

// Test notification handler
function testNotification() {
  const notification = {
    title: notifTitleInput.value,
    body: notifBodyInput.value,
    data: {
      app: "whatsapp_business",
      isNewCustomer: true,
    },
  };

  log(
    `Simulating notification:\nTitle: "${notification.title}"\nBody: "${notification.body}"`
  );
  handleNotification(notification);
}

// Simulate real WhatsApp notification
function testRealWhatsAppNotification() {
  const notifications = [
    {
      title: "WhatsApp Business",
      body: "New message from +1234567890: Hello, I need help!",
      data: { app: "whatsapp_business", isNewCustomer: true },
    },
    {
      title: "WhatsApp Business",
      body: "New message from +1987654321: When will my order ship?",
      data: { app: "whatsapp_business", isNewCustomer: false },
    },
    {
      title: "WhatsApp Business",
      body: "Missed voice call from +1122334455",
      data: { app: "whatsapp_business", isNewCustomer: true },
    },
  ];

  const randomNotif =
    notifications[Math.floor(Math.random() * notifications.length)];
  log(`Simulating REAL WhatsApp notification:\n"${randomNotif.body}"`);
  handleNotification(randomNotif);
}

// Handle incoming notification
function handleNotification(notification) {
  log(`Processing notification from: ${notification.title}`);

  if (notification.data?.app === "whatsapp_business") {
    const phoneNumber = extractPhoneNumber(notification.body);

    if (phoneNumber) {
      const message = `📱 New WhatsApp Message\nFrom: ${phoneNumber}\nTime: ${new Date().toLocaleString()}`;
      forwardToTelegram(message);
    } else {
      log("Could not extract phone number from notification", true);
    }
  } else {
    log("Not a WhatsApp Business notification - ignoring");
  }
}

// Extract phone number
function extractPhoneNumber(text) {
  const phoneRegex = /(\+?\d[\d\-\s()]{8,}\d)/;
  const match = text.match(phoneRegex);
  return match ? match[0].replace(/\D/g, "") : null;
}

// Check permissions
function checkPermissions() {
  if (!("Notification" in window)) {
    notifPermStatus.textContent = "Not supported";
    return;
  }

  Notification.requestPermission().then((permission) => {
    notifPermStatus.textContent = permission;
    log(`Notification permission: ${permission}`);
  });
}

// Initialize debug console
init();
