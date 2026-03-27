# Auth Service (Node.js + Express + PostgreSQL + Docker)

## Overview

This project is a secure authentication service built using Node.js and Express. It implements a production-style authentication system using:

* JWT (RS256)
* Access and Refresh Tokens
* PostgreSQL database
* Docker for containerization
* Rate limiting for security

The system supports user registration, login, token refresh, protected routes, and logout.

---

## Architecture

The project follows a layered architecture:

```
Controller → Service → Database
```

* **Controllers**: Handle HTTP requests and responses
* **Services**: Contain business logic and database queries
* **Middleware**: Authentication and rate limiting
* **Utils**: JWT handling, hashing, token generation

---

## Tech Stack

* Node.js
* Express.js
* PostgreSQL
* Docker & Docker Compose
* bcrypt (password hashing)
* jsonwebtoken (RS256)
* express-rate-limit

---

## Features

* User registration with validation
* Secure password hashing using bcrypt
* Login with JWT access token
* Refresh token system with database storage
* Protected routes using middleware
* Logout by invalidating refresh tokens
* Rate limiting on login endpoint

---

## Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/aravindpunyamantula/auth-service
cd auth-service
```

---

### 2. Generate RSA Keys

```bash
chmod +x generate-keys.sh
./generate-keys.sh
```

This creates:

```
keys/private.pem
keys/public.pem
```

---

### 3. Environment Configuration

Create a `.env` file:

```env
API_PORT=8080
DATABASE_URL=postgresql://user:password@db:5432/authdb
JWT_PRIVATE_KEY_PATH=./keys/private.pem
JWT_PUBLIC_KEY_PATH=./keys/public.pem
```

---

### 4. Run with Docker

```bash
docker compose up --build
```

Access server:

```
http://localhost:8080
```

---

## API Documentation

### Base URL

```
http://localhost:8080/api
```

---

### 1. Register

**POST** `/auth/register`

```json
{
  "username": "user1",
  "email": "user1@test.com",
  "password": "Pass@1234"
}
```

**Response**

```json
{
  "id": 1,
  "username": "user1",
  "message": "User registered successfully"
}
```

---

### 2. Login

**POST** `/auth/login`

```json
{
  "username": "user1",
  "password": "Pass@1234"
}
```

**Response**

```json
{
  "token_type": "Bearer",
  "access_token": "...",
  "expires_in": 900,
  "refresh_token": "..."
}
```

---

### 3. Get Profile (Protected)

**GET** `/api/profile`

Header:

```
Authorization: Bearer <access_token>
```

**Response**

```json
{
  "id": 1,
  "username": "user1",
  "email": "user1@test.com",
  "roles": ["user"]
}
```

---

### 4. Refresh Token

**POST** `/auth/refresh`

```json
{
  "refresh_token": "..."
}
```

**Response**

```json
{
  "token_type": "Bearer",
  "access_token": "...",
  "expires_in": 900
}
```

---

### 5. Logout

**POST** `/auth/logout`

```json
{
  "refresh_token": "..."
}
```

**Response**

```
204 No Content
```

---

## Testing

Run the automated test script:

```bash
chmod +x test-auth-flow.sh
./test-auth-flow.sh
```

This script will:

* Register a user
* Login
* Access protected route
* Refresh token
* Access again
* Logout

---

## Security Design

* Passwords are hashed using bcrypt
* JWT uses RS256 (private/public key)
* Access tokens are short-lived (15 min)
* Refresh tokens are stored in database
* Rate limiting prevents brute-force attacks

---
