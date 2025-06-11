import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import { inquiryService } from '../services/api';
import InquiryForm from './InquiryForm';

const statusColors = {
  pending: 'warning',
  inProgress: 'info',
  resolved: 'success',
  closed: 'default',
};

const UserInquiriesDashboard = () => {
  const [inquiries, setInquiries] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedInquiry, setSelectedInquiry] = useState(null);

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    try {
      const response = await inquiryService.getMyInquiries();
      setInquiries(response.data);
    } catch (error) {
      console.error('Error fetching inquiries:', error);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleViewInquiry = (inquiry) => {
    setSelectedInquiry(inquiry);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        My Inquiries
      </Typography>

      {/* Inquiry Form */}
      <InquiryForm />

      {/* Inquiries Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Message</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {inquiries
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((inquiry) => (
                <TableRow key={inquiry._id}>
                  <TableCell>{inquiry.message}</TableCell>
                  <TableCell>{new Date(inquiry.createdAt).toLocaleString()}</TableCell>
                  <TableCell>
                    <Chip
                      label={inquiry.status}
                      color={statusColors[inquiry.status]}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => handleViewInquiry(inquiry)}
                    >
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={inquiries.length}
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
            <DialogTitle>Inquiry Details</DialogTitle>
            <DialogContent>
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Submitted on: {new Date(selectedInquiry.createdAt).toLocaleString()}
                </Typography>
                <Typography variant="body1" paragraph>
                  {selectedInquiry.message}
                </Typography>
                {selectedInquiry.replies && selectedInquiry.replies.length > 0 && (
                  <Box sx={{ mt: 3 }}>
                    <Typography variant="h6" gutterBottom>
                      Responses
                    </Typography>
                    {selectedInquiry.replies.map((reply, index) => (
                      <Paper key={index} sx={{ p: 2, mb: 2, bgcolor: 'grey.50' }}>
                        <Typography variant="subtitle2" gutterBottom>
                          Admin Response - {new Date(reply.date).toLocaleString()}
                        </Typography>
                        <Typography variant="body2">
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
    </Container>
  );
};

export default UserInquiriesDashboard;
