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
  Alert,  Snackbar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  InputAdornment,
} from '@mui/material';
import { 
  QrCodeScanner as QrIcon,
  Archive as ArchiveIcon,
  Visibility as ViewIcon,
  Search as SearchIcon,
  Assignment as Form137Icon,
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
  const [successMessage, setSuccessMessage] = useState('');  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
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
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>      {/* Modern Header */}
      <Box sx={{ 
        mb: 4,
        p: 4,
        backgroundColor: '#ffffff',
        borderRadius: 3,
        border: '1px solid #e5e7eb',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      }}>        <Typography variant="h3" component="h1" gutterBottom fontWeight="600" sx={{ color: '#1f2937' }}>
          Document Requests Dashboard
        </Typography>
        <Typography variant="h6" sx={{ color: '#6b7280' }}>
          Manage and process all document requests efficiently
        </Typography>
      </Box>

      {/* Action Buttons */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 4,
        gap: 2,
        flexWrap: 'wrap'
      }}>        <Button
          variant="contained"
          size="large"
          startIcon={<QrIcon />}
          onClick={() => setQrVerificationOpen(true)}
          sx={{
            backgroundColor: '#10b981',
            color: 'white',
            borderRadius: 2,
            px: 4,
            py: 1.5,
            textTransform: 'none',
            fontWeight: 600,
            fontSize: '1rem',
            boxShadow: '0 4px 6px -1px rgba(16, 185, 129, 0.2)',
            '&:hover': {
              backgroundColor: '#059669',
              transform: 'translateY(-1px)',
              boxShadow: '0 6px 8px -1px rgba(16, 185, 129, 0.3)',
            },
            transition: 'all 0.2s ease-in-out',
          }}
        >
          Verify Document QR Code
        </Button>

        <Button
          component={RouterLink}
          to="/admin/enrollments"
          variant="outlined"
          size="large"
          startIcon={<ArchiveIcon />}
          sx={{
            borderColor: '#8b5cf6',
            color: '#8b5cf6',
            backgroundColor: 'white',
            borderWidth: 2,
            borderRadius: 2,
            px: 4,
            py: 1.5,
            textTransform: 'none',
            fontWeight: 600,
            fontSize: '1rem',
            '&:hover': {
              borderColor: '#7c3aed',
              backgroundColor: '#f3f4f6',
              transform: 'translateY(-1px)',
              boxShadow: '0 4px 6px -1px rgba(139, 92, 246, 0.2)',
            },
            transition: 'all 0.2s ease-in-out',
          }}
        >
          Student Enrollments
        </Button>

        <Button
          component={RouterLink}
          to="/admin/archive"
          variant="outlined"
          size="large"
          startIcon={<ArchiveIcon />}
          sx={{
            borderColor: '#3b82f6',
            color: '#3b82f6',
            backgroundColor: 'white',
            borderWidth: 2,
            borderRadius: 2,
            px: 4,
            py: 1.5,
            textTransform: 'none',
            fontWeight: 600,
            fontSize: '1rem',
            '&:hover': {
              borderColor: '#2563eb',
              backgroundColor: '#eff6ff',
              transform: 'translateY(-1px)',
              boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.2)',
            },
            transition: 'all 0.2s ease-in-out',
          }}
        >
          View Archive
        </Button>

        <Button
          component={RouterLink}
          to="/admin/form137-stubs"
          variant="outlined"
          size="large"
          startIcon={<Form137Icon />}
          sx={{
            borderColor: '#f59e0b',
            color: '#f59e0b',
            backgroundColor: 'white',
            borderWidth: 2,
            borderRadius: 2,
            px: 4,
            py: 1.5,
            textTransform: 'none',
            fontWeight: 600,
            fontSize: '1rem',
            '&:hover': {
              borderColor: '#d97706',
              backgroundColor: '#fffbeb',
              transform: 'translateY(-1px)',
              boxShadow: '0 4px 6px -1px rgba(245, 158, 11, 0.2)',
            },
            transition: 'all 0.2s ease-in-out',
          }}
        >
          Form 137 Stubs
        </Button>
      </Box>      {error && (
        <Alert 
          severity="error" 
          sx={{ 
            mb: 4, 
            borderRadius: 3,
            boxShadow: '0 4px 12px rgba(244, 67, 54, 0.15)',
            '& .MuiAlert-icon': { fontSize: 28 }
          }}
        >
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          mt: 6,
          mb: 6 
        }}>
          <CircularProgress size={60} thickness={4} />
        </Box>
      ) : (
        <>          {/* Modern Filters */}
          <Paper sx={{ 
            p: 4, 
            mb: 4, 
            backgroundColor: '#ffffff',
            borderRadius: 3,
            border: '1px solid #e5e7eb',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          }}>            <Typography variant="h6" gutterBottom fontWeight="600" sx={{ color: '#1f2937', mb: 3 }}>
              Search & Filter Requests
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  placeholder="Search by student name or document type..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon color="action" />
                      </InputAdornment>
                    ),
                  }}                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      backgroundColor: '#f9fafb',
                      '&:hover fieldset': {
                        borderColor: '#3b82f6',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#3b82f6',
                        borderWidth: 2,
                      },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  select
                  label="Filter by status"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      backgroundColor: '#f9fafb',
                      '&.Mui-focused fieldset': {
                        borderColor: '#3b82f6',
                        borderWidth: 2,
                      },
                    },
                  }}
                >
                  <MenuItem value="all">All Statuses</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="approved">Approved</MenuItem>
                  <MenuItem value="rejected">Rejected</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                </TextField>
              </Grid>
            </Grid>
          </Paper>          {/* Modern Requests Table */}
          <Paper sx={{ 
            backgroundColor: '#ffffff',
            borderRadius: 3,
            border: '1px solid #e5e7eb',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            overflow: 'hidden',
          }}>
            <TableContainer>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>                    <TableCell sx={{ fontWeight: 600, bgcolor: '#f8fafc', py: 3, color: '#374151', borderBottom: '2px solid #e5e7eb' }}>
                      Student Name
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, bgcolor: '#f8fafc', py: 3, color: '#374151', borderBottom: '2px solid #e5e7eb' }}>
                      Email
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, bgcolor: '#f8fafc', py: 3, color: '#374151', borderBottom: '2px solid #e5e7eb' }}>
                      Document Type
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, bgcolor: '#f8fafc', py: 3, color: '#374151', borderBottom: '2px solid #e5e7eb' }}>
                      Purpose
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, bgcolor: '#f8fafc', py: 3, color: '#374151', borderBottom: '2px solid #e5e7eb' }}>
                      Request Date
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, bgcolor: '#f8fafc', py: 3, color: '#374151', borderBottom: '2px solid #e5e7eb' }}>
                      Status
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, bgcolor: '#f8fafc', py: 3, color: '#374151', borderBottom: '2px solid #e5e7eb' }}>
                      Details
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, bgcolor: '#f8fafc', py: 3, color: '#374151', borderBottom: '2px solid #e5e7eb' }}>
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>                <TableBody>
                  {filteredRequests
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((request) => {
                      const studentName = request.user ? `${request.user.firstName} ${request.user.lastName}` : '';
                      const email = request.user ? request.user.email : '';                      return (
                        <TableRow key={request._id} sx={{
                          '&:hover': {
                            backgroundColor: '#f8fafc',
                          },
                          '&:nth-of-type(even)': {
                            backgroundColor: '#fafbfc',
                          },
                        }}>                          <TableCell sx={{ py: 2, color: '#374151' }}>{studentName}</TableCell>
                          <TableCell sx={{ py: 2, color: '#374151' }}>{email}</TableCell>
                          <TableCell sx={{ py: 2, color: '#374151' }}>{request.documentType}</TableCell>
                          <TableCell sx={{ py: 2, color: '#374151' }}>{request.purpose}</TableCell>
                          <TableCell sx={{ py: 2, color: '#374151' }}>{request.createdAt ? new Date(request.createdAt).toLocaleDateString() : ''}</TableCell>                          <TableCell sx={{ py: 2 }}>
                            <Chip
                              label={request.status}
                              color={statusColors[request.status]}
                              size="small"
                              sx={{ 
                                fontWeight: 600,
                                borderRadius: 2,
                              }}
                            />
                          </TableCell>
                          <TableCell sx={{ py: 2 }}>                            <Button
                              size="small"
                              variant="contained"
                              startIcon={<ViewIcon />}                              onClick={() => handleViewDetails(request)}
                              sx={{ 
                                minWidth: 'auto',
                                px: 3,
                                py: 1,
                                borderRadius: 2,
                                textTransform: 'none',
                                backgroundColor: '#3b82f6',
                                color: 'white',
                                fontWeight: 500,
                                '&:hover': {
                                  backgroundColor: '#2563eb',
                                  transform: 'translateY(-1px)',
                                  boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.3)',
                                },
                                transition: 'all 0.2s ease-in-out',
                              }}
                            >
                              View
                            </Button>                          </TableCell>
                          <TableCell sx={{ py: 2 }}>
                            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                              {request.status === 'pending' && (
                                <>                                  <Button
                                    size="small"
                                    variant="contained"
                                    color="success"
                                    onClick={() => handleStatusChange(request._id, 'approved')}
                                    sx={{ 
                                      textTransform: 'none',
                                      borderRadius: 2,
                                      fontWeight: 500,
                                      px: 2,
                                      py: 0.5,
                                    }}
                                  >
                                    Approve
                                  </Button>
                                  <Button
                                    size="small"
                                    variant="contained"
                                    color="error"
                                    onClick={() => handleStatusChange(request._id, 'rejected')}
                                    sx={{ 
                                      textTransform: 'none',
                                      borderRadius: 2,
                                      fontWeight: 500,
                                      px: 2,
                                      py: 0.5,
                                    }}
                                  >
                                    Reject
                                  </Button>
                                </>
                              )}
                              {request.status === 'approved' && (                                <Button
                                  size="small"
                                  variant="contained"
                                  color="primary"
                                  onClick={() => handleStatusChange(request._id, 'completed')}
                                  sx={{ 
                                    textTransform: 'none',
                                    borderRadius: 2,
                                    fontWeight: 500,
                                    px: 2,
                                    py: 0.5,
                                  }}
                                >
                                  Mark as Completed
                                </Button>
                              )}                              <Button
                                size="small"
                                variant="outlined"
                                color="info"
                                onClick={() => handleOpenQrDialog(request)}
                                startIcon={<QrIcon />}
                                sx={{ 
                                  textTransform: 'none',
                                  borderRadius: 2,
                                  fontWeight: 500,
                                  px: 2,
                                  py: 0.5,
                                }}
                              >
                                Verify QR
                              </Button>
                            </Box>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
        </Table>        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredRequests.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
    </Paper>
    </>
    )}
    
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
      </Snackbar>      {/* Modern Request Details Dialog */}
      <Dialog
        open={detailDialogOpen}
        onClose={handleCloseDetailDialog}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: '#ffffff',
            borderRadius: 3,
            border: '1px solid #e5e7eb',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            overflow: 'hidden',
          }
        }}
      >        <DialogTitle 
          sx={{ 
            backgroundColor: '#3b82f6',
            color: 'white',
            py: 3,
            px: 4,
          }}
        >
          <Typography variant="h5" fontWeight="600">
            Complete Document Request Details
          </Typography>
        </DialogTitle>        <DialogContent sx={{ p: 0 }}>
          {requestDetails ? (
            <Box sx={{ p: 4 }}>              {/* Basic Request Information */}
              <Paper sx={{ 
                p: 3, 
                mb: 3, 
                backgroundColor: '#f8fafc',
                border: '1px solid #e5e7eb', 
                borderRadius: 2,
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
              }}>                <Typography variant="h6" sx={{ color: '#1f2937', fontWeight: 600, mb: 2 }}>
                  Request Overview
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                        Student Name
                      </Typography>
                      <Typography variant="body1" fontWeight={500}>
                        {requestDetails.user?.firstName} {requestDetails.user?.lastName}
                      </Typography>
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                        Email
                      </Typography>
                      <Typography variant="body1" fontWeight={500}>
                        {requestDetails.user?.email}
                      </Typography>
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                        Document Type
                      </Typography>
                      <Typography variant="body1" fontWeight={500}>
                        {requestDetails.documentType}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                        Purpose
                      </Typography>
                      <Typography variant="body1" fontWeight={500}>
                        {requestDetails.purpose}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                        Request Date
                      </Typography>
                      <Typography variant="body1" fontWeight={500}>
                        {requestDetails.createdAt ? new Date(requestDetails.createdAt).toLocaleString() : 'N/A'}
                      </Typography>
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                        Status
                      </Typography>
                      <Chip
                        label={requestDetails.status}
                        color={statusColors[requestDetails.status]}
                        size="medium"
                        sx={{ fontWeight: 600 }}
                      />
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                        Request ID
                      </Typography>
                      <Chip
                        label={requestDetails._id}
                        size="small"
                        variant="outlined"
                        sx={{ fontFamily: 'monospace', fontWeight: 600 }}
                      />
                    </Box>
                  </Grid>
                </Grid>
              </Paper>              {/* Student Information */}
              <Paper sx={{ 
                p: 3, 
                mb: 3, 
                backgroundColor: '#fef3e2',
                border: '1px solid #fed7aa', 
                borderRadius: 2,
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
              }}>                <Typography variant="h6" sx={{ color: '#1f2937', fontWeight: 600, mb: 2 }}>
                  Student Information
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={6} md={3}>
                    <Typography variant="subtitle2" color="textSecondary" gutterBottom>Surname</Typography>
                    <Typography variant="body1" fontWeight={500}>{formatFieldValue(requestDetails.surname)}</Typography>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <Typography variant="subtitle2" color="textSecondary" gutterBottom>Given Name</Typography>
                    <Typography variant="body1" fontWeight={500}>{formatFieldValue(requestDetails.givenName)}</Typography>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <Typography variant="subtitle2" color="textSecondary" gutterBottom>Date of Birth</Typography>
                    <Typography variant="body1" fontWeight={500}>{formatFieldValue(requestDetails.dateOfBirth)}</Typography>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <Typography variant="subtitle2" color="textSecondary" gutterBottom>Sex</Typography>
                    <Typography variant="body1" fontWeight={500}>{formatFieldValue(requestDetails.sex)}</Typography>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <Typography variant="subtitle2" color="textSecondary" gutterBottom>Place of Birth</Typography>
                    <Typography variant="body1" fontWeight={500}>{formatFieldValue(requestDetails.placeOfBirth)}</Typography>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <Typography variant="subtitle2" color="textSecondary" gutterBottom>Province</Typography>
                    <Typography variant="body1" fontWeight={500}>{formatFieldValue(requestDetails.province)}</Typography>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <Typography variant="subtitle2" color="textSecondary" gutterBottom>Town</Typography>
                    <Typography variant="body1" fontWeight={500}>{formatFieldValue(requestDetails.town)}</Typography>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <Typography variant="subtitle2" color="textSecondary" gutterBottom>Barrio</Typography>
                    <Typography variant="body1" fontWeight={500}>{formatFieldValue(requestDetails.barrio)}</Typography>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <Typography variant="subtitle2" color="textSecondary" gutterBottom>Student Number</Typography>
                    <Typography variant="body1" fontWeight={500}>{formatFieldValue(requestDetails.studentNumber)}</Typography>
                  </Grid>
                </Grid>
              </Paper>              {/* Parent/Guardian Information */}
              <Paper sx={{ 
                p: 3, 
                mb: 3, 
                backgroundColor: '#eff6ff',
                border: '1px solid #bae6fd', 
                borderRadius: 2,
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
              }}>                <Typography variant="h6" sx={{ color: '#1f2937', fontWeight: 600, mb: 2 }}>
                  Parent/Guardian Information
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={4}>
                    <Typography variant="subtitle2" color="textSecondary" gutterBottom>Name</Typography>
                    <Typography variant="body1" fontWeight={500}>{formatFieldValue(requestDetails.parentGuardianName)}</Typography>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography variant="subtitle2" color="textSecondary" gutterBottom>Address</Typography>
                    <Typography variant="body1" fontWeight={500}>{formatFieldValue(requestDetails.parentGuardianAddress)}</Typography>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography variant="subtitle2" color="textSecondary" gutterBottom>Occupation</Typography>
                    <Typography variant="body1" fontWeight={500}>{formatFieldValue(requestDetails.parentGuardianOccupation)}</Typography>
                  </Grid>
                </Grid>
              </Paper>              {/* Educational Information */}
              <Paper sx={{ 
                p: 3, 
                mb: 3, 
                backgroundColor: '#f0fdf4',
                border: '1px solid #bbf7d0', 
                borderRadius: 2,
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
              }}>                <Typography variant="h6" sx={{ color: '#1f2937', fontWeight: 600, mb: 2 }}>
                  Educational Information
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={6} md={3}>
                    <Typography variant="subtitle2" color="textSecondary" gutterBottom>Elementary Course</Typography>
                    <Typography variant="body1" fontWeight={500}>{formatFieldValue(requestDetails.elementaryCourseCompleted)}</Typography>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <Typography variant="subtitle2" color="textSecondary" gutterBottom>Elementary School</Typography>
                    <Typography variant="body1" fontWeight={500}>{formatFieldValue(requestDetails.elementarySchool)}</Typography>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <Typography variant="subtitle2" color="textSecondary" gutterBottom>Elementary Year</Typography>
                    <Typography variant="body1" fontWeight={500}>{formatFieldValue(requestDetails.elementaryYear)}</Typography>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <Typography variant="subtitle2" color="textSecondary" gutterBottom>General Average</Typography>
                    <Typography variant="body1" fontWeight={500}>{formatFieldValue(requestDetails.elementaryGenAve)}</Typography>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <Typography variant="subtitle2" color="textSecondary" gutterBottom>Year Graduated</Typography>
                    <Typography variant="body1" fontWeight={500}>{formatFieldValue(requestDetails.yearGraduated)}</Typography>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <Typography variant="subtitle2" color="textSecondary" gutterBottom>Current School</Typography>
                    <Typography variant="body1" fontWeight={500}>{formatFieldValue(requestDetails.currentSchool)}</Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" color="textSecondary" gutterBottom>School Address</Typography>
                    <Typography variant="body1" fontWeight={500}>{formatFieldValue(requestDetails.schoolAddress)}</Typography>
                  </Grid>
                </Grid>
              </Paper>              {/* Pickup Information */}
              <Paper sx={{ 
                p: 3, 
                backgroundColor: '#fdf4ff',
                border: '1px solid #e879f9', 
                borderRadius: 2,
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
              }}>                <Typography variant="h6" sx={{ color: '#1f2937', fontWeight: 600, mb: 2 }}>
                  Pickup Information
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={6} md={3}>
                    <Typography variant="subtitle2" color="textSecondary" gutterBottom>Preferred Date</Typography>
                    <Typography variant="body1" fontWeight={500}>{formatFieldValue(requestDetails.preferredPickupDate)}</Typography>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <Typography variant="subtitle2" color="textSecondary" gutterBottom>Preferred Time</Typography>
                    <Typography variant="body1" fontWeight={500}>{formatFieldValue(requestDetails.preferredPickupTime)}</Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" color="textSecondary" gutterBottom>Additional Notes</Typography>
                    <Typography variant="body1" fontWeight={500}>{formatFieldValue(requestDetails.additionalNotes)}</Typography>
                  </Grid>
                </Grid>
              </Paper>
            </Box>
          ) : (
            <Typography variant="body2" color="text.secondary">
              No details available for this request.
            </Typography>
          )}        </DialogContent>
        <DialogActions sx={{ 
          p: 3, 
          backgroundColor: '#f8fafc',
          borderTop: '1px solid #e5e7eb',
        }}>          <Button 
            onClick={handleCloseDetailDialog} 
            variant="contained"
            sx={{ 
              px: 4,
              py: 1.5,
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              backgroundColor: '#3b82f6',
              color: 'white',
              '&:hover': {
                backgroundColor: '#2563eb',
                transform: 'translateY(-1px)',
                boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.3)',
              },
              transition: 'all 0.2s ease-in-out',
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

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
    </Container>
  );
};

export default Dashboard;