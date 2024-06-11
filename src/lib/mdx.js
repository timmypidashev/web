import fs from "fs";
import path from "path";
import { compileMDX } from "next-mdx-remote/rsc";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";

const contentDir = path.join(process.cwd(), "app/blog/posts");

export async function getBlogBySlug(slug) {
  const filePath = path.join(contentDir, `${slug}.mdx`);
  const source = fs.readFileSync(filePath, "utf8");
  const { frontmatter, content } = await compileMDX({
    source,
    options: {
      parseFrontmatter: true,
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [rehypeHighlight],
      },
    },
  });
  return { frontmatter, content, slug };
}

export async function getAllBlogSlugs() {
  const files = fs.readdirSync(contentDir);
  return files.map(file => ({
    slug: path.parse(file).name,
  }));
}
