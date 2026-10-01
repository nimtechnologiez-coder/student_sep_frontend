"use client";

import React, { useState, useMemo } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useTheme } from "@/components/ThemeProvider";
import styles from "./projects.module.css";
import {
  FolderGit2,
  Search,
  Sparkles,
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
  BookOpen,
  Award,
  Key,
  Database,
  Check,
  X,
  Play,
  Cpu
} from "lucide-react";

// Inline GitHub SVG Icon
function GithubIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  );
}

interface Project {
  id: string;
  title: string;
  gateway: string;
  phase: string;
  description: string;
  technologies: string[];
  mentor: string;
  mentorAvatar: string;
  startDate: string;
  dueDate: string;
  progress: number;
  status: "Not Started" | "In Progress" | "Submitted" | "Under Review" | "Completed";
  score?: number;
  maxScore?: number;
  mentorFeedback?: string;
  deliverables: string[];
  githubRepo?: string;
}

const INITIAL_PROJECTS: Project[] = [
  {
    id: "proj-01",
    title: "Real-World ML Solution",
    gateway: "Gateway 1",
    phase: "Foundation (Month 1–2)",
    description: "Build an end-to-end customer attrition & prediction engine with automated feature engineering pipelines, model explainability (SHAP), and automated test suites.",
    technologies: ["Python", "Pandas", "Scikit-learn", "Data Analysis", "SHAP", "Optuna"],
    mentor: "Rahul Mehta",
    mentorAvatar: "RM",
    startDate: "01 Aug 2026",
    dueDate: "30 Aug 2026",
    progress: 100,
    status: "Completed",
    score: 96,
    maxScore: 100,
    mentorFeedback: "Outstanding feature engineering and clean modular design! The model explainability dashboard was production caliber.",
    deliverables: [
      "Modular pipeline code in Python package format",
      "Comprehensive Exploratory Data Analysis & visual report",
      "Model benchmark comparison across 4 algorithms",
      "Containerized deployment script with Dockerfile"
    ],
    githubRepo: "https://github.com/arjun-k/ml-churn-gateway1"
  },
  {
    id: "proj-02",
    title: "Intelligent AI Application",
    gateway: "Gateway 2",
    phase: "AI Engineering (Month 3–4)",
    description: "Multi-modal vision and NLP service using transformer backbones (DistilBERT + ResNet) deployed with high-performance FastAPI microservices and asynchronous workers.",
    technologies: ["PyTorch", "OpenCV", "NLP", "Transformers", "FastAPI", "Docker"],
    mentor: "Priya Sharma",
    mentorAvatar: "PS",
    startDate: "01 Sep 2026",
    dueDate: "30 Sep 2026",
    progress: 65,
    status: "In Progress",
    deliverables: [
      "PyTorch transfer learning model with >91% accuracy",
      "FastAPI endpoint with OpenAPI documentation",
      "Asynchronous inference queue with Redis",
      "Benchmark report comparing latency and throughput"
    ],
    githubRepo: "https://github.com/arjun-k/intelligent-vision-fastapi"
  },
  {
    id: "proj-03",
    title: "Enterprise GenAI / Agentic AI Capstone",
    gateway: "Gateway 3",
    phase: "Generative AI (Month 5–6)",
    description: "Production-grade autonomous multi-agent assistant with hybrid RAG pipelines, dynamic tool orchestration, semantic routing, and self-correcting evaluation loops.",
    technologies: ["LLM", "RAG", "Vector Database", "LangChain", "LangGraph", "Multi-Agent AI", "ChromaDB"],
    mentor: "Dr. Rajesh Kumar",
    mentorAvatar: "RK",
    startDate: "01 Oct 2026",
    dueDate: "31 Oct 2026",
    progress: 0,
    status: "Not Started",
    deliverables: [
      "Autonomous agent topology graph built with LangGraph",
      "Hybrid vector + full-text search with reranking",
      "Evaluation suite with Ragas and test fixtures",
      "Full web client demo and production deployment"
    ]
  }
];

export default function ProjectsPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGateway, setSelectedGateway] = useState("All Gateways");
  const [selectedStatus, setSelectedStatus] = useState("All Statuses");

  // Projects State
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);

  // Modals
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [submitModalOpen, setSubmitModalOpen] = useState(false);
  const [milestoneNotes, setMilestoneNotes] = useState("");
  const [milestoneGithub, setMilestoneGithub] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Filtered Projects
  const filteredProjects = useMemo(() => {
    return projects.filter((proj) => {
      if (
        searchQuery &&
        !proj.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !proj.description.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !proj.technologies.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
      ) {
        return false;
      }
      if (selectedGateway !== "All Gateways" && proj.gateway !== selectedGateway) return false;
      if (selectedStatus !== "All Statuses" && proj.status !== selectedStatus) return false;

      return true;
    });
  }, [projects, searchQuery, selectedGateway, selectedStatus]);

  // Overall Stats
  const completedProjects = projects.filter((p) => p.status === "Completed").length;
  const totalProjects = projects.length;
  const overallProgress = Math.round(
    projects.reduce((acc, curr) => acc + curr.progress, 0) / totalProjects
  );

  const handleOpenDetails = (proj: Project) => {
    setSelectedProject(proj);
    setDetailsModalOpen(true);
  };

  const handleOpenSubmit = (proj: Project) => {
    setSelectedProject(proj);
    setMilestoneGithub(proj.githubRepo || "");
    setMilestoneNotes("");
    setSubmitSuccess(false);
    setSubmitModalOpen(true);
  };

  const handleSubmitMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProject) return;

    setProjects((prev) =>
      prev.map((item) =>
        item.id === selectedProject.id
          ? {
              ...item,
              status: "Under Review",
              progress: Math.min(100, item.progress + 20),
              githubRepo: milestoneGithub,
            }
          : item
      )
    );
    setSubmitSuccess(true);
    setTimeout(() => {
      setSubmitModalOpen(false);
      setSubmitSuccess(false);
    }, 1500);
  };

  // Status Badge Helper
  const renderStatusBadge = (status: Project["status"]) => {
    switch (status) {
      case "Completed":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Completed
          </span>
        );
      case "In Progress":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-sky-500/15 text-sky-400 border border-sky-500/30">
            <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping mr-0.5" />
            In Progress
          </span>
        );
      case "Under Review":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/15 text-purple-400 border border-purple-500/30">
            <Clock className="w-3.5 h-3.5" />
            Under Review
          </span>
        );
      case "Submitted":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
            <Check className="w-3.5 h-3.5" />
            Submitted
          </span>
        );
      case "Not Started":
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-500/15 text-slate-400 border border-slate-500/30">
            <Clock className="w-3.5 h-3.5" />
            Not Started
          </span>
        );
    }
  };

  return (
    <DashboardLayout>
      <div className={styles.container}>
        {/* Hero Banner Header */}
        <div className={styles.heroCard}>
          <div className={styles.glowOrb} />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#0062eb]/20 text-[#38bdf8] border border-[#0062eb]/40 uppercase tracking-wider">
                  <Cpu className="w-3 h-3 text-cyan-400" />
                  Engineering Gateways
                </span>
                <span className="text-xs text-slate-400 font-medium">• 3 Industry Capstones</span>
              </div>
              <h1
                className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${
                  isDark ? "text-white" : "text-slate-900"
                }`}
              >
                Projects
              </h1>
              <p className="text-sm sm:text-base text-slate-400 mt-1 font-medium">
                Learn by building. Turn your knowledge into real-world AI solutions.
              </p>
            </div>

            {/* Quick Readiness Score Pill */}
            <div className="flex items-center gap-3">
              <div
                className={`px-4 py-2.5 rounded-xl border flex items-center gap-3 ${
                  isDark ? "bg-[#0c1630]/80 border-[#1c2e56]" : "bg-white/80 border-slate-200"
                }`}
              >
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    Portfolio Readiness
                  </p>
                  <p className="text-lg font-black text-sky-400 leading-none mt-0.5">
                    {overallProgress}%
                  </p>
                </div>
                <div className="w-10 h-10 rounded-full bg-sky-500/10 flex items-center justify-center text-sky-400">
                  <Award className="w-5 h-5" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4-Stage Project Journey Stepper */}
        <div
          className={`p-5 rounded-2xl border ${
            isDark ? "bg-[#081024] border-[#152347]" : "bg-white border-slate-200"
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <h3
              className={`text-sm font-bold tracking-tight ${
                isDark ? "text-white" : "text-slate-900"
              }`}
            >
              Project Journey Roadmap
            </h3>
            <span className="text-xs font-semibold text-slate-400">
              {completedProjects} of {totalProjects} Gateways Cleared
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative">
            {[
              {
                step: "01",
                title: "Foundation",
                duration: "Month 1–2",
                status: "Completed",
                badge: "Gateway 1 Passed",
                desc: "Data processing, ML modeling & statistical evaluation.",
                active: false,
                done: true,
              },
              {
                step: "02",
                title: "AI Engineering",
                duration: "Month 3–4",
                status: "In Progress",
                badge: "Gateway 2 Active",
                desc: "Computer Vision, Transformers & FastAPI deployment.",
                active: true,
                done: false,
              },
              {
                step: "03",
                title: "Generative AI",
                duration: "Month 5–6",
                status: "Upcoming",
                badge: "Gateway 3 Capstone",
                desc: "Production RAG, Vector Search & Agentic LangGraph.",
                active: false,
                done: false,
              },
              {
                step: "04",
                title: "Portfolio Ready",
                duration: "Graduation",
                status: "Target",
                badge: "Industry Certified",
                desc: "Public GitHub showcase, resume verification & mock demo.",
                active: false,
                done: false,
              },
            ].map((step, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-xl border relative transition-all ${
                  step.active
                    ? "bg-[#0062eb]/10 border-[#0062eb] shadow-lg shadow-blue-500/10"
                    : step.done
                    ? isDark
                      ? "bg-[#081329] border-emerald-500/30"
                      : "bg-emerald-50/50 border-emerald-200"
                    : isDark
                    ? "bg-[#0b1429] border-[#152345] opacity-80"
                    : "bg-slate-50 border-slate-200"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`text-xs font-black px-2 py-0.5 rounded-md ${
                      step.done
                        ? "bg-emerald-500/20 text-emerald-400"
                        : step.active
                        ? "bg-[#0062eb] text-white"
                        : "bg-slate-700/30 text-slate-400"
                    }`}
                  >
                    STEP {step.step}
                  </span>
                  <span
                    className={`text-[11px] font-bold ${
                      step.done
                        ? "text-emerald-400 flex items-center gap-1"
                        : step.active
                        ? "text-sky-400 animate-pulse"
                        : "text-slate-400"
                    }`}
                  >
                    {step.done && <Check className="w-3.5 h-3.5" />}
                    {step.status}
                  </span>
                </div>

                <h4
                  className={`text-sm font-bold ${
                    isDark ? "text-white" : "text-slate-900"
                  }`}
                >
                  {step.title}
                </h4>
                <p className="text-[11px] font-semibold text-slate-400 mt-0.5">
                  {step.duration}
                </p>
                <p className="text-[11px] text-slate-400/90 mt-2 line-clamp-2 leading-relaxed">
                  {step.desc}
                </p>

                <div className="mt-3 pt-2 border-t border-slate-700/30 flex items-center justify-between text-[10px]">
                  <span
                    className={`font-semibold ${
                      step.active ? "text-sky-400" : "text-slate-400"
                    }`}
                  >
                    {step.badge}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div
          className={`p-3 rounded-2xl border flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 ${
            isDark ? "bg-[#081024] border-[#152347]" : "bg-white border-slate-200"
          }`}
        >
          {/* Search Input */}
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search projects by title, framework, or technology..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 rounded-xl text-xs font-medium outline-none border ${
                isDark
                  ? "bg-[#0b162f] border-[#1b2f5c] text-white placeholder-slate-500 focus:border-sky-500"
                  : "bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-blue-600"
              }`}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Filter Dropdowns */}
          <div className="flex items-center gap-2">
            <select
              value={selectedGateway}
              onChange={(e) => setSelectedGateway(e.target.value)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold outline-none border cursor-pointer ${
                isDark
                  ? "bg-[#0b162f] border-[#1b2f5c] text-slate-200"
                  : "bg-slate-50 border-slate-300 text-slate-700"
              }`}
            >
              <option value="All Gateways">All Gateways</option>
              <option value="Gateway 1">Gateway 1</option>
              <option value="Gateway 2">Gateway 2</option>
              <option value="Gateway 3">Gateway 3</option>
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold outline-none border cursor-pointer ${
                isDark
                  ? "bg-[#0b162f] border-[#1b2f5c] text-slate-200"
                  : "bg-slate-50 border-slate-300 text-slate-700"
              }`}
            >
              <option value="All Statuses">All Statuses</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Under Review">Under Review</option>
              <option value="Not Started">Not Started</option>
            </select>
          </div>
        </div>

        {/* Main Grid: Left Projects List (8 cols) + Right Resources & Submissions (4 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: 3 Major Project Gateway Cards (8 cols) */}
          <div className="lg:col-span-8 space-y-5">
            {filteredProjects.map((proj) => (
              <div key={proj.id} className={`${styles.card} p-6`}>
                {/* Header Row: Gateway Tag, Phase & Status */}
                <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="px-3 py-1 rounded-xl text-xs font-extrabold bg-[#0062eb] text-white shadow-sm shadow-blue-600/30">
                      {proj.gateway}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      {proj.phase}
                    </span>
                  </div>

                  {renderStatusBadge(proj.status)}
                </div>

                {/* Project Title */}
                <h3
                  className={`text-lg sm:text-xl font-extrabold tracking-tight mb-2 ${
                    isDark ? "text-white" : "text-slate-900"
                  }`}
                >
                  {proj.title}
                </h3>

                {/* Project Description */}
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-4">
                  {proj.description}
                </p>

                {/* Technologies Pill Grid */}
                <div className="mb-5">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Technologies & Frameworks
                  </p>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {proj.technologies.map((tech) => (
                      <span
                        key={tech}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${
                          isDark
                            ? "bg-[#0b162f] text-sky-300 border-[#1c2e56]"
                            : "bg-blue-50 text-blue-700 border-blue-200"
                        }`}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Progress Bar & Details */}
                <div className="mb-5 p-3.5 rounded-xl bg-slate-900/40 border border-slate-800/60">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-semibold text-slate-400">Project Milestone Progress</span>
                    <span className="font-extrabold text-sky-400">{proj.progress}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        proj.status === "Completed"
                          ? "bg-emerald-500"
                          : "bg-gradient-to-r from-blue-600 to-sky-400"
                      }`}
                      style={{ width: `${proj.progress}%` }}
                    />
                  </div>
                </div>

                {/* Metadata Row: Mentor, Timeline, Score */}
                <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-800/50">
                  <div className="flex flex-wrap items-center gap-4 text-xs">
                    {/* Mentor */}
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-sky-500/20 text-sky-400 font-bold text-[10px] flex items-center justify-center border border-sky-500/30">
                        {proj.mentorAvatar}
                      </div>
                      <span className="text-slate-400">
                        Mentor: <strong className={isDark ? "text-slate-200" : "text-slate-700"}>{proj.mentor}</strong>
                      </span>
                    </div>

                    {/* Timeline */}
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      <span>{proj.startDate} – <strong>{proj.dueDate}</strong></span>
                    </div>

                    {/* Grade if completed */}
                    {proj.score && (
                      <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-emerald-500/15 text-emerald-400">
                        Score: {proj.score}/{proj.maxScore}
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => handleOpenDetails(proj)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                        isDark
                          ? "bg-[#0b162f] border-[#1b2f5c] text-slate-300 hover:text-white hover:bg-[#122247]"
                          : "bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200"
                      }`}
                    >
                      View Details
                    </button>

                    {proj.status === "In Progress" && (
                      <button
                        type="button"
                        onClick={() => handleOpenSubmit(proj)}
                        className="px-4 py-1.5 rounded-xl text-xs font-bold bg-[#0062eb] hover:bg-blue-600 text-white shadow-md shadow-blue-500/30 transition-all flex items-center gap-1.5"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Continue Project</span>
                      </button>
                    )}

                    {proj.status === "Completed" && proj.githubRepo && (
                      <a
                        href={proj.githubRepo}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20 transition-all flex items-center gap-1.5"
                      >
                        <GithubIcon className="w-3.5 h-3.5" />
                        <span>View Repository</span>
                      </a>
                    )}

                    {proj.status === "Not Started" && (
                      <button
                        type="button"
                        onClick={() => handleOpenDetails(proj)}
                        className="px-4 py-1.5 rounded-xl text-xs font-bold bg-slate-700 hover:bg-slate-600 text-white transition-all"
                      >
                        Enroll & Prepare
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right Column: Project Progress, Resources, Feedback, Deadlines (4 cols) */}
          <div className="lg:col-span-4 space-y-5">
            {/* 1. Project Progress Card */}
            <div className={`${styles.card} p-5`}>
              <h3
                className={`text-sm font-bold tracking-tight mb-3 ${
                  isDark ? "text-white" : "text-slate-900"
                }`}
              >
                Project Progress Overview
              </h3>

              <div className="p-4 rounded-xl bg-gradient-to-r from-blue-950/40 to-sky-950/20 border border-blue-500/25 mb-4">
                <div className="flex items-center justify-between text-xs font-bold mb-2">
                  <span className="text-white">Curriculum Capstones</span>
                  <span className="text-sky-400">{completedProjects} / {totalProjects} Done</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-600 via-sky-400 to-emerald-400 rounded-full"
                    style={{ width: `${overallProgress}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-2">
                  Complete Gateway 2 to unlock your Enterprise GenAI Capstone qualification.
                </p>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-800/30">
                  <span className="text-slate-300 font-medium">Gateway 1 (ML Solution)</span>
                  <span className="text-emerald-400 font-bold">100% (96/100)</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-800/30">
                  <span className="text-slate-300 font-medium">Gateway 2 (AI Application)</span>
                  <span className="text-sky-400 font-bold">65% (Active)</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-800/30">
                  <span className="text-slate-400 font-medium">Gateway 3 (GenAI Capstone)</span>
                  <span className="text-slate-500 font-bold">Starts Oct 01</span>
                </div>
              </div>
            </div>

            {/* 2. Project Resources Card */}
            <div className={`${styles.card} p-5`}>
              <div className="flex items-center justify-between mb-3.5">
                <h3
                  className={`text-sm font-bold tracking-tight ${
                    isDark ? "text-white" : "text-slate-900"
                  }`}
                >
                  Project Resources
                </h3>
                <FolderGit2 className="w-4 h-4 text-sky-400" />
              </div>

              <div className="space-y-2.5">
                {[
                  {
                    title: "GitHub Starter Repositories",
                    desc: "Boilerplate code, pytest fixtures, and Dockerfiles",
                    icon: GithubIcon,
                    href: "https://github.com",
                  },
                  {
                    title: "Cloud GPU & API Keys Guide",
                    desc: "Redeem OpenAI, Anthropic, and modal.com credits",
                    icon: Key,
                    href: "#",
                  },
                  {
                    title: "Enterprise Dataset Hub",
                    desc: "Curated S3 bucket links with train/val parquet files",
                    icon: Database,
                    href: "#",
                  },
                  {
                    title: "Architecture Rubric & Checklist",
                    desc: "Official evaluation benchmarks for 90+ score",
                    icon: BookOpen,
                    href: "#",
                  },
                ].map((res, idx) => {
                  const Icon = res.icon;
                  return (
                    <a
                      key={idx}
                      href={res.href}
                      className={`block p-3 rounded-xl border transition-all ${
                        isDark
                          ? "bg-[#0b162f] border-[#16274e] hover:border-sky-500/50 hover:bg-[#102044]"
                          : "bg-slate-50 border-slate-200 hover:border-blue-400 hover:bg-slate-100"
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        <div className="p-2 rounded-lg bg-sky-500/10 text-sky-400 shrink-0">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between">
                            <p
                              className={`text-xs font-bold leading-tight ${
                                isDark ? "text-slate-200" : "text-slate-800"
                              }`}
                            >
                              {res.title}
                            </p>
                            <ExternalLink className="w-3 h-3 text-slate-400" />
                          </div>
                          <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                            {res.desc}
                          </p>
                        </div>
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>

            {/* 3. Mentor Feedback & Submissions Card */}
            <div className={`${styles.card} p-5`}>
              <div className="flex items-center justify-between mb-3">
                <h3
                  className={`text-sm font-bold tracking-tight ${
                    isDark ? "text-white" : "text-slate-900"
                  }`}
                >
                  Mentor Feedback
                </h3>
                <Sparkles className="w-4 h-4 text-cyan-400" />
              </div>

              <div className="p-3.5 rounded-xl bg-sky-500/10 border border-sky-500/20 mb-3">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold text-sky-400">Gateway 1 Review</span>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-emerald-500/20 text-emerald-400">
                    Grade: 96 / 100
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed italic mt-1">
                  &ldquo;Outstanding feature engineering and clean modular design! The model explainability dashboard was production caliber.&rdquo;
                </p>
                <p className="text-[10px] text-slate-400 mt-2 text-right">
                  — Mentor Rahul Mehta (Principal AI Architect)
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/40 text-xs text-slate-400">
                <span className="font-semibold text-slate-300">Next Review:</span> Gateway 2 Milestone 2 code review is scheduled for 28 Sep 2026 with mentor Priya Sharma.
              </div>
            </div>

            {/* 4. Project Deadlines Card */}
            <div className={`${styles.card} p-5`}>
              <div className="flex items-center justify-between mb-3">
                <h3
                  className={`text-sm font-bold tracking-tight ${
                    isDark ? "text-white" : "text-slate-900"
                  }`}
                >
                  Project Deadlines
                </h3>
                <Clock className="w-4 h-4 text-slate-400" />
              </div>

              <div className="space-y-2.5">
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-400">Gateway 2 Final Due</span>
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-amber-500 text-slate-900">
                      7 Days Left
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 mt-1">
                    Deploy FastAPI service and containerize with Docker compose.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/40">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-300">Gateway 3 Kickoff</span>
                    <span className="text-[10px] font-semibold text-slate-400">01 Oct 2026</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Multi-agent architecture proposal and dataset ingest.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal 1: Project Details */}
        {detailsModalOpen && selectedProject && (
          <div className={styles.modalOverlay} onClick={() => setDetailsModalOpen(false)}>
            <div
              onClick={(e) => e.stopPropagation()}
              className={`w-full max-w-xl rounded-2xl border p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto ${
                isDark ? "bg-[#091228] border-[#1b2f5c] text-white" : "bg-white border-slate-300 text-slate-900"
              }`}
            >
              <button
                type="button"
                onClick={() => setDetailsModalOpen(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 rounded-xl text-xs font-bold bg-[#0062eb] text-white">
                  {selectedProject.gateway}
                </span>
                <span className="text-xs text-slate-400">{selectedProject.phase}</span>
              </div>

              <h2 className="text-xl font-bold tracking-tight mb-2">
                {selectedProject.title}
              </h2>
              <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                {selectedProject.description}
              </p>

              {/* Technologies */}
              <div className="mb-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Stack
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedProject.technologies.map((t) => (
                    <span
                      key={t}
                      className="px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-sky-500/15 text-sky-300 border border-sky-500/30"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Deliverables Rubric */}
              <div className="mb-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Gateway Deliverables
                </h4>
                <div className="space-y-1.5">
                  {selectedProject.deliverables.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2 text-xs text-slate-300 bg-slate-800/40 p-2.5 rounded-lg border border-slate-700/30"
                    >
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mentor Notes */}
              {selectedProject.mentorFeedback && (
                <div className="mb-4 p-3.5 rounded-xl bg-sky-500/10 border border-sky-500/30">
                  <p className="text-[11px] font-bold text-sky-400 uppercase tracking-wider mb-1">
                    Evaluator Feedback
                  </p>
                  <p className="text-xs text-slate-300 leading-relaxed italic">
                    &ldquo;{selectedProject.mentorFeedback}&rdquo;
                  </p>
                </div>
              )}

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setDetailsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold border border-slate-700 text-slate-300 hover:bg-slate-800"
                >
                  Close
                </button>
                {selectedProject.status === "In Progress" && (
                  <button
                    type="button"
                    onClick={() => {
                      setDetailsModalOpen(false);
                      handleOpenSubmit(selectedProject);
                    }}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-[#0062eb] hover:bg-blue-600 text-white"
                  >
                    Submit Milestone
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Modal 2: Submit / Continue Milestone */}
        {submitModalOpen && selectedProject && (
          <div className={styles.modalOverlay} onClick={() => setSubmitModalOpen(false)}>
            <div
              onClick={(e) => e.stopPropagation()}
              className={`w-full max-w-lg rounded-2xl border p-6 shadow-2xl relative ${
                isDark ? "bg-[#091228] border-[#1b2f5c] text-white" : "bg-white border-slate-300 text-slate-900"
              }`}
            >
              <button
                type="button"
                onClick={() => setSubmitModalOpen(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-bold bg-[#0062eb] text-white">
                  {selectedProject.gateway}
                </span>
                <span className="text-xs text-slate-400">Milestone Submission</span>
              </div>

              <h2 className="text-lg font-bold tracking-tight mb-2">
                Continue: {selectedProject.title}
              </h2>
              <p className="text-xs text-slate-400 mb-4">
                Update your progress, attach the latest GitHub commit branch, and request mentor review.
              </p>

              {submitSuccess ? (
                <div className="p-6 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-center my-4">
                  <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-2 animate-bounce" />
                  <h4 className="text-sm font-bold text-emerald-400">Milestone Logged!</h4>
                  <p className="text-xs text-slate-300 mt-1">
                    Your code commit has been sent to {selectedProject.mentor} for review.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmitMilestone} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                      <GithubIcon className="w-3.5 h-3.5" />
                      GitHub Project Repository URL
                    </label>
                    <input
                      type="url"
                      required
                      placeholder="https://github.com/username/ai-project"
                      value={milestoneGithub}
                      onChange={(e) => setMilestoneGithub(e.target.value)}
                      className={`w-full px-3.5 py-2 rounded-xl text-xs font-medium outline-none border ${
                        isDark
                          ? "bg-[#070e20] border-[#1b2f5c] text-white focus:border-sky-500"
                          : "bg-slate-50 border-slate-300 text-slate-900 focus:border-blue-600"
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Milestone Summary & Changes Made
                    </label>
                    <textarea
                      rows={3}
                      required
                      placeholder="Describe what you built in this sprint (e.g., added FastAPI endpoints, achieved 92% validation accuracy)..."
                      value={milestoneNotes}
                      onChange={(e) => setMilestoneNotes(e.target.value)}
                      className={`w-full px-3.5 py-2 rounded-xl text-xs font-medium outline-none border ${
                        isDark
                          ? "bg-[#070e20] border-[#1b2f5c] text-white focus:border-sky-500"
                          : "bg-slate-50 border-slate-300 text-slate-900 focus:border-blue-600"
                      }`}
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2.5 pt-2">
                    <button
                      type="button"
                      onClick={() => setSubmitModalOpen(false)}
                      className="px-4 py-2 rounded-xl text-xs font-semibold border border-slate-700 text-slate-300 hover:bg-slate-800"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl text-xs font-bold bg-[#0062eb] hover:bg-blue-600 text-white shadow-md shadow-blue-500/30 flex items-center gap-1.5"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Submit for Evaluation</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

