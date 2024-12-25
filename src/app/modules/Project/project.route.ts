import express, { NextFunction, Request, Response } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import auth from '../../middlewares/auth';
import { projectValidations } from './project.validation';
import { projectControllers } from './project.controller';
import { multerUpload } from '../../config/multer.config';

const router = express.Router();

router.post(
  '/create-project',
  multerUpload.fields([{ name: 'file' }]),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  auth('ADMIN'),
  validateRequest(projectValidations.createRecipeValidationSchema),
  projectControllers.createProject,
);

router.get('/', projectControllers.getAllProject);

router.get('/:id', projectControllers.getSingleProject);

router.patch(
  '/:id',
  auth('ADMIN'),
  validateRequest(projectValidations.updateRecipeValidationSchema),
  projectControllers.updateProject,
);

router.delete('/:id', auth('ADMIN'), projectControllers.deleteProject);

export const projectRoutes = router;
