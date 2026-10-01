"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "@/components/ThemeProvider";
import styles from "@/styles/parent/sidebar.module.css";
import {
  LayoutDashboard,
  UserCheck,
  BookOpen,
  CalendarCheck,
  ClipboardList,
  Award,
  Bell,
  CreditCard,
  LogOut,
  X,
} from "lucide-react";

interface SidebarProps {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
  linkedStudent?: {
    name: string;
    photoUrl: string;
    course: string;
    id: string;
  };
  parentName?: string;
}

export default function ParentSidebar({
  mobileOpen = false,
  onMobileClose,
  linkedStudent = {
    name: "Arjun Kumar",
    photoUrl: "/avatar.jpg",
    course: "Generative AI & LLMs",
    id: "STU001",
  },
  parentName = "Ramesh Kumar",
}: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const navItems = [
    { name: "Dashboard", href: "/parent/dashboard", icon: LayoutDashboard },
    { name: "My Child", href: "/parent/student", icon: UserCheck },
    { name: "Curriculum", href: "/parent/curriculum", icon: BookOpen },
    { name: "My Classes", href: "/parent/classes", icon: CalendarCheck },
    { name: "Attendance", href: "/parent/attendance", icon: ClipboardList },
    { name: "Assessments", href: "/parent/assessments", icon: Award },
    { name: "Notifications", href: "/parent/notifications", icon: Bell },
    { name: "Fees", href: "/parent/fees", icon: CreditCard },
  ];

  const handleLogout = () => {
    router.push("/login");
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div onClick={onMobileClose} className={styles.backdrop} />
      )}

      {/* Sidebar Container */}
      <aside
        className={`${styles.sidebar} ${isDark ? styles.sidebarDark : ""} ${
          mobileOpen ? styles.sidebarOpen : styles.sidebarClosed
        }`}
      >
        {/* Top: Brand Header */}
        <div>
          <div className={styles.brandHeader}>
            <Link href="/parent/dashboard" className={styles.brandLink}>
              <div className={styles.brandLogo}>N</div>
              <div>
                <h1 className={styles.brandTitle}>NIM Academy</h1>
                <p className={styles.brandBadge}>Parent Portal</p>
              </div>
            </Link>

            {onMobileClose && (
              <button
                type="button"
                onClick={onMobileClose}
                className={styles.closeButton}
                aria-label="Close sidebar"
              >
                <X size={20} />
              </button>
            )}
          </div>

          {/* Linked Student Card Header */}
          <div className={styles.studentCardContainer}>
            <div className={styles.linkedStudentCard}>
              <Image
                src={linkedStudent.photoUrl}
                alt={linkedStudent.name}
                width={40}
                height={40}
                className={styles.studentAvatar}
                onError={(e) => {
                  const target = e.target as HTMLElement;
                  target.style.display = "none";
                }}
              />
              <div className={styles.studentInfo}>
                <p className={styles.childLabel}>Linked Student</p>
                <h4 className={styles.studentName}>{linkedStudent.name}</h4>
                <p className={styles.studentCourse}>{linkedStudent.course}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Middle Navigation */}
        <div className={styles.navContainer}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onMobileClose}
                className={`${styles.navItem} ${
                  isActive ? styles.navItemActive : ""
                }`}
              >
                <Icon className={styles.navIcon} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>

        {/* Bottom Section: Parent Profile & Logout */}
        <div className={styles.footerSection}>
          <div className={styles.parentProfileCard}>
            <div className={styles.parentMeta}>
              <div className={styles.parentAvatar}>
                {parentName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              <div>
                <h5 className={styles.parentName}>{parentName}</h5>
                <p className={styles.parentRole}>Parent / Guardian</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className={styles.logoutBtn}
              title="Logout"
            >
              <LogOut size={14} />
              <span>Exit</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
