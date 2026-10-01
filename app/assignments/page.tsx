"use client";

import React, { useState, useMemo } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useTheme } from "@/components/ThemeProvider";
import styles from "./assignments.module.css";
import {
  FileText,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  ChevronRight,
  ChevronDown,
  Upload,
  X,
  Check,
  Download,
  BookOpen,
  ArrowRight,
  ExternalLink,
  Search,
  Filter,
  Code2,
  Award,
  RotateCcw,
  Sparkles,
  Paperclip,
  Save,
  Send,
  Eye,
  CheckCheck,
} from "lucide-react";

// ============================================================================
// TypeScript Definitions (Matching SRS Assignments Requirements)
// ============================================================================
export type AssignmentStatus =
  | "Pending"
  | "In Progress"
  | "Submitted"
  | "Evaluated"
  | "Overdue";

export type FilterStatus =
  | "All"
  | "Pending"
  | "In Progress"
  | "Submitted"
  | "Evaluated"
  | "Overdue";

export type AssignmentCategory =
  | "Coding Lab"
  | "Mini Project"
  | "Theory & Math"
  | "Analysis";

export interface EvaluationData {
  score: number;
  totalScore: number;
  grade: string;
  evaluatedAt: string;
  evaluator: string;
  evaluatorRole: string;
  feedback: string;
  rubric: {
    criterion: string;
    points: number;
    maxPoints: number;
    comment: string;
  }[];
  allowResubmission?: boolean;
  resubmissionDeadline?: string;
}

export interface AssignmentItem {
  id: string;
  title: string;
  moduleCode: string;
  moduleTitle: string;
  category: AssignmentCategory;
  status: AssignmentStatus;
  dueDate: string; // YYYY-MM-DD
  dayNumber: string;
  monthName: string;
  formattedDueDate: string;
  daysRemainingText: string;
  isUrgent?: boolean;
  objective: string;
  instructions: string[];
  submissionFormat: string[];
  resources: {
    title: string;
    type: "Notebook" | "Dataset" | "Paper" | "Starter Code";
    sizeOrUrl: string;
  }[];
  submission?: {
    githubUrl?: string;
    colabUrl?: string;
    fileName?: string;
    submittedAt?: string;
    notes?: string;
    isDraft?: boolean;
  };
  evaluation?: EvaluationData;
}

export default function AssignmentsPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // State Management
  const [activeStatusFilter, setActiveStatusFilter] = useState<FilterStatus>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedModuleFilter, setSelectedModuleFilter] = useState<string>("All Modules");
  const [sortOrder, setSortOrder] = useState<"earliest" | "latest" | "score">("earliest");

  // Modal Workspace State
  const [activeModalAssignment, setActiveModalAssignment] = useState<AssignmentItem | null>(null);
  const [modalTab, setModalTab] = useState<"overview" | "instructions" | "resources" | "workspace" | "evaluation">("overview");

  // Form Fields within Submission Workspace
  const [submissionGithub, setSubmissionGithub] = useState<string>("");
  const [submissionColab, setSubmissionColab] = useState<string>("");
  const [submissionNotes, setSubmissionNotes] = useState<string>("");
  const [attachedFileName, setAttachedFileName] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitToast, setSubmitToast] = useState<{ type: "success" | "draft"; message: string } | null>(null);

  // ============================================================================
  // Complete Dataset for Month 4 (NLP & Transformers) & Prior Modules
  // ============================================================================
  const [assignments, setAssignments] = useState<AssignmentItem[]>([
    // 1. Pending & Urgent (Due in 2 days)
    {
      id: "asg-01",
      title: "Text Preprocessing & Byte-Pair Encoding (BPE) Tokenizer",
      moduleCode: "MOD-4.1",
      moduleTitle: "NLP Foundations & Subword Tokenizers",
      category: "Coding Lab",
      status: "Pending",
      dueDate: "2026-09-25",
      dayNumber: "25",
      monthName: "SEP",
      formattedDueDate: "Fri, 25 Sep 2026",
      daysRemainingText: "Due in 2 days",
      isUrgent: true,
      objective:
        "Implement a production-grade Byte-Pair Encoding (BPE) subword tokenizer from scratch in Python, handling Unicode normalization and vocabulary merging rules.",
      instructions: [
        "Load the provided Wikipedia English corpus subset (10MB text).",
        "Normalize Unicode characters (NFC form), strip non-alphanumeric noise, and add word boundary markers (</w>).",
        "Build a frequency counting loop for contiguous byte-pairs across token strings.",
        "Implement iterative top-pair merging to build a vocabulary of 5,000 subword tokens.",
        "Benchmark tokenization compression ratio vs. whitespace tokenization.",
      ],
      submissionFormat: [
        "Jupyter Notebook (.ipynb) with execution outputs",
        "Self-contained python script (bpe_tokenizer.py)",
        "JSON vocabulary file containing learned merge ranks",
      ],
      resources: [
        { title: "BPE_Tokenizer_Starter.ipynb", type: "Notebook", sizeOrUrl: "142 KB" },
        { title: "Wiki_Subset_Corpus.txt", type: "Dataset", sizeOrUrl: "10.4 MB" },
        { title: "Sennrich_et_al_BPE_Paper.pdf", type: "Paper", sizeOrUrl: "1.2 MB" },
      ],
      submission: {
        githubUrl: "",
        colabUrl: "",
        fileName: "",
        notes: "",
        isDraft: false,
      },
    },

    // 2. In Progress (Active work)
    {
      id: "asg-02",
      title: "Scaled Dot-Product Attention & Multi-Head Projections in PyTorch",
      moduleCode: "MOD-4.3",
      moduleTitle: "Sequence Models & Attention Mechanisms",
      category: "Coding Lab",
      status: "In Progress",
      dueDate: "2026-09-28",
      dayNumber: "28",
      monthName: "SEP",
      formattedDueDate: "Mon, 28 Sep 2026",
      daysRemainingText: "Due in 5 days",
      isUrgent: false,
      objective:
        "Derive and code multi-head self-attention mechanisms with scaled dot-products, causal triangular masking, and linear projection weights in PyTorch.",
      instructions: [
        "Create custom PyTorch nn.Module for MultiHeadAttention.",
        "Implement Query, Key, Value affine tensor projections and split across 8 heads.",
        "Implement scaled matrix multiplication with sqrt(d_k) normalization.",
        "Apply causal lower-triangular masking for autoregressive sequence decoding.",
        "Verify gradient flow and pass unit tests comparing against torch.nn.MultiheadAttention.",
      ],
      submissionFormat: [
        "PyTorch module implementation (.py or .ipynb)",
        "Benchmarking script comparing custom attention vs. PyTorch native attention",
      ],
      resources: [
        { title: "Attention_Mechanisms_Scratch.ipynb", type: "Notebook", sizeOrUrl: "215 KB" },
        { title: "Attention_Is_All_You_Need.pdf", type: "Paper", sizeOrUrl: "2.1 MB" },
      ],
      submission: {
        githubUrl: "https://github.com/student/multihead-attention-pytorch",
        colabUrl: "",
        fileName: "multihead_attention.py",
        notes: "Completed basic dot-product matrix multiplication; working on causal masking tests.",
        isDraft: true,
      },
    },

    // 3. Overdue (Requires Immediate Attention)
    {
      id: "asg-03",
      title: "Build an End-to-End Text Classification Pipeline (IMDB Sentiment)",
      moduleCode: "MOD-4.1",
      moduleTitle: "NLP Foundations & Subword Tokenizers",
      category: "Mini Project",
      status: "Overdue",
      dueDate: "2026-09-10",
      dayNumber: "10",
      monthName: "SEP",
      formattedDueDate: "Thu, 10 Sep 2026",
      daysRemainingText: "Overdue by 13 days",
      isUrgent: true,
      objective:
        "Construct an end-to-end sentiment classification model using TF-IDF n-gram vectorization, Logistic Regression, and Naive Bayes on 50,000 IMDB movie reviews.",
      instructions: [
        "Clean raw text reviews using regex pipelines and lemmatization.",
        "Construct sublinear TF-IDF matrix with n-grams range (1, 2) and min_df=5.",
        "Train Logistic Regression with L2 regularization and evaluate ROC-AUC.",
        "Perform error analysis on false positive and false negative samples.",
        "Deploy a lightweight CLI or Streamlit inference script for live sentiment score testing.",
      ],
      submissionFormat: [
        "GitHub repository link with requirements.txt and README.md",
        "Model serialization artifact (.joblib or .pkl)",
        "Summary evaluation report with confusion matrix and F1 scores",
      ],
      resources: [
        { title: "IMDB_Dataset_50K.csv", type: "Dataset", sizeOrUrl: "66.2 MB" },
        { title: "Text_Classification_Baseline.ipynb", type: "Notebook", sizeOrUrl: "180 KB" },
      ],
      submission: {
        githubUrl: "",
        colabUrl: "",
        fileName: "",
        notes: "",
        isDraft: false,
      },
    },

    // 4. Submitted (Awaiting Trainer Review)
    {
      id: "asg-04",
      title: "Word Embeddings & Semantic Vector Space Visualization",
      moduleCode: "MOD-4.2",
      moduleTitle: "Word Embeddings & Vector Semantics",
      category: "Analysis",
      status: "Submitted",
      dueDate: "2026-09-18",
      dayNumber: "18",
      monthName: "SEP",
      formattedDueDate: "Fri, 18 Sep 2026",
      daysRemainingText: "Submitted on 17 Sep • Under Review",
      isUrgent: false,
      objective:
        "Train Skip-Gram word vectors on domain-specific news articles, evaluate semantic word analogies, and visualize high-dimensional embeddings using 2D t-SNE.",
      instructions: [
        "Train Word2Vec model using Gensim with dimension=300, window=5, negative=5.",
        "Compute cosine similarity for target word pairs (e.g. king - man + woman = queen).",
        "Perform t-SNE dimensional reduction and plot interactive semantic clusters.",
        "Document findings on semantic bias and word associations in the learned space.",
      ],
      submissionFormat: [
        "Jupyter Notebook with t-SNE interactive plots",
        "Exported vector weights (.bin or .kv)",
        "Short analytical summary PDF",
      ],
      resources: [
        { title: "Word2Vec_Analysis_Template.ipynb", type: "Notebook", sizeOrUrl: "320 KB" },
        { title: "News_Corpus_Domain_50MB.txt", type: "Dataset", sizeOrUrl: "52 MB" },
      ],
      submission: {
        githubUrl: "https://github.com/student/word2vec-semantic-analysis",
        colabUrl: "https://colab.research.google.com/drive/1A4B8C9D0E1F2G3H4",
        fileName: "Word_Embeddings_Analysis.ipynb",
        submittedAt: "17 Sep 2026, 11:20 PM",
        notes: "Trained 300d embeddings on the news corpus. Generated 2D t-SNE scatter plots for capital-country pairs.",
        isDraft: false,
      },
    },

    // 5. Submitted (Awaiting Trainer Review)
    {
      id: "asg-05",
      title: "Transformer Architecture & Layer Normalization Math Derivation",
      moduleCode: "MOD-4.3",
      moduleTitle: "Sequence Models & Attention Mechanisms",
      category: "Theory & Math",
      status: "Submitted",
      dueDate: "2026-09-22",
      dayNumber: "22",
      monthName: "SEP",
      formattedDueDate: "Tue, 22 Sep 2026",
      daysRemainingText: "Submitted on 21 Sep • Under Review",
      isUrgent: false,
      objective:
        "Provide rigorous mathematical derivations for Layer Normalization vs. Batch Normalization, Pre-LN vs. Post-LN stability, and causal sequence masking.",
      instructions: [
        "Derive mean and variance equations for LayerNorm across hidden dimensions (d_model).",
        "Explain gradient backpropagation advantages of Pre-LN over Post-LN in deep stacks (>= 48 layers).",
        "Prove that scaled dot product division by sqrt(d_k) prevents softmax saturation.",
      ],
      submissionFormat: [
        "Mathematical report in LaTeX / PDF format",
        "Clear handwritten or typed equations",
      ],
      resources: [
        { title: "Transformer_Math_Formulations.pdf", type: "Paper", sizeOrUrl: "950 KB" },
      ],
      submission: {
        githubUrl: "",
        colabUrl: "",
        fileName: "Transformer_LayerNorm_Derivation.pdf",
        submittedAt: "21 Sep 2026, 09:45 PM",
        notes: "Included full LaTeX proofs for LayerNorm gradient propagation and Pre-LN variance preservation.",
        isDraft: false,
      },
    },

    // 6. Evaluated (Grade A+ • 96/100)
    {
      id: "asg-06",
      title: "Recurrent Neural Networks (RNN) vs LSTM & GRU Benchmark",
      moduleCode: "MOD-4.3",
      moduleTitle: "Sequence Models & Attention Mechanisms",
      category: "Coding Lab",
      status: "Evaluated",
      dueDate: "2026-09-15",
      dayNumber: "15",
      monthName: "SEP",
      formattedDueDate: "Tue, 15 Sep 2026",
      daysRemainingText: "Evaluated on 19 Sep",
      isUrgent: false,
      objective:
        "Implement LSTM and GRU memory gates from scratch, analyze the vanishing gradient problem on long sequences, and benchmark runtime convergence speeds.",
      instructions: [
        "Implement custom LSTM cell with input, forget, and output gates.",
        "Train on synthetic sequence copying task with delays from 20 to 150 time steps.",
        "Plot gradient norm magnitudes across backpropagation through time (BPTT).",
      ],
      submissionFormat: [
        "Jupyter Notebook (.ipynb) with comparison graphs",
        "Executive technical summary report",
      ],
      resources: [
        { title: "LSTM_Cell_Scratch_Starter.ipynb", type: "Notebook", sizeOrUrl: "185 KB" },
      ],
      submission: {
        githubUrl: "https://github.com/student/lstm-gru-scratch-pytorch",
        colabUrl: "https://colab.research.google.com/drive/2B3C4D5E6F7G8H9I0",
        fileName: "LSTM_GRU_Benchmarking.ipynb",
        submittedAt: "14 Sep 2026, 08:30 PM",
        notes: "Implemented all gates using raw tensor operations. Included synthetic memory delay benchmarks up to 150 steps.",
        isDraft: false,
      },
      evaluation: {
        score: 96,
        totalScore: 100,
        grade: "Grade A+",
        evaluatedAt: "19 Sep 2026",
        evaluator: "Priya Sharma",
        evaluatorRole: "Lead AI Research Instructor",
        feedback:
          "Exceptional implementation! Your cell state linear gradient highway proof was clearly articulated, and your synthetic copying task benchmark convincingly demonstrated where vanilla RNN gradients vanish. Clean, modular PyTorch code with excellent tensor shape comments.",
        rubric: [
          {
            criterion: "Gate Mathematical Formulation & Code",
            points: 38,
            maxPoints: 40,
            comment: "Flawless gate implementation and tensor broadcasting logic.",
          },
          {
            criterion: "BPTT Gradient Analysis & Plots",
            points: 30,
            maxPoints: 30,
            comment: "Clear logarithmic gradient magnitude plots illustrating vanishing gradients.",
          },
          {
            criterion: "Code Quality & Documentation",
            points: 28,
            maxPoints: 30,
            comment: "Very clean code. Could add docstrings for parameter shapes.",
          },
        ],
        allowResubmission: false,
      },
    },

    // 7. Evaluated (Grade A • 92/100)
    {
      id: "asg-07",
      title: "Word2Vec Skip-Gram Model with Negative Sampling from Scratch",
      moduleCode: "MOD-4.2",
      moduleTitle: "Word Embeddings & Vector Semantics",
      category: "Coding Lab",
      status: "Evaluated",
      dueDate: "2026-09-08",
      dayNumber: "08",
      monthName: "SEP",
      formattedDueDate: "Tue, 08 Sep 2026",
      daysRemainingText: "Evaluated on 12 Sep",
      isUrgent: false,
      objective:
        "Build a custom Word2Vec Skip-Gram model with unigram distribution negative sampling using PyTorch nn.Embedding layers.",
      instructions: [
        "Extract target-context word pairs using a sliding window of size 5.",
        "Implement unigram distribution powered by 3/4 exponent for negative sampling.",
        "Write custom Binary Cross Entropy loss function with sigmoid logits.",
      ],
      submissionFormat: [
        "PyTorch script and Jupyter Notebook with training loss convergence curves",
      ],
      resources: [
        { title: "SkipGram_NegativeSampling_Template.ipynb", type: "Notebook", sizeOrUrl: "210 KB" },
      ],
      submission: {
        githubUrl: "https://github.com/student/word2vec-negative-sampling",
        fileName: "word2vec_skipgram_custom.py",
        submittedAt: "07 Sep 2026, 10:15 PM",
        notes: "Trained on text8 subset. Unigram table size: 100,000 entries.",
        isDraft: false,
      },
      evaluation: {
        score: 92,
        totalScore: 100,
        grade: "Grade A",
        evaluatedAt: "12 Sep 2026",
        evaluator: "Rahul Mehta",
        evaluatorRole: "Senior Deep Learning Architect",
        feedback:
          "Very strong submission. The unigram 3/4 negative sampling noise distribution was mathematically accurate and properly indexed. The model converged smoothly on the text8 sample.",
        rubric: [
          {
            criterion: "Objective Function & Loss Derivation",
            points: 36,
            maxPoints: 40,
            comment: "Correct BCE with logits implementation.",
          },
          {
            criterion: "Negative Sampling Table Efficiency",
            points: 28,
            maxPoints: 30,
            comment: "Precomputed cumulative probability table was fast and memory efficient.",
          },
          {
            criterion: "Convergence & Evaluation",
            points: 28,
            maxPoints: 30,
            comment: "Word analogy accuracy evaluated on Mikolov benchmark set.",
          },
        ],
        allowResubmission: false,
      },
    },

    // 8. Evaluated with Resubmission Allowed (Grade B+ • 85/100)
    {
      id: "asg-08",
      title: "BERT Pre-training Cloze Tasks & Masked LM Loss Masking",
      moduleCode: "MOD-4.4",
      moduleTitle: "Transformer Architecture & Hugging Face",
      category: "Analysis",
      status: "Evaluated",
      dueDate: "2026-09-02",
      dayNumber: "02",
      monthName: "SEP",
      formattedDueDate: "Wed, 02 Sep 2026",
      daysRemainingText: "Evaluated on 06 Sep • Resubmission Allowed",
      isUrgent: false,
      objective:
        "Simulate BERT Masked Language Model 80/10/10 token replacement policy and compute cross-entropy loss specifically over masked token positions.",
      instructions: [
        "Implement random masking on 15% of sequence tokens.",
        "Apply 80% [MASK], 10% random token, and 10% original token distribution.",
        "Calculate cross entropy loss using torch.where ignoring unmasked token indices (-100 index).",
      ],
      submissionFormat: [
        "Jupyter Notebook with loss masking logic and token prediction examples",
      ],
      resources: [
        { title: "BERT_Masking_Lab_Template.ipynb", type: "Notebook", sizeOrUrl: "175 KB" },
      ],
      submission: {
        githubUrl: "https://github.com/student/bert-loss-masking",
        fileName: "bert_cloze_masking.ipynb",
        submittedAt: "01 Sep 2026, 07:15 PM",
        notes: "Initial submission of BERT token masking logic.",
        isDraft: false,
      },
      evaluation: {
        score: 85,
        totalScore: 100,
        grade: "Grade B+",
        evaluatedAt: "06 Sep 2026",
        evaluator: "Amit Verma",
        evaluatorRole: "NLP Systems Specialist",
        feedback:
          "Good foundation on the 80/10/10 token replacement rule. However, your loss computation still included non-masked pad tokens in the reduction denominator, leading to slightly deflated cross-entropy values. Resubmission is configured if you wish to adjust the ignore_index and improve your grade.",
        rubric: [
          {
            criterion: "80/10/10 Replacement Implementation",
            points: 38,
            maxPoints: 40,
            comment: "Accurately handled subword index swaps.",
          },
          {
            criterion: "Loss Masking & Cross-Entropy",
            points: 25,
            maxPoints: 35,
            comment: "Pad token exclusion from loss reduction needs correction (use ignore_index=-100).",
          },
          {
            criterion: "Documentation & Analysis",
            points: 22,
            maxPoints: 25,
            comment: "Clear report, missing parameter scale comparison.",
          },
        ],
        allowResubmission: true,
        resubmissionDeadline: "30 Sep 2026",
      },
    },
  ]);

  // ============================================================================
  // Derived Statistics (For the 4 Compact Overview Cards)
  // ============================================================================
  const totalCount = assignments.length;
  const pendingCount = useMemo(
    () => assignments.filter((a) => a.status === "Pending" || a.status === "In Progress").length,
    [assignments]
  );
  const submittedCount = useMemo(
    () => assignments.filter((a) => a.status === "Submitted").length,
    [assignments]
  );
  const overdueCount = useMemo(
    () => assignments.filter((a) => a.status === "Overdue").length,
    [assignments]
  );
  const evaluatedCount = useMemo(
    () => assignments.filter((a) => a.status === "Evaluated").length,
    [assignments]
  );

  // Urgent Assignments for "Needs Your Attention" Section
  const urgentAssignments = useMemo(
    () => assignments.filter((a) => a.status === "Overdue" || a.isUrgent),
    [assignments]
  );

  // Evaluated Assignments for "Recent Evaluations" Section
  const evaluatedAssignments = useMemo(
    () => assignments.filter((a) => a.status === "Evaluated" && a.evaluation),
    [assignments]
  );

  // Filtered & Sorted Assignments for the Main List
  const filteredAssignments = useMemo(() => {
    let result = assignments;

    // 1. Status Filter Tab
    if (activeStatusFilter === "Pending") {
      result = result.filter((a) => a.status === "Pending");
    } else if (activeStatusFilter === "In Progress") {
      result = result.filter((a) => a.status === "In Progress");
    } else if (activeStatusFilter === "Submitted") {
      result = result.filter((a) => a.status === "Submitted");
    } else if (activeStatusFilter === "Evaluated") {
      result = result.filter((a) => a.status === "Evaluated");
    } else if (activeStatusFilter === "Overdue") {
      result = result.filter((a) => a.status === "Overdue");
    }

    // 2. Module Filter
    if (selectedModuleFilter !== "All Modules") {
      result = result.filter((a) => a.moduleCode === selectedModuleFilter);
    }

    // 3. Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.moduleTitle.toLowerCase().includes(q) ||
          a.moduleCode.toLowerCase().includes(q) ||
          a.category.toLowerCase().includes(q) ||
          a.objective.toLowerCase().includes(q)
      );
    }

    // 4. Sorting
    const sorted = [...result];
    if (sortOrder === "earliest") {
      sorted.sort((a, b) => a.dueDate.localeCompare(b.dueDate));
    } else if (sortOrder === "latest") {
      sorted.sort((a, b) => b.dueDate.localeCompare(a.dueDate));
    } else if (sortOrder === "score") {
      sorted.sort((a, b) => (b.evaluation?.score || 0) - (a.evaluation?.score || 0));
    }

    return sorted;
  }, [assignments, activeStatusFilter, selectedModuleFilter, searchQuery, sortOrder]);

  // Open Modal Handler
  const handleOpenModal = (
    item: AssignmentItem,
    defaultTab: "overview" | "instructions" | "resources" | "workspace" | "evaluation" = "overview"
  ) => {
    setActiveModalAssignment(item);
    setModalTab(defaultTab);
    setSubmissionGithub(item.submission?.githubUrl || "");
    setSubmissionColab(item.submission?.colabUrl || "");
    setSubmissionNotes(item.submission?.notes || "");
    setAttachedFileName(item.submission?.fileName || "");
  };

  // Close Modal Handler
  const handleCloseModal = () => {
    setActiveModalAssignment(null);
  };

  // Handle Save Draft
  const handleSaveDraft = () => {
    if (!activeModalAssignment) return;
    const updatedAssignments = assignments.map((item) => {
      if (item.id === activeModalAssignment.id) {
        return {
          ...item,
          status: item.status === "Pending" ? ("In Progress" as AssignmentStatus) : item.status,
          submission: {
            ...item.submission,
            githubUrl: submissionGithub,
            colabUrl: submissionColab,
            notes: submissionNotes,
            fileName: attachedFileName,
            isDraft: true,
          },
        };
      }
      return item;
    });
    setAssignments(updatedAssignments);
    setSubmitToast({ type: "draft", message: "Draft progress saved successfully!" });
    setTimeout(() => setSubmitToast(null), 3500);
  };

  // Handle Full Submit Assignment
  const handleSubmitAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeModalAssignment) return;

    if (!submissionGithub.trim() && !submissionColab.trim() && !attachedFileName.trim()) {
      alert("Please provide at least a GitHub URL, Google Colab link, or attach a file before submitting.");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const now = new Date();
      const timestampText = `${now.getDate()} Sep 2026, ${now.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}`;

      const updatedAssignments = assignments.map((item) => {
        if (item.id === activeModalAssignment.id) {
          return {
            ...item,
            status: "Submitted" as AssignmentStatus,
            daysRemainingText: `Submitted on ${timestampText} • Under Review`,
            submission: {
              githubUrl: submissionGithub,
              colabUrl: submissionColab,
              notes: submissionNotes,
              fileName: attachedFileName || "assignment_submission.zip",
              submittedAt: timestampText,
              isDraft: false,
            },
          };
        }
        return item;
      });

      setAssignments(updatedAssignments);
      setIsSubmitting(false);
      setSubmitToast({
        type: "success",
        message: "Assignment submitted successfully! Trainer review queued.",
      });
      setTimeout(() => setSubmitToast(null), 4000);
      handleCloseModal();
    }, 700);
  };

  // Handle Resubmission Trigger (Unlocks Submission Form)
  const handleTriggerResubmit = (item: AssignmentItem) => {
    setActiveModalAssignment(item);
    setModalTab("workspace");
    setSubmissionGithub(item.submission?.githubUrl || "");
    setSubmissionColab(item.submission?.colabUrl || "");
    setSubmissionNotes(`Revised submission addressing trainer feedback: `);
    setAttachedFileName(item.submission?.fileName || "");
  };

  // Helper for Status Pills
  const getStatusBadge = (status: AssignmentStatus, score?: number) => {
    switch (status) {
      case "Pending":
        return {
          label: "Pending",
          className: isDark
            ? "bg-amber-950/40 text-amber-300 border-amber-800/60"
            : "bg-amber-50 text-amber-700 border-amber-200",
        };
      case "In Progress":
        return {
          label: "In Progress",
          className: isDark
            ? "bg-blue-950/40 text-blue-300 border-blue-800/60"
            : "bg-blue-50 text-[#0062eb] border-blue-200",
        };
      case "Submitted":
        return {
          label: "Submitted",
          className: isDark
            ? "bg-purple-950/40 text-purple-300 border-purple-800/60"
            : "bg-purple-50 text-purple-700 border-purple-200",
        };
      case "Evaluated":
        return {
          label: score ? `Evaluated • ${score}/100` : "Evaluated",
          className: isDark
            ? "bg-emerald-950/40 text-emerald-300 border-emerald-800/60"
            : "bg-emerald-50 text-emerald-700 border-emerald-200",
        };
      case "Overdue":
        return {
          label: "Overdue",
          className: isDark
            ? "bg-rose-950/40 text-rose-300 border-rose-800/60"
            : "bg-rose-50 text-rose-700 border-rose-200",
        };
    }
  };

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
                  Academic Workspaces
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
                Assignments
              </h1>
              <p
                className={`text-xs sm:text-sm font-medium leading-relaxed max-w-2xl ${
                  isDark ? "text-slate-300" : "text-slate-600"
                }`}
              >
                Complete weekly coding implementations, submit research problem sets, monitor grading statuses, and review actionable feedback from lead instructors.
              </p>
            </div>

            {/* Quick Summary Pill Dock */}
            <div
              className={`p-3.5 sm:p-4 rounded-xl border flex items-center gap-4 sm:gap-6 shrink-0 ${
                isDark ? "bg-[#091328] border-[#15254a]" : "bg-slate-50 border-[#dce8f8]"
              }`}
            >
              <div>
                <span className="text-[11px] font-semibold text-slate-400 block">Graded Average</span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span
                    className={`text-xl sm:text-2xl font-black ${
                      isDark ? "text-emerald-400" : "text-emerald-600"
                    }`}
                  >
                    93.3%
                  </span>
                  <Award className="w-4 h-4 text-emerald-500" />
                </div>
                <span className="text-[10px] text-slate-400 font-medium">
                  {evaluatedCount} assignments evaluated
                </span>
              </div>

              <div className={`w-px h-10 ${isDark ? "bg-slate-800" : "bg-slate-200"}`} />

              <div>
                <span className="text-[11px] font-semibold text-slate-400 block">Current Action</span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-xs sm:text-sm font-black text-[#0062eb]">
                    {pendingCount} Pending
                  </span>
                </div>
                <span
                  className={`text-[10px] font-semibold ${
                    overdueCount > 0 ? "text-rose-500 font-bold" : "text-slate-400"
                  }`}
                >
                  {overdueCount > 0 ? `${overdueCount} Past Due Date` : "All schedules on track"}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Global Toast Alert */}
        {submitToast && (
          <div
            className={`p-4 rounded-xl border flex items-center justify-between text-xs font-semibold animate-in fade-in ${
              submitToast.type === "success"
                ? isDark
                  ? "bg-emerald-950/40 border-emerald-800/60 text-emerald-300"
                  : "bg-emerald-50 border-emerald-200 text-emerald-800"
                : isDark
                ? "bg-blue-950/40 border-blue-800/60 text-blue-300"
                : "bg-blue-50 border-blue-200 text-blue-800"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>{submitToast.message}</span>
            </div>
            <button
              onClick={() => setSubmitToast(null)}
              className="text-slate-400 hover:text-slate-600 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* =========================================================================
            2. FOUR COMPACT OVERVIEW CARDS
            ========================================================================= */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {/* Card 1: Total Assignments */}
          <div className={styles.statCard}>
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-blue-500/10 text-[#0062eb] flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block truncate">
                Total Assignments
              </span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className={`text-xl sm:text-2xl font-black ${isDark ? "text-white" : "text-[#0a1b39]"}`}>
                  {totalCount}
                </span>
                <span className="text-[11px] text-slate-400 font-medium">Month 4</span>
              </div>
            </div>
          </div>

          {/* Card 2: Pending Tasks */}
          <div className={styles.statCard}>
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block truncate">
                Pending
              </span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className={`text-xl sm:text-2xl font-black ${isDark ? "text-white" : "text-[#0a1b39]"}`}>
                  {pendingCount}
                </span>
                <span
                  className={`text-[11px] font-medium ${
                    isDark ? "text-amber-400" : "text-amber-600"
                  }`}
                >
                  Actionable
                </span>
              </div>
            </div>
          </div>

          {/* Card 3: Submitted */}
          <div className={styles.statCard}>
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center shrink-0">
              <CheckCheck className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block truncate">
                Submitted
              </span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className={`text-xl sm:text-2xl font-black ${isDark ? "text-white" : "text-[#0a1b39]"}`}>
                  {submittedCount}
                </span>
                <span
                  className={`text-[11px] font-medium ${
                    isDark ? "text-purple-400" : "text-purple-600"
                  }`}
                >
                  In Review
                </span>
              </div>
            </div>
          </div>

          {/* Card 4: Overdue */}
          <div className={styles.statCard}>
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center shrink-0">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block truncate">
                Overdue
              </span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className={`text-xl sm:text-2xl font-black ${isDark ? "text-white" : "text-[#0a1b39]"}`}>
                  {overdueCount}
                </span>
                <span
                  className={`text-[11px] font-medium ${
                    isDark ? "text-rose-400" : "text-rose-600"
                  }`}
                >
                  {overdueCount > 0 ? "Urgent" : "None"}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            3. PROMINENT "NEEDS YOUR ATTENTION" SECTION
            ========================================================================= */}
        {urgentAssignments.length > 0 && (
          <section className={styles.urgentCard}>
            <div className="flex items-center justify-between gap-3 mb-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />
                <h3 className={`text-sm sm:text-base font-black ${isDark ? "text-rose-200" : "text-rose-950"}`}>
                  Needs Your Attention
                </h3>
                <span className="px-2 py-0.2 rounded-full text-[10px] font-black bg-rose-500/15 text-rose-600 border border-rose-500/30">
                  {urgentAssignments.length} Items Require Action
                </span>
              </div>
              <span className="text-xs text-slate-400 font-medium hidden sm:inline">
                Resolve overdue deliverables and imminent deadlines
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {urgentAssignments.map((item) => (
                <div
                  key={item.id}
                  className={`p-3.5 sm:p-4 rounded-xl border flex flex-col justify-between gap-3 transition ${
                    isDark
                      ? "bg-[#11070d]/80 border-rose-900/40 hover:border-rose-700/60"
                      : "bg-white border-rose-200 hover:border-rose-300 shadow-2xs"
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-bold text-rose-500 uppercase tracking-wider">
                        {item.status === "Overdue" ? "● Past Due Date" : "● Approaching Deadline"}
                      </span>
                      <span className="text-xs font-bold text-slate-400">
                        {item.formattedDueDate}
                      </span>
                    </div>

                    <h4
                      className={`text-sm font-bold leading-snug line-clamp-1 ${
                        isDark ? "text-white" : "text-[#0a1b39]"
                      }`}
                      title={item.title}
                    >
                      {item.title}
                    </h4>

                    <p className="text-xs text-slate-400 font-medium">
                      {item.moduleCode} • {item.moduleTitle}
                    </p>
                  </div>

                  <div
                    className={`flex items-center justify-between gap-2 pt-2 border-t ${
                      isDark ? "border-rose-900/30" : "border-rose-100"
                    }`}
                  >
                    <span
                      className={`text-xs font-bold ${
                        isDark ? "text-rose-400" : "text-rose-600"
                      }`}
                    >
                      {item.daysRemainingText}
                    </span>
                    <button
                      onClick={() => handleOpenModal(item, "workspace")}
                      className="px-3.5 py-1.5 rounded-lg bg-[#0062eb] hover:bg-[#0052cc] text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <span>{item.status === "Overdue" ? "Submit Now" : "Work on Assignment"}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* =========================================================================
            4. STATUS FILTERS, SEARCH BAR & CONTROLS
            ========================================================================= */}
        <section
          className={`p-4 rounded-2xl border flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 ${
            isDark ? "bg-[#081024] border-[#15274d]" : "bg-white border-[#e2edf8] shadow-xs"
          }`}
        >
          {/* Status Filter Tabs (6 states) */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0">
            {(
              [
                { id: "All", label: "All", count: assignments.length },
                {
                  id: "Pending",
                  label: "Pending",
                  count: assignments.filter((a) => a.status === "Pending").length,
                },
                {
                  id: "In Progress",
                  label: "In Progress",
                  count: assignments.filter((a) => a.status === "In Progress").length,
                },
                {
                  id: "Submitted",
                  label: "Submitted",
                  count: assignments.filter((a) => a.status === "Submitted").length,
                },
                {
                  id: "Evaluated",
                  label: "Evaluated",
                  count: assignments.filter((a) => a.status === "Evaluated").length,
                },
                {
                  id: "Overdue",
                  label: "Overdue",
                  count: assignments.filter((a) => a.status === "Overdue").length,
                },
              ] as const
            ).map((tab) => {
              const isActive = activeStatusFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveStatusFilter(tab.id)}
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

          {/* Search, Module Filter & Sort Order */}
          <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-56">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search assignments..."
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

            {/* Module Filter Dropdown */}
            <select
              value={selectedModuleFilter}
              onChange={(e) => setSelectedModuleFilter(e.target.value)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold outline-none border transition cursor-pointer ${
                isDark
                  ? "bg-[#091328] border-[#15254a] text-slate-200"
                  : "bg-[#f8fbff] border-[#dce8f8] text-[#0a1b39]"
              }`}
            >
              <option value="All Modules">All Modules</option>
              <option value="MOD-4.1">MOD-4.1: NLP Foundations</option>
              <option value="MOD-4.2">MOD-4.2: Word Embeddings</option>
              <option value="MOD-4.3">MOD-4.3: Attention Models</option>
              <option value="MOD-4.4">MOD-4.4: Transformers</option>
            </select>

            {/* Sort Order Dropdown */}
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as "earliest" | "latest" | "score")}
              className={`px-3 py-2 rounded-xl text-xs font-semibold outline-none border transition cursor-pointer ${
                isDark
                  ? "bg-[#091328] border-[#15254a] text-slate-200"
                  : "bg-[#f8fbff] border-[#dce8f8] text-[#0a1b39]"
              }`}
            >
              <option value="earliest">Due: Earliest First</option>
              <option value="latest">Due: Latest First</option>
              <option value="score">Score: High to Low</option>
            </select>
          </div>
        </section>

        {/* =========================================================================
            5. MAIN ASSIGNMENT LIST
            ========================================================================= */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#0062eb]" />
              <h3 className={`text-base sm:text-lg font-black ${isDark ? "text-white" : "text-[#0a1b39]"}`}>
                Assignment List
              </h3>
              <span className="text-xs font-semibold text-slate-400">
                ({filteredAssignments.length} Displayed)
              </span>
            </div>
            <span className="text-xs text-slate-400 font-medium hidden sm:inline">
              Click View Assignment to open workspace &amp; instructions
            </span>
          </div>

          {filteredAssignments.length === 0 ? (
            <div className={`p-12 text-center rounded-2xl border space-y-2 ${isDark ? "bg-[#081024] border-[#15274d]" : "bg-white border-slate-200"}`}>
              <FileText className={`w-8 h-8 mx-auto ${isDark ? "text-slate-700" : "text-slate-300"}`} />
              <p className={`text-sm font-bold ${isDark ? "text-white" : "text-slate-800"}`}>
                No assignments match your active filters.
              </p>
              <p className="text-xs text-slate-400">
                Try switching the status filter to &ldquo;All&rdquo; or clearing your search keywords.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredAssignments.map((item) => {
                const badge = getStatusBadge(item.status, item.evaluation?.score);
                const isOverdue = item.status === "Overdue";

                return (
                  <div key={item.id} className={styles.assignmentRow}>
                    {/* Left: Date Box Tile */}
                    <div className="flex items-center gap-4 min-w-0 flex-1">
                      <div className={`${styles.dateBox} ${isOverdue ? styles.dateBoxOverdue : ""}`}>
                        <span
                          className={`text-base sm:text-lg font-black leading-none ${
                            isOverdue ? "text-rose-600" : "text-[#0062eb]"
                          }`}
                        >
                          {item.dayNumber}
                        </span>
                        <span
                          className={`text-[10px] font-bold uppercase mt-0.5 ${
                            isOverdue
                              ? "text-rose-500"
                              : isDark
                              ? "text-slate-400"
                              : "text-slate-500"
                          }`}
                        >
                          {item.monthName}
                        </span>
                      </div>

                      {/* Assignment Info */}
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
                            className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                              isDark
                                ? "bg-slate-800 text-slate-300 border-slate-700"
                                : "bg-slate-100 text-slate-700 border-slate-200"
                            }`}
                          >
                            {item.category}
                          </span>
                          <span className={isDark ? "text-slate-700" : "text-slate-300"}>•</span>
                          <span
                            className={`text-xs font-semibold ${
                              isOverdue
                                ? isDark
                                  ? "text-rose-400 font-bold"
                                  : "text-rose-600 font-bold"
                                : isDark
                                ? "text-slate-400"
                                : "text-slate-500"
                            }`}
                          >
                            {item.daysRemainingText}
                          </span>
                        </div>

                        <h4
                          className={`text-sm sm:text-base font-bold leading-snug truncate ${
                            isDark ? "text-white" : "text-[#0a1b39]"
                          }`}
                          title={item.title}
                        >
                          {item.title}
                        </h4>

                        <p
                          className={`text-xs line-clamp-1 ${
                            isDark ? "text-slate-400" : "text-slate-500"
                          }`}
                        >
                          {item.objective}
                        </p>
                      </div>
                    </div>

                    {/* Right: Status Pill & Actions */}
                    <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${badge.className}`}>
                        {badge.label}
                      </span>

                      {item.status === "Evaluated" ? (
                        <button
                          onClick={() => handleOpenModal(item, "evaluation")}
                          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition flex items-center gap-1.5 cursor-pointer ${
                            isDark
                              ? "bg-emerald-950/40 text-emerald-300 border-emerald-800/60 hover:bg-emerald-900/40"
                              : "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                          }`}
                        >
                          <Award className="w-3.5 h-3.5" />
                          <span>View Feedback</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleOpenModal(item, "overview")}
                          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition flex items-center gap-1 cursor-pointer ${
                            isDark
                              ? "border-[#15274d] text-slate-300 hover:bg-[#0e1c3d] hover:text-white"
                              : "border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-[#0062eb] shadow-2xs"
                          }`}
                        >
                          <span>View Assignment</span>
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* =========================================================================
            6. RECENT EVALUATIONS SECTION
            ========================================================================= */}
        <section className="space-y-4 pt-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-500" />
              <h3 className={`text-base sm:text-lg font-black ${isDark ? "text-white" : "text-[#0a1b39]"}`}>
                Recent Evaluations &amp; Grades
              </h3>
              <span className="text-xs font-semibold text-slate-400">
                ({evaluatedAssignments.length} Graded by Instructors)
              </span>
            </div>
            <span className="text-xs text-slate-400 font-medium hidden sm:inline">
              Review rubric rubrics, trainer comments and score breakdowns
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {evaluatedAssignments.map((item) => {
              const evalData = item.evaluation!;
              return (
                <div key={item.id} className={styles.evalCard}>
                  <div className="space-y-3">
                    {/* Header: Module + Score Pill */}
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                          isDark
                            ? "bg-slate-800 text-slate-300 border-slate-700"
                            : "bg-slate-100 text-slate-700 border-slate-200"
                        }`}
                      >
                        {item.moduleCode}
                      </span>

                      <div className="flex items-center gap-1.5">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-black border border-emerald-500/30 ${
                            isDark
                              ? "bg-emerald-500/15 text-emerald-400"
                              : "bg-emerald-50 text-emerald-700 border-emerald-200"
                          }`}
                        >
                          {evalData.score} / {evalData.totalScore}
                        </span>
                        <span className="text-[11px] font-bold text-slate-400">
                          ({evalData.grade})
                        </span>
                      </div>
                    </div>

                    {/* Title */}
                    <div>
                      <h4
                        className={`text-sm font-bold leading-snug line-clamp-1 ${
                          isDark ? "text-white" : "text-[#0a1b39]"
                        }`}
                        title={item.title}
                      >
                        {item.title}
                      </h4>
                      <span className="text-[11px] text-slate-400 font-medium block mt-0.5">
                        Evaluated by {evalData.evaluator} on {evalData.evaluatedAt}
                      </span>
                    </div>

                    {/* Feedback Snippet */}
                    <div
                      className={`p-3 rounded-xl border text-xs leading-relaxed line-clamp-3 italic ${
                        isDark ? "bg-[#091328] border-[#15254a] text-slate-300" : "bg-slate-50 border-slate-200 text-slate-600"
                      }`}
                    >
                      &ldquo;{evalData.feedback}&rdquo;
                    </div>

                    {/* Action Bar */}
                    <div
                      className={`flex items-center justify-between gap-2 pt-2 border-t ${
                        isDark ? "border-slate-800" : "border-slate-100"
                      }`}
                    >
                      {evalData.allowResubmission ? (
                        <span
                          className={`text-[11px] font-bold flex items-center gap-1 ${
                            isDark ? "text-amber-400" : "text-amber-600"
                          }`}
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>Resubmission Allowed</span>
                        </span>
                      ) : (
                        <span
                          className={`text-[11px] font-semibold flex items-center gap-1 ${
                            isDark ? "text-emerald-400" : "text-emerald-600"
                          }`}
                        >
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Final Grade Confirmed</span>
                        </span>
                      )}

                      <button
                        onClick={() => handleOpenModal(item, "evaluation")}
                        className="text-xs font-bold text-[#0062eb] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <span>View Report</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* =========================================================================
            7. INTERACTIVE ASSIGNMENT DETAIL & SUBMISSION WORKSPACE (Modal)
            ========================================================================= */}
        {activeModalAssignment && (
          <div className={styles.modalOverlay}>
            <div className={styles.modalDialog}>
              <div className="p-6 space-y-5">
                {/* Modal Top Header */}
                <div
                  className={`flex items-start justify-between gap-3 border-b pb-4 ${
                    isDark ? "border-slate-800" : "border-slate-200"
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-blue-500/15 text-[#0062eb]">
                        {activeModalAssignment.moduleCode}
                      </span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                          getStatusBadge(activeModalAssignment.status, activeModalAssignment.evaluation?.score).className
                        }`}
                      >
                        {activeModalAssignment.status}
                      </span>
                      <span className="text-xs text-slate-400 font-semibold">
                        Due: {activeModalAssignment.formattedDueDate}
                      </span>
                    </div>

                    <h2
                      className={`text-lg sm:text-xl font-black leading-snug ${
                        isDark ? "text-white" : "text-[#0a1b39]"
                      }`}
                    >
                      {activeModalAssignment.title}
                    </h2>
                    <p className="text-xs text-slate-400 font-semibold">
                      {activeModalAssignment.moduleTitle} • {activeModalAssignment.category}
                    </p>
                  </div>

                  <button
                    onClick={handleCloseModal}
                    className={`p-1.5 rounded-lg transition cursor-pointer ${
                      isDark ? "text-slate-400 hover:text-white hover:bg-slate-800" : "text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Modal Tab Switcher */}
                <div
                  className={`flex items-center gap-1 p-1 rounded-xl border overflow-x-auto text-xs font-bold ${
                    isDark ? "bg-[#081024] border-[#15274d]" : "bg-slate-100 border-slate-200"
                  }`}
                >
                  <button
                    onClick={() => setModalTab("overview")}
                    className={`px-3 py-1.5 rounded-lg transition cursor-pointer shrink-0 ${
                      modalTab === "overview"
                        ? "bg-[#0062eb] text-white shadow-xs"
                        : isDark
                        ? "text-slate-400 hover:text-white"
                        : "text-slate-600 hover:text-[#0a1b39]"
                    }`}
                  >
                    Objective &amp; Brief
                  </button>

                  <button
                    onClick={() => setModalTab("instructions")}
                    className={`px-3 py-1.5 rounded-lg transition cursor-pointer shrink-0 ${
                      modalTab === "instructions"
                        ? "bg-[#0062eb] text-white shadow-xs"
                        : isDark
                        ? "text-slate-400 hover:text-white"
                        : "text-slate-600 hover:text-[#0a1b39]"
                    }`}
                  >
                    Instructions
                  </button>

                  <button
                    onClick={() => setModalTab("resources")}
                    className={`px-3 py-1.5 rounded-lg transition cursor-pointer shrink-0 ${
                      modalTab === "resources"
                        ? "bg-[#0062eb] text-white shadow-xs"
                        : isDark
                        ? "text-slate-400 hover:text-white"
                        : "text-slate-600 hover:text-[#0a1b39]"
                    }`}
                  >
                    Resources ({activeModalAssignment.resources.length})
                  </button>

                  <button
                    onClick={() => setModalTab("workspace")}
                    className={`px-3 py-1.5 rounded-lg transition cursor-pointer shrink-0 ${
                      modalTab === "workspace"
                        ? "bg-[#0062eb] text-white shadow-xs"
                        : isDark
                        ? "text-slate-400 hover:text-white"
                        : "text-slate-600 hover:text-[#0a1b39]"
                    }`}
                  >
                    Submission Area
                  </button>

                  {activeModalAssignment.evaluation && (
                    <button
                      onClick={() => setModalTab("evaluation")}
                      className={`px-3 py-1.5 rounded-lg transition cursor-pointer shrink-0 ${
                        modalTab === "evaluation"
                          ? "bg-emerald-600 text-white shadow-xs"
                          : isDark
                          ? "text-emerald-400 hover:text-emerald-300"
                          : "text-emerald-700 hover:text-emerald-900"
                      }`}
                    >
                      Evaluation &amp; Score ({activeModalAssignment.evaluation.score}/100)
                    </button>
                  )}
                </div>

                {/* Tab 1: Objective & Brief */}
                {modalTab === "overview" && (
                  <div className="space-y-4 text-xs sm:text-sm">
                    <div>
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                        Learning Objective
                      </h4>
                      <p className={`leading-relaxed ${isDark ? "text-slate-200" : "text-slate-700"}`}>
                        {activeModalAssignment.objective}
                      </p>
                    </div>

                    {/* Metadata Summary Pill Dock */}
                    <div
                      className={`grid grid-cols-2 sm:grid-cols-3 gap-3 p-3.5 rounded-xl border text-xs ${
                        isDark ? "bg-[#081024] border-[#15274d]" : "bg-slate-50 border-slate-200"
                      }`}
                    >
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold uppercase block">Due Date</span>
                        <span className={`font-bold ${isDark ? "text-slate-200" : "text-slate-800"}`}>
                          {activeModalAssignment.formattedDueDate}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold uppercase block">Category</span>
                        <span className={`font-bold ${isDark ? "text-slate-200" : "text-slate-800"}`}>
                          {activeModalAssignment.category}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold uppercase block">Status</span>
                        <span className={`font-bold ${isDark ? "text-slate-200" : "text-slate-800"}`}>
                          {activeModalAssignment.status}
                        </span>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                        Deliverable Requirements
                      </h4>
                      <ul
                        className={`space-y-1.5 list-disc list-inside text-xs ${
                          isDark ? "text-slate-400" : "text-slate-500"
                        }`}
                      >
                        {activeModalAssignment.submissionFormat.map((fmt, i) => (
                          <li key={i}>{fmt}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-2 flex justify-end">
                      <button
                        onClick={() => setModalTab("instructions")}
                        className="px-4 py-2 rounded-xl bg-[#0062eb] hover:bg-[#0052cc] text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <span>View Instructions</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Tab 2: Instructions */}
                {modalTab === "instructions" && (
                  <div className="space-y-4 text-xs sm:text-sm">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Step-by-Step Instructions
                    </h4>

                    <div className="space-y-2.5">
                      {activeModalAssignment.instructions.map((step, idx) => (
                        <div
                          key={idx}
                          className={`p-3 rounded-xl border flex items-start gap-3 ${
                            isDark ? "bg-[#081024] border-[#15274d]" : "bg-slate-50 border-slate-200"
                          }`}
                        >
                          <span className="w-5 h-5 rounded-full bg-[#0062eb] text-white text-[11px] font-black flex items-center justify-center shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <p className={`text-xs leading-relaxed ${isDark ? "text-slate-200" : "text-slate-700"}`}>
                            {step}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2 flex justify-end">
                      <button
                        onClick={() => setModalTab("workspace")}
                        className="px-4 py-2 rounded-xl bg-[#0062eb] hover:bg-[#0052cc] text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <span>Open Submission Area</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Tab 3: Resources */}
                {modalTab === "resources" && (
                  <div className="space-y-4 text-xs sm:text-sm">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Starter Files &amp; Documentation
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {activeModalAssignment.resources.map((res, i) => (
                        <div
                          key={i}
                          className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 ${
                            isDark ? "bg-[#081024] border-[#15274d]" : "bg-white border-slate-200 shadow-2xs"
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-[#0062eb] flex items-center justify-center shrink-0">
                              <Download className="w-4 h-4" />
                            </div>
                            <div className="min-w-0">
                              <span
                                className={`text-xs font-bold block truncate ${
                                  isDark ? "text-white" : "text-[#0a1b39]"
                                }`}
                                title={res.title}
                              >
                                {res.title}
                              </span>
                              <span className="text-[10px] text-slate-400 font-medium">
                                {res.type} • {res.sizeOrUrl}
                              </span>
                            </div>
                          </div>

                          <button
                            onClick={() => alert(`Downloading ${res.title}...`)}
                            className={`px-2.5 py-1.5 rounded-lg border text-xs font-bold transition cursor-pointer shrink-0 ${
                              isDark
                                ? "border-slate-700 hover:bg-slate-800 text-slate-300"
                                : "border-slate-200 hover:bg-slate-100 text-slate-700"
                            }`}
                          >
                            Get File
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tab 4: Submission Area */}
                {modalTab === "workspace" && (
                  <form onSubmit={handleSubmitAssignment} className="space-y-4 text-xs">
                    {/* Submission History / Current Status */}
                    {activeModalAssignment.submission?.submittedAt && (
                      <div
                        className={`p-3 rounded-xl border flex items-center justify-between ${
                          isDark ? "bg-purple-950/20 border-purple-800/40 text-purple-300" : "bg-purple-50 border-purple-200 text-purple-800"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <CheckCheck className="w-4 h-4 text-purple-500 shrink-0" />
                          <span>Last submitted on {activeModalAssignment.submission.submittedAt}</span>
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-purple-500/15 px-2 py-0.5 rounded">
                          Under Review
                        </span>
                      </div>
                    )}

                    {/* GitHub Repo URL */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                        GitHub / GitLab Repository URL
                      </label>
                      <input
                        type="url"
                        value={submissionGithub}
                        onChange={(e) => setSubmissionGithub(e.target.value)}
                        placeholder="https://github.com/your-username/repo-name"
                        className={`w-full px-3.5 py-2.5 rounded-xl outline-none border transition text-xs ${
                          isDark
                            ? "bg-[#081024] border-[#15274d] text-white placeholder-slate-500 focus:border-[#0062eb]"
                            : "bg-[#f8fbff] border-slate-200 text-[#0a1b39] placeholder-slate-400 focus:border-[#0062eb]"
                        }`}
                      />
                    </div>

                    {/* Google Colab URL */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                        Google Colab Notebook URL (Optional)
                      </label>
                      <input
                        type="url"
                        value={submissionColab}
                        onChange={(e) => setSubmissionColab(e.target.value)}
                        placeholder="https://colab.research.google.com/drive/..."
                        className={`w-full px-3.5 py-2.5 rounded-xl outline-none border transition text-xs ${
                          isDark
                            ? "bg-[#081024] border-[#15274d] text-white placeholder-slate-500 focus:border-[#0062eb]"
                            : "bg-[#f8fbff] border-slate-200 text-[#0a1b39] placeholder-slate-400 focus:border-[#0062eb]"
                        }`}
                      />
                    </div>

                    {/* File Attachment Drag & Drop Mock */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                        Upload Notebook or Source Code Archive (.ipynb, .py, .zip, .pdf)
                      </label>

                      <div
                        onClick={() => {
                          const mockFiles = [
                            "assignment_solution.ipynb",
                            "model_weights.pt",
                            "technical_report.pdf",
                          ];
                          const picked = mockFiles[Math.floor(Math.random() * mockFiles.length)];
                          setAttachedFileName(picked);
                        }}
                        className={`p-4 rounded-xl border-2 border-dashed text-center cursor-pointer transition ${
                          attachedFileName
                            ? "border-emerald-500 bg-emerald-500/5"
                            : isDark
                            ? "border-slate-700 hover:border-[#0062eb] bg-[#081024]"
                            : "border-slate-300 hover:border-[#0062eb] bg-slate-50"
                        }`}
                      >
                        {attachedFileName ? (
                          <div
                            className={`flex items-center justify-center gap-2 font-bold ${
                              isDark ? "text-emerald-400" : "text-emerald-600"
                            }`}
                          >
                            <Paperclip className="w-4 h-4" />
                            <span>Attached: {attachedFileName}</span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setAttachedFileName("");
                              }}
                              className="text-slate-400 hover:text-rose-500 ml-2"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <div className="space-y-1">
                            <Upload className="w-6 h-6 mx-auto text-slate-400" />
                            <p
                              className={`font-semibold ${
                                isDark ? "text-slate-300" : "text-slate-600"
                              }`}
                            >
                              Click or drag and drop files here to upload
                            </p>
                            <p className="text-[10px] text-slate-400">
                              Maximum file size: 50MB per deliverable
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Notes to Trainer */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                        Notes or Questions for Trainer (Optional)
                      </label>
                      <textarea
                        rows={3}
                        value={submissionNotes}
                        onChange={(e) => setSubmissionNotes(e.target.value)}
                        placeholder="Mention any challenges encountered, architectural trade-offs, or questions for your evaluator..."
                        className={`w-full px-3.5 py-2.5 rounded-xl outline-none border transition text-xs ${
                          isDark
                            ? "bg-[#081024] border-[#15274d] text-white placeholder-slate-500 focus:border-[#0062eb]"
                            : "bg-[#f8fbff] border-slate-200 text-[#0a1b39] placeholder-slate-400 focus:border-[#0062eb]"
                        }`}
                      />
                    </div>

                    {/* Workspace Actions: Save Draft & Submit Assignment */}
                    <div
                      className={`pt-2 flex items-center justify-between gap-3 border-t ${
                        isDark ? "border-slate-800" : "border-slate-100"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={handleSaveDraft}
                        className={`px-4 py-2 rounded-xl text-xs font-bold border transition flex items-center gap-1.5 cursor-pointer ${
                          isDark
                            ? "border-slate-700 text-slate-300 hover:bg-slate-800"
                            : "border-slate-200 text-slate-700 hover:bg-slate-100 shadow-2xs"
                        }`}
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>Save Draft</span>
                      </button>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-6 py-2 rounded-xl bg-[#0062eb] hover:bg-[#0052cc] text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-md disabled:opacity-50"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>{isSubmitting ? "Submitting..." : "Submit Assignment"}</span>
                      </button>
                    </div>
                  </form>
                )}

                {/* Tab 5: Evaluation & Feedback (When Evaluated) */}
                {modalTab === "evaluation" && activeModalAssignment.evaluation && (
                  <div className="space-y-4 text-xs sm:text-sm">
                    {/* Score Hero Banner */}
                    <div
                      className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                        isDark ? "bg-emerald-950/20 border-emerald-800/40" : "bg-emerald-50 border-emerald-200"
                      }`}
                    >
                      <div className="space-y-0.5">
                        <span
                          className={`text-[11px] font-bold uppercase tracking-wider block ${
                            isDark ? "text-emerald-400" : "text-emerald-600"
                          }`}
                        >
                          Final Trainer Evaluation
                        </span>
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-2xl sm:text-3xl font-black ${
                              isDark ? "text-emerald-400" : "text-emerald-600"
                            }`}
                          >
                            {activeModalAssignment.evaluation.score} / {activeModalAssignment.evaluation.totalScore}
                          </span>
                          <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 border border-emerald-500/30">
                            {activeModalAssignment.evaluation.grade}
                          </span>
                        </div>
                      </div>

                      <div className="text-left sm:text-right text-xs">
                        <span className="text-slate-400 block">Evaluated by</span>
                        <span className={`font-bold block ${isDark ? "text-white" : "text-[#0a1b39]"}`}>
                          {activeModalAssignment.evaluation.evaluator}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {activeModalAssignment.evaluation.evaluatorRole} • {activeModalAssignment.evaluation.evaluatedAt}
                        </span>
                      </div>
                    </div>

                    {/* Rubric Breakdown Table */}
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                        Grading Rubric Breakdown
                      </h4>

                      <div className="space-y-2">
                        {activeModalAssignment.evaluation.rubric.map((r, i) => (
                          <div
                            key={i}
                            className={`p-3 rounded-xl border text-xs space-y-1 ${
                              isDark ? "bg-[#081024] border-[#15274d]" : "bg-slate-50 border-slate-200"
                            }`}
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span className={`font-bold ${isDark ? "text-white" : "text-[#0a1b39]"}`}>
                                {r.criterion}
                              </span>
                              <span className="font-black text-[#0062eb]">
                                {r.points} / {r.maxPoints} pts
                              </span>
                            </div>
                            <p className="text-slate-400 font-medium">{r.comment}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Trainer Written Comments */}
                    <div className="space-y-1.5">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                        Trainer Commentary &amp; Recommendations
                      </h4>
                      <div
                        className={`p-3.5 rounded-xl border text-xs leading-relaxed italic ${
                          isDark ? "bg-[#081024] border-[#15274d] text-slate-200" : "bg-white border-slate-200 text-slate-700 shadow-2xs"
                        }`}
                      >
                        &ldquo;{activeModalAssignment.evaluation.feedback}&rdquo;
                      </div>
                    </div>

                    {/* Resubmission Section (When Configured) */}
                    {activeModalAssignment.evaluation.allowResubmission && (
                      <div
                        className={`p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                          isDark ? "bg-amber-950/20 border-amber-800/40 text-amber-300" : "bg-amber-50 border-amber-200 text-amber-800"
                        }`}
                      >
                        <div className="space-y-0.5">
                          <span className="text-xs font-bold flex items-center gap-1.5">
                            <RotateCcw className="w-3.5 h-3.5 text-amber-600" />
                            <span>Resubmission Window Open</span>
                          </span>
                          <p className="text-[11px] text-slate-400 font-medium">
                            You may submit an updated version addressing trainer notes until {activeModalAssignment.evaluation.resubmissionDeadline}.
                          </p>
                        </div>

                        <button
                          onClick={() => handleTriggerResubmit(activeModalAssignment)}
                          className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs shrink-0"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>Resubmit Revision</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
