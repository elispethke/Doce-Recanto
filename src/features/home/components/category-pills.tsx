"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { categories } from "@/data/categories";
import { categoryIcons } from "@/lib/category-icons";

export function CategoryPills() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {categories.map((category, index) => {
        const Icon = categoryIcons[category.icon];
        return (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.06 }}
          >
            <Link
              href={`/loja?categoria=${category.slug}`}
              className="flex items-center gap-2.5 rounded-full bg-card py-2 pr-4 pl-2 text-sm font-medium text-foreground ring-1 ring-foreground/[0.06] transition-all hover:-translate-y-0.5 hover:shadow-md hover:shadow-primary/10"
            >
              <span className="flex size-9 items-center justify-center rounded-full bg-accent text-accent-foreground">
                <Icon className="size-4.5" />
              </span>
              {category.name}
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}
