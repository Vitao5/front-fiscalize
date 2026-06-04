"use client";
import React, { useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSidebar } from "../context/SidebarContext";
import { LayoutDashboard, PieChart, Settings, User, LogOut } from "lucide-react";

type NavItem = { name: string; icon: React.ReactNode; path: string };

const navItems: NavItem[] = [
  { icon: <LayoutDashboard size={20} />, name: "Dashboard", path: "/dashboard" },
  { icon: <PieChart size={20} />, name: "Relatórios", path: "/dashboard/reports" },
  { icon: <User size={20} />, name: "Perfil", path: "/dashboard/profile" },
  { icon: <Settings size={20} />, name: "Configurações", path: "/dashboard/settings" },
  { icon: <LogOut size={20} />, name: "Sair", path: "/login" },
];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered, toggleMobileSidebar } = useSidebar();
  const pathname = usePathname();

  const isActive = useCallback((path: string) => path === pathname, [pathname]);

  useEffect(() => {
    if (isMobileOpen) toggleMobileSidebar();
  }, [pathname]);

  const showLabel = isExpanded || isHovered || isMobileOpen;

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 left-0 h-screen transition-all duration-300 ease-in-out z-50 border-r
        bg-slate-900 border-slate-700/60
        ${showLabel ? "w-[240px]" : "w-[70px]"}
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`py-6 px-4 flex ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-start"}`}>
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: "linear-gradient(135deg, #22c55e, #16a34a)" }}>
            <span className="text-white font-bold text-sm">F</span>
          </div>
          {showLabel && <span className="text-white font-bold text-lg tracking-tight">Fiscalize</span>}
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto px-3 no-scrollbar">
        <nav>
          {showLabel && (
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 px-3 mb-2">Menu</p>
          )}
          <ul className="flex flex-col gap-1">
            {navItems.map((nav) => (
              <li key={nav.name}>
                <Link
                  href={nav.path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                    isActive(nav.path)
                      ? "bg-primary-700/20 text-primary-400 border border-primary-700/30"
                      : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                  } ${!showLabel ? "justify-center" : ""}`}
                >
                  <span className="shrink-0">{nav.icon}</span>
                  {showLabel && <span className="font-medium text-sm">{nav.name}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;