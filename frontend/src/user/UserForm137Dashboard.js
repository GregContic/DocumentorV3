import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Chip,
  Button,
  CircularProgress,
  Alert,
  Stepper,
  Step,
  StepLabel,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  Download as DownloadIcon,
  QrCode as QrCodeIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  School as SchoolIcon,
  RadioButtonUnchecked as RadioButtonUncheckedIcon,
} from '@mui/icons-material';
import { PDFDownloadLink } from '@react-pdf/renderer';
import Form137StubPDF from '../components/PDFTemplates/Form137StubPDF';
import { form137StubService } from '../services/api';
import { useAuth } from '../context/AuthContext';

const UserForm137Dashboard = () => {
  const [stubs, setStubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const statusLabels = {
    'stub-generated': 'Stub Generated',
    'submitted-to-registrar': 'Submitted to Registrar',
    'verified-by-registrar': 'Verified by Registrar',
    'processing': 'Processing Form 137',
    'ready-for-pickup': 'Ready for Pickup',
    'completed': 'Completed',
    'cancelled': 'Cancelled'
  };

  const statusColors = {
    'stub-generated': 'default',
    'submitted-to-registrar': 'info',
    'verified-by-registrar': 'warning',
    'processing': 'primary',
    'ready-for-pickup': 'success',
    'completed': 'success',
    'cancelled': 'error'
  };

  const statusSteps = [
    'stub-generated',
    'submitted-to-registrar',
    'verified-by-registrar',
    'processing',
    'ready-for-pickup',
    'completed'
  ];

  useEffect(() => {
    fetchUserStubs();
  }, []);

  const fetchUserStubs = async () => {
    try {
      setLoading(true);
      const response = await form137StubService.getUserStubs();
      setStubs(response.data.data);
    } catch (error) {
      console.error('Error fetching user stubs:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActiveStep = (status) => {
    return statusSteps.indexOf(status);
  };

  const formatDate = (date) => {
    if (!date) return null;
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'stub-generated':
        return <QrCodeIcon />;
      case 'submitted-to-registrar':
      case 'verified-by-registrar':
        return <ScheduleIcon />;
      case 'processing':
        return <SchoolIcon />;
      case 'ready-for-pickup':
      case 'completed':
        return <CheckCircleIcon />;
      default:
        return <ScheduleIcon />;
    }
  };

  const getInstructions = (status) => {
    switch (status) {
      case 'stub-generated':
        return 'Please present your stub to the School Registrar with required documents to begin the official transfer process.';
      case 'submitted-to-registrar':
        return 'Your stub has been submitted to the registrar. They will verify your information and begin processing.';
      case 'verified-by-registrar':
        return 'Your information has been verified. The registrar will now begin processing your Form 137.';
      case 'processing':
        return 'Your Form 137 is being processed. You will be notified when it\'s ready for pickup.';
      case 'ready-for-pickup':
        return 'Your Form 137 is ready! Please visit the school to pick it up or it may be sent directly to your receiving school.';
      case 'completed':
        return 'Your Form 137 transfer has been completed successfully.';
      case 'cancelled':
        return 'This request has been cancelled. Please contact the registrar if you have questions.';
      default:
        return '';
    }
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        My Form 137 Requests
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Track the status of your Form 137 transfer requests below.
      </Typography>

      {stubs.length === 0 ? (
        <Alert severity="info">
          You don't have any Form 137 requests yet. 
          <Button href="/user/form137-request" sx={{ ml: 1 }}>
            Create a new request
          </Button>
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {stubs.map((stub) => (
            <Grid item xs={12} key={stub._id}>
              <Paper elevation={2} sx={{ p: 3 }}>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      Stub Code: {stub.stubCode}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Receiving School: {stub.receivingSchool}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Generated: {formatDate(stub.createdAt)}
                    </Typography>
                  </Box>
                  <Box display="flex" flexDirection="column" alignItems="flex-end" gap={1}>
                    <Chip
                      label={statusLabels[stub.status]}
                      color={statusColors[stub.status]}
                      icon={getStatusIcon(stub.status)}
                    />
                    <PDFDownloadLink
                      document={<Form137StubPDF stubData={stub} />}
                      fileName={`Form137_Stub_${stub.stubCode}.pdf`}
                    >
                      {({ loading }) => (
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={loading ? <CircularProgress size={16} /> : <DownloadIcon />}
                          disabled={loading}
                        >
                          {loading ? 'Generating...' : 'Download Stub'}
                        </Button>
                      )}
                    </PDFDownloadLink>
                  </Box>
                </Box>

                {/* Status Progress */}
                <Box mb={2}>
                  <Stepper activeStep={getActiveStep(stub.status)} orientation="horizontal">
                    {statusSteps.map((step, index) => (
                      <Step key={step} completed={getActiveStep(stub.status) > index}>
                        <StepLabel>
                          {statusLabels[step]}
                        </StepLabel>
                      </Step>
                    ))}
                  </Stepper>
                </Box>

                {/* Current Status Information */}
                <Alert 
                  severity={
                    stub.status === 'completed' ? 'success' : 
                    stub.status === 'cancelled' ? 'error' : 
                    stub.status === 'ready-for-pickup' ? 'success' : 'info'
                  }
                  sx={{ mb: 2 }}
                >
                  <Typography variant="body2">
                    {getInstructions(stub.status)}
                  </Typography>
                </Alert>

                {/* Timeline of Events */}
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="subtitle1" gutterBottom>
                      Request Timeline
                    </Typography>
                    <List>
                      <ListItem>
                        <ListItemIcon>
                          <QrCodeIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText
                          primary="Stub Generated"
                          secondary={formatDate(stub.createdAt)}
                        />
                      </ListItem>

                      {stub.submittedAt && (
                        <>
                          <Divider />
                          <ListItem>
                            <ListItemIcon>
                              <ScheduleIcon color="info" />
                            </ListItemIcon>
                            <ListItemText
                              primary="Submitted to Registrar"
                              secondary={formatDate(stub.submittedAt)}
                            />
                          </ListItem>
                        </>
                      )}

                      {stub.verifiedAt && (
                        <>
                          <Divider />
                          <ListItem>
                            <ListItemIcon>
                              <CheckCircleIcon color="warning" />
                            </ListItemIcon>
                            <ListItemText
                              primary="Verified by Registrar"
                              secondary={formatDate(stub.verifiedAt)}
                            />
                          </ListItem>
                        </>
                      )}

                      {stub.readyAt && (
                        <>
                          <Divider />
                          <ListItem>
                            <ListItemIcon>
                              <SchoolIcon color="success" />
                            </ListItemIcon>
                            <ListItemText
                              primary="Ready for Pickup"
                              secondary={formatDate(stub.readyAt)}
                            />
                          </ListItem>
                        </>
                      )}

                      {stub.completedAt && (
                        <>
                          <Divider />
                          <ListItem>
                            <ListItemIcon>
                              <CheckCircleIcon color="success" />
                            </ListItemIcon>
                            <ListItemText
                              primary="Transfer Completed"
                              secondary={formatDate(stub.completedAt)}
                            />
                          </ListItem>
                        </>
                      )}
                    </List>
                  </CardContent>
                </Card>

                {/* Registrar Notes */}
                {stub.registrarNotes && (
                  <Alert severity="info" sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Registrar Notes:
                    </Typography>
                    <Typography variant="body2">
                      {stub.registrarNotes}
                    </Typography>
                  </Alert>
                )}
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default UserForm137Dashboard;
