import { Router } from 'express';
import { userRoutes } from '../modules/User/user.route';
import { projectRoutes } from '../modules/Project/project.route';

const router = Router();
const modulesRoutes = [
  {
    path: '/auth',
    route: userRoutes,
  },
  {
    path: '/project',
    route: projectRoutes,
  },
];

modulesRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
