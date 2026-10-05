"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import DashboardLayout from "@/components/DashboardLayout";
import { useTheme } from "@/components/ThemeProvider";
import styles from "./attendance.module.css";
import { StudentApi } from "@/lib/studentApi";
import {
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  BookOpen,
  User,
  ArrowLeft,
  Loader2,
  CalendarCheck,
  AlertCircle,
} from "lucide-react";

export interface AttendanceHistoryItem {
  id: string;
  date: string;
  time: string;
  topic: string;
  module: string;
  trainer: string;
  status: "Present" | "Absent" | "Late";
}

export default function AttendancePage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [student, setStudent] = useState<any>(null);
  const [attendanceData, setAttendanceData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Filter & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All Status");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  useEffect(() => {
    setIsLoading(true);

    Promise.all([
      StudentApi.getDashboard(),
      StudentApi.getAttendance(),
    ])
      .then(([dashData, attData]) => {
        if (dashData?.student) {
          setStudent(dashData.student);
        }
        if (attData && attData.status === "success") {
          setAttendanceData(attData);
        } else {
          setAttendanceData(null);
        }
      })
      .catch((err) => {
        console.error("Attendance API fetch error:", err);
        setAttendanceData(null);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  // Real backend metrics
  const totalClasses = attendanceData?.total_classes ?? 0;
  const presentCount = attendanceData?.present_count ?? 0;
  const absentCount = attendanceData?.absent_count ?? 0;
  const leaveCount = attendanceData?.leave_count ?? 0;
  const overallPercentage = attendanceData?.overall_percentage ?? 0;
  const historyRecords: AttendanceHistoryItem[] = (attendanceData?.history || []).map((h: any, idx: number) => ({
    id: String(h.id || idx),
    date: h.date || "Scheduled Date",
    time: h.time || "Class Session",
    topic: h.subject || h.topic || "Lecture Session",
    module: h.module || "Core",
    trainer: h.trainer || "Instructor",
    status: h.status === "Present" ? "Present" : h.status === "Absent" ? "Absent" : "Late",
  }));

  const filteredHistory = useMemo(() => {
    let result = historyRecords;

    if (selectedStatus !== "All Status") {
      result = result.filter((item) => item.status === selectedStatus);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (item) =>
          item.topic.toLowerCase().includes(q) ||
          item.trainer.toLowerCase().includes(q) ||
          item.module.toLowerCase().includes(q) ||
          item.date.toLowerCase().includes(q)
      );
    }

    return result;
  }, [historyRecords, selectedStatus, searchQuery]);

  const totalPages = Math.ceil(filteredHistory.length / pageSize) || 1;
  const paginatedHistory = filteredHistory.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-[#0062eb]" />
          <span className="ml-3 text-sm font-semibold text-slate-500">Loading attendance data...</span>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className={styles.container}>
        {/* =========================================================================
            1. PAGE HEADER (Real Student Course & Program)
            ========================================================================= */}
        <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="text-[11px] font-black uppercase tracking-wider text-[#0062eb] bg-blue-500/10 px-2.5 py-0.5 rounded-full border border-blue-500/20">
                Attendance Tracking
              </span>
              <span className={`text-xs font-semibold ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                {student?.course || "Academic Program"} {student?.batch ? `• ${student.batch}` : ""}
              </span>
            </div>
            <h1 className={`text-2xl sm:text-3xl font-black tracking-tight ${isDark ? "text-white" : "text-[#0a1b39]"}`}>
              Attendance
            </h1>
            <p className={`text-xs sm:text-sm font-medium mt-1 ${isDark ? "text-slate-300" : "text-slate-600"}`}>
              Track your class attendance, monitor your participation rate, and stay on track for placement eligibility.
            </p>
          </div>
        </section>

        {/* =========================================================================
            2. REAL METRIC KPI CARDS
            ========================================================================= */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
          <div className={styles.statCard}>
            <div className={styles.iconBoxBlue}>
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Total Classes
              </span>
              <div className={`text-xl sm:text-2xl font-black ${isDark ? "text-white" : "text-[#0a1b39]"}`}>
                {totalClasses}
              </div>
              <span className="text-[11px] text-slate-400 font-medium">
                {student?.batch || "Active Cohort"}
              </span>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.iconBoxGreen}>
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Present
              </span>
              <div className="text-xl sm:text-2xl font-black text-emerald-500">
                {presentCount}
              </div>
              <span className="text-[11px] text-emerald-500 font-medium">
                {totalClasses > 0 ? `${Math.round((presentCount / totalClasses) * 100)}% Attendance` : "0% Attendance"}
              </span>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.iconBoxRed}>
              <XCircle className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Absent
              </span>
              <div className="text-xl sm:text-2xl font-black text-rose-500">
                {absentCount}
              </div>
              <span className="text-[11px] text-rose-500 font-medium">
                {totalClasses > 0 ? `${Math.round((absentCount / totalClasses) * 100)}% Missed` : "0% Missed"}
              </span>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className="w-11 h-11 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Late / Leave
              </span>
              <div className="text-xl sm:text-2xl font-black text-amber-500">
                {leaveCount}
              </div>
              <span className="text-[11px] text-slate-400 font-medium">
                {leaveCount > 0 ? `${leaveCount} excused sessions` : "Zero late records"}
              </span>
            </div>
          </div>
        </section>

        {/* =========================================================================
            3. OVERVIEW SECTION (Overall Rate & Status)
            ========================================================================= */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className={`${styles.card} p-5 sm:p-6 flex flex-col justify-between`}>
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-black uppercase tracking-wider text-slate-400">
                  Overall Attendance Rate
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    overallPercentage >= 75
                      ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                      : "bg-blue-500/10 text-[#0062eb] border border-blue-500/20"
                  }`}
                >
                  {overallPercentage >= 75 ? "Good Standing" : "Enrollment Phase"}
                </span>
              </div>

              <div className="flex items-baseline gap-3 my-2">
                <span className={`text-4xl sm:text-5xl font-black ${overallPercentage >= 75 ? "text-emerald-500" : "text-[#0062eb]"}`}>
                  {overallPercentage}%
                </span>
                <span className="text-xs font-bold text-slate-400">
                  Minimum Required: 75%
                </span>
              </div>

              <p className="text-xs text-slate-400 mt-2">
                {totalClasses > 0
                  ? `You have attended ${presentCount} out of ${totalClasses} scheduled batch sessions.`
                  : "Attendance records will be calculated as live cohort sessions are conducted."}
              </p>
            </div>

            <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden mt-4">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, overallPercentage)}%` }}
              />
            </div>
          </div>

          <div className={`${styles.card} p-5 sm:p-6 flex flex-col justify-between`}>
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-slate-400 block mb-4">
                Placement Attendance Criterion
              </span>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800">
                  <span className="text-xs font-semibold">Eligibility Benchmark</span>
                  <span className="text-xs font-black text-emerald-600">75% Minimum</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800">
                  <span className="text-xs font-semibold">Current Student Standing</span>
                  <span className={`text-xs font-black ${overallPercentage >= 75 ? "text-emerald-600" : "text-[#0062eb]"}`}>
                    {overallPercentage}% Recorded
                  </span>
                </div>
              </div>
            </div>
            <p className="text-[11px] text-slate-400 mt-4">
              Regular attendance in live classes and hands-on lab sessions is required to unlock interview clearance.
            </p>
          </div>
        </section>

        {/* =========================================================================
            4. ATTENDANCE HISTORY LIST (Clean Empty State or Dynamic Table)
            ========================================================================= */}
        {totalClasses === 0 ? (
          <div className="py-16 sm:py-24 px-6 text-center flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40">
            <div className="w-16 h-16 rounded-2xl bg-blue-500/10 text-[#0062eb] flex items-center justify-center mb-4">
              <CalendarCheck className="w-8 h-8 stroke-[2]" />
            </div>
            <h3 className={`text-lg sm:text-xl font-bold ${isDark ? "text-white" : "text-[#0a1b39]"}`}>
              No Attendance Records Yet
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-md">
              There are currently no attendance logs for <strong className={isDark ? "text-slate-300" : "text-slate-700"}>{student?.batch || "your batch"}</strong>. Your attendance will be registered automatically during live classes and sessions.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <Link
                href="/dashboard"
                className="px-5 py-2.5 rounded-xl bg-[#0062eb] hover:bg-[#0052cc] text-white text-xs font-bold transition shadow-md shadow-blue-600/25 flex items-center gap-1.5 active:scale-95"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Dashboard</span>
              </Link>
            </div>
          </div>
        ) : (
          <section className={`${styles.card} p-5 sm:p-6 space-y-4`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h3 className={`text-base font-bold ${isDark ? "text-white" : "text-[#0a1b39]"}`}>
                Attendance History ({filteredHistory.length} Sessions)
              </h3>
              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search topic or trainer..."
                  className={`w-full pl-8 pr-3 py-1.5 rounded-xl text-xs outline-none border transition ${
                    isDark
                      ? "bg-[#091328] border-[#15254a] text-white placeholder-slate-500 focus:border-[#0062eb]"
                      : "bg-[#f8fbff] border-[#dce8f8] text-[#0a1b39] placeholder-slate-400 focus:border-[#0062eb]"
                  }`}
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase text-[10px]">
                    <th className="py-2.5 px-3">Date &amp; Time</th>
                    <th className="py-2.5 px-3">Class / Topic</th>
                    <th className="py-2.5 px-3">Module</th>
                    <th className="py-2.5 px-3">Trainer</th>
                    <th className="py-2.5 px-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                  {paginatedHistory.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/40">
                      <td className="py-3 px-3 font-medium">
                        <div>{item.date}</div>
                        <span className="text-[10px] text-slate-400">{item.time}</span>
                      </td>
                      <td className="py-3 px-3 font-bold">{item.topic}</td>
                      <td className="py-3 px-3 font-semibold text-slate-400">{item.module}</td>
                      <td className="py-3 px-3">{item.trainer}</td>
                      <td className="py-3 px-3 text-right">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            item.status === "Present"
                              ? "bg-emerald-500/10 text-emerald-600"
                              : item.status === "Absent"
                              ? "bg-rose-500/10 text-rose-600"
                              : "bg-amber-500/10 text-amber-600"
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] text-slate-400">
                  Page {currentPage} of {totalPages}
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className="p-1 rounded-lg border border-slate-200 dark:border-slate-800 disabled:opacity-40"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    className="p-1 rounded-lg border border-slate-200 dark:border-slate-800 disabled:opacity-40"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </section>
        )}
      </div>
    </DashboardLayout>
  );
}
