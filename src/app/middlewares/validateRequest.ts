import { AnyZodObject } from 'zod';
import catchAsync from '../utils/catchAsync';

const validateRequest = (schema: AnyZodObject) => {
  return catchAsync(async (req, res, next) => {
    console.log(req.body);
    await schema.parse({
      body: req.body,
    });

    next();
  });
};

export default validateRequest;
