import { z } from 'zod';

const createSkillValidationSchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'Name is required!' }),
    logo: z.string({ required_error: 'Logo is required!' }),
  }),
});

const updateSkillValidationSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    logo: z.string().optional(),
  }),
});

export const skillValidations = {
  createSkillValidationSchema,
  updateSkillValidationSchema,
};
