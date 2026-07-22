import { siteUi } from '@/lib/siteUi';

export function PageLoader() {
  return (
    <div className={siteUi.page}>
      <div className="animate-pulse space-y-4 py-12">
        <div className="h-8 w-2/3 rounded-lg bg-zinc-200" />
        <div className="h-4 w-full rounded bg-zinc-100" />
        <div className="h-4 w-5/6 rounded bg-zinc-100" />
        <div className="h-64 w-full rounded-2xl bg-zinc-100 mt-8" />
      </div>
    </div>
  );
}
