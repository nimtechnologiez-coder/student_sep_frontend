"use client";

import React from "react";
import { useTheme } from "@/components/ThemeProvider";
import styles from "@/styles/parent/assessmenttable.module.css";
import { AssessmentRecord } from "@/lib/parentData";
import { Award } from "lucide-react";

interface AssessmentTableProps {
  assessments: AssessmentRecord[];
}

export default function AssessmentTable({ assessments }: AssessmentTableProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className={`${styles.tableCard} ${isDark ? styles.tableCardDark : ""}`}>
      <div className={styles.responsiveWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Assessment Name</th>
              <th>Module</th>
              <th>Date</th>
              <th>Score</th>
              <th>Status</th>
              <th>Mentor Feedback</th>
            </tr>
          </thead>
          <tbody>
            {!assessments || assessments.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: "center", padding: "40px 16px" }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "8px", color: "var(--text-muted, #94a3b8)" }}>
                    <Award size={32} opacity={0.6} />
                    <span style={{ fontSize: "14px", fontWeight: 500 }}>No assignments available</span>
                  </div>
                </td>
              </tr>
            ) : (
              assessments.map((item) => {
                const isPassed = item.status === "Passed";
                return (
                  <tr key={item.id}>
                    <td>
                      <div className={styles.assessmentName}>{item.name}</div>
                    </td>
                    <td>
                      <span className={styles.moduleText}>{item.module}</span>
                    </td>
                    <td>{item.date}</td>
                    <td>
                      <div className={styles.scorePill}>{item.score}</div>
                    </td>
                    <td>
                      <span
                        className={`${styles.statusPill} ${
                          isPassed ? styles.statusPassed : styles.statusPending
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td>
                      <div className={styles.feedbackBox}>{item.feedback}</div>
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
