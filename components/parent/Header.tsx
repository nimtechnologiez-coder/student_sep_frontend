"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTheme } from "@/components/ThemeProvider";
import styles from "@/styles/parent/header.module.css";
import { StudentApi } from "@/lib/studentApi";
import {
  Menu,
  Sun,
  Moon,
  Bell,
  UserCheck,
  ChevronDown,
} from "lucide-react";

interface HeaderProps {
  onMobileMenuToggle?: () => void;
  linkedStudentName?: string;
  parentName?: string;
}

export default function ParentHeader({
  onMobileMenuToggle,
  linkedStudentName = "",
  parentName = "",
}: HeaderProps) {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);

  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    StudentApi.getNotifications().then((res) => {
      if (res && res.status === "success" && Array.isArray(res.notifications)) {
        setNotifications(res.notifications);
      }
    });
  }, []);

  // Handle outside click and scroll to close notification dropdown
  useEffect(() => {
    if (!notifOpen) return;

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotifOpen(false);
      }
    };

    const handleScroll = () => {
      setNotifOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    window.addEventListener("scroll", handleScroll, { passive: true, capture: true });

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
      window.removeEventListener("scroll", handleScroll, { capture: true } as any);
    };
  }, [notifOpen]);

  const displayName = linkedStudentName || "Student";
  const displayParent = parentName || "Parent";

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
          <strong>{displayName}</strong>
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
        <div className={styles.notifWrapper} ref={notifRef}>
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className={styles.notifBtn}
            title="Notifications"
          >
            <Bell size={18} />
            {notifications.length > 0 && (
              <span className={styles.badge}>{notifications.length}</span>
            )}
          </button>

          {notifOpen && (
            <div className={styles.notifDropdown}>
              <div className={styles.notifHeader}>
                <span>Parent Updates</span>
                <span className={styles.markRead} onClick={() => setNotifications([])}>Clear All</span>
              </div>
              <div className={styles.notifList}>
                {notifications.length === 0 ? (
                  <div className={styles.notifItem}>
                    <p className={styles.notifTitle}>No Notifications</p>
                    <p className={styles.notifTime}>You are all caught up.</p>
                  </div>
                ) : (
                  notifications.slice(0, 5).map((n: any) => (
                    <div key={n.id} className={styles.notifItem}>
                      <p className={styles.notifTitle}>{n.title}</p>
                      <p className={styles.notifTime}>{n.message || n.timestamp || n.date}</p>
                    </div>
                  ))
                )}
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
            {displayParent
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase() || "P"}
          </div>
          <span className={styles.parentNameSmall}>{displayParent}</span>
          <ChevronDown size={14} />
        </button>
      </div>
    </header>
  );
}
