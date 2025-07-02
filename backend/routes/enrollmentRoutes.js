const express = require('express');
const router = express.Router();
const enrollmentController = require('../controllers/enrollmentController');
const { authenticate, authorizeAdmin, preventAdminSubmission } = require('../middleware/authMiddleware');
const { uploadEnrollmentDocs } = require('../middleware/uploadMiddleware');

// Public/Student: Submit enrollment with file uploads
router.post('/', uploadEnrollmentDocs, enrollmentController.createEnrollment);

// Student: Get my enrollment status
router.get('/my-status', authenticate, enrollmentController.getMyEnrollmentStatus);

// Admin: Get all enrollments
router.get('/admin', authenticate, authorizeAdmin, enrollmentController.getAllEnrollments);

// Admin: Update enrollment status
router.put('/:id/status', authenticate, authorizeAdmin, enrollmentController.updateEnrollmentStatus);

module.exports = router;
