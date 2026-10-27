"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "./ThemeProvider";
import { StudentApi } from "@/lib/studentApi";
import {
  Search,
  Bell,
  Sun,
  Moon,
  ChevronDown,
  Menu,
  User,
  LogOut,
  CheckCircle2,
  Clock,
  Sparkles,
} from "lucide-react";

interface HeaderProps {
  onMobileMenuToggle?: () => void;
}

export default function Header({ onMobileMenuToggle }: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const notificationsRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("userData");
      localStorage.removeItem("userRole");
      sessionStorage.clear();
    }
    setProfileDropdownOpen(false);
    router.push("/login");
  };

  // Real notification data from API
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);

  // Student Profile Info
  const [userName, setUserName] = useState("Vijay");
  const [userEmail, setUserEmail] = useState("vijay@nim.academy");
  const [userInitials, setUserInitials] = useState("VJ");

  // Dynamic search placeholder based on current route
  const searchPlaceholder = pathname?.startsWith("/assignments")
    ? "Search assignments..."
    : pathname?.startsWith("/classes")
    ? "Search classes & schedule..."
    : pathname?.startsWith("/curriculum")
    ? "Search modules & topics..."
    : "Search classes, topics, or anything...";

  // Load User Data & Fetch Real Notifications
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const storedUser = localStorage.getItem("userData");
        if (storedUser) {
          const parsed = JSON.parse(storedUser);
          const name = parsed.name || parsed.student_name || "Vijay";
          setUserName(name);
          setUserEmail(parsed.email || `${name.toLowerCase().replace(/\s+/g, ".")}@nim.academy`);
          const initials = name
            .split(" ")
            .map((n: string) => n[0])
            .join("")
            .substring(0, 2)
            .toUpperCase();
          setUserInitials(initials || "VJ");
        }
      } catch (e) {
        console.error("Error reading stored user:", e);
      }
    }

    // Fetch real notifications from Django API
    const fetchNotifications = () => {
      StudentApi.getNotifications()
        .then((res: any) => {
          if (res.status === "success" || res.success) {
            const rawList = res.notifications || [];
            const list = rawList.filter((n: any) => {
              const rawCat = (n.category || '').toLowerCase();
              const rawTitle = (n.title || '').toLowerCase();
              const rawMsg = (n.message || '').toLowerCase();
              const rawGroup = (n.target_group || '').toLowerCase();

              if (rawGroup === 'admin') return false;
              if (rawCat.includes('enroll') || rawTitle.includes('enroll') || rawMsg.includes('registered and paid')) return false;
              if (rawCat.includes('payment') || rawTitle.includes('fee payment') || rawTitle.includes('payment successful') || rawTitle.includes('payment recorded')) return false;
              return true;
            });
            setNotifications(list);
            const unread = list.filter((n: any) => !n.is_read).length;
            setUnreadCount(unread);
          }
        })
        .catch((err: any) => {
          console.warn("Failed to fetch notifications:", err);
        });
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 4000);
    window.addEventListener("notificationsUpdated", fetchNotifications);
    window.addEventListener("focus", fetchNotifications);

    return () => {
      clearInterval(interval);
      window.removeEventListener("notificationsUpdated", fetchNotifications);
      window.removeEventListener("focus", fetchNotifications);
    };
  }, []);

  // Close dropdowns on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target as Node)
      ) {
        setNotificationsOpen(false);
      }
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setProfileDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Mark all notifications as read
  const handleMarkAllAsRead = async () => {
    setUnreadCount(0);
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    await StudentApi.markAllNotificationsRead();
    window.dispatchEvent(new Event("notificationsUpdated"));
  };

  return (
    <header
      className={`sticky top-0 z-30 h-14 sm:h-16 w-full flex items-center justify-between px-2 sm:px-6 lg:px-8 transition-colors duration-200 ${
        isDark
          ? "bg-[#070d1d]/90 backdrop-blur-md border-b border-[#142142]"
          : "bg-white/95 backdrop-blur-md border-b border-[#dce8f8]"
      }`}
    >
      {/* Left: Mobile Menu Button, Brand on Mobile & Search Input */}
      <div className="flex items-center gap-1.5 sm:gap-3 flex-1 min-w-0 max-w-xl pr-1 sm:pr-2">
        {/* Mobile Hamburger Button */}
        <button
          onClick={onMobileMenuToggle}
          className={`lg:hidden p-1.5 sm:p-2 rounded-xl border transition-all shrink-0 active:scale-95 ${
            isDark
              ? "border-[#1e2f5b] text-slate-300 hover:bg-[#121e3f] bg-[#0b1429]"
              : "border-[#dce8f8] text-slate-700 hover:bg-slate-100 bg-[#f8fafc]"
          }`}
          aria-label="Open Navigation Menu"
        >
          <Menu className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* Mobile Brand Logo Icon */}
        <Link href="/dashboard" className="lg:hidden flex items-center gap-1 shrink-0">
          <div
            className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center p-0.5 border shadow-sm select-none ${
              isDark
                ? "bg-[#0c1836] border-[#1d2d58]"
                : "bg-white border-[#dce8f8]"
            }`}
          >
            <Image
              src="/nimlogo.webp"
              alt="NIM Academy Logo"
              width={26}
              height={32}
              className="w-full h-full object-contain"
              priority
            />
          </div>
        </Link>

        {/* Search Bar - Fluid Responsive */}
        <div className="relative flex-1 min-w-0 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-2.5 sm:pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
          <input
            type="text"
            placeholder={searchPlaceholder}
            className={`w-full h-8 sm:h-10 pl-7 sm:pl-10 pr-2.5 sm:pr-4 rounded-xl text-[11px] sm:text-sm outline-none transition-all truncate ${
              isDark
                ? "bg-[#0e172e] border border-[#1b2b52] text-slate-200 placeholder-slate-500 focus:border-[#0062eb] focus:ring-2 focus:ring-[#0062eb]/20"
                : "bg-[#f4f8fe] border border-[#d2e2f6] text-[#0a1b39] placeholder-slate-400 focus:border-[#0062eb] focus:bg-white focus:ring-2 focus:ring-[#0062eb]/15"
            }`}
          />
        </div>
      </div>

      {/* Right Controls: Theme Toggle + Notifications + User Profile */}
      <div className="flex items-center gap-1 sm:gap-2.5 shrink-0">
        {/* Dark / Light Mode Switch */}
        <button
          onClick={toggleTheme}
          title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
          aria-label="Toggle Theme"
          className={`p-1.5 sm:p-2.5 rounded-xl border transition-all cursor-pointer active:scale-95 shrink-0 ${
            isDark
              ? "bg-[#0e172e] border-[#1b2b52] text-sky-400 hover:bg-[#172447] hover:border-sky-400/40"
              : "bg-[#f0f5fc] border-[#d2e2f6] text-amber-500 hover:bg-amber-50 hover:border-amber-200"
          }`}
        >
          {isDark ? (
            <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-sky-400 fill-sky-400" />
          ) : (
            <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500 fill-amber-500" />
          )}
        </button>

        {/* Notifications Bell with Dynamic Unread Badge */}
        <div className="relative" ref={notificationsRef}>
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className={`relative p-1.5 sm:p-2.5 rounded-xl border transition-all cursor-pointer active:scale-95 shrink-0 ${
              isDark
                ? "bg-[#0e172e] border-[#1b2b52] text-slate-300 hover:bg-[#172447] hover:border-blue-500/40"
                : "bg-[#f0f5fc] border-[#d2e2f6] text-slate-700 hover:bg-blue-50 hover:text-[#0062eb]"
            }`}
            aria-label="Notifications"
          >
            <Bell className="w-3.5 h-3.5 sm:w-4 sm:h-4" />

            {/* Notification Badge - Real Count from API */}
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-rose-500 text-white text-[10px] font-extrabold flex items-center justify-center shadow-md shadow-rose-500/30 ring-2 ring-white dark:ring-[#070d1d] animate-in zoom-in-75 duration-150 leading-none">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </button>

          {/* Quick Notifications Dropdown */}
          {notificationsOpen && (
            <>
              {/* Mobile Backdrop to catch outside clicks and provide visual focus */}
              <div
                className="fixed inset-0 z-40 bg-black/40 sm:hidden"
                onClick={() => setNotificationsOpen(false)}
              />

              <div
                className={`fixed inset-x-3 top-[62px] sm:inset-x-auto sm:right-0 sm:top-full sm:mt-2 sm:absolute sm:w-88 sm:max-w-sm rounded-2xl shadow-2xl p-4 border z-50 animate-in fade-in-50 zoom-in-95 ${
                  isDark
                    ? "bg-[#0c142b] border-[#1e2f5b] text-slate-200"
                    : "bg-white border-[#d2e2f6] text-[#0a1b39]"
                }`}
              >
              {/* Dropdown Header */}
              <div
                className={`flex items-center justify-between pb-3 border-b ${
                  isDark ? "border-slate-700/50" : "border-[#e2edf8]"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm">Notifications</span>
                  {unreadCount > 0 && (
                    <span className="px-1.5 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-500/15 text-rose-500 border border-rose-500/20">
                      {unreadCount} new
                    </span>
                  )}
                </div>

                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllAsRead}
                    className="text-[11px] text-[#0062eb] dark:text-blue-400 font-bold hover:underline cursor-pointer"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              {/* Notifications List */}
              <div className="py-2 space-y-2 max-h-72 overflow-y-auto pr-1">
                {notifications.length > 0 ? (
                  notifications.slice(0, 5).map((n: any, idx: number) => {
                    const isUnread = !n.is_read;
                    const actionHref = n.action_url || "/notifications";
                    return (
                      <Link
                        key={n.id || idx}
                        href={actionHref}
                        onClick={() => setNotificationsOpen(false)}
                        className={`block p-2.5 rounded-xl transition border text-left cursor-pointer ${
                          isUnread
                            ? isDark
                              ? "bg-blue-500/10 border-blue-500/20 hover:bg-blue-500/15"
                              : "bg-blue-50/70 border-blue-200/80 hover:bg-blue-100/50"
                            : isDark
                              ? "bg-slate-900/40 border-transparent hover:bg-slate-800/40"
                              : "bg-slate-50/70 border-transparent hover:bg-slate-100/60"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="font-bold text-xs leading-snug">
                            {n.title}
                          </p>
                          {isUnread && (
                            <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0 mt-1" />
                          )}
                        </div>

                        <p
                          className={`text-[11px] line-clamp-2 mt-1 ${
                            isDark ? "text-slate-300" : "text-slate-600 font-medium"
                          }`}
                        >
                          {n.message}
                        </p>

                        <div className="flex items-center justify-between gap-2 mt-2 pt-1 border-t border-slate-200/40 dark:border-slate-800/50 text-[10px] text-slate-400">
                          <span className={`px-1.5 py-0.5 rounded font-semibold uppercase tracking-wider text-[9px] ${
                            (n.category === 'Fees' || n.reminder_type)
                              ? (isDark ? "bg-rose-500/20 text-rose-400" : "bg-rose-100 text-rose-700")
                              : "bg-slate-200/50 dark:bg-slate-800"
                          }`}>
                            {n.category || "General"}
                          </span>
                          <span>{n.timestamp || "Just now"}</span>
                        </div>
                      </Link>
                    );
                  })
                ) : (
                  <div className="py-6 text-center text-slate-400">
                    <Bell className="w-6 h-6 mx-auto mb-1.5 opacity-40" />
                    <p className="text-xs font-semibold">No notifications</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      You are all caught up!
                    </p>
                  </div>
                )}
              </div>

              {/* View All Footer */}
              <div
                className={`pt-2.5 border-t text-center ${
                  isDark ? "border-slate-700/50" : "border-[#e2edf8]"
                }`}
              >
                <Link
                  href="/notifications"
                  onClick={() => setNotificationsOpen(false)}
                  className="text-xs font-bold text-[#0062eb] dark:text-blue-400 hover:underline inline-flex items-center gap-1"
                >
                  <span>View All Notifications</span>
                  <span>&rarr;</span>
                </Link>
              </div>
            </div>
          </>
          )}
        </div>

        {/* User Profile Card */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className={`flex items-center gap-1.5 sm:gap-2 p-1 sm:p-1.5 sm:pr-2.5 rounded-full border transition-all cursor-pointer active:scale-95 shrink-0 ${
              isDark
                ? "bg-[#0e172e] border-[#1b2b52] hover:bg-[#162347]"
                : "bg-[#f0f5fc] border-[#d2e2f6] hover:bg-blue-50/70"
            }`}
          >
            {/* Avatar Circle */}
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full overflow-hidden border border-blue-400/50 shadow-sm shrink-0">
              <div className="w-full h-full bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white text-[11px] sm:text-xs font-black">
                {userInitials}
              </div>
            </div>

            {/* Name & Role (hidden on narrow screens, shown from sm: 640px) */}
            <div className="hidden sm:flex flex-col text-left">
              <span
                className={`text-xs font-black leading-tight max-w-[90px] truncate ${
                  isDark ? "text-white" : "text-[#0a1b39]"
                }`}
              >
                {userName}
              </span>
              <span
                className={`text-[10px] font-semibold ${
                  isDark ? "text-slate-400" : "text-slate-500"
                }`}
              >
                Student
              </span>
            </div>

            <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-0.5 hidden sm:block" />
          </button>

          {/* Profile Dropdown Menu */}
          {profileDropdownOpen && (
            <>
              {/* Mobile Backdrop */}
              <div
                className="fixed inset-0 z-40 bg-black/40 sm:hidden"
                onClick={() => setProfileDropdownOpen(false)}
              />

              <div
                className={`absolute right-0 top-full mt-2 w-56 max-w-[calc(100vw-24px)] rounded-2xl shadow-2xl p-2 border z-50 animate-in fade-in-50 zoom-in-95 ${
                  isDark
                    ? "bg-[#0c142b] border-[#1e2f5b] text-slate-200"
                    : "bg-white border-[#d2e2f6] text-[#0a1b39]"
                }`}
              >
                <div
                  className={`p-2.5 border-b ${
                    isDark ? "border-slate-700/50" : "border-[#e2edf8]"
                  }`}
                >
                  <p className="text-xs font-black">{userName}</p>
                  <p
                    className={`text-[11px] font-medium truncate ${
                      isDark ? "text-slate-400" : "text-slate-500"
                    }`}
                  >
                    {userEmail}
                  </p>
                </div>

                <div className="py-1">
                  <Link
                    href="/profile"
                    onClick={() => setProfileDropdownOpen(false)}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition ${
                      isDark
                        ? "hover:bg-blue-600 hover:text-white text-slate-200"
                        : "hover:bg-blue-50 hover:text-[#0062eb] text-slate-700"
                    }`}
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>My Profile</span>
                  </Link>
                </div>

                <div
                  className={`pt-1 border-t ${
                    isDark ? "border-slate-700/50" : "border-[#e2edf8]"
                  }`}
                >
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-red-500 hover:bg-red-500/10 transition cursor-pointer text-left"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
