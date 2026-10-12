"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "@/components/ThemeProvider";
import StatCard from "@/components/parent/StatCard";
import styles from "@/styles/parent/fees.module.css";
import { getLoggedInStudentId, StudentApi } from "@/lib/studentApi";
import { TablePageSkeleton } from "@/components/Skeleton";
import { CreditCard, Download, CheckCircle2, AlertCircle, Clock } from "lucide-react";

export default function ParentFeesPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [data, setData] = useState<any>(null);
  const [student, setStudent] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const loadFeesData = (targetId?: string) => {
    const studentId = targetId || getLoggedInStudentId();
    if (!studentId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const url = `/api/parent/fees?studentId=${studentId}`;

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
      .catch((err) => console.error("Error fetching parent fees API:", err))
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
    loadFeesData();

    const handleChildChanged = (e: any) => {
      if (e.detail) {
        loadFeesData(e.detail);
      }
    };

    window.addEventListener("parent_child_changed", handleChildChanged);
    return () => {
      window.removeEventListener("parent_child_changed", handleChildChanged);
    };
  }, []);

  if (loading || !data) {
    return <TablePageSkeleton title="Loading Fees & Payment History..." />;
  }

  const { fees } = data;
  const studentName = student?.name || data?.student?.name || "Student";
  const courseName = student?.course || data?.student?.course || "Generative AI & LLMs";
  const totalFee = fees?.totalFee || 0;
  const paidAmount = fees?.paidAmount || 0;
  const pendingAmount = fees?.pendingAmount || 0;
  const clearedPct = totalFee > 0 ? Math.round((paidAmount / totalFee) * 100) : 0;
  const paymentHistory = Array.isArray(fees?.paymentHistory) ? fees.paymentHistory : [];

  return (
    <div className={styles.container}>
      {/* Header Banner */}
      <section
        className={`${styles.headerCard} ${
          isDark ? styles.headerCardDark : ""
        }`}
      >
        <div>
          <h1 className={styles.title}>Fees &amp; Invoices</h1>
          <p className={styles.subtitle}>
            Program fee breakdown, installment schedules, and official receipts for{" "}
            <strong>{studentName}</strong> ({courseName})
          </p>
        </div>
      </section>

      {/* Overview Stat Cards */}
      <section className={styles.statsGrid}>
        <StatCard
          title="Total Program Fee"
          value={`₹${totalFee.toLocaleString()}`}
          subtext={`${courseName} Fee`}
          badge="Enrolled"
          badgeType="info"
          icon={CreditCard}
          iconColor="blue"
        />
        <StatCard
          title="Total Paid Amount"
          value={`₹${paidAmount.toLocaleString()}`}
          subtext="Verified payments"
          badge={`${clearedPct}% Cleared`}
          badgeType={clearedPct >= 100 ? "success" : "info"}
          icon={CheckCircle2}
          iconColor="green"
          progressPercentage={clearedPct}
        />
        <StatCard
          title="Pending / Balance Fee"
          value={`₹${pendingAmount.toLocaleString()}`}
          subtext={`Next due date: ${fees?.dueDate || "N/A"}`}
          badge={pendingAmount > 0 ? "Pending" : "Cleared"}
          badgeType={pendingAmount > 0 ? "warning" : "success"}
          icon={AlertCircle}
          iconColor="amber"
        />
        <StatCard
          title="Next Due Date"
          value={fees?.dueDate || "N/A"}
          subtext={`Amount Due: ₹${(fees?.nextInstallmentAmount || pendingAmount).toLocaleString()}`}
          badge={pendingAmount > 0 ? "Due Soon" : "Settled"}
          badgeType={pendingAmount > 0 ? "warning" : "success"}
          icon={Clock}
          iconColor="amber"
        />
      </section>

      {/* Payment History Table */}
      <section className={`${styles.card} ${isDark ? styles.cardDark : ""}`}>
        <h2 className={styles.cardTitle}>
          Fee Payment History &amp; Receipts ({studentName})
        </h2>

        <div className={styles.responsiveWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Installment Description</th>
                <th>Date Paid / Due</th>
                <th>Amount</th>
                <th>Payment Mode</th>
                <th>Status</th>
                <th>Invoice Receipt</th>
              </tr>
            </thead>
            <tbody>
              {paymentHistory.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center", padding: "40px 16px" }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "8px", color: "var(--text-muted, #94a3b8)" }}>
                      <CreditCard size={32} opacity={0.6} />
                      <span style={{ fontSize: "14px", fontWeight: 500 }}>No fee data available</span>
                    </div>
                  </td>
                </tr>
              ) : (
                paymentHistory.map((item: any) => {
                  const isPaid = item.status === "Paid";
                  return (
                    <tr key={item.id}>
                      <td>
                        <strong>{item.description}</strong>
                      </td>
                      <td>{item.date}</td>
                      <td>
                        <strong style={{ color: "#10b981" }}>₹{item.amount.toLocaleString()}</strong>
                      </td>
                      <td>{item.paymentMode}</td>
                      <td>
                        <span
                          style={{
                            padding: "2.5px 8px",
                            borderRadius: "9999px",
                            fontSize: "11px",
                            fontWeight: 800,
                            backgroundColor: isPaid
                              ? "rgba(16, 185, 129, 0.12)"
                              : "rgba(245, 158, 11, 0.12)",
                            color: isPaid ? "#10b981" : "#d97706",
                          }}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td>
                        {isPaid ? (
                          <button className={styles.receiptBtn}>
                            <Download size={14} />
                            <span>{item.receiptNumber}</span>
                          </button>
                        ) : (
                          <span style={{ fontSize: "12px", color: "#64748b", fontWeight: 600 }}>
                            Pending
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
