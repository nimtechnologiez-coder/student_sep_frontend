"use client";

import React from "react";
import { useTheme } from "@/components/ThemeProvider";
import styles from "@/styles/parent/classcard.module.css";
import { Calendar, Clock, User, Video } from "lucide-react";

interface ClassCardProps {
  topic: string;
  module: string;
  date: string;
  time: string;
  mentor: string;
  meetingLink?: string;
  onJoin?: () => void;
}

export default function ClassCard({
  topic,
  module,
  date,
  time,
  mentor,
  meetingLink = "https://meet.google.com/nim-genai-live",
  onJoin,
}: ClassCardProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className={`${styles.classCard} ${isDark ? styles.classCardDark : ""}`}>
      <div className={styles.cardHeader}>
        <span className={styles.moduleBadge}>{module}</span>
        <div className={styles.statusPill}>
          <span className={styles.statusDot} />
          <span>Live Session</span>
        </div>
      </div>

      <h3 className={styles.topicTitle}>{topic}</h3>

      <div className={styles.metaGrid}>
        <div className={styles.metaItem}>
          <Calendar className={styles.metaIcon} />
          <span>{date}</span>
        </div>
        <div className={styles.metaItem}>
          <Clock className={styles.metaIcon} />
          <span>{time}</span>
        </div>
      </div>

      <div className={styles.cardFooter}>
        <div className={styles.mentorInfo}>
          <span>Mentor: </span>
          <strong className={styles.mentorName}>{mentor}</strong>
        </div>

        <a
          href={meetingLink}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => {
            if (onJoin) {
              e.preventDefault();
              onJoin();
            }
          }}
          className={styles.joinBtn}
        >
          <Video size={14} />
          <span>Join Class</span>
        </a>
      </div>
    </div>
  );
}
