import Link from "next/link";
import { getAllBlogSlugs, getBlogBySlug } from "@/lib/mdx";

export default async function BlogsPage() {
  const slugs = await getAllBlogSlugs();
  const blogs = await Promise.all(slugs.map(({ slug }) => getBlogBySlug(slug)));

  return (
    <section className="py-9">
      {blogs.map((blog) => (
        <article key={blog.slug} className="flex flex-col py-3">
          <Link href={`/blog/${blog.slug}`}>
            <div className="flex flex-col items-center pb-3 mb-3">
              <h1 className="text-2xl font-bold mb-1">{blog.frontmatter.title}</h1>
              <span className="text-light-yellow-1 dark:text-dark-yellow-1">{blog.frontmatter.description}</span>
              <div className="text-lg text-gray-500">
                {blog.frontmatter.tags && blog.frontmatter.tags.length > 0 && (
                  <>
                    <span className="mr-2 text-light-blue-1 dark:text-dark-blue-1">{blog.frontmatter.date}</span>
                    {blog.frontmatter.tags.map((tag, index) => (
                      <span key={index} className="mr-2 text-light-orange-1 dark:text-dark-orange-1">#{tag}</span>
                    ))}
                  </>
                )}
              </div>
            </div>
          </Link>
        </article>
      ))}
    </section>
  );
}
