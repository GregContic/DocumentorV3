import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Document Request System
        </Typography>
        <Box>
          {!isAuthenticated ? (
            <>
              <Button color="inherit" onClick={() => navigate('/login')}>
                Login
              </Button>
              <Button color="inherit" onClick={() => navigate('/register')}>
                Register
              </Button>
            </>
          ) : (
            <>
              {user?.role === 'admin' ? (
                <>
                  <Button color="inherit" onClick={() => navigate('/admin/dashboard')}>
                    Dashboard
                  </Button>
                  <Button color="inherit" onClick={() => navigate('/admin/inquiries')}>
                    Inquiries
                  </Button>
                </>
              ) : (
                <>
                  <Button color="inherit" onClick={() => navigate('/request-document')}>
                    Request Document
                  </Button>
                  <Button color="inherit" onClick={() => navigate('/my-requests')}>
                    My Requests
                  </Button>
                </>
              )}
              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 