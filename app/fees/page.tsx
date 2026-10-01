"use client";

import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useTheme } from "@/components/ThemeProvider";
import {
  CreditCard,
  CheckCircle2,
  Calendar,
  Download,
  AlertCircle,
  Receipt,
  ArrowRight,
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
} from "lucide-react";

// Types
interface Installment {
  id: string;
  number: number;
  title: string;
  milestone: string;
  amount: number;
  dueDate: string;
  paidDate?: string;
  invoiceNumber?: string;
  paymentMode?: string;
  status: "Paid" | "Due Soon" | "Upcoming";
}

interface InvoiceRecord {
  invoiceId: string;
  description: string;
  date: string;
  paymentMode: string;
  baseAmount: number;
  gstAmount: number;
  totalAmount: number;
  status: "Paid" | "Pending";
  pdfFileName: string;
}

const INITIAL_INSTALLMENTS: Installment[] = [
  {
    id: "inst-1",
    number: 1,
    title: "1st Installment • Enrollment & Core Foundations",
    milestone: "Python Core, Data Engineering & Advanced Mathematics for ML",
    amount: 40000,
    dueDate: "01 Jun 2026",
    paidDate: "01 Jun 2026 • 11:24 AM",
    invoiceNumber: "NIM-INV-2026-0812",
    paymentMode: "UPI (Google Pay)",
    status: "Paid",
  },
  {
    id: "inst-2",
    number: 2,
    title: "2nd Installment • Deep Learning & Lab Compute",
    milestone: "PyTorch Framework, Transformer Architectures & GPU Cloud Labs",
    amount: 40000,
    dueDate: "01 Aug 2026",
    paidDate: "01 Aug 2026 • 02:45 PM",
    invoiceNumber: "NIM-INV-2026-1142",
    paymentMode: "HDFC Net Banking",
    status: "Paid",
  },
  {
    id: "inst-3",
    number: 3,
    title: "3rd Installment • Advanced GenAI & Autonomous Agents",
    milestone: "Enterprise RAG Systems, 7B+ LoRA Fine-Tuning & Multi-Agent Swarms",
    amount: 20000,
    dueDate: "15 Oct 2026",
    status: "Due Soon",
  },
  {
    id: "inst-4",
    number: 4,
    title: "4th Installment • Placement Gateway & Capstone Drive",
    milestone: "Production Deployment, Mentorship Code Reviews & Campus Recruitment",
    amount: 20000,
    dueDate: "15 Dec 2026",
    status: "Upcoming",
  },
];

const INITIAL_INVOICES: InvoiceRecord[] = [
  {
    invoiceId: "NIM-INV-2026-0812",
    description: "Tuition Fee - Installment 1 (Enrollment & Learning Platform)",
    date: "01 Jun 2026",
    paymentMode: "UPI (Google Pay)",
    baseAmount: 33898,
    gstAmount: 6102,
    totalAmount: 40000,
    status: "Paid",
    pdfFileName: "NIM_Tax_Invoice_0812.pdf",
  },
  {
    invoiceId: "NIM-INV-2026-1142",
    description: "Tuition Fee - Installment 2 (Mid-Term & H100 Cloud Compute Labs)",
    date: "01 Aug 2026",
    paymentMode: "HDFC Net Banking",
    baseAmount: 33898,
    gstAmount: 6102,
    totalAmount: 40000,
    status: "Paid",
    pdfFileName: "NIM_Tax_Invoice_1142.pdf",
  },
];

export default function FeesPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Financial Data State
  const [installments, setInstallments] = useState<Installment[]>(INITIAL_INSTALLMENTS);
  const [invoices, setInvoices] = useState<InvoiceRecord[]>(INITIAL_INVOICES);

  // Modals & UI State
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [payOption, setPayOption] = useState<"next" | "full">("next");
  const [payMethod, setPayMethod] = useState<"upi" | "card" | "netbanking" | "emi">("upi");
  const [upiId, setUpiId] = useState("arjun.kumar@oksbi");
  const [selectedBank, setSelectedBank] = useState("HDFC Bank");
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [latestTxnId, setLatestTxnId] = useState("");

  // Invoice Preview Modal
  const [previewInvoice, setPreviewInvoice] = useState<InvoiceRecord | null>(null);

  // Copy Feedback State
  const [copiedField, setCopiedField] = useState<string | null>(null);

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
        setPreviewInvoice(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Calculate live financial totals
  const totalProgramFee = 120000;
  const totalPaid = installments
    .filter((i) => i.status === "Paid")
    .reduce((sum, item) => sum + item.amount, 0);
  const totalOutstanding = totalProgramFee - totalPaid;
  const paidPercentage = Math.round((totalPaid / totalProgramFee) * 100);

  const nextDueInstallment = installments.find(
    (i) => i.status === "Due Soon" || i.status === "Upcoming"
  );
  const payableAmount = payOption === "next" ? (nextDueInstallment?.amount || 20000) : totalOutstanding;

  // Simulate Payment Flow
  const handleExecutePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      const newTxn = `TXN_NIM_${Date.now().toString().slice(-8)}`;
      setLatestTxnId(newTxn);
      setPaymentSuccess(true);

      // Update installments
      if (payOption === "next" && nextDueInstallment) {
        setInstallments((prev) =>
          prev.map((inst) =>
            inst.id === nextDueInstallment.id
              ? {
                  ...inst,
                  status: "Paid",
                  paidDate: new Date().toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  }) + " • Just now",
                  invoiceNumber: `NIM-INV-2026-${Math.floor(1000 + Math.random() * 9000)}`,
                  paymentMode:
                    payMethod === "upi"
                      ? "UPI (" + upiId + ")"
                      : payMethod === "card"
                      ? "Credit Card (•••• 4242)"
                      : payMethod === "netbanking"
                      ? selectedBank
                      : "No-Cost EMI (6 Months)",
                }
              : inst
          )
        );

        // Add new Invoice record
        const newInvoice: InvoiceRecord = {
          invoiceId: `NIM-INV-2026-${Math.floor(1000 + Math.random() * 9000)}`,
          description: `Tuition Fee - Installment ${nextDueInstallment.number} (${nextDueInstallment.title.split("•")[1]?.trim() || "Course Fee"})`,
          date: new Date().toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }),
          paymentMode:
            payMethod === "upi"
              ? "UPI (" + upiId + ")"
              : payMethod === "card"
              ? "Credit Card"
              : selectedBank,
          baseAmount: Math.round(nextDueInstallment.amount / 1.18),
          gstAmount: nextDueInstallment.amount - Math.round(nextDueInstallment.amount / 1.18),
          totalAmount: nextDueInstallment.amount,
          status: "Paid",
          pdfFileName: `NIM_Tax_Invoice_${Date.now().toString().slice(-4)}.pdf`,
        };
        setInvoices((prev) => [newInvoice, ...prev]);
      } else if (payOption === "full") {
        // Clear all remaining
        setInstallments((prev) =>
          prev.map((inst) => ({
            ...inst,
            status: "Paid",
            paidDate: new Date().toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            }) + " • Just now",
            invoiceNumber: inst.invoiceNumber || `NIM-INV-2026-${Math.floor(1000 + Math.random() * 9000)}`,
            paymentMode: "Full Clearance via " + (payMethod === "upi" ? "UPI" : "Online"),
          }))
        );
      }
    }, 1200);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-7xl mx-auto pb-12">
        {/* =========================================================================
            1. FEES & FINANCIAL BANNER HEADER
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
                  Student ID: <span className="font-bold text-slate-700 dark:text-slate-200">NIM-2026-0482</span> • Program:{" "}
                  <span className="font-bold text-[#0062eb] dark:text-sky-400">
                    Generative AI &amp; LLM Engineering Masterclass (6 Months)
                  </span>
                </p>
              </div>
            </div>

            {/* Banner Actions */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  if (invoices.length > 0) setPreviewInvoice(invoices[0]);
                }}
                className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold transition flex items-center gap-1.5"
              >
                <Download className="w-4 h-4 text-slate-500" />
                <span>Latest Invoice</span>
              </button>

              {totalOutstanding > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    setPaymentSuccess(false);
                    setPaymentModalOpen(true);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-[#0062eb] hover:bg-[#0052cc] text-white text-xs font-bold transition shadow-md shadow-blue-600/25 flex items-center gap-2 cursor-pointer active:scale-[0.98]"
                >
                  <Wallet className="w-4 h-4" />
                  <span>Pay Next Installment (₹{payableAmount.toLocaleString("en-IN")})</span>
                </button>
              )}
            </div>
          </div>
        </section>

        {/* =========================================================================
            2. TOP 4 FINANCIAL OVERVIEW METRIC CARDS
            ========================================================================= */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Total Program Fee */}
          <div
            className={`p-5 rounded-2xl border transition-all ${
              isDark ? "bg-[#081024] border-[#15274d]" : "bg-white border-[#e2edf8] shadow-sm"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Total Program Fee
              </span>
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-[#0062eb] dark:text-sky-400 flex items-center justify-center">
                <Receipt className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <h3 className={`text-2xl font-black ${isDark ? "text-white" : "text-[#0a1b39]"}`}>
                ₹{totalProgramFee.toLocaleString("en-IN")}
              </h3>
              <span className="text-xs line-through text-slate-400 font-semibold">₹1,40,000</span>
            </div>
            <div className="flex items-center gap-1.5 mt-2">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-[#0062eb]/10 text-[#0062eb] dark:text-sky-400 border border-[#0062eb]/20">
                <Sparkles className="w-3 h-3" /> ₹20K Merit Scholar
              </span>
              <span className="text-[11px] text-slate-400 font-medium">All 6 Months</span>
            </div>
          </div>

          {/* Card 2: Total Paid So Far */}
          <div
            className={`p-5 rounded-2xl border transition-all ${
              isDark ? "bg-[#081024] border-[#15274d]" : "bg-white border-[#e2edf8] shadow-sm"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Total Paid ({paidPercentage}%)
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                {installments.filter((i) => i.status === "Paid").length} of 4 Cleared
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <h3 className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                ₹{totalPaid.toLocaleString("en-IN")}
              </h3>
              <span className="text-xs text-slate-400 font-semibold">/ ₹{totalProgramFee.toLocaleString("en-IN")}</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden mt-2.5">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${paidPercentage}%` }}
              />
            </div>
          </div>

          {/* Card 3: Outstanding Balance */}
          <div
            className={`p-5 rounded-2xl border transition-all ${
              isDark ? "bg-[#081024] border-[#15274d]" : "bg-white border-[#e2edf8] shadow-sm"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Outstanding Balance
              </span>
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-500 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <h3 className={`text-2xl font-black ${isDark ? "text-white" : "text-[#0a1b39]"}`}>
              ₹{totalOutstanding.toLocaleString("en-IN")}
            </h3>
            <p className="text-[11px] text-slate-400 font-medium mt-1">
              {installments.filter((i) => i.status !== "Paid").length > 0
                ? `${installments.filter((i) => i.status !== "Paid").length} Installments Remaining • Zero Interest`
                : "All Tuition Cleared! Congratulations"}
            </p>
          </div>

          {/* Card 4: Next Due Date & Amount */}
          <div
            className={`p-5 rounded-2xl border transition-all ${
              totalOutstanding === 0
                ? isDark
                  ? "bg-[#081024] border-[#15274d]"
                  : "bg-white border-[#e2edf8] shadow-sm"
                : isDark
                ? "bg-[#0c1a3b] border-blue-500/30"
                : "bg-blue-50/70 border-blue-200 shadow-sm"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span
                className={`text-[11px] font-bold uppercase tracking-wider ${
                  totalOutstanding === 0 ? "text-slate-400" : "text-[#0062eb] dark:text-sky-400"
                }`}
              >
                {totalOutstanding === 0 ? "Fee Clearance Status" : "Next Due Installment"}
              </span>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  totalOutstanding === 0
                    ? "bg-emerald-500/15 text-emerald-600"
                    : "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                }`}
              >
                {totalOutstanding === 0 ? "100% Cleared" : "Due: 15 Oct"}
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <h3
                className={`text-2xl font-black ${
                  totalOutstanding === 0
                    ? "text-emerald-600"
                    : "text-[#0062eb] dark:text-sky-300"
                }`}
              >
                {totalOutstanding === 0
                  ? "₹0"
                  : `₹${(nextDueInstallment?.amount || 20000).toLocaleString("en-IN")}`}
              </h3>
              {totalOutstanding > 0 && (
                <span className="text-xs text-slate-400 font-medium">Installment 3</span>
              )}
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-1 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>{totalOutstanding === 0 ? "Completed on Schedule" : "Due on 15 Oct 2026 (No Late Fees)"}</span>
            </p>
          </div>
        </section>

        {/* =========================================================================
            3. MAIN 2-COLUMN STRUCTURED LAYOUT GRID (8 Cols + 4 Cols)
            ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* =======================================================================
              LEFT COLUMN (8 Cols): Installment Schedule & Tax Invoices
              ======================================================================= */}
          <div className="lg:col-span-8 space-y-6">
            {/* A. Installment Schedule Card */}
            <div
              className={`p-6 sm:p-7 rounded-3xl border transition-all ${
                isDark ? "bg-[#081024] border-[#15274d]" : "bg-white border-[#e2edf8] shadow-sm"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
                <div>
                  <h3 className={`text-base sm:text-lg font-black tracking-tight ${isDark ? "text-white" : "text-[#0a1b39]"}`}>
                    Current Due Installment
                  </h3>
                  <p className="text-xs text-slate-400 font-medium mt-0.5">
                    Clear milestones on time to ensure uninterrupted GPU compute &amp; placement drive access.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/25">
                    Action Required
                  </span>
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400 self-start sm:self-auto">
                    GST 18% Inclusive
                  </span>
                </div>
              </div>

              {/* Installments List - Shows only current due payment requiring student action */}
              <div className="space-y-3.5">
                {installments
                  .filter((inst) => inst.status === "Due Soon")
                  .map((inst) => (
                    <div
                      key={inst.id}
                      className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                        isDark
                          ? "bg-[#0c1c3f] border-blue-500/40 shadow-sm"
                          : "bg-blue-50/50 border-blue-200 shadow-sm"
                      }`}
                    >
                      {/* Left info & Milestone */}
                      <div className="flex items-start gap-3.5">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 font-black text-xs bg-[#0062eb] text-white shadow-md shadow-blue-500/25">
                          {inst.number}
                        </div>

                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h4 className={`text-sm font-black tracking-tight ${isDark ? "text-white" : "text-[#0a1b39]"}`}>
                              {inst.title}
                            </h4>
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/25">
                              {inst.status}
                            </span>
                          </div>

                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                            {inst.milestone}
                          </p>

                          <div className="flex flex-wrap items-center gap-2.5 mt-2 text-[11px] text-slate-400 font-medium">
                            <span className="text-amber-600 dark:text-amber-400 font-bold flex items-center gap-1">
                              <Clock className="w-3 h-3" /> Due by {inst.dueDate}
                            </span>
                            <span>•</span>
                            <span>No Late Fee Applied</span>
                          </div>
                        </div>
                      </div>

                      {/* Right amount & action */}
                      <div className="flex items-center justify-between md:justify-end gap-4 border-t md:border-t-0 pt-3 md:pt-0 border-slate-200 dark:border-slate-800 shrink-0">
                        <div className="text-left md:text-right">
                          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                            Amount Due
                          </span>
                          <span className={`text-base sm:text-lg font-black ${isDark ? "text-white" : "text-[#0a1b39]"}`}>
                            ₹{inst.amount.toLocaleString("en-IN")}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            setPayOption("next");
                            setPaymentSuccess(false);
                            setPaymentModalOpen(true);
                          }}
                          className="px-5 py-2.5 rounded-xl bg-[#0062eb] hover:bg-[#0052cc] text-white text-xs font-bold transition shadow-md shadow-blue-500/30 flex items-center gap-2 cursor-pointer active:scale-[0.98]"
                        >
                          <Wallet className="w-4 h-4" />
                          <span>Pay Now</span>
                        </button>
                      </div>
                    </div>
                  ))}

                {installments.filter((inst) => inst.status === "Due Soon").length === 0 && (
                  <div
                    className={`p-6 rounded-2xl border text-center transition-all ${
                      isDark ? "bg-[#07132a]/60 border-slate-800" : "bg-slate-50/70 border-slate-200"
                    }`}
                  >
                    <div className="w-12 h-12 rounded-full bg-emerald-500/15 text-emerald-500 flex items-center justify-center mx-auto mb-3">
                      <CheckCircle2 className="w-6 h-6 stroke-[2.5]" />
                    </div>
                    <h4 className={`text-sm font-bold ${isDark ? "text-white" : "text-[#0a1b39]"}`}>
                      No Pending Dues
                    </h4>
                    <p className="text-xs text-slate-400 mt-1">
                      All required installments for this period are settled. Next schedule will appear when due.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* B. Official Tax Invoices & Receipt Archive */}
            <div
              className={`p-6 sm:p-7 rounded-3xl border transition-all ${
                isDark ? "bg-[#081024] border-[#15274d]" : "bg-white border-[#e2edf8] shadow-sm"
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className={`text-base font-black tracking-tight ${isDark ? "text-white" : "text-[#0a1b39]"}`}>
                    Official GST Tax Invoices &amp; Receipts
                  </h3>
                  <p className="text-xs text-slate-400 font-medium mt-0.5">
                    Valid for Income Tax deduction under Section 80E and corporate reimbursement.
                  </p>
                </div>
                <span className="text-xs font-bold text-slate-400">
                  {invoices.length} Receipts Issued
                </span>
              </div>

              {/* Invoices Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-bold uppercase text-[10px] tracking-wider">
                      <th className="pb-3 pr-4">Invoice #</th>
                      <th className="pb-3 pr-4">Description</th>
                      <th className="pb-3 pr-4">Date</th>
                      <th className="pb-3 pr-4">Payment Mode</th>
                      <th className="pb-3 pr-4 text-right">Amount (Incl. GST)</th>
                      <th className="pb-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                    {invoices.map((inv) => (
                      <tr key={inv.invoiceId} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition">
                        <td className="py-3.5 pr-4 font-mono font-bold text-[#0062eb] dark:text-sky-400">
                          {inv.invoiceId}
                        </td>
                        <td className="py-3.5 pr-4">
                          <span className={`font-bold ${isDark ? "text-slate-200" : "text-slate-800"}`}>
                            {inv.description}
                          </span>
                        </td>
                        <td className="py-3.5 pr-4 text-slate-500 dark:text-slate-400 whitespace-nowrap">
                          {inv.date}
                        </td>
                        <td className="py-3.5 pr-4 text-slate-500 dark:text-slate-400 whitespace-nowrap">
                          {inv.paymentMode}
                        </td>
                        <td className="py-3.5 pr-4 text-right font-black text-slate-900 dark:text-white whitespace-nowrap">
                          ₹{inv.totalAmount.toLocaleString("en-IN")}
                        </td>
                        <td className="py-3.5 text-right whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => setPreviewInvoice(inv)}
                            className="inline-flex items-center gap-1 px-3 py-1 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-[#0062eb] hover:border-[#0062eb] hover:text-white transition text-slate-600 dark:text-slate-300 font-bold text-[11px]"
                          >
                            <FileText className="w-3 h-3" />
                            <span>View / PDF</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* =======================================================================
              RIGHT COLUMN (4 Cols): Quick Payment Box & Bank Transfer Info
              ======================================================================= */}
          <div className="lg:col-span-4 space-y-6">
            {/* Quick Payment Action Card */}
            <div
              className={`p-6 rounded-3xl border transition-all ${
                isDark ? "bg-[#081024] border-[#15274d]" : "bg-white border-[#e2edf8] shadow-sm"
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#0062eb]/15 text-[#0062eb] dark:text-sky-400 flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <h3 className={`text-sm font-black ${isDark ? "text-white" : "text-[#0a1b39]"}`}>
                    Instant Online Payment
                  </h3>
                </div>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded">
                  256-Bit SSL Encrypted
                </span>
              </div>

              {/* Payment Amount Choice */}
              <div className="space-y-2 mb-4">
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Select Payment Amount
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPayOption("next")}
                    className={`p-3 rounded-2xl border text-left transition ${
                      payOption === "next"
                        ? "border-[#0062eb] bg-blue-50/70 dark:bg-blue-950/40 ring-2 ring-[#0062eb]/20"
                        : "border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40"
                    }`}
                  >
                    <span className="text-[10px] text-slate-400 block font-medium">Installment 3</span>
                    <strong className="text-sm font-black text-slate-900 dark:text-white">
                      ₹{(nextDueInstallment?.amount || 20000).toLocaleString("en-IN")}
                    </strong>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPayOption("full")}
                    className={`p-3 rounded-2xl border text-left transition ${
                      payOption === "full"
                        ? "border-[#0062eb] bg-blue-50/70 dark:bg-blue-950/40 ring-2 ring-[#0062eb]/20"
                        : "border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40"
                    }`}
                  >
                    <span className="text-[10px] text-slate-400 block font-medium">Full Balance</span>
                    <strong className="text-sm font-black text-slate-900 dark:text-white">
                      ₹{totalOutstanding.toLocaleString("en-IN")}
                    </strong>
                  </button>
                </div>
              </div>

              {/* Payment Method Selector Badges */}
              <div className="space-y-2 mb-5">
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Supported Payment Rails
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/50 flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-[#0062eb]" />
                    <span className="font-bold">UPI / QR Code</span>
                  </div>
                  <div className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/50 flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-purple-500" />
                    <span className="font-bold">Cards (All Banks)</span>
                  </div>
                  <div className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/50 flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-emerald-500" />
                    <span className="font-bold">Net Banking</span>
                  </div>
                  <div className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/50 flex items-center gap-2">
                    <Percent className="w-4 h-4 text-amber-500" />
                    <span className="font-bold">No-Cost EMI</span>
                  </div>
                </div>
              </div>

              {/* Primary Action Button */}
              {totalOutstanding > 0 ? (
                <button
                  type="button"
                  onClick={() => {
                    setPaymentSuccess(false);
                    setPaymentModalOpen(true);
                  }}
                  className="w-full py-3.5 rounded-2xl bg-[#0062eb] hover:bg-[#0052cc] text-white font-bold text-xs shadow-lg shadow-blue-500/25 transition cursor-pointer flex items-center justify-center gap-2 active:scale-[0.98]"
                >
                  <Lock className="w-4 h-4" />
                  <span>Proceed to Pay ₹{payableAmount.toLocaleString("en-IN")}</span>
                </button>
              ) : (
                <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center text-xs font-bold text-emerald-700 dark:text-emerald-300">
                  ✓ Full Tuition Cleared. No Dues Remaining.
                </div>
              )}

              <p className="text-[10px] text-center text-slate-400 mt-3 font-medium">
                Immediate official GST invoice generation upon completion.
              </p>
            </div>

            {/* Direct Bank Wire Transfer Card (NEFT / RTGS / IMPS) */}
            <div
              className={`p-6 rounded-3xl border transition-all ${
                isDark ? "bg-[#081024] border-[#15274d]" : "bg-white border-[#e2edf8] shadow-sm"
              }`}
            >
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className={`text-sm font-black ${isDark ? "text-white" : "text-[#0a1b39]"}`}>
                    Direct Bank Transfer Details
                  </h3>
                  <p className="text-[11px] text-slate-400">For NEFT / RTGS / IMPS transfers</p>
                </div>
              </div>

              <div className="space-y-2.5 text-xs">
                {/* Account Name */}
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                    Account Beneficiary
                  </span>
                  <span className="font-bold text-slate-900 dark:text-slate-100">
                    NIM Academy Higher Education Pvt Ltd
                  </span>
                </div>

                {/* Account Number with Copy */}
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                      Account Number
                    </span>
                    <span className="font-mono font-black text-slate-900 dark:text-slate-100">
                      98200100482910
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy("98200100482910", "acc")}
                    className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 transition"
                    title="Copy Account Number"
                  >
                    {copiedField === "acc" ? (
                      <Check className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {/* IFSC Code with Copy */}
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                      IFSC Code (HDFC Bank)
                    </span>
                    <span className="font-mono font-black text-slate-900 dark:text-slate-100">
                      HDFC0001234
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy("HDFC0001234", "ifsc")}
                    className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 transition"
                    title="Copy IFSC Code"
                  >
                    {copiedField === "ifsc" ? (
                      <Check className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {/* Important Remark */}
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-700 dark:text-amber-300">
                  <strong>Important:</strong> Please enter remarks as{" "}
                  <code className="font-mono bg-amber-500/20 px-1 py-0.5 rounded">NIM-2026-0482</code> for automatic reconciliation within 2 hours.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================================
            4. INTERACTIVE PAYMENT GATEWAY SIMULATION MODAL
            ========================================================================= */}
        {paymentModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
            <div
              className={`relative w-full max-w-lg rounded-3xl border shadow-2xl p-6 sm:p-7 max-h-[90vh] overflow-y-auto ${
                isDark ? "bg-[#09152e] border-[#152a54] text-white" : "bg-white border-[#dbe6f5] text-[#0a1b39]"
              }`}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#0062eb] flex items-center justify-center text-white shrink-0 shadow-md shadow-blue-500/25">
                    <ShieldCheck className="w-5 h-5 stroke-[2.5]" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-black tracking-tight">NIM Secure Payment Gateway</h3>
                    <p className="text-xs text-slate-400 font-medium">
                      256-Bit Encrypted • Powered by Razorpay &amp; RBI Rails
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setPaymentModalOpen(false)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Payment Success View */}
              {paymentSuccess ? (
                <div className="text-center py-6 space-y-4 animate-in zoom-in-95 duration-200">
                  <div className="w-16 h-16 rounded-3xl bg-emerald-500/15 border-2 border-emerald-500 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>

                  <div>
                    <h4 className="text-xl font-black">Payment Confirmed!</h4>
                    <p className="text-xs text-slate-400 mt-1">
                      Your tuition installment has been cleared and verified in our database.
                    </p>
                  </div>

                  {/* Transaction Details Box */}
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs space-y-2 text-left">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Transaction ID:</span>
                      <span className="font-mono font-bold text-slate-900 dark:text-white">{latestTxnId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Amount Cleared:</span>
                      <span className="font-black text-emerald-600 text-sm">₹{payableAmount.toLocaleString("en-IN")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">GST Invoice Ref:</span>
                      <span className="font-mono text-[#0062eb] dark:text-sky-400 font-bold">NIM-INV-2026-CONFIRMED</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setPaymentModalOpen(false);
                        setPaymentSuccess(false);
                        if (invoices.length > 0) setPreviewInvoice(invoices[0]);
                      }}
                      className="flex-1 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                    >
                      View Generated Invoice
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setPaymentModalOpen(false);
                        setPaymentSuccess(false);
                      }}
                      className="flex-1 py-3 rounded-xl bg-[#0062eb] text-white text-xs font-bold hover:bg-[#0052cc] transition shadow-md shadow-blue-500/25"
                    >
                      Done
                    </button>
                  </div>
                </div>
              ) : (
                /* Payment Options Form */
                <form onSubmit={handleExecutePayment} className="space-y-4 my-4">
                  {/* Amount Summary */}
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-blue-500/10 border border-blue-500/20 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block uppercase">
                        Payable Total
                      </span>
                      <span className="text-xl sm:text-2xl font-black text-[#0062eb] dark:text-sky-400">
                        ₹{payableAmount.toLocaleString("en-IN")}
                      </span>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#0062eb] text-white">
                      {payOption === "next" ? "Installment 3" : "Full Clearance"}
                    </span>
                  </div>

                  {/* Payment Method Selector Tabs */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-2">
                      Choose Payment Method
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {[
                        { id: "upi", label: "UPI / QR", icon: Smartphone },
                        { id: "card", label: "Card", icon: CreditCard },
                        { id: "netbanking", label: "Net Bank", icon: Building2 },
                        { id: "emi", label: "EMI", icon: Percent },
                      ].map((m) => {
                        const Icon = m.icon;
                        const isSelected = payMethod === m.id;
                        return (
                          <button
                            key={m.id}
                            type="button"
                            onClick={() => setPayMethod(m.id as any)}
                            className={`p-2.5 rounded-xl border text-center transition flex flex-col items-center justify-center gap-1 ${
                              isSelected
                                ? "border-[#0062eb] bg-blue-50 dark:bg-blue-950/40 text-[#0062eb] dark:text-sky-400 font-bold"
                                : "border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400"
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                            <span className="text-[10px]">{m.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Sub-form based on method */}
                  {payMethod === "upi" && (
                    <div className="space-y-3 pt-2">
                      <div className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 border p-1 flex items-center justify-center">
                            <QrCode className="w-6 h-6 text-slate-800 dark:text-slate-200" />
                          </div>
                          <div>
                            <span className="text-xs font-bold block">Instant QR Code Scan</span>
                            <span className="text-[10px] text-slate-400">Open GPay, PhonePe, or Paytm</span>
                          </div>
                        </div>
                        <span className="text-xs font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded">
                          0% Gateway Fee
                        </span>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-500 mb-1">Or Enter UPI ID</label>
                        <input
                          type="text"
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          placeholder="e.g., student@oksbi"
                          className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 px-3.5 py-2.5 bg-white dark:bg-[#081024] outline-none focus:border-[#0062eb]"
                          required
                        />
                      </div>
                    </div>
                  )}

                  {payMethod === "card" && (
                    <div className="space-y-3 pt-2">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-500 mb-1">Card Number</label>
                        <input
                          type="text"
                          placeholder="4532 •••• •••• 8920"
                          defaultValue="4532 9820 4812 8920"
                          className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 px-3.5 py-2.5 bg-white dark:bg-[#081024] outline-none focus:border-[#0062eb]"
                          required
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-500 mb-1">Expiry</label>
                          <input
                            type="text"
                            placeholder="MM / YY"
                            defaultValue="08 / 28"
                            className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 px-3.5 py-2.5 bg-white dark:bg-[#081024] outline-none focus:border-[#0062eb]"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-500 mb-1">CVV</label>
                          <input
                            type="password"
                            placeholder="•••"
                            defaultValue="782"
                            className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 px-3.5 py-2.5 bg-white dark:bg-[#081024] outline-none focus:border-[#0062eb]"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {payMethod === "netbanking" && (
                    <div className="space-y-3 pt-2">
                      <label className="block text-[11px] font-bold text-slate-500 mb-1">Select Bank</label>
                      <select
                        value={selectedBank}
                        onChange={(e) => setSelectedBank(e.target.value)}
                        className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 px-3.5 py-2.5 bg-white dark:bg-[#081024] outline-none focus:border-[#0062eb]"
                      >
                        <option value="HDFC Bank">HDFC Bank</option>
                        <option value="ICICI Bank">ICICI Bank</option>
                        <option value="State Bank of India">State Bank of India (SBI)</option>
                        <option value="Axis Bank">Axis Bank</option>
                        <option value="Kotak Mahindra Bank">Kotak Mahindra Bank</option>
                      </select>
                    </div>
                  )}

                  {payMethod === "emi" && (
                    <div className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 space-y-2 text-xs">
                      <div className="flex justify-between font-bold">
                        <span>3-Month No Cost Plan:</span>
                        <span>₹{Math.round(payableAmount / 3).toLocaleString("en-IN")} / mo</span>
                      </div>
                      <div className="flex justify-between text-slate-400">
                        <span>6-Month Low Interest:</span>
                        <span>₹{Math.round((payableAmount * 1.05) / 6).toLocaleString("en-IN")} / mo</span>
                      </div>
                    </div>
                  )}

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isProcessing}
                      className="w-full py-3.5 rounded-2xl bg-[#0062eb] hover:bg-[#0052cc] text-white font-bold text-xs shadow-lg shadow-blue-500/25 transition cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60"
                    >
                      {isProcessing ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Authorizing with Bank...</span>
                        </>
                      ) : (
                        <>
                          <Lock className="w-4 h-4" />
                          <span>Authorize &amp; Pay ₹{payableAmount.toLocaleString("en-IN")}</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

        {/* =========================================================================
            5. OFFICIAL TAX INVOICE PREVIEW / PRINT MODAL
            ========================================================================= */}
        {previewInvoice && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200">
            <div
              className={`relative w-full max-w-2xl rounded-3xl border shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto ${
                isDark ? "bg-[#09152e] border-[#152a54] text-white" : "bg-white border-[#dbe6f5] text-[#0a1b39]"
              }`}
            >
              {/* Modal Top Bar */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[#0062eb] text-white flex items-center justify-center">
                    <Receipt className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-black text-sm sm:text-base">Official GST Tax Invoice</h3>
                    <p className="text-[11px] text-slate-400">NIM Academy Higher Education Pvt Ltd</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 transition flex items-center gap-1.5"
                    title="Print Invoice"
                  >
                    <Printer className="w-4 h-4" />
                    <span className="hidden sm:inline">Print</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewInvoice(null)}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Printable Invoice Body */}
              <div className="py-6 space-y-6 text-xs">
                {/* Header Metadata */}
                <div className="flex flex-col sm:flex-row justify-between gap-4">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                      Issued By
                    </span>
                    <h4 className="font-black text-sm text-[#0062eb] dark:text-sky-400">
                      NIM Academy (Higher Education Pvt Ltd)
                    </h4>
                    <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">
                      #42, 4th Cross, 80 Feet Road, Koramangala 4th Block<br />
                      Bengaluru, Karnataka - 560034<br />
                      GSTIN: <span className="font-mono font-bold">29AAACN1234F1Z5</span>
                    </p>
                  </div>

                  <div className="sm:text-right">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                      Invoice Details
                    </span>
                    <div className="font-mono font-black text-sm">{previewInvoice.invoiceId}</div>
                    <div className="text-slate-500 text-[11px] mt-0.5">Date: {previewInvoice.date}</div>
                    <div className="text-slate-500 text-[11px]">SAC Code: 999293 (Training)</div>
                    <span className="inline-block mt-1 px-2.5 py-0.5 rounded text-[10px] font-black uppercase bg-emerald-500/15 text-emerald-600 border border-emerald-500/30">
                      PAID IN FULL
                    </span>
                  </div>
                </div>

                {/* Billed To Box */}
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">
                    Billed To (Student)
                  </span>
                  <div className="font-black text-sm">Arjun Kumar</div>
                  <div className="text-slate-500 text-[11px]">
                    Student ID: <span className="font-mono font-bold">NIM-2026-0482</span> • Bengaluru, Karnataka
                  </div>
                </div>

                {/* Invoice Table */}
                <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
                  <table className="w-full text-left">
                    <thead className="bg-slate-100 dark:bg-slate-900 text-slate-500 font-bold text-[10px] uppercase">
                      <tr>
                        <th className="p-3">Particulars</th>
                        <th className="p-3 text-right">Taxable Amount</th>
                        <th className="p-3 text-right">GST (18%)</th>
                        <th className="p-3 text-right">Total (INR)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 font-medium">
                      <tr>
                        <td className="p-3">
                          <span className="font-bold block">{previewInvoice.description}</span>
                          <span className="text-[10px] text-slate-400">
                            Academic Tuition + H100 GPU Cloud Compute Credits + Mentorship
                          </span>
                        </td>
                        <td className="p-3 text-right font-mono">₹{previewInvoice.baseAmount.toLocaleString("en-IN")}</td>
                        <td className="p-3 text-right font-mono">₹{previewInvoice.gstAmount.toLocaleString("en-IN")}</td>
                        <td className="p-3 text-right font-mono font-black">₹{previewInvoice.totalAmount.toLocaleString("en-IN")}</td>
                      </tr>
                    </tbody>
                    <tfoot className="bg-slate-50 dark:bg-slate-900/60 border-t border-slate-200 dark:border-slate-800 font-bold">
                      <tr>
                        <td colSpan={3} className="p-3 text-right uppercase text-[10px] text-slate-400">
                          Total Amount Paid (Inclusive of Taxes)
                        </td>
                        <td className="p-3 text-right font-black text-sm text-[#0062eb] dark:text-sky-400">
                          ₹{previewInvoice.totalAmount.toLocaleString("en-IN")}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                {/* Footer notes & seal */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400">
                  <div>
                    <p>Computer generated invoice, no physical signature required.</p>
                    <p>For questions or corrections, contact <span className="text-[#0062eb]">billing@nim.academy</span></p>
                  </div>

                  <div className="text-center sm:text-right">
                    <div className="w-24 h-10 border border-dashed border-emerald-500/50 rounded-lg flex items-center justify-center text-emerald-600 font-bold text-[10px] uppercase">
                      ✓ NIM ACADEMY PAID
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
