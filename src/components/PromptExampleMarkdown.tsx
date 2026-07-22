import * as React from 'react';
import ReactMarkdown from 'react-markdown';
import type { Components } from 'react-markdown';

function isSafeHref(href?: string): href is string {
  if (!href) return false;
  try {
    const url = new URL(href, window.location.origin);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

const exampleComponents: Components = {
  h3: ({ children }) => (
    <h3 className="text-base font-semibold text-zinc-900 mt-5 mb-2 first:mt-0 scroll-mt-4">{children}</h3>
  ),
  p: ({ children }) => <p className="text-sm text-zinc-700 leading-relaxed mb-3 last:mb-0">{children}</p>,
  strong: ({ children }) => <strong className="font-semibold text-zinc-900">{children}</strong>,
  em: ({ children }) => <em className="italic text-zinc-600">{children}</em>,
  ul: ({ children }) => (
    <ul className="my-2 ml-4 list-disc space-y-1.5 text-sm text-zinc-700 marker:text-zinc-400 [&_ul]:mt-1 [&_ul]:mb-0">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="my-2 ml-4 list-decimal space-y-1.5 text-sm text-zinc-700 marker:text-zinc-500 [&_ol]:mt-1 [&_ol]:mb-0">
      {children}
    </ol>
  ),
  li: ({ children }) => <li className="leading-relaxed pl-0.5">{children}</li>,
  hr: () => null,
  a: ({ href, children }) =>
    isSafeHref(href) ? (
      <a href={href} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">
        {children}
      </a>
    ) : (
      <span>{children}</span>
    ),
};

export function PromptExampleMarkdown({ markdown }: { markdown: string }) {
  return (
    <div className="text-sm">
      <ReactMarkdown components={exampleComponents}>{markdown}</ReactMarkdown>
    </div>
  );
}
