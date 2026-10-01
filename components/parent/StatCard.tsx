"use client";

import React from "react";
import { useTheme } from "@/components/ThemeProvider";
import styles from "@/styles/parent/statcard.module.css";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtext?: string;
  badge?: string;
  badgeType?: "info" | "success" | "warning";
  icon: LucideIcon;
  iconColor?: "blue" | "green" | "purple" | "amber";
  progressPercentage?: number;
}

export default function StatCard({
  title,
  value,
  subtext,
  badge,
  badgeType = "info",
  icon: Icon,
  iconColor = "blue",
  progressPercentage,
}: StatCardProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const getIconClass = () => {
    switch (iconColor) {
      case "green":
        return styles.greenIcon;
      case "purple":
        return styles.purpleIcon;
      case "amber":
        return styles.amberIcon;
      default:
        return styles.blueIcon;
    }
  };

  const getBadgeClass = () => {
    switch (badgeType) {
      case "success":
        return styles.badgeSuccess;
      case "warning":
        return styles.badgeWarning;
      default:
        return styles.badge;
    }
  };

  return (
    <div
      className={`${styles.statCard} ${isDark ? styles.statCardDark : ""}`}
    >
      <div className={styles.headerRow}>
        <p className={styles.title}>{title}</p>
        <div className={`${styles.iconWrapper} ${getIconClass()}`}>
          <Icon size={18} />
        </div>
      </div>

      <div>
        <div className={styles.valueRow}>
          <h3 className={styles.value}>{value}</h3>
          {badge && <span className={getBadgeClass()}>{badge}</span>}
        </div>

        {subtext && <p className={styles.subtext}>{subtext}</p>}

        {typeof progressPercentage === "number" && (
          <div className={styles.progressBarTrack}>
            <div
              className={styles.progressBarFill}
              style={{ width: `${Math.min(100, Math.max(0, progressPercentage))}%` }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
