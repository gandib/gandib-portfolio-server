/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import AppError from '../../errors/appError';
import { sendImageToCloudinary } from '../../utils/sendImageToCloudinary';
import { Skill } from './skill.model';
import { TSkill } from './skill.interface';
import config from '../../config';
import QueryBuilder from '../../builder/QueryBuilder';
import { skillSearchableFields } from './skill.constant';
import { ObjectId } from 'mongodb';
import { TUser } from '../User/user.interface';
import { User } from '../User/user.model';

const createSkill = async (file: any, payload: TSkill, user: TUser) => {
  const userData = await User.isUserExistsByEmail(user?.email);

  if (!userData) {
    throw new AppError(httpStatus.NOT_FOUND, 'No User Found');
  }
  try {
    if (file) {
      // const imageName = `${payload?.email}${payload?.name}`;
      const path = file?.path;

      // send image to cloudinary
      const { secure_url } = await sendImageToCloudinary(path);
      payload.logo = secure_url as string;
    }
  } catch (error) {
    console.log(error);
  }

  if (payload.logo === ' ') {
    payload.logo = config.blog_photo!;
  }

  if (user._id) {
    payload.user = new ObjectId(user._id);
  }

  const result = await Skill.create(payload);

  return result;
};

const getAllSkill = async (query: Record<string, unknown>) => {
  const skillQuery = new QueryBuilder(
    Skill.find({ isDeleted: { $ne: true } }).populate('user'),
    query,
  )
    .search(skillSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await skillQuery.modelQuery;
  const meta = await skillQuery.countTotal();

  return {
    meta,
    result,
  };
};

const getSingleSkill = async (id: string) => {
  const result = await Skill.findById(id).populate('user');

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Skill Not found!');
  }

  return result;
};

const updateSkill = async (id: string, payload: TSkill) => {
  const skill = await Skill.findById(id);

  if (!skill) {
    throw new AppError(httpStatus.NOT_FOUND, 'Skill Not found!');
  }

  const result = await Skill.findByIdAndUpdate(id, payload, { new: true });

  return result;
};

const deleteSkill = async (id: string) => {
  const skill = await Skill.findById(id);

  if (!skill) {
    throw new AppError(httpStatus.NOT_FOUND, 'Skill Not found!');
  }

  const result = await Skill.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  ).populate('user');

  return result;
};

export const skillServices = {
  createSkill,
  getAllSkill,
  getSingleSkill,
  updateSkill,
  deleteSkill,
};
