import multer from 'multer';
import path from 'path';
import { Request } from 'express';

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Store in uploads directory
    // In production, use Railway volumes or S3
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    cb(null, `${name}-${uniqueSuffix}${ext}`);
  }
});

// File filter
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Allowed file types
  const allowedTypes = [
    'application/pdf',
    'text/plain',
    'text/markdown',
    'text/csv',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`File type not allowed: ${file.mimetype}`));
  }
};

// Multer configuration
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max
    files: 1 // Single file upload
  }
});

// Multiple files upload
export const uploadMultiple = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max per file
    files: 5 // Max 5 files
  }
});

/**
 * Extract text from uploaded file
 */
export const extractTextFromFile = async (
  filePath: string,
  mimeType: string
): Promise<string> => {
  try {
    // PDF
    if (mimeType === 'application/pdf') {
      const pdfParse = await import('pdf-parse');
      const fs = await import('fs');
      const dataBuffer = fs.readFileSync(filePath);
      const data = await pdfParse.default(dataBuffer);
      return data.text;
    }

    // Plain text, markdown, CSV
    if (
      mimeType === 'text/plain' ||
      mimeType === 'text/markdown' ||
      mimeType === 'text/csv'
    ) {
      const fs = await import('fs');
      return fs.readFileSync(filePath, 'utf-8');
    }

    // Word documents (basic - may need better library)
    if (
      mimeType === 'application/msword' ||
      mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
      // TODO: Implement Word document parsing
      // Consider using: mammoth, docx-parser
      throw new Error('Word document parsing not yet implemented');
    }

    throw new Error(`Unsupported file type: ${mimeType}`);

  } catch (error: any) {
    console.error('File extraction error:', error);
    throw new Error(`Failed to extract text: ${error.message}`);
  }
};

/**
 * Clean up uploaded file
 */
export const deleteFile = async (filePath: string): Promise<void> => {
  try {
    const fs = await import('fs');
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (error) {
    console.error('File deletion error:', error);
  }
};
