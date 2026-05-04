import { Schema, model, Document, Types } from 'mongoose';

export interface IPost extends Document {
  title: string;
  body: string;
  author: Types.ObjectId;
  createdAt: Date;
}

const postSchema = new Schema<IPost>(
  {
    title: { type: String, required: true, trim: true },
    body: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

export const Post = model<IPost>('Post', postSchema);
