const Inquiry = require('../models/Inquiry');

// Student: Create an inquiry
exports.createInquiry = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { message } = req.body;
    const inquiry = new Inquiry({ user: userId, message });
    await inquiry.save();
    res.status(201).json({ message: 'Inquiry submitted successfully', inquiry });
  } catch (error) {
    console.error('Error creating inquiry:', error);
    res.status(500).json({ message: 'Error creating inquiry' });
  }
};

// Student: Get my inquiries
exports.getMyInquiries = async (req, res) => {
  try {
    const userId = req.user.userId;
    const inquiries = await Inquiry.find({ user: userId }).sort({ createdAt: -1 });
    res.json(inquiries);
  } catch (error) {
    console.error('Error fetching inquiries:', error);
    res.status(500).json({ message: 'Error fetching inquiries' });
  }
};

// Admin: Get all inquiries
exports.getAllInquiries = async (req, res) => {
  try {
    const inquiries = await Inquiry.find().populate('user', 'firstName lastName email').sort({ createdAt: -1 });
    res.json(inquiries);
  } catch (error) {
    console.error('Error fetching all inquiries:', error);
    res.status(500).json({ message: 'Error fetching all inquiries' });
  }
};

// Admin: Get archived inquiries
exports.getArchivedInquiries = async (req, res) => {
  try {
    const inquiries = await Inquiry.find({ status: 'archived' })
      .populate('user', 'firstName lastName email')
      .sort({ archivedAt: -1 });
    res.json(inquiries);
  } catch (error) {
    console.error('Error fetching archived inquiries:', error);
    res.status(500).json({ message: 'Error fetching archived inquiries' });
  }
};

// Admin: Archive an inquiry
exports.archiveInquiry = async (req, res) => {
  try {
    const { inquiryId } = req.params;
    const inquiry = await Inquiry.findByIdAndUpdate(
      inquiryId,
      { 
        status: 'archived',
        archivedAt: new Date()
      },
      { new: true }
    );
    if (!inquiry) return res.status(404).json({ message: 'Inquiry not found' });
    res.json(inquiry);
  } catch (error) {
    console.error('Error archiving inquiry:', error);
    res.status(500).json({ message: 'Error archiving inquiry' });
  }
};

// Admin: Update inquiry status
exports.updateInquiryStatus = async (req, res) => {
  try {
    const { inquiryId } = req.params;
    const { status } = req.body;
    const currentDate = new Date();
    
    const update = {
      status,
      ...(status === 'resolved' ? { 
        resolvedAt: currentDate,
        resolvedBy: req.user.name || req.user.email
      } : {}),
      ...(status === 'archived' ? { 
        archivedAt: currentDate,
        resolvedAt: currentDate // Ensure resolved date is set if not already
      } : {})
    };
    
    const inquiry = await Inquiry.findByIdAndUpdate(
      inquiryId,
      update,
      { new: true }
    ).populate('user', 'firstName lastName email');
    
    if (!inquiry) return res.status(404).json({ message: 'Inquiry not found' });
    
    res.json(inquiry);
  } catch (error) {
    console.error('Error updating inquiry status:', error);
    res.status(500).json({ message: 'Error updating inquiry status' });
  }
};

// Admin: Reply to inquiry
exports.replyToInquiry = async (req, res) => {
  try {
    const { inquiryId } = req.params;
    const { message, repliedBy } = req.body;
    const inquiry = await Inquiry.findById(inquiryId);
    if (!inquiry) return res.status(404).json({ message: 'Inquiry not found' });
    inquiry.replies.push({ message, repliedBy });
    await inquiry.save();
    res.json(inquiry);
  } catch (error) {
    console.error('Error replying to inquiry:', error);
    res.status(500).json({ message: 'Error replying to inquiry' });
  }
};
