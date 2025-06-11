const DocumentRequest = require('../models/DocumentRequest');
const User = require('../models/User');

// User: Create a new document request
exports.createRequest = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { documentType, purpose, preferredPickupDate, preferredPickupTime, additionalNotes } = req.body;
    const request = new DocumentRequest({
      user: userId,
      documentType,
      purpose,
      preferredPickupDate,
      preferredPickupTime,
      additionalNotes
    });
    await request.save();
    res.status(201).json({ message: 'Request submitted successfully', request });
  } catch (error) {
    console.error('Error creating request:', error);
    res.status(500).json({ message: 'Error creating request' });
  }
};

// User: Get my requests
exports.getMyRequests = async (req, res) => {
  try {
    const userId = req.user.userId;
    const requests = await DocumentRequest.find({ user: userId }).sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    console.error('Error fetching user requests:', error);
    res.status(500).json({ message: 'Error fetching requests' });
  }
};

// Admin: Get all requests
exports.getAllRequests = async (req, res) => {
  try {
    const requests = await DocumentRequest.find().populate('user', 'firstName lastName email').sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    console.error('Error fetching all requests:', error);
    res.status(500).json({ message: 'Error fetching all requests' });
  }
};

// Admin: Update request status
exports.updateRequestStatus = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { status } = req.body;
    const request = await DocumentRequest.findByIdAndUpdate(
      requestId,
      { status },
      { new: true }
    );
    if (!request) return res.status(404).json({ message: 'Request not found' });
    res.json(request);
  } catch (error) {
    console.error('Error updating request status:', error);
    res.status(500).json({ message: 'Error updating request status' });
  }
};
