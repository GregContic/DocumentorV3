const DocumentRequest = require('../models/DocumentRequest');
const User = require('../models/User');

// User: Create a new document request
exports.createRequest = async (req, res) => {
  try {
    const userId = req.user.userId;
    const requestData = {
      user: userId,
      ...req.body // This will include all the form fields from the frontend
    };
    
    const request = new DocumentRequest(requestData);
    await request.save();
    res.status(201).json({ 
      message: 'Request submitted successfully', 
      request: {
        id: request._id,
        documentType: request.documentType,
        status: request.status,
        createdAt: request.createdAt
      }
    });
  } catch (error) {
    console.error('Error creating request:', error);
    res.status(500).json({ 
      message: 'Error creating request',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// User: Get my requests
exports.getMyRequests = async (req, res) => {
  try {
    const userId = req.user.userId;
    
    // Ensure the user can only access their own requests
    const requests = await DocumentRequest.find({ user: userId })
      .sort({ createdAt: -1 })
      .lean(); // Use lean() for better performance
    
    res.json({
      success: true,
      data: requests,
      count: requests.length
    });
  } catch (error) {
    console.error('Error fetching user requests:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error fetching requests',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// User: Get a specific request by ID (only if it belongs to the user)
exports.getRequestById = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { requestId } = req.params;
    
    // Find request that belongs to the authenticated user
    const request = await DocumentRequest.findOne({ 
      _id: requestId, 
      user: userId 
    }).lean();
    
    if (!request) {
      return res.status(404).json({ 
        success: false,
        message: 'Request not found or access denied' 
      });
    }
    
    res.json({
      success: true,
      data: request
    });
  } catch (error) {
    console.error('Error fetching request:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error fetching request',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
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
