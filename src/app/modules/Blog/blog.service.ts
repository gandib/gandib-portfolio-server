/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import AppError from '../../errors/appError';
import { sendImageToCloudinary } from '../../utils/sendImageToCloudinary';
import { Blog } from './blog.model';
import { TImageFiles, TBlog } from './blog.interface';
import config from '../../config';
import QueryBuilder from '../../builder/QueryBuilder';
import { blogSearchableFields } from './blog.constant';
import { TUser } from '../User/user.interface';
import { ObjectId } from 'mongodb';

const createBlog = async (files: TImageFiles, payload: TBlog, user: TUser) => {
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

  const result = await Blog.create(payload);

  return result;
};

const getAllBlog = async (query: Record<string, unknown>) => {
  const blogQuery = new QueryBuilder(
    Blog.find({ isDeleted: { $ne: true } }).populate('user'),
    query,
  )
    .search(blogSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await blogQuery.modelQuery;
  const meta = await blogQuery.countTotal();

  return {
    meta,
    result,
  };
};

const getSingleBlog = async (id: string) => {
  const result = await Blog.findById(id).populate('user');

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Blog Not found!');
  }

  return result;
};

const updateBlog = async (files: TImageFiles, id: string, payload: TBlog) => {
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

  if (payload?.image && payload.image.length === 0) {
    payload.image = [config.project_photo!];
  }

  const blog = await Blog.findById(id);

  if (!blog) {
    throw new AppError(httpStatus.NOT_FOUND, 'Blog Not found!');
  }

  const result = await Blog.findByIdAndUpdate(id, payload, { new: true });

  return result;
};

const deleteBlog = async (id: string) => {
  const blog = await Blog.findById(id);

  if (!blog) {
    throw new AppError(httpStatus.NOT_FOUND, 'Blog Not found!');
  }

  const result = await Blog.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  ).populate('user');

  return result;
};

export const blogServices = {
  createBlog,
  getAllBlog,
  getSingleBlog,
  updateBlog,
  deleteBlog,
};
