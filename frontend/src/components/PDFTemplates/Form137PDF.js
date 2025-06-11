import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 30,
  },
  header: {
    marginBottom: 20,
    textAlign: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 20,
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  field: {
    marginBottom: 10,
  },
  label: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  value: {
    fontSize: 12,
    marginLeft: 10,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    fontSize: 10,
  },
});

// Create Document Component
const Form137PDF = ({ formData }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>FORM 137 REQUEST FORM</Text>
        <Text style={styles.subtitle}>Student Academic Record Request</Text>
      </View>

      {/* Personal Information */}
      <View style={styles.section}>
        <Text style={styles.label}>PERSONAL INFORMATION</Text>
        <View style={styles.field}>
          <Text style={styles.label}>Student Number:</Text>
          <Text style={styles.value}>{formData.studentNumber}</Text>
        </View>
        <View style={styles.field}>
          <Text style={styles.label}>Purpose:</Text>
          <Text style={styles.value}>{formData.purpose}</Text>
        </View>
      </View>

      {/* School Information */}
      <View style={styles.section}>
        <Text style={styles.label}>SCHOOL INFORMATION</Text>
        <View style={styles.field}>
          <Text style={styles.label}>Year Graduated:</Text>
          <Text style={styles.value}>{formData.yearGraduated}</Text>
        </View>
        <View style={styles.field}>
          <Text style={styles.label}>Current School:</Text>
          <Text style={styles.value}>{formData.currentSchool}</Text>
        </View>
        <View style={styles.field}>
          <Text style={styles.label}>School Address:</Text>
          <Text style={styles.value}>{formData.schoolAddress}</Text>
        </View>
      </View>

      {/* Pickup Schedule */}
      <View style={styles.section}>
        <Text style={styles.label}>PICKUP SCHEDULE</Text>
        <View style={styles.field}>
          <Text style={styles.label}>Preferred Date:</Text>
          <Text style={styles.value}>
            {formData.preferredPickupDate ? new Date(formData.preferredPickupDate).toLocaleDateString() : 'Not set'}
          </Text>
        </View>
        <View style={styles.field}>
          <Text style={styles.label}>Preferred Time:</Text>
          <Text style={styles.value}>
            {formData.preferredPickupTime ? new Date(formData.preferredPickupTime).toLocaleTimeString() : 'Not set'}
          </Text>
        </View>
      </View>

      {/* Additional Notes */}
      {formData.additionalNotes && (
        <View style={styles.section}>
          <Text style={styles.label}>ADDITIONAL NOTES</Text>
          <Text style={styles.value}>{formData.additionalNotes}</Text>
        </View>
      )}

      {/* Footer */}
      <View style={styles.footer}>
        <Text>This document is computer-generated and serves as a request form only.</Text>
        <Text>Request Date: {new Date().toLocaleDateString()}</Text>
      </View>
    </Page>
  </Document>
);

export default Form137PDF;
