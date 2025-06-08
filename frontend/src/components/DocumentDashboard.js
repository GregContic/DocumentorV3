import React, { useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Box,
  MenuItem,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  Alert,
  Snackbar,
} from '@mui/material';
import {
  Send as SendIcon,
  CheckCircle as SuccessIcon,
} from '@mui/icons-material';
import { DatePickerWrapper, DatePicker, TimePicker } from './DatePickerWrapper';
import { format, addDays, isWeekend, setHours, setMinutes } from 'date-fns';
import { formatDate, addDaysToDate, isWeekendDay, setTimeToDate } from '../utils/dateUtils';

const DocumentDashboard = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    documentType: '',
    purpose: '',
    preferredPickupDate: null,
    preferredPickupTime: null,
    additionalNotes: '',
  });
  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const documentTypes = [
    'Form 137 (Permanent Record)',
    'Form 138 (Report Card)',
    'High School Diploma',
    'School Form 10 (SF10)',
    'School Form 9 (SF9)',
  ];

  const steps = ['Document Details', 'Review', 'Confirmation'];

  const minDate = new Date();
  const maxDate = addDaysToDate(new Date(), 30);

  const shouldDisableDate = (date) => {
    return isWeekendDay(date);
  };

  const shouldDisableTime = (time) => {
    const hours = time.getHours();
    return hours < 8 || hours >= 17;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDateChange = (newDate) => {
    if (newDate && !isWeekendDay(newDate)) {
      setFormData(prev => ({
        ...prev,
        preferredPickupDate: formatDate(newDate)
      }));
    }
  };

  const handleTimeChange = (newTime) => {
    if (newTime) {
      setFormData(prev => ({
        ...prev,
        preferredPickupTime: newTime
      }));
    }
  };

  const handleNext = () => {
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Implement document request submission logic here
      // For example:
      // await api.submitRequest(formData);
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulated API call
      setActiveStep(2);
      setShowSuccess(true);
      setFormData({
        documentType: '',
        purpose: '',
        preferredPickupDate: null,
        preferredPickupTime: null,
        additionalNotes: '',
      });
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
              <FormControl fullWidth required>
                <InputLabel>Document Type</InputLabel>
                <Select
                  value={formData.documentType}
                  onChange={(e) => setFormData(prev => ({ ...prev, documentType: e.target.value }))}
                  label="Document Type"
                >
                  <MenuItem value="Form 137">Form 137 (Permanent Record)</MenuItem>
                  <MenuItem value="Form 138">Form 138 (Report Card)</MenuItem>
                  <MenuItem value="High School Diploma">High School Diploma</MenuItem>
                  <MenuItem value="SF10">School Form 10 (SF10)</MenuItem>
                  <MenuItem value="SF9">School Form 9 (SF9)</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label="Purpose"
                value={formData.purpose}
                onChange={(e) => setFormData(prev => ({ ...prev, purpose: e.target.value }))}
              />
            </Grid>
          </Grid>
        );
      case 1:
        return (
          <DatePickerWrapper>
            <Grid container spacing={3}>
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
                      required: true
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TimePicker
                  label="Preferred Pickup Time"
                  value={formData.preferredPickupTime}
                  onChange={handleTimeChange}
                  minTime={new Date(0, 0, 0, 8, 0)}
                  maxTime={new Date(0, 0, 0, 17, 0)}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      required: true
                    }
                  }}
                />
              </Grid>
            </Grid>
          </DatePickerWrapper>
        );
      case 2:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Review Your Request
              </Typography>
              <Paper sx={{ p: 2, mb: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Document Details
                </Typography>
                <Typography>Type: {formData.documentType}</Typography>
                <Typography>Purpose: {formData.purpose}</Typography>
                <Typography>
                  Pickup Date: {formData.preferredPickupDate ? format(new Date(formData.preferredPickupDate), 'MMMM dd, yyyy') : 'Not selected'}
                </Typography>
                <Typography>
                  Pickup Time: {formData.preferredPickupTime ? format(new Date(formData.preferredPickupTime), 'hh:mm a') : 'Not selected'}
                </Typography>
                {formData.additionalNotes && (
                  <>
                    <Typography variant="subtitle1" sx={{ mt: 2 }} gutterBottom>
                      Additional Notes
                    </Typography>
                    <Typography>{formData.additionalNotes}</Typography>
                  </>
                )}
              </Paper>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Additional Notes"
                value={formData.additionalNotes}
                onChange={(e) => setFormData(prev => ({ ...prev, additionalNotes: e.target.value }))}
              />
            </Grid>
          </Grid>
        );
      default:
        return null;
    }
  };

  const isStepValid = () => {
    switch (activeStep) {
      case 0:
        return formData.documentType && formData.purpose;
      case 1:
        if (!formData.preferredPickupDate || !formData.preferredPickupTime) return false;
        const pickupDate = new Date(formData.preferredPickupDate);
        const pickupTime = new Date(formData.preferredPickupTime);
        const hours = pickupTime.getHours();
        return (
          !isWeekendDay(pickupDate) &&
          hours >= 8 &&
          hours <= 17
        );
      default:
        return true;
    }
  };

  const validateStep = () => {
    const newErrors = {};
    
    if (activeStep === 0) {
      if (!formData.documentType) newErrors.documentType = 'Document type is required';
      if (!formData.purpose) newErrors.purpose = 'Purpose is required';
      if (!formData.preferredPickupDate) newErrors.preferredPickupDate = 'Pickup date is required';
      if (!formData.preferredPickupTime) newErrors.preferredPickupTime = 'Pickup time is required';
    } else if (activeStep === 1) {
      if (!formData.firstName) newErrors.firstName = 'First name is required';
      if (!formData.lastName) newErrors.lastName = 'Last name is required';
      if (!formData.email) newErrors.email = 'Email is required';
      if (!formData.phoneNumber) newErrors.phoneNumber = 'Phone number is required';
      if (!formData.studentId) newErrors.studentId = 'Student ID is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCloseSnackbar = () => {
    setShowSuccess(false);
    setShowError(false);
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom align="center" sx={{ mb: 4 }}>
          Request Document
        </Typography>

        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <form onSubmit={handleSubmit}>
          {renderStepContent(activeStep)}

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
            {activeStep !== 2 && (
              <>
                {activeStep !== 0 && (
                  <Button
                    onClick={handleBack}
                    sx={{ mr: 1 }}
                  >
                    Back
                  </Button>
                )}
                {activeStep === 0 ? (
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    disabled={!isStepValid()}
                    endIcon={<SendIcon />}
                  >
                    Review Request
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={loading}
                    endIcon={loading ? <CircularProgress size={20} /> : <SendIcon />}
                  >
                    Submit Request
                  </Button>
                )}
              </>
            )}
          </Box>
        </form>
      </Paper>

      <Snackbar
        open={showSuccess}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          Document request submitted successfully!
        </Alert>
      </Snackbar>

      <Snackbar
        open={showError}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
          {errorMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default DocumentDashboard; 