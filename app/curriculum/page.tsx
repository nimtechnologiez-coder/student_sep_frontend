"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import DashboardLayout from "@/components/DashboardLayout";
import { useTheme } from "@/components/ThemeProvider";
import styles from "./curriculum.module.css";
import { StudentApi } from "@/lib/studentApi";
import {
  BookOpen,
  CheckCircle2,
  Clock,
  ArrowRight,
  ArrowLeft,
  Search,
  Check,
  Circle,
  Play,
  FileText,
  Code2,
  Laptop,
  Award,
  Layers,
  ChevronRight,
  X,
  Target,
  Loader2,
  Calendar,
} from "lucide-react";

// Curriculum Data Types matching backend models
export type TopicStatus = "Completed" | "In Progress" | "Upcoming" | "Not Started";
export type ModuleStatus = "Completed" | "In Progress" | "Upcoming" | "Not Started";
export type MonthStatus = "Completed" | "Current" | "Upcoming" | "In Progress" | "Not Started";

export interface TopicItem {
  id: string;
  title: string;
  type: string;
  duration: string;
  status: TopicStatus;
  description: string;
}

export interface ModuleItem {
  id: string;
  code: string;
  weekRange?: string;
  title: string;
  status: ModuleStatus;
  progress?: number;
  learningObjectives?: string[];
  topics: TopicItem[];
}

export interface MonthData {
  monthNumber: number;
  title: string;
  shortTopic?: string;
  code?: string;
  duration?: string;
  hours?: number;
  progress?: number;
  status: MonthStatus;
  summary?: string;
  description?: string;
  modules: ModuleItem[];
}

export default function CurriculumPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [student, setStudent] = useState<any>(null);
  const [kpi, setKpi] = useState<any>(null);
  const [curriculumData, setCurriculumData] = useState<MonthData[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Topic detail modal state
  const [activeTopic, setActiveTopic] = useState<{
    topic: TopicItem;
    moduleTitle: string;
    monthTitle: string;
  } | null>(null);

  useEffect(() => {
    setIsLoading(true);

    Promise.all([
      StudentApi.getDashboard(),
      fetch("http://127.0.0.1:8000/api/curriculum/get/")
        .then((res) => {
          if (!res.ok) throw new Error("API failed");
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
        console.error("Error loading curriculum data:", err);
        setCurriculumData([]);
        setSelectedMonth(1);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  // Use only curriculum loaded from Django backend API
  const activeCurriculum = useMemo(() => {
    return curriculumData;
  }, [curriculumData]);

  // Real statistics calculated strictly from data
  const totalMonths = activeCurriculum.length;
  const completedMonths = activeCurriculum.filter((m) => m.status === "Completed").length;
  const totalModules = activeCurriculum.reduce((acc, m) => acc + (m.modules?.length || 0), 0);
  const completedModules = activeCurriculum.reduce(
    (acc, m) => acc + (m.modules || []).filter((mod) => mod.status === "Completed").length,
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

  // Topic type badge styling helper
  const getTopicTypeMeta = (type: string) => {
    switch (type) {
      case "Online Class":
      case "Video":
        return {
          icon: Laptop,
          bg: "bg-blue-50 text-blue-700 border-blue-200/60 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-900/60",
        };
      case "Hands-on Lab":
        return {
          icon: Code2,
          bg: "bg-emerald-50 text-emerald-700 border-emerald-200/60 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-900/60",
        };
      case "Reading":
        return {
          icon: FileText,
          bg: "bg-purple-50 text-purple-700 border-purple-200/60 dark:bg-purple-950/50 dark:text-purple-300 dark:border-purple-900/60",
        };
      case "Project":
        return {
          icon: Layers,
          bg: "bg-amber-50 text-amber-700 border-amber-200/60 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-900/60",
        };
      case "Assessment":
        return {
          icon: Award,
          bg: "bg-rose-50 text-rose-700 border-rose-200/60 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-900/60",
        };
      default:
        return {
          icon: BookOpen,
          bg: "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
        };
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-[#0062eb]" />
          <span className="ml-3 text-sm font-semibold text-slate-500">Loading curriculum...</span>
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
                  Program Curriculum
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
                Curriculum Roadmap
              </h1>

              <p
                className={`text-xs sm:text-sm leading-relaxed ${
                  isDark ? "text-slate-300" : "text-slate-600 font-medium"
                }`}
              >
                Structured learning pathway, lecture modules, hands-on practical exercises, and milestones for {student?.name ? `${student.name}'s batch` : "your program"}.
              </p>
            </div>

            {/* Overall Course Progress Box & Action */}
            <div
              className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center gap-4 lg:gap-5 shrink-0 ${
                isDark ? "bg-[#0b1429] border-[#182952]" : "bg-slate-50 border-slate-200"
              }`}
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className={`font-semibold ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                    Overall Course Progress
                  </span>
                  <span className="font-black text-[#0062eb]">{calculatedProgress}%</span>
                </div>
                <div className="w-48 h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-600 to-indigo-500 rounded-full transition-all duration-500"
                    style={{ width: `${calculatedProgress}%` }}
                  />
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  {totalMonths > 0 ? `${completedMonths} of ${totalMonths} Months Completed` : "No active modules yet"}
                </span>
              </div>

              <Link
                href="/classes"
                className="px-4 py-2.5 rounded-xl bg-[#0062eb] hover:bg-[#0052cc] text-white text-xs font-bold transition shadow-md shadow-blue-600/25 flex items-center justify-center gap-1.5 shrink-0 active:scale-95"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Class Schedule</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </section>

        {/* =========================================================================
            2. PROGRAM CURRICULUM ROADMAP (Full Layout with Real Data / Clean Empty State)
            ========================================================================= */}
        {activeCurriculum.length === 0 ? (
          <div className="py-20 px-6 text-center flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40">
            <div className="w-14 h-14 rounded-2xl bg-blue-500/10 text-[#0062eb] flex items-center justify-center mb-3">
              <BookOpen className="w-7 h-7 stroke-[2]" />
            </div>
            <h3 className={`text-lg font-bold ${isDark ? "text-white" : "text-[#0a1b39]"}`}>
              No Curriculum Data Available
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-md">
              Curriculum phases, modules, and topics will appear here once configured in the academy portal.
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
                  placeholder="Search across all modules, topics & outcomes..."
                  className={`w-full pl-9 pr-8 py-2.5 rounded-xl text-xs outline-none border transition ${
                    isDark
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
                  Showing {totalMonths} Months ({totalModules} Modules)
                </span>
              </div>
            </div>

            {/* Month Selector Navigation Bar */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-slate-400">
                  Select Program Phase / Month
                </span>
                <span className="text-xs font-semibold text-[#0062eb]">
                  {selectedMonth === 0 ? `Viewing All ${totalMonths} Months` : `Viewing Month ${selectedMonth} of ${totalMonths}`}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2.5">
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
                      className={`p-3 rounded-xl border text-left transition flex flex-col justify-between cursor-pointer gap-2 ${
                        isSelected
                          ? "bg-[#0062eb] text-white border-[#0062eb] shadow-md shadow-blue-600/25 ring-2 ring-blue-400/40"
                          : isDark
                          ? "bg-[#0b1429] border-[#182952] text-slate-300 hover:border-[#0062eb]/60"
                          : "bg-white border-slate-200 text-[#0a1b39] hover:border-blue-300 shadow-xs"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1 w-full">
                        <span
                          className={`text-[11px] font-black uppercase tracking-wider ${
                            isSelected ? "text-blue-100" : isDone ? "text-emerald-500" : isCurrent ? "text-[#0062eb]" : isDark ? "text-slate-400" : "text-slate-500"
                          }`}
                        >
                          Month {m.monthNumber}
                        </span>
                        <span
                          className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded-full ${
                            isSelected
                              ? "bg-white/20 text-white"
                              : isDone
                              ? "bg-emerald-500/10 text-emerald-600"
                              : isCurrent
                              ? "bg-blue-500/10 text-[#0062eb]"
                              : "bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                          }`}
                        >
                          {m.status || "Upcoming"}
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

                {/* Full View Button */}
                <button
                  onClick={() => {
                    setSelectedMonth(0);
                    setSearchQuery("");
                  }}
                  className={`p-3 rounded-xl border text-left transition flex flex-col justify-between cursor-pointer gap-2 ${
                    selectedMonth === 0
                      ? "bg-[#0062eb] text-white border-[#0062eb] shadow-md shadow-blue-600/25 ring-2 ring-blue-400/40"
                      : isDark
                      ? "bg-[#0b1429] border-[#182952] text-slate-300 hover:border-[#0062eb]/60"
                      : "bg-white border-slate-200 text-[#0a1b39] hover:border-blue-300 shadow-xs"
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 w-full">
                    <span
                      className={`text-[11px] font-black uppercase tracking-wider ${
                        selectedMonth === 0 ? "text-blue-100" : isDark ? "text-slate-400" : "text-slate-500"
                      }`}
                    >
                      Full View
                    </span>
                    <span
                      className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded-full ${
                        selectedMonth === 0 ? "bg-white/20 text-white" : "bg-blue-500/10 text-[#0062eb]"
                      }`}
                    >
                      All
                    </span>
                  </div>

                  <div className="text-xs font-bold leading-snug">
                    All Months
                  </div>

                  <div className="text-[10px] text-slate-400 mt-auto pt-1 font-semibold flex items-center justify-between w-full">
                    <span>Total Modules</span>
                    <span className="font-bold">{totalModules}</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Focused Month Banner (When a single month is selected) */}
            {selectedMonth !== 0 && currentMonthData && !searchQuery && (
              <div
                className={`p-5 sm:p-6 rounded-2xl border transition-all ${
                  isDark ? "bg-[#081226] border-[#16274d]" : "bg-gradient-to-r from-blue-50/70 via-indigo-50/40 to-white border-blue-100 shadow-xs"
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                  <div className="space-y-2 max-w-2xl">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="px-3 py-0.5 rounded-lg text-xs font-black bg-[#0062eb] text-white">
                        Month {currentMonthData.monthNumber} {currentMonthData.code ? `• ${currentMonthData.code}` : ""}
                      </span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                          currentMonthData.status === "Completed"
                            ? "bg-emerald-500/15 text-emerald-600 border-emerald-500/30"
                            : currentMonthData.status === "Current" || currentMonthData.status === "In Progress"
                            ? "bg-blue-500/15 text-[#0062eb] border-blue-500/30"
                            : "bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border-slate-300 dark:border-slate-700"
                        }`}
                      >
                        {currentMonthData.status} Phase
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
                      <span className="text-xs font-black text-[#0062eb]">{currentMonthData.status}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Modules Display Grid */}
            <div className="space-y-12">
              {activeCurriculum
                .filter((m) => selectedMonth === 0 || m.monthNumber === selectedMonth || searchQuery.trim().length > 0)
                .map((month) => {
                  const monthModules = (month.modules || []).filter((m) =>
                    !searchQuery ||
                    m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    (m.code && m.code.toLowerCase().includes(searchQuery.toLowerCase())) ||
                    (m.topics || []).some((t) => t.title.toLowerCase().includes(searchQuery.toLowerCase()))
                  );

                  return (
                    <section key={month.monthNumber} className="space-y-5">
                      {/* Month Group Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-200/80 dark:border-slate-800 gap-2">
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className="px-3.5 py-1 rounded-xl text-xs font-black bg-[#0062eb] text-white shadow-sm">
                            Month {month.monthNumber}
                          </span>
                          <h2 className={`text-xl font-black ${isDark ? "text-white" : "text-[#0a1b39]"}`}>
                            {month.title}
                          </h2>
                        </div>

                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                              month.status === "Completed"
                                ? "bg-emerald-500/15 text-emerald-600 border-emerald-500/30"
                                : month.status === "Current" || month.status === "In Progress"
                                ? "bg-blue-500/15 text-[#0062eb] border-blue-500/30"
                                : "bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border-slate-300 dark:border-slate-700"
                            }`}
                          >
                            {month.status}
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
                            No Curriculum Data Available
                          </h3>
                          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-md">
                            Academic syllabus and module roadmap for <strong className={isDark ? "text-slate-300" : "text-slate-700"}>{month.title}</strong> will appear here once published by your trainer for {student?.batch || "your batch"}.
                          </p>
                        </div>
                      ) : (
                        /* Modules Grid */
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
                        {monthModules.map((module) => {
                          const isCurrentModule = module.status === "In Progress" || module.status === "Current";
                          const isCompletedModule = module.status === "Completed";
                          const completedTopicsCount = (module.topics || []).filter(
                            (t) => t.status === "Completed"
                          ).length;
                          const modProgress =
                            (module.topics?.length || 0) > 0
                              ? Math.round((completedTopicsCount / (module.topics?.length || 1)) * 100)
                              : module.progress || 0;

                          return (
                            <div
                              key={module.id}
                              className={`${styles.card} p-5 sm:p-6 flex flex-col h-full ${
                                isCurrentModule ? "ring-2 ring-[#0062eb] border-[#0062eb]/50" : ""
                              }`}
                            >
                              {/* Section 1: Module Header & Progress */}
                              <div className="space-y-3">
                                <div className="flex items-center justify-between gap-2">
                                  <div className="flex items-center gap-2">
                                    {module.code && (
                                      <span className="px-2.5 py-0.5 rounded-lg text-xs font-black bg-blue-50 text-[#0062eb] dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800/60">
                                        {module.code}
                                      </span>
                                    )}
                                    <span
                                      className={`text-xs font-semibold ${
                                        isDark ? "text-slate-400" : "text-slate-500"
                                      }`}
                                    >
                                      • Month {month.monthNumber}
                                    </span>
                                  </div>

                                  <span
                                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                                      isCompletedModule
                                        ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60"
                                        : isCurrentModule
                                        ? "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800/60 animate-pulse"
                                        : "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800/60 dark:text-slate-400 dark:border-slate-700"
                                    }`}
                                  >
                                    {module.status}
                                  </span>
                                </div>

                                <div className="min-h-[2.5rem] flex items-center">
                                  <h3
                                    className={`text-base sm:text-lg font-bold leading-snug ${
                                      isDark ? "text-white" : "text-[#0a1b39]"
                                    }`}
                                  >
                                    {module.title}
                                  </h3>
                                </div>

                                {/* Progress */}
                                <div>
                                  <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                                    <span className={isDark ? "text-slate-400" : "text-slate-500"}>
                                      {completedTopicsCount} of {module.topics?.length || 0} Topics Completed
                                    </span>
                                    <span
                                      className={`font-black ${
                                        isCompletedModule
                                          ? "text-emerald-600 dark:text-emerald-400"
                                          : isCurrentModule
                                          ? "text-[#0062eb]"
                                          : isDark
                                          ? "text-slate-400"
                                          : "text-slate-500"
                                      }`}
                                    >
                                      {modProgress}%
                                    </span>
                                  </div>
                                  <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden border border-slate-200/50 dark:border-slate-700/50">
                                    <div
                                      className={`h-full rounded-full transition-all duration-500 ${
                                        isCompletedModule
                                          ? "bg-emerald-500"
                                          : isCurrentModule
                                          ? "bg-[#0062eb]"
                                          : "bg-transparent"
                                      }`}
                                      style={{ width: `${modProgress}%` }}
                                    />
                                  </div>
                                </div>
                              </div>

                              {/* Section 2: Learning Objectives (if available) */}
                              {module.learningObjectives && module.learningObjectives.length > 0 && (
                                <div className="mt-4 rounded-xl p-3.5 sm:p-4 bg-slate-50/80 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800/80 flex flex-col justify-start">
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                                      <Target className="w-3.5 h-3.5 text-[#0062eb]" />
                                      Learning Objectives
                                    </span>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                                      {module.learningObjectives.length} Outcomes
                                    </span>
                                  </div>

                                  <ul className="space-y-2 text-xs">
                                    {module.learningObjectives.map((obj, i) => (
                                      <li key={i} className="flex items-start gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#0062eb] mt-1.5 shrink-0" />
                                        <span
                                          className={`leading-snug font-medium ${
                                            isDark ? "text-slate-300" : "text-slate-700"
                                          }`}
                                        >
                                          {obj}
                                        </span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}

                              {/* Section 3: Topics List */}
                              <div className="mt-5 flex-1 flex flex-col">
                                <div className="flex items-center justify-between mb-2.5">
                                  <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                                    <BookOpen className="w-3.5 h-3.5 text-[#0062eb]" />
                                    Topics &amp; Lessons
                                  </span>
                                  <span className="text-[11px] font-semibold text-slate-400">
                                    {module.topics?.length || 0} Lessons
                                  </span>
                                </div>

                                <div className="space-y-2 flex-1">
                                  {(module.topics || []).map((topic) => {
                                    const meta = getTopicTypeMeta(topic.type);
                                    const Icon = meta.icon;
                                    const isTopicActive = topic.status === "In Progress";
                                    const isTopicDone = topic.status === "Completed";

                                    return (
                                      <div
                                        key={topic.id}
                                        onClick={() =>
                                          setActiveTopic({
                                            topic,
                                            moduleTitle: module.title,
                                            monthTitle: month.title,
                                          })
                                        }
                                        className={`${styles.topicTile} ${
                                          isTopicActive ? styles.topicTileActive : ""
                                        } group`}
                                      >
                                        <div className="flex items-start gap-3 min-w-0 flex-1">
                                          <div className="mt-0.5 shrink-0">
                                            {isTopicDone ? (
                                              <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xs">
                                                <Check className="w-3 h-3 stroke-[3]" />
                                              </div>
                                            ) : isTopicActive ? (
                                              <div className="w-5 h-5 rounded-full bg-[#0062eb] text-white flex items-center justify-center ring-4 ring-blue-500/20 animate-pulse">
                                                <Play className="w-2.5 h-2.5 fill-current ml-0.5" />
                                              </div>
                                            ) : (
                                              <div className="w-5 h-5 rounded-full border-2 border-slate-300 dark:border-slate-700 flex items-center justify-center text-slate-300 dark:text-slate-600">
                                                <Circle className="w-2 h-2 fill-current" />
                                              </div>
                                            )}
                                          </div>

                                          <div className="min-w-0 flex-1">
                                            <h4
                                              className={`text-xs sm:text-sm font-bold leading-snug transition-colors line-clamp-1 ${
                                                isTopicActive
                                                  ? "text-[#0062eb] dark:text-blue-400"
                                                  : isDark
                                                  ? "text-slate-200 group-hover:text-white"
                                                  : "text-[#0a1b39] group-hover:text-[#0062eb]"
                                              }`}
                                              title={topic.title}
                                            >
                                              {topic.title}
                                            </h4>

                                            <div className="flex items-center gap-2 mt-1 flex-wrap">
                                              {topic.type && (
                                                <span
                                                  className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded border ${meta.bg}`}
                                                >
                                                  <Icon className="w-3 h-3" />
                                                  <span>{topic.type}</span>
                                                </span>
                                              )}
                                              {topic.duration && (
                                                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1">
                                                  <Clock className="w-3 h-3 text-slate-400" />
                                                  <span>{topic.duration}</span>
                                                </span>
                                              )}
                                            </div>
                                          </div>
                                        </div>

                                        <div className="shrink-0 self-center pl-2 flex items-center gap-1 text-xs font-bold text-slate-400 group-hover:text-[#0062eb] transition-all">
                                          <span className="hidden sm:inline">Details</span>
                                          <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
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

            {/* Real Learning Summary Metrics */}
            <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className={`${styles.card} p-4`}>
                <span className="text-xs text-slate-400 font-semibold block mb-1">
                  Completed Modules
                </span>
                <div className={`text-xl sm:text-2xl font-black ${isDark ? "text-white" : "text-[#0a1b39]"}`}>
                  {completedModules} <span className="text-xs text-slate-400 font-normal">/ {totalModules}</span>
                </div>
                <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">
                  {totalModules > 0 ? `${Math.round((completedModules / totalModules) * 100)}% Finished` : "0% Progress"}
                </p>
              </div>

              <div className={`${styles.card} p-4`}>
                <span className="text-xs text-slate-400 font-semibold block mb-1">
                  Completed Topics
                </span>
                <div className={`text-xl sm:text-2xl font-black ${isDark ? "text-white" : "text-[#0a1b39]"}`}>
                  {completedTopics} <span className="text-xs text-slate-400 font-normal">/ {totalTopics}</span>
                </div>
                <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">
                  Lectures, labs &amp; assessments
                </p>
              </div>

              <div className={`${styles.card} p-4`}>
                <span className="text-xs text-slate-400 font-semibold block mb-1">
                  Total Curriculum Months
                </span>
                <div className="text-xl sm:text-2xl font-black text-[#0062eb]">
                  {totalMonths}
                </div>
                <p className="text-[11px] text-slate-400 font-semibold mt-0.5">
                  {completedMonths} Completed
                </p>
              </div>

              <div className={`${styles.card} p-4`}>
                <span className="text-xs text-slate-400 font-semibold block mb-1">
                  Remaining Modules
                </span>
                <div className={`text-xl sm:text-2xl font-black ${isDark ? "text-white" : "text-[#0a1b39]"}`}>
                  {Math.max(0, totalModules - completedModules)}{" "}
                  <span className="text-xs text-slate-400 font-normal">Modules</span>
                </div>
                <p className="text-[11px] text-slate-400 font-semibold mt-0.5">
                  In progress for your batch
                </p>
              </div>
            </section>
          </>
        )}

        {/* Topic Detail Modal */}
        {activeTopic && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
            <div
              className={`w-full max-w-lg rounded-2xl p-6 border shadow-2xl space-y-4 animate-in zoom-in-95 ${
                isDark
                  ? "bg-[#0b1429] border-[#1e3363] text-white"
                  : "bg-white border-[#dce8f8] text-[#0a1b39]"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-blue-500/15 text-[#0062eb]">
                      {activeTopic.topic.type || "Lesson"}
                    </span>
                    {activeTopic.topic.duration && (
                      <span className="text-xs text-slate-400 font-semibold">
                        {activeTopic.topic.duration}
                      </span>
                    )}
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        activeTopic.topic.status === "Completed"
                          ? "bg-emerald-500/15 text-emerald-600"
                          : activeTopic.topic.status === "In Progress"
                          ? "bg-blue-500/15 text-[#0062eb]"
                          : "bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                      }`}
                    >
                      {activeTopic.topic.status}
                    </span>
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
                  className={`p-3.5 rounded-xl border text-xs leading-relaxed ${
                    isDark
                      ? "bg-[#070e1f] border-[#152345] text-slate-300"
                      : "bg-[#f8fbff] border-[#e2edf8] text-slate-700"
                  }`}
                >
                  {activeTopic.topic.description}
                </div>
              )}

              <div className="flex items-center justify-end pt-2">
                <button
                  onClick={() => setActiveTopic(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 cursor-pointer"
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
