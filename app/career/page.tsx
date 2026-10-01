"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import DashboardLayout from "@/components/DashboardLayout";
import { useTheme } from "@/components/ThemeProvider";
import {
  Target,
  Award,
  CheckCircle2,
  Circle,
  FileText,
  Globe,
  Briefcase,
  ArrowRight,
  ExternalLink,
  Edit3,
  Plus,
  Download,
  Upload,
  X,
  Check,
  Sparkles,
  MapPin,
  Mail,
  Phone,
  Calendar,
  Star,
  User,
  BadgeCheck,
} from "lucide-react";

// Social SVG Icons
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

function LinkedinIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9h2.79v8.37H6.46v-8.37M7.86 6.72a1.63 1.63 0 1 0 0 3.26 1.63 1.63 0 0 0 0-3.26z" />
    </svg>
  );
}

export default function CareerProfilePage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Career Profile Dynamic State
  const [profileData, setProfileData] = useState({
    name: "Arjun Kumar",
    studentId: "NIM-2026-0482",
    headline: "Generative AI & Data Engineering Specialist • Building Production-Grade Agentic Workflows",
    targetRole: "AI / Machine Learning Engineer",
    targetCompensation: "₹14 – ₹22 LPA",
    location: "Bengaluru, India (Open to Remote / Hybrid)",
    email: "arjun.kumar@nim.academy",
    phone: "+91 98765 43210",
    bio: "Passionate AI engineer experienced in building Retrieval-Augmented Generation (RAG) pipelines, fine-tuning 7B+ LLMs using LoRA/QLoRA, and architecting multi-agent systems with LangChain and FastAPI.",
    linkedinUrl: "https://linkedin.com/in/arjun-ai-engineer",
    githubUrl: "https://github.com/arjun-ai-labs",
    portfolioUrl: "https://arjunkumar.ai",
    availability: "Available for Placement (Immediate)",
  });

  // Edit Profile Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState(profileData);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Close modal on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsEditModalOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleOpenEdit = () => {
    setEditForm(profileData);
    setIsEditModalOpen(true);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileData(editForm);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      setIsEditModalOpen(false);
    }, 600);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-7xl mx-auto pb-12">
        {/* =========================================================================
            1. CAREER PROFILE HEADER BANNER
            ========================================================================= */}
        <section
          className={`relative overflow-hidden rounded-3xl p-6 sm:p-8 border transition-all shadow-sm ${
            isDark
              ? "bg-gradient-to-r from-[#07132b] via-[#091a3c] to-[#07132b] border-[#15274e] text-white"
              : "bg-gradient-to-r from-white via-[#f0f6fe] to-[#e8f2fe] border-[#d2e4f8] text-[#0a1b39]"
          }`}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 relative z-10">
            {/* Title & Badge */}
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-[#0062eb] flex items-center justify-center text-white shrink-0 shadow-md shadow-blue-600/30">
                <Target className="w-7 h-7 stroke-[2.2]" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2.5">
                  <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                    Career Profile &amp; Portfolio
                  </h1>
                  <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold bg-[#0062eb]/15 text-[#0062eb] dark:text-sky-400 border border-[#0062eb]/25">
                    <Sparkles className="w-3.5 h-3.5" /> Placement Verified
                  </span>
                </div>
                <p className={`text-xs sm:text-sm mt-1 font-medium ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                  Curate your student resume, technical projects, verified skills, and interview readiness for recruitment drives.
                </p>
              </div>
            </div>

            {/* Header Actions: Edit Profile Button */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleOpenEdit}
                className="px-5 py-2.5 rounded-xl bg-[#0062eb] hover:bg-[#0052cc] text-white text-xs font-bold transition shadow-md shadow-blue-600/25 flex items-center gap-2 cursor-pointer active:scale-[0.98]"
              >
                <Edit3 className="w-4 h-4" />
                <span>Edit Career Profile</span>
              </button>
            </div>
          </div>
        </section>

        {/* =========================================================================
            2. TOP 4-COLUMN CAREER OVERVIEW METRICS GRID
            ========================================================================= */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Target Role */}
          <div
            className={`p-5 rounded-2xl border transition-all ${
              isDark ? "bg-[#081024] border-[#15274d]" : "bg-white border-[#e2edf8] shadow-sm"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Target Role
              </span>
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-[#0062eb] dark:text-sky-400 flex items-center justify-center">
                <Briefcase className="w-4 h-4" />
              </div>
            </div>
            <h3 className={`text-base font-black truncate ${isDark ? "text-white" : "text-[#0a1b39]"}`}>
              {profileData.targetRole}
            </h3>
            <p className="text-[11px] text-slate-400 font-medium mt-1">Specialization: LLM &amp; RAG Systems</p>
          </div>

          {/* Card 2: Readiness Score */}
          <div
            className={`p-5 rounded-2xl border transition-all ${
              isDark ? "bg-[#081024] border-[#15274d]" : "bg-white border-[#e2edf8] shadow-sm"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Readiness Score
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                Eligible
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <h3 className="text-2xl font-black text-emerald-600 dark:text-emerald-400">88%</h3>
              <span className="text-xs text-slate-400 font-semibold">/ 100</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden mt-2">
              <div className="h-full bg-emerald-500 rounded-full" style={{ width: "88%" }} />
            </div>
          </div>

          {/* Card 3: Target Compensation */}
          <div
            className={`p-5 rounded-2xl border transition-all ${
              isDark ? "bg-[#081024] border-[#15274d]" : "bg-white border-[#e2edf8] shadow-sm"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Target CTC
              </span>
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-500 flex items-center justify-center">
                <Award className="w-4 h-4" />
              </div>
            </div>
            <h3 className={`text-base font-black ${isDark ? "text-white" : "text-[#0a1b39]"}`}>
              {profileData.targetCompensation}
            </h3>
            <p className="text-[11px] text-slate-400 font-medium mt-1">Full-time graduate recruitment</p>
          </div>

          {/* Card 4: Resume Quality */}
          <div
            className={`p-5 rounded-2xl border transition-all ${
              isDark ? "bg-[#081024] border-[#15274d]" : "bg-white border-[#e2edf8] shadow-sm"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                ATS Resume Score
              </span>
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                <BadgeCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <h3 className="text-2xl font-black text-[#0062eb] dark:text-sky-400">94</h3>
              <span className="text-xs text-slate-400 font-semibold">/ 100</span>
            </div>
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold mt-1">
              ✓ Verified by Placement Mentor
            </p>
          </div>
        </section>

        {/* =========================================================================
            3. STUDENT IDENTITY & CAREER SUMMARY CARD
            ========================================================================= */}
        <section
          className={`p-6 sm:p-7 rounded-3xl border transition-all ${
            isDark ? "bg-[#081024] border-[#15274d]" : "bg-white border-[#e2edf8] shadow-sm"
          }`}
        >
          <div className="flex flex-col md:flex-row items-start gap-6">
            {/* Student Avatar with Active Ring */}
            <div className="relative">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-tr from-[#0062eb] to-[#4f46e5] flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-blue-500/25 shrink-0 border-2 border-white dark:border-slate-800">
                AK
              </div>
              <span
                className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white dark:border-[#081024] flex items-center justify-center text-white"
                title="Active Student"
              >
                <Check className="w-3 h-3 stroke-[3]" />
              </span>
            </div>

            {/* Profile Content */}
            <div className="flex-1 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className={`text-xl sm:text-2xl font-black tracking-tight ${isDark ? "text-white" : "text-[#0a1b39]"}`}>
                      {profileData.name}
                    </h2>
                    <span className="px-2 py-0.5 rounded-md text-[11px] font-mono font-bold bg-blue-500/10 text-[#0062eb] dark:text-sky-400 border border-blue-500/20">
                      {profileData.studentId}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm font-semibold text-[#0062eb] dark:text-sky-400 mt-0.5">
                    {profileData.headline}
                  </p>
                </div>
              </div>

              <p className={`text-xs sm:text-[13px] leading-relaxed font-normal ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                {profileData.bio}
              </p>

              {/* Meta Chips */}
              <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{profileData.location}</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>{profileData.email}</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{profileData.phone}</span>
                </div>
              </div>

              {/* Public Links Bar */}
              <div className="flex flex-wrap items-center gap-2.5 pt-2">
                <a
                  href={profileData.linkedinUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-500 text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-[#0062eb] transition flex items-center gap-1.5"
                >
                  <LinkedinIcon className="w-3.5 h-3.5 text-sky-600" />
                  <span>LinkedIn Profile</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>

                <a
                  href={profileData.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-purple-500 text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-purple-600 transition flex items-center gap-1.5"
                >
                  <GithubIcon className="w-3.5 h-3.5 text-purple-600" />
                  <span>GitHub Repos</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>

                <a
                  href={profileData.portfolioUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-emerald-500 text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-emerald-600 transition flex items-center gap-1.5"
                >
                  <Globe className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Portfolio Site</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            4. MAIN 2-COLUMN SECTION: CAREER ASSETS & PLACEMENT CLEARANCE
            ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column (7 cols): Verified Career Assets */}
          <div className="lg:col-span-7 space-y-6">
            {/* A. 4-Box Career Assets Grid */}
            <div>
              <div className="flex items-center justify-between mb-3.5">
                <h3 className={`text-base font-black tracking-tight ${isDark ? "text-white" : "text-[#0a1b39]"}`}>
                  Verified Career Assets
                </h3>
                <span className="text-xs font-bold text-[#0062eb] dark:text-sky-400">
                  4 of 4 Verified
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Asset 1: Resume */}
                <div
                  className={`p-5 rounded-2xl border transition-all ${
                    isDark ? "bg-[#081024] border-[#15274d]" : "bg-white border-[#e2edf8] shadow-sm"
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/15 text-[#0062eb] flex items-center justify-center">
                      <FileText className="w-5 h-5 stroke-[2.2]" />
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/15 text-emerald-600 border border-emerald-500/30">
                      Approved (94%)
                    </span>
                  </div>
                  <h4 className={`text-sm font-bold ${isDark ? "text-white" : "text-[#0a1b39]"}`}>
                    ATS Resume (PDF)
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-1">
                    Arjun_Kumar_Resume_AI_2026.pdf
                  </p>
                  <div className="mt-4 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => alert("Downloading verified ATS Resume PDF...")}
                      className="flex-1 py-2 rounded-xl text-xs font-bold bg-[#0062eb] hover:bg-[#0052cc] text-white transition flex items-center justify-center gap-1.5 shadow-sm shadow-blue-500/20"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleOpenEdit}
                      className="px-3 py-2 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                      title="Update Resume"
                    >
                      <Upload className="w-3.5 h-3.5 text-slate-500" />
                    </button>
                  </div>
                </div>

                {/* Asset 2: GitHub Portfolio */}
                <div
                  className={`p-5 rounded-2xl border transition-all ${
                    isDark ? "bg-[#081024] border-[#15274d]" : "bg-white border-[#e2edf8] shadow-sm"
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/15 text-purple-600 flex items-center justify-center">
                      <GithubIcon className="w-5 h-5" />
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/15 text-purple-600 border border-purple-500/30">
                      18 Repositories
                    </span>
                  </div>
                  <h4 className={`text-sm font-bold ${isDark ? "text-white" : "text-[#0a1b39]"}`}>
                    GitHub AI Portfolio
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-1">
                    PyTorch, RAG Pipelines &amp; Model Weights
                  </p>
                  <a
                    href={profileData.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 w-full py-2 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition flex items-center justify-center gap-1.5"
                  >
                    <span>View GitHub Profile</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                {/* Asset 3: LinkedIn Profile */}
                <div
                  className={`p-5 rounded-2xl border transition-all ${
                    isDark ? "bg-[#081024] border-[#15274d]" : "bg-white border-[#e2edf8] shadow-sm"
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-sky-500/15 text-sky-600 flex items-center justify-center">
                      <LinkedinIcon className="w-5 h-5" />
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/15 text-emerald-600 border border-emerald-500/30">
                      500+ Network
                    </span>
                  </div>
                  <h4 className={`text-sm font-bold ${isDark ? "text-white" : "text-[#0a1b39]"}`}>
                    LinkedIn Profile
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-1">
                    Recommendations &amp; verified badges linked
                  </p>
                  <a
                    href={profileData.linkedinUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 w-full py-2 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition flex items-center justify-center gap-1.5"
                  >
                    <span>View LinkedIn</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                {/* Asset 4: Live Portfolio Site */}
                <div
                  className={`p-5 rounded-2xl border transition-all ${
                    isDark ? "bg-[#081024] border-[#15274d]" : "bg-white border-[#e2edf8] shadow-sm"
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-600 flex items-center justify-center">
                      <Globe className="w-5 h-5" />
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/15 text-emerald-600 border border-emerald-500/30">
                      Live Vercel
                    </span>
                  </div>
                  <h4 className={`text-sm font-bold ${isDark ? "text-white" : "text-[#0a1b39]"}`}>
                    Personal Portfolio Site
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-1">
                    Live interactive demonstrations &amp; case studies
                  </p>
                  <a
                    href={profileData.portfolioUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 w-full py-2 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition flex items-center justify-center gap-1.5"
                  >
                    <span>Visit Portfolio</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column (5 cols): Placement Clearance */}
          <div className="lg:col-span-5 space-y-5">
            {/* Placement Readiness Stepper Card */}
            <div
              className={`p-6 rounded-3xl border transition-all ${
                isDark ? "bg-[#081024] border-[#15274d]" : "bg-white border-[#e2edf8] shadow-sm"
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className={`text-base font-black tracking-tight ${isDark ? "text-white" : "text-[#0a1b39]"}`}>
                  Placement Clearance
                </h3>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  3 of 5 Cleared
                </span>
              </div>

              <div className="space-y-4">
                {/* Item 1 */}
                <div className="flex items-start gap-3 text-xs">
                  <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <div>
                    <h5 className={`font-bold ${isDark ? "text-slate-200" : "text-slate-900"}`}>
                      ATS Resume Verified
                    </h5>
                    <p className="text-[11px] text-slate-400">Score: 94/100 • Approved by Mentor</p>
                  </div>
                </div>

                {/* Item 2 */}
                <div className="flex items-start gap-3 text-xs">
                  <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <div>
                    <h5 className={`font-bold ${isDark ? "text-slate-200" : "text-slate-900"}`}>
                      Coding Assessment Benchmark
                    </h5>
                    <p className="text-[11px] text-slate-400">160+ Problems Cleared on Platform</p>
                  </div>
                </div>

                {/* Item 3 */}
                <div className="flex items-start gap-3 text-xs">
                  <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <div>
                    <h5 className={`font-bold ${isDark ? "text-slate-200" : "text-slate-900"}`}>
                      Technical Mock Interview 1
                    </h5>
                    <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                      Score: 9.2 / 10 • Cleared
                    </p>
                  </div>
                </div>

                {/* Item 4 (Scheduled) */}
                <div className="flex items-start gap-3 text-xs">
                  <div className="w-5 h-5 rounded-full bg-[#0062eb] text-white flex items-center justify-center shrink-0 mt-0.5 font-bold text-[10px]">
                    4
                  </div>
                  <div>
                    <h5 className={`font-bold ${isDark ? "text-slate-200" : "text-slate-900"}`}>
                      System Design Mock Interview
                    </h5>
                    <p className="text-[11px] text-[#0062eb] dark:text-sky-400 font-medium">
                      Scheduled for 10 Oct 2026 • 04:00 PM
                    </p>
                  </div>
                </div>

                {/* Item 5 (Pending) */}
                <div className="flex items-start gap-3 text-xs opacity-60">
                  <div className="w-5 h-5 rounded-full border border-slate-300 dark:border-slate-700 flex items-center justify-center shrink-0 mt-0.5 text-[10px] text-slate-400 font-bold">
                    5
                  </div>
                  <div>
                    <h5 className={`font-bold ${isDark ? "text-slate-400" : "text-slate-700"}`}>
                      HR &amp; Leadership Behavioral Round
                    </h5>
                    <p className="text-[11px] text-slate-400">Unlocks upon passing Mock 2</p>
                  </div>
                </div>
              </div>

              {/* Recruitment CTA Button */}
              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => alert("Connecting to NIM Academy Career Counselor...")}
                  className="w-full py-2.5 rounded-xl bg-[#0062eb] hover:bg-[#0052cc] text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-md shadow-blue-500/25 cursor-pointer"
                >
                  <span>Connect with Placement Cell</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================================
            5. INTERACTIVE STUDENT CAREER PROFILE EDIT / CREATION MODAL
            ========================================================================= */}
        {isEditModalOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setIsEditModalOpen(false)}
            role="dialog"
            aria-modal="true"
          >
            <div
              className={`w-full max-w-2xl rounded-3xl border shadow-2xl p-6 sm:p-7 relative max-h-[90vh] overflow-y-auto flex flex-col ${
                isDark
                  ? "bg-[#081229] border-[#192f5e] text-white"
                  : "bg-white border-slate-200 text-[#0a1b39]"
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-[#0062eb] flex items-center justify-center">
                    <Edit3 className="w-5 h-5 stroke-[2.2]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black tracking-tight">
                      Edit Career Profile
                    </h3>
                    <p className="text-xs text-slate-400">
                      Update your target role, public links, and professional summary
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {saveSuccess && (
                <div className="mt-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Career Profile updated successfully!</span>
                </div>
              )}

              {/* Form Grid */}
              <form onSubmit={handleSaveProfile} className="space-y-4 my-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 px-3.5 py-2.5 bg-white dark:bg-[#081024] outline-none focus:border-[#0062eb]"
                      required
                    />
                  </div>

                  {/* Target Role */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
                      Target Role
                    </label>
                    <input
                      type="text"
                      value={editForm.targetRole}
                      onChange={(e) => setEditForm({ ...editForm, targetRole: e.target.value })}
                      className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 px-3.5 py-2.5 bg-white dark:bg-[#081024] outline-none focus:border-[#0062eb]"
                      required
                    />
                  </div>

                  {/* Target CTC */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
                      Target Compensation (CTC)
                    </label>
                    <input
                      type="text"
                      value={editForm.targetCompensation}
                      onChange={(e) => setEditForm({ ...editForm, targetCompensation: e.target.value })}
                      className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 px-3.5 py-2.5 bg-white dark:bg-[#081024] outline-none focus:border-[#0062eb]"
                      required
                    />
                  </div>

                  {/* Preferred Location */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
                      Preferred Location
                    </label>
                    <input
                      type="text"
                      value={editForm.location}
                      onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                      className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 px-3.5 py-2.5 bg-white dark:bg-[#081024] outline-none focus:border-[#0062eb]"
                      required
                    />
                  </div>

                  {/* Headline (Spans 2) */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
                      Professional Headline
                    </label>
                    <input
                      type="text"
                      value={editForm.headline}
                      onChange={(e) => setEditForm({ ...editForm, headline: e.target.value })}
                      className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 px-3.5 py-2.5 bg-white dark:bg-[#081024] outline-none focus:border-[#0062eb]"
                      required
                    />
                  </div>

                  {/* Bio (Spans 2) */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
                      Career Summary &amp; Bio
                    </label>
                    <textarea
                      rows={3}
                      value={editForm.bio}
                      onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                      className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 p-3 bg-white dark:bg-[#081024] outline-none focus:border-[#0062eb]"
                      required
                    />
                  </div>

                  {/* LinkedIn URL */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
                      LinkedIn URL
                    </label>
                    <input
                      type="url"
                      value={editForm.linkedinUrl}
                      onChange={(e) => setEditForm({ ...editForm, linkedinUrl: e.target.value })}
                      className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 px-3.5 py-2.5 bg-white dark:bg-[#081024] outline-none focus:border-[#0062eb]"
                      required
                    />
                  </div>

                  {/* GitHub URL */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
                      GitHub URL
                    </label>
                    <input
                      type="url"
                      value={editForm.githubUrl}
                      onChange={(e) => setEditForm({ ...editForm, githubUrl: e.target.value })}
                      className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 px-3.5 py-2.5 bg-white dark:bg-[#081024] outline-none focus:border-[#0062eb]"
                      required
                    />
                  </div>

                  {/* Portfolio Website URL (Spans 2) */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
                      Portfolio Website URL
                    </label>
                    <input
                      type="url"
                      value={editForm.portfolioUrl}
                      onChange={(e) => setEditForm({ ...editForm, portfolioUrl: e.target.value })}
                      className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 px-3.5 py-2.5 bg-white dark:bg-[#081024] outline-none focus:border-[#0062eb]"
                      required
                    />
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-[#0062eb] hover:bg-[#0052cc] text-white font-bold text-xs shadow-md shadow-blue-500/25 transition cursor-pointer"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
