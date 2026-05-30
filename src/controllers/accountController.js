const accountModel = require("../models/account.model");

// This controller creates a new account for the authenticated user.
// It gets the logged-in user from req.user,
// creates an account in the database linked with that user,
// and sends the created account as a response.
async function createAccountController(req, res) {
  const user = req.user;

  const account = await accountModel.create({
    user: user._id,
  });
  res.status(201).json({
    account,
  });
}

async function getUserAccountsController(req, res) {
  const accounts = await accountModel.find({ user: req.user._id });
  res.status(200).json({
    accounts,
  });
}

module.exports = {
  createAccountController,
  getUserAccountsController,
};
