import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Collapse,
  Box,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Button,
} from '@mui/material';
import {
  ExpandMore,
  ExpandLess,
  SmartToy,
  Help,
  AutoAwesome,
  Upload,
  CheckCircle,
  Info,
} from '@mui/icons-material';

const FormAssistantChatCard = ({ onAIUpload, formType = 'Form 137' }) => {
  const [expanded, setExpanded] = useState(false);

  const handleToggle = () => {
    setExpanded(!expanded);
  };

  const assistanceItems = [
    {
      icon: <Upload color="primary" />,
      title: 'AI Document Upload',
      description: 'Upload your old documents and let AI auto-fill the form',
      action: 'Upload Document',
      onClick: onAIUpload,
    },
    {
      icon: <Help color="info" />,
      title: 'Field Guidance',
      description: `Get help understanding ${formType} requirements`,
      action: 'Get Help',
      onClick: () => {
        // This could trigger a help dialog or chatbot
        console.log('Field guidance requested');
      },
    },
    {
      icon: <CheckCircle color="success" />,
      title: 'Validation Check',
      description: 'Ensure all required fields are properly filled',
      action: 'Check Form',
      onClick: () => {
        // This could trigger form validation
        console.log('Form validation requested');
      },
    },
  ];

  const quickTips = [
    `${formType} is your official academic record`,
    'All fields marked with * are required',
    'Double-check your personal information for accuracy',
    'Use our AI upload feature to save time',
    'Contact us if you need assistance with any field',
  ];

  return (
    <Card
      sx={{
        mb: 3,
        background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
        border: '1px solid #2196f3',
        borderRadius: 2,
        overflow: 'hidden',
      }}
    >
      <CardContent>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          sx={{ cursor: 'pointer' }}
          onClick={handleToggle}
        >
          <Box display="flex" alignItems="center" gap={1}>
            <SmartToy color="primary" />
            <Typography variant="h6" color="primary" fontWeight={600}>
              AI Form Assistant
            </Typography>
            <Chip
              label="Smart Help"
              size="small"
              icon={<AutoAwesome />}
              color="primary"
              variant="outlined"
            />
          </Box>
          <IconButton color="primary">
            {expanded ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 2 }}>
          Get AI-powered assistance with your {formType} request
        </Typography>

        <Collapse in={expanded}>
          <Box sx={{ mt: 2 }}>
            {/* AI Assistance Options */}
            <Typography variant="subtitle2" color="primary" gutterBottom>
              Available Assistance:
            </Typography>
            <List dense>
              {assistanceItems.map((item, index) => (
                <ListItem
                  key={index}
                  sx={{
                    border: '1px solid #e0e0e0',
                    borderRadius: 1,
                    mb: 1,
                    backgroundColor: 'white',
                    '&:hover': {
                      backgroundColor: '#f5f5f5',
                    },
                  }}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText
                    primary={item.title}
                    secondary={item.description}
                  />
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={item.onClick}
                    sx={{ ml: 1 }}
                  >
                    {item.action}
                  </Button>
                </ListItem>
              ))}
            </List>

            <Divider sx={{ my: 2 }} />

            {/* Quick Tips */}
            <Typography variant="subtitle2" color="primary" gutterBottom>
              <Info fontSize="small" sx={{ mr: 1, verticalAlign: 'middle' }} />
              Quick Tips:
            </Typography>
            <Box sx={{ pl: 2 }}>
              {quickTips.map((tip, index) => (
                <Typography
                  key={index}
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    position: 'relative',
                    pl: 2,
                    mb: 0.5,
                    '&::before': {
                      content: '"•"',
                      position: 'absolute',
                      left: 0,
                      color: 'primary.main',
                      fontWeight: 'bold',
                    },
                  }}
                >
                  {tip}
                </Typography>
              ))}
            </Box>

            {/* Call to Action */}
            <Box
              sx={{
                mt: 2,
                p: 2,
                backgroundColor: 'rgba(25, 118, 210, 0.05)',
                borderRadius: 1,
                border: '1px dashed #1976d2',
              }}
            >
              <Typography variant="body2" color="primary" textAlign="center">
                💡 <strong>Pro Tip:</strong> Use the floating chat button (bottom-right) for instant help anytime!
              </Typography>
            </Box>
          </Box>
        </Collapse>
      </CardContent>
    </Card>
  );
};

export default FormAssistantChatCard;
