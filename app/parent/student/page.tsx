"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useTheme } from "@/components/ThemeProvider";
import styles from "@/styles/parent/student.module.css";
import {
  User,
  Mail,
  Phone,
  BookOpen,
  Users,
  ShieldCheck,
  Calendar,
  Award,
} from "lucide-react";

export default function StudentProfilePage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [student, setStudent] = useState<any>(null);
  const [parent, setParent] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetch("/api/parent/student")
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

  return (
    <div className={styles.container}>
      {/* Student Hero Banner */}
      <section
        className={`${styles.profileHeroCard} ${
          isDark ? styles.profileHeroCardDark : ""
        }`}
      >
        <div className={styles.photoWrapper}>
          <Image
            src={student.photoUrl}
            alt={student.name}
            width={110}
            height={110}
            className={styles.studentPhoto}
          />
          <span className={styles.statusDot} title="Enrolled &amp; Active" />
        </div>

        <div className={styles.heroDetails}>
          <h1 className={styles.heroName}>{student.name}</h1>
          <p className={styles.heroCourse}>{student.course}</p>
          <div className={styles.badgeRow}>
            <span className={styles.pill}>ID: {student.id}</span>
            <span className={styles.pill}>{student.batch}</span>
            <span className={styles.pill}>Status: {student.enrollmentStatus}</span>
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
              <span className={styles.detailValue}>{student.course}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Batch Name</span>
              <span className={styles.detailValue}>{student.batch}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Assigned Mentor</span>
              <span className={styles.detailValue}>{student.mentor}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Mentor Designation</span>
              <span className={styles.detailValue}>{student.mentorRole}</span>
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
              <span className={styles.detailValue}>{student.email}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Phone Number</span>
              <span className={styles.detailValue}>{student.phone}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Joining Date</span>
              <span className={styles.detailValue}>{student.joiningDate}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Expected Completion</span>
              <span className={styles.detailValue}>{student.expectedGraduation}</span>
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
              <span className={styles.detailValue}>{parent?.name || "Ramesh Kumar"}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Relationship</span>
              <span className={styles.detailValue}>{parent?.relation || "Father"}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Parent Email</span>
              <span className={styles.detailValue}>{parent?.email || "ramesh.kumar@example.com"}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Emergency Contact</span>
              <span className={styles.detailValue}>{parent?.phone || "+91 98123 45678"}</span>
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
              <span className={styles.detailValue}>{student.enrollmentStatus}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Attendance Standing</span>
              <span className={styles.detailValue}>{student.attendancePercentage}% (Excellent)</span>
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
