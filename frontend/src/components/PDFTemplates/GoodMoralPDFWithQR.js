import React, { useState, useEffect, useMemo } from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { Button, CircularProgress } from '@mui/material';
import { Download as DownloadIcon } from '@mui/icons-material';
import GoodMoralPDF from './GoodMoralPDF';
import { generateDocumentQR } from '../../utils/qrCodeUtils';

const GoodMoralPDFWithQR = ({ formData, fileName, children, ...buttonProps }) => {
  const [qrCode, setQrCode] = useState(null);
  const [qrLoading, setQrLoading] = useState(true);

  // Use useMemo to prevent recreating transformedFormData on every render
  const transformedFormData = useMemo(() => ({
    ...formData,
    // Map form fields to PDF expected fields
    givenName: formData.givenName || formData.firstName || '',
    surname: formData.surname || formData.lastName || '',
    middleName: formData.middleName || '',
    studentNumber: formData.studentNumber || formData.learnerReferenceNumber || '',
    // Add default values for fields not in the form but expected by PDF
    currentSchool: formData.currentSchool || 'Eastern La Trinidad National High School',
    schoolAddress: formData.schoolAddress || 'La Trinidad, Benguet',
    // Format place of birth from components
    placeOfBirth: formData.placeOfBirth || [
      formData.barrio || formData.barangay,
      formData.town || formData.city,
      formData.province
    ].filter(Boolean).join(', '),
    // Ensure all required fields have defaults
    sex: formData.sex || '',
    dateOfBirth: formData.dateOfBirth || '',
    parentGuardianName: formData.parentGuardianName || '',
    parentGuardianAddress: formData.parentGuardianAddress || '',
    parentGuardianOccupation: formData.parentGuardianOccupation || '',
    yearGraduated: formData.yearGraduated || '',
    purpose: formData.purpose || 'General purposes',
    additionalNotes: formData.additionalNotes || ''
  }), [formData]);

  useEffect(() => {
    const generateQR = async () => {
      try {
        setQrLoading(true);
        // Only generate QR if we have meaningful form data
        if (transformedFormData && (transformedFormData.surname || transformedFormData.givenName)) {
          const qrCodeDataURL = await generateDocumentQR({
            ...transformedFormData,
            documentType: 'Certificate of Good Moral Character'
          });
          setQrCode(qrCodeDataURL);
        } else {
          setQrCode(null);
        }
      } catch (error) {
        console.error('Failed to generate QR code:', error);
        setQrCode(null);
      } finally {
        setQrLoading(false);
      }
    };

    generateQR();
  }, [transformedFormData]);

  if (qrLoading) {
    return (
      <Button disabled {...buttonProps}>
        <CircularProgress size={16} sx={{ mr: 1 }} />
        Generating...
      </Button>
    );
  }

  return (
    <PDFDownloadLink
      document={<GoodMoralPDF formData={transformedFormData} qrCode={qrCode} />}
      fileName={fileName}
      style={{ textDecoration: 'none' }}
    >
      {({ blob, url, loading, error }) => (
        <Button
          {...buttonProps}
          disabled={loading || error}
          startIcon={loading ? <CircularProgress size={16} /> : <DownloadIcon />}
        >
          {loading ? 'Generating PDF...' : children || 'Download PDF'}
        </Button>
      )}
    </PDFDownloadLink>
  );
};

export default GoodMoralPDFWithQR;
