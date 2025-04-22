import React, { useState } from 'react';
import { Check, Copy } from 'lucide-react';

interface CodeBlockProps {
  children: React.ReactNode;
  className?: string;
  'data-language'?: string;
  'data-theme'?: string;
  raw?: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ 
  children, 
  className, 
  'data-language': language,
  raw
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (raw) {
      navigator.clipboard.writeText(raw);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="relative group">
      {language && (
        <div className="absolute top-0 left-4 -translate-y-1/2">
          <span className="inline-block px-2 py-1 text-xs font-bold text-foreground/80 bg-[#282828] rounded">
            {language}
          </span>
        </div>
      )}
      <button
        onClick={handleCopy}
        className="absolute top-0 right-0 -translate-y-[50%] hidden group-hover:flex items-center gap-1 px-2 py-1 text-xs font-medium text-foreground/80 bg-[#282828] rounded hover:text-foreground transition-colors"
        aria-label="Copy code"
      >
        {copied ? (
          <>
            <Check size={14} />
            Copied!
          </>
        ) : (
          <>
            <Copy size={14} />
            Copy
          </>
        )}
      </button>
      <pre className={className}>
        <code>{children}</code>
      </pre>
    </div>
  );
};
