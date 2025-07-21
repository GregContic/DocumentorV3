import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import * as pdfjs from 'pdfjs-dist';
import {
  Box,
  Typography,
  Paper,
  Button,
  CircularProgress,
  Alert,
  LinearProgress,
  Card,
  CardContent,
  Chip,
  Grid,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Fade,
  Stack,
  Tooltip,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ImageIcon from '@mui/icons-material/Image';
import { processDocument } from '../utils/pdfProcessor';
import {
  CloudUpload as UploadIcon,
  AutoAwesome as AIIcon,
  CheckCircle as CheckIcon,
  Error as ErrorIcon,
  Visibility as PreviewIcon,
  Close as CloseIcon,
  Psychology as BrainIcon,
  Description as DocumentIcon,
} from '@mui/icons-material';
import { 
  extractTextFromImage, 
  extractStudentInformation, 
  calculateExtractionConfidence,
  identifyDocumentType 
} from '../utils/aiDocumentProcessor';

const AIDocumentUploader = ({ onDataExtracted, formData, setFormData }) => {
  const [uploading, setUploading] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [extractedData, setExtractedData] = useState(null);
  const [confidence, setConfidence] = useState(null);
  const [error, setError] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [originalText, setOriginalText] = useState('');
  const [showAnimation, setShowAnimation] = useState(false);
  const [file, setFile] = useState(null);

  // Styled components for enhanced UI
  const StyledUploadBox = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    cursor: 'pointer',
    border: `2px dashed ${theme.palette.primary.main}`,
    borderRadius: theme.spacing(2),
    backgroundColor: 'rgba(25, 118, 210, 0.04)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    '&:hover': {
      backgroundColor: 'rgba(25, 118, 210, 0.08)',
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
    },
  }));

  const PreviewCard = styled(Card)(({ theme }) => ({
    position: 'relative',
    overflow: 'hidden',
    borderRadius: theme.spacing(2),
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
    '& img': {
      width: '100%',
      height: 'auto',
      maxHeight: '300px',
      objectFit: 'contain',
    },
  }));

  const AIOverlay = styled(Box)(({ theme }) => ({
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing(2),
    zIndex: 1,
    animation: 'pulse 2s infinite',
    '@keyframes pulse': {
      '0%': {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
      },
      '50%': {
        backgroundColor: 'rgba(25, 118, 210, 0.05)',
      },
      '100%': {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
      },
    },
  }));

  const ConfidenceChip = styled(Chip)(({ theme, score }) => ({
    backgroundColor: score >= 90 
      ? theme.palette.success.light 
      : score >= 70 
      ? theme.palette.warning.light 
      : theme.palette.error.light,
    color: score >= 90 
      ? theme.palette.success.dark 
      : score >= 70 
      ? theme.palette.warning.dark 
      : theme.palette.error.dark,
    fontWeight: 'bold',
    '& .MuiChip-icon': {
      color: 'inherit',
    },
  }));

  const onDrop = useCallback(async (acceptedFiles) => {
    const uploadedFile = acceptedFiles[0];
    if (!uploadedFile) return;

    setError(null);
    setUploading(true);
    setProgress(0);
    setFile(uploadedFile);

    try {
      // Create preview for images or PDFs
      if (uploadedFile.type.startsWith('image/')) {
        const imageUrl = URL.createObjectURL(uploadedFile);
        setPreviewImage(imageUrl);
      } else if (uploadedFile.type === 'application/pdf') {
        // For PDFs, we'll show the first page as preview
        const pdfUrl = URL.createObjectURL(uploadedFile);
        setPreviewImage(pdfUrl);
      }

      // Start AI processing
      setExtracting(true);
      setProgress(10);

      // Process document (image or PDF)
      const result = await processDocument(uploadedFile, (progressPercent) => {
        setProgress(10 + (progressPercent * 0.6)); // 10-70%
      });

      setProgress(75);
      setOriginalText(result.text);

      // Identify document type
      const docType = identifyDocumentType(result.text);
      
      setProgress(80);

      // Extract structured information using AI
      const extractedInfo = extractStudentInformation(result.text);
      
      setProgress(90);

      // Calculate confidence score
      const confidenceScore = {
        score: result.confidence,
        recommendation: result.confidence >= 90 ? 'high' : result.confidence >= 70 ? 'medium' : 'low',
        extractedFields: Object.keys(extractedInfo).length,
        totalFields: 10, // Update based on your expected fields
      };
      
      setProgress(100);

      // Set results
      setExtractedData({
        ...extractedInfo,
        documentType: docType,
        ocrConfidence: result.confidence
      });
      setConfidence(confidenceScore);
      setShowResults(true);

      // Callback to parent component
      if (onDataExtracted) {
        onDataExtracted(extractedInfo, confidenceScore);
      }

    } catch (err) {
      console.error('Document processing error:', err);
      setError('Failed to process document. Please try again or enter information manually.');
    } finally {
      setUploading(false);
      setExtracting(false);
      setTimeout(() => setProgress(0), 1000);
    }
  }, [onDataExtracted]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.bmp', '.webp'],
      'application/pdf': ['.pdf']
    },
    maxFiles: 1,
    disabled: uploading || extracting
  });

  const applyExtractedData = () => {
    if (extractedData && setFormData) {
      setFormData(prev => ({
        ...prev,
        // Personal Info
        ...extractedData.personalInfo,
        // Address
        ...extractedData.address,
        // Academic Info
        ...extractedData.academicInfo,
        // Parent/Guardian Info
        ...extractedData.parentInfo,
        // Emergency Contact
        ...extractedData.emergencyContact,
        // Preserve existing data that wasn't extracted
        documentType: prev.documentType,
        purpose: prev.purpose,
      }));
      setShowResults(false);
    }
  };

  const getConfidenceColor = (score) => {
    if (score >= 70) return 'success';
    if (score >= 40) return 'warning';
    return 'error';
  };

  const getConfidenceText = (recommendation) => {
    switch (recommendation) {
      case 'high': return 'High confidence - Data looks accurate';
      case 'medium': return 'Medium confidence - Please review extracted data';
      case 'low': return 'Low confidence - Manual entry recommended';
      default: return 'Unknown confidence level';
    }
  };

  return (
    <Box sx={{ mb: 3 }}>
      {/* Upload Area */}
      <Paper
        {...getRootProps()}
        elevation={3}
        sx={{
          p: 4,
          border: '2px dashed',
          borderColor: isDragActive ? 'primary.main' : 'grey.300',
          backgroundColor: isDragActive ? 'rgba(25, 118, 210, 0.08)' : 'background.paper',
          cursor: uploading ? 'not-allowed' : 'pointer',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          position: 'relative',
          overflow: 'hidden',
          borderRadius: 3,
          '&:hover': {
            borderColor: 'primary.main',
            backgroundColor: 'rgba(25, 118, 210, 0.04)',
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
          },
          '&::before': isDragActive ? {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at center, rgba(25, 118, 210, 0.1) 0%, transparent 70%)',
            animation: 'pulse 2s infinite',
          } : {}
        }}
      >
        <input {...getInputProps()} />
        <Box sx={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          {uploading || extracting ? (
            <Box>
              <Box sx={{ position: 'relative', mb: 3 }}>
                <CircularProgress 
                  size={80} 
                  sx={{ 
                    opacity: 0.3,
                    animation: 'spin 2s linear infinite',
                  }} 
                />
                <CircularProgress 
                  size={60} 
                  sx={{ 
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    marginTop: '-30px',
                    marginLeft: '-30px',
                    animation: 'spin 1.5s linear infinite reverse',
                  }} 
                />
                <BrainIcon 
                  sx={{ 
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    fontSize: 32,
                    color: 'primary.main',
                    animation: 'pulse 1s ease-in-out infinite',
                  }} 
                />
              </Box>
              <Typography 
                variant="h6" 
                gutterBottom
                sx={{
                  background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontWeight: 600,
                }}
              >
                {extracting ? 'AI Processing in Progress' : 'Uploading Document'}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {extracting ? 'Analyzing and extracting information' : 'Please wait while we upload your document'}
              </Typography>
              {progress > 0 && (
                <Box sx={{ width: '100%', maxWidth: 300, mx: 'auto' }}>
                  <Box sx={{ position: 'relative' }}>
                    <LinearProgress 
                      variant="determinate" 
                      value={progress} 
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: 'rgba(25, 118, 210, 0.08)',
                        '& .MuiLinearProgress-bar': {
                          borderRadius: 4,
                          backgroundImage: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
                        },
                      }}
                    />
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        position: 'absolute',
                        top: '100%',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        mt: 1,
                      }}
                    >
                      {progress}% Complete
                    </Typography>
                  </Box>
                </Box>
              )}
            </Box>
          ) : (
            <Box>
              <Box 
                sx={{ 
                  position: 'relative',
                  display: 'inline-flex',
                  mb: 3,
                }}
              >
                <Box
                  sx={{
                    animation: 'float 3s ease-in-out infinite',
                    '@keyframes float': {
                      '0%': { transform: 'translateY(0px)' },
                      '50%': { transform: 'translateY(-10px)' },
                      '100%': { transform: 'translateY(0px)' },
                    },
                  }}
                >
                  <AIIcon 
                    sx={{ 
                      fontSize: 72,
                      color: 'primary.main',
                      filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2))',
                    }} 
                  />
                </Box>
                <Box
                  sx={{
                    position: 'absolute',
                    top: -10,
                    right: -10,
                    animation: 'pulse 2s ease-in-out infinite',
                  }}
                >
                  <BrainIcon 
                    sx={{ 
                      fontSize: 24,
                      color: 'secondary.main',
                    }}
                  />
                </Box>
              </Box>
              <Typography 
                variant="h5" 
                gutterBottom
                sx={{
                  fontWeight: 600,
                  background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 2,
                }}
              >
                AI-Powered Document Scanner
              </Typography>
              <Typography variant="h6" color="text.primary" gutterBottom>
                {isDragActive
                  ? 'Release to Upload Document'
                  : 'Drag & Drop or Click to Upload'}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 500, mx: 'auto' }}>
                Our AI will automatically extract and process your document information
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Chip 
                  icon={<BrainIcon />} 
                  label="Smart Extraction" 
                  color="primary" 
                  sx={{ 
                    borderRadius: 4,
                    '& .MuiChip-icon': { fontSize: 20 },
                    background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
                    color: 'white',
                    fontWeight: 500,
                  }}
                />
                <Chip 
                  icon={<DocumentIcon />} 
                  label="Form 137/138" 
                  color="secondary"
                  sx={{ 
                    borderRadius: 4,
                    '& .MuiChip-icon': { fontSize: 20 },
                    background: 'linear-gradient(45deg, #9c27b0 30%, #d81b60 90%)',
                    color: 'white',
                    fontWeight: 500,
                  }}
                />
              </Box>
              <Stack direction="row" spacing={1} justifyContent="center" sx={{ mt: 2 }}>
                <Tooltip title="Images (JPG, PNG, GIF, BMP, WebP)">
                  <Chip
                    icon={<ImageIcon />}
                    label="Images"
                    variant="outlined"
                    size="small"
                  />
                </Tooltip>
                <Tooltip title="PDF Documents">
                  <Chip
                    icon={<PictureAsPdfIcon />}
                    label="PDF"
                    variant="outlined"
                    size="small"
                  />
                </Tooltip>
              </Stack>
            </Box>
          )}
        </Box>
      </Paper>

      {/* Error Display */}
      {error && (
        <Alert 
          severity="error" 
          sx={{ mt: 2 }}
          action={
            <Button color="inherit" size="small" onClick={() => setError(null)}>
              Dismiss
            </Button>
          }
        >
          {error}
        </Alert>
      )}

      {/* Preview Image or PDF */}
      {file && (
        <Fade in>
          <Card 
            sx={{ 
              mt: 2,
              overflow: 'hidden',
              borderRadius: 3,
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
              transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 12px 48px rgba(0, 0, 0, 0.12)',
              },
            }}
          >
            <CardContent>
              <Box 
                sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  mb: 2,
                  background: 'linear-gradient(45deg, rgba(25, 118, 210, 0.05) 0%, rgba(66, 165, 245, 0.05) 100%)',
                  p: 2,
                  borderRadius: 2,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <DocumentIcon color="primary" />
                  <Typography 
                    variant="h6"
                    sx={{
                      background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      fontWeight: 600,
                    }}
                  >
                    Uploaded Document
                  </Typography>
                </Box>
                <Button
                  startIcon={<PreviewIcon />}
                  onClick={() => setShowPreview(true)}
                  variant="outlined"
                  size="small"
                  sx={{
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 500,
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                    '&:hover': {
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                    },
                  }}
                >
                  View Full Size
                </Button>
              </Box>
              <Box 
                sx={{ 
                  textAlign: 'center',
                  position: 'relative',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    pointerEvents: 'none',
                    borderRadius: 2,
                    boxShadow: 'inset 0 0 0 1px rgba(0, 0, 0, 0.05)',
                  },
                }}
              >
                {previewImage ? (
                  <img 
                    src={previewImage} 
                    alt="Uploaded document" 
                    style={{ 
                      maxWidth: '100%', 
                      maxHeight: '300px', 
                      objectFit: 'contain',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(0, 0, 0, 0.02)',
                    }} 
                  />
                ) : (
                  <Box
                    sx={{
                      p: 4,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 2,
                      backgroundColor: 'rgba(0, 0, 0, 0.02)',
                      borderRadius: '8px',
                    }}
                  >
                    <PictureAsPdfIcon sx={{ fontSize: 64, color: 'primary.main' }} />
                    <Typography variant="body1" color="text.secondary">
                      {file?.name}
                    </Typography>
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
        </Fade>
      )}

      {/* Full Size Preview Dialog */}
      <Dialog
        open={showPreview}
        onClose={() => setShowPreview(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Document Preview
          <IconButton
            aria-label="close"
            onClick={() => setShowPreview(false)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {previewImage && (
            <Box sx={{ textAlign: 'center', p: 2 }}>
              <img 
                src={previewImage} 
                alt="Document preview" 
                style={{ 
                  maxWidth: '100%', 
                  maxHeight: '70vh', 
                  objectFit: 'contain'
                }} 
              />
            </Box>
          )}
        </DialogContent>
      </Dialog>

      {/* Extraction Results Dialog */}
      <Dialog
        open={showResults}
        onClose={() => setShowResults(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <AIIcon sx={{ mr: 1, color: 'primary.main' }} />
            AI Extraction Results
          </Box>
        </DialogTitle>
        <DialogContent>
          {confidence && (
            <Alert 
              severity={getConfidenceColor(confidence.score)} 
              sx={{ mb: 3 }}
              icon={<BrainIcon />}
            >
              <Typography variant="subtitle2">
                Confidence Score: {confidence.score.toFixed(1)}%
              </Typography>
              <Typography variant="body2">
                {getConfidenceText(confidence.recommendation)}
              </Typography>
              <Typography variant="caption">
                Extracted {confidence.extractedFields} of {confidence.totalFields} key fields
              </Typography>
            </Alert>
          )}

          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>Extracted Information</Typography>
              <List dense>
                {extractedData && Object.entries(extractedData).map(([key, value]) => {
                  if (!value || key === 'documentType' || key === 'ocrConfidence') return null;
                  
                  const label = key
                    .replace(/([A-Z])/g, ' $1')
                    .replace(/^./, str => str.toUpperCase());
                  
                  return (
                    <ListItem key={key}>
                      <ListItemIcon>
                        <CheckIcon color="success" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText
                        primary={label}
                        secondary={value.toString()}
                      />
                    </ListItem>
                  );
                })}
              </List>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>Processing Details</Typography>
              <List dense>
                <ListItem>
                  <ListItemText
                    primary="Document Type"
                    secondary={extractedData?.documentType || 'Unknown'}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="OCR Confidence"
                    secondary={`${extractedData?.ocrConfidence?.toFixed(1) || 0}%`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Processing Time"
                    secondary="< 30 seconds"
                  />
                </ListItem>
              </List>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowResults(false)}>
            Cancel
          </Button>
          <Button 
            onClick={applyExtractedData} 
            variant="contained"
            startIcon={<CheckIcon />}
          >
            Apply Extracted Data
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AIDocumentUploader;
