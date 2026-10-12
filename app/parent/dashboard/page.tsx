"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useTheme } from "@/components/ThemeProvider";
import StatCard from "@/components/parent/StatCard";
import ClassCard from "@/components/parent/ClassCard";
import AssessmentTable from "@/components/parent/AssessmentTable";
import styles from "@/styles/parent/dashboard.module.css";
import { getLoggedInStudentId, StudentApi } from "@/lib/studentApi";
import { ParentDashboardSkeleton } from "@/components/Skeleton";
import { isClassUpcomingOrLive, sortClassesAscending } from "@/lib/parentData";
import {
  Calendar,
  BookOpen,
  Award,
  CreditCard,
  User,
  Clock,
  Bell,
  ChevronRight,
  CheckCircle2,
  CalendarCheck,
  Compass,
  AlertCircle,
  Megaphone,
} from "lucide-react";

export default function ParentDashboardPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [data, setData] = useState<any>(null);
  const [student, setStudent] = useState<any>(null);
  const [curriculum, setCurriculum] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const loadDashboardData = (targetId?: string) => {
    const studentId =
      targetId ||
      getLoggedInStudentId() ||
      (typeof window !== "undefined" ? localStorage.getItem("parent_selected_child_id") || "STU-001" : "STU-001");
    setLoading(true);

    // 1. Fetch main Parent Dashboard Data
    fetch(`/api/parent/dashboard?studentId=${studentId}`)
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

    // 2. Fetch Student Profile for direct metadata
    StudentApi.getProfile(studentId).then((res) => {
      if (res && (res.status === "success" || res.success)) {
        const p = res.profile || res.student;
        if (p && p.name) {
          setStudent(p);
        }
      }
    });

    // 3. Fetch Curriculum Data for roadmap progress
    fetch(`/api/parent/curriculum?studentId=${studentId}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.curriculum) {
          setCurriculum(json.curriculum);
        }
      })
      .catch((err) => console.error("Error fetching curriculum API:", err));
  };

  useEffect(() => {
    loadDashboardData();

    const handleChildChanged = (e: any) => {
      if (e.detail) {
        loadDashboardData(e.detail);
      }
    };

    window.addEventListener("parent_child_changed", handleChildChanged);
    return () => {
      window.removeEventListener("parent_child_changed", handleChildChanged);
    };
  }, []);

  if (loading || !data) {
    return <ParentDashboardSkeleton />;
  }

  const { attendanceSummary, upcomingClasses, recentAssessments, recentNotifications, feeSummary } = data;

  const studentName = student?.name || data?.student?.name || "Student";
  const studentId = student?.id || student?.student_id || data?.student?.id || "N/A";
  const batchName = student?.batch || data?.student?.batch || "Assigned Batch";
  const courseName = student?.course || data?.student?.course || "Generative AI & LLMs";
  const enrollmentStatus = student?.enrollmentStatus || student?.status || data?.student?.enrollmentStatus || "Active";

  // Safe string conversion for Mentor info to prevent React child object rendering errors
  const rawMentor = student?.mentor || data?.student?.mentor;
  const mentorName = typeof rawMentor === "object" && rawMentor !== null
    ? (rawMentor.name || "Unassigned")
    : (typeof rawMentor === "string" ? rawMentor : "Unassigned");
  const mentorRole = typeof rawMentor === "object" && rawMentor !== null
    ? (rawMentor.role || student?.mentorRole || "Mentor")
    : (typeof student?.mentorRole === "string" ? student.mentorRole : "Mentor");

  // Attendance Metrics
  const totalClasses = attendanceSummary?.totalClasses || 0;
  const presentCount = attendanceSummary?.presentCount || 0;
  const absentCount = attendanceSummary?.absentCount || 0;
  const attendancePercentage = attendanceSummary?.percentage || 0;

  // Resolve Logged-in Parent Name
  const rawParent =
    student?.guardian_name ||
    student?.parent_name ||
    student?.parent_guardian_name ||
    data?.parent?.name ||
    data?.student?.guardian_name ||
    data?.student?.parent_name ||
    student?.parent_username;

  let parentDisplayName = "Parent";
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem("userData");
      if (stored) {
        const parsed = JSON.parse(stored);
        const storedParent =
          parsed.guardian_name ||
          parsed.parent_name ||
          parsed.parent_guardian_name ||
          parsed.parentName ||
          parsed.parent_username;
        if (storedParent && typeof storedParent === "string" && storedParent.trim()) {
          let clean = storedParent.trim();
          if (clean.toLowerCase().startsWith("p_")) clean = clean.slice(2).trim();
          if (clean && clean.toLowerCase() !== "n/a" && clean.toLowerCase() !== "parent") {
            parentDisplayName = clean
              .split(/\s+/)
              .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
              .join(" ");
          }
        }
      }
    } catch (e) {}
  }

  if (parentDisplayName === "Parent" && rawParent && typeof rawParent === "string" && rawParent.trim()) {
    let clean = rawParent.trim();
    if (clean.toLowerCase().startsWith("p_")) clean = clean.slice(2).trim();
    if (clean && clean.toLowerCase() !== "n/a" && clean.toLowerCase() !== "parent") {
      parentDisplayName = clean
        .split(/\s+/)
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(" ");
    }
  }

  if (parentDisplayName === "Parent" && studentName && studentName !== "Student") {
    parentDisplayName = `Parent of ${studentName}`;
  }

  // Evaluation Metrics
  const latestAssessment = recentAssessments && recentAssessments.length > 0 ? recentAssessments[0] : null;
  const latestScoreVal = latestAssessment ? (latestAssessment.score === "Pending" ? "Pending" : latestAssessment.score) : "Not Evaluated";
  const latestScoreSub = latestAssessment ? latestAssessment.name : "No evaluation recorded yet";
  const latestScoreBadge = latestAssessment
    ? (latestAssessment.status === "Passed" ? "Passed" : (latestAssessment.score === "Pending" ? "In Review" : latestAssessment.status))
    : "Scheduled";
  const latestScoreBadgeType = latestAssessment?.status === "Passed" ? "success" : "warning";
  const latestScorePct = latestAssessment && typeof latestAssessment.score === "string" && latestAssessment.score.includes("%")
    ? parseInt(latestAssessment.score, 10)
    : undefined;

  // Fee Metrics
  const totalFee = feeSummary?.totalFee || 0;
  const paidAmount = feeSummary?.paidAmount || 0;
  const pendingAmount = feeSummary?.pendingAmount || 0;
  const feeClearedPct = totalFee > 0 ? Math.round((paidAmount / totalFee) * 100) : 100;

  // Curriculum Metrics
  const modulesList = Array.isArray(curriculum?.modules) ? curriculum.modules : [];
  const completedModulesCount = modulesList.filter((m: any) => m.status === "Completed").length;
  const totalModulesCount = modulesList.length || 4;
  const curriculumProgressPct = totalModulesCount > 0 ? Math.round((completedModulesCount / totalModulesCount) * 100) : 0;
  const currentModuleStatus = completedModulesCount === totalModulesCount && totalModulesCount > 0 
    ? "Curriculum Completed" 
    : "Active Learning";

  return (
    <div className={styles.container}>
      {/* =========================================================================
          1. Child Details Hero Banner (Gradient Glassmorphism Header)
          ========================================================================= */}
      <section className={`${styles.welcomeCard} ${isDark ? styles.welcomeCardDark : ""}`}>
        <div className={styles.welcomeGlow} />
        <div className={styles.welcomeHeaderContent}>
          <div className={styles.studentHeroProfile}>
            {student?.photoUrl ? (
              <img
                src={student.photoUrl}
                alt={studentName}
                className={styles.heroAvatar}
                onError={(e) => {
                  const target = e.target as HTMLElement;
                  target.style.display = "none";
                }}
              />
            ) : (
              <div className={styles.heroAvatarFallback}>
                {studentName.substring(0, 2).toUpperCase() || "ST"}
              </div>
            )}
            <div className={styles.heroTextGroup}>
              <div className={styles.heroBadgeGroup}>
                <span className={styles.parentBadgePill}>
                  Parent: <strong>{parentDisplayName}</strong>
                </span>
                <span className={styles.badgePill}>
                  Linked Student • {studentId}
                </span>
                <span className={`${styles.statusChip} ${enrollmentStatus === "Active" ? styles.statusActive : styles.statusCompleted}`}>
                  <span className={styles.statusDot} />
                  {enrollmentStatus}
                </span>
              </div>
              <p className={styles.parentGreeting}>
                Welcome back, <strong>{parentDisplayName}</strong> 👋
              </p>
              <h1 className={styles.welcomeTitle}>
                {studentName}
              </h1>
              <p className={styles.welcomeSubtitle}>
                Enrolled Course: <strong>{courseName}</strong> ({batchName})
              </p>
            </div>
          </div>

          <div className={styles.heroRightActions}>
            <div className={styles.mentorBox}>
              <div className={styles.mentorIconWrap}>
                <User size={18} />
              </div>
              <div>
                <p className={styles.mentorLabel}>Assigned Mentor</p>
                <p className={styles.mentorValue}>{mentorName}</p>
                <span className={styles.mentorRoleBadge}>{mentorRole}</span>
              </div>
            </div>

            <Link href="/parent/student" className={styles.profileActionBtn}>
              <span>View Child Profile</span>
              <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================================
          2. Dashboard KPI Statistics Grid (Equal Height & Responsive Alignment)
          ========================================================================= */}
      <section className={styles.statsGrid}>
        <StatCard
          title="Attendance Rate"
          value={`${attendancePercentage}%`}
          subtext={`${presentCount} present of ${totalClasses} sessions`}
          badge={attendancePercentage >= 85 ? "On Track" : (totalClasses === 0 ? "Initial" : "Needs Attention")}
          badgeType={attendancePercentage >= 85 ? "success" : "warning"}
          icon={Calendar}
          iconColor="green"
          progressPercentage={attendancePercentage}
        />
        <StatCard
          title="Curriculum Progress"
          value={modulesList.length > 0 ? `${completedModulesCount} / ${totalModulesCount} Mods` : "Active"}
          subtext={`Course: ${courseName}`}
          badge={curriculumProgressPct >= 100 ? "Completed" : "In Progress"}
          badgeType={curriculumProgressPct >= 100 ? "success" : "info"}
          icon={BookOpen}
          iconColor="blue"
          progressPercentage={curriculumProgressPct}
        />
        <StatCard
          title="Latest Evaluation"
          value={latestScoreVal}
          subtext={latestScoreSub}
          badge={latestScoreBadge}
          badgeType={latestScoreBadgeType}
          icon={Award}
          iconColor="purple"
          progressPercentage={latestScorePct}
        />
        <StatCard
          title="Tuition Fee Dues"
          value={`₹${pendingAmount.toLocaleString()}`}
          subtext={`₹${paidAmount.toLocaleString()} paid of ₹${totalFee.toLocaleString()}`}
          badge={pendingAmount === 0 ? "Fully Paid" : "Balance Due"}
          badgeType={pendingAmount === 0 ? "success" : "warning"}
          icon={CreditCard}
          iconColor="amber"
          progressPercentage={feeClearedPct}
        />
      </section>

      {/* =========================================================================
          3. Main Structured Content Grid (2 Columns: Content & Insights Sidebar)
          ========================================================================= */}
      <div className={styles.mainGrid}>
        {/* Left Column: Attendance Overview, Classes, Assessments */}
        <div className={styles.leftColumn}>
          {/* Card A: Attendance Quick Overview */}
          <div className={`${styles.card} ${isDark ? styles.cardDark : ""}`}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionTitleWrap}>
                <CalendarCheck className={styles.sectionTitleIcon} size={20} />
                <h2 className={styles.sectionTitle}>Attendance Overview</h2>
              </div>
              <Link href="/parent/attendance" className={styles.viewAllLink}>
                Session Logs <span className={styles.linkArrow}>&rarr;</span>
              </Link>
            </div>

            <div className={styles.attendanceMiniGrid}>
              <div className={styles.attendanceStatBox}>
                <p className={styles.miniStatLabel}>Total Sessions</p>
                <h4 className={styles.miniStatValue}>{totalClasses}</h4>
                <span className={styles.miniStatSub}>Conducted</span>
              </div>
              <div className={styles.attendanceStatBox}>
                <p className={styles.miniStatLabel}>Present</p>
                <h4 className={`${styles.miniStatValue} ${styles.statGreen}`}>{presentCount}</h4>
                <span className={styles.miniStatSub}>Attended</span>
              </div>
              <div className={styles.attendanceStatBox}>
                <p className={styles.miniStatLabel}>Absent</p>
                <h4 className={`${styles.miniStatValue} ${styles.statAmber}`}>{absentCount}</h4>
                <span className={styles.miniStatSub}>Recorded</span>
              </div>
            </div>

            <div className={styles.attendanceHealthBar}>
              <div className={styles.healthBarMeta}>
                <span>Attendance Health Target (85% min)</span>
                <strong>{attendancePercentage}% Attended</strong>
              </div>
              <div className={styles.healthTrack}>
                <div
                  className={styles.healthFill}
                  style={{
                    width: `${Math.min(100, Math.max(0, attendancePercentage))}%`,
                    backgroundColor: attendancePercentage >= 85 ? "#10b981" : "#f59e0b",
                  }}
                />
              </div>
            </div>
          </div>

          {/* Card B: Upcoming Live Classes */}
          <div className={`${styles.card} ${isDark ? styles.cardDark : ""}`}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionTitleWrap}>
                <Calendar className={styles.sectionTitleIcon} size={20} />
                <h2 className={styles.sectionTitle}>Upcoming Live Classes</h2>
              </div>
              <Link href="/parent/classes" className={styles.viewAllLink}>
                All Classes <span className={styles.linkArrow}>&rarr;</span>
              </Link>
            </div>

            {(() => {
              const rawList = Array.isArray(upcomingClasses) ? upcomingClasses : [];
              const validUpcoming = sortClassesAscending(rawList.filter(isClassUpcomingOrLive));

              if (validUpcoming.length === 0) {
                return (
                  <div className={styles.emptyStateContainer}>
                    <Calendar size={34} opacity={0.5} />
                    <p className={styles.emptyStateTitle}>No upcoming classes scheduled.</p>
                    <p className={styles.emptyStateDesc}>Upcoming session timings will appear here once announced.</p>
                  </div>
                );
              }

              return (
                <div className={styles.classesList}>
                  {validUpcoming.slice(0, 3).map((cls: any) => {
                    const isToday = (() => {
                      if (!cls.date) return false;
                      const now = new Date();
                      const dStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
                      return cls.date === dStr;
                    })();

                    const displayDate = isToday ? `Today (${cls.date})` : cls.date;

                    return (
                      <ClassCard
                        key={cls.id}
                        topic={cls.topic}
                        module={cls.module}
                        date={displayDate}
                        time={cls.time}
                        mentor={cls.mentor}
                        meetingLink={cls.meetingLink}
                      />
                    );
                  })}
                </div>
              );
            })()}
          </div>

          {/* Card C: Recent Assessments & Academic Feedback */}
          <div className={`${styles.card} ${isDark ? styles.cardDark : ""}`}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionTitleWrap}>
                <Award className={styles.sectionTitleIcon} size={20} />
                <h2 className={styles.sectionTitle}>Recent Academic Evaluations</h2>
              </div>
              <Link href="/parent/assessments" className={styles.viewAllLink}>
                Full Scorecard <span className={styles.linkArrow}>&rarr;</span>
              </Link>
            </div>

            <AssessmentTable assessments={recentAssessments || []} />
          </div>
        </div>

        {/* Right Column: Fee Status, Curriculum Snapshot, Announcements */}
        <div className={styles.rightColumn}>
          {/* Card D: Fee & Billing Overview */}
          <div className={`${styles.card} ${isDark ? styles.cardDark : ""}`}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionTitleWrap}>
                <CreditCard className={styles.sectionTitleIcon} size={20} />
                <h2 className={styles.sectionTitle}>Fee & Billing</h2>
              </div>
              <Link href="/parent/fees" className={styles.viewAllLink}>
                Fee Details <span className={styles.linkArrow}>&rarr;</span>
              </Link>
            </div>

            <div className={styles.feeHighlightBox}>
              <div className={styles.feeRow}>
                <span className={styles.feeLabel}>Total Program Fee:</span>
                <strong className={styles.feeVal}>₹{totalFee.toLocaleString()}</strong>
              </div>
              <div className={styles.feeRow}>
                <span className={styles.feeLabel}>Amount Paid:</span>
                <span className={`${styles.feeVal} ${styles.textGreen}`}>₹{paidAmount.toLocaleString()}</span>
              </div>
              <div className={styles.feeDivider} />
              <div className={styles.feeRow}>
                <span className={styles.feeLabel}>Balance Pending:</span>
                <strong className={`${styles.feeVal} ${pendingAmount > 0 ? styles.textAmber : styles.textGreen}`}>
                  ₹{pendingAmount.toLocaleString()}
                </strong>
              </div>
            </div>

            <div className={styles.feeProgressWrapper}>
              <div className={styles.feeProgressMeta}>
                <span>Payment Settlement</span>
                <strong>{feeClearedPct}% Cleared</strong>
              </div>
              <div className={styles.healthTrack}>
                <div
                  className={styles.healthFill}
                  style={{
                    width: `${Math.min(100, Math.max(0, feeClearedPct))}%`,
                    backgroundColor: feeClearedPct >= 100 ? "#10b981" : "#0062eb",
                  }}
                />
              </div>
            </div>

            <div className={styles.dueDateBadge}>
              <Clock size={14} />
              <span>Due Date: <strong>{feeSummary?.dueDate || "N/A"}</strong></span>
            </div>
          </div>

          {/* Card E: Curriculum Progress Snapshot */}
          <div className={`${styles.card} ${isDark ? styles.cardDark : ""}`}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionTitleWrap}>
                <BookOpen className={styles.sectionTitleIcon} size={20} />
                <h2 className={styles.sectionTitle}>Curriculum Status</h2>
              </div>
              <Link href="/parent/curriculum" className={styles.viewAllLink}>
                Roadmap <span className={styles.linkArrow}>&rarr;</span>
              </Link>
            </div>

            <div className={styles.curriculumBox}>
              <p className={styles.curriculumCourseTitle}>{courseName}</p>
              <p className={styles.curriculumMeta}>
                Duration: <strong>{curriculum?.totalDuration || "16 Weeks"}</strong>
              </p>

              <div className={styles.curriculumModulesList}>
                <div className={styles.moduleStatItem}>
                  <CheckCircle2 size={16} className={styles.textGreen} />
                  <span>Completed Modules: <strong>{completedModulesCount} / {totalModulesCount}</strong></span>
                </div>
                <div className={styles.moduleStatItem}>
                  <Compass size={16} className={styles.textBlue} />
                  <span>Status: <strong>{currentModuleStatus}</strong></span>
                </div>
              </div>
            </div>
          </div>

          {/* Card F: Parent Notifications & Announcements */}
          <div className={`${styles.card} ${isDark ? styles.cardDark : ""}`}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionTitleWrap}>
                <Bell className={styles.sectionTitleIcon} size={20} />
                <h2 className={styles.sectionTitle}>Announcements</h2>
              </div>
              <Link href="/parent/notifications" className={styles.viewAllLink}>
                View All <span className={styles.linkArrow}>&rarr;</span>
              </Link>
            </div>

            {!recentNotifications || recentNotifications.length === 0 ? (
              <div className={styles.emptyStateContainer}>
                <Bell size={34} opacity={0.5} />
                <p className={styles.emptyStateTitle}>No announcements</p>
                <p className={styles.emptyStateDesc}>You are up to date with all notifications.</p>
              </div>
            ) : (
              <div className={styles.notificationsList}>
                {recentNotifications.slice(0, 3).map((notif: any) => (
                  <div key={notif.id} className={styles.notifItem}>
                    <div className={styles.notifIcon}>
                      <Megaphone size={16} />
                    </div>
                    <div className={styles.notifContent}>
                      <div className={styles.notifHeaderRow}>
                        <h4 className={styles.notifTitle}>{notif.title}</h4>
                        <span className={styles.notifTag}>{notif.category || "General"}</span>
                      </div>
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
