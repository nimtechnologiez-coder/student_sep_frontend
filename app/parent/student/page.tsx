"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useTheme } from "@/components/ThemeProvider";
import styles from "@/styles/parent/student.module.css";
import { getLoggedInStudentId } from "@/lib/studentApi";
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

  useEffect(() => {
    const studentId = getLoggedInStudentId();
    const url = studentId ? `/api/parent/student?studentId=${studentId}` : "/api/parent/student";

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
  }, []);

  if (loading || !student) {
    return (
      <div className={styles.container}>
        <div className={`${styles.infoCard} ${isDark ? styles.infoCardDark : ""}`}>
          <p>Loading Linked Student Profile from API...</p>
        </div>
      </div>
    );
  }

  const rawPName = parent?.name || student?.parent_name || student?.parent_guardian_name || student?.guardian_name;
  const parentName = (rawPName && typeof rawPName === "string" && !rawPName.startsWith("P_") && rawPName !== student?.parent_username)
    ? rawPName
    : (student?.name ? `Parent of ${student.name}` : "N/A");
  const parentEmail = (parent?.email && parent.email !== "N/A") ? parent.email : (student?.email || "N/A");
  const parentPhone = (parent?.phone && parent.phone !== "N/A") ? parent.phone : (student?.phone || "N/A");

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
              <span className={styles.detailValue}>{student.mentor || "Unassigned"}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Mentor Designation</span>
              <span className={styles.detailValue}>{student.mentorRole || "Mentor"}</span>
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
