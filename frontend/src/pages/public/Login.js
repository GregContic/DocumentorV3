import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  InputAdornment,
  IconButton,
  CircularProgress,
  Fade,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email as EmailIcon,
  Lock as LockIcon,
} from '@mui/icons-material';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  useEffect(() => {
    // Check for success message from registration
    if (location.state?.message) {
      setSuccess(location.state.message);
      // Clear the message from location state
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const validateForm = () => {
    if (!formData.email.trim()) {
      setError('Email is required');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    if (!formData.password) {
      setError('Password is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', formData);
      const { token, user } = response.data;
      
      if (!user || !token) {
        throw new Error('Invalid response from server');
      }

      await login(user, token);
      
      // Redirect based on user role
      if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/request-document');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(
        err.response?.data?.message || 
        err.message || 
        'Invalid email or password. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Fade in timeout={800}>
        <Box
          sx={{
            mt: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Paper
            elevation={3}
            sx={{
              p: 4,
              width: '100%',
              borderRadius: 2,
              bgcolor: 'background.paper',
              transition: 'transform 0.3s ease-in-out',
              '&:hover': {
                transform: 'scale(1.02)',
              },
            }}
          >
            <Typography
              variant="h4"
              gutterBottom
              align="center"
              sx={{
                fontWeight: 'bold',
                color: 'primary.main',
                mb: 4,
              }}
            >
              Welcome Back
            </Typography>
            
            {success && (
              <Fade in>
                <Alert severity="success" sx={{ mb: 3 }}>
                  {success}
                </Alert>
              </Fade>
            )}

            {error && (
              <Fade in>
                <Alert severity="error" sx={{ mb: 3 }}>
                  {error}
                </Alert>
              </Fade>
            )}

            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                margin="normal"
                required
                error={!!error && error.includes('email')}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon color={error && error.includes('email') ? 'error' : 'primary'} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: 'primary.main',
                    },
                  },
                }}
              />
              <TextField
                fullWidth
                label="Password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                margin="normal"
                required
                error={!!error && error.includes('password')}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon color={error && error.includes('password') ? 'error' : 'primary'} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: 'primary.main',
                    },
                  },
                }}
              />
              
              <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Button
                  variant="text"
                  onClick={() => navigate('/register')}
                  sx={{ textTransform: 'none' }}
                >
                  Don't have an account? Sign Up
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={loading}
                  sx={{
                    minWidth: 120,
                    borderRadius: 2,
                    textTransform: 'none',
                    position: 'relative',
                  }}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </Box>
            </form>
          </Paper>
        </Box>
      </Fade>
    </Container>
  );
};

export default Login;
