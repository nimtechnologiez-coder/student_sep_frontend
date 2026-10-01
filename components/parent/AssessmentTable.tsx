"use client";

import React from "react";
import { useTheme } from "@/components/ThemeProvider";
import styles from "@/styles/parent/assessmenttable.module.css";
import { AssessmentRecord } from "@/lib/parentData";

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
            {assessments.map((item) => {
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
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
