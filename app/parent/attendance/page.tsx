"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "@/components/ThemeProvider";
import StatCard from "@/components/parent/StatCard";
import AttendanceTable from "@/components/parent/AttendanceTable";
import styles from "@/styles/parent/attendance.module.css";
import { getLoggedInStudentId, StudentApi } from "@/lib/studentApi";
import { Calendar, CheckCircle2, XCircle, Clock } from "lucide-react";

export default function ParentAttendancePage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [data, setData] = useState<any>(null);
  const [student, setStudent] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const studentId = getLoggedInStudentId();
    const url = studentId ? `/api/parent/attendance?studentId=${studentId}` : "/api/parent/attendance";

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
      .catch((err) => console.error("Error fetching parent attendance API:", err))
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
        <div className={`${styles.statsGrid}`}>
          <p>Loading Attendance Data from API...</p>
        </div>
      </div>
    );
  }

  const { summary, attendance } = data;
  const studentName = student?.name || data?.student?.name || "Student";

  return (
    <div className={styles.container}>
      {/* Overview Stat Cards */}
      <section className={styles.statsGrid}>
        <StatCard
          title="Attendance Rate"
          value={`${summary?.percentage || 0}%`}
          subtext={`Target threshold: 85% minimum`}
          badge={summary?.percentage >= 85 ? "On Track" : "Needs Attention"}
          badgeType={summary?.percentage >= 85 ? "success" : "warning"}
          icon={Calendar}
          iconColor="green"
          progressPercentage={summary?.percentage || 0}
        />
        <StatCard
          title="Total Classes Conducted"
          value={summary?.totalClasses || 0}
          subtext="Total logged sessions"
          badge="Updated"
          badgeType="info"
          icon={Clock}
          iconColor="blue"
        />
        <StatCard
          title="Present Sessions"
          value={summary?.presentCount || 0}
          subtext="Sessions attended on time"
          badge="Regular"
          badgeType="success"
          icon={CheckCircle2}
          iconColor="green"
        />
        <StatCard
          title="Absent Sessions"
          value={summary?.absentCount || 0}
          subtext="Recorded absences"
          badge={summary?.absentCount === 0 ? "Perfect" : "Action Needed"}
          badgeType={summary?.absentCount === 0 ? "success" : "warning"}
          icon={XCircle}
          iconColor="amber"
        />
      </section>

      {/* Date-wise Attendance Table */}
      <section>
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>
            Date-Wise Session Logs ({studentName})
          </h2>
        </div>
        <AttendanceTable records={attendance || []} />
      </section>
    </div>
  );
}
