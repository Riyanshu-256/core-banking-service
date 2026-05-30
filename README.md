# 🏦 Core Banking Service

A scalable and secure backend banking system built using Node.js, Express.js, MongoDB, and JWT Authentication.

This project simulates real-world banking operations including user authentication, account management, transactions, ledger tracking, and audit logging.

---

## 📌 Features

### 🔐 Authentication & Authorization

- User Registration
- User Login
- JWT-based Authentication
- Protected Routes
- Token Blacklisting (Logout Support)

### 👤 Account Management

- Create Bank Accounts
- Account Validation
- Account Information Retrieval
- Customer Account Association

### 💸 Transaction Management

- Secure Fund Transfers
- Initial Account Funding
- Transaction Recording
- Transaction Validation
- Atomic Transaction Processing

### 📖 Ledger System

- Double-Entry Ledger Recording
- Financial Audit Trail
- Debit & Credit Tracking
- Transaction Ledger Management

### 📧 Notification Service

- Email Notifications
- Transaction Confirmation Emails
- Account Activity Alerts

### 🛡️ Security Features

- Password Hashing with bcrypt
- JWT Token Verification
- Protected API Endpoints
- Environment Variable Security
- Centralized Error Handling

---

## 🏗️ Project Architecture

```text
CORE-BANKING-SERVICE
│
├── src
│   ├── config
│   │   └── db.js
│   │
│   ├── controllers
│   │   ├── accountController.js
│   │   ├── auth.controller.js
│   │   └── transaction.controller.js
│   │
│   ├── middleware
│   │   └── auth.middleware.js
│   │
│   ├── models
│   │   ├── user.model.js
│   │   ├── account.model.js
│   │   ├── transaction.model.js
│   │   ├── ledger.model.js
│   │   └── blackList.model.js
│   │
│   ├── routes
│   │   ├── auth.routes.js
│   │   ├── account.routes.js
│   │   └── transaction.routes.js
│   │
│   ├── services
│   │   └── email.service.js
│   │
│   └── app.js
│
├── .env
├── server.js
├── package.json
└── README.md
```

---

## 🛠️ Tech Stack

| Technology | Purpose               |
| ---------- | --------------------- |
| Node.js    | Runtime Environment   |
| Express.js | Backend Framework     |
| MongoDB    | Database              |
| Mongoose   | ODM                   |
| JWT        | Authentication        |
| bcrypt.js  | Password Hashing      |
| Nodemailer | Email Service         |
| dotenv     | Environment Variables |

---

## 🚀 Installation

### 1. Clone Repository

```bash
git clone https://github.com/yourusername/core-banking-service.git
```

### 2. Navigate to Project

```bash
cd core-banking-service
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Environment Variables

Create a `.env` file:

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_secret_key

EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password
```

### 5. Start Server

Development Mode

```bash
npm run dev
```

Production Mode

```bash
npm start
```

---

## 📡 API Endpoints

### Authentication

| Method | Endpoint           | Description   |
| ------ | ------------------ | ------------- |
| POST   | /api/auth/register | Register User |
| POST   | /api/auth/login    | Login User    |
| POST   | /api/auth/logout   | Logout User   |

---

### Accounts

| Method | Endpoint                  | Description    |
| ------ | ------------------------- | -------------- |
| POST   | /api/accounts             | Create Account |
| GET    | /api/accounts/:id         | Get Account    |
| GET    | /api/accounts/balance/:id | Check Balance  |

---

### Transactions

### Transactions

| Method | Endpoint                               | Description                      |
| ------ | -------------------------------------- | -------------------------------- |
| POST   | /api/transactions                      | Create Transaction               |
| POST   | /api/transactions/system/initial-funds | Create Initial Funds Transaction |

---

## 🔒 Security Features

- JWT Authentication
- Password Hashing using bcrypt
- Route Protection Middleware
- Environment Variable Security
- Token Blacklisting
- Input Validation
- Error Handling

---

## 📊 Banking Workflow

```text
User Login
     │
     ▼
JWT Generated
     │
     ▼
Authenticated Request
     │
     ▼
Transaction Processing
     │
     ▼
Ledger Entry Creation
     │
     ▼
Account Balance Update
     │
     ▼
Email Notification
```

---

## 📈 Future Enhancements

- Role-Based Access Control (RBAC)
- KYC Verification
- Loan Management System
- Fixed Deposit Module
- UPI Integration
- Real-time Notifications
- Transaction Analytics Dashboard
- Microservices Architecture

---

## 🧪 Testing

Run Tests:

```bash
npm test
```

---

## 👨‍💻 Author

**Riyanshu Sharma**

B.Tech CSE (2024-2028)

Backend Developer | Banking Systems Enthusiast

---

## 📄 License

This project is licensed under the MIT License.

---

### ⭐ If you found this project useful, consider giving it a star.
