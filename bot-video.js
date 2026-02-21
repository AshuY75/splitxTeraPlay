// bot-video.js
const { Telegraf } = require('telegraf');
const { getVideoUrl } = require('./scraperService');
const mongoose = require('mongoose');
const fetch = require('node-fetch');
const cache = require('./cache'); // Step 8: SQLite Shared Cache
const crypto = require('crypto');

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI;
mongoose.connect(MONGODB_URI).then(() => console.log('🤖 Bot DB Connected.'));

const Video = require('./models/Video');

// Configuration
const BOT_TOKEN = process.env.BOT_TOKEN;
const WEBAPP_BASE_URL = process.env.WEBAPP_BASE_URL;
const bot = new Telegraf(BOT_TOKEN);
if (!BOT_TOKEN) throw new Error("BOT_TOKEN is missing!");

// Health Check
async function verifyWebApp() {
    // In development mode, we bypass health check to allow local testing without tunnels
    if (process.env.NODE_ENV !== 'production') {
        return true;
    }

    try {
        const healthUrl = `${WEBAPP_BASE_URL}/health`;
        const res = await fetch(healthUrl);
        if (!res.ok) console.error(`⚠️ Health check failed for ${healthUrl} with status ${res.status}`);
        return res.ok;
    } catch (e) {
        console.error(`⚠️ Health check error for ${WEBAPP_BASE_URL}:`, e.message);
        return false;
    }
}

bot.start((ctx) => {
    ctx.reply('👋 Welcome to xTeraPlay Official!\n\nSend me any TeraBox link and I will generate a secure, in-app player button for you. 🚀\n\nNo downloads, no limits.');
});

bot.catch((err, ctx) => {
    console.error(`[xTeraBot] Global Error:`, err);
});

bot.on('text', async (ctx) => {
    const text = ctx.message.text.trim();
    if (!text.includes('/s/')) return ctx.reply('❌ Please send a valid TeraBox link.');

    const isServerUp = await verifyWebApp();
    if (!isServerUp) {
        return ctx.reply('⚠️ **Server temporarily unavailable.**\nPlease try again in a few moments.');
    }

    const processingMsg = await ctx.reply('⏳ **Analyzing & Securing Video...**', { parse_mode: 'Markdown' });

    try {
        const data = await getVideoUrl(text);
        if (!data || !data.videoUrl) throw new Error('Extraction failed');

        // 1. Persist to MongoDB for Community Grid
        const video = await Video.findOneAndUpdate(
            { originalUrl: text },
            {
                streamUrl: data.videoUrl,
                title: data.title,
                $inc: { views: 1 },
                createdAt: new Date()
            },
            { upsert: true, new: true } // Return the updated document
        );

        // 2. Step 8: Save to Shared SQLite Cache for Session Stability
        const sessionId = crypto.randomBytes(5).toString('hex'); // Short persistent ID
        cache.set(sessionId, data.videoUrl);

        // 3. Send Web App Button using SQLite sessionId
        await ctx.reply(`✅ **${data.title}** is ready!`, {
            parse_mode: 'Markdown',
            reply_markup: {
                inline_keyboard: [
                    [{
                        text: '▶ Play in Telegram',
                        web_app: { url: `${WEBAPP_BASE_URL}/player?id=${sessionId}` }
                    }]
                ]
            }
        });

    } catch (error) {
        console.error('Bot Error:', error);
        await ctx.reply('❌ Extraction failed. Please try again later.');
    } finally {
        try { await ctx.telegram.deleteMessage(ctx.chat.id, processingMsg.message_id); } catch (e) { }
    }
});

// Startup Notification
bot.launch().then(() => {
    console.log(`🤖 xTeraPlay Bot Online Status: OK`);
});

module.exports = { bot };

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
