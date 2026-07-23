"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  icon: Icon,
  loading,
  accent = "primary",
  index = 0,
}: {
  label: string;
  value: string;
  icon: LucideIcon;
  loading?: boolean;
  accent?: "primary" | "blue" | "amber" | "emerald" | "violet";
  index?: number;
}) {
  const accentClasses: Record<string, string> = {
    primary: "bg-primary/10 text-primary",
    blue: "bg-blue-50 text-blue-600 dark:bg-blue-500/15 dark:text-blue-300",
    amber: "bg-amber-50 text-amber-600 dark:bg-amber-500/15 dark:text-amber-300",
    emerald: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300",
    violet: "bg-violet-50 text-violet-600 dark:bg-violet-500/15 dark:text-violet-300",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.03 }}
    >
      <Card className="gap-3">
        <CardContent className="flex items-center gap-3">
          <div className={cn("flex size-10 shrink-0 items-center justify-center rounded-xl", accentClasses[accent])}>
            <Icon className="size-5" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-xs text-muted-foreground">{label}</p>
            {loading ? (
              <Skeleton className="mt-1 h-6 w-16" />
            ) : (
              <p className="font-heading text-xl font-semibold text-foreground">{value}</p>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
