export interface CSVData {
  msisdn: string;
  rechargeAmount: number;
  optInStatus: boolean;
  rechargeDate: string;
}

export interface CSVUploadResponse {
  success: boolean;
  totalRecords: number;
  processedRecords: number;
  failedRecords: number;
  errors?: string[];
}

export interface CSVUploadStats {
  totalUploads: number;
  totalRecordsProcessed: number;
  lastUploadDate?: string;
  averageRecordsPerUpload: number;
}

export interface CSVUploadHistory {
  id: string;
  fileName: string;
  uploadedBy: string;
  uploadDate: string;
  totalRecords: number;
  processedRecords: number;
  failedRecords: number;
  status: 'completed' | 'processing' | 'failed';
}

export interface CSVUploadSummary {
  totalRecords: number;
  validRecords: number;
  invalidRecords: number;
  duplicateRecords: number;
  optInRecords: number;
  optOutRecords: number;
  rechargeAmountDistribution: {
    [key: string]: number;
  };
  dateDistribution: {
    [key: string]: number;
  };
}
