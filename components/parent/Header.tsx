"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTheme } from "@/components/ThemeProvider";
import styles from "@/styles/parent/header.module.css";
import {
  Menu,
  Sun,
  Moon,
  Bell,
  UserCheck,
  LogOut,
  ChevronDown,
} from "lucide-react";

interface HeaderProps {
  onMobileMenuToggle?: () => void;
  linkedStudentName?: string;
  parentName?: string;
}

export default function ParentHeader({
  onMobileMenuToggle,
  linkedStudentName = "Arjun Kumar",
  parentName = "Ramesh Kumar",
}: HeaderProps) {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <header className={`${styles.header} ${isDark ? styles.headerDark : ""}`}>
      {/* Left side: Hamburger + Linked Student Pill */}
      <div className={styles.leftControls}>
        <button
          onClick={onMobileMenuToggle}
          className={styles.mobileMenuBtn}
          aria-label="Toggle menu"
        >
          <Menu size={20} />
        </button>

        <div className={styles.linkedBadgePill}>
          <UserCheck className={styles.linkedIcon} />
          <span>Viewing Linked Student:</span>
          <strong>{linkedStudentName}</strong>
        </div>
      </div>

      {/* Right controls: Theme Toggle + Notifications + Parent Profile */}
      <div className={styles.rightControls}>
        {/* Theme Switcher */}
        <button
          onClick={toggleTheme}
          className={styles.themeBtn}
          title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {isDark ? <Moon size={18} /> : <Sun size={18} />}
        </button>

        {/* Notifications Dropdown */}
        <div className={styles.notifWrapper}>
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className={styles.notifBtn}
            title="Notifications"
          >
            <Bell size={18} />
            <span className={styles.badge}>3</span>
          </button>

          {notifOpen && (
            <div className={styles.notifDropdown}>
              <div className={styles.notifHeader}>
                <span>Parent Updates</span>
                <span className={styles.markRead}>Clear All</span>
              </div>
              <div className={styles.notifList}>
                <div className={styles.notifItem}>
                  <p className={styles.notifTitle}>New Assessment Score</p>
                  <p className={styles.notifTime}>
                    Arjun scored 92% in Lab Assignment 3 (Multi-Head Attention)
                  </p>
                </div>
                <div className={styles.notifItem}>
                  <p className={styles.notifTitle}>Class Schedule Update</p>
                  <p className={styles.notifTime}>
                    Prompt Engineering live session scheduled for Oct 2
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Parent Profile Trigger */}
        <button
          onClick={() => setProfileOpen(!profileOpen)}
          className={styles.parentProfileBtn}
        >
          <div className={styles.parentAvatarSmall}>
            {parentName
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </div>
          <span className={styles.parentNameSmall}>{parentName}</span>
          <ChevronDown size={14} />
        </button>
      </div>
    </header>
  );
}
