"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import DashboardLayout from "@/components/DashboardLayout";
import { useTheme } from "@/components/ThemeProvider";
import styles from "./curriculum.module.css";
import { StudentApi } from "@/lib/studentApi";
import { CurriculumPageSkeleton } from "@/components/Skeleton";
import {
  BookOpen,
  CheckCircle2,
  Clock,
  ArrowRight,
  Search,
  Check,
  Circle,
  Play,
  Lock,
  Sparkles,
  X,
  Loader2,
  Calendar,
} from "lucide-react";

// Curriculum Types matching database models
export type TopicStatus = "Completed" | "In Progress" | "Upcoming" | "Not Started" | "Active";
export type ModuleStatus = "Completed" | "In Progress" | "Available" | "Locked" | "Upcoming" | "Not Started";
export type MonthStatus = "Completed" | "Current" | "Upcoming" | "In Progress" | "Not Started";

export interface TopicItem {
  id: string;
  title: string;
  type?: string;
  duration?: string;
  status: TopicStatus;
  description?: string;
}

export interface ModuleItem {
  id: string;
  title: string;
  description?: string;
  status: ModuleStatus;
  progress?: number;
  topics: TopicItem[];
}

export interface MonthData {
  monthNumber: number;
  title: string;
  duration?: string;
  status: MonthStatus;
  description?: string;
  modules: ModuleItem[];
}

export default function CurriculumPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [student, setStudent] = useState<any>(null);
  const [kpi, setKpi] = useState<any>(null);
  const [curriculumData, setCurriculumData] = useState<MonthData[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isTogglingTopic, setIsTogglingTopic] = useState<boolean>(false);

  // Lesson detail modal state
  const [activeTopic, setActiveTopic] = useState<{
    topic: TopicItem;
    moduleTitle: string;
    monthTitle: string;
  } | null>(null);

  const loadCurriculumData = () => {
    setIsLoading(true);

    const sid = (typeof window !== "undefined" ? localStorage.getItem("parent_selected_child_id") || "" : "");
    const currUrl = sid
      ? `https://student-sep-backend.onrender.com/api/curriculum/get/?student_id=${sid}`
      : "https://student-sep-backend.onrender.com/api/curriculum/get/";

    Promise.all([
      StudentApi.getDashboard(),
      fetch(currUrl)
        .then((res) => {
          if (!res.ok) throw new Error("Failed to load");
          return res.json();
        })
        .catch(() => ({ curriculum: [] }))
    ])
      .then(([dashData, currData]) => {
        if (dashData?.student) {
          setStudent(dashData.student);
        }
        if (dashData?.kpi) {
          setKpi(dashData.kpi);
        }

        const months = currData?.curriculum || [];
        setCurriculumData(months);
        if (months.length > 0) {
          setSelectedMonth(months[0].monthNumber);
        } else {
          setSelectedMonth(1);
        }
      })
      .catch((err) => {
        console.error("Error loading curriculum:", err);
        setCurriculumData([]);
        setSelectedMonth(1);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    loadCurriculumData();

    const handleProgressUpdated = () => {
      loadCurriculumData();
    };
    window.addEventListener("student_progress_updated", handleProgressUpdated);
    return () => {
      window.removeEventListener("student_progress_updated", handleProgressUpdated);
    };
  }, []);

  const handleToggleTopic = async (topicId: string, markCompleted: boolean) => {
    setIsTogglingTopic(true);
    try {
      const res = await StudentApi.completeTopic(topicId, markCompleted, student?.student_id);
      if (res && (res.success || res.status === "success")) {
        setCurriculumData((prevMonths) =>
          prevMonths.map((m) => ({
            ...m,
            modules: m.modules.map((mod) => {
              const updatedTopics = mod.topics.map((t) => {
                if (t.id === topicId) {
                  return {
                    ...t,
                    status: (markCompleted ? "Completed" : "In Progress") as TopicStatus,
                  };
                }
                return t;
              });
              const allDone = updatedTopics.length > 0 && updatedTopics.every((t) => t.status === "Completed");
              return {
                ...mod,
                status: (allDone ? "Completed" : mod.status) as ModuleStatus,
                topics: updatedTopics,
              };
            }),
          }))
        );

        if (activeTopic) {
          setActiveTopic({
            ...activeTopic,
            topic: {
              ...activeTopic.topic,
              status: (markCompleted ? "Completed" : "In Progress") as TopicStatus,
            },
          });
        }

        if (res.kpi) {
          setKpi(res.kpi);
        }

        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event("student_progress_updated"));
        }
      }
    } catch (err) {
      console.error("Failed to toggle topic completion:", err);
    } finally {
      setIsTogglingTopic(false);
    }
  };

  const activeCurriculum = useMemo(() => {
    return curriculumData;
  }, [curriculumData]);

  // Overall statistics calculated strictly from real database data
  const totalMonths = activeCurriculum.length;
  const completedMonths = activeCurriculum.filter((m) => m.status === "Completed").length;
  const totalModules = activeCurriculum.reduce((acc, m) => acc + (m.modules?.length || 0), 0);
  const completedModules = activeCurriculum.reduce(
    (acc, m) =>
      acc +
      (m.modules || []).filter((mod) => {
        const tops = mod.topics || [];
        return mod.status === "Completed" || (tops.length > 0 && tops.every((t) => t.status === "Completed"));
      }).length,
    0
  );
  const totalTopics = activeCurriculum.reduce(
    (acc, m) => acc + (m.modules || []).reduce((mAcc, mod) => mAcc + (mod.topics?.length || 0), 0),
    0
  );
  const completedTopics = activeCurriculum.reduce(
    (acc, m) =>
      acc +
      (m.modules || []).reduce(
        (mAcc, mod) => mAcc + (mod.topics || []).filter((t) => t.status === "Completed").length,
        0
      ),
    0
  );

  const calculatedProgress =
    totalTopics > 0
      ? Math.round((completedTopics / totalTopics) * 100)
      : (kpi?.course_progress_pct ?? 0);

  // Active month data if a specific month is selected
  const currentMonthData = useMemo(() => {
    if (!activeCurriculum || activeCurriculum.length === 0) return null;
    return activeCurriculum.find((m) => m.monthNumber === selectedMonth) || activeCurriculum[0];
  }, [activeCurriculum, selectedMonth]);

  if (isLoading) {
    return (
      <DashboardLayout>
        <CurriculumPageSkeleton />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className={styles.container}>
        {/* =========================================================================
            1. ACADEMIC ROADMAP HEADER (Real Student Course & Program)
            ========================================================================= */}
        <section className={styles.headerCard}>
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-1.5 max-w-3xl">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-black uppercase tracking-wider text-[#0062eb] bg-blue-500/10 px-2.5 py-0.5 rounded-full border border-blue-500/20">
                  Course Curriculum
                </span>
                <span className={`text-xs font-semibold ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                  {student?.course || "Academic Program"} {student?.batch ? `• ${student.batch}` : ""}
                </span>
              </div>

              <h1
                className={`text-2xl sm:text-3xl font-black tracking-tight leading-tight ${isDark ? "text-white" : "text-[#0a1b39]"
                  }`}
              >
                Curriculum Roadmap
              </h1>

              <p
                className={`text-xs sm:text-sm leading-relaxed ${isDark ? "text-slate-300" : "text-slate-600 font-medium"
                  }`}
              >
                Your structured learning pathway, lecture modules, and hands-on lessons.
              </p>
            </div>

            {/* Overall Course Progress Box & Action */}
            <div
              className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 lg:gap-5 shrink-0 ${isDark ? "bg-[#0b1429] border-[#182952]" : "bg-slate-50 border-slate-200"
                }`}
            >
              <div className="w-full sm:w-auto">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className={`font-semibold ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                    Overall Course Progress
                  </span>
                  <span className="font-black text-[#0062eb]">{calculatedProgress}%</span>
                </div>
                <div className="w-full sm:w-48 h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-600 to-indigo-500 rounded-full transition-all duration-500"
                    style={{ width: `${calculatedProgress}%` }}
                  />
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  {totalMonths > 0 ? `${completedMonths} of ${totalMonths} Months Completed` : "No active modules"}
                </span>
              </div>

              <Link
                href="/classes"
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#0062eb] hover:bg-[#0052cc] text-white text-xs font-bold transition shadow-md shadow-blue-600/25 flex items-center justify-center gap-1.5 shrink-0 active:scale-95 min-h-[40px]"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Class Schedule</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </section>

        {/* =========================================================================
            2. PROGRAM CURRICULUM ROADMAP
            ========================================================================= */}
        {activeCurriculum.length === 0 ? (
          <div className="py-16 px-6 text-center flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40">
            <div className="w-14 h-14 rounded-2xl bg-blue-500/10 text-[#0062eb] flex items-center justify-center mb-3">
              <BookOpen className="w-7 h-7 stroke-[2]" />
            </div>
            <h3 className={`text-lg font-bold ${isDark ? "text-white" : "text-[#0a1b39]"}`}>
              Curriculum Roadmap
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-md">
              Your course curriculum will appear here as modules and lessons are scheduled.
            </p>
          </div>
        ) : (
          <>
            {/* Search & Quick Filter Row */}
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search lessons and topics..."
                  className={`w-full pl-9 pr-8 py-2.5 rounded-xl text-xs outline-none border transition ${isDark
                      ? "bg-[#0b1429] border-[#182952] text-white placeholder-slate-500 focus:border-[#0062eb]"
                      : "bg-white border-[#dce8f8] text-[#0a1b39] placeholder-slate-400 focus:border-[#0062eb]"
                    }`}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-semibold">
                  {totalMonths} Months • {totalModules} Modules
                </span>
              </div>
            </div>

            {/* Month Selector Navigation Bar */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-slate-400">
                  Select Month
                </span>
                <span className="text-xs font-semibold text-[#0062eb]">
                  Viewing Month {selectedMonth} of {totalMonths}
                </span>
              </div>

              <div className="grid grid-cols-1 min-[360px]:grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-2.5">
                {activeCurriculum.map((m) => {
                  const isSelected = selectedMonth === m.monthNumber;
                  const isDone = m.status === "Completed";
                  const isCurrent = m.status === "Current" || m.status === "In Progress";

                  return (
                    <button
                      key={m.monthNumber}
                      onClick={() => {
                        setSelectedMonth(m.monthNumber);
                        setSearchQuery("");
                      }}
                      className={`p-3 rounded-xl border text-left transition flex flex-col justify-between cursor-pointer gap-2 ${isSelected
                          ? "bg-[#0062eb] text-white border-[#0062eb] shadow-md shadow-blue-600/25 ring-2 ring-blue-400/40"
                          : isDark
                            ? "bg-[#0b1429] border-[#182952] text-slate-300 hover:border-[#0062eb]/60"
                            : "bg-white border-slate-200 text-[#0a1b39] hover:border-blue-300 shadow-xs"
                        }`}
                    >
                      <div className="flex items-center justify-between gap-1 w-full">
                        <span
                          className={`text-[11px] font-black uppercase tracking-wider ${isSelected ? "text-blue-100" : isDone ? "text-emerald-500" : isCurrent ? "text-[#0062eb]" : isDark ? "text-slate-400" : "text-slate-500"
                            }`}
                        >
                          Month {m.monthNumber}
                        </span>
                        <span
                          className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded-full ${isSelected
                              ? "bg-white/20 text-white"
                              : isDone
                                ? "bg-emerald-500/10 text-emerald-600"
                                : isCurrent
                                  ? "bg-blue-500/10 text-[#0062eb]"
                                  : "bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                            }`}
                        >
                          {isDone ? "Completed" : isCurrent ? "Active" : "Upcoming"}
                        </span>
                      </div>

                      <div className="text-xs font-bold leading-snug line-clamp-1">
                        {m.title}
                      </div>

                      <div className="text-[10px] text-slate-400 mt-auto pt-1 font-semibold flex items-center justify-between w-full">
                        <span>Modules</span>
                        <span className="font-bold">{m.modules?.length || 0}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Focused Month Banner */}
            {currentMonthData && !searchQuery && (
              <div
                className={`p-5 sm:p-6 rounded-2xl border transition-all ${isDark ? "bg-[#081226] border-[#16274d]" : "bg-gradient-to-r from-blue-50/70 via-indigo-50/40 to-white border-blue-100 shadow-xs"
                  }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                  <div className="space-y-2 max-w-2xl">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="px-3 py-0.5 rounded-lg text-xs font-black bg-[#0062eb] text-white">
                        Month {currentMonthData.monthNumber}
                      </span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${currentMonthData.status === "Completed"
                            ? "bg-emerald-500/15 text-emerald-600 border-emerald-500/30"
                            : currentMonthData.status === "Current" || currentMonthData.status === "In Progress"
                              ? "bg-blue-500/15 text-[#0062eb] border-blue-500/30"
                              : "bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border-slate-300 dark:border-slate-700"
                          }`}
                      >
                        {currentMonthData.status === "Completed" ? "Completed" : currentMonthData.status === "Current" || currentMonthData.status === "In Progress" ? "In Progress" : "Upcoming"}
                      </span>
                    </div>

                    <h2 className={`text-xl sm:text-2xl font-black ${isDark ? "text-white" : "text-[#0a1b39]"}`}>
                      {currentMonthData.title}
                    </h2>

                    {currentMonthData.description && (
                      <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                        {currentMonthData.description}
                      </p>
                    )}
                  </div>

                  {/* Month KPI Badges */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 shrink-0">
                    <div className={`p-3 rounded-xl border text-center ${isDark ? "bg-[#0c1836] border-[#192b57]" : "bg-white border-blue-100 shadow-2xs"}`}>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Modules</span>
                      <span className={`text-base font-black ${isDark ? "text-white" : "text-[#0a1b39]"}`}>{currentMonthData.modules?.length || 0}</span>
                    </div>
                    <div className={`p-3 rounded-xl border text-center ${isDark ? "bg-[#0c1836] border-[#192b57]" : "bg-white border-blue-100 shadow-2xs"}`}>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Lessons</span>
                      <span className={`text-base font-black ${isDark ? "text-white" : "text-[#0a1b39]"}`}>
                        {(currentMonthData.modules || []).reduce((acc, m) => acc + (m.topics?.length || 0), 0)}
                      </span>
                    </div>
                    <div className={`p-3 rounded-xl border text-center ${isDark ? "bg-[#0c1836] border-[#192b57]" : "bg-white border-blue-100 shadow-2xs"}`}>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Status</span>
                      <span className="text-xs font-black text-[#0062eb]">
                        {currentMonthData.status === "Completed" ? "Completed" : currentMonthData.status === "Current" || currentMonthData.status === "In Progress" ? "Active" : "Upcoming"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Modules Display Grid */}
            <div className="space-y-12">
              {activeCurriculum
                .filter((m) => m.monthNumber === selectedMonth || searchQuery.trim().length > 0)
                .map((month) => {
                  const monthModules = (month.modules || []).filter((m) =>
                    !searchQuery ||
                    m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    (m.topics || []).some((t) => t.title.toLowerCase().includes(searchQuery.toLowerCase()))
                  );

                  return (
                    <section key={month.monthNumber} className="space-y-5">
                      {/* Month Group Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-200/80 dark:border-slate-800 gap-2">
                        <div className="space-y-0.5">
                          <span className="text-[11px] font-black uppercase tracking-wider text-[#0062eb]">
                            MONTH {month.monthNumber}
                          </span>
                          <h2 className={`text-xl font-black ${isDark ? "text-white" : "text-[#0a1b39]"}`}>
                            {month.title}
                          </h2>
                        </div>

                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${month.status === "Completed"
                                ? "bg-emerald-500/15 text-emerald-600 border-emerald-500/30"
                                : month.status === "Current" || month.status === "In Progress"
                                  ? "bg-blue-500/15 text-[#0062eb] border-blue-500/30"
                                  : "bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border-slate-300 dark:border-slate-700"
                              }`}
                          >
                            {month.status === "Completed" ? "Completed" : month.status === "Current" || month.status === "In Progress" ? "In Progress" : "Upcoming"}
                          </span>
                          <span className="text-xs text-slate-400 font-semibold">
                            {month.modules?.length || 0} Modules
                          </span>
                        </div>
                      </div>

                      {monthModules.length === 0 ? (
                        <div className="py-12 sm:py-16 px-6 text-center flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40">
                          <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-[#0062eb] flex items-center justify-center mb-3">
                            <BookOpen className="w-6 h-6 stroke-[2]" />
                          </div>
                          <h3 className={`text-base font-bold ${isDark ? "text-white" : "text-[#0a1b39]"}`}>
                            No modules scheduled yet
                          </h3>
                          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-md">
                            Lessons and modules for Month {month.monthNumber} will appear here as your classes are scheduled.
                          </p>
                        </div>
                      ) : (
                        /* Modules Grid */
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
                          {monthModules.map((module) => {
                            const topicsList = module.topics || [];
                            const totalLessons = topicsList.length;
                            const completedCount = topicsList.filter((t) => t.status === "Completed").length;

                            const isCompletedModule =
                              module.status === "Completed" || (totalLessons > 0 && completedCount === totalLessons);
                            const isLockedModule =
                              module.status === "Locked" || (month.status === "Upcoming" && month.monthNumber > 1 && completedCount === 0);
                            const isAvailableModule = !isCompletedModule && !isLockedModule;

                            const progressPct =
                              totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

                            return (
                              <div
                                key={module.id}
                                className={`${styles.card} p-5 sm:p-6 flex flex-col justify-between h-full transition-all ${isAvailableModule ? "border-blue-200 dark:border-blue-900/50" : ""
                                  }`}
                              >
                                <div className="space-y-4">
                                  {/* Header: Module Title and Status Badge */}
                                  <div className="flex items-start justify-between gap-3">
                                    <div className="space-y-1 flex-1 min-w-0">
                                      <h3
                                        className={`text-base sm:text-lg font-bold leading-snug ${isDark ? "text-white" : "text-[#0a1b39]"
                                          }`}
                                      >
                                        {module.title}
                                      </h3>
                                      {module.description && (
                                        <p
                                          className={`text-xs leading-relaxed line-clamp-2 ${isDark ? "text-slate-400" : "text-slate-500"
                                            }`}
                                        >
                                          {module.description}
                                        </p>
                                      )}
                                    </div>

                                    {/* Status Badge: Completed / Available / Locked */}
                                    <span
                                      className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider shrink-0 flex items-center gap-1.5 border ${isCompletedModule
                                          ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60"
                                          : isLockedModule
                                            ? "bg-slate-100 text-slate-500 border-slate-200 dark:bg-slate-800/60 dark:text-slate-400 dark:border-slate-700"
                                            : "bg-blue-50 text-[#0062eb] border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800/60"
                                        }`}
                                    >
                                      {isCompletedModule && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                                      {isLockedModule && <Lock className="w-3 h-3 text-slate-400" />}
                                      {!isCompletedModule && !isLockedModule && <Sparkles className="w-3 h-3 text-[#0062eb]" />}
                                      <span>
                                        {isCompletedModule ? "Completed" : isLockedModule ? "Locked" : "Available"}
                                      </span>
                                    </span>
                                  </div>

                                  {/* Progress Section */}
                                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80">
                                    <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                                      <span className={isDark ? "text-slate-300" : "text-slate-600"}>
                                        {totalLessons} {totalLessons === 1 ? "Lesson" : "Lessons"}
                                      </span>
                                      <span className="font-bold text-[#0062eb]">
                                        Progress: {completedCount} / {totalLessons}
                                      </span>
                                    </div>
                                    <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                                      <div
                                        className={`h-full rounded-full transition-all duration-500 ${isCompletedModule
                                            ? "bg-emerald-500"
                                            : "bg-[#0062eb]"
                                          }`}
                                        style={{ width: `${progressPct}%` }}
                                      />
                                    </div>
                                  </div>

                                  {/* Lessons Checklist */}
                                  {totalLessons > 0 && (
                                    <div className="space-y-2 pt-1">
                                      {topicsList.map((topic) => {
                                        const isDone = topic.status === "Completed";

                                        return (
                                          <div
                                            key={topic.id}
                                            onClick={() => {
                                              if (!isLockedModule) {
                                                setActiveTopic({
                                                  topic,
                                                  moduleTitle: module.title,
                                                  monthTitle: month.title,
                                                });
                                              }
                                            }}
                                            className={`flex items-center justify-between p-2.5 rounded-lg text-xs font-medium transition-all ${isLockedModule
                                                ? "opacity-60 cursor-not-allowed bg-slate-50/50 dark:bg-slate-900/30 text-slate-400"
                                                : isDark
                                                  ? "bg-[#091328] hover:bg-[#0e1c3d] text-slate-200 cursor-pointer border border-[#15254a]"
                                                  : "bg-slate-50/80 hover:bg-blue-50/60 text-slate-700 cursor-pointer border border-slate-200/60"
                                              }`}
                                          >
                                            <div className="flex items-center gap-2.5 min-w-0 flex-1">
                                              {isDone ? (
                                                <span className="text-emerald-500 font-black text-sm shrink-0">✓</span>
                                              ) : isLockedModule ? (
                                                <span className="text-slate-400 text-xs shrink-0">🔒</span>
                                              ) : (
                                                <span className="text-[#0062eb] font-bold text-sm shrink-0">○</span>
                                              )}
                                              <span
                                                className={`truncate ${isDone ? "text-slate-500 dark:text-slate-400" : ""
                                                  }`}
                                              >
                                                {topic.title}
                                              </span>
                                            </div>

                                            {topic.duration && (
                                              <span className="text-[10px] text-slate-400 font-semibold shrink-0 ml-2">
                                                {topic.duration}
                                              </span>
                                            )}
                                          </div>
                                        );
                                      })}
                                    </div>
                                  )}
                                </div>

                                {/* Primary Action: Start Learning / Continue Learning */}
                                <div className="pt-5 mt-auto">
                                  {isLockedModule ? (
                                    <button
                                      disabled
                                      className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed flex items-center justify-center gap-2 border border-slate-200/60 dark:border-slate-700/60"
                                    >
                                      <Lock className="w-3.5 h-3.5" />
                                      <span>Locked</span>
                                    </button>
                                  ) : isCompletedModule ? (
                                    <button
                                      onClick={() => {
                                        if (topicsList.length > 0) {
                                          setActiveTopic({
                                            topic: topicsList[0],
                                            moduleTitle: module.title,
                                            monthTitle: month.title,
                                          });
                                        }
                                      }}
                                      className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 border border-emerald-200 dark:border-emerald-800/60 transition flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
                                    >
                                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                      <span>Review Module</span>
                                    </button>
                                  ) : (
                                    <button
                                      onClick={() => {
                                        const nextTopic =
                                          topicsList.find((t) => t.status !== "Completed") || topicsList[0];
                                        if (nextTopic) {
                                          setActiveTopic({
                                            topic: nextTopic,
                                            moduleTitle: module.title,
                                            monthTitle: month.title,
                                          });
                                        }
                                      }}
                                      className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-[#0062eb] hover:bg-[#0052cc] transition shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
                                    >
                                      <Play className="w-3.5 h-3.5 fill-current" />
                                      <span>{completedCount > 0 ? "Continue Learning" : "Start Learning"}</span>
                                    </button>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </section>
                  );
                })}
            </div>
          </>
        )}

        {/* Lesson Detail Modal */}
        {activeTopic && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
            <div
              className={`w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl p-6 border shadow-2xl space-y-4 animate-in zoom-in-95 ${isDark
                  ? "bg-[#0b1429] border-[#1e3363] text-white"
                  : "bg-white border-[#dce8f8] text-[#0a1b39]"
                }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${activeTopic.topic.status === "Completed"
                          ? "bg-emerald-500/15 text-emerald-600"
                          : "bg-blue-500/15 text-[#0062eb]"
                        }`}
                    >
                      {activeTopic.topic.status === "Completed" ? "Completed" : "In Progress"}
                    </span>
                    {activeTopic.topic.duration && (
                      <span className="text-xs text-slate-400 font-semibold flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {activeTopic.topic.duration}
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-bold leading-snug">
                    {activeTopic.topic.title}
                  </h3>
                  <p className="text-xs text-slate-400 font-semibold">
                    {activeTopic.moduleTitle} • {activeTopic.monthTitle}
                  </p>
                </div>

                <button
                  onClick={() => setActiveTopic(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {activeTopic.topic.description && (
                <div
                  className={`p-3.5 rounded-xl border text-xs leading-relaxed ${isDark
                      ? "bg-[#070e1f] border-[#152345] text-slate-300"
                      : "bg-[#f8fbff] border-[#e2edf8] text-slate-700"
                    }`}
                >
                  {activeTopic.topic.description}
                </div>
              )}

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pt-2">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <Link
                    href="/classes"
                    className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-bold bg-[#0062eb] hover:bg-[#0052cc] text-white flex items-center justify-center gap-1.5 transition shadow-sm min-h-[40px]"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>View Class Schedule</span>
                  </Link>

                  {activeTopic.topic.status === "Completed" ? (
                    <button
                      type="button"
                      disabled={isTogglingTopic}
                      onClick={() => handleToggleTopic(activeTopic.topic.id, false)}
                      className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-bold bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center justify-center gap-1.5 transition shadow-sm min-h-[40px] cursor-pointer disabled:opacity-50"
                    >
                      {isTogglingTopic ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      )}
                      <span>Completed ✓ (Undo)</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled={isTogglingTopic}
                      onClick={() => handleToggleTopic(activeTopic.topic.id, true)}
                      className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center gap-1.5 transition shadow-sm min-h-[40px] cursor-pointer disabled:opacity-50"
                    >
                      {isTogglingTopic ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      )}
                      <span>Mark as Completed</span>
                    </button>
                  )}
                </div>

                <button
                  onClick={() => setActiveTopic(null)}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-bold border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 cursor-pointer min-h-[40px] text-center"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
