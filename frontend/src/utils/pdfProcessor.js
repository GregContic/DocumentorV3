import { getDocument } from 'pdfjs-dist';
import { createWorker } from 'tesseract.js';

import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf';
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
/**
 * Converts a PDF page to an image for OCR processing
 * @param {Object} page - PDF page object
 * @returns {Promise<string>} - Data URL of the rendered page
 */
const convertPDFPageToImage = async (page) => {
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
    
    // Initialize Tesseract worker
    const worker = await createWorker('eng');

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
        const { data } = await worker.recognize(imageUrl);
        extractedText += data.text + '\\n';
        totalConfidence += data.confidence;
      } else {
        extractedText += pageText + '\\n';
        totalConfidence += 95; // Assume high confidence for direct PDF text
      }

      // Update progress (remaining 50% is for OCR if needed)
      onProgress(50 + Math.floor((i / numPages) * 50));
    }

    await worker.terminate();

    return {
      text: extractedText.trim(),
      confidence: totalConfidence / numPages
    };
  } catch (error) {
    console.error('PDF processing error:', error);
    throw new Error('Failed to process PDF file');
  }
};

// Utility: Pre-process image (grayscale + threshold)
const preprocessImage = async (file) => {
  return new Promise((resolve) => {
    const img = new window.Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      // Grayscale
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < imageData.data.length; i += 4) {
        const avg = (imageData.data[i] + imageData.data[i+1] + imageData.data[i+2]) / 3;
        // Simple threshold
        const val = avg > 180 ? 255 : 0;
        imageData.data[i] = imageData.data[i+1] = imageData.data[i+2] = val;
      }
      ctx.putImageData(imageData, 0, 0);
      canvas.toBlob((blob) => {
        resolve(blob);
      }, 'image/png');
    };
    img.src = URL.createObjectURL(file);
  });
};

/**
 * Processes image or PDF file for text extraction
 * @param {File} file - Image or PDF file
 * @param {Function} onProgress - Progress callback
 * @returns {Promise<Object>} - Extracted text and metadata
 */
export const processDocument = async (file, onProgress = () => {}) => {
  try {
    let result;

    if (file.type === 'application/pdf') {
      result = await extractTextFromPDF(file, onProgress);
    } else {
      // Pre-process image before OCR
      const preprocessed = await preprocessImage(file);
      // Initialize Tesseract for image processing
      const worker = await createWorker('eng');

      // Process image
      const { data } = await worker.recognize(preprocessed, {
        rectangle: { top: 0, left: 0, width: 0, height: 0 } // Full image
      });

      await worker.terminate();

      result = {
        text: data.text,
        confidence: data.confidence
      };
    }

    // Clean up the extracted text
    result.text = result.text
      .replace(/\s+/g, ' ')          // Replace multiple spaces with single space
      .replace(/[^\w\s:,.-]/g, '')  // Remove special characters except some punctuation
      .trim();

    return {
      ...result,
      fileType: file.type,
      fileName: file.name,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Document processing error:', error);
    throw new Error('Failed to process document');
  }
};
