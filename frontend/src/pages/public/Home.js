import React from 'react';
import {
  Container,
  Typography,
  Paper,
  Button,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  useTheme,
} from '@mui/material';
import {
  Description as DocumentIcon,
  Speed as SpeedIcon,
  Security as SecurityIcon,
  Support as SupportIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Home = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const theme = useTheme();

  const features = [
    {
      icon: <DocumentIcon sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
      title: 'Easy Document Requests',
      description: 'Submit and track your document requests with just a few clicks.',
    },
    {
      icon: <SpeedIcon sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
      title: 'Fast Processing',
      description: 'Quick turnaround time for all your document needs.',
    },
    {
      icon: <SecurityIcon sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
      title: 'Secure System',
      description: 'Your information is protected with state-of-the-art security.',
    },
    {
      icon: <SupportIcon sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
      title: '24/7 Support',
      description: 'Get assistance whenever you need it.',
    },
  ];

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      {/* Hero Section */}
      <Paper
        sx={{
          position: 'relative',
          backgroundColor: 'grey.800',
          color: '#fff',
          mb: 4,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundImage: 'url(https://source.unsplash.com/random?document)',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            right: 0,
            left: 0,
            backgroundColor: 'rgba(0,0,0,.6)',
          }}
        />
        <Container maxWidth="lg">
          <Grid container>
            <Grid item md={8}>
              <Box
                sx={{
                  position: 'relative',
                  p: { xs: 3, md: 6 },
                  pr: { md: 0 },
                  minHeight: '400px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                }}
              >
                <Typography variant="h2" color="inherit" gutterBottom>
                  Document Request System
                </Typography>
                <Typography variant="h5" color="inherit" paragraph>
                  Streamline your document requests with our efficient and user-friendly system.
                  Get started today and experience hassle-free document processing.
                </Typography>
                {!isAuthenticated ? (
                  <Box sx={{ mt: 4 }}>
                    <Button
                      variant="contained"
                      size="large"
                      onClick={() => navigate('/login')}
                      sx={{ mr: 2 }}
                    >
                      Login
                    </Button>
                    <Button
                      variant="outlined"
                      size="large"
                      onClick={() => navigate('/register')}
                      sx={{ color: 'white', borderColor: 'white' }}
                    >
                      Register
                    </Button>
                  </Box>
                ) : (
                  <Box sx={{ mt: 4 }}>
                    <Button
                      variant="contained"
                      size="large"
                      onClick={() => 
                        navigate(user?.role === 'admin' ? '/admin/dashboard' : '/request-document')
                      }
                    >
                      Go to Dashboard
                    </Button>
                  </Box>
                )}
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Paper>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ mb: 8 }}>
        <Typography
          variant="h3"
          align="center"
          gutterBottom
          sx={{ mb: 6 }}
        >
          Our Features
        </Typography>
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: '0.3s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: 6,
                  },
                }}
              >
                <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                  {feature.icon}
                  <Typography gutterBottom variant="h5" component="h2" sx={{ mt: 2 }}>
                    {feature.title}
                  </Typography>
                  <Typography color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* How It Works Section */}
      <Box sx={{ bgcolor: 'grey.100', py: 8 }}>
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            align="center"
            gutterBottom
            sx={{ mb: 6 }}
          >
            How It Works
          </Typography>
          <Grid container spacing={4}>
            {[
              {
                title: '1. Create an Account',
                description: 'Sign up with your email and basic information.',
                image: 'https://source.unsplash.com/random?signup',
              },
              {
                title: '2. Submit Request',
                description: 'Fill out the document request form with required details.',
                image: 'https://source.unsplash.com/random?form',
              },
              {
                title: '3. Track Progress',
                description: 'Monitor your request status in real-time.',
                image: 'https://source.unsplash.com/random?progress',
              },
            ].map((step, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card sx={{ height: '100%' }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={step.image}
                    alt={step.title}
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="h2">
                      {step.title}
                    </Typography>
                    <Typography color="text.secondary">
                      {step.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default Home; 