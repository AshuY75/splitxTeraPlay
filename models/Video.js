const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
    originalUrl: { type: String, required: true, unique: true },
    streamUrl: { type: String, required: true },
    title: { type: String, default: 'xTeraPlay Video' },
    views: { type: Number, default: 0 },
    thumbnail: { type: String, default: null },
    createdAt: { type: Date, default: Date.now, expires: 3600 } // Auto-delete after 1 hour (TTL)
}, { timestamps: false });

// Export the model, preventing OverwriteModelError
module.exports = mongoose.models.Video || mongoose.model('Video', videoSchema);
