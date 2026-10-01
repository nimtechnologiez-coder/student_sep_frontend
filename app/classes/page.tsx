"use client";

import React, { useState, useMemo } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useTheme } from "@/components/ThemeProvider";
import styles from "./classes.module.css";
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  Video,
  ChevronLeft,
  ChevronRight,
  Check,
  ArrowRight,
  X,
  ExternalLink,
  Search,
  FileText,
  Code2,
  Download,
  Play,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Layers,
  Laptop,
  BookOpen,
  List as ListIcon,
  Sparkles,
  Info,
} from "lucide-react";

// ============================================================================
// TypeScript Definitions (Matching SRS My Classes Requirements)
// ============================================================================
export type ClassStatus = "Live" | "Scheduled" | "Completed" | "Missed";
export type ClassMode = "Live Online" | "Classroom Lab" | "Hybrid";
export type AttendanceStatus = "Present" | "Missed" | "Late" | "Upcoming";
export type FilterTab = "All" | "Upcoming" | "Completed" | "Missed";
export type ViewMode = "list" | "calendar";

export interface ClassItem {
  id: string;
  topic: string;
  moduleCode: string;
  moduleTitle: string;
  date: string; // ISO date YYYY-MM-DD
  dayNumber: number;
  monthName: string;
  weekday: string;
  formattedDate: string;
  time: string;
  duration: string;
  trainer: string;
  trainerRole: string;
  mode: ClassMode;
  locationOrPlatform: string;
  meetingUrl?: string;
  status: ClassStatus;
  attendance: AttendanceStatus;
  isToday?: boolean;
  description: string;
  agenda: { time: string; title: string; desc: string }[];
  materials?: {
    slidesName?: string;
    slidesUrl?: string;
    notebookName?: string;
    notebookUrl?: string;
    recordingDuration?: string;
    recordingUrl?: string;
  };
}

export default function ClassesPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // State Management
  const [activeTab, setActiveTab] = useState<FilterTab>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<number>(22); // Today (Sep 22)
  const [selectedClassForModal, setSelectedClassForModal] = useState<ClassItem | null>(null);
  const [hasJoinedLive, setHasJoinedLive] = useState<boolean>(false);

  // Dynamic API State for Real Database Classes
  const [apiClasses, setApiClasses] = useState<ClassItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  React.useEffect(() => {
    import("@/lib/studentApi").then(({ StudentApi }) => {
      StudentApi.getClasses()
        .then((data) => {
          if (data.success && data.classes && data.classes.length > 0) {
            const mapped: ClassItem[] = data.classes.map((c: any, index: number) => ({
              id: String(c.id || index),
              topic: c.subject || "Scheduled Class Session",
              moduleCode: "MOD-1",
              moduleTitle: c.batch || "Scheduled Batch",
              date: c.date || "2026-10-01",
              dayNumber: 1,
              monthName: "OCT",
              weekday: "Today",
              formattedDate: c.date_formatted || "Oct 01, 2026",
              time: `${c.time} - ${c.end_time}`,
              duration: c.duration || "90 Mins",
              trainer: c.trainer || "Senior Faculty Mentor",
              trainerRole: "Lead Instructor",
              mode: c.mode === "Online" ? "Live Online" : "Classroom Lab",
              locationOrPlatform: c.meeting_link ? "Google Meet" : "Campus Interactive Lab",
              meetingUrl: c.meeting_link || "#",
              status: c.status === "Live Now" ? "Live" : c.status === "Past" ? "Completed" : "Scheduled",
              attendance: c.status === "Past" ? "Present" : "Upcoming",
              description: c.description || "Interactive live session with hands-on walkthrough.",
              agenda: [],
            }));
            setApiClasses(mapped);
          }
        })
        .finally(() => setIsLoading(false));
    });
  }, []);

  // ============================================================================
  // Complete Dataset for September 2026 (Month 4: NLP & Transformers)
  // ============================================================================
  const classesData: ClassItem[] = [
    // Today's Class (22 Sep 2026)
    {
      id: "cls-22",
      topic: "Scaled Dot-Product Attention & Multi-Head Projections",
      moduleCode: "MOD-4.3",
      moduleTitle: "Sequence Models & Attention Mechanisms",
      date: "2026-09-22",
      dayNumber: 22,
      monthName: "SEP",
      weekday: "Tuesday",
      formattedDate: "Tue, 22 Sep 2026",
      time: "10:00 AM – 1:00 PM",
      duration: "3 Hours",
      trainer: "Priya Sharma",
      trainerRole: "Lead AI Research Instructor & ex-DeepMind Fellow",
      mode: "Live Online",
      locationOrPlatform: "Google Meet • NIM Cohort Stream A",
      meetingUrl: "https://meet.google.com/nim-ai-cohort",
      status: "Live",
      attendance: "Upcoming",
      isToday: true,
      description:
        "Master the mathematical derivation of Query, Key, Value tensors, scaled dot-product attention matrices, and PyTorch multi-head projection layers.",
      agenda: [
        {
          time: "10:00 AM – 10:50 AM",
          title: "Mathematical Foundations of Self-Attention",
          desc: "Query, Key, Value transformations, cosine similarity projections, and square-root scaling.",
        },
        {
          time: "11:00 AM – 12:00 PM",
          title: "Hands-on Implementation in PyTorch",
          desc: "Writing tensor broadcasting functions, scaled dot-product logic, and multi-head splitting.",
        },
        {
          time: "12:10 PM – 1:00 PM",
          title: "Lab Kickoff & Real-world Optimization",
          desc: "Profiling GPU memory footprints, causal masking, and interactive question clearing.",
        },
      ],
      materials: {
        slidesName: "Session_15_Attention_Mechanisms.pdf",
        slidesUrl: "#",
        notebookName: "MultiHead_Attention_Scratch.ipynb",
        notebookUrl: "#",
      },
    },

    // Upcoming Classes
    {
      id: "cls-24",
      topic: "Transformer Encoder & Decoder Deep Dive",
      moduleCode: "MOD-4.3",
      moduleTitle: "Sequence Models & Attention Mechanisms",
      date: "2026-09-24",
      dayNumber: 24,
      monthName: "SEP",
      weekday: "Thursday",
      formattedDate: "Thu, 24 Sep 2026",
      time: "10:00 AM – 1:00 PM",
      duration: "3 Hours",
      trainer: "Rahul Mehta",
      trainerRole: "Senior Deep Learning Architect",
      mode: "Live Online",
      locationOrPlatform: "Google Meet • Stream Room A",
      meetingUrl: "https://meet.google.com/nim-ai-cohort",
      status: "Scheduled",
      attendance: "Upcoming",
      description:
        "Explore layer normalization, feed-forward networks, residual skip-connections, and causal masking in the original Vaswani et al. architecture.",
      agenda: [
        {
          time: "10:00 AM – 11:15 AM",
          title: "Full Encoder Stack Architecture",
          desc: "LayerNorm vs BatchNorm, Post-LN vs Pre-LN, and FFN feedforward blocks.",
        },
        {
          time: "11:30 AM – 1:00 PM",
          title: "Decoder Auto-regressive Generation",
          desc: "Cross-attention projections, teacher forcing, and causal triangular masking.",
        },
      ],
      materials: {
        slidesName: "Session_16_Transformer_Blocks.pdf",
        slidesUrl: "#",
        notebookName: "Transformer_Encoder_Decoder.ipynb",
        notebookUrl: "#",
      },
    },
    {
      id: "cls-25",
      topic: "Hands-on Lab: Training Transformers on GPU Clusters",
      moduleCode: "MOD-4.3",
      moduleTitle: "Sequence Models & Attention Mechanisms",
      date: "2026-09-25",
      dayNumber: 25,
      monthName: "SEP",
      weekday: "Friday",
      formattedDate: "Fri, 25 Sep 2026",
      time: "10:00 AM – 1:00 PM",
      duration: "3 Hours",
      trainer: "Priya Sharma",
      trainerRole: "Lead AI Research Instructor",
      mode: "Classroom Lab",
      locationOrPlatform: "Campus Lab 204 & Remote Colab GPU",
      status: "Scheduled",
      attendance: "Upcoming",
      description:
        "Practical training session benchmarked on Cloud NVIDIA A100s for English-to-German sequence translation.",
      agenda: [
        {
          time: "10:00 AM – 10:45 AM",
          title: "Data Loader Optimization & Token Batching",
          desc: "Dynamic padding, bucketing by sentence length, and PyTorch Dataloader tuning.",
        },
        {
          time: "10:45 AM – 1:00 PM",
          title: "GPU Training Loop & Mixed Precision (FP16)",
          desc: "Gradient accumulation, learning rate warm-up schedules, and BLEU evaluation.",
        },
      ],
      materials: {
        slidesName: "Lab_GPU_Training_Pipeline.pdf",
        slidesUrl: "#",
        notebookName: "Translation_Transformer_Lab.ipynb",
        notebookUrl: "#",
      },
    },
    {
      id: "cls-26",
      topic: "Positional Encoding Schemes & Masked Language Modeling",
      moduleCode: "MOD-4.4",
      moduleTitle: "Transformer Architecture & Hugging Face",
      date: "2026-09-26",
      dayNumber: 26,
      monthName: "SEP",
      weekday: "Saturday",
      formattedDate: "Sat, 26 Sep 2026",
      time: "10:00 AM – 1:00 PM",
      duration: "3 Hours",
      trainer: "Amit Verma",
      trainerRole: "NLP Systems Specialist",
      mode: "Live Online",
      locationOrPlatform: "Google Meet • Stream Room B",
      meetingUrl: "https://meet.google.com/nim-ai-cohort",
      status: "Scheduled",
      attendance: "Upcoming",
      description:
        "Understand sinusoidal positional embeddings, RoPE (Rotary Position Embeddings), and BERT Masked Language Modeling training objectives.",
      agenda: [
        {
          time: "10:00 AM – 11:30 AM",
          title: "Sinusoidal vs Learned vs Rotary (RoPE)",
          desc: "Fourier feature projections and relative distance formulations in modern LLMs.",
        },
        {
          time: "11:45 AM – 1:00 PM",
          title: "BERT Pre-training Cloze Tasks",
          desc: "15% masking token policies, Next Sentence Prediction (NSP), and loss masking.",
        },
      ],
      materials: {
        slidesName: "Session_17_Positional_Encodings.pdf",
        slidesUrl: "#",
        notebookName: "BERT_MLM_Pretraining.ipynb",
        notebookUrl: "#",
      },
    },
    {
      id: "cls-29",
      topic: "Hugging Face Ecosystem, Tokenizers & Pretrained Pipelines",
      moduleCode: "MOD-4.4",
      moduleTitle: "Transformer Architecture & Hugging Face",
      date: "2026-09-29",
      dayNumber: 29,
      monthName: "SEP",
      weekday: "Tuesday",
      formattedDate: "Tue, 29 Sep 2026",
      time: "10:00 AM – 1:00 PM",
      duration: "3 Hours",
      trainer: "Priya Sharma",
      trainerRole: "Lead AI Research Instructor",
      mode: "Live Online",
      locationOrPlatform: "Google Meet • Stream Room A",
      meetingUrl: "https://meet.google.com/nim-ai-cohort",
      status: "Scheduled",
      attendance: "Upcoming",
      description:
        "Leveraging AutoModel, AutoTokenizer, datasets caching, model Hub publishing, and pipeline abstraction.",
      agenda: [
        {
          time: "10:00 AM – 11:00 AM",
          title: "Hugging Face Core Abstractions",
          desc: "Deep dive into model configs, weight checkpoints, and fast tokenizers.",
        },
        {
          time: "11:00 AM – 1:00 PM",
          title: "Hands-on Pipeline Construction",
          desc: "Sentiment analysis, NER, zero-shot classification, and model benchmarking.",
        },
      ],
      materials: {
        slidesName: "Session_18_HuggingFace_Ecosystem.pdf",
        slidesUrl: "#",
        notebookName: "HF_Pipelines_Mastery.ipynb",
        notebookUrl: "#",
      },
    },

    // Completed & Missed Classes (Recent History for September)
    {
      id: "cls-21",
      topic: "Recurrent Neural Networks (RNN) to LSTMs & GRUs",
      moduleCode: "MOD-4.3",
      moduleTitle: "Sequence Models & Attention Mechanisms",
      date: "2026-09-21",
      dayNumber: 21,
      monthName: "SEP",
      weekday: "Monday",
      formattedDate: "Mon, 21 Sep 2026",
      time: "10:00 AM – 1:00 PM",
      duration: "3 Hours",
      trainer: "Rahul Mehta",
      trainerRole: "Senior Deep Learning Architect",
      mode: "Live Online",
      locationOrPlatform: "Google Meet • Stream Room A",
      status: "Completed",
      attendance: "Present",
      description:
        "Explored vanishing and exploding gradients in vanilla RNNs and implemented LSTM cell gates (forget, input, output) and GRU update gates.",
      agenda: [
        {
          time: "10:00 AM – 11:15 AM",
          title: "BPTT & The Vanishing Gradient Problem",
          desc: "Backpropagation Through Time and Jacobian matrix decay proofs.",
        },
        {
          time: "11:30 AM – 1:00 PM",
          title: "LSTM and GRU Mathematical Formulations",
          desc: "Cell state memory highway, affine sigmoid gates, and hidden state recurrent flow.",
        },
      ],
      materials: {
        slidesName: "Session_14_RNN_to_LSTM.pdf",
        slidesUrl: "#",
        notebookName: "LSTM_Sentiment_Classifier.ipynb",
        notebookUrl: "#",
        recordingDuration: "2h 48m",
        recordingUrl: "#",
      },
    },
    {
      id: "cls-19",
      topic: "Hands-on Lab: Vector Search with Cosine Similarity & Dot Products",
      moduleCode: "MOD-4.2",
      moduleTitle: "Word Embeddings & Vector Semantics",
      date: "2026-09-19",
      dayNumber: 19,
      monthName: "SEP",
      weekday: "Saturday",
      formattedDate: "Sat, 19 Sep 2026",
      time: "10:00 AM – 1:00 PM",
      duration: "3 Hours",
      trainer: "Amit Verma",
      trainerRole: "NLP Systems Specialist",
      mode: "Classroom Lab",
      locationOrPlatform: "Campus Lab 204",
      status: "Completed",
      attendance: "Present",
      description:
        "Building an indexing pipeline using cosine similarity and vector dot products to power real-time document search.",
      agenda: [
        {
          time: "10:00 AM – 11:00 AM",
          title: "Cosine Similarity vs Euclidean Distance",
          desc: "Geometric properties of high-dimensional semantic spaces and normalization.",
        },
        {
          time: "11:00 AM – 1:00 PM",
          title: "Building an In-Memory Search Engine",
          desc: "Query vectorization, top-K nearest neighbors ranking, and latency benchmarking.",
        },
      ],
      materials: {
        slidesName: "Lab_Vector_Search_Engine.pdf",
        slidesUrl: "#",
        notebookName: "Vector_Search_Pipeline.ipynb",
        notebookUrl: "#",
        recordingDuration: "2h 55m",
        recordingUrl: "#",
      },
    },
    {
      id: "cls-17",
      topic: "Hands-on Lab: Training Domain Word Embeddings with Negative Sampling",
      moduleCode: "MOD-4.2",
      moduleTitle: "Word Embeddings & Vector Semantics",
      date: "2026-09-17",
      dayNumber: 17,
      monthName: "SEP",
      weekday: "Thursday",
      formattedDate: "Thu, 17 Sep 2026",
      time: "10:00 AM – 1:00 PM",
      duration: "3 Hours",
      trainer: "Priya Sharma",
      trainerRole: "Lead AI Research Instructor",
      mode: "Live Online",
      locationOrPlatform: "Google Meet • Stream Room A",
      status: "Completed",
      attendance: "Present",
      description:
        "Writing custom PyTorch Word2Vec Skip-Gram objective functions with Negative Sampling on medical corpus texts.",
      agenda: [
        {
          time: "10:00 AM – 11:00 AM",
          title: "Softmax Bottleneck & Hierarchical Softmax",
          desc: "Why full vocab softmax is O(V) and how Negative Sampling reduces to O(K).",
        },
        {
          time: "11:00 AM – 1:00 PM",
          title: "PyTorch Word2Vec Model Implementation",
          desc: "Target & context weight embedding layers, binary cross entropy with logits, and training.",
        },
      ],
      materials: {
        slidesName: "Session_13_Negative_Sampling.pdf",
        slidesUrl: "#",
        notebookName: "Word2Vec_SkipGram_NegativeSampling.ipynb",
        notebookUrl: "#",
        recordingDuration: "2h 42m",
        recordingUrl: "#",
      },
    },
    {
      id: "cls-15",
      topic: "Word2Vec Mathematical Formulations & Skip-Gram Architecture",
      moduleCode: "MOD-4.2",
      moduleTitle: "Word Embeddings & Vector Semantics",
      date: "2026-09-15",
      dayNumber: 15,
      monthName: "SEP",
      weekday: "Tuesday",
      formattedDate: "Tue, 15 Sep 2026",
      time: "10:00 AM – 1:00 PM",
      duration: "3 Hours",
      trainer: "Rahul Mehta",
      trainerRole: "Senior Deep Learning Architect",
      mode: "Live Online",
      locationOrPlatform: "Google Meet • Stream Room A",
      status: "Missed",
      attendance: "Missed",
      description:
        "Derivation of the Mikolov et al. objective function, sliding window context pairs, and vector representations.",
      agenda: [
        {
          time: "10:00 AM – 11:30 AM",
          title: "CBOW vs Skip-Gram Theoretical Foundations",
          desc: "Distributional hypothesis: 'A word is characterized by the company it keeps'.",
        },
        {
          time: "11:45 AM – 1:00 PM",
          title: "Gradient Derivation for Embedding Updates",
          desc: "Backpropagation on context projection vectors.",
        },
      ],
      materials: {
        slidesName: "Session_12_Word2Vec_Math.pdf",
        slidesUrl: "#",
        notebookName: "CBOW_SkipGram_Comparison.ipynb",
        notebookUrl: "#",
        recordingDuration: "2h 45m",
        recordingUrl: "#",
      },
    },
    {
      id: "cls-14",
      topic: "Text Preprocessing, Regex Pipelines & Subword Tokenizers (BPE)",
      moduleCode: "MOD-4.1",
      moduleTitle: "NLP Foundations & Subword Tokenizers",
      date: "2026-09-14",
      dayNumber: 14,
      monthName: "SEP",
      weekday: "Monday",
      formattedDate: "Mon, 14 Sep 2026",
      time: "10:00 AM – 1:00 PM",
      duration: "3 Hours",
      trainer: "Priya Sharma",
      trainerRole: "Lead AI Research Instructor",
      mode: "Live Online",
      locationOrPlatform: "Google Meet • Stream Room A",
      status: "Completed",
      attendance: "Present",
      description:
        "Building production regex pipelines, handling out-of-vocabulary terms, and training a Byte-Pair Encoding tokenizer from scratch.",
      agenda: [
        {
          time: "10:00 AM – 11:00 AM",
          title: "Unicode Normalization, Regex Cleaning & Stemming",
          desc: "NFC/NFD forms, punctuation stripping, and token boundary detection.",
        },
        {
          time: "11:00 AM – 1:00 PM",
          title: "Byte-Pair Encoding (BPE) from Scratch",
          desc: "Frequency counting of byte pairs and iterative merge rules generation.",
        },
      ],
      materials: {
        slidesName: "Session_11_Subword_Tokenizers.pdf",
        slidesUrl: "#",
        notebookName: "BPE_Tokenizer_From_Scratch.ipynb",
        notebookUrl: "#",
        recordingDuration: "2h 38m",
        recordingUrl: "#",
      },
    },
  ];

  // ============================================================================
  // Derived Statistics & Filtered Data
  // ============================================================================
  const todayClass = useMemo(() => classesData.find((c) => c.isToday), [classesData]);

  const upcomingClasses = useMemo(
    () => classesData.filter((c) => c.status === "Scheduled"),
    [classesData]
  );

  const completedClasses = useMemo(
    () => classesData.filter((c) => c.status === "Completed"),
    [classesData]
  );

  const missedClasses = useMemo(
    () => classesData.filter((c) => c.status === "Missed" || c.attendance === "Missed"),
    [classesData]
  );

  // Filtered dataset for Active Tab and Search Query
  const filteredClasses = useMemo(() => {
    let result = classesData;

    // Apply Filter Tab
    if (activeTab === "Upcoming") {
      result = result.filter((c) => c.status === "Scheduled" || c.status === "Live");
    } else if (activeTab === "Completed") {
      result = result.filter((c) => c.status === "Completed");
    } else if (activeTab === "Missed") {
      result = result.filter((c) => c.status === "Missed" || c.attendance === "Missed");
    }

    // Apply Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (c) =>
          c.topic.toLowerCase().includes(q) ||
          c.moduleTitle.toLowerCase().includes(q) ||
          c.moduleCode.toLowerCase().includes(q) ||
          c.trainer.toLowerCase().includes(q) ||
          c.formattedDate.toLowerCase().includes(q)
      );
    }

    return result;
  }, [classesData, activeTab, searchQuery]);

  // Calendar dates for September 2026 (Sunday to Saturday)
  const calendarDays = useMemo(() => {
    return [
      // Week 1
      { num: 30, isCurrentMonth: false },
      { num: 31, isCurrentMonth: false },
      { num: 1, isCurrentMonth: true },
      { num: 2, isCurrentMonth: true },
      { num: 3, isCurrentMonth: true },
      { num: 4, isCurrentMonth: true },
      { num: 5, isCurrentMonth: true },
      // Week 2
      { num: 6, isCurrentMonth: true },
      { num: 7, isCurrentMonth: true },
      { num: 8, isCurrentMonth: true },
      { num: 9, isCurrentMonth: true },
      { num: 10, isCurrentMonth: true },
      { num: 11, isCurrentMonth: true },
      { num: 12, isCurrentMonth: true },
      // Week 3
      { num: 13, isCurrentMonth: true },
      { num: 14, isCurrentMonth: true },
      { num: 15, isCurrentMonth: true },
      { num: 16, isCurrentMonth: true },
      { num: 17, isCurrentMonth: true },
      { num: 18, isCurrentMonth: true },
      { num: 19, isCurrentMonth: true },
      // Week 4
      { num: 20, isCurrentMonth: true },
      { num: 21, isCurrentMonth: true },
      { num: 22, isCurrentMonth: true, isToday: true },
      { num: 23, isCurrentMonth: true },
      { num: 24, isCurrentMonth: true },
      { num: 25, isCurrentMonth: true },
      { num: 26, isCurrentMonth: true },
      // Week 5
      { num: 27, isCurrentMonth: true },
      { num: 28, isCurrentMonth: true },
      { num: 29, isCurrentMonth: true },
      { num: 30, isCurrentMonth: true },
      { num: 1, isCurrentMonth: false },
      { num: 2, isCurrentMonth: false },
      { num: 3, isCurrentMonth: false },
    ];
  }, []);

  // Class for selected calendar date
  const selectedDateClass = useMemo(() => {
    return classesData.find((c) => c.dayNumber === selectedCalendarDate);
  }, [classesData, selectedCalendarDate]);

  // Attendance metrics calculation
  const totalCompletedPast = completedClasses.length + missedClasses.length;
  const attendanceRate =
    totalCompletedPast > 0
      ? Math.round((completedClasses.length / totalCompletedPast) * 100)
      : 100;

  return (
    <DashboardLayout>
      <div className={styles.container}>
        {/* =========================================================================
            1. CLEAN PAGE HEADER (Zero Images / Illustrations)
            ========================================================================= */}
        <section className={styles.headerCard}>
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className={`text-[11px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                    isDark
                      ? "text-blue-300 bg-blue-950/60 border-blue-800/60"
                      : "text-[#0062eb] bg-blue-50 border-blue-200"
                  }`}
                >
                  Live Cohort Schedule
                </span>
                <span
                  className={`text-xs font-semibold ${
                    isDark ? "text-slate-400" : "text-slate-500"
                  }`}
                >
                  NIM AI Career Accelerator • Month 4 Active
                </span>
              </div>
              <h1
                className={`text-2xl sm:text-3xl font-black tracking-tight ${
                  isDark ? "text-white" : "text-[#0a1b39]"
                }`}
              >
                Classes
              </h1>
              <p
                className={`text-xs sm:text-sm font-medium leading-relaxed max-w-2xl ${
                  isDark ? "text-slate-300" : "text-slate-600"
                }`}
              >
                Attend interactive live masterclasses, hands-on GPU labs, review high-definition session recordings, and track your attendance across the 6-month pathway.
              </p>
            </div>

            {/* Attendance & Session Quick Metric Dock */}
            <div
              className={`p-3.5 sm:p-4 rounded-xl border flex items-center gap-4 sm:gap-6 shrink-0 ${
                isDark
                  ? "bg-[#091328] border-[#15254a]"
                  : "bg-slate-50 border-[#dce8f8]"
              }`}
            >
              <div>
                <span className="text-[11px] font-semibold text-slate-400 block">Attendance Rate</span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span
                    className={`text-xl sm:text-2xl font-black ${
                      isDark ? "text-emerald-400" : "text-emerald-600"
                    }`}
                  >
                    {attendanceRate}%
                  </span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                </div>
                <span className="text-[10px] text-slate-400 font-medium">
                  {completedClasses.length} of {totalCompletedPast} attended
                </span>
              </div>

              <div className={`w-px h-10 ${isDark ? "bg-slate-800" : "bg-slate-200"}`} />

              <div>
                <span className="text-[11px] font-semibold text-slate-400 block">Today&apos;s Class</span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-xs sm:text-sm font-black text-[#0062eb]">
                    10:00 AM IST
                  </span>
                  <span className={styles.liveDot} />
                </div>
                <span
                  className={`text-[10px] font-semibold ${
                    isDark ? "text-emerald-400" : "text-emerald-600"
                  }`}
                >
                  Live Stream Ready
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            2. FILTER TABS, SEARCH BAR & VIEW SWITCHER (List vs Calendar)
            ========================================================================= */}
        <section
          className={`p-4 rounded-2xl border flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 ${
            isDark ? "bg-[#081024] border-[#15274d]" : "bg-white border-[#e2edf8] shadow-xs"
          }`}
        >
          {/* Left: Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            {(
              [
                { id: "All", label: "All Classes", count: classesData.length },
                { id: "Upcoming", label: "Upcoming", count: upcomingClasses.length + (todayClass ? 1 : 0) },
                { id: "Completed", label: "Completed", count: completedClasses.length },
                { id: "Missed", label: "Missed", count: missedClasses.length },
              ] as const
            ).map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`${styles.filterPill} ${isActive ? styles.active : ""}`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                      isActive
                        ? "bg-white/20 text-white"
                        : isDark
                        ? "bg-slate-800 text-slate-400"
                        : "bg-slate-100 text-slate-600 border border-slate-200"
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Right: Search Input + View Mode Toggle */}
          <div className="flex items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1 md:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search topic, trainer, module..."
                className={`w-full pl-8 pr-7 py-2 rounded-xl text-xs outline-none border transition ${
                  isDark
                    ? "bg-[#091328] border-[#15254a] text-white placeholder-slate-500 focus:border-[#0062eb]"
                    : "bg-[#f8fbff] border-[#dce8f8] text-[#0a1b39] placeholder-slate-400 focus:border-[#0062eb]"
                }`}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* View Mode Toggle (SRS List vs Calendar) */}
            <div
              className={`p-1 rounded-xl border flex items-center shrink-0 ${
                isDark ? "bg-[#091328] border-[#15254a]" : "bg-slate-100 border-slate-200"
              }`}
            >
              <button
                onClick={() => setViewMode("list")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  viewMode === "list"
                    ? "bg-[#0062eb] text-white shadow-xs"
                    : isDark
                    ? "text-slate-400 hover:text-white"
                    : "text-slate-600 hover:text-[#0a1b39]"
                }`}
                title="List View"
              >
                <ListIcon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">List</span>
              </button>

              <button
                onClick={() => setViewMode("calendar")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  viewMode === "calendar"
                    ? "bg-[#0062eb] text-white shadow-xs"
                    : isDark
                    ? "text-slate-400 hover:text-white"
                    : "text-slate-600 hover:text-[#0a1b39]"
                }`}
                title="Calendar View"
              >
                <CalendarIcon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Calendar</span>
              </button>
            </div>
          </div>
        </section>

        {/* =========================================================================
            3. MAIN CONTENT: LIST VIEW vs CALENDAR VIEW
            ========================================================================= */}
        {viewMode === "list" ? (
          <div className="space-y-6">
            {/* ---------------------------------------------------------------------
                A. TODAY'S CLASS (Main Highlighted Section)
                --------------------------------------------------------------------- */}
            {todayClass && (activeTab === "All" || activeTab === "Upcoming") && (
              <section className={styles.todayHeroCard}>
                <div className="p-6 sm:p-7 space-y-5">
                  {/* Top Bar: Live Pill + Date Indicator */}
                  <div className="flex items-center justify-between gap-3 flex-wrap">
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black border shadow-xs ${
                          isDark
                            ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                            : "bg-emerald-50 text-emerald-700 border-emerald-200"
                        }`}
                      >
                        <span className={styles.liveDot} />
                        TODAY&apos;S LIVE CLASS
                      </span>
                      <span
                        className={`px-2.5 py-0.5 rounded-lg text-xs font-black border ${
                          isDark
                            ? "bg-blue-950/60 text-blue-300 border-blue-900/60"
                            : "bg-blue-50 text-[#0062eb] border-blue-200"
                        }`}
                      >
                        {todayClass.moduleCode}
                      </span>
                    </div>

                    <div
                      className={`flex items-center gap-2 text-xs font-semibold ${
                        isDark ? "text-slate-400" : "text-slate-500"
                      }`}
                    >
                      <CalendarIcon className="w-4 h-4 text-[#0062eb]" />
                      <span>{todayClass.formattedDate}</span>
                    </div>
                  </div>

                  {/* Class Title & Module */}
                  <div>
                    <span
                      className={`text-xs font-bold uppercase tracking-wider block mb-1 ${
                        isDark ? "text-slate-400" : "text-slate-500"
                      }`}
                    >
                      {todayClass.moduleTitle}
                    </span>
                    <h2
                      className={`text-xl sm:text-2xl lg:text-3xl font-black tracking-tight leading-snug ${
                        isDark ? "text-white" : "text-[#0a1b39]"
                      }`}
                    >
                      {todayClass.topic}
                    </h2>
                    <p
                      className={`text-xs sm:text-sm mt-2 leading-relaxed max-w-4xl font-medium ${
                        isDark ? "text-slate-300" : "text-slate-600"
                      }`}
                    >
                      {todayClass.description}
                    </p>
                  </div>

                  {/* 4-Item Metadata Grid (Time, Trainer, Mode, Materials) */}
                  <div
                    className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 rounded-xl border ${
                      isDark
                        ? "bg-[#081024]/80 border-[#15274d]"
                        : "bg-slate-50/80 border-slate-200/80"
                    }`}
                  >
                    {/* 1. Time & Duration */}
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-[#0062eb] flex items-center justify-center shrink-0 mt-0.5">
                        <Clock className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase block">Time &amp; Duration</span>
                        <p className={`text-xs font-bold mt-0.5 ${isDark ? "text-white" : "text-[#0a1b39]"}`}>
                          {todayClass.time}
                        </p>
                        <span className="text-[11px] text-slate-400 font-medium">
                          {todayClass.duration} Masterclass
                        </span>
                      </div>
                    </div>

                    {/* 2. Trainer */}
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center shrink-0 mt-0.5">
                        <User className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase block">Trainer</span>
                        <p className={`text-xs font-bold mt-0.5 ${isDark ? "text-white" : "text-[#0a1b39]"}`}>
                          {todayClass.trainer}
                        </p>
                        <span className="text-[11px] text-slate-400 font-medium truncate block max-w-[170px]" title={todayClass.trainerRole}>
                          {todayClass.trainerRole}
                        </span>
                      </div>
                    </div>

                    {/* 3. Mode & Platform */}
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0 mt-0.5">
                        <Laptop className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase block">Mode &amp; Platform</span>
                        <p className={`text-xs font-bold mt-0.5 ${isDark ? "text-white" : "text-[#0a1b39]"}`}>
                          {todayClass.mode}
                        </p>
                        <span className="text-[11px] text-slate-400 font-medium">
                          {todayClass.locationOrPlatform}
                        </span>
                      </div>
                    </div>

                    {/* 4. Session Materials */}
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0 mt-0.5">
                        <BookOpen className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase block">Class Materials</span>
                        <p className={`text-xs font-bold mt-0.5 ${isDark ? "text-white" : "text-[#0a1b39]"}`}>
                          Slides &amp; Colab Ready
                        </p>
                        <span className="text-[11px] text-slate-400 font-medium">
                          Available for download
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions & Connection Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
                    {/* Material Quick Shortcuts */}
                    <div className="flex items-center gap-2 flex-wrap text-xs">
                      <span className="text-xs font-bold text-slate-400 mr-1">Materials:</span>
                      <button
                        onClick={() => setSelectedClassForModal(todayClass)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition cursor-pointer ${
                          isDark
                            ? "bg-[#081024] border-[#15274d] text-slate-300 hover:bg-[#0e1c3d]"
                            : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50 shadow-2xs"
                        }`}
                      >
                        <FileText className="w-3.5 h-3.5 text-blue-500" />
                        <span>Slides (PDF)</span>
                      </button>
                      <button
                        onClick={() => setSelectedClassForModal(todayClass)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition cursor-pointer ${
                          isDark
                            ? "bg-[#081024] border-[#15274d] text-slate-300 hover:bg-[#0e1c3d]"
                            : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50 shadow-2xs"
                        }`}
                      >
                        <Code2 className="w-3.5 h-3.5 text-emerald-500" />
                        <span>Colab Starter</span>
                      </button>
                    </div>

                    {/* Action Buttons: Join Class & View Details */}
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setSelectedClassForModal(todayClass)}
                        className={`px-4 py-2.5 rounded-xl border text-xs font-bold transition cursor-pointer ${
                          isDark
                            ? "border-[#15274d] text-slate-300 hover:bg-[#0e1c3d] hover:text-white"
                            : "border-slate-300 text-slate-700 hover:bg-slate-100 hover:text-[#0062eb] shadow-2xs"
                        }`}
                      >
                        View Agenda &amp; Details
                      </button>

                      <button
                        onClick={() => setHasJoinedLive(true)}
                        className={`px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white transition flex items-center gap-2 cursor-pointer shadow-md ${
                          hasJoinedLive
                            ? "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/25"
                            : "bg-[#0062eb] hover:bg-[#0052cc] shadow-blue-600/30"
                        }`}
                      >
                        <Video className="w-4 h-4" />
                        <span>{hasJoinedLive ? "Connected • In Class" : "Join Class"}</span>
                      </button>
                    </div>
                  </div>

                  {/* Joined Live Notification Banner */}
                  {hasJoinedLive && (
                    <div
                      className={`p-3 rounded-xl border flex items-center justify-between text-xs font-semibold animate-in fade-in ${
                        isDark
                          ? "bg-emerald-500/10 border-emerald-500/25 text-emerald-400"
                          : "bg-emerald-50 border-emerald-200 text-emerald-700"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        <span>Connected to live lecture session on Google Meet. Attendance automatically logged.</span>
                      </div>
                      <button
                        onClick={() => setHasJoinedLive(false)}
                        className="text-slate-400 hover:text-slate-600 text-xs font-bold underline cursor-pointer ml-3"
                      >
                        Disconnect
                      </button>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* ---------------------------------------------------------------------
                B. UPCOMING CLASSES SECTION
                --------------------------------------------------------------------- */}
            {(activeTab === "All" || activeTab === "Upcoming") && (
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#0062eb]" />
                    <h3 className={`text-base sm:text-lg font-black ${isDark ? "text-white" : "text-[#0a1b39]"}`}>
                      Upcoming Classes
                    </h3>
                    <span className="text-xs font-semibold text-slate-400">
                      ({upcomingClasses.length} Scheduled)
                    </span>
                  </div>
                  <span className="text-xs text-slate-400 font-medium hidden sm:inline">
                    Classes scheduled for Weeks 15 &amp; 16
                  </span>
                </div>

                <div className="space-y-3">
                  {upcomingClasses.map((item) => (
                    <div key={item.id} className={styles.upcomingCard}>
                      {/* Left: Date Box Badge */}
                      <div className="flex items-center gap-4 min-w-0 flex-1">
                        <div className={styles.dateBox}>
                          <span className="text-base sm:text-lg font-black leading-none text-[#0062eb]">
                            {item.dayNumber}
                          </span>
                          <span
                            className={`text-[10px] font-bold uppercase mt-0.5 ${
                              isDark ? "text-slate-400" : "text-slate-500"
                            }`}
                          >
                            {item.monthName}
                          </span>
                        </div>

                        {/* Class Info */}
                        <div className="min-w-0 flex-1 space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                                isDark
                                  ? "bg-blue-950/60 text-blue-300 border-blue-900/60"
                                  : "bg-blue-50 text-[#0062eb] border-blue-200"
                              }`}
                            >
                              {item.moduleCode}
                            </span>
                            <span
                              className={`text-xs font-semibold ${
                                isDark ? "text-slate-400" : "text-slate-500"
                              }`}
                            >
                              {item.formattedDate}
                            </span>
                            <span className={isDark ? "text-slate-700" : "text-slate-300"}>•</span>
                            <span
                              className={`text-xs font-semibold ${
                                isDark ? "text-slate-400" : "text-slate-500"
                              }`}
                            >
                              {item.time} ({item.duration})
                            </span>
                          </div>

                          <h4
                            className={`text-sm sm:text-base font-bold leading-snug truncate ${
                              isDark ? "text-white" : "text-[#0a1b39]"
                            }`}
                            title={item.topic}
                          >
                            {item.topic}
                          </h4>

                          <div
                            className={`flex items-center gap-3 text-xs flex-wrap ${
                              isDark ? "text-slate-400" : "text-slate-600"
                            }`}
                          >
                            <span className="flex items-center gap-1 font-medium">
                              <User className="w-3.5 h-3.5 text-slate-400" />
                              {item.trainer}
                            </span>
                            <span className={isDark ? "text-slate-700" : "text-slate-300"}>•</span>
                            <span className="flex items-center gap-1 font-medium">
                              <Laptop className="w-3.5 h-3.5 text-slate-400" />
                              {item.mode} ({item.locationOrPlatform})
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Status Pill & Action Button */}
                      <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                            isDark
                              ? "bg-blue-950/40 text-blue-300 border-blue-800/60"
                              : "bg-blue-50 text-blue-700 border-blue-200"
                          }`}
                        >
                          {item.status}
                        </span>

                        <button
                          onClick={() => setSelectedClassForModal(item)}
                          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition flex items-center gap-1 cursor-pointer ${
                            isDark
                              ? "border-[#15274d] text-slate-300 hover:bg-[#0e1c3d] hover:text-white"
                              : "border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-[#0062eb] shadow-2xs"
                          }`}
                        >
                          <span>View Class</span>
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* ---------------------------------------------------------------------
                C. RECENT CLASSES & RECORDINGS SECTION
                --------------------------------------------------------------------- */}
            {(activeTab === "All" || activeTab === "Completed" || activeTab === "Missed") && (
              <section className="space-y-4 pt-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <h3 className={`text-base sm:text-lg font-black ${isDark ? "text-white" : "text-[#0a1b39]"}`}>
                      Recent Classes &amp; Attendance
                    </h3>
                    <span className="text-xs font-semibold text-slate-400">
                      ({completedClasses.length + missedClasses.length} Completed)
                    </span>
                  </div>
                  <span className="text-xs text-slate-400 font-medium hidden sm:inline">
                    Watch HD recordings &amp; download code notebooks
                  </span>
                </div>

                <div className="space-y-3">
                  {(activeTab === "Completed"
                    ? completedClasses
                    : activeTab === "Missed"
                    ? missedClasses
                    : [...completedClasses, ...missedClasses].sort(
                        (a, b) => b.dayNumber - a.dayNumber
                      )
                  ).map((item) => {
                    const isAttended = item.attendance === "Present";
                    return (
                      <div
                        key={item.id}
                        className={`p-4 sm:p-5 rounded-2xl border transition flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                          isDark
                            ? "bg-[#081024] border-[#15274d] hover:border-slate-700"
                            : "bg-white border-[#e2edf8] hover:border-slate-300 shadow-xs"
                        }`}
                      >
                        {/* Left: Class Information */}
                        <div className="space-y-1.5 flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                                isDark
                                  ? "bg-slate-800 text-slate-300 border-slate-700"
                                  : "bg-slate-100 text-slate-700 border-slate-200"
                              }`}
                            >
                              {item.moduleCode}
                            </span>
                            <span
                              className={`text-xs font-semibold ${
                                isDark ? "text-slate-400" : "text-slate-500"
                              }`}
                            >
                              {item.formattedDate}
                            </span>
                            <span className={isDark ? "text-slate-700" : "text-slate-300"}>•</span>
                            <span
                              className={`text-xs font-semibold ${
                                isDark ? "text-slate-400" : "text-slate-500"
                              }`}
                            >
                              {item.time}
                            </span>
                            <span className={isDark ? "text-slate-700" : "text-slate-300"}>•</span>
                            <span
                              className={`text-xs font-semibold ${
                                isDark ? "text-slate-400" : "text-slate-500"
                              }`}
                            >
                              {item.trainer}
                            </span>
                          </div>

                          <h4
                            className={`text-sm sm:text-base font-bold leading-snug truncate ${
                              isDark ? "text-white" : "text-[#0a1b39]"
                            }`}
                          >
                            {item.topic}
                          </h4>

                          <p
                            className={`text-xs line-clamp-1 ${
                              isDark ? "text-slate-400" : "text-slate-500"
                            }`}
                          >
                            {item.description}
                          </p>
                        </div>

                        {/* Middle: Attendance Badge */}
                        <div className="shrink-0 flex items-center gap-2">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1.5 border ${
                              isAttended
                                ? isDark
                                  ? "bg-emerald-950/40 text-emerald-300 border-emerald-800/60"
                                  : "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : isDark
                                ? "bg-rose-950/40 text-rose-300 border-rose-800/60"
                                : "bg-rose-50 text-rose-700 border-rose-200"
                            }`}
                          >
                            {isAttended ? (
                              <>
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                                <span>Attended</span>
                              </>
                            ) : (
                              <>
                                <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
                                <span>Missed</span>
                              </>
                            )}
                          </span>
                        </div>

                        {/* Right: Materials & Details */}
                        <div className="flex items-center gap-2 shrink-0 flex-wrap">
                          {item.materials?.recordingDuration && (
                            <button
                              onClick={() => setSelectedClassForModal(item)}
                              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border ${
                                isDark
                                  ? "bg-blue-950/60 text-blue-300 hover:bg-blue-900/60 border-blue-800/60"
                                  : "bg-blue-50 text-[#0062eb] hover:bg-blue-100 border-blue-200"
                              }`}
                            >
                              <Play className="w-3 h-3 fill-current" />
                              <span>Recording ({item.materials.recordingDuration})</span>
                            </button>
                          )}

                          <button
                            onClick={() => setSelectedClassForModal(item)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition flex items-center gap-1 cursor-pointer ${
                              isDark
                                ? "border-[#15274d] text-slate-300 hover:bg-[#0e1c3d] hover:text-white"
                                : "border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-[#0062eb] shadow-2xs"
                            }`}
                          >
                            <span>Details</span>
                            <ChevronRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}
          </div>
        ) : (
          /* =========================================================================
              4. CALENDAR VIEW (SRS Requirement: My Classes Calendar View)
              ========================================================================= */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left 7 Columns: September 2026 Interactive Calendar */}
            <div className={`lg:col-span-7 ${styles.card} p-5 sm:p-6 space-y-4`}>
              {/* Calendar Month Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h3
                    className={`text-lg sm:text-xl font-black ${
                      isDark ? "text-white" : "text-[#0a1b39]"
                    }`}
                  >
                    September 2026
                  </h3>
                  <span
                    className={`text-xs font-semibold ${
                      isDark ? "text-slate-400" : "text-slate-500"
                    }`}
                  >
                    Cohort Schedule • Month 4
                  </span>
                </div>

                <div className="flex items-center gap-1 text-slate-400">
                  <button
                    className={`p-1.5 rounded-lg border transition ${
                      isDark
                        ? "border-[#15274d] hover:bg-slate-800 text-slate-300"
                        : "border-slate-200 hover:bg-slate-100 text-slate-600"
                    }`}
                    title="Previous Month"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    className={`p-1.5 rounded-lg border transition ${
                      isDark
                        ? "border-[#15274d] hover:bg-slate-800 text-slate-300"
                        : "border-slate-200 hover:bg-slate-100 text-slate-600"
                    }`}
                    title="Next Month"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Day Labels */}
              <div
                className={`grid grid-cols-7 gap-1 text-center font-bold text-[11px] py-1 border-b ${
                  isDark
                    ? "border-slate-800 text-slate-400"
                    : "border-slate-200 text-slate-500"
                }`}
              >
                <span>Sun</span>
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
              </div>

              {/* Calendar Grid 7x5 */}
              <div className="grid grid-cols-7 gap-1 text-center">
                {calendarDays.map((day, idx) => {
                  const classOnDay = classesData.find(
                    (c) => c.dayNumber === day.num && day.isCurrentMonth
                  );
                  const isToday = day.isToday;
                  const isSelected = selectedCalendarDate === day.num && day.isCurrentMonth;

                  return (
                    <div
                      key={idx}
                      onClick={() => {
                        if (day.isCurrentMonth) {
                          setSelectedCalendarDate(day.num);
                        }
                      }}
                      className={`${styles.calendarCell} ${
                        isSelected ? styles.calendarCellActive : ""
                      } ${!day.isCurrentMonth ? "opacity-30 cursor-not-allowed" : ""}`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span
                          className={`text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center ${
                            isToday
                              ? "bg-[#0062eb] text-white shadow-xs"
                              : isSelected
                              ? "text-[#0062eb] font-black"
                              : isDark
                              ? "text-slate-300"
                              : "text-slate-800"
                          }`}
                        >
                          {day.num}
                        </span>

                        {classOnDay && (
                          <span
                            className={`w-2 h-2 rounded-full ${
                              classOnDay.status === "Live"
                                ? "bg-emerald-500 animate-pulse"
                                : classOnDay.status === "Completed"
                                ? "bg-emerald-500"
                                : classOnDay.status === "Missed"
                                ? "bg-rose-500"
                                : "bg-[#0062eb]"
                            }`}
                          />
                        )}
                      </div>

                      {classOnDay && (
                        <div className="text-left mt-auto">
                          <span
                            className={`text-[10px] font-bold block truncate leading-tight ${
                              classOnDay.status === "Live"
                                ? "text-emerald-500 font-black"
                                : isDark
                                ? "text-slate-400"
                                : "text-slate-600"
                            }`}
                            title={classOnDay.topic}
                          >
                            {classOnDay.moduleCode}
                          </span>
                          <span className="text-[9px] text-slate-400 block truncate">
                            {classOnDay.time.split("–")[0]}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Calendar Legend */}
              <div
                className={`flex items-center justify-between pt-3 border-t text-[11px] font-semibold flex-wrap gap-2 ${
                  isDark
                    ? "border-slate-800 text-slate-400"
                    : "border-slate-200 text-slate-500"
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span>Live / Today</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#0062eb]" />
                  <span>Scheduled</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                  <span>Completed</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  <span>Missed</span>
                </div>
              </div>
            </div>

            {/* Right 5 Columns: Selected Day Class Details */}
            <div className={`lg:col-span-5 ${styles.card} p-5 sm:p-6 space-y-4`}>
              <div
                className={`flex items-center justify-between border-b pb-3 ${
                  isDark ? "border-slate-800" : "border-slate-200"
                }`}
              >
                <div>
                  <span className="text-[11px] font-bold text-[#0062eb] uppercase tracking-wider block">
                    Selected Date Details
                  </span>
                  <h4 className={`text-base font-black ${isDark ? "text-white" : "text-[#0a1b39]"}`}>
                    {selectedDateClass ? selectedDateClass.formattedDate : `${selectedCalendarDate} September 2026`}
                  </h4>
                </div>
                {selectedDateClass && (
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                      selectedDateClass.status === "Live"
                        ? "bg-emerald-500/15 text-emerald-600 border-emerald-500/30"
                        : selectedDateClass.status === "Completed"
                        ? isDark
                          ? "bg-emerald-950/40 text-emerald-300 border-emerald-800/60"
                          : "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : selectedDateClass.status === "Missed"
                        ? isDark
                          ? "bg-rose-950/40 text-rose-300 border-rose-800/60"
                          : "bg-rose-50 text-rose-700 border-rose-200"
                        : isDark
                        ? "bg-blue-950/40 text-blue-300 border-blue-800/60"
                        : "bg-blue-50 text-[#0062eb] border-blue-200"
                    }`}
                  >
                    {selectedDateClass.status}
                  </span>
                )}
              </div>

              {selectedDateClass ? (
                <div className="space-y-4">
                  <div>
                    <span className="text-xs font-bold text-slate-400">
                      {selectedDateClass.moduleCode} • {selectedDateClass.moduleTitle}
                    </span>
                    <h3 className={`text-lg font-bold leading-snug mt-1 ${isDark ? "text-white" : "text-[#0a1b39]"}`}>
                      {selectedDateClass.topic}
                    </h3>
                    <p className={`text-xs mt-1 leading-relaxed ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                      {selectedDateClass.description}
                    </p>
                  </div>

                  {/* Metadata List */}
                  <div className="space-y-2 text-xs">
                    <div
                      className={`flex items-center gap-2 ${
                        isDark ? "text-slate-400" : "text-slate-500"
                      }`}
                    >
                      <Clock className="w-4 h-4 text-[#0062eb] shrink-0" />
                      <span className={`font-semibold ${isDark ? "text-slate-200" : "text-slate-700"}`}>
                        {selectedDateClass.time} ({selectedDateClass.duration})
                      </span>
                    </div>

                    <div
                      className={`flex items-center gap-2 ${
                        isDark ? "text-slate-400" : "text-slate-500"
                      }`}
                    >
                      <User className="w-4 h-4 text-[#0062eb] shrink-0" />
                      <span className={`font-semibold ${isDark ? "text-slate-200" : "text-slate-700"}`}>
                        {selectedDateClass.trainer}
                      </span>
                    </div>

                    <div
                      className={`flex items-center gap-2 ${
                        isDark ? "text-slate-400" : "text-slate-500"
                      }`}
                    >
                      <Laptop className="w-4 h-4 text-[#0062eb] shrink-0" />
                      <span className={`font-semibold ${isDark ? "text-slate-200" : "text-slate-700"}`}>
                        {selectedDateClass.mode} • {selectedDateClass.locationOrPlatform}
                      </span>
                    </div>

                    {selectedDateClass.status === "Completed" && (
                      <div
                        className={`flex items-center gap-2 font-semibold ${
                          isDark ? "text-emerald-400" : "text-emerald-600"
                        }`}
                      >
                        <CheckCircle2 className="w-4 h-4 shrink-0" />
                        <span>Attendance: Present (Attended)</span>
                      </div>
                    )}
                  </div>

                  {/* Agenda Highlights */}
                  {selectedDateClass.agenda && (
                    <div
                      className={`p-3 rounded-xl border space-y-2 ${
                        isDark
                          ? "bg-slate-900 border-slate-800"
                          : "bg-slate-50 border-slate-200"
                      }`}
                    >
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                        Session Agenda
                      </span>
                      <div className="space-y-1.5">
                        {selectedDateClass.agenda.map((ag, i) => (
                          <div key={i} className="text-xs">
                            <span className="text-[#0062eb] font-bold">{ag.time}</span>:{" "}
                            <span className={isDark ? "text-slate-300" : "text-slate-700"}>{ag.title}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="pt-2 flex items-center justify-between gap-3">
                    <button
                      onClick={() => setSelectedClassForModal(selectedDateClass)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition cursor-pointer ${
                        isDark
                          ? "border-slate-700 text-slate-300 hover:bg-slate-800"
                          : "border-slate-200 text-slate-700 hover:bg-slate-50 shadow-2xs"
                      }`}
                    >
                      View Full Details
                    </button>

                    {selectedDateClass.status === "Live" ? (
                      <button
                        onClick={() => setHasJoinedLive(true)}
                        className="px-4 py-2 rounded-xl bg-[#0062eb] hover:bg-[#0052cc] text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <Video className="w-3.5 h-3.5" />
                        <span>Join Live Now</span>
                      </button>
                    ) : selectedDateClass.materials?.recordingDuration ? (
                      <button
                        onClick={() => setSelectedClassForModal(selectedDateClass)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border ${
                          isDark
                            ? "bg-blue-950/60 text-blue-300 border-blue-900 hover:bg-blue-900/60"
                            : "bg-blue-50 text-[#0062eb] border-blue-200 hover:bg-blue-100"
                        }`}
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Watch Recording</span>
                      </button>
                    ) : null}
                  </div>
                </div>
              ) : (
                <div className="py-12 text-center text-slate-400 space-y-2">
                  <CalendarIcon
                    className={`w-8 h-8 mx-auto ${
                      isDark ? "text-slate-700" : "text-slate-300"
                    }`}
                  />
                  <p className="text-xs font-semibold">
                    No cohort classes scheduled on September {selectedCalendarDate}, 2026.
                  </p>
                  <p className="text-[11px]">
                    Use this study day to review previous lab exercises and catch up on readings.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* =========================================================================
            5. INTERACTIVE CLASS DETAILS & MATERIALS MODAL
            ========================================================================= */}
        {selectedClassForModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
            <div
              className={`w-full max-w-xl rounded-2xl p-6 border shadow-2xl space-y-5 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto ${
                isDark
                  ? "bg-[#0b1429] border-[#1e3363] text-white"
                  : "bg-white border-[#dce8f8] text-[#0a1b39]"
              }`}
            >
              {/* Modal Top Header */}
              <div
                className={`flex items-start justify-between gap-3 border-b pb-4 ${
                  isDark ? "border-slate-800" : "border-slate-200"
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-blue-500/15 text-[#0062eb]">
                      {selectedClassForModal.moduleCode}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                        selectedClassForModal.status === "Live"
                          ? "bg-emerald-500/15 text-emerald-600"
                          : selectedClassForModal.status === "Completed"
                          ? isDark
                            ? "bg-emerald-950/40 text-emerald-300"
                            : "bg-emerald-50 text-emerald-700"
                          : selectedClassForModal.status === "Missed"
                          ? isDark
                            ? "bg-rose-950/40 text-rose-300"
                            : "bg-rose-50 text-rose-700"
                          : isDark
                          ? "bg-blue-950/40 text-blue-300"
                          : "bg-blue-50 text-[#0062eb]"
                      }`}
                    >
                      {selectedClassForModal.status}
                    </span>
                    <span className="text-xs text-slate-400 font-semibold">
                      {selectedClassForModal.formattedDate}
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold leading-snug">
                    {selectedClassForModal.topic}
                  </h3>
                  <p className="text-xs text-slate-400 font-semibold">
                    {selectedClassForModal.moduleTitle}
                  </p>
                </div>

                <button
                  onClick={() => setSelectedClassForModal(null)}
                  className={`p-1 rounded-lg transition cursor-pointer ${
                    isDark
                      ? "text-slate-400 hover:text-white"
                      : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Class Overview & Metadata */}
              <div className="space-y-3">
                <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                  {selectedClassForModal.description}
                </p>

                <div
                  className={`grid grid-cols-2 gap-3 p-3.5 rounded-xl border text-xs ${
                    isDark ? "bg-[#081024] border-[#15274d]" : "bg-slate-50 border-slate-200"
                  }`}
                >
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Time &amp; Duration</span>
                    <span className={`font-bold ${isDark ? "text-slate-200" : "text-slate-800"}`}>
                      {selectedClassForModal.time} ({selectedClassForModal.duration})
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Trainer</span>
                    <span className={`font-bold ${isDark ? "text-slate-200" : "text-slate-800"}`}>
                      {selectedClassForModal.trainer}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Mode &amp; Location</span>
                    <span className={`font-bold ${isDark ? "text-slate-200" : "text-slate-800"}`}>
                      {selectedClassForModal.mode} ({selectedClassForModal.locationOrPlatform})
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Attendance Status</span>
                    <span
                      className={`font-bold ${
                        selectedClassForModal.attendance === "Present"
                          ? isDark
                            ? "text-emerald-400"
                            : "text-emerald-600"
                          : selectedClassForModal.attendance === "Missed"
                          ? isDark
                            ? "text-rose-400"
                            : "text-rose-600"
                          : "text-[#0062eb]"
                      }`}
                    >
                      {selectedClassForModal.attendance}
                    </span>
                  </div>
                </div>
              </div>

              {/* Session Agenda Breakdown */}
              <div className="space-y-2">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
                  Session Breakdown
                </h4>
                <div className="space-y-2">
                  {selectedClassForModal.agenda.map((ag, i) => (
                    <div
                      key={i}
                      className={`p-2.5 rounded-xl border text-xs flex items-start gap-3 ${
                        isDark ? "bg-[#091328] border-[#15254a]" : "bg-slate-50 border-slate-200/80"
                      }`}
                    >
                      <span className="font-bold text-[#0062eb] shrink-0 mt-0.5">{ag.time}</span>
                      <div>
                        <p className={`font-bold ${isDark ? "text-slate-200" : "text-slate-900"}`}>{ag.title}</p>
                        <p className="text-[11px] text-slate-400 font-medium mt-0.5">{ag.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Available Materials (Slides, Colab, Recording) */}
              {selectedClassForModal.materials && (
                <div className="space-y-2">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
                    Class Materials &amp; Downloads
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {selectedClassForModal.materials.slidesName && (
                      <div
                        className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 ${
                          isDark ? "bg-[#091328] border-[#15254a]" : "bg-white border-slate-200"
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <FileText className="w-4 h-4 text-blue-500 shrink-0" />
                          <span className="truncate font-medium">{selectedClassForModal.materials.slidesName}</span>
                        </div>
                        <button
                          onClick={() => alert(`Downloading ${selectedClassForModal.materials?.slidesName}`)}
                          className="p-1 rounded text-slate-400 hover:text-[#0062eb]"
                          title="Download Slides"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    )}

                    {selectedClassForModal.materials.notebookName && (
                      <div
                        className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 ${
                          isDark ? "bg-[#091328] border-[#15254a]" : "bg-white border-slate-200"
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <Code2 className="w-4 h-4 text-emerald-500 shrink-0" />
                          <span className="truncate font-medium">{selectedClassForModal.materials.notebookName}</span>
                        </div>
                        <button
                          onClick={() => alert(`Opening ${selectedClassForModal.materials?.notebookName} in Colab`)}
                          className="p-1 rounded text-slate-400 hover:text-emerald-500"
                          title="Open Notebook"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </button>
                      </div>
                    )}

                    {selectedClassForModal.materials.recordingDuration && (
                      <div
                        className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 sm:col-span-2 ${
                          isDark ? "bg-[#091328] border-[#15254a]" : "bg-white border-slate-200"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Play className="w-4 h-4 text-[#0062eb] fill-current shrink-0" />
                          <div>
                            <span className="font-bold">Full Session HD Recording</span>
                            <span className="text-[10px] text-slate-400 block">
                              Duration: {selectedClassForModal.materials.recordingDuration} • 1080p
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => alert("Launching HD Video Player for this lecture.")}
                          className="px-3 py-1 rounded-lg bg-[#0062eb] text-white text-xs font-bold"
                        >
                          Watch Now
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Bottom Actions */}
              <div
                className={`flex items-center justify-end gap-3 pt-3 border-t ${
                  isDark ? "border-slate-800" : "border-slate-200"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setSelectedClassForModal(null)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold border transition cursor-pointer ${
                    isDark
                      ? "border-slate-700 text-slate-300 hover:bg-slate-800"
                      : "border-slate-200 text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  Close
                </button>

                {selectedClassForModal.status === "Live" && (
                  <button
                    type="button"
                    onClick={() => {
                      setHasJoinedLive(true);
                      setSelectedClassForModal(null);
                    }}
                    className="px-5 py-2 rounded-xl text-xs font-bold bg-[#0062eb] hover:bg-[#0052cc] text-white shadow-md shadow-blue-600/30 flex items-center gap-1.5 cursor-pointer"
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>Join Class Now</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
