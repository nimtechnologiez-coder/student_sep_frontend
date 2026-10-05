"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import DashboardLayout from "@/components/DashboardLayout";
import { useTheme } from "@/components/ThemeProvider";
import styles from "./dashboard.module.css";
import { StudentApi } from "@/lib/studentApi";
import {
  BookOpen,
  Calendar,
  FileText,
  Code2,
  Star,
  Trophy,
  Award,
  ArrowRight,
  Check,
  Video,
  User,
  CheckCircle2,
  Circle,
  Bell,
  Users,
  Clock,
  Lock,
  Unlock,
  CreditCard,
  Target,
  Sparkles,
  Download,
  AlertTriangle,
  Play,
  Briefcase,
  ChevronRight,
  GraduationCap,
  Megaphone,
  Loader2,
  Layers,
} from "lucide-react";

export default function StudentDashboardPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // State: Class attendance simulation
  const [classJoined, setClassJoined] = useState<boolean>(false);

  // Modal State for Fee Payment
  const [feeModalOpen, setFeeModalOpen] = useState<boolean>(false);

  // Real Student Dashboard Data State from Django Backend API
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    setIsLoading(true);
    StudentApi.getDashboard()
      .then((data) => {
        if (data.status === "success" || data.success) {
          setDashboardData(data);
        } else {
          setError(data.message || "Failed to load dashboard data");
        }
      })
      .catch((err) => {
        console.error("Dashboard API error:", err);
        setError("Network error connecting to backend API");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const fallbackStudent = {
    name: "Vijay",
    student_id: "NIM-2026-34978",
    batch: "Afternoon Batch 1",
    course: "Full Stack Web Development (Placement)",
    join_date: "01 Oct 2026",
    timing_preference: "Afternoon"
  };

  const student = dashboardData?.student || fallbackStudent;
  const kpi = dashboardData?.kpi || {
    attendance_pct: 0,
    sessions_summary: "0 sessions completed",
    course_progress_pct: 0,
    completed_topics: 0,
    total_topics: 59,
    pending_assignments: 0,
    pending_task_name: "No pending tasks",
    overdue_assignments: 0
  };
  const liveClass = dashboardData?.live_class || null;
  const roadmap = dashboardData?.roadmap || [];
  const recentResults = dashboardData?.recent_results || [];
  const announcements = dashboardData?.announcements || [];

  const handleJoinClass = () => {
    setClassJoined(true);
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-[#0062eb]" />
          <span className="ml-3 text-sm font-semibold text-slate-500">Loading student dashboard...</span>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className={styles.container}>
        {/* =========================================================================
            1. WELCOME HEADER SECTION (Student Name, Batch, Program)
            ========================================================================= */}
        <section className={styles.welcomeCard}>
          <div className={styles.welcomeGlow} />
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#0062eb]/10 text-[#0062eb] border border-[#0062eb]/20">
                  {student.batch} {student.timing_preference ? `• ${student.timing_preference} Preference` : ""}
                </span>
                <span className="text-xs font-semibold text-slate-400">
                  Joined: {student.join_date || "N/A"} • Student ID: {student.student_id}
                </span>
              </div>

              <h1
                className={`text-2xl sm:text-3xl lg:text-[32px] font-black tracking-tight leading-tight ${
                  isDark ? "text-white" : "text-[#0a1b39]"
                }`}
              >
                Welcome back, {student.name}{" "}
                <span className="inline-block animate-wave origin-[70%_70%]">👋</span>
              </h1>

              <p
                className={`text-xs sm:text-sm font-semibold mt-1 ${
                  isDark ? "text-slate-300" : "text-slate-600"
                }`}
              >
                Program: <span className="font-bold text-[#0062eb]">{student.course || "Generative AI & LLMs"}</span>
              </p>
            </div>

            {/* Quick Actions Right */}
            <div className="flex items-center gap-3 shrink-0 flex-wrap">
              <Link
                href="/classes"
                className="px-4 py-2.5 rounded-xl bg-[#0062eb] hover:bg-[#0052cc] text-white text-xs sm:text-sm font-bold shadow-md shadow-blue-600/25 transition-all flex items-center gap-1.5"
              >
                <Video className="w-4 h-4" />
                <span>Today&apos;s Schedule</span>
              </Link>
              <Link
                href="/curriculum"
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold border transition-all ${
                  isDark
                    ? "bg-[#0b1429] border-[#1b2f5b] text-slate-200 hover:bg-[#122247]"
                    : "bg-white border-[#dce8f8] text-[#0a1b39] hover:bg-slate-50"
                }`}
              >
                Curriculum Hub
              </Link>
            </div>
          </div>
        </section>

        {/* =========================================================================
            2. PROMINENT NEXT CLASS CARD (Topic, Trainer, Time, Mode, Join CTA)
            ========================================================================= */}
        <section className={styles.nextClassCard}>
          {liveClass ? (
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
              <div className="space-y-2.5">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <div className={styles.liveBadge}>
                    <span className={styles.liveDot} />
                    <span>{liveClass.is_live ? "Live Now" : "Next Live Session"}</span>
                  </div>
                  <span className="text-xs font-bold text-slate-400">
                    {liveClass.date} • {liveClass.time}
                  </span>
                  {classJoined && (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/15 text-emerald-600 border border-emerald-500/30">
                      ✓ Connected to Meeting Room
                    </span>
                  )}
                </div>

                <h2 className={`text-lg sm:text-xl font-black ${isDark ? "text-white" : "text-[#0a1b39]"}`}>
                  {liveClass.subject}
                </h2>

                {liveClass.description && (
                  <p className={`text-xs sm:text-sm font-medium ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                    {liveClass.description}
                  </p>
                )}

                <div className="flex items-center gap-4 sm:gap-6 text-xs text-slate-500 dark:text-slate-400 flex-wrap pt-1 font-semibold">
                  <div className="flex items-center gap-1.5">
                    <User className="w-4 h-4 text-[#0062eb]" />
                    <span>Trainer: <strong className={isDark ? "text-white" : "text-[#0a1b39]"}>{liveClass.trainer}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-emerald-500" />
                    <span>{liveClass.time} ({liveClass.duration})</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Video className="w-4 h-4 text-indigo-500" />
                    <span>{liveClass.mode}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-amber-500" />
                    <span>Batch: {student.batch}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-start lg:items-end gap-2 shrink-0">
                <button
                  onClick={handleJoinClass}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#0062eb] hover:bg-[#0052cc] text-white text-xs sm:text-sm font-bold shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                >
                  <Video className="w-4 h-4" />
                  <span>{classJoined ? "Rejoin Live Class" : "Join Class Now"}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                {classJoined && (
                  <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
                    ✓ Attendance registered for {student.name}
                  </p>
                )}
              </div>
            </div>
          ) : (
            /* ── No Active Class Empty State ── */
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-slate-700/40 border border-slate-600/30 flex items-center justify-center shrink-0">
                  <Video className="w-6 h-6 text-slate-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className={`${styles.liveBadge} opacity-60`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                      <span>Next Live Session</span>
                    </div>
                    <span className="text-[11px] font-semibold text-slate-500">No session today</span>
                  </div>
                  <h2 className={`text-base sm:text-lg font-black ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                    No active class schedule
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5 font-medium">
                    Your next session will be listed here once your trainer publishes the schedule
                  </p>
                </div>
              </div>
              <Link
                href="/classes"
                className="shrink-0 px-4 py-2 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-[#0062eb] dark:text-[#60a5fa] border border-blue-500/20 hover:border-blue-500/40 text-xs font-bold transition-all flex items-center gap-1.5 active:scale-95 group"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>View Schedule</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          )}
        </section>

        {/* =========================================================================
            3. OVERVIEW METRICS: 4-COLUMN BALANCED KPI GRID (2x2 on Mobile, 4x1 on Desktop)
            ========================================================================= */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
          {/* Card 1: Attendance */}
          <div className={styles.statCard}>
            <div className="flex items-center justify-between mb-2 gap-1">
              <span className={`text-[11px] sm:text-xs font-semibold truncate ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                Attendance Rate
              </span>
              <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-emerald-500/15 text-emerald-600 flex items-center justify-center shrink-0">
                <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
              </div>
            </div>
            <div>
              <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2">
                <span className="text-xl sm:text-2xl lg:text-3xl font-black text-emerald-600">
                  {kpi?.attendance_pct ?? 0}%
                </span>
                <span className="text-[9px] sm:text-xs font-bold text-emerald-600 bg-emerald-500/10 px-1.5 sm:px-2 py-0.5 rounded-full inline-block truncate max-w-full">
                  {(kpi?.attendance_pct ?? 0) >= 75 ? "On Track" : "Needs Improvement"}
                </span>
              </div>
              <p className={`text-[10px] sm:text-[11px] mt-1 font-semibold truncate ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                {kpi?.sessions_summary || "No session records"}
              </p>
              <div className={styles.progressTrack}>
                <div className="h-full bg-[#10b981] rounded-full" style={{ width: `${Math.min(100, kpi?.attendance_pct ?? 0)}%` }} />
              </div>
            </div>
          </div>

          {/* Card 2: Course Progress */}
          <div className={styles.statCard}>
            <div className="flex items-center justify-between mb-2 gap-1">
              <span className={`text-[11px] sm:text-xs font-semibold truncate ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                Course Progress
              </span>
              <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-blue-500/15 text-[#0062eb] flex items-center justify-center shrink-0">
                <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
              </div>
            </div>
            <div>
              <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2">
                <span className={`text-xl sm:text-2xl lg:text-3xl font-black ${isDark ? "text-white" : "text-[#0a1b39]"}`}>
                  {kpi?.course_progress_pct ?? 0}%
                </span>
                <span className="text-[9px] sm:text-xs font-bold text-[#0062eb] bg-blue-500/10 px-1.5 sm:px-2 py-0.5 rounded-full inline-block truncate max-w-full">
                  {kpi?.completed_topics ?? 0} / {kpi?.total_topics ?? 0} Topics
                </span>
              </div>
              <p className={`text-[10px] sm:text-[11px] mt-1 font-semibold truncate ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                Completed {kpi?.completed_topics ?? 0} topics in curriculum
              </p>
              <div className={styles.progressTrack}>
                <div className="h-full bg-[#0062eb] rounded-full" style={{ width: `${Math.min(100, kpi?.course_progress_pct ?? 0)}%` }} />
              </div>
            </div>
          </div>

          {/* Card 3: Pending Tasks */}
          <div className={styles.statCard}>
            <div className="flex items-center justify-between mb-2 gap-1">
              <span className={`text-[11px] sm:text-xs font-semibold truncate ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                Pending Tasks
              </span>
              <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-amber-500/15 text-amber-600 flex items-center justify-center shrink-0">
                <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
              </div>
            </div>
            <div>
              <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2">
                <span className="text-xl sm:text-2xl lg:text-3xl font-black text-amber-600">
                  {kpi?.pending_assignments ?? 0}
                </span>
                <span className="text-[9px] sm:text-xs font-bold text-amber-600 bg-amber-500/10 px-1.5 sm:px-2 py-0.5 rounded-full inline-block truncate max-w-full">
                  {(kpi?.pending_assignments ?? 0) > 0 ? "Action Required" : "All Caught Up"}
                </span>
              </div>
              <p className={`text-[10px] sm:text-[11px] mt-1 font-semibold truncate ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                {(kpi?.pending_assignments ?? 0) > 0 ? (kpi?.pending_task_name || "Pending task") : "No pending tasks"}
              </p>
              <div className={styles.progressTrack}>
                <div className="h-full bg-[#f59e0b] rounded-full" style={{ width: (kpi?.pending_assignments ?? 0) > 0 ? "50%" : "0%" }} />
              </div>
            </div>
          </div>

          {/* Card 4: Overdue Tasks */}
          <div className={styles.statCard}>
            <div className="flex items-center justify-between mb-2 gap-1">
              <span className={`text-[11px] sm:text-xs font-semibold truncate ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                Overdue Tasks
              </span>
              <div className={`w-7 h-7 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl ${(kpi?.overdue_assignments ?? 0) > 0 ? "bg-red-500/15 text-red-600" : "bg-emerald-500/15 text-emerald-600"} flex items-center justify-center shrink-0`}>
                <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
              </div>
            </div>
            <div>
              <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2">
                <span className={`text-xl sm:text-2xl lg:text-3xl font-black ${(kpi?.overdue_assignments ?? 0) > 0 ? "text-red-500" : isDark ? "text-white" : "text-[#0a1b39]"}`}>
                  {kpi?.overdue_assignments ?? 0}
                </span>
                <span className={`text-[9px] sm:text-xs font-bold px-1.5 sm:px-2 py-0.5 rounded-full inline-block truncate max-w-full ${(kpi?.overdue_assignments ?? 0) === 0 ? "text-emerald-600 bg-emerald-500/10" : "text-red-600 bg-red-500/10"}`}>
                  {(kpi?.overdue_assignments ?? 0) === 0 ? "All Up to Date" : "Overdue Items"}
                </span>
              </div>
              <p className={`text-[10px] sm:text-[11px] mt-1 font-semibold truncate ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                {(kpi?.overdue_assignments ?? 0) === 0 ? "Zero overdue submissions" : `${kpi?.overdue_assignments} overdue task(s)`}
              </p>
              <div className={styles.progressTrack}>
                <div
                  className={`h-full rounded-full ${(kpi?.overdue_assignments ?? 0) > 0 ? "bg-[#ef4444]" : "bg-[#10b981]"}`}
                  style={{ width: (kpi?.overdue_assignments ?? 0) > 0 ? `${Math.min(100, (kpi?.overdue_assignments ?? 0) * 25)}%` : "0%" }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            4. 6-MONTH CURRICULUM ROADMAP (FULL-WIDTH 6-STEP HORIZONTAL CARD)
            ========================================================================= */}
        <section className={styles.dashCard}>
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 mb-5 pb-4 border-b border-slate-200/60 dark:border-slate-800/80">
            <div>
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-blue-500/10 text-[#0062eb] dark:text-[#60a5fa] border border-blue-500/20">
                  <BookOpen className="w-3 h-3" />
                  Academic Pathway
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/60">
                  {roadmap.length} Phases Total
                </span>
                {kpi.course_progress_pct !== undefined && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    <Check className="w-3 h-3 stroke-[2.5]" />
                    {kpi.course_progress_pct}% Completed
                  </span>
                )}
              </div>
              <h3 className={`text-lg font-bold tracking-tight ${isDark ? "text-white" : "text-[#0a1b39]"}`}>
                Curriculum Roadmap
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Academic trajectory for <span className="font-semibold text-slate-300">{student.course || "Generative AI"}</span> ({student.batch})
              </p>
            </div>

            <Link
              href="/curriculum"
              className="shrink-0 whitespace-nowrap px-3.5 py-2 rounded-xl bg-blue-500/10 hover:bg-[#0062eb] text-[#0062eb] hover:text-white dark:text-[#60a5fa] dark:hover:text-white border border-blue-500/25 hover:border-blue-600 text-xs font-bold transition-all flex items-center gap-1.5 group active:scale-95 shadow-sm"
            >
              <span>View Full Curriculum</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {/* Months Cards Grid - Responsive & Aligned (2 columns on mobile, 3 on tablet, 6 on desktop) */}
          {roadmap.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-2.5 sm:gap-3.5 items-stretch">
              {roadmap.map((m: any, index: number) => {
                const isCompleted = m.status === "Completed";
                const isActive = m.status === "Current" || m.status === "In Progress";
                const monthNum = m.number || index + 1;
                const formattedNum = String(monthNum).padStart(2, "0");
                const moduleCount = m.modules?.length || 0;

                return (
                  <Link
                    href="/curriculum"
                    key={m.number || index}
                    className={`${styles.monthCard} ${
                      isCompleted
                        ? styles.monthCardCompleted
                        : isActive
                        ? styles.monthCardActive
                        : styles.monthCardUpcoming
                    } group cursor-pointer`}
                  >
                    {/* Top Row: Phase / Month Badge & Status Icon */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span
                        className={`text-[10px] font-black tracking-wider uppercase px-2 py-0.5 rounded-md ${
                          isCompleted
                            ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/25"
                            : isActive
                            ? "bg-[#0062eb] text-white shadow-sm shadow-blue-500/30"
                            : "bg-slate-800/80 text-slate-400 border border-slate-700/50"
                        }`}
                      >
                        Month {formattedNum}
                      </span>

                      {/* Right Icon/Status Indicator */}
                      {isCompleted ? (
                        <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center shrink-0">
                          <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" />
                        </span>
                      ) : isActive ? (
                        <span className="flex items-center gap-1 text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-full bg-blue-500/20 text-[#60a5fa] border border-blue-500/30 shrink-0">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                          Active
                        </span>
                      ) : (
                        <span className="w-5 h-5 rounded-full bg-slate-800/50 text-slate-400 border border-slate-700/40 flex items-center justify-center shrink-0">
                          <Lock className="w-3 h-3 text-slate-400" />
                        </span>
                      )}
                    </div>

                    {/* Middle: Title with clamped 2 lines and consistent min-height for uniform row alignment */}
                    <div className="flex-1 flex flex-col justify-start mb-3">
                      <h4
                        className={`text-xs sm:text-[13px] font-bold leading-snug line-clamp-2 min-h-[2.4rem] transition-colors ${
                          isDark
                            ? isCompleted
                              ? "text-slate-100 group-hover:text-emerald-300"
                              : isActive
                              ? "text-white group-hover:text-blue-300"
                              : "text-slate-200 group-hover:text-white"
                            : isCompleted
                            ? "text-slate-900 group-hover:text-emerald-700"
                            : isActive
                            ? "text-[#0062eb] group-hover:text-blue-800"
                            : "text-slate-800 group-hover:text-slate-950"
                        }`}
                        title={m.title}
                      >
                        {m.title}
                      </h4>

                      <div className="mt-2 flex items-center gap-1.5 text-[10px] text-slate-400">
                        <Layers className="w-3 h-3 text-slate-400 shrink-0" />
                        <span>{moduleCount > 0 ? `${moduleCount} ${moduleCount === 1 ? "Module" : "Modules"}` : "Core Syllabus"}</span>
                      </div>
                    </div>

                    {/* Bottom Footer: Status Bar & Micro-interaction */}
                    <div className="mt-auto pt-2.5 border-t border-slate-200/50 dark:border-slate-800/80 flex items-center justify-between">
                      <span
                        className={`text-[10px] font-bold ${
                          isCompleted
                            ? "text-emerald-500 dark:text-emerald-400"
                            : isActive
                            ? "text-[#0062eb] dark:text-[#60a5fa]"
                            : "text-slate-400"
                        }`}
                      >
                        {isCompleted ? "Completed" : isActive ? "Current Phase" : "Upcoming"}
                      </span>

                      <div className="flex items-center gap-0.5 text-[10px] text-slate-400 group-hover:text-blue-400 transition-colors">
                        <span className="hidden sm:inline text-[9px] font-medium">Explore</span>
                        <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="py-8 px-4 text-center flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/40">
              <div className="w-10 h-10 rounded-full bg-blue-500/10 text-[#0062eb] flex items-center justify-center mb-2">
                <BookOpen className="w-5 h-5 stroke-[2]" />
              </div>
              <p className={`text-xs font-semibold ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                No data available
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Curriculum roadmap schedule will appear once assigned to your batch
              </p>
            </div>
          )}
        </section>

        {/* =========================================================================
            5. CORE DASHBOARD OPERATIONS: PERFECTLY BALANCED 4-COLUMN GRID
            ========================================================================= */}
        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 items-stretch">

          {/* ── Card 1: Recent Results ── */}
          <div className={`${styles.dashCard} flex flex-col`}>
            {/* Header */}
            <div className="flex items-center justify-between mb-4 gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/15 flex items-center justify-center shrink-0">
                  <Award className="w-4 h-4 text-emerald-500" />
                </div>
                <h4 className={`text-sm font-bold truncate ${isDark ? "text-white" : "text-[#0a1b39]"}`}>Recent Results</h4>
              </div>
              <Link
                href="/assignments"
                className="shrink-0 whitespace-nowrap px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[11px] font-bold transition-all flex items-center gap-1 group active:scale-95"
              >
                <span>All Scores</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>

            {/* Content – grows to fill */}
            <div className="flex-1">
              {recentResults.length > 0 ? (
                <div className="space-y-2.5">
                  {recentResults.map((res: any, idx: number) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <h5 className={`text-xs font-bold truncate ${isDark ? "text-white" : "text-[#0a1b39]"}`}>{res.title}</h5>
                        <p className="text-[11px] text-slate-400 truncate">{res.category}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-base font-black text-emerald-600">{res.score}</span>
                        <span className="text-[9px] block text-emerald-600 font-bold uppercase tracking-wide">{res.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-full min-h-[110px] flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/40 py-6">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-2.5">
                    <Award className="w-5 h-5" />
                  </div>
                  <p className={`text-xs font-semibold ${isDark ? "text-slate-300" : "text-slate-600"}`}>No results yet</p>
                  <p className="text-[11px] text-slate-400 mt-0.5 text-center px-3">Evaluation scores will appear after assessments</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-[11px] text-slate-400 font-medium">Academic Evaluations</span>
              <Link
                href="/assignments"
                className="shrink-0 whitespace-nowrap text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 px-2 py-0.5 rounded-md hover:bg-emerald-500/10 transition-all flex items-center gap-1 group"
              >
                <span>View Assignments</span>
                <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>

          {/* ── Card 2: Career Readiness ── */}
          <div className={`${styles.dashCard} flex flex-col`}>
            {/* Header */}
            <div className="flex items-center justify-between mb-4 gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-blue-500/15 flex items-center justify-center shrink-0">
                  <Target className="w-4 h-4 text-[#0062eb]" />
                </div>
                <h4 className={`text-sm font-bold truncate ${isDark ? "text-white" : "text-[#0a1b39]"}`}>Career Readiness</h4>
              </div>
              <Link
                href="/career"
                className="shrink-0 whitespace-nowrap px-2.5 py-1 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-[#0062eb] dark:text-[#60a5fa] border border-blue-500/20 text-[11px] font-bold transition-all flex items-center gap-1 group active:scale-95"
              >
                <span>Details</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>

            {/* Content */}
            <div className="flex-1 space-y-3">
              <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-500/20">
                <span className="text-[9px] font-bold uppercase tracking-wider text-[#0062eb] block mb-0.5">Target Program</span>
                <span className={`text-xs font-black leading-tight block ${isDark ? "text-white" : "text-[#0a1b39]"}`}>
                  {student.course || "Generative AI"}
                </span>
                <div className="flex items-center justify-between mt-1.5">
                  <span className="text-[10px] text-slate-400 font-semibold">Student Status</span>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-500/10 px-1.5 py-0.5 rounded-full">{student.status || "Active"}</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between py-1.5 px-0 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span className={`text-xs font-semibold ${isDark ? "text-slate-200" : "text-slate-700"}`}>Student Registration</span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-600">Verified</span>
                </div>
                <div className="flex items-center justify-between py-1.5 px-0">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span className={`text-xs font-semibold ${isDark ? "text-slate-200" : "text-slate-700"}`}>Batch Allocation</span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-600">{student.batch}</span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-[11px] text-slate-400 font-medium">Placement Module</span>
              <Link
                href="/career"
                className="shrink-0 whitespace-nowrap text-[11px] font-bold text-[#0062eb] dark:text-[#60a5fa] hover:text-blue-500 px-2 py-0.5 rounded-md hover:bg-blue-500/10 transition-all flex items-center gap-1 group"
              >
                <span>View Career Profile</span>
                <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>

          {/* ── Card 3: Fee Status ── */}
          <div className={`${styles.dashCard} flex flex-col`}>
            {/* Header */}
            <div className="flex items-center justify-between mb-4 gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/15 flex items-center justify-center shrink-0">
                  <CreditCard className="w-4 h-4 text-emerald-500" />
                </div>
                <h4 className={`text-sm font-bold truncate ${isDark ? "text-white" : "text-[#0a1b39]"}`}>Fee Status</h4>
              </div>
              <Link
                href="/fees"
                className="shrink-0 whitespace-nowrap px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[11px] font-bold transition-all flex items-center gap-1 group active:scale-95"
              >
                <span>Receipts</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>

            {/* Content */}
            <div className="flex-1 space-y-2.5">
              <div className="grid grid-cols-2 gap-2">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 font-semibold block mb-0.5">Total Fee</span>
                  <strong className={`text-sm font-black ${isDark ? "text-white" : "text-[#0a1b39]"}`}>
                    ₹{kpi?.total_fee ? kpi.total_fee.toLocaleString() : "0"}
                  </strong>
                </div>
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                  <span className="text-[10px] text-emerald-600 font-semibold block mb-0.5">Paid ({kpi?.paid_pct ?? 0}%)</span>
                  <strong className="text-sm font-black text-emerald-600">
                    ₹{kpi?.total_paid ? kpi.total_paid.toLocaleString() : "0"}
                  </strong>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[9px] uppercase font-bold tracking-wider text-[#0062eb] block">Balance Due</span>
                    <strong className={`text-base font-black ${isDark ? "text-white" : "text-[#0a1b39]"}`}>
                      ₹{kpi?.total_due ? kpi.total_due.toLocaleString() : "0"}
                    </strong>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 font-semibold block">Due Date</span>
                    <strong className="text-xs font-bold text-[#0062eb]">{kpi?.next_due_date || "N/A"}</strong>
                  </div>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden mt-2.5">
                  <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${Math.min(100, kpi?.paid_pct ?? 0)}%` }} />
                </div>
              </div>
            </div>

            {/* Footer – CTA */}
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setFeeModalOpen(true)}
                className="w-full py-2.5 rounded-xl bg-[#0062eb] hover:bg-[#0052cc] text-white text-xs font-bold transition-all shadow-md shadow-blue-600/20 flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer"
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>Pay Fee (₹{kpi?.total_due ? kpi.total_due.toLocaleString() : "0"})</span>
              </button>
            </div>
          </div>

          {/* ── Card 4: Announcements ── */}
          <div className={`${styles.dashCard} flex flex-col`}>
            {/* Header */}
            <div className="flex items-center justify-between mb-4 gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-purple-500/15 flex items-center justify-center shrink-0">
                  <Megaphone className="w-4 h-4 text-purple-500" />
                </div>
                <h4 className={`text-sm font-bold truncate ${isDark ? "text-white" : "text-[#0a1b39]"}`}>Announcements</h4>
              </div>
              <Link
                href="/notifications"
                className="shrink-0 whitespace-nowrap px-2.5 py-1 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-600 dark:text-purple-400 border border-purple-500/20 text-[11px] font-bold transition-all flex items-center gap-1 group active:scale-95"
              >
                <span>View All</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>

            {/* Content */}
            <div className="flex-1">
              {announcements.length > 0 ? (
                <div className="space-y-3">
                  {announcements.map((ann: any) => (
                    <div key={ann.id} className="space-y-1 pb-2.5 border-b border-slate-100 dark:border-slate-800 last:border-0 last:pb-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-purple-500/15 text-purple-600">
                          {ann.category || "System"}
                        </span>
                        <span className="text-[10px] text-slate-400">{ann.date}</span>
                      </div>
                      <h5 className={`text-xs font-bold leading-snug ${isDark ? "text-white" : "text-[#0a1b39]"}`}>{ann.title}</h5>
                      <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-2">{ann.message}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-full min-h-[110px] flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/40 py-6">
                  <div className="w-10 h-10 rounded-full bg-purple-500/10 text-purple-600 flex items-center justify-center mb-2.5">
                    <Megaphone className="w-5 h-5" />
                  </div>
                  <p className={`text-xs font-semibold ${isDark ? "text-slate-300" : "text-slate-600"}`}>No announcements</p>
                  <p className="text-[11px] text-slate-400 mt-0.5 text-center px-3">Batch announcements will appear here</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-[11px] text-slate-400 font-medium">Notifications</span>
              <Link
                href="/notifications"
                className="shrink-0 whitespace-nowrap text-[11px] font-bold text-purple-600 dark:text-purple-400 hover:text-purple-500 px-2 py-0.5 rounded-md hover:bg-purple-500/10 transition-all flex items-center gap-1 group"
              >
                <span>Open Center</span>
                <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>

        </section>

        {/* Modal: Quick Fee Payment Simulation */}
        {feeModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
            <div className={`w-full max-w-md rounded-2xl p-6 border shadow-2xl space-y-4 ${
              isDark ? "bg-[#0b1429] border-[#1e3363] text-white" : "bg-white border-[#dce8f8] text-[#0a1b39]"
            }`}>
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-[#0062eb]" />
                  <h3 className="font-bold text-base">Fee Payment</h3>
                </div>
                <button onClick={() => setFeeModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex justify-between">
                  <span>Balance Due:</span>
                  <strong className="text-sm font-black text-[#0062eb]">₹{kpi?.total_due ? kpi.total_due.toLocaleString() : "0"}</strong>
                </div>
                <p className="text-slate-400">
                  Payment processed securely via payment gateway. Instant GST invoice will be generated.
                </p>
                <Link
                  href="/fees"
                  onClick={() => setFeeModalOpen(false)}
                  className="block w-full py-2.5 rounded-xl bg-[#0062eb] hover:bg-[#0052cc] text-white text-center font-bold"
                >
                  Proceed to Fees &amp; Payments Page
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

