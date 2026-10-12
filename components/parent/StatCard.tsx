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

  const iconClasses: Record<string, string> = {
    blue: styles.scBlueIcon,
    green: styles.scGreenIcon,
    purple: styles.scPurpleIcon,
    amber: styles.scAmberIcon,
  };

  const progressClasses: Record<string, string> = {
    blue: styles.scBlueProgress,
    green: styles.scGreenProgress,
    purple: styles.scPurpleProgress,
    amber: styles.scAmberProgress,
  };

  const badgeClasses: Record<string, string> = {
    info: styles.scBadgeInfo,
    success: styles.scBadgeSuccess,
    warning: styles.scBadgeWarning,
  };

  const progress = Math.min(
    100,
    Math.max(0, progressPercentage ?? 0)
  );

  return (
    <article
      className={`${styles.scCard} ${isDark ? styles.scCardDark : ""
        }`}
    >
      <header className={styles.scHeader}>
        <p className={styles.scTitle}>{title}</p>

        <div
          className={`${styles.scIcon} ${iconClasses[iconColor] ?? styles.scBlueIcon
            }`}
        >
          <Icon size={18} aria-hidden="true" />
        </div>
      </header>

      <div className={styles.scBody}>
        <div className={styles.scValueRow}>
          <h3 className={styles.scValue}>{value}</h3>

          {badge && (
            <span
              className={`${styles.scBadge} ${badgeClasses[badgeType] ?? styles.scBadgeInfo
                }`}
            >
              {badge}
            </span>
          )}
        </div>

        {subtext && (
          <p className={styles.scSubtext}>{subtext}</p>
        )}

        <div className={styles.scProgressWrapper}>
          {typeof progressPercentage === "number" ? (
            <div
              className={styles.scProgressTrack}
              role="progressbar"
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`${title} progress`}
            >
              <div
                className={`${styles.scProgressFill} ${progressClasses[iconColor] ??
                  styles.scBlueProgress
                  }`}
                style={{ width: `${progress}%` }}
              />
            </div>
          ) : (
            <div className={styles.scProgressPlaceholder} />
          )}
        </div>
      </div>
    </article>
  );
}