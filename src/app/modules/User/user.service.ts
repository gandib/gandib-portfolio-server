/* eslint-disable @typescript-eslint/no-explicit-any */
import jwt from 'jsonwebtoken';
import httpStatus from 'http-status';
import { TLoginUser, TUser } from './user.interface';
import { User } from './user.model';
import AppError from '../../errors/appError';
import config from '../../config';
import { createToken, verifyToken } from './user.utils';
import { sendEmail } from '../../utils/sendEmail';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';

const createUser = async (file: any, payload: TUser) => {
  const isUserExists = await User.findOne({ email: payload.email });
  if (isUserExists) {
    throw new AppError(httpStatus.BAD_REQUEST, 'User already exists!');
  }

  // payload.role = 'ADMIN';

  const user = await User.create(payload);
  const result = await User.findById(user?._id).select('-password');

  return result;
};

const loginUser = async (payload: TLoginUser) => {
  const user = await User.isUserExistsByEmail(payload?.email);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'No Data Found');
  }

  // checking if password is correct
  if (!(await User.isPasswordMatched(payload?.password, user?.password))) {
    throw new AppError(httpStatus.FORBIDDEN, 'Password is not matched!');
  }

  const jwtPayload = {
    _id: user?._id,
    name: user?.name,
    email: user?.email,
    role: user?.role,
  };

  const token = jwt.sign(jwtPayload, config.jwt_access_secret as string, {
    expiresIn: config.jwt_access_secret_expire_in,
  });

  const userData = await User.findOne({ email: payload?.email });

  return {
    token,
    userData,
  };
};

const getUserById = async (id: string) => {
  const result = await User.findById(id)
    .select('-password')
    .populate('follower following');

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'User Not found!');
  }
  return result;
};

const updateUser = async (id: string, payload: TUser) => {
  const user = await User.findById(id).select('-password');

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User Not found!');
  }

  if (payload.password) {
    payload.password = await bcrypt.hash(
      payload.password,
      Number(config.bcrypt_salt_rounds),
    );
  }

  const result = await User.findByIdAndUpdate(
    id,
    {
      name: payload.name,
      password: payload.password,
    },
    { new: true },
  );

  return result;
};

const forgetPassword = async (userId: string) => {
  //checking if the user is exists
  const user = await User.findOne({ email: userId });
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User is not found!');
  }

  // create token and send to the user
  const jwtPayload = {
    _id: user?._id,
    name: user?.name,
    email: user?.email,
    role: user?.role,
  };

  const resetToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    '10m',
  );

  const resetUILink = `${config.reset_password_ui_link}?id=${user?._id}&token=${resetToken}`;
  await sendEmail(user?.email, resetUILink);
};

const resetPassword = async (
  payload: { id: string; newPassword: string },
  token: string,
) => {
  //checking if the user is exists
  const user = await User.findById(payload.id);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User is not found!');
  }

  // check if the token is valid and id is same of user
  const decoded = verifyToken(token, config.jwt_access_secret as string);

  const { _id, role } = decoded;
  if (payload?.id !== _id) {
    throw new AppError(httpStatus.FORBIDDEN, 'You are forbidden!');
  }

  // hash new password
  const newHashedPassword = await bcrypt.hash(
    payload?.newPassword,
    Number(config.bcrypt_salt_rounds),
  );

  await User.findOneAndUpdate(
    {
      _id,
      role: role,
    },
    {
      password: newHashedPassword,
    },
  );
};

const changePassword = async (
  user: TUser,
  payload: { oldPassword: string; newPassword: string },
) => {
  const userData = await User.isUserExistsByEmail(user?.email);

  if (!userData) {
    throw new AppError(httpStatus.NOT_FOUND, 'No User Found');
  }

  const isCorrectPassword: boolean = await bcrypt.compare(
    payload.oldPassword,
    userData.password,
  );

  if (!isCorrectPassword) {
    throw new Error('Login credential is incorrect!');
  }

  const hashedPassword = await bcrypt.hash(payload.newPassword, 12);

  await User.findByIdAndUpdate(
    user?._id,
    {
      password: hashedPassword,
    },
    { new: true },
  );

  return {
    message: 'Password changed successfully!',
  };
};

const contactMe = async (payload: {
  name: string;
  email: string;
  message: string;
}) => {
  if (!payload.name || !payload.email || !payload.message) {
    return new AppError(httpStatus.BAD_REQUEST, 'All fields are required');
  }

  try {
    // Create transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: config.email, // Your Gmail email
        pass: config.app_pass, // App password (not your Gmail password)
      },
    });

    // Email content
    const mailOptions = {
      from: payload.email,
      to: config.email, // Your Gmail where you want to receive emails
      subject: `New Contact Form Submission from ${payload.name}`,
      text: `Name: ${payload.name}\nEmail: ${payload.email}\nMessage: ${payload.message}`,
    };

    // Send email
    await transporter.sendMail(mailOptions);
    // res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Email error:', error);
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to send email');
  }
};

export const userServices = {
  createUser,
  loginUser,
  forgetPassword,
  resetPassword,
  updateUser,
  getUserById,
  changePassword,
  contactMe,
};
