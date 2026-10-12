"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useTheme } from "./ThemeProvider";
import {
  ArrowRight,
  Users,
  Sparkles,
} from "lucide-react";

export default function DashboardHero() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div
      className={`relative w-full rounded-2xl sm:rounded-[28px] border transition-all duration-300 overflow-hidden mb-6 p-4 sm:p-6 lg:p-7 ${
        isDark
          ? "bg-gradient-to-r from-[#07132b] via-[#091a3c] to-[#07132b] border-[#15274e] text-white shadow-xl shadow-black/40"
          : "bg-gradient-to-r from-white via-[#f0f6fe] to-[#e8f2fe] border-[#d2e4f8] text-[#0a1b39] shadow-sm shadow-blue-500/5"
      }`}
    >
      {/* Background ambient lighting */}
      <div
        className={`absolute -top-24 -right-24 w-96 h-96 rounded-full blur-3xl pointer-events-none ${
          isDark ? "bg-blue-600/15" : "bg-sky-400/10"
        }`}
      />
      <div
        className={`absolute -bottom-24 left-1/3 w-80 h-80 rounded-full blur-3xl pointer-events-none ${
          isDark ? "bg-indigo-600/10" : "bg-blue-300/10"
        }`}
      />

      {/* 3-Part Hero Layout: Greeting & Batch (Left), Quote (Center), 3D Artwork (Right) */}
      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5 sm:gap-6">
        {/* =========================================================================
            LEFT AREA: STUDENT GREETING & BATCH INFORMATION
            ========================================================================= */}
        <div className="flex-1 max-w-xl">
          <p
            className={`text-xs sm:text-sm font-semibold mb-1 ${
              isDark ? "text-slate-400" : "text-slate-500"
            }`}
          >
            Good Morning,
          </p>
          <h1
            className={`text-xl sm:text-3xl xl:text-[34px] font-black tracking-tight leading-tight mb-2 sm:mb-2.5 ${
              isDark ? "text-white" : "text-[#0a1b39]"
            }`}
          >
            Arjun Kumar{" "}
            <span className="inline-block animate-wave origin-[70%_70%]">👋</span>
          </h1>

          {/* Batch & Cohort Badges */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-3 sm:mb-3.5">
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-bold border transition-colors ${
                isDark
                  ? "bg-[#0c1c42] border-[#1b356e] text-sky-400"
                  : "bg-blue-50 border-blue-200 text-[#0062eb]"
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Batch: AI Cohort 2026</span>
            </span>
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                isDark
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                  : "bg-emerald-50 border-emerald-200 text-emerald-700"
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Morning Session (10:00 AM – 1:00 PM)
            </span>
          </div>

          <p
            className={`text-xs sm:text-sm leading-relaxed mb-4 sm:mb-5 ${
              isDark ? "text-slate-300" : "text-slate-600 font-medium"
            }`}
          >
            Keep learning, keep building.
            <br />
            Your AI career journey is in progress!
          </p>

          <Link
            href="/classes"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-2xl bg-[#0062eb] hover:bg-[#0052cc] text-white text-xs sm:text-sm font-bold shadow-lg shadow-blue-600/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer min-h-[42px]"
          >
            <span>Continue Learning</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* =========================================================================
            CENTER AREA: MOTIVATIONAL QUOTE CARD
            ========================================================================= */}
        <div
          className={`hidden xl:flex items-center px-6 py-4 rounded-2xl border transition-colors shadow-sm max-w-[280px] shrink-0 ${
            isDark
              ? "bg-[#0b1836]/80 border-[#1c305c] text-slate-200"
              : "bg-white/90 border-[#dce8f8] text-[#0a1b39]"
          }`}
        >
          <p className="text-xs sm:text-sm italic font-semibold leading-relaxed text-center">
            &ldquo;Discipline today creates opportunities tomorrow.&rdquo;
          </p>
        </div>

        {/* =========================================================================
            RIGHT AREA: 3D HERO ARTWORK (Student climbing to "A BRIGHTER FUTURE")
            ========================================================================= */}
        <div className="relative h-36 sm:h-48 lg:h-52 w-full lg:w-[340px] xl:w-[380px] rounded-2xl overflow-hidden shadow-lg border border-blue-400/20 shrink-0">
          <Image
            src="/hero_illustration.jpg"
            alt="A Brighter Future - Student Career Pathway"
            fill
            priority
            className="object-cover object-center select-none"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
        </div>
      </div>
    </div>
  );
}
