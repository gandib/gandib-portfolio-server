import express, { NextFunction, Request, Response } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import auth from '../../middlewares/auth';
import { blogValidations } from './blog.validation';
import { blogControllers } from './blog.controller';
import { multerUpload } from '../../config/multer.config';

const router = express.Router();

router.get('/', blogControllers.getAllBlog);

router.get('/:id', blogControllers.getSingleBlog);

router.post(
  '/create-blog',
  multerUpload.fields([{ name: 'file' }]),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  auth('ADMIN'),
  validateRequest(blogValidations.createBlogValidationSchema),
  blogControllers.createBlog,
);

router.patch(
  '/:id',
  multerUpload.fields([{ name: 'file' }]),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  auth('ADMIN'),
  validateRequest(blogValidations.updateBlogValidationSchema),
  blogControllers.updateBlog,
);

router.delete('/:id', auth('ADMIN'), blogControllers.deleteBlog);

export const blogRoutes = router;
