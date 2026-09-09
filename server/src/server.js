require("dotenv").config();

const connectDB = require("./config/db");
const express = require('express');

connectDB();

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.send('API is running');
});

const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});