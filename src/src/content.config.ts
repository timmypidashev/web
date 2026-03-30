import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

export const collections = {
  blog: defineCollection({
    loader: glob({ pattern: "**/*.mdx", base: "./src/content/blog" }),
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
      isDraft: z.boolean().optional()
    }),
  }),
  projects: defineCollection({
    loader: glob({ pattern: "**/*.mdx", base: "./src/content/projects" }),
    schema: z.object({
      title: z.string(),
      description: z.string(),
      githubUrl: z.string().url().optional(),
      demoUrl: z.string().url().optional(),
      techStack: z.array(z.string()),
      date: z.string(),
      image: z.string().optional()
    }),
  })
};
