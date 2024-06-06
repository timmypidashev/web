import Link from "next/link";
import { getAllBlogSlugs, getBlogBySlug } from "@/lib/mdx";

export default async function BlogsPage() {
  const slugs = await getAllBlogSlugs();
  const blogs = await Promise.all(slugs.map(({ slug }) => getBlogBySlug(slug)));

  return (
    <main>
      {blogs.map((blog) => (
        <article key={blog.slug} className="grid grid-cols-4 text-3xl">
          <h1>{blog.frontmatter.title}</h1>
          <p>{blog.frontmatter.author}</p>
          <p>{blog.frontmatter.publishDate}</p>
          <Link href={`/blog/${blog.slug}`}>Read More</Link>
        </article>
      ))}
    </main>
  );
}

