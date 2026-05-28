const mongoose = require("mongoose");

// This schema stores transaction details between two accounts.
const transactionShema = new mongoose.Schema(
  {
    // Sender account reference
    fromAccount: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "account",
      required: [true, "Transaction must be associated with a from account"],
      index: true,
    },
    // Receiver account reference
    toAccount: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "account",
      required: [true, "Transaction must be associated with a to account"],
      index: true,
    },
    // Transaction status
    status: {
      type: String,
      enum: {
        values: ["PENDING", "COMPLETED", "FAILED", "REVERSED"],
        message: "Status can be either PENDING, COMPLETED, FAILED or REVERSED",
      },
      default: "PENDING",
    },
    // Amount transferred
    amount: {
      type: Number,
      required: [true, "Amount is required for creating a transaction"],
      min: [0, "Transaction amount cannot be negative"],
    },
    // Unique key to prevent duplicate transactions
    idempotencyKey: {
      type: String,
      required: [
        true,
        "Idempotency Key is required for creating a transaction",
      ],
      index: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  },
);

// Create model
const transactionModel = mongoose.model("transaction", transactionShema);

module.exports = transactionModel;
