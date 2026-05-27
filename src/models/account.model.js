const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema(
  {
    // User Reference
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
      index: true,
    },

    // Account Status
    status: {
      type: String,

      enum: ["active", "inactive", "blocked"],

      default: "active",
    },

    // Currency
    currency: {
      type: String,

      enum: ["INR", "USD", "EUR"],

      default: "INR",
    },

    // Balance
    balance: {
      type: Number,

      default: 0,
    },
  },

  // Timestamps
  {
    timestamps: true,
  },
);

userSchema.index({ user: 1, status: 1 });

// Create Model
const accountModel = mongoose.model("Account", accountSchema);

// Export Model
module.exports = accountModel;
