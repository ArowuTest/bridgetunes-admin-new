export interface CSVData {
  msisdn: string;
  amount: number;
  date: string;
}

export interface CSVUploadResponse {
  id: string;
  filename: string;
  uploadedAt: string;
  status: 'processing' | 'completed' | 'failed';
  summary: CSVUploadSummary;
}

export interface CSVUploadStats {
  totalUploads: number;
  totalRecords: number;
  totalAmount: number;
  lastUpload: string | null;
}

export interface CSVUploadHistory {
  id: string;
  filename: string;
  uploadedAt: string;
  status: 'processing' | 'completed' | 'failed';
  recordCount: number;
  totalAmount: number;
}

export interface CSVUploadSummary {
  totalRecords: number;
  validRecords: number;
  invalidRecords: number;
  totalAmount: number;
}
