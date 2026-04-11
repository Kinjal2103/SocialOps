require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const dashboardRoutes = require('./routes/dashboard');
const postRoutes = require('./routes/posts');
const schedulerRoutes = require('./routes/scheduler');
const analyticsRoutes = require('./routes/analytics');
const integrationRoutes = require('./routes/integrations');

const app = express();

app.use(cors({
  origin: 'http://localhost:3000'
}));

app.use(express.json());

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/socialops')
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.log('MongoDB configuration error: ', err));

app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/scheduler', schedulerRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/integrations', integrationRoutes);

const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
