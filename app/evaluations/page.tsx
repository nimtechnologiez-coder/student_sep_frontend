"use client";

import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useTheme } from "@/components/ThemeProvider";
import styles from "./evaluations.module.css";
import {
  Award,
  CheckCircle2,
  Brain,
  Sparkles,
  ArrowRight,
  Eye,
  Calendar,
  Clock,
  UserCheck,
  TrendingUp,
  X,
  FileCheck,
  CheckCircle,
  HelpCircle,
  BarChart3,
  BookOpen,
} from "lucide-react";

interface EvaluationItem {
  id: string;
  name: string;
  subject: string;
  type: string;
  date: string;
  duration: string;
  score: number | null;
  maxScore: number;
  status: "Completed" | "In Review" | "Upcoming";
  trainerName: string;
  trainerRole: string;
  trainerFeedback: string;
  strengths: string[];
  recommendations: string[];
}

// Single-subject dataset: strictly Generative AI (Gen AI)
const GEN_AI_EVALUATIONS: EvaluationItem[] = [
  {
    id: "eval-1",
    name: "Gen AI Foundations & Transformer Architecture",
    subject: "Generative AI (Gen AI)",
    type: "Concept Assessment",
    date: "12 Aug 2026",
    duration: "60 Minutes",
    score: 94,
    maxScore: 100,
    status: "Completed",
    trainerName: "Dr. Alex Morgan",
    trainerRole: "Principal AI Research Scientist",
    trainerFeedback:
      "Exceptional theoretical and architectural mastery of self-attention mechanisms, multi-head attention blocks, positional encodings, and encoder-decoder topologies. Demonstrated textbook precision during architecture comparisons.",
    strengths: [
      "Attention mathematical derivations & QKV projection matrices",
      "Scaling laws and computational FLOPs estimation",
      "Transformer layer normalization trade-offs",
    ],
    recommendations: [
      "Explore speculative decoding and KV cache memory optimization techniques for upcoming practical modules.",
    ],
  },
  {
    id: "eval-2",
    name: "Prompt Engineering & Few-Shot In-Context Learning",
    subject: "Generative AI (Gen AI)",
    type: "Practical Lab",
    date: "28 Aug 2026",
    duration: "90 Minutes",
    score: 88,
    maxScore: 100,
    status: "Completed",
    trainerName: "Prof. Rachel Adams",
    trainerRole: "Senior Prompt Architect & NLP Fellow",
    trainerFeedback:
      "Strong practical execution of Chain-of-Thought (CoT), ReAct reasoning patterns, and system persona steering. Successfully implemented rigid JSON schema validation parsers and output guardrails against jailbreak prompts.",
    strengths: [
      "Structured CoT prompt construction",
      "Pydantic-based JSON schema output enforcement",
      "Defensive prompt engineering against prompt injections",
    ],
    recommendations: [
      "Experiment with Self-Consistency majority voting and Least-to-Most decomposition for intricate multi-step reasoning.",
    ],
  },
  {
    id: "eval-3",
    name: "Retrieval-Augmented Generation (RAG) & Vector Databases",
    subject: "Generative AI (Gen AI)",
    type: "Project Evaluation",
    date: "12 Sep 2026",
    duration: "120 Minutes",
    score: 92,
    maxScore: 100,
    status: "Completed",
    trainerName: "Dr. Sarah Jenkins",
    trainerRole: "Lead Gen AI Architect",
    trainerFeedback:
      "Superb implementation of hybrid dense vector retrieval + BM25 keyword search coupled with cross-encoder reranking. Document chunking strategies accurately reflected domain-specific nuance with minimal hallucination rates.",
    strengths: [
      "Hybrid retrieval pipeline with reciprocal rank fusion (RRF)",
      "Semantic chunking and embedding selection benchmarks",
      "Comprehensive RAG triad evaluation (Context Relevance, Groundedness, Answer Relevance)",
    ],
    recommendations: [
      "Consider integrating Graph RAG to capture inter-document knowledge graphs for hierarchical multi-hop queries.",
    ],
  },
  {
    id: "eval-4",
    name: "LLM Fine-Tuning with PEFT & LoRA / QLoRA",
    subject: "Generative AI (Gen AI)",
    type: "Coding Lab",
    date: "22 Sep 2026",
    duration: "120 Minutes",
    score: 87,
    maxScore: 100,
    status: "Completed",
    trainerName: "Vikram Patel",
    trainerRole: "Lead AI Engineer & Trainer",
    trainerFeedback:
      "Successfully quantized and instruction fine-tuned a 7B parameter open-weights model using 4-bit QLoRA on a custom domain dataset. Training loss curves converged smoothly without catastrophic forgetting, maintaining target perplexity.",
    strengths: [
      "Parameter-efficient fine-tuning (PEFT) hyperparameter tuning",
      "VRAM budget optimization via 4-bit NormalFloat (NF4)",
      "Adapter merging and inference latency benchmarking",
    ],
    recommendations: [
      "Introduce automated model evaluation harnesses such as MT-Bench and AlpacaEval to quantify win rates against baseline models.",
    ],
  },
  {
    id: "eval-5",
    name: "Autonomous AI Agents & Tool-Calling Workflows",
    subject: "Generative AI (Gen AI)",
    type: "Capstone Evaluation",
    date: "06 Oct 2026",
    duration: "180 Minutes",
    score: null,
    maxScore: 100,
    status: "Upcoming",
    trainerName: "Dr. Sarah Jenkins",
    trainerRole: "Lead Gen AI Architect",
    trainerFeedback:
      "Scheduled upcoming milestone. Evaluation will test multi-agent collaboration, state persistence, MCP tool integrations, and human-in-the-loop validation patterns.",
    strengths: ["Pre-evaluation syllabus reviewed", "Agent architecture design submitted"],
    recommendations: [
      "Practice state recovery algorithms for handling tool timeouts and non-deterministic function calls.",
    ],
  },
];

export default function EvaluationsPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Selected evaluation for detail modal
  const [selectedEvaluation, setSelectedEvaluation] = useState<EvaluationItem | null>(null);

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedEvaluation(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Compute overview metrics
  const totalEvaluations = GEN_AI_EVALUATIONS.length;
  const completedEvaluations = GEN_AI_EVALUATIONS.filter(
    (e) => e.status === "Completed" && e.score !== null
  );
  const completedCount = completedEvaluations.length;
  const averageScore =
    completedCount > 0
      ? Math.round(
          completedEvaluations.reduce((sum, e) => sum + (e.score || 0), 0) / completedCount
        )
      : 0;

  // Latest completed evaluation is eval-4 (LLM Fine-Tuning)
  const latestEvaluation =
    completedEvaluations.length > 0
      ? completedEvaluations[completedEvaluations.length - 1]
      : GEN_AI_EVALUATIONS[0];

  return (
    <DashboardLayout>
      <div className={styles.container}>
        {/* =========================================================================
            1. HERO BANNER: GENERATIVE AI (GEN AI) SUBJECT HEADER
            ========================================================================= */}
        <section className={styles.heroCard}>
          <div className={styles.glowOrb} />
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Left: Subject Branding & Title */}
            <div className="flex items-center gap-4 min-w-0">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#0062eb] flex items-center justify-center text-white shrink-0 shadow-md shadow-blue-600/30">
                <Brain className="w-6 h-6 sm:w-7 sm:h-7 stroke-[2.2]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1
                    className={`text-2xl sm:text-3xl font-black tracking-tight leading-tight ${
                      isDark ? "text-white" : "text-[#0a1b39]"
                    }`}
                  >
                    Evaluations
                  </h1>
                  <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold bg-[#0062eb]/15 text-[#0062eb] dark:text-sky-400 border border-[#0062eb]/25">
                    <Sparkles className="w-3.5 h-3.5" /> Generative AI (Gen AI)
                  </span>
                </div>
                <p
                  className={`text-xs sm:text-sm font-medium mt-1 ${
                    isDark ? "text-slate-400" : "text-slate-500"
                  }`}
                >
                  Track your assessments, performance benchmarks, and trainer feedback for Generative AI.
                </p>
              </div>
            </div>

            {/* Right: Focused Single-Subject Indicator Pill */}
            <div
              className={`hidden md:flex items-center gap-3 px-4 py-2.5 rounded-2xl border transition-colors shadow-sm shrink-0 ${
                isDark
                  ? "bg-[#0b1836]/90 border-[#1c305c]"
                  : "bg-white/95 border-[#dce8f8]"
              }`}
            >
              <div className="text-right">
                <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Active Subject Track
                </div>
                <div
                  className={`text-xs sm:text-sm font-black ${
                    isDark ? "text-white" : "text-[#0a1b39]"
                  }`}
                >
                  Generative AI (Gen AI)
                </div>
              </div>
              <div className="w-9 h-9 rounded-xl bg-blue-500/15 text-[#0062eb] dark:text-sky-400 flex items-center justify-center border border-blue-500/20">
                <Award className="w-4 h-4" />
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            2. GENERATIVE AI EVALUATION OVERVIEW (3 SUMMARY CARDS)
            ========================================================================= */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Card 1: Total Evaluations */}
          <div className={`${styles.card} p-5 flex flex-col justify-between`}>
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-[#0062eb] flex items-center justify-center text-white shadow-md shadow-blue-500/20">
                  <BookOpen className="w-5 h-5 stroke-[2.2]" />
                </div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Gen AI Curriculum
                </span>
              </div>
              <p
                className={`text-xs font-semibold ${
                  isDark ? "text-slate-400" : "text-slate-500"
                }`}
              >
                Total Evaluations
              </p>
              <p
                className={`text-3xl font-black tracking-tight leading-tight mt-1 ${
                  isDark ? "text-white" : "text-[#0a1b39]"
                }`}
              >
                {totalEvaluations}
              </p>
            </div>
            <p
              className={`text-xs font-medium mt-3 pt-3 border-t ${
                isDark ? "border-slate-800 text-slate-400" : "border-slate-100 text-slate-500"
              }`}
            >
              Scheduled across all modules
            </p>
          </div>

          {/* Card 2: Completed Evaluations */}
          <div className={`${styles.card} p-5 flex flex-col justify-between`}>
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-[#00c076] flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
                  <CheckCircle2 className="w-5 h-5 stroke-[2.4]" />
                </div>
                <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                  {Math.round((completedCount / totalEvaluations) * 100)}% Completed
                </span>
              </div>
              <p
                className={`text-xs font-semibold ${
                  isDark ? "text-slate-400" : "text-slate-500"
                }`}
              >
                Completed Evaluations
              </p>
              <p
                className={`text-3xl font-black tracking-tight leading-tight mt-1 ${
                  isDark ? "text-white" : "text-[#0a1b39]"
                }`}
              >
                {completedCount} <span className="text-lg font-bold text-slate-400">/ {totalEvaluations}</span>
              </p>
            </div>
            <p
              className={`text-xs font-medium mt-3 pt-3 border-t ${
                isDark ? "border-slate-800 text-emerald-400" : "border-slate-100 text-emerald-600"
              }`}
            >
              ✓ {totalEvaluations - completedCount} evaluation remaining
            </p>
          </div>

          {/* Card 3: Average Score */}
          <div className={`${styles.card} p-5 flex flex-col justify-between`}>
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-[#8b5cf6] flex items-center justify-center text-white shadow-md shadow-purple-500/20">
                  <TrendingUp className="w-5 h-5 stroke-[2.2]" />
                </div>
                <span className="text-[11px] font-bold text-purple-600 dark:text-purple-400 bg-purple-500/10 px-2.5 py-0.5 rounded-full border border-purple-500/20">
                  Grade A
                </span>
              </div>
              <p
                className={`text-xs font-semibold ${
                  isDark ? "text-slate-400" : "text-slate-500"
                }`}
              >
                Average Score
              </p>
              <div className="flex items-baseline gap-2 mt-1">
                <p
                  className={`text-3xl font-black tracking-tight leading-tight ${
                    isDark ? "text-white" : "text-[#0a1b39]"
                  }`}
                >
                  {averageScore}%
                </p>
                <span
                  className={`text-xs font-semibold ${
                    isDark ? "text-slate-400" : "text-slate-500"
                  }`}
                >
                  (4 assessed)
                </span>
              </div>
            </div>
            <p
              className={`text-xs font-medium mt-3 pt-3 border-t ${
                isDark ? "border-slate-800 text-slate-400" : "border-slate-100 text-slate-500"
              }`}
            >
              Top 10% in Generative AI cohort
            </p>
          </div>
        </section>

        {/* =========================================================================
            3. SCORE OVERVIEW SECTION & LATEST EVALUATION SECTION
            ========================================================================= */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          {/* A. SCORE OVERVIEW SECTION (5 Columns) */}
          <div className={`lg:col-span-5 ${styles.card} p-5 sm:p-6 flex flex-col justify-between`}>
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-[#0062eb] dark:text-sky-400 flex items-center justify-center">
                    <BarChart3 className="w-4 h-4" />
                  </div>
                  <div>
                    <h2
                      className={`text-base font-bold tracking-tight ${
                        isDark ? "text-white" : "text-[#0a1b39]"
                      }`}
                    >
                      Score Overview
                    </h2>
                    <p
                      className={`text-[11px] font-medium ${
                        isDark ? "text-slate-400" : "text-slate-500"
                      }`}
                    >
                      Generative AI Competency Breakdown
                    </p>
                  </div>
                </div>
                <span className="text-xs font-bold text-[#0062eb] dark:text-sky-400">
                  {averageScore}% Overall
                </span>
              </div>

              {/* Visual Score Bars for Generative AI Topics */}
              <div className="space-y-3.5 mt-4">
                {GEN_AI_EVALUATIONS.filter((e) => e.score !== null).map((item) => {
                  const score = item.score || 0;
                  return (
                    <div key={item.id}>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span
                          className={`font-semibold truncate max-w-[240px] ${
                            isDark ? "text-slate-200" : "text-slate-700"
                          }`}
                        >
                          {item.name.replace("Gen AI ", "").replace("LLM ", "")}
                        </span>
                        <span className="font-bold text-slate-800 dark:text-white shrink-0 ml-2">
                          {score}%
                        </span>
                      </div>
                      <div
                        className={`w-full h-2 rounded-full overflow-hidden ${
                          isDark ? "bg-[#142240]" : "bg-slate-100"
                        }`}
                      >
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${score}%`,
                            backgroundColor:
                              score >= 90
                                ? "#00c076"
                                : score >= 80
                                ? "#0062eb"
                                : "#f59e0b",
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Insight Badge */}
            <div
              className={`mt-5 p-3 rounded-xl border flex items-center gap-3 ${
                isDark
                  ? "bg-[#0b162f] border-[#16274e]"
                  : "bg-blue-50/70 border-blue-200/80"
              }`}
            >
              <div className="w-8 h-8 rounded-lg bg-[#0062eb] text-white flex items-center justify-center shrink-0 shadow-sm">
                <CheckCircle className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <p className="font-bold text-slate-800 dark:text-white">
                  Consistent High Performance
                </p>
                <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                  All completed Gen AI assessments exceed the 85% honor threshold.
                </p>
              </div>
            </div>
          </div>

          {/* B. LATEST EVALUATION SECTION (7 Columns) */}
          <div className={`lg:col-span-7 ${styles.card} p-5 sm:p-6 flex flex-col justify-between`}>
            <div>
              {/* Header */}
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3.5">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-[#0062eb] text-white shadow-sm shadow-blue-500/25">
                    Latest Evaluation
                  </span>
                  <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25">
                    {latestEvaluation.status}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{latestEvaluation.date}</span>
                </div>
              </div>

              {/* Title & Type */}
              <h3
                className={`text-lg sm:text-xl font-black tracking-tight leading-snug ${
                  isDark ? "text-white" : "text-[#0a1b39]"
                }`}
              >
                {latestEvaluation.name}
              </h3>
              <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-1">
                <span>Subject: <strong className="text-[#0062eb] dark:text-sky-400 font-bold">{latestEvaluation.subject}</strong></span>
                <span>•</span>
                <span>Type: <strong className="font-semibold text-slate-700 dark:text-slate-300">{latestEvaluation.type}</strong></span>
                <span>•</span>
                <span>Duration: <strong className="font-semibold text-slate-700 dark:text-slate-300">{latestEvaluation.duration}</strong></span>
              </div>

              {/* Score Display Card */}
              <div
                className={`mt-4 p-3.5 rounded-xl border flex items-center justify-between ${
                  isDark
                    ? "bg-[#0b162f] border-[#16274e]"
                    : "bg-slate-50 border-slate-200"
                }`}
              >
                <div>
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    Evaluation Score
                  </span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                      {latestEvaluation.score}
                    </span>
                    <span className="text-xs font-bold text-slate-400">/ {latestEvaluation.maxScore}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    Performance Grade
                  </span>
                  <p className="text-base font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
                    Grade A (Excellent)
                  </p>
                </div>
              </div>

              {/* Trainer Feedback Box */}
              <div
                className={`mt-4 p-4 rounded-xl border relative ${
                  isDark
                    ? "bg-[#09152e] border-[#182d5a]"
                    : "bg-blue-50/50 border-blue-100"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-full bg-[#0062eb] text-white flex items-center justify-center text-xs font-bold">
                    <UserCheck className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-800 dark:text-white">
                      {latestEvaluation.trainerName}
                    </span>
                    <span className="text-[10px] text-slate-400 ml-1.5">
                      ({latestEvaluation.trainerRole})
                    </span>
                  </div>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 italic leading-relaxed">
                  &ldquo;{latestEvaluation.trainerFeedback}&rdquo;
                </p>
              </div>
            </div>

            {/* View Evaluation Button */}
            <div className="mt-5 pt-3.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-3">
              <span className="text-xs font-medium text-slate-400">
                Click to inspect full rubrics, strengths & recommendations.
              </span>
              <button
                type="button"
                onClick={() => setSelectedEvaluation(latestEvaluation)}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#0062eb] hover:bg-[#0052cc] text-white shadow-md shadow-blue-500/25 flex items-center gap-2 transition-all cursor-pointer active:scale-[0.98] shrink-0"
              >
                <span>View Evaluation</span>
                <Eye className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>

        {/* =========================================================================
            4. CLEAN EVALUATION LIST (GENERATIVE AI ONLY)
            ========================================================================= */}
        <section className={`${styles.card} p-5 sm:p-6`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <h2
                className={`text-base sm:text-lg font-black tracking-tight ${
                  isDark ? "text-white" : "text-[#0a1b39]"
                }`}
              >
                Generative AI Evaluations List
              </h2>
              <p
                className={`text-xs font-medium mt-0.5 ${
                  isDark ? "text-slate-400" : "text-slate-500"
                }`}
              >
                All assessments in your active Generative AI track
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Showing {GEN_AI_EVALUATIONS.length} Evaluations
              </span>
            </div>
          </div>

          <div className={styles.tableWrapper}>
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr
                  className={`border-b text-[10px] uppercase font-bold tracking-wider ${
                    isDark
                      ? "border-[#142240] text-slate-400 bg-[#071129]/50"
                      : "border-slate-100 text-slate-400 bg-slate-50/50"
                  }`}
                >
                  <th className="py-3 px-4">Evaluation Name</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Score</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody
                className={`divide-y ${
                  isDark ? "divide-[#142240]/60" : "divide-slate-100"
                }`}
              >
                {GEN_AI_EVALUATIONS.map((evalItem) => {
                  const isCompleted = evalItem.status === "Completed";
                  return (
                    <tr
                      key={evalItem.id}
                      className={`transition-colors ${
                        isDark ? "hover:bg-[#0c1833]" : "hover:bg-slate-50/80"
                      }`}
                    >
                      {/* 1. Evaluation Name */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${
                              isCompleted
                                ? isDark
                                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                  : "bg-emerald-50 text-emerald-600 border-emerald-200"
                                : isDark
                                ? "bg-blue-500/10 text-sky-400 border-blue-500/20"
                                : "bg-blue-50 text-[#0062eb] border-blue-200"
                            }`}
                          >
                            <Brain className="w-4 h-4" />
                          </div>
                          <div>
                            <span
                              className={`font-bold block ${
                                isDark ? "text-slate-100" : "text-[#0a1b39]"
                              }`}
                            >
                              {evalItem.name}
                            </span>
                            <span className="text-[10px] text-slate-400 font-medium">
                              {evalItem.subject} • {evalItem.duration}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* 2. Type */}
                      <td className="py-3.5 px-4 font-medium text-slate-600 dark:text-slate-300">
                        {evalItem.type}
                      </td>

                      {/* 3. Date */}
                      <td className="py-3.5 px-4 font-medium text-slate-500 dark:text-slate-400 whitespace-nowrap">
                        {evalItem.date}
                      </td>

                      {/* 4. Score */}
                      <td className="py-3.5 px-4">
                        {evalItem.score !== null ? (
                          <div className="flex items-center gap-2">
                            <span className="font-black text-xs text-emerald-600 dark:text-emerald-400">
                              {evalItem.score} / {evalItem.maxScore}
                            </span>
                            <span className="text-[10px] text-slate-400 font-semibold">
                              ({Math.round((evalItem.score / evalItem.maxScore) * 100)}%)
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-400 font-medium">Pending</span>
                        )}
                      </td>

                      {/* 5. Status */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            isCompleted
                              ? isDark
                                ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                                : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : isDark
                              ? "bg-[#0062eb]/15 text-sky-400 border border-blue-500/30"
                              : "bg-blue-50 text-blue-700 border border-blue-200"
                          }`}
                        >
                          {evalItem.status}
                        </span>
                      </td>

                      {/* 6. Action: View Evaluation */}
                      <td className="py-3.5 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => setSelectedEvaluation(evalItem)}
                          className="px-3 py-1.5 rounded-lg text-xs font-bold text-[#0062eb] dark:text-sky-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                        >
                          <span>View</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* =========================================================================
            5. EVALUATION DETAILS MODAL ("When an evaluation is opened")
            ========================================================================= */}
        {selectedEvaluation && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setSelectedEvaluation(null)}
          >
            <div
              className={`w-full max-w-2xl rounded-2xl border shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto ${
                isDark
                  ? "bg-[#081229] border-[#192f5e] text-white"
                  : "bg-white border-slate-200 text-[#0a1b39]"
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setSelectedEvaluation(null)}
                className={`absolute top-5 right-5 p-2 rounded-xl border transition-colors ${
                  isDark
                    ? "border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800"
                    : "border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                }`}
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Modal Header */}
              <div className="pr-10">
                <div className="flex items-center gap-2 mb-2">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#0062eb]/15 text-[#0062eb] dark:text-sky-400 border border-[#0062eb]/25">
                    <Sparkles className="w-3 h-3" /> {selectedEvaluation.subject}
                  </span>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      selectedEvaluation.status === "Completed"
                        ? isDark
                          ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                          : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : isDark
                        ? "bg-[#0062eb]/15 text-sky-400 border border-blue-500/30"
                        : "bg-blue-50 text-blue-700 border border-blue-200"
                    }`}
                  >
                    {selectedEvaluation.status}
                  </span>
                </div>

                <h3 className="text-xl font-black tracking-tight leading-snug">
                  {selectedEvaluation.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Type: <span className="font-semibold text-slate-700 dark:text-slate-300">{selectedEvaluation.type}</span>
                </p>
              </div>

              {/* Key Metadata 4-Box Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-5">
                {/* 1. Generative AI Subject */}
                <div
                  className={`p-3 rounded-xl border ${
                    isDark ? "bg-[#0b1836] border-[#182b52]" : "bg-slate-50 border-slate-200"
                  }`}
                >
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Subject
                  </span>
                  <span className="text-xs font-black text-[#0062eb] dark:text-sky-400 block mt-1 truncate">
                    {selectedEvaluation.subject}
                  </span>
                </div>

                {/* 2. Score */}
                <div
                  className={`p-3 rounded-xl border ${
                    isDark ? "bg-[#0b1836] border-[#182b52]" : "bg-slate-50 border-slate-200"
                  }`}
                >
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Score
                  </span>
                  <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 block mt-1">
                    {selectedEvaluation.score !== null
                      ? `${selectedEvaluation.score} / ${selectedEvaluation.maxScore}`
                      : "Pending"}
                  </span>
                </div>

                {/* 3. Date */}
                <div
                  className={`p-3 rounded-xl border ${
                    isDark ? "bg-[#0b1836] border-[#182b52]" : "bg-slate-50 border-slate-200"
                  }`}
                >
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Date
                  </span>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block mt-1">
                    {selectedEvaluation.date}
                  </span>
                </div>

                {/* 4. Duration */}
                <div
                  className={`p-3 rounded-xl border ${
                    isDark ? "bg-[#0b1836] border-[#182b52]" : "bg-slate-50 border-slate-200"
                  }`}
                >
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Duration
                  </span>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block mt-1">
                    {selectedEvaluation.duration}
                  </span>
                </div>
              </div>

              {/* Trainer Feedback Section */}
              <div
                className={`p-4.5 rounded-2xl border mb-5 ${
                  isDark
                    ? "bg-[#0c1a3b] border-[#1d366b]"
                    : "bg-blue-50/70 border-blue-200/80"
                }`}
              >
                <div className="flex items-center gap-3 mb-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#0062eb] text-white flex items-center justify-center font-bold text-xs shadow-sm">
                    <UserCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold leading-tight">
                      {selectedEvaluation.trainerName}
                    </h4>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">
                      {selectedEvaluation.trainerRole}
                    </p>
                  </div>
                </div>

                <div className="text-xs text-slate-700 dark:text-slate-200 italic leading-relaxed pl-1 border-l-2 border-[#0062eb] my-2">
                  &ldquo;{selectedEvaluation.trainerFeedback}&rdquo;
                </div>

                {/* Strengths & Recommendations */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 pt-3 border-t border-blue-200/50 dark:border-blue-900/50 text-xs">
                  <div>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 block mb-1">
                      Key Strengths:
                    </span>
                    <ul className="space-y-1">
                      {selectedEvaluation.strengths.map((str, idx) => (
                        <li key={idx} className="text-[11px] text-slate-600 dark:text-slate-300 flex items-start gap-1.5">
                          <span className="text-emerald-500 shrink-0">✓</span> {str}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <span className="font-bold text-[#0062eb] dark:text-sky-400 block mb-1">
                      Next Step Recommendations:
                    </span>
                    <ul className="space-y-1">
                      {selectedEvaluation.recommendations.map((rec, idx) => (
                        <li key={idx} className="text-[11px] text-slate-600 dark:text-slate-300 flex items-start gap-1.5">
                          <span className="text-blue-500 shrink-0">→</span> {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setSelectedEvaluation(null)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                    isDark
                      ? "border-slate-800 text-slate-300 hover:bg-slate-800"
                      : "border-slate-200 text-slate-700 hover:bg-slate-100"
                  }`}
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
