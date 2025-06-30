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
} from '@mui/material';

const EnrollmentDashboard = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Container>
  );
};

export default EnrollmentDashboard;
