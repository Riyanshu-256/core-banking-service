const mongoose = require("mongoose");

// Create token blacklist schema
const tokenBlacklistSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: [true, "Token is required to blacklist"],
      unique: [true, "Token is already blacklisted"],
    },
    blacklistedAt: {
      type: Date,
      default: Date.now,
      immutable: true,
    },
  },
  {
    timestamps: true,
  },
);

tokenBlacklistSchema.index(
  { createAt: 1 },
  {
    expireAfterSeconds: 60 * 60 * 24 * 30, // 30 days
  },
);

const tokenBlackListModel = mongoose.model(
  "tokenBlacklist",
  tokenBlacklistSchema,
);

module.exports = tokenBlackListModel;
