"use client";

import React, { useState } from "react";
import Link from "next/link";
import DashboardLayout from "@/components/DashboardLayout";
import { useTheme } from "@/components/ThemeProvider";
import {
  ClipboardCheck,
  CheckCircle2,
  Clock,
  Lock,
  ArrowRight,
  Award,
  Search,
  BookOpen,
  Calendar,
  AlertCircle,
  Play,
  RotateCcw,
} from "lucide-react";

export default function AssessmentsPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [activeTab, setActiveTab] = useState<"upcoming" | "completed">("upcoming");
  const [classCompleted, setClassCompleted] = useState(false);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Hero Header */}
        <section
          className={`relative overflow-hidden rounded-2xl p-6 sm:p-7 border transition-all ${
            isDark
              ? "bg-gradient-to-r from-[#07132b] via-[#091a3c] to-[#07132b] border-[#15274e] text-white"
              : "bg-gradient-to-r from-white via-[#f0f6fe] to-[#e8f2fe] border-[#d2e4f8] text-[#0a1b39]"
          }`}
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#0062eb] flex items-center justify-center text-white shrink-0 shadow-md shadow-blue-600/30">
              <ClipboardCheck className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">Assessments</h1>
              <p className={`text-xs sm:text-sm mt-1 font-medium ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                Post-class quizzes, concept evaluations, and benchmark testing.
              </p>
            </div>
          </div>
        </section>

        {/* Tab Controls */}
        <div className="flex items-center gap-2 border-b pb-3 border-slate-200 dark:border-slate-800">
          <button
            onClick={() => setActiveTab("upcoming")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === "upcoming"
                ? "bg-[#0062eb] text-white shadow-md shadow-blue-600/20"
                : isDark
                ? "text-slate-400 hover:text-white"
                : "text-slate-600 hover:text-[#0062eb]"
            }`}
          >
            Upcoming &amp; Active (2)
          </button>
          <button
            onClick={() => setActiveTab("completed")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === "completed"
                ? "bg-[#0062eb] text-white shadow-md shadow-blue-600/20"
                : isDark
                ? "text-slate-400 hover:text-white"
                : "text-slate-600 hover:text-[#0062eb]"
            }`}
          >
            Completed &amp; Scores (4)
          </button>
        </div>

        {/* Assessments List */}
        {activeTab === "upcoming" ? (
          <div className="space-y-4">
            {/* Class-Gated Assessment */}
            <div
              className={`p-5 rounded-2xl border transition-all ${
                isDark ? "bg-[#0b1328] border-[#15274d]" : "bg-white border-[#dce8f8] shadow-sm"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                        classCompleted
                          ? "bg-emerald-500/15 text-emerald-600 border-emerald-500/30"
                          : "bg-amber-500/15 text-amber-600 border-amber-500/30"
                      }`}
                    >
                      {classCompleted ? "✓ Unlocked & Ready" : "🔒 Class Completion Required"}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      NLP &amp; Transformers • Module 4
                    </span>
                  </div>

                  <h3 className={`text-base font-bold ${isDark ? "text-white" : "text-[#0a1b39]"}`}>
                    Quiz #4: Attention Mechanics &amp; Multi-Head Self-Attention
                  </h3>

                  <p className={`text-xs ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                    Covers Scaled Dot-Product Attention, Q/K/V matrix projections, and positional encoding logic.
                  </p>

                  <div className="flex items-center gap-4 text-xs text-slate-400 pt-1">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> 25 Mins
                    </span>
                    <span className="flex items-center gap-1">
                      <ClipboardCheck className="w-3.5 h-3.5" /> 15 Questions
                    </span>
                    <span>Passing: 75%</span>
                  </div>
                </div>

                <div className="flex flex-col items-stretch sm:items-end gap-2 w-full sm:w-auto shrink-0">
                  {classCompleted ? (
                    <button className="w-full sm:w-auto justify-center px-5 py-2.5 rounded-xl bg-[#0062eb] hover:bg-[#0052cc] text-white text-xs font-bold transition shadow-md shadow-blue-600/25 flex items-center gap-1.5 cursor-pointer min-h-[40px]">
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Start Assessment</span>
                    </button>
                  ) : (
                    <div className="flex flex-col items-stretch sm:items-end gap-1.5 w-full sm:w-auto">
                      <button
                        disabled
                        className="w-full sm:w-auto justify-center px-5 py-2.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-400 text-xs font-bold cursor-not-allowed flex items-center gap-1.5 min-h-[40px]"
                      >
                        <Lock className="w-3.5 h-3.5" />
                        <span>Complete Live Class to Unlock</span>
                      </button>
                      <button
                        onClick={() => setClassCompleted(true)}
                        className="text-[11px] font-bold text-[#0062eb] hover:underline cursor-pointer text-center sm:text-right"
                      >
                        Simulate: Mark Class Completed
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Assessment 2 */}
            <div
              className={`p-5 rounded-2xl border transition-all ${
                isDark ? "bg-[#0b1328] border-[#15274d]" : "bg-white border-[#dce8f8] shadow-sm"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-500/15 text-blue-600 border border-blue-500/30">
                      Mid-Term Gateway
                    </span>
                    <span className="text-xs text-slate-400 font-medium">Evaluation 2</span>
                  </div>
                  <h3 className={`text-base font-bold ${isDark ? "text-white" : "text-[#0a1b39]"}`}>
                    Evaluation 2: Deep Learning &amp; NLP Gateway Exam
                  </h3>
                  <p className={`text-xs ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                    Comprehensive 2-part evaluation: Theoretical MCQ &amp; 90-minute live PyTorch modeling test.
                  </p>
                  <div className="flex items-center gap-4 text-xs text-slate-400 pt-1">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" /> Scheduled: 15 Oct 2026
                    </span>
                    <span>Duration: 150 Mins</span>
                  </div>
                </div>
                <Link
                  href="/evaluations"
                  className="w-full sm:w-auto text-center justify-center px-4 py-2.5 rounded-xl border border-[#0062eb] text-[#0062eb] hover:bg-[#0062eb] hover:text-white text-xs font-bold transition shrink-0 min-h-[40px] flex items-center"
                >
                  View Syllabus &amp; Mock Tests
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Completed assessments list */}
            {[
              {
                title: "Evaluation 1: Core AI & Mathematics",
                score: "88%",
                status: "Passed",
                date: "15 Aug 2026",
                mentor: "Dr. Vikram Seth",
              },
              {
                title: "Quiz #3: Deep Learning & CNN Architecture",
                score: "92%",
                status: "Passed",
                date: "02 Sep 2026",
                mentor: "Rahul Mehta",
              },
              {
                title: "Quiz #2: Machine Learning Foundations",
                score: "90%",
                status: "Passed",
                date: "18 Jul 2026",
                mentor: "Priya Sharma",
              },
              {
                title: "Quiz #1: Python & NumPy Vectorization",
                score: "95%",
                status: "Passed",
                date: "25 Jun 2026",
                mentor: "Priya Sharma",
              },
            ].map((res, i) => (
              <div
                key={i}
                className={`p-4 rounded-2xl border flex items-center justify-between ${
                  isDark ? "bg-[#0b1328] border-[#15274d]" : "bg-white border-[#dce8f8]"
                }`}
              >
                <div>
                  <h4 className={`text-sm font-bold ${isDark ? "text-white" : "text-[#0a1b39]"}`}>
                    {res.title}
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Completed on {res.date} • Evaluated by {res.mentor}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-base font-black text-emerald-600 block">{res.score}</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">{res.status}</span>
                  </div>
                  <Link
                    href="/evaluations"
                    className="p-2 rounded-xl text-slate-400 hover:text-[#0062eb]"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

