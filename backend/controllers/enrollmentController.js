const Enrollment = require('../models/Enrollment');

// Create new enrollment
exports.createEnrollment = async (req, res) => {
  try {
    const enrollment = new Enrollment(req.body);
    await enrollment.save();
    res.status(201).json({ message: 'Enrollment submitted successfully', enrollment });
  } catch (error) {
    res.status(400).json({ message: 'Failed to submit enrollment', error: error.message });
  }
};

// Get all enrollments (admin)
exports.getAllEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find().sort({ createdAt: -1 });
    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch enrollments', error: error.message });
  }
};
