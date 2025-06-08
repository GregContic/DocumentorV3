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
  Button,
  Chip,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';

const InquiriesDashboard = () => {
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [remarks, setRemarks] = useState('');

  useEffect(() => {
    // Implement fetch requests logic here
    // For example:
    // const fetchRequests = async () => {
    //   const response = await api.getAllRequests();
    //   setRequests(response.data);
    // };
    // fetchRequests();

    // Temporary mock data
    setRequests([
      {
        id: 1,
        userId: 'user123',
        name: 'John Doe',
        documentType: 'Certificate',
        purpose: 'Employment',
        status: 'pending',
        submittedAt: '2024-03-15',
      },
      {
        id: 2,
        userId: 'user456',
        name: 'Jane Smith',
        documentType: 'Transcript',
        purpose: 'Further Studies',
        status: 'pending',
        submittedAt: '2024-03-14',
      },
    ]);
  }, []);

  const handleStatusUpdate = (requestId, newStatus) => {
    setSelectedRequest(requests.find(r => r.id === requestId));
    setIsDialogOpen(true);
  };

  const handleConfirmUpdate = () => {
    // Implement status update logic here
    // For example:
    // await api.updateRequestStatus(selectedRequest.id, { status, remarks });
    
    setRequests(requests.map(request =>
      request.id === selectedRequest.id
        ? { ...request, status: 'approved', remarks }
        : request
    ));
    
    setIsDialogOpen(false);
    setSelectedRequest(null);
    setRemarks('');
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'success';
      case 'pending':
        return 'warning';
      case 'rejected':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Document Requests
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Document Type</TableCell>
              <TableCell>Purpose</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Submitted Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {requests.map((request) => (
              <TableRow key={request.id}>
                <TableCell>{request.name}</TableCell>
                <TableCell>{request.documentType}</TableCell>
                <TableCell>{request.purpose}</TableCell>
                <TableCell>
                  <Chip
                    label={request.status}
                    color={getStatusColor(request.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>{request.submittedAt}</TableCell>
                <TableCell>
                  <Box sx={{ '& > button': { mr: 1 } }}>
                    <Button
                      variant="contained"
                      color="success"
                      size="small"
                      onClick={() => handleStatusUpdate(request.id, 'approved')}
                      disabled={request.status !== 'pending'}
                    >
                      Approve
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      size="small"
                      onClick={() => handleStatusUpdate(request.id, 'rejected')}
                      disabled={request.status !== 'pending'}
                    >
                      Reject
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
        <DialogTitle>Update Request Status</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Remarks"
            fullWidth
            multiline
            rows={4}
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleConfirmUpdate} variant="contained" color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default InquiriesDashboard; 