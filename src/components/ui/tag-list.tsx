import { cn } from '@/lib/cn';

interface TagListProps {
  items: readonly string[];
  label?: string;
  className?: string;
}

/** Liste de technologies, en texte discret séparé par des points médians. */
export function TagList({ items, label, className }: TagListProps) {
  if (items.length === 0) return null;
  return (
    <ul
      aria-label={label}
      className={cn('flex flex-wrap gap-x-2 gap-y-1 font-mono text-xs text-muted', className)}
    >
      {items.map((item, index) => (
        <li key={item} className="flex items-center gap-2">
          {index > 0 && (
            <span aria-hidden="true" className="text-border">
              ·
            </span>
          )}
          {item}
        </li>
      ))}
    </ul>
  );
}
