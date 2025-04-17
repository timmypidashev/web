import { type Article, type Person, type WebSite, type WithContext } from "schema-dts";
import type { CollectionEntry } from 'astro:content';
 
export const blogWebsite: WithContext<WebSite> = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  url: `${import.meta.env.SITE}/blog/`,
  name: "Timothy Pidsashev - Blog",
  description: "Timothy Pidsashev's blog",
  inLanguage: "en_US",
};
 
export const mainWebsite: WithContext<WebSite> = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  url: import.meta.env.SITE,
  name: "Timothy Pidashev - Personal website",
  description: "Timothy Pidashev's contact page, portfolio and blog",
  inLanguage: "en_US",
};
 
export const personSchema: WithContext<Person> = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Timothy Pidashev",
  url: "https://timmypidashev.dev",
  sameAs: [
    "https://github.com/timmypidashev",
    "https://www.linkedin.com/in/timothy-pidashev-4353812b8",
  ],
  jobTitle: "Software Engineer",
  worksFor: {
    "@type": "Organization",
    name: "Fathers House Christian Center",
    url: "https://fhccenter.org",
  },
};
 
export function getArticleSchema(post: CollectionEntry<"blog">) {
  const articleStructuredData: WithContext<Article> = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.data.title,
    url: `${import.meta.env.SITE}/blog/${post.slug}/`,
    description: post.data.excerpt,
    datePublished: post.data.date.toString(),
    publisher: {
      "@type": "Person",
      name: "Timothy Pidashev",
      url: import.meta.env.SITE,
    },
    author: {
      "@type": "Person",
      name: "Timothy Pidashev",
      url: import.meta.env.SITE,
    },
  };
  return articleStructuredData;
}
