"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import ParentSidebar from "@/components/parent/Sidebar";
import ParentHeader from "@/components/parent/Header";
import { useTheme } from "@/components/ThemeProvider";
import styles from "@/styles/parent/layout.module.css";
import { StudentApi, getSelectedChildId, setSelectedChildId } from "@/lib/studentApi";

function formatParentDisplayName(rawName?: string | null): string {
  if (!rawName || typeof rawName !== "string") return "";
  let name = rawName.trim();
  if (name.toLowerCase().startsWith("p_")) {
    name = name.slice(2).trim();
  }
  if (!name || name.toLowerCase() === "parent" || name.toLowerCase() === "n/a") {
    return "";
  }
  return name
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

export default function ParentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Automatically close drawer when route changes
  useEffect(() => {
    setMobileSidebarOpen(false);
  }, [pathname]);

  // Close drawer on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileSidebarOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Lock background scroll when mobile drawer is open
  useEffect(() => {
    if (mobileSidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileSidebarOpen]);

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
  const [childrenList, setChildrenList] = useState<any[]>([]);
  const [selectedChildId, setLocalSelectedChildId] = useState<string>("");

  const updateChildProfile = (childId: string) => {
    if (!childId) return;
    StudentApi.getProfile(childId).then((res) => {
      if (res && (res.status === "success" || res.success)) {
        const p = res.profile || res.student || {};
        setStudentInfo({
          name: p.name || "",
          photoUrl: p.avatar_url || "",
          course: p.course || "Generative AI & LLMs",
          id: p.student_id || childId,
        });

        const apiCandidate = formatParentDisplayName(
          p.guardian_name || p.parent_name || p.parent_guardian_name || p.parent_username
        );
        if (apiCandidate) {
          setParentName(apiCandidate);
        }
      }
    });
  };

  useEffect(() => {
    let initialParentName = "";
    let initialChildId = getSelectedChildId();
    let initialChildren: any[] = [];
    let parentUsername = "";

    try {
      const stored = localStorage.getItem("userData");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.children && Array.isArray(parsed.children) && parsed.children.length > 0) {
          initialChildren = parsed.children;
          setChildrenList(parsed.children);
        }
        if (parsed.parent_username) {
          parentUsername = parsed.parent_username;
        }
        if (!initialChildId) {
          initialChildId = parsed.selected_student_id || parsed.student_id || parsed.children?.[0]?.student_id || "";
        }
        if (parsed.student_name) {
          setStudentInfo((prev) => ({ ...prev, name: parsed.student_name }));
        }

        const candidate = formatParentDisplayName(
          parsed.parent_name || parsed.guardian_name || parsed.parent_guardian_name || parsed.parentName || parsed.parent_username
        );
        if (candidate) {
          initialParentName = candidate;
        }
      }
    } catch (e) {}

    if (initialParentName) {
      setParentName(initialParentName);
    }

    if (initialChildId) {
      setLocalSelectedChildId(initialChildId);
      updateChildProfile(initialChildId);
    }

    // Always fetch latest children list from backend API
    const lookupId = parentUsername || initialChildId;
    if (lookupId) {
      StudentApi.getParentChildren(lookupId).then((res) => {
        if (res && res.success && Array.isArray(res.children) && res.children.length > 0) {
          setChildrenList(res.children);
          const candidatePName = formatParentDisplayName(res.parent_name || res.parent_username);
          if (candidatePName) {
            setParentName((curr) => (curr && curr !== "Parent" ? curr : candidatePName));
          }
          // If current selected child is not set or not in the list, default to first child
          const currentId = getSelectedChildId();
          const match = res.children.find((c: any) => c.student_id === currentId);
          if (!match && res.children[0]) {
            const firstId = res.children[0].student_id;
            setSelectedChildId(firstId);
            setLocalSelectedChildId(firstId);
            updateChildProfile(firstId);
          }
        }
      });
    }

    const handleChildChanged = (e: any) => {
      const newChildId = e.detail;
      if (newChildId && newChildId !== selectedChildId) {
        setLocalSelectedChildId(newChildId);
        updateChildProfile(newChildId);
      }
    };

    window.addEventListener("parent_child_changed", handleChildChanged);
    return () => {
      window.removeEventListener("parent_child_changed", handleChildChanged);
    };
  }, []);

  const handleSelectChild = (childId: string) => {
    setSelectedChildId(childId);
    setLocalSelectedChildId(childId);
    updateChildProfile(childId);
  };

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
          childrenList={childrenList}
          selectedChildId={selectedChildId}
          onSelectChild={handleSelectChild}
        />

        <main className={styles.mainContent}>{children}</main>
      </div>
    </div>
  );
}
