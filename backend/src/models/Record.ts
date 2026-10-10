import mongoose, { Document, Schema } from 'mongoose';

export enum RecordCategory {
  IDENTITY = 'Identity',
  EDUCATION = 'Education',
  EXPERIENCE = 'Experience',
  EMPLOYMENT = 'Employment',
  CERTIFICATION = 'Certification',
}

export enum RecordStatus {
  VERIFIED = 'Verified',
  PENDING = 'Pending',
  INCOMPLETE = 'Incomplete',
  REJECTED = 'Rejected',
}

export interface IRecord extends Document {
  recordId: string;
  user: mongoose.Types.ObjectId;
  category: RecordCategory;
  organization: string;
  title: string;
  startDate: Date;
  endDate?: Date;
  status: RecordStatus;
  description?: string;
  verifiedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const recordSchema = new Schema<IRecord>(
  {
    recordId: {
      type: String,
      required: true,
      unique: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    category: {
      type: String,
      enum: Object.values(RecordCategory),
      required: true,
    },
    organization: {
      type: String,
      required: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: Object.values(RecordStatus),
      default: RecordStatus.PENDING,
    },
    description: {
      type: String,
      trim: true,
    },
    verifiedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

recordSchema.index({ user: 1 });
recordSchema.index({ category: 1 });
recordSchema.index({ status: 1 });
recordSchema.index({ recordId: 1 });

export const Record = mongoose.model<IRecord>('Record', recordSchema);
