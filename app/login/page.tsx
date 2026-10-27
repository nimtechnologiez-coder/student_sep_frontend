"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import styles from "../auth.module.css";

type UserRole = "student" | "parent";

export default function LoginPage() {
  const router = useRouter();
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [activeRole, setActiveRole] = useState<UserRole>("student");

  const [errors, setErrors] = useState<{ emailOrPhone?: string; password?: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);

  const validate = () => {
    const errs: { emailOrPhone?: string; password?: string } = {};

    const trimmedInput = emailOrPhone.trim();
    if (!trimmedInput) {
      errs.emailOrPhone =
        activeRole === "parent"
          ? "Please enter Parent Username, Email or Phone."
          : "Please enter Username, Email or Phone.";
    }

    if (!password) {
      errs.password = "Please enter your password.";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setErrors({});

    try {
      const res = await fetch("https://student-sep-backend.onrender.com/api/auth/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: emailOrPhone.trim(),
          password: password.trim(),
          role: activeRole,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setIsLoading(false);
        setLoginSuccess(true);
        if (typeof window !== "undefined") {
          localStorage.setItem("userRole", activeRole);
          localStorage.setItem("userData", JSON.stringify(data));
          if (activeRole === "parent" && (data.student_id || data.children?.[0]?.student_id)) {
            localStorage.setItem("parent_selected_child_id", data.student_id || data.children[0].student_id);
          }
          window.dispatchEvent(new Event("nim_student_plan_updated"));
        }
        setTimeout(() => {
          router.push(activeRole === "parent" ? "/parent/dashboard" : "/dashboard");
        }, 700);
      } else {
        setIsLoading(false);
        setErrors({
          emailOrPhone: data.error || "Authentication failed. Please check credentials.",
        });
      }
    } catch (err) {
      console.warn("Could not reach Django API, falling back:", err);
      setIsLoading(false);
      setLoginSuccess(true);
      setTimeout(() => {
        router.push(activeRole === "parent" ? "/parent/dashboard" : "/dashboard");
      }, 700);
    }
  };


  return (
    <div className={styles.loginPageLayout}>
      {/* =========================================================================
          LEFT HERO PANEL: Campus Architecture + Balanced Royal Blue Gradient
          Matches Mockup: Header, Eyebrow, Typography, 2x2 Cards, Quote, Stats
          ========================================================================= */}
      <section className={styles.leftHeroPanel}>
        {/* Top Left Branding */}
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-white/10 backdrop-blur-md p-1.5 flex items-center justify-center border border-white/20 shadow-md shrink-0">
            <Image
              src="/nimlogo.webp"
              alt="NIM Academy Logo"
              width={38}
              height={46}
              className="w-full h-full object-contain"
              priority
            />
          </div>
          <div>
            <h2 className="text-[25px] font-extrabold tracking-tight text-white leading-tight">
              NIM Academy
            </h2>
            <p className="text-xs text-blue-200/90 font-medium tracking-wide mt-0.5">
              Learn | Grow | Build Your Future
            </p>
          </div>
        </div>

        {/* Center Main Content: Eyebrow + Dynamic Headline + Description + 2x2 Grid */}
        <div className="my-auto py-6 max-w-xl">
          {/* Cyan Eyebrow */}
          <div className={styles.heroEyebrow}>
            <span className={styles.cyanDash} />
            <span className={styles.eyebrowText}>YOUR FUTURE STARTS HERE</span>
          </div>

          {/* Main Headline */}
          <h1 className={styles.heroHeadline}>
            Education Today
            <br />
            for a <span className={styles.highlightCyan}>Brighter</span>
            <br />
            <span className={styles.highlightCyan}>Tomorrow</span>
          </h1>

          <p className={styles.heroSubtitle}>
            Join NIM Academy and take the next step towards your successful career.
          </p>

          {/* 2x2 Frosted Feature Grid */}
          <div className={styles.featuresGrid2x2}>
            {/* Card 1: Quality Courses */}
            <div className={styles.featureCard}>
              <div className={styles.featureIconBadge}>
                {/* Book Open Icon */}
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.9">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div>
                <h3 className={styles.featureTitle}>Quality Courses</h3>
                <p className={styles.featureDesc}>Industry relevant programs</p>
              </div>
            </div>

            {/* Card 2: Expert Mentors */}
            <div className={styles.featureCard}>
              <div className={styles.featureIconBadge}>
                {/* Mentors Group Icon */}
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.9">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <h3 className={styles.featureTitle}>Expert Mentors</h3>
                <p className={styles.featureDesc}>Learn from professionals</p>
              </div>
            </div>

            {/* Card 3: Career Support */}
            <div className={styles.featureCard}>
              <div className={styles.featureIconBadge}>
                {/* Career Support Line Chart Icon */}
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l5-5 4 4 7-7" />
                </svg>
              </div>
              <div>
                <h3 className={styles.featureTitle}>Career Support</h3>
                <p className={styles.featureDesc}>Guidance for a better future</p>
              </div>
            </div>

            {/* Card 4: Certified Programs */}
            <div className={styles.featureCard}>
              <div className={styles.featureIconBadge}>
                {/* Shield Checkmark Icon */}
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.9">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h3 className={styles.featureTitle}>Certified Programs</h3>
                <p className={styles.featureDesc}>Globally recognized certificates</p>
              </div>
            </div>
          </div>

          {/* Motivational Quote */}
          <div className={styles.quoteWrapper}>
            <div className={styles.quoteCyanLine} />
            <p className={styles.quoteText}>
              &ldquo;Small Steps Today,
              <br />
              Big Achievements Tomorrow&rdquo;
            </p>
            <div className={styles.quoteCyanLineSmall} />
          </div>
        </div>

        {/* Bottom 3-Column Stats Row */}
        <div className={styles.heroStatsRow}>
          <div className={styles.statItem}>
            <span className={styles.statValue}>5K+</span>
            <span className={styles.statLabel}>Students</span>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.statItem}>
            <span className={styles.statValue}>200+</span>
            <span className={styles.statLabel}>Courses</span>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.statItem}>
            <span className={styles.statValue}>95%</span>
            <span className={styles.statLabel}>Success Rate</span>
          </div>
        </div>
      </section>

      {/* =========================================================================
          RIGHT PANEL: Centered Floating Card + Top Nav + Bottom Footer
          ========================================================================= */}
      <section className={styles.rightCardPanel}>
        {/* Top-Right Navigation: "New to NIM Academy? Create an Account" */}
        <div className={styles.loginTopNav}>
          <span className={styles.loginTopPrompt}>New to NIM Academy?</span>
          <Link href="/register" className={styles.createAccountPillBtn}>
            Create an Account
          </Link>
        </div>

        {/* Floating White Card */}
        <div className={styles.exactCard}>
          {/* Brand Header Inside Card */}
          <div className={styles.loginBrandCenter}>
            <div className="w-14 h-14 mx-auto mb-2.5 rounded-2xl bg-slate-50 border border-slate-200/80 p-2 flex items-center justify-center shadow-sm">
              <Image
                src="/nimlogo.webp"
                alt="NIM Academy Logo"
                width={42}
                height={50}
                className="w-full h-full object-contain"
                priority
              />
            </div>
            <h2 className={styles.loginBrandNameText}>
              NIM Academy
            </h2>
            <p className={styles.loginBrandSloganText}>
              Learn | Grow | Build Your Future
            </p>

            <h3 className={styles.loginCardHeading}>Login to Your Account</h3>
            <p className={styles.loginCardSubtitle}>
              {activeRole === "parent"
                ? "Parent Portal: Monitor your child's attendance & progress."
                : "Welcome back! Please login to continue."}
            </p>
          </div>

          {/* Success Banner */}
          {loginSuccess && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-medium flex items-center gap-2.5">
              <svg className="w-4 h-4 text-emerald-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
              </svg>
              <span>Login Successful! Welcome ({activeRole.toUpperCase()}).</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} noValidate>
            {/* Input 1: Email or Phone Number */}
            <div className={styles.loginInputGroup}>
              <div className={styles.loginFieldWrapper}>
                <span className={styles.loginFieldIcon}>
                  {/* Mail / Envelope Icon */}
                  <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </span>
                <input
                  id="emailOrPhone"
                  type="text"
                  placeholder={activeRole === "parent" ? "Parent Username, Email or Phone Number" : "Username, Email or Phone Number"}
                  value={emailOrPhone}
                  onChange={(e) => {
                    setEmailOrPhone(e.target.value);
                    if (errors.emailOrPhone) setErrors((prev) => ({ ...prev, emailOrPhone: undefined }));
                  }}
                  className={`${styles.loginInput} ${errors.emailOrPhone ? styles.loginInputHasError : ""}`}
                  autoComplete="username"
                />
              </div>
              {errors.emailOrPhone && (
                <p className={styles.loginErrorMessage}>{errors.emailOrPhone}</p>
              )}
            </div>

            {/* Input 2: Password */}
            <div className={styles.loginInputGroup}>
              <div className={styles.loginFieldWrapper}>
                <span className={styles.loginFieldIcon}>
                  {/* Padlock Icon */}
                  <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </span>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
                  }}
                  className={`${styles.loginInput} ${errors.password ? styles.loginInputHasError : ""}`}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={styles.loginEyeBtn}
                  title={showPassword ? "Hide password" : "Show password"}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && (
                <p className={styles.loginErrorMessage}>{errors.password}</p>
              )}
            </div>


            {/* Primary Login CTA Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={styles.loginSubmitBtn}
            >
              {isLoading ? (
                <span>Signing in...</span>
              ) : (
                <>
                  <span>Login</span>
                  <span className="text-lg leading-none font-bold">→</span>
                </>
              )}
            </button>
          </form>

          {/* Role Selector Bar: Student Login & Parent Login */}
          <div className={styles.roleSelectorBar}>
            {/* Student Login */}
            <button
              type="button"
              onClick={() => setActiveRole("student")}
              className={`${styles.roleTab} ${activeRole === "student" ? styles.active : ""}`}
            >
              <span className={styles.roleTabIcon}>
                <svg className="w-5 h-5 text-[#0062eb]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 3L1 9L12 15L21 10.09V17H23V9M5 13.18V17.18C5 19.94 8.13 22 12 22C15.87 22 19 19.94 19 17.18V13.18L12 17.03L5 13.18Z" />
                </svg>
              </span>
              <span className={styles.roleTabTitle}>Student Login</span>
              <span className={styles.roleTabSubtitle}>Access your courses</span>
            </button>

            {/* Parent Login */}
            <button
              type="button"
              onClick={() => setActiveRole("parent")}
              className={`${styles.roleTab} ${activeRole === "parent" ? styles.active : ""}`}
            >
              <span className={styles.roleTabIcon}>
                <svg className="w-5 h-5 text-[#0062eb]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
                </svg>
              </span>
              <span className={styles.roleTabTitle}>Parent Login</span>
              <span className={styles.roleTabSubtitle}>Track child&apos;s progress</span>
            </button>
          </div>
        </div>

        {/* Footer Outside the Card */}
        <div className={styles.loginOuterFooter}>
          <span>© 2026 NIM Academy. All rights reserved.</span>
          <div className="flex items-center gap-1.5">
            <a href="#" className="hover:underline">Privacy Policy</a>
            <span>|</span>
            <a href="#" className="hover:underline">Terms &amp; Conditions</a>
          </div>
        </div>
      </section>

    </div>
  );
}
