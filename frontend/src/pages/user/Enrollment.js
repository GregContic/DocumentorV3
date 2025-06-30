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
  Card,
  CardContent,
  Chip,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormLabel,
  Checkbox,
} from '@mui/material';
import {
  Send as SendIcon,
  CheckCircle as CheckIcon,
  School as SchoolIcon,
  Person as PersonIcon,
  Group as FamilyIcon,
  Assignment as AssignmentIcon,
  Info as InfoIcon,
  Login as LoginIcon,
  UploadFile as UploadIcon,
} from '@mui/icons-material';
import { DatePickerWrapper, DatePicker } from '../../components/DatePickerWrapper';
import { enrollmentService } from '../../services/api';
import AIDocumentUploader from '../../components/AIDocumentUploader';
import AIAssistantCard from '../../components/AIAssistantCard';
import { useAuth } from '../../context/AuthContext';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

const Enrollment = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    // Student Information
    learnerReferenceNumber: '',
    surname: '',
    firstName: '',
    middleName: '',
    extension: '',
    dateOfBirth: null,
    placeOfBirth: '',
    sex: '',
    age: '',
    religion: '',
    citizenship: '',
    // Address Information
    houseNumber: '',
    street: '',
    barangay: '',
    city: '',
    province: '',
    zipCode: '',
    // Contact Information
    contactNumber: '',
    emailAddress: '',
    // Previous School Information
    lastSchoolAttended: '',
    schoolAddress: '',
    gradeLevel: '',
    schoolYear: '',
    // Parent/Guardian Information
    fatherName: '',
    fatherOccupation: '',
    fatherContactNumber: '',
    motherName: '',
    motherOccupation: '',
    motherContactNumber: '',
    guardianName: '',
    guardianRelationship: '',
    guardianOccupation: '',
    guardianContactNumber: '',
    // Emergency Contact
    emergencyContactName: '',
    emergencyContactRelationship: '',
    emergencyContactNumber: '',
    emergencyContactAddress: '',
    // Enrollment Details
    gradeToEnroll: '',
    strand: '', // For SHS
    track: '', // For SHS
    // Documents
    birthCertificate: false,
    form137: false,
    form138: false,
    goodMoral: false,
    medicalCertificate: false,
    // Additional Information
    specialNeeds: '',
    allergies: '',
    medications: '',
    // Agreement
    agreementAccepted: false,
  });

  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showAIUploader, setShowAIUploader] = useState(false);

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
        if (extractedData.personalInfo.placeOfBirth) updatedFormData.placeOfBirth = extractedData.personalInfo.placeOfBirth;
      }
      
      if (extractedData.address) {
        if (extractedData.address.street) updatedFormData.street = extractedData.address.street;
        if (extractedData.address.city) updatedFormData.city = extractedData.address.city;
        if (extractedData.address.province) updatedFormData.province = extractedData.address.province;
        if (extractedData.address.barangay) updatedFormData.barangay = extractedData.address.barangay;
      }
      
      if (extractedData.academicInfo) {
        if (extractedData.academicInfo.lastSchool) updatedFormData.lastSchoolAttended = extractedData.academicInfo.lastSchool;
        if (extractedData.academicInfo.gradeLevel) updatedFormData.gradeLevel = extractedData.academicInfo.gradeLevel;
        if (extractedData.academicInfo.schoolYear) updatedFormData.schoolYear = extractedData.academicInfo.schoolYear;
      }
      
      if (extractedData.parentInfo) {
        if (extractedData.parentInfo.fatherName) updatedFormData.fatherName = extractedData.parentInfo.fatherName;
        if (extractedData.parentInfo.motherName) updatedFormData.motherName = extractedData.parentInfo.motherName;
        if (extractedData.parentInfo.guardianName) updatedFormData.guardianName = extractedData.parentInfo.guardianName;
      }
      
      setFormData(updatedFormData);
      setShowAIUploader(false);
    }
  };

  const steps = [
    'Student Information', 
    'Address & Contact', 
    'Previous School', 
    'Family Information', 
    'Enrollment Details', 
    'Documents & Medical', 
    'Review & Submit'
  ];

  const gradeLevels = [
    'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10',
    'Grade 11', 'Grade 12'
  ];

  const tracks = [
    'Academic Track',
    'Technical-Vocational-Livelihood (TVL) Track',
    'Sports Track',
    'Arts and Design Track'
  ];

  const academicStrands = [
    'Science, Technology, Engineering and Mathematics (STEM)',
    'Accountancy, Business and Management (ABM)',
    'Humanities and Social Sciences (HUMSS)',
    'General Academic Strand (GAS)'
  ];

  const tvlStrands = [
    'Information and Communications Technology (ICT)',
    'Home Economics (HE)',
    'Agricultural-Fishery Arts (AFA)',
    'Industrial Arts (IA)'
  ];

  const requirements = [
    'Original and Photocopy of Birth Certificate (PSA)',
    'Form 137 (Permanent Record)',
    'Form 138 (Report Card)',
    'Certificate of Good Moral Character',
    'Medical Certificate',
    'Recent 2x2 ID Pictures (4 pieces)',
    'Barangay Certificate of Residency',
    'Parent/Guardian Valid ID (Photocopy)'
  ];

  const validateStep = (stepIndex) => {
    const newErrors = {};

    switch (stepIndex) {
      case 0: // Student Information
        if (!formData.learnerReferenceNumber.trim()) newErrors.learnerReferenceNumber = 'LRN is required';
        if (!formData.surname.trim()) newErrors.surname = 'Surname is required';
        if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
        if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
        if (!formData.placeOfBirth.trim()) newErrors.placeOfBirth = 'Place of birth is required';
        if (!formData.sex) newErrors.sex = 'Sex is required';
        if (!formData.religion.trim()) newErrors.religion = 'Religion is required';
        if (!formData.citizenship.trim()) newErrors.citizenship = 'Citizenship is required';
        break;
      case 1: // Address & Contact
        if (!formData.houseNumber.trim()) newErrors.houseNumber = 'House number is required';
        if (!formData.barangay.trim()) newErrors.barangay = 'Barangay is required';
        if (!formData.city.trim()) newErrors.city = 'City/Municipality is required';
        if (!formData.province.trim()) newErrors.province = 'Province is required';
        if (!formData.contactNumber.trim()) newErrors.contactNumber = 'Contact number is required';
        if (formData.emailAddress && !/\S+@\S+\.\S+/.test(formData.emailAddress)) {
          newErrors.emailAddress = 'Invalid email address';
        }
        break;
      case 2: // Previous School
        if (!formData.lastSchoolAttended.trim()) newErrors.lastSchoolAttended = 'Last school attended is required';
        if (!formData.schoolAddress.trim()) newErrors.schoolAddress = 'School address is required';
        if (!formData.gradeLevel.trim()) newErrors.gradeLevel = 'Grade level is required';
        if (!formData.schoolYear.trim()) newErrors.schoolYear = 'School year is required';
        break;
      case 3: // Family Information
        if (!formData.fatherName.trim()) newErrors.fatherName = 'Father\'s name is required';
        if (!formData.motherName.trim()) newErrors.motherName = 'Mother\'s name is required';
        if (!formData.emergencyContactName.trim()) newErrors.emergencyContactName = 'Emergency contact name is required';
        if (!formData.emergencyContactNumber.trim()) newErrors.emergencyContactNumber = 'Emergency contact number is required';
        break;
      case 4: // Enrollment Details
        if (!formData.gradeToEnroll) newErrors.gradeToEnroll = 'Grade to enroll is required';
        if ((formData.gradeToEnroll === 'Grade 11' || formData.gradeToEnroll === 'Grade 12')) {
          if (!formData.track) newErrors.track = 'Track is required for Senior High School';
          if (formData.track === 'Academic Track' && !formData.strand) {
            newErrors.strand = 'Strand is required for Academic Track';
          }
          if (formData.track === 'Technical-Vocational-Livelihood (TVL) Track' && !formData.strand) {
            newErrors.strand = 'Strand is required for TVL Track';
          }
        }
        break;
      case 5: // Documents & Medical
        if (!formData.birthCertificate) newErrors.birthCertificate = 'Birth certificate confirmation is required';
        if (!formData.form137) newErrors.form137 = 'Form 137 confirmation is required';
        if (!formData.form138) newErrors.form138 = 'Form 138 confirmation is required';
        if (!formData.goodMoral) newErrors.goodMoral = 'Good moral certificate confirmation is required';
        if (!formData.medicalCertificate) newErrors.medicalCertificate = 'Medical certificate confirmation is required';
        break;
      case 6: // Review & Submit
        if (!formData.agreementAccepted) newErrors.agreementAccepted = 'You must accept the enrollment agreement';
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

    setLoading(true);
    try {
      console.log('Submitting enrollment data:', formData);
      
      // Submit enrollment to backend
      const response = await enrollmentService.submitEnrollment(formData);
      console.log('Enrollment submission response:', response);
      setShowSuccess(true);

      // Reset form
      setFormData({
        learnerReferenceNumber: '',
        surname: '',
        firstName: '',
        middleName: '',
        extension: '',
        dateOfBirth: null,
        placeOfBirth: '',
        sex: '',
        age: '',
        religion: '',
        citizenship: '',
        houseNumber: '',
        street: '',
        barangay: '',
        city: '',
        province: '',
        zipCode: '',
        contactNumber: '',
        emailAddress: '',
        lastSchoolAttended: '',
        schoolAddress: '',
        gradeLevel: '',
        schoolYear: '',
        fatherName: '',
        fatherOccupation: '',
        fatherContactNumber: '',
        motherName: '',
        motherOccupation: '',
        motherContactNumber: '',
        guardianName: '',
        guardianRelationship: '',
        guardianOccupation: '',
        guardianContactNumber: '',
        emergencyContactName: '',
        emergencyContactRelationship: '',
        emergencyContactNumber: '',
        emergencyContactAddress: '',
        gradeToEnroll: '',
        strand: '',
        track: '',
        birthCertificate: false,
        form137: false,
        form138: false,
        goodMoral: false,
        medicalCertificate: false,
        specialNeeds: '',
        allergies: '',
        medications: '',
        agreementAccepted: false,
      });
      setActiveStep(0);
    } catch (error) {
      console.error('Enrollment submission error:', error);
      let errorMsg = 'Failed to submit enrollment application. Please try again.';
      if (error.response?.status === 400) {
        errorMsg = 'Invalid enrollment data. Please check your inputs and try again.';
      } else if (error.response?.data?.message) {
        errorMsg = error.response.data.message;
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
                  Student Personal Information
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Please provide accurate student information as it appears on official documents.
                </Typography>
              </Grid>

              {/* AI Assistant Cards */}
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

              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom sx={{ color: 'primary.main' }}>
                  Full Name
                </Typography>
              </Grid>
              <Grid item xs={12} md={3}>
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
              <Grid item xs={12} md={3}>
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
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="Middle Name"
                  value={formData.middleName}
                  onChange={(e) => setFormData(prev => ({ ...prev, middleName: e.target.value }))}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="Extension (Jr., Sr., III)"
                  value={formData.extension}
                  onChange={(e) => setFormData(prev => ({ ...prev, extension: e.target.value }))}
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
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  required
                  label="Religion"
                  value={formData.religion}
                  onChange={(e) => setFormData(prev => ({ ...prev, religion: e.target.value }))}
                  error={!!errors.religion}
                  helperText={errors.religion}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  required
                  label="Citizenship"
                  value={formData.citizenship}
                  onChange={(e) => setFormData(prev => ({ ...prev, citizenship: e.target.value }))}
                  error={!!errors.citizenship}
                  helperText={errors.citizenship}
                  placeholder="e.g., Filipino"
                />
              </Grid>
            </Grid>
          );

        case 1: // Address & Contact
          return (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Address & Contact Information
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Provide your current residential address and contact information.
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom sx={{ color: 'primary.main' }}>
                  Residential Address
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  required
                  label="House Number"
                  value={formData.houseNumber}
                  onChange={(e) => setFormData(prev => ({ ...prev, houseNumber: e.target.value }))}
                  error={!!errors.houseNumber}
                  helperText={errors.houseNumber}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Street/Subdivision"
                  value={formData.street}
                  onChange={(e) => setFormData(prev => ({ ...prev, street: e.target.value }))}
                />
              </Grid>
              <Grid item xs={12} md={6}>
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
              <Grid item xs={12} md={6}>
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
              <Grid item xs={12} md={6}>
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
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="ZIP Code"
                  value={formData.zipCode}
                  onChange={(e) => setFormData(prev => ({ ...prev, zipCode: e.target.value }))}
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom sx={{ color: 'primary.main', mt: 2 }}>
                  Contact Information
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  required
                  label="Contact Number"
                  value={formData.contactNumber}
                  onChange={(e) => setFormData(prev => ({ ...prev, contactNumber: e.target.value }))}
                  error={!!errors.contactNumber}
                  helperText={errors.contactNumber}
                  placeholder="e.g., 09123456789"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Email Address (Optional)"
                  type="email"
                  value={formData.emailAddress}
                  onChange={(e) => setFormData(prev => ({ ...prev, emailAddress: e.target.value }))}
                  error={!!errors.emailAddress}
                  helperText={errors.emailAddress}
                  placeholder="e.g., student@email.com"
                />
              </Grid>
            </Grid>
          );

        case 2: // Previous School
          return (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Previous School Information
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Provide details about your last attended school.
                </Typography>
              </Grid>

              <Grid item xs={12} md={8}>
                <TextField
                  fullWidth
                  required
                  label="Last School Attended"
                  value={formData.lastSchoolAttended}
                  onChange={(e) => setFormData(prev => ({ ...prev, lastSchoolAttended: e.target.value }))}
                  error={!!errors.lastSchoolAttended}
                  helperText={errors.lastSchoolAttended}
                  placeholder="e.g., La Trinidad Elementary School"
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  required
                  label="Grade Level Completed"
                  value={formData.gradeLevel}
                  onChange={(e) => setFormData(prev => ({ ...prev, gradeLevel: e.target.value }))}
                  error={!!errors.gradeLevel}
                  helperText={errors.gradeLevel}
                  placeholder="e.g., Grade 6"
                />
              </Grid>
              <Grid item xs={12} md={8}>
                <TextField
                  fullWidth
                  required
                  label="School Address"
                  value={formData.schoolAddress}
                  onChange={(e) => setFormData(prev => ({ ...prev, schoolAddress: e.target.value }))}
                  error={!!errors.schoolAddress}
                  helperText={errors.schoolAddress}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  required
                  label="School Year Completed"
                  value={formData.schoolYear}
                  onChange={(e) => setFormData(prev => ({ ...prev, schoolYear: e.target.value }))}
                  error={!!errors.schoolYear}
                  helperText={errors.schoolYear}
                  placeholder="e.g., 2024-2025"
                />
              </Grid>
            </Grid>
          );

        case 3: // Family Information
          return (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Family Information
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Please provide information about your parents/guardians and emergency contact.
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom sx={{ color: 'primary.main' }}>
                  Father's Information
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  required
                  label="Father's Full Name"
                  value={formData.fatherName}
                  onChange={(e) => setFormData(prev => ({ ...prev, fatherName: e.target.value }))}
                  error={!!errors.fatherName}
                  helperText={errors.fatherName}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Father's Occupation"
                  value={formData.fatherOccupation}
                  onChange={(e) => setFormData(prev => ({ ...prev, fatherOccupation: e.target.value }))}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Father's Contact Number"
                  value={formData.fatherContactNumber}
                  onChange={(e) => setFormData(prev => ({ ...prev, fatherContactNumber: e.target.value }))}
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom sx={{ color: 'primary.main', mt: 2 }}>
                  Mother's Information
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  required
                  label="Mother's Full Name"
                  value={formData.motherName}
                  onChange={(e) => setFormData(prev => ({ ...prev, motherName: e.target.value }))}
                  error={!!errors.motherName}
                  helperText={errors.motherName}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Mother's Occupation"
                  value={formData.motherOccupation}
                  onChange={(e) => setFormData(prev => ({ ...prev, motherOccupation: e.target.value }))}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Mother's Contact Number"
                  value={formData.motherContactNumber}
                  onChange={(e) => setFormData(prev => ({ ...prev, motherContactNumber: e.target.value }))}
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom sx={{ color: 'primary.main', mt: 2 }}>
                  Guardian Information (if applicable)
                </Typography>
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="Guardian's Full Name"
                  value={formData.guardianName}
                  onChange={(e) => setFormData(prev => ({ ...prev, guardianName: e.target.value }))}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="Relationship"
                  value={formData.guardianRelationship}
                  onChange={(e) => setFormData(prev => ({ ...prev, guardianRelationship: e.target.value }))}
                  placeholder="e.g., Uncle, Aunt"
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="Guardian's Occupation"
                  value={formData.guardianOccupation}
                  onChange={(e) => setFormData(prev => ({ ...prev, guardianOccupation: e.target.value }))}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="Guardian's Contact Number"
                  value={formData.guardianContactNumber}
                  onChange={(e) => setFormData(prev => ({ ...prev, guardianContactNumber: e.target.value }))}
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom sx={{ color: 'primary.main', mt: 2 }}>
                  Emergency Contact
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  required
                  label="Emergency Contact Name"
                  value={formData.emergencyContactName}
                  onChange={(e) => setFormData(prev => ({ ...prev, emergencyContactName: e.target.value }))}
                  error={!!errors.emergencyContactName}
                  helperText={errors.emergencyContactName}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Relationship to Student"
                  value={formData.emergencyContactRelationship}
                  onChange={(e) => setFormData(prev => ({ ...prev, emergencyContactRelationship: e.target.value }))}
                  placeholder="e.g., Mother, Father, Uncle"
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  required
                  label="Emergency Contact Number"
                  value={formData.emergencyContactNumber}
                  onChange={(e) => setFormData(prev => ({ ...prev, emergencyContactNumber: e.target.value }))}
                  error={!!errors.emergencyContactNumber}
                  helperText={errors.emergencyContactNumber}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Emergency Contact Address"
                  value={formData.emergencyContactAddress}
                  onChange={(e) => setFormData(prev => ({ ...prev, emergencyContactAddress: e.target.value }))}
                />
              </Grid>
            </Grid>
          );

        case 4: // Enrollment Details
          return (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Enrollment Details
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Select the grade level and program you wish to enroll in.
                </Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth required error={!!errors.gradeToEnroll}>
                  <InputLabel>Grade Level to Enroll</InputLabel>
                  <Select
                    value={formData.gradeToEnroll}
                    label="Grade Level to Enroll"
                    onChange={(e) => setFormData(prev => ({ ...prev, gradeToEnroll: e.target.value, track: '', strand: '' }))}
                  >
                    {gradeLevels.map((grade) => (
                      <MenuItem key={grade} value={grade}>{grade}</MenuItem>
                    ))}
                  </Select>
                  {errors.gradeToEnroll && <FormHelperText>{errors.gradeToEnroll}</FormHelperText>}
                </FormControl>
              </Grid>

              {/* Senior High School Options */}
              {(formData.gradeToEnroll === 'Grade 11' || formData.gradeToEnroll === 'Grade 12') && (
                <>
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" gutterBottom sx={{ color: 'primary.main', mt: 2 }}>
                      Senior High School Program
                    </Typography>
                    <Alert severity="info" sx={{ mb: 2 }}>
                      Senior High School students must choose a track and strand.
                    </Alert>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth required error={!!errors.track}>
                      <InputLabel>Track</InputLabel>
                      <Select
                        value={formData.track}
                        label="Track"
                        onChange={(e) => setFormData(prev => ({ ...prev, track: e.target.value, strand: '' }))}
                      >
                        {tracks.map((track) => (
                          <MenuItem key={track} value={track}>{track}</MenuItem>
                        ))}
                      </Select>
                      {errors.track && <FormHelperText>{errors.track}</FormHelperText>}
                    </FormControl>
                  </Grid>

                  {formData.track && (
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth required error={!!errors.strand}>
                        <InputLabel>Strand</InputLabel>
                        <Select
                          value={formData.strand}
                          label="Strand"
                          onChange={(e) => setFormData(prev => ({ ...prev, strand: e.target.value }))}
                        >
                          {formData.track === 'Academic Track' && 
                            academicStrands.map((strand) => (
                              <MenuItem key={strand} value={strand}>{strand}</MenuItem>
                            ))
                          }
                          {formData.track === 'Technical-Vocational-Livelihood (TVL) Track' && 
                            tvlStrands.map((strand) => (
                              <MenuItem key={strand} value={strand}>{strand}</MenuItem>
                            ))
                          }
                          {(formData.track === 'Sports Track' || formData.track === 'Arts and Design Track') && (
                            <MenuItem value={formData.track}>{formData.track}</MenuItem>
                          )}
                        </Select>
                        {errors.strand && <FormHelperText>{errors.strand}</FormHelperText>}
                      </FormControl>
                    </Grid>
                  )}

                  {formData.track && formData.strand && (
                    <Grid item xs={12}>
                      <Card sx={{ p: 2, bgcolor: 'primary.50', border: '1px solid', borderColor: 'primary.200' }}>
                        <CardContent>
                          <Typography variant="h6" color="primary" gutterBottom>
                            Program Selection Summary
                          </Typography>
                          <Typography variant="body1">
                            <strong>Grade Level:</strong> {formData.gradeToEnroll}
                          </Typography>
                          <Typography variant="body1">
                            <strong>Track:</strong> {formData.track}
                          </Typography>
                          <Typography variant="body1">
                            <strong>Strand:</strong> {formData.strand}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  )}
                </>
              )}
            </Grid>
          );

        case 5: // Documents & Medical
          return (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Required Documents & Medical Information
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Please confirm that you have all required documents and provide medical information.
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom sx={{ color: 'primary.main' }}>
                  Required Documents Checklist
                </Typography>
                <Alert severity="warning" sx={{ mb: 2 }}>
                  Please ensure you have all these documents ready before submitting your enrollment.
                </Alert>
              </Grid>

              <Grid item xs={12}>
                <Card sx={{ p: 2 }}>
                  <List>
                    {requirements.map((requirement, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <AssignmentIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText primary={requirement} />
                      </ListItem>
                    ))}
                  </List>
                </Card>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom sx={{ color: 'primary.main', mt: 2 }}>
                  Document Confirmation
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Please check each document that you have ready for submission.
                </Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.birthCertificate}
                      onChange={(e) => setFormData(prev => ({ ...prev, birthCertificate: e.target.checked }))}
                      color="primary"
                    />
                  }
                  label="Birth Certificate (PSA)"
                />
                {errors.birthCertificate && <FormHelperText error>{errors.birthCertificate}</FormHelperText>}
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.form137}
                      onChange={(e) => setFormData(prev => ({ ...prev, form137: e.target.checked }))}
                      color="primary"
                    />
                  }
                  label="Form 137 (Permanent Record)"
                />
                {errors.form137 && <FormHelperText error>{errors.form137}</FormHelperText>}
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.form138}
                      onChange={(e) => setFormData(prev => ({ ...prev, form138: e.target.checked }))}
                      color="primary"
                    />
                  }
                  label="Form 138 (Report Card)"
                />
                {errors.form138 && <FormHelperText error>{errors.form138}</FormHelperText>}
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.goodMoral}
                      onChange={(e) => setFormData(prev => ({ ...prev, goodMoral: e.target.checked }))}
                      color="primary"
                    />
                  }
                  label="Certificate of Good Moral Character"
                />
                {errors.goodMoral && <FormHelperText error>{errors.goodMoral}</FormHelperText>}
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.medicalCertificate}
                      onChange={(e) => setFormData(prev => ({ ...prev, medicalCertificate: e.target.checked }))}
                      color="primary"
                    />
                  }
                  label="Medical Certificate"
                />
                {errors.medicalCertificate && <FormHelperText error>{errors.medicalCertificate}</FormHelperText>}
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom sx={{ color: 'primary.main', mt: 3 }}>
                  Medical Information
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  label="Special Needs or Disabilities (if any)"
                  value={formData.specialNeeds}
                  onChange={(e) => setFormData(prev => ({ ...prev, specialNeeds: e.target.value }))}
                  placeholder="Please describe any special needs, learning disabilities, or physical conditions"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  label="Known Allergies"
                  value={formData.allergies}
                  onChange={(e) => setFormData(prev => ({ ...prev, allergies: e.target.value }))}
                  placeholder="List any known allergies (food, medicine, environmental)"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  label="Current Medications"
                  value={formData.medications}
                  onChange={(e) => setFormData(prev => ({ ...prev, medications: e.target.value }))}
                  placeholder="List any medications currently being taken"
                />
              </Grid>
            </Grid>
          );

        case 6: // Review & Submit
          return (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Review & Submit
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Please review all information before submitting your enrollment application.
                </Typography>
              </Grid>

              {/* Student Information Review */}
              <Grid item xs={12}>
                <Card sx={{ p: 3, mb: 2 }}>
                  <Typography variant="h6" color="primary" gutterBottom>
                    <PersonIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Student Information
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="body2" color="text.secondary">LRN:</Typography>
                      <Typography variant="body1">{formData.learnerReferenceNumber || 'Not provided'}</Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="body2" color="text.secondary">Full Name:</Typography>
                      <Typography variant="body1">
                        {`${formData.surname}, ${formData.firstName} ${formData.middleName} ${formData.extension}`.trim()}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="body2" color="text.secondary">Date of Birth:</Typography>
                      <Typography variant="body1">
                        {formData.dateOfBirth ? new Date(formData.dateOfBirth).toLocaleDateString() : 'Not provided'}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="body2" color="text.secondary">Sex:</Typography>
                      <Typography variant="body1">{formData.sex || 'Not provided'}</Typography>
                    </Grid>
                  </Grid>
                </Card>
              </Grid>

              {/* Address Review */}
              <Grid item xs={12}>
                <Card sx={{ p: 3, mb: 2 }}>
                  <Typography variant="h6" color="primary" gutterBottom>
                    <InfoIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Address & Contact
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Typography variant="body2" color="text.secondary">Address:</Typography>
                      <Typography variant="body1">
                        {`${formData.houseNumber} ${formData.street}, ${formData.barangay}, ${formData.city}, ${formData.province}`.trim()}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="body2" color="text.secondary">Contact Number:</Typography>
                      <Typography variant="body1">{formData.contactNumber || 'Not provided'}</Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="body2" color="text.secondary">Email:</Typography>
                      <Typography variant="body1">{formData.emailAddress || 'Not provided'}</Typography>
                    </Grid>
                  </Grid>
                </Card>
              </Grid>

              {/* Enrollment Details Review */}
              <Grid item xs={12}>
                <Card sx={{ p: 3, mb: 2 }}>
                  <Typography variant="h6" color="primary" gutterBottom>
                    <SchoolIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Enrollment Details
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                      <Typography variant="body2" color="text.secondary">Grade to Enroll:</Typography>
                      <Typography variant="body1">{formData.gradeToEnroll || 'Not selected'}</Typography>
                    </Grid>
                    {(formData.gradeToEnroll === 'Grade 11' || formData.gradeToEnroll === 'Grade 12') && (
                      <>
                        <Grid item xs={12} md={4}>
                          <Typography variant="body2" color="text.secondary">Track:</Typography>
                          <Typography variant="body1">{formData.track || 'Not selected'}</Typography>
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <Typography variant="body2" color="text.secondary">Strand:</Typography>
                          <Typography variant="body1">{formData.strand || 'Not selected'}</Typography>
                        </Grid>
                      </>
                    )}
                  </Grid>
                </Card>
              </Grid>

              {/* Family Information Review */}
              <Grid item xs={12}>
                <Card sx={{ p: 3, mb: 2 }}>
                  <Typography variant="h6" color="primary" gutterBottom>
                    <FamilyIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Family Information
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="body2" color="text.secondary">Father's Name:</Typography>
                      <Typography variant="body1">{formData.fatherName || 'Not provided'}</Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="body2" color="text.secondary">Mother's Name:</Typography>
                      <Typography variant="body1">{formData.motherName || 'Not provided'}</Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="body2" color="text.secondary">Emergency Contact:</Typography>
                      <Typography variant="body1">{formData.emergencyContactName || 'Not provided'}</Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="body2" color="text.secondary">Emergency Contact Number:</Typography>
                      <Typography variant="body1">{formData.emergencyContactNumber || 'Not provided'}</Typography>
                    </Grid>
                  </Grid>
                </Card>
              </Grid>

              {/* Documents Review */}
              <Grid item xs={12}>
                <Card sx={{ p: 3, mb: 2 }}>
                  <Typography variant="h6" color="primary" gutterBottom>
                    <AssignmentIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Documents Checklist
                  </Typography>
                  <Grid container spacing={1}>
                    <Grid item xs={12} md={6}>
                      <Chip 
                        label="Birth Certificate" 
                        color={formData.birthCertificate ? "success" : "default"}
                        icon={formData.birthCertificate ? <CheckIcon /> : undefined}
                        variant={formData.birthCertificate ? "filled" : "outlined"}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Chip 
                        label="Form 137" 
                        color={formData.form137 ? "success" : "default"}
                        icon={formData.form137 ? <CheckIcon /> : undefined}
                        variant={formData.form137 ? "filled" : "outlined"}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Chip 
                        label="Form 138" 
                        color={formData.form138 ? "success" : "default"}
                        icon={formData.form138 ? <CheckIcon /> : undefined}
                        variant={formData.form138 ? "filled" : "outlined"}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Chip 
                        label="Good Moral Certificate" 
                        color={formData.goodMoral ? "success" : "default"}
                        icon={formData.goodMoral ? <CheckIcon /> : undefined}
                        variant={formData.goodMoral ? "filled" : "outlined"}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Chip 
                        label="Medical Certificate" 
                        color={formData.medicalCertificate ? "success" : "default"}
                        icon={formData.medicalCertificate ? <CheckIcon /> : undefined}
                        variant={formData.medicalCertificate ? "filled" : "outlined"}
                      />
                    </Grid>
                  </Grid>
                </Card>
              </Grid>

              {/* Agreement */}
              <Grid item xs={12}>
                <Card sx={{ p: 3, bgcolor: 'grey.50' }}>
                  <Typography variant="h6" gutterBottom>
                    Enrollment Agreement
                  </Typography>
                  <Typography variant="body2" paragraph>
                    By submitting this enrollment application, I certify that:
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemText primary="• All information provided is true and complete to the best of my knowledge" />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="• I understand that providing false information may result in the rejection of this application" />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="• I agree to comply with all school policies and regulations" />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="• I understand that enrollment is subject to verification of documents and available slots" />
                    </ListItem>
                  </List>
                  
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.agreementAccepted}
                        onChange={(e) => setFormData(prev => ({ ...prev, agreementAccepted: e.target.checked }))}
                        color="primary"
                      />
                    }
                    label="I have read and agree to the enrollment terms and conditions"
                    sx={{ mt: 2 }}
                  />
                  {errors.agreementAccepted && (
                    <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                      {errors.agreementAccepted}
                    </Typography>
                  )}
                </Card>
              </Grid>
            </Grid>
          );

        default:
          return <Typography>Step content not found</Typography>;
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
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper 
        elevation={3} 
        sx={{ 
          p: { xs: 2, md: 4 },
          backgroundColor: '#ffffff',
          borderRadius: '16px',
        }}
      >
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          mb: 4,
          backgroundColor: '#1976d2',
          borderRadius: '12px',
          p: 3,
          color: 'white'
        }}>
          <SchoolIcon sx={{ fontSize: 48, mr: 3 }} />
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h3" component="h1" sx={{ fontWeight: 700, mb: 1 }}>
              Student Enrollment
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9, mb: 1 }}>
              Eastern La Trinidad National High School
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.8 }}>
              School Year 2025-2026 • Complete your enrollment application online
            </Typography>
          </Box>
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
          <Box sx={{ mt: 4, mb: 4 }}>
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
              }}
            >
              Back
            </Button>
            
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
                backgroundColor: '#1976d2',
                '&:hover': {
                  backgroundColor: '#1565c0',
                },
                '&:disabled': {
                  backgroundColor: '#ccc',
                }
              }}
            >
              {activeStep === steps.length - 1 
                ? 'Submit Enrollment' 
                : 'Next'}
            </Button>
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
            Enrollment application submitted successfully! You can track the status in My Requests.
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

export default Enrollment;
