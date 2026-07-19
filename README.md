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

## API Summary

| Method | Endpoint | Access | Request Parameters | Request Body | Description |
|--------|----------|--------|--------------------|--------------|-------------|
| **POST** | `/api/auth/register` | Public | — | `email`, `password`, `name` | Registers a new user account, generates a JWT token, and sends a welcome email. |
| **POST** | `/api/auth/login` | Public | — | `email`, `password` | Authenticates an existing user and returns a JWT token for subsequent authenticated requests. |
| **POST** | `/api/auth/logout` | Protected | — | — | Logs out the authenticated user by invalidating (blacklisting) the current JWT token. |
| **POST** | `/api/account` | Protected | — | — | Creates a new bank account for the authenticated user. |
| **GET** | `/api/account` | Protected | — | — | Retrieves all bank accounts associated with the authenticated user. |
| **GET** | `/api/account/balance/:accountId` | Protected | `accountId` (Path Parameter) | — | Retrieves the current balance of the specified account owned by the authenticated user. |
| **POST** | `/api/transactions` | Protected | — | `fromAccount`, `toAccount`, `amount`, `idempotencyKey` | Transfers funds between two active accounts with idempotency support to prevent duplicate transactions. |
| **POST** | `/api/transactions/system/initial-funds` | Protected (System User) | — | `toAccount`, `amount`, `idempotencyKey` | Credits an account with initial funds using the authenticated system user's account as the source. Accessible only to authorized system users. |
