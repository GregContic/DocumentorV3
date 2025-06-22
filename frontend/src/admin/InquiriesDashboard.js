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
  Dialog,
  DialogTitle,
  DialogContent,  DialogActions,
  IconButton,
  Tooltip,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  Reply as ReplyIcon,
  Delete as DeleteIcon,
  Archive as ArchiveIcon,
} from '@mui/icons-material';
import { inquiryService } from '../services/api';

const statusColors = {
  pending: 'warning',
  inProgress: 'info',
  resolved: 'success',
  completed: 'success',
  closed: 'default',
};

const InquiriesDashboard = () => {
  const [inquiries, setInquiries] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [replyDialogOpen, setReplyDialogOpen] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  useEffect(() => {
    fetchInquiries();
  }, []);
  const fetchInquiries = async () => {
    try {
      const response = await inquiryService.getAllInquiries();
      setInquiries(response.data);
    } catch (error) {
      console.error('Error fetching inquiries:', error);
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };  const handleStatusChange = async (inquiryId, newStatus) => {
    try {
      const response = await inquiryService.updateInquiryStatus(inquiryId, newStatus);
      
      // If the inquiry was marked as completed, it will be automatically archived by the backend
      if (newStatus === 'completed' && response.data) {
        showSnackbar('Inquiry marked as completed and automatically moved to archives', 'success');
      }
      // If the inquiry was marked as resolved, automatically archive it
      else if (newStatus === 'resolved' && response.data) {
        try {
          await inquiryService.archiveInquiry(inquiryId);
          showSnackbar('Inquiry marked as resolved and automatically moved to archives', 'success');
        } catch (archiveError) {
          console.error('Error auto-archiving inquiry:', archiveError);
          showSnackbar('Inquiry marked as resolved but failed to archive automatically', 'warning');
        }
      }
      // If the inquiry was marked as closed, also archive it
      else if (newStatus === 'closed' && response.data) {
        try {
          await inquiryService.archiveInquiry(inquiryId);
          showSnackbar('Inquiry marked as closed and automatically moved to archives', 'success');
        } catch (archiveError) {
          console.error('Error auto-archiving closed inquiry:', archiveError);
          showSnackbar('Inquiry marked as closed but failed to archive automatically', 'warning');
        }
      }
      // For other status changes
      else {
        showSnackbar(`Inquiry status updated to ${newStatus}`, 'success');
      }
      
      fetchInquiries();
    } catch (error) {
      console.error('Error updating inquiry status:', error);
      showSnackbar('Failed to update inquiry status', 'error');
    }
  };

  const handleViewInquiry = (inquiry) => {
    setSelectedInquiry(inquiry);
  };

  const handleReply = async () => {
    if (!selectedInquiry || !replyText.trim()) return;

    try {
      await inquiryService.replyToInquiry(selectedInquiry._id, replyText);
      setReplyDialogOpen(false);
      setReplyText('');
      fetchInquiries();
    } catch (error) {
      console.error('Error sending reply:', error);
    }
  };

  const handleDeleteInquiry = async (inquiryId) => {
    if (window.confirm('Are you sure you want to delete this inquiry?')) {
      try {
        await inquiryService.deleteInquiry(inquiryId);
        fetchInquiries();
      } catch (error) {
        console.error('Error deleting inquiry:', error);
      }
    }
  };

  const handleArchiveInquiry = async (inquiryId) => {
    if (window.confirm('Are you sure you want to archive this inquiry?')) {
      try {
        await inquiryService.archiveInquiry(inquiryId);
        fetchInquiries();
      } catch (error) {
        console.error('Error archiving inquiry:', error);
      }
    }
  };
  const filteredInquiries = inquiries.filter((inquiry) => {
    // Exclude archived inquiries from the main dashboard
    if (inquiry.archived === true) return false;
    
    // Use user info for search and display
    const studentName = inquiry.user ? `${inquiry.user.firstName} ${inquiry.user.lastName}` : '';
    const matchesSearch = 
      studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (inquiry.message || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || inquiry.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Student Inquiries Dashboard
      </Typography>

      {/* Filters */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Search by student name, subject, or message"
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
          >            <MenuItem value="all">All</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="inProgress">In Progress</MenuItem>
            <MenuItem value="resolved">Resolved</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
            <MenuItem value="closed">Closed</MenuItem>
          </TextField>
        </Grid>
      </Grid>

      {/* Inquiries Table */}
      <TableContainer component={Paper}>
        <Table>
      <TableHead>
        <TableRow>
          <TableCell>Student Name</TableCell>
          <TableCell>Email</TableCell>
          <TableCell>Message</TableCell>
          <TableCell>Date</TableCell>
          <TableCell>Status</TableCell>
          <TableCell>Actions</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {filteredInquiries
          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
          .map((inquiry) => {
            const studentName = inquiry.user ? `${inquiry.user.firstName} ${inquiry.user.lastName}` : '';
            const email = inquiry.user ? inquiry.user.email : '';
            return (
              <TableRow key={inquiry._id}>
                <TableCell>{studentName}</TableCell>
                <TableCell>{email}</TableCell>
                <TableCell>{inquiry.message}</TableCell>
                <TableCell>
                  {new Date(inquiry.createdAt).toLocaleDateString()}
                </TableCell>                <TableCell>
                  <TextField
                    select
                    size="small"
                    value={inquiry.status}
                    onChange={(e) => handleStatusChange(inquiry._id, e.target.value)}
                    sx={{ minWidth: 120 }}
                  >                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="inProgress">In Progress</MenuItem>
                    <MenuItem value="resolved">Resolved</MenuItem>
                    <MenuItem value="completed">Completed</MenuItem>
                    <MenuItem value="closed">Closed</MenuItem>
                  </TextField>
                </TableCell>
                <TableCell>
                  <Box>
                    <Tooltip title="View Details">
                      <IconButton
                        size="small"
                        onClick={() => handleViewInquiry(inquiry)}
                      >
                        <VisibilityIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Reply">
                      <IconButton
                        size="small"
                        onClick={() => {
                          setSelectedInquiry(inquiry);
                          setReplyDialogOpen(true);
                        }}
                      >
                        <ReplyIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDeleteInquiry(inquiry._id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                    {inquiry.status === 'resolved' && (
                      <Tooltip title="Archive">
                        <IconButton
                          size="small"
                          color="default"
                          onClick={() => handleArchiveInquiry(inquiry._id)}
                        >
                          <ArchiveIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Box>
                </TableCell>
              </TableRow>
            );
          })}
      </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredInquiries.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      {/* View Inquiry Dialog */}
      <Dialog
        open={Boolean(selectedInquiry)}
        onClose={() => setSelectedInquiry(null)}
        maxWidth="md"
        fullWidth
      >
        {selectedInquiry && (
          <>
            <DialogTitle>
              Inquiry Details
            </DialogTitle>
            <DialogContent>
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  From: {selectedInquiry.user ? `${selectedInquiry.user.firstName} ${selectedInquiry.user.lastName}` : ''}
                </Typography>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Email: {selectedInquiry.user ? selectedInquiry.user.email : ''}
                </Typography>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Date: {new Date(selectedInquiry.createdAt).toLocaleString()}
                </Typography>
                <Typography variant="body1" sx={{ mt: 2 }}>
                  {selectedInquiry.message}
                </Typography>
                {selectedInquiry.replies && selectedInquiry.replies.length > 0 && (
                  <Box sx={{ mt: 3 }}>
                    <Typography variant="h6" gutterBottom>
                      Replies
                    </Typography>
                    {selectedInquiry.replies.map((reply, index) => (
                      <Paper key={index} sx={{ p: 2, mb: 2 }}>
                        <Typography variant="subtitle2">
                          {reply.repliedBy} - {new Date(reply.date).toLocaleString()}
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 1 }}>
                          {reply.message}
                        </Typography>
                      </Paper>
                    ))}
                  </Box>
                )}
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setSelectedInquiry(null)}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Reply Dialog */}
      <Dialog
        open={replyDialogOpen}
        onClose={() => setReplyDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Reply to Inquiry</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={4}
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Type your reply here..."
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReplyDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleReply} variant="contained" color="primary">
            Send Reply          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbarOpen(false)} 
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default InquiriesDashboard;