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
} from '@mui/material';
import {
  Send as SendIcon,
  CheckCircle as CheckIcon,
  Description as DescriptionIcon,
  School as SchoolIcon,
  Assignment as AssignmentIcon,
  Schedule as ScheduleIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { DatePickerWrapper, DatePicker, TimePicker } from '../../components/DatePickerWrapper';
import { formatDate, addDaysToDate, isWeekendDay } from '../../utils/dateUtils';
import { documentService } from '../../services/api';
import AIDocumentUploader from '../../components/AIDocumentUploader';
import AIAssistantCard from '../../components/AIAssistantCard';

const Form138Request = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    documentType: 'Form 138 / SF9',
    purpose: '',
    studentNumber: '',
    schoolYear: '',
    gradeLevel: '',
    preferredPickupDate: null,
    preferredPickupTime: null,
    additionalNotes: '',
  });  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showAIUploader, setShowAIUploader] = useState(false);

  // AI Document Assistant handler
  const handleAIDataExtracted = (extractedData) => {
    if (extractedData) {
      const updatedFormData = { ...formData };
      
      // Map extracted data to form fields
      if (extractedData.academicInfo) {
        if (extractedData.academicInfo.studentNumber) updatedFormData.studentNumber = extractedData.academicInfo.studentNumber;
        if (extractedData.academicInfo.schoolYear) updatedFormData.schoolYear = extractedData.academicInfo.schoolYear;
        if (extractedData.academicInfo.gradeLevel) updatedFormData.gradeLevel = extractedData.academicInfo.gradeLevel;
      }
      
      setFormData(updatedFormData);
      setShowAIUploader(false);
    }
  };

  const requirements = [
    'Valid School ID or Any Valid Government ID',
    'Authorization Letter (if not the student)',
    'Request Form (will be provided)',
  ];

  const steps = ['Personal Details', 'School Information', 'Schedule Pickup', 'Review & Submit'];

  const validateStep = (stepIndex) => {
    const newErrors = {};

    switch (stepIndex) {
      case 0:
        if (!formData.purpose.trim()) newErrors.purpose = 'Purpose is required';
        if (!formData.studentNumber.trim()) newErrors.studentNumber = 'Student number is required';
        break;
      case 1:
        if (!formData.schoolYear.trim()) newErrors.schoolYear = 'School year is required';
        if (!formData.gradeLevel.trim()) newErrors.gradeLevel = 'Grade level is required';
        break;
      case 2:
        if (!formData.preferredPickupDate) newErrors.preferredPickupDate = 'Pickup date is required';
        if (!formData.preferredPickupTime) newErrors.preferredPickupTime = 'Pickup time is required';
        break;
      default:
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(activeStep)) return;

    setLoading(true);
    try {
      // Format the data before submission
      const submissionData = {
        ...formData,
        preferredPickupDate: formData.preferredPickupDate ? formatDate(formData.preferredPickupDate) : null,
        preferredPickupTime: formData.preferredPickupTime ? formatDate(formData.preferredPickupTime, 'HH:mm') : null,
      };
      
      await documentService.createRequest(submissionData);
      setShowSuccess(true);
      // Reset form
      setFormData({
        documentType: 'Form 138 / SF9',
        purpose: '',
        studentNumber: '',
        schoolYear: '',
        gradeLevel: '',
        preferredPickupDate: null,
        preferredPickupTime: null,
        additionalNotes: '',
      });
      setActiveStep(0);
    } catch (error) {
      console.error('Submission error:', error);
      setErrorMessage('Failed to submit request. Please try again.');
      setShowError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    // Only submit if we're on the last step
    if (activeStep === steps.length - 1) {
      handleSubmit(e);
    }
  };

  const renderStepContent = (step) => {
    switch (step) {      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Personal Details
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Fill out your personal information below. You can use our AI assistant to automatically extract information from document images.
              </Typography>
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
                  onDataExtracted={handleAIDataExtracted}
                />
              </Grid>
            )}

            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom sx={{ color: 'primary.main' }}>
                Full Name
              </Typography>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label="Purpose of Request"
                value={formData.purpose}
                onChange={(e) => setFormData(prev => ({ ...prev, purpose: e.target.value }))}
                error={!!errors.purpose}
                helperText={errors.purpose}
                multiline
                rows={3}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label="Student Number"
                value={formData.studentNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, studentNumber: e.target.value }))}
                error={!!errors.studentNumber}
                helperText={errors.studentNumber}
              />
            </Grid>
          </Grid>
        );

      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                School Information
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                label="School Year"
                value={formData.schoolYear}
                onChange={(e) => setFormData(prev => ({ ...prev, schoolYear: e.target.value }))}
                error={!!errors.schoolYear}
                helperText={errors.schoolYear}
                placeholder="e.g., 2024-2025"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                label="Grade Level"
                value={formData.gradeLevel}
                onChange={(e) => setFormData(prev => ({ ...prev, gradeLevel: e.target.value }))}
                error={!!errors.gradeLevel}
                helperText={errors.gradeLevel}
                placeholder="e.g., Grade 10"
              />
            </Grid>
          </Grid>
        );

      case 2:
        return (
          <DatePickerWrapper>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Schedule Pickup
                </Typography>
              </Grid>              <Grid item xs={12} md={6}>
                <DatePicker
                  label="Preferred Pickup Date"
                  value={formData.preferredPickupDate}
                  onChange={(newDate) => {
                    setFormData(prev => ({
                      ...prev,
                      preferredPickupDate: newDate
                    }));
                  }}
                  renderInput={(params) => (
                    <TextField 
                      {...params} 
                      fullWidth 
                      required 
                      error={!!errors.preferredPickupDate}
                      helperText={errors.preferredPickupDate}
                    />
                  )}
                  minDate={new Date()}
                  maxDate={addDaysToDate(new Date(), 30)}
                  shouldDisableDate={isWeekendDay}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TimePicker
                  label="Preferred Pickup Time"
                  value={formData.preferredPickupTime}
                  onChange={(newTime) => {
                    setFormData(prev => ({
                      ...prev,
                      preferredPickupTime: newTime
                    }));
                  }}
                  renderInput={(params) => (
                    <TextField 
                      {...params} 
                      fullWidth 
                      required 
                      error={!!errors.preferredPickupTime}
                      helperText={errors.preferredPickupTime}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Additional Notes"
                  multiline
                  rows={4}
                  value={formData.additionalNotes}
                  onChange={(e) => setFormData(prev => ({ ...prev, additionalNotes: e.target.value }))}
                />
              </Grid>
            </Grid>
          </DatePickerWrapper>
        );

      case 3:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Review Your Request
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <DescriptionIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Document Type"
                    secondary={formData.documentType}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <InfoIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Purpose"
                    secondary={formData.purpose}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <SchoolIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Student Information"
                    secondary={`Student Number: ${formData.studentNumber}`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <AssignmentIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="School Information"
                    secondary={`School Year: ${formData.schoolYear}, Grade Level: ${formData.gradeLevel}`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <ScheduleIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Pickup Schedule"
                    secondary={`Date: ${formData.preferredPickupDate ? formatDate(new Date(formData.preferredPickupDate)) : 'Not set'}, Time: ${formData.preferredPickupTime ? formatDate(new Date(formData.preferredPickupTime), 'HH:mm') : 'Not set'}`}
                  />
                </ListItem>
              </List>
            </Grid>
          </Grid>
        );

      default:
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
      >
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          mb: 4,
          background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
          borderRadius: '12px',
          p: 2,
          color: 'white'
        }}>
          <SchoolIcon sx={{ fontSize: 40, mr: 2 }} />
          <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
            Form 138 / SF9 Request
          </Typography>
        </Box>

        <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 4 }}>
          Fill out the form below to request your Form 138 / SF9 (Report Card)
        </Typography>

        <Stepper 
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
        </Stepper>        <form onSubmit={handleFormSubmit} noValidate>
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
          </Box>

          <Box sx={{ 
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
            {activeStep === steps.length - 1 ? (
              <Button
                type="submit"
                variant="contained"
                color="primary"
                endIcon={loading ? <CircularProgress size={24} /> : <SendIcon />}
                disabled={loading}
                sx={{
                  px: 4,
                  py: 1.5,
                  background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-1px)',
                    boxShadow: '0 4px 8px rgba(25, 118, 210, 0.3)',
                  }
                }}
              >
                Submit Request
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleNext}
                disabled={loading}
                type="button"
                sx={{
                  px: 4,
                  py: 1.5,
                  background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-1px)',
                    boxShadow: '0 4px 8px rgba(25, 118, 210, 0.3)',
                  }
                }}
              >
                Next
              </Button>
            )}
          </Box>
        </form>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Requirements
          </Typography>
          <List>
            {requirements.map((req, index) => (
              <ListItem key={index}>
                <ListItemIcon>
                  <CheckIcon color="success" />
                </ListItemIcon>
                <ListItemText primary={req} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Paper>

      <Snackbar
        open={showSuccess}
        autoHideDuration={6000}
        onClose={() => setShowSuccess(false)}
      >
        <Alert severity="success" onClose={() => setShowSuccess(false)}>
          Request submitted successfully!
        </Alert>
      </Snackbar>

      <Snackbar
        open={showError}
        autoHideDuration={6000}
        onClose={() => setShowError(false)}
      >
        <Alert severity="error" onClose={() => setShowError(false)}>
          {errorMessage}
        </Alert>
      </Snackbar>

      {showAIUploader && (
        <Box sx={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0, 
          bgcolor: 'rgba(0, 0, 0, 0.5)', 
          zIndex: 1100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 2
        }}>
          <Box sx={{ 
            maxWidth: 800, 
            width: '100%', 
            maxHeight: '90vh', 
            overflow: 'auto',
            bgcolor: 'background.paper',
            borderRadius: 2,
            p: 3
          }}>
            <AIDocumentUploader
              onDataExtracted={handleAIDataExtracted}
              formData={formData}
              setFormData={setFormData}
            />
            <Button
              onClick={() => setShowAIUploader(false)}
              sx={{ mt: 2 }}
              variant="outlined"
            >
              Close
            </Button>
          </Box>
        </Box>
      )}
    </Container>
  );
};

export default Form138Request;
