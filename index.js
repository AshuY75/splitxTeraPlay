// index.js - xTeraPlay Railway Entry Point
require('dotenv').config();
const { server } = require('./server');
const { bot } = require('./bot-video');

// 1️⃣ Ensure critical environment variables exist
if (!process.env.BOT_TOKEN) {
    console.error("❌ CRITICAL ERROR: BOT_TOKEN is missing!");
    process.exit(1);
}

if (!process.env.MONGODB_URI) {
    console.error("❌ CRITICAL ERROR: MONGODB_URI is missing!");
    process.exit(1);
}

if (!process.env.WEBAPP_BASE_URL) {
    console.warn("⚠️ WARNING: WEBAPP_BASE_URL is missing. Telegram buttons may not work correctly.");
}

console.log("🚀 Starting xTeraPlay Unified Service...");
console.log("Active WebApp Domain:", process.env.WEBAPP_BASE_URL || "Not Set");

// The server and bot are initialized via their respective requires
// server.js starts the app.listen()
// bot-video.js starts the bot.launch()
