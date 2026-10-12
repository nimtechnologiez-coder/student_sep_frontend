"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "./ThemeProvider";
import { StudentApi } from "@/lib/studentApi";
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
  const router = useRouter();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [mounted, setMounted] = React.useState(false);
  const [userName, setUserName] = React.useState("Student");
  const [userBatch, setUserBatch] = React.useState("Enrolled Batch");
  const [userInitials, setUserInitials] = React.useState("ST");
  const [studentPlan, setStudentPlan] = React.useState<string>("");

  // Lock body scroll when mobile drawer is open
  React.useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  // Close sidebar on Escape key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && mobileOpen && onMobileClose) {
        onMobileClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileOpen, onMobileClose]);

  // Automatically close mobile sidebar on navigation
  React.useEffect(() => {
    if (mobileOpen && onMobileClose) {
      onMobileClose();
    }
  }, [pathname]);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("userData");
      localStorage.removeItem("userRole");
      sessionStorage.clear();
    }
    if (onMobileClose) {
      onMobileClose();
    }
    router.push("/login");
  };

  React.useEffect(() => {
    setMounted(true);
    let studentId = "";
    if (typeof window !== "undefined") {
      try {
        const storedUser = localStorage.getItem("userData");
        if (storedUser) {
          const parsed = JSON.parse(storedUser);
          const name = parsed.name || parsed.student_name || "Student";
          setUserName(name);
          setUserBatch(parsed.batch || parsed.course || "Enrolled Batch");
          const initials = name
            .split(" ")
            .map((n: string) => n[0])
            .join("")
            .substring(0, 2)
            .toUpperCase();
          setUserInitials(initials || "ST");
          if (parsed.plan) {
            setStudentPlan(parsed.plan);
          }
          studentId = parsed.student_id || parsed.username || "";
        }
      } catch (e) {
        console.error(e);
      }
    }

    // Dynamically fetch the student's actual plan from the backend database/API
    let isMounted = true;
    const fetchPlanFromApi = async () => {
      try {
        const res = await StudentApi.getProfile(studentId);
        if (res && isMounted) {
          const dbPlan = res.plan || res.profile?.plan || res.student?.plan;
          if (dbPlan) {
            setStudentPlan(dbPlan);
            if (typeof window !== "undefined") {
              try {
                const storedUser = localStorage.getItem("userData");
                if (storedUser) {
                  const parsed = JSON.parse(storedUser);
                  if (parsed.plan !== dbPlan) {
                    localStorage.setItem("userData", JSON.stringify({ ...parsed, plan: dbPlan }));
                  }
                }
              } catch (_) {}
            }
          }
        }
      } catch (err) {
        console.warn("Could not fetch student plan for sidebar:", err);
      }
    };

    fetchPlanFromApi();

    // Listen for storage changes or custom updates (e.g. login or profile update)
    const handlePlanUpdated = () => {
      if (typeof window !== "undefined") {
        try {
          const storedUser = localStorage.getItem("userData");
          if (storedUser) {
            const parsed = JSON.parse(storedUser);
            if (parsed.plan) {
              setStudentPlan(parsed.plan);
            }
            if (parsed.name || parsed.student_name) {
              setUserName(parsed.name || parsed.student_name);
            }
            if (parsed.batch || parsed.course) {
              setUserBatch(parsed.batch || parsed.course);
            }
          }
        } catch (_) {}
      }
      fetchPlanFromApi();
    };

    window.addEventListener("storage", handlePlanUpdated);
    window.addEventListener("nim_student_plan_updated", handlePlanUpdated);

    return () => {
      isMounted = false;
      window.removeEventListener("storage", handlePlanUpdated);
      window.removeEventListener("nim_student_plan_updated", handlePlanUpdated);
    };
  }, [pathname]);

  // Determine whether the student's selected plan includes placement
  // Only evaluate placement condition when mounted so SSR and initial client hydration match exactly
  const currentPlan = (studentPlan || "").trim().toLowerCase();
  const isPlacementPlan =
    mounted &&
    (currentPlan.includes("placement included") ||
      (currentPlan.includes("placement") && !currentPlan.includes("without")));

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
    ...(isPlacementPlan
      ? [
          {
            label: "Career",
            items: [
              { name: "Career Profile", href: "/career", icon: Target },
            ],
          },
        ]
      : []),
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
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 max-w-[85vw] flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
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
              {/* NIM Academy Brand Logo */}
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center p-1 border shadow-sm select-none transition-transform group-hover:scale-105 ${
                  isDark
                    ? "bg-[#0c1836] border-[#1d2d58] shadow-blue-950/40"
                    : "bg-white border-[#dce8f8] shadow-slate-200"
                }`}
              >
                <Image
                  src="/nimlogo.webp"
                  alt="NIM Academy Logo"
                  width={34}
                  height={42}
                  className="w-full h-full object-contain"
                  priority
                />
              </div>
              <div>
                <h1
                  className={`text-base font-black tracking-tight leading-tight ${
                    isDark ? "text-white" : "text-[#0a1b39]"
                  }`}
                >
                  NIM Academy
                </h1>
                <p
                  className={`text-[10px] font-bold tracking-wide uppercase ${
                    isDark ? "text-slate-400" : "text-slate-500"
                  }`}
                >
                  Student Portal
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
            <div key={group.label || `nav-group-${groupIdx}`} className="space-y-1">
              {/* Category Heading */}
              {group.label && (
                <div className="px-3 pt-1 pb-1">
                  <p
                    suppressHydrationWarning
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

        {/* Bottom Section: Clean Logged-in User Profile & Logout */}
        <div
          className={`p-3 border-t transition-colors shrink-0 space-y-2 ${
            isDark ? "border-[#152243] bg-[#050a18]/70" : "border-[#dce8f8] bg-[#f8fbff]"
          }`}
        >
          {/* User Profile Info */}
          <div className="flex items-center justify-between gap-2.5 p-1 rounded-xl">
            {/* User Avatar + Details */}
            <Link
              href="/profile"
              onClick={onMobileClose}
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
                  suppressHydrationWarning
                  className={`text-xs font-black leading-snug truncate transition-colors ${
                    isDark
                      ? "text-slate-200 group-hover:text-sky-400"
                      : "text-[#0a1b39] group-hover:text-[#0062eb]"
                  }`}
                >
                  {userName}
                </p>
                <p
                  suppressHydrationWarning
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
              onClick={onMobileClose}
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

          {/* Clear Logout Button */}
          <button
            type="button"
            onClick={handleLogout}
            className={`w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all duration-150 border cursor-pointer ${
              isDark
                ? "bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 border-red-500/20 hover:border-red-500/40"
                : "bg-red-50/80 hover:bg-red-100 text-red-600 hover:text-red-700 border-red-200/80 hover:border-red-300"
            }`}
          >
            <LogOut className="w-3.5 h-3.5 shrink-0" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
