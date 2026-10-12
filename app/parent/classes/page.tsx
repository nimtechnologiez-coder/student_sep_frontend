"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "@/components/ThemeProvider";
import ClassCard from "@/components/parent/ClassCard";
import styles from "@/styles/parent/classes.module.css";
import { ClassSession } from "@/lib/parentData";
import { getLoggedInStudentId, StudentApi } from "@/lib/studentApi";
import { ClassesPageSkeleton } from "@/components/Skeleton";
import { CalendarCheck } from "lucide-react";

export default function ParentClassesPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [classes, setClasses] = useState<ClassSession[]>([]);
  const [student, setStudent] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const loadClassesData = (targetId?: string) => {
    const studentId = targetId || getLoggedInStudentId();
    if (!studentId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const url = `/api/parent/classes?studentId=${studentId}`;

    fetch(url)
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          setClasses(json.classes || []);
          if (json.student && json.student.name !== "Student") {
            setStudent(json.student);
          }
        }
      })
      .catch((err) => console.error("Error fetching parent classes API:", err))
      .finally(() => setLoading(false));

    StudentApi.getProfile(studentId).then((res) => {
      if (res && (res.status === "success" || res.success)) {
        const p = res.profile || res.student;
        if (p && p.name) {
          setStudent({
            name: p.name,
            batch: p.batch || "Assigned Batch",
          });
        }
      }
    });
  };

  useEffect(() => {
    loadClassesData();

    const handleChildChanged = (e: any) => {
      if (e.detail) {
        loadClassesData(e.detail);
      }
    };

    window.addEventListener("parent_child_changed", handleChildChanged);
    return () => {
      window.removeEventListener("parent_child_changed", handleChildChanged);
    };
  }, []);

  if (loading) {
    return <ClassesPageSkeleton />;
  }

  const studentName = student?.name || "Student";
  const batchName = student?.batch || "Assigned Batch";

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
            <strong>{studentName}</strong> ({batchName})
          </p>
        </div>
      </section>

      {/* Grid of Class Cards or Empty State Card */}
      {!classes || classes.length === 0 ? (
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
            <CalendarCheck size={36} opacity={0.6} style={{ marginBottom: "8px" }} />
            <span style={{ fontSize: "15px", fontWeight: 500, color: "var(--text-muted, #94a3b8)", textAlign: "center" }}>
              No classes available
            </span>
          </div>
        </div>
      ) : (
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
      )}
    </div>
  );
}
