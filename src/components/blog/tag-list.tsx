import { useMemo } from 'react';
import { AnimateIn } from "@/components/animate-in";

interface BlogPost {
  title: string;
  data: {
    tags: string[];
  };
}

interface TagListProps {
  posts: BlogPost[];
}

const spectrumColors = [
  'text-red-bright',
  'text-orange-bright',
  'text-yellow-bright',
  'text-green-bright',
  'text-aqua-bright',
  'text-blue-bright',
  'text-purple-bright'
];

const sizeClasses = [
  'text-3xl sm:text-4xl',
  'text-2xl sm:text-3xl',
  'text-xl sm:text-2xl',
  'text-lg sm:text-xl',
  'text-base sm:text-lg',
];

const TagList = ({ posts }: TagListProps) => {
  const tagData = useMemo(() => {
    if (!Array.isArray(posts)) return [];

    const tagMap = new Map<string, number>();
    posts.forEach(post => {
      post?.data?.tags?.forEach(tag => {
        tagMap.set(tag, (tagMap.get(tag) || 0) + 1);
      });
    });

    const tags = Array.from(tagMap.entries())
      .sort((a, b) => b[1] - a[1]);
    const maxCount = tags[0]?.[1] || 1;

    return tags.map(([name, count], i) => {
      const ratio = count / maxCount;
      const sizeIndex = ratio > 0.8 ? 0 : ratio > 0.6 ? 1 : ratio > 0.4 ? 2 : ratio > 0.2 ? 3 : 4;
      return {
        name,
        count,
        color: spectrumColors[i % spectrumColors.length],
        size: sizeClasses[sizeIndex],
      };
    });
  }, [posts]);

  if (tagData.length === 0) {
    return (
      <div className="flex-1 w-full min-h-[16rem] flex items-center justify-center text-foreground opacity-60">
        No tags available
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-baseline justify-center gap-x-6 gap-y-4 sm:gap-x-8 sm:gap-y-5 px-4 py-8 max-w-4xl mx-auto">
      {tagData.map(({ name, count, color, size }, i) => (
        <AnimateIn key={name} delay={i * 50}>
          <a
            href={`/blog/tags/${encodeURIComponent(name)}`}
            className={`
              ${color} ${size}
              font-medium
              hover:opacity-70 transition-opacity duration-200
              cursor-pointer whitespace-nowrap
            `}
          >
            #{name}
            <span className="text-foreground/30 text-xs ml-1 align-super">
              {count}
            </span>
          </a>
        </AnimateIn>
      ))}
    </div>
  );
};

export default TagList;
