const mongoose = require("mongoose");

const SessionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    token: {
        type: String,
        required: true,
        unique: true
    },
    role: {
        type: String,
        enum: ["admin", "cadet"],
        required: true
    },
    expiresAt: {
        type: Date,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Auto-delete expired sessions
SessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model("Session", SessionSchema);
