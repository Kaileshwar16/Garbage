const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

if (!fs.existsSync('./uploads')) fs.mkdirSync('./uploads');

mongoose.connect('mongodb://localhost:27017/teamblue', {
  useNewUrlParser: true, useUnifiedTopology: true,
}).then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.log('❌ MongoDB Error:', err));

const memberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  roll: { type: String, required: true },
  year: { type: String, required: true },
  degree: { type: String, required: true },
  email: { type: String, required: true },
  role: { type: String, required: true },
  project: String, hobbies: String,
  certificate: String, internship: String, aboutAim: String,
  image: String,
  createdAt: { type: Date, default: Date.now }
});

const Member = mongoose.model('Member', memberSchema);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + Math.round(Math.random()*1e9) + path.extname(file.originalname))
});
const upload = multer({ storage });

app.post('/members', upload.single('image'), async (req, res) => {
  try {
    const { name, roll, year, degree, email, role, project, hobbies, certificate, internship, aboutAim } = req.body;
    if (!name || !roll || !year || !degree || !email || !role)
      return res.status(400).json({ error: 'Required fields missing' });
    const member = new Member({ name, roll, year, degree, email, role, project, hobbies, certificate, internship, aboutAim, image: req.file?.filename || null });
    await member.save();
    res.status(201).json({ message: 'Member added', member });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/members', async (req, res) => {
  try { res.json(await Member.find().sort({ createdAt: -1 })); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/members/:id', async (req, res) => {
  try {
    const m = await Member.findById(req.params.id);
    if (!m) return res.status(404).json({ error: 'Not found' });
    res.json(m);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/members/:id', async (req, res) => {
  try {
    const m = await Member.findByIdAndDelete(req.params.id);
    if (!m) return res.status(404).json({ error: 'Not found' });
    if (m.image) { const p = path.join(__dirname, 'uploads', m.image); if (fs.existsSync(p)) fs.unlinkSync(p); }
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/members', async (req, res) => {
  try { res.json(await Member.find().sort({ createdAt: -1 })); }
  catch (err) { res.status(500).json({ error: err.message }); }
});
app.get('/api/members/:id', async (req, res) => {
  try {
    const m = await Member.findById(req.params.id);
    if (!m) return res.status(404).json({ error: 'Not found' });
    res.json(m);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
