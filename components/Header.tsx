"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "./ThemeProvider";
import {
  Search,
  Bell,
  Sun,
  Moon,
  ChevronDown,
  Menu,
  User,
  Settings,
  HelpCircle,
  LogOut,
} from "lucide-react";

interface HeaderProps {
  onMobileMenuToggle?: () => void;
}

export default function Header({ onMobileMenuToggle }: HeaderProps) {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const searchPlaceholder = pathname?.startsWith("/assignments")
    ? "Search for assignments, topics, or anything..."
    : pathname?.startsWith("/classes")
    ? "Search for classes, topics, or anything..."
    : "Search for classes, topics, or anything...";

  const [userName, setUserName] = useState("Student");
  const [userEmail, setUserEmail] = useState("");
  const [userInitials, setUserInitials] = useState("ST");

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const storedUser = localStorage.getItem("userData");
        if (storedUser) {
          const parsed = JSON.parse(storedUser);
          const name = parsed.name || parsed.student_name || "Student";
          setUserName(name);
          setUserEmail(parsed.email || `${name.toLowerCase().replace(/\s+/g, '.')}@nim.academy`);
          const initials = name.split(" ").map((n: string) => n[0]).join("").substring(0, 2).toUpperCase();
          setUserInitials(initials || "ST");
        }
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  return (
    <header
      className={`sticky top-0 z-30 h-16 w-full flex items-center justify-between px-4 sm:px-6 lg:px-8 transition-colors duration-200 ${
        isDark
          ? "bg-[#070d1d]/90 backdrop-blur-md border-b border-[#142142]"
          : "bg-white/95 backdrop-blur-md border-b border-[#dce8f8]"
      }`}
    >
      {/* Left: Mobile Menu Button & Search Input */}
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        {/* Mobile Hamburger Button */}
        <button
          onClick={onMobileMenuToggle}
          className={`lg:hidden p-2 rounded-xl border transition-colors ${
            isDark
              ? "border-[#1e2f5b] text-slate-300 hover:bg-[#121e3f]"
              : "border-[#dce8f8] text-slate-700 hover:bg-slate-100"
          }`}
          aria-label="Open Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Search Bar */}
        <div className="relative w-full max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="Search for classes, topics, or anything..."
            className={`w-full h-10 pl-10 pr-4 rounded-xl text-xs sm:text-sm outline-none transition-all ${
              isDark
                ? "bg-[#0e172e] border border-[#1b2b52] text-slate-200 placeholder-slate-500 focus:border-[#0062eb] focus:ring-2 focus:ring-[#0062eb]/20"
                : "bg-[#f4f8fe] border border-[#d2e2f6] text-[#0a1b39] placeholder-slate-400 focus:border-[#0062eb] focus:bg-white focus:ring-2 focus:ring-[#0062eb]/15"
            }`}
          />
        </div>
      </div>

      {/* Right Controls: Theme Toggle + Notifications + User Profile */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Dark / Light Mode Switch */}
        <button
          onClick={toggleTheme}
          title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
          aria-label="Toggle Theme"
          className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
            isDark
              ? "bg-[#0e172e] border-[#1b2b52] text-sky-400 hover:bg-[#172447] hover:border-sky-400/40"
              : "bg-[#f0f5fc] border-[#d2e2f6] text-amber-500 hover:bg-amber-50 hover:border-amber-200"
          }`}
        >
          {isDark ? (
            <Moon className="w-4 h-4 text-sky-400 fill-sky-400" />
          ) : (
            <Sun className="w-4 h-4 text-amber-500 fill-amber-500" />
          )}
        </button>

        {/* Notifications Bell with Badge '3' */}
        <div className="relative">
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className={`relative p-2.5 rounded-xl border transition-all ${
              isDark
                ? "bg-[#0e172e] border-[#1b2b52] text-slate-300 hover:bg-[#172447]"
                : "bg-[#f0f5fc] border-[#d2e2f6] text-slate-700 hover:bg-blue-50 hover:text-[#0062eb]"
            }`}
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#ef4444] text-white text-[10px] font-bold flex items-center justify-center shadow-md shadow-red-500/30">
              3
            </span>
          </button>

          {/* Quick Notifications Dropdown */}
          {notificationsOpen && (
            <div
              className={`absolute right-0 mt-2 w-80 rounded-2xl shadow-2xl p-4 border z-50 animate-in fade-in-50 zoom-in-95 ${
                isDark
                  ? "bg-[#0c142b] border-[#1e2f5b] text-slate-200"
                  : "bg-white border-[#d2e2f6] text-[#0a1b39] shadow-xl"
              }`}
            >
              <div
                className={`flex items-center justify-between pb-3 border-b ${
                  isDark ? "border-slate-700/40" : "border-[#e2edf8]"
                }`}
              >
                <span className="font-bold text-sm">Notifications</span>
                <span className="text-[11px] text-[#0062eb] font-bold cursor-pointer hover:underline">
                  Mark all as read
                </span>
              </div>
              <div className="py-2 space-y-2.5 text-xs">
                <div
                  className={`p-2 rounded-xl transition ${
                    isDark ? "hover:bg-slate-800/40" : "hover:bg-[#f4f8fe]"
                  }`}
                >
                  <p className="font-bold">New assignment posted</p>
                  <p
                    className={`text-[11px] ${
                      isDark ? "text-slate-400" : "text-slate-600 font-medium"
                    }`}
                  >
                    NLP Data Preprocessing - 2 hours ago
                  </p>
                </div>
                <div
                  className={`p-2 rounded-xl transition ${
                    isDark ? "hover:bg-slate-800/40" : "hover:bg-[#f4f8fe]"
                  }`}
                >
                  <p className="font-bold">Class reminder</p>
                  <p
                    className={`text-[11px] ${
                      isDark ? "text-slate-400" : "text-slate-600 font-medium"
                    }`}
                  >
                    Transformers Deep Dive tomorrow at 10:00 AM
                  </p>
                </div>
              </div>
              <div
                className={`pt-2 border-t text-center ${
                  isDark ? "border-slate-700/40" : "border-[#e2edf8]"
                }`}
              >
                <Link
                  href="/notifications"
                  onClick={() => setNotificationsOpen(false)}
                  className="text-xs font-bold text-[#0062eb] hover:underline inline-flex items-center gap-1"
                >
                  <span>View All Notifications</span>
                  <span>&rarr;</span>
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Card */}
        <div className="relative">
          <button
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className={`flex items-center gap-2.5 p-1.5 pr-2.5 rounded-full border transition-all ${
              isDark
                ? "bg-[#0e172e] border-[#1b2b52] hover:bg-[#162347]"
                : "bg-[#f0f5fc] border-[#d2e2f6] hover:bg-blue-50/70"
            }`}
          >
            {/* Avatar */}
            <div className="relative w-8 h-8 rounded-full overflow-hidden border border-blue-400/50 shadow-sm">
              <div className="w-full h-full bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white text-xs font-bold">
                {userInitials}
              </div>
            </div>

            {/* Name & Role */}
            <div className="hidden sm:flex flex-col text-left">
              <span
                className={`text-xs font-black leading-tight ${
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

            <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
          </button>

          {/* Profile Dropdown Menu */}
          {profileDropdownOpen && (
            <div
              className={`absolute right-0 mt-2 w-52 rounded-2xl shadow-2xl p-2 border z-50 animate-in fade-in-50 zoom-in-95 ${
                isDark
                  ? "bg-[#0c142b] border-[#1e2f5b] text-slate-200"
                  : "bg-white border-[#d2e2f6] text-[#0a1b39]"
              }`}
            >
              <div
                className={`p-2 border-b ${
                  isDark ? "border-slate-700/40" : "border-[#e2edf8]"
                }`}
              >
                <p className="text-xs font-black">{userName}</p>
                <p
                  className={`text-[11px] font-medium ${
                    isDark ? "text-slate-400" : "text-slate-500"
                  }`}
                >
                  {userEmail}
                </p>
              </div>
              <div className="py-1">
                <Link
                  href="/profile"
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition ${
                    isDark
                      ? "hover:bg-blue-600 hover:text-white"
                      : "hover:bg-blue-50 hover:text-[#0062eb]"
                  }`}
                >
                  <User className="w-3.5 h-3.5" />
                  <span>My Profile</span>
                </Link>
                <Link
                  href="/dashboard"
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition ${
                    isDark
                      ? "hover:bg-blue-600 hover:text-white"
                      : "hover:bg-blue-50 hover:text-[#0062eb]"
                  }`}
                >
                  <Settings className="w-3.5 h-3.5" />
                  <span>Account Settings</span>
                </Link>
                <Link
                  href="/dashboard"
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition ${
                    isDark
                      ? "hover:bg-blue-600 hover:text-white"
                      : "hover:bg-blue-50 hover:text-[#0062eb]"
                  }`}
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Help &amp; Support</span>
                </Link>
              </div>
              <div
                className={`pt-1 border-t ${
                  isDark ? "border-slate-700/40" : "border-[#e2edf8]"
                }`}
              >
                <Link
                  href="/login"
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-red-500 hover:bg-red-50 transition"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

