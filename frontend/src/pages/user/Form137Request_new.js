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
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Card,
  CardContent,
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
  QrCode as QrCodeIcon,
} from '@mui/icons-material';
import { PDFDownloadLink } from '@react-pdf/renderer';
import Form137StubPDF from '../../components/PDFTemplates/Form137StubPDF';
import { DatePickerWrapper, DatePicker } from '../../components/DatePickerWrapper';
import { form137StubService } from '../../services/api';
import AIDocumentUploader from '../../components/AIDocumentUploader';
import AIAssistantCard from '../../components/AIAssistantCard';
import { useAuth } from '../../context/AuthContext';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

const Form137Request = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    // Student Information
    surname: '',
    firstName: '',
    middleName: '',
    sex: '',
    dateOfBirth: null,
    barangay: '',
    city: '',
    province: '',
    learnerReferenceNumber: '',
    // Academic Information
    lastGradeLevel: '',
    lastAttendedYear: '',
    receivingSchool: '',
    receivingSchoolAddress: '',
    purpose: '',
    // Parent/Guardian Information
    parentGuardianName: '',
    parentGuardianAddress: '',
    parentGuardianContact: '',
  });

  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showAIUploader, setShowAIUploader] = useState(false);
  const [generatedStub, setGeneratedStub] = useState(null);

  // AI Document Assistant handler
  const handleAIDataExtracted = (extractedData) => {
    if (extractedData) {
      const updatedFormData = { ...formData };
      
      // Map extracted data to form fields
      if (extractedData.personalInfo) {
        if (extractedData.personalInfo.firstName) updatedFormData.firstName = extractedData.personalInfo.firstName;
        if (extractedData.personalInfo.lastName) updatedFormData.surname = extractedData.personalInfo.lastName;
        if (extractedData.personalInfo.middleName) updatedFormData.middleName = extractedData.personalInfo.middleName;
        if (extractedData.personalInfo.lrn) updatedFormData.learnerReferenceNumber = extractedData.personalInfo.lrn;
        if (extractedData.personalInfo.dateOfBirth) updatedFormData.dateOfBirth = new Date(extractedData.personalInfo.dateOfBirth);
        if (extractedData.personalInfo.sex) updatedFormData.sex = extractedData.personalInfo.sex;
      }
      
      if (extractedData.address) {
        if (extractedData.address.city) updatedFormData.city = extractedData.address.city;
        if (extractedData.address.province) updatedFormData.province = extractedData.address.province;
        if (extractedData.address.barangay) updatedFormData.barangay = extractedData.address.barangay;
      }
      
      if (extractedData.parentInfo) {
        if (extractedData.parentInfo.guardianName) updatedFormData.parentGuardianName = extractedData.parentInfo.guardianName;
        if (extractedData.parentInfo.guardianContact) updatedFormData.parentGuardianContact = extractedData.parentInfo.guardianContact;
      }
      
      setFormData(updatedFormData);
      setShowAIUploader(false);
    }
  };

  const requirements = [
    'Valid School ID or Any Valid Government ID',
    'Authorization Letter (if not the student)',
    'Present the generated stub to the School Registrar',
    'Wait for official processing notification',
  ];

  const steps = ['Student Information', 'Academic Details', 'Parent/Guardian Info', 'Generate Stub'];

  const validateStep = (stepIndex) => {
    const newErrors = {};

    switch (stepIndex) {
      case 0: // Student Information
        if (!formData.surname.trim()) newErrors.surname = 'Surname is required';
        if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
        if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
        if (!formData.sex) newErrors.sex = 'Sex is required';
        if (!formData.barangay.trim()) newErrors.barangay = 'Barangay is required';
        if (!formData.city.trim()) newErrors.city = 'City/Municipality is required';
        if (!formData.province.trim()) newErrors.province = 'Province is required';
        if (!formData.learnerReferenceNumber.trim()) newErrors.learnerReferenceNumber = 'Learner Reference Number (LRN) is required';
        break;
      case 1: // Academic Details
        if (!formData.lastGradeLevel.trim()) newErrors.lastGradeLevel = 'Last grade level is required';
        if (!formData.lastAttendedYear.trim()) newErrors.lastAttendedYear = 'Last attended year is required';
        if (!formData.receivingSchool.trim()) newErrors.receivingSchool = 'Receiving school is required';
        if (!formData.purpose.trim()) newErrors.purpose = 'Purpose is required';
        break;
      case 2: // Parent/Guardian Information
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
    try {
      const isValid = validateStep(activeStep);
      
      if (isValid) {
        setActiveStep((prev) => prev + 1);
      }
    } catch (error) {
      console.error('Error in handleNext:', error);
      setErrorMessage('An error occurred while proceeding to the next step.');
      setShowError(true);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
  };

  const handleSubmit = async () => {
    if (!validateStep(activeStep)) return;

    // Check authentication before submitting
    if (!isAuthenticated) {
      setErrorMessage('Please log in to generate your Form 137 stub.');
      setShowError(true);
      return;
    }

    setLoading(true);
    try {
      console.log('Generating Form 137 stub:', formData);
      const response = await form137StubService.createStub(formData);
      console.log('Stub generation response:', response);
      
      setGeneratedStub(response.data.data);
      setShowSuccess(true);
      setActiveStep(activeStep + 1); // Move to final step showing the stub
      
    } catch (error) {
      console.error('Stub generation error:', error);
      console.error('Error response:', error.response);
      
      // More detailed error handling
      let errorMsg = 'Failed to generate Form 137 stub. Please try again.';
      if (error.response?.status === 401) {
        errorMsg = 'You need to be logged in to generate a stub. Please log in and try again.';
      } else if (error.response?.status === 400) {
        errorMsg = 'Invalid form data. Please check your inputs and try again.';
      } else if (error.response?.data?.message) {
        errorMsg = error.response.data.message;
      } else if (!isAuthenticated) {
        errorMsg = 'Please log in to generate your Form 137 stub.';
      }
      
      setErrorMessage(errorMsg);
      setShowError(true);
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = (step) => {
    try {
      switch (step) {
        case 0: // Student Information
          return (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Student Information
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Fill out the student's personal information below. You can use our AI assistant to automatically extract information from document images.
                </Typography>
              </Grid>

              {/* AI Assistant Card */}
              <Grid item xs={12}>
                <AIAssistantCard
                  title="AI Document Assistant"
                  description="Upload a document image to automatically extract student information"
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
                    onDataExtracted={handleAIDataExtracted}
                  />
                </Grid>
              )}

              {/* Name Fields */}
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
              
              {/* Other Personal Info */}
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
              
              {/* Address */}
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
              
              {/* LRN */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  label="Learner Reference Number (LRN)"
                  value={formData.learnerReferenceNumber}
                  onChange={(e) => setFormData(prev => ({ ...prev, learnerReferenceNumber: e.target.value }))}
                  error={!!errors.learnerReferenceNumber}
                  helperText={errors.learnerReferenceNumber}
                />
              </Grid>
            </Grid>
          );

        case 1: // Academic Details
          return (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Academic Information
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Provide details about your academic history and the receiving school.
                </Typography>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  required
                  label="Last Grade Level Completed"
                  value={formData.lastGradeLevel}
                  onChange={(e) => setFormData(prev => ({ ...prev, lastGradeLevel: e.target.value }))}
                  error={!!errors.lastGradeLevel}
                  helperText={errors.lastGradeLevel}
                  placeholder="e.g., Grade 10, Grade 12"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  required
                  label="Last Attended School Year"
                  value={formData.lastAttendedYear}
                  onChange={(e) => setFormData(prev => ({ ...prev, lastAttendedYear: e.target.value }))}
                  error={!!errors.lastAttendedYear}
                  helperText={errors.lastAttendedYear}
                  placeholder="e.g., 2023-2024"
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  label="Receiving School (School you're transferring to)"
                  value={formData.receivingSchool}
                  onChange={(e) => setFormData(prev => ({ ...prev, receivingSchool: e.target.value }))}
                  error={!!errors.receivingSchool}
                  helperText={errors.receivingSchool}
                  placeholder="Full name of the school you're transferring to"
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Receiving School Address (Optional)"
                  value={formData.receivingSchoolAddress}
                  onChange={(e) => setFormData(prev => ({ ...prev, receivingSchoolAddress: e.target.value }))}
                  placeholder="Address of the receiving school"
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  label="Purpose of Transfer"
                  value={formData.purpose}
                  onChange={(e) => setFormData(prev => ({ ...prev, purpose: e.target.value }))}
                  error={!!errors.purpose}
                  helperText={errors.purpose}
                  placeholder="e.g., Transfer to new school, College application"
                  multiline
                  rows={3}
                />
              </Grid>
            </Grid>
          );

        case 2: // Parent/Guardian Information
          return (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Parent/Guardian Information
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Provide parent or guardian contact information for the transfer process.
                </Typography>
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  label="Parent/Guardian Full Name"
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
                  label="Parent/Guardian Address"
                  value={formData.parentGuardianAddress}
                  onChange={(e) => setFormData(prev => ({ ...prev, parentGuardianAddress: e.target.value }))}
                  error={!!errors.parentGuardianAddress}
                  helperText={errors.parentGuardianAddress}
                  multiline
                  rows={2}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Parent/Guardian Contact Number (Optional)"
                  value={formData.parentGuardianContact}
                  onChange={(e) => setFormData(prev => ({ ...prev, parentGuardianContact: e.target.value }))}
                  placeholder="Contact number for notifications"
                />
              </Grid>
            </Grid>
          );

        case 3: // Generate Stub
          return (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Generate Form 137 Pickup Stub
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Review your information and generate your Form 137 pickup stub.
                </Typography>
              </Grid>
              
              {!generatedStub ? (
                <Grid item xs={12}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Review Your Information
                      </Typography>
                      <Typography variant="body2" paragraph>
                        <strong>Student:</strong> {formData.firstName} {formData.middleName} {formData.surname}
                      </Typography>
                      <Typography variant="body2" paragraph>
                        <strong>LRN:</strong> {formData.learnerReferenceNumber}
                      </Typography>
                      <Typography variant="body2" paragraph>
                        <strong>Last Grade:</strong> {formData.lastGradeLevel} ({formData.lastAttendedYear})
                      </Typography>
                      <Typography variant="body2" paragraph>
                        <strong>Receiving School:</strong> {formData.receivingSchool}
                      </Typography>
                      <Typography variant="body2" paragraph>
                        <strong>Purpose:</strong> {formData.purpose}
                      </Typography>
                      <Typography variant="body2" paragraph>
                        <strong>Parent/Guardian:</strong> {formData.parentGuardianName}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ) : (
                <Grid item xs={12}>
                  <Card variant="outlined" sx={{ backgroundColor: '#e8f5e8' }}>
                    <CardContent>
                      <Box display="flex" alignItems="center" mb={2}>
                        <QrCodeIcon color="success" sx={{ mr: 1 }} />
                        <Typography variant="h6" color="success.main">
                          Stub Generated Successfully!
                        </Typography>
                      </Box>
                      <Typography variant="body2" paragraph>
                        <strong>Stub Code:</strong> {generatedStub.stubCode}
                      </Typography>
                      <Typography variant="body2" paragraph>
                        Your Form 137 pickup stub has been generated. Download the PDF and present it to the school registrar to begin the official transfer process.
                      </Typography>
                      
                      {generatedStub && (
                        <Box mt={2}>
                          <PDFDownloadLink
                            document={<Form137StubPDF stubData={generatedStub} />}
                            fileName={`Form137_Stub_${generatedStub.stubCode}.pdf`}
                          >
                            {({ loading }) => (
                              <Button
                                variant="contained"
                                color="primary"
                                startIcon={loading ? <CircularProgress size={20} /> : <DownloadIcon />}
                                disabled={loading}
                                size="large"
                              >
                                {loading ? 'Generating PDF...' : 'Download Pickup Stub'}
                              </Button>
                            )}
                          </PDFDownloadLink>
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              )}
              
              <Grid item xs={12}>
                <Paper elevation={1} sx={{ p: 2, backgroundColor: '#fff3cd' }}>
                  <Typography variant="h6" gutterBottom color="warning.dark">
                    Important Instructions:
                  </Typography>
                  <List dense>
                    {[
                      'This is NOT an official Form 137 request',
                      'Present this stub to the School Registrar with required documents',
                      'The registrar will verify your information and process the official transfer',
                      'You will be notified when your Form 137 is ready for pickup',
                      'Keep this stub for reference and tracking'
                    ].map((instruction, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <InfoIcon color="warning" fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary={instruction} />
                      </ListItem>
                    ))}
                  </List>
                </Paper>
              </Grid>
            </Grid>
          );

        default:
          return null;
      }
    } catch (error) {
      console.error('Error in renderStepContent:', error);
      return (
        <Alert severity="error">
          An error occurred while rendering this step. Please refresh the page and try again.
        </Alert>
      );
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper 
        elevation={3} 
        sx={{ 
          p: { xs: 2, md: 4 },
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          transition: 'transform 0.2s ease-in-out',
        }}
      >
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center" color="primary">
            Form 137 Request Intent Declaration
          </Typography>
          <Typography variant="body1" color="text.secondary" align="center" paragraph>
            Generate a pickup stub for your Form 137 transfer request. This is a preparation document for the official school-to-school transfer process.
          </Typography>
        </Box>

        {/* Auth Check */}
        {!isAuthenticated && (
          <Alert severity="warning" sx={{ mb: 3 }}>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Typography>Please log in to generate your Form 137 stub.</Typography>
              <Button
                component={RouterLink}
                to="/login"
                variant="outlined"
                startIcon={<LoginIcon />}
                size="small"
              >
                Login
              </Button>
            </Box>
          </Alert>
        )}

        {/* Stepper */}
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {/* Form */}
        <Box component="form" onSubmit={handleFormSubmit}>
          {renderStepContent(activeStep)}

          {/* Navigation */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
              variant="outlined"
            >
              Back
            </Button>
            
            <Box>
              {activeStep === steps.length - 1 ? (
                !generatedStub && (
                  <Button
                    onClick={handleSubmit}
                    variant="contained"
                    disabled={loading || !isAuthenticated}
                    startIcon={loading ? <CircularProgress size={20} /> : <QrCodeIcon />}
                  >
                    {loading ? 'Generating Stub...' : 'Generate Stub'}
                  </Button>
                )
              ) : (
                <Button
                  onClick={handleNext}
                  variant="contained"
                  disabled={loading}
                >
                  Next
                </Button>
              )}
            </Box>
          </Box>
        </Box>

        {/* Requirements */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Requirements for School Registrar Visit
          </Typography>
          <List>
            {requirements.map((req, index) => (
              <ListItem key={index}>
                <ListItemIcon>
                  <CheckIcon color="primary" />
                </ListItemIcon>
                <ListItemText primary={req} />
              </ListItem>
            ))}
          </List>
        </Box>

        {/* Success Snackbar */}
        <Snackbar
          open={showSuccess}
          autoHideDuration={6000}
          onClose={() => setShowSuccess(false)}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert severity="success" onClose={() => setShowSuccess(false)}>
            Form 137 stub generated successfully! Please download your stub and present it to the registrar.
          </Alert>
        </Snackbar>

        {/* Error Snackbar */}
        <Snackbar
          open={showError}
          autoHideDuration={6000}
          onClose={() => setShowError(false)}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert severity="error" onClose={() => setShowError(false)}>
            {errorMessage}
          </Alert>
        </Snackbar>
      </Paper>
    </Container>
  );
};

export default Form137Request;
