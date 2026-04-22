# 🔵 TEAM BLUE — Student Team Members Management Application

> Full Stack Development · SRM Institute of Science and Technology  
> Course: 21CSS301T | CLAT-2 Assessment | Academic Year 2024-25

---

## 📌 Project Description

A full-stack web application to manage student team members. Built with React.js on the frontend and Node.js + Express + MongoDB on the backend. Features include adding members with photo uploads, viewing all members in a searchable grid, and viewing detailed member profiles.

**Design theme:** Dark minimalist noir with electric gold accents, animated particle backgrounds, and smooth micro-interactions.

---

## 🛠 Tech Stack

| Layer     | Technology                        |
|-----------|-----------------------------------|
| Frontend  | React.js, React Router v6, Axios  |
| Backend   | Node.js, Express.js               |
| Database  | MongoDB (Mongoose ODM)            |
| File Upload | Multer                          |
| Styling   | Pure CSS (custom design system)   |
| Fonts     | Syne + DM Sans (Google Fonts)     |

---

## 📁 Project Structure

```
team-app/
├── backend/
│   ├── server.js          # Express server, routes, Mongoose models
│   ├── package.json
│   └── uploads/           # Auto-created; stores uploaded images
│
└── frontend/
    ├── public/
    │   └── index.html
    └── src/
        ├── App.js              # Root component with React Router
        ├── index.js            # Entry point
        ├── index.css           # Global design tokens & utilities
        ├── App.css
        ├── components/
        │   ├── Navbar.js       # Sticky navigation bar
        │   └── Navbar.css
        └── pages/
            ├── Home.js         # Landing page with particle canvas
            ├── Home.css
            ├── AddMember.js    # Add member form with image upload
            ├── AddMember.css
            ├── ViewMembers.js  # Team grid with search & filter
            ├── ViewMembers.css
            ├── MemberDetails.js # Full member profile page
            └── MemberDetails.css
```

---

## ⚙️ Installation Steps

### Prerequisites
- [Node.js](https://nodejs.org/) v16+ installed
- [MongoDB](https://www.mongodb.com/try/download/community) running locally on port `27017`
- [MongoDB Compass](https://www.mongodb.com/products/compass) (optional, for GUI)

---

### 1. Clone the Repository

```bash
git clone https://github.com/<your-username>/TEAM-BLUE.git
cd TEAM-BLUE
```

---

### 2. Start the Backend

```bash
cd backend
npm install
node server.js
```

You should see:
```
✅ MongoDB Connected
🚀 Server running on http://localhost:5000
```

---

### 3. Start the Frontend

Open a **new terminal tab**:

```bash
cd frontend
npm install
npm start
```

The app opens at **http://localhost:3000**

---

## 🌐 API Endpoints

| Method | Endpoint           | Description                        |
|--------|--------------------|------------------------------------|
| GET    | `/members`         | Retrieve all team members          |
| GET    | `/members/:id`     | Retrieve a single member by ID     |
| POST   | `/members`         | Add a new member (multipart/form)  |
| DELETE | `/members/:id`     | Delete a member by ID              |
| GET    | `/api/members`     | Same as GET /members (browser test)|
| GET    | `/api/members/:id` | Same as GET /members/:id           |

### Testing API in Browser

```
# Get all members
http://localhost:5000/api/members

# Get single member (replace ID)
http://localhost:5000/api/members/64f1a2b3c4d5e6f7a8b9c0d1
```

### POST /members — Form Fields

| Field       | Type   | Required |
|-------------|--------|----------|
| name        | string | ✅       |
| roll        | string | ✅       |
| year        | string | ✅       |
| degree      | string | ✅       |
| email       | string | ✅       |
| role        | string | ✅       |
| project     | string | ❌       |
| hobbies     | string | ❌       |
| certificate | string | ❌       |
| internship  | string | ❌       |
| aboutAim    | string | ❌       |
| image       | file   | ❌       |

---

## 📱 Pages Overview

| Route          | Page             | Marks |
|----------------|------------------|-------|
| `/`            | Home / Landing   | 10    |
| `/add`         | Add Member       | 10    |
| `/view`        | View All Members | 5     |
| `/member/:id`  | Member Details   | 5     |

---

## ✨ Features

- 🎨 Dark minimalist design with animated gold particle canvas
- 📸 Profile photo upload with live preview
- 🔍 Real-time search + role-based filtering
- 💀 Skeleton loading states while fetching data
- 🍞 Toast notifications on form actions
- 📱 Fully responsive — mobile, tablet, desktop
- 🗑️ Delete members with confirmation
- 🔤 Initials fallback avatar when no photo uploaded
- ✅ Client-side form validation
- 🧭 React Router v6 for SPA navigation

---

## 👥 Team Members

| Name | Roll Number | Role |
|------|-------------|------|
| ...  | ...         | ...  |

---

## 📝 License

This project was created for academic purposes at SRM Institute of Science and Technology.
