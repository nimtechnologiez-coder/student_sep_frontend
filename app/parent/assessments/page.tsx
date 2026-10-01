"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "@/components/ThemeProvider";
import StatCard from "@/components/parent/StatCard";
import AssessmentTable from "@/components/parent/AssessmentTable";
import styles from "@/styles/parent/assessments.module.css";
import { AssessmentRecord } from "@/lib/parentData";
import { Award, CheckCircle2, Clock } from "lucide-react";

export default function ParentAssessmentsPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetch("/api/parent/assessments")
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          setData(json);
        }
      })
      .catch((err) => console.error("Error fetching parent assessments API:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading || !data) {
    return (
      <div className={styles.container}>
        <div className={styles.statsGrid}>
          <p>Loading Assessment Data from API...</p>
        </div>
      </div>
    );
  }

  const { student, assessments } = data;
  const passedCount = assessments.filter((a: any) => a.status === "Passed").length;

  return (
    <div className={styles.container}>
      {/* Assessment Stat Cards */}
      <section className={styles.statsGrid}>
        <StatCard
          title="Average Assessment Score"
          value="88.8%"
          subtext="Highest grade in Module 2 (92%)"
          badge="Distinction"
          badgeType="success"
          icon={Award}
          iconColor="purple"
          progressPercentage={88.8}
        />
        <StatCard
          title="Completed Evaluations"
          value={`${passedCount} / ${assessments.length}`}
          subtext="Evaluations passed successfully"
          badge="On Track"
          badgeType="success"
          icon={CheckCircle2}
          iconColor="green"
        />
        <StatCard
          title="Next Assessment Due"
          value="15 Oct 2026"
          subtext="Evaluation 2: LLM Fine-Tuning"
          badge="Upcoming"
          badgeType="warning"
          icon={Clock}
          iconColor="amber"
        />
      </section>

      {/* Assessment Table & Feedback */}
      <section>
        <div style={{ marginBottom: "16px" }}>
          <h2 style={{ fontSize: "16px", fontWeight: 800, margin: 0 }}>
            Academic Evaluations &amp; Mentor Feedback ({student.name})
          </h2>
        </div>
        <AssessmentTable assessments={assessments} />
      </section>
    </div>
  );
}
