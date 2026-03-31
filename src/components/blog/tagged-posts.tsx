import { AnimateIn } from "@/components/animate-in";
import { RssIcon, TagIcon, TrendingUpIcon } from "lucide-react";

type BlogPost = {
  id: string;
  data: {
    title: string;
    author: string;
    date: string;
    tags: string[];
    description: string;
    image?: string;
    imagePosition?: string;
  };
};

interface TaggedPostsProps {
  tag: string;
  posts: BlogPost[];
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
};

const TaggedPosts = ({ tag, posts }: TaggedPostsProps) => {
  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="w-full px-4 pt-24 sm:pt-24">
        <AnimateIn>
          <h1 className="text-2xl sm:text-3xl font-bold text-purple mb-3 text-center px-4 leading-relaxed">
            #{tag}
          </h1>
        </AnimateIn>
        <AnimateIn delay={100}>
          <div className="flex flex-wrap justify-center gap-4 mb-12 text-sm sm:text-base">
            <a
              href="/rss"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-background border border-foreground/20 text-orange hover:text-orange-bright hover:border-orange/50 transition-colors duration-200"
            >
              <RssIcon className="w-4 h-4" />
              <span>RSS Feed</span>
            </a>
            <a
              href="/blog/tags"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-background border border-foreground/20 text-aqua hover:text-aqua-bright hover:border-aqua/50 transition-colors duration-200"
            >
              <TagIcon className="w-4 h-4" />
              <span>Browse Tags</span>
            </a>
            <a
              href="/blog/popular"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-background border border-foreground/20 text-blue hover:text-blue-bright hover:border-blue/50 transition-colors duration-200"
            >
              <TrendingUpIcon className="w-4 h-4" />
              <span>Most Popular</span>
            </a>
          </div>
        </AnimateIn>
      </div>

      <ul className="space-y-6 md:space-y-10">
        {posts.map((post, i) => (
          <AnimateIn key={post.id} delay={200 + i * 80}>
            <li className="group px-4 md:px-0">
              <a href={`/blog/${post.id}`} className="block">
                <article className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8 p-2 md:p-4 border-b border-foreground/20 last:border-b-0 rounded-lg group-hover:outline group-hover:outline-2 group-hover:outline-purple transition-all duration-200">
                  <div className="w-full md:w-1/3 aspect-[16/9] overflow-hidden rounded-lg bg-background flex-shrink-0">
                    <img
                      src={post.data.image || "/blog/placeholder.png"}
                      alt={post.data.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      style={{ objectPosition: post.data.imagePosition || "center center" }}
                    />
                  </div>
                  <div className="w-full md:w-2/3 flex flex-col gap-2 md:gap-3">
                    <div className="space-y-1.5 md:space-y-3">
                      <h2 className="text-lg md:text-2xl font-semibold text-yellow group-hover:text-purple transition-colors duration-200 line-clamp-2">
                        {post.data.title}
                      </h2>
                      <div className="flex flex-wrap items-center gap-2 md:gap-3 text-sm md:text-base text-foreground/80">
                        <span className="text-orange">{post.data.author}</span>
                        <span className="text-foreground/50">&bull;</span>
                        <time dateTime={post.data.date} className="text-blue">
                          {formatDate(post.data.date)}
                        </time>
                      </div>
                    </div>
                    <p className="text-foreground/90 text-sm md:text-lg leading-relaxed line-clamp-2 mt-0.5 md:mt-0">
                      {post.data.description}
                    </p>
                    <div className="flex flex-wrap gap-1.5 md:gap-3 mt-1 md:mt-2">
                      {post.data.tags.map((t) => (
                        <span
                          key={t}
                          className={`text-xs md:text-base transition-colors duration-200 ${
                            t === tag ? "text-aqua-bright" : "text-aqua hover:text-aqua-bright"
                          }`}
                          onClick={(e) => {
                            e.preventDefault();
                            window.location.href = `/blog/tags/${encodeURIComponent(t)}`;
                          }}
                        >
                          #{t}
                        </span>
                      ))}
                    </div>
                  </div>
                </article>
              </a>
            </li>
          </AnimateIn>
        ))}
      </ul>
    </div>
  );
};

export default TaggedPosts;
