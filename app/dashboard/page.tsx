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
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
            <div className="space-y-2.5">
              <div className="flex items-center gap-2.5 flex-wrap">
                <div className={styles.liveBadge}>
                  <span className={styles.liveDot} />
                  <span>{liveClass?.is_live ? "Live Now" : "Next Live Session"}</span>
                </div>
                {liveClass ? (
                  <span className="text-xs font-bold text-slate-400">
                    {liveClass.date} • {liveClass.time}
                  </span>
                ) : (
                  <span className="text-xs font-bold text-slate-400">No live session scheduled today</span>
                )}
                {classJoined && (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/15 text-emerald-600 border border-emerald-500/30">
                    ✓ Connected to Meeting Room
                  </span>
                )}
              </div>

              <h2
                className={`text-lg sm:text-xl font-black ${
                  isDark ? "text-white" : "text-[#0a1b39]"
                }`}
              >
                {liveClass?.subject || "No active class schedule"}
              </h2>

              {liveClass?.description && (
                <p className={`text-xs sm:text-sm font-medium ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                  {liveClass.description}
                </p>
              )}

              {liveClass && (
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
              )}
            </div>

            {/* Action Button */}
            {liveClass && (
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
            )}
          </div>
        </section>

        {/* =========================================================================
            3. OVERVIEW METRICS: 4-COLUMN BALANCED KPI GRID
            ========================================================================= */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Attendance */}
          <div className={styles.statCard}>
            <div className="flex items-center justify-between mb-2">
              <span className={`text-xs font-semibold ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                Attendance Rate
              </span>
              <div className="w-9 h-9 rounded-xl bg-emerald-500/15 text-emerald-600 flex items-center justify-center">
                <Calendar className="w-4 h-4 stroke-[2.5]" />
              </div>
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-black text-emerald-600">{kpi?.attendance_pct ?? 0}%</span>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                  {(kpi?.attendance_pct ?? 0) >= 75 ? "On Track" : "Needs Improvement"}
                </span>
              </div>
              <p className={`text-[11px] mt-1 font-semibold ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                {kpi?.sessions_summary || "No session records"}
              </p>
              <div className={styles.progressTrack}>
                <div className="h-full bg-[#10b981] rounded-full" style={{ width: `${Math.min(100, kpi?.attendance_pct ?? 0)}%` }} />
              </div>
            </div>
          </div>

          {/* Card 2: Course Progress */}
          <div className={styles.statCard}>
            <div className="flex items-center justify-between mb-2">
              <span className={`text-xs font-semibold ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                Course Progress
              </span>
              <div className="w-9 h-9 rounded-xl bg-blue-500/15 text-[#0062eb] flex items-center justify-center">
                <BookOpen className="w-4 h-4 stroke-[2.5]" />
              </div>
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className={`text-2xl sm:text-3xl font-black ${isDark ? "text-white" : "text-[#0a1b39]"}`}>
                  {kpi?.course_progress_pct ?? 0}%
                </span>
                <span className="text-xs font-bold text-[#0062eb] bg-blue-500/10 px-2 py-0.5 rounded-full">
                  {kpi?.completed_topics ?? 0} / {kpi?.total_topics ?? 0} Topics
                </span>
              </div>
              <p className={`text-[11px] mt-1 font-semibold ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                Completed {kpi?.completed_topics ?? 0} topics in curriculum
              </p>
              <div className={styles.progressTrack}>
                <div className="h-full bg-[#0062eb] rounded-full" style={{ width: `${Math.min(100, kpi?.course_progress_pct ?? 0)}%` }} />
              </div>
            </div>
          </div>

          {/* Card 3: Pending Tasks */}
          <div className={styles.statCard}>
            <div className="flex items-center justify-between mb-2">
              <span className={`text-xs font-semibold ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                Pending Tasks
              </span>
              <div className="w-9 h-9 rounded-xl bg-amber-500/15 text-amber-600 flex items-center justify-center">
                <FileText className="w-4 h-4 stroke-[2.5]" />
              </div>
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-black text-amber-600">{kpi?.pending_assignments ?? 0}</span>
                <span className="text-xs font-bold text-amber-600 bg-amber-500/10 px-2 py-0.5 rounded-full">
                  {(kpi?.pending_assignments ?? 0) > 0 ? "Action Required" : "All Caught Up"}
                </span>
              </div>
              <p className={`text-[11px] mt-1 font-semibold truncate ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                {kpi?.pending_task_name || "No data available"}
              </p>
              <div className={styles.progressTrack}>
                <div className="h-full bg-[#f59e0b] rounded-full" style={{ width: (kpi?.pending_assignments ?? 0) > 0 ? "50%" : "0%" }} />
              </div>
            </div>
          </div>

          {/* Card 4: Overdue Tasks */}
          <div className={styles.statCard}>
            <div className="flex items-center justify-between mb-2">
              <span className={`text-xs font-semibold ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                Overdue Tasks
              </span>
              <div className="w-9 h-9 rounded-xl bg-emerald-500/15 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
              </div>
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className={`text-2xl sm:text-3xl font-black ${isDark ? "text-white" : "text-[#0a1b39]"}`}>
                  {kpi?.overdue_assignments ?? 0}
                </span>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                  {(kpi?.overdue_assignments ?? 0) === 0 ? "All Up to Date" : "Overdue Items"}
                </span>
              </div>
              <p className={`text-[11px] mt-1 font-semibold ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                {(kpi?.overdue_assignments ?? 0) === 0 ? "Zero overdue submissions" : `${kpi?.overdue_assignments} overdue task(s)`}
              </p>
              <div className={styles.progressTrack}>
                <div className="h-full bg-[#10b981] rounded-full" style={{ width: "100%" }} />
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            4. 6-MONTH CURRICULUM ROADMAP (FULL-WIDTH 6-STEP HORIZONTAL CARD)
            ========================================================================= */}
        <section className={styles.dashCard}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className={`text-base font-bold ${isDark ? "text-white" : "text-[#0a1b39]"}`}>
                Curriculum Roadmap
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Academic trajectory for {student.course || "Generative AI"} ({student.batch})
              </p>
            </div>
            <Link
              href="/curriculum"
              className="text-xs font-bold text-[#0062eb] hover:underline flex items-center gap-1"
            >
              <span>View Full Curriculum</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Months Cards Grid */}
          {roadmap.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {roadmap.map((m: any) => {
                const isCompleted = m.status === "Completed";
                const isActive = m.status === "Current" || m.status === "In Progress";
                return (
                  <div
                    key={m.number}
                    className={`${styles.monthCard} ${
                      isCompleted
                        ? styles.monthCardCompleted
                        : isActive
                        ? styles.monthCardActive
                        : styles.monthCardUpcoming
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className={`text-[10px] font-black uppercase tracking-wider ${
                        isCompleted ? "text-emerald-600" : isActive ? "text-[#0062eb]" : "text-slate-400"
                      }`}>
                        Month {m.number} {isActive ? "• Current" : ""}
                      </span>
                      {isCompleted ? (
                        <span className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold">
                          ✓
                        </span>
                      ) : isActive ? (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-[#0062eb] text-white">
                          Active
                        </span>
                      ) : (
                        <Lock className="w-3.5 h-3.5 text-slate-400" />
                      )}
                    </div>
                    <h4 className={`text-xs font-bold ${isDark ? "text-white" : "text-[#0a1b39]"}`}>
                      {m.title}
                    </h4>
                    <p className={`text-[11px] mt-0.5 font-medium ${isActive ? "text-[#0062eb] font-bold" : "text-slate-400"}`}>
                      {m.status}
                    </p>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-xs text-slate-400 py-4 text-center">No data available</p>
          )}
        </section>

        {/* =========================================================================
            5. CORE DASHBOARD OPERATIONS: PERFECTLY BALANCED 4-COLUMN GRID
            ========================================================================= */}
        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 items-stretch">
          {/* Card 1: Recent Results */}
          <div className={`${styles.dashCard} h-full flex flex-col justify-between`}>
            <div>
              <div className="flex items-center justify-between mb-3.5">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-emerald-500" />
                  <h4 className={`text-sm font-bold ${isDark ? "text-white" : "text-[#0a1b39]"}`}>
                    Recent Results
                  </h4>
                </div>
                <Link href="/assignments" className="text-xs font-bold text-[#0062eb] hover:underline">
                  All Scores &rarr;
                </Link>
              </div>

              {recentResults.length > 0 ? (
                <div className="space-y-3">
                  {recentResults.map((res: any, idx: number) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                      <div>
                        <h5 className={`text-xs font-bold ${isDark ? "text-white" : "text-[#0a1b39]"}`}>
                          {res.title}
                        </h5>
                        <p className="text-[11px] text-slate-400">{res.category}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-base font-black text-emerald-600">{res.score}</span>
                        <span className="text-[9px] block text-emerald-600 font-bold uppercase">{res.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center border rounded-xl text-xs text-slate-400">
                  No data available
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400 font-medium">Academic Evaluations</span>
              <Link href="/assignments" className="text-xs font-bold text-[#0062eb] hover:underline">
                View Assignments
              </Link>
            </div>
          </div>

          {/* Card 2: Career Readiness */}
          <div className={`${styles.dashCard} h-full flex flex-col justify-between`}>
            <div>
              <div className="flex items-center justify-between mb-3.5">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-[#0062eb]" />
                  <h4 className={`text-sm font-bold ${isDark ? "text-white" : "text-[#0a1b39]"}`}>
                    Career Readiness
                  </h4>
                </div>
                <Link href="/career" className="text-xs font-bold text-[#0062eb] hover:underline">
                  Details &rarr;
                </Link>
              </div>

              {/* Target Role Badge */}
              <div className="p-2.5 rounded-xl bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-500/20 mb-3">
                <span className="text-[9px] font-bold uppercase text-[#0062eb] block">Target Program</span>
                <span className={`text-xs font-black block ${isDark ? "text-white" : "text-[#0a1b39]"}`}>
                  {student.course || "Generative AI"}
                </span>
                <div className="flex items-center justify-between text-[10px] text-slate-400 mt-0.5">
                  <span>Student Status</span>
                  <strong className="text-emerald-600 font-bold">{student.status || "Active"}</strong>
                </div>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span className={isDark ? "text-slate-200" : "text-slate-700"}>Student Registration</span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-600">Verified</span>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span className={isDark ? "text-slate-200" : "text-slate-700"}>Batch Allocation</span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-600">{student.batch}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400 font-medium">Placement Module</span>
              <Link href="/career" className="text-xs font-bold text-[#0062eb] hover:underline">
                View Career Profile
              </Link>
            </div>
          </div>

          {/* Card 3: Fee Status */}
          <div className={`${styles.dashCard} h-full flex flex-col justify-between`}>
            <div>
              <div className="flex items-center justify-between mb-3.5">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-emerald-500" />
                  <h4 className={`text-sm font-bold ${isDark ? "text-white" : "text-[#0a1b39]"}`}>
                    Fee Status
                  </h4>
                </div>
                <Link href="/fees" className="text-xs font-bold text-[#0062eb] hover:underline">
                  Receipts &rarr;
                </Link>
              </div>

              <div className="space-y-2.5">
                {/* Metrics */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                    <span className="text-[10px] text-slate-400 block font-semibold">Total Fee</span>
                    <strong className={`text-sm font-black ${isDark ? "text-white" : "text-[#0a1b39]"}`}>
                      ₹{kpi?.total_fee ? kpi.total_fee.toLocaleString() : "0"}
                    </strong>
                  </div>
                  <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                    <span className="text-[10px] text-emerald-700 dark:text-emerald-400 block font-semibold">
                      Paid ({kpi?.paid_pct ?? 0}%)
                    </span>
                    <strong className="text-sm font-black text-emerald-600">
                      ₹{kpi?.total_paid ? kpi.total_paid.toLocaleString() : "0"}
                    </strong>
                  </div>
                </div>

                {/* Outstanding & Next Due */}
                <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#0062eb]">Balance Due</span>
                      <strong className={`text-base font-black block ${isDark ? "text-white" : "text-[#0a1b39]"}`}>
                        ₹{kpi?.total_due ? kpi.total_due.toLocaleString() : "0"}
                      </strong>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block font-semibold">Due Date</span>
                      <strong className="text-xs font-bold text-[#0062eb]">{kpi?.next_due_date || "N/A"}</strong>
                    </div>
                  </div>
                  {/* Progress bar */}
                  <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden mt-2.5">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${Math.min(100, kpi?.paid_pct ?? 0)}%` }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setFeeModalOpen(true)}
                className="w-full py-2.5 rounded-xl bg-[#0062eb] hover:bg-[#0052cc] text-white text-xs font-bold transition shadow-md shadow-blue-600/20 flex items-center justify-center gap-1.5"
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>Pay Fee (₹{kpi?.total_due ? kpi.total_due.toLocaleString() : "0"})</span>
              </button>
            </div>
          </div>

          {/* Card 4: Announcements */}
          <div className={`${styles.dashCard} h-full flex flex-col justify-between`}>
            <div>
              <div className="flex items-center justify-between mb-3.5">
                <div className="flex items-center gap-2">
                  <Megaphone className="w-4 h-4 text-purple-500" />
                  <h4 className={`text-sm font-bold ${isDark ? "text-white" : "text-[#0a1b39]"}`}>
                    Announcements
                  </h4>
                </div>
                <Link href="/notifications" className="text-xs font-bold text-[#0062eb] hover:underline">
                  View All &rarr;
                </Link>
              </div>

              {announcements.length > 0 ? (
                <div className="space-y-3">
                  {announcements.map((ann: any) => (
                    <div key={ann.id} className="space-y-1 pb-2.5 border-b border-slate-100 dark:border-slate-800 last:border-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-blue-500/15 text-blue-600">
                          {ann.category || "System"}
                        </span>
                        <span className="text-[10px] text-slate-400">{ann.date}</span>
                      </div>
                      <h5 className={`text-xs font-bold leading-snug ${isDark ? "text-white" : "text-[#0a1b39]"}`}>
                        {ann.title}
                      </h5>
                      <p className="text-[11px] text-slate-400 leading-snug line-clamp-2">
                        {ann.message}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center border rounded-xl text-xs text-slate-400">
                  No data available
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400 font-medium">Notifications</span>
              <Link href="/notifications" className="text-xs font-bold text-[#0062eb] hover:underline">
                Open Center
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

