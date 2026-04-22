const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Ensure uploads folder exists
if (!fs.existsSync('./uploads')) {
  fs.mkdirSync('./uploads');
}

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/teammanagement', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.log('❌ MongoDB Error:', err));

// Member Schema
const memberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  roll: { type: String, required: true },
  year: { type: String, required: true },
  degree: { type: String, required: true },
  email: { type: String, required: true },
  role: { type: String, required: true },
  project: { type: String },
  hobbies: { type: String },
  certificate: { type: String },
  internship: { type: String },
  aboutAim: { type: String },
  image: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const Member = mongoose.model('Member', memberSchema);

// Multer Storage Config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// ──────────────────────────────
// API ROUTES
// ──────────────────────────────

// POST /members – Add a new member
app.post('/members', upload.single('image'), async (req, res) => {
  try {
    const { name, roll, year, degree, email, role, project, hobbies, certificate, internship, aboutAim } = req.body;
    if (!name || !roll || !year || !degree || !email || !role) {
      return res.status(400).json({ error: 'Required fields missing' });
    }
    const member = new Member({
      name, roll, year, degree, email, role,
      project, hobbies, certificate, internship, aboutAim,
      image: req.file ? req.file.filename : null
    });
    await member.save();
    res.status(201).json({ message: 'Member added successfully', member });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /members – Get all members
app.get('/members', async (req, res) => {
  try {
    const members = await Member.find().sort({ createdAt: -1 });
    res.json(members);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /members/:id – Get single member
app.get('/members/:id', async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);
    if (!member) return res.status(404).json({ error: 'Member not found' });
    res.json(member);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /members/:id – Delete a member
app.delete('/members/:id', async (req, res) => {
  try {
    const member = await Member.findByIdAndDelete(req.params.id);
    if (!member) return res.status(404).json({ error: 'Member not found' });
    // Remove image file if exists
    if (member.image) {
      const imgPath = path.join(__dirname, 'uploads', member.image);
      if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
    }
    res.json({ message: 'Member deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Also expose under /api/ prefix for browser testing
app.get('/api/members', async (req, res) => {
  try {
    const members = await Member.find().sort({ createdAt: -1 });
    res.json(members);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/members/:id', async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);
    if (!member) return res.status(404).json({ error: 'Member not found' });
    res.json(member);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
