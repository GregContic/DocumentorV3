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
  Chip,
} from '@mui/material';

const MyRequests = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    // Implement fetch requests logic here
    // For example:
    // const fetchRequests = async () => {
    //   const response = await api.getUserRequests(user.id);
    //   setRequests(response.data);
    // };
    // fetchRequests();
    
    // Temporary mock data
    setRequests([
      {
        id: 1,
        documentType: 'Certificate',
        purpose: 'Employment',
        status: 'pending',
        submittedAt: '2024-03-15',
      },
      {
        id: 2,
        documentType: 'Transcript',
        purpose: 'Further Studies',
        status: 'approved',
        submittedAt: '2024-03-14',
      },
    ]);
  }, []);

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
        My Document Requests
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Document Type</TableCell>
              <TableCell>Purpose</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Submitted Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {requests.map((request) => (
              <TableRow key={request.id}>
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
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default MyRequests; 