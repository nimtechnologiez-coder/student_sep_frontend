"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useTheme } from "@/components/ThemeProvider";
import styles from "@/styles/parent/curriculum.module.css";
import { CurriculumMonth, CurriculumModule, ModuleTopic } from "@/lib/parentData";
import { getLoggedInStudentId } from "@/lib/studentApi";
import { CurriculumPageSkeleton } from "@/components/Skeleton";
import {
  BookOpen,
  CheckCircle2,
  Clock,
  Eye,
  Sparkles,
  Lock,
  Layers,
  CircleCheck,
  Calendar,
} from "lucide-react";

export default function ParentCurriculumPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [curriculum, setCurriculum] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedMonth, setSelectedMonth] = useState<number>(1);

  const loadCurriculumData = (targetId?: string) => {
    const studentId = targetId || getLoggedInStudentId();
    if (!studentId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const url = `/api/parent/curriculum?studentId=${studentId}`;

    fetch(url)
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.curriculum) {
          setCurriculum(json.curriculum);
          if (Array.isArray(json.curriculum.months) && json.curriculum.months.length > 0) {
            setSelectedMonth(json.curriculum.months[0].monthNumber || 1);
          }
        }
      })
      .catch((err) => console.error("Error fetching curriculum API:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadCurriculumData();

    const handleChildChanged = (e: any) => {
      if (e.detail) {
        loadCurriculumData(e.detail);
      }
    };

    window.addEventListener("parent_child_changed", handleChildChanged);
    return () => {
      window.removeEventListener("parent_child_changed", handleChildChanged);
    };
  }, []);

  if (loading || !curriculum) {
    return <CurriculumPageSkeleton />;
  }

  const months: CurriculumMonth[] = Array.isArray(curriculum.months) ? curriculum.months : [];
  const currentMonthData = months.find((m) => m.monthNumber === selectedMonth) || months[0];

  const totalTopics = curriculum.totalTopics || 0;
  const completedTopics = curriculum.completedTopics || 0;
  const overallProgress = curriculum.progressPercentage || (totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0);

  return (
    <div className={styles.container}>
      {/* Header Banner */}
      <section className={`${styles.headerCard} ${isDark ? styles.headerCardDark : ""}`}>
        <div>
          <div className={styles.readOnlyBadge}>
            <Eye size={13} />
            <span>Read-Only Parent Curriculum View</span>
          </div>
          <h1 className={styles.title}>{curriculum.courseName || "Generative AI & LLMs"}</h1>
          <p className={styles.subtitle}>
            Program Code: <strong>{curriculum.programCode || "NIM-PRO"}</strong> • Total Duration: <strong>{curriculum.totalDuration || "24 Weeks"}</strong>
          </p>
        </div>

        {/* Progress Box */}
        <div className={styles.headerProgressBox}>
          <div className={styles.progressMeta}>
            <span>Overall Course Progress</span>
            <span className={styles.progressVal}>{overallProgress}%</span>
          </div>
          <div className={styles.progressTrack}>
            <div className={styles.progressFill} style={{ width: `${overallProgress}%` }} />
          </div>
          <span className={styles.progressSub}>
            {completedTopics} of {totalTopics} Lessons Completed
          </span>
        </div>
      </section>

      {/* Month Navigation Tabs */}
      <section className={styles.monthSelectorSection}>
        <div className={styles.sectionHeaderRow}>
          <span className={styles.sectionLabel}>Curriculum Months</span>
          <span className={styles.sectionActiveIndicator}>
            Viewing Month {selectedMonth} of {months.length || 6}
          </span>
        </div>

        <div className={styles.monthGrid}>
          {months.map((m) => {
            const isSelected = selectedMonth === m.monthNumber;
            const isDone = m.status === "Completed";
            const isCurrent = m.status === "Current" || m.status === "In Progress";

            let tagClass = styles.tagUpcoming;
            let tagText = "Upcoming";
            if (isDone) {
              tagClass = styles.tagCompleted;
              tagText = "Done";
            } else if (isCurrent) {
              tagClass = styles.tagCurrent;
              tagText = "Active";
            }

            return (
              <button
                key={m.monthNumber}
                onClick={() => setSelectedMonth(m.monthNumber)}
                className={`${styles.monthBtn} ${isDark ? styles.monthBtnDark : ""} ${
                  isSelected ? styles.monthBtnActive : ""
                }`}
              >
                <div className={styles.monthBtnHeader}>
                  <span className={styles.monthBtnNumber}>Month {m.monthNumber}</span>
                  <span className={`${styles.monthBtnTag} ${tagClass}`}>{tagText}</span>
                </div>
                <div className={styles.monthBtnTitle}>{m.title}</div>
                <div className={styles.monthBtnMeta}>
                  <span>Modules</span>
                  <strong>{m.modules?.length || 0}</strong>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Focused Active Month Banner */}
      {currentMonthData && (
        <section className={`${styles.focusedMonthCard} ${isDark ? styles.focusedMonthCardDark : ""}`}>
          <div>
            <div className={styles.focusedHeaderMeta}>
              <span className={styles.focusedBadge}>Month {currentMonthData.monthNumber}</span>
            </div>
            <h2 className={styles.focusedTitle}>{currentMonthData.title}</h2>
            {currentMonthData.description && (
              <p className={styles.focusedDesc}>{currentMonthData.description}</p>
            )}
          </div>

          <div className={styles.focusedKpis}>
            <div className={styles.focusedKpiItem}>
              <span className={styles.focusedKpiLabel}>Modules</span>
              <strong className={styles.focusedKpiVal}>{currentMonthData.modules?.length || 0}</strong>
            </div>
            <div className={styles.focusedKpiItem}>
              <span className={styles.focusedKpiLabel}>Lessons</span>
              <strong className={styles.focusedKpiVal}>
                {(currentMonthData.modules || []).reduce((acc, mod) => acc + (mod.topics?.length || 0), 0)}
              </strong>
            </div>
            <div className={styles.focusedKpiItem}>
              <span className={styles.focusedKpiLabel}>Status</span>
              <strong className={styles.focusedKpiVal} style={{ color: "#0062eb" }}>
                {currentMonthData.status || "Scheduled"}
              </strong>
            </div>
          </div>
        </section>
      )}

      {/* Modules List inside Active Month */}
      {currentMonthData && (!currentMonthData.modules || currentMonthData.modules.length === 0) ? (
        <div className={`${styles.emptyStateContainer} ${isDark ? styles.emptyStateContainerDark : ""}`}>
          <BookOpen size={36} opacity={0.5} />
          <h3 className={styles.emptyTitle}>Upcoming Curriculum Phase</h3>
          <p className={styles.emptyDesc}>
            Lecture modules, practical assignments, and labs for Month {currentMonthData.monthNumber} will appear here as classes are scheduled.
          </p>
        </div>
      ) : (
        <div className={styles.moduleGrid}>
          {currentMonthData?.modules?.map((mod: CurriculumModule) => {
            const topics = mod.topics || [];
            const completedCount = topics.filter((t) => t.status === "Completed").length;
            const isCompleted = mod.status === "Completed" || (topics.length > 0 && completedCount === topics.length);
            const isInProgress = mod.status === "In Progress" || (completedCount > 0 && completedCount < topics.length);

            return (
              <div key={mod.id} className={`${styles.moduleCard} ${isDark ? styles.moduleCardDark : ""}`}>
                <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  <div className={styles.moduleTop}>
                    <div>
                      <h3 className={styles.moduleCodeTitle}>{mod.title}</h3>
                      {mod.description && <p className={styles.moduleDescription}>{mod.description}</p>}
                    </div>
                    <span
                      className={`${styles.moduleStatusPill} ${
                        isCompleted
                          ? styles.statusCompleted
                          : isInProgress
                          ? styles.statusInProgress
                          : styles.statusUpcoming
                      }`}
                    >
                      {isCompleted ? (
                        <>
                          <CheckCircle2 size={12} />
                          <span>Completed</span>
                        </>
                      ) : isInProgress ? (
                        <>
                          <Sparkles size={12} />
                          <span>In Progress</span>
                        </>
                      ) : (
                        <span>Upcoming</span>
                      )}
                    </span>
                  </div>

                  {/* Module Progress */}
                  <div className={styles.moduleProgressWrap}>
                    <div className={styles.moduleProgressMeta}>
                      <span>{topics.length} Lessons</span>
                      <strong>{completedCount} of {topics.length} Done</strong>
                    </div>
                    <div className={styles.progressTrack}>
                      <div
                        className={styles.progressFill}
                        style={{
                          width: `${topics.length > 0 ? (completedCount / topics.length) * 100 : 0}%`,
                          backgroundColor: isCompleted ? "#10b981" : "#0062eb",
                        }}
                      />
                    </div>
                  </div>

                  {/* Lessons List */}
                  {topics.length > 0 && (
                    <div className={styles.moduleTopicsList}>
                      {topics.map((t: ModuleTopic) => {
                        const isDone = t.status === "Completed";
                        return (
                          <div key={t.id} className={styles.topicRow}>
                            <div className={styles.topicLeft}>
                              {isDone ? (
                                <CircleCheck size={16} className="text-emerald-500" style={{ color: "#10b981", flexShrink: 0 }} />
                              ) : (
                                <Clock size={16} className="text-slate-400" style={{ color: "#94a3b8", flexShrink: 0 }} />
                              )}
                              <span className={styles.topicName} title={t.title}>
                                {t.title}
                              </span>
                            </div>
                            <div className={styles.topicRight}>
                              <span className={styles.topicTypeTag}>{t.type || "Online Class"}</span>
                              <span className={styles.topicDuration}>
                                <Clock size={11} />
                                {t.duration || "90 Mins"}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
