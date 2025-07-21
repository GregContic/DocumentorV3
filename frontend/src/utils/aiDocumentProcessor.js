import Tesseract from 'tesseract.js';

/**
 * AI-powered document processing utilities
 */

// Text extraction using OCR
export const extractTextFromImage = async (imageFile, onProgress = null) => {
  try {
    const result = await Tesseract.recognize(
      imageFile,
      'eng',
      {
        logger: onProgress ? (m) => {
          if (m.status === 'recognizing text') {
            onProgress(Math.round(m.progress * 100));
          }
        } : undefined
      }
    );
    
    return {
      text: result.data.text,
      confidence: result.data.confidence,
      words: result.data.words
    };
  } catch (error) {
    console.error('OCR Error:', error);
    throw new Error('Failed to extract text from image');
  }
};

// AI-powered information extraction using pattern matching and NLP
export const extractStudentInformation = (text) => {
  // Clean and normalize text
  const cleanText = text.replace(/[|]/g, '').replace(/\s+/g, ' ').trim();
  const debug = true; // Set to true to log extraction process
  const extractedFields = [];
  const fieldConfidences = {};

  // --- Personal Info ---
  const personalInfo = {
    surname: '',
    firstName: '',
    middleName: '',
    extension: '',
    dateOfBirth: null,
    placeOfBirth: '',
    sex: '',
    age: '',
    religion: '',
    citizenship: '',
    lrn: '',
    registrationNumber: '',
    issueDate: '',
  };

  // --- Address ---
  const address = {
    houseNumber: '',
    street: '',
    barangay: '',
    city: '',
    province: '',
    zipCode: '',
  };

  // --- Academic Info ---
  const academicInfo = {
    lastSchool: '',
    schoolAddress: '',
    gradeLevel: '',
    schoolYear: '',
    gradeToEnroll: '',
    track: '',
  };

  // --- Parent/Guardian Info ---
  const parentInfo = {
    fatherName: '',
    fatherOccupation: '',
    fatherContactNumber: '',
    motherName: '',
    motherOccupation: '',
    motherContactNumber: '',
    guardianName: '',
    guardianRelationship: '',
    guardianOccupation: '',
    guardianContactNumber: '',
  };

  // --- Emergency Contact ---
  const emergencyContact = {
    emergencyContactName: '',
    emergencyContactRelationship: '',
    emergencyContactNumber: '',
    emergencyContactAddress: '',
  };

  // --- Multilingual Keyword Patterns for Birth Certificate ---
  const fieldPatterns = [
    // Name
    { keys: ['Name', 'Pangalan', "Child’s Name", "Child's Name"], assign: (v) => {
      const parts = v.split(/\s+/);
      if (parts.length >= 2) {
        personalInfo.firstName = parts[0];
        personalInfo.surname = parts[1];
        if (parts.length >= 3) personalInfo.middleName = parts.slice(2).join(' ');
        fieldConfidences.firstName = 0.9;
        fieldConfidences.surname = 0.9;
        fieldConfidences.middleName = 0.8;
      }
    } },
    // Date of Birth
    { keys: ['Date of Birth', 'Kaarawan', 'Kapanganakan'], assign: (v) => {
      personalInfo.dateOfBirth = normalizeDate(v);
      fieldConfidences.dateOfBirth = 0.9;
    } },
    // Place of Birth
    { keys: ['Place of Birth', 'Lugar ng Kapanganakan'], assign: (v) => {
      personalInfo.placeOfBirth = v;
      fieldConfidences.placeOfBirth = 0.9;
    } },
    // Sex/Gender
    { keys: ['Sex', 'Kasarian', 'Gender'], assign: (v) => {
      personalInfo.sex = v;
      fieldConfidences.sex = 0.9;
    } },
    // Father
    { keys: ["Father’s Name", "Father's Name", 'Ama'], assign: (v) => {
      parentInfo.fatherName = v;
      fieldConfidences.fatherName = 0.9;
    } },
    // Mother
    { keys: ["Mother’s Name", "Mother's Name", 'Ina'], assign: (v) => {
      parentInfo.motherName = v;
      fieldConfidences.motherName = 0.9;
    } },
    // Registry No.
    { keys: ['Registry No.', 'Reg. No.'], assign: (v) => {
      personalInfo.registrationNumber = v;
      fieldConfidences.registrationNumber = 0.9;
    } },
    // Date Issued
    { keys: ['Date Issued', 'Petsa ng Paglabas'], assign: (v) => {
      personalInfo.issueDate = normalizeDate(v);
      fieldConfidences.issueDate = 0.9;
    } },
  ];

  // --- Helper: Normalize date to YYYY-MM-DD ---
  function normalizeDate(val) {
    if (!val) return '';
    let d = val.trim();
    // Try to match DD/MM/YYYY, MM/DD/YYYY, YYYY-MM-DD, etc.
    const parts = d.split(/[\/.\-]/);
    if (parts.length === 3) {
      if (parts[0].length === 4) return `${parts[0]}-${parts[1].padStart(2, '0')}-${parts[2].padStart(2, '0')}`;
      if (parts[2].length === 4) return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
    }
    // Fallback: just return as is
    return d;
  }

  // --- Multilingual Field Extraction ---
  for (const { keys, assign } of fieldPatterns) {
    for (const k of keys) {
      const regex = new RegExp(`${k}[:\s]*([a-zA-Z0-9\s,\-\/'\.]+)`, 'i');
      const match = cleanText.match(regex);
      if (match && match[1]) {
        assign(match[1].trim());
          break;
      }
    }
  }

  // --- Robust Extraction Patterns ---
  // Helper: typo/variant tolerant regex
  const label = (variants) => `(?:${variants.join('|')})`;

  // Name
  const surnamePattern = new RegExp(`${label(['surname', 'surnarne', 'last name', 'family name'])}[:\s]*([a-zA-Z\s]+)`, 'i');
  const firstNamePattern = new RegExp(`${label(['first name', 'given name', 'firstname'])}[:\s]*([a-zA-Z\s]+)`, 'i');
  const middleNamePattern = new RegExp(`${label(['middle name', 'middlename', 'm.i.', 'mi'])}[:\s]*([a-zA-Z\s]+)`, 'i');
  const extensionPattern = new RegExp(`${label(['extension', 'ext'])}[:\s]*([a-zA-Z\s]+)`, 'i');
  const fullNamePattern = /name[:\s]*([a-zA-Z\s,\.]+)/i;

  // LRN
  const lrnPattern = new RegExp(`${label(['lrn', 'learner reference number', 'lrn no', 'lrn number'])}[:\s]*([0-9\-]{8,})`, 'i');
  const lrnFallbackPattern = /\b(\d{12})\b/;

  // Date of Birth
  const dobPattern = new RegExp(`${label(['date of birth', 'dob', 'd.o.b', 'birthdate', 'birth date'])}[:\s]*([0-9]{1,2}[\/\.\-][0-9]{1,2}[\/\.\-][0-9]{2,4})`, 'i');
  const dobFallbackPattern = /(\d{1,2}[\/\.\-]{1}\d{1,2}[\/\.\-]{1}\d{2,4})/;

  // Place of Birth
  const pobPattern = new RegExp(`${label(['place of birth', 'birthplace', 'born in'])}[:\s]*([a-zA-Z\s,]+)`, 'i');

  // Sex
  const sexPattern = new RegExp(`${label(['sex', 'gender'])}[:\s]*(male|female|m|f)`, 'i');

  // Religion
  const religionPattern = new RegExp(`${label(['religion'])}[:\s]*([a-zA-Z\s]+)`, 'i');

  // Citizenship
  const citizenshipPattern = new RegExp(`${label(['citizenship', 'nationality'])}[:\s]*([a-zA-Z\s]+)`, 'i');

  // Address
  const houseNumberPattern = new RegExp(`${label(['house number', 'house no', 'houseno'])}[:\s]*([a-zA-Z0-9\s]+)`, 'i');
  const streetPattern = new RegExp(`${label(['street', 'st'])}[:\s]*([a-zA-Z0-9\s]+)`, 'i');
  const barangayPattern = new RegExp(`${label(['barangay', 'brgy', 'bgy'])}[:\s]*([a-zA-Z\s]+)`, 'i');
  const cityPattern = new RegExp(`${label(['city', 'municipality', 'town'])}[:\s]*([a-zA-Z\s]+)`, 'i');
  const provincePattern = new RegExp(`${label(['province'])}[:\s]*([a-zA-Z\s]+)`, 'i');
  const zipCodePattern = new RegExp(`${label(['zip code', 'zipcode', 'postal code'])}[:\s]*([0-9]+)`, 'i');

  // Academic Info
  const lastSchoolPattern = new RegExp(`${label(['last school attended', 'last school', 'previous school'])}[:\s]*([a-zA-Z0-9\s\.\-]+)`, 'i');
  const schoolAddressPattern = new RegExp(`${label(['school address', 'school add'])}[:\s]*([a-zA-Z0-9\s,\.\-]+)`, 'i');
  const gradeLevelPattern = new RegExp(`${label(['grade level', 'grade', 'year level'])}[:\s]*([a-zA-Z0-9\s]+)`, 'i');
  const schoolYearPattern = new RegExp(`${label(['school year', 'sy', 's.y.'])}[:\s]*([0-9\-\s]+)`, 'i');
  const gradeToEnrollPattern = new RegExp(`${label(['grade to enroll', 'to enroll', 'enroll in'])}[:\s]*([a-zA-Z0-9\s]+)`, 'i');
  const trackPattern = new RegExp(`${label(['track', 'strand'])}[:\s]*([a-zA-Z\s]+)`, 'i');

  // Parent/Guardian Info
  const fatherNamePattern = new RegExp(`${label(["father's name", 'father name', 'father'])}[:\s]*([a-zA-Z\s]+)`, 'i');
  const fatherOccupationPattern = new RegExp(`${label(["father's occupation", 'father occupation'])}[:\s]*([a-zA-Z\s]+)`, 'i');
  const fatherContactPattern = new RegExp(`${label(["father's contact number", 'father contact', 'father contact number'])}[:\s]*([0-9\-\s]+)`, 'i');
  const motherNamePattern = new RegExp(`${label(["mother's name", 'mother name', 'mother'])}[:\s]*([a-zA-Z\s]+)`, 'i');
  const motherOccupationPattern = new RegExp(`${label(["mother's occupation", 'mother occupation'])}[:\s]*([a-zA-Z\s]+)`, 'i');
  const motherContactPattern = new RegExp(`${label(["mother's contact number", 'mother contact', 'mother contact number'])}[:\s]*([0-9\-\s]+)`, 'i');
  const guardianNamePattern = new RegExp(`${label(["guardian's name", 'guardian name', 'guardian'])}[:\s]*([a-zA-Z\s]+)`, 'i');
  const guardianRelationshipPattern = new RegExp(`${label(["guardian's relationship", 'guardian relationship', 'relationship'])}[:\s]*([a-zA-Z\s]+)`, 'i');
  const guardianOccupationPattern = new RegExp(`${label(["guardian's occupation", 'guardian occupation'])}[:\s]*([a-zA-Z\s]+)`, 'i');
  const guardianContactPattern = new RegExp(`${label(["guardian's contact number", 'guardian contact', 'guardian contact number'])}[:\s]*([0-9\-\s]+)`, 'i');

  // Emergency Contact
  const emergencyNamePattern = new RegExp(`${label(['emergency contact name', 'emergency name'])}[:\s]*([a-zA-Z\s]+)`, 'i');
  const emergencyRelationshipPattern = new RegExp(`${label(['emergency contact relationship', 'emergency relationship'])}[:\s]*([a-zA-Z\s]+)`, 'i');
  const emergencyNumberPattern = new RegExp(`${label(['emergency contact number', 'emergency number'])}[:\s]*([0-9\-\s]+)`, 'i');
  const emergencyAddressPattern = new RegExp(`${label(['emergency contact address', 'emergency address'])}[:\s]*([a-zA-Z0-9\s,\.\-]+)`, 'i');

  // --- Extraction ---
  const patterns = [
    [surnamePattern, v => { personalInfo.surname = v.trim(); extractedFields.push('surname'); }],
    [firstNamePattern, v => { personalInfo.firstName = v.trim(); extractedFields.push('firstName'); }],
    [middleNamePattern, v => { personalInfo.middleName = v.trim(); extractedFields.push('middleName'); }],
    [extensionPattern, v => { personalInfo.extension = v.trim(); extractedFields.push('extension'); }],
    [fullNamePattern, v => {
      const parts = v.split(',');
      if (parts.length === 2) {
        personalInfo.surname = personalInfo.surname || parts[0].trim();
        personalInfo.firstName = personalInfo.firstName || parts[1].trim();
        extractedFields.push('surname', 'firstName');
      }
    }],
    [lrnPattern, v => { personalInfo.lrn = v.trim(); extractedFields.push('lrn'); }],
    [dobPattern, v => { personalInfo.dateOfBirth = v.trim(); extractedFields.push('dateOfBirth'); }],
    [pobPattern, v => { personalInfo.placeOfBirth = v.trim(); extractedFields.push('placeOfBirth'); }],
    [sexPattern, v => { personalInfo.sex = v.trim(); extractedFields.push('sex'); }],
    [religionPattern, v => { personalInfo.religion = v.trim(); extractedFields.push('religion'); }],
    [citizenshipPattern, v => { personalInfo.citizenship = v.trim(); extractedFields.push('citizenship'); }],
    [houseNumberPattern, v => { address.houseNumber = v.trim(); extractedFields.push('houseNumber'); }],
    [streetPattern, v => { address.street = v.trim(); extractedFields.push('street'); }],
    [barangayPattern, v => { address.barangay = v.trim(); extractedFields.push('barangay'); }],
    [cityPattern, v => { address.city = v.trim(); extractedFields.push('city'); }],
    [provincePattern, v => { address.province = v.trim(); extractedFields.push('province'); }],
    [zipCodePattern, v => { address.zipCode = v.trim(); extractedFields.push('zipCode'); }],
    [lastSchoolPattern, v => { academicInfo.lastSchool = v.trim(); extractedFields.push('lastSchool'); }],
    [schoolAddressPattern, v => { academicInfo.schoolAddress = v.trim(); extractedFields.push('schoolAddress'); }],
    [gradeLevelPattern, v => { academicInfo.gradeLevel = v.trim(); extractedFields.push('gradeLevel'); }],
    [schoolYearPattern, v => { academicInfo.schoolYear = v.trim(); extractedFields.push('schoolYear'); }],
    [gradeToEnrollPattern, v => { academicInfo.gradeToEnroll = v.trim(); extractedFields.push('gradeToEnroll'); }],
    [trackPattern, v => { academicInfo.track = v.trim(); extractedFields.push('track'); }],
    [fatherNamePattern, v => { parentInfo.fatherName = v.trim(); extractedFields.push('fatherName'); }],
    [fatherOccupationPattern, v => { parentInfo.fatherOccupation = v.trim(); extractedFields.push('fatherOccupation'); }],
    [fatherContactPattern, v => { parentInfo.fatherContactNumber = v.trim(); extractedFields.push('fatherContactNumber'); }],
    [motherNamePattern, v => { parentInfo.motherName = v.trim(); extractedFields.push('motherName'); }],
    [motherOccupationPattern, v => { parentInfo.motherOccupation = v.trim(); extractedFields.push('motherOccupation'); }],
    [motherContactPattern, v => { parentInfo.motherContactNumber = v.trim(); extractedFields.push('motherContactNumber'); }],
    [guardianNamePattern, v => { parentInfo.guardianName = v.trim(); extractedFields.push('guardianName'); }],
    [guardianRelationshipPattern, v => { parentInfo.guardianRelationship = v.trim(); extractedFields.push('guardianRelationship'); }],
    [guardianOccupationPattern, v => { parentInfo.guardianOccupation = v.trim(); extractedFields.push('guardianOccupation'); }],
    [guardianContactPattern, v => { parentInfo.guardianContactNumber = v.trim(); extractedFields.push('guardianContactNumber'); }],
    [emergencyNamePattern, v => { emergencyContact.emergencyContactName = v.trim(); extractedFields.push('emergencyContactName'); }],
    [emergencyRelationshipPattern, v => { emergencyContact.emergencyContactRelationship = v.trim(); extractedFields.push('emergencyContactRelationship'); }],
    [emergencyNumberPattern, v => { emergencyContact.emergencyContactNumber = v.trim(); extractedFields.push('emergencyContactNumber'); }],
    [emergencyAddressPattern, v => { emergencyContact.emergencyContactAddress = v.trim(); extractedFields.push('emergencyContactAddress'); }],
  ];

  for (const [pattern, setter] of patterns) {
    const match = cleanText.match(pattern);
    if (match && match[1]) setter(match[1]);
  }

  // Fallbacks for LRN and DOB if not found by label
  if (!personalInfo.lrn) {
    const lrnMatch = cleanText.match(lrnFallbackPattern);
    if (lrnMatch) {
      personalInfo.lrn = lrnMatch[1];
      extractedFields.push('lrn (fallback)');
    }
  }
  if (!personalInfo.dateOfBirth) {
    const dobMatch = cleanText.match(dobFallbackPattern);
    if (dobMatch) {
      personalInfo.dateOfBirth = dobMatch[1];
      extractedFields.push('dateOfBirth (fallback)');
    }
  }

  // Fallback for full name if not found
  if (!personalInfo.surname || !personalInfo.firstName) {
    // Try to find a line with 2-3 words after 'Name' or similar
    const nameLine = cleanText.match(/name[:\s]*([a-zA-Z\s]+)/i);
    if (nameLine && nameLine[1]) {
      const parts = nameLine[1].trim().split(' ');
      if (parts.length >= 2) {
        personalInfo.firstName = personalInfo.firstName || parts[0];
        personalInfo.surname = personalInfo.surname || parts[1];
        if (parts.length >= 3) personalInfo.middleName = personalInfo.middleName || parts[2];
        extractedFields.push('name (fallback)');
      }
    }
  }

  if (debug) {
    // eslint-disable-next-line no-console
    console.log('AI Extraction Debug:', {
      extractedFields,
      personalInfo,
      address,
      academicInfo,
      parentInfo,
      emergencyContact,
      fieldConfidences,
      cleanText,
    });
  }

  return {
    personalInfo,
    address,
    academicInfo,
    parentInfo,
    emergencyContact,
    fieldConfidences,
  };
};

// Confidence scoring for extracted data
export const calculateExtractionConfidence = (extractedData, originalText) => {
  let score = 0;
  let totalFields = 0;

  const fields = [
    'surname', 'givenName', 'dateOfBirth', 'sex', 
    'studentNumber', 'placeOfBirth', 'currentSchool'
  ];

  fields.forEach(field => {
    totalFields++;
    if (extractedData[field] && extractedData[field].toString().trim().length > 0) {
      score++;
    }
  });

  return {
    score: (score / totalFields) * 100,
    extractedFields: score,
    totalFields: totalFields,
    recommendation: score >= 5 ? 'high' : score >= 3 ? 'medium' : 'low'
  };
};

// Smart field mapping for different document types
export const identifyDocumentType = (text) => {
  const documentTypes = {
    'form137': /form\s*137|permanent\s*record|secondary\s*student|transcript/i,
    'form138': /form\s*138|report\s*card|grades/i,
    'diploma': /diploma|certificate|graduation/i,
    'id': /identification|student\s*id|school\s*id/i,
    'transcript': /transcript|academic\s*record|official\s*transcript/i
  };

  for (const [type, pattern] of Object.entries(documentTypes)) {
    if (pattern.test(text)) {
      return type;
    }
  }

  return 'unknown';
};

// Advanced text preprocessing
export const preprocessText = (text) => {
  return text
    .replace(/[^\w\s\-\.,\/]/g, ' ') // Remove special characters except common ones
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim()
    .toLowerCase();
};
