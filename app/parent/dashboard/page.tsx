"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useTheme } from "@/components/ThemeProvider";
import StatCard from "@/components/parent/StatCard";
import ClassCard from "@/components/parent/ClassCard";
import AssessmentTable from "@/components/parent/AssessmentTable";
import styles from "@/styles/parent/dashboard.module.css";
import {
  Calendar,
  BookOpen,
  Award,
  CreditCard,
  User,
  Clock,
  Bell,
  ArrowRight,
} from "lucide-react";

export default function ParentDashboardPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetch("/api/parent/dashboard")
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          setData(json);
        }
      })
      .catch((err) => console.error("Error fetching parent dashboard API:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading || !data) {
    return (
      <div className={styles.container}>
        <div className={`${styles.card} ${isDark ? styles.cardDark : ""}`}>
          <p>Loading Parent Dashboard Data from API...</p>
        </div>
      </div>
    );
  }

  const { student, attendanceSummary, upcomingClasses, recentAssessments, recentNotifications, feeSummary } = data;

  return (
    <div className={styles.container}>
      {/* Welcome Header */}
      <section className={styles.welcomeCard}>
        <div className={styles.welcomeGlow} />
        <div className={styles.welcomeGrid}>
          <div>
            <span className={styles.badgePill}>
              Linked Student Dashboard • {student.batch}
            </span>
            <h1 className={styles.welcomeTitle}>
              Welcome back, Parent of {student.name}
            </h1>
            <p className={styles.welcomeSubtitle}>
              Course: <strong>{student.course}</strong>
            </p>
            <div className={styles.metaRow}>
              <div className={styles.metaItem}>
                <User size={14} />
                <span>Mentor: <strong>{student.mentor}</strong> ({student.mentorRole})</span>
              </div>
              <div className={styles.metaItem}>
                <Clock size={14} />
                <span>Enrollment Status: <strong>{student.enrollmentStatus}</strong></span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* KPI Stats Grid */}
      <section className={styles.statsGrid}>
        <StatCard
          title="Attendance Rate"
          value={`${attendanceSummary.percentage}%`}
          subtext={`${attendanceSummary.presentCount} present out of ${attendanceSummary.totalClasses} sessions`}
          badge="On Track"
          badgeType="success"
          icon={Calendar}
          iconColor="green"
          progressPercentage={attendanceSummary.percentage}
        />
        <StatCard
          title="Curriculum Progress"
          value="75%"
          subtext="Module 3: Generative AI & LLMs"
          badge="Active"
          badgeType="info"
          icon={BookOpen}
          iconColor="blue"
          progressPercentage={75}
        />
        <StatCard
          title="Latest Evaluation Score"
          value="92%"
          subtext="Lab Assignment 3 (Passed)"
          badge="Top Performer"
          badgeType="success"
          icon={Award}
          iconColor="purple"
          progressPercentage={92}
        />
        <StatCard
          title="Pending Tuition Fee"
          value={`₹${feeSummary.pendingAmount.toLocaleString()}`}
          subtext={`Due date: ${feeSummary.dueDate}`}
          badge="Due Soon"
          badgeType="warning"
          icon={CreditCard}
          iconColor="amber"
          progressPercentage={83}
        />
      </section>

      {/* Main Section Grid */}
      <div className={styles.sectionGrid}>
        {/* Left Column: Upcoming Classes & Recent Assessments */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* Upcoming Classes */}
          <div className={`${styles.card} ${isDark ? styles.cardDark : ""}`}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Upcoming Live Classes</h2>
              <Link href="/parent/classes" className={styles.viewAllLink}>
                View All &rarr;
              </Link>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {upcomingClasses.map((cls: any) => (
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

          {/* Recent Assessments */}
          <div className={`${styles.card} ${isDark ? styles.cardDark : ""}`}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Recent Assessments &amp; Feedback</h2>
              <Link href="/parent/assessments" className={styles.viewAllLink}>
                View Full Scorecard &rarr;
              </Link>
            </div>
            <AssessmentTable assessments={recentAssessments} />
          </div>
        </div>

        {/* Right Column: Recent Notifications Feed */}
        <div>
          <div className={`${styles.card} ${isDark ? styles.cardDark : ""}`}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Parent Notifications</h2>
              <Link href="/parent/notifications" className={styles.viewAllLink}>
                All Updates
              </Link>
            </div>
            <div className={styles.notificationsList}>
              {recentNotifications.map((notif: any) => (
                <div key={notif.id} className={styles.notifItem}>
                  <div className={styles.notifIcon}>
                    <Bell size={16} />
                  </div>
                  <div className={styles.notifContent}>
                    <h4 className={styles.notifTitle}>{notif.title}</h4>
                    <p className={styles.notifDesc}>{notif.message}</p>
                    <div className={styles.notifDate}>{notif.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
