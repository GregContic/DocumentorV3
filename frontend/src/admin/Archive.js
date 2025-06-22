import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  Grid,
  Box,
  Chip,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Tooltip,
  Tabs,
  Tab,
  Card,
  CardContent,
} from '@mui/material';
import {
  Restore as RestoreIcon,
  Info as InfoIcon,
  Archive as ArchiveIcon,
  Description as DocumentIcon,
  QuestionAnswer as InquiryIcon,
} from '@mui/icons-material';
import { documentService, inquiryService } from '../services/api';

const Archive = () => {
  const [activeTab, setActiveTab] = useState(0);
  
  // Document Archive State
  const [archivedDocuments, setArchivedDocuments] = useState([]);
  const [documentPage, setDocumentPage] = useState(0);
  const [documentRowsPerPage, setDocumentRowsPerPage] = useState(10);
  const [documentSearchTerm, setDocumentSearchTerm] = useState('');
  const [documentLoading, setDocumentLoading] = useState(false);
  const [documentError, setDocumentError] = useState('');
  
  // Inquiry Archive State
  const [archivedInquiries, setArchivedInquiries] = useState([]);
  const [inquiryPage, setInquiryPage] = useState(0);
  const [inquiryRowsPerPage, setInquiryRowsPerPage] = useState(10);
  const [inquirySearchTerm, setInquirySearchTerm] = useState('');
  const [inquiryLoading, setInquiryLoading] = useState(false);
  const [inquiryError, setInquiryError] = useState('');

  // Dialog state
  const [selectedItem, setSelectedItem] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    if (activeTab === 0) {
      fetchArchivedDocuments();
    } else {
      fetchArchivedInquiries();
    }
  }, [activeTab]);  const fetchArchivedDocuments = async () => {
    try {
      setDocumentLoading(true);
      setDocumentError('');
      console.log('Fetching archived documents...');
      const response = await documentService.getArchivedDocuments();
      console.log('Document response:', response);
      setArchivedDocuments(response.data.data || []);
    } catch (error) {
      console.error('Error fetching archived documents:', error);
      setDocumentError(
        error.response?.data?.message || 
        error.message || 
        'Failed to load archived documents. Please ensure the server is running.'
      );
    } finally {
      setDocumentLoading(false);
    }
  };

  const fetchArchivedInquiries = async () => {
    try {
      setInquiryLoading(true);
      setInquiryError('');
      console.log('Fetching archived inquiries...');
      const response = await inquiryService.getArchivedInquiries();
      console.log('Inquiry response:', response);
      setArchivedInquiries(response.data.data || []);
    } catch (error) {
      console.error('Error fetching archived inquiries:', error);
      setInquiryError(
        error.response?.data?.message || 
        error.message || 
        'Failed to load archived inquiries. Please ensure the server is running.'
      );
    } finally {
      setInquiryLoading(false);
    }
  };

  const handleRestoreDocument = async (documentId) => {
    try {
      await documentService.restoreDocument(documentId);
      fetchArchivedDocuments();
    } catch (error) {
      console.error('Error restoring document:', error);
    }
  };

  const handleRestoreInquiry = async (inquiryId) => {
    try {
      await inquiryService.restoreInquiry(inquiryId);
      fetchArchivedInquiries();
    } catch (error) {
      console.error('Error restoring inquiry:', error);
    }
  };

  const handleViewDetails = (item) => {
    setSelectedItem(item);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedItem(null);
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };
  // Filter functions
  const filteredDocuments = archivedDocuments.filter(doc => {
    const studentName = doc.user ? `${doc.user.firstName} ${doc.user.lastName}` : '';
    return studentName.toLowerCase().includes(documentSearchTerm.toLowerCase()) ||
           (doc.documentType || '').toLowerCase().includes(documentSearchTerm.toLowerCase()) ||
           (doc._id || '').toLowerCase().includes(documentSearchTerm.toLowerCase());
  });

  const filteredInquiries = archivedInquiries.filter(inquiry => {
    const studentName = inquiry.user ? `${inquiry.user.firstName} ${inquiry.user.lastName}` : '';
    const email = inquiry.user ? inquiry.user.email : '';
    return studentName.toLowerCase().includes(inquirySearchTerm.toLowerCase()) ||
           email.toLowerCase().includes(inquirySearchTerm.toLowerCase()) ||
           (inquiry.message || '').toLowerCase().includes(inquirySearchTerm.toLowerCase());
  });

  const renderDocumentTable = () => (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <Box sx={{ p: 2 }}>
        <TextField
          fullWidth
          label="Search archived documents..."
          value={documentSearchTerm}
          onChange={(e) => setDocumentSearchTerm(e.target.value)}
          sx={{ mb: 2 }}
        />
      </Box>
      
      {documentLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : documentError ? (
        <Alert severity="error" sx={{ m: 2 }}>{documentError}</Alert>
      ) : (
        <>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Request ID</TableCell>
                  <TableCell>Student Name</TableCell>
                  <TableCell>Document Type</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Archived Date</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>              <TableBody>
                {filteredDocuments
                  .slice(documentPage * documentRowsPerPage, documentPage * documentRowsPerPage + documentRowsPerPage)
                  .map((doc) => {
                    const studentName = doc.user ? `${doc.user.firstName} ${doc.user.lastName}` : 'N/A';
                    return (
                      <TableRow key={doc._id} hover>
                        <TableCell>{doc._id.slice(-8)}</TableCell>
                        <TableCell>{studentName}</TableCell>
                        <TableCell>{doc.documentType}</TableCell>
                        <TableCell>
                          <Chip 
                            label={doc.status} 
                            color={doc.status === 'completed' ? 'success' : 'default'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          {new Date(doc.archivedAt || doc.updatedAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Tooltip title="View Details">
                            <IconButton 
                              size="small" 
                              onClick={() => handleViewDetails(doc)}
                            >
                              <InfoIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Restore">
                            <IconButton 
                              size="small" 
                              onClick={() => handleRestoreDocument(doc._id)}
                              color="primary"
                            >
                              <RestoreIcon />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredDocuments.length}
            rowsPerPage={documentRowsPerPage}
            page={documentPage}
            onPageChange={(event, newPage) => setDocumentPage(newPage)}
            onRowsPerPageChange={(event) => {
              setDocumentRowsPerPage(parseInt(event.target.value, 10));
              setDocumentPage(0);
            }}
          />
        </>
      )}
    </Paper>
  );

  const renderInquiryTable = () => (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <Box sx={{ p: 2 }}>
        <TextField
          fullWidth
          label="Search archived inquiries..."
          value={inquirySearchTerm}
          onChange={(e) => setInquirySearchTerm(e.target.value)}
          sx={{ mb: 2 }}
        />
      </Box>
      
      {inquiryLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : inquiryError ? (
        <Alert severity="error" sx={{ m: 2 }}>{inquiryError}</Alert>
      ) : (
        <>
          <TableContainer>
            <Table>              <TableHead>
                <TableRow>
                  <TableCell>Student Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Message</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Archived Date</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredInquiries
                  .slice(inquiryPage * inquiryRowsPerPage, inquiryPage * inquiryRowsPerPage + inquiryRowsPerPage)
                  .map((inquiry) => {
                    const studentName = inquiry.user ? `${inquiry.user.firstName} ${inquiry.user.lastName}` : 'N/A';
                    const email = inquiry.user ? inquiry.user.email : 'N/A';
                    return (
                      <TableRow key={inquiry._id} hover>
                        <TableCell>{studentName}</TableCell>
                        <TableCell>{email}</TableCell>
                        <TableCell sx={{ maxWidth: 300 }}>
                          <Typography noWrap>{inquiry.message}</Typography>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={inquiry.status} 
                            color={inquiry.status === 'archived' ? 'info' : 'default'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          {new Date(inquiry.archivedAt || inquiry.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Tooltip title="View Details">
                            <IconButton 
                              size="small" 
                              onClick={() => handleViewDetails(inquiry)}
                            >
                              <InfoIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Restore">
                            <IconButton 
                              size="small" 
                              onClick={() => handleRestoreInquiry(inquiry._id)}
                              color="primary"
                            >
                              <RestoreIcon />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredInquiries.length}
            rowsPerPage={inquiryRowsPerPage}
            page={inquiryPage}
            onPageChange={(event, newPage) => setInquiryPage(newPage)}
            onRowsPerPageChange={(event) => {
              setInquiryRowsPerPage(parseInt(event.target.value, 10));
              setInquiryPage(0);
            }}
          />
        </>
      )}
    </Paper>
  );

  const renderDetailsDialog = () => (
    <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
      <DialogTitle>
        {activeTab === 0 ? 'Document Request Details' : 'Inquiry Details'}
      </DialogTitle>
      <DialogContent>
        {selectedItem && (
          <Grid container spacing={2}>
            {activeTab === 0 ? (
              // Document details
              <>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">Request ID</Typography>
                  <Typography variant="body1">{selectedItem.requestId}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">Student Name</Typography>
                  <Typography variant="body1">{selectedItem.studentName}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">Document Type</Typography>
                  <Typography variant="body1">{selectedItem.documentType}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">Status</Typography>
                  <Chip label={selectedItem.status} color={selectedItem.status === 'completed' ? 'success' : 'default'} />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="textSecondary">Purpose</Typography>
                  <Typography variant="body1">{selectedItem.purpose || 'Not specified'}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="textSecondary">Comments</Typography>
                  <Typography variant="body1">{selectedItem.comments || 'No comments'}</Typography>
                </Grid>
              </>
            ) : (
              // Inquiry details
              <>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">Name</Typography>
                  <Typography variant="body1">{selectedItem.name}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">Email</Typography>
                  <Typography variant="body1">{selectedItem.email}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="textSecondary">Subject</Typography>
                  <Typography variant="body1">{selectedItem.subject}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="textSecondary">Message</Typography>
                  <Typography variant="body1">{selectedItem.message}</Typography>
                </Grid>
                {selectedItem.response && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="textSecondary">Response</Typography>
                    <Typography variant="body1">{selectedItem.response}</Typography>
                  </Grid>
                )}
              </>
            )}
          </Grid>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseDialog}>Close</Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <ArchiveIcon sx={{ mr: 2, fontSize: 32, color: 'primary.main' }} />
        <Typography variant="h4" component="h1">
          Archive
        </Typography>
      </Box>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Tabs value={activeTab} onChange={handleTabChange} aria-label="archive tabs">
            <Tab 
              icon={<DocumentIcon />} 
              label="Document Requests" 
              iconPosition="start"
            />
            <Tab 
              icon={<InquiryIcon />} 
              label="Inquiries" 
              iconPosition="start"
            />
          </Tabs>
        </CardContent>
      </Card>

      {activeTab === 0 ? renderDocumentTable() : renderInquiryTable()}
      {renderDetailsDialog()}
    </Container>
  );
};

export default Archive;
