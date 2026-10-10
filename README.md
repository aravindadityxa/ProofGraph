# ProofGraph

A professional verification and record-management platform for managing identity verification, professional records, and organizational trust profiles.

## Overview

ProofGraph provides secure identity verification and comprehensive record management. Users can track their professional verification journey from identity through education, experience, and employment. Administrators manage users and records through a dedicated control room.

## Features

- Secure JWT-based authentication with role-based access control
- User dashboard with professional verification journey timeline
- Comprehensive record management across identity, education, experience, and employment
- Real-time asynchronous API request visualization (Verification Engine)
- Admin control room with complete user CRUD operations
- Professional, responsive UI
- Activity feed for tracking actions and verifications

## Technology Stack

**Frontend:** Angular 12, TypeScript, RxJS, Reactive Forms, SCSS  
**Backend:** Node.js, Express, TypeScript, MongoDB with Mongoose  
**Authentication:** JWT with bcrypt password hashing  
**Database:** MongoDB

## Requirements

- Node.js v14+
- MongoDB Community Edition v4.4+

**MongoDB is required.** The application will not start without a running MongoDB instance.

## Local Setup

### 1. Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd frontend
npm install
```

### 2. Configure Environment

Create `backend/.env` from the example:

```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env` and set:

```
MONGODB_URI=mongodb://localhost:27017/proofgraph
```

Ensure MongoDB is running on `localhost:27017` before starting the backend.

### 3. Start MongoDB

```bash
# macOS with Homebrew
brew services start mongodb-community

# Windows
# Start MongoDB from Services, or run: mongod

# Linux
sudo systemctl start mongod
```

### 4. Seed Database (Optional)

```bash
cd backend
npm run seed
```

This creates test users and sample records.

### 5. Start Backend

```bash
cd backend
npm run dev
```

Backend runs on `http://localhost:3000`

### 6. Start Frontend

```bash
cd frontend
npm start
```

Frontend runs on `http://localhost:4200`

## Configuration

**Backend Environment Variables:**

Copy `backend/.env.example` to `backend/.env`:

```
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/proofgraph
JWT_SECRET=your-secure-jwt-secret-key-here
JWT_EXPIRES_IN=24h
CORS_ORIGIN=http://localhost:4200
```

**Frontend API:**

`frontend/src/environments/environment.ts` is configured to call:

```
apiUrl: 'http://localhost:3000/api'
```

## Test Credentials

After seeding the database:

**Admin:**
- User ID: `admin`
- Password: `admin123`

**General User:**
- User ID: `john.doe`
- Password: `password123`

## API Endpoints

### Authentication

- `POST /api/auth/login` - Login and receive JWT token

### User API (Authenticated)

- `GET /api/users/:id` - Get user profile
- `GET /api/users/:id/records?delay=<ms>` - Get user records with optional delay

### Admin API (Admin Only)

- `GET /api/admin/users` - List all users
- `POST /api/admin/users` - Create user
- `GET /api/admin/users/:id` - Get user details
- `PUT /api/admin/users/:id` - Update user
- `DELETE /api/admin/users/:id` - Delete user

## Key Features

### Verification Engine

The Verification Engine demonstrates asynchronous API request handling:
- Shows processing stages: AUTHENTICATE → FETCH → VALIDATE → READY
- Displays real-time elapsed time
- Reports request delay duration
- Shows record statistics upon completion

Triggered by the `/api/users/:id/records?delay=3000` endpoint which delays the response by the specified milliseconds.

### Admin User Management

Administrators can manage users through the Admin Control Room:
- View all users with record counts
- Create new users
- Edit user information
- Delete users
- View user details and associated records

### Verification Journey

Users see their verification progress across categories:
- Identity
- Education
- Experience
- Employment
- Current Status

## Database Schema

**User:**
- name, userId, email, password (hashed with bcrypt)
- role (Admin or General User), status (Active/Inactive/Pending)
- department, organization
- timestamps (createdAt, updatedAt)

**Record:**
- title, description, status (Verified/Pending)
- category (identity, education, experience, employment)
- organization, startDate, endDate
- verifiedAt, timestamps

## Building for Production

### Backend

```bash
cd backend
npm run build
NODE_ENV=production node dist/server.js
```

### Frontend

```bash
cd frontend
ng build --configuration production
```

## Architecture

```
ProofGraph/
├── backend/
│   └── src/
│       ├── config/          # Database & environment setup
│       ├── controllers/     # Request handlers
│       ├── middleware/      # Auth, CORS, error handling
│       ├── models/          # Mongoose schemas
│       ├── routes/          # API routes
│       └── utils/           # JWT, seed utilities
│
├── frontend/
│   └── src/app/
│       ├── core/            # Services, guards, interceptors
│       ├── features/        # Auth, dashboard, admin modules
│       └── shared/          # Reusable components, models
```

## Developer

Aravind Adityaa  
https://github.com/aravindadityxa

## License

MIT
