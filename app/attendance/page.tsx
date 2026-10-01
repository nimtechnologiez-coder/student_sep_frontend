"use client";

import React, { useState, useMemo } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useTheme } from "@/components/ThemeProvider";
import styles from "./attendance.module.css";
import {
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  ArrowUp,
  BookOpen,
  User,
} from "lucide-react";

// ============================================================================
// Types
// ============================================================================
export type AttendanceStatus = "Present" | "Absent" | "Late" | "Scheduled";

export interface AttendanceHistoryItem {
  id: string;
  date: string;
  time: string;
  topic: string;
  module: string;
  trainer: string;
  status: "Present" | "Absent" | "Late";
}

export interface UpcomingClassItem {
  id: string;
  dayNumber: string;
  monthName: string;
  dayOfWeek: string;
  topic: string;
  time: string;
  module: string;
  trainer: string;
  status: "Present" | "Scheduled";
}

export default function AttendancePage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Filter & Pagination States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedModule, setSelectedModule] = useState("All Modules");
  const [selectedStatus, setSelectedStatus] = useState("All Status");
  const [trendTimeframe, setTrendTimeframe] = useState("Last 8 Weeks");
  const [calendarMonth, setCalendarMonth] = useState("September 2026");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  // Interactive Hover Tooltip States
  const [isGaugeHovered, setIsGaugeHovered] = useState(false);
  const [hoveredBreakdown, setHoveredBreakdown] = useState<{
    status: string;
    count: number;
    percentage: string;
    color: string;
  } | null>(null);
  const [hoveredTrend, setHoveredTrend] = useState<{
    week: string;
    shortWeek: string;
    cx: number;
    cy: number;
    percentage: number;
    totalClasses: number;
    present: number;
    late: number;
    absent: number;
  } | null>(null);

  // ============================================================================
  // Core Dataset (12 Sessions for September 2026)
  // ============================================================================
  const historyRecords: AttendanceHistoryItem[] = [
    {
      id: "cls-1",
      date: "Tue, 22 Sep 2026",
      time: "10:00 AM – 1:00 PM",
      topic: "Scaled Dot-Product Attention & Multi-Head Projections",
      module: "MOD-4.3",
      trainer: "Priya Sharma",
      status: "Present",
    },
    {
      id: "cls-2",
      date: "Mon, 21 Sep 2026",
      time: "10:00 AM – 1:00 PM",
      topic: "Recurrent Neural Networks (RNN) to LSTMs & GRUs",
      module: "MOD-4.3",
      trainer: "Rahul Mehta",
      status: "Present",
    },
    {
      id: "cls-3",
      date: "Sat, 19 Sep 2026",
      time: "10:00 AM – 1:00 PM",
      topic: "Vector Search Implementation with Cosine Similarity",
      module: "MOD-4.2",
      trainer: "Amit Verma",
      status: "Present",
    },
    {
      id: "cls-4",
      date: "Thu, 17 Sep 2026",
      time: "10:00 AM – 1:00 PM",
      topic: "Training Word Embeddings with Negative Sampling",
      module: "MOD-4.2",
      trainer: "Neha Kapoor",
      status: "Absent",
    },
    {
      id: "cls-5",
      date: "Tue, 15 Sep 2026",
      time: "10:00 AM – 1:00 PM",
      topic: "Transformer Architecture Overview",
      module: "MOD-4.1",
      trainer: "Vikram Singh",
      status: "Present",
    },
    {
      id: "cls-6",
      date: "Mon, 14 Sep 2026",
      time: "10:00 AM – 1:00 PM",
      topic: "Text Preprocessing Pipelines & Byte-Pair Encoding (BPE)",
      module: "MOD-4.1",
      trainer: "Priya Sharma",
      status: "Present",
    },
    {
      id: "cls-7",
      date: "Fri, 11 Sep 2026",
      time: "10:00 AM – 1:00 PM",
      topic: "Language Modeling Objectives, Perplexity & N-Grams",
      module: "MOD-4.1",
      trainer: "Amit Verma",
      status: "Present",
    },
    {
      id: "cls-8",
      date: "Wed, 09 Sep 2026",
      time: "10:00 AM – 1:00 PM",
      topic: "TF-IDF Vector Space Models & High-Dimensional Sparsity",
      module: "MOD-4.1",
      trainer: "Priya Sharma",
      status: "Present",
    },
    {
      id: "cls-9",
      date: "Mon, 07 Sep 2026",
      time: "10:00 AM – 1:00 PM",
      topic: "Morphology, Lemmatization & POS Tagging Foundations",
      module: "MOD-4.1",
      trainer: "Rahul Mehta",
      status: "Late",
    },
    {
      id: "cls-10",
      date: "Fri, 04 Sep 2026",
      time: "10:00 AM – 1:00 PM",
      topic: "Introduction to NLP Pipeline Architecture",
      module: "MOD-4.1",
      trainer: "Priya Sharma",
      status: "Present",
    },
    {
      id: "cls-11",
      date: "Wed, 02 Sep 2026",
      time: "10:00 AM – 1:00 PM",
      topic: "Tokenization Standards & Vocabulary Normalization",
      module: "MOD-4.1",
      trainer: "Amit Verma",
      status: "Present",
    },
    {
      id: "cls-12",
      date: "Tue, 01 Sep 2026",
      time: "10:00 AM – 1:00 PM",
      topic: "Cohort Orientation & Month 4 Masterclass Kickoff",
      module: "MOD-4.1",
      trainer: "Priya Sharma",
      status: "Present",
    },
  ];

  const upcomingClasses: UpcomingClassItem[] = [
    {
      id: "up-1",
      dayNumber: "09",
      monthName: "SEP",
      dayOfWeek: "TUE",
      topic: "TF-IDF Vector Space Models & High-Dimensional Sparsity",
      time: "10:00 AM – 1:00 PM",
      module: "MOD-4.1",
      trainer: "Priya Sharma",
      status: "Present",
    },
    {
      id: "up-2",
      dayNumber: "11",
      monthName: "SEP",
      dayOfWeek: "THU",
      topic: "Sequence Models & Attention",
      time: "10:00 AM – 1:00 PM",
      module: "MOD-4.2",
      trainer: "Rahul Mehta",
      status: "Scheduled",
    },
    {
      id: "up-3",
      dayNumber: "15",
      monthName: "SEP",
      dayOfWeek: "MON",
      topic: "Transformer Architecture Overview",
      time: "10:00 AM – 1:00 PM",
      module: "MOD-4.3",
      trainer: "Vikram Singh",
      status: "Scheduled",
    },
  ];

  // Filtered History
  const filteredHistory = useMemo(() => {
    return historyRecords.filter((rec) => {
      if (selectedModule !== "All Modules" && rec.module !== selectedModule) {
        return false;
      }
      if (selectedStatus !== "All Status" && rec.status !== selectedStatus) {
        return false;
      }
      if (searchQuery.trim() !== "") {
        const q = searchQuery.toLowerCase();
        const matchesTopic = rec.topic.toLowerCase().includes(q);
        const matchesTrainer = rec.trainer.toLowerCase().includes(q);
        if (!matchesTopic && !matchesTrainer) return false;
      }
      return true;
    });
  }, [historyRecords, selectedModule, selectedStatus, searchQuery]);

  // Pagination Calculations
  const totalPages = Math.max(1, Math.ceil(filteredHistory.length / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, filteredHistory.length);
  const paginatedRecords = filteredHistory.slice(startIndex, startIndex + pageSize);

  const handleModuleChange = (val: string) => {
    setSelectedModule(val);
    setCurrentPage(1);
  };

  const handleStatusChange = (val: string) => {
    setSelectedStatus(val);
    setCurrentPage(1);
  };

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    setCurrentPage(1);
  };

  // Overall Attendance Donut SVG calculations
  const gaugeRadius = 38;
  const gaugeCircumference = 2 * Math.PI * gaugeRadius; // ~238.76
  const gaugeOffset = gaugeCircumference * (1 - 0.92);

  // Breakdown Donut SVG calculations (Total: 48 classes -> Present: 43, Late: 2, Absent: 3)
  const breakdownRadius = 40;
  const breakdownCircumference = 2 * Math.PI * breakdownRadius; // ~251.32
  const presentArc = (43 / 48) * breakdownCircumference;
  const lateArc = (2 / 48) * breakdownCircumference;
  const absentArc = (3 / 48) * breakdownCircumference;

  // Trend Chart Weekly Data Points with Complete Hover Tooltip Metrics
  const trendDataPoints = [
    { week: "Week 1", shortWeek: "W1", cx: 15, cy: 66, percentage: 28, totalClasses: 6, present: 2, late: 0, absent: 4 },
    { week: "Week 2", shortWeek: "W2", cx: 61, cy: 50, percentage: 48, totalClasses: 6, present: 3, late: 0, absent: 3 },
    { week: "Week 3", shortWeek: "W3", cx: 106, cy: 34, percentage: 67, totalClasses: 6, present: 4, late: 0, absent: 2 },
    { week: "Week 4", shortWeek: "W4", cx: 152, cy: 34, percentage: 67, totalClasses: 6, present: 4, late: 1, absent: 1 },
    { week: "Week 5", shortWeek: "W5", cx: 198, cy: 20, percentage: 85, totalClasses: 6, present: 5, late: 0, absent: 1 },
    { week: "Week 6", shortWeek: "W6", cx: 244, cy: 30, percentage: 73, totalClasses: 6, present: 4, late: 1, absent: 1 },
    { week: "Week 7", shortWeek: "W7", cx: 289, cy: 20, percentage: 85, totalClasses: 6, present: 5, late: 0, absent: 1 },
    { week: "Week 8", shortWeek: "W8", cx: 335, cy: 12, percentage: 95, totalClasses: 6, present: 6, late: 0, absent: 0 },
  ];

  return (
    <DashboardLayout>
      <div className={styles.container}>
        {/* ====================================================================
            PAGE HEADER: Attendance Title & Month Selector Pill
            ==================================================================== */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-1">
          <div>
            <h1 className={`text-2xl font-bold tracking-tight ${isDark ? "text-white" : "text-[#0a1b39]"}`}>
              Attendance
            </h1>
            <p className={`text-xs sm:text-sm mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
              Track your class attendance, monitor your progress, and stay on track for placement eligibility.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <div className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-sm transition ${
              isDark ? "bg-[#0b152d] border-[#15254a] text-slate-300" : "bg-white border-[#e2edf8] text-slate-700 hover:border-blue-300"
            }`}>
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <span>{calendarMonth}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </div>
          </div>
        </div>

        {/* ====================================================================
            ROW 1: 4 STAT SUMMARY CARDS
            ==================================================================== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Total Classes */}
          <div className={styles.statCard}>
            <div className={styles.iconBoxBlue}>
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block leading-tight">
                Total Classes
              </span>
              <span className={`text-2xl font-bold tracking-tight block mt-0.5 ${isDark ? "text-white" : "text-[#0a1b39]"}`}>
                48
              </span>
              <span className="text-[11px] text-slate-400 dark:text-slate-500 block">
                Program Cohort
              </span>
            </div>
          </div>

          {/* Card 2: Present */}
          <div className={styles.statCard}>
            <div className={styles.iconBoxGreen}>
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block leading-tight">
                Present
              </span>
              <span className="text-2xl font-bold tracking-tight block mt-0.5 text-emerald-600 dark:text-emerald-400">
                43
              </span>
              <span className="text-[11px] text-slate-400 dark:text-slate-500 block">
                89.6% Attendance
              </span>
            </div>
          </div>

          {/* Card 3: Absent */}
          <div className={styles.statCard}>
            <div className={styles.iconBoxRed}>
              <XCircle className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block leading-tight">
                Absent
              </span>
              <span className="text-2xl font-bold tracking-tight block mt-0.5 text-rose-600 dark:text-rose-400">
                3
              </span>
              <span className="text-[11px] text-slate-400 dark:text-slate-500 block">
                6.2% Unexcused
              </span>
            </div>
          </div>

          {/* Card 4: Late */}
          <div className={styles.statCard}>
            <div className={styles.iconBoxAmber}>
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block leading-tight">
                Late
              </span>
              <span className="text-2xl font-bold tracking-tight block mt-0.5 text-amber-600 dark:text-amber-400">
                2
              </span>
              <span className="text-[11px] text-slate-400 dark:text-slate-500 block">
                4.2% Tardy
              </span>
            </div>
          </div>
        </div>

        {/* ====================================================================
            ROW 2: OVERALL ATTENDANCE + COMPACT CALENDAR + BREAKDOWN
            ==================================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-stretch">
          {/* 1. Overall Attendance Card */}
          <div className={`${styles.card} p-5 flex flex-col justify-between`}>
            {/* Header: 3-bar indicator + Title + Good Standing Badge */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex items-end gap-[3px] h-5 py-0.5">
                  <span className="w-1.5 h-3 bg-[#0066fe] rounded-full" />
                  <span className="w-1.5 h-5 bg-[#0066fe] rounded-full" />
                  <span className="w-1.5 h-3.5 bg-[#0066fe] rounded-full" />
                </div>
                <h2 className={`text-base font-bold tracking-tight ${isDark ? "text-white" : "text-[#0a1b39]"}`}>
                  Overall Attendance
                </h2>
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#e8faf0] dark:bg-emerald-950/50 text-[#059669] dark:text-emerald-300 font-semibold text-xs border border-[#c6f6d5] dark:border-emerald-800/40">
                <span className="w-4 h-4 rounded-full bg-[#10b981] flex items-center justify-center text-white shrink-0">
                  <svg className="w-2.5 h-2.5 stroke-[3]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
                <span>Good Standing</span>
              </div>
            </div>

            {/* Middle: Gauge + Stats */}
            <div className="flex items-center gap-5 my-auto py-2">
              {/* Circular Gauge with Interactive Hover Tooltip */}
              <div
                className="relative flex items-center justify-center w-28 h-28 shrink-0 cursor-pointer group"
                onMouseEnter={() => setIsGaugeHovered(true)}
                onMouseLeave={() => setIsGaugeHovered(false)}
              >
                {/* Floating Tooltip */}
                {isGaugeHovered && (
                  <div className="absolute -top-24 left-1/2 -translate-x-1/2 z-30 pointer-events-none w-48 p-2.5 rounded-xl bg-slate-900/95 dark:bg-[#060d1e]/95 text-white shadow-xl backdrop-blur-sm border border-slate-700/60 text-xs transition-all duration-150">
                    <div className="flex items-center justify-between border-b border-slate-700/60 pb-1 mb-1.5">
                      <span className="font-bold text-slate-200">Overall Attendance</span>
                      <span className="font-black text-[#38bdf8] text-xs">92%</span>
                    </div>
                    <div className="space-y-1 text-[11px]">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Attended Classes:</span>
                        <span className="font-bold text-emerald-400">43</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Total Classes:</span>
                        <span className="font-bold text-white">48</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Minimum Required:</span>
                        <span className="font-bold text-blue-400">85%</span>
                      </div>
                    </div>
                    {/* Pointer triangle */}
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 dark:bg-[#060d1e] border-r border-b border-slate-700/60 rotate-45" />
                  </div>
                )}

                <svg className="w-28 h-28 transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r={gaugeRadius}
                    stroke={isDark ? "#15254a" : "#edf2f7"}
                    strokeWidth="11"
                    fill="transparent"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r={gaugeRadius}
                    stroke="#0066fe"
                    strokeWidth={isGaugeHovered ? "13" : "11"}
                    strokeDasharray={gaugeCircumference}
                    strokeDashoffset={gaugeOffset}
                    strokeLinecap="round"
                    fill="transparent"
                    className="transition-all duration-300 ease-out"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                  <span className={`text-2xl font-black ${isDark ? "text-white" : "text-[#0a1b39]"}`}>
                    92%
                  </span>
                  <span className="text-[11px] font-semibold text-slate-400 mt-0.5">
                    On Track
                  </span>
                </div>
              </div>

              {/* Status Details */}
              <div className="flex flex-col justify-center flex-1 min-w-0">
                <div className={`text-2xl font-black tracking-tight ${isDark ? "text-white" : "text-[#0a1b39]"}`}>
                  43 / 48
                </div>
                <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">
                  Classes Attended
                </div>

                <div className="text-xs font-bold text-[#0066fe] dark:text-blue-400 mt-3">
                  Minimum Required: 85%
                </div>

                {/* Horizontal Progress Bar */}
                <div className="flex items-center gap-2.5 mt-1.5">
                  <div className="h-2.5 flex-1 rounded-full bg-slate-100 dark:bg-[#15254a] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#0066fe] transition-all duration-700"
                      style={{ width: "92%" }}
                    />
                  </div>
                  <span className={`text-xs font-black shrink-0 ${isDark ? "text-white" : "text-[#0a1b39]"}`}>
                    92%
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Info Banner */}
            <div className={`rounded-xl px-3.5 py-2.5 flex items-center gap-2.5 ${
              isDark
                ? "bg-[#0c1836] border border-[#16274e] text-slate-300"
                : "bg-[#f0f6ff] border border-[#e0edff] text-slate-700"
            }`}>
              <Calendar className="w-4 h-4 text-[#0066fe] shrink-0" />
              <span className="text-xs leading-normal">
                You have attended <strong className={isDark ? "text-white font-bold" : "text-slate-900 font-bold"}>43</strong> out of <strong className={isDark ? "text-white font-bold" : "text-slate-900 font-bold"}>48</strong> scheduled classes.
              </span>
            </div>
          </div>

          {/* 2. Compact September 2026 Calendar */}
          <div className={`${styles.card} p-5 flex flex-col justify-between`}>
            {/* Calendar Month Header */}
            <div className="flex items-center justify-between">
              <button
                type="button"
                aria-label="Previous Month"
                className={`w-7 h-7 rounded-lg border flex items-center justify-center transition ${
                  isDark
                    ? "bg-[#0b152d] border-[#15254a] text-slate-400 hover:text-white"
                    : "bg-white border-slate-200 text-slate-500 hover:text-slate-800 shadow-sm"
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#0066fe]" />
                <h2 className={`text-sm font-bold ${isDark ? "text-white" : "text-[#0a1b39]"}`}>
                  September 2026
                </h2>
              </div>
              <button
                type="button"
                aria-label="Next Month"
                className={`w-7 h-7 rounded-lg border flex items-center justify-center transition ${
                  isDark
                    ? "bg-[#0b152d] border-[#15254a] text-slate-400 hover:text-white"
                    : "bg-white border-slate-200 text-slate-500 hover:text-slate-800 shadow-sm"
                }`}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Days of Week Header */}
            <div className="grid grid-cols-7 gap-1 text-center my-1.5">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day} className="text-[11px] font-semibold text-slate-400">
                  {day}
                </div>
              ))}
            </div>

            {/* Compact Days Grid */}
            <div className={styles.calendarGrid}>
              {/* Row 1: 30, 31 (Muted), 1 (Green), 2 (Green), 3 (Plain), 4 (Green), 5 (Plain) */}
              <div className={`${styles.calendarCell} ${styles.dayMuted}`}>30</div>
              <div className={`${styles.calendarCell} ${styles.dayMuted}`}>31</div>
              <div className={`${styles.calendarCell} ${styles.dayPresent}`}>1</div>
              <div className={`${styles.calendarCell} ${styles.dayPresent}`}>2</div>
              <div className={styles.calendarCell}>3</div>
              <div className={`${styles.calendarCell} ${styles.dayPresent}`}>4</div>
              <div className={styles.calendarCell}>5</div>

              {/* Row 2: 6, 7, 8, 9 (Green), 10, 11 (Green), 12 */}
              <div className={styles.calendarCell}>6</div>
              <div className={styles.calendarCell}>7</div>
              <div className={styles.calendarCell}>8</div>
              <div className={`${styles.calendarCell} ${styles.dayPresent}`}>9</div>
              <div className={styles.calendarCell}>10</div>
              <div className={`${styles.calendarCell} ${styles.dayPresent}`}>11</div>
              <div className={styles.calendarCell}>12</div>

              {/* Row 3: 13, 14, 15, 16, 17 (Red), 18, 19 */}
              <div className={styles.calendarCell}>13</div>
              <div className={styles.calendarCell}>14</div>
              <div className={styles.calendarCell}>15</div>
              <div className={styles.calendarCell}>16</div>
              <div className={`${styles.calendarCell} ${styles.dayAbsent}`}>17</div>
              <div className={styles.calendarCell}>18</div>
              <div className={styles.calendarCell}>19</div>

              {/* Row 4: 20, 21, 22, 23, 24, 25, 26 */}
              <div className={styles.calendarCell}>20</div>
              <div className={styles.calendarCell}>21</div>
              <div className={styles.calendarCell}>22</div>
              <div className={styles.calendarCell}>23</div>
              <div className={styles.calendarCell}>24</div>
              <div className={styles.calendarCell}>25</div>
              <div className={styles.calendarCell}>26</div>

              {/* Row 5: 27, 28, 29 (Solid Blue), 30 (Soft Blue), 1, 2, 3 (Muted) */}
              <div className={styles.calendarCell}>27</div>
              <div className={styles.calendarCell}>28</div>
              <div className={`${styles.calendarCell} ${styles.dayScheduledSolid}`}>29</div>
              <div className={`${styles.calendarCell} ${styles.dayScheduledSoft}`}>30</div>
              <div className={`${styles.calendarCell} ${styles.dayMuted}`}>1</div>
              <div className={`${styles.calendarCell} ${styles.dayMuted}`}>2</div>
              <div className={`${styles.calendarCell} ${styles.dayMuted}`}>3</div>
            </div>

            {/* Calendar Legend */}
            <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 px-1 pt-1 mt-auto">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#10b981]" />
                <span>Present</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#f59e0b]" />
                <span>Late</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#ef4444]" />
                <span>Absent</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#0066fe]" />
                <span>Scheduled</span>
              </div>
            </div>
          </div>

          {/* 3. Attendance Breakdown Donut Card */}
          <div className={`${styles.card} p-5 flex flex-col justify-between`}>
            {/* Header: Pie Chart Icon + Title */}
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-[#0066fe]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11 2v10h10C21 6.48 16.52 2 11 2z" />
                <path d="M9 4.09C4.94 4.8 2 8.35 2 12.5 2 17.75 6.25 22 11.5 22c4.15 0 7.7-2.94 8.41-7H9V4.09z" />
              </svg>
              <h2 className={`text-base font-bold tracking-tight ${isDark ? "text-white" : "text-[#0a1b39]"}`}>
                Attendance Breakdown
              </h2>
            </div>

            {/* Middle: Left Donut + Right 4 Stat Pills */}
            <div className="flex items-center gap-3.5 my-auto py-1">
              {/* Donut Chart with Interactive Hover Tooltip */}
              <div className="relative flex items-center justify-center w-28 h-28 sm:w-32 sm:h-32 shrink-0">
                {/* Floating Tooltip */}
                {hoveredBreakdown && (
                  <div className="absolute -top-14 left-1/2 -translate-x-1/2 z-30 pointer-events-none whitespace-nowrap px-3 py-1.5 rounded-xl bg-slate-900/95 dark:bg-[#060d1e]/95 text-white shadow-xl backdrop-blur-sm border border-slate-700/60 text-xs transition-all duration-150">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: hoveredBreakdown.color }}
                      />
                      <span className="font-bold">{hoveredBreakdown.status}:</span>
                      <span className="font-semibold text-slate-200">
                        {hoveredBreakdown.count} {hoveredBreakdown.count === 1 ? "Class" : "Classes"}
                      </span>
                      <span className="text-[11px] font-bold text-slate-400">
                        ({hoveredBreakdown.percentage})
                      </span>
                    </div>
                    {/* Pointer triangle */}
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 dark:bg-[#060d1e] border-r border-b border-slate-700/60 rotate-45" />
                  </div>
                )}

                <svg className="w-28 h-28 sm:w-32 sm:h-32 transform -rotate-90" viewBox="0 0 100 100">
                  {/* Background Track Circle */}
                  <circle
                    cx="50"
                    cy="50"
                    r={38}
                    stroke={isDark ? "#15254a" : "#f1f5f9"}
                    strokeWidth="11"
                    fill="transparent"
                  />
                  {/* Present Arc (Green: 43/48 = 89.6%) */}
                  <circle
                    cx="50"
                    cy="50"
                    r={38}
                    stroke="#00b074"
                    strokeWidth={hoveredBreakdown?.status === "Present" ? "14" : "11"}
                    strokeDasharray={`${(43 / 48) * (2 * Math.PI * 38) + 0.5} ${2 * Math.PI * 38}`}
                    strokeDashoffset="0"
                    fill="transparent"
                    className="cursor-pointer transition-all duration-200"
                    onMouseEnter={() =>
                      setHoveredBreakdown({
                        status: "Present",
                        count: 43,
                        percentage: "89.6%",
                        color: "#00b074",
                      })
                    }
                    onMouseLeave={() => setHoveredBreakdown(null)}
                  />
                  {/* Late Arc (Amber: 2/48 = 4.2%) */}
                  <circle
                    cx="50"
                    cy="50"
                    r={38}
                    stroke="#f59e0b"
                    strokeWidth={hoveredBreakdown?.status === "Late" ? "14" : "11"}
                    strokeDasharray={`${(2 / 48) * (2 * Math.PI * 38) + 0.5} ${2 * Math.PI * 38}`}
                    strokeDashoffset={`-${(43 / 48) * (2 * Math.PI * 38)}`}
                    fill="transparent"
                    className="cursor-pointer transition-all duration-200"
                    onMouseEnter={() =>
                      setHoveredBreakdown({
                        status: "Late",
                        count: 2,
                        percentage: "4.2%",
                        color: "#f59e0b",
                      })
                    }
                    onMouseLeave={() => setHoveredBreakdown(null)}
                  />
                  {/* Absent Arc (Rose: 3/48 = 6.2%) */}
                  <circle
                    cx="50"
                    cy="50"
                    r={38}
                    stroke="#ef4444"
                    strokeWidth={hoveredBreakdown?.status === "Absent" ? "14" : "11"}
                    strokeDasharray={`${(3 / 48) * (2 * Math.PI * 38) + 0.5} ${2 * Math.PI * 38}`}
                    strokeDashoffset={`-${((43 + 2) / 48) * (2 * Math.PI * 38)}`}
                    fill="transparent"
                    className="cursor-pointer transition-all duration-200"
                    onMouseEnter={() =>
                      setHoveredBreakdown({
                        status: "Absent",
                        count: 3,
                        percentage: "6.2%",
                        color: "#ef4444",
                      })
                    }
                    onMouseLeave={() => setHoveredBreakdown(null)}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                  <span className={`text-2xl font-black tracking-tight ${isDark ? "text-white" : "text-[#0a1b39]"}`}>
                    48
                  </span>
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider -mt-0.5">
                    Classes
                  </span>
                </div>
              </div>

              {/* 4 Stat Pills */}
              <div className="flex-1 flex flex-col justify-between gap-1.5 min-w-0">
                {/* 1. Present */}
                <div
                  className={`flex items-center justify-between px-3 py-1.5 rounded-xl border cursor-pointer transition-all ${
                    hoveredBreakdown?.status === "Present"
                      ? "ring-2 ring-emerald-500/40 scale-[1.02]"
                      : ""
                  } ${
                    isDark
                      ? "bg-emerald-950/30 border-emerald-800/30"
                      : "bg-[#edf9f0] border-[#d1fae5]/60"
                  }`}
                  onMouseEnter={() =>
                    setHoveredBreakdown({
                      status: "Present",
                      count: 43,
                      percentage: "89.6%",
                      color: "#00b074",
                    })
                  }
                  onMouseLeave={() => setHoveredBreakdown(null)}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#00b074] shrink-0" />
                    <span className={`text-xs font-semibold truncate ${isDark ? "text-slate-200" : "text-slate-700"}`}>
                      Present
                    </span>
                  </div>
                  <div className="text-right shrink-0 leading-tight pl-2">
                    <span className={`text-xs font-bold block ${isDark ? "text-white" : "text-slate-900"}`}>
                      43
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium block">
                      (89.6%)
                    </span>
                  </div>
                </div>

                {/* 2. Late */}
                <div
                  className={`flex items-center justify-between px-3 py-1.5 rounded-xl border cursor-pointer transition-all ${
                    hoveredBreakdown?.status === "Late"
                      ? "ring-2 ring-amber-500/40 scale-[1.02]"
                      : ""
                  } ${
                    isDark
                      ? "bg-amber-950/30 border-amber-800/30"
                      : "bg-[#fffbeb] border-[#fef3c7]/60"
                  }`}
                  onMouseEnter={() =>
                    setHoveredBreakdown({
                      status: "Late",
                      count: 2,
                      percentage: "4.2%",
                      color: "#f59e0b",
                    })
                  }
                  onMouseLeave={() => setHoveredBreakdown(null)}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b] shrink-0" />
                    <span className={`text-xs font-semibold truncate ${isDark ? "text-slate-200" : "text-slate-700"}`}>
                      Late
                    </span>
                  </div>
                  <div className="text-right shrink-0 leading-tight pl-2">
                    <span className={`text-xs font-bold block ${isDark ? "text-white" : "text-slate-900"}`}>
                      2
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium block">
                      (4.2%)
                    </span>
                  </div>
                </div>

                {/* 3. Absent */}
                <div
                  className={`flex items-center justify-between px-3 py-1.5 rounded-xl border cursor-pointer transition-all ${
                    hoveredBreakdown?.status === "Absent"
                      ? "ring-2 ring-rose-500/40 scale-[1.02]"
                      : ""
                  } ${
                    isDark
                      ? "bg-rose-950/30 border-rose-800/30"
                      : "bg-[#fff1f2] border-[#ffe4e6]/60"
                  }`}
                  onMouseEnter={() =>
                    setHoveredBreakdown({
                      status: "Absent",
                      count: 3,
                      percentage: "6.2%",
                      color: "#ef4444",
                    })
                  }
                  onMouseLeave={() => setHoveredBreakdown(null)}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#ef4444] shrink-0" />
                    <span className={`text-xs font-semibold truncate ${isDark ? "text-slate-200" : "text-slate-700"}`}>
                      Absent
                    </span>
                  </div>
                  <div className="text-right shrink-0 leading-tight pl-2">
                    <span className={`text-xs font-bold block ${isDark ? "text-white" : "text-slate-900"}`}>
                      3
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium block">
                      (6.2%)
                    </span>
                  </div>
                </div>

                {/* 4. Scheduled */}
                <div
                  className={`flex items-center justify-between px-3 py-1.5 rounded-xl border cursor-pointer transition-all ${
                    hoveredBreakdown?.status === "Scheduled"
                      ? "ring-2 ring-blue-500/40 scale-[1.02]"
                      : ""
                  } ${
                    isDark
                      ? "bg-blue-950/30 border-blue-800/30"
                      : "bg-[#f0f7ff] border-[#dbeafe]/60"
                  }`}
                  onMouseEnter={() =>
                    setHoveredBreakdown({
                      status: "Scheduled",
                      count: 0,
                      percentage: "0.0%",
                      color: "#0066fe",
                    })
                  }
                  onMouseLeave={() => setHoveredBreakdown(null)}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#0066fe] shrink-0" />
                    <span className={`text-xs font-semibold truncate ${isDark ? "text-slate-200" : "text-slate-700"}`}>
                      Scheduled
                    </span>
                  </div>
                  <div className="text-right shrink-0 leading-tight pl-2">
                    <span className={`text-xs font-bold block ${isDark ? "text-white" : "text-slate-900"}`}>
                      0
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium block">
                      (0.0%)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ====================================================================
            ROW 3: UPCOMING CLASSES + ATTENDANCE TREND
            ==================================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch">
          {/* 1. Upcoming Classes Card */}
          <div className={`${styles.card} p-5 flex flex-col justify-between`}>
            {/* Header */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#0066fe]" />
                <h2 className={`text-base font-bold ${isDark ? "text-white" : "text-[#0a1b39]"}`}>
                  Upcoming Classes
                </h2>
              </div>
              <button
                type="button"
                className="text-xs font-semibold text-[#0066fe] hover:underline flex items-center gap-0.5"
              >
                <span>View All</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* List of 3 Upcoming Classes */}
            <div className="divide-y divide-slate-100 dark:divide-[#15254a]">
              {upcomingClasses.map((item) => (
                <div key={item.id} className="py-3 first:pt-1 last:pb-1 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3.5 min-w-0">
                    {/* Date Block */}
                    <div className={`w-14 h-16 sm:w-16 sm:h-16 rounded-xl flex flex-col items-center justify-center shrink-0 border ${
                      isDark
                        ? "bg-[#0c1836] border-[#16274e]"
                        : "bg-[#f4f8fd] border-[#e2edff]"
                    }`}>
                      <span className={`text-lg sm:text-xl font-black leading-none ${isDark ? "text-white" : "text-[#0a1b39]"}`}>
                        {item.dayNumber}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase leading-tight mt-1">
                        {item.monthName}
                      </span>
                      <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase leading-tight">
                        {item.dayOfWeek}
                      </span>
                    </div>

                    {/* Topic and Details */}
                    <div className="min-w-0 flex-1">
                      <h3 className={`text-xs sm:text-sm font-bold truncate ${isDark ? "text-white" : "text-[#0a1b39]"}`}>
                        {item.topic}
                      </h3>
                      <div className="flex flex-wrap items-center gap-2 text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-1">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{item.time}</span>
                        </div>
                        <span className="text-slate-300 dark:text-slate-700">|</span>
                        <div className="flex items-center gap-1">
                          <BookOpen className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{item.module}</span>
                        </div>
                        <span className="text-slate-300 dark:text-slate-700">|</span>
                        <div className="flex items-center gap-1">
                          <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{item.trainer}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="shrink-0">
                    {item.status === "Present" ? (
                      <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#edf9f0] dark:bg-emerald-950/40 text-[#00b074] dark:text-emerald-400 border border-[#d1fae5] dark:border-emerald-800/40 text-xs font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#00b074] shrink-0" />
                        <span>Present</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#f0f7ff] dark:bg-blue-950/40 text-[#0066fe] dark:text-blue-400 border border-[#dbeafe] dark:border-blue-800/40 text-xs font-semibold">
                        <span className="w-2 h-2 rounded-full bg-[#0066fe] shrink-0" />
                        <span>Scheduled</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 2. Attendance Trend Card */}
          <div className={`${styles.card} p-5 flex flex-col justify-between`}>
            {/* Header: 3-bar indicator + Title + Dropdown */}
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <div className="flex items-end gap-[3px] h-5 py-0.5">
                  <span className="w-1.5 h-3 bg-[#0066fe] rounded-full" />
                  <span className="w-1.5 h-5 bg-[#0066fe] rounded-full" />
                  <span className="w-1.5 h-3.5 bg-[#0066fe] rounded-full" />
                </div>
                <h2 className={`text-base font-bold ${isDark ? "text-white" : "text-[#0a1b39]"}`}>
                  Attendance Trend
                </h2>
              </div>

              <div className="relative">
                <select
                  value={trendTimeframe}
                  onChange={(e) => setTrendTimeframe(e.target.value)}
                  className={styles.filterSelect}
                >
                  <option value="Last 8 Weeks">Last 8 Weeks</option>
                  <option value="Last 4 Weeks">Last 4 Weeks</option>
                  <option value="All Cohort">All Cohort</option>
                </select>
              </div>
            </div>

            {/* Smooth SVG Area Chart matching reference */}
            <div className="w-full my-2">
              {/* Chart Body: Y-Axis Column on Left + SVG Canvas on Right */}
              <div className="flex items-stretch gap-2.5 h-24">
                {/* Y-Axis Scale Labels */}
                <div className="flex flex-col justify-between text-[11px] text-slate-400 select-none text-right shrink-0 w-8 py-0.5 font-medium">
                  <span>100%</span>
                  <span>75%</span>
                  <span>50%</span>
                  <span>25%</span>
                  <span>0%</span>
                </div>

                {/* SVG Area Canvas */}
                <div className="flex-1 relative h-full">
                  {/* Floating Weekly Trend Tooltip */}
                  {hoveredTrend && (
                    <div
                      className="absolute z-30 pointer-events-none w-44 p-2 rounded-xl bg-slate-900/95 dark:bg-[#060d1e]/95 text-white shadow-2xl backdrop-blur-sm border border-slate-700/60 text-xs transition-all duration-150 animate-in fade-in zoom-in-95"
                      style={{
                        left: `${(hoveredTrend.cx / 350) * 100}%`,
                        top: `${(hoveredTrend.cy / 100) * 100}%`,
                        transform:
                          hoveredTrend.cx > 260
                            ? "translate(-88%, -118%)"
                            : hoveredTrend.cx < 90
                            ? "translate(-12%, -118%)"
                            : "translate(-50%, -118%)",
                      }}
                    >
                      <div className="flex items-center justify-between border-b border-slate-700/60 pb-1 mb-1">
                        <span className="font-bold text-slate-200">{hoveredTrend.week}</span>
                        <span className="font-black text-[#38bdf8] text-xs">{hoveredTrend.percentage}%</span>
                      </div>
                      <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 text-[10px]">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">Total:</span>
                          <span className="font-bold text-white">{hoveredTrend.totalClasses}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">Present:</span>
                          <span className="font-bold text-emerald-400">{hoveredTrend.present}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">Late:</span>
                          <span className="font-bold text-amber-400">{hoveredTrend.late}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">Absent:</span>
                          <span className="font-bold text-rose-400">{hoveredTrend.absent}</span>
                        </div>
                      </div>
                      {/* Pointer Arrow */}
                      <div
                        className="absolute -bottom-1 w-2 h-2 bg-slate-900 dark:bg-[#060d1e] border-r border-b border-slate-700/60 rotate-45"
                        style={{
                          left: hoveredTrend.cx > 260 ? "88%" : hoveredTrend.cx < 90 ? "12%" : "50%",
                          transform: "translateX(-50%) rotate(45deg)",
                        }}
                      />
                    </div>
                  )}

                  <svg
                    className="w-full h-full"
                    viewBox="0 0 350 100"
                    preserveAspectRatio="none"
                  >
                    <defs>
                      <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#0066fe" stopOpacity="0.22" />
                        <stop offset="100%" stopColor="#0066fe" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>

                    {/* Horizontal Dashed Grid lines */}
                    <line x1="0" y1="8" x2="350" y2="8" stroke={isDark ? "#15254a" : "#e2e8f0"} strokeWidth="1" strokeDasharray="3 3" />
                    <line x1="0" y1="28" x2="350" y2="28" stroke={isDark ? "#15254a" : "#e2e8f0"} strokeWidth="1" strokeDasharray="3 3" />
                    <line x1="0" y1="48" x2="350" y2="48" stroke={isDark ? "#15254a" : "#e2e8f0"} strokeWidth="1" strokeDasharray="3 3" />
                    <line x1="0" y1="68" x2="350" y2="68" stroke={isDark ? "#15254a" : "#e2e8f0"} strokeWidth="1" strokeDasharray="3 3" />
                    <line x1="0" y1="88" x2="350" y2="88" stroke={isDark ? "#15254a" : "#e2e8f0"} strokeWidth="1" strokeDasharray="3 3" />

                    {/* Gradient Area Fill */}
                    <path
                      d="M 15,66 L 61,50 L 106,34 L 152,34 L 198,20 L 244,30 L 289,20 L 335,12 L 335,88 L 15,88 Z"
                      fill="url(#trendGradient)"
                    />

                    {/* Trend Line */}
                    <path
                      d="M 15,66 L 61,50 L 106,34 L 152,34 L 198,20 L 244,30 L 289,20 L 335,12"
                      fill="none"
                      stroke="#0066fe"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />

                    {/* Hover Guideline */}
                    {hoveredTrend && (
                      <line
                        x1={hoveredTrend.cx}
                        y1={hoveredTrend.cy}
                        x2={hoveredTrend.cx}
                        y2={88}
                        stroke="#0066fe"
                        strokeWidth="1.5"
                        strokeDasharray="2 2"
                        opacity="0.6"
                      />
                    )}

                    {/* Data Points with Hit Target */}
                    {trendDataPoints.map((item, i) => (
                      <g key={i}>
                        {/* Invisible wider target for effortless hover */}
                        <circle
                          cx={item.cx}
                          cy={item.cy}
                          r="16"
                          fill="transparent"
                          className="cursor-pointer"
                          onMouseEnter={() => setHoveredTrend(item)}
                          onMouseLeave={() => setHoveredTrend(null)}
                        />
                        {/* Visible styled point */}
                        <circle
                          cx={item.cx}
                          cy={item.cy}
                          r={hoveredTrend?.shortWeek === item.shortWeek ? "5.5" : "3.5"}
                          fill={hoveredTrend?.shortWeek === item.shortWeek ? "#38bdf8" : "#0066fe"}
                          stroke="#ffffff"
                          strokeWidth={hoveredTrend?.shortWeek === item.shortWeek ? "2.5" : "1.5"}
                          className="pointer-events-none transition-all duration-150"
                        />
                      </g>
                    ))}
                  </svg>
                </div>
              </div>

              {/* X-Axis Labels Aligned Under Data Points */}
              <div className="flex text-[11px] text-slate-400 mt-1.5 select-none font-medium">
                {/* Spacer equal to Y-axis width (w-8) + gap (2.5 = 10px) */}
                <div className="w-[42px] shrink-0" />
                <div className="flex-1 flex justify-between px-1">
                  <span>W1</span>
                  <span>W2</span>
                  <span>W3</span>
                  <span>W4</span>
                  <span>W5</span>
                  <span>W6</span>
                  <span>W7</span>
                  <span>W8</span>
                </div>
              </div>
            </div>

            {/* Bottom 3 Summary Cards */}
            <div className="grid grid-cols-3 gap-2.5 pt-3 border-t border-slate-100 dark:border-[#15254a]">
              {/* Box 1: +5% */}
              <div className={`p-2.5 sm:p-3 rounded-xl flex items-center gap-2.5 sm:gap-3 border ${
                isDark
                  ? "bg-emerald-950/30 border-emerald-800/40"
                  : "bg-[#edf9f0] border-[#d1fae5]/60"
              }`}>
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#dcfce7] dark:bg-emerald-900/50 text-[#00b074] dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <ArrowUp className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs sm:text-sm font-black text-[#00b074] dark:text-emerald-400 leading-tight">
                    +5%
                  </div>
                  <div className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                    vs. last month
                  </div>
                </div>
              </div>

              {/* Box 2: 8 Weeks */}
              <div className={`p-2.5 sm:p-3 rounded-xl flex items-center gap-2.5 sm:gap-3 border ${
                isDark
                  ? "bg-blue-950/30 border-blue-800/40"
                  : "bg-[#f0f7ff] border-[#dbeafe]/60"
              }`}>
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#dbeafe] dark:bg-blue-900/50 text-[#0066fe] dark:text-blue-400 flex items-center justify-center shrink-0">
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="min-w-0">
                  <div className={`text-sm sm:text-base font-black leading-tight ${isDark ? "text-white" : "text-[#0a1b39]"}`}>
                    8
                  </div>
                  <div className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                    Weeks tracked
                  </div>
                </div>
              </div>

              {/* Box 3: 92% Average */}
              <div className={`p-2.5 sm:p-3 rounded-xl flex items-center gap-2.5 sm:gap-3 border ${
                isDark
                  ? "bg-purple-950/30 border-purple-800/40"
                  : "bg-[#faf5ff] border-[#f3e8ff]/60"
              }`}>
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#f3e8ff] dark:bg-purple-900/50 text-[#a855f7] dark:text-purple-400 flex items-center justify-center shrink-0">
                  <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
                </div>
                <div className="min-w-0">
                  <div className={`text-sm sm:text-base font-black leading-tight ${isDark ? "text-white" : "text-[#0a1b39]"}`}>
                    92%
                  </div>
                  <div className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                    Average
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ====================================================================
            ROW 4: ATTENDANCE HISTORY TABLE WITH PAGINATION
            ==================================================================== */}
        <div className={`${styles.card} p-5 space-y-3`}>
          {/* Table Header and Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h2 className={`text-base font-bold ${isDark ? "text-white" : "text-[#0a1b39]"}`}>
              Attendance History
            </h2>

            <div className="flex flex-wrap items-center gap-2">
              {/* Search Bar */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search topic or trainer..."
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className={`text-xs pl-8 pr-2.5 py-1.5 rounded-lg border outline-none w-48 transition ${
                    isDark
                      ? "bg-[#0b152d] border-[#15254a] text-white placeholder-slate-500 focus:border-[#0062eb]"
                      : "bg-white border-[#e2edf8] text-slate-800 placeholder-slate-400 focus:border-[#0062eb]"
                  }`}
                />
              </div>

              {/* Module Filter */}
              <select
                value={selectedModule}
                onChange={(e) => handleModuleChange(e.target.value)}
                className={styles.filterSelect}
              >
                <option value="All Modules">All Modules</option>
                <option value="MOD-4.3">MOD-4.3</option>
                <option value="MOD-4.2">MOD-4.2</option>
                <option value="MOD-4.1">MOD-4.1</option>
              </select>

              {/* Status Filter */}
              <select
                value={selectedStatus}
                onChange={(e) => handleStatusChange(e.target.value)}
                className={styles.filterSelect}
              >
                <option value="All Status">All Status</option>
                <option value="Present">Present</option>
                <option value="Absent">Absent</option>
                <option value="Late">Late</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className={styles.tableWrapper}>
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className={isDark ? "text-slate-400" : "text-slate-500"}>
                  <th className="py-2.5 px-3 font-semibold border-b border-slate-100 dark:border-[#15254a]">
                    Date &amp; Time
                  </th>
                  <th className="py-2.5 px-3 font-semibold border-b border-slate-100 dark:border-[#15254a]">
                    Class / Topic
                  </th>
                  <th className="py-2.5 px-3 font-semibold border-b border-slate-100 dark:border-[#15254a] text-center">
                    Module
                  </th>
                  <th className="py-2.5 px-3 font-semibold border-b border-slate-100 dark:border-[#15254a]">
                    Trainer
                  </th>
                  <th className="py-2.5 px-3 font-semibold border-b border-slate-100 dark:border-[#15254a] text-center">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedRecords.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-400">
                      No attendance records found matching filters.
                    </td>
                  </tr>
                ) : (
                  paginatedRecords.map((rec) => (
                    <tr key={rec.id} className={styles.tableRow}>
                      {/* Date & Time */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <div className={`font-bold ${isDark ? "text-slate-200" : "text-[#0a1b39]"}`}>
                          {rec.date}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          {rec.time}
                        </div>
                      </td>

                      {/* Topic */}
                      <td className="py-3 px-3 font-medium text-slate-800 dark:text-slate-200">
                        {rec.topic}
                      </td>

                      {/* Module */}
                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        <span className="inline-block px-2 py-0.5 rounded text-[11px] font-bold bg-blue-50 text-[#0062eb] dark:bg-blue-950/40 dark:text-blue-300 border border-blue-100 dark:border-blue-900">
                          {rec.module}
                        </span>
                      </td>

                      {/* Trainer */}
                      <td className="py-3 px-3 whitespace-nowrap text-slate-600 dark:text-slate-300">
                        {rec.trainer}
                      </td>

                      {/* Status */}
                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        {rec.status === "Present" && (
                          <span className={styles.statusPillPresent}>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                            Present
                          </span>
                        )}
                        {rec.status === "Absent" && (
                          <span className={styles.statusPillAbsent}>
                            <XCircle className="w-3.5 h-3.5 text-rose-500" />
                            Absent
                          </span>
                        )}
                        {rec.status === "Late" && (
                          <span className={styles.statusPillScheduled}>
                            <Clock className="w-3.5 h-3.5 text-amber-500" />
                            Late
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer with Pagination (View All Attendance removed) */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-[#15254a]">
            <span>
              Showing {filteredHistory.length === 0 ? 0 : startIndex + 1}–{endIndex} of {filteredHistory.length} classes
            </span>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center gap-1.5 self-center sm:self-auto">
                {/* Previous Page Button */}
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className={styles.paginationBtn}
                  aria-label="Previous Page"
                  title="Previous Page"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>

                {/* Numbered Page Buttons */}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    type="button"
                    onClick={() => setCurrentPage(pageNum)}
                    className={`${styles.paginationBtn} ${currentPage === pageNum ? styles.active : ""}`}
                  >
                    {pageNum}
                  </button>
                ))}

                {/* Next Page Button */}
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className={styles.paginationBtn}
                  aria-label="Next Page"
                  title="Next Page"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
