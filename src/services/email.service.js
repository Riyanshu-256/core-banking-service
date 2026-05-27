require("dotenv").config();

const nodemailer = require("nodemailer");

// ======================================
// CREATE TRANSPORTER
// ======================================
const transporter = nodemailer.createTransport({
  service: "gmail",

  auth: {
    type: "OAuth2",

    user: process.env.EMAIL_USER,

    clientId: process.env.CLIENT_ID,

    clientSecret: process.env.CLIENT_SECRET,

    refreshToken: process.env.REFRESH_TOKEN,
  },
});

// ======================================
// VERIFY EMAIL SERVER
// ======================================
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ Email Server Error:", error);
  } else {
    console.log("✅ Email Server Ready");
  }
});

// ======================================
// GENERIC SEND EMAIL FUNCTION
// ======================================
const sendEmail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"Banking-Server" <${process.env.EMAIL_USER}>`,

      to,

      subject,

      text,

      html,
    });

    console.log("✅ Email Sent Successfully");
    console.log("📩 Message ID:", info.messageId);
  } catch (error) {
    console.error("❌ Error Sending Email:", error);
  }
};

// ======================================
// WELCOME / REGISTRATION EMAIL
// ======================================
async function sendRegistrationEmail(userEmail, name) {
  const subject = "🎉 Welcome to Banking-Server";

  // ================= TEXT VERSION =================
  const text = `
Hello ${name},

Welcome to Banking-Server 💳

Thank you for registering with us.
Your account has been created successfully.

You can now:
✔ Check your balance
✔ Manage transactions
✔ Secure your banking activity

We’re excited to have you onboard.

Best Regards,
Banking-Server Team
`;

  // ================= HTML VERSION =================
  const html = `
  <div style="
      background:#f4f7fb;
      padding:40px;
      font-family:Arial,sans-serif;
  ">

    <div style="
        max-width:600px;
        margin:auto;
        background:white;
        border-radius:16px;
        overflow:hidden;
        box-shadow:0 6px 20px rgba(0,0,0,0.1);
    ">

      <!-- HEADER -->
      <div style="
          background:linear-gradient(135deg,#1d4ed8,#2563eb);
          color:white;
          text-align:center;
          padding:35px;
      ">
          <h1 style="margin:0;">
            Banking-Server 💳
          </h1>

          <p style="margin-top:10px;font-size:16px;">
            Secure • Reliable • Modern Banking
          </p>
      </div>

      <!-- BODY -->
      <div style="padding:35px;color:#333;">

          <h2>Hello ${name} 👋</h2>

          <p>
            Thank you for registering with
            <strong>Banking-Server</strong>.
          </p>

          <p>
            Your account has been created successfully ✅
          </p>

          <!-- FEATURES -->
          <div style="
              background:#f9fafb;
              padding:20px;
              border-radius:10px;
              margin:25px 0;
          ">

              <h3 style="margin-top:0;">
                 What You Can Do
              </h3>

              <ul style="
                  padding-left:20px;
                  line-height:1.9;
              ">
                  <li>Check Account Balance</li>
                  <li>Transfer Money Securely</li>
                  <li>Track Transactions</li>
                  <li>Manage Profile Settings</li>
              </ul>
          </div>


          <p>
            If you have any questions,
            feel free to contact our support team.
          </p>

          <p style="margin-top:30px;">
            Best Regards,<br/>
            <strong>Banking-Server Team</strong>
          </p>
      </div>

      <!-- FOOTER -->
      <div style="
          background:#f3f4f6;
          text-align:center;
          padding:18px;
          color:#666;
          font-size:12px;
      ">
          © 2026 Banking-Server. All Rights Reserved.
      </div>

    </div>
  </div>
  `;

  await sendEmail(userEmail, subject, text, html);
}

// // ======================================
// // TRANSACTION SUCCESS EMAIL
// // ======================================
// async function sendTransactionEmail(
//   userEmail,
//   name,
//   amount,
//   toAccount
// ) {

//   const subject = "✅ Transaction Successful";

//   const text = `
// Hello ${name},

// Your transaction was successful.

// Amount: ₹${amount}
// To Account: ${toAccount}

// Thank you for using Banking-Server.

// Best Regards,
// Banking-Server Team
// `;

//   const html = `
//   <div style="font-family:Arial;padding:30px;">

//       <h2>✅ Transaction Successful</h2>

//       <p>Hello ${name},</p>

//       <p>Your money transfer was completed successfully.</p>

//       <div style="
//           background:#f4f4f4;
//           padding:20px;
//           border-radius:10px;
//       ">
//           <p><strong>Amount:</strong> ₹${amount}</p>

//           <p><strong>To Account:</strong> ${toAccount}</p>
//       </div>

//       <br/>

//       <p>
//         Thank you for using Banking-Server 💳
//       </p>
//   </div>
//   `;

//   await sendEmail(userEmail, subject, text, html);
// }

// // ======================================
// // TRANSACTION FAILED EMAIL
// // ======================================
// async function sendTransactionFailureEmail(
//   userEmail,
//   name,
//   amount,
//   toAccount
// ) {

//   const subject = "❌ Transaction Failed";

//   const text = `
// Hello ${name},

// We regret to inform you that your transaction failed.

// Amount: ₹${amount}
// To Account: ${toAccount}

// Please try again later.

// Best Regards,
// Banking-Server Team
// `;

//   const html = `
//   <div style="font-family:Arial;padding:30px;">

//       <h2>❌ Transaction Failed</h2>

//       <p>Hello ${name},</p>

//       <p>
//         Your transaction could not be completed.
//       </p>

//       <div style="
//           background:#fff4f4;
//           padding:20px;
//           border-radius:10px;
//           border:1px solid #fca5a5;
//       ">
//           <p><strong>Amount:</strong> ₹${amount}</p>

//           <p><strong>To Account:</strong> ${toAccount}</p>
//       </div>

//       <br/>

//       <p>
//         Please try again later or contact support.
//       </p>
//   </div>
//   `;

//   await sendEmail(userEmail, subject, text, html);
// }

// ======================================
// EXPORTS
// ======================================
module.exports = {
  sendRegistrationEmail,
  //   sendTransactionEmail,
  //   sendTransactionFailureEmail,
};
