import { z } from 'zod';

const createRecipeValidationSchema = z.object({
  body: z.object({
    title: z.string({ required_error: 'Title is required!' }),
    description: z.string({ required_error: 'Description is required!' }),
    image: z.string({ required_error: 'Image is required!' }),
    tag: z.string({ required_error: 'Tag is required!' }),
    clientLiveLink: z.string().optional(),
    serverLiveLink: z.string().optional(),
    gitClientLink: z.string().optional(),
    gitServerLink: z.string().optional(),
  }),
});

const updateRecipeValidationSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    image: z.string().optional(),
    tag: z.string().optional(),
    clientLiveLink: z.string().optional(),
    serverLiveLink: z.string().optional(),
    gitClientLink: z.string().optional(),
    gitServerLink: z.string().optional(),
  }),
});

export const projectValidations = {
  createRecipeValidationSchema,
  updateRecipeValidationSchema,
};
