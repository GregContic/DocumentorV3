const express = require('express');
const router = express.Router();
const documentController = require('../controllers/documentController');
const { authenticate, authorizeAdmin } = require('../middleware/authMiddleware');

// User routes
router.post('/request', authenticate, documentController.createRequest);
router.get('/my-requests', authenticate, documentController.getMyRequests);

// Admin routes
router.get('/admin/documents/requests', authenticate, authorizeAdmin, documentController.getAllRequests);
router.patch('/admin/documents/request/:requestId/status', authenticate, authorizeAdmin, documentController.updateRequestStatus);

module.exports = router;
