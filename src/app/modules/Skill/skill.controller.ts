import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { skillServices } from './skill.service';
import { JwtPayload } from 'jsonwebtoken';
import { TUser } from '../User/user.interface';

const createSkill = catchAsync(async (req, res) => {
  const result = await skillServices.createSkill(
    req.file,
    req.body,
    req.user as JwtPayload & TUser,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Skill created successfully',
    data: result,
  });
});

const getAllSkill = catchAsync(async (req, res) => {
  const result = await skillServices.getAllSkill(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Skills retrieved successfully',
    data: result,
  });
});

const getSingleSkill = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await skillServices.getSingleSkill(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Skill retrieved successfully',
    data: result,
  });
});

const updateSkill = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await skillServices.updateSkill(id as string, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Skill updated successfully',
    data: result,
  });
});

const deleteSkill = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await skillServices.deleteSkill(id as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Skill deleted successfully',
    data: result,
  });
});

export const skillControllers = {
  createSkill,
  getAllSkill,
  getSingleSkill,
  updateSkill,
  deleteSkill,
};
