# Organ Donor Registry Application 🫀🏥

A comprehensive, modern full-stack web application designed to connect organ donors, recipients, and medical administrators to bridge the gap in organ donation and save lives.

---

## 🌟 Key Features

- **🔐 Authentication & Role Management**: Secure JWT authentication with role-based access (`User`, `Donor`, `Recipient`, `Admin`).
- **🫀 Donor Pledge Registration**: Comprehensive donor registration for pledging organs (Kidneys, Liver, Heart, Lungs, Cornea, Pancreas, etc.) with emergency contact and medical details.
- **🔍 Filterable Donor Directory**: Search and filter active donors by Organ Type, Blood Group, City, and Status.
- **📋 Recipient Organ Requests**: Submit organ requests with urgency metrics (Critical, High, Medium, Low) and hospital details.
- **⚡ Smart Matching System**: Automatic matching engine comparing donor blood group and organ types against urgent patient requests.
- **📊 User Dashboard**: Personal portal tracking pledges, request statuses, and live match notifications.
- **🛡️ Admin Portal**: Central administrative hub featuring system analytics, request review/approval, donor management, and match verification.
- **🚀 Seamless Demo Mode**: One-click demo logins for Instant testing (Admin, Donor, Recipient) even without external DB configuration.

---

## 🏗️ Folder Structure

```
organ-donor-registry/
├── client/                         # React Frontend (Vite)
│   ├── public/
│   └── src/
│       ├── components/             # Navbar, Footer, DonorCard, ProtectedRoute
│       ├── pages/                  # Home, Login, Register, DonorRegistration, DonorList, RequestOrgan, Dashboard, AdminDashboard
│       ├── services/               # Axios API client with fallback demo mode
│       ├── context/                # AuthContext state management
│       ├── App.jsx                 # Routes & layout structure
│       └── main.jsx                # App bootstrap
│
├── server/                         # Node.js + Express Backend
│   ├── config/                     # Mongoose database connection
│   ├── controllers/                # Auth, Donor, Organ, Request logic
│   ├── models/                     # User, Donor, Organ, OrganRequest Mongoose models
│   ├── routes/                     # REST API endpoints
│   ├── middleware/                 # JWT Auth & Admin Authorization middleware
│   └── server.js                   # Express server entry point
│
├── package.json                    # Root launcher scripts
└── README.md
```

---

## 🛠️ Quick Start Guide

### Prerequisites
- [Node.js](https://nodejs.org/) (v16+ recommended)
- [MongoDB](https://www.mongodb.com/) (Optional: if not running locally, the application automatically uses mock seed mode for instant testing)

### Installation

1. Install dependencies for root, server, and client:
   ```bash
   npm run install-all
   ```

2. Start development servers concurrently:
   ```bash
   npm run dev
   ```
   - **Frontend**: Runs at `http://localhost:5173`
   - **Backend**: Runs at `http://localhost:5001`

---

## 🧪 Demo Login Credentials

You can test the application using one-click demo login buttons on the Login page or using these credentials:

- **Admin Account**: `admin@organregistry.org` / `admin123`
- **Donor Account**: `donor@organregistry.org` / `donor123`
- **Recipient Account**: `recipient@organregistry.org` / `user123`

---

## 📡 API Endpoints Summary

- `POST /api/auth/register` - Create new user account
- `POST /api/auth/login` - Authenticate user & receive JWT
- `GET /api/auth/me` - Fetch authenticated user profile
- `GET /api/donors` - List & search donors
- `POST /api/donors` - Register as an organ donor
- `GET /api/requests` - List recipient organ requests
- `POST /api/requests` - Create new organ request
- `PUT /api/requests/:id/status` - Update request status (Admin)
- `GET /api/organs/stats` - Platform statistics & matching overview
