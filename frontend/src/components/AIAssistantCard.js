import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Chip,
  Collapse,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  AutoAwesome as AIIcon,
  ExpandMore as ExpandIcon,
  ExpandLess as CollapseIcon,
  CheckCircle as CheckIcon,
  Speed as SpeedIcon,
  Security as SecurityIcon,
  Psychology as BrainIcon,
} from '@mui/icons-material';

const AIAssistantCard = ({ onStartAIProcessing, show = true }) => {
  const [expanded, setExpanded] = useState(false);

  if (!show) return null;

  const features = [
    {
      icon: <SpeedIcon color="primary" />,
      title: 'Fast Processing',
      description: 'Extract information in under 30 seconds'
    },
    {
      icon: <SecurityIcon color="primary" />,
      title: 'Secure & Private',
      description: 'Processing happens locally in your browser'
    },
    {
      icon: <BrainIcon color="primary" />,
      title: 'Smart Recognition',
      description: 'AI recognizes various document formats and layouts'
    },
    {
      icon: <CheckIcon color="success" />,
      title: 'High Accuracy',
      description: 'Advanced OCR with intelligent field mapping'
    }
  ];

  return (
    <Card 
      sx={{ 
        mb: 3, 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          right: 0,
          width: '100px',
          height: '100px',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '50%',
          transform: 'translate(30px, -30px)',
        }
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <AIIcon sx={{ fontSize: 40, mr: 2 }} />
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" gutterBottom>
              AI Document Assistant
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Save time by uploading a photo of your documents. Our AI will automatically extract and fill in your information.
            </Typography>
          </Box>
          <Chip 
            label="NEW" 
            size="small" 
            sx={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              fontWeight: 'bold'
            }} 
          />
        </Box>

        <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            onClick={onStartAIProcessing}
            sx={{
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.3)',
              }
            }}
            startIcon={<AIIcon />}
          >
            Start AI Processing
          </Button>
          <Button
            variant="text"
            onClick={() => setExpanded(!expanded)}
            sx={{ color: 'white' }}
            endIcon={expanded ? <CollapseIcon /> : <ExpandIcon />}
          >
            {expanded ? 'Less Info' : 'Learn More'}
          </Button>
        </Box>

        <Collapse in={expanded}>
          <Alert 
            severity="info" 
            sx={{ 
              mb: 2, 
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              '& .MuiAlert-icon': {
                color: 'white'
              }
            }}
          >
            <Typography variant="subtitle2" gutterBottom>
              How it works:
            </Typography>
            <Typography variant="body2">
              1. Upload a clear photo of your student ID, transcript, or Form 137<br/>
              2. Our AI extracts text using advanced OCR technology<br/>
              3. Smart algorithms identify and map information to form fields<br/>
              4. Review and confirm the extracted data before proceeding
            </Typography>
          </Alert>

          <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
            Features & Benefits:
          </Typography>
          <List dense>
            {features.map((feature, index) => (
              <ListItem key={index} sx={{ pl: 0 }}>
                <ListItemIcon sx={{ minWidth: 40 }}>
                  {feature.icon}
                </ListItemIcon>
                <ListItemText
                  primary={feature.title}
                  secondary={feature.description}
                  primaryTypographyProps={{ 
                    color: 'white', 
                    fontWeight: 'medium' 
                  }}
                  secondaryTypographyProps={{ 
                    color: 'rgba(255, 255, 255, 0.8)' 
                  }}
                />
              </ListItem>
            ))}
          </List>

          <Alert 
            severity="success" 
            sx={{ 
              mt: 2,
              backgroundColor: 'rgba(76, 175, 80, 0.2)',
              color: 'white',
              '& .MuiAlert-icon': {
                color: '#4caf50'
              }
            }}
          >
            <Typography variant="body2">
              <strong>Supported Documents:</strong> Student IDs, Transcripts, Form 137, Report Cards, Diplomas, and other official school documents
            </Typography>
          </Alert>
        </Collapse>
      </CardContent>
    </Card>
  );
};

export default AIAssistantCard;
