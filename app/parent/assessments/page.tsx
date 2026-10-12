"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "@/components/ThemeProvider";
import StatCard from "@/components/parent/StatCard";
import AssessmentTable from "@/components/parent/AssessmentTable";
import styles from "@/styles/parent/assessments.module.css";
import { getLoggedInStudentId, StudentApi } from "@/lib/studentApi";
import { TablePageSkeleton } from "@/components/Skeleton";
import { Award, CheckCircle2, Clock } from "lucide-react";

export default function ParentAssessmentsPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [data, setData] = useState<any>(null);
  const [student, setStudent] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const loadAssessmentsData = (targetId?: string) => {
    const studentId = targetId || getLoggedInStudentId();
    if (!studentId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const url = `/api/parent/assessments?studentId=${studentId}`;

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
      .catch((err) => console.error("Error fetching parent assessments API:", err))
      .finally(() => setLoading(false));

    StudentApi.getProfile(studentId).then((res) => {
      if (res && (res.status === "success" || res.success)) {
        const p = res.profile || res.student;
        if (p && p.name) {
          setStudent(p);
        }
      }
    });
  };

  useEffect(() => {
    loadAssessmentsData();

    const handleChildChanged = (e: any) => {
      if (e.detail) {
        loadAssessmentsData(e.detail);
      }
    };

    window.addEventListener("parent_child_changed", handleChildChanged);
    return () => {
      window.removeEventListener("parent_child_changed", handleChildChanged);
    };
  }, []);

  if (loading || !data) {
    return <TablePageSkeleton title="Loading Evaluations & Scorecard..." />;
  }

  const { assessments } = data;
  const studentName = student?.name || data?.student?.name || "Student";
  const assessmentList = Array.isArray(assessments) ? assessments : [];
  const passedCount = assessmentList.filter((a: any) => a.status === "Passed").length;
  
  // Dynamic Score Calculation
  let totalScoreSum = 0;
  let numericScoresCount = 0;
  let highestScore = 0;

  assessmentList.forEach((a: any) => {
    if (a.score) {
      const match = a.score.match(/\d+(\.\d+)?/);
      if (match) {
        const val = parseFloat(match[0]);
        totalScoreSum += val;
        numericScoresCount++;
        if (val > highestScore) highestScore = val;
      }
    }
  });

  const avgScore = numericScoresCount > 0 ? (totalScoreSum / numericScoresCount).toFixed(1) : "N/A";
  const avgSubtext = highestScore > 0 ? `Highest score: ${highestScore}%` : "No graded assessments yet";

  const upcomingAssessment = assessmentList.find((a: any) => a.status === "Pending");
  const nextDueDate = upcomingAssessment ? upcomingAssessment.date : "N/A";
  const nextSubtext = upcomingAssessment ? upcomingAssessment.name : "No pending assessments";

  return (
    <div className={styles.container}>
      {/* Header Banner */}
      <section
        className={`${styles.headerCard} ${
          isDark ? styles.headerCardDark : ""
        }`}
      >
        <div>
          <div className={styles.badgeWrap}>
            <Award size={13} />
            <span>Academic Evaluations &amp; Scorecard</span>
          </div>
          <h1 className={styles.title}>Academic Assessments</h1>
          <p className={styles.subtitle}>
            Quizzes, evaluations, and performance benchmarks for{" "}
            <strong>{studentName}</strong> ({student?.batch || "Assigned Batch"})
          </p>
        </div>
      </section>

      {/* Assessment Stat Cards */}
      <section className={styles.statsGrid}>
        <StatCard
          title="Average Assessment Score"
          value={avgScore !== "N/A" ? `${avgScore}%` : "N/A"}
          subtext={avgSubtext}
          badge={avgScore !== "N/A" && parseFloat(avgScore) >= 80 ? "Top Performer" : "Active"}
          badgeType="success"
          icon={Award}
          iconColor="purple"
          progressPercentage={avgScore !== "N/A" ? parseFloat(avgScore) : 0}
        />
        <StatCard
          title="Completed Evaluations"
          value={`${passedCount} / ${assessmentList.length}`}
          subtext="Evaluations passed successfully"
          badge="On Track"
          badgeType="success"
          icon={CheckCircle2}
          iconColor="green"
        />
        <StatCard
          title="Next Assessment Due"
          value={nextDueDate}
          subtext={nextSubtext}
          badge={upcomingAssessment ? "Upcoming" : "Cleared"}
          badgeType={upcomingAssessment ? "warning" : "success"}
          icon={Clock}
          iconColor="amber"
        />
      </section>

      {/* Assessment Table & Feedback */}
      <section>
        <div className={styles.cardHeader}>
          <h2 className={`${styles.cardTitle} ${isDark ? styles.cardTitleDark : ""}`}>
            Academic Evaluations &amp; Mentor Feedback ({studentName})
          </h2>
        </div>
        <AssessmentTable assessments={assessmentList} />
      </section>
    </div>
  );
}
