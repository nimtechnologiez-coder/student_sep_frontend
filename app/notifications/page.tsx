"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import DashboardLayout from "@/components/DashboardLayout";
import { useTheme } from "@/components/ThemeProvider";
import { StudentApi, getLoggedInStudentId } from "@/lib/studentApi";
import styles from "./notifications.module.css";
import {
  Bell,
  CheckCircle2,
  Clock,
  Calendar,
  FileText,
  Award,
  Sparkles,
  Search,
  Filter,
  Trash2,
  CheckCheck,
  Star,
  ExternalLink,
  ChevronRight,
  SlidersHorizontal,
  X,
  AlertTriangle,
  BookOpen,
  Info,
  CalendarCheck,
  Video,
  ShieldAlert,
  Send,
  Volume2,
  Mail,
  Smartphone,
  MessageSquare,
  ArrowRight,
  RefreshCw,
} from "lucide-react";

// Notification Data Structure
interface NotificationItem {
  id: string;
  title: string;
  message: string;
  category: "classes" | "assignments" | "evaluations" | "announcements" | "system";
  priority: "urgent" | "high" | "normal";
  timestamp: string;
  dateGroup: "Today" | "Yesterday" | "Earlier This Week";
  isRead: boolean;
  isStarred: boolean;
  subject?: string;
  actionUrl?: string;
  actionLabel?: string;
  details?: string;
  sender?: string;
}

export default function NotificationsPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Initial Notifications State
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: "notif-1",
      title: "NLP & Transformers Live Session starts in 30 mins",
      message:
        "Join Mentor Priya Sharma for Week 14: Attention Mechanism & Multi-Head Self-Attention. Please keep your PyTorch notebook ready.",
      category: "classes",
      priority: "urgent",
      timestamp: "30 mins ago",
      dateGroup: "Today",
      isRead: false,
      isStarred: true,
      subject: "NLP & Transformers",
      actionUrl: "/classes",
      actionLabel: "Join Live Class",
      details:
        "Today's session covers theoretical derivations of Scaled Dot-Product Attention, positional encodings, and a hands-on coding walkthrough using Google Colab. Have your Google Meet link open 5 minutes prior to the start time.",
      sender: "Priya Sharma (Lead AI Mentor)",
    },
    {
      id: "notif-2",
      title: "New Assignment Posted: Text Classification using BERT",
      message:
        "Assignment #8 is now live. Build and fine-tune a BERT-based classifier for sentiment analysis. Deadline: 25 Sep 2026, 11:59 PM.",
      category: "assignments",
      priority: "high",
      timestamp: "2 hours ago",
      dateGroup: "Today",
      isRead: false,
      isStarred: false,
      subject: "NLP & Transformers",
      actionUrl: "/assignments",
      actionLabel: "View Assignment",
      details:
        "Dataset and boilerplate code are available in the assignment portal. Make sure your notebook achieves an F1-score of at least 0.85 on the validation split. Submit before the cutoff to avoid late penalties.",
      sender: "Academic Evaluations Board",
    },
    {
      id: "notif-3",
      title: "Evaluation 1 Detailed Scorecard & Feedback Published",
      message:
        "Your official scorecard for Evaluation 1 (Python, Math & ML Foundations) is now available with mentor feedback. You achieved 88%!",
      category: "evaluations",
      priority: "normal",
      timestamp: "5 hours ago",
      dateGroup: "Today",
      isRead: false,
      isStarred: true,
      subject: "Evaluation 1",
      actionUrl: "/evaluations",
      actionLabel: "View Scorecard",
      details:
        "Congratulations on scoring in the top 10% of your batch. Your highest performance was in Model Building (17/20) and Python & Programming (18/20). Review individual question comments to target areas for Evaluation 2.",
      sender: "Dr. Vikram Seth (Evaluation Director)",
    },
    {
      id: "notif-4",
      title: "Assignment Graded: NLP Data Preprocessing (Score: 95/100)",
      message:
        "Mentor Rahul Mehta has reviewed your tokenization and embedding pipeline. Excellent work handling OOV tokens and subword chunking!",
      category: "assignments",
      priority: "normal",
      timestamp: "Yesterday at 4:30 PM",
      dateGroup: "Yesterday",
      isRead: true,
      isStarred: false,
      subject: "NLP & Transformers",
      actionUrl: "/assignments",
      actionLabel: "View Feedback",
      details:
        "Feedback: 'Great pipeline design, robust regex cleaning, and seamless integration with Hugging Face Tokenizers. Minor suggestion: consider adding batching for datasets larger than 100k samples.'",
      sender: "Rahul Mehta (AI Instructor)",
    },
    {
      id: "notif-5",
      title: "Curriculum Milestone Unlocked: Month 4 Repository & Materials",
      message:
        "You have officially unlocked all Week 13–16 resources, including slide decks, PyTorch notebooks, and the gateway challenge for NLP.",
      category: "system",
      priority: "normal",
      timestamp: "Yesterday at 11:00 AM",
      dateGroup: "Yesterday",
      isRead: true,
      isStarred: false,
      subject: "Curriculum",
      actionUrl: "/curriculum",
      actionLabel: "Explore Materials",
      details:
        "Access the newly uploaded GitHub repository links, sample question banks, and pre-recorded foundation walkthroughs directly from your Curriculum tab.",
      sender: "NIM AI Learning Systems",
    },
    {
      id: "notif-6",
      title: "Guest Masterclass: Production RAG Architectures at Scale",
      message:
        "Exclusive masterclass this Saturday with Guest Speaker from Tech Lead at Google Cloud. Learn vector indexing, reranking & latency optimizations.",
      category: "announcements",
      priority: "high",
      timestamp: "2 days ago",
      dateGroup: "Earlier This Week",
      isRead: true,
      isStarred: true,
      subject: "Career & Masterclasses",
      actionUrl: "/classes",
      actionLabel: "Reserve Seat",
      details:
        "Date: Saturday, 27 Sep 2026 at 4:00 PM IST. Attendance will count towards extra credit in Month 5 (GenAI & RAG). Seats are limited to active cohort students.",
      sender: "Career & Industry Relations",
    },
    {
      id: "notif-7",
      title: "Monthly Attendance Report: 92% Attendance Recorded for September",
      message:
        "Your attendance is well above the required 80% threshold. You are fully eligible for placement drive participation and Evaluation 2.",
      category: "classes",
      priority: "normal",
      timestamp: "3 days ago",
      dateGroup: "Earlier This Week",
      isRead: true,
      isStarred: false,
      subject: "Attendance",
      actionUrl: "/attendance",
      actionLabel: "View Attendance Record",
      details:
        "Total Sessions: 24 | Present: 22 | Late: 1 | Absent: 1. Keep maintaining your 8-day streak to earn the Attendance Excellence Badge.",
      sender: "Student Operations Desk",
    },
    {
      id: "notif-8",
      title: "Important Notice: Evaluation 2 Gateway Date Announced",
      message:
        "Evaluation 2 will take place on 15 Oct 2026. Topics covered: Deep Learning, CNNs, RNNs, and Transformers.",
      category: "evaluations",
      priority: "high",
      timestamp: "4 days ago",
      dateGroup: "Earlier This Week",
      isRead: true,
      isStarred: false,
      subject: "Evaluations",
      actionUrl: "/evaluations",
      actionLabel: "Review Syllabus",
      details:
        "Evaluation format: 60 minutes multiple choice & conceptual questions (40%), followed by a 90-minute live coding challenge (60%). Mock tests open on 5 Oct 2026.",
      sender: "Academic Evaluations Board",
    },
  ]);

  // Filters State
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [onlyStarred, setOnlyStarred] = useState<boolean>(false);

  // Ref to prevent card onClick from firing when delete button is pressed
  const deletingRef = React.useRef(false);

  // Modal State for Notification Detail
  const [selectedNotif, setSelectedNotif] = useState<NotificationItem | null>(null);

  // Settings Panel / Modal State
  const [settingsOpen, setSettingsOpen] = useState<boolean>(false);
  const [preferences, setPreferences] = useState({
    emailAlerts: true,
    browserPush: true,
    smsAlerts: false,
    classReminders: true,
    deadlineAlerts: true,
    evaluationAlerts: true,
    soundEffects: false,
  });

  // Toast feedback state
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  // Support Request State
  const [supportOpen, setSupportOpen] = useState<boolean>(false);
  const [supportSubject, setSupportSubject] = useState("");
  const [supportCategory, setSupportCategory] = useState("Technical Support");
  const [supportPriority, setSupportPriority] = useState("Normal");
  const [supportMessage, setSupportMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Real Data Fetch
  React.useEffect(() => {
    fetch('http://localhost:8000/api/student/notifications/STU001/')
      .then(r => r.json())
      .then(data => {
        if (data.notifications && data.notifications.length > 0) {
          const mapped = data.notifications.map((n: any): NotificationItem => ({
            // Prefix with "api-" so API IDs never clash with dummy "notif-N" IDs
            id: `api-${n.id}`,
            title: n.title,
            message: n.message,
            category: (
              n.category?.toLowerCase().includes('academic') ? 'announcements'
              : n.category?.toLowerCase().includes('class') ? 'classes'
              : n.category?.toLowerCase().includes('assign') ? 'assignments'
              : n.category?.toLowerCase().includes('eval') ? 'evaluations'
              : 'system'
            ) as NotificationItem['category'],
            priority: 'normal' as NotificationItem['priority'],
            timestamp: n.timestamp || 'Just now',
            dateGroup: 'Today' as NotificationItem['dateGroup'],
            isRead: n.is_read,
            isStarred: false,
            subject: n.category || 'General',
            actionUrl: undefined,
            actionLabel: undefined,
            details: n.message,
            sender: n.category || 'NIM AI Portal',
          }));

          // Deduplicate: skip items whose IDs already exist in state (guards against StrictMode double-fire)
          setNotifications(prev => {
            const existingIds = new Set(prev.map(p => p.id));
            const newItems = mapped.filter((m: NotificationItem) => !existingIds.has(m.id));
            return newItems.length > 0 ? [...newItems, ...prev] : prev;
          });
        }
      })
      .catch(err => console.error(err));
  }, []);

  const handleSupportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('http://localhost:8000/api/student/requests/STU001/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: supportSubject,
          category: supportCategory,
          priority: supportPriority,
          description: supportMessage
        })
      });
      if (res.ok) {
        setSupportOpen(false);
        showToast("Support request submitted successfully!");
        setSupportSubject("");
        setSupportMessage("");
      }
    } catch (err) {
      console.error(err);
      showToast("Error submitting request.");
    }
    setIsSubmitting(false);
  };


  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Actions
  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isRead: true } : item))
    );
  };

  const toggleReadStatus = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isRead: !item.isRead } : item))
    );
  };

  const toggleStar = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isStarred: !item.isStarred } : item))
    );
  };

  const deleteNotification = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    // Set the deleting flag so the card's onClick guard skips opening the modal
    deletingRef.current = true;
    setNotifications((prev) => prev.filter((item) => item.id !== id));
    // If the deleted item was open in the modal, close the modal
    setSelectedNotif((prev) => (prev && prev.id === id ? null : prev));
    showToast("Notification deleted");
    // Reset the flag after the event bubble completes
    setTimeout(() => { deletingRef.current = false; }, 0);
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((item) => ({ ...item, isRead: true })));
    showToast("All notifications marked as read");
  };

  const clearAllRead = () => {
    const unreadOnly = notifications.filter((item) => !item.isRead);
    setNotifications(unreadOnly);
    showToast("Cleared all read notifications");
  };

  // Computed Metrics
  const totalCount = notifications.length;
  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const urgentCount = notifications.filter((n) => n.priority === "urgent" || n.priority === "high").length;
  const classesCount = notifications.filter((n) => n.category === "classes").length;
  const assignmentsCount = notifications.filter((n) => n.category === "assignments").length;
  const evaluationsCount = notifications.filter((n) => n.category === "evaluations").length;
  const announcementsCount = notifications.filter((n) => n.category === "announcements" || n.category === "system").length;

  // Filtered Notifications
  const filteredNotifications = useMemo(() => {
    return notifications.filter((item) => {
      // Category filter
      if (activeCategory === "unread" && item.isRead) return false;
      if (activeCategory !== "all" && activeCategory !== "unread" && item.category !== activeCategory) {
        return false;
      }

      // Starred filter
      if (onlyStarred && !item.isStarred) return false;

      // Priority filter
      if (priorityFilter !== "all" && item.priority !== priorityFilter) return false;

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = item.title.toLowerCase().includes(q);
        const matchMsg = item.message.toLowerCase().includes(q);
        const matchSub = item.subject?.toLowerCase().includes(q) || false;
        if (!matchTitle && !matchMsg && !matchSub) return false;
      }

      return true;
    });
  }, [notifications, activeCategory, onlyStarred, priorityFilter, searchQuery]);

  // Group by Date
  const groupedNotifications = useMemo(() => {
    const groups: { [key: string]: NotificationItem[] } = {
      Today: [],
      Yesterday: [],
      "Earlier This Week": [],
    };

    filteredNotifications.forEach((item) => {
      if (groups[item.dateGroup]) {
        groups[item.dateGroup].push(item);
      } else {
        groups["Earlier This Week"].push(item);
      }
    });

    return groups;
  }, [filteredNotifications]);

  // Category Icon & Color Helper
  const getCategoryMeta = (category: string) => {
    switch (category) {
      case "classes":
        return {
          icon: Calendar,
          label: "Class & Schedule",
          badgeBg: isDark ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" : "bg-emerald-50 text-emerald-700 border-emerald-200",
          iconBg: isDark ? "bg-emerald-500/20 text-emerald-400" : "bg-emerald-100 text-emerald-700",
        };
      case "assignments":
        return {
          icon: FileText,
          label: "Assignments",
          badgeBg: isDark ? "bg-amber-500/15 text-amber-400 border-amber-500/30" : "bg-amber-50 text-amber-700 border-amber-200",
          iconBg: isDark ? "bg-amber-500/20 text-amber-400" : "bg-amber-100 text-amber-700",
        };
      case "evaluations":
        return {
          icon: Award,
          label: "Evaluations",
          badgeBg: isDark ? "bg-purple-500/15 text-purple-400 border-purple-500/30" : "bg-purple-50 text-purple-700 border-purple-200",
          iconBg: isDark ? "bg-purple-500/20 text-purple-400" : "bg-purple-100 text-purple-700",
        };
      case "announcements":
        return {
          icon: Sparkles,
          label: "Announcement",
          badgeBg: isDark ? "bg-sky-500/15 text-sky-400 border-sky-500/30" : "bg-sky-50 text-sky-700 border-sky-200",
          iconBg: isDark ? "bg-sky-500/20 text-sky-400" : "bg-sky-100 text-sky-700",
        };
      default:
        return {
          icon: Bell,
          label: "System",
          badgeBg: isDark ? "bg-blue-500/15 text-blue-400 border-blue-500/30" : "bg-blue-50 text-blue-700 border-blue-200",
          iconBg: isDark ? "bg-blue-500/20 text-blue-400" : "bg-blue-100 text-blue-700",
        };
    }
  };

  return (
    <DashboardLayout>
      <div className={styles.container}>
        {/* Toast Alert Feedback */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl bg-[#0a1b39] text-white shadow-2xl border border-blue-500/30 animate-in fade-in slide-in-from-bottom-5">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span className="text-xs sm:text-sm font-bold">{toastMessage}</span>
          </div>
        )}

        {/* =========================================================================
            1. HERO BANNER WITH BELL ICON & QUICK CONTROLS
            ========================================================================= */}
        <section className={styles.heroCard}>
          <div className={styles.glowOrb} />
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
            {/* Left: Signature Blue Icon Container + Title + Subtitle */}
            <div className="flex items-center gap-4 min-w-0">
              <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#0062eb] flex items-center justify-center text-white shrink-0 shadow-md shadow-blue-600/30">
                <Bell className="w-6 h-6 sm:w-7 sm:h-7 stroke-[2.2]" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#ef4444] text-white text-[11px] font-black flex items-center justify-center ring-2 ring-white dark:ring-[#071530] animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </div>
              <div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h1
                    className={`text-2xl sm:text-3xl font-black tracking-tight leading-tight ${
                      isDark ? "text-white" : "text-[#0a1b39]"
                    }`}
                  >
                    Notifications
                  </h1>
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                      unreadCount > 0
                        ? isDark
                          ? "bg-red-500/15 text-red-400 border-red-500/30"
                          : "bg-red-50 text-red-700 border-red-200"
                        : isDark
                        ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                        : "bg-emerald-50 text-emerald-700 border-emerald-200"
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        unreadCount > 0 ? "bg-red-500 animate-pulse" : "bg-emerald-500"
                      }`}
                    />
                    {unreadCount > 0 ? `${unreadCount} Unread Alerts` : "All Caught Up"}
                  </span>
                </div>
                <p
                  className={`text-xs sm:text-sm font-medium mt-1 ${
                    isDark ? "text-slate-400" : "text-slate-500"
                  }`}
                >
                  Stay updated with class schedules, assignment deadlines, evaluation feedback, and announcements.
                </p>
              </div>
            </div>

            {/* Right: Quick Action Controls */}
            <div className="flex items-center gap-2.5 flex-wrap self-start lg:self-auto">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    isDark
                      ? "bg-[#0f1d3c] border-[#1f376a] text-slate-200 hover:bg-[#16274e] hover:text-white"
                      : "bg-white border-[#dce8f8] text-[#0a1b39] hover:bg-blue-50 hover:text-[#0062eb] shadow-sm"
                  }`}
                >
                  <CheckCheck className="w-4 h-4 text-[#0062eb]" />
                  <span>Mark All Read</span>
                </button>
              )}

              <button
                  onClick={() => setSupportOpen(true)}
                  className={`hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-md active:scale-95 ${
                    isDark
                      ? "bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30"
                      : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                  }`}
                >
                  <ShieldAlert className="w-4 h-4" />
                  <span>Support Request</span>
                </button>
                <button
                  onClick={() => setSettingsOpen(true)}
                className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                  isDark
                    ? "bg-[#0f1d3c] border-[#1f376a] text-slate-200 hover:bg-[#16274e]"
                    : "bg-white border-[#dce8f8] text-[#0a1b39] hover:bg-slate-50 shadow-sm"
                }`}
              >
                <SlidersHorizontal className="w-4 h-4 text-slate-400" />
                <span>Preferences</span>
              </button>
            </div>
          </div>
        </section>

        {/* =========================================================================
            2. ROW OF 4 KPI METRIC CARDS
            ========================================================================= */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* KPI 1: Total Notifications */}
          <div className={`${styles.card} p-4 flex flex-col justify-between`}>
            <div className="flex items-center justify-between mb-2">
              <span
                className={`text-xs font-semibold ${
                  isDark ? "text-slate-400" : "text-slate-500"
                }`}
              >
                Total Notifications
              </span>
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  isDark ? "bg-blue-500/15 text-blue-400" : "bg-blue-50 text-[#0062eb]"
                }`}
              >
                <Bell className="w-4 h-4" />
              </div>
            </div>
            <div
              className={`text-2xl font-black ${
                isDark ? "text-white" : "text-[#0a1b39]"
              }`}
            >
              {totalCount}
            </div>
            <p
              className={`text-[11px] mt-1 font-medium ${
                isDark ? "text-slate-400" : "text-slate-500"
              }`}
            >
              Across all categories
            </p>
          </div>

          {/* KPI 2: Unread Alerts */}
          <div
            onClick={() => setActiveCategory(activeCategory === "unread" ? "all" : "unread")}
            className={`${styles.card} p-4 flex flex-col justify-between cursor-pointer group`}
          >
            <div className="flex items-center justify-between mb-2">
              <span
                className={`text-xs font-semibold ${
                  isDark ? "text-slate-400" : "text-slate-500"
                }`}
              >
                Unread Alerts
              </span>
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  unreadCount > 0
                    ? isDark
                      ? "bg-red-500/20 text-red-400"
                      : "bg-red-50 text-red-600"
                    : isDark
                    ? "bg-slate-800 text-slate-400"
                    : "bg-slate-100 text-slate-500"
                }`}
              >
                <AlertTriangle className="w-4 h-4" />
              </div>
            </div>
            <div
              className={`text-2xl font-black ${
                unreadCount > 0
                  ? isDark
                    ? "text-red-400"
                    : "text-red-600"
                  : isDark
                  ? "text-white"
                  : "text-[#0a1b39]"
              }`}
            >
              {unreadCount}
            </div>
            <p
              className={`text-[11px] mt-1 font-bold ${
                unreadCount > 0 ? "text-red-500" : isDark ? "text-slate-400" : "text-slate-500"
              }`}
            >
              {unreadCount > 0 ? "Requires attention" : "All read"}
            </p>
          </div>

          {/* KPI 3: Classes & Schedule */}
          <div
            onClick={() => setActiveCategory("classes")}
            className={`${styles.card} p-4 flex flex-col justify-between cursor-pointer group`}
          >
            <div className="flex items-center justify-between mb-2">
              <span
                className={`text-xs font-semibold ${
                  isDark ? "text-slate-400" : "text-slate-500"
                }`}
              >
                Classes &amp; Live
              </span>
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  isDark ? "bg-emerald-500/15 text-emerald-400" : "bg-emerald-50 text-emerald-700"
                }`}
              >
                <Calendar className="w-4 h-4" />
              </div>
            </div>
            <div
              className={`text-2xl font-black ${
                isDark ? "text-white" : "text-[#0a1b39]"
              }`}
            >
              {classesCount}
            </div>
            <p
              className={`text-[11px] mt-1 font-medium ${
                isDark ? "text-slate-400" : "text-slate-500"
              }`}
            >
              Sessions &amp; reminders
            </p>
          </div>

          {/* KPI 4: Assignments & Evaluations */}
          <div
            onClick={() => setActiveCategory("assignments")}
            className={`${styles.card} p-4 flex flex-col justify-between cursor-pointer group`}
          >
            <div className="flex items-center justify-between mb-2">
              <span
                className={`text-xs font-semibold ${
                  isDark ? "text-slate-400" : "text-slate-500"
                }`}
              >
                Assignments &amp; Tests
              </span>
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  isDark ? "bg-amber-500/15 text-amber-400" : "bg-amber-50 text-amber-700"
                }`}
              >
                <FileText className="w-4 h-4" />
              </div>
            </div>
            <div
              className={`text-2xl font-black ${
                isDark ? "text-white" : "text-[#0a1b39]"
              }`}
            >
              {assignmentsCount + evaluationsCount}
            </div>
            <p
              className={`text-[11px] mt-1 font-medium ${
                isDark ? "text-slate-400" : "text-slate-500"
              }`}
            >
              Deadlines &amp; scorecards
            </p>
          </div>
        </section>

        {/* =========================================================================
            3. MAIN CONTENT: NOTIFICATION FEED
            ========================================================================= */}
        <div className="space-y-4">
            {/* Filter and Search Bar Card */}
            <div className={`${styles.card} p-4 space-y-3.5`}>
              {/* Search Input & Priority Selector */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search notifications by title, subject, or mentor..."
                    className={`w-full pl-9 pr-8 py-2 rounded-xl text-xs sm:text-sm outline-none transition border ${
                      isDark
                        ? "bg-[#0b1429] border-[#182a52] text-white placeholder-slate-500 focus:border-[#0062eb]"
                        : "bg-[#f8fbff] border-[#dce8f8] text-[#0a1b39] placeholder-slate-400 focus:border-[#0062eb] focus:bg-white"
                    }`}
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold border outline-none cursor-pointer transition ${
                      isDark
                        ? "bg-[#0b1429] border-[#182a52] text-slate-300"
                        : "bg-[#f8fbff] border-[#dce8f8] text-[#0a1b39]"
                    }`}
                  >
                    <option value="all">All Priorities</option>
                    <option value="urgent">Urgent</option>
                    <option value="high">High</option>
                    <option value="normal">Normal</option>
                  </select>

                  <button
                    onClick={() => setOnlyStarred(!onlyStarred)}
                    className={`p-2 rounded-xl border text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                      onlyStarred
                        ? "bg-amber-500 text-white border-amber-600 shadow-md shadow-amber-500/25"
                        : isDark
                        ? "bg-[#0b1429] border-[#182a52] text-slate-400 hover:text-white"
                        : "bg-[#f8fbff] border-[#dce8f8] text-slate-600 hover:text-amber-500"
                    }`}
                    title="Filter Starred"
                  >
                    <Star
                      className={`w-4 h-4 ${onlyStarred ? "fill-white text-white" : ""}`}
                    />
                    <span className="hidden sm:inline">Starred</span>
                  </button>
                </div>
              </div>

              {/* Category Filter Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {[
                  { id: "all", label: "All", count: totalCount },
                  { id: "unread", label: "Unread", count: unreadCount },
                  { id: "classes", label: "Classes", count: classesCount },
                  { id: "assignments", label: "Assignments", count: assignmentsCount },
                  { id: "evaluations", label: "Evaluations", count: evaluationsCount },
                  { id: "announcements", label: "Announcements", count: announcementsCount },
                ].map((tab) => {
                  const isActive = activeCategory === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveCategory(tab.id)}
                      className={`cursor-pointer ${
                        isActive
                          ? styles.filterTabActive
                          : isDark
                          ? styles.filterTabInactive
                          : styles.filterTabInactive
                      } ${styles.filterTab}`}
                    >
                      <span>{tab.label}</span>
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                          isActive
                            ? "bg-white/20 text-white"
                            : isDark
                            ? "bg-slate-800 text-slate-400"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {tab.count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Notifications List Grouped By Date */}
            {filteredNotifications.length === 0 ? (
              /* Empty State */
              <div className={`${styles.card} p-12 text-center flex flex-col items-center justify-center`}>
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-3 ${
                    isDark ? "bg-slate-800/60 text-slate-500" : "bg-blue-50 text-blue-500"
                  }`}
                >
                  <Bell className="w-7 h-7 stroke-[1.8]" />
                </div>
                <h3
                  className={`text-base font-bold ${
                    isDark ? "text-white" : "text-[#0a1b39]"
                  }`}
                >
                  No notifications found
                </h3>
                <p
                  className={`text-xs mt-1 max-w-sm font-medium ${
                    isDark ? "text-slate-400" : "text-slate-500"
                  }`}
                >
                  No items match your active filters or search criteria. Try resetting your search or selecting another category.
                </p>
                <button
                  onClick={() => {
                    setActiveCategory("all");
                    setPriorityFilter("all");
                    setSearchQuery("");
                    setOnlyStarred(false);
                  }}
                  className="mt-4 px-4 py-2 rounded-xl bg-[#0062eb] hover:bg-[#0052cc] text-white text-xs font-bold transition shadow-md shadow-blue-600/20"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              /* Grouped Notifications List */
              <div className="space-y-5">
                {(["Today", "Yesterday", "Earlier This Week"] as const).map((groupName) => {
                  const groupItems = groupedNotifications[groupName];
                  if (!groupItems || groupItems.length === 0) return null;

                  return (
                    <div key={groupName} className="space-y-2.5">
                      {/* Date Group Heading */}
                      <div className="flex items-center gap-3 px-1">
                        <span
                          className={`text-xs font-black tracking-wider uppercase ${
                            isDark ? "text-slate-400" : "text-slate-500"
                          }`}
                        >
                          {groupName}
                        </span>
                        <div
                          className={`flex-1 h-[1px] ${
                            isDark ? "bg-slate-800" : "bg-slate-200"
                          }`}
                        />
                        <span className="text-[11px] font-semibold text-slate-400">
                          {groupItems.length} {groupItems.length === 1 ? "alert" : "alerts"}
                        </span>
                      </div>

                      {/* Items */}
                      <div className="space-y-2.5">
                        {groupItems.map((item) => {
                          const meta = getCategoryMeta(item.category);
                          const Icon = meta.icon;

                          return (
                            <div
                              key={item.id}
                              onClick={() => {
                                // Guard: skip if a delete action is in progress
                                if (deletingRef.current) return;
                                markAsRead(item.id);
                                setSelectedNotif(item);
                              }}
                              className={`cursor-pointer transition-all duration-200 ${
                                styles.notifItem
                              } ${!item.isRead ? styles.notifItemUnread : ""}`}
                            >
                              <div className="flex items-start gap-3.5">
                                {/* Unread Dot or Icon */}
                                <div className="relative shrink-0 mt-0.5">
                                  <div
                                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition ${meta.iconBg}`}
                                  >
                                    <Icon className="w-5 h-5 stroke-[2.2]" />
                                  </div>
                                  {!item.isRead && (
                                    <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-[#0062eb] border-2 border-white dark:border-[#0b1429] animate-pulse" />
                                  )}
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                  {/* Top Badges & Time */}
                                  <div className="flex items-center justify-between gap-2 mb-1">
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <span
                                        className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wide border ${meta.badgeBg}`}
                                      >
                                        {meta.label}
                                      </span>

                                      {item.priority === "urgent" && (
                                        <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wide bg-red-500/15 text-red-500 border border-red-500/30 flex items-center gap-1">
                                          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                                          Urgent
                                        </span>
                                      )}

                                      {item.priority === "high" && (
                                        <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wide bg-amber-500/15 text-amber-500 border border-amber-500/30">
                                          Important
                                        </span>
                                      )}

                                      {item.subject && (
                                        <span
                                          className={`text-[11px] font-semibold truncate ${
                                            isDark ? "text-slate-400" : "text-slate-500"
                                          }`}
                                        >
                                          • {item.subject}
                                        </span>
                                      )}
                                    </div>

                                    <div className="flex items-center gap-2 shrink-0">
                                      <span
                                        className={`text-[11px] font-medium flex items-center gap-1 ${
                                          isDark ? "text-slate-400" : "text-slate-500"
                                        }`}
                                      >
                                        <Clock className="w-3 h-3" />
                                        {item.timestamp}
                                      </span>
                                    </div>
                                  </div>

                                  {/* Title */}
                                  <h4
                                    className={`text-sm font-bold leading-snug mb-1 transition-colors ${
                                      item.isRead
                                        ? isDark
                                          ? "text-slate-300"
                                          : "text-[#0a1b39]"
                                        : isDark
                                        ? "text-white font-extrabold"
                                        : "text-[#0052cc] font-extrabold"
                                    }`}
                                  >
                                    {item.title}
                                  </h4>

                                  {/* Body */}
                                  <p
                                    className={`text-xs leading-relaxed line-clamp-2 ${
                                      isDark ? "text-slate-400" : "text-slate-600 font-medium"
                                    }`}
                                  >
                                    {item.message}
                                  </p>

                                  {/* Bottom Action Bar */}
                                  <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-200/70 dark:border-slate-700/50">
                                    {/* Left: CTA link or hint */}
                                    {item.actionUrl && item.actionLabel ? (
                                      <Link
                                        href={item.actionUrl}
                                        onClick={(e) => e.stopPropagation()}
                                        className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#0062eb] hover:text-[#0041c4] group"
                                      >
                                        <span>{item.actionLabel}</span>
                                        <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
                                      </Link>
                                    ) : (
                                      <span className="text-[11px] font-medium text-slate-400">
                                        Tap to view details
                                      </span>
                                    )}

                                    {/* Right: action icon pills */}
                                    <div className="flex items-center gap-1">
                                      {/* Star */}
                                      <button
                                        onClick={(e) => toggleStar(item.id, e)}
                                        title={item.isStarred ? "Unstar" : "Star"}
                                        className={`flex items-center justify-center w-7 h-7 rounded-lg transition-all active:scale-95 ${
                                          item.isStarred
                                            ? "bg-amber-100 dark:bg-amber-500/20 text-amber-500"
                                            : "bg-slate-100 dark:bg-slate-800 text-slate-400 hover:bg-amber-50 dark:hover:bg-amber-500/10 hover:text-amber-500"
                                        }`}
                                      >
                                        <Star className={`w-3.5 h-3.5 ${item.isStarred ? "fill-amber-500" : ""}`} />
                                      </button>

                                      {/* Mark Read/Unread */}
                                      <button
                                        onClick={(e) => toggleReadStatus(item.id, e)}
                                        title={item.isRead ? "Mark as unread" : "Mark as read"}
                                        className={`flex items-center justify-center w-7 h-7 rounded-lg transition-all active:scale-95 ${
                                          item.isRead
                                            ? "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                                            : "bg-slate-100 dark:bg-slate-800 text-slate-400 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 hover:text-emerald-500"
                                        }`}
                                      >
                                        <CheckCircle2 className="w-3.5 h-3.5" />
                                      </button>

                                      {/* Delete — isolated with pointer-events and stopPropagation + deletingRef */}
                                      <button
                                        onPointerDown={(e) => {
                                          e.stopPropagation();
                                          deletingRef.current = true;
                                        }}
                                        onClick={(e) => deleteNotification(item.id, e)}
                                        title="Delete notification"
                                        className="flex items-center justify-center w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-400 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-500 transition-all active:scale-95"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
        </div>

        {/* =========================================================================
            4. MODAL: NOTIFICATION DETAIL DIALOG
            ========================================================================= */}
        {selectedNotif && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
            <div
              className={`w-full max-w-lg rounded-2xl p-6 border shadow-2xl space-y-4 animate-in zoom-in-95 ${
                isDark
                  ? "bg-[#0b1429] border-[#1e3363] text-white"
                  : "bg-white border-[#dce8f8] text-[#0a1b39]"
              }`}
            >
              {/* Modal Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      getCategoryMeta(selectedNotif.category).iconBg
                    }`}
                  >
                    {React.createElement(getCategoryMeta(selectedNotif.category).icon, {
                      className: "w-5 h-5",
                    })}
                  </div>
                  <div>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wide border ${
                        getCategoryMeta(selectedNotif.category).badgeBg
                      }`}
                    >
                      {getCategoryMeta(selectedNotif.category).label}
                    </span>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {selectedNotif.timestamp}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedNotif(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Title & Body */}
              <div>
                <h3
                  className={`text-base sm:text-lg font-bold ${
                    isDark ? "text-white" : "text-[#0a1b39]"
                  }`}
                >
                  {selectedNotif.title}
                </h3>
                {selectedNotif.sender && (
                  <p className="text-xs text-[#0062eb] font-semibold mt-0.5">
                    From: {selectedNotif.sender}
                  </p>
                )}
              </div>

              <div
                className={`p-3.5 rounded-xl border text-xs leading-relaxed ${
                  isDark
                    ? "bg-[#070e1f] border-[#152345] text-slate-300"
                    : "bg-[#f8fbff] border-[#e2edf8] text-slate-700"
                }`}
              >
                {selectedNotif.details || selectedNotif.message}
              </div>

              {/* Actions Footer */}
              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => {
                    deleteNotification(selectedNotif.id, {} as React.MouseEvent);
                    setSelectedNotif(null);
                  }}
                  className="text-xs text-red-500 hover:underline font-bold flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Dismiss</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedNotif(null)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold border ${
                      isDark
                        ? "border-slate-700 hover:bg-slate-800 text-slate-300"
                        : "border-slate-300 hover:bg-slate-100 text-slate-700"
                    }`}
                  >
                    Close
                  </button>

                  {selectedNotif.actionUrl && (
                    <Link
                      href={selectedNotif.actionUrl}
                      onClick={() => setSelectedNotif(null)}
                      className="px-4 py-2 rounded-xl bg-[#0062eb] hover:bg-[#0052cc] text-white text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-blue-600/25"
                    >
                      <span>{selectedNotif.actionLabel || "View"}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            5. MODAL: NOTIFICATION PREFERENCES
            ========================================================================= */}
        {settingsOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
            <div
              className={`w-full max-w-md rounded-2xl p-6 border shadow-2xl space-y-5 animate-in zoom-in-95 ${
                isDark
                  ? "bg-[#0b1429] border-[#1e3363] text-white"
                  : "bg-white border-[#dce8f8] text-[#0a1b39]"
              }`}
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2.5">
                  <SlidersHorizontal className="w-5 h-5 text-[#0062eb]" />
                  <h3 className="font-bold text-base">Notification Preferences</h3>
                </div>
                <button
                  onClick={() => setSettingsOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3.5 text-xs">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold">Live Class Reminders</p>
                    <p className="text-[11px] text-slate-400">
                      Receive alerts 15 minutes prior to live classes
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferences.classReminders}
                    onChange={(e) =>
                      setPreferences({ ...preferences, classReminders: e.target.checked })
                    }
                    className="w-4 h-4 accent-[#0062eb] rounded cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold">Assignment Deadlines</p>
                    <p className="text-[11px] text-slate-400">
                      Receive warning 24 hours and 4 hours before deadline
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferences.deadlineAlerts}
                    onChange={(e) =>
                      setPreferences({ ...preferences, deadlineAlerts: e.target.checked })
                    }
                    className="w-4 h-4 accent-[#0062eb] rounded cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold">Evaluation Scorecards</p>
                    <p className="text-[11px] text-slate-400">
                      Notify immediately when scorecard or feedback is published
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferences.evaluationAlerts}
                    onChange={(e) =>
                      setPreferences({ ...preferences, evaluationAlerts: e.target.checked })
                    }
                    className="w-4 h-4 accent-[#0062eb] rounded cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold">Sound Notifications</p>
                    <p className="text-[11px] text-slate-400">
                      Play chime for incoming urgent alerts
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferences.soundEffects}
                    onChange={(e) =>
                      setPreferences({ ...preferences, soundEffects: e.target.checked })
                    }
                    className="w-4 h-4 accent-[#0062eb] rounded cursor-pointer"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  onClick={() => setSettingsOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setSettingsOpen(false);
                    showToast("Notification preferences updated successfully");
                  }}
                  className="px-4 py-2 rounded-xl bg-[#0062eb] hover:bg-[#0052cc] text-white text-xs font-bold transition shadow-md shadow-blue-600/25"
                >
                  Save Preferences
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

