import Link from "next/link";

export function SectionHeader({
  title,
  href,
}: {
  title: string;
  href?: string;
}) {
  return (
    <div className="mb-4 flex items-end justify-between">
      <h2 className="font-heading text-xl font-semibold text-foreground sm:text-2xl">{title}</h2>
      {href && (
        <Link href={href} className="text-sm font-medium text-primary hover:underline">
          Ver todos
        </Link>
      )}
    </div>
  );
}
