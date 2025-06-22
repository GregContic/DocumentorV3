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
import UserInquiriesDashboard from './components/UserInquiriesDashboard';
import Form137Request from './pages/user/Form137Request';
import Form138Request from './pages/user/Form138Request';
import SF9Request from './pages/user/SF9Request';
import SF10Request from './pages/user/SF10Request';
import DiplomaRequest from './pages/user/DiplomaRequest';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import Archive from './admin/Archive';
import Settings from './admin/Settings';

// Protected Route
import ProtectedRoute from './components/Auth/ProtectedRoute';

// Chatbot
import EnhancedFloatingChatbot from './components/Chatbot/EnhancedFloatingChatbot';

// Import our custom theme
import { theme } from './theme/theme';

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
              path="/request-form137"
              element={
                <ProtectedRoute>
                  <Form137Request />
                </ProtectedRoute>
              }
            />
            <Route
              path="/request-form138"
              element={
                <ProtectedRoute>
                  <Form138Request />
                </ProtectedRoute>
              }
            />
            <Route
              path="/request-sf9"
              element={
                <ProtectedRoute>
                  <SF9Request />
                </ProtectedRoute>
              }
            />
            <Route
              path="/request-sf10"
              element={
                <ProtectedRoute>
                  <SF10Request />
                </ProtectedRoute>
              }
            />
            <Route
              path="/request-diploma"
              element={
                <ProtectedRoute>
                  <DiplomaRequest />
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
            <Route
              path="/inquiries"
              element={
                <ProtectedRoute>
                  <UserInquiriesDashboard />
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
              path="/admin/archive"
              element={
                <ProtectedRoute requireAdmin={true}>
                  <Archive />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/settings"
              element={
                <ProtectedRoute requireAdmin={true}>
                  <Settings />
                </ProtectedRoute>
              }
            />
            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          
          {/* Enhanced Floating Chatbot - Available on all pages */}
          <EnhancedFloatingChatbot />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;