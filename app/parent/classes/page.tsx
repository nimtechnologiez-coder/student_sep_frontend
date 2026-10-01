"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "@/components/ThemeProvider";
import ClassCard from "@/components/parent/ClassCard";
import styles from "@/styles/parent/classes.module.css";
import { ClassSession } from "@/lib/parentData";
import { CalendarCheck } from "lucide-react";

export default function ParentClassesPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [classes, setClasses] = useState<ClassSession[]>([]);
  const [student, setStudent] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetch("/api/parent/classes")
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          setClasses(json.classes);
          setStudent(json.student);
        }
      })
      .catch((err) => console.error("Error fetching parent classes API:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={`${styles.headerCard} ${isDark ? styles.headerCardDark : ""}`}>
          <p>Loading Upcoming Classes from API...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <section
        className={`${styles.headerCard} ${
          isDark ? styles.headerCardDark : ""
        }`}
      >
        <div>
          <h1 className={styles.title}>Live Class Schedule</h1>
          <p className={styles.subtitle}>
            Upcoming live sessions &amp; interactive workshops scheduled for{" "}
            <strong>{student?.name || "Arjun Kumar"}</strong> ({student?.batch || "AI Cohort 2026"})
          </p>
        </div>
      </section>

      {/* Grid of Class Cards */}
      <div className={styles.classesGrid}>
        {classes.map((cls) => (
          <ClassCard
            key={cls.id}
            topic={cls.topic}
            module={cls.module}
            date={cls.date}
            time={cls.time}
            mentor={cls.mentor}
            meetingLink={cls.meetingLink}
          />
        ))}
      </div>
    </div>
  );
}
