import { Router } from 'express';
import { userRoutes } from '../modules/User/user.route';
import { projectRoutes } from '../modules/Project/project.route';
import { blogRoutes } from '../modules/Blog/blog.route';
import { skillRoutes } from '../modules/Skill/skill.route';

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
  {
    path: '/blog',
    route: blogRoutes,
  },
  {
    path: '/skill',
    route: skillRoutes,
  },
];

modulesRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
