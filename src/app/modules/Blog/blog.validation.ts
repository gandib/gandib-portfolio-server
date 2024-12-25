import { z } from 'zod';

const createBlogValidationSchema = z.object({
  body: z.object({
    title: z.string({ required_error: 'Title is required!' }),
    description: z.string({ required_error: 'Description is required!' }),
    image: z.string({ required_error: 'Image is required!' }),
    tag: z.string({ required_error: 'Tag is required!' }),
  }),
});

const updateBlogValidationSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    image: z.string().optional(),
    tag: z.string().optional(),
  }),
});

export const blogValidations = {
  createBlogValidationSchema,
  updateBlogValidationSchema,
};
