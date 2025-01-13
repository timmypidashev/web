import React from "react";

type BlogPost = {
  slug: string;
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

interface BlogPostListProps {
  posts: BlogPost[];
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
};

export const BlogPostList = ({ posts }: BlogPostListProps) => {
  return (
    <div className="w-full max-w-6xl mx-auto pt-24 sm:pt-24"> 
      <h1 className="text-2xl sm:text-3xl font-bold text-purple mb-12 text-center px-4 leading-relaxed">
        Latest Thoughts <br className="sm:hidden" />
        & Writings
      </h1>

      <ul className="space-y-6 md:space-y-10">
        {posts.map((post) => (
          <li key={post.slug} className="group px-4 md:px-0">
            <a 
              href={`/blog/${post.slug}`}
              className="block"
            >
              <article className="flex flex-col md:flex-row gap-4 md:gap-8 pb-6 md:pb-10 border-b border-foreground/20 last:border-b-0 p-2 md:p-4 rounded-lg group-hover:outline group-hover:outline-2 group-hover:outline-purple transition-all duration-200">
                {/* Image container with fixed aspect ratio */}
                <div className="w-full md:w-1/3 aspect-[16/9] overflow-hidden rounded-lg bg-background">
                  <img
                    src={post.data.image || "/blog/placeholder.png"}
                    alt={post.data.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    style={{ objectPosition: post.data.imagePosition || "center center" }}
                  />
                </div>
                
                {/* Content container */}
                <div className="w-full md:w-2/3 flex flex-col gap-2 md:gap-4 py-1 md:py-2">
                  {/* Title and meta info */}
                  <div className="space-y-1.5 md:space-y-3">
                    <h2 className="text-lg md:text-2xl font-semibold text-yellow group-hover:text-purple transition-colors duration-200 line-clamp-2">
                      {post.data.title}
                    </h2>
                    
                    <div className="flex flex-wrap items-center gap-2 md:gap-3 text-sm md:text-base text-foreground/80">
                      <span className="text-orange">{post.data.author}</span>
                      <span className="text-foreground/50">•</span>
                      <time dateTime={post.data.date} className="text-blue">
                        {formatDate(post.data.date)}
                      </time>
                    </div>
                  </div>
                  
                  {/* Description */}
                  <p className="text-foreground/90 text-sm md:text-lg leading-relaxed line-clamp-2 mt-0.5 md:mt-0">
                    {post.data.description}
                  </p>
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 md:gap-3 mt-1 md:mt-2">
                    {post.data.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="text-xs md:text-base text-aqua hover:text-aqua-bright transition-colors duration-200"
                        onClick={(e) => {
                          e.preventDefault();
                          window.location.href = `/blog/tag/${tag}`;
                        }}
                      >
                        #{tag}
                      </span>
                    ))}
                    {post.data.tags.length > 3 && (
                      <span className="text-xs md:text-base text-foreground/60">
                        +{post.data.tags.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              </article>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};
