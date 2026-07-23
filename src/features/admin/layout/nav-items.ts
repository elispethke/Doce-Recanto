import {
  LayoutDashboard,
  ClipboardList,
  Truck,
  Wallet,
  CalendarDays,
  Users,
  Package,
  type LucideIcon,
} from "lucide-react";

export interface AdminNavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

// Chat não tem página própria no menu de propósito: cada pedido tem sua
// própria conversa (cliente + loja + futuramente o motorista designado), sem
// acesso cruzado entre pedidos de clientes diferentes — por isso o chat só
// existe embutido dentro do detalhe do pedido (ver OrderDetailSheet).
export const adminNavItems: AdminNavItem[] = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Pedidos", href: "/admin/pedidos", icon: ClipboardList },
  { label: "Motoristas", href: "/admin/motoristas", icon: Truck },
  { label: "Financeiro", href: "/admin/financeiro", icon: Wallet },
  { label: "Calendário", href: "/admin/calendario", icon: CalendarDays },
  { label: "Clientes", href: "/admin/clientes", icon: Users },
  { label: "Produtos", href: "/admin/produtos", icon: Package },
];
