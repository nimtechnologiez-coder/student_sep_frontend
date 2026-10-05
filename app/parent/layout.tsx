"use client";

import React, { useState, useEffect } from "react";
import ParentSidebar from "@/components/parent/Sidebar";
import ParentHeader from "@/components/parent/Header";
import { useTheme } from "@/components/ThemeProvider";
import styles from "@/styles/parent/layout.module.css";
import { StudentApi } from "@/lib/studentApi";

export default function ParentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [studentInfo, setStudentInfo] = useState<{
    name: string;
    photoUrl: string;
    course: string;
    id: string;
  }>({
    name: "",
    photoUrl: "",
    course: "",
    id: "",
  });

  const [parentName, setParentName] = useState<string>("");

  useEffect(() => {
    let initialParentName = "";
    try {
      const stored = localStorage.getItem("userData");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.student_name) {
          setStudentInfo((prev) => ({ ...prev, name: parsed.student_name }));
        }
        const storedPName = parsed.parent_name || parsed.parent_guardian_name || parsed.guardian_name || parsed.parentName;
        if (storedPName && typeof storedPName === "string" && !storedPName.startsWith("P_")) {
          initialParentName = storedPName;
        } else if (parsed.student_name) {
          initialParentName = `Parent of ${parsed.student_name}`;
        }
      }
    } catch (e) {}

    if (initialParentName) {
      setParentName(initialParentName);
    }

    StudentApi.getProfile().then((res) => {
      if (res && (res.status === "success" || res.success)) {
        const p = res.profile || res.student || {};
        setStudentInfo({
          name: p.name || "",
          photoUrl: p.avatar_url || "",
          course: p.course || "Generative AI & LLMs",
          id: p.student_id || "",
        });
        const apiPName = p.parent_name || p.parent_guardian_name || p.guardian_name || p.parentName;
        if (apiPName && typeof apiPName === "string" && !apiPName.startsWith("P_")) {
          setParentName(apiPName);
        } else if (p.name) {
          setParentName(`Parent of ${p.name}`);
        }
      }
    });
  }, []);

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
        linkedStudent={studentInfo}
        parentName={parentName}
      />

      {/* Main Content Area */}
      <div className={styles.mainWrapper}>
        <ParentHeader
          onMobileMenuToggle={() => setMobileSidebarOpen(true)}
          linkedStudentName={studentInfo.name}
          parentName={parentName}
        />

        <main className={styles.mainContent}>{children}</main>
      </div>
    </div>
  );
}
