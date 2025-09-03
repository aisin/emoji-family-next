import Link from "next/link";
import type { PrimaryCategory } from "@/types";
import { extractLeadingEmoji } from "@/app/ui/utils";

export default function CategoryCard({
  category,
}: {
  category: PrimaryCategory;
}) {
  const icon = extractLeadingEmoji(category.category) ?? undefined;
  return (
    <Link href={category.url} className="card p-5 block hover:ring-1 hover:ring-brand-500 transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-lg font-semibold flex items-center gap-2">
            {icon && <span className="text-2xl leading-none">{icon}</span>}
            <span>{category.title}</span>
          </div>
          <div className="text-sm text-[color:var(--muted)]">/{category.slug}</div>
        </div>
      </div>
    </Link>
  );
}

