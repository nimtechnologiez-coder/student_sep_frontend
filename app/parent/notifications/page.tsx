"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "@/components/ThemeProvider";
import styles from "@/styles/parent/notifications.module.css";
import { NotificationItem } from "@/lib/parentData";
import { getLoggedInStudentId, StudentApi } from "@/lib/studentApi";
import { Calendar, ClipboardCheck, Award, Megaphone, Bell } from "lucide-react";

export default function ParentNotificationsPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [data, setData] = useState<any>(null);
  const [student, setStudent] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [filterCategory, setFilterCategory] = useState<string>("All");

  useEffect(() => {
    const studentId = getLoggedInStudentId();
    const url = studentId ? `/api/parent/notifications?studentId=${studentId}` : "/api/parent/notifications";

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
  }, []);

  if (loading || !data) {
    return (
      <div className={styles.container}>
        <div className={`${styles.headerCard} ${isDark ? styles.headerCardDark : ""}`}>
          <p>Loading Notifications from API...</p>
        </div>
      </div>
    );
  }

  const { notifications } = data;
  const studentName = student?.name || data?.student?.name || "Student";
  const notifList = Array.isArray(notifications) ? notifications : [];

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
          <p style={{ fontSize: "12px", color: "#64748b", margin: "4px 0 0 0" }}>
            Real-time class, attendance, assessment and fee announcements for{" "}
            <strong>{studentName}</strong>
          </p>
        </div>
      </section>

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
              className={`${styles.notifCard} ${
                isDark ? styles.notifCardDark : ""
              }`}
            >
              <div className={styles.iconWrap}>{getIcon(item.category)}</div>

              <div className={styles.content}>
                <div className={styles.notifHeader}>
                  <h3 className={styles.notifTitle}>{item.title}</h3>
                  <span className={styles.categoryTag}>{item.category}</span>
                </div>
                <p className={styles.notifMessage}>{item.message}</p>
                <div className={styles.notifTime}>{item.date}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
