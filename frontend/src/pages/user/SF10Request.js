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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
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
import FormAssistantChatCard from '../../components/FormAssistantChatCard';

const SF10Request = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    documentType: 'School Form 10',
    purpose: '',
    studentNumber: '',
    yearLevel: '',
    schoolYear: '',
    isTransferee: false,
    previousSchool: '',
    previousSchoolAddress: '',
    preferredPickupDate: null,
    preferredPickupTime: null,
    additionalNotes: '',
  });  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const requirements = [
    'Valid School ID or Any Valid Government ID',
    'Request Form (will be provided)',
    'Previous School Records (if transferee)',
    'Proof of Payment',
  ];

  const steps = ['Personal Details', 'Academic Information', 'Previous School', 'Schedule Pickup', 'Review & Submit'];

  const validateStep = (stepIndex) => {
    const newErrors = {};

    switch (stepIndex) {
      case 0:
        if (!formData.purpose.trim()) newErrors.purpose = 'Purpose is required';
        if (!formData.studentNumber.trim()) newErrors.studentNumber = 'Student number is required';
        break;
      case 1:
        if (!formData.yearLevel.trim()) newErrors.yearLevel = 'Year level is required';
        if (!formData.schoolYear.trim()) newErrors.schoolYear = 'School year is required';
        break;
      case 2:
        if (formData.isTransferee) {
          if (!formData.previousSchool.trim()) newErrors.previousSchool = 'Previous school is required';
          if (!formData.previousSchoolAddress.trim()) newErrors.previousSchoolAddress = 'Previous school address is required';
        }
        break;
      case 3:
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
        documentType: 'School Form 10',
        purpose: '',
        studentNumber: '',
        yearLevel: '',
        schoolYear: '',
        isTransferee: false,
        previousSchool: '',
        previousSchoolAddress: '',
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
            
            {/* Form Assistant Chat Card */}
            <Grid item xs={12}>
              <FormAssistantChatCard
                formType="School Form 10"
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
          </Grid>
        );

      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Academic Information
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                label="Year Level"
                value={formData.yearLevel}
                onChange={(e) => setFormData(prev => ({ ...prev, yearLevel: e.target.value }))}
                error={!!errors.yearLevel}
                helperText={errors.yearLevel}
                placeholder="e.g., Grade 10"
              />
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
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Are you a transferee?</InputLabel>
                <Select
                  value={formData.isTransferee}
                  onChange={(e) => setFormData(prev => ({ ...prev, isTransferee: e.target.value }))}
                  label="Are you a transferee?"
                >
                  <MenuItem value={false}>No</MenuItem>
                  <MenuItem value={true}>Yes</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        );

      case 2:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Previous School Information
              </Typography>
              {!formData.isTransferee ? (
                <Typography color="text.secondary">
                  This section is only required for transferees. You can proceed to the next step.
                </Typography>
              ) : (
                <>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        required
                        label="Previous School Name"
                        value={formData.previousSchool}
                        onChange={(e) => setFormData(prev => ({ ...prev, previousSchool: e.target.value }))}
                        error={!!errors.previousSchool}
                        helperText={errors.previousSchool}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        required
                        label="Previous School Address"
                        value={formData.previousSchoolAddress}
                        onChange={(e) => setFormData(prev => ({ ...prev, previousSchoolAddress: e.target.value }))}
                        error={!!errors.previousSchoolAddress}
                        helperText={errors.previousSchoolAddress}
                        multiline
                        rows={2}
                      />
                    </Grid>
                  </Grid>
                </>
              )}
            </Grid>
          </Grid>
        );

      case 3:
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

      case 4:
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
                    <SchoolIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Student Information"
                    secondary={`Student Number: ${formData.studentNumber}`}
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
                    <AssignmentIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Academic Information"
                    secondary={`Year Level: ${formData.yearLevel}, School Year: ${formData.schoolYear}`}
                  />
                </ListItem>
                {formData.isTransferee && (
                  <ListItem>
                    <ListItemIcon>
                      <SchoolIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Previous School"
                      secondary={`${formData.previousSchool}, ${formData.previousSchoolAddress}`}
                    />
                  </ListItem>
                )}
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
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" gutterBottom align="center">
            Request School Form 10
          </Typography>
          <Typography variant="body1" color="text.secondary" align="center">
            Fill out the form below to request your School Form 10 (SF10 - Learner's Permanent Academic Record)
          </Typography>
        </Box>

        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <form onSubmit={handleSubmit}>
          {renderStepContent(activeStep)}

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Button
              onClick={handleBack}
              disabled={activeStep === 0 || loading}
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
              >
                Submit Request
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleNext}
                disabled={loading}
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
    </Container>
  );
};

export default SF10Request;
