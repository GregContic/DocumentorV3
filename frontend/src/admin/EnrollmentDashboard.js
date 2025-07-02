import React, { useEffect, useState } from 'react';
import { enrollmentService } from '../services/api';
import {
  Container,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Box,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Divider,
  IconButton,
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  Close as CloseIcon,
  Person as PersonIcon,
  Home as HomeIcon,
  School as SchoolIcon,
  FamilyRestroom as FamilyIcon,
  LocalHospital as MedicalIcon,
} from '@mui/icons-material';

const EnrollmentDashboard = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedEnrollment, setSelectedEnrollment] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleViewDetails = (enrollment) => {
    setSelectedEnrollment(enrollment);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedEnrollment(null);
  };

  useEffect(() => {
    enrollmentService.getAllEnrollments()
      .then(res => {
        setEnrollments(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to fetch enrollments');
        setLoading(false);
      });
  }, []);

  return (
    <Container maxWidth="xl" sx={{ mt: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Student Enrollment Dashboard
        </Typography>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>LRN</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Grade to Enroll</TableCell>
                  <TableCell>Track</TableCell>
                  <TableCell>Strand</TableCell>
                  <TableCell>Date Submitted</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {enrollments.map((e) => (
                  <TableRow key={e._id}>
                    <TableCell>{e.learnerReferenceNumber}</TableCell>
                    <TableCell>{e.surname}, {e.firstName} {e.middleName}</TableCell>
                    <TableCell>{e.gradeToEnroll}</TableCell>
                    <TableCell>{e.track}</TableCell>
                    <TableCell>{e.strand}</TableCell>
                    <TableCell>{new Date(e.createdAt).toLocaleString()}</TableCell>
                    <TableCell>
                      <Chip label="Submitted" color="primary" size="small" />
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<VisibilityIcon />}
                        onClick={() => handleViewDetails(e)}
                        sx={{ mr: 1 }}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      {/* Enrollment Details Dialog */}
      <Dialog 
        open={dialogOpen} 
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { minHeight: '80vh' }
        }}
      >
        <DialogTitle sx={{ 
          bgcolor: 'primary.main', 
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Typography variant="h6">
            Student Enrollment Details
          </Typography>
          <IconButton 
            edge="end" 
            color="inherit" 
            onClick={handleCloseDialog}
            sx={{ color: 'white' }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        
        <DialogContent sx={{ pt: 3 }}>
          {selectedEnrollment && (
            <Grid container spacing={3}>
              
              {/* Personal Information Section */}
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <PersonIcon sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="h6" color="primary">Personal Information</Typography>
                </Box>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={4}>
                    <Typography variant="body2" color="text.secondary">LRN</Typography>
                    <Typography variant="body1" fontWeight={500}>{selectedEnrollment.learnerReferenceNumber}</Typography>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography variant="body2" color="text.secondary">Last Name</Typography>
                    <Typography variant="body1" fontWeight={500}>{selectedEnrollment.surname}</Typography>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography variant="body2" color="text.secondary">First Name</Typography>
                    <Typography variant="body1" fontWeight={500}>{selectedEnrollment.firstName}</Typography>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography variant="body2" color="text.secondary">Middle Name</Typography>
                    <Typography variant="body1" fontWeight={500}>{selectedEnrollment.middleName || 'N/A'}</Typography>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography variant="body2" color="text.secondary">Extension</Typography>
                    <Typography variant="body1" fontWeight={500}>{selectedEnrollment.extension || 'N/A'}</Typography>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography variant="body2" color="text.secondary">Sex</Typography>
                    <Typography variant="body1" fontWeight={500}>{selectedEnrollment.sex}</Typography>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography variant="body2" color="text.secondary">Date of Birth</Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {selectedEnrollment.dateOfBirth ? new Date(selectedEnrollment.dateOfBirth).toLocaleDateString() : 'N/A'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography variant="body2" color="text.secondary">Place of Birth</Typography>
                    <Typography variant="body1" fontWeight={500}>{selectedEnrollment.placeOfBirth || 'N/A'}</Typography>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography variant="body2" color="text.secondary">Age</Typography>
                    <Typography variant="body1" fontWeight={500}>{selectedEnrollment.age || 'N/A'}</Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2" color="text.secondary">Religion</Typography>
                    <Typography variant="body1" fontWeight={500}>{selectedEnrollment.religion || 'N/A'}</Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2" color="text.secondary">Citizenship</Typography>
                    <Typography variant="body1" fontWeight={500}>{selectedEnrollment.citizenship || 'N/A'}</Typography>
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={12}><Divider /></Grid>

              {/* Address & Contact Information */}
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <HomeIcon sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="h6" color="primary">Address & Contact Information</Typography>
                </Box>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2" color="text.secondary">Complete Address</Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {`${selectedEnrollment.houseNumber || ''} ${selectedEnrollment.street || ''}, ${selectedEnrollment.barangay || ''}, ${selectedEnrollment.city || ''}, ${selectedEnrollment.province || ''} ${selectedEnrollment.zipCode || ''}`.trim()}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Typography variant="body2" color="text.secondary">Contact Number</Typography>
                    <Typography variant="body1" fontWeight={500}>{selectedEnrollment.contactNumber || 'N/A'}</Typography>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Typography variant="body2" color="text.secondary">Email Address</Typography>
                    <Typography variant="body1" fontWeight={500}>{selectedEnrollment.emailAddress || 'N/A'}</Typography>
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={12}><Divider /></Grid>

              {/* Academic Information */}
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <SchoolIcon sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="h6" color="primary">Academic Information</Typography>
                </Box>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2" color="text.secondary">Last School Attended</Typography>
                    <Typography variant="body1" fontWeight={500}>{selectedEnrollment.lastSchoolAttended || 'N/A'}</Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2" color="text.secondary">School Address</Typography>
                    <Typography variant="body1" fontWeight={500}>{selectedEnrollment.schoolAddress || 'N/A'}</Typography>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography variant="body2" color="text.secondary">Grade Level Completed</Typography>
                    <Typography variant="body1" fontWeight={500}>{selectedEnrollment.gradeLevel || 'N/A'}</Typography>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography variant="body2" color="text.secondary">School Year</Typography>
                    <Typography variant="body1" fontWeight={500}>{selectedEnrollment.schoolYear || 'N/A'}</Typography>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography variant="body2" color="text.secondary">Grade to Enroll</Typography>
                    <Typography variant="body1" fontWeight={500}>{selectedEnrollment.gradeToEnroll || 'N/A'}</Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2" color="text.secondary">Track</Typography>
                    <Typography variant="body1" fontWeight={500}>{selectedEnrollment.track || 'N/A'}</Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2" color="text.secondary">Strand</Typography>
                    <Typography variant="body1" fontWeight={500}>{selectedEnrollment.strand || 'N/A'}</Typography>
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={12}><Divider /></Grid>

              {/* Family Information */}
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <FamilyIcon sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="h6" color="primary">Family Information</Typography>
                </Box>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={4}>
                    <Typography variant="body2" color="text.secondary">Father's Name</Typography>
                    <Typography variant="body1" fontWeight={500}>{selectedEnrollment.fatherName || 'N/A'}</Typography>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography variant="body2" color="text.secondary">Father's Occupation</Typography>
                    <Typography variant="body1" fontWeight={500}>{selectedEnrollment.fatherOccupation || 'N/A'}</Typography>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography variant="body2" color="text.secondary">Father's Contact</Typography>
                    <Typography variant="body1" fontWeight={500}>{selectedEnrollment.fatherContactNumber || 'N/A'}</Typography>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography variant="body2" color="text.secondary">Mother's Name</Typography>
                    <Typography variant="body1" fontWeight={500}>{selectedEnrollment.motherName || 'N/A'}</Typography>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography variant="body2" color="text.secondary">Mother's Occupation</Typography>
                    <Typography variant="body1" fontWeight={500}>{selectedEnrollment.motherOccupation || 'N/A'}</Typography>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography variant="body2" color="text.secondary">Mother's Contact</Typography>
                    <Typography variant="body1" fontWeight={500}>{selectedEnrollment.motherContactNumber || 'N/A'}</Typography>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography variant="body2" color="text.secondary">Guardian's Name</Typography>
                    <Typography variant="body1" fontWeight={500}>{selectedEnrollment.guardianName || 'N/A'}</Typography>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography variant="body2" color="text.secondary">Guardian's Relationship</Typography>
                    <Typography variant="body1" fontWeight={500}>{selectedEnrollment.guardianRelationship || 'N/A'}</Typography>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography variant="body2" color="text.secondary">Guardian's Contact</Typography>
                    <Typography variant="body1" fontWeight={500}>{selectedEnrollment.guardianContactNumber || 'N/A'}</Typography>
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={12}><Divider /></Grid>

              {/* Emergency Contact */}
              <Grid item xs={12}>
                <Typography variant="h6" color="primary" sx={{ mb: 2 }}>Emergency Contact</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={4}>
                    <Typography variant="body2" color="text.secondary">Emergency Contact Name</Typography>
                    <Typography variant="body1" fontWeight={500}>{selectedEnrollment.emergencyContactName || 'N/A'}</Typography>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography variant="body2" color="text.secondary">Relationship</Typography>
                    <Typography variant="body1" fontWeight={500}>{selectedEnrollment.emergencyContactRelationship || 'N/A'}</Typography>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography variant="body2" color="text.secondary">Contact Number</Typography>
                    <Typography variant="body1" fontWeight={500}>{selectedEnrollment.emergencyContactNumber || 'N/A'}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary">Emergency Contact Address</Typography>
                    <Typography variant="body1" fontWeight={500}>{selectedEnrollment.emergencyContactAddress || 'N/A'}</Typography>
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={12}><Divider /></Grid>

              {/* Medical Information */}
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <MedicalIcon sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="h6" color="primary">Medical Information</Typography>
                </Box>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={4}>
                    <Typography variant="body2" color="text.secondary">Special Needs</Typography>
                    <Typography variant="body1" fontWeight={500}>{selectedEnrollment.specialNeeds || 'None'}</Typography>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography variant="body2" color="text.secondary">Allergies</Typography>
                    <Typography variant="body1" fontWeight={500}>{selectedEnrollment.allergies || 'None'}</Typography>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography variant="body2" color="text.secondary">Medications</Typography>
                    <Typography variant="body1" fontWeight={500}>{selectedEnrollment.medications || 'None'}</Typography>
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={12}><Divider /></Grid>

              {/* Document Requirements */}
              <Grid item xs={12}>
                <Typography variant="h6" color="primary" sx={{ mb: 2 }}>Document Requirements</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant="body2">Birth Certificate:</Typography>
                      <Chip 
                        label={selectedEnrollment.birthCertificate ? 'Submitted' : 'Not Submitted'} 
                        color={selectedEnrollment.birthCertificate ? 'success' : 'error'}
                        size="small"
                        sx={{ ml: 1 }}
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant="body2">Form 137:</Typography>
                      <Chip 
                        label={selectedEnrollment.form137 ? 'Submitted' : 'Not Submitted'} 
                        color={selectedEnrollment.form137 ? 'success' : 'error'}
                        size="small"
                        sx={{ ml: 1 }}
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant="body2">Form 138:</Typography>
                      <Chip 
                        label={selectedEnrollment.form138 ? 'Submitted' : 'Not Submitted'} 
                        color={selectedEnrollment.form138 ? 'success' : 'error'}
                        size="small"
                        sx={{ ml: 1 }}
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant="body2">Good Moral Certificate:</Typography>
                      <Chip 
                        label={selectedEnrollment.goodMoral ? 'Submitted' : 'Not Submitted'} 
                        color={selectedEnrollment.goodMoral ? 'success' : 'error'}
                        size="small"
                        sx={{ ml: 1 }}
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant="body2">Medical Certificate:</Typography>
                      <Chip 
                        label={selectedEnrollment.medicalCertificate ? 'Submitted' : 'Not Submitted'} 
                        color={selectedEnrollment.medicalCertificate ? 'success' : 'error'}
                        size="small"
                        sx={{ ml: 1 }}
                      />
                    </Box>
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={12}><Divider /></Grid>

              {/* Submission Information */}
              <Grid item xs={12}>
                <Typography variant="h6" color="primary" sx={{ mb: 2 }}>Submission Information</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2" color="text.secondary">Date Submitted</Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {new Date(selectedEnrollment.createdAt).toLocaleString()}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2" color="text.secondary">Agreement Accepted</Typography>
                    <Chip 
                      label={selectedEnrollment.agreementAccepted ? 'Yes' : 'No'} 
                      color={selectedEnrollment.agreementAccepted ? 'success' : 'error'}
                      size="small"
                    />
                  </Grid>
                </Grid>
              </Grid>

            </Grid>
          )}
        </DialogContent>
        
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleCloseDialog} variant="contained">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default EnrollmentDashboard;
