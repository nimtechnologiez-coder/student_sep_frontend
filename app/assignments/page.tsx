"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import DashboardLayout from "@/components/DashboardLayout";
import { useTheme } from "@/components/ThemeProvider";
import styles from "./assignments.module.css";
import { StudentApi } from "@/lib/studentApi";
import { TablePageSkeleton } from "@/components/Skeleton";
import {
  FileText,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  ChevronRight,
  Upload,
  X,
  Check,
  Download,
  BookOpen,
  ArrowRight,
  ArrowLeft,
  ExternalLink,
  Search,
  Filter,
  Code2,
  Award,
  Sparkles,
  Paperclip,
  Send,
  Loader2,
} from "lucide-react";

export type AssignmentStatus =
  | "Pending"
  | "In Progress"
  | "Submitted"
  | "Evaluated"
  | "Overdue";

export type FilterStatus =
  | "All"
  | "Pending"
  | "In Progress"
  | "Submitted"
  | "Evaluated"
  | "Overdue";

export interface AssignmentItem {
  id: string;
  title: string;
  moduleCode: string;
  moduleTitle: string;
  category: string;
  status: AssignmentStatus;
  dueDate: string;
  formattedDueDate: string;
  daysRemainingText?: string;
  isUrgent?: boolean;
  maxMarks?: number;
  description: string;
  submission?: {
    id?: number;
    submissionUrl?: string;
    submissionText?: string;
    fileUrl?: string;
    fileName?: string;
    fileSize?: string;
    submittedAt?: string;
    marksObtained?: number;
    mentorFeedback?: string;
    status?: string;
  };
}

export default function AssignmentsPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Filter & Search State
  const [activeStatusFilter, setActiveStatusFilter] = useState<FilterStatus>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<"earliest" | "latest">("earliest");

  // Modal & File Upload State
  const [activeModalAssignment, setActiveModalAssignment] = useState<AssignmentItem | null>(null);
  const [submissionUrl, setSubmissionUrl] = useState<string>("");
  const [submissionText, setSubmissionText] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);

  // Dynamic API State
  const [student, setStudent] = useState<any>(null);
  const [kpi, setKpi] = useState<any>(null);
  const [tasksList, setTasksList] = useState<AssignmentItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    setIsLoading(true);

    Promise.all([
      StudentApi.getDashboard(),
      StudentApi.getTasks(),
    ])
      .then(([dashData, tasksData]) => {
        if (dashData?.student) {
          setStudent(dashData.student);
        }
        if (dashData?.kpi) {
          setKpi(dashData.kpi);
        }

        if (tasksData?.tasks && Array.isArray(tasksData.tasks)) {
          const mapped: AssignmentItem[] = tasksData.tasks.map((t: any) => {
            const isSub = !!t.submission;
            const isEval = t.submission?.status === "Evaluated";
            let status: AssignmentStatus = "Pending";
            if (isEval) status = "Evaluated";
            else if (isSub) status = "Submitted";
            else if (t.status === "Overdue") status = "Overdue";

            return {
              id: String(t.id),
              title: t.title || "Assignment Task",
              moduleCode: t.module_code || "ASSIGNMENT",
              moduleTitle: dashData?.student?.batch || "Active Cohort",
              category: t.category || "Practical Lab",
              status: status,
              dueDate: t.due_date || "",
              formattedDueDate: t.due_date || "No due date specified",
              maxMarks: t.max_marks || 100,
              description: t.description || "Practical assignment task instructions.",
              submission: t.submission
                ? {
                  id: t.submission.id,
                  submissionUrl: t.submission.submission_url,
                  submissionText: t.submission.submission_text,
                  fileUrl: t.submission.file_url
                    ? (t.submission.file_url.startsWith("http")
                      ? t.submission.file_url
                      : `https://student-sep-backend.onrender.com${t.submission.file_url}`)
                    : undefined,
                  fileName: t.submission.file_name,
                  fileSize: t.submission.file_size,
                  submittedAt: t.submission.submitted_at,
                  marksObtained: t.submission.marks_obtained,
                  mentorFeedback: t.submission.mentor_feedback,
                  status: t.submission.status,
                }
                : undefined,
            };
          });
          setTasksList(mapped);
        } else {
          setTasksList([]);
        }
      })
      .catch((err) => {
        console.error("Assignments API error:", err);
        setTasksList([]);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  // Real statistics derived purely from backend data
  const totalCount = tasksList.length;
  const pendingCount = tasksList.filter((a) => a.status === "Pending" || a.status === "In Progress").length;
  const submittedCount = tasksList.filter((a) => a.status === "Submitted").length;
  const evaluatedCount = tasksList.filter((a) => a.status === "Evaluated").length;
  const overdueCount = tasksList.filter((a) => a.status === "Overdue").length;

  const evaluatedTasksWithMarks = tasksList.filter(
    (a) => a.status === "Evaluated" && a.submission?.marksObtained != null
  );
  const gradedAverage =
    evaluatedTasksWithMarks.length > 0
      ? Math.round(
        (evaluatedTasksWithMarks.reduce(
          (acc, curr) => acc + (curr.submission?.marksObtained || 0),
          0
        ) /
          (evaluatedTasksWithMarks.length * 100)) *
        100
      )
      : null;

  // Filtered dataset
  const filteredAssignments = useMemo(() => {
    let result = tasksList;

    if (activeStatusFilter !== "All") {
      result = result.filter((a) => a.status === activeStatusFilter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.moduleCode.toLowerCase().includes(q) ||
          a.category.toLowerCase().includes(q)
      );
    }

    return result;
  }, [tasksList, activeStatusFilter, searchQuery]);

  const urgentAssignments = useMemo(
    () => tasksList.filter((a) => a.status === "Overdue" || a.isUrgent),
    [tasksList]
  );

  const getStatusBadge = (status: AssignmentStatus, score?: number) => {
    switch (status) {
      case "Pending":
        return {
          label: "Pending",
          className: isDark
            ? "bg-amber-950/40 text-amber-300 border-amber-800/60"
            : "bg-amber-50 text-amber-700 border-amber-200",
        };
      case "In Progress":
        return {
          label: "In Progress",
          className: isDark
            ? "bg-blue-950/40 text-blue-300 border-blue-800/60"
            : "bg-blue-50 text-blue-700 border-blue-200",
        };
      case "Submitted":
        return {
          label: "In Review",
          className: isDark
            ? "bg-purple-950/40 text-purple-300 border-purple-800/60"
            : "bg-purple-50 text-purple-700 border-purple-200",
        };
      case "Evaluated":
        return {
          label: score != null ? `Evaluated • ${score}/100` : "Evaluated",
          className: isDark
            ? "bg-emerald-950/40 text-emerald-300 border-emerald-800/60"
            : "bg-emerald-50 text-emerald-700 border-emerald-200",
        };
      case "Overdue":
        return {
          label: "Overdue",
          className: isDark
            ? "bg-rose-950/40 text-rose-300 border-rose-800/60"
            : "bg-rose-50 text-rose-700 border-rose-200",
        };
    }
  };

  const ALLOWED_EXTENSIONS = [
    ".pdf", ".doc", ".docx", ".ppt", ".pptx", ".xls", ".xlsx", ".zip", ".png", ".jpg", ".jpeg"
  ];

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const validateAndSelectFile = (file: File) => {
    const ext = "." + (file.name.split(".").pop() || "").toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      setSubmitError(`Unsupported format "${ext}". Allowed formats: PDF, DOC, DOCX, PPT, PPTX, XLS, XLSX, ZIP, PNG, JPG, JPEG.`);
      setSelectedFile(null);
      return;
    }
    if (file.size > 25 * 1024 * 1024) {
      setSubmitError("File size exceeds 25 MB maximum limit.");
      setSelectedFile(null);
      return;
    }
    setSubmitError(null);
    setSelectedFile(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSelectFile(e.target.files[0]);
    }
  };

  const handleOpenModal = (assignment: AssignmentItem) => {
    setActiveModalAssignment(assignment);
    setSubmissionUrl(assignment.submission?.submissionUrl || "");
    setSubmissionText(assignment.submission?.submissionText || "");
    setSelectedFile(null);
    setSubmitError(null);
    setSubmitSuccess(false);
    setIsDragOver(false);
  };

  const handleSubmitDeliverable = async () => {
    if (!activeModalAssignment) return;
    setSubmitError(null);

    const hasFile = !!selectedFile;
    const hasUrl = !!submissionUrl.trim();
    const hasText = !!submissionText.trim();

    // Prevent submission if no required deliverable is provided
    if (!hasFile && !hasUrl && !hasText) {
      setSubmitError("Please provide at least one deliverable: upload a task file, provide a repository link, or add submission notes.");
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("task_id", activeModalAssignment.id);
      formData.append("student_id", student?.student_id || "");
      if (submissionUrl.trim()) formData.append("submission_url", submissionUrl.trim());
      if (submissionText.trim()) formData.append("submission_text", submissionText.trim());
      if (selectedFile) formData.append("file", selectedFile);

      const res = await fetch("https://student-sep-backend.onrender.com/api/student/submit-task/", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setSubmitSuccess(true);
        const fileUrl = data.file_url
          ? (data.file_url.startsWith("http") ? data.file_url : `https://student-sep-backend.onrender.com${data.file_url}`)
          : undefined;
        setTasksList((prev) =>
          prev.map((t) =>
            t.id === activeModalAssignment.id
              ? {
                ...t,
                status: "Submitted",
                submission: {
                  id: data.submission_id,
                  submissionUrl: submissionUrl.trim() || undefined,
                  submissionText: submissionText.trim() || undefined,
                  fileUrl: fileUrl,
                  fileName: data.file_name || selectedFile?.name,
                  fileSize: data.file_size || (selectedFile ? formatFileSize(selectedFile.size) : undefined),
                  status: "Submitted",
                  submittedAt: "Just now",
                },
              }
              : t
          )
        );
        setTimeout(() => {
          setActiveModalAssignment(null);
        }, 1200);
      } else {
        setSubmitError(data.error || "Submission failed. Please check inputs and retry.");
      }
    } catch (e: any) {
      setSubmitError(e.message || "Network error while submitting deliverable.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <TablePageSkeleton title="Loading Assignments & Projects..." />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className={styles.container}>
        {/* =========================================================================
            1. CLEAN PAGE HEADER (Real Student Course & Program)
            ========================================================================= */}
        <section className={styles.headerCard}>
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className={`text-[11px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${isDark
                      ? "text-blue-300 bg-blue-950/60 border-blue-800/60"
                      : "text-[#0062eb] bg-blue-50 border-blue-200"
                    }`}
                >
                  Academic Workspaces
                </span>
                <span
                  className={`text-xs font-semibold ${isDark ? "text-slate-400" : "text-slate-500"
                    }`}
                >
                  {student?.course || "Academic Program"} {student?.batch ? `• ${student.batch}` : ""}
                </span>
              </div>
              <h1
                className={`text-2xl sm:text-3xl font-black tracking-tight ${isDark ? "text-white" : "text-[#0a1b39]"
                  }`}
              >
                Assignments
              </h1>
              <p
                className={`text-xs sm:text-sm font-medium leading-relaxed max-w-2xl ${isDark ? "text-slate-300" : "text-slate-600"
                  }`}
              >
                Complete weekly coding implementations, submit research problem sets, monitor grading statuses, and review actionable feedback from instructors.
              </p>
            </div>

            {/* Quick Summary Pill Dock */}
            <div
              className={`p-3.5 sm:p-4 rounded-xl border flex items-center gap-4 sm:gap-6 shrink-0 ${isDark ? "bg-[#091328] border-[#15254a]" : "bg-slate-50 border-[#dce8f8]"
                }`}
            >
              <div>
                <span className="text-[11px] font-semibold text-slate-400 block">Graded Average</span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span
                    className={`text-xl sm:text-2xl font-black ${gradedAverage !== null
                        ? isDark ? "text-emerald-400" : "text-emerald-600"
                        : "text-slate-400"
                      }`}
                  >
                    {gradedAverage !== null ? `${gradedAverage}%` : "N/A"}
                  </span>
                  <Award className="w-4 h-4 text-emerald-500" />
                </div>
                <span className="text-[10px] text-slate-400 font-medium">
                  {evaluatedCount} assignments evaluated
                </span>
              </div>

              <div className={`w-px h-10 ${isDark ? "bg-slate-800" : "bg-slate-200"}`} />

              <div>
                <span className="text-[11px] font-semibold text-slate-400 block">Current Action</span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-xs sm:text-sm font-black text-[#0062eb]">
                    {pendingCount} Pending
                  </span>
                </div>
                <span
                  className={`text-[10px] font-semibold ${overdueCount > 0 ? "text-rose-500 font-bold" : "text-slate-400"
                    }`}
                >
                  {overdueCount > 0 ? `${overdueCount} Past Due Date` : "All submissions on track"}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            2. REAL KPI SUMMARY CARDS
            ========================================================================= */}
        <section className="grid grid-cols-1 min-[360px]:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
          <div className={styles.statCard}>
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-[#0062eb] flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                Total Assignments
              </span>
              <div className={`text-xl sm:text-2xl font-black ${isDark ? "text-white" : "text-[#0a1b39]"}`}>
                {totalCount}
              </div>
              <span className="text-[11px] text-slate-400 font-medium">
                {student?.batch || "Enrolled Cohort"}
              </span>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                Pending
              </span>
              <div className="text-xl sm:text-2xl font-black text-amber-500">
                {pendingCount}
              </div>
              <span className="text-[11px] text-slate-400 font-medium">
                {pendingCount > 0 ? "Requires submission" : "All caught up"}
              </span>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                Submitted
              </span>
              <div className={`text-xl sm:text-2xl font-black ${isDark ? "text-white" : "text-[#0a1b39]"}`}>
                {submittedCount}
              </div>
              <span className="text-[11px] text-purple-500 font-medium">
                {submittedCount > 0 ? "Awaiting review" : "No pending reviews"}
              </span>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center shrink-0">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                Overdue
              </span>
              <div className="text-xl sm:text-2xl font-black text-rose-500">
                {overdueCount}
              </div>
              <span className="text-[11px] text-slate-400 font-medium">
                {overdueCount > 0 ? "Urgent attention" : "Zero overdue"}
              </span>
            </div>
          </div>
        </section>

        {/* =========================================================================
            3. ASSIGNMENT WORKSPACE & CONTROLS (Layout Preserved)
            ========================================================================= */}
        {/* Attention banner if any overdue tasks */}
        {urgentAssignments.length > 0 && (
          <section className={styles.urgentCard}>
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-4 h-4 text-rose-500" />
              <h3 className="text-sm font-bold text-rose-600 dark:text-rose-400">
                Needs Your Attention ({urgentAssignments.length} Items Require Action)
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {urgentAssignments.map((asg) => (
                <div
                  key={asg.id}
                  className="p-3.5 rounded-xl bg-white dark:bg-slate-900/80 border border-rose-200 dark:border-rose-900/50 flex flex-col justify-between"
                >
                  <div>
                    <span className="text-[10px] font-black uppercase text-rose-500 block mb-1">
                      {asg.status}
                    </span>
                    <h4 className="text-xs sm:text-sm font-bold line-clamp-1">{asg.title}</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">Due: {asg.formattedDueDate}</p>
                  </div>

                  <button
                    onClick={() => handleOpenModal(asg)}
                    className="mt-3 px-4 py-1.5 rounded-lg bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold transition w-fit"
                  >
                    Submit Now →
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Filter Tabs & Search Bar */}
        <section
          className={`p-4 rounded-2xl border flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 ${isDark ? "bg-[#081024] border-[#15274d]" : "bg-white border-[#e2edf8] shadow-xs"
            }`}
        >
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            {(
              [
                { id: "All", label: "All", count: totalCount },
                { id: "Pending", label: "Pending", count: pendingCount },
                { id: "Submitted", label: "Submitted", count: submittedCount },
                { id: "Evaluated", label: "Evaluated", count: evaluatedCount },
                { id: "Overdue", label: "Overdue", count: overdueCount },
              ] as const
            ).map((tab) => {
              const isActive = activeStatusFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveStatusFilter(tab.id as FilterStatus)}
                  className={`${styles.filterPill} ${isActive ? styles.active : ""}`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${isActive
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

          <div className="relative flex-1 md:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search assignments..."
              className={`w-full pl-8 pr-7 py-2 rounded-xl text-xs outline-none border transition ${isDark
                  ? "bg-[#091328] border-[#15254a] text-white placeholder-slate-500 focus:border-[#0062eb]"
                  : "bg-[#f8fbff] border-[#dce8f8] text-[#0a1b39] placeholder-slate-400 focus:border-[#0062eb]"
                }`}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </section>

        {/* Assignment List */}
        <div className="space-y-3">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-[#0062eb]" />
            Assignment List ({filteredAssignments.length} Displayed)
          </h3>

          <div className="space-y-3">
            {filteredAssignments.length === 0 ? (
              <div className="py-16 sm:py-20 px-6 text-center flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40">
                <div className="w-14 h-14 rounded-2xl bg-blue-500/10 text-[#0062eb] flex items-center justify-center mb-3.5">
                  <FileText className="w-7 h-7 stroke-[2]" />
                </div>
                <h3 className={`text-base sm:text-lg font-bold ${isDark ? "text-white" : "text-[#0a1b39]"}`}>
                  No Assignments Scheduled
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 mt-1.5 max-w-md">
                  There are currently no assignments or evaluations scheduled for <strong className={isDark ? "text-slate-300" : "text-slate-700"}>{student?.batch || "your batch"}</strong>. Practical tasks and problem sets will appear here once published by your mentor.
                </p>
              </div>
            ) : (
              filteredAssignments.map((asg) => {
                const badge = getStatusBadge(
                  asg.status,
                  asg.submission?.marksObtained
                );

                return (
                  <div
                    key={asg.id}
                    className={`${styles.card} p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4`}
                  >
                    <div className="min-w-0 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-blue-500/10 text-[#0062eb]">
                          {asg.category}
                        </span>
                        <span className="text-xs text-slate-400 font-semibold">
                          Due: {asg.formattedDueDate}
                        </span>
                      </div>

                      <h4 className={`text-sm sm:text-base font-bold ${isDark ? "text-white" : "text-[#0a1b39]"}`}>
                        {asg.title}
                      </h4>

                      {asg.description && (
                        <p className="text-xs text-slate-400 line-clamp-1">{asg.description}</p>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center justify-between sm:justify-start gap-2.5 sm:gap-3 w-full sm:w-auto shrink-0">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold border ${badge.className}`}
                      >
                        {badge.label}
                      </span>

                      <button
                        onClick={() => handleOpenModal(asg)}
                        className="min-h-[40px] px-4 py-2 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-800 hover:border-[#0062eb] text-[#0062eb] transition flex-1 sm:flex-initial text-center flex items-center justify-center"
                      >
                        {asg.status === "Evaluated" ? "View Feedback" : "View Assignment >"}
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Modal: Assignment Detail & Submission */}
        {activeModalAssignment && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
            <div
              className={`w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl p-6 border shadow-2xl space-y-4 animate-in zoom-in-95 ${isDark
                  ? "bg-[#0b1429] border-[#1e3363] text-white"
                  : "bg-white border-[#dce8f8] text-[#0a1b39]"
                }`}
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-3 border-b border-slate-200 dark:border-slate-800/80 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded text-[11px] font-black uppercase tracking-wider bg-blue-500/15 text-[#0062eb]">
                      {activeModalAssignment.category}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                      {activeModalAssignment.moduleCode}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold leading-snug mt-1.5">
                    {activeModalAssignment.title}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                    <span>Due: {activeModalAssignment.formattedDueDate}</span>
                    <span>&bull;</span>
                    <span className="text-[#0062eb] font-semibold">{activeModalAssignment.maxMarks} Marks</span>
                  </div>
                </div>

                <button
                  onClick={() => setActiveModalAssignment(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Task Description / Instructions */}
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">
                  Objective &amp; Instructions
                </label>
                <div
                  className={`p-3.5 rounded-xl border text-xs leading-relaxed ${isDark
                      ? "bg-[#070e1f] border-[#152345] text-slate-300"
                      : "bg-[#f8fbff] border-[#e2edf8] text-slate-700"
                    }`}
                >
                  {activeModalAssignment.description}
                </div>
              </div>

              {/* IF ALREADY SUBMITTED: Show submitted deliverables and evaluation feedback */}
              {activeModalAssignment.submission && (
                <div className="space-y-3 pt-1">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                        {activeModalAssignment.status === "Evaluated" ? "Task Evaluated" : "Deliverables Submitted & In Review"}
                      </span>
                    </div>
                    {activeModalAssignment.submission.submittedAt && (
                      <span className="text-[11px] text-slate-400">
                        Submitted: {activeModalAssignment.submission.submittedAt}
                      </span>
                    )}
                  </div>

                  {/* Submitted File */}
                  {activeModalAssignment.submission.fileName && (
                    <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="p-2 rounded-lg bg-blue-500/10 text-[#0062eb]">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold truncate">
                            {activeModalAssignment.submission.fileName}
                          </p>
                          {activeModalAssignment.submission.fileSize && (
                            <p className="text-[10px] text-slate-400">
                              {activeModalAssignment.submission.fileSize}
                            </p>
                          )}
                        </div>
                      </div>
                      {activeModalAssignment.submission.fileUrl && (
                        <a
                          href={activeModalAssignment.submission.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          download
                          className="px-3 py-1.5 rounded-lg bg-[#0062eb] text-white text-xs font-bold flex items-center gap-1.5 hover:bg-[#0052cc] transition shrink-0"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Download</span>
                        </a>
                      )}
                    </div>
                  )}

                  {/* Submitted Link */}
                  {activeModalAssignment.submission.submissionUrl && (
                    <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="p-2 rounded-lg bg-purple-500/10 text-purple-600">
                          <Paperclip className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold truncate">Project Repository</p>
                          <p className="text-[11px] text-[#0062eb] truncate">
                            {activeModalAssignment.submission.submissionUrl}
                          </p>
                        </div>
                      </div>
                      <a
                        href={activeModalAssignment.submission.submissionUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-bold flex items-center gap-1.5 hover:border-[#0062eb] transition shrink-0"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Visit</span>
                      </a>
                    </div>
                  )}

                  {/* Submitted Notes */}
                  {activeModalAssignment.submission.submissionText && (
                    <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 text-xs">
                      <span className="font-semibold text-slate-400 block mb-1">Your Submission Notes:</span>
                      <p className={isDark ? "text-slate-300" : "text-slate-700"}>
                        {activeModalAssignment.submission.submissionText}
                      </p>
                    </div>
                  )}

                  {/* Mentor Feedback & Marks */}
                  {activeModalAssignment.submission.mentorFeedback && (
                    <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">Mentor Evaluation &amp; Feedback</span>
                        {activeModalAssignment.submission.marksObtained != null && (
                          <span className="font-black text-emerald-600 dark:text-emerald-400">
                            Score: {activeModalAssignment.submission.marksObtained}/{activeModalAssignment.maxMarks || 100}
                          </span>
                        )}
                      </div>
                      <p className={isDark ? "text-slate-300" : "text-slate-700"}>
                        {activeModalAssignment.submission.mentorFeedback}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* IF PENDING / SUBMISSION FORM */}
              {!activeModalAssignment.submission && (
                <div className="space-y-3.5 text-xs pt-1">
                  {/* Error / Success Alerts */}
                  {submitError && (
                    <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{submitError}</span>
                    </div>
                  )}
                  {submitSuccess && (
                    <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>Submission recorded successfully! Your mentor will evaluate your deliverable.</span>
                    </div>
                  )}

                  {/* 1. File Upload Area */}
                  <div>
                    <label className="text-slate-400 font-semibold block mb-1.5 flex items-center justify-between">
                      <span>Task Deliverable File</span>
                      <span className="text-[10px] text-slate-400">Max 25 MB</span>
                    </label>

                    {!selectedFile ? (
                      <div
                        onDragOver={(e) => {
                          e.preventDefault();
                          setIsDragOver(true);
                        }}
                        onDragLeave={() => setIsDragOver(false)}
                        onDrop={(e) => {
                          e.preventDefault();
                          setIsDragOver(false);
                          if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                            validateAndSelectFile(e.dataTransfer.files[0]);
                          }
                        }}
                        className={`relative border-2 border-dashed rounded-xl p-5 text-center transition cursor-pointer ${isDragOver
                            ? "border-[#0062eb] bg-blue-500/10"
                            : isDark
                              ? "border-slate-700 hover:border-slate-500 bg-[#070e1f]"
                              : "border-slate-200 hover:border-slate-400 bg-slate-50/70"
                          }`}
                        onClick={() => document.getElementById("taskFileInput")?.click()}
                      >
                        <input
                          id="taskFileInput"
                          type="file"
                          accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.zip,.png,.jpg,.jpeg,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/zip,application/x-zip-compressed,image/png,image/jpeg"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                        <div className="flex flex-col items-center justify-center gap-2">
                          <div className="w-10 h-10 rounded-full bg-blue-500/15 text-[#0062eb] flex items-center justify-center">
                            <Upload className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-bold text-xs">
                              Click to browse or drag &amp; drop file
                            </p>
                            <p className="text-[11px] text-slate-400 mt-0.5">
                              PDF, DOC, DOCX, PPT, PPTX, XLS, XLSX, ZIP, PNG, JPG, JPEG
                            </p>
                          </div>
                          <span className="inline-block mt-1 px-3 py-1 rounded-lg bg-[#0062eb] text-white font-semibold text-[11px] shadow-sm">
                            Upload File
                          </span>
                        </div>
                      </div>
                    ) : (
                      /* Selected File Preview Box */
                      <div className="p-3.5 rounded-xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/70 dark:bg-blue-950/30 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="p-2 rounded-lg bg-[#0062eb] text-white">
                            <FileText className="w-5 h-5" />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-xs truncate text-[#0a1b39] dark:text-white">
                                {selectedFile.name}
                              </span>
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                            </div>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400">
                              {formatFileSize(selectedFile.size)} &bull; Ready to upload
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => document.getElementById("taskFileInput")?.click()}
                            className="text-[11px] font-bold text-[#0062eb] hover:underline cursor-pointer"
                          >
                            Change
                          </button>
                          <button
                            type="button"
                            onClick={() => setSelectedFile(null)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 cursor-pointer"
                            title="Remove file"
                          >
                            <X className="w-4 h-4" />
                          </button>
                          <input
                            id="taskFileInput"
                            type="file"
                            accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.zip,.png,.jpg,.jpeg,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/zip,application/x-zip-compressed,image/png,image/jpeg"
                            onChange={handleFileChange}
                            className="hidden"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 2. Repository / Project Link */}
                  <div>
                    <label className="text-slate-400 font-semibold block mb-1">
                      Repository / Project Link <span className="font-normal text-[11px]">(Optional if file attached)</span>
                    </label>
                    <input
                      type="url"
                      value={submissionUrl}
                      onChange={(e) => setSubmissionUrl(e.target.value)}
                      placeholder="https://github.com/your-username/repo-name"
                      className={`w-full px-3 py-2 rounded-xl border outline-none ${isDark
                          ? "bg-[#070e1f] border-[#182952] text-white focus:border-[#0062eb]"
                          : "bg-white border-slate-200 text-[#0a1b39] focus:border-[#0062eb]"
                        }`}
                    />
                  </div>

                  {/* 3. Submission Notes */}
                  <div>
                    <label className="text-slate-400 font-semibold block mb-1">
                      Submission Notes / Description <span className="font-normal text-[11px]">(Optional)</span>
                    </label>
                    <textarea
                      value={submissionText}
                      onChange={(e) => setSubmissionText(e.target.value)}
                      rows={3}
                      placeholder="Add key highlights, setup instructions, or notes for your mentor..."
                      className={`w-full px-3 py-2 rounded-xl border outline-none ${isDark
                          ? "bg-[#070e1f] border-[#182952] text-white focus:border-[#0062eb]"
                          : "bg-white border-slate-200 text-[#0a1b39] focus:border-[#0062eb]"
                        }`}
                    />
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  onClick={() => setActiveModalAssignment(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                >
                  Close
                </button>
                {!activeModalAssignment.submission && (
                  <button
                    disabled={isSubmitting || submitSuccess}
                    onClick={handleSubmitDeliverable}
                    className="px-5 py-2.5 rounded-xl bg-[#0062eb] hover:bg-[#0052cc] text-white text-xs font-bold transition flex items-center gap-2 cursor-pointer disabled:opacity-50 shadow-md shadow-blue-500/20"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Uploading &amp; Submitting...</span>
                      </>
                    ) : submitSuccess ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Submitted!</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Submit Deliverable</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
