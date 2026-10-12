"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  GraduationCap,
  BookOpen,
  Users,
  TrendingUp,
  ShieldCheck,
  Star,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  CheckCircle2,
  X,
  FileText,
  CreditCard,
  Wallet,
  Building,
  Check,
  BadgeCheck,
  Sun,
  SunMedium,
  Moon,
} from "lucide-react";
import styles from "./register.module.css";

export default function RegisterPage() {
  const router = useRouter();

  const dobInputRef = useRef<HTMLInputElement>(null);

  const handleOpenDatePicker = () => {
    if (dobInputRef.current) {
      if (dobInputRef.current.type !== "date") {
        dobInputRef.current.type = "date";
      }
      dobInputRef.current.focus();
      try {
        if (typeof dobInputRef.current.showPicker === "function") {
          dobInputRef.current.showPicker();
        }
      } catch {
        // Fallback or ignore if already open
      }
    }
  };

  // 4-Step Flow: 1: Personal Details -> 2: Timing & Plan Selection -> 3: Payment -> 4: Complete
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

  // Step 1: Personal Details Form Data
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    dob: "",
    guardianName: "",
    guardianPhone: "",
    address: "",
    agreeTerms: true,
  });

  // Step 2: Preferred Batch Timing ("Morning" | "Afternoon" | "Evening")
  const [batchTiming, setBatchTiming] = useState<"Morning" | "Afternoon" | "Evening">("Morning");

  // Step 2: Selected Plan ("placement" | "without_placement")
  const [selectedPlan, setSelectedPlan] = useState<"placement" | "without_placement">("placement");

  // Step 3: Payment Details State
  const [paymentOption, setPaymentOption] = useState<"full" | "installment">("full");
  const [paymentMethod, setPaymentMethod] = useState<"upi" | "card" | "netbanking">("upi");
  const [confirmPayment, setConfirmPayment] = useState(true);

  // Status & Modal states
  const [errorMsg, setErrorMsg] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

  // Step 4 Confirmation Identifiers
  const [registrationId, setRegistrationId] = useState("NIM-2026-78412");
  const [transactionId, setTransactionId] = useState("TXN-98421045");

  // Close Terms modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowTermsModal(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errorMsg) setErrorMsg("");
  };

  const handleAcceptTerms = () => {
    setFormData((prev) => ({ ...prev, agreeTerms: true }));
    setShowTermsModal(false);
    if (errorMsg === "You must agree to the Terms & Conditions.") {
      setErrorMsg("");
    }
  };

  // Step 1 Validation & Proceed to Step 2
  const handleProceedToStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim()) {
      setErrorMsg("Please enter your full name.");
      return;
    }
    if (!formData.email.trim() || !formData.email.includes("@")) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }
    if (!formData.phone.trim()) {
      setErrorMsg("Please enter your phone number.");
      return;
    }
    if (!formData.dob) {
      setErrorMsg("Please select your date of birth.");
      return;
    }
    if (!formData.guardianName.trim()) {
      setErrorMsg("Please enter parent/guardian name.");
      return;
    }
    if (!formData.guardianPhone.trim()) {
      setErrorMsg("Please enter parent/guardian phone number.");
      return;
    }
    if (!formData.address.trim()) {
      setErrorMsg("Please enter your address.");
      return;
    }

    setErrorMsg("");
    setCurrentStep(2);
  };

  // Step 2 Proceed to Step 3 Payment
  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.agreeTerms) {
      setErrorMsg("You must agree to the Terms & Conditions.");
      return;
    }

    setErrorMsg("");
    setCurrentStep(3);
  };

  // Step 3 Complete Payment & Advance to Step 4 Complete (Connect to Django API)
  const handleCompletePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirmPayment) {
      setErrorMsg("Please confirm the payment authorization to proceed.");
      return;
    }

    setErrorMsg("");
    setIsProcessing(true);

    const generatedRegId = `NIM-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    const generatedTxnId = `TXN-${Math.floor(10000000 + Math.random() * 90000000)}`;

    const totalCourseFee = selectedPlan === "placement" ? 90000 : 60000;
    const paymentOptStr = paymentOption === "installment" ? "2 Installments" : "Full Payment";
    const amountToPay = paymentOption === "installment" ? (totalCourseFee / 2) : totalCourseFee;
    const balanceDue = paymentOption === "installment" ? (totalCourseFee / 2) : 0;

    const payload = {
      student_id: generatedRegId,
      name: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      dob: formData.dob,
      guardian_name: formData.guardianName,
      guardian_phone: formData.guardianPhone,
      address: formData.address,
      timing_preference: batchTiming,
      plan: selectedPlan === "placement" ? "Placement Included" : "Without Placement",
      payment_option: paymentOptStr,
      total_fee: totalCourseFee,
      amount: amountToPay,
      balance_due: balanceDue,
      payment_method: paymentMethod,
      transaction_id: generatedTxnId,
      course: "Generative AI & LLMs"
    };

    try {
      const res = await fetch("http://127.0.0.1:8000/api/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const resData = await res.json();
        setRegistrationId(resData.student_id || generatedRegId);
        setTransactionId(resData.transaction_id || generatedTxnId);
      } else {
        setRegistrationId(generatedRegId);
        setTransactionId(generatedTxnId);
      }
    } catch (err) {
      console.warn("Could not reach Django API, continuing local fallback:", err);
      setRegistrationId(generatedRegId);
      setTransactionId(generatedTxnId);
    } finally {
      setTimeout(() => {
        setIsProcessing(false);
        setCurrentStep(4);
      }, 800);
    }
  };

  return (
    <div className={styles.mainContainer}>
      {/* =========================================================================
          LEFT PANEL: Full-Height NIM Academy Promotional Hero Section
          ========================================================================= */}
      <section className={styles.leftHeroSection}>
        {/* Top Branding */}
        <div className={styles.heroBrand}>
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
            <h2 className={styles.heroBrandTitle}>NIM Academy</h2>
            <p className={styles.heroBrandSub}>Learn | Grow | Build Your Future</p>
          </div>
        </div>

        {/* Center Content */}
        <div className={styles.heroCenter}>
          <div className={styles.heroEyebrow}>
            <span className={styles.cyanLine} />
            <span className={styles.eyebrowText}>YOUR FUTURE STARTS HERE</span>
          </div>

          <h1 className={styles.heroHeadline}>
            Education Today
            <br />
            for a <span className={styles.highlightText}>Brighter</span>
            <br />
            <span className={styles.highlightText}>Tomorrow</span>
          </h1>

          <p className={styles.heroDesc}>
            Join NIM Academy and take the next step towards your successful career.
          </p>

          {/* 2x2 Feature Cards Grid */}
          <div className={styles.heroCardsGrid}>
            <div className={styles.featureCard}>
              <div className="flex items-center gap-2">
                <div className={styles.featureIconWrap}>
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <h3 className={styles.featureTitle}>Quality Courses</h3>
                  <p className={styles.featureSub}>Industry relevant</p>
                </div>
              </div>
              <ChevronRight className="w-3.5 h-3.5 opacity-60 ml-1" />
            </div>

            <div className={styles.featureCard}>
              <div className="flex items-center gap-2">
                <div className={styles.featureIconWrap}>
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <h3 className={styles.featureTitle}>Expert Mentors</h3>
                  <p className={styles.featureSub}>Learn from pros</p>
                </div>
              </div>
              <ChevronRight className="w-3.5 h-3.5 opacity-60 ml-1" />
            </div>

            <div className={styles.featureCard}>
              <div className="flex items-center gap-2">
                <div className={styles.featureIconWrap}>
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div>
                  <h3 className={styles.featureTitle}>Career Support</h3>
                  <p className={styles.featureSub}>Guidance &amp; jobs</p>
                </div>
              </div>
              <ChevronRight className="w-3.5 h-3.5 opacity-60 ml-1" />
            </div>

            <div className={styles.featureCard}>
              <div className="flex items-center gap-2">
                <div className={styles.featureIconWrap}>
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className={styles.featureTitle}>Certified</h3>
                  <p className={styles.featureSub}>Global credentials</p>
                </div>
              </div>
              <ChevronRight className="w-3.5 h-3.5 opacity-60 ml-1" />
            </div>
          </div>
        </div>

        {/* Bottom 3-Column Statistics Bar */}
        <div className={styles.statsBar}>
          <div className="flex items-center gap-2.5">
            <GraduationCap className="w-7 h-7 text-white stroke-[2]" />
            <div>
              <div className={styles.statVal}>5K+</div>
              <div className={styles.statLbl}>Students</div>
            </div>
          </div>

          <div className={styles.statDivider} />

          <div className="flex items-center gap-2.5">
            <BookOpen className="w-7 h-7 text-white stroke-[2]" />
            <div>
              <div className={styles.statVal}>200+</div>
              <div className={styles.statLbl}>Courses</div>
            </div>
          </div>

          <div className={styles.statDivider} />

          <div className="flex items-center gap-2.5">
            <Star className="w-7 h-7 text-white fill-white stroke-none" />
            <div>
              <div className={styles.statVal}>95%</div>
              <div className={styles.statLbl}>Success Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          RIGHT PANEL: Registration Form Card
          ========================================================================= */}
      <section className={styles.rightFormSection}>
        {/* Top Login Link Header */}
        <div className={styles.topLoginHeader}>
          <span className={styles.alreadyText}>Already have an account?</span>
          <Link href="/login" className={styles.loginBtn}>
            Login Here
          </Link>
        </div>

        {/* Central Registration Card */}
        <div className={styles.registerCard}>
          {/* Header */}
          <div className={styles.brandHeader}>
            <div className="w-12 h-12 mx-auto mb-2.5 rounded-2xl bg-blue-50/90 border border-blue-100 p-1.5 flex items-center justify-center shadow-sm">
              <Image
                src="/nimlogo.webp"
                alt="NIM Academy Logo"
                width={36}
                height={44}
                className="w-full h-full object-contain"
                priority
              />
            </div>
            <h1 className={styles.cardMainTitle}>
              {currentStep === 1 && "Personal Details"}
              {currentStep === 2 && "Timing & Plan Selection"}
              {currentStep === 3 && "Payment Details"}
              {currentStep === 4 && "Registration Complete"}
            </h1>
            <p className={styles.cardSubtitle}>
              {currentStep === 1 && "Step 1 of 4: Enter your personal and guardian information"}
              {currentStep === 2 && "Step 2 of 4: Select preferred batch timing and program plan"}
              {currentStep === 3 && "Step 3 of 4: Select payment option and confirm course fee"}
              {currentStep === 4 && "Step 4 of 4: Your admission and account setup are confirmed"}
            </p>
          </div>

          {/* =========================================================================
              4-STEP PROGRESS INDICATOR:
              1: Personal Details -> 2: Timing & Plan -> 3: Payment -> 4: Complete
              ========================================================================= */}
          <div className={styles.progressWrap}>
            <div className={styles.progressFlex}>
              <div className={styles.progressLineBg} />
              <div
                className={styles.progressLineActive}
                style={{
                  width:
                    currentStep === 1
                      ? "0%"
                      : currentStep === 2
                      ? "33.3%"
                      : currentStep === 3
                      ? "66.6%"
                      : "100%",
                }}
              />

              {/* Step 1: Personal Details */}
              <div className={styles.stepNode}>
                <div
                  className={`${styles.stepCircle} ${
                    currentStep > 1
                      ? styles.stepComplete
                      : currentStep === 1
                      ? styles.stepActive
                      : styles.stepInactive
                  }`}
                >
                  {currentStep > 1 ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : "1"}
                </div>
                <span
                  className={styles.stepLabel}
                  style={{
                    color: currentStep === 1 ? "#0066fe" : currentStep > 1 ? "#10b981" : "#94a3b8",
                  }}
                >
                  Personal
                </span>
              </div>

              {/* Step 2: Timing & Plan Selection */}
              <div className={styles.stepNode}>
                <div
                  className={`${styles.stepCircle} ${
                    currentStep > 2
                      ? styles.stepComplete
                      : currentStep === 2
                      ? styles.stepActive
                      : styles.stepInactive
                  }`}
                >
                  {currentStep > 2 ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : "2"}
                </div>
                <span
                  className={styles.stepLabel}
                  style={{
                    color: currentStep === 2 ? "#0066fe" : currentStep > 2 ? "#10b981" : "#94a3b8",
                  }}
                >
                  Timing &amp; Plan
                </span>
              </div>

              {/* Step 3: Payment */}
              <div className={styles.stepNode}>
                <div
                  className={`${styles.stepCircle} ${
                    currentStep > 3
                      ? styles.stepComplete
                      : currentStep === 3
                      ? styles.stepActive
                      : styles.stepInactive
                  }`}
                >
                  {currentStep > 3 ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : "3"}
                </div>
                <span
                  className={styles.stepLabel}
                  style={{
                    color: currentStep === 3 ? "#0066fe" : currentStep > 3 ? "#10b981" : "#94a3b8",
                  }}
                >
                  Payment
                </span>
              </div>

              {/* Step 4: Complete */}
              <div className={styles.stepNode}>
                <div
                  className={`${styles.stepCircle} ${
                    currentStep === 4 ? styles.stepComplete : styles.stepInactive
                  }`}
                >
                  {currentStep === 4 ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : "4"}
                </div>
                <span
                  className={styles.stepLabel}
                  style={{ color: currentStep === 4 ? "#10b981" : "#94a3b8" }}
                >
                  Complete
                </span>
              </div>
            </div>
          </div>

          {/* Error Banner */}
          {errorMsg && <div className={styles.errorBanner}>{errorMsg}</div>}

          {/* =========================================================================
              STEP 1: PERSONAL DETAILS
              ========================================================================= */}
          {currentStep === 1 && (
            <form onSubmit={handleProceedToStep2}>
              <div className={styles.personalGrid}>
                {/* Full Name */}
                <div>
                  <label className={styles.fieldLabel}>
                    Full Name <span className={styles.reqStar}>*</span>
                  </label>
                  <div className={styles.inputWrap}>
                    <User className={styles.inputIcon} />
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="Enter full name"
                      className={styles.textInput}
                      required
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div>
                  <label className={styles.fieldLabel}>
                    Email Address <span className={styles.reqStar}>*</span>
                  </label>
                  <div className={styles.inputWrap}>
                    <Mail className={styles.inputIcon} />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter email address"
                      className={styles.textInput}
                      required
                    />
                  </div>
                </div>

                {/* Phone Number */}
                <div>
                  <label className={styles.fieldLabel}>
                    Phone Number <span className={styles.reqStar}>*</span>
                  </label>
                  <div className={styles.inputWrap}>
                    <Phone className={styles.inputIcon} />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Enter phone number"
                      className={styles.textInput}
                      required
                    />
                  </div>
                </div>

                {/* Date of Birth */}
                <div>
                  <label className={styles.fieldLabel} htmlFor="dobInput">
                    Date of Birth <span className={styles.reqStar}>*</span>
                  </label>
                  <div
                    className={`${styles.inputWrap} ${styles.dateInputWrap}`}
                    onClick={handleOpenDatePicker}
                  >
                    <Calendar className={styles.inputIcon} />
                    <input
                      id="dobInput"
                      ref={dobInputRef}
                      type={formData.dob ? "date" : "text"}
                      name="dob"
                      value={formData.dob}
                      onChange={handleChange}
                      placeholder="dd - mm - yyyy"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenDatePicker();
                      }}
                      onFocus={(e) => {
                        if (e.target.type !== "date") {
                          e.target.type = "date";
                        }
                        try {
                          if (typeof e.target.showPicker === "function") {
                            e.target.showPicker();
                          }
                        } catch {}
                      }}
                      onBlur={(e) => {
                        if (!e.target.value) {
                          e.target.type = "text";
                        }
                      }}
                      className={`${styles.textInput} ${styles.dateInput}`}
                      required
                      max={new Date().toISOString().split("T")[0]}
                    />
                  </div>
                </div>

                {/* Parent/Guardian Name */}
                <div>
                  <label className={styles.fieldLabel}>
                    Parent/Guardian Name <span className={styles.reqStar}>*</span>
                  </label>
                  <div className={styles.inputWrap}>
                    <User className={styles.inputIcon} />
                    <input
                      type="text"
                      name="guardianName"
                      value={formData.guardianName}
                      onChange={handleChange}
                      placeholder="Parent/guardian name"
                      className={styles.textInput}
                      required
                    />
                  </div>
                </div>

                {/* Parent/Guardian Phone */}
                <div>
                  <label className={styles.fieldLabel}>
                    Parent/Guardian Phone <span className={styles.reqStar}>*</span>
                  </label>
                  <div className={styles.inputWrap}>
                    <Phone className={styles.inputIcon} />
                    <input
                      type="tel"
                      name="guardianPhone"
                      value={formData.guardianPhone}
                      onChange={handleChange}
                      placeholder="Parent/guardian phone"
                      className={styles.textInput}
                      required
                    />
                  </div>
                </div>

                {/* Address (Spans 2 columns) */}
                <div className={styles.fullCol}>
                  <label className={styles.fieldLabel}>
                    Address <span className={styles.reqStar}>*</span>
                  </label>
                  <div className={styles.inputWrap}>
                    <MapPin className={styles.inputIcon} />
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Enter full address"
                      className={styles.textInput}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Next Button */}
              <button type="submit" className={styles.submitBtn}>
                <span>Next: Timing &amp; Plan Selection</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          )}

          {/* =========================================================================
              STEP 2: PREFERRED BATCH TIMING & PLAN SELECTION
              ========================================================================= */}
          {currentStep === 2 && (
            <form onSubmit={handleProceedToPayment}>
              {/* 1. Preferred Batch Timing (Morning, Afternoon, Evening ONLY - No time range string) */}
              <div className={styles.sectionHeader}>
                <h3 className={styles.sectionTitle}>Preferred Batch Timing</h3>
                <span className={styles.sectionSub}>Select 1 timing</span>
              </div>

              <div className={styles.timingGrid}>
                {/* Morning */}
                <button
                  type="button"
                  onClick={() => setBatchTiming("Morning")}
                  className={`${styles.timingCard} ${
                    batchTiming === "Morning" ? styles.timingCardSelected : ""
                  }`}
                >
                  <Sun className="w-4 h-4 text-amber-500" />
                  <span className={styles.timingTitle}>Morning</span>
                </button>

                {/* Afternoon */}
                <button
                  type="button"
                  onClick={() => setBatchTiming("Afternoon")}
                  className={`${styles.timingCard} ${
                    batchTiming === "Afternoon" ? styles.timingCardSelected : ""
                  }`}
                >
                  <SunMedium className="w-4 h-4 text-orange-500" />
                  <span className={styles.timingTitle}>Afternoon</span>
                </button>

                {/* Evening */}
                <button
                  type="button"
                  onClick={() => setBatchTiming("Evening")}
                  className={`${styles.timingCard} ${
                    batchTiming === "Evening" ? styles.timingCardSelected : ""
                  }`}
                >
                  <Moon className="w-4 h-4 text-indigo-500" />
                  <span className={styles.timingTitle}>Evening</span>
                </button>
              </div>

              {/* 2. Plan Selection */}
              <div className={styles.sectionHeader}>
                <h3 className={styles.sectionTitle}>Plan Selection</h3>
                <span className={styles.sectionSub}>Select 1 plan</span>
              </div>

              <div className={styles.planGrid}>
                {/* Placement Included */}
                <button
                  type="button"
                  onClick={() => setSelectedPlan("placement")}
                  className={`${styles.planCard} ${
                    selectedPlan === "placement" ? styles.planCardSelected : ""
                  }`}
                >
                  <div className={styles.planRadioTitle}>
                    <div className={styles.radioCircle}>
                      {selectedPlan === "placement" && <div className={styles.radioDot} />}
                    </div>
                    <span className={styles.planTitle}>Placement Included</span>
                  </div>
                  <span className={styles.planPrice}>₹90,000</span>
                </button>

                {/* Without Placement */}
                <button
                  type="button"
                  onClick={() => setSelectedPlan("without_placement")}
                  className={`${styles.planCard} ${
                    selectedPlan === "without_placement" ? styles.planCardSelected : ""
                  }`}
                >
                  <div className={styles.planRadioTitle}>
                    <div className={styles.radioCircle}>
                      {selectedPlan === "without_placement" && <div className={styles.radioDot} />}
                    </div>
                    <span className={styles.planTitle}>Without Placement</span>
                  </div>
                  <span className={styles.planPrice}>₹60,000</span>
                </button>
              </div>

              {/* Selected Plan Summary Banner */}
              <div className={styles.summaryBanner}>
                <div>
                  <span className={styles.summaryLabel}>Selected Plan &amp; Timing</span>
                  <span className={styles.summaryVal}>
                    {selectedPlan === "placement" ? "Placement Included" : "Without Placement"} • {batchTiming} Batch
                  </span>
                </div>
                <span className={styles.summaryPrice}>
                  {selectedPlan === "placement" ? "₹90,000" : "₹60,000"}
                </span>
              </div>

              {/* Checkbox */}
              <div className={styles.checkboxWrap}>
                <input
                  type="checkbox"
                  id="agreeTerms"
                  name="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={handleChange}
                  className={styles.checkboxInput}
                  required
                />
                <label htmlFor="agreeTerms" className={styles.checkboxLabel}>
                  I agree to the{" "}
                  <button
                    type="button"
                    onClick={() => setShowTermsModal(true)}
                    className={styles.blueBold}
                  >
                    Terms &amp; Conditions
                  </button>{" "}
                  and <span className={styles.blueBold}>Privacy Policy</span>
                </label>
              </div>

              <div className={styles.btnGroup}>
                <button
                  type="button"
                  onClick={() => {
                    setErrorMsg("");
                    setCurrentStep(1);
                  }}
                  className={styles.backBtn}
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>

                <button type="submit" className={styles.submitBtnGroup}>
                  <span>Next: Proceed to Payment</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          )}

          {/* =========================================================================
              STEP 3: PAYMENT DETAILS
              ========================================================================= */}
          {currentStep === 3 && (
            <form onSubmit={handleCompletePayment} className="space-y-2.5 pt-0.5">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-slate-500 font-semibold">Selected Program</span>
                  <span className="font-bold text-[#0066fe] bg-blue-500/10 px-2 py-0.5 rounded">
                    {selectedPlan === "placement" ? "Placement Included" : "Without Placement"} ({batchTiming})
                  </span>
                </div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-slate-500 font-semibold">Tuition Fee</span>
                  <span className="font-bold text-slate-800">
                    {selectedPlan === "placement" ? "₹1,00,000" : "₹70,000"}
                  </span>
                </div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-emerald-600 font-semibold">Early Scholar Discount</span>
                  <span className="text-emerald-600 font-bold">- ₹10,000</span>
                </div>
                <div className="pt-1.5 border-t border-slate-200 flex items-center justify-between">
                  <span className="font-bold text-slate-800">Total Fee</span>
                  <span className="text-base font-black text-[#0066fe]">
                    {selectedPlan === "placement" ? "₹90,000" : "₹60,000"}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Payment Option <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentOption("full")}
                    className={`p-2 rounded-lg border text-left cursor-pointer ${
                      paymentOption === "full"
                        ? "border-[#0066fe] bg-blue-50/50"
                        : "border-slate-200"
                    }`}
                  >
                    <span className="text-xs font-bold text-slate-900 block">Full Payment</span>
                    <span className="text-xs font-black text-[#0066fe]">
                      {selectedPlan === "placement" ? "₹90,000" : "₹60,000"}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentOption("installment")}
                    className={`p-2 rounded-lg border text-left cursor-pointer ${
                      paymentOption === "installment"
                        ? "border-[#0066fe] bg-blue-50/50"
                        : "border-slate-200"
                    }`}
                  >
                    <span className="text-xs font-bold text-slate-900 block">2 Installments</span>
                    <span className="text-xs font-black text-[#0066fe]">
                      {selectedPlan === "placement" ? "₹45,000" : "₹30,000"}
                    </span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Payment Method <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("upi")}
                    className={`p-1.5 rounded-lg border text-center flex flex-col items-center gap-0.5 ${
                      paymentMethod === "upi"
                        ? "border-[#0066fe] bg-blue-50/50 text-[#0066fe] font-bold"
                        : "border-slate-200 text-slate-600 font-medium"
                    }`}
                  >
                    <Wallet className="w-3.5 h-3.5" />
                    <span className="text-[11px]">UPI / QR</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod("card")}
                    className={`p-1.5 rounded-lg border text-center flex flex-col items-center gap-0.5 ${
                      paymentMethod === "card"
                        ? "border-[#0066fe] bg-blue-50/50 text-[#0066fe] font-bold"
                        : "border-slate-200 text-slate-600 font-medium"
                    }`}
                  >
                    <CreditCard className="w-3.5 h-3.5" />
                    <span className="text-[11px]">Debit / Card</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod("netbanking")}
                    className={`p-1.5 rounded-lg border text-center flex flex-col items-center gap-0.5 ${
                      paymentMethod === "netbanking"
                        ? "border-[#0066fe] bg-blue-50/50 text-[#0066fe] font-bold"
                        : "border-slate-200 text-slate-600 font-medium"
                    }`}
                  >
                    <Building className="w-3.5 h-3.5" />
                    <span className="text-[11px]">Net Banking</span>
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-0.5">
                <input
                  type="checkbox"
                  id="confirmPayment"
                  checked={confirmPayment}
                  onChange={(e) => setConfirmPayment(e.target.checked)}
                  className="w-3.5 h-3.5 rounded text-[#0066fe] accent-[#0066fe] cursor-pointer shrink-0"
                  required
                />
                <label htmlFor="confirmPayment" className="text-xs text-slate-600 font-medium select-none cursor-pointer">
                  I confirm payment authorization for NIM Academy student enrollment.
                </label>
              </div>

              <div className={styles.btnGroup}>
                <button
                  type="button"
                  onClick={() => {
                    setErrorMsg("");
                    setCurrentStep(2);
                  }}
                  className={styles.backBtn}
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className={styles.submitBtnGroup}
                >
                  {isProcessing ? (
                    <span>Processing Payment...</span>
                  ) : (
                    <>
                      <span>Make Payment</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* =========================================================================
              STEP 4: REGISTRATION COMPLETE
              ========================================================================= */}
          {currentStep === 4 && (
            <div className="text-center py-1.5 space-y-2.5">
              <div className="w-12 h-12 rounded-full bg-emerald-500/15 text-emerald-500 border border-emerald-500/30 flex items-center justify-center mx-auto shadow-md">
                <BadgeCheck className="w-7 h-7 stroke-[2.2]" />
              </div>

              <div>
                <h3 className="text-lg font-black text-slate-900 tracking-tight">
                  Registration Complete!
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Your student enrollment and payment have been confirmed.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-left space-y-1.5 text-xs">
                <div className="flex items-center justify-between pb-1 border-b border-slate-200">
                  <span className="text-slate-500 font-medium">Student Name</span>
                  <span className="font-bold text-slate-900">{formData.fullName || "Student"}</span>
                </div>

                <div className="flex items-center justify-between pb-1 border-b border-slate-200">
                  <span className="text-slate-500 font-medium">Batch Timing</span>
                  <span className="font-bold text-[#0066fe]">{batchTiming} Batch</span>
                </div>

                <div className="flex items-center justify-between pb-1 border-b border-slate-200">
                  <span className="text-slate-500 font-medium">Enrolled Plan</span>
                  <span className="font-bold text-slate-900">
                    {selectedPlan === "placement" ? "Placement Included (₹90,000)" : "Without Placement (₹60,000)"}
                  </span>
                </div>

                <div className="flex items-center justify-between pb-1 border-b border-slate-200">
                  <span className="text-slate-500 font-medium">Registration ID</span>
                  <span className="font-mono font-bold text-[#0066fe] bg-blue-500/10 px-2 py-0.5 rounded">
                    {registrationId}
                  </span>
                </div>

                <div className="flex items-center justify-between pb-1 border-b border-slate-200">
                  <span className="text-slate-500 font-medium">Payment Option</span>
                  <span className="font-bold text-[#0066fe]">
                    {paymentOption === "installment" ? "2 Installments" : "Full Payment"}
                  </span>
                </div>

                <div className="flex items-center justify-between pb-1 border-b border-slate-200">
                  <span className="text-slate-500 font-medium">Amount Paid</span>
                  <span className="font-bold text-emerald-600">
                    {paymentOption === "installment" 
                      ? `₹${((selectedPlan === "placement" ? 90000 : 60000) / 2).toLocaleString()} (1st Installment)`
                      : `₹${(selectedPlan === "placement" ? 90000 : 60000).toLocaleString()}`}
                  </span>
                </div>

                {paymentOption === "installment" && (
                  <div className="flex items-center justify-between pb-1 border-b border-slate-200">
                    <span className="text-slate-500 font-medium">Remaining Balance</span>
                    <span className="font-bold text-amber-600">
                      ₹{((selectedPlan === "placement" ? 90000 : 60000) / 2).toLocaleString()} (2nd Installment Due)
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Payment Status</span>
                  {paymentOption === "installment" ? (
                    <span className="inline-flex items-center gap-1 font-bold text-blue-600 bg-blue-500/10 px-2 py-0.5 rounded-full">
                      <CheckCircle2 className="w-3 h-3" /> 1st Installment Paid
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                      <CheckCircle2 className="w-3 h-3" /> Paid &amp; Confirmed
                    </span>
                  )}
                </div>
              </div>

              <Link
                href="/login"
                className="w-full py-2.5 px-3 rounded-lg bg-[#0066fe] hover:bg-[#0052cc] text-white font-bold text-xs flex items-center justify-center gap-1.5 transition block text-center"
              >
                <span>Proceed to Student Login</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </div>

        {/* Bottom Footer */}
        <footer className={styles.footerText}>
          <span>© 2026 NIM Academy. All rights reserved.</span>
          <button
            type="button"
            onClick={() => setShowTermsModal(true)}
            className="hover:text-slate-600 focus:outline-none"
          >
            Terms &amp; Conditions
          </button>
        </footer>
      </section>

      {/* =========================================================================
          TERMS & CONDITIONS MODAL
          ========================================================================= */}
      {showTermsModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setShowTermsModal(false)}
        >
          <div
            className="w-full max-w-xl bg-white border border-slate-200 rounded-2xl p-5 shadow-2xl relative max-h-[85vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#0066fe]" />
                <h3 className="text-base font-black text-slate-900">Terms &amp; Conditions</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowTermsModal(false)}
                className="w-7 h-7 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="overflow-y-auto py-3 space-y-3 text-xs text-slate-600 leading-relaxed pr-1">
              <p>
                By registering at NIM Academy, you agree to abide by academic integrity policies, attendance standards (minimum 85%), and code of conduct.
              </p>
              <p>
                All curriculum materials remain intellectual property of NIM Academy.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowTermsModal(false)}
                className="px-4 py-2 rounded-lg border border-slate-200 text-xs font-bold"
              >
                Close
              </button>
              <button
                type="button"
                onClick={handleAcceptTerms}
                className="px-5 py-2 rounded-lg bg-[#0066fe] text-white text-xs font-bold"
              >
                I Agree
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
