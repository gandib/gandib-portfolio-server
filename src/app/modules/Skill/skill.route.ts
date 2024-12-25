import express, { NextFunction, Request, Response } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import auth from '../../middlewares/auth';
import { skillValidations } from './skill.validation';
import { skillControllers } from './skill.controller';
import { multerUpload } from '../../config/multer.config';

const router = express.Router();

router.get('/', skillControllers.getAllSkill);

router.get('/:id', skillControllers.getSingleSkill);

router.post(
  '/create-skill',
  multerUpload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  auth('ADMIN'),
  validateRequest(skillValidations.createSkillValidationSchema),
  skillControllers.createSkill,
);

router.patch(
  '/:id',
  auth('ADMIN'),
  validateRequest(skillValidations.updateSkillValidationSchema),
  skillControllers.updateSkill,
);

router.delete('/:id', auth('ADMIN'), skillControllers.deleteSkill);

export const skillRoutes = router;
