const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");

// ================= REGISTER =================

async function userRegisterController(req, res) {
  try {
    const { email, name, password } = req.body;

    // Validation
    if (!email || !name || !password) {
      return res.status(400).json({
        message: "All fields are required",
        status: "failed",
      });
    }

    // Check existing user
    const isExist = await userModel.findOne({ email });

    if (isExist) {
      return res.status(409).json({
        message: "User already exists with this email",
        status: "failed",
      });
    }

    // IMPORTANT:
    // DO NOT hash password here
    // Schema middleware already hashes it

    const user = await userModel.create({
      name,
      email,
      password,
    });

    // Generate token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // Response
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
    console.log(error);

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

    // Find user
    const user = await userModel.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({
        message: "Email or password is INVALID",
      });
    }

    // Compare password using schema method
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Email or password is INVALID",
      });
    }

    // Generate token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

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
    console.log(error);

    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
}

module.exports = {
  userRegisterController,
  userLoginController,
};
