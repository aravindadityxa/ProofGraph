export enum RecordCategory {
  IDENTITY = 'Identity',
  EDUCATION = 'Education',
  EXPERIENCE = 'Experience',
  EMPLOYMENT = 'Employment',
  CERTIFICATION = 'Certification'
}

export enum RecordStatus {
  VERIFIED = 'Verified',
  PENDING = 'Pending',
  INCOMPLETE = 'Incomplete',
  REJECTED = 'Rejected'
}

export interface Record {
  _id: string;
  recordId: string;
  user: string;
  category: RecordCategory;
  organization: string;
  title: string;
  startDate: string;
  endDate?: string;
  status: RecordStatus;
  description?: string;
  verifiedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface VerificationStage {
  name: string;
  label: string;
  category: RecordCategory;
  status: RecordStatus;
  count: number;
}
