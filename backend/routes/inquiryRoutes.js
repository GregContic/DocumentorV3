const express = require('express');
const router = express.Router();
const inquiryController = require('../controllers/inquiryController');
const { authenticate, authorizeAdmin } = require('../middleware/authMiddleware');

// Student routes
router.post('/', authenticate, inquiryController.createInquiry);
router.get('/my-inquiries', authenticate, inquiryController.getMyInquiries);

// Admin routes
router.get('/admin/inquiries', authenticate, authorizeAdmin, inquiryController.getAllInquiries);
router.get('/admin/archived-inquiries', authenticate, authorizeAdmin, inquiryController.getArchivedInquiries);
router.patch('/admin/inquiries/:inquiryId/status', authenticate, authorizeAdmin, inquiryController.updateInquiryStatus);
router.patch('/admin/inquiries/:inquiryId/archive', authenticate, authorizeAdmin, inquiryController.archiveInquiry);
router.post('/admin/inquiries/:inquiryId/reply', authenticate, authorizeAdmin, inquiryController.replyToInquiry);

module.exports = router;
