import { model, Schema } from 'mongoose';
import { TProject } from './project.interface';

const projectSchema = new Schema<TProject>({
  user: {
    type: Schema.Types.ObjectId,
    required: [true, 'User Id is required!'],
    ref: 'User',
  },
  title: { type: String, required: [true, 'Title is required!'] },
  description: { type: String, required: [true, 'Description is required!'] },
  clientLiveLink: { type: String, default: '' },
  serverLiveLink: { type: String, default: '' },
  gitClientLink: { type: String, default: '' },
  gitServerLink: { type: String, default: '' },
  image: { type: [String], required: [true, 'Image is required!'] },
  tag: { type: String, required: [true, 'Tag is required!'] },
  isDeleted: { type: Boolean, default: false },
});

// query middleware
projectSchema.pre('find', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

projectSchema.pre('findOne', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

export const Project = model<TProject>('Project', projectSchema);
