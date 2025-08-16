import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import {
  SiJavascript,
  SiTypescript,
  SiPython,
  SiRust,
  SiGo,
  SiC,
  SiCplusplus,
  SiHtml5,
  SiCss3,
  SiPhp,
  SiRuby,
  SiSwift,
  SiKotlin,
  SiLua,
  SiJson,
  SiMarkdown,
} from 'react-icons/si';
import { RxTextAlignLeft } from 'react-icons/rx';

interface CodeBlockProps {
  children: React.ReactNode;
  className?: string;
  'data-language'?: string;
  'data-theme'?: string;
  raw?: string;
}

const getLanguageIcon = (language: string) => {
  // Normalize the language name
  const normalizedLang = language.toLowerCase().replace(/^\s+|\s+$/g, '');
  
  // Map language names to icons
  switch (normalizedLang) {
    case 'js':
    case 'javascript':
      return <SiJavascript className="text-yellow-bright" />;
    case 'ts':
    case 'typescript':
      return <SiTypescript className="text-blue-bright" />;
    case 'py':
    case 'python':
      return <SiPython className="text-blue-bright" />;
    case 'rs':
    case 'rust':
      return <SiRust className="text-orange-bright" />;
    case 'go':
    case 'golang':
      return <SiGo className="text-blue-bright" />;
    case 'c':
      return <SiC className="text-blue-bright" />;
    case 'cpp':
    case 'c++':
      return <SiCplusplus className="text-blue-bright" />;
    case 'html':
      return <SiHtml5 className="text-orange-bright" />;
    case 'css':
      return <SiCss3 className="text-blue-bright" />;
    case 'php':
      return <SiPhp className="text-purple-bright" />;
    case 'rb':
    case 'ruby':
      return <SiRuby className="text-red-bright" />;
    case 'swift':
      return <SiSwift className="text-orange-bright" />;
    case 'kt':
    case 'kotlin':
      return <SiKotlin className="text-purple-bright" />;
    case 'lua':
      return <SiLua className="text-blue-bright" />;
    case 'json':
      return <SiJson className="text-yellow-bright" />;
    case 'md':
    case 'markdown':
      return <SiMarkdown className="text-blue-bright" />;
    default:
      return <RxTextAlignLeft className="text-yellow-bright" />;
  }
};

export const CodeBlock: React.FC<CodeBlockProps> = ({ 
  children, 
  className, 
  'data-language': language = 'text',
  'data-theme': theme,
  raw
}) => {
  const [copied, setCopied] = useState(false);
  const languageIcon = getLanguageIcon(language);

  const handleCopy = () => {
    // If raw content is provided, use that, otherwise try to extract text from children
    const textToCopy = raw || (
      typeof children === 'string' 
        ? children 
        : (
            React.Children.toArray(children)
              .map(child => 
                typeof child === 'string' 
                  ? child 
                  : child && typeof child === 'object' && 'props' in child && typeof child.props.children === 'string' 
                    ? child.props.children 
                    : ''
              )
              .join('')
          )
    );

    navigator.clipboard.writeText(textToCopy)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
      });
  };

  return (
    <div className="w-full rounded-md overflow-hidden border border-foreground/20 bg-background my-4" style={{ maxWidth: '95vw' }}>
      {/* Header with Language Icon and Copy Button */}
      <div className="bg-background border-b border-foreground/20 text-foreground p-2 flex items-center justify-between">
        <div className="flex items-center">
          <span className="mr-2 text-xl">
            {languageIcon}
          </span>
          <div className="text-sm font-comic-code">
            {language || "Code"}
          </div>
        </div>
        <button 
          onClick={handleCopy}
          className="bg-background hover:bg-foreground/10 text-foreground text-xs px-2 py-1 rounded flex items-center"
        >
          {copied ? (
            <>
              <Check size={14} className="mr-1 text-green-bright" />
              <span>Copied</span>
            </>
          ) : (
            <>
              <Copy size={14} className="mr-1 text-foreground/70" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      
      {/* Code Display */}
      <div className="text-foreground overflow-x-auto">
        <pre className={className}>
          <code>{children}</code>
        </pre>
      </div>
    </div>
  );
};

export default CodeBlock;
