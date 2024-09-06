import mongoose, { Schema, Document } from 'mongoose';

// Interface for the Reel Document
export interface IReel extends Document {
  video: string;
  caption: string;
  thumbnail?: string;
  description?: string;
  likes: number[];
  ownerId: string;
}

// Mongoose schema definition for Reel
const ReelSchema: Schema<IReel> = new Schema<IReel>({
  video: {
    type: String,
    required: true,
  },
  caption: {
    type: String,
    default: '',
  },
  thumbnail: {
    type: String,
    default: '',
  },
  description: {
    type: String,
    default: '',
  },
  likes: {
    type: [Number],
    default: [],
  },
  ownerId: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,  // Automatically creates `createdAt` and `updatedAt` fields
});

// Export the Reel model
const Reel = mongoose.model<IReel>('Reel', ReelSchema);

export default Reel;
