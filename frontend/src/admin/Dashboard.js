import React, { useState, useEffect } from 'react';
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
  TablePagination,
  Button,
  Box,
  Chip,
  TextField,
  MenuItem,
  Grid,
  CircularProgress,
  Alert,
  Snackbar,
  Collapse,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
} from '@mui/material';
import { 
  QrCodeScanner as QrIcon,
  Archive as ArchiveIcon,
  KeyboardArrowDown as ExpandMoreIcon,
  KeyboardArrowUp as ExpandLessIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import { documentService } from '../services/api';
import QRVerificationDialog from '../components/QRVerificationDialog';

const statusColors = {
  pending: 'warning',
  approved: 'success',
  rejected: 'error',
  completed: 'info',
};

const Dashboard = () => {
  const [requests, setRequests] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [qrVerificationOpen, setQrVerificationOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [requestDetails, setRequestDetails] = useState(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await documentService.getAllRequests();
      setRequests(response.data);
    } catch (error) {
      console.error('Error fetching requests:', error);
      const errorMessage = error.response?.data?.message || 'Failed to load requests. Please try again later.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };  const handleStatusChange = async (requestId, newStatus) => {
    try {
      const response = await documentService.updateRequestStatus(requestId, newStatus);
      
      if (newStatus === 'completed') {
        // Remove the completed request from the current view since it's now archived
        setRequests(prevRequests => prevRequests.filter(req => req._id !== requestId));
        
        // Show success message for archiving
        setSuccessMessage('Request completed and moved to archive successfully!');
        setShowSuccessMessage(true);
      } else {
        // For other status changes, refresh the list
        fetchRequests();
      }
    } catch (error) {
      console.error('Error updating request status:', error);
      setError('Failed to update request status. Please try again.');
      // Refresh the list anyway to ensure consistency
      fetchRequests();
    }
  };

  const handleOpenQrDialog = (request) => {
    setSelectedRequest(request);
    setQrVerificationOpen(true);
  };

  const handleCloseQrDialog = () => {
    setQrVerificationOpen(false);
    setSelectedRequest(null);
  };

  const handleToggleExpand = (requestId) => {
    const newExpandedRows = new Set(expandedRows);
    if (newExpandedRows.has(requestId)) {
      newExpandedRows.delete(requestId);
    } else {
      newExpandedRows.add(requestId);
    }
    setExpandedRows(newExpandedRows);
  };

  const handleViewDetails = (request) => {
    setRequestDetails(request);
    setDetailDialogOpen(true);
  };

  const handleCloseDetailDialog = () => {
    setDetailDialogOpen(false);
    setRequestDetails(null);
  };

  const formatFieldValue = (value) => {
    if (!value) return 'Not provided';
    if (value instanceof Date) return value.toLocaleDateString();
    if (typeof value === 'string' && value.includes('T')) {
      // Check if it's a date string
      const date = new Date(value);
      if (!isNaN(date.getTime())) {
        return date.toLocaleDateString();
      }
    }
    return value;
  };

  const filteredRequests = requests.filter((request) => {
    // Use user info for search
    const studentName = request.user ? `${request.user.firstName} ${request.user.lastName}` : '';
    const matchesSearch = studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (request.documentType || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Document Requests Dashboard
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Button
          variant="contained"
          startIcon={<QrIcon />}
          onClick={() => setQrVerificationOpen(true)}
          sx={{
            background: 'linear-gradient(45deg, #2e7d32, #4caf50)',
            '&:hover': {
              background: 'linear-gradient(45deg, #1b5e20, #2e7d32)',
            },
          }}
        >
          Verify Document QR Code
        </Button>
        <Button
          component={RouterLink}
          to="/admin/documents/archive"
          variant="outlined"
          startIcon={<ArchiveIcon />}
          sx={{
            borderColor: '#1976d2',
            color: '#1976d2',            '&:hover': {
              borderColor: '#1565c0',
              backgroundColor: 'rgba(25, 118, 210, 0.04)',
            },
          }}
        >
          View Archive
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
      {/* Filters */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Search by student name or document type"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            select
            label="Filter by status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="approved">Approved</MenuItem>
            <MenuItem value="rejected">Rejected</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
          </TextField>
        </Grid>
      </Grid>

      {/* Requests Table */}
      <TableContainer component={Paper}>
        <Table>          <TableHead>
            <TableRow>
              <TableCell>Student Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Document Type</TableCell>
              <TableCell>Purpose</TableCell>
              <TableCell>Request Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Details</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>          <TableBody>
            {filteredRequests
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((request) => {
                const studentName = request.user ? `${request.user.firstName} ${request.user.lastName}` : '';
                const email = request.user ? request.user.email : '';
                const isExpanded = expandedRows.has(request._id);
                
                return (
                  <React.Fragment key={request._id}>
                    <TableRow>
                      <TableCell>{studentName}</TableCell>
                      <TableCell>{email}</TableCell>
                      <TableCell>{request.documentType}</TableCell>
                      <TableCell>{request.purpose}</TableCell>
                      <TableCell>{request.createdAt ? new Date(request.createdAt).toLocaleDateString() : ''}</TableCell>
                      <TableCell>
                        <Chip
                          label={request.status}
                          color={statusColors[request.status]}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <IconButton
                            size="small"
                            onClick={() => handleToggleExpand(request._id)}
                            sx={{ color: '#1976d2' }}
                          >
                            {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                          </IconButton>
                          <Button
                            size="small"
                            variant="outlined"
                            startIcon={<ViewIcon />}
                            onClick={() => handleViewDetails(request)}
                            sx={{ 
                              minWidth: 'auto',
                              fontSize: '0.75rem',
                              px: 1
                            }}
                          >
                            View
                          </Button>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box>
                          {request.status === 'pending' && (
                            <>
                              <Button
                                size="small"
                                color="success"
                                onClick={() => handleStatusChange(request._id, 'approved')}
                                sx={{ mr: 1 }}
                              >
                                Approve
                              </Button>
                              <Button
                                size="small"
                                color="error"
                                onClick={() => handleStatusChange(request._id, 'rejected')}
                              >
                                Reject
                              </Button>
                            </>
                          )}
                          {request.status === 'approved' && (
                            <Button
                              size="small"
                              color="primary"
                              onClick={() => handleStatusChange(request._id, 'completed')}
                            >
                              Mark as Completed
                            </Button>
                          )}
                          <Button
                            size="small"
                            color="info"
                            onClick={() => handleOpenQrDialog(request)}
                          >
                            <QrIcon fontSize="small" sx={{ mr: 0.5 }} />
                            Verify QR
                          </Button>
                        </Box>
                      </TableCell>
                    </TableRow>
                    
                    {/* Expanded Row with Form Details */}
                    <TableRow>
                      <TableCell colSpan={8} sx={{ py: 0, border: 0 }}>
                        <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                          <Box sx={{ margin: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                            <Typography variant="h6" gutterBottom>
                              Complete Form Details
                            </Typography>
                            <Grid container spacing={2}>
                              {/* Student Information */}
                              <Grid item xs={12}>
                                <Typography variant="subtitle1" fontWeight="bold" color="primary">
                                  Student Information
                                </Typography>
                                <Divider sx={{ mb: 1 }} />
                              </Grid>
                              <Grid item xs={6} md={3}>
                                <Typography variant="body2" color="textSecondary">Surname:</Typography>
                                <Typography variant="body2">{formatFieldValue(request.surname)}</Typography>
                              </Grid>
                              <Grid item xs={6} md={3}>
                                <Typography variant="body2" color="textSecondary">Given Name:</Typography>
                                <Typography variant="body2">{formatFieldValue(request.givenName)}</Typography>
                              </Grid>
                              <Grid item xs={6} md={3}>
                                <Typography variant="body2" color="textSecondary">Date of Birth:</Typography>
                                <Typography variant="body2">{formatFieldValue(request.dateOfBirth)}</Typography>
                              </Grid>
                              <Grid item xs={6} md={3}>
                                <Typography variant="body2" color="textSecondary">Sex:</Typography>
                                <Typography variant="body2">{formatFieldValue(request.sex)}</Typography>
                              </Grid>
                              <Grid item xs={6} md={3}>
                                <Typography variant="body2" color="textSecondary">Place of Birth:</Typography>
                                <Typography variant="body2">{formatFieldValue(request.placeOfBirth)}</Typography>
                              </Grid>
                              <Grid item xs={6} md={3}>
                                <Typography variant="body2" color="textSecondary">Province:</Typography>
                                <Typography variant="body2">{formatFieldValue(request.province)}</Typography>
                              </Grid>
                              <Grid item xs={6} md={3}>
                                <Typography variant="body2" color="textSecondary">Town:</Typography>
                                <Typography variant="body2">{formatFieldValue(request.town)}</Typography>
                              </Grid>
                              <Grid item xs={6} md={3}>
                                <Typography variant="body2" color="textSecondary">Barrio:</Typography>
                                <Typography variant="body2">{formatFieldValue(request.barrio)}</Typography>
                              </Grid>
                              <Grid item xs={6} md={3}>
                                <Typography variant="body2" color="textSecondary">Student Number:</Typography>
                                <Typography variant="body2">{formatFieldValue(request.studentNumber)}</Typography>
                              </Grid>

                              {/* Parent/Guardian Information */}
                              <Grid item xs={12} sx={{ mt: 2 }}>
                                <Typography variant="subtitle1" fontWeight="bold" color="primary">
                                  Parent/Guardian Information
                                </Typography>
                                <Divider sx={{ mb: 1 }} />
                              </Grid>
                              <Grid item xs={6} md={4}>
                                <Typography variant="body2" color="textSecondary">Name:</Typography>
                                <Typography variant="body2">{formatFieldValue(request.parentGuardianName)}</Typography>
                              </Grid>
                              <Grid item xs={6} md={4}>
                                <Typography variant="body2" color="textSecondary">Address:</Typography>
                                <Typography variant="body2">{formatFieldValue(request.parentGuardianAddress)}</Typography>
                              </Grid>
                              <Grid item xs={6} md={4}>
                                <Typography variant="body2" color="textSecondary">Occupation:</Typography>
                                <Typography variant="body2">{formatFieldValue(request.parentGuardianOccupation)}</Typography>
                              </Grid>

                              {/* Educational Information */}
                              <Grid item xs={12} sx={{ mt: 2 }}>
                                <Typography variant="subtitle1" fontWeight="bold" color="primary">
                                  Educational Information
                                </Typography>
                                <Divider sx={{ mb: 1 }} />
                              </Grid>
                              <Grid item xs={6} md={3}>
                                <Typography variant="body2" color="textSecondary">Elementary Course:</Typography>
                                <Typography variant="body2">{formatFieldValue(request.elementaryCourseCompleted)}</Typography>
                              </Grid>
                              <Grid item xs={6} md={3}>
                                <Typography variant="body2" color="textSecondary">Elementary School:</Typography>
                                <Typography variant="body2">{formatFieldValue(request.elementarySchool)}</Typography>
                              </Grid>
                              <Grid item xs={6} md={3}>
                                <Typography variant="body2" color="textSecondary">Elementary Year:</Typography>
                                <Typography variant="body2">{formatFieldValue(request.elementaryYear)}</Typography>
                              </Grid>
                              <Grid item xs={6} md={3}>
                                <Typography variant="body2" color="textSecondary">General Average:</Typography>
                                <Typography variant="body2">{formatFieldValue(request.elementaryGenAve)}</Typography>
                              </Grid>
                              <Grid item xs={6} md={3}>
                                <Typography variant="body2" color="textSecondary">Year Graduated:</Typography>
                                <Typography variant="body2">{formatFieldValue(request.yearGraduated)}</Typography>
                              </Grid>
                              <Grid item xs={6} md={3}>
                                <Typography variant="body2" color="textSecondary">Current School:</Typography>
                                <Typography variant="body2">{formatFieldValue(request.currentSchool)}</Typography>
                              </Grid>
                              <Grid item xs={6} md={6}>
                                <Typography variant="body2" color="textSecondary">School Address:</Typography>
                                <Typography variant="body2">{formatFieldValue(request.schoolAddress)}</Typography>
                              </Grid>

                              {/* Pickup Information */}
                              <Grid item xs={12} sx={{ mt: 2 }}>
                                <Typography variant="subtitle1" fontWeight="bold" color="primary">
                                  Pickup Information
                                </Typography>
                                <Divider sx={{ mb: 1 }} />
                              </Grid>
                              <Grid item xs={6} md={3}>
                                <Typography variant="body2" color="textSecondary">Preferred Date:</Typography>
                                <Typography variant="body2">{formatFieldValue(request.preferredPickupDate)}</Typography>
                              </Grid>
                              <Grid item xs={6} md={3}>
                                <Typography variant="body2" color="textSecondary">Preferred Time:</Typography>
                                <Typography variant="body2">{formatFieldValue(request.preferredPickupTime)}</Typography>
                              </Grid>
                              <Grid item xs={12} md={6}>
                                <Typography variant="body2" color="textSecondary">Additional Notes:</Typography>
                                <Typography variant="body2">{formatFieldValue(request.additionalNotes)}</Typography>
                              </Grid>
                            </Grid>
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                );
              })}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredRequests.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}        />
      </TableContainer>
        {/* QR Verification Dialog */}
      <QRVerificationDialog
        open={qrVerificationOpen}
        onClose={() => setQrVerificationOpen(false)}
      />

      {/* Success Snackbar */}
      <Snackbar
        open={showSuccessMessage}
        autoHideDuration={6000}
        onClose={() => setShowSuccessMessage(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setShowSuccessMessage(false)} 
          severity="success" 
          sx={{ width: '100%' }}
        >
          {successMessage}
        </Alert>
      </Snackbar>

      {/* Request Details Dialog */}
      <Dialog
        open={detailDialogOpen}
        onClose={handleCloseDetailDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Complete Form Details</DialogTitle>        <DialogContent>
          {requestDetails ? (
            <Box>
              {/* Basic Request Information */}
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2">
                    <strong>Student Name:</strong> {requestDetails.user?.firstName} {requestDetails.user?.lastName}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Email:</strong> {requestDetails.user?.email}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Document Type:</strong> {requestDetails.documentType}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Purpose:</strong> {requestDetails.purpose}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2">
                    <strong>Request Date:</strong> {requestDetails.createdAt ? new Date(requestDetails.createdAt).toLocaleString() : 'N/A'}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Status:</strong> 
                    <Chip
                      label={requestDetails.status}
                      color={statusColors[requestDetails.status]}
                      size="small"
                      sx={{ ml: 1 }}
                    />
                  </Typography>
                  <Typography variant="body2">
                    <strong>Request ID:</strong> {requestDetails._id}
                  </Typography>
                </Grid>
              </Grid>

              <Divider sx={{ my: 2 }} />

              {/* Student Information */}
              <Typography variant="h6" color="primary" gutterBottom>
                Student Information
              </Typography>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={6} md={3}>
                  <Typography variant="body2" color="textSecondary">Surname:</Typography>
                  <Typography variant="body2">{formatFieldValue(requestDetails.surname)}</Typography>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Typography variant="body2" color="textSecondary">Given Name:</Typography>
                  <Typography variant="body2">{formatFieldValue(requestDetails.givenName)}</Typography>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Typography variant="body2" color="textSecondary">Date of Birth:</Typography>
                  <Typography variant="body2">{formatFieldValue(requestDetails.dateOfBirth)}</Typography>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Typography variant="body2" color="textSecondary">Sex:</Typography>
                  <Typography variant="body2">{formatFieldValue(requestDetails.sex)}</Typography>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Typography variant="body2" color="textSecondary">Place of Birth:</Typography>
                  <Typography variant="body2">{formatFieldValue(requestDetails.placeOfBirth)}</Typography>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Typography variant="body2" color="textSecondary">Province:</Typography>
                  <Typography variant="body2">{formatFieldValue(requestDetails.province)}</Typography>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Typography variant="body2" color="textSecondary">Town:</Typography>
                  <Typography variant="body2">{formatFieldValue(requestDetails.town)}</Typography>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Typography variant="body2" color="textSecondary">Barrio:</Typography>
                  <Typography variant="body2">{formatFieldValue(requestDetails.barrio)}</Typography>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Typography variant="body2" color="textSecondary">Student Number:</Typography>
                  <Typography variant="body2">{formatFieldValue(requestDetails.studentNumber)}</Typography>
                </Grid>
              </Grid>

              <Divider sx={{ my: 2 }} />

              {/* Parent/Guardian Information */}
              <Typography variant="h6" color="primary" gutterBottom>
                Parent/Guardian Information
              </Typography>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} md={4}>
                  <Typography variant="body2" color="textSecondary">Name:</Typography>
                  <Typography variant="body2">{formatFieldValue(requestDetails.parentGuardianName)}</Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="body2" color="textSecondary">Address:</Typography>
                  <Typography variant="body2">{formatFieldValue(requestDetails.parentGuardianAddress)}</Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="body2" color="textSecondary">Occupation:</Typography>
                  <Typography variant="body2">{formatFieldValue(requestDetails.parentGuardianOccupation)}</Typography>
                </Grid>
              </Grid>

              <Divider sx={{ my: 2 }} />

              {/* Educational Information */}
              <Typography variant="h6" color="primary" gutterBottom>
                Educational Information
              </Typography>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={6} md={3}>
                  <Typography variant="body2" color="textSecondary">Elementary Course:</Typography>
                  <Typography variant="body2">{formatFieldValue(requestDetails.elementaryCourseCompleted)}</Typography>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Typography variant="body2" color="textSecondary">Elementary School:</Typography>
                  <Typography variant="body2">{formatFieldValue(requestDetails.elementarySchool)}</Typography>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Typography variant="body2" color="textSecondary">Elementary Year:</Typography>
                  <Typography variant="body2">{formatFieldValue(requestDetails.elementaryYear)}</Typography>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Typography variant="body2" color="textSecondary">General Average:</Typography>
                  <Typography variant="body2">{formatFieldValue(requestDetails.elementaryGenAve)}</Typography>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Typography variant="body2" color="textSecondary">Year Graduated:</Typography>
                  <Typography variant="body2">{formatFieldValue(requestDetails.yearGraduated)}</Typography>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Typography variant="body2" color="textSecondary">Current School:</Typography>
                  <Typography variant="body2">{formatFieldValue(requestDetails.currentSchool)}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" color="textSecondary">School Address:</Typography>
                  <Typography variant="body2">{formatFieldValue(requestDetails.schoolAddress)}</Typography>
                </Grid>
              </Grid>

              <Divider sx={{ my: 2 }} />

              {/* Pickup Information */}
              <Typography variant="h6" color="primary" gutterBottom>
                Pickup Information
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6} md={3}>
                  <Typography variant="body2" color="textSecondary">Preferred Date:</Typography>
                  <Typography variant="body2">{formatFieldValue(requestDetails.preferredPickupDate)}</Typography>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Typography variant="body2" color="textSecondary">Preferred Time:</Typography>
                  <Typography variant="body2">{formatFieldValue(requestDetails.preferredPickupTime)}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" color="textSecondary">Additional Notes:</Typography>
                  <Typography variant="body2">{formatFieldValue(requestDetails.additionalNotes)}</Typography>
                </Grid>
              </Grid>
            </Box>
          ) : (
            <Typography variant="body2" color="text.secondary">
              No details available for this request.
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDetailDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
      </>
      )}
    </Container>
  );
};

export default Dashboard;