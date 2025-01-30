import React, { useMemo } from 'react';

interface BlogPost {
  title: string;
  data: {
    tags: string[];
  };
}

interface TagListProps {
  posts: BlogPost[];
}

const TagList: React.FC<TagListProps> = ({ posts }) => {
  const spectrumColors = [
    'text-red-bright',
    'text-orange-bright',
    'text-yellow-bright',
    'text-green-bright',
    'text-aqua-bright',
    'text-blue-bright',
    'text-purple-bright'
  ];

  const tagData = useMemo(() => {
    if (!Array.isArray(posts)) return [];
    
    const tagMap = new Map();
    posts.forEach(post => {
      if (post?.data?.tags && Array.isArray(post.data.tags)) {
        post.data.tags.forEach(tag => {
          if (!tagMap.has(tag)) {
            tagMap.set(tag, {
              name: tag,
              count: 1
            });
          } else {
            const data = tagMap.get(tag);
            data.count++;
          }
        });
      }
    });

    const tagArray = Array.from(tagMap.values());
    const maxCount = Math.max(...tagArray.map(t => t.count));
    
    return tagArray
      .sort((a, b) => b.count - a.count)
      .map((tag, index) => ({
        ...tag,
        color: spectrumColors[index % spectrumColors.length],
        frequency: tag.count / maxCount
      }));
  }, [posts]);

  if (tagData.length === 0) {
    return (
      <div className="flex-1 w-full min-h-[16rem] flex items-center justify-center text-foreground opacity-60">
        No tags available
      </div>
    );
  }

  return (
    <div className="flex-1 w-full bg-background p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {tagData.map(({ name, count, color, frequency }) => (
          <a
            key={name}
            href={`/blog/tags/${encodeURIComponent(name)}`}
            className={`
              group relative
              flex flex-col items-center justify-center
              min-h-[5rem]
              px-6 py-4 rounded-lg
              text-xl
              transition-all duration-300 ease-in-out
              hover:scale-105
              hover:bg-foreground/5
              ${color}
            `}
          >
            {/* Main tag display */}
            <div className="font-medium text-center">
              #{name}
            </div>
            
            {/* Post count */}
            <div className="mt-2 text-base opacity-60">
              {count} post{count !== 1 ? 's' : ''}
            </div>

            {/* Background gradient */}
            <div 
              className="absolute inset-0 -z-10 rounded-lg opacity-10"
              style={{
                background: `
                  linear-gradient(
                    45deg,
                    currentColor ${frequency * 100}%,
                    transparent
                  )
                `
              }}
            />
          </a>
        ))}
      </div>
    </div>
  );
};

export default TagList;
