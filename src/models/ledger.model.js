const mongoose = require("mongoose");

// Creating ledger schema
const ledgerSchema = new mongoose.Schema({
  // Reference to the account associated with this ledger entry
  account: {
    type: mongoose.Schema.Types.ObjectId, // Stores MongoDB ObjectId
    ref: "account", // References account model
    required: [true, "Ledger must be associated with an account"],
    index: true, // Improves search performance
    immutable: true,
  },

  // Amount involved in the ledger entry
  amount: {
    type: Number,
    required: [true, "Amount is required for creating a ledger entry"],
    immutable: true,
  },

  // Reference to the related transaction
  transaction: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "transaction", // References transaction model
    required: [true, "Ledger must be associated with a transaction"],
    index: true,
    immutable: true,
  },

  // Type of ledger entry
  // CREDIT -> money added
  // DEBIT  -> money deducted
  type: {
    type: String,
    enum: {
      values: ["CREDIT", "DEBIT"],
      message: "Type can be either CREDIT or DEBIT",
    },
    required: [true, "Ledger type is required"],
    immutable: true,
  },
});

// This code prevents ledger entries from being updated or deleted after creation.
function preventLedgerModification() {
  throw new Error(
    "Ledger entries are immutable and cannot be modified or deleted",
  );
}

ledgerSchema.pre("findOneAndUpdate", preventLedgerModification);
ledgerSchema.pre("updateOne", preventLedgerModification);
ledgerSchema.pre("deleteOne", preventLedgerModification);
ledgerSchema.pre("remove", preventLedgerModification);
ledgerSchema.pre("deleteMany", preventLedgerModification);
ledgerSchema.pre("updateMany", preventLedgerModification);
ledgerSchema.pre("findOneAndDelete", preventLedgerModification);
ledgerSchema.pre("findOneAndReplace", preventLedgerModification);

// Create ledger model
const ledgerModel = mongoose.model("Ledger", ledgerSchema);

// export
module.exports = ledgerModel;
