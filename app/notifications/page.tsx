"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import DashboardLayout from "@/components/DashboardLayout";
import { useTheme } from "@/components/ThemeProvider";
import { StudentApi, getLoggedInStudentId } from "@/lib/studentApi";
import { NotificationsPageSkeleton } from "@/components/Skeleton";
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
  HelpCircle,
  Paperclip,
  Upload,
  UserCheck,
  User,
  CreditCard,
} from "lucide-react";

// Notification Data Structure
interface NotificationItem {
  id: string;
  title: string;
  message: string;
  category: "classes" | "assignments" | "evaluations" | "announcements" | "system" | "fees";
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

  // Notifications State (real data from Django API)
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

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

  // Recipient details interface
  interface RecipientInfo {
    id: number;
    name: string;
    email: string;
    role: string;
  }

  // Support Request State ("Any Doubts? Ask")
  const [supportOpen, setSupportOpen] = useState<boolean>(false);
  const [recipientType, setRecipientType] = useState<"Mentor" | "Admin">("Mentor");
  const [assignedMentor, setAssignedMentor] = useState<RecipientInfo | null>(null);
  const [availableAdmin, setAvailableAdmin] = useState<RecipientInfo | null>(null);
  const [supportSubject, setSupportSubject] = useState("");
  const [supportCategory, setSupportCategory] = useState("Doubt / Academic Question");
  const [supportPriority, setSupportPriority] = useState("Normal");
  const [supportMessage, setSupportMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // Real Data Fetch from Django API
  const loadNotifications = React.useCallback(() => {
    const studentId = getLoggedInStudentId();
    StudentApi.getNotifications(studentId)
      .then((data: any) => {
        if (data?.assigned_mentor) setAssignedMentor(data.assigned_mentor);
        if (data?.available_admin) setAvailableAdmin(data.available_admin);
        if ((data.status === "success" || data.success) && Array.isArray(data.notifications)) {
          const mapped: NotificationItem[] = data.notifications.map((n: any): NotificationItem => {
            const rawCat = (n.category || '').toLowerCase();
            const rawTitle = (n.title || '').toLowerCase();
            const reminderType = n.reminder_type || '';

            let category: NotificationItem['category'] = 'system';
            if (rawCat.includes('fee') || rawCat.includes('payment') || reminderType || rawTitle.includes('fee')) {
              category = 'fees';
            } else if (rawCat.includes('academic') || rawCat.includes('announc')) {
              category = 'announcements';
            } else if (rawCat.includes('class')) {
              category = 'classes';
            } else if (rawCat.includes('assign')) {
              category = 'assignments';
            } else if (rawCat.includes('eval')) {
              category = 'evaluations';
            }

            let priority: NotificationItem['priority'] = 'normal';
            if (reminderType === 'overdue' || rawTitle.includes('overdue')) {
              priority = 'urgent';
            } else if (reminderType === 'upcoming_7_days' || rawTitle.includes('upcoming') || rawTitle.includes('reminder')) {
              priority = 'high';
            }

            const actionUrl = n.action_url || (category === 'fees' ? '/fees' : undefined);
            const actionLabel = n.action_label || (
              category === 'fees'
                ? (priority === 'urgent' ? 'Pay Overdue Fee' : 'Go to Fees & Payments')
                : undefined
            );

            return {
              id: String(n.id),
              title: n.title,
              message: n.message,
              category,
              priority,
              timestamp: n.timestamp || 'Just now',
              dateGroup: 'Today' as NotificationItem['dateGroup'],
              isRead: Boolean(n.is_read),
              isStarred: false,
              subject: n.category || (category === 'fees' ? 'Fees & Payments' : 'General'),
              actionUrl,
              actionLabel,
              details: n.message,
              sender: n.target_group || (category === 'fees' ? 'Accounts & Finance' : 'NIM Academy Admin'),
            };
          });

          setNotifications(mapped);
        }
      })
      .catch((err: any) => console.error("Error fetching notifications:", err))
      .finally(() => setIsLoading(false));
  }, []);

  React.useEffect(() => {
    const studentId = getLoggedInStudentId();
    StudentApi.getRequests(studentId).then((res: any) => {
      if (res?.assigned_mentor) setAssignedMentor(res.assigned_mentor);
      if (res?.available_admin) setAvailableAdmin(res.available_admin);
    }).catch(() => {});
  }, []);

  React.useEffect(() => {
    loadNotifications();
    // Automatically poll every 30 seconds to fetch scheduled background reminders without page refresh
    const interval = setInterval(loadNotifications, 30000);
    window.addEventListener("notificationsUpdated", loadNotifications);
    window.addEventListener("focus", loadNotifications);

    return () => {
      clearInterval(interval);
      window.removeEventListener("notificationsUpdated", loadNotifications);
      window.removeEventListener("focus", loadNotifications);
    };
  }, [loadNotifications]);

  const handleSupportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supportSubject.trim()) {
      setSubmitError("Please enter a subject for your question.");
      return;
    }
    if (!supportMessage.trim()) {
      setSubmitError("Please enter your message or doubt description.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(null);

    try {
      const studentId = getLoggedInStudentId();
      const formData = new FormData();
      formData.append("subject", supportSubject.trim());
      formData.append("description", supportMessage.trim());
      formData.append("message", supportMessage.trim());
      formData.append("category", supportCategory);
      formData.append("priority", supportPriority);
      formData.append("recipient_type", recipientType);
      
      if (recipientType === "Mentor" && assignedMentor?.id) {
        formData.append("target_user_id", String(assignedMentor.id));
      } else if (recipientType === "Admin" && availableAdmin?.id) {
        formData.append("target_user_id", String(availableAdmin.id));
      }

      if (selectedFile) {
        formData.append("attachment", selectedFile);
      }

      const res = await StudentApi.submitRequest(formData, studentId);
      if (res && (res.status === "success" || res.success)) {
        const targetName = recipientType === "Mentor" ? (assignedMentor?.name || "Assigned Mentor") : (availableAdmin?.name || "Admin Support");
        showToast(`Doubt sent to ${targetName} successfully!`);
        setSubmitSuccess(`Your doubt has been submitted to ${targetName}!`);
        setSupportSubject("");
        setSupportMessage("");
        setSelectedFile(null);
        loadNotifications();
        setTimeout(() => {
          setSupportOpen(false);
          setSubmitSuccess(null);
        }, 1200);
      } else {
        setSubmitError(res?.message || "Failed to submit. Please try again.");
      }
    } catch (err: any) {
      console.error(err);
      setSubmitError(err?.message || "Error submitting request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Actions
  const markAsRead = async (id: string) => {
    setNotifications((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isRead: true } : item))
    );
    await StudentApi.markNotificationRead(id);
    window.dispatchEvent(new Event("notificationsUpdated"));
  };

  const toggleReadStatus = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isRead: !item.isRead } : item))
    );
    await StudentApi.markNotificationRead(id);
    window.dispatchEvent(new Event("notificationsUpdated"));
  };

  const toggleStar = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isStarred: !item.isStarred } : item))
    );
  };

  const deleteNotification = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    // Set the deleting flag so the card's onClick guard skips opening the modal
    deletingRef.current = true;
    setNotifications((prev) => prev.filter((item) => item.id !== id));
    // If the deleted item was open in the modal, close the modal
    setSelectedNotif((prev) => (prev && prev.id === id ? null : prev));
    showToast("Notification deleted");
    
    // Call backend API to delete notification ONLY for this target student
    await StudentApi.deleteNotification(id);
    window.dispatchEvent(new Event("notificationsUpdated"));

    // Reset the flag after the event bubble completes
    setTimeout(() => { deletingRef.current = false; }, 0);
  };

  const markAllAsRead = async () => {
    setNotifications((prev) => prev.map((item) => ({ ...item, isRead: true })));
    showToast("All notifications marked as read");
    await StudentApi.markAllNotificationsRead();
    window.dispatchEvent(new Event("notificationsUpdated"));
  };

  const clearAllRead = async () => {
    const readItems = notifications.filter((item) => item.isRead);
    setNotifications((prev) => prev.filter((item) => !item.isRead));
    showToast("Cleared read notifications");
    for (const item of readItems) {
      await StudentApi.deleteNotification(item.id);
    }
    window.dispatchEvent(new Event("notificationsUpdated"));
  };

  // Computed Metrics
  const totalCount = notifications.length;
  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const urgentCount = notifications.filter((n) => n.priority === "urgent" || n.priority === "high").length;
  const feesCount = notifications.filter((n) => n.category === "fees").length;
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
      case "fees":
        return {
          icon: CreditCard,
          label: "Fees & Payment",
          badgeBg: isDark ? "bg-rose-500/15 text-rose-400 border-rose-500/30" : "bg-rose-50 text-rose-700 border-rose-200",
          iconBg: isDark ? "bg-rose-500/20 text-rose-400" : "bg-rose-100 text-rose-700",
        };
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

  if (isLoading) {
    return (
      <DashboardLayout>
        <NotificationsPageSkeleton />
      </DashboardLayout>
    );
  }

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
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full lg:w-auto shrink-0">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className={`inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    isDark
                      ? "bg-[#0f1d3c] border-[#1f376a] text-slate-200 hover:bg-[#16274e] hover:text-white"
                      : "bg-white border-[#dce8f8] text-[#0a1b39] hover:bg-blue-50 hover:text-[#0062eb] shadow-sm"
                  }`}
                >
                  <CheckCheck className="w-4 h-4 text-[#0062eb]" />
                  <span className="whitespace-nowrap">Mark All Read</span>
                </button>
              )}

              {/* Action column: Any Doubts? Ask on top, Preferences directly below it with equal spacing */}
              <div className="flex flex-col sm:flex-row lg:flex-col gap-2 w-full sm:w-auto min-w-0 sm:min-w-[175px]">
                <button
                  onClick={() => {
                    setSubmitError(null);
                    setSubmitSuccess(null);
                    setSupportOpen(true);
                  }}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-white transition-all shadow-md hover:shadow-lg active:scale-95 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-600 cursor-pointer"
                  title="Ask doubts or submit request"
                >
                  <HelpCircle className="w-4 h-4 text-white shrink-0" />
                  <span className="whitespace-nowrap">Any Doubts? Ask</span>
                </button>

                <button
                  onClick={() => setSettingsOpen(true)}
                  className={`w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    isDark
                      ? "bg-[#0f1d3c] border-[#1f376a] text-slate-200 hover:bg-[#16274e]"
                      : "bg-white border-[#dce8f8] text-[#0a1b39] hover:bg-slate-50 shadow-sm"
                  }`}
                >
                  <SlidersHorizontal className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="whitespace-nowrap">Preferences</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            2. ROW OF 4 KPI METRIC CARDS
            ========================================================================= */}
        <section className="grid grid-cols-1 min-[360px]:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
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
                  { id: "fees", label: "Fees", count: feesCount },
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
              className={`w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl p-6 border shadow-2xl space-y-4 animate-in zoom-in-95 ${
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
              className={`w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl p-6 border shadow-2xl space-y-5 animate-in zoom-in-95 ${
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
        )}        {/* =========================================================================
            6. MODAL: ANY DOUBTS? ASK (SUPPORT / DOUBT FORM)
            ========================================================================= */}
        {supportOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-sm animate-in fade-in">
            <div
              className={`w-full max-w-[540px] rounded-2xl border shadow-2xl flex flex-col max-h-[92vh] overflow-hidden animate-in zoom-in-95 ${
                isDark
                  ? "bg-[#0b1429] border-[#1e3363] text-white"
                  : "bg-white border-[#dce8f8] text-[#0a1b39]"
              }`}
            >
              {/* Modal Header - Compact & neatly aligned */}
              <div className={`px-5 sm:px-6 py-3.5 flex items-center justify-between border-b shrink-0 ${isDark ? "border-[#1e3363]" : "border-slate-100"}`}>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-700 flex items-center justify-center text-white shadow-md shadow-blue-500/25 shrink-0">
                    <HelpCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base leading-tight">Any Doubts? Ask</h3>
                    <p className={`text-[11px] mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                      Directly reach your assigned Mentor or Academy Admin
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSupportOpen(false);
                    setSubmitError(null);
                    setSubmitSuccess(null);
                  }}
                  className={`p-1.5 rounded-lg transition cursor-pointer ${
                    isDark ? "text-slate-400 hover:text-white hover:bg-slate-800" : "text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form container with scroll safety and fixed footer */}
              <form onSubmit={handleSupportSubmit} className="flex flex-col flex-1 overflow-hidden">
                {/* Form Body - Evenly spaced without unnecessary scrolling on desktop */}
                <div className="px-5 sm:px-6 py-3.5 sm:py-4 overflow-y-auto space-y-3 flex-1">
                  {submitError && (
                    <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 text-xs font-medium flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                      <span>{submitError}</span>
                    </div>
                  )}

                  {submitSuccess && (
                    <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 text-xs font-medium flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>{submitSuccess}</span>
                    </div>
                  )}

                  {/* 1. Recipient Selection: Mentor vs Admin (Equal Width & Height) */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider mb-1.5 text-slate-400">
                      Send Doubt / Request To <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-2 gap-3 w-full">
                      <button
                        type="button"
                        onClick={() => setRecipientType("Mentor")}
                        className={`p-2.5 rounded-xl border flex items-center gap-2.5 transition text-left cursor-pointer w-full h-[52px] min-h-[52px] ${
                          recipientType === "Mentor"
                            ? isDark
                              ? "bg-blue-600/20 border-blue-500 text-white ring-2 ring-blue-500/40"
                              : "bg-blue-50/80 border-[#0062eb] text-[#0062eb] ring-2 ring-blue-500/20 shadow-sm"
                            : isDark
                            ? "bg-[#070e1f] border-[#152345] text-slate-300 hover:border-slate-600"
                            : "bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300"
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                          recipientType === "Mentor" ? "bg-[#0062eb] text-white shadow-sm" : isDark ? "bg-slate-800 text-slate-400" : "bg-slate-200 text-slate-600"
                        }`}>
                          <UserCheck className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold truncate">Mentor</p>
                          <p className={`text-[10px] truncate ${isDark ? "text-slate-400" : "text-slate-500"}`}>Subject & Tasks</p>
                        </div>
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                          recipientType === "Mentor"
                            ? "border-[#0062eb] bg-[#0062eb] text-white"
                            : isDark ? "border-slate-600" : "border-slate-300"
                        }`}>
                          {recipientType === "Mentor" && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setRecipientType("Admin")}
                        className={`p-2.5 rounded-xl border flex items-center gap-2.5 transition text-left cursor-pointer w-full h-[52px] min-h-[52px] ${
                          recipientType === "Admin"
                            ? isDark
                              ? "bg-purple-600/20 border-purple-500 text-white ring-2 ring-purple-500/40"
                              : "bg-purple-50/80 border-purple-600 text-purple-700 ring-2 ring-purple-500/20 shadow-sm"
                            : isDark
                            ? "bg-[#070e1f] border-[#152345] text-slate-300 hover:border-slate-600"
                            : "bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300"
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                          recipientType === "Admin" ? "bg-purple-600 text-white shadow-sm" : isDark ? "bg-slate-800 text-slate-400" : "bg-slate-200 text-slate-600"
                        }`}>
                          <ShieldAlert className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold truncate">Admin</p>
                          <p className={`text-[10px] truncate ${isDark ? "text-slate-400" : "text-slate-500"}`}>Portal & Official</p>
                        </div>
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                          recipientType === "Admin"
                            ? "border-purple-600 bg-purple-600 text-white"
                            : isDark ? "border-slate-600" : "border-slate-300"
                        }`}>
                          {recipientType === "Admin" && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                      </button>
                    </div>

                    {/* Selected Recipient Card (Aligned Directly Below Selection) */}
                    <div className={`mt-2 p-2.5 rounded-xl border text-xs w-full transition-all ${
                      isDark ? "bg-[#070e1f] border-[#17264a]" : "bg-slate-50 border-slate-200"
                    }`}>
                      {recipientType === "Mentor" ? (
                        assignedMentor ? (
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white text-xs font-bold flex items-center justify-center shrink-0 shadow-sm">
                                {assignedMentor.name?.charAt(0)?.toUpperCase() || "M"}
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <span className="font-bold text-xs truncate">{assignedMentor.name}</span>
                                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-blue-500/15 text-blue-500 border border-blue-500/20">
                                    Assigned Mentor
                                  </span>
                                </div>
                                <p className={`text-[11px] truncate mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                                  {assignedMentor.email || "Primary batch mentor"}
                                </p>
                              </div>
                            </div>
                            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" title="Active" />
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-amber-500 text-xs py-0.5">
                            <Info className="w-4 h-4 shrink-0" />
                            <span>No mentor currently assigned to your batch. You can select Admin to receive support.</span>
                          </div>
                        )
                      ) : (
                        availableAdmin ? (
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-pink-600 text-white text-xs font-bold flex items-center justify-center shrink-0 shadow-sm">
                                {availableAdmin.name?.charAt(0)?.toUpperCase() || "A"}
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <span className="font-bold text-xs truncate">{availableAdmin.name}</span>
                                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-purple-500/15 text-purple-600 border border-purple-500/20">
                                    Available Admin
                                  </span>
                                </div>
                                <p className={`text-[11px] truncate mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                                  {availableAdmin.email || "Administrative Support Desk"}
                                </p>
                              </div>
                            </div>
                            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" title="Active" />
                          </div>
                        ) : (
                          <div className={`flex items-center gap-2 text-xs py-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                            <Info className="w-4 h-4 shrink-0" />
                            <span>Institution Admin Desk (admin@nim.edu)</span>
                          </div>
                        )
                      )}
                    </div>
                  </div>

                  {/* 2. Subject Input (Full Width) */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider mb-1 text-slate-400">
                      Subject <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder={recipientType === "Mentor" ? "e.g., Doubt regarding Python Machine Learning assignment" : "e.g., Query about portal access or course module"}
                      value={supportSubject}
                      onChange={(e) => setSupportSubject(e.target.value)}
                      className={`w-full h-[38px] px-3.5 rounded-xl text-xs sm:text-sm border transition outline-none ${
                        isDark
                          ? "bg-[#070e1f] border-[#152345] focus:border-blue-500 text-white placeholder-slate-500"
                          : "bg-white border-slate-200 focus:border-[#0062eb] text-[#0a1b39] placeholder-slate-400"
                      }`}
                    />
                  </div>

                  {/* 3. Category & Priority (Equal Width in One Row) */}
                  <div className="grid grid-cols-2 gap-3 w-full">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider mb-1 text-slate-400">
                        Category
                      </label>
                      <select
                        value={supportCategory}
                        onChange={(e) => setSupportCategory(e.target.value)}
                        className={`w-full h-[38px] px-3 rounded-xl text-xs border outline-none cursor-pointer ${
                          isDark
                            ? "bg-[#070e1f] border-[#152345] text-white"
                            : "bg-white border-slate-200 text-[#0a1b39]"
                        }`}
                      >
                        <option value="Doubt / Academic Question">Doubt / Question</option>
                        <option value="Assignment / Task Help">Assignment Help</option>
                        <option value="Class Clarification">Class Clarification</option>
                        <option value="Technical Issue">Technical Issue</option>
                        <option value="General Inquiry">General Inquiry</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider mb-1 text-slate-400">
                        Priority
                      </label>
                      <select
                        value={supportPriority}
                        onChange={(e) => setSupportPriority(e.target.value)}
                        className={`w-full h-[38px] px-3 rounded-xl text-xs border outline-none cursor-pointer ${
                          isDark
                            ? "bg-[#070e1f] border-[#152345] text-white"
                            : "bg-white border-slate-200 text-[#0a1b39]"
                        }`}
                      >
                        <option value="Normal">Normal</option>
                        <option value="High">High</option>
                        <option value="Urgent">Urgent</option>
                      </select>
                    </div>
                  </div>

                  {/* 4. Message / Description (Full Width with Proper Height) */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider mb-1 text-slate-400">
                      Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Describe your doubt in detail. Mention any specific error, concept, or code section..."
                      value={supportMessage}
                      onChange={(e) => setSupportMessage(e.target.value)}
                      className={`w-full h-[80px] min-h-[75px] p-2.5 sm:p-3 rounded-xl text-xs sm:text-sm border resize-none transition outline-none leading-relaxed ${
                        isDark
                          ? "bg-[#070e1f] border-[#152345] focus:border-blue-500 text-white placeholder-slate-500"
                          : "bg-white border-slate-200 focus:border-[#0062eb] text-[#0a1b39] placeholder-slate-400"
                      }`}
                    />
                  </div>

                  {/* 5. Optional Attachment (Full Width & Clearly Visible) */}
                  <div className="pb-1">
                    <label className="block text-[11px] font-bold uppercase tracking-wider mb-1 text-slate-400">
                      Attachment <span className="text-slate-400 font-normal lowercase">(optional: PDF, DOC, PNG, JPG, ZIP...)</span>
                    </label>
                    {selectedFile ? (
                      <div className={`w-full p-2.5 rounded-xl border flex items-center justify-between text-xs ${
                        isDark ? "bg-[#070e1f] border-[#1e3363]" : "bg-blue-50/50 border-blue-200"
                      }`}>
                        <div className="flex items-center gap-2.5 min-w-0">
                          <Paperclip className="w-4 h-4 text-[#0062eb] shrink-0" />
                          <div className="min-w-0">
                            <p className="font-bold truncate text-xs">{selectedFile.name}</p>
                            <p className={`text-[10px] ${isDark ? "text-slate-400" : "text-slate-500"}`}>{(selectedFile.size / 1024).toFixed(1)} KB</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setSelectedFile(null)}
                          className="p-1 rounded text-red-500 hover:bg-red-500/10 transition cursor-pointer"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <label className={`w-full border-2 border-dashed rounded-xl h-[42px] px-3.5 flex items-center justify-center gap-2 cursor-pointer transition text-xs font-medium ${
                        isDark
                          ? "border-slate-700 hover:border-blue-500 hover:bg-slate-800/40 text-slate-300"
                          : "border-slate-200 hover:border-blue-400 hover:bg-blue-50/30 text-slate-600"
                      }`}>
                        <Upload className="w-4 h-4 text-[#0062eb] shrink-0" />
                        <span className="truncate">Upload supporting screenshot or file</span>
                        <input
                          type="file"
                          className="hidden"
                          accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.zip,.png,.jpg,.jpeg"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              setSelectedFile(e.target.files[0]);
                            }
                          }}
                        />
                      </label>
                    )}
                  </div>
                </div>

                {/* Modal Footer - Fixed at bottom: Cancel on the left, Send on the right */}
                <div className={`px-5 sm:px-6 py-3 sm:py-3.5 border-t flex items-center justify-between w-full shrink-0 ${isDark ? "border-[#1e3363]" : "border-slate-100"}`}>
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => {
                      setSupportOpen(false);
                      setSubmitError(null);
                      setSubmitSuccess(null);
                    }}
                    className={`px-5 py-2.5 rounded-xl text-xs font-bold border transition cursor-pointer ${
                      isDark ? "border-slate-700 hover:bg-slate-800 text-slate-300" : "border-slate-200 hover:bg-slate-100 text-slate-600"
                    }`}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold transition shadow-md shadow-blue-600/25 flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Send to {recipientType}</span>
                      </>
                    )}
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

