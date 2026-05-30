const transactionModel = require("../models/transaction.model");
const ledgerModel = require("../models/ledger.model");
const accountModel = require("../models/account.model");
const userModel = require("../models/user.model");
const emailService = require("../services/email.service");
const mongoose = require("mongoose");

async function createTransaction(req, res) {
  // 1. Validate request
  const { fromAccount, toAccount, amount, idempotencyKey } = req.body;

  if (!fromAccount || !toAccount || !amount || !idempotencyKey) {
    return res.status(400).json({
      message: "fromAccount, toAccount, amount and idempotencyKey are required",
    });
  }

  const fromUserAccount = await accountModel.findOne({
    _id: fromAccount,
  });

  const toUserAccount = await accountModel.findOne({
    _id: toAccount,
  });

  if (!fromUserAccount || !toUserAccount) {
    return res.status(400).json({
      message: "Invalid fromAccount or toAccount",
    });
  }

  // 2. Validate idempotencyKey
  const isTransactionAlreadyExists = await transactionModel.findOne({
    idempotencyKey: idempotencyKey,
  });

  if (isTransactionAlreadyExists) {
    if (isTransactionAlreadyExists.status === "COMPLETED") {
      return res.status(200).json({
        message: "Transaction already completed.",
        transaction: isTransactionAlreadyExists,
      });
    }

    if (isTransactionAlreadyExists.status === "PENDING") {
      return res.status(200).json({
        message: "Transaction is currently being processed.",
      });
    }

    if (isTransactionAlreadyExists.status === "FAILED") {
      return res.status(200).json({
        message: "Transaction failed. Please try again.",
      });
    }

    if (isTransactionAlreadyExists.status === "REVERSED") {
      return res.status(200).json({
        message:
          "Transaction has been reversed and the amount has been refunded.",
      });
    }
  }

  // 3. Check account status
  if (
    fromUserAccount.status !== "ACTIVE" ||
    toUserAccount.status !== "ACTIVE"
  ) {
    return res.status(400).json({
      message:
        "Both fromAccount and toAccount must be ACTIVE to process transacction",
    });
  }

  // 4. Calculate sender balance from ledger
  const balance = await fromUserAccount.getBalance();
  if (balance < amount) {
    return res.status(400).json({
      message: `Insufficient balance. Current balance is ${balance}. Requested amount is ${amount}`,
    });
  }

  // 5. Create transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  const [transaction] = await transactionModel.create(
    [
      {
        fromAccount,
        toAccount,
        amount,
        idempotencyKey,
        status: "PENDING",
      },
    ],
    { session },
  );

  // 6. Create Debit Ledger Entry
  const [debitLedgerEntry] = await ledgerModel.create(
    [
      {
        account: fromAccount,
        amount,
        transaction: transaction._id,
        type: "DEBIT",
      },
    ],
    { session },
  );

  // 7. Create Credit Ledger Entry
  const [creditLedgerEntry] = await ledgerModel.create(
    [
      {
        account: toAccount,
        amount,
        transaction: transaction._id,
        type: "CREDIT",
      },
    ],
    { session },
  );

  // 8. Mark transaction completed
  transaction.status = "COMPLETED";
  await transaction.save({ session });

  // 9. Commit MongoDB session
  await session.commitTransaction();
  session.endSession();

  // 10. Send email notification
  await emailService.sendTransactionEmail(
    req.user.email,
    req.user.name,
    amount,
    toAccount,
  );

  return res.status(201).json({
    message: "Transaction completed successfully",
    transaction: transaction,
  });
}

async function createInitialFundsTransaction(req, res) {
  console.log("REQ BODY =", req.body);
  const { toAccount, amount, idempotencyKey } = req.body;
  console.log("toAccount =", toAccount);
  console.log("amount =", amount);
  console.log("idempotencyKey =", idempotencyKey);

  if (!toAccount || !amount || !idempotencyKey) {
    return res.status(400).json({
      message: "toAccount, account and idempotencyKey are required",
    });
  }

  const toUserAccount = await accountModel.findOne({
    _id: toAccount,
  });

  if (!toUserAccount) {
    return res.status(400).json({
      message: "Invalid Account",
    });
  }

  const systemUser = await userModel
    .findOne({
      systemUser: true,
    })
    .select("+systemUser");
  console.log("SYSTEM USER =", systemUser);

  if (!systemUser) {
    return res.status(400).json({
      message: "System user not found",
    });
  }

  const fromUserAccount = await accountModel.findOne({
    user: systemUser._id,
  });

  console.log("SYSTEM USER ID =", systemUser._id);
  console.log("FROM USER ACCOUNT =", fromUserAccount);

  if (!fromUserAccount) {
    return res.status(400).json({
      message: "System user account not found",
    });
  }

  const fromAccount = fromUserAccount._id;

  console.log("fromAccount =", fromAccount);

  // create session
  const session = await mongoose.startSession();
  session.startTransaction();

  const [transaction] = await transactionModel.create(
    [
      {
        fromAccount,
        toAccount,
        amount,
        idempotencyKey,
        status: "PENDING",
      },
    ],
    { session },
  );
  // Create Debit Ledger Entry
  const [debitLedgerEntry] = await ledgerModel.create(
    [
      {
        account: fromAccount,
        amount,
        transaction: transaction._id,
        type: "DEBIT",
      },
    ],
    { session },
  );

  // Create Credit Ledger Entry
  const [creditLedgerEntry] = await ledgerModel.create(
    [
      {
        account: toAccount,
        amount,
        transaction: transaction._id,
        type: "CREDIT",
      },
    ],
    { session },
  );
  // Mark transaction completed
  transaction.status = "COMPLETED";
  await transaction.save({ session });

  // Commit MongoDB session
  await session.commitTransaction();
  session.endSession();

  // Send email notification
  await emailService.sendTransactionEmail(
    req.user.email,
    req.user.name,
    amount,
    toAccount,
  );

  return res.status(201).json({
    message: "Initial funds transaction completed successfully",
    transaction: transaction,
  });
}

module.exports = {
  createTransaction,
  createInitialFundsTransaction,
};
