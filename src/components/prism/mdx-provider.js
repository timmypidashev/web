"use client"

// mdx-provider.js
import { MDXProvider } from '@mdx-js/react';
import Prism from './prism-setup';
import { useEffect } from 'react';

const CodeBlock = ({ children, className }) => {
  const language = className?.replace(/language-/, '') || '';

  useEffect(() => {
    Prism.highlightAll();
  }, []);

  return (
    <pre className={className}>
      <code className={className}>{children}</code>
    </pre>
  );
};

const components = {
  pre: CodeBlock,
  code: CodeBlock,
};

const MdxProvider = ({ children }) => {
  return <MDXProvider components={components}>{children}</MDXProvider>;
};

export default MdxProvider;

