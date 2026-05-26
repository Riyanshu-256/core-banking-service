//This file defines how user data will be stored in MongoDB.

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs ");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,

      // Email is required
      required: [true, "Email is required for creating a user"],

      // Removes extra spaces
      trim: true,

      // Converts email to lowercase
      lowercase: true,

      // Checks valid email format
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],

      // Prevents duplicate emails
      unique: [true, "Email already exists"],
    },

    name: {
      type: String,

      // Name is required
      required: [true, "Name is required for creating an account"],
    },

    password: {
      type: String,

      // Password is required
      required: [true, "Password is required"],

      // Minimum password length
      minLength: [6, "Password must be at least 6 characters"],

      // Password will not be returned when fetching user data
      select: false,
    },
  },
  {
    timestamps: true,
  },
);

// Encrypt password before saving user
userSchema.pre("save", async function (next) {
  // If password is not modified, move to next step
  if (!this.isModified("password")) {
    return next();
  }

  // Hashing password
  this.password = await bcrypt.hash(this.password, 10);

  next();
});

// Function to check whether entered password is correct or not
userSchema.methods.comparePassword = async function (password) {
  // Compare entered password with encrypted password stored in database
  return await bcrypt.compare(password, this.password);
};

// Creating User model
const User = mongoose.model("User", userSchema);

// Exporting model so it can be used in other files
module.exports = User;
