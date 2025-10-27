# tRPC Authentication System - API Testing Guide

## Start the Server

```bash
node dist/server/index.js
```

Server will run on `http://localhost:3000`

---

## 1. Sign Up (Create New User)

```bash
curl -X POST http://localhost:3000/signUp \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

**Response:**

```json
{
  "result": {
    "data": {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "message": "User created successfully"
    }
  }
}
```

---

## 2. Sign In (Get JWT Token)

```bash
curl -X POST http://localhost:3000/signIn \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

**Response:**

```json
{
  "result": {
    "data": {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "message": "Signed in successfully"
    }
  }
}
```

**Copy the token from the response for the next step!**

---

## 3. Create Todo (Protected - Requires JWT Token)

Replace `YOUR_JWT_TOKEN_HERE` with the token from sign up/sign in:

```bash
curl -X POST http://localhost:3000/createTodo \
  -H "Content-Type: application/json" \
  -H "Authorization: YOUR_JWT_TOKEN_HERE" \
  -d '{
    "title": "Go to gym",
    "description": "Need to complete workout routine"
  }'
```

**Response (with valid token):**

```json
{
  "result": {
    "data": {
      "id": "1735324800000",
      "title": "Go to gym",
      "description": "Need to complete workout routine",
      "createdBy": "test@example.com"
    }
  }
}
```

---

## 4. Get All Todos (Protected - Requires JWT Token)

Replace `YOUR_JWT_TOKEN_HERE` with your token:

```bash
curl -X POST "http://localhost:3000/getAllTodos" \
  -H "Content-Type: application/json" \
  -H "Authorization: YOUR_JWT_TOKEN_HERE"
```

**Response:**

```json
{
  "result": {
    "data": {
      "todos": [
        {
          "id": "1735324800000",
          "title": "Go to gym",
          "description": "Need to complete workout routine",
          "createdBy": "test@example.com"
        },
        {
          "id": "1735324801000",
          "title": "Buy groceries",
          "description": "Milk, eggs, bread",
          "createdBy": "test@example.com"
        }
      ],
      "count": 2
    }
  }
}
```

**Note:** Only returns todos created by the logged-in user.

**Response (without token or invalid token):**

```json
{
  "error": {
    "message": "You must be logged in to access this",
    "code": -32001,
    "data": {
      "code": "UNAUTHORIZED"
    }
  }
}
```

---

## Complete Example Flow

```bash
# 1. Sign up
SIGNUP_RESPONSE=$(curl -s -X POST http://localhost:3000/signUp \
  -H "Content-Type: application/json" \
  -d '{"email": "user@test.com", "password": "mypass123"}')

# Extract token (requires jq)
TOKEN=$(echo $SIGNUP_RESPONSE | jq -r '.result.data.token')

echo "Token: $TOKEN"

# 2. Create first todo
curl -X POST http://localhost:3000/createTodo \
  -H "Content-Type: application/json" \
  -H "Authorization: $TOKEN" \
  -d '{"title": "Buy groceries", "description": "Milk, eggs, bread"}'

# 3. Create second todo
curl -X POST http://localhost:3000/createTodo \
  -H "Content-Type: application/json" \
  -H "Authorization: $TOKEN" \
  -d '{"title": "Workout", "description": "30 min cardio"}'

# 4. Get all todos
curl -X POST http://localhost:3000/getAllTodos \
  -H "Content-Type: application/json" \
  -H "Authorization: $TOKEN"
```

---

## Testing Without Token (Should Fail)

```bash
curl -X POST http://localhost:3000/createTodo \
  -H "Content-Type: application/json" \
  -d '{
    "title": "This will fail",
    "description": "No token provided"
  }'
```

This should return an `UNAUTHORIZED` error.
