import { ExternalLink } from 'lucide-react';
import { siteUi } from '@/lib/siteUi';
import type { ServiceLink } from '@/data/serviceLinks';

interface ServiceLinksListProps {
  title: string;
  links: readonly ServiceLink[];
}

export function ServiceLinksList({ title, links }: ServiceLinksListProps) {
  return (
    <div className="mt-6 pt-4 border-t border-zinc-200">
      <h3 className="text-sm font-medium text-zinc-900 mb-3">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {links.map((link) => (
          <a
            key={link.id}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className={siteUi.linkOutbound}
          >
            <ExternalLink className="w-4 h-4" />
            {link.label}
          </a>
        ))}
      </div>
    </div>
  );
}
