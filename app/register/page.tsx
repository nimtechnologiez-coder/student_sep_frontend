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
  Check,
  BadgeCheck,
  Download,
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
  const [confirmPayment, setConfirmPayment] = useState(true);

  // Status & Modal states
  const [errorMsg, setErrorMsg] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

  // Step 4 Confirmation & Invoice Identifiers
  const [registrationId, setRegistrationId] = useState("NIM-2026-78412");
  const [transactionId, setTransactionId] = useState("TXN-98421045");
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [paymentDate, setPaymentDate] = useState("");
  const [invoicePdfBase64, setInvoicePdfBase64] = useState("");
  const [isDownloadingInvoice, setIsDownloadingInvoice] = useState(false);
  const [hasAutoDownloaded, setHasAutoDownloaded] = useState(false);

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

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleChange(e);
    if (emailError) setEmailError("");
  };

  // Helper to check email uniqueness in backend asynchronously
  const checkEmailUnique = async (emailToCheck: string): Promise<boolean> => {
    const trimmed = (emailToCheck || "").trim();
    if (!trimmed || !trimmed.includes("@")) return true;

    setIsCheckingEmail(true);
    const urls = [
      `http://127.0.0.1:8000/api/check-email/?email=${encodeURIComponent(trimmed)}`,
      `http://localhost:8000/api/check-email/?email=${encodeURIComponent(trimmed)}`,
      `${process.env.NEXT_PUBLIC_API_URL || "https://student-sep-backend.onrender.com"}/api/check-email/?email=${encodeURIComponent(trimmed)}`,
    ];
    const uniqueUrls = Array.from(new Set(urls));

    for (const url of uniqueUrls) {
      try {
        const res = await fetch(url, { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          setIsCheckingEmail(false);
          if (data && data.exists) {
            setEmailError("This email address is already registered.");
            return false;
          }
          setEmailError("");
          return true;
        }
      } catch {
        // Fallback to next url
      }
    }
    setIsCheckingEmail(false);
    return true;
  };

  const handleEmailBlur = async () => {
    if (formData.email && formData.email.includes("@")) {
      await checkEmailUnique(formData.email);
    }
  };

  // Helper to trigger direct blob download in browser
  const triggerInvoiceDownload = (data: {
    pdfBase64?: string;
    studentId?: string;
    transactionId?: string;
  }) => {
    const sId = data.studentId || registrationId || "Student";
    if (data.pdfBase64) {
      try {
        const byteCharacters = atob(data.pdfBase64);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: "application/pdf" });
        const blobUrl = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = `Invoice-${sId}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);
        return;
      } catch (e) {
        console.error("PDF base64 auto-download error:", e);
      }
    }
  };

  // Fallback download invoice button handler
  const handleDownloadInvoice = async () => {
    setIsDownloadingInvoice(true);
    try {
      if (invoicePdfBase64) {
        triggerInvoiceDownload({
          pdfBase64: invoicePdfBase64,
          studentId: registrationId,
          transactionId: transactionId,
        });
        setIsDownloadingInvoice(false);
        return;
      }

      const sId = registrationId || "Student";
      const urls = [
        `http://127.0.0.1:8000/api/invoice/download/?student_id=${encodeURIComponent(sId)}&transaction_id=${encodeURIComponent(transactionId)}`,
        `http://localhost:8000/api/invoice/download/?student_id=${encodeURIComponent(sId)}&transaction_id=${encodeURIComponent(transactionId)}`,
        `${process.env.NEXT_PUBLIC_API_URL || "https://student-sep-backend.onrender.com"}/api/invoice/download/?student_id=${encodeURIComponent(sId)}&transaction_id=${encodeURIComponent(transactionId)}`,
      ];
      const uniqueUrls = Array.from(new Set(urls));

      for (const url of uniqueUrls) {
        try {
          const res = await fetch(url, { cache: "no-store" });
          if (res.ok) {
            const blob = await res.blob();
            const blobUrl = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = blobUrl;
            link.download = `Invoice-${sId}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);
            setIsDownloadingInvoice(false);
            return;
          }
        } catch {
          // Fallback to next url
        }
      }
    } catch (err) {
      console.error("Invoice download error:", err);
    } finally {
      setIsDownloadingInvoice(false);
    }
  };

  // Automatically trigger invoice download when entering Step 4
  useEffect(() => {
    if (currentStep === 4 && !hasAutoDownloaded) {
      setHasAutoDownloaded(true);
      const timer = setTimeout(() => {
        if (invoicePdfBase64) {
          triggerInvoiceDownload({
            pdfBase64: invoicePdfBase64,
            studentId: registrationId,
            transactionId: transactionId,
          });
        } else {
          handleDownloadInvoice();
        }
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [currentStep, hasAutoDownloaded, invoicePdfBase64, registrationId, transactionId]);

  const handleAcceptTerms = () => {
    setFormData((prev) => ({ ...prev, agreeTerms: true }));
    setShowTermsModal(false);
    if (errorMsg === "You must agree to the Terms & Conditions.") {
      setErrorMsg("");
    }
  };

  // Step 1 Validation & Proceed to Step 2
  const handleProceedToStep2 = async (e: React.FormEvent) => {
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

    // Check duplicate email validation before proceeding to step 2
    const isUnique = await checkEmailUnique(formData.email);
    if (!isUnique) {
      setEmailError("This email address is already registered.");
      return;
    }

    setErrorMsg("");
    setEmailError("");
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

  // Helper to dynamically load Razorpay checkout script
  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (typeof window !== "undefined" && (window as any).Razorpay) {
        resolve(true);
        return;
      }
      const existingScript = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
      if (existingScript) {
        if ((window as any).Razorpay) {
          resolve(true);
          return;
        }
        existingScript.addEventListener("load", () => resolve(true));
        existingScript.addEventListener("error", () => resolve(false));
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // Helper to call backend create-order endpoint with local & deployed fallbacks
  const createRegistrationOrder = async (orderPayload: any) => {
    const urls = [
      "http://127.0.0.1:8000/api/register/create-order/",
      "http://localhost:8000/api/register/create-order/",
      `${process.env.NEXT_PUBLIC_API_URL || "https://student-sep-backend.onrender.com"}/api/register/create-order/`,
    ];
    const uniqueUrls = Array.from(new Set(urls));
    let lastError = "Could not initialize Razorpay order.";

    for (const url of uniqueUrls) {
      try {
        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(orderPayload),
          cache: "no-store",
        });
        const data = await res.json();
        if (res.ok && data?.success) {
          return data;
        } else if (data?.error) {
          lastError = data.error;
        }
      } catch (err: any) {
        lastError = err?.message || lastError;
      }
    }
    return { success: false, error: lastError };
  };

  // Helper to call registration endpoint with verified Razorpay details
  const submitVerifiedRegistration = async (registrationPayload: any) => {
    const urls = [
      "http://127.0.0.1:8000/api/register/",
      "http://localhost:8000/api/register/",
      `${process.env.NEXT_PUBLIC_API_URL || "https://student-sep-backend.onrender.com"}/api/register/`,
    ];
    const uniqueUrls = Array.from(new Set(urls));
    let lastError = "Could not verify registration with server.";

    for (const url of uniqueUrls) {
      try {
        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(registrationPayload),
          cache: "no-store",
        });
        const data = await res.json();
        if (res.ok && data?.success) {
          return data;
        } else if (data?.error) {
          lastError = data.error;
        }
      } catch (err: any) {
        lastError = err?.message || lastError;
      }
    }
    return { success: false, error: lastError };
  };

  // Step 3 Complete Payment & Advance to Step 4 Complete (Verified Razorpay Gateway)
  const handleCompletePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirmPayment) {
      setErrorMsg("Please confirm the payment authorization to proceed.");
      return;
    }

    setErrorMsg("");
    setIsProcessing(true);

    const totalCourseFee = selectedPlan === "placement" ? 90000 : 60000;
    const paymentOptStr = paymentOption === "installment" ? "2 Installments" : "Full Payment";
    const amountToPay = paymentOption === "installment" ? (totalCourseFee / 2) : totalCourseFee;
    const balanceDue = paymentOption === "installment" ? (totalCourseFee / 2) : 0;

    try {
      // 1. Ensure Razorpay Checkout script is loaded
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded || typeof window === "undefined" || !(window as any).Razorpay) {
        setErrorMsg("Failed to load Razorpay Checkout SDK. Please check your internet connection.");
        setIsProcessing(false);
        return;
      }

      // 2. Create Razorpay order on backend
      const orderRes = await createRegistrationOrder({
        name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        plan: selectedPlan === "placement" ? "Placement Included" : "Without Placement",
        payment_option: paymentOptStr,
        amount: amountToPay,
      });

      if (!orderRes?.success || !orderRes?.order_id) {
        if (
          orderRes?.field === "email" ||
          orderRes?.error?.toLowerCase().includes("email") ||
          orderRes?.error?.includes("already registered")
        ) {
          setEmailError("This email address is already registered.");
          setCurrentStep(1);
        } else {
          setErrorMsg(orderRes?.error || "Could not create Razorpay payment order. Please ensure backend is running.");
        }
        setIsProcessing(false);
        return;
      }

      const razorpayKey = orderRes.key_id || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_ToVcd6rowFmgFn";

      // 3. Connect to Razorpay Checkout popup
      const options: any = {
        key: razorpayKey,
        amount: orderRes.amount_paise || Math.round(amountToPay * 100),
        currency: orderRes.currency || "INR",
        name: "NIM Academy",
        description: `Enrollment Fee: ${selectedPlan === "placement" ? "Placement Included" : "Without Placement"} (${paymentOptStr})`,
        prefill: {
          name: formData.fullName,
          email: formData.email,
          contact: formData.phone,
        },
        notes: {
          plan: selectedPlan,
          batch_timing: batchTiming,
          payment_option: paymentOptStr,
        },
        theme: {
          color: "#0066fe",
        },
        handler: async function (response: {
          razorpay_payment_id: string;
          razorpay_order_id?: string;
          razorpay_signature?: string;
        }) {
          setIsProcessing(true);
          try {
            // 4. Send verified Razorpay tokens to backend
            const verifyPayload = {
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
              payment_method: "Razorpay Checkout",
              razorpay_payment_id: response.razorpay_payment_id || `pay_test_${Date.now().toString().slice(-8)}`,
              razorpay_order_id: response.razorpay_order_id || orderRes.order_id || "order_sandbox_verified",
              razorpay_signature: response.razorpay_signature || "sandbox_simulated_sig",
            };

            const result = await submitVerifiedRegistration(verifyPayload);

            // 5. Only mark PAID and advance to Step 4 after backend verifies signature & status
            if (result?.success) {
              const regId = result.student_id || registrationId;
              const txnId = result.transaction_id || response.razorpay_payment_id;
              const invNum = result.invoice_number || `INV-${regId}`;
              const payDate = result.payment_date || new Date().toLocaleDateString("en-GB", { day: '2-digit', month: 'short', year: 'numeric' });
              const pdfB64 = result.invoice_pdf_base64 || "";

              setRegistrationId(regId);
              setTransactionId(txnId);
              setInvoiceNumber(invNum);
              setPaymentDate(payDate);
              setInvoicePdfBase64(pdfB64);
              setCurrentStep(4);

              if (pdfB64) {
                triggerInvoiceDownload({
                  pdfBase64: pdfB64,
                  studentId: regId,
                  transactionId: txnId,
                });
              }
            } else {
              if (
                result?.field === "email" ||
                result?.error?.toLowerCase().includes("email") ||
                result?.error?.includes("already registered")
              ) {
                setEmailError("This email address is already registered.");
                setCurrentStep(1);
              } else {
                setErrorMsg(result?.error || "Payment verification failed on the server. Please contact admissions.");
              }
            }
          } catch (err: any) {
            setErrorMsg("Payment verification network error: " + (err?.message || "Please contact support."));
          } finally {
            setIsProcessing(false);
          }
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
            setErrorMsg("Payment was cancelled. Please complete payment to confirm your NIM Academy enrollment.");
          },
        },
      };

      // Only attach order_id if it's an authentic Razorpay order (Razorpay JS SDK errors on mock sandbox IDs)
      if (orderRes?.order_id && !orderRes.order_id.startsWith("order_sandbox_") && !orderRes?.is_sandbox) {
        options.order_id = orderRes.order_id;
      }

      try {
        const rzpInstance = new (window as any).Razorpay(options);
        rzpInstance.on("payment.failed", function (resp: any) {
          setIsProcessing(false);
          setErrorMsg(`Payment failed: ${resp.error?.description || "Transaction declined by gateway"}`);
        });
        rzpInstance.open();
        setIsProcessing(false);
      } catch (openErr: any) {
        console.error("Razorpay popup open error:", openErr);
        setErrorMsg("Failed to open Razorpay modal: " + (openErr?.message || "Please check browser popup settings."));
        setIsProcessing(false);
      }
    } catch (err: any) {
      console.error("Razorpay Checkout Error:", err);
      setErrorMsg("Failed to open Razorpay checkout: " + (err?.message || "Unknown error"));
      setIsProcessing(false);
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
                  className={`${styles.stepCircle} ${currentStep > 1
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
                  className={`${styles.stepCircle} ${currentStep > 2
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
                  className={`${styles.stepCircle} ${currentStep > 3
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
                  className={`${styles.stepCircle} ${currentStep === 4 ? styles.stepComplete : styles.stepInactive
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
                  <div className="flex items-center justify-between mb-1">
                    <label className={styles.fieldLabel} style={{ marginBottom: 0 }}>
                      Email Address <span className={styles.reqStar}>*</span>
                    </label>
                    {emailError && (
                      <span className="text-xs font-semibold text-red-600 animate-fadeIn">
                        {emailError}
                      </span>
                    )}
                  </div>
                  <div
                    className={styles.inputWrap}
                    style={
                      emailError
                        ? { borderColor: "#ef4444", boxShadow: "0 0 0 1px #ef4444", backgroundColor: "#fef2f2" }
                        : {}
                    }
                  >
                    <Mail
                      className={styles.inputIcon}
                      style={emailError ? { color: "#ef4444" } : {}}
                    />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleEmailChange}
                      onBlur={handleEmailBlur}
                      placeholder="Enter email address"
                      className={styles.textInput}
                      required
                    />
                    {isCheckingEmail && (
                      <span className="text-xs text-blue-600 font-medium pr-2">Checking...</span>
                    )}
                  </div>
                  {emailError && (
                    <p className="text-xs text-red-600 font-medium mt-1">
                      {emailError}
                    </p>
                  )}
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
                        } catch { }
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
                  className={`${styles.timingCard} ${batchTiming === "Morning" ? styles.timingCardSelected : ""
                    }`}
                >
                  <Sun className="w-4 h-4 text-amber-500" />
                  <span className={styles.timingTitle}>Morning</span>
                </button>

                {/* Afternoon */}
                <button
                  type="button"
                  onClick={() => setBatchTiming("Afternoon")}
                  className={`${styles.timingCard} ${batchTiming === "Afternoon" ? styles.timingCardSelected : ""
                    }`}
                >
                  <SunMedium className="w-4 h-4 text-orange-500" />
                  <span className={styles.timingTitle}>Afternoon</span>
                </button>

                {/* Evening */}
                <button
                  type="button"
                  onClick={() => setBatchTiming("Evening")}
                  className={`${styles.timingCard} ${batchTiming === "Evening" ? styles.timingCardSelected : ""
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
                  className={`${styles.planCard} ${selectedPlan === "placement" ? styles.planCardSelected : ""
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
                  className={`${styles.planCard} ${selectedPlan === "without_placement" ? styles.planCardSelected : ""
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
                    className={`p-2 rounded-lg border text-left cursor-pointer ${paymentOption === "full"
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
                    className={`p-2 rounded-lg border text-left cursor-pointer ${paymentOption === "installment"
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

              <div className="p-2.5 rounded-xl bg-blue-50/70 border border-blue-200/80 flex items-center gap-2.5 text-xs">
                <ShieldCheck className="w-4 h-4 text-[#0066fe] shrink-0" />
                <div className="text-[11px] text-slate-700">
                  <span className="font-bold text-[#0066fe]">Razorpay Test Gateway:</span> Instant popup checkout with Test UPI, Cards, NetBanking, and Wallets.
                </div>
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
                    <span>Opening Razorpay Checkout...</span>
                  ) : (
                    <>
                      <span>Pay with Razorpay &amp; Confirm</span>
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
                  <span className="text-slate-500 font-medium">Registration ID</span>
                  <span className="font-mono font-bold text-[#0066fe] bg-blue-500/10 px-2 py-0.5 rounded">
                    {registrationId}
                  </span>
                </div>

                <div className="flex items-center justify-between pb-1 border-b border-slate-200">
                  <span className="text-slate-500 font-medium">Course Name</span>
                  <span className="font-bold text-slate-900">Generative AI &amp; LLMs</span>
                </div>

                <div className="flex items-center justify-between pb-1 border-b border-slate-200">
                  <span className="text-slate-500 font-medium">Invoice Number</span>
                  <span className="font-mono font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                    {invoiceNumber || `INV-${registrationId}`}
                  </span>
                </div>

                <div className="flex items-center justify-between pb-1 border-b border-slate-200">
                  <span className="text-slate-500 font-medium">Payment Date</span>
                  <span className="font-bold text-slate-900">
                    {paymentDate || new Date().toLocaleDateString("en-GB", { day: '2-digit', month: 'short', year: 'numeric' })}
                  </span>
                </div>

                <div className="flex items-center justify-between pb-1 border-b border-slate-200">
                  <span className="text-slate-500 font-medium">Razorpay Payment ID</span>
                  <span className="font-mono font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                    {transactionId}
                  </span>
                </div>

                <div className="flex items-center justify-between pb-1 border-b border-slate-200">
                  <span className="text-slate-500 font-medium">Enrolled Plan</span>
                  <span className="font-bold text-slate-900">
                    {selectedPlan === "placement" ? "Placement Included (₹90,000)" : "Without Placement (₹60,000)"}
                  </span>
                </div>

                <div className="flex items-center justify-between pb-1 border-b border-slate-200">
                  <span className="text-slate-500 font-medium">Batch Timing</span>
                  <span className="font-bold text-[#0066fe]">{batchTiming} Batch</span>
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
                      <CheckCircle2 className="w-3 h-3" /> 1st Installment Paid (Razorpay Verified)
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                      <CheckCircle2 className="w-3 h-3" /> Paid &amp; Confirmed (Razorpay Verified)
                    </span>
                  )}
                </div>
              </div>

              {/* Auto-download notice */}
              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-center gap-2 text-xs text-emerald-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-[11px] font-medium">
                  Your official PDF invoice has been automatically generated and downloaded.
                </span>
              </div>

              {/* Action buttons: Download Invoice Fallback & Login */}
              <div className="space-y-2 pt-1">
                <button
                  type="button"
                  onClick={handleDownloadInvoice}
                  disabled={isDownloadingInvoice}
                  className="w-full py-2.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>{isDownloadingInvoice ? "Generating PDF Invoice..." : "Download Invoice (PDF)"}</span>
                </button>

                <Link
                  href="/login"
                  className="w-full py-2.5 px-3 rounded-lg bg-[#0066fe] hover:bg-[#0052cc] text-white font-bold text-xs flex items-center justify-center gap-1.5 transition block text-center"
                >
                  <span>Proceed to Student Login</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
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
