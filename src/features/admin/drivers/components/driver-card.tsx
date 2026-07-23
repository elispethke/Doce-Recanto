"use client";

import { motion } from "framer-motion";
import { MoreHorizontal, Package, Pencil, Phone, Trash2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DriverStatusBadge } from "@/features/admin/shared/components/status-badge";
import type { DriverDoc } from "@/types/firebase-models";

export function DriverCard({
  driver,
  activeOrders,
  onOpen,
  onEdit,
  onDelete,
  index = 0,
}: {
  driver: DriverDoc;
  activeOrders: number;
  onOpen: () => void;
  onEdit: () => void;
  onDelete: () => void;
  index?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: index * 0.03 }}
    >
      <Card className="cursor-pointer transition-shadow hover:shadow-md" onClick={onOpen}>
        <CardContent className="flex items-start gap-3">
          <Avatar size="lg">
            <AvatarImage src={driver.photoUrl} alt={driver.name} />
            <AvatarFallback className="bg-primary/10 text-primary">
              {driver.name.slice(0, 1).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <p className="truncate text-sm font-semibold text-foreground">{driver.name}</p>
              <div onClick={(e) => e.stopPropagation()}>
                <DropdownMenu>
                  <DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" />}>
                    <MoreHorizontal className="size-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={onEdit}>
                      <Pencil className="size-4" /> Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem variant="destructive" onClick={onDelete}>
                      <Trash2 className="size-4" /> Remover
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            <div className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
              <Phone className="size-3" /> {driver.phone}
            </div>
            <div className="mt-2.5 flex items-center justify-between">
              <DriverStatusBadge status={driver.status} />
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Package className="size-3" /> {activeOrders} ativo{activeOrders === 1 ? "" : "s"}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
