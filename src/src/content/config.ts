import { defineCollection, z } from "astro:content";

export const collections = {
  blog: defineCollection({
    schema: z.object({
      title: z.string(),
      description: z.string(),
      author: z.string(),
      tags: z.array(z.string()),
      date: z.coerce.date().transform((date) => {
        return new Date(date.setUTCHours(12, 0, 0, 0));
      }),
      image: z.string().optional(),
      imagePosition: z.string().optional(),
    }),
  }),
  projects: defineCollection({
    schema: z.object({
      title: z.string(),
      description: z.string(),
      githubUrl: z.string().url().optional(),
      demoUrl: z.string().url().optional(),
      techStack: z.array(z.string()),
      date: z.string(),
      image: z.string().optional(),
    }),
  }),
  resources: defineCollection({
    schema: z.object({
      title: z.string(),
      description: z.string(),
      date: z.coerce.date().transform((date) => {
        return new Date(date.setUTCHours(12, 0, 0, 0));
      }),
      duration: z.string(),
      image: z.string().optional(),
      tags: z.array(z.string()),
    }),
  }),
};
