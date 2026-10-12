"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import DashboardLayout from "@/components/DashboardLayout";
import { useTheme } from "@/components/ThemeProvider";
import { StudentApi } from "@/lib/studentApi";
import { TablePageSkeleton } from "@/components/Skeleton";
import {
  CreditCard,
  CheckCircle2,
  Calendar,
  Download,
  AlertCircle,
  Receipt,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Building2,
  Copy,
  Check,
  Clock,
  Sparkles,
  Percent,
  Wallet,
  FileText,
  ExternalLink,
  ChevronRight,
  X,
  QrCode,
  Lock,
  Smartphone,
  Info,
  DollarSign,
  TrendingUp,
  Printer,
  ChevronDown,
  Loader2,
} from "lucide-react";

interface PaymentRecord {
  id: string;
  invoiceId: string;
  description: string;
  date: string;
  paymentMode: string;
  amount: number;
  status: "Paid" | "Pending";
}

export default function FeesPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [student, setStudent] = useState<any>(null);
  const [kpi, setKpi] = useState<any>(null);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Modals & UI State
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [payMethod, setPayMethod] = useState<"upi" | "card" | "netbanking">("upi");
  const [upiId, setUpiId] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [latestTxnId, setLatestTxnId] = useState("");
  const [copiedField, setCopiedField] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);

    Promise.all([
      StudentApi.getDashboard(),
      StudentApi.getFees(),
    ])
      .then(([dashData, feesData]) => {
        if (dashData?.student) {
          setStudent(dashData.student);
          setUpiId(`${dashData.student.name.toLowerCase().replace(/\s+/g, '')}@upi`);
        }
        if (dashData?.kpi) {
          setKpi(dashData.kpi);
        }

        if (feesData?.payments && Array.isArray(feesData.payments)) {
          const mapped: PaymentRecord[] = feesData.payments.map((p: any, idx: number) => ({
            id: String(p.id ?? idx),
            invoiceId: p.transaction_id || `REC-#${p.id || 1000 + idx}`,
            description: p.installment_name || p.description || "Tuition Fee Installment",
            date: p.payment_date || "Recorded Date",
            paymentMode: p.payment_method || p.payment_mode || "Online Gateway",
            amount: p.amount || 0,
            status: p.status || "Paid",
          }));
          const seen = new Set<string>();
          const uniqueMapped: PaymentRecord[] = [];
          for (const item of mapped) {
            if (!seen.has(item.id)) {
              seen.add(item.id);
              uniqueMapped.push(item);
            }
          }
          setPayments(uniqueMapped);
        } else {
          setPayments([]);
        }
      })
      .catch((err) => {
        console.error("Fees API error:", err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  // Close modals on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setPaymentModalOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Real financial numbers
  const totalProgramFee = kpi?.total_fee ?? 0;
  const totalPaid = kpi?.total_paid ?? 0;
  const totalOutstanding = kpi?.total_due ?? 0;
  const paidPercentage = kpi?.paid_pct ?? 0;
  const nextDueDate = kpi?.next_due_date || "N/A";

  // Simulate Payment Flow
  const handleExecutePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      const newTxn = `TXN_NIM_${Date.now().toString().slice(-8)}`;
      setLatestTxnId(newTxn);
      setPaymentSuccess(true);

      const newRecord: PaymentRecord = {
        id: String(Date.now()),
        invoiceId: `NIM-INV-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        description: "Tuition Fee Installment Payment",
        date: new Date().toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
        paymentMode: payMethod === "upi" ? `UPI (${upiId})` : "Net Banking",
        amount: totalOutstanding > 0 ? totalOutstanding : 10000,
        status: "Paid",
      };
      setPayments((prev) => [newRecord, ...prev]);
    }, 1200);
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <TablePageSkeleton title="Loading Tuition & Payment Dues..." />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-7xl mx-auto pb-12">
        {/* =========================================================================
            1. REAL STUDENT FEES & FINANCIAL BANNER HEADER
            ========================================================================= */}
        <section
          className={`relative overflow-hidden rounded-3xl p-6 sm:p-8 border transition-all shadow-sm ${
            isDark
              ? "bg-gradient-to-r from-[#07132b] via-[#091a3c] to-[#07132b] border-[#15274e] text-white"
              : "bg-gradient-to-r from-white via-[#f0f6fe] to-[#e8f2fe] border-[#d2e4f8] text-[#0a1b39]"
          }`}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 relative z-10">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-[#0062eb] flex items-center justify-center text-white shrink-0 shadow-md shadow-blue-600/30">
                <CreditCard className="w-7 h-7 stroke-[2.2]" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2.5">
                  <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                    Fees, Invoices &amp; Payments
                  </h1>
                  <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Good Standing
                  </span>
                </div>
                <p className={`text-xs sm:text-sm mt-1 font-medium ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                  Student ID: <span className="font-bold text-slate-700 dark:text-slate-200">{student?.student_id || "N/A"}</span> • Program:{" "}
                  <span className="font-bold text-[#0062eb] dark:text-sky-400">
                    {student?.course || "Academic Program"} {student?.batch ? `(${student.batch})` : ""}
                  </span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setPaymentModalOpen(true)}
                className="w-full sm:w-auto justify-center px-5 py-2.5 rounded-xl bg-[#0062eb] hover:bg-[#0052cc] text-white text-xs font-bold transition shadow-md shadow-blue-600/25 flex items-center gap-2 cursor-pointer active:scale-[0.98] min-h-[40px]"
              >
                <Wallet className="w-4 h-4" />
                <span>Pay Fee (₹{totalOutstanding.toLocaleString()})</span>
              </button>
            </div>
          </div>
        </section>

        {/* =========================================================================
            2. REAL 4-COLUMN FINANCIAL STAT METRICS GRID
            ========================================================================= */}
        <section className="grid grid-cols-1 min-[360px]:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div
            className={`p-5 rounded-2xl border transition-all ${
              isDark ? "bg-[#081024] border-[#15274d]" : "bg-white border-[#e2edf8] shadow-sm"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Total Program Fee
              </span>
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-[#0062eb] flex items-center justify-center">
                <Receipt className="w-4 h-4" />
              </div>
            </div>
            <h3 className={`text-xl sm:text-2xl font-black ${isDark ? "text-white" : "text-[#0a1b39]"}`}>
              ₹{totalProgramFee.toLocaleString()}
            </h3>
            <p className="text-[11px] text-slate-400 font-medium mt-1">Course Tuition &amp; Academic Labs</p>
          </div>

          <div
            className={`p-5 rounded-2xl border transition-all ${
              isDark ? "bg-[#081024] border-[#15274d]" : "bg-white border-[#e2edf8] shadow-sm"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Total Paid ({paidPercentage}%)
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/15 text-emerald-600">
                {totalPaid > 0 ? "Partially Paid" : "Pending Start"}
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <h3 className="text-xl sm:text-2xl font-black text-emerald-600">
                ₹{totalPaid.toLocaleString()}
              </h3>
            </div>
            <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden mt-2">
              <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${Math.min(100, paidPercentage)}%` }} />
            </div>
          </div>

          <div
            className={`p-5 rounded-2xl border transition-all ${
              isDark ? "bg-[#081024] border-[#15274d]" : "bg-white border-[#e2edf8] shadow-sm"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Outstanding Balance
              </span>
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-[#0062eb] flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <h3 className={`text-xl sm:text-2xl font-black ${isDark ? "text-white" : "text-[#0a1b39]"}`}>
              ₹{totalOutstanding.toLocaleString()}
            </h3>
            <p className="text-[11px] text-slate-400 font-medium mt-1">Remaining Installment Amount</p>
          </div>

          <div
            className={`p-5 rounded-2xl border transition-all ${
              isDark ? "bg-[#081024] border-[#15274d]" : "bg-white border-[#e2edf8] shadow-sm"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Next Due Date
              </span>
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center">
                <Calendar className="w-4 h-4" />
              </div>
            </div>
            <h3 className={`text-base font-black ${isDark ? "text-white" : "text-[#0a1b39]"}`}>
              {nextDueDate}
            </h3>
            <p className="text-[11px] text-slate-400 font-medium mt-1">
              {totalOutstanding > 0 ? "Installment Schedule Active" : "No Due Balance"}
            </p>
          </div>
        </section>

        {/* =========================================================================
            3. REAL INVOICES / PAYMENT HISTORY SECTION
            ========================================================================= */}
        {payments.length === 0 ? (
          <div className="py-16 sm:py-24 px-6 text-center flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40">
            <div className="w-16 h-16 rounded-2xl bg-blue-500/10 text-[#0062eb] flex items-center justify-center mb-4">
              <Receipt className="w-8 h-8 stroke-[2]" />
            </div>
            <h3 className={`text-lg sm:text-xl font-bold ${isDark ? "text-white" : "text-[#0a1b39]"}`}>
              No Invoices or Payment History Yet
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-md">
              Official GST tax invoices and installment vouchers will appear here once payment transactions are verified for <strong className={isDark ? "text-slate-300" : "text-slate-700"}>{student?.name || "Vijay"}</strong> ({student?.student_id || "NIM-2026-34978"}).
            </p>
            <div className="mt-6 flex items-center gap-3">
              <Link
                href="/dashboard"
                className="px-5 py-2.5 rounded-xl bg-[#0062eb] hover:bg-[#0052cc] text-white text-xs font-bold transition shadow-md shadow-blue-600/25 flex items-center gap-1.5 active:scale-95"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Dashboard</span>
              </Link>
            </div>
          </div>
        ) : (
          <section className="space-y-4">
            <h3 className={`text-base font-black ${isDark ? "text-white" : "text-[#0a1b39]"}`}>
              Payment Receipts &amp; Invoices ({payments.length})
            </h3>
            <div className="space-y-3">
              {payments.map((p) => (
                <div
                  key={p.id}
                  className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#081024] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      p.status === "Paid" ? "bg-emerald-500/10 text-emerald-600" : "bg-amber-500/10 text-amber-600"
                    }`}>
                      {p.status === "Paid" ? <Receipt className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                    </div>
                    <div>
                      <h4 className={`text-sm font-bold ${isDark ? "text-white" : "text-[#0a1b39]"}`}>
                        {p.description}
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Ref / TXN: <span className="font-mono">{p.invoiceId}</span> • Date: {p.date} • Mode: {p.paymentMode}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-start gap-3 w-full sm:w-auto shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800/80">
                    <strong className={`text-base font-black ${p.status === "Paid" ? "text-emerald-600" : "text-amber-600"}`}>
                      ₹{p.amount.toLocaleString()}
                    </strong>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      p.status === "Paid" ? "bg-emerald-500/10 text-emerald-600" : "bg-amber-500/10 text-amber-600"
                    }`}>
                      {p.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Modal: Quick Fee Payment Simulation */}
        {paymentModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
            <div
              className={`w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl p-6 border shadow-2xl space-y-4 animate-in zoom-in-95 ${
                isDark
                  ? "bg-[#0b1429] border-[#1e3363] text-white"
                  : "bg-white border-[#dce8f8] text-[#0a1b39]"
              }`}
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-[#0062eb]" />
                  <h3 className="font-bold text-base">Fee Payment Gateway</h3>
                </div>
                <button onClick={() => setPaymentModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
              </div>

              {paymentSuccess ? (
                <div className="py-6 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-600 mx-auto flex items-center justify-center">
                    <Check className="w-6 h-6 stroke-[3]" />
                  </div>
                  <h4 className="font-bold text-base">Payment Successful!</h4>
                  <p className="text-xs text-slate-400">
                    Transaction ID: <span className="font-mono">{latestTxnId}</span>. Instant receipt has been generated.
                  </p>
                  <button
                    onClick={() => {
                      setPaymentSuccess(false);
                      setPaymentModalOpen(false);
                    }}
                    className="px-5 py-2 rounded-xl bg-[#0062eb] text-white text-xs font-bold"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <form onSubmit={handleExecutePayment} className="space-y-4 text-xs">
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex justify-between">
                    <div>
                      <span className="text-slate-400 block">Student</span>
                      <strong className="text-sm">{student?.name || "Vijay"} ({student?.student_id || "NIM-2026-34978"})</strong>
                    </div>
                    <div className="text-right">
                      <span className="text-slate-400 block">Amount Payable</span>
                      <strong className="text-sm font-black text-[#0062eb]">
                        ₹{(totalOutstanding > 0 ? totalOutstanding : 10000).toLocaleString()}
                      </strong>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-slate-400 font-semibold block">Select Payment Mode</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setPayMethod("upi")}
                        className={`p-2.5 rounded-xl border font-bold text-center ${
                          payMethod === "upi" ? "bg-blue-500/10 border-[#0062eb] text-[#0062eb]" : "border-slate-200 dark:border-slate-800"
                        }`}
                      >
                        UPI / QR Code
                      </button>
                      <button
                        type="button"
                        onClick={() => setPayMethod("netbanking")}
                        className={`p-2.5 rounded-xl border font-bold text-center ${
                          payMethod === "netbanking" ? "bg-blue-500/10 border-[#0062eb] text-[#0062eb]" : "border-slate-200 dark:border-slate-800"
                        }`}
                      >
                        Net Banking / Cards
                      </button>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isProcessing}
                      className="w-full py-2.5 rounded-xl bg-[#0062eb] hover:bg-[#0052cc] text-white font-bold transition flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Processing Payment...</span>
                        </>
                      ) : (
                        <span>Confirm &amp; Pay Securely</span>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
