"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useTheme } from "@/components/ThemeProvider";
import styles from "@/styles/parent/notifications.module.css";
import { NotificationItem } from "@/lib/parentData";
import { getLoggedInStudentId, StudentApi } from "@/lib/studentApi";
import { NotificationsPageSkeleton } from "@/components/Skeleton";
import {
  Calendar,
  ClipboardCheck,
  Award,
  Megaphone,
  Bell,
  FileText,
  CreditCard,
  CheckCheck,
  ArrowRight
} from "lucide-react";

export default function ParentNotificationsPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [data, setData] = useState<any>(null);
  const [student, setStudent] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [filterCategory, setFilterCategory] = useState<string>("All");
  const [markingAll, setMarkingAll] = useState<boolean>(false);

  const loadNotificationsData = (targetId?: string) => {
    const studentId = targetId || getLoggedInStudentId();
    if (!studentId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const url = `/api/parent/notifications?studentId=${studentId}`;

    fetch(url)
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          setData(json);
          if (json.student && json.student.name !== "Student") {
            setStudent(json.student);
          }
        }
      })
      .catch((err) => console.error("Error fetching parent notifications API:", err))
      .finally(() => setLoading(false));

    StudentApi.getProfile(studentId).then((res) => {
      if (res && (res.status === "success" || res.success)) {
        const p = res.profile || res.student;
        if (p && p.name) {
          setStudent(p);
        }
      }
    });
  };

  useEffect(() => {
    loadNotificationsData();

    const handleChildChanged = (e: any) => {
      if (e.detail) {
        loadNotificationsData(e.detail);
      }
    };

    window.addEventListener("parent_child_changed", handleChildChanged);
    return () => {
      window.removeEventListener("parent_child_changed", handleChildChanged);
    };
  }, []);

  const markNotificationRead = (notifId: string) => {
    const studentId = getLoggedInStudentId();
    // Optimistic UI update
    setData((prev: any) => {
      if (!prev || !Array.isArray(prev.notifications)) return prev;
      return {
        ...prev,
        notifications: prev.notifications.map((n: NotificationItem) =>
          n.id === notifId ? { ...n, read: true } : n
        ),
      };
    });

    fetch("/api/parent/notifications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "mark-read",
        notifId,
        studentId,
      }),
    }).catch((err) => console.error("Failed to mark notification read:", err));
  };

  const markAllNotificationsRead = () => {
    const studentId = getLoggedInStudentId();
    setMarkingAll(true);
    // Optimistic UI update
    setData((prev: any) => {
      if (!prev || !Array.isArray(prev.notifications)) return prev;
      return {
        ...prev,
        notifications: prev.notifications.map((n: NotificationItem) => ({ ...n, read: true })),
      };
    });

    fetch("/api/parent/notifications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "mark-all-read",
        studentId,
      }),
    })
      .catch((err) => console.error("Failed to mark all notifications read:", err))
      .finally(() => setMarkingAll(false));
  };

  if (loading || !data) {
    return <NotificationsPageSkeleton />;
  }

  const { notifications } = data;
  const studentName = student?.name || data?.student?.name || "Student";
  const notifList = Array.isArray(notifications) ? notifications : [];
  const unreadCount = notifList.filter((n: NotificationItem) => !n.read).length;

  const filteredNotifications = notifList.filter((item: NotificationItem) => {
    if (filterCategory === "All") return true;
    return item.category === filterCategory;
  });

  const getIcon = (category: string) => {
    switch (category) {
      case "Class":
      case "Academic":
        return <Calendar size={20} className={styles.classIcon} />;
      case "Attendance":
        return <ClipboardCheck size={20} className={styles.attendanceIcon} />;
      case "Assessment":
        return <Award size={20} className={styles.assessmentIcon} />;
      case "Assignment":
        return <FileText size={20} className={styles.assignmentIcon} />;
      case "Fees":
        return <CreditCard size={20} className={styles.feesIcon} />;
      default:
        return <Megaphone size={20} className={styles.generalIcon} />;
    }
  };

  return (
    <div className={styles.container}>
      {/* Header & Filter Controls */}
      <section
        className={`${styles.headerCard} ${
          isDark ? styles.headerCardDark : ""
        }`}
      >
        <div>
          <h1 className={styles.title}>Parent Notifications</h1>
          <p className={styles.subtitle}>
            Real-time updates, evaluations, assignments, attendance, and announcements for{" "}
            <strong>{studentName}</strong>
          </p>
        </div>

        {unreadCount > 0 && (
          <div className={styles.headerActions}>
            <button
              onClick={markAllNotificationsRead}
              disabled={markingAll}
              className={styles.markAllBtn}
              title="Mark all notifications as read"
            >
              <CheckCheck size={14} />
              <span>Mark all as read</span>
            </button>
          </div>
        )}
      </section>

      {/* Category Filter Controls */}
      <div className={styles.filterBar}>
        {["All", "Assessment", "Attendance", "Assignment", "Class", "Fees", "General"].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`${styles.filterBtn} ${
              filterCategory === cat ? styles.filterBtnActive : ""
            }`}
          >
            {cat === "All" ? "All Updates" : `${cat}s`}
          </button>
        ))}
      </div>

      {/* Category Notification Feed or Empty State Card */}
      {filteredNotifications.length === 0 ? (
        <div
          className={`${styles.headerCard} ${isDark ? styles.headerCardDark : ""}`}
          style={{
            width: "100%",
            justifyContent: "center",
            marginTop: "16px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              width: "100%",
              padding: "48px 16px",
            }}
          >
            <Bell size={36} opacity={0.6} style={{ marginBottom: "8px" }} />
            <span style={{ fontSize: "15px", fontWeight: 500, color: "var(--text-muted, #94a3b8)", textAlign: "center" }}>
              No notifications available
            </span>
          </div>
        </div>
      ) : (
        <div className={styles.notifList}>
          {filteredNotifications.map((item: NotificationItem) => (
            <div
              key={item.id}
              onClick={() => {
                if (!item.read) markNotificationRead(item.id);
              }}
              className={`${styles.notifCard} ${
                isDark ? styles.notifCardDark : ""
              } ${!item.read ? styles.unreadCard : ""}`}
            >
              <div className={styles.iconWrap}>{getIcon(item.category)}</div>

              <div className={styles.content}>
                <div className={styles.notifHeader}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    {!item.read && <span className={styles.unreadDot} title="Unread notification" />}
                    <h3 className={styles.notifTitle}>{item.title}</h3>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    {item.student_name && item.student_name !== studentName && (
                      <span className={styles.studentBadge}>For: {item.student_name}</span>
                    )}
                    <span className={styles.categoryTag}>{item.category}</span>
                  </div>
                </div>
                <p className={styles.notifMessage}>{item.message}</p>
                <div className={styles.notifFooter}>
                  <div className={styles.notifTime}>{item.date}</div>
                  {item.action_url && (
                    <Link
                      href={item.action_url}
                      className={styles.actionLink}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!item.read) markNotificationRead(item.id);
                      }}
                    >
                      <span>{item.action_label || "View Details"}</span>
                      <ArrowRight size={12} />
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
