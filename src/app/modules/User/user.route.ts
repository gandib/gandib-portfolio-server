import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { userValidations } from './user.validation';
import { userControllers } from './user.controller';
import auth from '../../middlewares/auth';
// import auth from '../../middlewares/auth';

const router = express.Router();

router.get('/:id', userControllers.getUserById);

// router.post(
//   '/register',
//   validateRequest(userValidations.createUserValidationSchema),
//   userControllers.createUser,
// );

router.post(
  '/login',
  validateRequest(userValidations.loginValidationSchema),
  userControllers.loginUser,
);

router.post(
  '/forget-password',
  validateRequest(userValidations.forgetPasswordValidationSchema),
  userControllers.forgetPassword,
);

router.patch(
  '/update-user',
  validateRequest(userValidations.updateUserValidationSchema),
  userControllers.updateUser,
);

router.post(
  '/reset-password',
  validateRequest(userValidations.resetPasswordValidationSchema),
  userControllers.resetPassword,
);

router.post('/contact-me', userControllers.contactMe);

router.post('/change-password', auth('ADMIN'), userControllers.changePassword);

export const userRoutes = router;
