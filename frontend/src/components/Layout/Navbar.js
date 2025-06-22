import React, { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box, 
  Container,
  useTheme,
  useMediaQuery,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  Tooltip
} from '@mui/material';
import { 
  Menu as MenuIcon,
  Archive as ArchiveIcon,
  Description as DescriptionIcon,
  Dashboard as DashboardIcon,
  Person as PersonIcon,
  ExitToApp as LogoutIcon,
  QuestionAnswer as InquiryIcon,
  Assignment as RequestsIcon,
  School as SchoolIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    if (isMobile) setMobileOpen(false);
  };

  const navItems = !isAuthenticated 
    ? [
        { text: 'Login', path: '/login', icon: <PersonIcon /> },
        { text: 'Register', path: '/register', icon: <PersonIcon /> }
      ]    : user?.role === 'admin'
    ? [
        { text: 'Dashboard', path: '/admin/dashboard', icon: <DashboardIcon /> },
        { text: 'Archive', path: '/admin/archive', icon: <ArchiveIcon /> },
        { text: 'Settings', path: '/admin/settings', icon: <SettingsIcon /> }
      ]
    : [
        { text: 'Request Document', path: '/request-document', icon: <DescriptionIcon /> },
        { text: 'My Requests', path: '/my-requests', icon: <RequestsIcon /> },
        { text: 'Inquiries', path: '/inquiries', icon: <InquiryIcon /> }
      ];

  const renderDrawerContent = () => (
    <Box sx={{ width: 250, pt: 2 }}>
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Avatar sx={{ bgcolor: 'primary.main' }}>
          <SchoolIcon />
        </Avatar>
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
          Document System
        </Typography>
      </Box>
      <List>
        {navItems.map((item) => (
          <ListItem 
            button 
            key={item.text} 
            onClick={() => {
              navigate(item.path);
              setMobileOpen(false);
            }}
            sx={{
              borderRadius: 1,
              mx: 1,
              '&:hover': {
                backgroundColor: 'rgba(25, 118, 210, 0.08)',
              }
            }}
          >
            <ListItemIcon sx={{ color: 'primary.main', minWidth: 40 }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText 
              primary={item.text} 
              primaryTypographyProps={{
                fontSize: '0.9rem',
                fontWeight: 500
              }}
            />
          </ListItem>
        ))}
        {isAuthenticated && (
          <ListItem 
            button 
            onClick={handleLogout}
            sx={{
              borderRadius: 1,
              mx: 1,
              mt: 2,
              color: 'error.main',
              '&:hover': {
                backgroundColor: 'error.light',
              }
            }}
          >
            <ListItemIcon sx={{ color: 'error.main', minWidth: 40 }}>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText 
              primary="Logout" 
              primaryTypographyProps={{
                fontSize: '0.9rem',
                fontWeight: 500
              }}
            />
          </ListItem>
        )}
      </List>
    </Box>
  );

  return (
    <AppBar 
      position="sticky" 
      elevation={0}
      sx={{ 
        bgcolor: 'background.paper',
        backgroundImage: 'linear-gradient(to right, #1976d2, #42a5f5)',
        borderBottom: '1px solid',
        borderColor: 'rgba(255, 255, 255, 0.1)'
      }}
    >
      <Container maxWidth="xl">
        <Toolbar 
          disableGutters 
          sx={{ 
            minHeight: { xs: 64, md: 70 },
            justifyContent: 'space-between'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <SchoolIcon sx={{ 
              display: { xs: 'none', md: 'flex' }, 
              fontSize: 32,
              color: 'white' 
            }} />
            <Typography 
              variant="h6" 
              sx={{ 
                color: 'white',
                fontWeight: 600,
                textShadow: '1px 1px 2px rgba(0,0,0,0.1)',
                fontSize: { xs: '1.1rem', md: '1.3rem' }
              }}
            >
              DOCUMENTOR: Document Request System
            </Typography>
          </Box>

          {isMobile ? (
            <>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="end"
                onClick={handleDrawerToggle}
                sx={{ color: 'white' }}
              >
                <MenuIcon />
              </IconButton>
              <Drawer
                anchor="right"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                PaperProps={{
                  sx: {
                    backgroundColor: 'background.paper',
                    backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05))'
                  }
                }}
              >
                {renderDrawerContent()}
              </Drawer>
            </>
          ) : (
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              {navItems.map((item) => (
                <Tooltip key={item.text} title={item.text} arrow>
                  <Button
                    onClick={() => navigate(item.path)}
                    sx={{
                      color: 'white',
                      px: 2,
                      py: 1,
                      borderRadius: '8px',
                      '&:hover': {
                        bgcolor: 'rgba(255, 255, 255, 0.1)',
                        transform: 'translateY(-1px)'
                      },
                      transition: 'all 0.2s ease-in-out'
                    }}
                    startIcon={item.icon}
                  >
                    {item.text}
                  </Button>
                </Tooltip>
              ))}
              {isAuthenticated && (
                <Button
                  onClick={handleLogout}
                  sx={{
                    color: 'white',
                    bgcolor: 'error.main',
                    borderRadius: '8px',
                    ml: 2,
                    '&:hover': {
                      bgcolor: 'error.dark',
                      transform: 'translateY(-1px)'
                    },
                    transition: 'all 0.2s ease-in-out'
                  }}
                  startIcon={<LogoutIcon />}
                >
                  Logout
                </Button>
              )}
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;