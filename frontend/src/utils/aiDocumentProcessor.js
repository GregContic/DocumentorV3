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
  const extractedData = {
    // Form 137 specific fields to match our form
    surname: '',
    firstName: '',
    middleName: '',
    sex: '',
    dateOfBirth: null,
    barangay: '',
    city: '',
    province: '',
    learnerReferenceNumber: '',
    parentGuardianName: '',
    parentGuardianAddress: '',
    // Additional fields for PDF mapping
    givenName: '', // alias for firstName
    studentNumber: '', // alias for learnerReferenceNumber
    town: '', // alias for city
    barrio: '', // alias for barangay
    placeOfBirth: '',
    elementarySchool: '',
    currentSchool: '',
    yearGraduated: ''
  };

  // Clean and normalize text
  const cleanText = text.replace(/\s+/g, ' ').trim();
  const lines = cleanText.split('\n').map(line => line.trim()).filter(line => line.length > 0);

  // Name extraction patterns
  const namePatterns = [
    /name[:\s]*([a-zA-Z\s,]+)/i,
    /student[:\s]*([a-zA-Z\s,]+)/i,
    /^([A-Z][a-z]+,\s*[A-Z][a-z]+)/,
    /surname[:\s]*([a-zA-Z]+)/i,
    /given\s*name[:\s]*([a-zA-Z\s]+)/i,
    /first\s*name[:\s]*([a-zA-Z\s]+)/i,
    /last\s*name[:\s]*([a-zA-Z]+)/i
  ];

  // Extract names
  for (const pattern of namePatterns) {
    const match = cleanText.match(pattern);
    if (match) {
      const fullName = match[1].trim();
      if (fullName.includes(',')) {
        const [surname, firstName] = fullName.split(',').map(n => n.trim());
        extractedData.surname = surname;
        extractedData.firstName = firstName;
        extractedData.givenName = firstName; // alias
      } else if (fullName.split(' ').length >= 2) {
        const nameParts = fullName.split(' ');
        extractedData.firstName = nameParts.slice(0, -1).join(' ');
        extractedData.givenName = extractedData.firstName; // alias
        extractedData.surname = nameParts[nameParts.length - 1];
        // Extract middle name if present
        if (nameParts.length >= 3) {
          extractedData.middleName = nameParts[nameParts.length - 2];
          extractedData.firstName = nameParts.slice(0, -2).join(' ');
          extractedData.givenName = extractedData.firstName; // alias
        }
      }
      break;
    }
  }

  // Date of birth extraction
  const datePatterns = [
    /(?:date\s*of\s*birth|born|birth\s*date)[:\s]*(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4})/i,
    /(?:dob|d\.o\.b)[:\s]*(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4})/i,
    /(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{4})/g
  ];

  for (const pattern of datePatterns) {
    const match = cleanText.match(pattern);
    if (match) {
      try {
        const dateStr = match[1] || match[0];
        const parsedDate = new Date(dateStr);
        if (!isNaN(parsedDate.getTime())) {
          extractedData.dateOfBirth = parsedDate.toISOString().split('T')[0];
          break;
        }
      } catch (e) {
        // Continue to next pattern
      }
    }
  }

  // Sex/Gender extraction
  const sexPatterns = [
    /(?:sex|gender)[:\s]*(male|female|m|f)/i,
    /\b(male|female)\b/i
  ];

  for (const pattern of sexPatterns) {
    const match = cleanText.match(pattern);
    if (match) {
      const sex = match[1].toLowerCase();
      if (sex === 'm' || sex === 'male') {
        extractedData.sex = 'Male';
      } else if (sex === 'f' || sex === 'female') {
        extractedData.sex = 'Female';
      }
      break;
    }
  }

  // Student number extraction (LRN)
  const studentNumberPatterns = [
    /(?:lrn|learner\s*reference\s*number)[:\s]*([0-9\-]+)/i,
    /(?:student\s*(?:number|id|no)|id\s*number)[:\s]*([a-zA-Z0-9\-]+)/i,
    /\b(\d{12})\b/g, // 12-digit LRN pattern
    /\b(\d{4,})\b/g // Generic number pattern
  ];

  for (const pattern of studentNumberPatterns) {
    const match = cleanText.match(pattern);
    if (match) {
      extractedData.learnerReferenceNumber = match[1];
      extractedData.studentNumber = match[1]; // alias for PDF
      break;
    }
  }

  // Place of birth extraction
  const placePatterns = [
    /(?:place\s*of\s*birth|born\s*in)[:\s]*([a-zA-Z\s,]+)/i,
    /(?:birthplace)[:\s]*([a-zA-Z\s,]+)/i
  ];

  for (const pattern of placePatterns) {
    const match = cleanText.match(pattern);
    if (match) {
      extractedData.placeOfBirth = match[1].trim();
      break;
    }
  }

  // Address component extraction
  const addressPatterns = {
    barangay: /(?:barangay|brgy\.?|brgy\s)[:\s]*([a-zA-Z\s]+)/i,
    city: /(?:city|municipality)[:\s]*([a-zA-Z\s]+)/i,
    province: /(?:province)[:\s]*([a-zA-Z\s]+)/i
  };

  Object.keys(addressPatterns).forEach(component => {
    const match = cleanText.match(addressPatterns[component]);
    if (match) {
      extractedData[component] = match[1].trim();
      // Set aliases for PDF
      if (component === 'barangay') extractedData.barrio = extractedData[component];
      if (component === 'city') extractedData.town = extractedData[component];
    }
  });

  // Extract address from place of birth if available
  if (extractedData.placeOfBirth && !extractedData.barangay) {
    const placeParts = extractedData.placeOfBirth.split(',').map(p => p.trim());
    if (placeParts.length >= 3) {
      extractedData.barangay = placeParts[0];
      extractedData.barrio = placeParts[0]; // alias
      extractedData.city = placeParts[1];
      extractedData.town = placeParts[1]; // alias
      extractedData.province = placeParts[2];
    }
  }

  // School extraction
  const schoolPatterns = [
    /(?:school|institution)[:\s]*([a-zA-Z\s]+(?:school|college|university)[a-zA-Z\s]*)/i,
    /(?:elementary|primary)\s*school[:\s]*([a-zA-Z\s]+)/i,
    /(?:high\s*school|secondary)[:\s]*([a-zA-Z\s]+)/i
  ];

  for (const pattern of schoolPatterns) {
    const match = cleanText.match(pattern);
    if (match) {
      const schoolName = match[1].trim();
      if (!extractedData.elementarySchool) {
        extractedData.elementarySchool = schoolName;
      }
      if (!extractedData.currentSchool) {
        extractedData.currentSchool = schoolName;
      }
      break;
    }
  }

  // Year graduated extraction
  const yearPatterns = [
    /(?:graduated|year\s*graduated)[:\s]*(\d{4})/i,
    /(?:class\s*of)[:\s]*(\d{4})/i,
    /\b(19|20)\d{2}\b/g
  ];

  for (const pattern of yearPatterns) {
    const match = cleanText.match(pattern);
    if (match) {
      const year = match[1] || match[0];
      if (parseInt(year) >= 1990 && parseInt(year) <= new Date().getFullYear()) {
        extractedData.yearGraduated = year;
        break;
      }
    }
  }

  // Parent/Guardian extraction
  const parentPatterns = [
    /(?:parent|guardian|father|mother)[:\s]*([a-zA-Z\s,]+)/i,
    /(?:emergency\s*contact)[:\s]*([a-zA-Z\s,]+)/i
  ];

  for (const pattern of parentPatterns) {
    const match = cleanText.match(pattern);
    if (match) {
      extractedData.parentGuardianName = match[1].trim();
      break;
    }
  }

  // Parent/Guardian address extraction
  const parentAddressPatterns = [
    /(?:parent\s*address|guardian\s*address)[:\s]*([a-zA-Z0-9\s,\.\-]+)/i,
    /(?:address)[:\s]*([a-zA-Z0-9\s,\.\-]+)/i
  ];

  for (const pattern of parentAddressPatterns) {
    const match = cleanText.match(pattern);
    if (match && match[1].length > 10) { // Ensure it's a substantial address
      extractedData.parentGuardianAddress = match[1].trim();
      break;
    }
  }

  return extractedData;
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
