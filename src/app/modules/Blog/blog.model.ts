import { model, Schema } from 'mongoose';
import { TBlog } from './blog.interface';

const blogSchema = new Schema<TBlog>({
  user: {
    type: Schema.Types.ObjectId,
    required: [true, 'User Id is required!'],
    ref: 'User',
  },
  title: { type: String, required: [true, 'Title is required!'] },
  description: { type: String, required: [true, 'Description is required!'] },
  image: { type: [String], required: [true, 'Image is required!'] },
  tag: { type: String, required: [true, 'Tag is required!'] },
  isDeleted: { type: Boolean, default: false },
});

// query middleware
blogSchema.pre('find', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

blogSchema.pre('findOne', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

export const Blog = model<TBlog>('Blog', blogSchema);
