import React, { useState, useCallback } from 'react';
import {
  Box,
  Button,
  Typography,
  LinearProgress,
  Paper,
  Alert,
  styled,
} from '@mui/material';
import { CloudUpload as CloudUploadIcon, CheckCircle as CheckCircleIcon } from '@mui/icons-material';
import { useDropzone } from 'react-dropzone';

// Helper function to filter props
const shouldForwardProp = (prop) => prop !== 'isDragActive' && prop !== 'hasFile';

// Styled components
const DropzoneContainer = styled(Box, { shouldForwardProp })(({ theme, isDragActive, hasFile }) => ({
  border: `2px dashed ${isDragActive ? theme.palette.primary.main : hasFile ? theme.palette.success.main : theme.palette.grey[300]}`,
  borderRadius: theme.shape.borderRadius,
  backgroundColor: isDragActive ? theme.palette.primary.light + '20' : hasFile ? theme.palette.success.light + '20' : theme.palette.grey[50],
  padding: theme.spacing(4),
  textAlign: 'center',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  '&:hover': {
    borderColor: theme.palette.primary.main,
    backgroundColor: theme.palette.primary.light + '20',
  },
}));

const AIDocumentUploader = ({ onUploadComplete }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const onDrop = useCallback((acceptedFiles) => {
    const selectedFile = acceptedFiles[0];
    if (selectedFile) {
      if (selectedFile.type === 'application/pdf' || selectedFile.type.startsWith('image/')) {
        setFile(selectedFile);
        setError(null);
        setUploadSuccess(false);
      } else {
        setError('Please upload a PDF or image file');
        setFile(null);
      }
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.png', '.jpg', '.jpeg']
    },
    multiple: false
  });

  const simulateAIProcessing = async () => {
    setUploading(true);
    setProgress(0);
    
    // Simulate processing delay with progress updates
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 500));
      setProgress(i);
    }
    
    setUploading(false);
    
    // Generate comprehensive mock data for testing
    const mockData = {
      personalInfo: {
        firstName: 'Juan',
        middleName: 'Santos',
        lastName: 'Dela Cruz',
        extension: '',
        dateOfBirth: '2010-05-15',
        placeOfBirth: 'Baguio City',
        sex: 'Male',
        age: '13',
        religion: 'Roman Catholic',
        citizenship: 'Filipino',
        learnerReferenceNumber: '136-2023-0789',
      },
      contactInfo: {
        houseNumber: '123',
        street: 'Magsaysay Avenue',
        barangay: 'San Luis',
        city: 'Baguio City',
        province: 'Benguet',
        zipCode: '2600',
        contactNumber: '09123456789',
        emailAddress: 'juan.delacruz@email.com'
      },
      educationalInfo: {
        lastSchoolAttended: 'Baguio Central School',
        schoolAddress: 'Harrison Road, Baguio City',
        gradeLevel: 'Grade 7',
        schoolYear: '2024-2025'
      },
      familyInfo: {
        fatherName: 'Pedro Dela Cruz',
        fatherOccupation: 'Business Owner',
        fatherContactNumber: '09187654321',
        motherName: 'Maria Santos Dela Cruz',
        motherOccupation: 'Teacher',
        motherContactNumber: '09198765432',
        guardianName: 'Pedro Dela Cruz',
        guardianRelationship: 'Father',
        guardianOccupation: 'Business Owner',
        guardianContactNumber: '09187654321'
      },
      emergencyContact: {
        emergencyContactName: 'Maria Santos Dela Cruz',
        emergencyContactRelationship: 'Mother',
        emergencyContactNumber: '09198765432',
        emergencyContactAddress: '123 Magsaysay Avenue, Baguio City'
      }
    };
    
    if (onUploadComplete) {
      onUploadComplete(mockData);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }
    try {
      await simulateAIProcessing();
      setUploadSuccess(true);
    } catch (err) {
      setError('Error processing document. Please try again.');
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="h6" gutterBottom color="primary">
          Upload Documents for AI Processing
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Drag and drop your PDF or image files here, or click to select files
        </Typography>

        <DropzoneContainer
          {...getRootProps()}
          isDragActive={isDragActive}
          hasFile={!!file}
        >
          <input {...getInputProps()} />
          <CloudUploadIcon 
            sx={{ 
              fontSize: 48, 
              color: isDragActive ? 'primary.main' : file ? 'success.main' : 'grey.500',
              mb: 2 
            }} 
          />
          {!file && (
            <Typography variant="body1" color="text.secondary">
              {isDragActive ? 'Drop your file here' : 'Click or drag file to upload'}
            </Typography>
          )}
          {file && !uploading && !uploadSuccess && (
            <Box>
              <Typography variant="body1" color="success.main" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                <CheckCircleIcon /> File ready: {file.name}
              </Typography>
            </Box>
          )}
        </DropzoneContainer>

        {error && (
          <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
            {error}
          </Alert>
        )}

        {file && !uploading && !uploadSuccess && (
          <Button
            variant="contained"
            color="primary"
            onClick={handleUpload}
            sx={{ mt: 2, mb: 2 }}
            fullWidth
          >
            Process Document
          </Button>
        )}

        {uploading && (
          <Box sx={{ width: '100%', mt: 2 }}>
            <LinearProgress 
              variant="determinate" 
              value={progress} 
              sx={{
                height: 8,
                borderRadius: 4,
                '& .MuiLinearProgress-bar': {
                  borderRadius: 4,
                }
              }}
            />
            <Typography variant="body2" sx={{ mt: 1 }} color="primary">
              Processing... {progress}%
            </Typography>
          </Box>
        )}

        {uploadSuccess && (
          <Alert severity="success" sx={{ mt: 2 }}>
            Document processed successfully!
          </Alert>
        )}
      </Box>
    </Paper>
  );
};

export default AIDocumentUploader;
