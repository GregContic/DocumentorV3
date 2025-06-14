import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
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
} from '@mui/material';
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

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setError(null);
    setUploading(true);
    setProgress(0);

    try {
      // Create preview
      const imageUrl = URL.createObjectURL(file);
      setPreviewImage(imageUrl);

      // Start AI processing
      setExtracting(true);
      setProgress(10);

      // Extract text using OCR
      const ocrResult = await extractTextFromImage(file, (progressPercent) => {
        setProgress(10 + (progressPercent * 0.6)); // 10-70%
      });

      setProgress(75);
      setOriginalText(ocrResult.text);

      // Identify document type
      const docType = identifyDocumentType(ocrResult.text);
      
      setProgress(80);

      // Extract structured information using AI
      const extractedInfo = extractStudentInformation(ocrResult.text);
      
      setProgress(90);

      // Calculate confidence score
      const confidenceScore = calculateExtractionConfidence(extractedInfo, ocrResult.text);
      
      setProgress(100);

      // Set results
      setExtractedData({
        ...extractedInfo,
        documentType: docType,
        ocrConfidence: ocrResult.confidence
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
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.bmp', '.webp']
    },
    maxFiles: 1,
    disabled: uploading || extracting
  });

  const applyExtractedData = () => {
    if (extractedData && setFormData) {
      setFormData(prev => ({
        ...prev,
        ...extractedData,
        // Preserve existing data that wasn't extracted
        documentType: prev.documentType, // Keep original document type
        purpose: prev.purpose, // Keep purpose if already filled
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
        sx={{
          p: 4,
          border: '2px dashed',
          borderColor: isDragActive ? 'primary.main' : 'grey.300',
          backgroundColor: isDragActive ? 'primary.light' : 'grey.50',
          cursor: uploading ? 'not-allowed' : 'pointer',
          transition: 'all 0.3s ease',
          '&:hover': {
            borderColor: 'primary.main',
            backgroundColor: 'primary.light',
          }
        }}
      >
        <input {...getInputProps()} />
        <Box sx={{ textAlign: 'center' }}>
          {uploading || extracting ? (
            <Box>
              <CircularProgress size={60} sx={{ mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                {extracting ? 'Processing Document with AI...' : 'Uploading...'}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {extracting ? 'Extracting information from your document' : 'Please wait...'}
              </Typography>
              {progress > 0 && (
                <Box sx={{ width: '100%', maxWidth: 300, mx: 'auto' }}>
                  <LinearProgress variant="determinate" value={progress} />
                  <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
                    {progress}% Complete
                  </Typography>
                </Box>
              )}
            </Box>
          ) : (
            <Box>
              <AIIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                AI-Powered Document Processing
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                {isDragActive
                  ? 'Drop your document here...'
                  : 'Drag & drop a document image here, or click to select'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Supported: JPG, PNG, GIF, BMP, WebP
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Chip 
                  icon={<BrainIcon />} 
                  label="AI Extraction" 
                  color="primary" 
                  variant="outlined" 
                  sx={{ mr: 1 }}
                />
                <Chip 
                  icon={<DocumentIcon />} 
                  label="Form 137" 
                  color="secondary" 
                  variant="outlined" 
                />
              </Box>
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

      {/* Preview Image */}
      {previewImage && (
        <Card sx={{ mt: 2 }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Uploaded Document</Typography>
              <Button
                startIcon={<PreviewIcon />}
                onClick={() => setShowPreview(true)}
                size="small"
              >
                View Full Size
              </Button>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <img 
                src={previewImage} 
                alt="Uploaded document" 
                style={{ 
                  maxWidth: '100%', 
                  maxHeight: '200px', 
                  objectFit: 'contain',
                  border: '1px solid #ddd',
                  borderRadius: '4px'
                }} 
              />
            </Box>
          </CardContent>
        </Card>
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
