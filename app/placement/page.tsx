"use client";

import React from "react";
import Link from "next/link";
import DashboardLayout from "@/components/DashboardLayout";
import { useTheme } from "@/components/ThemeProvider";
import {
  Building2,
  CheckCircle2,
  Calendar,
  MapPin,
  ArrowRight,
  Briefcase,
  Users,
  Search,
} from "lucide-react";

export default function PlacementPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const drives = [
    {
      company: "CognitiveScale AI",
      role: "Associate AI Engineer",
      package: "₹14 – 18 LPA",
      location: "Bengaluru / Hybrid",
      eligibility: "Month 4 Completed & 80%+ Attendance",
      status: "Eligible • Apply Open",
      deadline: "30 Sep 2026",
    },
    {
      company: "Fractal Analytics",
      role: "MLOps / Data Scientist",
      package: "₹12 – 16 LPA",
      location: "Hyderabad / Remote",
      eligibility: "Evaluation 1 & 2 Passed",
      status: "Upcoming • Opens Oct 15",
      deadline: "20 Oct 2026",
    },
    {
      company: "Inference Labs",
      role: "GenAI Applications Engineer",
      package: "₹16 – 22 LPA",
      location: "Gurugram / Onsite",
      eligibility: "Capstone Approved",
      status: "Upcoming in Month 6",
      deadline: "10 Nov 2026",
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Hero Header */}
        <section
          className={`relative overflow-hidden rounded-2xl p-6 sm:p-7 border transition-all ${
            isDark
              ? "bg-gradient-to-r from-[#07132b] via-[#091a3c] to-[#07132b] border-[#15274e] text-white"
              : "bg-gradient-to-r from-white via-[#f0f6fe] to-[#e8f2fe] border-[#d2e4f8] text-[#0a1b39]"
          }`}
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#0062eb] flex items-center justify-center text-white shrink-0 shadow-md shadow-blue-600/30">
              <Building2 className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">Placement Drives</h1>
              <p className={`text-xs sm:text-sm mt-1 font-medium ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                Campus hiring partners, eligible openings, and drive schedules.
              </p>
            </div>
          </div>
        </section>

        {/* Drives List */}
        <div className="space-y-4">
          {drives.map((d, i) => (
            <div
              key={i}
              className={`p-5 rounded-2xl border transition-all ${
                isDark ? "bg-[#0b1328] border-[#15274d]" : "bg-white border-[#dce8f8] shadow-sm"
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/15 text-emerald-600 border border-emerald-500/30">
                      {d.status}
                    </span>
                    <span className="text-xs text-slate-400 font-semibold">{d.location}</span>
                  </div>

                  <h3 className={`text-lg font-bold ${isDark ? "text-white" : "text-[#0a1b39]"}`}>
                    {d.role} • <span className="text-[#0062eb]">{d.company}</span>
                  </h3>

                  <div className="flex items-center gap-5 text-xs text-slate-400 flex-wrap">
                    <span>Package: <strong className={isDark ? "text-white" : "text-[#0a1b39]"}>{d.package}</strong></span>
                    <span>Criteria: {d.eligibility}</span>
                    <span>Deadline: {d.deadline}</span>
                  </div>
                </div>

                <button className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#0062eb] hover:bg-[#0052cc] text-white text-xs font-bold transition shadow-md shadow-blue-600/25 shrink-0 min-h-[40px]">
                  Apply via NIM Portal
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}

