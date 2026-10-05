"use client";

import React from "react";
import { useTheme } from "@/components/ThemeProvider";
import styles from "@/styles/parent/attendancetable.module.css";
import { AttendanceRecord } from "@/lib/parentData";
import { CheckCircle2, XCircle, Clock, ClipboardList } from "lucide-react";

interface AttendanceTableProps {
  records: AttendanceRecord[];
}

export default function AttendanceTable({ records }: AttendanceTableProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className={`${styles.tableCard} ${isDark ? styles.tableCardDark : ""}`}>
      <div className={styles.responsiveWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Date &amp; Time</th>
              <th>Topic</th>
              <th>Module</th>
              <th>Mentor</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {!records || records.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: "center", padding: "40px 16px" }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "8px", color: "var(--text-muted, #94a3b8)" }}>
                    <ClipboardList size={32} opacity={0.6} />
                    <span style={{ fontSize: "14px", fontWeight: 500 }}>No attendance data available</span>
                  </div>
                </td>
              </tr>
            ) : (
              records.map((item) => {
                let statusClass = styles.statusPresent;
                let StatusIcon = CheckCircle2;

                if (item.status === "Absent") {
                  statusClass = styles.statusAbsent;
                  StatusIcon = XCircle;
                } else if (item.status === "Late") {
                  statusClass = styles.statusLate;
                  StatusIcon = Clock;
                }

                return (
                  <tr key={item.id}>
                    <td>
                      <div className={styles.dateCell}>{item.date}</div>
                      <div className={styles.timeCell}>{item.time}</div>
                    </td>
                    <td className={styles.topicCell}>{item.topic}</td>
                    <td>
                      <span className={styles.moduleTag}>{item.module}</span>
                    </td>
                    <td>{item.mentor}</td>
                    <td>
                      <div className={`${styles.statusPill} ${statusClass}`}>
                        <StatusIcon size={14} />
                        <span>{item.status}</span>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
