"use client";

import { cn } from "@/lib/utils";
import { categories } from "@/data/categories";
import { categoryIcons } from "@/lib/category-icons";
import type { ProductCategory } from "@/types/product";

export function CategoryTabs({
  active,
  onChange,
}: {
  active: ProductCategory | "todos";
  onChange: (category: ProductCategory | "todos") => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onChange("todos")}
        className={cn(
          "rounded-full px-4 py-2 text-sm font-medium transition-colors",
          active === "todos"
            ? "bg-primary text-primary-foreground"
            : "bg-secondary/60 text-foreground hover:bg-secondary"
        )}
      >
        Todos
      </button>
      {categories
        .filter((c) => c.slug !== "promocoes")
        .map((category) => {
          const Icon = categoryIcons[category.icon];
          const isActive = active === category.slug;
          return (
            <button
              key={category.id}
              onClick={() => onChange(category.slug)}
              className={cn(
                "flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary/60 text-foreground hover:bg-secondary"
              )}
            >
              <Icon className="size-3.5" />
              {category.name}
            </button>
          );
        })}
    </div>
  );
}
