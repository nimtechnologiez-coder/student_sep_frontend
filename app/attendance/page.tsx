"use client";

import React, { useState, useEffect, useMemo } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useTheme } from "@/components/ThemeProvider";
import styles from "./attendance.module.css";
import { StudentApi } from "@/lib/studentApi";
import { TablePageSkeleton } from "@/components/Skeleton";
import {
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  TrendingUp,
  BookOpen,
  Loader2,
  CalendarCheck,
  Filter,
  MoreVertical,
  RotateCcw,
} from "lucide-react";

export interface AttendanceHistoryItem {
  id: string;
  date: string;
  raw_date?: string;
  time: string;
  topic: string;
  module: string;
  trainer: string;
  status: "Present" | "Absent" | "Late" | "Leave";
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
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  // Calendar Month Navigation (Defaults to current date Oct 2026)
  const [currentMonthDate, setCurrentMonthDate] = useState(() => new Date(2026, 9, 1));

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
  const courseDuration = attendanceData?.course_duration || "Jan 2026 - Jun 2026";
  const courseName = student?.course || attendanceData?.course || "Generative AI & LLMs";
  const batchName = student?.batch || attendanceData?.batch || "GenAI - 7263";

  const presentPct = totalClasses > 0 ? Math.round((presentCount / totalClasses) * 100) : 0;
  const absentPct = totalClasses > 0 ? Math.round((absentCount / totalClasses) * 100) : 0;
  const leavePct = totalClasses > 0 ? Math.round((leaveCount / totalClasses) * 100) : 0;

  // Real history records
  const historyRecords: AttendanceHistoryItem[] = useMemo(() => {
    return (attendanceData?.history || []).map((h: any, idx: number) => ({
      id: String(h.id || idx),
      date: h.date || "Scheduled Date",
      raw_date: h.raw_date || "",
      time: h.time || "10:10 AM - 11:00 AM",
      topic: h.topic || h.subject || "Lecture Session",
      module: h.module || courseName,
      trainer: h.trainer || "GANESH",
      status: h.status === "Present" ? "Present" : h.status === "Absent" ? "Absent" : h.status === "Leave" ? "Leave" : "Late",
    }));
  }, [attendanceData?.history, courseName]);

  // Calendar Day Map from API
  const calendarDaysMap = useMemo(() => {
    const map: Record<string, string> = { ...(attendanceData?.calendar_days || {}) };
    historyRecords.forEach((item) => {
      if (item.raw_date && !map[item.raw_date]) {
        map[item.raw_date] = item.status;
      }
    });
    return map;
  }, [attendanceData?.calendar_days, historyRecords]);

  // Filtered History
  const filteredHistory = useMemo(() => {
    let result = historyRecords;

    if (selectedStatus !== "All Status") {
      if (selectedStatus === "Late" || selectedStatus === "Leave") {
        result = result.filter((item) => item.status === "Late" || item.status === "Leave");
      } else {
        result = result.filter((item) => item.status === selectedStatus);
      }
    }

    if (startDate) {
      result = result.filter((item) => !item.raw_date || item.raw_date >= startDate);
    }

    if (endDate) {
      result = result.filter((item) => !item.raw_date || item.raw_date <= endDate);
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
  }, [historyRecords, selectedStatus, startDate, endDate, searchQuery]);

  const totalPages = Math.ceil(filteredHistory.length / pageSize) || 1;
  const paginatedHistory = filteredHistory.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Calendar Calculations for selected month
  const calYear = currentMonthDate.getFullYear();
  const calMonth = currentMonthDate.getMonth();
  const monthName = currentMonthDate.toLocaleString("default", { month: "long" });

  const handlePrevMonth = () => {
    setCurrentMonthDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonthDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const calendarGridCells = useMemo(() => {
    const firstDayIndex = new Date(calYear, calMonth, 1).getDay(); // 0 = Sun
    const totalDaysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(calYear, calMonth, 0).getDate();

    const cells: Array<{
      day: number;
      isCurrentMonth: boolean;
      status?: string;
      dateKey?: string;
    }> = [];

    // Prev month overflow
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      cells.push({
        day: daysInPrevMonth - i,
        isCurrentMonth: false,
      });
    }

    // Current month days
    for (let d = 1; d <= totalDaysInMonth; d++) {
      const dateKey = `${calYear}-${String(calMonth + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      const status = calendarDaysMap[dateKey];
      cells.push({
        day: d,
        isCurrentMonth: true,
        status,
        dateKey,
      });
    }

    // Next month overflow to complete 35 or 42 grid cells
    const targetCount = cells.length > 35 ? 42 : 35;
    const remaining = targetCount - cells.length;
    for (let nextD = 1; nextD <= remaining; nextD++) {
      cells.push({
        day: nextD,
        isCurrentMonth: false,
      });
    }

    return cells;
  }, [calYear, calMonth, calendarDaysMap]);

  // Selected Month Days Counts
  const monthCounts = useMemo(() => {
    let p = 0;
    let a = 0;
    let l = 0;

    calendarGridCells.forEach((cell) => {
      if (cell.isCurrentMonth && cell.status) {
        if (cell.status === "Present") p++;
        else if (cell.status === "Absent") a++;
        else if (cell.status === "Late" || cell.status === "Leave") l++;
      }
    });

    return {
      present: p,
      absent: a,
      leave: l,
    };
  }, [calendarGridCells]);

  // Donut chart stroke calculations
  const donutSize = 152;
  const strokeWidth = 12;
  const center = donutSize / 2;
  const radius = center - strokeWidth;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (Math.min(100, Math.max(0, overallPercentage)) / 100) * circumference;

  if (isLoading) {
    return (
      <DashboardLayout>
        <TablePageSkeleton title="Loading Attendance Records..." />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className={styles.container}>
        {/* =========================================================================
            1. PAGE HEADER (Exact Reference Layout)
            ========================================================================= */}
        <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="text-[11px] font-black uppercase tracking-wider text-white bg-[#0062eb] px-2.5 py-0.5 rounded-full shadow-sm">
                ATTENDANCE
              </span>
              <span className={`text-xs font-semibold ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                {courseName} • {batchName}
              </span>
            </div>
            <h1 className={`text-2xl sm:text-3xl font-black tracking-tight ${isDark ? "text-white" : "text-[#0a1b39]"}`}>
              Attendance
            </h1>
            <p className={`text-xs sm:text-sm font-medium mt-1 ${isDark ? "text-slate-300" : "text-slate-600"}`}>
              Track your class attendance, monitor your progress, and stay consistent on your learning journey.
            </p>
          </div>

          {/* Right Card: Course Duration */}
          <div className="bg-white dark:bg-[#0b152d] border border-slate-200/80 dark:border-slate-800 rounded-2xl p-3 sm:p-3.5 px-4 flex items-center gap-3.5 shadow-sm shrink-0 self-start sm:self-auto">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-[#0062eb] flex items-center justify-center shrink-0">
              <Calendar className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <span className="text-[11px] font-medium text-slate-400 block">
                Course Duration
              </span>
              <div className={`text-xs sm:text-sm font-bold ${isDark ? "text-white" : "text-[#0a1b39]"}`}>
                {courseDuration}
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            2. TOP 4 METRIC KPI CARDS
            ========================================================================= */}
        <section className="grid grid-cols-1 min-[360px]:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
          {/* 1. Total Classes */}
          <div className={styles.statCard}>
            <div className={styles.iconBoxBlue}>
              <BookOpen className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400 block">
                Total Classes
              </span>
              <div className={`text-xl sm:text-2xl font-black ${isDark ? "text-white" : "text-[#0a1b39]"}`}>
                {totalClasses}
              </div>
              <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                Recorded classes
              </span>
            </div>
          </div>

          {/* 2. Present */}
          <div className={styles.statCard}>
            <div className={styles.iconBoxGreen}>
              <CheckCircle2 className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400 block">
                Present
              </span>
              <div className="text-xl sm:text-2xl font-black text-[#10b981]">
                {presentCount}
              </div>
              <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                {presentPct}% attendance
              </span>
            </div>
          </div>

          {/* 3. Absent */}
          <div className={styles.statCard}>
            <div className={styles.iconBoxRed}>
              <XCircle className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400 block">
                Absent
              </span>
              <div className="text-xl sm:text-2xl font-black text-[#f43f5e]">
                {absentCount}
              </div>
              <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                {absentPct}% attendance
              </span>
            </div>
          </div>

          {/* 4. Leave / Late */}
          <div className={styles.statCard}>
            <div className={styles.iconBoxAmber}>
              <Clock className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400 block">
                Leave / Late
              </span>
              <div className="text-xl sm:text-2xl font-black text-[#f59e0b]">
                {leaveCount}
              </div>
              <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                {leavePct}% attendance
              </span>
            </div>
          </div>
        </section>

        {/* =========================================================================
            3. MIDDLE ROW: OVERALL ATTENDANCE & ATTENDANCE CALENDAR (EQUAL HEIGHT)
            ========================================================================= */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 items-stretch">
          {/* LEFT: Overall Attendance */}
          <div className={`${styles.card} p-5 sm:p-6 flex flex-col justify-between h-full`}>
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-blue-500/10 text-[#0062eb] flex items-center justify-center">
                  <CalendarCheck className="w-3.5 h-3.5 stroke-[2.2]" />
                </div>
                <h3 className={`text-base font-bold ${isDark ? "text-white" : "text-[#0a1b39]"}`}>
                  Overall Attendance
                </h3>
              </div>

              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-[#10b981] bg-[#ecfdf5] dark:bg-emerald-950/40 border border-emerald-500/20">
                <TrendingUp className="w-3.5 h-3.5 stroke-[2.2]" />
                {attendanceData?.standing || (overallPercentage >= 75 ? "Good Standing" : "Enrollment Phase")}
              </span>
            </div>

            {/* Donut Chart & Content */}
            <div className="flex flex-col sm:flex-row items-center gap-6 my-auto py-3">
              {/* Circular Donut */}
              <div className="relative shrink-0 flex items-center justify-center">
                <svg width={donutSize} height={donutSize} className="transform -rotate-90">
                  <circle
                    cx={center}
                    cy={center}
                    r={radius}
                    stroke={isDark ? "#15254a" : "#edf2f7"}
                    strokeWidth={strokeWidth}
                    fill="transparent"
                  />
                  <circle
                    cx={center}
                    cy={center}
                    r={radius}
                    stroke="#00c48c"
                    strokeWidth={strokeWidth}
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    className="transition-all duration-700 ease-out"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className={`text-3xl font-black ${isDark ? "text-white" : "text-[#0a1b39]"}`}>
                    {overallPercentage}%
                  </span>
                  <span className="text-[11px] font-semibold text-slate-400 mt-0.5">
                    Attendance
                  </span>
                </div>
              </div>

              {/* Text & Segmented Progress Bar */}
              <div className="flex-1 w-full">
                <h4 className={`text-xl sm:text-2xl font-black ${isDark ? "text-white" : "text-[#0a1b39]"}`}>
                  {presentCount} out of {totalClasses} classes
                </h4>
                <p className={`text-xs font-medium mt-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                  You have attended {presentCount} of {totalClasses} recorded classes.
                </p>

                {/* Segmented Progress Bar */}
                <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden flex mt-4">
                  <div
                    style={{ width: `${presentPct}%` }}
                    className="h-full bg-[#00c48c] transition-all duration-300"
                  />
                  <div
                    style={{ width: `${absentPct}%` }}
                    className="h-full bg-[#f43f5e] transition-all duration-300"
                  />
                  <div
                    style={{ width: `${leavePct}%` }}
                    className="h-full bg-[#f59e0b] transition-all duration-300"
                  />
                </div>

                {/* Legend Row */}
                <div className="flex items-center gap-6 mt-4 flex-wrap">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#00c48c] shrink-0" />
                    <span className="text-xs text-slate-500 font-medium">Present</span>
                    <span className={`text-xs font-bold ${isDark ? "text-white" : "text-[#0a1b39]"}`}>
                      {presentCount}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#f43f5e] shrink-0" />
                    <span className="text-xs text-slate-500 font-medium">Absent</span>
                    <span className={`text-xs font-bold ${isDark ? "text-white" : "text-[#0a1b39]"}`}>
                      {absentCount}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b] shrink-0" />
                    <span className="text-xs text-slate-500 font-medium">Leave / Late</span>
                    <span className={`text-xs font-bold ${isDark ? "text-white" : "text-[#0a1b39]"}`}>
                      {leaveCount}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Attendance Calendar */}
          <div className={`${styles.card} p-5 sm:p-6 flex flex-col justify-between h-full`}>
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-blue-500/10 text-[#0062eb] flex items-center justify-center">
                  <Calendar className="w-3.5 h-3.5 stroke-[2.2]" />
                </div>
                <h3 className={`text-base font-bold ${isDark ? "text-white" : "text-[#0a1b39]"}`}>
                  Attendance Calendar
                </h3>
              </div>

              {/* Month Selector Controls */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handlePrevMonth}
                  aria-label="Previous Month"
                  className="w-7 h-7 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500 transition"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <div className="px-3 py-1 rounded-full border border-slate-200 dark:border-slate-800 text-xs font-bold flex items-center gap-1.5 bg-white dark:bg-[#0b152d] text-slate-700 dark:text-slate-300">
                  <span>{monthName} {calYear}</span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </div>
                <button
                  onClick={handleNextMonth}
                  aria-label="Next Month"
                  className="w-7 h-7 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500 transition"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Grid & Legend Layout */}
            <div className="flex flex-col sm:flex-row gap-5 my-auto items-stretch">
              {/* 7-Col Calendar Grid */}
              <div className="flex-1">
                {/* Day headers */}
                <div className="grid grid-cols-7 text-center mb-2 text-xs font-semibold text-slate-400">
                  <span>Sun</span>
                  <span>Mon</span>
                  <span>Tue</span>
                  <span>Wed</span>
                  <span>Thu</span>
                  <span>Fri</span>
                  <span>Sat</span>
                </div>

                {/* Day cells */}
                <div className="grid grid-cols-7 gap-y-1.5 text-center">
                  {calendarGridCells.map((cell, idx) => {
                    if (!cell.isCurrentMonth) {
                      return (
                        <div
                          key={`overflow-${idx}`}
                          className="h-8 w-8 flex items-center justify-center text-xs mx-auto text-slate-300 dark:text-slate-600 font-normal select-none"
                        >
                          {cell.day}
                        </div>
                      );
                    }

                    if (cell.status === "Present") {
                      return (
                        <div key={`cur-${idx}`} className="h-8 w-8 mx-auto flex items-center justify-center">
                          <span className="w-7 h-7 rounded-full bg-[#dcfce7] dark:bg-emerald-950/70 text-[#15803d] dark:text-emerald-300 font-bold flex items-center justify-center text-xs select-none shadow-xs">
                            {cell.day}
                          </span>
                        </div>
                      );
                    }

                    if (cell.status === "Absent") {
                      return (
                        <div key={`cur-${idx}`} className="h-8 w-8 mx-auto flex items-center justify-center">
                          <span className="w-7 h-7 rounded-full bg-[#ffe4e6] dark:bg-rose-950/70 text-[#be123c] dark:text-rose-300 font-bold flex items-center justify-center text-xs select-none shadow-xs">
                            {cell.day}
                          </span>
                        </div>
                      );
                    }

                    if (cell.status === "Late" || cell.status === "Leave") {
                      return (
                        <div key={`cur-${idx}`} className="h-8 w-8 mx-auto flex items-center justify-center">
                          <span className="w-7 h-7 rounded-full bg-[#fef3c7] dark:bg-amber-950/70 text-[#b45309] dark:text-amber-300 font-bold flex items-center justify-center text-xs select-none shadow-xs">
                            {cell.day}
                          </span>
                        </div>
                      );
                    }

                    return (
                      <div
                        key={`cur-${idx}`}
                        className={`h-8 w-8 flex items-center justify-center text-xs mx-auto font-medium select-none ${
                          isDark ? "text-slate-300" : "text-slate-700"
                        }`}
                      >
                        {cell.day}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Vertical Legend with Divider */}
              <div className="border-t sm:border-t-0 sm:border-l border-slate-100 dark:border-slate-800 pt-3 sm:pt-0 sm:pl-6 flex flex-row sm:flex-col justify-center sm:justify-start gap-4 sm:gap-3.5 shrink-0 min-w-[130px] flex-wrap">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#00c48c] shrink-0" />
                    <span className={`text-xs font-bold ${isDark ? "text-slate-200" : "text-slate-800"}`}>
                      Present
                    </span>
                  </div>
                  <span className="text-[11px] font-medium text-slate-400 pl-[18px] block mt-0.5">
                    {monthCounts.present > 0 ? `${monthCounts.present} days` : `${presentCount} days`}
                  </span>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#f43f5e] shrink-0" />
                    <span className={`text-xs font-bold ${isDark ? "text-slate-200" : "text-slate-800"}`}>
                      Absent
                    </span>
                  </div>
                  <span className="text-[11px] font-medium text-slate-400 pl-[18px] block mt-0.5">
                    {monthCounts.absent > 0 ? `${monthCounts.absent} days` : `${absentCount} days`}
                  </span>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b] shrink-0" />
                    <span className={`text-xs font-bold ${isDark ? "text-slate-200" : "text-slate-800"}`}>
                      Leave / Late
                    </span>
                  </div>
                  <span className="text-[11px] font-medium text-slate-400 pl-[18px] block mt-0.5">
                    {monthCounts.leave > 0 ? `${monthCounts.leave} days` : `${leaveCount} days`}
                  </span>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-400 shrink-0" />
                    <span className={`text-xs font-bold ${isDark ? "text-slate-200" : "text-slate-800"}`}>
                      No Class
                    </span>
                  </div>
                  <span className="text-[11px] font-medium text-slate-400 pl-[18px] block mt-0.5">
                    Other days
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            4. BOTTOM ROW: ATTENDANCE HISTORY TABLE
            ========================================================================= */}
        <section className={`${styles.card} p-5 sm:p-6 space-y-4`}>
          {/* Card Top: Title, Search, and Status Filter */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-blue-500/10 text-[#0062eb] flex items-center justify-center">
                <CalendarCheck className="w-3.5 h-3.5 stroke-[2.2]" />
              </div>
              <h3 className={`text-base font-bold ${isDark ? "text-white" : "text-[#0a1b39]"}`}>
                Attendance History ({filteredHistory.length} Sessions)
              </h3>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 flex-wrap">
              {/* Search Bar */}
              <div className="relative w-full sm:w-56">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Search topic or trainer..."
                  className={`w-full pl-9 pr-3 py-1.5 rounded-xl text-xs font-medium outline-none border transition ${
                    isDark
                      ? "bg-[#091328] border-[#15254a] text-white placeholder-slate-500 focus:border-[#0062eb]"
                      : "bg-[#f8fbff] border-[#dce8f8] text-[#0a1b39] placeholder-slate-400 focus:border-[#0062eb]"
                  }`}
                />
              </div>

              {/* Status Filter Dropdown matching Reference: [Filter icon] All Status ⌵ */}
              <div className="relative inline-flex items-center">
                <Filter className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <select
                  value={selectedStatus}
                  onChange={(e) => {
                    setSelectedStatus(e.target.value);
                    setCurrentPage(1);
                  }}
                  className={`w-full sm:w-auto pl-8.5 pr-8 py-1.5 rounded-xl text-xs font-semibold outline-none border transition cursor-pointer appearance-none ${
                    isDark
                      ? "bg-[#091328] border-[#15254a] text-slate-200"
                      : "bg-white border-[#dce8f8] text-slate-700"
                  }`}
                >
                  <option value="All Status">All Status</option>
                  <option value="Present">Present</option>
                  <option value="Absent">Absent</option>
                  <option value="Late">Leave / Late</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Start Date Filter */}
              <div className="flex items-center gap-1.5 w-full sm:w-auto">
                <span className="text-[11px] font-semibold text-slate-400 shrink-0">From:</span>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => {
                    setStartDate(e.target.value);
                    setCurrentPage(1);
                  }}
                  title="Start Date"
                  aria-label="Start Date"
                  className={`w-full sm:w-auto px-2.5 py-1.5 rounded-xl text-xs font-semibold outline-none border transition cursor-pointer min-h-[38px] ${
                    isDark
                      ? "bg-[#091328] border-[#15254a] text-slate-200"
                      : "bg-white border-[#dce8f8] text-slate-700"
                  }`}
                />
              </div>

              {/* End Date Filter */}
              <div className="flex items-center gap-1.5 w-full sm:w-auto">
                <span className="text-[11px] font-semibold text-slate-400 shrink-0">To:</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => {
                    setEndDate(e.target.value);
                    setCurrentPage(1);
                  }}
                  title="End Date"
                  aria-label="End Date"
                  className={`w-full sm:w-auto px-2.5 py-1.5 rounded-xl text-xs font-semibold outline-none border transition cursor-pointer min-h-[38px] ${
                    isDark
                      ? "bg-[#091328] border-[#15254a] text-slate-200"
                      : "bg-white border-[#dce8f8] text-slate-700"
                  }`}
                />
              </div>

              {/* Reset Filters if any active */}
              {(startDate || endDate || selectedStatus !== "All Status" || searchQuery) && (
                <button
                  type="button"
                  onClick={() => {
                    setStartDate("");
                    setEndDate("");
                    setSelectedStatus("All Status");
                    setSearchQuery("");
                    setCurrentPage(1);
                  }}
                  className="px-2.5 py-1.5 rounded-xl text-xs font-semibold text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition flex items-center gap-1 shrink-0"
                  title="Reset Filters"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              )}
            </div>
          </div>

          {/* Table Container */}
          {filteredHistory.length === 0 ? (
            <div className="py-12 text-center text-xs font-medium text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
              No attendance records found matching the filter criteria.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs min-w-[620px]">
                <thead>
                  <tr className="bg-[#f8faff] dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800 text-slate-400 font-bold uppercase text-[11px]">
                    <th className="py-3 px-3.5 w-12 text-center">#</th>
                    <th className="py-3 px-4">Date &amp; Time</th>
                    <th className="py-3 px-4">Class / Topic</th>
                    <th className="py-3 px-4">Module</th>
                    <th className="py-3 px-4">Trainer</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-3.5 w-10 text-center"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                  {paginatedHistory.map((item, idx) => (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-50/50 dark:hover:bg-slate-900/40 transition"
                    >
                      <td className="py-4 px-3.5 text-center font-semibold text-slate-500">
                        {(currentPage - 1) * pageSize + idx + 1}
                      </td>

                      <td className="py-4 px-4 font-medium">
                        <div className={`text-xs font-bold ${isDark ? "text-white" : "text-[#0a1b39]"}`}>
                          {item.date}
                        </div>
                        <span className="text-[11px] text-slate-400 block mt-0.5">
                          {item.time}
                        </span>
                      </td>

                      <td className={`py-4 px-4 font-bold text-xs ${isDark ? "text-white" : "text-[#0a1b39]"}`}>
                        {item.topic}
                      </td>

                      <td className="py-4 px-4 font-normal text-slate-500 dark:text-slate-400 text-xs">
                        {item.module}
                      </td>

                      <td className={`py-4 px-4 font-bold text-xs uppercase ${isDark ? "text-white" : "text-[#0a1b39]"}`}>
                        {item.trainer}
                      </td>

                      <td className="py-4 px-4">
                        {item.status === "Present" ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#ecfdf5] dark:bg-emerald-950/40 text-[#10b981] border border-emerald-500/20">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
                            Present
                          </span>
                        ) : item.status === "Absent" ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#fff1f2] dark:bg-rose-950/40 text-[#f43f5e] border border-rose-500/20">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#f43f5e]" />
                            Absent
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#fffbeb] dark:bg-amber-950/40 text-[#f59e0b] border border-amber-500/20">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#f59e0b]" />
                            {item.status === "Late" ? "Late" : "Leave"}
                          </span>
                        )}
                      </td>

                      <td className="py-4 px-3.5 text-center">
                        <button
                          type="button"
                          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
                          aria-label="Actions"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
              <span className="text-[11px] text-slate-400 font-medium">
                Page {currentPage} of {totalPages} ({filteredHistory.length} items)
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
    </DashboardLayout>
  );
}
