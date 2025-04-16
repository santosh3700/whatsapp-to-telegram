// Configuration
let config = {
  botToken: localStorage.getItem("botToken") || "",
  chatId: localStorage.getItem("chatId") || "",
};

// DOM Elements
const botTokenInput = document.getElementById("botToken");
const chatIdInput = document.getElementById("chatId");
const saveConfigBtn = document.getElementById("saveConfig");
const requestPermissionBtn = document.getElementById("requestPermission");
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
  // In a real app, you would check if the user has granted notification access in system settings
  notificationAccessStatus.textContent = "Check Android Settings";
  notificationAccessStatus.className = "";
}

// Forward message to Telegram
async function forwardToTelegram(message) {
  if (!config.botToken || !config.chatId) {
    console.error("Telegram bot token or chat ID not configured");
    return;
  }

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
      const now = new Date();
      lastForwarded.textContent = `Last forwarded at ${now.toLocaleTimeString()}`;
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

// Simulate notification handling (in a real app, this would be handled by the Notification Listener Service)
function simulateNotificationHandling() {
  // This is just for demonstration - in a real app, you would receive actual notifications
  setInterval(() => {
    const mockNotification = {
      title: "WhatsApp Business",
      body: "New message from +1234567890: Hello!",
      data: {
        app: "whatsapp_business",
        isNewCustomer: Math.random() > 0.7, // 30% chance of being a new customer
      },
    };

    handleNotification(mockNotification);
  }, 30000); // Check every 30 seconds
}

// Handle incoming notification
function handleNotification(notification) {
  if (notification.data && notification.data.app === "whatsapp_business") {
    const message = notification.body || "";

    // Simple detection of new customers (in a real app, you'd need more sophisticated logic)
    if (
      message.includes("New message from") ||
      notification.data.isNewCustomer
    ) {
      const phoneNumber = extractPhoneNumber(message);
      if (phoneNumber) {
        forwardToTelegram(`New WhatsApp customer: ${phoneNumber}`);
      }
    }
  }
}

// Extract phone number from message
function extractPhoneNumber(message) {
  const phoneRegex = /(\+?\d{10,15})/;
  const match = message.match(phoneRegex);
  return match ? match[0] : null;
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
  simulateNotificationHandling();
});
