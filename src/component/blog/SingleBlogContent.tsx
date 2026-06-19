"use client";

import { Blog } from "@/types/Blog";

interface Props {
  blog: Blog;
}

export const SingleBlogContent = ({ blog }: Props) => {
  return (
    <section className="bg-[var(--surface-ink)]">
      <div className="container-wide py-16 md:py-20">
        <article className="max-w-3xl mx-auto">
          {blog?.content ? (
            <div
              className="single-blog-prose"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />
          ) : (
            <p className="text-[var(--ink-faint)] text-center py-10">
              No content available.
            </p>
          )}
        </article>
      </div>

      <style jsx global>{`
        .single-blog-prose {
          color: var(--ink-soft);
          font-size: 17px;
          line-height: 1.8;
          font-family: var(--font-lato), sans-serif;
        }
        .single-blog-prose h1,
        .single-blog-prose h2,
        .single-blog-prose h3,
        .single-blog-prose h4 {
          color: var(--ink);
          font-family: var(--font-playfair), Georgia, serif;
          font-weight: 400;
          letter-spacing: -0.01em;
          margin-top: 2.4em;
          margin-bottom: 0.6em;
          line-height: 1.2;
        }
        .single-blog-prose h1 {
          font-size: clamp(2rem, 2.5vw + 1rem, 2.75rem);
        }
        .single-blog-prose h2 {
          font-size: clamp(1.5rem, 1.5vw + 1rem, 2rem);
        }
        .single-blog-prose h3 {
          font-size: clamp(1.25rem, 0.8vw + 1rem, 1.5rem);
        }
        .single-blog-prose h4 {
          font-size: 1.125rem;
        }
        .single-blog-prose p {
          margin-bottom: 1.4em;
        }
        .single-blog-prose a {
          color: var(--accent-text);
          text-decoration: underline;
          text-underline-offset: 4px;
          text-decoration-thickness: 1px;
          transition: color 0.2s ease;
        }
        .single-blog-prose a:hover {
          color: var(--ink);
        }
        .single-blog-prose ul,
        .single-blog-prose ol {
          padding-left: 1.5em;
          margin-bottom: 1.4em;
        }
        .single-blog-prose li {
          margin-bottom: 0.5em;
        }
        .single-blog-prose ul li::marker {
          color: var(--gold-500);
        }
        .single-blog-prose blockquote {
          border-left: 2px solid var(--gold-500);
          padding-left: 1.5em;
          margin: 2em 0;
          color: var(--ink);
          font-family: var(--font-playfair), Georgia, serif;
          font-style: italic;
          font-size: 1.25em;
          line-height: 1.5;
        }
        .single-blog-prose img {
          width: 100%;
          height: auto;
          border-radius: 0;
          margin: 2em 0;
        }
        .single-blog-prose code {
          background: var(--surface-charcoal);
          color: var(--gold-500);
          padding: 0.15em 0.4em;
          font-size: 0.92em;
          border-radius: 2px;
        }
        .single-blog-prose pre {
          background: var(--surface-obsidian);
          border: 1px solid var(--line-soft);
          padding: 1em 1.25em;
          overflow-x: auto;
          margin: 2em 0;
        }
        .single-blog-prose hr {
          border: 0;
          border-top: 1px solid var(--line-soft);
          margin: 2.5em 0;
        }
        .single-blog-prose strong {
          color: var(--ink);
          font-weight: 600;
        }
        .single-blog-prose em {
          color: var(--gold-500);
        }
      `}</style>
    </section>
  );
};
