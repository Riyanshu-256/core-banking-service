const mongoose = require("mongoose");
const ledgerModel = require("../models/ledger.model");

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
      enum: ["ACTIVE", "FROZEN", "CLOSED"],
      default: "ACTIVE",
    },

    // Currency
    currency: {
      type: String,
      enum: ["INR", "USD", "EUR"],
      default: "INR",
    },
  },
  {
    timestamps: true,
  },
);

accountSchema.index({ user: 1, status: 1 });

accountSchema.methods.getBalance = async function () {
  // Aggregate all ledger entries of the current account
  const balanceData = await ledgerModel.aggregate([
    {
      // Select only those ledger records that belong to this account
      $match: {
        account: this._id,
      },
    },
    {
      // Group all matched records and calculate total debit and credit amounts
      $group: {
        _id: null,

        // Sum all amounts where transaction type is DEBIT
        totalDebit: {
          $sum: {
            $cond: [{ $eq: ["$type", "DEBIT"] }, "$amount", 0],
          },
        },

        // Sum all amounts where transaction type is CREDIT
        totalCredit: {
          $sum: {
            $cond: [{ $eq: ["$type", "CREDIT"] }, "$amount", 0],
          },
        },
      },
    },
    {
      // Calculate final balance = total credits - total debits
      $project: {
        _id: 0,
        balance: {
          $subtract: ["$totalCredit", "$totalDebit"],
        },
      },
    },
  ]);

  // Return calculated balance, or 0 if no ledger entries exist
  return balanceData[0]?.balance || 0;
};

// Create Model
const accountModel = mongoose.model("Account", accountSchema);

// Export Model
module.exports = accountModel;
