/* eslint-disable @typescript-eslint/no-explicit-any */
import { Types } from 'mongoose';

export type TImageFiles = { [fieldname: string]: Express.Multer.File[] };

export interface TProject {
  user: Types.ObjectId;
  title: string;
  description: string;
  clientLiveLink?: string;
  serverLiveLink?: string;
  gitClientLink?: string;
  gitServerLink?: string;
  image: string[];
  tag: string;
  isDeleted: boolean;
}
