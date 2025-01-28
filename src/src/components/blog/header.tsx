import React from "react";
import { RssIcon, TagIcon, TrendingUpIcon } from "lucide-react";

export const BlogHeader = () => {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 pt-24 sm:pt-24">
      <h1 className="text-2xl sm:text-3xl font-bold text-purple mb-3 text-center px-4 leading-relaxed">
        Latest Thoughts <br className="sm:hidden" />
        & Writings
      </h1>
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
    </div>
  );
};
