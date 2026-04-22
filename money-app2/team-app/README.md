# ⚡ TEAM BLUE — Student Team Members Management Application

> Full Stack Development · SRM Institute of Science and Technology  
> Course: 21CSS301T | CLAT-2 Assessment | Academic Year 2024-25

---

## 🎨 Design Theme

**Cyberpunk Holographic UI** — Deep void black + electric cyan + magenta accents  
Fonts: Orbitron (headers) · Rajdhani (body) · Share Tech Mono (code/labels)

### Creative Features
- 🎯 **Custom magnetic cursor** with lag ring and hover morphing
- 🔷 **Animated hex grid** canvas background on homepage
- ✍️ **Typewriter effect** cycling through team taglines
- 🌊 **3D tilt cards** with mouse-tracking perspective + glare
- 📡 **Holographic scan line** animation on image hover
- 📺 **CRT scan lines** + film grain overlay on entire UI
- 🕐 **Live HUD clock** in navbar
- 🔢 **Multi-step form** with animated progress tracker
- 🔍 **Grid / List view toggle** on roster page
- 📊 **Animated loading bars** on member detail fetch
- 🔃 **Scrolling data ticker** strip on homepage
- 🧊 **Corner bracket decorators** on all panels

---

## 🛠 Tech Stack

| Layer      | Technology                       |
|------------|----------------------------------|
| Frontend   | React.js 18, React Router v6, Axios |
| Backend    | Node.js, Express.js              |
| Database   | MongoDB (Mongoose ODM)           |
| File Upload| Multer                           |
| Styling    | Pure CSS custom design system    |
| Fonts      | Orbitron + Rajdhani + Share Tech Mono |

---

## 📁 Project Structure

```
team-app/
├── backend/
│   ├── server.js          # Express server + all API routes + Mongoose model
│   ├── package.json
│   └── uploads/           # Auto-created folder for profile images
│
└── frontend/
    ├── public/index.html
    └── src/
        ├── App.js              # Root with cursor effect + React Router
        ├── index.css           # Full cyberpunk design system (variables, tokens)
        ├── components/
        │   ├── Navbar.js       # Sticky HUD nav with live clock
        │   └── Navbar.css
        └── pages/
            ├── Home.js         # Hero with hex canvas + typewriter + particle orbs
            ├── AddMember.js    # Multi-step form (3 steps) + image upload
            ├── ViewMembers.js  # Grid/List toggle + 3D tilt cards + search/filter
            └── MemberDetails.js # Full holographic profile page
```

---

## ⚙️ Installation Steps

### Prerequisites
- [Node.js](https://nodejs.org/) v16+
- [MongoDB Community](https://www.mongodb.com/try/download/community) running on `localhost:27017`
- [MongoDB Compass](https://www.mongodb.com/products/compass) (optional GUI)

### 1. Clone the Repository

```bash
git clone https://github.com/<your-username>/TEAM-BLUE.git
cd TEAM-BLUE
```

### 2. Start the Backend

```bash
cd backend
npm install
node server.js
```

Expected output:
```
✅ MongoDB Connected
🚀 Server running on http://localhost:5000
```

### 3. Start the Frontend

Open a new terminal:

```bash
cd frontend
npm install
npm start
```

App opens at **http://localhost:3000**

---

## 🌐 API Endpoints

| Method | Endpoint           | Description                           |
|--------|--------------------|---------------------------------------|
| GET    | `/members`         | Retrieve all members (sorted newest)  |
| GET    | `/members/:id`     | Retrieve single member by MongoDB ID  |
| POST   | `/members`         | Add new member (multipart/form-data)  |
| DELETE | `/members/:id`     | Delete member + remove uploaded image |
| GET    | `/api/members`     | Alias — testable directly in browser  |
| GET    | `/api/members/:id` | Alias — testable directly in browser  |

### Testing API in Browser

```
# All members
http://localhost:5000/api/members

# Single member (replace with real ID)
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

| Route          | Page           | Marks |
|----------------|----------------|-------|
| `/`            | Home / Landing | 10    |
| `/add`         | Add Member     | 10    |
| `/view`        | View Roster    | 5     |
| `/member/:id`  | Profile Detail | 5     |

---

## 👥 Team Members

| Name | Roll Number | Role |
|------|-------------|------|
| ...  | ...         | ...  |

---

## 📝 License

Academic project — SRM Institute of Science and Technology, 2024-25.
