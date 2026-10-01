"use client";

import React, { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useTheme } from "@/components/ThemeProvider";
import styles from "./reports.module.css";
import {
  Calendar,
  CalendarCheck,
  BookOpen,
  FileText,
  Layers,
  Star,
  Download,
  TrendingUp,
  Award,
  CheckCircle2,
  Clock,
  Target,
  Flag,
  Sparkles,
  Trophy,
  ArrowUpRight,
  ChevronDown
} from "lucide-react";

export default function MonthlyReportPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [selectedMonth, setSelectedMonth] = useState("September 2026");

  // Academic Progress Subjects & Scores
  const academicSubjects = [
    { name: "Python", score: 85, color: "bg-[#0062eb]" },
    { name: "Machine Learning", score: 78, color: "bg-sky-400" },
    { name: "Deep Learning", score: 72, color: "bg-indigo-500" },
    { name: "NLP", score: 68, color: "bg-fuchsia-500" },
    { name: "Generative AI", score: 45, color: "bg-amber-500" },
    { name: "Agentic AI", score: 30, color: "bg-yellow-400" },
  ];

  // Attendance Trend Data (Apr to Sep)
  const attendanceTrend = [
    { month: "Apr", present: 19, absent: 2, pct: 78 },
    { month: "May", present: 20, absent: 1, pct: 82 },
    { month: "Jun", present: 20, absent: 2, pct: 85 },
    { month: "Jul", present: 21, absent: 1, pct: 88 },
    { month: "Aug", present: 22, absent: 1, pct: 90 },
    { month: "Sep", present: 23, absent: 1, pct: 92 },
  ];

  return (
    <DashboardLayout>
      <div className={styles.container}>
        {/* 1. Hero Banner with Controls & Laptop Graphic */}
        <div className={styles.heroCard}>
          <div className={styles.glowOrb} />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1
                className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${
                  isDark ? "text-white" : "text-slate-900"
                }`}
              >
                Monthly Report
              </h1>
              <p className="text-sm sm:text-base text-slate-400 mt-1 font-medium">
                A summary of your learning journey, performance and growth.
              </p>
            </div>

            {/* Controls + Artwork Box */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Month Selector */}
              <div
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-bold cursor-pointer ${
                  isDark
                    ? "bg-[#0c1630] border-[#1d3363] text-white"
                    : "bg-white border-slate-300 text-slate-800"
                }`}
              >
                <Calendar className="w-4 h-4 text-sky-400" />
                <span>{selectedMonth}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </div>

              {/* Download PDF Button */}
              <button
                type="button"
                onClick={() => window.print()}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-[#0062eb] hover:bg-blue-600 text-white shadow-md shadow-blue-500/30 transition-all"
              >
                <Download className="w-4 h-4" />
                <span>Download PDF</span>
              </button>

              {/* Laptop Graphic: Track Reflect Improve */}
              <div className="hidden sm:flex relative w-20 h-14 rounded-lg bg-gradient-to-tr from-[#003c99] to-[#0088ff] p-1 shadow-lg shadow-blue-500/25 flex-col items-center justify-center border border-sky-400/40 shrink-0">
                <BarChart2Icon className="w-5 h-5 text-white mb-0.5" />
                <span className="text-[7px] font-black text-white uppercase tracking-tighter text-center leading-none">
                  TRACK<br />REFLECT IMPROVE
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Top 5 KPI Stat Cards Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
          {/* 1. Attendance */}
          <div className={`${styles.card} p-4`}>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
                <CalendarCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-medium text-slate-400 leading-tight">Attendance</p>
                <p
                  className={`text-xl font-extrabold tracking-tight ${
                    isDark ? "text-white" : "text-slate-900"
                  }`}
                >
                  92%
                </p>
              </div>
            </div>
            <p className="text-[10px] text-slate-400 font-medium">18 / 20 classes</p>
          </div>

          {/* 2. Classes Completed */}
          <div className={`${styles.card} p-4`}>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-[#0062eb] flex items-center justify-center text-white shadow-md shadow-blue-500/20">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-medium text-slate-400 leading-tight">
                  Classes Completed
                </p>
                <div className="flex items-baseline gap-1.5">
                  <p
                    className={`text-xl font-extrabold tracking-tight ${
                      isDark ? "text-white" : "text-slate-900"
                    }`}
                  >
                    18 / 20
                  </p>
                  <span className="text-[10px] font-bold text-emerald-400 flex items-center">
                    ↑ +10%
                  </span>
                </div>
              </div>
            </div>
            <p className="text-[10px] text-slate-400 font-medium">vs last month</p>
          </div>

          {/* 3. Assignments */}
          <div className={`${styles.card} p-4`}>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center text-white shadow-md shadow-purple-500/20">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-medium text-slate-400 leading-tight">
                  Assignments
                </p>
                <div className="flex items-baseline gap-1.5">
                  <p
                    className={`text-xl font-extrabold tracking-tight ${
                      isDark ? "text-white" : "text-slate-900"
                    }`}
                  >
                    8 / 10
                  </p>
                  <span className="text-[10px] font-bold text-emerald-400 flex items-center">
                    ↑ +20%
                  </span>
                </div>
              </div>
            </div>
            <p className="text-[10px] text-slate-400 font-medium">vs last month</p>
          </div>

          {/* 4. Projects */}
          <div className={`${styles.card} p-4`}>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-white shadow-md shadow-amber-500/20">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-medium text-slate-400 leading-tight">Projects</p>
                <div className="flex items-baseline gap-1.5">
                  <p
                    className={`text-xl font-extrabold tracking-tight ${
                      isDark ? "text-white" : "text-slate-900"
                    }`}
                  >
                    75%
                  </p>
                  <span className="text-[10px] font-bold text-emerald-400 flex items-center">
                    ↑ +15%
                  </span>
                </div>
              </div>
            </div>
            <p className="text-[10px] text-slate-400 font-medium">vs last month</p>
          </div>

          {/* 5. Evaluation Readiness */}
          <div className={`${styles.card} p-4 col-span-2 sm:col-span-1`}>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-rose-500 flex items-center justify-center text-white shadow-md shadow-rose-500/20">
                <Star className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-medium text-slate-400 leading-tight">
                  Evaluation Readiness
                </p>
                <div className="flex items-baseline gap-1.5">
                  <p
                    className={`text-xl font-extrabold tracking-tight ${
                      isDark ? "text-white" : "text-slate-900"
                    }`}
                  >
                    Good
                  </p>
                  <span className="text-[10px] font-bold text-emerald-400 flex items-center">
                    ↑ +12%
                  </span>
                </div>
              </div>
            </div>
            <p className="text-[10px] text-slate-400 font-medium">vs last month</p>
          </div>
        </div>

        {/* 3. Middle Section: Academic Progress (Left), Attendance Trend (Middle), Overall & Mentor (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          {/* Left: Academic Progress Chart (4 cols) */}
          <div className={`lg:col-span-4 ${styles.card} p-5 flex flex-col justify-between`}>
            <div className="flex items-center justify-between mb-3">
              <h3
                className={`text-sm font-bold tracking-tight ${
                  isDark ? "text-white" : "text-slate-900"
                }`}
              >
                Academic Progress
              </h3>
              <div className="flex items-center gap-1 text-[11px] text-slate-400 font-semibold cursor-pointer">
                <span>September 2026</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Vertical Bar Chart with Y-axis */}
            <div className="h-56 flex items-end justify-between pt-6 px-3 relative">
              {/* Guidelines */}
              <div className="absolute inset-x-0 top-6 bottom-6 flex flex-col justify-between pointer-events-none opacity-20">
                <div className="border-b border-slate-500 w-full" />
                <div className="border-b border-slate-500 w-full" />
                <div className="border-b border-slate-500 w-full" />
                <div className="border-b border-slate-500 w-full" />
              </div>

              {/* Y-axis labels */}
              <div className="absolute left-0 top-4 bottom-4 flex flex-col justify-between text-[9px] text-slate-500 pointer-events-none">
                <span>100%</span>
                <span>75%</span>
                <span>50%</span>
                <span>25%</span>
                <span>0%</span>
              </div>

              {/* Bars */}
              <div className="flex-1 flex items-end justify-around pl-6 h-full z-10">
                {academicSubjects.map((sub, idx) => (
                  <div key={idx} className="flex flex-col items-center gap-1.5 h-full justify-end group">
                    <span className="text-[10px] font-bold text-slate-300 group-hover:text-sky-400 transition-colors">
                      {sub.score}%
                    </span>
                    <div
                      className={`w-7 rounded-t-md ${sub.color} shadow-sm transition-all group-hover:brightness-110`}
                      style={{ height: `${sub.score}%` }}
                    />
                    <span className="text-[9px] text-slate-400 font-medium text-center truncate max-w-[42px]">
                      {sub.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Center: Attendance Trend (4 cols) */}
          <div className={`lg:col-span-4 ${styles.card} p-5 flex flex-col justify-between`}>
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3
                  className={`text-sm font-bold tracking-tight ${
                    isDark ? "text-white" : "text-slate-900"
                  }`}
                >
                  Attendance Trend
                </h3>
              </div>

              {/* Legend */}
              <div className="flex items-center gap-3 text-[10px] text-slate-400 mb-2">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" /> Present
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-rose-500" /> Absent
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-sky-400" /> Percentage
                </span>
              </div>

              {/* Stacked Bars + Trend Line Graph */}
              <div className="h-48 flex items-end justify-between pt-6 px-3 relative">
                {/* Guidelines */}
                <div className="absolute inset-x-0 top-6 bottom-6 flex flex-col justify-between pointer-events-none opacity-20">
                  <div className="border-b border-slate-500 w-full" />
                  <div className="border-b border-slate-500 w-full" />
                  <div className="border-b border-slate-500 w-full" />
                  <div className="border-b border-slate-500 w-full" />
                </div>

                {/* Y-axis */}
                <div className="absolute left-0 top-4 bottom-4 flex flex-col justify-between text-[9px] text-slate-500 pointer-events-none">
                  <span>25</span>
                  <span>20</span>
                  <span>15</span>
                  <span>10</span>
                  <span>5</span>
                  <span>0</span>
                </div>

                {/* Bars + Points */}
                <div className="flex-1 flex items-end justify-around pl-6 h-full z-10">
                  {attendanceTrend.map((m, idx) => (
                    <div key={idx} className="flex flex-col items-center gap-1 h-full justify-end">
                      <span className="text-[9px] font-bold text-sky-400">{m.pct}%</span>
                      {/* Stacked bar: Present (green) + Absent (red) */}
                      <div className="w-6 flex flex-col justify-end rounded-t overflow-hidden">
                        <div
                          className="bg-rose-500 w-full"
                          style={{ height: `${(m.absent / 25) * 140}px` }}
                        />
                        <div
                          className="bg-emerald-400 w-full"
                          style={{ height: `${(m.present / 25) * 140}px` }}
                        />
                      </div>
                      <span className="text-[10px] text-slate-400 font-medium">{m.month}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right: Overall Performance Donut & Mentor Feedback (4 cols) */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            {/* Overall Performance Donut */}
            <div className={`${styles.card} p-5`}>
              <h3
                className={`text-sm font-bold tracking-tight mb-3 ${
                  isDark ? "text-white" : "text-slate-900"
                }`}
              >
                Overall Performance
              </h3>

              <div className="flex items-center gap-4">
                {/* 78% Donut */}
                <div className="relative w-20 h-20 shrink-0 flex items-center justify-center">
                  <svg className="w-20 h-20 transform -rotate-90">
                    <circle
                      cx="40"
                      cy="40"
                      r="32"
                      stroke="currentColor"
                      strokeWidth="8"
                      className="text-slate-800"
                      fill="transparent"
                    />
                    <circle
                      cx="40"
                      cy="40"
                      r="32"
                      stroke="currentColor"
                      strokeWidth="8"
                      strokeDasharray={2 * Math.PI * 32}
                      strokeDashoffset={2 * Math.PI * 32 * (1 - 0.78)}
                      strokeLinecap="round"
                      className="text-sky-400"
                      fill="transparent"
                    />
                  </svg>
                  <div className="absolute text-center leading-none">
                    <p className="text-base font-black text-white">78%</p>
                    <p className="text-[8px] text-slate-400">Good Progress</p>
                  </div>
                </div>

                {/* 5-Item Legend */}
                <div className="space-y-1 text-[11px]">
                  <div className="flex items-center justify-between gap-3">
                    <span className="flex items-center gap-1.5 text-slate-400">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" /> Academic
                    </span>
                    <span className="font-bold text-slate-200">78%</span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="flex items-center gap-1.5 text-slate-400">
                      <span className="w-2 h-2 rounded-full bg-[#0062eb]" /> Projects
                    </span>
                    <span className="font-bold text-slate-200">75%</span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="flex items-center gap-1.5 text-slate-400">
                      <span className="w-2 h-2 rounded-full bg-purple-500" /> Assignments
                    </span>
                    <span className="font-bold text-slate-200">80%</span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="flex items-center gap-1.5 text-slate-400">
                      <span className="w-2 h-2 rounded-full bg-amber-400" /> Attendance
                    </span>
                    <span className="font-bold text-slate-200">92%</span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="flex items-center gap-1.5 text-slate-400">
                      <span className="w-2 h-2 rounded-full bg-rose-400" /> Career Readiness
                    </span>
                    <span className="font-bold text-slate-200">65%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Mentor Feedback Card */}
            <div className={`${styles.card} p-4`}>
              <div className="flex items-center justify-between mb-2">
                <h4
                  className={`text-xs font-bold ${
                    isDark ? "text-white" : "text-slate-900"
                  }`}
                >
                  Mentor Feedback
                </h4>
                <span className="text-[10px] text-slate-500">30 Sep 2026</span>
              </div>

              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-full bg-sky-500/20 text-sky-400 font-bold text-[10px] flex items-center justify-center border border-sky-400/30">
                  PS
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-200">Priya Sharma</p>
                  <p className="text-[9px] text-slate-400">AI/ML Mentor</p>
                </div>
              </div>

              <p className="text-[11px] text-slate-300 italic leading-relaxed">
                &ldquo;Good improvement in your model implementation skills. Keep working on communication and try to participate more in discussions.&rdquo;
              </p>
            </div>
          </div>
        </div>

        {/* 4. Lower Section: Activity Summary & Checklists (Left 6 cols + Right 6 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Left Column: Activity Summary (6 cols) */}
          <div className={`lg:col-span-6 ${styles.card} p-5`}>
            <h3
              className={`text-sm font-bold tracking-tight mb-4 ${
                isDark ? "text-white" : "text-slate-900"
              }`}
            >
              Activity Summary
            </h3>

            <div className="space-y-3">
              {[
                {
                  icon: Calendar,
                  name: "Total Classes",
                  val: "20",
                  sub: "18 attended",
                  badge: "92%",
                  color: "bg-emerald-500/15 text-emerald-400",
                },
                {
                  icon: FileText,
                  name: "Assignments",
                  val: "10",
                  sub: "8 submitted",
                  badge: "80%",
                  color: "bg-sky-500/15 text-sky-400",
                },
                {
                  icon: Layers,
                  name: "Projects",
                  val: "3",
                  sub: "2 in progress",
                  badge: "75%",
                  color: "bg-amber-500/15 text-amber-400",
                },
                {
                  icon: Star,
                  name: "Evaluations",
                  val: "1",
                  sub: "Completed",
                  badge: "85%",
                  color: "bg-emerald-500/15 text-emerald-400",
                },
              ].map((act, idx) => {
                const Icon = act.icon;
                return (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-900/40 border border-slate-800/60"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-300">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-200">{act.name}</p>
                        <p className="text-[10px] text-slate-400">{act.sub}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-white">{act.val}</span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${act.color}`}
                      >
                        {act.badge}
                      </span>
                    </div>
                  </div>
                );
              })}

              {/* Learning Hours */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-blue-950/40 to-sky-950/20 border border-blue-500/25">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-sky-400 flex items-center justify-center">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-200">Learning Hours</p>
                    <p className="text-[10px] text-slate-400">Class & project labs</p>
                  </div>
                </div>

                <div className="flex items-baseline gap-2">
                  <span className="text-base font-black text-white">40 hrs</span>
                  <span className="text-[10px] font-bold text-emerald-400">↑ +12%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Completed This Month & Upcoming Next Month (6 cols) */}
          <div className="lg:col-span-6 space-y-4">
            {/* Completed This Month */}
            <div className={`${styles.card} p-5`}>
              <h3
                className={`text-sm font-bold tracking-tight mb-3 ${
                  isDark ? "text-white" : "text-slate-900"
                }`}
              >
                Completed This Month
              </h3>

              <div className="space-y-2">
                {[
                  "NLP Module – Week 1",
                  "Hands-on: Text Classification",
                  "Assignment – BERT Implementation",
                  "Project 2 – Initial Design",
                  "Attended 18 out of 20 classes",
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 text-xs text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Next Month */}
            <div className={`${styles.card} p-5`}>
              <h3
                className={`text-sm font-bold tracking-tight mb-3 ${
                  isDark ? "text-white" : "text-slate-900"
                }`}
              >
                Upcoming Next Month
              </h3>

              <div className="space-y-2">
                {[
                  "NLP Module – Week 2",
                  "Evaluation 2 (AI Engineering)",
                  "Project 2 – Model Development",
                  "Mock Interview Session",
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 text-xs text-slate-300">
                    <Clock className="w-4 h-4 text-sky-400 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 5. Bottom Motivational Banner */}
        <div
          className={`p-5 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-4 ${
            isDark
              ? "bg-gradient-to-r from-[#0d1f44] via-[#091530] to-[#0d1f44] border-[#1d3566]"
              : "bg-gradient-to-r from-blue-50 via-sky-50 to-indigo-50 border-blue-200"
          }`}
        >
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30 shrink-0">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <h4
                className={`text-sm font-bold ${
                  isDark ? "text-white" : "text-slate-900"
                }`}
              >
                Great Progress This Month!
              </h4>
              <p className="text-xs text-slate-300 mt-0.5">
                You are on the right track. Keep learning, keep building, keep growing.
              </p>
            </div>
          </div>

          <div className="text-right flex items-center gap-3">
            <div className="hidden sm:block text-right">
              <p className="text-xs italic text-slate-300">
                &ldquo;Small consistent steps<br />create big results.&rdquo;
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center border border-red-500/30 shrink-0">
              <Flag className="w-5 h-5 fill-red-400" />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

// Inline Helper for Laptop Chart icon
function BarChart2Icon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  );
}

