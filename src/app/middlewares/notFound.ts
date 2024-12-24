/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';

const notFound = (
  req: Request,
  res: Response,
  next: NextFunction, // Always include NextFunction for middleware
) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    statusCode: httpStatus.NOT_FOUND,
    message: 'Not Found',
  });
};

export default notFound;
