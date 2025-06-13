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
  const [loading, setLoading] = useState(false);  const [formData, setFormData] = useState({
    documentType: 'Form 137',
    purpose: '',
    // Student Information
    surname: '',
    givenName: '',
    dateOfBirth: null,
    placeOfBirth: '',
    province: '',
    town: '',
    barrio: '',
    sex: '',
    // Parent/Guardian Information
    parentGuardianName: '',
    parentGuardianAddress: '',
    parentGuardianOccupation: '',
    // Educational Information
    elementaryCourseCompleted: '',
    elementarySchool: '',
    elementaryYear: '',
    elementaryGenAve: '',
    yearGraduated: '',
    currentSchool: '',
    schoolAddress: '',
    studentNumber: '',
    // Pickup Information
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

  const steps = ['Student Information', 'Parent/Guardian Info', 'Educational Background', 'Schedule Pickup', 'Review & Submit'];
  const validateStep = (stepIndex) => {
    const newErrors = {};

    switch (stepIndex) {
      case 0: // Student Information
        if (!formData.purpose.trim()) newErrors.purpose = 'Purpose is required';
        if (!formData.surname.trim()) newErrors.surname = 'Surname is required';
        if (!formData.givenName.trim()) newErrors.givenName = 'Given name is required';
        if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
        if (!formData.sex.trim()) newErrors.sex = 'Sex is required';
        if (!formData.placeOfBirth.trim()) newErrors.placeOfBirth = 'Place of birth is required';
        if (!formData.studentNumber.trim()) newErrors.studentNumber = 'Student number is required';
        break;
      case 1: // Parent/Guardian Information
        if (!formData.parentGuardianName.trim()) newErrors.parentGuardianName = 'Parent/Guardian name is required';
        if (!formData.parentGuardianAddress.trim()) newErrors.parentGuardianAddress = 'Parent/Guardian address is required';
        if (!formData.parentGuardianOccupation.trim()) newErrors.parentGuardianOccupation = 'Parent/Guardian occupation is required';
        break;
      case 2: // Educational Background
        if (!formData.elementaryCourseCompleted.trim()) newErrors.elementaryCourseCompleted = 'Elementary course completed is required';
        if (!formData.elementarySchool.trim()) newErrors.elementarySchool = 'Elementary school is required';
        if (!formData.elementaryYear.trim()) newErrors.elementaryYear = 'Elementary year is required';
        if (!formData.yearGraduated.trim()) newErrors.yearGraduated = 'Year graduated is required';
        if (!formData.currentSchool.trim()) newErrors.currentSchool = 'Current school is required';
        if (!formData.schoolAddress.trim()) newErrors.schoolAddress = 'School address is required';
        break;
      case 3: // Schedule Pickup
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
      setShowSuccess(true);      // Reset form
      setFormData({
        documentType: 'Form 137',
        purpose: '',
        // Student Information
        surname: '',
        givenName: '',
        dateOfBirth: null,
        placeOfBirth: '',
        province: '',
        town: '',
        barrio: '',
        sex: '',
        // Parent/Guardian Information
        parentGuardianName: '',
        parentGuardianAddress: '',
        parentGuardianOccupation: '',
        // Educational Information
        elementaryCourseCompleted: '',
        elementarySchool: '',
        elementaryYear: '',
        elementaryGenAve: '',
        yearGraduated: '',
        currentSchool: '',
        schoolAddress: '',
        studentNumber: '',
        // Pickup Information
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
      case 0: // Student Information
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Student Information
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
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                label="Surname"
                value={formData.surname}
                onChange={(e) => setFormData(prev => ({ ...prev, surname: e.target.value }))}
                error={!!errors.surname}
                helperText={errors.surname}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                label="Given Name"
                value={formData.givenName}
                onChange={(e) => setFormData(prev => ({ ...prev, givenName: e.target.value }))}
                error={!!errors.givenName}
                helperText={errors.givenName}
              />
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
                {errors.sex && <Typography variant="caption" color="error" sx={{ ml: 2, mt: 0.5 }}>{errors.sex}</Typography>}
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label="Place of Birth"
                value={formData.placeOfBirth}
                onChange={(e) => setFormData(prev => ({ ...prev, placeOfBirth: e.target.value }))}
                error={!!errors.placeOfBirth}
                helperText={errors.placeOfBirth}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Province"
                value={formData.province}
                onChange={(e) => setFormData(prev => ({ ...prev, province: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Town"
                value={formData.town}
                onChange={(e) => setFormData(prev => ({ ...prev, town: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Barrio"
                value={formData.barrio}
                onChange={(e) => setFormData(prev => ({ ...prev, barrio: e.target.value }))}
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

      case 1: // Parent/Guardian Information
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Parent/Guardian Information
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label="Parent/Guardian Name"
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
                rows={3}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label="Parent/Guardian Occupation"
                value={formData.parentGuardianOccupation}
                onChange={(e) => setFormData(prev => ({ ...prev, parentGuardianOccupation: e.target.value }))}
                error={!!errors.parentGuardianOccupation}
                helperText={errors.parentGuardianOccupation}
              />
            </Grid>
          </Grid>
        );

      case 2: // Educational Background
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Educational Background
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom sx={{ mt: 2, color: 'primary.main' }}>
                Elementary Education
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                label="Elementary Course Completed"
                value={formData.elementaryCourseCompleted}
                onChange={(e) => setFormData(prev => ({ ...prev, elementaryCourseCompleted: e.target.value }))}
                error={!!errors.elementaryCourseCompleted}
                helperText={errors.elementaryCourseCompleted}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                label="Elementary School"
                value={formData.elementarySchool}
                onChange={(e) => setFormData(prev => ({ ...prev, elementarySchool: e.target.value }))}
                error={!!errors.elementarySchool}
                helperText={errors.elementarySchool}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                label="Elementary Year Graduated"
                value={formData.elementaryYear}
                onChange={(e) => setFormData(prev => ({ ...prev, elementaryYear: e.target.value }))}
                error={!!errors.elementaryYear}
                helperText={errors.elementaryYear}
                placeholder="e.g., 2018"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Elementary General Average"
                value={formData.elementaryGenAve}
                onChange={(e) => setFormData(prev => ({ ...prev, elementaryGenAve: e.target.value }))}
                placeholder="e.g., 85.5"
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom sx={{ mt: 2, color: 'primary.main' }}>
                Secondary Education
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                label="Year Graduated (Secondary)"
                value={formData.yearGraduated}
                onChange={(e) => setFormData(prev => ({ ...prev, yearGraduated: e.target.value }))}
                error={!!errors.yearGraduated}
                helperText={errors.yearGraduated}
                placeholder="e.g., 2022"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label="Secondary School Name"
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

      case 3: // Schedule Pickup
        return (
          <DatePickerWrapper>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Schedule Document Pickup
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <DatePicker
                  label="Preferred Pickup Date"
                  value={formData.preferredPickupDate}
                  onChange={(newValue) => setFormData(prev => ({ ...prev, preferredPickupDate: newValue }))}
                  textFieldProps={{
                    fullWidth: true,
                    required: true,
                    error: !!errors.preferredPickupDate,
                    helperText: errors.preferredPickupDate || 'Please select a date for pickup',
                  }}
                  minDate={addDaysToDate(new Date(), 3)}
                  shouldDisableDate={isWeekendDay}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TimePicker
                  label="Preferred Pickup Time"
                  value={formData.preferredPickupTime}
                  onChange={(newValue) => setFormData(prev => ({ ...prev, preferredPickupTime: newValue }))}
                  textFieldProps={{
                    fullWidth: true,
                    required: true,
                    error: !!errors.preferredPickupTime,
                    helperText: errors.preferredPickupTime || 'Please select a time for pickup',
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

      case 4: // Review & Submit
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
                  
                  {/* Student Information */}
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>Student Information:</Typography>
                    <Typography paragraph>
                      <strong>Name:</strong> {formData.surname}, {formData.givenName}<br/>
                      <strong>Date of Birth:</strong> {formData.dateOfBirth ? new Date(formData.dateOfBirth).toLocaleDateString() : 'Not provided'}<br/>
                      <strong>Sex:</strong> {formData.sex}<br/>
                      <strong>Place of Birth:</strong> {formData.placeOfBirth}<br/>
                      {(formData.province || formData.town || formData.barrio) && (
                        <>
                          <strong>Address:</strong> {[formData.barrio, formData.town, formData.province].filter(Boolean).join(', ')}<br/>
                        </>
                      )}
                      <strong>Student Number:</strong> {formData.studentNumber}
                    </Typography>
                  </Grid>

                  {/* Parent/Guardian Information */}
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>Parent/Guardian Information:</Typography>
                    <Typography paragraph>
                      <strong>Name:</strong> {formData.parentGuardianName}<br/>
                      <strong>Address:</strong> {formData.parentGuardianAddress}<br/>
                      <strong>Occupation:</strong> {formData.parentGuardianOccupation}
                    </Typography>
                  </Grid>

                  {/* Educational Background */}
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>Educational Background:</Typography>
                    <Typography paragraph>
                      <strong>Elementary:</strong> {formData.elementaryCourseCompleted}, {formData.elementarySchool} ({formData.elementaryYear})
                      {formData.elementaryGenAve && ` - Average: ${formData.elementaryGenAve}`}<br/>
                      <strong>Secondary:</strong> {formData.currentSchool}, {formData.schoolAddress} (Graduated: {formData.yearGraduated})
                    </Typography>
                  </Grid>

                  {/* Purpose and Pickup */}
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>Purpose:</Typography>
                    <Typography paragraph>{formData.purpose}</Typography>
                    
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
        );      default:
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
            Form 137 Request
          </Typography>
        </Box>

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
        </Stepper>

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
            <Box sx={{ display: 'flex', gap: 2 }}>
              {activeStep === steps.length - 1 && (
                <PDFDownloadLink
                  document={<Form137PDF formData={formData} />}
                  fileName={`form137_request_${formData.studentNumber}.pdf`}
                  style={{ textDecoration: 'none' }}
                >
                  {({ blob, url, loading: pdfLoading, error }) => (
                    <Button
                      type="button"
                      variant="outlined"
                      color="primary"
                      disabled={pdfLoading || error}
                      startIcon={<DownloadIcon />}
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
