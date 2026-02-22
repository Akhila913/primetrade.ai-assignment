# Scalable REST API with Role-Based Access

## Project Overview

It demonstrates a **secure, scalable backend system** with:

- JWT Authentication
- Role-Based Access Control (User vs Admin)
- CRUD operations for tasks
- Proper validation and error handling
- API versioning
- Clean modular project structure
- Basic frontend UI for interaction

The frontend is built using **Vanilla HTML, CSS, and JavaScript** to demonstrate API integration and protected routes.

---

## Tech Stack

### Backend
- FastAPI
- PostgreSQL
- SQLAlchemy ORM
- Alembic (Database Migrations)
- JWT Authentication
- Passlib (bcrypt hashing)
- Pydantic (Validation)

### Frontend
- HTML5
- CSS3
- Vanilla JavaScript (Fetch API)
- LocalStorage (JWT storage)

---

## Full Project Structure
```
primetrade_project/
│
├── backend/
│ │
│ ├── app/
│ │ ├── api/
│ │ │ └── v1/
│ │ │ ├── auth.py
│ │ │ ├── tasks.py
│ │ │ ├── admin.py
│ │ │
│ │ ├── core/
│ │ │ ├── config.py
│ │ │ ├── security.py
│ │ │ ├── logging.py
│ │ │
│ │ ├── db/
│ │ │ ├── base.py
│ │ │ ├── session.py
│ │ │ └── models/
│ │ │ ├── user.py
│ │ │ └── task.py
│ │ │
│ │ ├── schemas/
│ │ │ ├── user.py
│ │ │ └── task.py
│ │ │
│ │ └── main.py
│ │
│ ├── alembic/
│ │ ├── versions/
│ │ └── env.py
│ │
│ ├── requirements.txt
│ └── .env (not committed)
│
├── frontend/
│ │
│ ├── css/
│ │ ├── styles.css
│ │ └── dashboard.css
│ │
│ ├── js/
│ │ ├── api.js
│ │ ├── auth.js
│ │ ├── dashboard.js
│ │ └── admin.js
│ │
│ ├── index.html
│ ├── dashboard.html
│ └── admin.html
│
├── .gitignore
└── README.md
```

---

## Setup Instructions

###  Clone Repository

```bash
git clone https://github.com/Akhila913/primetrade.ai-assignment.git
cd primetrade_project
```
### Backend Setup
```
cd backend
python -m venv venv
source venv/Scripts/activate   # Windows Git Bash
pip install -r requirements.txt
```
### Create .env file inside backend folder:
```
DATABASE_URL=postgresql://username:password@localhost:5432/primetrade
SECRET_KEY=your_secret_key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
```
### Run Database Migrations
```
alembic upgrade head
```
### Start Backend Server
```
uvicorn app.main:app --reload
```
Backend runs at:
```
http://127.0.0.1:8000
```
Swagger Documentation:
```
http://127.0.0.1:8000/docs
```
### Frontend Setup

Open the frontend folder using Live Server (VS Code extension)
or open index.html directly in browser.

Frontend connects to:
```
http://127.0.0.1:8000/api/v1
```

---

## Authentication Flow

- User registers or logs in

- Backend returns JWT access token

- Token is stored in localStorage

- Token sent in every protected request:

``` Authorization: Bearer <token> ```

## Roles & Permissions
### User

- Create tasks

- View only their own tasks

- Update/Delete their own tasks

- Cannot access admin routes

### Admin

- View all users

- View all tasks

- Update/Delete any task

- Access Admin Panel

---

## API Endpoints
### Authentication
```
POST /api/v1/auth/register
POST /api/v1/auth/login
```
### Tasks
```
GET    /api/v1/tasks
POST   /api/v1/tasks
GET    /api/v1/tasks/{id}
PUT    /api/v1/tasks/{id}
DELETE /api/v1/tasks/{id}
```
### Admin
```
GET /api/v1/admin/users
```
(Admin only)

---

## Sample Test Credentials

You may create users using the register endpoint.

To test admin features:

1. Create a user.

2. Update role to admin in the database.

Admin
```
email: admin@example.com
password: Admin123!
```
User
```
email: user@example.com
password: User123!
```

---

## Security Practices Implemented

- Password hashing using bcrypt

- JWT-based authentication

- Role-based route protection

- Input validation with Pydantic

- ORM-based SQL injection protection

- Protected admin endpoints

- Proper HTTP status codes

- Structured error handling

---

## Scalability Considerations

- The project is structured for scalability:

- Modular folder structure

- API versioning (/api/v1)

- Stateless JWT authentication (horizontal scaling ready)

- Alembic migrations for DB evolution

- Easily extendable to:

  - Microservices architecture

  - Redis caching

  - Load balancing

  - Docker containerization

  - CI/CD pipelines