"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "@/components/ThemeProvider";
import StatCard from "@/components/parent/StatCard";
import styles from "@/styles/parent/fees.module.css";
import { CreditCard, Download, CheckCircle2, AlertCircle, Clock } from "lucide-react";

export default function ParentFeesPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetch("/api/parent/fees")
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          setData(json);
        }
      })
      .catch((err) => console.error("Error fetching parent fees API:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading || !data) {
    return (
      <div className={styles.container}>
        <div className={styles.statsGrid}>
          <p>Loading Fees &amp; Payment History from API...</p>
        </div>
      </div>
    );
  }

  const { student, fees } = data;

  return (
    <div className={styles.container}>
      {/* Overview Stat Cards */}
      <section className={styles.statsGrid}>
        <StatCard
          title="Total Program Fee"
          value={`₹${fees.totalFee.toLocaleString()}`}
          subtext="Generative AI & LLMs Course Fee"
          badge="Enrolled"
          badgeType="info"
          icon={CreditCard}
          iconColor="blue"
        />
        <StatCard
          title="Total Paid Amount"
          value={`₹${fees.paidAmount.toLocaleString()}`}
          subtext="Verified online payments"
          badge="83% Cleared"
          badgeType="success"
          icon={CheckCircle2}
          iconColor="green"
          progressPercentage={83}
        />
        <StatCard
          title="Pending / Balance Fee"
          value={`₹${fees.pendingAmount.toLocaleString()}`}
          subtext={`Next due date: ${fees.dueDate}`}
          badge="Installment 3"
          badgeType="warning"
          icon={AlertCircle}
          iconColor="amber"
        />
        <StatCard
          title="Next Due Date"
          value={fees.dueDate}
          subtext={`Amount Due: ₹${fees.nextInstallmentAmount.toLocaleString()}`}
          badge="Due Soon"
          badgeType="warning"
          icon={Clock}
          iconColor="amber"
        />
      </section>

      {/* Payment History Table */}
      <section className={`${styles.card} ${isDark ? styles.cardDark : ""}`}>
        <h2 className={styles.cardTitle}>
          Fee Payment History &amp; Receipts ({student.name})
        </h2>

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
            {fees.paymentHistory.map((item: any) => {
              const isPaid = item.status === "Paid";
              return (
                <tr key={item.id}>
                  <td>
                    <strong>{item.description}</strong>
                  </td>
                  <td>{item.date}</td>
                  <td>
                    <strong>₹{item.amount.toLocaleString()}</strong>
                  </td>
                  <td>{item.paymentMode}</td>
                  <td>
                    <span
                      style={{
                        padding: "3px 10px",
                        borderRadius: "12px",
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
                      <span style={{ fontSize: "12px", color: "#64748b" }}>
                        Pay Online
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>
    </div>
  );
}
