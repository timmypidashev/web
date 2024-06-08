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
    <section className="prose mx-auto">
      <article>
        <h1>{blog.frontmatter.title}</h1>
        <p>{blog.frontmatter.author}</p>
        <p>{blog.frontmatter.date}</p>
        <div>{blog.content}</div>
      </article>
    </section>
  );
}
