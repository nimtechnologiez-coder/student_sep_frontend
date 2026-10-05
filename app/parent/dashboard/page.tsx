"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useTheme } from "@/components/ThemeProvider";
import StatCard from "@/components/parent/StatCard";
import ClassCard from "@/components/parent/ClassCard";
import AssessmentTable from "@/components/parent/AssessmentTable";
import styles from "@/styles/parent/dashboard.module.css";
import { getLoggedInStudentId, StudentApi } from "@/lib/studentApi";
import {
  Calendar,
  BookOpen,
  Award,
  CreditCard,
  User,
  Clock,
  Bell,
} from "lucide-react";

export default function ParentDashboardPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [data, setData] = useState<any>(null);
  const [student, setStudent] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const studentId = getLoggedInStudentId();
    const url = studentId ? `/api/parent/dashboard?studentId=${studentId}` : "/api/parent/dashboard";
    
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
      .catch((err) => console.error("Error fetching parent dashboard API:", err))
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
        <div className={`${styles.card} ${isDark ? styles.cardDark : ""}`}>
          <p>Loading Parent Dashboard Data from API...</p>
        </div>
      </div>
    );
  }

  const { attendanceSummary, upcomingClasses, recentAssessments, recentNotifications, feeSummary } = data;
  const studentName = student?.name || data?.student?.name || "Student";
  const batchName = student?.batch || data?.student?.batch || "Assigned Batch";
  const courseName = student?.course || data?.student?.course || "Generative AI & LLMs";
  const mentorName = student?.mentor || data?.student?.mentor || "Unassigned";

  const latestAssessment = recentAssessments && recentAssessments.length > 0 ? recentAssessments[0] : null;
  const latestScoreVal = latestAssessment ? latestAssessment.score : "N/A";
  const latestScoreSub = latestAssessment ? `${latestAssessment.name} (${latestAssessment.status})` : "No evaluation recorded yet";

  return (
    <div className={styles.container}>
      {/* Welcome Header */}
      <section className={styles.welcomeCard}>
        <div className={styles.welcomeGlow} />
        <div className={styles.welcomeGrid}>
          <div>
            <span className={styles.badgePill}>
              Linked Student Dashboard • {batchName}
            </span>
            <h1 className={styles.welcomeTitle}>
              Welcome back, Parent of {studentName}
            </h1>
            <p className={styles.welcomeSubtitle}>
              Course: <strong>{courseName}</strong>
            </p>
            <div className={styles.metaRow}>
              <div className={styles.metaItem}>
                <User size={14} />
                <span>Mentor: <strong>{mentorName}</strong> ({student?.mentorRole || "Mentor"})</span>
              </div>
              <div className={styles.metaItem}>
                <Clock size={14} />
                <span>Enrollment Status: <strong>{student?.enrollmentStatus || "Active"}</strong></span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* KPI Stats Grid */}
      <section className={styles.statsGrid}>
        <StatCard
          title="Attendance Rate"
          value={`${attendanceSummary?.percentage || 0}%`}
          subtext={`${attendanceSummary?.presentCount || 0} present out of ${attendanceSummary?.totalClasses || 0} sessions`}
          badge={attendanceSummary?.percentage >= 85 ? "On Track" : "Needs Attention"}
          badgeType={attendanceSummary?.percentage >= 85 ? "success" : "warning"}
          icon={Calendar}
          iconColor="green"
          progressPercentage={attendanceSummary?.percentage || 0}
        />
        <StatCard
          title="Curriculum Status"
          value="Active"
          subtext={`Course: ${courseName}`}
          badge="Enrolled"
          badgeType="info"
          icon={BookOpen}
          iconColor="blue"
        />
        <StatCard
          title="Latest Evaluation Score"
          value={latestScoreVal}
          subtext={latestScoreSub}
          badge={latestAssessment ? latestAssessment.status : "Pending"}
          badgeType={latestAssessment?.status === "Passed" ? "success" : "warning"}
          icon={Award}
          iconColor="purple"
        />
        <StatCard
          title="Pending Tuition Fee"
          value={`₹${(feeSummary?.pendingAmount || 0).toLocaleString()}`}
          subtext={`Due date: ${feeSummary?.dueDate || "N/A"}`}
          badge={feeSummary?.pendingAmount > 0 ? "Due Soon" : "Cleared"}
          badgeType={feeSummary?.pendingAmount > 0 ? "warning" : "success"}
          icon={CreditCard}
          iconColor="amber"
        />
      </section>

      {/* Main Section Grid */}
      <div className={styles.sectionGrid}>
        {/* Left Column: Upcoming Classes & Recent Assessments */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* Upcoming Classes Card */}
          <div className={`${styles.card} ${isDark ? styles.cardDark : ""}`}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Upcoming Live Classes</h2>
              <Link href="/parent/classes" className={styles.viewAllLink}>
                View All &rarr;
              </Link>
            </div>
            {!upcomingClasses || upcomingClasses.length === 0 ? (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", width: "100%", padding: "32px 16px", color: "var(--text-muted, #94a3b8)", gap: "8px" }}>
                <Calendar size={32} opacity={0.6} />
                <span style={{ fontSize: "14px", fontWeight: 500, textAlign: "center" }}>No classes available</span>
              </div>
            ) : (
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
            )}
          </div>

          {/* Recent Assessments Card */}
          <div className={`${styles.card} ${isDark ? styles.cardDark : ""}`}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Recent Assessments &amp; Feedback</h2>
              <Link href="/parent/assessments" className={styles.viewAllLink}>
                View Full Scorecard &rarr;
              </Link>
            </div>
            <AssessmentTable assessments={recentAssessments || []} />
          </div>
        </div>

        {/* Right Column: Recent Notifications Feed Card */}
        <div>
          <div className={`${styles.card} ${isDark ? styles.cardDark : ""}`}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Parent Notifications</h2>
              <Link href="/parent/notifications" className={styles.viewAllLink}>
                All Updates
              </Link>
            </div>
            {!recentNotifications || recentNotifications.length === 0 ? (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", width: "100%", padding: "32px 16px", color: "var(--text-muted, #94a3b8)", gap: "8px" }}>
                <Bell size={32} opacity={0.6} />
                <span style={{ fontSize: "14px", fontWeight: 500, textAlign: "center" }}>No notifications available</span>
              </div>
            ) : (
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
