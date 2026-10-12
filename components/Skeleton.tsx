"use client";

import React from "react";
import styles from "@/styles/skeleton.module.css";
import parentDashStyles from "@/styles/parent/dashboard.module.css";

interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  variant?: "text" | "circular" | "rounded" | "rectangular";
  style?: React.CSSProperties;
}

export function Skeleton({
  className = "",
  width,
  height,
  variant = "rounded",
  style = {},
}: SkeletonProps) {
  const variantClass = styles[variant] || styles.rounded;

  return (
    <span
      className={`${styles.skeleton} ${variantClass} ${className}`}
      style={{
        width: typeof width === "number" ? `${width}px` : width,
        height: typeof height === "number" ? `${height}px` : height,
        ...style,
      }}
      aria-hidden="true"
    />
  );
}

/* =========================================================================
   1. Parent Dashboard Skeleton (Matches exact parent/dashboard/page layout)
   ========================================================================= */
export function ParentDashboardSkeleton() {
  return (
    <div className={parentDashStyles.container}>
      {/* 1. Hero Card Skeleton */}
      <section className={styles.heroBannerShell}>
        <div className={styles.heroContent}>
          <div className={styles.heroProfile}>
            <Skeleton variant="circular" width={56} height={56} />
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", gap: "8px" }}>
                <Skeleton width={130} height={20} variant="rounded" />
                <Skeleton width={70} height={20} variant="rounded" />
              </div>
              <Skeleton width="60%" height={26} variant="rounded" />
              <Skeleton width="40%" height={16} variant="text" />
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
            <div className={styles.mentorBoxShell}>
              <Skeleton variant="circular" width={32} height={32} />
              <div style={{ display: "flex", flexDirection: "column", gap: "4px", flex: 1 }}>
                <Skeleton width="80%" height={10} variant="text" />
                <Skeleton width="100%" height={14} variant="text" />
              </div>
            </div>
            <Skeleton width={140} height={38} variant="rounded" />
          </div>
        </div>
      </section>

      {/* 2. KPI Cards Grid Skeleton (4 cards) */}
      <section className={parentDashStyles.statsGrid}>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className={styles.statCardShell}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
              <Skeleton width="55%" height={12} variant="text" />
              <Skeleton variant="rounded" width={32} height={32} />
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "6px" }}>
                <Skeleton width="45%" height={24} variant="rounded" />
                <Skeleton width={60} height={18} variant="rounded" />
              </div>
              <Skeleton width="80%" height={12} variant="text" />
              <div style={{ marginTop: "8px" }}>
                <Skeleton width="100%" height={4} variant="rounded" />
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* 3. Main 2-Column Content Grid Skeleton */}
      <div className={parentDashStyles.mainGrid}>
        {/* Left Column */}
        <div className={parentDashStyles.leftColumn}>
          {/* Card A: Attendance Overview Skeleton */}
          <div className={styles.cardShell}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Skeleton variant="circular" width={20} height={20} />
                <Skeleton width={150} height={18} variant="rounded" />
              </div>
              <Skeleton width={80} height={14} variant="text" />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px", marginBottom: "10px" }}>
              {[1, 2, 3].map((b) => (
                <div key={b} className={styles.innerBox} style={{ alignItems: "center" }}>
                  <Skeleton width="60%" height={10} variant="text" />
                  <Skeleton width="40%" height={20} variant="rounded" />
                  <Skeleton width="50%" height={8} variant="text" />
                </div>
              ))}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
              <Skeleton width="45%" height={12} variant="text" />
              <Skeleton width="20%" height={12} variant="text" />
            </div>
            <Skeleton width="100%" height={6} variant="rounded" />
          </div>

          {/* Card B: Upcoming Classes Skeleton */}
          <div className={styles.cardShell}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Skeleton variant="circular" width={20} height={20} />
                <Skeleton width={160} height={18} variant="rounded" />
              </div>
              <Skeleton width={70} height={14} variant="text" />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {[1, 2].map((c) => (
                <div key={c} className={styles.innerBox} style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <Skeleton width={80} height={16} variant="rounded" />
                    <Skeleton width={70} height={16} variant="rounded" />
                  </div>
                  <Skeleton width="80%" height={16} variant="rounded" />
                  <div style={{ display: "flex", gap: "16px" }}>
                    <Skeleton width={90} height={12} variant="text" />
                    <Skeleton width={80} height={12} variant="text" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Card C: Academic Evaluations Table Skeleton */}
          <div className={styles.cardShell}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Skeleton variant="circular" width={20} height={20} />
                <Skeleton width={180} height={18} variant="rounded" />
              </div>
              <Skeleton width={80} height={14} variant="text" />
            </div>
            <div className={styles.tableWrapper}>
              <div className={styles.tableHeadRow}>
                <Skeleton width="28%" height={12} variant="text" />
                <Skeleton width="16%" height={12} variant="text" />
                <Skeleton width="12%" height={12} variant="text" />
                <Skeleton width="10%" height={12} variant="text" />
                <Skeleton width="12%" height={12} variant="text" />
                <Skeleton width="22%" height={12} variant="text" />
              </div>
              {[1, 2, 3].map((r) => (
                <div key={r} className={styles.tableBodyRow}>
                  <Skeleton width="28%" height={14} variant="rounded" />
                  <Skeleton width="16%" height={12} variant="text" />
                  <Skeleton width="12%" height={12} variant="text" />
                  <Skeleton width="10%" height={16} variant="rounded" />
                  <Skeleton width="12%" height={16} variant="rounded" />
                  <Skeleton width="22%" height={14} variant="rounded" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className={parentDashStyles.rightColumn}>
          {/* Card D: Fee & Billing Skeleton */}
          <div className={styles.cardShell}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Skeleton variant="circular" width={20} height={20} />
                <Skeleton width={110} height={18} variant="rounded" />
              </div>
              <Skeleton width={70} height={14} variant="text" />
            </div>
            <div className={styles.innerBox} style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "10px" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}><Skeleton width="40%" height={12} /><Skeleton width="30%" height={14} /></div>
              <div style={{ display: "flex", justifyContent: "space-between" }}><Skeleton width="40%" height={12} /><Skeleton width="30%" height={14} /></div>
              <div className={styles.boxDivider} />
              <div style={{ display: "flex", justifyContent: "space-between" }}><Skeleton width="40%" height={12} /><Skeleton width="35%" height={16} /></div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
              <Skeleton width="40%" height={12} variant="text" />
              <Skeleton width="25%" height={12} variant="text" />
            </div>
            <Skeleton width="100%" height={6} variant="rounded" />
          </div>

          {/* Card E: Curriculum Status Skeleton */}
          <div className={styles.cardShell}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Skeleton variant="circular" width={20} height={20} />
                <Skeleton width={130} height={18} variant="rounded" />
              </div>
              <Skeleton width={60} height={14} variant="text" />
            </div>
            <div className={styles.innerBox} style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <Skeleton width="85%" height={16} variant="rounded" />
              <Skeleton width="50%" height={12} variant="text" />
              <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginTop: "4px" }}>
                <Skeleton width="70%" height={12} variant="text" />
                <Skeleton width="60%" height={12} variant="text" />
              </div>
            </div>
          </div>

          {/* Card F: Announcements Skeleton */}
          <div className={styles.cardShell}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Skeleton variant="circular" width={20} height={20} />
                <Skeleton width={120} height={18} variant="rounded" />
              </div>
              <Skeleton width={60} height={14} variant="text" />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {[1, 2, 3].map((n) => (
                <div key={n} className={styles.innerBox} style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                  <Skeleton variant="rounded" width={28} height={28} />
                  <div style={{ display: "flex", flexDirection: "column", gap: "4px", flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <Skeleton width="60%" height={12} variant="rounded" />
                      <Skeleton width={40} height={12} variant="rounded" />
                    </div>
                    <Skeleton width="90%" height={10} variant="text" />
                    <Skeleton width={50} height={8} variant="text" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   2. Child Profile Skeleton (parent/student/page.tsx)
   ========================================================================= */
export function ParentChildProfileSkeleton() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px", width: "100%", maxWidth: "1400px", margin: "0 auto" }}>
      {/* Hero Banner */}
      <div className={styles.heroBannerShell}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
          <Skeleton variant="circular" width={72} height={72} />
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", flex: 1, minWidth: "220px" }}>
            <div style={{ display: "flex", gap: "8px" }}>
              <Skeleton width={120} height={20} variant="rounded" />
              <Skeleton width={80} height={20} variant="rounded" />
            </div>
            <Skeleton width="50%" height={26} variant="rounded" />
            <Skeleton width="35%" height={14} variant="text" />
          </div>
          <div className={styles.mentorBoxShell}>
            <Skeleton variant="circular" width={36} height={36} />
            <div style={{ display: "flex", flexDirection: "column", gap: "4px", flex: 1 }}>
              <Skeleton width="70%" height={10} variant="text" />
              <Skeleton width="100%" height={14} variant="text" />
            </div>
          </div>
        </div>
      </div>

      {/* Profile Details Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "18px" }}>
        {[1, 2, 3].map((card) => (
          <div key={card} className={styles.cardShell}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
              <Skeleton variant="circular" width={18} height={18} />
              <Skeleton width={130} height={16} variant="rounded" />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {[1, 2, 3, 4].map((row) => (
                <div key={row} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Skeleton width="35%" height={12} variant="text" />
                  <Skeleton width="45%" height={14} variant="rounded" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* =========================================================================
   3. Table Page Skeleton (Attendance, Assessments, Fees history)
   ========================================================================= */
export function TablePageSkeleton({ title = "Loading Table Data..." }: { title?: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "18px", width: "100%", maxWidth: "1400px", margin: "0 auto" }}>
      {/* Header bar */}
      <div className={styles.cardShell} style={{ padding: "16px 20px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Skeleton variant="rounded" width={36} height={36} />
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <Skeleton width={160} height={20} variant="rounded" />
              <Skeleton width={100} height={12} variant="text" />
            </div>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <Skeleton width={100} height={32} variant="rounded" />
            <Skeleton width={90} height={32} variant="rounded" />
          </div>
        </div>
      </div>

      {/* KPI Stats Row (3 cards) */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "14px" }}>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className={styles.statCardShell}>
            <Skeleton width="50%" height={11} variant="text" />
            <Skeleton width="40%" height={22} variant="rounded" style={{ margin: "6px 0" }} />
            <Skeleton width="75%" height={10} variant="text" />
          </div>
        ))}
      </div>

      {/* Table Shell */}
      <div className={styles.tableWrapper}>
        <div className={styles.tableHeadRow}>
          <Skeleton width="22%" height={12} variant="text" />
          <Skeleton width="18%" height={12} variant="text" />
          <Skeleton width="14%" height={12} variant="text" />
          <Skeleton width="12%" height={12} variant="text" />
          <Skeleton width="14%" height={12} variant="text" />
          <Skeleton width="20%" height={12} variant="text" />
        </div>
        {[1, 2, 3, 4, 5].map((row) => (
          <div key={row} className={styles.tableBodyRow}>
            <Skeleton width="22%" height={14} variant="rounded" />
            <Skeleton width="18%" height={12} variant="text" />
            <Skeleton width="14%" height={12} variant="text" />
            <Skeleton width="12%" height={16} variant="rounded" />
            <Skeleton width="14%" height={16} variant="rounded" />
            <Skeleton width="20%" height={12} variant="text" />
          </div>
        ))}
      </div>
    </div>
  );
}

/* =========================================================================
   4. Classes / Schedule Page Skeleton
   ========================================================================= */
export function ClassesPageSkeleton() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "18px", width: "100%", maxWidth: "1400px", margin: "0 auto" }}>
      {/* Header Banner */}
      <div className={styles.cardShell}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Skeleton variant="rounded" width={36} height={36} />
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <Skeleton width={180} height={20} variant="rounded" />
              <Skeleton width={120} height={12} variant="text" />
            </div>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <Skeleton width={90} height={30} variant="rounded" />
            <Skeleton width={90} height={30} variant="rounded" />
          </div>
        </div>
      </div>

      {/* Class Cards Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "16px" }}>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className={styles.cardShell}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Skeleton width={80} height={16} variant="rounded" />
              <Skeleton width={70} height={16} variant="rounded" />
            </div>
            <Skeleton width="85%" height={18} variant="rounded" />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", margin: "6px 0" }}>
              <Skeleton width="90%" height={12} variant="text" />
              <Skeleton width="80%" height={12} variant="text" />
            </div>
            <div className={styles.cardFooter}>
              <Skeleton width={100} height={14} variant="text" />
              <Skeleton width={90} height={30} variant="rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* =========================================================================
   5. Curriculum Hub Page Skeleton
   ========================================================================= */
export function CurriculumPageSkeleton() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "18px", width: "100%", maxWidth: "1400px", margin: "0 auto" }}>
      {/* Header Banner */}
      <div className={styles.cardShell}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Skeleton variant="rounded" width={36} height={36} />
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <Skeleton width={180} height={20} variant="rounded" />
              <Skeleton width={120} height={12} variant="text" />
            </div>
          </div>
          <Skeleton width={120} height={32} variant="rounded" />
        </div>
      </div>

      {/* Curriculum Module Cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
        {[1, 2, 3, 4].map((m) => (
          <div key={m} className={styles.cardShell}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "10px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <Skeleton variant="rounded" width={32} height={32} />
                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  <Skeleton width={160} height={16} variant="rounded" />
                  <Skeleton width={100} height={12} variant="text" />
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <Skeleton width={80} height={18} variant="rounded" />
                <Skeleton width={24} height={24} variant="circular" />
              </div>
            </div>
            <div style={{ marginTop: "6px" }}>
              <Skeleton width="100%" height={5} variant="rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* =========================================================================
   6. Notifications Page Skeleton
   ========================================================================= */
export function NotificationsPageSkeleton() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "18px", width: "100%", maxWidth: "1400px", margin: "0 auto" }}>
      {/* Header bar with tabs */}
      <div className={styles.cardShell}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Skeleton variant="rounded" width={36} height={36} />
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <Skeleton width={170} height={20} variant="rounded" />
              <Skeleton width={110} height={12} variant="text" />
            </div>
          </div>
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
            <Skeleton width={60} height={28} variant="rounded" />
            <Skeleton width={70} height={28} variant="rounded" />
            <Skeleton width={80} height={28} variant="rounded" />
          </div>
        </div>
      </div>

      {/* Notifications list */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {[1, 2, 3, 4, 5].map((n) => (
          <div key={n} className={styles.cardShell} style={{ padding: "14px 16px" }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
              <Skeleton variant="rounded" width={32} height={32} />
              <div style={{ display: "flex", flexDirection: "column", gap: "6px", flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Skeleton width="50%" height={15} variant="rounded" />
                  <Skeleton width={60} height={16} variant="rounded" />
                </div>
                <Skeleton width="90%" height={12} variant="text" />
                <Skeleton width={80} height={10} variant="text" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* =========================================================================
   7. Student Dashboard Skeleton (Matches student dashboard layout)
   ========================================================================= */
export function StudentDashboardSkeleton() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "22px", width: "100%", maxWidth: "1600px", margin: "0 auto" }}>
      {/* 1. Welcome Card */}
      <div className={styles.heroBannerShell}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", flex: 1, minWidth: "260px" }}>
            <div style={{ display: "flex", gap: "8px" }}>
              <Skeleton width={140} height={20} variant="rounded" />
              <Skeleton width={180} height={20} variant="rounded" />
            </div>
            <Skeleton width="60%" height={30} variant="rounded" />
            <Skeleton width="45%" height={14} variant="text" />
          </div>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <Skeleton width={130} height={40} variant="rounded" />
            <Skeleton width={130} height={40} variant="rounded" />
          </div>
        </div>
      </div>

      {/* 2. Prominent Next Class Banner Skeleton */}
      <div className={styles.cardShell}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", flex: 1, minWidth: "260px" }}>
            <div style={{ display: "flex", gap: "10px" }}>
              <Skeleton width={110} height={22} variant="rounded" />
              <Skeleton width={130} height={16} variant="text" />
            </div>
            <Skeleton width="70%" height={22} variant="rounded" />
            <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", marginTop: "4px" }}>
              <Skeleton width={110} height={14} variant="text" />
              <Skeleton width={120} height={14} variant="text" />
              <Skeleton width={90} height={14} variant="text" />
            </div>
          </div>
          <Skeleton width={140} height={44} variant="rounded" />
        </div>
      </div>

      {/* 3. 4 Metric Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px" }}>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className={styles.statCardShell}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
              <Skeleton width="55%" height={12} variant="text" />
              <Skeleton variant="rounded" width={32} height={32} />
            </div>
            <Skeleton width="40%" height={24} variant="rounded" />
            <Skeleton width="70%" height={11} variant="text" style={{ marginTop: "4px" }} />
          </div>
        ))}
      </div>
    </div>
  );
}

/* =========================================================================
   8. Student Profile Skeleton (Matches app/profile/page.tsx layout)
   ========================================================================= */
export function StudentProfileSkeleton() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px", width: "100%", maxWidth: "1400px", margin: "0 auto" }}>
      {/* Hero Banner */}
      <div className={styles.cardShell}>
        <div style={{ display: "flex", alignItems: "center", gap: "18px", flexWrap: "wrap" }}>
          <Skeleton variant="circular" width={80} height={80} />
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", flex: 1, minWidth: "220px" }}>
            <div style={{ display: "flex", gap: "8px" }}>
              <Skeleton width={90} height={18} variant="rounded" />
              <Skeleton width={130} height={18} variant="rounded" />
            </div>
            <Skeleton width="50%" height={26} variant="rounded" />
            <Skeleton width="40%" height={14} variant="text" />
          </div>
        </div>
      </div>

      {/* Tab bar */}
      <div style={{ display: "flex", gap: "10px" }}>
        <Skeleton width={100} height={36} variant="rounded" />
        <Skeleton width={100} height={36} variant="rounded" />
        <Skeleton width={100} height={36} variant="rounded" />
      </div>

      {/* Details Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "18px" }}>
        {[1, 2, 3].map((g) => (
          <div key={g} className={styles.cardShell}>
            <Skeleton width={140} height={18} variant="rounded" style={{ marginBottom: "12px" }} />
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {[1, 2, 3, 4].map((f) => (
                <div key={f} style={{ display: "flex", justifyContent: "space-between" }}>
                  <Skeleton width="35%" height={12} variant="text" />
                  <Skeleton width="50%" height={14} variant="rounded" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
