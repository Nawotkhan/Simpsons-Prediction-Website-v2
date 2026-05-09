const express  = require('express');
const mongoose = require('mongoose');
const cors     = require('cors');
require('dotenv').config();
const path     = require('path');
const fs       = require('fs');

const app = express();

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true
}));
app.use(express.json());
app.use('/uploads', express.static(uploadsDir));

// Routes
app.use('/api/auth',        require('./routes/auth'));
app.use('/api/predictions', require('./routes/predictions'));
app.use('/api/reviews',     require('./routes/reviews'));

// Connect and seed admin
mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('MongoDB connected');
    await mongoose.connection.collection('users').dropIndex('username_1').catch(() => {});
    await seedAdmin();
  })
  .catch(err => console.error('MongoDB error:', err));

async function seedAdmin() {
  const User   = require('./models/User');
  const bcrypt = require('bcryptjs');
  const existing = await User.findOne({ email: process.env.ADMIN_EMAIL });
  if (!existing) {
    const hashed = await bcrypt.hash(process.env.ADMIN_PASSWORD, 12);
    await User.create({
      name:     'Admin',
      email:    process.env.ADMIN_EMAIL,
      password: hashed,
      role:     'admin',
      university: 'FAST NUCES',
      semester:   'N/A',
    });
    console.log('Admin account created:', process.env.ADMIN_EMAIL);
  }
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));