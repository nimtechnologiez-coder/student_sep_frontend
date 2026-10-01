"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useTheme } from "./ThemeProvider";
import {
  LayoutDashboard,
  BookOpen,
  Video,
  FileText,
  CalendarCheck,
  Award,
  Target,
  Bell,
  User,
  LogOut,
  X,
  GraduationCap,
  ArrowRight,
  ClipboardCheck,
  CreditCard,
} from "lucide-react";

interface SidebarProps {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export default function Sidebar({ mobileOpen = false, onMobileClose }: SidebarProps) {
  const pathname = usePathname();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [userName, setUserName] = React.useState("Student");
  const [userBatch, setUserBatch] = React.useState("Enrolled Batch");
  const [userInitials, setUserInitials] = React.useState("ST");

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const storedUser = localStorage.getItem("userData");
        if (storedUser) {
          const parsed = JSON.parse(storedUser);
          const name = parsed.name || parsed.student_name || "Student";
          setUserName(name);
          setUserBatch(parsed.batch || parsed.course || "Enrolled Batch");
          const initials = name.split(" ").map((n: string) => n[0]).join("").substring(0, 2).toUpperCase();
          setUserInitials(initials || "ST");
        }
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  // Navigation structure with dedicated routes & proper alignment
  const navGroups = [
    {
      label: null,
      items: [
        { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      ],
    },
    {
      label: "My Learning",
      items: [
        { name: "Curriculum", href: "/curriculum", icon: BookOpen },
        { name: "Classes", href: "/classes", icon: CalendarCheck },
        { name: "Assignments", href: "/assignments", icon: FileText },
        
      ],
    },
    {
      label: "Progress",
      items: [
        { name: "Attendance", href: "/attendance", icon: CalendarCheck },
    
      ],
    },
    {
      label: "Career",
      items: [
        { name: "Career Profile", href: "/career", icon: Target },
      ],
    },
    {
      label: "Finance & Account",
      items: [
        { name: "Fees & Payments", href: "/fees", icon: CreditCard },
        { name: "Notifications", href: "/notifications", icon: Bell },
        { name: "Profile", href: "/profile", icon: User },
      ],
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={onMobileClose}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        } ${
          isDark
            ? "bg-[#070d1d] border-r border-[#152243] text-slate-200"
            : "bg-white border-r border-[#dce8f8] text-slate-700 shadow-sm"
        }`}
      >
        {/* Top: Brand Header */}
        <div className="p-4 pb-3 border-b border-transparent">
          <div className="flex items-center justify-between">
            <Link href="/dashboard" className="flex items-center gap-3 group">
              {/* Vibrant Cyan-Blue Gradient 'N' Logo */}
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#0052cc] via-[#00a3ff] to-[#38bdf8] flex items-center justify-center shadow-md shadow-cyan-500/20 text-white font-black text-lg tracking-wider select-none">
                N
              </div>
              <div>
                <h1
                  className={`text-base font-black tracking-tight leading-tight ${
                    isDark ? "text-white" : "text-[#0a1b39]"
                  }`}
                >
                  NIM AI
                </h1>
                <p
                  className={`text-[10px] font-bold tracking-wide uppercase ${
                    isDark ? "text-slate-400" : "text-slate-500"
                  }`}
                >
                  Career Academy
                </p>
              </div>
            </Link>

            {/* Mobile Close Button */}
            {onMobileClose && (
              <button
                type="button"
                onClick={onMobileClose}
                className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Middle: Clean Flat Navigation with Proper Alignment (No Dropdowns) */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-4 scrollbar-thin scrollbar-thumb-slate-800">
          {navGroups.map((group, groupIdx) => (
            <div key={groupIdx} className="space-y-1">
              {/* Category Heading */}
              {group.label && (
                <div className="px-3 pt-1 pb-1">
                  <p
                    className={`text-[10px] font-extrabold uppercase tracking-wider ${
                      isDark ? "text-slate-500" : "text-slate-500"
                    }`}
                  >
                    {group.label}
                  </p>
                </div>
              )}

              {/* Group Nav Items - Aligned Uniformly */}
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={onMobileClose}
                    className={`flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-150 ${
                      isActive
                        ? "bg-[#0062eb] text-white shadow-md shadow-blue-600/30"
                        : isDark
                        ? "text-slate-300 hover:bg-[#111e3b] hover:text-white"
                        : "text-slate-700 hover:bg-blue-50 hover:text-[#0062eb]"
                    }`}
                  >
                    <Icon
                      className={`w-4 h-4 shrink-0 transition-colors ${
                        isActive
                          ? "text-white"
                          : isDark
                          ? "text-slate-400 group-hover:text-slate-200"
                          : "text-slate-500 group-hover:text-[#0062eb]"
                      }`}
                    />
                    <span className="truncate">{item.name}</span>
                  </Link>
                );
              })}
            </div>
          ))}
        </div>

        {/* Motivational Card - Shown on non-attendance pages */}
        {pathname !== "/attendance" && (
          <div className="px-3 pb-2">
            <div
              className={`p-3 rounded-2xl border transition-all ${
                isDark
                  ? "bg-[#0b162d] border-[#1d2d54] text-white"
                  : "bg-[#0c1c3c] border-[#1d2d54] text-white shadow-md shadow-blue-900/10"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-600/25 border border-blue-400/30 flex items-center justify-center text-sky-400 shrink-0">
                  <GraduationCap className="w-4 h-4 stroke-[2.2]" />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-black text-white leading-tight">
                    Keep Learning
                  </p>
                  <p className="text-[11px] font-black text-white leading-tight">
                    Keep Growing
                  </p>
                </div>
              </div>
              <p className="text-[9.5px] text-slate-400 font-semibold tracking-wide mt-2 pl-0.5">
                Learn • Build • Succeed
              </p>
            </div>
          </div>
        )}

        {/* Bottom Section: Clean Logged-in User Profile */}
        <div
          className={`p-3 border-t transition-colors ${
            isDark ? "border-[#152243] bg-[#050a18]/70" : "border-[#dce8f8] bg-[#f8fbff]"
          }`}
        >
          <div className="flex items-center justify-between gap-2.5 p-2 rounded-xl">
            {/* User Avatar + Details */}
            <Link
              href="/profile"
              className="flex items-center gap-2.5 min-w-0 flex-1 group"
            >
              <div className="relative shrink-0">
                <div className="w-8 h-8 rounded-full overflow-hidden bg-gradient-to-tr from-blue-600 to-cyan-500 p-0.5 shadow-sm flex items-center justify-center text-white text-xs font-bold">
                  {userInitials}
                </div>
                {/* Online Status Dot */}
                <span
                  className={`absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 rounded-full ${
                    isDark ? "border-[#070d1d]" : "border-white"
                  }`}
                />
              </div>

              <div className="min-w-0 flex-1">
                <p
                  className={`text-xs font-black leading-snug truncate transition-colors ${
                    isDark
                      ? "text-slate-200 group-hover:text-sky-400"
                      : "text-[#0a1b39] group-hover:text-[#0062eb]"
                  }`}
                >
                  {userName}
                </p>
                <p
                  className={`text-[10px] font-semibold truncate ${
                    isDark ? "text-slate-400" : "text-slate-500"
                  }`}
                >
                  Student • {userBatch}
                </p>
              </div>
            </Link>

            {/* Profile Navigation Action Button */}
            <Link
              href="/profile"
              title="View Profile"
              className={`p-2 rounded-lg text-slate-400 transition-colors shrink-0 ${
                isDark
                  ? "hover:text-sky-400 hover:bg-slate-800/50"
                  : "hover:text-[#0062eb] hover:bg-blue-50"
              }`}
            >
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}
