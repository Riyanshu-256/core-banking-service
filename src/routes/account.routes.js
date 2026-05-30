const express = require("express");
const authMiddleware = require("../middleware/auth.middleware");
const accountController = require("../controllers/accountController");

const router = express.Router();

router.post(
  "/",
  authMiddleware.authMiddleware,
  accountController.createAccountController,
);

router.get(
  "/",
  authMiddleware.authMiddleware,
  accountController.getUserAccountsController,
);

module.exports = router;
