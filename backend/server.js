const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const authRoutes = require('./routes/authRoutes');
const documentRoutes = require('./routes/documentRoutes');
const inquiryRoutes = require('./routes/inquiryRoutes');
const settingsRoutes = require('./routes/settingsRoutes');
const chatbotRoutes = require('./routes/chatbotRoutes');
const enrollmentRoutes = require('./routes/enrollmentRoutes');
const form137StubRoutes = require('./routes/form137StubRoutes');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/documentor', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes

app.use('/api/auth', authRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/form137-stubs', form137StubRoutes);

// Basic route for testing
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Documentor API' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 