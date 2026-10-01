// Parent Portal Data Service & API Integration Layer
// Returns linked student data for logged-in parent

export interface LinkedStudent {
  id: string;
  name: string;
  photoUrl: string;
  email: string;
  phone: string;
  course: string;
  batch: string;
  mentor: string;
  mentorRole: string;
  enrollmentStatus: string;
  joiningDate: string;
  expectedGraduation: string;
  attendancePercentage: number;
}

export interface ParentProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  relation: string;
  linkedStudentId: string;
}

export interface AttendanceRecord {
  id: string;
  date: string;
  time: string;
  topic: string;
  module: string;
  mentor: string;
  status: "Present" | "Absent" | "Late";
}

export interface ClassSession {
  id: string;
  topic: string;
  module: string;
  date: string;
  time: string;
  mentor: string;
  meetingLink: string;
  status: "Upcoming" | "Live Now" | "Completed";
}

export interface AssessmentRecord {
  id: string;
  name: string;
  module: string;
  date: string;
  score: string;
  status: "Passed" | "Pending" | "Under Review";
  feedback: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  category: "Class" | "Attendance" | "Assessment" | "General";
  date: string;
  read: boolean;
}

export interface FeeRecord {
  totalFee: number;
  paidAmount: number;
  pendingAmount: number;
  dueDate: string;
  nextInstallmentAmount: number;
  paymentHistory: {
    id: string;
    description: string;
    date: string;
    amount: number;
    paymentMode: string;
    status: "Paid" | "Pending" | "Due Soon";
    receiptNumber: string;
  }[];
}

export interface ModuleTopic {
  id: string;
  title: string;
  type: "Online Class" | "Hands-on Lab" | "Reading" | "Assessment";
  duration: string;
  status: "Completed" | "In Progress" | "Upcoming";
}

export interface CurriculumModule {
  id: string;
  code: string;
  title: string;
  description: string;
  duration: string;
  status: "Completed" | "In Progress" | "Upcoming";
  progressPercentage: number;
  topics: ModuleTopic[];
}

export interface CurriculumData {
  courseName: string;
  programCode: string;
  totalDuration: string;
  modules: CurriculumModule[];
}

// Database store for linked parent-student relationships
const mockDatabase = {
  parents: [
    {
      id: "PAR001",
      name: "Ramesh Kumar",
      email: "ramesh.kumar@example.com",
      phone: "+91 98123 45678",
      relation: "Father",
      linkedStudentId: "STU001",
    },
  ] as ParentProfile[],

  students: {
    STU001: {
      id: "STU001",
      name: "Arjun Kumar",
      photoUrl: "/avatar.jpg",
      email: "arjun.kumar@nim.academy",
      phone: "+91 98765 43210",
      course: "Generative AI & LLMs",
      batch: "AI Cohort 2026 - Morning Batch",
      mentor: "Priya Sharma",
      mentorRole: "Lead AI Mentor",
      enrollmentStatus: "Active & Enrolled",
      joiningDate: "15 May 2026",
      expectedGraduation: "November 2026",
      attendancePercentage: 92,
    } as LinkedStudent,
  },

  attendance: {
    STU001: [
      {
        id: "att-101",
        date: "28 Sep 2026",
        time: "10:00 AM – 1:00 PM",
        topic: "Scaled Dot-Product Attention & Multi-Head Projections",
        module: "Module 2: NLP & Transformers",
        mentor: "Priya Sharma",
        status: "Present",
      },
      {
        id: "att-102",
        date: "25 Sep 2026",
        time: "10:00 AM – 1:00 PM",
        topic: "Transformer Encoder & Decoder Architecture Deep Dive",
        module: "Module 2: NLP & Transformers",
        mentor: "Priya Sharma",
        status: "Present",
      },
      {
        id: "att-103",
        date: "23 Sep 2026",
        time: "10:00 AM – 1:00 PM",
        topic: "Positional Encodings & Matrix Mathematics in PyTorch",
        module: "Module 2: NLP & Transformers",
        mentor: "Priya Sharma",
        status: "Present",
      },
      {
        id: "att-104",
        date: "20 Sep 2026",
        time: "10:00 AM – 1:00 PM",
        topic: "Recurrent Neural Networks (RNN) to LSTMs",
        module: "Module 2: NLP & Transformers",
        mentor: "Priya Sharma",
        status: "Present",
      },
      {
        id: "att-105",
        date: "18 Sep 2026",
        time: "10:00 AM – 1:00 PM",
        topic: "Word Embeddings: Word2Vec, GloVe & FastText",
        module: "Module 2: NLP & Transformers",
        mentor: "Priya Sharma",
        status: "Absent",
      },
      {
        id: "att-106",
        date: "15 Sep 2026",
        time: "10:00 AM – 1:00 PM",
        topic: "Convolutional Neural Networks for Image Classification",
        module: "Module 1: Deep Learning Foundations",
        mentor: "Priya Sharma",
        status: "Present",
      },
      {
        id: "att-107",
        date: "12 Sep 2026",
        time: "10:00 AM – 1:00 PM",
        topic: "Backpropagation & Gradient Descent Algorithms",
        module: "Module 1: Deep Learning Foundations",
        mentor: "Priya Sharma",
        status: "Present",
      },
      {
        id: "att-108",
        date: "10 Sep 2026",
        time: "10:00 AM – 1:00 PM",
        topic: "Neural Network Architecture & Activation Functions",
        module: "Module 1: Deep Learning Foundations",
        mentor: "Priya Sharma",
        status: "Late",
      },
      {
        id: "att-109",
        date: "08 Sep 2026",
        time: "10:00 AM – 1:00 PM",
        topic: "Supervised Learning Models: SVMs & Decision Trees",
        module: "Module 1: Deep Learning Foundations",
        mentor: "Priya Sharma",
        status: "Present",
      },
      {
        id: "att-110",
        date: "05 Sep 2026",
        time: "10:00 AM – 1:00 PM",
        topic: "Exploratory Data Analysis & Feature Engineering",
        module: "Module 1: Deep Learning Foundations",
        mentor: "Priya Sharma",
        status: "Present",
      },
    ] as AttendanceRecord[],
  },

  classes: {
    STU001: [
      {
        id: "cls-201",
        topic: "Prompt Engineering & In-Context Learning Techniques",
        module: "Module 3: Generative AI & Large Language Models",
        date: "02 Oct 2026",
        time: "10:00 AM – 12:00 PM IST",
        mentor: "Priya Sharma",
        meetingLink: "https://meet.google.com/nim-genai-live",
        status: "Upcoming",
      },
      {
        id: "cls-202",
        topic: "Building Vector Search with FAISS & ChromaDB",
        module: "Module 4: Retrieval-Augmented Generation (RAG)",
        date: "05 Oct 2026",
        time: "10:00 AM – 12:00 PM IST",
        mentor: "Priya Sharma",
        meetingLink: "https://meet.google.com/nim-genai-live",
        status: "Upcoming",
      },
      {
        id: "cls-203",
        topic: "Fine-Tuning LLMs using QLoRA and PEFT",
        module: "Module 3: Generative AI & Large Language Models",
        date: "08 Oct 2026",
        time: "10:00 AM – 12:30 PM IST",
        mentor: "Priya Sharma",
        meetingLink: "https://meet.google.com/nim-genai-live",
        status: "Upcoming",
      },
      {
        id: "cls-204",
        topic: "LangChain Agents & Custom Tool Integration",
        module: "Module 5: Autonomous AI Agents",
        date: "12 Oct 2026",
        time: "10:00 AM – 12:00 PM IST",
        mentor: "Priya Sharma",
        meetingLink: "https://meet.google.com/nim-genai-live",
        status: "Upcoming",
      },
    ] as ClassSession[],
  },

  assessments: {
    STU001: [
      {
        id: "ass-301",
        name: "Evaluation 1: Deep Learning & Matrix Math Gateway",
        module: "Module 1: Deep Learning Foundations",
        date: "15 Sep 2026",
        score: "88 / 100 (88%)",
        status: "Passed",
        feedback: "Outstanding score! Arjun demonstrated clear mastery of tensor reshaping, loss functions, and PyTorch autograd.",
      },
      {
        id: "ass-302",
        name: "Lab Assignment 3: Multi-Head Attention Implementation",
        module: "Module 2: NLP & Transformers",
        date: "22 Sep 2026",
        score: "92 / 100 (92%)",
        status: "Passed",
        feedback: "Excellent code clean-up and PyTorch matrix multiplication logic. High attention to detail on scaled dot-product scaling.",
      },
      {
        id: "ass-303",
        name: "Quiz #4: Word Embeddings & Vector Spaces",
        module: "Module 2: NLP & Transformers",
        date: "25 Sep 2026",
        score: "85 / 100 (85%)",
        status: "Passed",
        feedback: "Good grasp of semantic vector distances and cosine similarity concepts.",
      },
      {
        id: "ass-304",
        name: "Mid-Term Project: End-to-End Sentiment Classifier",
        module: "Module 2: NLP & Transformers",
        date: "29 Sep 2026",
        score: "90 / 100 (90%)",
        status: "Passed",
        feedback: "Well-structured repository, clean dataset pipeline, and robust evaluation metrics logging.",
      },
      {
        id: "ass-305",
        name: "Evaluation 2: LLM Fine-Tuning & RAG Capstone Project",
        module: "Module 4: Retrieval-Augmented Generation (RAG)",
        date: "15 Oct 2026",
        score: "Pending Submission",
        status: "Pending",
        feedback: "Scheduled for submission on 15 Oct 2026. Guidelines available in Curriculum portal.",
      },
    ] as AssessmentRecord[],
  },

  notifications: {
    STU001: [
      {
        id: "notif-401",
        title: "Live Class Scheduled: Prompt Engineering & In-Context Learning",
        message: "Next live session is set for 02 Oct 2026 at 10:00 AM IST with Lead Mentor Priya Sharma.",
        category: "Class",
        date: "30 Sep 2026, 09:30 AM",
        read: false,
      },
      {
        id: "notif-402",
        title: "Attendance Record Updated",
        message: "Attendance marked: Present for 'Scaled Dot-Product Attention' session on 28 Sep 2026.",
        category: "Attendance",
        date: "28 Sep 2026, 01:15 PM",
        read: false,
      },
      {
        id: "notif-403",
        title: "Assessment Result Published: Lab Assignment 3",
        message: "Arjun scored 92% in Multi-Head Attention Implementation. Mentor feedback: 'Excellent matrix multiplication logic.'",
        category: "Assessment",
        date: "24 Sep 2026, 04:45 PM",
        read: false,
      },
      {
        id: "notif-404",
        title: "Fee Payment Due Reminder",
        message: "Installment 3 (₹20,000) is due by 15 Oct 2026. Online payment receipts available under Fees portal.",
        category: "General",
        date: "20 Sep 2026, 10:00 AM",
        read: true,
      },
      {
        id: "notif-405",
        title: "Guest Masterclass: Production RAG with Vector Databases",
        message: "Join us for an exclusive technical workshop with Google Cloud AI engineers on 10 Oct 2026.",
        category: "Class",
        date: "18 Sep 2026, 02:00 PM",
        read: true,
      },
    ] as NotificationItem[],
  },

  fees: {
    STU001: {
      totalFee: 120000,
      paidAmount: 100000,
      pendingAmount: 20000,
      dueDate: "15 Oct 2026",
      nextInstallmentAmount: 20000,
      paymentHistory: [
        {
          id: "pay-001",
          description: "Installment 1: Admission & Course Enrollment Fee",
          date: "15 May 2026",
          amount: 50000,
          paymentMode: "Razorpay / UPI",
          status: "Paid",
          receiptNumber: "INV-NIM-2026-041",
        },
        {
          id: "pay-002",
          description: "Installment 2: Mid-Term Tuition & Lab Access Fee",
          date: "15 Jul 2026",
          amount: 50000,
          paymentMode: "Net Banking",
          status: "Paid",
          receiptNumber: "INV-NIM-2026-118",
        },
        {
          id: "pay-003",
          description: "Installment 3: Final Capstone & Certification Fee",
          date: "15 Oct 2026",
          amount: 20000,
          paymentMode: "Pending Online Payment",
          status: "Due Soon",
          receiptNumber: "INV-NIM-2026-DUE",
        },
      ],
    } as FeeRecord,
  },

  curriculum: {
    courseName: "Generative AI & LLMs",
    programCode: "GENAI-2026-PRO",
    totalDuration: "6 Months • 24 Weeks",
    modules: [
      {
        id: "mod-1",
        code: "MOD 01",
        title: "Deep Learning Foundations & PyTorch",
        description: "Math for AI, matrix operations, backpropagation, and PyTorch tensor neural network building blocks.",
        duration: "4 Weeks (Weeks 1-4)",
        status: "Completed",
        progressPercentage: 100,
        topics: [
          { id: "t-101", title: "Linear Algebra & Calculus for Deep Learning", type: "Online Class", duration: "3 hrs", status: "Completed" },
          { id: "t-102", title: "PyTorch Tensors, Autograd & Loss Functions", type: "Hands-on Lab", duration: "4 hrs", status: "Completed" },
          { id: "t-103", title: "CNN Architectures & Computer Vision", type: "Online Class", duration: "3 hrs", status: "Completed" },
          { id: "t-104", title: "Gateway Evaluation #1", type: "Assessment", duration: "2 hrs", status: "Completed" },
        ],
      },
      {
        id: "mod-2",
        code: "MOD 02",
        title: "Natural Language Processing & Transformers",
        description: "Sequence models, tokenization, self-attention, scaled dot-product, and Multi-Head Transformer architectures.",
        duration: "4 Weeks (Weeks 5-8)",
        status: "Completed",
        progressPercentage: 100,
        topics: [
          { id: "t-201", title: "Word Embeddings & Vector Space Mathematics", type: "Online Class", duration: "3 hrs", status: "Completed" },
          { id: "t-202", title: "RNNs, LSTMs & Seq2Seq Models", type: "Online Class", duration: "3 hrs", status: "Completed" },
          { id: "t-203", title: "Multi-Head Self-Attention Mechanisms", type: "Hands-on Lab", duration: "4 hrs", status: "Completed" },
          { id: "t-204", title: "BERT & GPT Encoder-Decoder Pre-training", type: "Reading", duration: "2 hrs", status: "Completed" },
        ],
      },
      {
        id: "mod-3",
        code: "MOD 03",
        title: "Generative AI & Large Language Models (LLMs)",
        description: "State-of-the-art LLMs (Llama 3, Claude, Gemini, GPT-4), prompt engineering, and parameter-efficient fine-tuning (PEFT/QLoRA).",
        duration: "4 Weeks (Weeks 9-12)",
        status: "In Progress",
        progressPercentage: 75,
        topics: [
          { id: "t-301", title: "Prompt Engineering & Few-Shot Learning", type: "Online Class", duration: "3 hrs", status: "Completed" },
          { id: "t-302", title: "Fine-Tuning Llama 3 with QLoRA & Unsloth", type: "Hands-on Lab", duration: "4 hrs", status: "In Progress" },
          { id: "t-303", title: "RLHF & Direct Preference Optimization (DPO)", type: "Online Class", duration: "3 hrs", status: "Upcoming" },
          { id: "t-304", title: "LLM Evaluation Benchmarks & Safety", type: "Reading", duration: "2 hrs", status: "Upcoming" },
        ],
      },
      {
        id: "mod-4",
        code: "MOD 04",
        title: "Retrieval-Augmented Generation (RAG) & Vector DBs",
        description: "Connecting LLMs to proprietary datasets using vector indexing, embeddings, FAISS, Pinecone, and hybrid search.",
        duration: "4 Weeks (Weeks 13-16)",
        status: "Upcoming",
        progressPercentage: 0,
        topics: [
          { id: "t-401", title: "Vector Databases: FAISS, ChromaDB & Pinecone", type: "Online Class", duration: "3 hrs", status: "Upcoming" },
          { id: "t-402", title: "Document Chunking & Embedding Pipelines", type: "Hands-on Lab", duration: "4 hrs", status: "Upcoming" },
          { id: "t-403", title: "Reranking & HyDE Retrieval Optimization", type: "Online Class", duration: "3 hrs", status: "Upcoming" },
          { id: "t-404", title: "RAG Evaluation Framework (Ragas)", type: "Assessment", duration: "2 hrs", status: "Upcoming" },
        ],
      },
      {
        id: "mod-5",
        code: "MOD 05",
        title: "Autonomous AI Agents & LangChain / LlamaIndex",
        description: "Multi-agent systems, tool calling, memory management, and agentic workflows using LangChain and CrewAI.",
        duration: "4 Weeks (Weeks 17-20)",
        status: "Upcoming",
        progressPercentage: 0,
        topics: [
          { id: "t-501", title: "LangChain Framework & Custom Chains", type: "Online Class", duration: "3 hrs", status: "Upcoming" },
          { id: "t-502", title: "Agentic Tool Calling & Function Binding", type: "Hands-on Lab", duration: "4 hrs", status: "Upcoming" },
          { id: "t-503", title: "Multi-Agent Systems with CrewAI", type: "Online Class", duration: "3 hrs", status: "Upcoming" },
        ],
      },
      {
        id: "mod-6",
        code: "MOD 06",
        title: "Production Deployment & Capstone Project",
        description: "Serving LLMs with vLLM, Docker containerization, cloud deployment, and industry capstone project defense.",
        duration: "4 Weeks (Weeks 21-24)",
        status: "Upcoming",
        progressPercentage: 0,
        topics: [
          { id: "t-601", title: "High-Throughput LLM Serving with vLLM", type: "Online Class", duration: "3 hrs", status: "Upcoming" },
          { id: "t-602", title: "Production Monitoring & Latency Optimization", type: "Hands-on Lab", duration: "4 hrs", status: "Upcoming" },
          { id: "t-603", title: "Capstone Project Defense & Presentation", type: "Assessment", duration: "4 hrs", status: "Upcoming" },
        ],
      },
    ],
  } as CurriculumData,
};

// API Service functions
export async function getParentLinkedStudent(parentId: string = "PAR001"): Promise<LinkedStudent> {
  const parent = mockDatabase.parents.find((p) => p.id === parentId) || mockDatabase.parents[0];
  const student = mockDatabase.students[parent.linkedStudentId as keyof typeof mockDatabase.students];
  return student;
}

export async function getParentProfile(parentId: string = "PAR001"): Promise<ParentProfile> {
  return mockDatabase.parents.find((p) => p.id === parentId) || mockDatabase.parents[0];
}

export async function getStudentAttendance(studentId: string = "STU001"): Promise<AttendanceRecord[]> {
  return mockDatabase.attendance[studentId as keyof typeof mockDatabase.attendance] || [];
}

export async function getStudentClasses(studentId: string = "STU001"): Promise<ClassSession[]> {
  return mockDatabase.classes[studentId as keyof typeof mockDatabase.classes] || [];
}

export async function getStudentAssessments(studentId: string = "STU001"): Promise<AssessmentRecord[]> {
  return mockDatabase.assessments[studentId as keyof typeof mockDatabase.assessments] || [];
}

export async function getStudentNotifications(studentId: string = "STU001"): Promise<NotificationItem[]> {
  return mockDatabase.notifications[studentId as keyof typeof mockDatabase.notifications] || [];
}

export async function getStudentFees(studentId: string = "STU001"): Promise<FeeRecord> {
  return mockDatabase.fees[studentId as keyof typeof mockDatabase.fees];
}

export async function getStudentCurriculum(): Promise<CurriculumData> {
  return mockDatabase.curriculum;
}

export async function getParentDashboardData(parentId: string = "PAR001") {
  const parent = await getParentProfile(parentId);
  const student = await getParentLinkedStudent(parentId);
  const attendance = await getStudentAttendance(student.id);
  const classes = await getStudentClasses(student.id);
  const assessments = await getStudentAssessments(student.id);
  const notifications = await getStudentNotifications(student.id);
  const fees = await getStudentFees(student.id);

  // Summary counts
  const totalClasses = attendance.length + 14; // Past + total cohort classes
  const presentCount = attendance.filter((a) => a.status === "Present").length;
  const absentCount = attendance.filter((a) => a.status === "Absent").length;

  return {
    parent,
    student,
    attendanceSummary: {
      totalClasses,
      presentCount,
      absentCount,
      percentage: student.attendancePercentage,
    },
    upcomingClasses: classes.slice(0, 3),
    recentAssessments: assessments.slice(0, 3),
    recentNotifications: notifications.slice(0, 4),
    feeSummary: {
      totalFee: fees.totalFee,
      paidAmount: fees.paidAmount,
      pendingAmount: fees.pendingAmount,
      dueDate: fees.dueDate,
    },
  };
}
