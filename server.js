require('dotenv').config();
const express = require('express');
const connectDB = require('./Config/db');
const userRoutes = require('./Routes/userRoutes'); 

const app = express();

connectDB();

app.use(express.json());

app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
