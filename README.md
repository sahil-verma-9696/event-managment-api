## 📘 Event Management API

A RESTful API built with **Node.js**, **Express**, and **Supabase (PostgreSQL)** to manage events, user registrations, and capacity tracking.

---

## 🚀 Features

- Create events with datetime, location, and capacity
- Register/cancel users for events
- Enforce rules: capacity limits, past-event restriction, no duplicate registrations
- List upcoming events with sorting
- View event statistics (registrations, remaining spots, usage %)

---

## ⚙️ Setup Instructions

### 1. **Clone the repo**

```bash
git clone https://github.com/your-username/event-management-api.git
cd event-management-api
```

### 2. **Install dependencies**

```bash
npm install
```

### 3. **Create `.env` file**

`This env are for test purpose`

```env
SUPABASE_URL=https://zwplkevnnhwowmppqrxw.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp3cGxrZXZubmh3b3dtcHBxcnh3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI1NjcwNDksImV4cCI6MjA2ODE0MzA0OX0.Auoe96YgX5sOZSB7GMF5JrLI-Lh0nlWh-2c4-zI9J_8
PORT=3000
```

### 4. **Run the server**

```bash
npm run dev
```

---

## 🧱 Database Schema (Supabase)

### Tables:

- `users(id, name, email)`
- `events(id, title, datetime, location, capacity)`
- `registrations(user_id, event_id, created_at)`

👉 Many-to-many relation between `users` and `events` via `registrations`.

---

## 📡 API Endpoints

### ➕ Create User

```http
POST /users
```

**Body:**

```json
{ "name": "Sahil", "email": "sahil@example.com" }
```

**Response:**

```json
{ "id": "uuid", "message": "User created successfully" }
```

---

### ➕ Create Event

```http
POST /events
```

**Body:**

```json
{
  "title": "React Meetup",
  "datetime": "2025-08-01T14:00:00Z",
  "location": "Delhi",
  "capacity": 200
}
```

**Response:**

```json
{ "id": "event-uuid" }
```

---

### 🔍 Get Event Details

```http
GET /events/:id
```

**Response:**

```json
{
  "id": "event-uuid",
  "title": "React Meetup",
  "datetime": "2025-08-01T14:00:00Z",
  "location": "Delhi",
  "capacity": 200,
  "registered_users": [
    { "id": "user-uuid", "name": "Sahil", "email": "sahil@example.com" }
  ]
}
```

---

### 📝 Register for Event

```http
POST /events/register
```

**Body:**

```json
{
  "user_id": "user-uuid",
  "event_id": "event-uuid"
}
```

**Response:**

```json
{ "success": true }
```

---

### ❌ Cancel Registration

```http
DELETE /events/cancel
```

**Body:**

```json
{
  "user_id": "user-uuid",
  "event_id": "event-uuid"
}
```

**Response:**

```json
{ "success": true }
```

---

### 📅 List Upcoming Events

```http
GET /events/upcoming
```

**Response:**

```json
[
  {
    "id": "event-uuid",
    "title": "React Meetup",
    "datetime": "2025-08-01T14:00:00Z",
    "location": "Delhi",
    "capacity": 200
  }
]
```

---

### 📊 Event Stats

```http
GET /events/:id/stats
```

**Response:**

```json
{
  "total_registrations": 50,
  "remaining_capacity": 150,
  "percentage_used": 25
}
```

---

## 📁 Folder Structure

```
/src
  ├── controllers/
  ├── routes/
  ├── lib/supabase.js
  └── index.js
.env
README.md
```

---

## 💠 Tools Used

- Node.js + Express
- Supabase (PostgreSQL)
- JavaScript ES Modules

---

## 🙌 Author

**Sahil Verma**
