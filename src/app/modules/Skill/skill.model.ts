import { model, Schema } from 'mongoose';
import { TSkill } from './skill.interface';

const skillSchema = new Schema<TSkill>(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: [true, 'User Id is required!'],
      ref: 'User',
    },
    name: { type: String, required: [true, 'Name is required!'] },
    logo: { type: String, required: [true, 'Logo is required!'] },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

// query middleware
skillSchema.pre('find', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

skillSchema.pre('findOne', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

export const Skill = model<TSkill>('Skill', skillSchema);
