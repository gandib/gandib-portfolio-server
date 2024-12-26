/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import AppError from '../../errors/appError';
import { sendImageToCloudinary } from '../../utils/sendImageToCloudinary';
import { Project } from './project.model';
import { TImageFiles, TProject } from './project.interface';
import config from '../../config';
import QueryBuilder from '../../builder/QueryBuilder';
import { projectSearchableFields } from './project.constant';
import { TUser } from '../User/user.interface';
import { ObjectId } from 'mongodb';

const createProject = async (
  files: TImageFiles,
  payload: TProject,
  user: TUser,
) => {
  const { file } = files;
  try {
    if (file) {
      const paths: string[] = [];
      const imageUrl: string[] = [];
      file.map((image: any) => {
        paths.push(image?.path);
      });

      // send image to cloudinary
      for (let index = 0; index < paths.length; index++) {
        const path = paths[index];
        const { secure_url } = await sendImageToCloudinary(path);
        imageUrl.push(secure_url as string);
      }
      payload.image = imageUrl as string[];
    }
  } catch (error) {
    console.log(error);
  }

  if (payload.image.length === 0) {
    payload.image = [config.project_photo!];
  }

  if (user._id) {
    payload.user = new ObjectId(user._id);
  }

  const result = await Project.create(payload);

  return result;
};

const getAllProject = async (query: Record<string, unknown>) => {
  const projectQuery = new QueryBuilder(
    Project.find({ isDeleted: { $ne: true } }).populate('user'),
    query,
  )
    .search(projectSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await projectQuery.modelQuery;
  const meta = await projectQuery.countTotal();

  return {
    meta,
    result,
  };
};

const getSingleProject = async (id: string) => {
  const result = await Project.findById(id).populate('user');

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Project Not found!');
  }

  return result;
};

const updateProject = async (id: string, payload: TProject) => {
  const project = await Project.findById(id);

  if (!project) {
    throw new AppError(httpStatus.NOT_FOUND, 'Project Not found!');
  }

  const result = await Project.findByIdAndUpdate(id, payload, { new: true });

  return result;
};

const deleteProject = async (id: string) => {
  const project = await Project.findById(id);

  if (!project) {
    throw new AppError(httpStatus.NOT_FOUND, 'Project Not found!');
  }

  const result = await Project.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  ).populate('user');

  return result;
};

export const projectServices = {
  createProject,
  getAllProject,
  getSingleProject,
  updateProject,
  deleteProject,
};
