# Task Management API

A REST API for managing tasks, built with Node.js, Express, and SQLite.

## Requirements

- Node.js v18+
- npm

## Setup

```bash
npm install
npm start
```

Server runs at `http://localhost:3000`.

---

## Endpoints

### GET /api/tasks
Get all tasks.

**Response 200**
```json
{
  "success": true,
  "total": 2,
  "data": [...]
}
```

---

### GET /api/tasks/:id
Get a task by ID.

**Response 200**
```json
{
  "success": true,
  "data": { "id": "...", "title": "...", ... }
}
```

**Response 404** — task not found.

---

### POST /api/tasks
Create a new task.

**Body**
| Field | Type | Required | Values |
|---|---|---|---|
| title | string | yes | max 255 chars |
| description | string | no | max 2000 chars |
| status | string | no | `pending`, `in-progress`, `done` |
| priority | string | no | `low`, `medium`, `high` |

**Response 201**
```json
{
  "success": true,
  "message": "Tugas berhasil dibuat",
  "data": { "id": "...", ... }
}
```

---

### PUT /api/tasks/:id
Replace a task's data.

**Body** — same fields as POST (all optional).

**Response 200**
```json
{
  "success": true,
  "message": "Tugas berhasil diperbarui",
  "data": { ... }
}
```

---

### PATCH /api/tasks/:id/status
Update only the status of a task.

**Body**
```json
{ "status": "in-progress" }
```

**Response 200**
```json
{
  "success": true,
  "message": "Status tugas berhasil diperbarui",
  "data": { ... }
}
```

---

### DELETE /api/tasks/:id
Delete a task.

**Response 200**
```json
{
  "success": true,
  "message": "Tugas berhasil dihapus"
}
```

---

## Task Object

```json
{
  "id": "uuid",
  "title": "string",
  "description": "string",
  "status": "pending | in-progress | done",
  "priority": "low | medium | high",
  "createdAt": "ISO 8601",
  "updatedAt": "ISO 8601"
}
```

---

## Error Response

```json
{
  "success": false,
  "message": "error message"
}
```

Validation errors return status **400** with an `errors` array:

```json
{
  "success": false,
  "message": "Validasi gagal",
  "errors": [
    { "field": "title", "message": "title wajib diisi" }
  ]
}
```

---

## Health Check

```
GET /health
```

---

## Logs

Logs are stored in the `logs/` directory:
- `logs/app.log` — all logs
- `logs/error.log` — error logs only
