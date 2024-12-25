/* eslint-disable @typescript-eslint/no-explicit-any */
import { Types } from 'mongoose';

export type TImageFiles = { [fieldname: string]: Express.Multer.File[] };

export interface TSkill {
  user: Types.ObjectId;
  name: string;
  logo: string;
  isDeleted: boolean;
}
