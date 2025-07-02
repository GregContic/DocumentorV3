const Enrollment = require('../models/Enrollment');
const { sendEnrollmentStatusEmail } = require('../utils/emailService');

// Create new enrollment with file uploads
exports.createEnrollment = async (req, res) => {
  try {
    const enrollmentData = { ...req.body };
    
    // If user is authenticated, link the enrollment to the user
    if (req.user && req.user.userId) {
      enrollmentData.user = req.user.userId;
    }
    
    // Handle uploaded files
    if (req.files) {
      if (req.files.form137File) {
        enrollmentData.form137File = req.files.form137File[0].path;
      }
      if (req.files.form138File) {
        enrollmentData.form138File = req.files.form138File[0].path;
      }
      if (req.files.goodMoralFile) {
        enrollmentData.goodMoralFile = req.files.goodMoralFile[0].path;
      }
      if (req.files.medicalCertificateFile) {
        enrollmentData.medicalCertificateFile = req.files.medicalCertificateFile[0].path;
      }
      if (req.files.parentIdFile) {
        enrollmentData.parentIdFile = req.files.parentIdFile[0].path;
      }
      if (req.files.idPicturesFile) {
        enrollmentData.idPicturesFile = req.files.idPicturesFile[0].path;
      }
    }
    
    const enrollment = new Enrollment(enrollmentData);
    await enrollment.save();
    
    res.status(201).json({ 
      message: 'Enrollment submitted successfully', 
      enrollment,
      enrollmentNumber: enrollment.enrollmentNumber
    });
  } catch (error) {
    console.error('Enrollment submission error:', error);
    res.status(400).json({ message: 'Failed to submit enrollment', error: error.message });
  }
};

// Get user's enrollment status
exports.getMyEnrollmentStatus = async (req, res) => {
  try {
    const enrollment = await Enrollment.findOne({ user: req.user.userId })
      .populate('reviewedBy', 'firstName lastName')
      .sort({ createdAt: -1 });
    
    if (!enrollment) {
      return res.json({ 
        hasEnrollment: false,
        message: 'No enrollment found. You can submit an enrollment application.'
      });
    }
    
    res.json({
      hasEnrollment: true,
      enrollment
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch enrollment status', error: error.message });
  }
};

// Get all enrollments (admin)
exports.getAllEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find()
      .populate('user', 'firstName lastName email')
      .populate('reviewedBy', 'firstName lastName')
      .sort({ createdAt: -1 });
    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch enrollments', error: error.message });
  }
};

// Update enrollment status (admin)
exports.updateEnrollmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, reviewNotes } = req.body;
    
    const updateData = {
      status,
      reviewNotes,
      reviewedBy: req.user.userId,
      reviewedAt: new Date()
    };
    
    const enrollment = await Enrollment.findByIdAndUpdate(id, updateData, { new: true })
      .populate('user', 'firstName lastName email')
      .populate('reviewedBy', 'firstName lastName');
    
    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }

    // Send email notification for approved or rejected status
    if (status === 'approved' || status === 'rejected') {
      try {
        await sendEnrollmentStatusEmail(enrollment, status, reviewNotes);
        console.log(`Email sent for enrollment ${enrollment._id} with status ${status}`);
      } catch (emailError) {
        console.error('Failed to send email notification:', emailError);
        // Don't fail the status update if email fails
      }
    }
    
    res.json({ 
      message: 'Enrollment status updated successfully', 
      enrollment 
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update enrollment status', error: error.message });
  }
};
