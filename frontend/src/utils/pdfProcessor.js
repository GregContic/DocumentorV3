import { getDocument } from 'pdfjs-dist';
import { createWorker } from 'tesseract.js';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf';

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

// Initialize Tesseract worker with configuration
const initializeWorker = async () => {
  try {
    // Create worker with minimal configuration to avoid cloning issues
    const worker = await createWorker();
    await worker.loadLanguage('eng');
    await worker.initialize('eng');
    return worker;
  } catch (error) {
    console.error('Failed to initialize Tesseract worker:', error);
    throw new Error(
      error.message.includes('could not be cloned')
        ? 'Document processing failed. Please try refreshing the page.'
        : 'Failed to initialize document processing. Please try again.'
    );
  }
};

/**
 * Converts a PDF page to an image for OCR processing
 * @param {Object} page - PDF page object
 * @returns {Promise<string>} - Data URL of the rendered page
 */
const convertPDFPageToImage = async (page) => {
  try {
    const viewport = page.getViewport({ scale: 2.0 }); // Higher scale for better OCR
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    canvas.height = viewport.height;
    canvas.width = viewport.width;

    await page.render({
      canvasContext: context,
      viewport: viewport
    }).promise;

    return canvas.toDataURL('image/png');
  } catch (error) {
    console.error('Error converting PDF to image:', error);
    throw new Error('Failed to process PDF page. Please try again.');
  }
};

/**
 * Extracts text from a PDF file using OCR if needed
 * @param {File} file - PDF file
 * @param {Function} onProgress - Progress callback
 * @returns {Promise<Object>} - Extracted text and confidence score
 */
export const extractTextFromPDF = async (file, onProgress = () => {}) => {
  try {
    const fileBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument(fileBuffer).promise;
    
    let extractedText = '';
    let totalConfidence = 0;
    const numPages = pdf.numPages;
    
    // Initialize Tesseract worker if not already initialized
    if (!globalWorker) {
      globalWorker = await initializeWorker();
    }

    for (let i = 1; i <= numPages; i++) {
      // Update progress (50% of progress is for PDF processing)
      onProgress(Math.floor((i / numPages) * 50));

      const page = await pdf.getPage(i);
      
      // Try to get text directly from PDF first
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map(item => item.str).join(' ');

      // If direct text extraction yields little results, use OCR
      if (pageText.trim().length < 50) {
        const imageUrl = await convertPDFPageToImage(page);
        const { data } = await globalWorker.recognize(imageUrl);
        // Check OCR confidence for PDF pages
        if (data.confidence < 65) {
          throw new Error(`Page ${i} quality is too low for accurate text recognition (Confidence: ${Math.round(data.confidence)}%). Please provide a clearer PDF.`);
        }
        if (!data.text.trim()) {
          throw new Error(`Could not detect readable text on page ${i}. Please provide a clearer PDF.`);
        }
        extractedText += data.text + '\n';
        totalConfidence += data.confidence;
      } else {
        extractedText += pageText + '\n';
        totalConfidence += 95; // Assume high confidence for direct PDF text
      }

      // Update progress (remaining 50% is for OCR if needed)
      onProgress(50 + Math.floor((i / numPages) * 50));
    }

    if (globalWorker) {
      await globalWorker.terminate();
      globalWorker = null;
    }

    return {
      text: extractedText.trim(),
      confidence: totalConfidence / numPages
    };
  } catch (error) {
    if (globalWorker) {
      try {
        await globalWorker.terminate();
        globalWorker = null;
      } catch (terminateError) {
        console.error('Error terminating worker:', terminateError);
      }
    }
    console.error('PDF processing error:', error);
    const errorMessage = error.message || 'Failed to process PDF file';
    
    if (errorMessage.includes('could not be cloned')) {
      throw new Error('Document processing failed. Please refresh the page and try again.');
    } else if (errorMessage === 'Aborted()') {
      throw new Error('Document processing failed. Please try a clearer image or smaller file.');
    } else {
      throw new Error(errorMessage);
    }
  }
};

// Utility: Pre-process image (grayscale + threshold)
const checkImageQuality = (imageData) => {
  let totalBrightness = 0;
  let totalContrast = 0;
  let pixels = 0;

  // Calculate average brightness and contrast
  for (let i = 0; i < imageData.data.length; i += 4) {
    const r = imageData.data[i];
    const g = imageData.data[i + 1];
    const b = imageData.data[i + 2];
    const brightness = (r + g + b) / 3;
    totalBrightness += brightness;
    totalContrast += Math.abs(brightness - 128); // Distance from middle gray
    pixels++;
  }

  const avgBrightness = totalBrightness / pixels;
  const avgContrast = totalContrast / pixels;

  // Check if image is too dark, too bright, or lacks contrast
  if (avgBrightness < 30) {
    throw new Error('Image is too dark. Please provide a clearer or better-lit image.');
  }
  if (avgBrightness > 225) {
    throw new Error('Image is too bright. Please provide a clearer image with better contrast.');
  }
  if (avgContrast < 20) {
    throw new Error('Image lacks contrast. Please provide a clearer image with better contrast.');
  }

  return true;
};

const preprocessImage = async (file) => {
  return new Promise((resolve, reject) => {
    try {
      const img = new window.Image();
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          // Check minimum dimensions
          if (img.width < 800 || img.height < 600) {
            reject(new Error('Image resolution is too low. Please provide a higher quality image (at least 800x600 pixels).'));
            return;
          }

          canvas.width = Math.min(img.width, 2048); // Limit max width
          canvas.height = Math.min(img.height, 2048); // Limit max height
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          
          // Grayscale and contrast enhancement
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          for (let i = 0; i < imageData.data.length; i += 4) {
            const avg = (imageData.data[i] + imageData.data[i+1] + imageData.data[i+2]) / 3;
            // Enhance contrast
            const val = avg > 180 ? 255 : (avg < 50 ? 0 : avg);
            imageData.data[i] = imageData.data[i+1] = imageData.data[i+2] = val;
          }
          ctx.putImageData(imageData, 0, 0);
          
          canvas.toBlob((blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Failed to convert image'));
            }
          }, 'image/png', 0.9);
        } catch (error) {
          reject(error);
        }
      };
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(file);
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Processes image or PDF file for text extraction
 * @param {File} file - Image or PDF file
 * @param {Function} onProgress - Progress callback
 * @returns {Promise<Object>} - Extracted text and metadata
 */
let globalWorker = null;

export const processDocument = async (file, onProgress = () => {}) => {
  try {
    // Validate file type and size before processing
    const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];
    const maxSizeMB = 10;
    
    if (!allowedTypes.includes(file.type)) {
      throw new Error('Unsupported file type. Please upload a PDF or image file (PNG, JPEG).');
    }
    
    if (file.size > maxSizeMB * 1024 * 1024) {
      throw new Error(`File is too large. Maximum allowed size is ${maxSizeMB}MB.`);
    }

    let result;
    if (file.type === 'application/pdf') {
      result = await extractTextFromPDF(file, onProgress);
    } else {
      // Pre-process image before OCR
      const preprocessed = await preprocessImage(file);
      
      try {
        // Initialize Tesseract worker
        if (!globalWorker) {
          globalWorker = await initializeWorker();
        }

        // Process image
        const { data } = await globalWorker.recognize(preprocessed);
        
        // Check OCR confidence
        if (data.confidence < 65) {
          throw new Error(`Image quality is too low for accurate text recognition (Confidence: ${Math.round(data.confidence)}%). Please provide a clearer image.`);
        }

        // Check if we got meaningful text
        if (!data.text.trim() || data.text.length < 10) {
          throw new Error('Could not detect readable text in the image. Please provide a clearer image.');
        }

        result = {
          text: data.text,
          confidence: data.confidence
        };
      } catch (ocrError) {
        if (globalWorker) {
          await globalWorker.terminate();
          globalWorker = null;
        }
        throw new Error('Failed to process image. Please try a clearer image.');
      }
    }

    // Clean up the extracted text
    result.text = result.text
      .replace(/\s+/g, ' ')          // Replace multiple spaces with single space
      .replace(/[^\w\s:,.-]/g, '')   // Remove special characters except some punctuation
      .trim();

    if (globalWorker) {
      await globalWorker.terminate();
      globalWorker = null;
    }

    return {
      ...result,
      fileType: file.type,
      fileName: file.name,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    if (globalWorker) {
      try {
        await globalWorker.terminate();
        globalWorker = null;
      } catch (terminateError) {
        console.error('Error terminating worker:', terminateError);
      }
    }
    console.error('Document processing error:', error);
    const errorMessage = error.message || 'Failed to process document';
    
    if (errorMessage.includes('could not be cloned')) {
      throw new Error('Document processing failed. Please refresh the page and try again.');
    } else if (errorMessage === 'Aborted()') {
      throw new Error('Document processing failed. Please try a clearer image or smaller file.');
    } else {
      throw new Error(errorMessage);
    }
  }
};
