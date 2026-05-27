// ================= IMPORTS =================
const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const emailService = require("../services/email.service");

// ================= REGISTER =================
async function userRegisterController(req, res) {
  try {
    const { email, name, password } = req.body;

    // ================= VALIDATION =================
    if (!email || !name || !password) {
      return res.status(400).json({
        message: "All fields are required",
        status: "failed",
      });
    }

    // ================= CHECK EXISTING USER =================
    const isExist = await userModel.findOne({ email });

    if (isExist) {
      return res.status(409).json({
        message: "User already exists with this email",
        status: "failed",
      });
    }

    // ================= CREATE USER =================
    const user = await userModel.create({
      name,
      email,
      password,
    });

    // ================= SEND REGISTRATION EMAIL =================
    await emailService.sendRegistrationEmail(user.email, user.name);

    // ================= GENERATE JWT TOKEN =================
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // ================= SET COOKIE =================
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // ================= RESPONSE =================
    return res.status(201).json({
      message: "User registered successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    console.log("REGISTER ERROR:", error);

    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
}

// ================= LOGIN =================
async function userLoginController(req, res) {
  try {
    const { email, password } = req.body;

    // ================= FIND USER =================
    const user = await userModel.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({
        message: "Email or password is INVALID",
      });
    }

    // ================= CHECK PASSWORD =================
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Email or password is INVALID",
      });
    }

    // ================= GENERATE JWT TOKEN =================
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // ================= SET COOKIE =================
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // ================= RESPONSE =================
    return res.status(200).json({
      message: "Login successful",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    console.log("LOGIN ERROR:", error);

    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
}

// ================= EXPORTS =================
module.exports = {
  userRegisterController,
  userLoginController,
};
