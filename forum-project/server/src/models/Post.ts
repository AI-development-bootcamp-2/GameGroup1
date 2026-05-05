import { Schema, model, Document, Types } from 'mongoose';

export interface IPost extends Document {
  title: string;
  body: string;
  author: Types.ObjectId;
  category?: string;
  likeCount: number;
  commentCount: number;
  createdAt: Date;
}

const postSchema = new Schema<IPost>(
  {
    title: { type: String, required: true, trim: true },
    body: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    category: { type: String, default: '' },
    likeCount: { type: Number, default: 0 },
    commentCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Post = model<IPost>('Post', postSchema);
