export interface CSVData {
  msisdn: string;
  amount: number;
  date: string;
}

export interface CSVUploadResponse {
  id: string;
  fileName: string; // Changed from filename
  uploadDate: string; // Changed from uploadedAt
  status: 'processing' | 'completed' | 'failed' | 'processed'; // Added 'processed'
  summary: CSVUploadSummary;
}

export interface CSVUploadStats {
  totalUploads: number;
  totalRecords: number;
  totalAmount: number;
  lastUpload: string | null;
}

// Updated to match demoDataGenerator structure and include 'processed' status
export interface CSVUploadHistory {
  id: string;
  fileName: string; // Changed from filename
  uploadDate: string; // Changed from uploadedAt
  status: 'processing' | 'completed' | 'failed' | 'processed'; // Added 'processed'
  recordCount: number;
  processedCount?: number; // Added from demo data (optional)
  errorCount?: number; // Added from demo data (optional)
  uploadedBy?: string; // Added from demo data (optional)
  // Removed totalAmount as it wasn't in demo data
}

export interface CSVUploadSummary {
  totalRecords: number;
  validRecords: number;
  invalidRecords: number;
  totalAmount: number;
}


