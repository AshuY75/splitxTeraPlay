const fs = require('fs');
const path = require('path');

// 1️⃣ Environment Loading (Robust for Local & Cloud)
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
    require('dotenv').config();
}

// 2️⃣ Strict Validation before loading any logic
const BOT_TOKEN = process.env.BOT_TOKEN;
const MONGODB_URI = process.env.MONGODB_URI;
const WEBAPP_BASE_URL = process.env.WEBAPP_BASE_URL;

if (!BOT_TOKEN) throw new Error("❌ CRITICAL ERROR: BOT_TOKEN is missing!");
if (!MONGODB_URI) throw new Error("❌ CRITICAL ERROR: MONGODB_URI is missing!");
if (!WEBAPP_BASE_URL) throw new Error("❌ CRITICAL ERROR: WEBAPP_BASE_URL is missing!");

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
