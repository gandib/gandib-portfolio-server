/* eslint-disable @typescript-eslint/no-explicit-any */
import { Types } from 'mongoose';

export type TImageFiles = { [fieldname: string]: Express.Multer.File[] };

export interface TBlog {
  user: Types.ObjectId;
  title: string;
  description: string;
  image: string[];
  tag: string;
  isDeleted: boolean;
}
