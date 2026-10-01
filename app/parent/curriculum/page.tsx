"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "@/components/ThemeProvider";
import styles from "@/styles/parent/curriculum.module.css";
import { CurriculumModule, ModuleTopic } from "@/lib/parentData";
import {
  BookOpen,
  ChevronDown,
  ChevronUp,
  Lock,
  Clock,
  CheckCircle2,
  Eye,
} from "lucide-react";

export default function ParentCurriculumPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [curriculum, setCurriculum] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({
    "mod-1": true,
    "mod-2": true,
    "mod-3": true,
  });

  useEffect(() => {
    fetch("/api/parent/curriculum")
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

  return (
    <div className={styles.container}>
      {/* Header Banner */}
      <section className={styles.headerCard}>
        <div className={styles.readOnlyBadge}>
          <Eye size={14} />
          <span>Read-Only Parent Curriculum View</span>
        </div>
        <h1 className={styles.title}>{curriculum.courseName}</h1>
        <p className={styles.subtitle}>
          Program Code: {curriculum.programCode} • Total Duration: {curriculum.totalDuration}
        </p>
      </section>

      {/* Expandable Module Cards */}
      <div className={styles.moduleList}>
        {curriculum.modules.map((mod: CurriculumModule) => {
          const isExpanded = !!expandedModules[mod.id];
          const isCompleted = mod.status === "Completed";
          const isInProgress = mod.status === "In Progress";

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
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
