"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import DashboardLayout from "@/components/DashboardLayout";
import { useTheme } from "@/components/ThemeProvider";
import { StudentApi } from "@/lib/studentApi";
import { TablePageSkeleton } from "@/components/Skeleton";
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
  Download,
  Upload,
  X,
  Check,
  Sparkles,
  MapPin,
  Mail,
  Phone,
  BadgeCheck,
  Loader2,
  Send,
  Clock,
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

  const [student, setStudent] = useState<any>(null);
  const [kpi, setKpi] = useState<any>(null);
  const [careerData, setCareerData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Career Profile Form State
  const [profileData, setProfileData] = useState({
    name: "Vijay",
    studentId: "NIM-2026-34978",
    headline: "Full Stack Web Development (Placement Track)",
    targetRole: "Full Stack Web Developer",
    targetCompensation: "₹6 – ₹12 LPA",
    location: "India (Open to Remote / Hybrid)",
    email: "vijay@student.nim.academy",
    phone: "+91 98765 00000",
    bio: "Enrolled in Full Stack Web Development at NIM Academy. Mastering modern frontend architectures, backend APIs, and database engineering.",
    linkedinUrl: "https://linkedin.com",
    githubUrl: "https://github.com",
    portfolioUrl: "",
    availability: "Placement Track Active",
  });

  // Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState(profileData);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Asset Add/Edit Modal State
  const [assetModal, setAssetModal] = useState<"resume" | "github" | "linkedin" | null>(null);
  const [assetInput, setAssetInput] = useState({
    resumeFile: null as File | null,
    resumeName: "",
    githubUrl: "",
    linkedinUrl: "",
  });
  const [isSavingAsset, setIsSavingAsset] = useState(false);
  const [assetSaveMessage, setAssetSaveMessage] = useState("");

  useEffect(() => {
    setIsLoading(true);

    Promise.all([
      StudentApi.getDashboard(),
      StudentApi.getCareer(),
    ])
      .then(([dashData, cData]) => {
        const s = dashData?.student;
        if (s) {
          setStudent(s);
          const initial = {
            name: s.name || "Vijay",
            studentId: s.student_id || "NIM-2026-34978",
            headline: `${s.course || "Full Stack Web Development"} • ${s.batch || "Cohort"}`,
            targetRole: s.course?.includes("Full Stack") ? "Full Stack Web Developer" : "Software Engineer",
            targetCompensation: "₹6 – ₹12 LPA",
            location: "India (Open to Remote / Hybrid)",
            email: `${s.name?.toLowerCase().replace(/\s+/g, '') || "student"}@student.nim.academy`,
            phone: "+91 98765 00000",
            bio: `Enrolled in ${s.course || "Full Stack Web Development"} at NIM Academy. Focused on building production-grade web applications.`,
            linkedinUrl: cData?.assets?.linkedin?.url || cData?.profile?.linkedin_url || "https://linkedin.com",
            githubUrl: cData?.assets?.github?.url || cData?.profile?.github_url || "https://github.com",
            portfolioUrl: "",
            availability: "Placement Track Active",
          };
          setProfileData(initial);
          setEditForm(initial);
        }
        if (dashData?.kpi) {
          setKpi(dashData.kpi);
        }
        if (cData) {
          setCareerData(cData);
        }
      })
      .catch((err) => {
        console.error("Career API error:", err);
      })
      .finally(() => {
        setIsLoading(false);
      });
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
    }, 500);
  };

  // Asset Modal Handlers
  const handleOpenAssetModal = (type: "resume" | "github" | "linkedin") => {
    const resumeA = careerData?.assets?.resume;
    const githubA = careerData?.assets?.github;
    const linkedinA = careerData?.assets?.linkedin;

    setAssetInput({
      resumeFile: null,
      resumeName: resumeA?.name || `${student?.name || 'Student'}_Resume.pdf`,
      githubUrl: githubA?.url || "",
      linkedinUrl: linkedinA?.url || "",
    });
    setAssetSaveMessage("");
    setAssetModal(type);
  };

  const handleSaveAsset = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingAsset(true);
    setAssetSaveMessage("");

    try {
      let payload: any;
      if (assetModal === "resume") {
        const formData = new FormData();
        if (assetInput.resumeFile) {
          formData.append("resume_file", assetInput.resumeFile);
        }
        if (assetInput.resumeName) {
          formData.append("resume_name", assetInput.resumeName);
        }
        payload = formData;
      } else if (assetModal === "github") {
        payload = { github_url: assetInput.githubUrl };
      } else if (assetModal === "linkedin") {
        payload = { linkedin_url: assetInput.linkedinUrl };
      }

      const res = await StudentApi.saveCareerAsset(payload, student?.student_id);
      if (res?.status === "success" && res?.assets) {
        setCareerData((prev: any) => ({
          ...prev,
          assets: res.assets,
        }));
        if (assetModal === "github" && assetInput.githubUrl) {
          setProfileData(prev => ({ ...prev, githubUrl: assetInput.githubUrl }));
        }
        if (assetModal === "linkedin" && assetInput.linkedinUrl) {
          setProfileData(prev => ({ ...prev, linkedinUrl: assetInput.linkedinUrl }));
        }
        setAssetSaveMessage("Saved successfully!");
        setTimeout(() => {
          setAssetModal(null);
          setAssetSaveMessage("");
        }, 600);
      } else {
        setAssetSaveMessage(res?.message || "Failed to save asset. Please try again.");
      }
    } catch (err: any) {
      setAssetSaveMessage(err?.message || "Network error saving asset.");
    } finally {
      setIsSavingAsset(false);
    }
  };

  const handleClearAsset = async (type: "resume" | "github" | "linkedin") => {
    setIsSavingAsset(true);
    try {
      let payload: any = {};
      if (type === "resume") {
        payload = { clear_resume: true, resume_name: "" };
      } else if (type === "github") {
        payload = { github_url: "" };
      } else if (type === "linkedin") {
        payload = { linkedin_url: "" };
      }

      const res = await StudentApi.saveCareerAsset(payload, student?.student_id);
      if (res?.status === "success" && res?.assets) {
        setCareerData((prev: any) => ({
          ...prev,
          assets: res.assets,
        }));
        setAssetModal(null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSavingAsset(false);
    }
  };

  const progressPct = kpi?.course_progress_pct ?? 0;
  const studentInitials = profileData.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  const studentPlan = (careerData?.plan || student?.plan || "").trim();
  const isPlacementPlan =
    studentPlan.toLowerCase().includes("placement included") ||
    (studentPlan.toLowerCase().includes("placement") && !studentPlan.toLowerCase().includes("without"));

  if (isLoading) {
    return (
      <DashboardLayout>
        <TablePageSkeleton title="Loading Career Profile..." />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-7xl mx-auto pb-12">
        {/* =========================================================================
            1. CAREER PROFILE HEADER BANNER
            ========================================================================= */}
        <section
          className={`relative overflow-hidden rounded-3xl p-4 sm:p-6 lg:p-8 border transition-all shadow-sm ${
            isDark
              ? "bg-gradient-to-r from-[#07132b] via-[#091a3c] to-[#07132b] border-[#15274e] text-white"
              : "bg-gradient-to-r from-white via-[#f0f6fe] to-[#e8f2fe] border-[#d2e4f8] text-[#0a1b39]"
          }`}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 relative z-10">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#0062eb] flex items-center justify-center text-white shrink-0 shadow-md shadow-blue-600/30">
                <Target className="w-6 h-6 sm:w-7 sm:h-7 stroke-[2.2]" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight">
                    Career Profile &amp; Portfolio
                  </h1>
                  <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-0.5 rounded-full text-xs font-bold bg-[#0062eb]/15 text-[#0062eb] dark:text-sky-400 border border-[#0062eb]/25">
                    <Sparkles className="w-3.5 h-3.5" /> {isPlacementPlan ? "Placement Track Active" : "Without Placement"}
                  </span>
                </div>
                <p className={`text-xs sm:text-sm mt-1 font-medium ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                  Curate your student resume, technical projects, verified skills, and interview readiness for recruitment drives.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleOpenEdit}
                className="w-full sm:w-auto justify-center px-5 py-2.5 rounded-xl bg-[#0062eb] hover:bg-[#0052cc] text-white text-xs font-bold transition shadow-md shadow-blue-600/25 flex items-center gap-2 cursor-pointer active:scale-[0.98] min-h-[40px]"
              >
                <Edit3 className="w-4 h-4" />
                <span>Edit Career Profile</span>
              </button>
            </div>
          </div>
        </section>

        {/* =========================================================================
            2. REAL 4-COLUMN CAREER OVERVIEW METRICS GRID
            ========================================================================= */}
        <section className="grid grid-cols-1 min-[360px]:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
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
            <p className="text-[11px] text-slate-400 font-medium mt-1">Specialization: {student?.course || "Full Stack"}</p>
          </div>

          <div
            className={`p-5 rounded-2xl border transition-all ${
              isDark ? "bg-[#081024] border-[#15274d]" : "bg-white border-[#e2edf8] shadow-sm"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Curriculum Progress
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/10 text-[#0062eb]">
                {progressPct}% Completed
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <h3 className="text-2xl font-black text-[#0062eb]">{progressPct}%</h3>
              <span className="text-xs text-slate-400 font-semibold">/ 100</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden mt-2">
              <div className="h-full bg-[#0062eb] rounded-full" style={{ width: `${progressPct}%` }} />
            </div>
          </div>

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
            <p className="text-[11px] text-slate-400 font-medium mt-1">Full-time graduate placement</p>
          </div>

          <div
            className={`p-5 rounded-2xl border transition-all ${
              isDark ? "bg-[#081024] border-[#15274d]" : "bg-white border-[#e2edf8] shadow-sm"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Student Status
              </span>
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                <BadgeCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <h3 className="text-2xl font-black text-emerald-600">Active</h3>
            </div>
            <p className="text-[11px] text-emerald-600 font-bold mt-1">
              ✓ Verified Enrolled Student
            </p>
          </div>
        </section>

        {/* =========================================================================
            3. REAL STUDENT IDENTITY & BIO CARD
            ========================================================================= */}
        <section
          className={`p-6 sm:p-7 rounded-3xl border transition-all ${
            isDark ? "bg-[#081024] border-[#15274d]" : "bg-white border-[#e2edf8] shadow-sm"
          }`}
        >
          <div className="flex flex-col md:flex-row items-start gap-6">
            <div className="relative">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-tr from-[#0062eb] to-[#4f46e5] flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-blue-500/25 shrink-0 border-2 border-white dark:border-slate-800">
                {studentInitials}
              </div>
              <span
                className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white dark:border-[#081024] flex items-center justify-center text-white"
                title="Active Student"
              >
                <Check className="w-3 h-3 stroke-[3]" />
              </span>
            </div>

            <div className="flex-1 space-y-3">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className={`text-xl sm:text-2xl font-black tracking-tight ${isDark ? "text-white" : "text-[#0a1b39]"}`}>
                    {profileData.name}
                  </h2>
                  <span className="px-2 py-0.5 rounded-md text-[11px] font-mono font-bold bg-blue-500/10 text-[#0062eb] border border-blue-500/20">
                    {profileData.studentId}
                  </span>
                </div>
                <p className="text-xs sm:text-sm font-semibold text-[#0062eb] mt-0.5">
                  {profileData.headline}
                </p>
              </div>

              <p className={`text-xs sm:text-[13px] leading-relaxed font-normal ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                {profileData.bio}
              </p>

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
            </div>
          </div>
        </section>

        {/* =========================================================================
            4. PLACEMENT CLEARANCE & ASSETS SECTION
            ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Show the entire Career Assets & Deliverables section ONLY for students in the Placement Included plan */}
          {isPlacementPlan && (
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className={`text-base font-black tracking-tight ${isDark ? "text-white" : "text-[#0a1b39]"}`}>
                  Career Assets &amp; Deliverables
                </h3>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-500/10 text-[#0062eb] dark:text-sky-400 border border-blue-500/20 uppercase tracking-wider">
                  Placement Track
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 items-stretch">
                {/* 1. Student Resume Card */}
                <div
                  className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col justify-between h-full min-h-[220px] ${
                    isDark ? "bg-[#081024] border-[#15274d]" : "bg-white border-[#e2edf8] shadow-sm"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-500/15 text-[#0062eb] flex items-center justify-center">
                        <FileText className="w-5 h-5 stroke-[2.2]" />
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                          careerData?.assets?.resume?.is_uploaded
                            ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                            : "bg-amber-500/10 text-amber-600 border-amber-500/20"
                        }`}
                      >
                        {careerData?.assets?.resume?.is_uploaded ? "Active CV" : "Pending"}
                      </span>
                    </div>
                    <h4 className={`text-sm font-bold ${isDark ? "text-white" : "text-[#0a1b39]"}`}>
                      Student Resume
                    </h4>
                    <p
                      className="text-xs text-slate-400 mt-1 line-clamp-1"
                      title={careerData?.assets?.resume?.name || "Upload your ATS-verified CV"}
                    >
                      {careerData?.assets?.resume?.name || (careerData?.assets?.resume?.is_uploaded ? "Resume_Uploaded.pdf" : "Upload your ATS CV")}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-1.5">
                    {careerData?.assets?.resume?.url ? (
                      <a
                        href={careerData.assets.resume.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 py-2 px-2 rounded-xl text-xs font-bold bg-[#0062eb]/10 hover:bg-[#0062eb] text-[#0062eb] hover:text-white transition flex items-center justify-center gap-1"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>View</span>
                      </a>
                    ) : null}
                    <button
                      type="button"
                      onClick={() => handleOpenAssetModal("resume")}
                      className={`${careerData?.assets?.resume?.url ? "flex-1" : "w-full"} py-2 px-2 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition flex items-center justify-center gap-1 cursor-pointer`}
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>{careerData?.assets?.resume?.is_uploaded ? "Edit" : "Upload"}</span>
                    </button>
                  </div>
                </div>

                {/* 2. GitHub Profile Card */}
                <div
                  className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col justify-between h-full min-h-[220px] ${
                    isDark ? "bg-[#081024] border-[#15274d]" : "bg-white border-[#e2edf8] shadow-sm"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-10 h-10 rounded-xl bg-purple-500/15 text-purple-600 flex items-center justify-center">
                        <GithubIcon className="w-5 h-5" />
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                          careerData?.assets?.github?.is_linked
                            ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                            : "bg-slate-500/10 text-slate-500 border-slate-500/20"
                        }`}
                      >
                        {careerData?.assets?.github?.is_linked ? "Linked" : "Not Linked"}
                      </span>
                    </div>
                    <h4 className={`text-sm font-bold ${isDark ? "text-white" : "text-[#0a1b39]"}`}>
                      GitHub Profile
                    </h4>
                    <p
                      className="text-xs text-slate-400 mt-1 line-clamp-1"
                      title={careerData?.assets?.github?.url || "Academic repos & projects"}
                    >
                      {careerData?.assets?.github?.url ? careerData.assets.github.url.replace(/^https?:\/\//, '') : "Connect project repos"}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-1.5">
                    {careerData?.assets?.github?.url ? (
                      <a
                        href={careerData.assets.github.url.startsWith("http") ? careerData.assets.github.url : `https://${careerData.assets.github.url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 py-2 px-2 rounded-xl text-xs font-bold bg-purple-500/10 hover:bg-purple-600 text-purple-600 hover:text-white transition flex items-center justify-center gap-1"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Visit</span>
                      </a>
                    ) : null}
                    <button
                      type="button"
                      onClick={() => handleOpenAssetModal("github")}
                      className={`${careerData?.assets?.github?.url ? "flex-1" : "w-full"} py-2 px-2 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition flex items-center justify-center gap-1 cursor-pointer`}
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>{careerData?.assets?.github?.is_linked ? "Edit" : "Link"}</span>
                    </button>
                  </div>
                </div>

                {/* 3. LinkedIn Profile Card */}
                <div
                  className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col justify-between h-full min-h-[220px] ${
                    isDark ? "bg-[#081024] border-[#15274d]" : "bg-white border-[#e2edf8] shadow-sm"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-10 h-10 rounded-xl bg-[#0077b5]/15 text-[#0077b5] flex items-center justify-center">
                        <LinkedinIcon className="w-5 h-5" />
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                          careerData?.assets?.linkedin?.is_linked
                            ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                            : "bg-slate-500/10 text-slate-500 border-slate-500/20"
                        }`}
                      >
                        {careerData?.assets?.linkedin?.is_linked ? "Linked" : "Not Linked"}
                      </span>
                    </div>
                    <h4 className={`text-sm font-bold ${isDark ? "text-white" : "text-[#0a1b39]"}`}>
                      LinkedIn Profile
                    </h4>
                    <p
                      className="text-xs text-slate-400 mt-1 line-clamp-1"
                      title={careerData?.assets?.linkedin?.url || "Professional presence"}
                    >
                      {careerData?.assets?.linkedin?.url ? careerData.assets.linkedin.url.replace(/^https?:\/\//, '') : "Recruiter networking"}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-1.5">
                    {careerData?.assets?.linkedin?.url ? (
                      <a
                        href={careerData.assets.linkedin.url.startsWith("http") ? careerData.assets.linkedin.url : `https://${careerData.assets.linkedin.url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 py-2 px-2 rounded-xl text-xs font-bold bg-[#0077b5]/10 hover:bg-[#0077b5] text-[#0077b5] hover:text-white transition flex items-center justify-center gap-1"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Visit</span>
                      </a>
                    ) : null}
                    <button
                      type="button"
                      onClick={() => handleOpenAssetModal("linkedin")}
                      className={`${careerData?.assets?.linkedin?.url ? "flex-1" : "w-full"} py-2 px-2 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition flex items-center justify-center gap-1 cursor-pointer`}
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>{careerData?.assets?.linkedin?.is_linked ? "Edit" : "Link"}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Placement Clearance Section - Expands to 12 cols if Without Placement */}
          <div
            className={`${
              isPlacementPlan ? "lg:col-span-5" : "lg:col-span-12"
            } p-6 rounded-3xl border transition-all space-y-4 ${
              isDark ? "bg-[#081024] border-[#15274d]" : "bg-white border-[#e2edf8] shadow-sm"
            }`}
          >
            <div className="flex items-center justify-between">
              <h3 className={`text-base font-black ${isDark ? "text-white" : "text-[#0a1b39]"}`}>
                Placement Clearance
              </h3>
              <span className="text-xs font-bold text-[#0062eb]">
                Milestone Track
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span className="text-xs font-bold text-emerald-600">Student Registration</span>
                </div>
                <span className="text-[10px] font-bold text-emerald-600">Verified</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span className="text-xs font-bold text-emerald-600">Batch Allocation</span>
                </div>
                <span className="text-[10px] font-bold text-emerald-600">{student?.batch || "Allocated"}</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
                <div className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-[#0062eb]" />
                  <span className="text-xs font-bold text-[#0062eb]">Curriculum Progression</span>
                </div>
                <span className="text-[10px] font-bold text-[#0062eb]">{progressPct}% Complete</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2.5">
                  <Circle className="w-4 h-4 text-slate-400" />
                  <span className="text-xs font-semibold text-slate-400">Technical Mock Interview</span>
                </div>
                <span className="text-[10px] font-semibold text-slate-400">Post Modules</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal: Add/Edit Career Asset */}
        {assetModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
            <div
              className={`w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl p-6 border shadow-2xl space-y-4 animate-in zoom-in-95 ${
                isDark
                  ? "bg-[#0b1429] border-[#1e3363] text-white"
                  : "bg-white border-[#dce8f8] text-[#0a1b39]"
              }`}
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-blue-500/10 text-[#0062eb]">
                    {assetModal === "resume" && <FileText className="w-4 h-4" />}
                    {assetModal === "github" && <GithubIcon className="w-4 h-4 text-purple-600" />}
                    {assetModal === "linkedin" && <LinkedinIcon className="w-4 h-4 text-[#0077b5]" />}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm">
                      {assetModal === "resume" && (careerData?.assets?.resume?.is_uploaded ? "Update Resume" : "Upload Resume")}
                      {assetModal === "github" && (careerData?.assets?.github?.is_linked ? "Edit GitHub Profile" : "Link GitHub Profile")}
                      {assetModal === "linkedin" && (careerData?.assets?.linkedin?.is_linked ? "Edit LinkedIn Profile" : "Link LinkedIn Profile")}
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      Saved to your verified career portal profile
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setAssetModal(null);
                    setAssetSaveMessage("");
                  }}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveAsset} className="space-y-4 text-xs">
                {assetModal === "resume" && (
                  <div className="space-y-3">
                    <div>
                      <label className="text-slate-500 dark:text-slate-400 font-semibold block mb-1">
                        Select Resume File (PDF / DOC)
                      </label>
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => {
                          const file = e.target.files?.[0] || null;
                          setAssetInput(prev => ({
                            ...prev,
                            resumeFile: file,
                            resumeName: file ? file.name : prev.resumeName,
                          }));
                        }}
                        className="w-full px-3 py-2 rounded-xl border outline-none dark:bg-slate-900 dark:border-slate-700 text-xs file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-[#0062eb] hover:file:bg-blue-100"
                      />
                    </div>
                    <div>
                      <label className="text-slate-500 dark:text-slate-400 font-semibold block mb-1">
                        Display Resume Name / Title
                      </label>
                      <input
                        type="text"
                        value={assetInput.resumeName}
                        onChange={(e) => setAssetInput(prev => ({ ...prev, resumeName: e.target.value }))}
                        placeholder="e.g. John_Doe_FullStack_Resume.pdf"
                        className="w-full px-3 py-2 rounded-xl border outline-none dark:bg-slate-900 dark:border-slate-700"
                      />
                    </div>
                    {careerData?.assets?.resume?.is_uploaded && (
                      <p className="text-[11px] text-emerald-600 flex items-center gap-1 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Currently uploaded: {careerData?.assets?.resume?.name || "Resume.pdf"}
                      </p>
                    )}
                  </div>
                )}

                {assetModal === "github" && (
                  <div>
                    <label className="text-slate-500 dark:text-slate-400 font-semibold block mb-1">
                      GitHub Profile URL
                    </label>
                    <input
                      type="url"
                      required
                      value={assetInput.githubUrl}
                      onChange={(e) => setAssetInput(prev => ({ ...prev, githubUrl: e.target.value }))}
                      placeholder="https://github.com/your-username"
                      className="w-full px-3 py-2 rounded-xl border outline-none dark:bg-slate-900 dark:border-slate-700"
                    />
                    <p className="text-[10px] text-slate-400 mt-1">
                      Link your active repositories, project source codes, and contributions.
                    </p>
                  </div>
                )}

                {assetModal === "linkedin" && (
                  <div>
                    <label className="text-slate-500 dark:text-slate-400 font-semibold block mb-1">
                      LinkedIn Profile URL
                    </label>
                    <input
                      type="url"
                      required
                      value={assetInput.linkedinUrl}
                      onChange={(e) => setAssetInput(prev => ({ ...prev, linkedinUrl: e.target.value }))}
                      placeholder="https://linkedin.com/in/your-profile"
                      className="w-full px-3 py-2 rounded-xl border outline-none dark:bg-slate-900 dark:border-slate-700"
                    />
                    <p className="text-[10px] text-slate-400 mt-1">
                      Connect your verified professional profile for partner companies.
                    </p>
                  </div>
                )}

                {assetSaveMessage && (
                  <p className={`text-xs font-semibold ${assetSaveMessage.includes("success") ? "text-emerald-500" : "text-amber-500"}`}>
                    {assetSaveMessage}
                  </p>
                )}

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                  {((assetModal === "resume" && careerData?.assets?.resume?.is_uploaded) ||
                    (assetModal === "github" && careerData?.assets?.github?.is_linked) ||
                    (assetModal === "linkedin" && careerData?.assets?.linkedin?.is_linked)) ? (
                    <button
                      type="button"
                      disabled={isSavingAsset}
                      onClick={() => handleClearAsset(assetModal)}
                      className="text-red-500 hover:text-red-600 text-xs font-bold transition cursor-pointer"
                    >
                      Remove
                    </button>
                  ) : <div />}

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setAssetModal(null);
                        setAssetSaveMessage("");
                      }}
                      className="px-3.5 py-2 rounded-xl border text-slate-500 hover:text-slate-700 dark:text-slate-400 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSavingAsset}
                      className="px-4 py-2 rounded-xl bg-[#0062eb] hover:bg-blue-600 text-white font-bold flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
                    >
                      {isSavingAsset && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                      <span>{isSavingAsset ? "Saving..." : "Save Asset"}</span>
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Edit Career Profile */}
        {isEditModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
            <div
              className={`w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl p-6 border shadow-2xl space-y-4 animate-in zoom-in-95 ${
                isDark
                  ? "bg-[#0b1429] border-[#1e3363] text-white"
                  : "bg-white border-[#dce8f8] text-[#0a1b39]"
              }`}
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                <h3 className="font-bold text-base">Edit Career Profile</h3>
                <button onClick={() => setIsEditModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-3 text-xs">
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Target Role</label>
                  <input
                    type="text"
                    value={editForm.targetRole}
                    onChange={(e) => setEditForm({ ...editForm, targetRole: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border outline-none dark:bg-slate-900 dark:border-slate-700"
                  />
                </div>
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Headline</label>
                  <input
                    type="text"
                    value={editForm.headline}
                    onChange={(e) => setEditForm({ ...editForm, headline: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border outline-none dark:bg-slate-900 dark:border-slate-700"
                  />
                </div>
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Bio / Profile Summary</label>
                  <textarea
                    rows={3}
                    value={editForm.bio}
                    onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border outline-none dark:bg-slate-900 dark:border-slate-700"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="px-4 py-2 rounded-xl border text-slate-400"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-[#0062eb] text-white font-bold"
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
