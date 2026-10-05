"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "@/components/ThemeProvider";
import styles from "@/styles/parent/curriculum.module.css";
import { CurriculumModule, ModuleTopic } from "@/lib/parentData";
import { getLoggedInStudentId } from "@/lib/studentApi";
import {
  ChevronDown,
  ChevronUp,
  Clock,
  Eye,
  BookOpen,
} from "lucide-react";

export default function ParentCurriculumPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [curriculum, setCurriculum] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({
    "mod-1": true,
  });

  useEffect(() => {
    const studentId = getLoggedInStudentId();
    const url = studentId ? `/api/parent/curriculum?studentId=${studentId}` : "/api/parent/curriculum";

    fetch(url)
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          setCurriculum(json.curriculum);
        }
      })
      .catch((err) => console.error("Error fetching curriculum API:", err))
      .finally(() => setLoading(false));
  }, []);

  const toggleModule = (id: string) => {
    setExpandedModules((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  if (loading || !curriculum) {
    return (
      <div className={styles.container}>
        <div className={`${styles.moduleCard} ${isDark ? styles.moduleCardDark : ""}`}>
          <div style={{ padding: "20px" }}>Loading Curriculum Data from API...</div>
        </div>
      </div>
    );
  }

  const modules = Array.isArray(curriculum.modules) ? curriculum.modules : [];

  return (
    <div className={styles.container}>
      {/* Header Banner */}
      <section className={styles.headerCard}>
        <div className={styles.readOnlyBadge}>
          <Eye size={14} />
          <span>Read-Only Parent Curriculum View</span>
        </div>
        <h1 className={styles.title}>{curriculum.courseName || "Curriculum"}</h1>
        <p className={styles.subtitle}>
          Program Code: {curriculum.programCode || "N/A"} • Total Duration: {curriculum.totalDuration || "N/A"}
        </p>
      </section>

      {/* Expandable Module Cards or Empty State Card */}
      {modules.length === 0 ? (
        <div
          className={`${styles.moduleCard} ${isDark ? styles.moduleCardDark : ""}`}
          style={{
            width: "100%",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              width: "100%",
              padding: "48px 16px",
            }}
          >
            <BookOpen size={36} opacity={0.6} style={{ marginBottom: "8px" }} />
            <span style={{ fontSize: "15px", fontWeight: 500, color: "var(--text-muted, #94a3b8)", textAlign: "center" }}>
              No curriculum available
            </span>
          </div>
        </div>
      ) : (
        <div className={styles.moduleList}>
          {modules.map((mod: CurriculumModule) => {
            const isExpanded = !!expandedModules[mod.id];

            return (
              <div
                key={mod.id}
                className={`${styles.moduleCard} ${
                  isDark ? styles.moduleCardDark : ""
                }`}
              >
                {/* Module Header (Click to expand) */}
                <div
                  className={styles.moduleHeader}
                  onClick={() => toggleModule(mod.id)}
                >
                  <div className={styles.moduleMeta}>
                    <span className={styles.moduleCode}>{mod.code}</span>
                    <div>
                      <h3 className={styles.moduleTitle}>{mod.title}</h3>
                      <p className={styles.moduleDesc}>{mod.description}</p>
                    </div>
                  </div>

                  <div className={styles.moduleRight}>
                    <span style={{ fontSize: "12px", fontWeight: 700, color: "#64748b" }}>
                      {mod.duration}
                    </span>
                    {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>
                </div>

                {/* Topics Inside Module (Expanded view) */}
                {isExpanded && (
                  <div className={styles.topicsContainer}>
                    {(!mod.topics || mod.topics.length === 0) ? (
                      <p style={{ padding: "12px", color: "var(--text-muted, #94a3b8)", fontSize: "13px" }}>
                        No topics listed under this module.
                      </p>
                    ) : (
                      <div className={styles.topicsGrid}>
                        {mod.topics.map((topic: ModuleTopic) => (
                          <div key={topic.id} className={styles.topicCard}>
                            <h4 className={styles.topicTitle}>{topic.title}</h4>
                            <div className={styles.topicMeta}>
                              <span>{topic.type}</span>
                              <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                                <Clock size={12} />
                                {topic.duration}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
