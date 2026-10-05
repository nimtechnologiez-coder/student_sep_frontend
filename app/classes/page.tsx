"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import DashboardLayout from "@/components/DashboardLayout";
import { useTheme } from "@/components/ThemeProvider";
import styles from "./classes.module.css";
import { StudentApi } from "@/lib/studentApi";
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  Video,
  ChevronLeft,
  ChevronRight,
  Check,
  ArrowRight,
  ArrowLeft,
  X,
  ExternalLink,
  Search,
  FileText,
  Code2,
  Download,
  Play,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Layers,
  Laptop,
  BookOpen,
  List as ListIcon,
  Sparkles,
  Info,
  Loader2,
} from "lucide-react";

export type ClassStatus = "Live" | "Scheduled" | "Completed" | "Missed";
export type ClassMode = "Live Online" | "Classroom Lab" | "Hybrid";
export type AttendanceStatus = "Present" | "Missed" | "Late" | "Upcoming";
export type FilterTab = "All" | "Upcoming" | "Completed" | "Missed";
export type ViewMode = "list" | "calendar";

export interface ClassItem {
  id: string;
  topic: string;
  moduleCode: string;
  moduleTitle: string;
  date: string;
  dayNumber: number;
  monthName: string;
  weekday: string;
  formattedDate: string;
  time: string;
  duration: string;
  trainer: string;
  trainerRole: string;
  mode: ClassMode;
  locationOrPlatform: string;
  meetingUrl?: string;
  status: ClassStatus;
  attendance: AttendanceStatus;
  isToday?: boolean;
  description: string;
  agenda?: { time: string; title: string; desc: string }[];
  materials?: {
    slidesName?: string;
    slidesUrl?: string;
    notebookName?: string;
    notebookUrl?: string;
    recordingDuration?: string;
    recordingUrl?: string;
  };
}

export default function ClassesPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // State Management
  const [activeTab, setActiveTab] = useState<FilterTab>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<number>(new Date().getDate());
  const [selectedClassForModal, setSelectedClassForModal] = useState<ClassItem | null>(null);
  const [hasJoinedLive, setHasJoinedLive] = useState<boolean>(false);

  // Dynamic Student & Classes API State
  const [student, setStudent] = useState<any>(null);
  const [kpi, setKpi] = useState<any>(null);
  const [classesList, setClassesList] = useState<ClassItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    setIsLoading(true);

    Promise.all([
      StudentApi.getDashboard(),
      StudentApi.getClasses(),
    ])
      .then(([dashData, classesData]) => {
        if (dashData?.student) {
          setStudent(dashData.student);
        }
        if (dashData?.kpi) {
          setKpi(dashData.kpi);
        }

        if (classesData?.classes && Array.isArray(classesData.classes)) {
          const todayIso = new Date().toISOString().split("T")[0];
          const mapped: ClassItem[] = classesData.classes.map((c: any) => {
            const dateObj = c.date ? new Date(c.date) : new Date();
            const isTodayClass = c.date === todayIso;

            return {
              id: String(c.id),
              topic: c.subject || "Session Topic",
              moduleCode: "CLASS",
              moduleTitle: c.batch_name || dashData?.student?.batch || "Scheduled Batch",
              date: c.date || todayIso,
              dayNumber: dateObj.getDate() || 1,
              monthName: dateObj.toLocaleString("default", { month: "short" }).toUpperCase(),
              weekday: dateObj.toLocaleString("default", { weekday: "long" }),
              formattedDate: c.date_str || c.date || "Scheduled Date",
              time: c.end_time ? `${c.time} – ${c.end_time}` : c.time || "Scheduled Time",
              duration: c.duration || "90 Mins",
              trainer: c.trainer_name || "Assigned Mentor",
              trainerRole: "Batch Faculty Mentor",
              mode: c.mode === "Online" ? "Live Online" : "Classroom Lab",
              locationOrPlatform: c.meeting_link ? "Google Meet" : "Campus Interactive Lab",
              meetingUrl: c.meeting_link || "",
              status: c.status === "Live Now" ? "Live" : c.status === "Past" ? "Completed" : "Scheduled",
              attendance: c.status === "Past" ? "Present" : "Upcoming",
              isToday: isTodayClass,
              description: c.description || "Interactive session with hands-on exercises.",
              agenda: [],
            };
          });
          setClassesList(mapped);
        } else {
          setClassesList([]);
        }
      })
      .catch((err) => {
        console.error("Classes API error:", err);
        setClassesList([]);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  // Filtered lists derived purely from real API data
  const todayClass = useMemo(
    () => classesList.find((c) => c.status === "Live" || c.isToday),
    [classesList]
  );

  const upcomingClasses = useMemo(
    () => classesList.filter((c) => c.status === "Scheduled"),
    [classesList]
  );

  const completedClasses = useMemo(
    () => classesList.filter((c) => c.status === "Completed"),
    [classesList]
  );

  const missedClasses = useMemo(
    () => classesList.filter((c) => c.status === "Missed" || c.attendance === "Missed"),
    [classesList]
  );

  // Filtered dataset for Active Tab and Search Query
  const filteredClasses = useMemo(() => {
    let result = classesList;

    // Apply Filter Tab
    if (activeTab === "Upcoming") {
      result = result.filter((c) => c.status === "Scheduled" || c.status === "Live");
    } else if (activeTab === "Completed") {
      result = result.filter((c) => c.status === "Completed");
    } else if (activeTab === "Missed") {
      result = result.filter((c) => c.status === "Missed" || c.attendance === "Missed");
    }

    // Apply Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (c) =>
          c.topic.toLowerCase().includes(q) ||
          c.moduleTitle.toLowerCase().includes(q) ||
          c.trainer.toLowerCase().includes(q) ||
          c.formattedDate.toLowerCase().includes(q)
      );
    }

    return result;
  }, [classesList, activeTab, searchQuery]);

  // Calendar dates for Current Month
  const calendarDays = useMemo(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const totalDays = new Date(year, month + 1, 0).getDate();
    const days = [];
    for (let i = 1; i <= totalDays; i++) {
      days.push({
        num: i,
        isCurrentMonth: true,
        isToday: i === now.getDate(),
      });
    }
    return days;
  }, []);

  const selectedDateClass = useMemo(() => {
    return classesList.find((c) => c.dayNumber === selectedCalendarDate);
  }, [classesList, selectedCalendarDate]);

  const totalCompletedPast = completedClasses.length + missedClasses.length;
  const attendanceRate =
    totalCompletedPast > 0
      ? Math.round((completedClasses.length / totalCompletedPast) * 100)
      : (kpi?.attendance_pct ?? 0);

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-[#0062eb]" />
          <span className="ml-3 text-sm font-semibold text-slate-500">Loading class schedule...</span>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className={styles.container}>
        {/* =========================================================================
            1. CLEAN ACADEMIC PAGE HEADER (Real Student Course & Program)
            ========================================================================= */}
        <section className={styles.headerCard}>
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-1.5 max-w-3xl">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-black uppercase tracking-wider text-[#0062eb] bg-blue-500/10 px-2.5 py-0.5 rounded-full border border-blue-500/20">
                  Live Cohort Schedule
                </span>
                <span className={`text-xs font-semibold ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                  {student?.course || "Academic Program"} {student?.batch ? `• ${student.batch}` : ""}
                </span>
              </div>

              <h1
                className={`text-2xl sm:text-3xl font-black tracking-tight leading-tight ${
                  isDark ? "text-white" : "text-[#0a1b39]"
                }`}
              >
                Classes
              </h1>

              <p
                className={`text-xs sm:text-sm leading-relaxed ${
                  isDark ? "text-slate-300" : "text-slate-600 font-medium"
                }`}
              >
                Attend interactive live masterclasses, hands-on lab sessions, review session archives, and track your attendance progression.
              </p>
            </div>

            {/* Attendance & Today's Schedule Card */}
            <div
              className={`p-4 rounded-xl border flex items-center gap-5 shrink-0 ${
                isDark
                  ? "bg-[#091328] border-[#15254a]"
                  : "bg-slate-50 border-[#dce8f8]"
              }`}
            >
              <div>
                <span className="text-[11px] font-semibold text-slate-400 block">Attendance Rate</span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span
                    className={`text-xl sm:text-2xl font-black ${
                      attendanceRate >= 75
                        ? isDark ? "text-emerald-400" : "text-emerald-600"
                        : "text-[#0062eb]"
                    }`}
                  >
                    {attendanceRate}%
                  </span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                </div>
                <span className="text-[10px] text-slate-400 font-medium">
                  {kpi?.sessions_summary || `${completedClasses.length} sessions attended`}
                </span>
              </div>

              <div className={`w-px h-10 ${isDark ? "bg-slate-800" : "bg-slate-200"}`} />

              <div>
                <span className="text-[11px] font-semibold text-slate-400 block">Today&apos;s Class</span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-xs sm:text-sm font-black text-[#0062eb]">
                    {todayClass ? todayClass.time : "No session today"}
                  </span>
                  {todayClass && <span className={styles.liveDot} />}
                </div>
                <span
                  className={`text-[10px] font-semibold ${
                    todayClass
                      ? isDark ? "text-emerald-400" : "text-emerald-600"
                      : "text-slate-400"
                  }`}
                >
                  {todayClass ? "Live Stream Ready" : "Schedule clear"}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            2. CLASS TIMETABLE CONTROLS & FILTERS (Layout Preserved)
            ========================================================================= */}
            {/* Filter Tabs & Search Bar */}
            <section
              className={`p-4 rounded-2xl border flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 ${
                isDark ? "bg-[#081024] border-[#15274d]" : "bg-white border-[#e2edf8] shadow-xs"
              }`}
            >
              {/* Filter Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
                {(
                  [
                    { id: "All", label: "All Classes", count: classesList.length },
                    { id: "Upcoming", label: "Upcoming", count: upcomingClasses.length + (todayClass ? 1 : 0) },
                    { id: "Completed", label: "Completed", count: completedClasses.length },
                    { id: "Missed", label: "Missed", count: missedClasses.length },
                  ] as const
                ).map((tab) => {
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`${styles.filterPill} ${isActive ? styles.active : ""}`}
                    >
                      <span>{tab.label}</span>
                      <span
                        className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                          isActive
                            ? "bg-white/20 text-white"
                            : isDark
                            ? "bg-slate-800 text-slate-400"
                            : "bg-slate-100 text-slate-600 border border-slate-200"
                        }`}
                      >
                        {tab.count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Search Input & View Switcher */}
              <div className="flex items-center gap-3">
                <div className="relative flex-1 md:w-64">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search topic, trainer..."
                    className={`w-full pl-8 pr-7 py-2 rounded-xl text-xs outline-none border transition ${
                      isDark
                        ? "bg-[#091328] border-[#15254a] text-white placeholder-slate-500 focus:border-[#0062eb]"
                        : "bg-[#f8fbff] border-[#dce8f8] text-[#0a1b39] placeholder-slate-400 focus:border-[#0062eb]"
                    }`}
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div
                  className={`p-1 rounded-xl border flex items-center shrink-0 ${
                    isDark ? "bg-[#091328] border-[#15254a]" : "bg-slate-100 border-slate-200"
                  }`}
                >
                  <button
                    onClick={() => setViewMode("list")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                      viewMode === "list"
                        ? "bg-[#0062eb] text-white shadow-xs"
                        : isDark
                        ? "text-slate-400 hover:text-white"
                        : "text-slate-600 hover:text-[#0a1b39]"
                    }`}
                  >
                    <ListIcon className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">List</span>
                  </button>

                  <button
                    onClick={() => setViewMode("calendar")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                      viewMode === "calendar"
                        ? "bg-[#0062eb] text-white shadow-xs"
                        : isDark
                        ? "text-slate-400 hover:text-white"
                        : "text-slate-600 hover:text-[#0a1b39]"
                    }`}
                  >
                    <CalendarIcon className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Calendar</span>
                  </button>
                </div>
              </div>
            </section>

            {/* List View */}
            {viewMode === "list" ? (
              <div className="space-y-6">
                {classesList.length === 0 ? (
                  <div className="py-16 sm:py-20 px-6 text-center flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40">
                    <div className="w-14 h-14 rounded-2xl bg-blue-500/10 text-[#0062eb] flex items-center justify-center mb-3.5">
                      <Video className="w-7 h-7 stroke-[2]" />
                    </div>
                    <h3 className={`text-base sm:text-lg font-bold ${isDark ? "text-white" : "text-[#0a1b39]"}`}>
                      No Active Class Schedule
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-400 mt-1.5 max-w-md">
                      There are currently no scheduled classes or lab sessions for <strong className={isDark ? "text-slate-300" : "text-slate-700"}>{student?.batch || "your batch"}</strong>. Your upcoming timetable will appear here once published by your trainer.
                    </p>
                  </div>
                ) : (
                  <>
                {/* Today's Live Class (Hero Card) */}
                {todayClass && (activeTab === "All" || activeTab === "Upcoming") && (
                  <section className={styles.todayHeroCard}>
                    <div className="p-6 sm:p-7 space-y-5">
                      <div className="flex items-center justify-between gap-3 flex-wrap">
                        <div className="flex items-center gap-2">
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black border shadow-xs ${
                              isDark
                                ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                                : "bg-emerald-50 text-emerald-700 border-emerald-200"
                            }`}
                          >
                            <span className={styles.liveDot} />
                            TODAY&apos;S LIVE CLASS
                          </span>
                        </div>

                        <div
                          className={`flex items-center gap-2 text-xs font-semibold ${
                            isDark ? "text-slate-400" : "text-slate-500"
                          }`}
                        >
                          <CalendarIcon className="w-4 h-4 text-[#0062eb]" />
                          <span>{todayClass.formattedDate}</span>
                        </div>
                      </div>

                      <div>
                        <h2
                          className={`text-xl sm:text-2xl font-black tracking-tight leading-tight ${
                            isDark ? "text-white" : "text-[#0a1b39]"
                          }`}
                        >
                          {todayClass.topic}
                        </h2>
                        {todayClass.description && (
                          <p
                            className={`text-xs sm:text-sm mt-1.5 leading-relaxed ${
                              isDark ? "text-slate-300" : "text-slate-600 font-medium"
                            }`}
                          >
                            {todayClass.description}
                          </p>
                        )}
                      </div>

                      {/* Meta Pill Grid */}
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        <div
                          className={`p-3 rounded-xl border flex items-center gap-2.5 ${
                            isDark ? "bg-[#0c1836] border-[#182a52]" : "bg-white border-blue-100 shadow-2xs"
                          }`}
                        >
                          <Clock className="w-4 h-4 text-[#0062eb] shrink-0" />
                          <div>
                            <span className="text-[10px] text-slate-400 block font-semibold">Time &amp; Duration</span>
                            <span className={`text-xs font-bold ${isDark ? "text-white" : "text-[#0a1b39]"}`}>
                              {todayClass.time}
                            </span>
                          </div>
                        </div>

                        <div
                          className={`p-3 rounded-xl border flex items-center gap-2.5 ${
                            isDark ? "bg-[#0c1836] border-[#182a52]" : "bg-white border-blue-100 shadow-2xs"
                          }`}
                        >
                          <User className="w-4 h-4 text-emerald-500 shrink-0" />
                          <div>
                            <span className="text-[10px] text-slate-400 block font-semibold">Trainer</span>
                            <span className={`text-xs font-bold ${isDark ? "text-white" : "text-[#0a1b39]"}`}>
                              {todayClass.trainer}
                            </span>
                          </div>
                        </div>

                        <div
                          className={`p-3 rounded-xl border flex items-center gap-2.5 ${
                            isDark ? "bg-[#0c1836] border-[#182a52]" : "bg-white border-blue-100 shadow-2xs"
                          }`}
                        >
                          <Laptop className="w-4 h-4 text-indigo-500 shrink-0" />
                          <div>
                            <span className="text-[10px] text-slate-400 block font-semibold">Mode</span>
                            <span className={`text-xs font-bold ${isDark ? "text-white" : "text-[#0a1b39]"}`}>
                              {todayClass.mode}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* CTA Join Class */}
                      <div className="flex items-center justify-end gap-3 pt-2">
                        {todayClass.meetingUrl ? (
                          <a
                            href={todayClass.meetingUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => setHasJoinedLive(true)}
                            className="px-6 py-2.5 rounded-xl bg-[#0062eb] hover:bg-[#0052cc] text-white text-xs sm:text-sm font-bold shadow-lg shadow-blue-600/30 transition flex items-center gap-2 active:scale-95 cursor-pointer"
                          >
                            <Video className="w-4 h-4" />
                            <span>{hasJoinedLive ? "Rejoin Class" : "Join Class"}</span>
                            <ArrowRight className="w-4 h-4" />
                          </a>
                        ) : (
                          <button
                            onClick={() => setSelectedClassForModal(todayClass)}
                            className="px-5 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-xs font-bold"
                          >
                            View Details
                          </button>
                        )}
                      </div>
                    </div>
                  </section>
                )}

                {/* Upcoming Classes Section */}
                {upcomingClasses.length > 0 && (activeTab === "All" || activeTab === "Upcoming") && (
                  <section className="space-y-3">
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-[#0062eb]" />
                      Upcoming Classes ({upcomingClasses.length})
                    </h3>

                    <div className="space-y-2.5">
                      {upcomingClasses.map((cls) => (
                        <div
                          key={cls.id}
                          className={`${styles.card} p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4`}
                        >
                          <div className="flex items-start gap-4 min-w-0">
                            <div className={styles.dateBox}>
                              <span className="text-xs font-black text-[#0062eb]">{cls.dayNumber}</span>
                              <span className="text-[10px] font-bold text-slate-400">{cls.monthName}</span>
                            </div>

                            <div className="min-w-0">
                              <h4 className={`text-sm sm:text-base font-bold truncate ${isDark ? "text-white" : "text-[#0a1b39]"}`}>
                                {cls.topic}
                              </h4>
                              <p className="text-xs text-slate-400 mt-0.5">
                                {cls.formattedDate} • {cls.time} • Trainer: <strong className="text-slate-300">{cls.trainer}</strong>
                              </p>
                            </div>
                          </div>

                          <button
                            onClick={() => setSelectedClassForModal(cls)}
                            className="shrink-0 px-4 py-2 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-800 hover:border-[#0062eb] text-[#0062eb] transition"
                          >
                            View Class Details
                          </button>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* Completed Classes Section */}
                {completedClasses.length > 0 && (activeTab === "All" || activeTab === "Completed") && (
                  <section className="space-y-3">
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      Recent Classes &amp; Attendance ({completedClasses.length})
                    </h3>

                    <div className="space-y-2.5">
                      {completedClasses.map((cls) => (
                        <div
                          key={cls.id}
                          className={`${styles.card} p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4`}
                        >
                          <div className="flex items-start gap-4 min-w-0">
                            <div className={styles.dateBox}>
                              <span className="text-xs font-black text-emerald-600">{cls.dayNumber}</span>
                              <span className="text-[10px] font-bold text-slate-400">{cls.monthName}</span>
                            </div>

                            <div className="min-w-0">
                              <h4 className={`text-sm sm:text-base font-bold truncate ${isDark ? "text-white" : "text-[#0a1b39]"}`}>
                                {cls.topic}
                              </h4>
                              <p className="text-xs text-slate-400 mt-0.5">
                                {cls.formattedDate} • {cls.time} • Trainer: {cls.trainer}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                              Attended
                            </span>
                            <button
                              onClick={() => setSelectedClassForModal(cls)}
                              className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-400 hover:text-white"
                            >
                              Details
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                )}
                  </>
                )}
              </div>
            ) : (
              /* Calendar View */
              <div className="space-y-4">
                <div className={`${styles.card} p-5`}>
                  <div className="grid grid-cols-7 gap-2">
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                      <div key={day} className="text-center text-xs font-bold text-slate-400 py-2">
                        {day}
                      </div>
                    ))}
                    {calendarDays.map((day) => {
                      const hasClass = classesList.some((c) => c.dayNumber === day.num);
                      const isSelected = selectedCalendarDate === day.num;

                      return (
                        <button
                          key={day.num}
                          onClick={() => setSelectedCalendarDate(day.num)}
                          className={`p-3 rounded-xl border text-center transition flex flex-col items-center justify-center cursor-pointer ${
                            isSelected
                              ? "bg-[#0062eb] text-white border-[#0062eb]"
                              : hasClass
                              ? "bg-blue-500/10 border-blue-500/30 text-[#0062eb]"
                              : isDark
                              ? "border-slate-800 text-slate-400"
                              : "border-slate-200 text-slate-600"
                          }`}
                        >
                          <span className="text-sm font-bold">{day.num}</span>
                          {hasClass && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {selectedDateClass && (
                  <div className={`${styles.card} p-5 flex items-center justify-between`}>
                    <div>
                      <h4 className="text-sm font-bold">{selectedDateClass.topic}</h4>
                      <p className="text-xs text-slate-400">{selectedDateClass.time} • Trainer: {selectedDateClass.trainer}</p>
                    </div>
                    <button
                      onClick={() => setSelectedClassForModal(selectedDateClass)}
                      className="px-4 py-2 rounded-xl bg-[#0062eb] text-white text-xs font-bold"
                    >
                      Class Details
                    </button>
                  </div>
                )}
              </div>
            )}

        {/* Modal: Class Details */}
        {selectedClassForModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
            <div
              className={`w-full max-w-lg rounded-2xl p-6 border shadow-2xl space-y-4 animate-in zoom-in-95 ${
                isDark
                  ? "bg-[#0b1429] border-[#1e3363] text-white"
                  : "bg-white border-[#dce8f8] text-[#0a1b39]"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-blue-500/15 text-[#0062eb]">
                    {selectedClassForModal.mode}
                  </span>
                  <h3 className="text-base font-bold leading-snug mt-1.5">
                    {selectedClassForModal.topic}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {selectedClassForModal.formattedDate} • {selectedClassForModal.time}
                  </p>
                </div>

                <button
                  onClick={() => setSelectedClassForModal(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div
                className={`p-3.5 rounded-xl border text-xs leading-relaxed ${
                  isDark
                    ? "bg-[#070e1f] border-[#152345] text-slate-300"
                    : "bg-[#f8fbff] border-[#e2edf8] text-slate-700"
                }`}
              >
                {selectedClassForModal.description}
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-800">
                  <span className="text-slate-400">Trainer</span>
                  <strong className="font-semibold">{selectedClassForModal.trainer}</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-800">
                  <span className="text-slate-400">Batch</span>
                  <strong className="font-semibold">{selectedClassForModal.moduleTitle}</strong>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Location / Platform</span>
                  <strong className="font-semibold">{selectedClassForModal.locationOrPlatform}</strong>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  onClick={() => setSelectedClassForModal(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 cursor-pointer"
                >
                  Close
                </button>
                {selectedClassForModal.meetingUrl && (
                  <a
                    href={selectedClassForModal.meetingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2 rounded-xl bg-[#0062eb] hover:bg-[#0052cc] text-white text-xs font-bold transition flex items-center gap-1.5"
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>Join Class</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
