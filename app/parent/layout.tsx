"use client";

import React, { useState } from "react";
import ParentSidebar from "@/components/parent/Sidebar";
import ParentHeader from "@/components/parent/Header";
import { useTheme } from "@/components/ThemeProvider";
import styles from "@/styles/parent/layout.module.css";

export default function ParentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div
      className={`${styles.layoutContainer} ${
        isDark ? styles.layoutContainerDark : ""
      }`}
    >
      {/* Parent Sidebar */}
      <ParentSidebar
        mobileOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className={styles.mainWrapper}>
        <ParentHeader
          onMobileMenuToggle={() => setMobileSidebarOpen(true)}
          linkedStudentName="Arjun Kumar"
          parentName="Ramesh Kumar"
        />

        <main className={styles.mainContent}>{children}</main>
      </div>
    </div>
  );
}
