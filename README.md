# Bank Ledger API

A **secure and scalable banking ledger backend** built with **Node.js, Express, and MongoDB** that simulates core banking operations such as **account management, deposits, withdrawals, and transfers**.

The system follows **double-entry accounting principles** to ensure financial consistency and auditability. It also incorporates **idempotency protection, JWT authentication, and token blacklisting** to simulate real-world fintech backend systems.

---

# Features

- Account creation and management
- Secure authentication using **JWT**
- **Token blacklist with TTL index**
- Deposit, withdrawal, and transfer operations
- **Double-entry ledger system**
- Atomic transactions using **MongoDB sessions**
- **Idempotency keys** to prevent duplicate transactions
- Transaction history tracking
- Email notifications using **Nodemailer + OAuth2**
- RESTful API architecture
- Production-style error handling

---

# Tech Stack

## Backend
- Node.js
- Express.js

## Database
- MongoDB
- Mongoose

## Authentication
- JSON Web Tokens (JWT)

## Email Service
- Nodemailer
- Google OAuth2

## Security
- Token blacklist with TTL indexes
- Idempotency keys to prevent duplicate financial operations

---
### Secret Keys
- PORT=3000
- MONGO_URI=your_mongodb_connection_string
- JWT_SECRET=your_jwt_secret
- EMAIL_USER=your_email@gmail.com
- CLIENT_ID=your_google_client_id
- CLIENT_SECRET=your_google_client_secret
- REFRESH_TOKEN=your_google_refresh_token
