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
} from '@mui/material';
import { documentService } from '../services/api';

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

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await documentService.getAllRequests();
      setRequests(response.data);
    } catch (error) {
      console.error('Error fetching requests:', error);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleStatusChange = async (requestId, newStatus) => {
    try {
      await documentService.updateRequestStatus(requestId, newStatus);
      fetchRequests(); // Refresh the list
    } catch (error) {
      console.error('Error updating request status:', error);
    }
  };

  const filteredRequests = requests.filter((request) => {
    const matchesSearch = request.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.documentType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Document Requests Dashboard
      </Typography>

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
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Student Name</TableCell>
              <TableCell>Document Type</TableCell>
              <TableCell>Request Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRequests
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((request) => (
                <TableRow key={request._id}>
                  <TableCell>{request.studentName}</TableCell>
                  <TableCell>{request.documentType}</TableCell>
                  <TableCell>
                    {new Date(request.requestDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={request.status}
                      color={statusColors[request.status]}
                      size="small"
                    />
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
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredRequests.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
    </Container>
  );
};

export default Dashboard; 