import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Layout/Navbar';

// Public Pages
import Home from './pages/public/Home';
import Login from './pages/public/Login';
import Register from './pages/public/Register';

// User Pages
import DocumentRequest from './components/DocumentDashboard';
import MyRequests from './pages/user/MyRequests';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import InquiriesDashboard from './pages/admin/InquiriesDashboard';

// Protected Route
import ProtectedRoute from './components/Auth/ProtectedRoute';

// Create a theme instance
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Navbar />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* User Routes */}
            <Route
              path="/request-document"
              element={
                <ProtectedRoute>
                  <DocumentRequest />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-requests"
              element={
                <ProtectedRoute>
                  <MyRequests />
                </ProtectedRoute>
              }
            />

            {/* Admin Routes */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/inquiries"
              element={
                <ProtectedRoute requireAdmin={true}>
                  <InquiriesDashboard />
                </ProtectedRoute>
              }
            />

            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;