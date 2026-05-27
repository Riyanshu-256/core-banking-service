// Import express packages
const express = require("express");
const cookieParser = require("cookie-parser");

const authRouter = require("./routes/auth.routes");
const accountRouter = require("./routes/account.routes");

// Creates backend aap/server
const app = express();

app.use(express.json());
app.use(cookieParser());

// All authentication routes are grouped under the /api/auth prefix.
app.use("/api/auth", authRouter);
app.use("/api/accounts", accountRouter);

// export this file, so that another file can used it
module.exports = app;
