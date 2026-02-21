require('dotenv').config();
// 1️⃣ Ensure critical environment variables exist
if (!process.env.BOT_TOKEN) {
    throw new Error("❌ CRITICAL ERROR: BOT_TOKEN is missing!");
}

if (!process.env.MONGODB_URI) {
    throw new Error("❌ CRITICAL ERROR: MONGODB_URI is missing!");
}

if (!process.env.WEBAPP_BASE_URL) {
    throw new Error("❌ CRITICAL ERROR: WEBAPP_BASE_URL is missing!");
}

const { server } = require('./server');
const { bot } = require('./bot-video');

console.log("-----------------------------------------");
console.log("💎 xTeraPlay PRODUCTION AUDIT SYSTEM");
console.log("-----------------------------------------");
console.log("NODE_ENV          :", process.env.NODE_ENV || "development");
console.log("WebApp Domain     :", process.env.WEBAPP_BASE_URL);
console.log("Port              :", process.env.PORT || 3000);
console.log("MongoDB Status    : Initializing...");
console.log("Telegram Bot      : Initializing...");
console.log("-----------------------------------------");
