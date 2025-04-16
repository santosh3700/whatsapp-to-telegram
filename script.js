// WhatsApp Business to Telegram Forwarder - Final Version
// Configuration
let config = {
  botToken: localStorage.getItem("botToken") || "",
  chatId: localStorage.getItem("chatId") || "",
};

// Message tracking
let lastForwardedNumber = null;
let lastForwardedTime = 0;

// DOM Elements
const botTokenInput = document.getElementById("botToken");
const chatIdInput = document.getElementById("chatId");
const saveConfigBtn = document.getElementById("saveConfig");
const requestPermissionBtn = document.getElementById("requestPermission");
const testBotBtn = document.getElementById("testBot");
const testNotificationBtn = document.getElementById("testNotification");
const notificationAccessStatus = document.getElementById(
  "notificationAccessStatus"
);
const lastForwarded = document.getElementById("lastForwarded");

// Initialize UI
function initUI() {
  botTokenInput.value = config.botToken;
  chatIdInput.value = config.chatId;

  // Check notification access
  checkNotificationAccess();

  // Setup test buttons
  if (testNotificationBtn) {
    testNotificationBtn.addEventListener("click", sendTestNotification);
  }
  if (testBotBtn) {
    testBotBtn.addEventListener("click", testTelegramBot);
  }
}

// Save configuration
saveConfigBtn.addEventListener("click", () => {
  config.botToken = botTokenInput.value.trim();
  config.chatId = chatIdInput.value.trim();

  localStorage.setItem("botToken", config.botToken);
  localStorage.setItem("chatId", config.chatId);

  alert("Configuration saved successfully!");
});

// Request notification access
requestPermissionBtn.addEventListener("click", () => {
  if ("Notification" in window) {
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        checkNotificationAccess();
        alert(
          "Please enable notification access in Android settings for this app to work properly."
        );
      }
    });
  } else {
    alert("Notification API not supported in this browser.");
  }
});

// Check notification access status
function checkNotificationAccess() {
  // This is a placeholder - actual notification access check requires Android-specific API
  notificationAccessStatus.textContent = "Check Android Settings";
  notificationAccessStatus.className = "";
}

// Forward message to Telegram with duplicate prevention
async function forwardToTelegram(message) {
  if (!config.botToken || !config.chatId) {
    console.error("Telegram bot token or chat ID not configured");
    return false;
  }

  // Create message fingerprint for duplicate detection
  const messageFingerprint = message.replace(/\d+/g, "X"); // Replace numbers for comparison

  // Prevent duplicate messages within 5 minutes
  if (
    messageFingerprint === lastForwardedNumber &&
    Date.now() - lastForwardedTime < 300000
  ) {
    console.log("Duplicate message prevented:", message);
    return false;
  }

  try {
    const url = `https://api.telegram.org/bot${config.botToken}/sendMessage`;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: config.chatId,
        text: message,
        disable_notification: false,
      }),
    });

    const data = await response.json();
    if (data.ok) {
      const now = new Date();
      lastForwarded.textContent = `Last forwarded: ${now.toLocaleTimeString()}`;
      lastForwardedNumber = messageFingerprint;
      lastForwardedTime = Date.now();
      return true;
    } else {
      console.error("Telegram API error:", data);
      return false;
    }
  } catch (error) {
    console.error("Error forwarding to Telegram:", error);
    return false;
  }
}

// Handle incoming notification
function handleNotification(notification) {
  if (notification.data && notification.data.app === "whatsapp_business") {
    const message = notification.body || "";

    // Improved detection of new customers
    if (
      message.includes("New message from") ||
      message.includes("new chat") ||
      notification.data.isNewCustomer
    ) {
      const phoneNumber = extractPhoneNumber(message);
      if (phoneNumber) {
        const now = new Date();
        const formattedMessage = phoneNumber;

        forwardToTelegram(formattedMessage);
      }
    }
  }
}

// Extract phone number from message
function extractPhoneNumber(message) {
  // Improved phone number regex
  const phoneRegex = /(\+?[\d\s\-\(\)]{8,15}\d)/;
  const match = message.match(phoneRegex);
  return match ? match[0].replace(/\D/g, "") : null;
}

// Test Telegram Bot connection
async function testTelegramBot() {
  if (!config.botToken || !config.chatId) {
    alert("Please save your Telegram bot token and chat ID first!");
    return;
  }

  try {
    const testMessage =
      `✅ WhatsApp-to-Telegram Forwarder Test\n` +
      `Bot is working correctly!\n` +
      `Timestamp: ${new Date().toLocaleString()}`;

    const success = await forwardToTelegram(testMessage);
    if (success) {
      alert("Test message sent successfully to Telegram!");
    } else {
      alert("Failed to send test message. Check console for errors.");
    }
  } catch (error) {
    console.error("Test failed:", error);
    alert("Test failed. Check console for errors.");
  }
}

// Manual test notification
function sendTestNotification() {
  const mockNotification = {
    title: "WhatsApp Business",
    body: "New message from +123456789: Hello there!",
    data: {
      app: "whatsapp_business",
      isNewCustomer: true,
    },
  };
  handleNotification(mockNotification);
  alert("Test notification processed! Check your Telegram group.");
}

// Register Service Worker
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("sw.js")
      .then((registration) => {
        console.log("ServiceWorker registration successful");
      })
      .catch((err) => {
        console.log("ServiceWorker registration failed: ", err);
      });
  });
}

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  initUI();
});
