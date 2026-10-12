"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useTheme } from "@/components/ThemeProvider";
import styles from "@/styles/parent/student.module.css";
import { getLoggedInStudentId } from "@/lib/studentApi";
import { ParentChildProfileSkeleton } from "@/components/Skeleton";
import {
  Mail,
  BookOpen,
  Users,
  ShieldCheck,
} from "lucide-react";

export default function StudentProfilePage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [student, setStudent] = useState<any>(null);
  const [parent, setParent] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const loadStudentData = (targetId?: string) => {
    const studentId = targetId || getLoggedInStudentId();
    if (!studentId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const url = `/api/parent/student?studentId=${studentId}`;

    fetch(url)
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          setStudent(json.student);
          setParent(json.parent);
        }
      })
      .catch((err) => console.error("Error fetching student profile API:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadStudentData();

    const handleChildChanged = (e: any) => {
      if (e.detail) {
        loadStudentData(e.detail);
      }
    };

    window.addEventListener("parent_child_changed", handleChildChanged);
    return () => {
      window.removeEventListener("parent_child_changed", handleChildChanged);
    };
  }, []);

  if (loading || !student) {
    return <ParentChildProfileSkeleton />;
  }

  const rawPName = parent?.name || student?.parent_name || student?.parent_guardian_name || student?.guardian_name || student?.parent_username;
  let parentName = "Parent / Guardian";
  if (rawPName && typeof rawPName === "string") {
    let clean = rawPName.trim();
    if (clean.toLowerCase().startsWith("p_")) {
      clean = clean.slice(2).trim();
    }
    if (clean && clean.toLowerCase() !== "parent" && clean.toLowerCase() !== "n/a" && !clean.toLowerCase().startsWith("parent of")) {
      parentName = clean
        .split(/\s+/)
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(" ");
    } else if (student?.name) {
      parentName = `Parent of ${student.name}`;
    }
  } else if (student?.name) {
    parentName = `Parent of ${student.name}`;
  }
  const parentEmail = (parent?.email && parent.email !== "N/A") ? parent.email : (student?.email || "N/A");
  const parentPhone = (parent?.phone && parent.phone !== "N/A") ? parent.phone : (student?.phone || "N/A");

  const rawMentor = student?.mentor;
  const mentorName = typeof rawMentor === "object" && rawMentor !== null
    ? (rawMentor.name || "Unassigned")
    : (typeof rawMentor === "string" ? rawMentor : "Unassigned");
  const mentorRole = typeof rawMentor === "object" && rawMentor !== null
    ? (rawMentor.role || student?.mentorRole || "Mentor")
    : (typeof student?.mentorRole === "string" ? student.mentorRole : "Mentor");

  return (
    <div className={styles.container}>
      {/* Student Hero Banner */}
      <section
        className={`${styles.profileHeroCard} ${
          isDark ? styles.profileHeroCardDark : ""
        }`}
      >
        <div className={styles.photoWrapper}>
          {student.photoUrl && (
            <Image
              src={student.photoUrl}
              alt={student.name || "Student"}
              width={110}
              height={110}
              className={styles.studentPhoto}
            />
          )}
          <span className={styles.statusDot} title="Enrolled &amp; Active" />
        </div>

        <div className={styles.heroDetails}>
          <h1 className={styles.heroName}>{student.name || "Student"}</h1>
          <p className={styles.heroCourse}>{student.course || "Enrolled Course"}</p>
          <div className={styles.badgeRow}>
            <span className={styles.pill}>ID: {student.id}</span>
            <span className={styles.pill}>{student.batch || "Batch"}</span>
            <span className={styles.pill}>Status: {student.enrollmentStatus || "Active"}</span>
          </div>
        </div>
      </section>

      {/* Grid of Profile Details */}
      <div className={styles.grid}>
        {/* Academic Details */}
        <div
          className={`${styles.infoCard} ${isDark ? styles.infoCardDark : ""}`}
        >
          <div className={styles.cardHeader}>
            <BookOpen className={styles.cardIcon} />
            <h3 className={styles.cardTitle}>Academic Information</h3>
          </div>
          <div className={styles.detailList}>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Course Enrolled</span>
              <span className={styles.detailValue}>{student.course || "N/A"}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Batch Name</span>
              <span className={styles.detailValue}>{student.batch || "N/A"}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Assigned Mentor</span>
              <span className={styles.detailValue}>{mentorName}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Mentor Designation</span>
              <span className={styles.detailValue}>{mentorRole}</span>
            </div>
          </div>
        </div>

        {/* Contact Details */}
        <div
          className={`${styles.infoCard} ${isDark ? styles.infoCardDark : ""}`}
        >
          <div className={styles.cardHeader}>
            <Mail className={styles.cardIcon} />
            <h3 className={styles.cardTitle}>Student Contact Information</h3>
          </div>
          <div className={styles.detailList}>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Student Email</span>
              <span className={styles.detailValue}>{student.email || "N/A"}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Phone Number</span>
              <span className={styles.detailValue}>{student.phone || "N/A"}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Joining Date</span>
              <span className={styles.detailValue}>{student.joiningDate || "N/A"}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Expected Completion</span>
              <span className={styles.detailValue}>{student.expectedGraduation || "N/A"}</span>
            </div>
          </div>
        </div>

        {/* Linked Parent Information */}
        <div
          className={`${styles.infoCard} ${isDark ? styles.infoCardDark : ""}`}
        >
          <div className={styles.cardHeader}>
            <Users className={styles.cardIcon} />
            <h3 className={styles.cardTitle}>Linked Parent / Guardian</h3>
          </div>
          <div className={styles.detailList}>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Parent Name</span>
              <span className={styles.detailValue}>{parentName}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Relationship</span>
              <span className={styles.detailValue}>{parent?.relation || "Parent / Guardian"}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Parent Email</span>
              <span className={styles.detailValue}>{parentEmail}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Emergency Contact</span>
              <span className={styles.detailValue}>{parentPhone}</span>
            </div>
          </div>
        </div>

        {/* Enrollment & Attendance Standing */}
        <div
          className={`${styles.infoCard} ${isDark ? styles.infoCardDark : ""}`}
        >
          <div className={styles.cardHeader}>
            <ShieldCheck className={styles.cardIcon} />
            <h3 className={styles.cardTitle}>Enrollment &amp; Standing</h3>
          </div>
          <div className={styles.detailList}>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Enrollment Status</span>
              <span className={styles.detailValue}>{student.enrollmentStatus || "Active"}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Attendance Standing</span>
              <span className={styles.detailValue}>{student.attendancePercentage || 0}%</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Portal Access</span>
              <span className={styles.detailValue}>Granted &amp; Verified</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
