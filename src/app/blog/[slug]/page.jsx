import { getBlogBySlug, getAllBlogSlugs } from "@/lib/mdx";

export async function generateStaticParams() {
  const slugs = await getAllBlogSlugs();
  return slugs.map(({ slug }) => ({
    slug,
  }));
}

export default async function BlogPage({ params }) {
  const blog = await getBlogBySlug(params.slug);
  return (
    <article className="py-16 prose">
      <h1 className="text-light-foreground dark:text-dark-foreground">{blog.frontmatter.title}</h1>
      <p className="text-light-yellow-1 dark:text-dark-yellow-1">{blog.frontmatter.author}</p>
      <p className="text-light-blue-1 dark:text-dark-blue-1">{blog.frontmatter.date}</p>
      <div>{blog.content}</div>
    </article>
  );
}
