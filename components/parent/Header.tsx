"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
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
  Check,
} from "lucide-react";

interface HeaderProps {
  onMobileMenuToggle?: () => void;
  linkedStudentName?: string;
  parentName?: string;
  childrenList?: any[];
  selectedChildId?: string;
  onSelectChild?: (studentId: string) => void;
}

export default function ParentHeader({
  onMobileMenuToggle,
  linkedStudentName = "",
  parentName = "",
  childrenList = [],
  selectedChildId = "",
  onSelectChild,
}: HeaderProps) {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [childDropdownOpen, setChildDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);

  const notifRef = useRef<HTMLDivElement>(null);
  const childRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    StudentApi.getNotifications().then((res) => {
      if (res && res.status === "success" && Array.isArray(res.notifications)) {
        setNotifications(res.notifications);
      }
    });
  }, []);

  // Handle outside click and scroll to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotifOpen(false);
      }
      if (childRef.current && !childRef.current.contains(event.target as Node)) {
        setChildDropdownOpen(false);
      }
    };

    const handleScroll = () => {
      setNotifOpen(false);
      setChildDropdownOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    window.addEventListener("scroll", handleScroll, { passive: true, capture: true });

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
      window.removeEventListener("scroll", handleScroll, { capture: true } as any);
    };
  }, []);

  const displayName = linkedStudentName || "Student";
  const displayParent = parentName || "Parent";

  return (
    <header className={`${styles.header} ${isDark ? styles.headerDark : ""}`}>
      {/* Left side: Hamburger + Linked Student Pill / Switcher */}
      <div className={styles.leftControls}>
        <button
          onClick={onMobileMenuToggle}
          className={styles.mobileMenuBtn}
          aria-label="Toggle menu"
        >
          <Menu size={20} />
        </button>

        {/* Mobile Brand Logo */}
        <Link href="/parent/dashboard" className={styles.mobileBrandLogo}>
          <div className={styles.mobileLogoBox}>
            <Image
              src="/nimlogo.webp"
              alt="NIM Academy Logo"
              width={26}
              height={32}
              className={styles.brandLogoImg}
              priority
            />
          </div>
        </Link>

        {childrenList && childrenList.length > 1 ? (
          <div className={styles.childSwitcherWrapper} ref={childRef}>
            <button
              onClick={() => setChildDropdownOpen(!childDropdownOpen)}
              className={styles.childSwitcherBtn}
              title="Click to switch student"
            >
              <UserCheck className={styles.linkedIcon} />
              <span>Viewing:</span>
              <strong>{displayName}</strong>
              <ChevronDown size={14} />
            </button>

            {childDropdownOpen && (
              <div className={styles.childDropdown}>
                {childrenList.map((c) => {
                  const isSelected = c.student_id === selectedChildId;
                  return (
                    <button
                      key={c.student_id}
                      className={`${styles.childDropdownItem} ${
                        isSelected ? styles.childDropdownItemActive : ""
                      }`}
                      onClick={() => {
                        setChildDropdownOpen(false);
                        if (onSelectChild) {
                          onSelectChild(c.student_id);
                        }
                      }}
                    >
                      <div className={styles.childItemInfo}>
                        <span className={styles.childItemName}>{c.name}</span>
                        <span className={styles.childItemMeta}>
                          {c.student_id} • {c.course}
                        </span>
                      </div>
                      {isSelected && <Check size={16} color="#0062eb" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          <div className={styles.linkedBadgePill}>
            <UserCheck className={styles.linkedIcon} />
            <span>Viewing Linked Student:</span>
            <strong>{displayName}</strong>
          </div>
        )}
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
          title={`Logged in as ${displayParent}`}
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
