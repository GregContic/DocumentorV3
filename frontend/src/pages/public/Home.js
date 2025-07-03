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
  Chip,
  Avatar,
} from '@mui/material';
import {
  Description as DocumentIcon,
  Speed as SpeedIcon,
  Security as SecurityIcon,
  Support as SupportIcon,
  School as SchoolIcon,
  Assignment as AssignmentIcon,
  CheckCircle as CheckIcon,
  Star as StarIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import QRCodeDisplay from '../../components/QRCodeDisplay';

const Home = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const theme = useTheme();
  const features = [
    {
      icon: <DocumentIcon sx={{ fontSize: 50, color: theme.palette.primary.main }} />,
      title: 'Digital Document Management',
      description: 'Request and manage all your academic documents online with our streamlined digital platform.',
    },
    {
      icon: <SpeedIcon sx={{ fontSize: 50, color: theme.palette.primary.main }} />,
      title: 'Lightning Fast Processing',
      description: 'Experience rapid document processing with real-time status updates and instant notifications.',
    },
    {
      icon: <SecurityIcon sx={{ fontSize: 50, color: theme.palette.primary.main }} />,
      title: 'Bank-Level Security',
      description: 'Your sensitive information is protected with enterprise-grade encryption and security protocols.',
    },
    {
      icon: <SupportIcon sx={{ fontSize: 50, color: theme.palette.primary.main }} />,
      title: 'Round-the-Clock Support',
      description: 'Get expert assistance whenever you need help, with our dedicated 24/7 customer support team.',
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
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6)), url('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1950&q=80')`,
          borderRadius: 0,
          overflow: 'hidden',
          minHeight: '600px',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            background: 'linear-gradient(135deg, rgba(25,118,210,0.3), rgba(66,165,245,0.3), rgba(144,202,249,0.2))',
            mixBlendMode: 'overlay',
          },
          animation: 'fadeIn 1.5s ease-in-out',
          '@keyframes fadeIn': {
            '0%': { opacity: 0, transform: 'translateY(20px)' },
            '100%': { opacity: 1, transform: 'translateY(0)' },
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
        />        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
          <Grid container spacing={4} alignItems="center" sx={{ minHeight: '500px' }}>
            <Grid item xs={12} md={7}>
              <Box
                sx={{
                  position: 'relative',
                  p: { xs: 3, md: 6 },
                  pr: { md: 0 },
                  textAlign: { xs: 'center', md: 'left' },
                }}
              >
                <Chip
                  label="🎓 Education Made Simple"
                  sx={{ 
                    mb: 3, 
                    backgroundColor: 'rgba(255,255,255,0.15)',
                    color: 'white',
                    backdropFilter: 'blur(10px)',
                    fontSize: '0.9rem',
                    animation: 'slideInLeft 1s ease-out 0.3s both',
                    '@keyframes slideInLeft': {
                      '0%': { opacity: 0, transform: 'translateX(-30px)' },
                      '100%': { opacity: 1, transform: 'translateX(0)' },
                    }
                  }}
                />
                <Typography 
                  variant="h2" 
                  color="inherit" 
                  gutterBottom
                  sx={{ 
                    fontWeight: 700,
                    fontSize: { xs: '2.5rem', md: '3.5rem' },
                    background: 'linear-gradient(45deg, #fff, #e3f2fd)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    animation: 'slideInUp 1s ease-out 0.5s both',
                    '@keyframes slideInUp': {
                      '0%': { opacity: 0, transform: 'translateY(30px)' },
                      '100%': { opacity: 1, transform: 'translateY(0)' },
                    }
                  }}
                >
                  Document Request System
                </Typography>
                <Typography 
                  variant="h5" 
                  color="inherit" 
                  paragraph
                  sx={{ 
                    mb: 4, 
                    opacity: 0.9,
                    fontWeight: 300,
                    lineHeight: 1.6,
                    animation: 'slideInUp 1s ease-out 0.7s both',
                  }}
                >
                  Streamline your document requests with our efficient and user-friendly system.
                  Get started today and experience hassle-free document processing.
                </Typography>
                {!isAuthenticated ? (
                  <Box sx={{ 
                    mt: 4, 
                    display: 'flex', 
                    gap: 2, 
                    flexDirection: { xs: 'column', sm: 'row' },
                    justifyContent: { xs: 'center', md: 'flex-start' },
                    animation: 'slideInUp 1s ease-out 0.9s both',
                  }}>
                    <Button
                      variant="contained"
                      size="large"
                      onClick={() => navigate('/login')}
                      sx={{
                        py: 1.5,
                        px: 4,
                        fontSize: '1.1rem',
                        fontWeight: 600,
                        background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                        border: 0,
                        borderRadius: '50px',
                        boxShadow: '0 8px 30px rgba(33, 150, 243, 0.4)',
                        color: 'white',
                        transition: 'all 0.3s ease-in-out',
                        '&:hover': {
                          background: 'linear-gradient(45deg, #1976D2 30%, #1CB5E0 90%)',
                          transform: 'translateY(-3px)',
                          boxShadow: '0 12px 40px rgba(33, 150, 243, 0.6)',
                        },
                      }}
                    >
                      Login Now
                    </Button>
                    <Button
                      variant="outlined"
                      size="large"
                      onClick={() => navigate('/register')}
                      sx={{
                        py: 1.5,
                        px: 4,
                        fontSize: '1.1rem',
                        fontWeight: 600,
                        borderRadius: '50px',
                        borderColor: 'rgba(255,255,255,0.5)',
                        color: 'white',
                        backdropFilter: 'blur(10px)',
                        backgroundColor: 'rgba(255,255,255,0.1)',
                        transition: 'all 0.3s ease-in-out',
                        '&:hover': {
                          borderColor: 'white',
                          backgroundColor: 'rgba(255,255,255,0.2)',
                          transform: 'translateY(-2px)',
                        },
                      }}
                    >
                      Register Now
                    </Button>
                  </Box>
                ) : (
                  <Box sx={{ mt: 4, animation: 'slideInUp 1s ease-out 0.9s both' }}>
                    <Button
                      variant="contained"
                      size="large"
                      onClick={() => 
                        navigate(user?.role === 'admin' ? '/admin/dashboard' : '/request-document')
                      }
                      sx={{
                        py: 1.5,
                        px: 4,
                        fontSize: '1.1rem',
                        fontWeight: 600,
                        background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                        border: 0,
                        borderRadius: '50px',
                        boxShadow: '0 8px 30px rgba(33, 150, 243, 0.4)',
                        color: 'white',
                        transition: 'all 0.3s ease-in-out',
                        '&:hover': {
                          background: 'linear-gradient(45deg, #1976D2 30%, #1CB5E0 90%)',
                          transform: 'translateY(-3px)',
                          boxShadow: '0 12px 40px rgba(33, 150, 243, 0.6)',
                        },
                      }}
                    >
                      Go to Dashboard
                    </Button>
                  </Box>
                )}
              </Box>
            </Grid>
            <Grid item xs={12} md={5}>
              <Box sx={{ 
                textAlign: 'center',
                animation: 'floatAnimation 3s ease-in-out infinite',
                '@keyframes floatAnimation': {
                  '0%, 100%': { transform: 'translateY(0)' },
                  '50%': { transform: 'translateY(-10px)' },
                }
              }}>
                <img
                  src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Students studying"
                  style={{
                    width: '100%',
                    maxWidth: '450px',
                    height: 'auto',
                    borderRadius: '20px',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                    border: '3px solid rgba(255,255,255,0.2)',
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Paper>      {/* Features Section */}
      <Container maxWidth="lg" sx={{ mb: 8, py: 4 }}>
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography
            variant="h3"
            align="center"
            gutterBottom
            sx={{ 
              mb: 2,
              fontWeight: 700,
              background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Why Choose Our Platform?
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ maxWidth: '600px', mx: 'auto', mb: 4 }}
          >
            Discover the benefits that make us the preferred choice for document management
          </Typography>
        </Box>
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  borderRadius: '20px',
                  background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
                  border: '1px solid rgba(0,0,0,0.05)',
                  overflow: 'hidden',
                  position: 'relative',
                  animation: `slideInUp 0.6s ease-out ${index * 0.1}s both`,
                  '@keyframes slideInUp': {
                    '0%': { opacity: 0, transform: 'translateY(40px)' },
                    '100%': { opacity: 1, transform: 'translateY(0)' },
                  },
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
                    transform: 'scaleX(0)',
                    transition: 'transform 0.3s ease',
                  },
                  '&:hover': {
                    transform: 'translateY(-12px) scale(1.02)',
                    boxShadow: `0 20px 40px rgba(25,118,210,0.15)`,
                    '&::before': {
                      transform: 'scaleX(1)',
                    },
                    '& .icon-wrapper': {
                      transform: 'scale(1.2) rotate(10deg)',
                      background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
                      '& .MuiSvgIcon-root': {
                        color: 'white',
                      }
                    }
                  },
                }}
              >
                <CardContent sx={{ flexGrow: 1, textAlign: 'center', p: 4 }}>
                  <Box 
                    className="icon-wrapper"
                    sx={{ 
                      mb: 3,
                      transition: 'all 0.4s ease',
                      display: 'inline-flex',
                      p: 3,
                      borderRadius: '50%',
                      background: 'linear-gradient(45deg, rgba(25,118,210,0.1), rgba(66,165,245,0.1))',
                      border: `2px solid ${theme.palette.primary.main}33`,
                    }}
                  >
                    {feature.icon}
                  </Box>
                  <Typography 
                    gutterBottom 
                    variant="h5" 
                    component="h3" 
                    sx={{ 
                      fontWeight: 700,
                      color: 'primary.main',
                      mb: 2,
                      fontSize: '1.3rem'
                    }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography 
                    color="text.secondary"
                    sx={{ 
                      lineHeight: 1.8,
                      fontSize: '1rem',
                      fontWeight: 400,
                    }}
                  >
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}        </Grid>
      </Container>

      {/* How It Works Section */}
      <Box sx={{ 
        bgcolor: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', 
        py: 8,
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(135deg, rgba(25,118,210,0.05) 0%, rgba(66,165,245,0.05) 100%)',
        }
      }}>
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography
              variant="h3"
              align="center"
              gutterBottom
              sx={{ 
                mb: 2,
                fontWeight: 700,
                background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              How It Works
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ maxWidth: '600px', mx: 'auto', mb: 4 }}
            >
              Simple steps to get your documents quickly and securely
            </Typography>
          </Box>
          <Grid container spacing={4}>
            {[
              {
                title: '1. Create an Account',
                description: 'Sign up with your email and basic information to get started with our secure platform.',
                image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                color: '#4CAF50',
              },
              {
                title: '2. Submit Request',
                description: 'Fill out the comprehensive document request form with all required details and information.',
                image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                color: '#FF9800',
              },
              {
                title: '3. Track Progress',
                description: 'Monitor your request status in real-time and receive notifications about updates.',
                image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                color: '#2196F3',
              },
            ].map((step, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card 
                  sx={{ 
                    height: '100%',
                    borderRadius: '20px',
                    overflow: 'hidden',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
                    border: '1px solid rgba(255,255,255,0.8)',
                    backdropFilter: 'blur(10px)',
                    position: 'relative',
                    animation: `fadeInUp 0.6s ease-out ${index * 0.2}s both`,
                    '@keyframes fadeInUp': {
                      '0%': { opacity: 0, transform: 'translateY(40px)' },
                      '100%': { opacity: 1, transform: 'translateY(0)' },
                    },
                    '&:hover': {
                      transform: 'translateY(-12px) scale(1.02)',
                      boxShadow: `0 20px 40px rgba(0,0,0,0.1), 0 0 0 1px ${step.color}33`,
                      '& .step-image': {
                        transform: 'scale(1.1)',
                      },
                      '& .step-number': {
                        transform: 'scale(1.2) rotate(360deg)',
                      }
                    }
                  }}
                >
                  <Box sx={{ overflow: 'hidden', position: 'relative', height: 200 }}>
                    <CardMedia
                      className="step-image"
                      component="img"
                      height="200"
                      image={step.image}
                      alt={step.title}
                      sx={{
                        transition: 'transform 0.5s ease',
                        filter: 'brightness(0.9)',
                      }}
                    />
                    <Box
                      className="step-number"
                      sx={{
                        position: 'absolute',
                        top: 16,
                        right: 16,
                        width: 50,
                        height: 50,
                        borderRadius: '50%',
                        backgroundColor: step.color,
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold',
                        fontSize: '1.2rem',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                        transition: 'all 0.3s ease',
                      }}
                    >
                      {index + 1}
                    </Box>
                  </Box>
                  <CardContent sx={{ p: 3 }}>
                    <Typography 
                      gutterBottom 
                      variant="h5" 
                      component="h3"
                      sx={{ 
                        fontWeight: 600,
                        color: step.color,
                        mb: 2 
                      }}                    >
                      {step.title}
                    </Typography>
                    <Typography 
                      variant="body1" 
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
            ))}          </Grid>
        </Container>
      </Box>

      {/* Call to Action Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          py: 8,
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'url("https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&auto=format&fit=crop&w=1950&q=80")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.1,
          },
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                mb: 3,
                animation: 'fadeInUp 1s ease-out',
                '@keyframes fadeInUp': {
                  '0%': { opacity: 0, transform: 'translateY(30px)' },
                  '100%': { opacity: 1, transform: 'translateY(0)' },
                },
              }}
            >
              Ready to Get Started?
            </Typography>
            <Typography
              variant="h5"
              sx={{
                mb: 4,
                opacity: 0.9,
                maxWidth: '600px',
                mx: 'auto',
                lineHeight: 1.6,
                animation: 'fadeInUp 1s ease-out 0.2s both',
              }}
            >
              Join thousands of users who trust our platform for their document needs. 
              Experience the convenience of digital document management today.
            </Typography>
            <Box sx={{ 
              display: 'flex', 
              gap: 3, 
              justifyContent: 'center',
              flexDirection: { xs: 'column', sm: 'row' },
              animation: 'fadeInUp 1s ease-out 0.4s both',
            }}>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/register')}
                sx={{
                  py: 2,
                  px: 6,
                  fontSize: '1.2rem',
                  fontWeight: 600,
                  background: 'linear-gradient(45deg, #FFF 30%, #F0F0F0 90%)',
                  color: '#1976d2',
                  border: 0,
                  borderRadius: '50px',
                  boxShadow: '0 8px 30px rgba(255,255,255,0.3)',
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #F5F5F5 30%, #E0E0E0 90%)',
                    transform: 'translateY(-3px)',
                    boxShadow: '0 12px 40px rgba(255,255,255,0.4)',
                  },
                }}
              >
                Get Started Now
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate('/login')}
                sx={{
                  py: 2,
                  px: 6,
                  fontSize: '1.2rem',
                  fontWeight: 600,
                  borderRadius: '50px',
                  borderColor: 'rgba(255,255,255,0.7)',
                  color: 'white',
                  borderWidth: '2px',
                  backdropFilter: 'blur(10px)',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    borderColor: 'white',
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                Sign In
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Services Section */}
      <Box sx={{ 
        py: 8,
        background: 'linear-gradient(135deg, #f8f9ff 0%, #e8f5e8 100%)',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(135deg, rgba(25,118,210,0.02) 0%, rgba(76,175,80,0.02) 100%)',
        }
      }}>
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography
              variant="h3"
              align="center"
              gutterBottom
              sx={{ 
                mb: 2,
                fontWeight: 700,
                background: 'linear-gradient(45deg, #1976d2, #4caf50)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Our Services
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ maxWidth: '600px', mx: 'auto', mb: 4 }}
            >
              Comprehensive educational services for students and families
            </Typography>
          </Box>
          
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Card
                sx={{
                  height: '100%',
                  transition: 'all 0.3s ease-in-out',
                  cursor: 'pointer',
                  background: 'linear-gradient(135deg, #fff 0%, #f8f9ff 100%)',
                  border: '1px solid',
                  borderColor: 'rgba(25, 118, 210, 0.12)',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 20px 40px rgba(25, 118, 210, 0.15)',
                    borderColor: 'primary.main',
                  },
                }}
                onClick={() => navigate('/enrollment')}
              >
                <CardContent sx={{ p: 4, textAlign: 'center' }}>
                  <Avatar
                    sx={{
                      width: 80,
                      height: 80,
                      mx: 'auto',
                      mb: 3,
                      background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
                    }}
                  >
                    <SchoolIcon sx={{ fontSize: 40 }} />
                  </Avatar>
                  <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, mb: 2 }}>
                    Student Enrollment
                  </Typography>
                  <Typography variant="h6" color="primary" gutterBottom sx={{ mb: 3 }}>
                    Eastern La Trinidad National High School
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 3, lineHeight: 1.6 }}>
                    Complete your enrollment application online for School Year 2025-2026. 
                    Multi-step process with AI-assisted document upload and real-time validation.
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', flexWrap: 'wrap', mb: 3 }}>
                    <Chip label="Grades 7-12" size="small" color="primary" variant="outlined" />
                    <Chip label="Senior High School" size="small" color="primary" variant="outlined" />
                    <Chip label="AI-Assisted" size="small" color="success" variant="outlined" />
                  </Box>
                  <Button
                    variant="contained"
                    size="large"
                    fullWidth
                    sx={{
                      py: 1.5,
                      background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
                      borderRadius: '12px',
                      fontWeight: 600,
                      '&:hover': {
                        background: 'linear-gradient(45deg, #1565c0 30%, #1e88e5 90%)',
                      },
                    }}
                  >
                    Start Enrollment
                  </Button>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card
                sx={{
                  height: '100%',
                  transition: 'all 0.3s ease-in-out',
                  cursor: 'pointer',
                  background: 'linear-gradient(135deg, #fff 0%, #f0f7ff 100%)',
                  border: '1px solid',
                  borderColor: 'rgba(25, 118, 210, 0.12)',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 20px 40px rgba(25, 118, 210, 0.15)',
                    borderColor: 'primary.main',
                  },
                }}
                onClick={() => navigate(isAuthenticated ? '/request-document' : '/login')}
              >
                <CardContent sx={{ p: 4, textAlign: 'center' }}>
                  <Avatar
                    sx={{
                      width: 80,
                      height: 80,
                      mx: 'auto',
                      mb: 3,
                      background: 'linear-gradient(135deg, #ff9800 0%, #ffb74d 100%)',
                    }}
                  >
                    <AssignmentIcon sx={{ fontSize: 40 }} />
                  </Avatar>
                  <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, mb: 2 }}>
                    Document Requests
                  </Typography>
                  <Typography variant="h6" color="primary" gutterBottom sx={{ mb: 3 }}>
                    Academic Records & Certificates
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 3, lineHeight: 1.6 }}>
                    Request official academic documents including Form 137, Form 138, SF9, SF10, 
                    diplomas, and transcripts with online tracking and pickup scheduling.
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', flexWrap: 'wrap', mb: 3 }}>
                    <Chip label="Form 137" size="small" color="secondary" variant="outlined" />
                    <Chip label="Diploma" size="small" color="secondary" variant="outlined" />
                    <Chip label="Transcripts" size="small" color="secondary" variant="outlined" />
                  </Box>
                  <Button
                    variant="contained"
                    size="large"
                    fullWidth
                    sx={{
                      py: 1.5,
                      background: 'linear-gradient(45deg, #ff9800 30%, #ffb74d 90%)',
                      borderRadius: '12px',
                      fontWeight: 600,
                      '&:hover': {
                        background: 'linear-gradient(45deg, #f57c00 30%, #ff9800 90%)',
                      },
                    }}
                  >
                    {isAuthenticated ? 'Request Documents' : 'Login to Request'}
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* QR Code Quick Access Section */}
      <Box
        sx={{
          py: 8,
          background: 'linear-gradient(180deg, #f8f9ff 0%, #ffffff 100%)',
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                mb: 2,
                background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Quick Access with QR Codes
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ maxWidth: '600px', mx: 'auto' }}>
              Scan these QR codes with your mobile device for instant access to our services
            </Typography>
          </Box>
          
          <Grid container spacing={4} justifyContent="center">
            <Grid item xs={12} sm={6} md={3}>
              <Card
                sx={{
                  height: '100%',
                  textAlign: 'center',
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 24px rgba(25, 118, 210, 0.15)',
                  },
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ mb: 2 }}>
                    <QRCodeDisplay
                      data={`${window.location.origin}/enrollment`}
                      size={120}
                      title="Student Enrollment"
                      description="Quick access to enrollment application"
                    />
                  </Box>
                  <Typography variant="h6" gutterBottom color="primary">
                    Student Enrollment
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Scan to start your enrollment application for ELTNHS
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Card
                sx={{
                  height: '100%',
                  textAlign: 'center',
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 24px rgba(25, 118, 210, 0.15)',
                  },
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ mb: 2 }}>
                    <QRCodeDisplay
                      data={`${window.location.origin}/request/form-137`}
                      size={120}
                      title="Form 137 Request"
                      description="Quick access to Form 137 request form"
                    />
                  </Box>
                  <Typography variant="h6" gutterBottom color="primary">
                    Form 137 Request
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Scan to directly access the Form 137 request form on your mobile device
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Card
                sx={{
                  height: '100%',
                  textAlign: 'center',
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 24px rgba(25, 118, 210, 0.15)',
                  },
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ mb: 2 }}>
                    <QRCodeDisplay
                      data={`${window.location.origin}/track`}
                      size={120}
                      title="Track Requests"
                      description="Monitor your request status"
                    />
                  </Box>
                  <Typography variant="h6" gutterBottom color="primary">
                    Track Your Requests
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Scan to quickly check the status of your document requests
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Card
                sx={{
                  height: '100%',
                  textAlign: 'center',
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 24px rgba(25, 118, 210, 0.15)',
                  },
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ mb: 2 }}>
                    <QRCodeDisplay
                      data={JSON.stringify({
                        type: 'contact_info',
                        school: 'Eastern La Trinidad National High School',
                        phone: '+63-XXX-XXX-XXXX',
                        email: 'info@eltnhs.edu.ph',
                        address: 'La Trinidad, Benguet, Philippines'
                      })}
                      size={120}
                      title="Contact Info"
                      description="School contact information"
                    />
                  </Box>
                  <Typography variant="h6" gutterBottom color="primary">
                    Contact Information
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Scan to save our school contact information to your device
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;