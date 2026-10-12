"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import DashboardLayout from "@/components/DashboardLayout";
import { useTheme } from "@/components/ThemeProvider";
import { StudentApi } from "@/lib/studentApi";
import { StudentProfileSkeleton } from "@/components/Skeleton";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Award,
  BookOpen,
  Shield,
  Edit3,
  CheckCircle2,
  ExternalLink,
  Loader2,
} from "lucide-react";

export default function ProfilePage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [activeTab, setActiveTab] = useState("overview");

  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    setIsLoading(true);
    StudentApi.getProfile()
      .then((res) => {
        if (res.status === "success" && res.profile) {
          setProfile(res.profile);
        } else {
          setError(res.message || "Failed to load profile");
        }
      })
      .catch((err) => setError("Network error loading profile"))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <DashboardLayout>
        <StudentProfileSkeleton />
      </DashboardLayout>
    );
  }

  if (error || !profile) {
    return (
      <DashboardLayout>
        <div className="p-8 text-center border rounded-2xl bg-white dark:bg-[#0b1328]">
          <p className="text-sm font-bold text-red-500">{error || "No data available"}</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Profile Header Banner Card */}
        <div
          className={`rounded-3xl border p-4 sm:p-6 lg:p-8 transition-all ${
            isDark
              ? "bg-gradient-to-r from-[#0b1736] via-[#0d1e46] to-[#0b1736] border-[#182c58] text-white"
              : "bg-gradient-to-r from-white via-[#f3f7fd] to-[#ebf3fe] border-[#d2e4f8] text-[#0a1b39] shadow-sm"
          }`}
        >
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
            {/* Avatar */}
            <div
              className="relative w-20 h-20 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-2 border-blue-400 shadow-lg shrink-0 flex items-center justify-center text-white text-xl sm:text-2xl font-bold"
              style={{ backgroundColor: profile.avatar_color || "#2563eb" }}
            >
              {profile.initials || profile.name?.substring(0, 2).toUpperCase() || "ST"}
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center sm:text-left">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h1
                    className={`text-2xl sm:text-3xl font-black tracking-tight ${
                      isDark ? "text-white" : "text-[#0a1b39]"
                    }`}
                  >
                    {profile.name}
                  </h1>
                  <p
                    className={`text-xs sm:text-sm font-semibold mt-0.5 ${
                      isDark ? "text-slate-400" : "text-slate-600"
                    }`}
                  >
                    {profile.course || "Generative AI & LLMs"} • Batch: {profile.batch || "Unassigned"}
                  </p>
                </div>
              </div>

              {/* Badges / Quick stats */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 sm:gap-3 mt-4">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold border ${
                    isDark
                      ? "bg-blue-500/15 text-sky-400 border-blue-500/30"
                      : "bg-blue-50 text-[#0062eb] border-blue-200"
                  }`}
                >
                  Student ID: {profile.student_id}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold border ${
                    isDark
                      ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                      : "bg-emerald-50 text-emerald-700 border-emerald-200"
                  }`}
                >
                  ● Status: {profile.status || "Active"}
                </span>
                {profile.timing_preference && (
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold border ${
                      isDark
                        ? "bg-purple-500/15 text-purple-400 border-purple-500/30"
                        : "bg-purple-50 text-purple-700 border-purple-200"
                    }`}
                  >
                    Batch Time: {profile.timing_preference}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div
          className={`flex items-center gap-2 border-b pb-2 ${
            isDark ? "border-slate-800" : "border-[#e2edf8]"
          }`}
        >
          {["overview", "credentials"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all ${
                activeTab === tab
                  ? "bg-[#0062eb] text-white shadow-md shadow-blue-600/30"
                  : isDark
                  ? "text-slate-400 hover:text-white hover:bg-slate-800/40"
                  : "text-slate-600 hover:text-[#0062eb] hover:bg-blue-50"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Profile Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Personal & Contact Information */}
          <div
            className={`rounded-2xl border p-5 sm:p-6 transition-all ${
              isDark
                ? "bg-[#0b1328] border-[#182c58] text-white"
                : "bg-white border-[#dce7f6] text-[#0a1b39] shadow-sm"
            }`}
          >
            <h2
              className={`text-sm sm:text-base font-bold mb-4 ${
                isDark ? "text-white" : "text-[#0a1b39]"
              }`}
            >
              Contact Details
            </h2>

            <div className="space-y-4 text-xs">
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    isDark ? "bg-slate-800 text-slate-400" : "bg-blue-50 text-[#0062eb]"
                  }`}
                >
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-slate-400 text-[10px] font-semibold uppercase">Email Address</p>
                  <p className="font-bold break-all">{profile.email || "No email provided"}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    isDark ? "bg-slate-800 text-slate-400" : "bg-blue-50 text-[#0062eb]"
                  }`}
                >
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-slate-400 text-[10px] font-semibold uppercase">Phone Number</p>
                  <p className="font-bold">{profile.phone || "No phone provided"}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    isDark ? "bg-slate-800 text-slate-400" : "bg-blue-50 text-[#0062eb]"
                  }`}
                >
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-slate-400 text-[10px] font-semibold uppercase">Enrollment Date</p>
                  <p className="font-bold">{profile.join_date || "N/A"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Two Columns: Credentials & Mentor Summary */}
          <div
            className={`lg:col-span-2 rounded-2xl border p-5 sm:p-6 transition-all ${
              isDark
                ? "bg-[#0b1328] border-[#182c58] text-white"
                : "bg-white border-[#dce7f6] text-[#0a1b39] shadow-sm"
            }`}
          >
            {activeTab === "credentials" ? (
              <div>
                <h2 className={`text-sm sm:text-base font-bold mb-4 ${isDark ? "text-white" : "text-[#0a1b39]"}`}>
                  Generated Student &amp; Parent Credentials
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className={`p-4 rounded-xl border ${isDark ? "bg-[#0c1836] border-[#1a2d59]" : "bg-blue-50/50 border-blue-200"}`}>
                    <p className="text-xs font-bold text-blue-600 mb-1">Student Portal Access</p>
                    <p className="text-xs">Username: <span className="font-mono font-bold">{profile.username || "N/A"}</span></p>
                    <p className="text-xs">Password: <span className="font-mono font-bold">{profile.portal_password || "N/A"}</span></p>
                  </div>
                  <div className={`p-4 rounded-xl border ${isDark ? "bg-[#0c1836] border-[#1a2d59]" : "bg-purple-50/50 border-purple-200"}`}>
                    <p className="text-xs font-bold text-purple-600 mb-1">Parent Portal Access</p>
                    <p className="text-xs">Parent Username: <span className="font-mono font-bold">{profile.parent_username || "N/A"}</span></p>
                    <p className="text-xs">Parent Password: <span className="font-mono font-bold">{profile.parent_password || "N/A"}</span></p>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <h2 className={`text-sm sm:text-base font-bold mb-4 ${isDark ? "text-white" : "text-[#0a1b39]"}`}>
                  Academic &amp; Mentor Summary
                </h2>
                <div className="grid grid-cols-1 min-[360px]:grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3 mb-6">
                  <div className={`p-3.5 rounded-xl border text-center ${isDark ? "bg-[#0c1836] border-[#1a2d59]" : "bg-[#f8fbff] border-[#e2edf8]"}`}>
                    <span className="block text-sm font-bold text-slate-400">{profile.term_credits || "Semester 1"}</span>
                    <span className="text-[11px] font-bold text-slate-500">Term Credits</span>
                  </div>
                  <div className={`p-3.5 rounded-xl border text-center ${isDark ? "bg-[#0c1836] border-[#1a2d59]" : "bg-[#f8fbff] border-[#e2edf8]"}`}>
                    <span className="block text-xl font-black text-blue-600">{profile.topics_count || 12}</span>
                    <span className="text-[11px] font-bold text-slate-500">Topics Assigned</span>
                  </div>
                  <div className={`p-3.5 rounded-xl border text-center ${isDark ? "bg-[#0c1836] border-[#1a2d59]" : "bg-[#f8fbff] border-[#e2edf8]"}`}>
                    <span className="block text-xl font-black text-purple-600">{profile.hands_on_labs || 4}</span>
                    <span className="text-[11px] font-bold text-slate-500">Hands-on Labs</span>
                  </div>
                </div>

                {profile.mentor && (
                  <div className={`p-4 rounded-xl border flex items-center justify-between gap-4 ${isDark ? "bg-[#0c1836] border-[#1a2d59]" : "bg-[#eff6ff] border-[#bfdbfe]"}`}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center">
                        {profile.mentor.name?.substring(0, 2).toUpperCase() || "MT"}
                      </div>
                      <div>
                        <h3 className="text-xs sm:text-sm font-bold">Assigned Mentor: {profile.mentor.name}</h3>
                        <p className="text-[11px] text-slate-500 font-semibold">{profile.mentor.email || profile.mentor.role || "Faculty Mentor"}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}


