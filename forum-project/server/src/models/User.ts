import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  bio?: string;
  avatarUrl?: string;
  createdAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    username: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    bio: { type: String, default: '' },
    avatarUrl: { type: String, default: '' },
  },
  { timestamps: true }
);

export const User = model<IUser>('User', userSchema);
