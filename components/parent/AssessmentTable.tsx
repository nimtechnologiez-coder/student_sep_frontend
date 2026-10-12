"use client";

import React from "react";
import { useTheme } from "@/components/ThemeProvider";
import styles from "@/styles/parent/assessmenttable.module.css";
import { AssessmentRecord } from "@/lib/parentData";
import { Award, CheckCircle2, Clock, AlertCircle } from "lucide-react";

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
          <colgroup>
            <col style={{ width: "26%", minWidth: "180px" }} />
            <col style={{ width: "16%", minWidth: "120px" }} />
            <col style={{ width: "14%", minWidth: "110px" }} />
            <col style={{ width: "11%", minWidth: "90px" }} />
            <col style={{ width: "13%", minWidth: "100px" }} />
            <col style={{ width: "20%", minWidth: "150px" }} />
          </colgroup>
          <thead>
            <tr>
              <th className={styles.thLeft}>Assessment Name</th>
              <th className={styles.thLeft}>Module</th>
              <th className={styles.thCenter}>Date</th>
              <th className={styles.thCenter}>Score</th>
              <th className={styles.thCenter}>Status</th>
              <th className={styles.thLeft}>Mentor Feedback</th>
            </tr>
          </thead>
          <tbody>
            {!assessments || assessments.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: "center", padding: "36px 16px" }}>
                  <div className={styles.emptyWrap}>
                    <Award size={32} opacity={0.6} />
                    <span style={{ fontSize: "13px", fontWeight: 600 }}>No evaluations recorded yet</span>
                  </div>
                </td>
              </tr>
            ) : (
              assessments.map((item) => {
                const isPassed = item.status === "Passed";

                // Parse Score
                const rawScore = (item.score || "").trim();
                const isNumericScore = /^\d+(\.\d+)?%?$/.test(rawScore) && rawScore !== "0";
                const isPendingScore = !rawScore || rawScore.toLowerCase() === "pending" || rawScore === "0" || rawScore === "—";

                // Parse Date (clean up any combined date-time strings)
                let displayDate = item.date || "N/A";
                let displayTime = "";
                if (item.date && (item.date.includes(" ") || item.date.includes("T"))) {
                  const parts = item.date.replace("T", " ").split(" ");
                  if (parts.length >= 2) {
                    displayDate = parts[0];
                    displayTime = parts.slice(1).join(" ");
                  }
                }

                return (
                  <tr key={item.id}>
                    <td>
                      <div className={styles.assessmentName} title={item.name}>
                        {item.name}
                      </div>
                    </td>
                    <td>
                      <span className={styles.moduleBadge}>{item.module}</span>
                    </td>
                    <td className={styles.tdCenter}>
                      <div className={styles.dateWrap}>
                        <span className={styles.dateText}>{displayDate}</span>
                        {displayTime && <span className={styles.timeSub}>{displayTime}</span>}
                      </div>
                    </td>
                    <td className={styles.tdCenter}>
                      {isPendingScore ? (
                        <span className={styles.scorePending}>—</span>
                      ) : (
                        <span className={styles.scorePill}>
                          {rawScore.endsWith("%") ? rawScore : `${rawScore}%`}
                        </span>
                      )}
                    </td>
                    <td className={styles.tdCenter}>
                      <span
                        className={`${styles.statusPill} ${
                          isPassed ? styles.statusPassed : styles.statusPending
                        }`}
                      >
                        {isPassed ? (
                          <>
                            <CheckCircle2 size={12} />
                            <span>Passed</span>
                          </>
                        ) : (
                          <>
                            <Clock size={12} />
                            <span>Pending</span>
                          </>
                        )}
                      </span>
                    </td>
                    <td>
                      <div className={styles.feedbackBox} title={item.feedback}>
                        {item.feedback || "No feedback recorded"}
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
