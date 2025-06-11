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

const SF9Request = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    documentType: 'School Form 9',
    purpose: '',
    studentNumber: '',
    schoolYear: '',
    gradeLevel: '',
    semester: '',
    preferredPickupDate: null,
    preferredPickupTime: null,
    additionalNotes: '',
  });
  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const requirements = [
    'Valid School ID or Any Valid Government ID',
    'Request Form (will be provided)',
    'Proof of Payment',
  ];

  const steps = ['Personal Details', 'Academic Information', 'Schedule Pickup', 'Review & Submit'];

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
        if (!formData.semester.trim()) newErrors.semester = 'Semester is required';
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
      await documentService.createRequest(formData);
      setShowSuccess(true);
      // Reset form
      setFormData({
        documentType: 'School Form 9',
        purpose: '',
        studentNumber: '',
        schoolYear: '',
        gradeLevel: '',
        semester: '',
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
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Personal Details
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
                Academic Information
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
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                label="Semester"
                value={formData.semester}
                onChange={(e) => setFormData(prev => ({ ...prev, semester: e.target.value }))}
                error={!!errors.semester}
                helperText={errors.semester}
                placeholder="e.g., First Semester"
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
              </Grid>
              <Grid item xs={12} md={6}>
                <DatePicker
                  label="Preferred Pickup Date"
                  value={formData.preferredPickupDate}
                  onChange={(newDate) => {
                    if (newDate) {
                      setFormData(prev => ({
                        ...prev,
                        preferredPickupDate: formatDate(newDate)
                      }));
                    }
                  }}
                  renderInput={(params) => <TextField {...params} fullWidth required />}
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
                    if (newTime) {
                      setFormData(prev => ({
                        ...prev,
                        preferredPickupTime: newTime
                      }));
                    }
                  }}
                  renderInput={(params) => <TextField {...params} fullWidth required />}
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
                    primary="Academic Information"
                    secondary={`School Year: ${formData.schoolYear}, Grade Level: ${formData.gradeLevel}, Semester: ${formData.semester}`}
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
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" gutterBottom align="center">
            Request School Form 9
          </Typography>
          <Typography variant="body1" color="text.secondary" align="center">
            Fill out the form below to request your School Form 9 (SF9)
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

export default SF9Request;
