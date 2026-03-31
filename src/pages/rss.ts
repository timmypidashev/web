import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import type { APIContext } from "astro";

export async function GET(context: APIContext) {
  const blog = await getCollection("blog", ({ data }) => {
    return import.meta.env.DEV || data.isDraft !== true;
  });

  const sortedPosts = blog
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
  
  return rss({
    title: "Timothy Pidashev",
    description: "My experiences and technical insights into software development and the ever-evolving world of programming.",
    site: context.site!,
    items: sortedPosts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.description,
      link: `/blog/${post.id}/`,
      author: post.data.author,
      categories: post.data.tags,
      enclosure: post.data.image ? {
        url: new URL(`blog/${post.id}/thumbnail.png`, context.site).toString(),
        type: 'image/jpeg',
        length: 0
      } : undefined
    })),
  });
}
