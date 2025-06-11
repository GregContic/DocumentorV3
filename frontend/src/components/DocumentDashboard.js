import React, { useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Box,
  MenuItem,
  Card,
  CardContent,
  CardActions,
  CircularProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  FormControl,
  InputLabel,
  Select,
  Alert,
  Snackbar,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  Send as SendIcon,
  CheckCircle as SuccessIcon,
  School as SchoolIcon,
  Description as DescriptionIcon,
  AccessTime as AccessTimeIcon,
  FormatListBulleted as ListIcon,
} from '@mui/icons-material';

const DOCUMENT_TYPES = [
  {
    id: 'form137',
    name: 'Form 137 (Permanent Record)',
    description: 'Official permanent record of grades and academic performance throughout high school.',
    requirements: ['Valid ID', 'Request Form', 'Authorization Letter (if not the student)'],
    processingTime: '5-7 working days',
    route: '/request-form137'
  },
  {
    id: 'form138',
    name: 'Form 138 (Report Card)',
    description: 'Official report card showing grades for each grading period.',
    requirements: ['Valid ID', 'Request Form'],
    processingTime: '3-5 working days',
    route: '/request-form138'
  },
  {
    id: 'diploma',
    name: 'High School Diploma',
    description: 'Official certificate of high school graduation.',
    requirements: ['Valid ID', 'Request Form', 'Clearance Form'],
    processingTime: '7-10 working days',
    route: '/request-diploma'
  },
  {
    id: 'sf10',
    name: 'School Form 10 (SF10)',
    description: 'Learner\'s permanent academic record in the K to 12 Basic Education Program.',
    requirements: ['Valid ID', 'Request Form', 'Previous School Records (if transferee)'],
    processingTime: '5-7 working days',
    route: '/request-sf10'
  },
  {
    id: 'sf9',
    name: 'School Form 9 (SF9)',
    description: 'Current school year\'s report card in the K to 12 Basic Education Program.',
    requirements: ['Valid ID', 'Request Form'],
    processingTime: '3-5 working days',
    route: '/request-sf9'
  },
  {
    id: 'goodMoral',
    name: 'Certificate of Good Moral Character',
    description: 'A character reference from the school; often required for college applications.',
    requirements: ['Valid ID', 'Request Form'],
    processingTime: '2-3 working days',
    route: '/request-good-moral'
  }
];

const DocumentDashboard = () => {
  const navigate = useNavigate();

  const handleRequestDocument = (route) => {
    navigate(route);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ mb: 4 }}>
        Document Request Dashboard
      </Typography>
      
      <Box sx={{ mb: 4 }}>
        <Typography variant="body1" color="text.secondary" align="center">
          Select the document you need to request. Make sure to prepare the required documents before proceeding.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {DOCUMENT_TYPES.map((document) => (
          <Grid item xs={12} sm={6} md={4} key={document.id}>
            <Card 
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 3,
                }
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                  <DescriptionIcon sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="h6" component="h2">
                    {document.name}
                  </Typography>
                </Box>
                
                <Typography variant="body2" color="text.secondary" paragraph>
                  {document.description}
                </Typography>

                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <AccessTimeIcon sx={{ mr: 1, fontSize: 'small' }} />
                    Processing Time: {document.processingTime}
                  </Typography>
                  
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    <ListIcon sx={{ mr: 1, fontSize: 'small', verticalAlign: 'middle' }} />
                    Requirements:
                  </Typography>
                  <List dense sx={{ pl: 4, mt: 0 }}>
                    {document.requirements.map((req, index) => (
                      <ListItem key={index} sx={{ py: 0 }}>
                        <ListItemText 
                          primary={req}
                          primaryTypographyProps={{ 
                            variant: 'body2',
                            color: 'text.secondary'
                          }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              </CardContent>
              
              <CardActions sx={{ p: 2, pt: 0 }}>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => handleRequestDocument(document.route)}
                  endIcon={<SendIcon />}
                >
                  Request Document
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default DocumentDashboard;