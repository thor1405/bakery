"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  ShoppingCart,
  MonitorSmartphone,
  Package,
  Layers,
  Box,
  Users,
  Calendar,
  Cake,
  Truck,
  ChefHat,
  UserCircle,
  Banknote,
  LineChart,
  Megaphone,
  Star,
  Bell,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { group: "Overview", items: [{ name: "Dashboard", href: "/admin", icon: LayoutDashboard }] },
  {
    group: "Operations",
    items: [
      { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
      { name: "Delivery", href: "/admin/delivery", icon: Truck },
    ],
  },
  {
    group: "Inventory & Products",
    items: [
      { name: "Products", href: "/admin/products", icon: Package },
      { name: "Categories", href: "/admin/categories", icon: Layers },
      { name: "Inventory", href: "/admin/inventory", icon: Box },
    ],
  },
  {
    group: "Customers",
    items: [
      { name: "Customers", href: "/admin/customers", icon: Users },
    ],
  },
  {
    group: "System",
    items: [
      { name: "Notifications", href: "/admin/notifications", icon: Bell },
      { name: "Settings", href: "/admin/settings", icon: Settings },
    ],
  },
];

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <motion.aside
      initial={{ width: 260 }}
      animate={{ width: isCollapsed ? 80 : 260 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="h-screen sticky top-0 bg-white dark:bg-[#1a1a1a] border-r border-gray-200 dark:border-gray-800 flex flex-col z-40 overflow-hidden shadow-sm"
    >
      <div className="p-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-800 h-16">
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="font-serif font-bold text-xl text-[var(--primary)] truncate"
          >
            Cream Caramel
          </motion.div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition-colors mx-auto"
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700 p-3 space-y-6">
        {NAV_ITEMS.map((group) => (
          <div key={group.group}>
            {!isCollapsed && (
              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-3 truncate">
                {group.group}
              </h4>
            )}
            <ul className="space-y-1">
              {group.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center space-x-3 px-3 py-2.5 rounded-md transition-all duration-200 group relative",
                        isActive
                          ? "bg-[var(--primary)] text-white shadow-md shadow-amber-900/20"
                          : "text-gray-600 dark:text-gray-400 hover:bg-amber-50 dark:hover:bg-gray-800 hover:text-[var(--primary)]"
                      )}
                      title={isCollapsed ? item.name : undefined}
                    >
                      <item.icon
                        size={20}
                        strokeWidth={isActive ? 2.5 : 2}
                        className={cn("flex-shrink-0", isCollapsed && "mx-auto")}
                      />
                      {!isCollapsed && (
                        <span className="text-sm font-medium truncate">{item.name}</span>
                      )}
                      
                      {/* Tooltip for collapsed state */}
                      {isCollapsed && (
                        <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none z-50 whitespace-nowrap transition-opacity">
                          {item.name}
                        </div>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </motion.aside>
  );
}
