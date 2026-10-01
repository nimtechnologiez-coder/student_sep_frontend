"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "@/components/ThemeProvider";
import styles from "@/styles/parent/notifications.module.css";
import { NotificationItem } from "@/lib/parentData";
import { Bell, Calendar, ClipboardCheck, Award, Megaphone } from "lucide-react";

export default function ParentNotificationsPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [filterCategory, setFilterCategory] = useState<string>("All");

  useEffect(() => {
    fetch("/api/parent/notifications")
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          setData(json);
        }
      })
      .catch((err) => console.error("Error fetching parent notifications API:", err))
      .finally(() => setLoading(false));
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

  const { student, notifications } = data;

  const filteredNotifications = notifications.filter((item: NotificationItem) => {
    if (filterCategory === "All") return true;
    return item.category === filterCategory;
  });

  const getIcon = (category: string) => {
    switch (category) {
      case "Class":
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
            <strong>{student.name}</strong>
          </p>
        </div>
      </section>

      {/* Category Notification Feed */}
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
    </div>
  );
}
