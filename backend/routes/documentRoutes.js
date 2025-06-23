const express = require('express');
const router = express.Router();
const documentController = require('../controllers/documentController');
const { authenticate, authorizeAdmin } = require('../middleware/authMiddleware');

// User routes
router.post('/request', authenticate, documentController.createRequest);
router.get('/my-requests', authenticate, documentController.getMyRequests);
router.get('/request/:requestId', authenticate, documentController.getRequestById);

// Admin routes
router.get('/admin/documents/requests', authenticate, authorizeAdmin, documentController.getAllRequests);
router.patch('/admin/documents/request/:requestId/status', authenticate, authorizeAdmin, documentController.updateRequestStatus);
router.get('/admin/documents/archived-requests', authenticate, authorizeAdmin, documentController.getArchivedRequests);
router.post('/admin/documents/bulk-archive-completed', authenticate, authorizeAdmin, documentController.bulkArchiveCompletedRequests);
router.patch('/admin/documents/request/:requestId/archive', authenticate, authorizeAdmin, documentController.archiveRequest);
router.patch('/admin/documents/request/:requestId/restore', authenticate, authorizeAdmin, documentController.restoreArchivedRequest);

module.exports = router;
