import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import QRCode from 'qrcode';

// Import logo images directly from assets
import DepEdLogo from '../../assets/deped-logo.jpg';
import SchoolLogo from '../../assets/eltnhslogo.png';

// Generate QR code for document verification
const generateVerificationQR = async (formData) => {
  const qrData = {
    type: 'document_verification',
    documentId: `GOODMORAL_${formData.studentNumber}_${Date.now()}`,
    documentType: 'Certificate of Good Moral Character',
    studentName: `${formData.givenName} ${formData.surname}`,
    studentNumber: formData.studentNumber,
    issuedDate: new Date().toISOString().split('T')[0],
    school: 'Eastern La Trinidad National High School',
    verificationCode: Math.random().toString(36).substring(2, 15).toUpperCase()
  };

  try {
    const qrCodeDataURL = await QRCode.toDataURL(JSON.stringify(qrData), {
      width: 100,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });
    return qrCodeDataURL;
  } catch (error) {
    console.error('Error generating QR code:', error);
    return null;
  }
};

// Create styles for Certificate of Good Moral Character
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 40,
    fontSize: 11,
    fontFamily: 'Helvetica',
  },
  // Header section
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 2,
    borderBottomColor: '#2E7D32',
  },
  headerLeft: {
    flex: 1,
    alignItems: 'center',
  },
  headerCenter: {
    flex: 2,
    alignItems: 'center',
  },
  headerRight: {
    flex: 1,
    alignItems: 'center',
  },
  logoImage: {
    width: 60,
    height: 60,
    objectFit: 'contain',
  },
  officialText: {
    fontSize: 9,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  schoolName: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 2,
    color: '#1565C0',
  },
  schoolAddress: {
    fontSize: 10,
    textAlign: 'center',
    marginBottom: 2,
    color: '#424242',
  },
  // Certificate title
  certificateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 30,
    marginBottom: 40,
    color: '#2E7D32',
    textDecoration: 'underline',
  },
  // Certificate content
  certificationSection: {
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  certificationText: {
    fontSize: 12,
    lineHeight: 1.5,
    textAlign: 'justify',
    marginBottom: 15,
  },
  studentName: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    textDecoration: 'underline',
    marginVertical: 10,
    color: '#1565C0',
  },
  // Student details section
  detailsSection: {
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  detailsTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#2E7D32',
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  detailLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    width: '30%',
    color: '#424242',
  },
  detailValue: {
    fontSize: 10,
    width: '70%',
  },
  // Purpose section
  purposeSection: {
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  purposeText: {
    fontSize: 11,
    textAlign: 'center',
    marginBottom: 20,
  },
  // Signature section
  signatureSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 40,
    paddingHorizontal: 40,
  },
  signatureBlock: {
    alignItems: 'center',
    width: '45%',
  },
  signatureLine: {
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    width: '100%',
    height: 30,
    marginBottom: 5,
  },
  signatureLabel: {
    fontSize: 9,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  signatureTitle: {
    fontSize: 8,
    textAlign: 'center',
    marginTop: 2,
  },
  // QR Code and footer
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  qrSection: {
    alignItems: 'center',
  },
  qrCode: {
    width: 60,
    height: 60,
    marginBottom: 5,
  },
  qrText: {
    fontSize: 7,
    textAlign: 'center',
    color: '#666',
  },
  issuanceInfo: {
    alignItems: 'flex-end',
  },
  issuanceText: {
    fontSize: 8,
    color: '#666',
    marginBottom: 2,
  },
  docNumber: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
});

// Main PDF Document Component
const GoodMoralPDF = ({ formData }) => {
  const [qrCodeUrl, setQrCodeUrl] = React.useState(null);

  React.useEffect(() => {
    const generateQR = async () => {
      const qrUrl = await generateVerificationQR(formData);
      setQrCodeUrl(qrUrl);
    };
    generateQR();
  }, [formData]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return dateString;
    }
  };

  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const documentNumber = `GM-${new Date().getFullYear()}-${formData._id?.slice(-6) || Math.random().toString(36).substring(2, 8).toUpperCase()}`;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.headerRow}>
          <View style={styles.headerLeft}>
            <Image style={styles.logoImage} src={DepEdLogo} />
            <Text style={styles.officialText}>Department of{'\n'}Education</Text>
          </View>
          <View style={styles.headerCenter}>
            <Text style={styles.schoolName}>EASTERN LA TRINIDAD NATIONAL HIGH SCHOOL</Text>
            <Text style={styles.schoolAddress}>La Trinidad, Benguet</Text>
            <Text style={styles.schoolAddress}>Region I - Cordillera Administrative Region</Text>
            <Text style={styles.schoolAddress}>Division of Benguet</Text>
          </View>
          <View style={styles.headerRight}>
            <Image style={styles.logoImage} src={SchoolLogo} />
            <Text style={styles.officialText}>School Logo</Text>
          </View>
        </View>

        {/* Certificate Title */}
        <Text style={styles.certificateTitle}>CERTIFICATE OF GOOD MORAL CHARACTER</Text>

        {/* Certification Content */}
        <View style={styles.certificationSection}>
          <Text style={styles.certificationText}>
            TO WHOM IT MAY CONCERN:
          </Text>
          <Text style={styles.certificationText}>
            This is to certify that <Text style={styles.studentName}>
              {formData.givenName?.toUpperCase()} {formData.middleName?.charAt(0)?.toUpperCase()}. {formData.surname?.toUpperCase()}
            </Text>, a student of this institution, has conducted him/herself in accordance with the policies, rules and regulations of the school.
          </Text>
          <Text style={styles.certificationText}>
            During his/her stay in this school, he/she has not committed any major offense that would reflect negatively on his/her moral character. He/She has shown respect to teachers, school personnel, and fellow students, and has been cooperative in all school activities.
          </Text>
        </View>

        {/* Student Details */}
        <View style={styles.detailsSection}>
          <Text style={styles.detailsTitle}>STUDENT INFORMATION:</Text>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Student Number:</Text>
            <Text style={styles.detailValue}>{formData.studentNumber || 'N/A'}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Date of Birth:</Text>
            <Text style={styles.detailValue}>{formatDate(formData.dateOfBirth)}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Place of Birth:</Text>
            <Text style={styles.detailValue}>{formData.placeOfBirth || 'N/A'}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Year Graduated:</Text>
            <Text style={styles.detailValue}>{formData.yearGraduated || 'N/A'}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Parent/Guardian:</Text>
            <Text style={styles.detailValue}>{formData.parentGuardianName || 'N/A'}</Text>
          </View>
        </View>

        {/* Purpose */}
        <View style={styles.purposeSection}>
          <Text style={styles.purposeText}>
            This certification is issued for the purpose of <Text style={{ fontWeight: 'bold' }}>{formData.purpose?.toUpperCase() || 'GENERAL PURPOSES'}</Text>.
          </Text>
          <Text style={styles.purposeText}>
            Given this {currentDate} at Eastern La Trinidad National High School, La Trinidad, Benguet.
          </Text>
        </View>

        {/* Signature Section */}
        <View style={styles.signatureSection}>
          <View style={styles.signatureBlock}>
            <View style={styles.signatureLine} />
            <Text style={styles.signatureLabel}>PREPARED BY</Text>
            <Text style={styles.signatureTitle}>Guidance Counselor</Text>
          </View>
          <View style={styles.signatureBlock}>
            <View style={styles.signatureLine} />
            <Text style={styles.signatureLabel}>APPROVED BY</Text>
            <Text style={styles.signatureTitle}>School Principal</Text>
          </View>
        </View>

        {/* Footer with QR Code */}
        <View style={styles.footer}>
          <View style={styles.qrSection}>
            {qrCodeUrl && <Image style={styles.qrCode} src={qrCodeUrl} />}
            <Text style={styles.qrText}>Scan to verify{'\n'}document authenticity</Text>
          </View>
          <View style={styles.issuanceInfo}>
            <Text style={styles.issuanceText}>Document No: <Text style={styles.docNumber}>{documentNumber}</Text></Text>
            <Text style={styles.issuanceText}>Issued: {currentDate}</Text>
            <Text style={styles.issuanceText}>Valid: This document is authentic when verified</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default GoodMoralPDF;
