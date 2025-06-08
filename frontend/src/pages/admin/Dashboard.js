import React from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
} from '@mui/material';
import {
  Description as DocumentIcon,
  PendingActions as PendingIcon,
  CheckCircle as ApprovedIcon,
  Cancel as RejectedIcon,
} from '@mui/icons-material';

const Dashboard = () => {
  // Mock data - replace with actual API calls
  const stats = {
    totalRequests: 150,
    pendingRequests: 45,
    approvedRequests: 90,
    rejectedRequests: 15,
  };

  const StatCard = ({ title, value, icon: Icon, color }) => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Grid container spacing={2} alignItems="center">
          <Grid item>
            <Icon sx={{ fontSize: 40, color }} />
          </Grid>
          <Grid item xs>
            <Typography color="textSecondary" gutterBottom variant="h6">
              {title}
            </Typography>
            <Typography variant="h4">{value}</Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Requests"
            value={stats.totalRequests}
            icon={DocumentIcon}
            color="primary.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Pending"
            value={stats.pendingRequests}
            icon={PendingIcon}
            color="warning.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Approved"
            value={stats.approvedRequests}
            icon={ApprovedIcon}
            color="success.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Rejected"
            value={stats.rejectedRequests}
            icon={RejectedIcon}
            color="error.main"
          />
        </Grid>
      </Grid>

      <Box sx={{ mt: 4 }}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>
            Recent Activity
          </Typography>
          {/* Add recent activity content here */}
          <Typography color="textSecondary">
            Recent activity will be displayed here
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
};

export default Dashboard; 