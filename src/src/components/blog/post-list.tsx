import React from "react";

type BlogPost = {
  slug: string;
  data: {
    title: string;
    author: string;
    date: string;
    tags: string[];
    description: string;
  };
};

interface BlogPostListProps {
  posts: BlogPost[];
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const BlogPostList = ({ posts }: BlogPostListProps) => {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <ul className="space-y-8">
        {posts.map((post) => (
          <li key={post.slug} className="border-b border-gray-200 pb-8 last:border-b-0">
            <a 
              href={`/blog/${post.slug}`}
              className="text-xl font-semibold hover:text-blue-600 transition-colors duration-200"
            >
              {post.data.title}
            </a>
            <div className="mt-2 text-sm text-gray-600">
              <span>{post.data.author}</span>
              <span className="mx-2">•</span>
              <time dateTime={post.data.date}>
                {formatDate(post.data.date)}
              </time>
            </div>
            <p className="mt-3 text-gray-700">
              {post.data.description}
            </p>
            <div className="mt-3 space-x-2">
              {post.data.tags.map((tag) => (
                <span 
                  key={tag} 
                  className="text-sm text-gray-600"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
