import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Grid,
  TextField,
  Button,
  Box,
  Stepper,
  Step,
  StepLabel,
  Alert,
  Snackbar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from '@mui/material';
import {
  Send as SendIcon,
  CheckCircle as CheckIcon,
  Description as DescriptionIcon,
  School as SchoolIcon,
  Assignment as AssignmentIcon,
  Info as InfoIcon,
  Download as DownloadIcon,
  Login as LoginIcon,
} from '@mui/icons-material';
import { PDFDownloadLink } from '@react-pdf/renderer';
import Form137PDF from '../../components/PDFTemplates/Form137PDF';
import Form137PDFWithQR from '../../components/PDFTemplates/Form137PDFWithQR';
import { DatePickerWrapper, DatePicker } from '../../components/DatePickerWrapper';
import { documentService } from '../../services/api';
import AIDocumentUploader from '../../components/AIDocumentUploader';
import AIAssistantCard from '../../components/AIAssistantCard';
import FormAssistantChatCard from '../../components/FormAssistantChatCard';
import { useAuth } from '../../context/AuthContext';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

const Form137Request = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();const [formData, setFormData] = useState({
    documentType: 'Form 137',
    // Learner's Personal Information
    surname: '',
    firstName: '',
    middleName: '',
    sex: '',
    dateOfBirth: null,
    barangay: '',
    city: '',
    province: '',
    learnerReferenceNumber: '',
    // Parent/Guardian Information
    parentGuardianName: '',
    parentGuardianAddress: '',
  });  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showAIUploader, setShowAIUploader] = useState(false);

  const requirements = [
    'Valid School ID or Any Valid Government ID',
    'Authorization Letter (if not the student)',
    'Proof of Payment',
    'Request Form (will be provided)',
  ];

  const steps = ['Learner Information', 'Parent/Guardian Info', 'Review & Submit'];  const validateStep = (stepIndex) => {
    const newErrors = {};

    switch (stepIndex) {
      case 0: // Learner Information
        if (!formData.surname.trim()) newErrors.surname = 'Surname is required';
        if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
        if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
        if (!formData.sex) newErrors.sex = 'Sex is required';
        if (!formData.barangay.trim()) newErrors.barangay = 'Barangay is required for place of birth';
        if (!formData.city.trim()) newErrors.city = 'City/Municipality is required for place of birth';
        if (!formData.province.trim()) newErrors.province = 'Province is required for place of birth';
        if (!formData.learnerReferenceNumber.trim()) newErrors.learnerReferenceNumber = 'Learner Reference Number (LRN) is required';
        break;
      case 1: // Parent/Guardian Information
        if (!formData.parentGuardianName.trim()) newErrors.parentGuardianName = 'Parent/Guardian name is required';
        if (!formData.parentGuardianAddress.trim()) newErrors.parentGuardianAddress = 'Parent/Guardian address is required';
        break;
      default:
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    const isValid = validateStep(activeStep);
    
    if (isValid) {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault(); // Prevent form from submitting
  };  const handleSubmit = async () => {
    if (!validateStep(activeStep)) return;

    // Check authentication before submitting
    if (!isAuthenticated) {
      setErrorMessage('Please log in to submit your request.');
      setShowError(true);
      return;
    }

    setLoading(true);
    try {
      console.log('Submitting form data:', formData);
      const response = await documentService.createRequest(formData);
      console.log('Submission response:', response);
      setShowSuccess(true);      // Reset form
      setFormData({
        documentType: 'Form 137',
        // Learner's Personal Information
        surname: '',
        firstName: '',
        middleName: '',
        sex: '',
        dateOfBirth: null,
        barangay: '',
        city: '',
        province: '',
        learnerReferenceNumber: '',
        // Parent/Guardian Information
        parentGuardianName: '',
        parentGuardianAddress: '',
      });
      setActiveStep(0);
    } catch (error) {
      console.error('Submission error:', error);
      console.error('Error response:', error.response);
        // More detailed error handling
      let errorMsg = 'Failed to submit request. Please try again.';
      if (error.response?.status === 401) {
        errorMsg = 'You need to be logged in to submit a request. Please log in and try again.';
      } else if (error.response?.status === 400) {
        errorMsg = 'Invalid form data. Please check your inputs and try again.';
      } else if (error.response?.data?.message) {
        errorMsg = error.response.data.message;
      } else if (!isAuthenticated) {
        errorMsg = 'Please log in to submit your request.';
      }
      
      setErrorMessage(errorMsg);
      setShowError(true);
    } finally {
      setLoading(false);
    }
  };
  const renderStepContent = (step) => {
    switch (step) {      case 0: // Learner Information
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Learner's Personal Information
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Fill out the learner's personal information below. You can use our AI assistant to automatically extract information from document images.
              </Typography>
            </Grid>            
            
            {/* Form Assistant Chat Card */}
            <Grid item xs={12}>
              <FormAssistantChatCard
                onAIUpload={() => setShowAIUploader(true)}
                formType="Form 137"
              />
            </Grid>
            
            {/* AI Assistant Card */}
            <Grid item xs={12}>
              <AIAssistantCard
                show={!showAIUploader}
                onStartAIProcessing={() => setShowAIUploader(true)}
              />
            </Grid>
            
            {/* AI Document Uploader */}
            {showAIUploader && (
              <Grid item xs={12}>
                <AIDocumentUploader
                  formData={formData}
                  setFormData={setFormData}
                  onDataExtracted={(extractedData, confidence) => {
                    console.log('AI extracted data:', extractedData);
                    console.log('Confidence score:', confidence);
                  }}
                />
              </Grid>
            )}
            
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom sx={{ mt: 2, color: 'primary.main' }}>
                Full Name
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                required
                label="Surname (Last Name)"
                value={formData.surname}
                onChange={(e) => setFormData(prev => ({ ...prev, surname: e.target.value }))}
                error={!!errors.surname}
                helperText={errors.surname}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                required
                label="First Name"
                value={formData.firstName}
                onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                error={!!errors.firstName}
                helperText={errors.firstName}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Middle Name"
                value={formData.middleName}
                onChange={(e) => setFormData(prev => ({ ...prev, middleName: e.target.value }))}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required error={!!errors.sex}>
                <InputLabel>Sex</InputLabel>
                <Select
                  value={formData.sex}
                  label="Sex"
                  onChange={(e) => setFormData(prev => ({ ...prev, sex: e.target.value }))}
                >
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                </Select>
                {errors.sex && <FormHelperText>{errors.sex}</FormHelperText>}
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <DatePickerWrapper>
                <DatePicker
                  label="Date of Birth"
                  value={formData.dateOfBirth}
                  onChange={(newValue) => setFormData(prev => ({ ...prev, dateOfBirth: newValue }))}
                  textFieldProps={{
                    fullWidth: true,
                    required: true,
                    error: !!errors.dateOfBirth,
                    helperText: errors.dateOfBirth,
                  }}
                />
              </DatePickerWrapper>
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom sx={{ mt: 2, color: 'primary.main' }}>
                Place of Birth
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                required
                label="Barangay"
                value={formData.barangay}
                onChange={(e) => setFormData(prev => ({ ...prev, barangay: e.target.value }))}
                error={!!errors.barangay}
                helperText={errors.barangay}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                required
                label="City/Municipality"
                value={formData.city}
                onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                error={!!errors.city}
                helperText={errors.city}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                required
                label="Province"
                value={formData.province}
                onChange={(e) => setFormData(prev => ({ ...prev, province: e.target.value }))}
                error={!!errors.province}
                helperText={errors.province}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label="Learner Reference Number (LRN)"
                value={formData.learnerReferenceNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, learnerReferenceNumber: e.target.value }))}
                error={!!errors.learnerReferenceNumber}
                helperText={errors.learnerReferenceNumber || 'Enter the 12-digit LRN'}
                placeholder="e.g., 123456789012"
              />
            </Grid>
          </Grid>
        );      case 1: // Parent/Guardian Information
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Parent/Guardian Details
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label="Name of Parent or Guardian"
                value={formData.parentGuardianName}
                onChange={(e) => setFormData(prev => ({ ...prev, parentGuardianName: e.target.value }))}
                error={!!errors.parentGuardianName}
                helperText={errors.parentGuardianName}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label="Address of Parent or Guardian"
                value={formData.parentGuardianAddress}
                onChange={(e) => setFormData(prev => ({ ...prev, parentGuardianAddress: e.target.value }))}
                error={!!errors.parentGuardianAddress}
                helperText={errors.parentGuardianAddress}
                multiline
                rows={4}
                placeholder="Complete address including barangay, city/municipality, and province"
              />
            </Grid>
          </Grid>
        );

      case 2: // Review & Submit
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Review Your Request
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Paper sx={{ p: 3 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <DescriptionIcon sx={{ mr: 1 }} color="primary" />
                      <Typography variant="subtitle1">Form 137 (Permanent Record)</Typography>
                    </Box>
                    <Divider sx={{ my: 2 }} />
                  </Grid>
                  
                  {/* Learner Information */}
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>Learner's Personal Information:</Typography>
                    <Typography paragraph>
                      <strong>Full Name:</strong> {formData.surname}, {formData.firstName} {formData.middleName}<br/>
                      <strong>Sex:</strong> {formData.sex}<br/>
                      <strong>Date of Birth:</strong> {formData.dateOfBirth ? new Date(formData.dateOfBirth).toLocaleDateString() : 'Not provided'}<br/>
                      <strong>Place of Birth:</strong> {[formData.barangay, formData.city, formData.province].filter(Boolean).join(', ')}<br/>
                      <strong>Learner Reference Number (LRN):</strong> {formData.learnerReferenceNumber}
                    </Typography>
                  </Grid>

                  {/* Parent/Guardian Information */}
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>Parent/Guardian Details:</Typography>
                    <Typography paragraph>
                      <strong>Name:</strong> {formData.parentGuardianName}<br/>
                      <strong>Address:</strong> {formData.parentGuardianAddress}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <Paper sx={{ p: 3, bgcolor: 'primary.light', color: 'primary.contrastText' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <InfoIcon sx={{ mr: 1 }} />
                  <Typography variant="subtitle1">Required Documents for Pickup</Typography>
                </Box>
                <List dense>
                  {requirements.map((req, index) => (
                    <ListItem key={index}>
                      <ListItemIcon sx={{ color: 'inherit' }}>
                        <CheckIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary={req} />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </Grid>
          </Grid>
        );default:
        return null;
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper 
        elevation={3} 
        sx={{ 
          p: { xs: 2, md: 4 },
          background: 'linear-gradient(to bottom, #ffffff, #f8f9fa)',
          borderRadius: '16px',
          transition: 'transform 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)',
          }
        }}
      >        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          mb: 4,
          background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
          borderRadius: '12px',
          p: 2,
          color: 'white'
        }}>
          <SchoolIcon sx={{ fontSize: 40, mr: 2 }} />
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
              Form 137 Request
            </Typography>
            {!isAuthenticated && (
              <Typography variant="body2" sx={{ mt: 1, opacity: 0.9 }}>
                Please log in to submit your request
              </Typography>
            )}
          </Box>
          {!isAuthenticated && (
            <Button
              variant="contained"
              color="secondary"
              onClick={() => navigate('/login')}
              startIcon={<LoginIcon />}
              sx={{
                bgcolor: 'rgba(255, 255, 255, 0.2)',
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.3)',
                }
              }}
            >
              Login
            </Button>
          )}
        </Box>        <Stepper 
          activeStep={activeStep} 
          sx={{ 
            mb: 4,
            '& .MuiStepLabel-root .Mui-completed': {
              color: 'success.main',
            },
            '& .MuiStepLabel-root .Mui-active': {
              color: 'primary.main',
            }
          }}
        >
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {!isAuthenticated && (
          <Alert severity="warning" sx={{ mb: 3 }}>
            <Typography variant="body2">
              You need to be logged in to submit this form. You can still fill out the form and download it as PDF, 
              but you'll need to{' '}
              <Button 
                component={RouterLink} 
                to="/login" 
                color="inherit" 
                sx={{ textDecoration: 'underline', p: 0, minWidth: 'auto' }}
              >
                log in
              </Button>
              {' '}to submit it online.
            </Typography>
          </Alert>
        )}

        <form onSubmit={handleFormSubmit} noValidate>
          <Box sx={{ 
            mt: 4, 
            mb: 4,
            '& .MuiTextField-root': {
              transition: 'transform 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateY(-2px)',
              }
            }
          }}>
            {renderStepContent(activeStep)}
          </Box>          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            mt: 4,
            gap: 2,
            flexWrap: 'wrap'
          }}>
            <Button
              type="button"
              onClick={handleBack}
              disabled={activeStep === 0 || loading}
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: '8px',
                color: 'text.secondary',
                '&:not(:disabled)': {
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.04)',
                    transform: 'translateY(-1px)',
                  }
                }
              }}
            >
              Back
            </Button>
            <Box sx={{ display: 'flex', gap: 2 }}>
              {!isAuthenticated && activeStep === steps.length - 1 && (
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => navigate('/login')}
                  startIcon={<LoginIcon />}
                  sx={{
                    px: 4,
                    py: 1.5,
                    borderRadius: '8px',
                    '&:hover': {
                      transform: 'translateY(-1px)',
                    }
                  }}
                >
                  Login to Submit
                </Button>
              )}
              {activeStep === steps.length - 1 && (
                <Form137PDFWithQR
                  formData={formData}
                  fileName={`form137_request_${formData.learnerReferenceNumber || 'draft'}.pdf`}
                  variant="outlined"
                  color="primary"
                  sx={{
                    borderWidth: 2,
                    '&:hover': {
                      borderWidth: 2,
                      transform: 'translateY(-1px)',
                      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                    }
                  }}
                >
                  Download PDF
                </Form137PDFWithQR>
              )}
              <Button
                type="button"
                variant="contained"
                color="primary"
                onClick={activeStep === steps.length - 1 ? handleSubmit : handleNext}
                endIcon={activeStep === steps.length - 1 ? (loading ? <CircularProgress size={24} /> : <SendIcon />) : undefined}
                disabled={loading || (activeStep === steps.length - 1 && !isAuthenticated)}
                sx={{
                  px: 4,
                  py: 1.5,
                  background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-1px)',
                    boxShadow: '0 4px 8px rgba(25, 118, 210, 0.3)',
                  },
                  '&:disabled': {
                    background: '#ccc',
                  }
                }}
              >
                {activeStep === steps.length - 1 
                  ? (isAuthenticated ? 'Submit Request' : 'Login Required') 
                  : 'Next'}
              </Button>
            </Box>
          </Box>
        </form>

        <Snackbar
          open={showSuccess}
          autoHideDuration={6000}
          onClose={() => setShowSuccess(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert 
            onClose={() => setShowSuccess(false)} 
            severity="success" 
            sx={{ width: '100%' }}
          >
            Form 137 request submitted successfully! You can track the status in My Requests.
          </Alert>
        </Snackbar>

        <Snackbar
          open={showError}
          autoHideDuration={6000}
          onClose={() => setShowError(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert 
            onClose={() => setShowError(false)} 
            severity="error" 
            sx={{ width: '100%' }}
          >
            {errorMessage}
          </Alert>
        </Snackbar>
      </Paper>
    </Container>
  );
};

export default Form137Request;
