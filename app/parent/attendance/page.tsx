"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "@/components/ThemeProvider";
import StatCard from "@/components/parent/StatCard";
import AttendanceTable from "@/components/parent/AttendanceTable";
import styles from "@/styles/parent/attendance.module.css";
import { AttendanceRecord } from "@/lib/parentData";
import { Calendar, CheckCircle2, XCircle, Clock } from "lucide-react";

export default function ParentAttendancePage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetch("/api/parent/attendance")
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          setData(json);
        }
      })
      .catch((err) => console.error("Error fetching parent attendance API:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading || !data) {
    return (
      <div className={styles.container}>
        <div className={`${styles.statsGrid}`}>
          <p>Loading Attendance Data from API...</p>
        </div>
      </div>
    );
  }

  const { student, summary, attendance } = data;

  return (
    <div className={styles.container}>
      {/* Overview Stat Cards */}
      <section className={styles.statsGrid}>
        <StatCard
          title="Attendance Rate"
          value={`${summary.percentage}%`}
          subtext={`Target threshold: 85% minimum`}
          badge="On Track"
          badgeType="success"
          icon={Calendar}
          iconColor="green"
          progressPercentage={summary.percentage}
        />
        <StatCard
          title="Total Classes Conducted"
          value={summary.totalClasses}
          subtext="Total logged sessions"
          badge="Updated"
          badgeType="info"
          icon={Clock}
          iconColor="blue"
        />
        <StatCard
          title="Present Sessions"
          value={summary.presentCount}
          subtext="Sessions attended on time"
          badge="Regular"
          badgeType="success"
          icon={CheckCircle2}
          iconColor="green"
        />
        <StatCard
          title="Absent Sessions"
          value={summary.absentCount}
          subtext="Recorded absences"
          badge={summary.absentCount === 0 ? "Perfect" : "Action Needed"}
          badgeType={summary.absentCount === 0 ? "success" : "warning"}
          icon={XCircle}
          iconColor="amber"
        />
      </section>

      {/* Date-wise Attendance Table */}
      <section>
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>
            Date-Wise Session Logs ({student.name})
          </h2>
        </div>
        <AttendanceTable records={attendance} />
      </section>
    </div>
  );
}
