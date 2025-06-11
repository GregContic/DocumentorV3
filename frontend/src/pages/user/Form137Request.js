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
  Download as DownloadIcon,
} from '@mui/icons-material';
import { PDFDownloadLink } from '@react-pdf/renderer';
import Form137PDF from '../../components/PDFTemplates/Form137PDF';
import { DatePickerWrapper, DatePicker, TimePicker } from '../../components/DatePickerWrapper';
import { formatDate, addDaysToDate, isWeekendDay } from '../../utils/dateUtils';
import { documentService } from '../../services/api';

const Form137Request = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    documentType: 'Form 137',
    purpose: '',
    studentNumber: '',
    yearGraduated: '',
    currentSchool: '',
    schoolAddress: '',
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
    'Authorization Letter (if not the student)',
    'Proof of Payment',
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
        if (!formData.yearGraduated.trim()) newErrors.yearGraduated = 'Year graduated is required';
        if (!formData.currentSchool.trim()) newErrors.currentSchool = 'Current school is required';
        if (!formData.schoolAddress.trim()) newErrors.schoolAddress = 'School address is required';
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

  const handleFormSubmit = (e) => {
    e.preventDefault(); // Prevent form from submitting
  };

  const handleSubmit = async () => {
    if (!validateStep(activeStep)) return;

    setLoading(true);
    try {
      const response = await documentService.createRequest(formData);
      setShowSuccess(true);
      // Reset form
      setFormData({
        documentType: 'Form 137',
        purpose: '',
        studentNumber: '',
        yearGraduated: '',
        currentSchool: '',
        schoolAddress: '',
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
                School Information
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                label="Year Graduated"
                value={formData.yearGraduated}
                onChange={(e) => setFormData(prev => ({ ...prev, yearGraduated: e.target.value }))}
                error={!!errors.yearGraduated}
                helperText={errors.yearGraduated}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label="Current School"
                value={formData.currentSchool}
                onChange={(e) => setFormData(prev => ({ ...prev, currentSchool: e.target.value }))}
                error={!!errors.currentSchool}
                helperText={errors.currentSchool}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label="School Address"
                value={formData.schoolAddress}
                onChange={(e) => setFormData(prev => ({ ...prev, schoolAddress: e.target.value }))}
                error={!!errors.schoolAddress}
                helperText={errors.schoolAddress}
                multiline
                rows={2}
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
                    setFormData(prev => ({
                      ...prev,
                      preferredPickupDate: newDate
                    }));
                  }}
                  shouldDisableDate={isWeekendDay}
                  minDate={new Date()}
                  maxDate={addDaysToDate(new Date(), 30)}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      required: true,
                      error: !!errors.preferredPickupDate,
                      helperText: errors.preferredPickupDate
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TimePicker
                  label="Preferred Pickup Time"
                  value={formData.preferredPickupTime}
                  onChange={(newTime) => {
                    if (newTime) {
                      newTime.setMinutes(0);
                      setFormData(prev => ({
                        ...prev,
                        preferredPickupTime: newTime
                      }));
                    }
                  }}
                  minTime={new Date(0, 0, 0, 8)}
                  maxTime={new Date(0, 0, 0, 15)}
                  minutesStep={60}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      required: true,
                      error: !!errors.preferredPickupTime,
                      helperText: errors.preferredPickupTime
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Additional Notes"
                  value={formData.additionalNotes}
                  onChange={(e) => setFormData(prev => ({ ...prev, additionalNotes: e.target.value }))}
                  multiline
                  rows={3}
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
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" color="text.secondary">Purpose:</Typography>
                    <Typography paragraph>{formData.purpose}</Typography>
                    
                    <Typography variant="subtitle2" color="text.secondary">Student Number:</Typography>
                    <Typography paragraph>{formData.studentNumber}</Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" color="text.secondary">Year Graduated:</Typography>
                    <Typography paragraph>{formData.yearGraduated}</Typography>
                    
                    <Typography variant="subtitle2" color="text.secondary">Current School:</Typography>
                    <Typography paragraph>{formData.currentSchool}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="text.secondary">School Address:</Typography>
                    <Typography paragraph>{formData.schoolAddress}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                      <ScheduleIcon sx={{ mr: 1 }} color="primary" />
                      <Typography variant="subtitle1">Pickup Schedule</Typography>
                    </Box>
                    <Divider sx={{ my: 2 }} />
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <Typography variant="subtitle2" color="text.secondary">Date:</Typography>
                        <Typography>
                          {formData.preferredPickupDate
                            ? new Date(formData.preferredPickupDate).toLocaleDateString()
                            : 'Not selected'}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Typography variant="subtitle2" color="text.secondary">Time:</Typography>
                        <Typography>
                          {formData.preferredPickupTime
                            ? new Date(formData.preferredPickupTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                            : 'Not selected'}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                  {formData.additionalNotes && (
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" color="text.secondary">Additional Notes:</Typography>
                      <Typography>{formData.additionalNotes}</Typography>
                    </Grid>
                  )}
                </Grid>
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <Paper sx={{ p: 3, bgcolor: 'primary.light', color: 'primary.contrastText' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <InfoIcon sx={{ mr: 1 }} />
                  <Typography variant="subtitle1">Required Documents</Typography>
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
        );

      default:
        return null;
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <SchoolIcon sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
          <Typography variant="h4" component="h1">
            Form 137 Request
          </Typography>
        </Box>

        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <form onSubmit={handleFormSubmit} noValidate>
          <Box sx={{ mt: 4, mb: 4 }}>
            {renderStepContent(activeStep)}
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Button
              type="button"
              onClick={handleBack}
              disabled={activeStep === 0 || loading}
            >
              Back
            </Button>
            <Box sx={{ display: 'flex', gap: 2 }}>
              {activeStep === steps.length - 1 && (
                <PDFDownloadLink
                  document={<Form137PDF formData={formData} />}
                  fileName={`form137_request_${formData.studentNumber}.pdf`}
                  style={{ textDecoration: 'none' }}
                >
                  {({ blob, url, loading, error }) => (
                    <Button
                      type="button"
                      variant="outlined"
                      color="primary"
                      disabled={loading || error}
                      startIcon={<DownloadIcon />}
                    >
                      Download PDF
                    </Button>
                  )}
                </PDFDownloadLink>
              )}
              <Button
                type="button"
                variant="contained"
                color="primary"
                onClick={activeStep === steps.length - 1 ? handleSubmit : handleNext}
                endIcon={activeStep === steps.length - 1 ? (loading ? <CircularProgress size={24} /> : <SendIcon />) : undefined}
                disabled={loading}
              >
                {activeStep === steps.length - 1 ? 'Submit Request' : 'Next'}
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
