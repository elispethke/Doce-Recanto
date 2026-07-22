"use client";

import { ArrowDownWideNarrow } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ProductQuery } from "@/services/products.service";

const options: { value: NonNullable<ProductQuery["sort"]>; label: string }[] = [
  { value: "relevancia", label: "Relevância" },
  { value: "menor-preco", label: "Menor preço" },
  { value: "maior-preco", label: "Maior preço" },
  { value: "avaliacao", label: "Melhor avaliados" },
];

export function SortSelect({
  value,
  onChange,
}: {
  value: NonNullable<ProductQuery["sort"]>;
  onChange: (value: NonNullable<ProductQuery["sort"]>) => void;
}) {
  return (
    <Select value={value} onValueChange={(v) => onChange(v as NonNullable<ProductQuery["sort"]>)}>
      <SelectTrigger className="h-10 rounded-full bg-card px-4">
        <ArrowDownWideNarrow className="size-4 text-muted-foreground" />
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
