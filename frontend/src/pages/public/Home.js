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
      {/* Hero Section */}      <Paper
        sx={{
          position: 'relative',
          backgroundColor: 'grey.800',
          color: '#fff',
          mb: 4,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7)), url(${require('../../assets/images.jpg')})`,
          borderRadius: 0,
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            background: 'linear-gradient(45deg, rgba(25,118,210,0.5), rgba(66,165,245,0.5))',
            mixBlendMode: 'overlay',
          }
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
                  <Box sx={{ mt: 4 }}>                    <Button
                      variant="contained"
                      size="large"
                      onClick={() => navigate('/login')}
                      sx={{
                        mr: 2,
                        py: 1.5,
                        px: 4,
                        borderRadius: '50px',
                        background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-3px)',
                          boxShadow: '0 8px 15px rgba(0,0,0,0.2)',
                        }
                      }}
                    >
                      Login
                    </Button>
                    <Button
                      variant="outlined"
                      size="large"
                      onClick={() => navigate('/register')}
                      sx={{
                        color: 'white',
                        borderColor: 'white',
                        borderWidth: '2px',
                        py: 1.5,
                        px: 4,
                        borderRadius: '50px',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-3px)',
                          borderColor: 'white',
                          boxShadow: '0 8px 15px rgba(255,255,255,0.1)',
                        }
                      }}
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
            <Grid item xs={12} sm={6} md={3} key={index}>              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.3s ease',
                  borderRadius: '16px',
                  background: 'linear-gradient(to bottom right, #ffffff, #f8f9fa)',
                  border: '1px solid rgba(0,0,0,0.1)',
                  overflow: 'hidden',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 20px rgba(0,0,0,0.1)',
                    '& .icon-wrapper': {
                      transform: 'scale(1.1)',
                    }
                  },
                }}
              >                <CardContent sx={{ flexGrow: 1, textAlign: 'center', p: 3 }}>
                  <Box 
                    className="icon-wrapper"
                    sx={{ 
                      mb: 3,
                      transition: 'transform 0.3s ease',
                      display: 'inline-flex',
                      p: 2,
                      borderRadius: '50%',
                      background: 'linear-gradient(45deg, rgba(25,118,210,0.1), rgba(66,165,245,0.1))',
                    }}
                  >
                    {feature.icon}
                  </Box>
                  <Typography 
                    gutterBottom 
                    variant="h5" 
                    component="h2" 
                    sx={{ 
                      fontWeight: 600,
                      color: 'primary.main',
                      mb: 2 
                    }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography 
                    color="text.secondary"
                    sx={{ 
                      lineHeight: 1.7,
                      fontSize: '1rem' 
                    }}
                  >
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
              <Grid item xs={12} md={4} key={index}>                <Card 
                  sx={{ 
                    height: '100%',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 12px 20px rgba(0,0,0,0.15)',
                      '& .step-image': {
                        transform: 'scale(1.1)',
                      }
                    }
                  }}
                >
                  <Box sx={{ overflow: 'hidden', position: 'relative' }}>
                    <CardMedia
                      className="step-image"
                      component="img"
                      height="200"
                      image={step.image}
                      alt={step.title}
                      sx={{
                        transition: 'transform 0.5s ease',
                      }}
                    />
                    <Box
                      sx={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: '50%',
                        background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
                      }}
                    />
                  </Box>
                  <CardContent sx={{ p: 3 }}>
                    <Typography 
                      gutterBottom 
                      variant="h5" 
                      component="h2"
                      sx={{ 
                        fontWeight: 600,
                        color: 'primary.main',
                        mb: 2 
                      }}
                    >
                      {step.title}
                    </Typography>
                    <Typography 
                      color="text.secondary"
                      sx={{ 
                        lineHeight: 1.7,
                        fontSize: '1rem' 
                      }}
                    >
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