const express = require('express');
const router = express.Router();
const enrollmentController = require('../controllers/enrollmentController');
const { authenticate, authorizeAdmin } = require('../middleware/authMiddleware');

// Public: Submit enrollment (no authentication required)
router.post('/', enrollmentController.createEnrollment);

// Admin: Get all enrollments
router.get('/admin', authenticate, authorizeAdmin, enrollmentController.getAllEnrollments);

module.exports = router;
