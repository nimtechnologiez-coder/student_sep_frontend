"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import DashboardLayout from "@/components/DashboardLayout";
import { useTheme } from "@/components/ThemeProvider";
import styles from "./curriculum.module.css";
import {
  BookOpen,
  CheckCircle2,
  Clock,
  ArrowRight,
  ArrowLeft,
  Search,
  Check,
  Circle,
  Play,
  FileText,
  Code2,
  Laptop,
  Award,
  Layers,
  Sparkles,
  Lock,
  ChevronRight,
  X,
  Target,
  BarChart3,
  HelpCircle,
  RotateCcw,
} from "lucide-react";

// Curriculum Data Types matching Program -> Month -> Module -> Topic -> Learning Objective
export type TopicStatus = "Completed" | "In Progress" | "Upcoming";
export type ModuleStatus = "Completed" | "In Progress" | "Upcoming";
export type MonthStatus = "Completed" | "Current" | "Upcoming";

export interface TopicItem {
  id: string;
  title: string;
  type: "Online Class" | "Hands-on Lab" | "Reading" | "Project" | "Assessment";
  duration: string;
  status: TopicStatus;
  description: string;
}

export interface ModuleItem {
  id: string;
  code: string;
  weekRange: string;
  title: string;
  status: ModuleStatus;
  progress: number;
  learningObjectives: string[];
  topics: TopicItem[];
}

export interface MonthData {
  monthNumber: number;
  title: string;
  shortTopic: string;
  code: string;
  duration: string;
  hours: number;
  progress: number;
  status: MonthStatus;
  summary: string;
  modules: ModuleItem[];
}

export default function CurriculumPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Active Month (defaults to Month 4: NLP & Transformers)
  const [selectedMonth, setSelectedMonth] = useState<number>(4);

  // Search filter
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Topic detail modal state
  const [activeTopic, setActiveTopic] = useState<{
    topic: TopicItem;
    moduleTitle: string;
    monthTitle: string;
  } | null>(null);

  const [curriculumData, setCurriculumData] = useState<MonthData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  React.useEffect(() => {
    fetch("http://127.0.0.1:8000/api/curriculum/get/")
      .then((res) => {
        if (!res.ok) throw new Error("API failed");
        return res.json();
      })
      .then((data) => {
        if (data && data.curriculum && data.curriculum.length > 0) {
          setCurriculumData(data.curriculum);
          setSelectedMonth(data.curriculum[0].monthNumber);
        } else {
          throw new Error("Invalid API response format");
        }
      })
      .catch((err) => {
        console.error("API failed, falling back to hardcoded data", err);
        setCurriculumData(fallbackCurriculumData);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  // Comprehensive 6-Month Dataset (SRS Program -> Month -> Module -> Topic -> Learning Objective)
  const fallbackCurriculumData: MonthData[] = [
    {
      monthNumber: 1,
      title: "Python & Applied Statistics Foundations",
      shortTopic: "Python & Statistics",
      code: "AI-101",
      duration: "Month Phase",
      hours: 60,
      progress: 100,
      status: "Completed",
      summary:
        "Master clean Python 3.11 programming for AI engineering, vectorized computation with NumPy, tabular data manipulation with Pandas, and mathematical probability and statistical inference.",
      modules: [
        {
          id: "mod-1.1",
          code: "MOD-1.1",
          weekRange: "Month-Wise Module",
          title: "Python Programming & Algorithmic Structures",
          status: "Completed",
          progress: 100,
          learningObjectives: [
            "Write modular, clean Python code leveraging list comprehensions, generators, and lambdas.",
            "Analyze Big-O computational time and space complexity across built-in data structures.",
            "Implement object-oriented design patterns and custom exception hierarchies.",
          ],
          topics: [
            {
              id: "t-1.1",
              title: "Python 3.11 Syntax, Functions & Functional Patterns",
              type: "Online Class",
              duration: "45 min",
              status: "Completed",
              description: "Review modern Python syntax, type annotations, generator expressions, and functional paradigms.",
            },
            {
              id: "t-1.2",
              title: "Data Structures & Algorithmic Complexity in Practice",
              type: "Online Class",
              duration: "60 min",
              status: "Completed",
              description: "Deep dive into hash maps, binary heaps, dynamic arrays, and memory profiling.",
            },
            {
              id: "t-1.3",
              title: "Hands-on Lab: Algorithmic Problem Solving in Python",
              type: "Hands-on Lab",
              duration: "90 min",
              status: "Completed",
              description: "Solve 10 algorithm challenges focusing on sliding windows, hash tables, and two-pointer techniques.",
            },
            {
              id: "t-1.4",
              title: "Module Assessment: Python Code Quality & Testing",
              type: "Assessment",
              duration: "45 min",
              status: "Completed",
              description: "Automated pytest suite evaluation with runtime benchmarking and linting scores.",
            },
          ],
        },
        {
          id: "mod-1.2",
          code: "MOD-1.2",
          weekRange: "Month-Wise Module",
          title: "Scientific Computing with NumPy & Pandas",
          status: "Completed",
          progress: 100,
          learningObjectives: [
            "Perform multi-dimensional tensor slicing and vectorized broadcasting without Python loops.",
            "Master complex Pandas DataFrames with multi-indexing, pivot tables, and groupby aggregations.",
            "Cleanse real-world messy tabular datasets handling imputation and type coercions.",
          ],
          topics: [
            {
              id: "t-2.1",
              title: "NumPy Vectorization & Ndarray Broadcasting Mechanics",
              type: "Online Class",
              duration: "50 min",
              status: "Completed",
              description: "Memory layout, strided arrays, C vs Fortran contiguity, and zero-copy operations.",
            },
            {
              id: "t-2.2",
              title: "Pandas Indexing, Merging & GroupBy Aggregations",
              type: "Online Class",
              duration: "60 min",
              status: "Completed",
              description: "High-performance data manipulation on multi-index DataFrames and hierarchical columns.",
            },
            {
              id: "t-2.3",
              title: "Hands-on Lab: Financial Transactions Wrangling",
              type: "Hands-on Lab",
              duration: "120 min",
              status: "Completed",
              description: "Clean, transform, and join 500k rows of raw financial ledger records.",
            },
          ],
        },
        {
          id: "mod-1.3",
          code: "MOD-1.3",
          weekRange: "Month-Wise Module",
          title: "Exploratory Data Analysis & Visualization",
          status: "Completed",
          progress: 100,
          learningObjectives: [
            "Detect statistical anomalies, outliers, and skewness across multi-variate distributions.",
            "Build interactive dashboards and informative figures with Seaborn and Plotly.",
            "Formulate actionable business hypotheses through systematic data exploration.",
          ],
          topics: [
            {
              id: "t-3.1",
              title: "Statistical Visualization Principles with Seaborn",
              type: "Online Class",
              duration: "55 min",
              status: "Completed",
              description: "Designing distribution plots, correlation heatmaps, and pair plots for statistical discovery.",
            },
            {
              id: "t-3.2",
              title: "EDA Project: E-Commerce Customer Behavior Analysis",
              type: "Project",
              duration: "180 min",
              status: "Completed",
              description: "Conduct an end-to-end exploratory analysis identifying customer churn predictors.",
            },
          ],
        },
        {
          id: "mod-1.4",
          code: "MOD-1.4",
          weekRange: "Month-Wise Module",
          title: "Applied Probability & Statistical Inference",
          status: "Completed",
          progress: 100,
          learningObjectives: [
            "Formulate null and alternative hypotheses using p-values and confidence intervals.",
            "Apply Central Limit Theorem and sampling distributions to real experiment metrics.",
            "Pass Gateway 1 evaluation validating mathematical foundations for machine learning.",
          ],
          topics: [
            {
              id: "t-4.1",
              title: "Distributions, Z-scores & Central Limit Theorem",
              type: "Online Class",
              duration: "60 min",
              status: "Completed",
              description: "Normal, Binomial, Poisson distributions and sample mean convergence.",
            },
            {
              id: "t-4.2",
              title: "Hypothesis Testing, p-values & A/B Test Inference",
              type: "Online Class",
              duration: "60 min",
              status: "Completed",
              description: "Two-sample t-tests, Chi-square independence tests, and Type I/II errors in SciPy.",
            },
            {
              id: "t-4.3",
              title: "Gateway 1 Evaluation: Applied Statistics Defense",
              type: "Assessment",
              duration: "120 min",
              status: "Completed",
              description: "Proctored technical assessment testing Python data analysis and probability. Score: 94%.",
            },
          ],
        },
      ],
    },
    {
      monthNumber: 2,
      title: "Machine Learning Mastery",
      shortTopic: "Machine Learning",
      code: "AI-102",
      duration: "Month Phase",
      hours: 60,
      progress: 100,
      status: "Completed",
      summary:
        "Understand foundational machine learning algorithms, Scikit-learn pipelines, feature engineering, regularization, ensemble tree methods, and model explainability.",
      modules: [
        {
          id: "mod-2.1",
          code: "MOD-2.1",
          weekRange: "Month-Wise Module",
          title: "Supervised Learning: Regression & Regularization",
          status: "Completed",
          progress: 100,
          learningObjectives: [
            "Derive cost functions and gradient descent optimization routines mathematically.",
            "Mitigate overfitting using L1 (Lasso), L2 (Ridge), and ElasticNet regularization penalties.",
            "Construct robust cross-validation pipelines preventing data leakage.",
          ],
          topics: [
            {
              id: "t-5.1",
              title: "Cost Functions, Loss Surfaces & Gradient Descent",
              type: "Online Class",
              duration: "60 min",
              status: "Completed",
              description: "Convex optimization, learning rates, batch vs stochastic gradient descent.",
            },
            {
              id: "t-5.2",
              title: "Hands-on Lab: Regularized Regression on Real Estate Data",
              type: "Hands-on Lab",
              duration: "90 min",
              status: "Completed",
              description: "Tune alpha hyperparameters using RidgeCV and LassoCV on multi-feature housing records.",
            },
          ],
        },
        {
          id: "mod-2.2",
          code: "MOD-2.2",
          weekRange: "Month-Wise Module",
          title: "Classification Algorithms & Imbalance Metrics",
          status: "Completed",
          progress: 100,
          learningObjectives: [
            "Evaluate logistic regression decision thresholds and maximum margin Support Vector Machines (SVM).",
            "Solve high-skew class imbalance using SMOTE oversampling and threshold calibration.",
            "Interpret precision-recall curves, ROC-AUC, and F1-score trade-offs.",
          ],
          topics: [
            {
              id: "t-6.1",
              title: "Decision Boundaries & Support Vector Machines (SVM)",
              type: "Online Class",
              duration: "55 min",
              status: "Completed",
              description: "Linear and RBF non-linear kernels, slack variables, and margin maximization.",
            },
            {
              id: "t-6.2",
              title: "Hands-on Lab: Credit Card Fraud Classifier with SMOTE",
              type: "Hands-on Lab",
              duration: "120 min",
              status: "Completed",
              description: "Build an extreme class-imbalance classifier prioritizing high recall for fraud events.",
            },
          ],
        },
        {
          id: "mod-2.3",
          code: "MOD-2.3",
          weekRange: "Month-Wise Module",
          title: "Ensemble Learning: Random Forests & Boosting",
          status: "Completed",
          progress: 100,
          learningObjectives: [
            "Compare bagging vs boosting mechanisms and information gain splitting criteria (Gini vs Entropy).",
            "Optimize tree depths, learning rates, and subsampling in XGBoost and LightGBM.",
            "Explain non-linear feature importances using SHAP (Shapley Additive exPlanations).",
          ],
          topics: [
            {
              id: "t-7.1",
              title: "Decision Trees & Information Gain Mathematics",
              type: "Online Class",
              duration: "50 min",
              status: "Completed",
              description: "Recursive binary splitting, tree pruning, and variance reduction through bagging.",
            },
            {
              id: "t-7.2",
              title: "XGBoost & LightGBM Architecture & Hyperparameter Tuning",
              type: "Online Class",
              duration: "75 min",
              status: "Completed",
              description: "Second-order gradients, histogram-based binning, and Bayesian optimization via Optuna.",
            },
            {
              id: "t-7.3",
              title: "Project: Customer Churn Prediction with SHAP Values",
              type: "Project",
              duration: "180 min",
              status: "Completed",
              description: "Deploy an end-to-end gradient boosted pipeline with local and global explainability plots.",
            },
          ],
        },
        {
          id: "mod-2.4",
          code: "MOD-2.4",
          weekRange: "Month-Wise Module",
          title: "Unsupervised Learning & Gateway 2 Evaluation",
          status: "Completed",
          progress: 100,
          learningObjectives: [
            "Perform dimensionality reduction preserving variance using Principal Component Analysis (PCA).",
            "Implement K-Means and Hierarchical Agglomerative clustering.",
            "Successfully defend Classical ML Pipeline in Gateway 2 Examination.",
          ],
          topics: [
            {
              id: "t-8.1",
              title: "Dimensionality Reduction with PCA & t-SNE",
              type: "Online Class",
              duration: "50 min",
              status: "Completed",
              description: "Eigenvalue decomposition, cumulative variance explained, and cluster separation.",
            },
            {
              id: "t-8.2",
              title: "Gateway 2 Evaluation: Classical ML Pipeline Defense",
              type: "Assessment",
              duration: "120 min",
              status: "Completed",
              description: "Live coding evaluation defending model selection, cross-validation, and metrics. Score: 92%.",
            },
          ],
        },
      ],
    },
    {
      monthNumber: 3,
      title: "Deep Learning & Computer Vision",
      shortTopic: "Deep Learning & CV",
      code: "AI-103",
      duration: "Month Phase",
      hours: 60,
      progress: 100,
      status: "Completed",
      summary:
        "Deep dive into artificial neural networks, backpropagation calculus, PyTorch tensor engineering, Convolutional Neural Networks (CNNs), transfer learning with ResNets, and real-time object detection with YOLOv8.",
      modules: [
        {
          id: "mod-3.1",
          code: "MOD-3.1",
          weekRange: "Month-Wise Module",
          title: "Neural Network Foundations & Backpropagation",
          status: "Completed",
          progress: 100,
          learningObjectives: [
            "Derive gradient equations across multi-layer perceptrons using the chain rule.",
            "Compare activation functions (Sigmoid, Tanh, ReLU, LeakyReLU, GELU) and vanishing gradients.",
            "Code forward and backward propagation passes from scratch without frameworks.",
          ],
          topics: [
            {
              id: "t-9.1",
              title: "Multi-Layer Perceptrons & Computational Graphs",
              type: "Online Class",
              duration: "60 min",
              status: "Completed",
              description: "Matrix formulations of dense layers, affine transformations, and loss derivatives.",
            },
            {
              id: "t-9.2",
              title: "Hands-on Lab: Building an MLP from Scratch in NumPy",
              type: "Hands-on Lab",
              duration: "120 min",
              status: "Completed",
              description: "Implement parameter updates, weight initializations (He, Xavier), and train on non-linear data.",
            },
          ],
        },
        {
          id: "mod-3.2",
          code: "MOD-3.2",
          weekRange: "Month-Wise Module",
          title: "Modern PyTorch: Tensors, Autograd & GPUs",
          status: "Completed",
          progress: 100,
          learningObjectives: [
            "Build robust PyTorch architectures inheriting from nn.Module with forward hooks.",
            "Construct custom Dataset and DataLoader pipelines with batching and multiprocessing.",
            "Accelerate model training on NVIDIA CUDA hardware with mixed precision (AMP).",
          ],
          topics: [
            {
              id: "t-10.1",
              title: "PyTorch Autograd Engine & Device Tensors",
              type: "Online Class",
              duration: "50 min",
              status: "Completed",
              description: "Dynamic computation graphs, backward gradient hooks, and GPU memory management.",
            },
            {
              id: "t-10.2",
              title: "Hands-on Lab: Idiomatic PyTorch Training Pipelines",
              type: "Hands-on Lab",
              duration: "90 min",
              status: "Completed",
              description: "Build train/validation loops with checkpointing, early stopping, and TensorBoard logs.",
            },
          ],
        },
        {
          id: "mod-3.3",
          code: "MOD-3.3",
          weekRange: "Month-Wise Module",
          title: "Convolutional Neural Networks & ResNets",
          status: "Completed",
          progress: 100,
          learningObjectives: [
            "Analyze spatial feature hierarchies through 2D convolutions, pooling, and receptive fields.",
            "Overcome degradation in deep networks using skip/residual connections in ResNet.",
            "Fine-tune pre-trained vision backbones on domain datasets using transfer learning.",
          ],
          topics: [
            {
              id: "t-11.1",
              title: "CNN Math: Kernels, Stride, Padding & Channels",
              type: "Online Class",
              duration: "60 min",
              status: "Completed",
              description: "Spatial transformations, depthwise separable convolutions, and feature map activations.",
            },
            {
              id: "t-11.2",
              title: "Transfer Learning with ResNet-50 & EfficientNet",
              type: "Online Class",
              duration: "55 min",
              status: "Completed",
              description: "Backbone freezing, learning rate differential scheduling, and head replacement.",
            },
            {
              id: "t-11.3",
              title: "Project: Medical Image Disease Classification",
              type: "Project",
              duration: "180 min",
              status: "Completed",
              description: "Achieved 96.4% test accuracy classifying chest X-rays using fine-tuned ResNet-50.",
            },
          ],
        },
        {
          id: "mod-3.4",
          code: "MOD-3.4",
          weekRange: "Month-Wise Module",
          title: "Real-Time Object Detection with YOLO & Gateway 3",
          status: "Completed",
          progress: 100,
          learningObjectives: [
            "Contrast single-stage detectors (YOLO) with two-stage region-based detectors (Faster R-CNN).",
            "Calculate Intersection over Union (IoU) and perform Non-Maximum Suppression (NMS).",
            "Train and deploy YOLOv8 for low-latency live camera stream inference.",
          ],
          topics: [
            {
              id: "t-12.1",
              title: "Object Detection: Anchor-Free Architectures & Losses",
              type: "Online Class",
              duration: "65 min",
              status: "Completed",
              description: "Bounding box regression, distribution focal loss, and multi-scale feature pyramid networks.",
            },
            {
              id: "t-12.2",
              title: "Gateway 3 Evaluation: Real-Time Detection Model Defense",
              type: "Assessment",
              duration: "120 min",
              status: "Completed",
              description: "Live demonstration and defense of custom-trained YOLOv8 object recognition model. Score: 95%.",
            },
          ],
        },
      ],
    },
    {
      monthNumber: 4,
      title: "NLP & Transformer Architectures",
      shortTopic: "NLP & Transformers",
      code: "AI-104",
      duration: "Month Phase",
      hours: 60,
      progress: 68,
      status: "Current",
      summary:
        "Master text preprocessing, subword tokenization algorithms, vector semantics, self-attention mechanisms, and Transformer architectures (BERT & GPT) using PyTorch and Hugging Face.",
      modules: [
        {
          id: "mod-4.1",
          code: "MOD-4.1",
          weekRange: "Month-Wise Module",
          title: "NLP Foundations & Subword Tokenizers",
          status: "Completed",
          progress: 100,
          learningObjectives: [
            "Construct Byte-Pair Encoding (BPE) and WordPiece vocabularies from raw corpus statistics.",
            "Normalize, regex clean, and tokenize text while preserving semantic punctuation.",
            "Compare statistical TF-IDF representations against dense neural embeddings.",
          ],
          topics: [
            {
              id: "t-13.1",
              title: "Text Normalization, Regex & Subword Tokenizers",
              type: "Online Class",
              duration: "50 min",
              status: "Completed",
              description: "How language models segment out-of-vocabulary words into reusable subword tokens.",
            },
            {
              id: "t-13.2",
              title: "Hands-on Lab: Building a BPE Tokenizer from Scratch",
              type: "Hands-on Lab",
              duration: "90 min",
              status: "Completed",
              description: "Implement frequency-based pair merging and evaluate vocabulary efficiency on Python corpus.",
            },
            {
              id: "t-13.3",
              title: "Reading: Linguistics for AI Engineers & Benchmarks",
              type: "Reading",
              duration: "30 min",
              status: "Completed",
              description: "Linguistic syntax, semantic parsing, and GLUE / SuperGLUE academic benchmarks.",
            },
          ],
        },
        {
          id: "mod-4.2",
          code: "MOD-4.2",
          weekRange: "Month-Wise Module",
          title: "Word Embeddings & Vector Semantics",
          status: "Completed",
          progress: 100,
          learningObjectives: [
            "Derive Word2Vec Skip-Gram objective functions with Negative Sampling.",
            "Train custom domain embeddings capturing contextual synonyms and cosine similarity.",
            "Build an indexing pipeline using vector dot products for semantic search.",
          ],
          topics: [
            {
              id: "t-14.1",
              title: "Word2Vec Math: Skip-Gram with Negative Sampling",
              type: "Online Class",
              duration: "55 min",
              status: "Completed",
              description: "Dot product objectives, noise contrastive estimation, and softmax bottleneck solutions.",
            },
            {
              id: "t-14.2",
              title: "Hands-on Lab: Training Domain Word Embeddings in PyTorch",
              type: "Hands-on Lab",
              duration: "100 min",
              status: "Completed",
              description: "Train continuous dense vector representations on medical clinical research notes.",
            },
            {
              id: "t-14.3",
              title: "Project: Semantic Search Engine with Vector Dot Products",
              type: "Project",
              duration: "150 min",
              status: "Completed",
              description: "Indexed 50k scientific abstracts for sub-50ms vector similarity matching.",
            },
          ],
        },
        {
          id: "mod-4.3",
          code: "MOD-4.3",
          weekRange: "Month-Wise Module",
          title: "Sequence Models & Attention Mechanisms",
          status: "In Progress",
          progress: 50,
          learningObjectives: [
            "Analyze information bottlenecks in Recurrent Neural Networks (RNNs) and LSTMs.",
            "Mathematically formulate Scaled Dot-Product Attention: Softmax(QK^T / sqrt(d_k))V.",
            "Implement Multi-Head Attention projections and positional encodings in PyTorch.",
          ],
          topics: [
            {
              id: "t-15.1",
              title: "Vanishing Gradients in RNNs & Seq2Seq Bottlenecks",
              type: "Online Class",
              duration: "45 min",
              status: "Completed",
              description: "Mathematical analysis of why recurrence fails on long-range text sequences.",
            },
            {
              id: "t-15.2",
              title: "Scaled Dot-Product Attention & Multi-Head Projections",
              type: "Online Class",
              duration: "70 min",
              status: "In Progress",
              description: "Queries, Keys, and Values matrix transformations and tensor dimensions.",
            },
            {
              id: "t-15.3",
              title: "Hands-on Lab: Implementing Multi-Head Attention in PyTorch",
              type: "Hands-on Lab",
              duration: "120 min",
              status: "In Progress",
              description: "Step-by-step tensor reshaping, attention mask creation, and multi-head split logic.",
            },
            {
              id: "t-15.4",
              title: "Paper Deep Dive: 'Attention Is All You Need' (Vaswani et al.)",
              type: "Reading",
              duration: "45 min",
              status: "Upcoming",
              description: "Dissection of the 2017 transformer blueprint that powers modern LLMs.",
            },
          ],
        },
        {
          id: "mod-4.4",
          code: "MOD-4.4",
          weekRange: "Month-Wise Module",
          title: "Transformer Architecture & Hugging Face",
          status: "Upcoming",
          progress: 0,
          learningObjectives: [
            "Distinguish encoder-only (BERT), decoder-only (GPT), and encoder-decoder (T5) architectures.",
            "Fine-tune pre-trained models using Hugging Face Transformers and Trainer APIs.",
            "Prepare and submit Gateway 4 Transformer model implementation defense.",
          ],
          topics: [
            {
              id: "t-16.1",
              title: "BERT vs GPT: Masked LM vs Causal Next-Token Prediction",
              type: "Online Class",
              duration: "60 min",
              status: "Upcoming",
              description: "Bidirectional contextual representation vs autoregressive text generation.",
            },
            {
              id: "t-16.2",
              title: "Hands-on Lab: Fine-Tuning DistilBERT on Customer Tickets",
              type: "Hands-on Lab",
              duration: "120 min",
              status: "Upcoming",
              description: "Dataset tokenization, dynamic padding, AdamW optimizer, and F1 evaluation.",
            },
            {
              id: "t-16.3",
              title: "Gateway 4 Evaluation: Transformer Model Implementation",
              type: "Assessment",
              duration: "120 min",
              status: "Upcoming",
              description: "Build, train, and defend a custom Transformer classifier before mentor panel.",
            },
          ],
        },
      ],
    },
    {
      monthNumber: 5,
      title: "Generative AI & Enterprise RAG",
      shortTopic: "GenAI & RAG",
      code: "AI-105",
      duration: "Month Phase",
      hours: 60,
      progress: 0,
      status: "Upcoming",
      summary:
        "Build enterprise-ready Generative AI systems. Explore advanced prompt engineering, vector databases (ChromaDB, Pinecone), LangChain, LlamaIndex, hybrid search, and parameter-efficient fine-tuning with LoRA/QLoRA.",
      modules: [
        {
          id: "mod-5.1",
          code: "MOD-5.1",
          weekRange: "Month-Wise Module",
          title: "LLM Fundamentals & Advanced Prompt Engineering",
          status: "Upcoming",
          progress: 0,
          learningObjectives: [
            "Design systematic prompt strategies: Few-shot, Chain-of-Thought (CoT), and ReAct.",
            "Enforce structured JSON output schemas with Pydantic and instructor libraries.",
            "Mitigate hallucinations using grounding guidelines and prompt safety guardrails.",
          ],
          topics: [
            {
              id: "t-17.1",
              title: "In-Context Learning & Reasoning Patterns (CoT, ToT)",
              type: "Online Class",
              duration: "50 min",
              status: "Upcoming",
              description: "Prompt optimization strategies to steer LLM reasoning and reduce stochastic errors.",
            },
            {
              id: "t-17.2",
              title: "Hands-on Lab: Automated Prompt Evaluation Test Bench",
              type: "Hands-on Lab",
              duration: "90 min",
              status: "Upcoming",
              description: "Construct a test harness measuring precision and consistency across prompt variations.",
            },
          ],
        },
        {
          id: "mod-5.2",
          code: "MOD-5.2",
          weekRange: "Month-Wise Module",
          title: "Vector Databases & Dense Semantic Retrieval",
          status: "Upcoming",
          progress: 0,
          learningObjectives: [
            "Implement Hierarchical Navigable Small World (HNSW) vector indexing and distance metrics.",
            "Design smart chunking strategies (semantic, recursive, sentence-window) for long documents.",
            "Build an end-to-end question-answering pipeline with ChromaDB and OpenAI / open LLMs.",
          ],
          topics: [
            {
              id: "t-18.1",
              title: "Vector Search Algorithms: HNSW, FAISS & Metric Spaces",
              type: "Online Class",
              duration: "60 min",
              status: "Upcoming",
              description: "Mathematical foundations of vector indexing for sub-second retrieval over millions of embeddings.",
            },
            {
              id: "t-18.2",
              title: "Hands-on Lab: End-to-End RAG Pipeline with ChromaDB",
              type: "Hands-on Lab",
              duration: "120 min",
              status: "Upcoming",
              description: "Ingest corporate technical documentation and deliver cited answers with source attribution.",
            },
          ],
        },
        {
          id: "mod-5.3",
          code: "MOD-5.3",
          weekRange: "Month-Wise Module",
          title: "Advanced RAG: Query Rewriting, Re-Ranking & Evaluation",
          status: "Upcoming",
          progress: 0,
          learningObjectives: [
            "Combine keyword BM25 and dense semantic vectors in reciprocal rank fusion (Hybrid Search).",
            "Apply cross-encoder re-rankers (Cohere, BGE) to eliminate irrelevant context.",
            "Quantify RAG performance using RAGAS metrics (Faithfulness, Answer Relevance, Context Recall).",
          ],
          topics: [
            {
              id: "t-19.1",
              title: "Modular RAG Patterns & Cross-Encoder Re-Ranking",
              type: "Online Class",
              duration: "60 min",
              status: "Upcoming",
              description: "Hypothetical Document Embeddings (HyDE), sub-query generation, and context compression.",
            },
            {
              id: "t-19.2",
              title: "Project: Enterprise Document Assistant with Guardrails",
              type: "Project",
              duration: "180 min",
              status: "Upcoming",
              description: "Deliver a production-ready RAG assistant with factual grounding verification.",
            },
          ],
        },
        {
          id: "mod-5.4",
          code: "MOD-5.4",
          weekRange: "Month-Wise Module",
          title: "Parameter-Efficient Fine-Tuning (PEFT) & Gateway 5",
          status: "Upcoming",
          progress: 0,
          learningObjectives: [
            "Derive low-rank decomposition mathematics for adapter matrices in LoRA.",
            "Fine-tune 7B/8B open-weights LLMs (Llama 3, Mistral) with 4-bit QLoRA on a single GPU.",
            "Defend GenAI production system architecture in Gateway 5 assessment.",
          ],
          topics: [
            {
              id: "t-20.1",
              title: "LoRA & QLoRA Mathematics: Rank Factorization Matrices",
              type: "Online Class",
              duration: "60 min",
              status: "Upcoming",
              description: "Why fine-tuning less than 1% of parameters retains over 99% of full fine-tuning quality.",
            },
            {
              id: "t-20.2",
              title: "Gateway 5 Evaluation: GenAI System Deployment Defense",
              type: "Assessment",
              duration: "120 min",
              status: "Upcoming",
              description: "Live demonstration and peer defense of a domain-adapted LLM with RAG support.",
            },
          ],
        },
      ],
    },
    {
      monthNumber: 6,
      title: "Agentic AI & Capstone Portfolio",
      shortTopic: "Agentic AI & Capstone",
      code: "AI-106",
      duration: "Month Phase",
      hours: 60,
      progress: 0,
      status: "Upcoming",
      summary:
        "Build autonomous multi-agent workflows capable of planning, tool use, and state memory. Create graph architectures with LangGraph, deploy production FastAPI microservices, and defend your Capstone portfolio.",
      modules: [
        {
          id: "mod-6.1",
          code: "MOD-6.1",
          weekRange: "Month-Wise Module",
          title: "Autonomous Agents, Tool Use & ReAct Framework",
          status: "Upcoming",
          progress: 0,
          learningObjectives: [
            "Implement Reasoning and Acting (ReAct) loops with dynamic function calling schemas.",
            "Equip agents with database query tools, web search scrapers, and Python sandboxes.",
            "Handle execution errors, tool timeouts, and fallback self-correction prompts.",
          ],
          topics: [
            {
              id: "t-21.1",
              title: "Agent Architectures: Planning, Memory & Execution Loops",
              type: "Online Class",
              duration: "60 min",
              status: "Upcoming",
              description: "How modern agents orchestrate search, database queries, and code interpreters.",
            },
            {
              id: "t-21.2",
              title: "Hands-on Lab: Autonomous Financial Analyst Agent",
              type: "Hands-on Lab",
              duration: "120 min",
              status: "Upcoming",
              description: "Equip an agent with stock APIs, SEC filing retrieval, and Python calculation tools.",
            },
          ],
        },
        {
          id: "mod-6.2",
          code: "MOD-6.2",
          weekRange: "Month-Wise Module",
          title: "Multi-Agent Systems with LangGraph",
          status: "Upcoming",
          progress: 0,
          learningObjectives: [
            "Construct state machine graph architectures using nodes, edges, and conditional branches.",
            "Incorporate Human-in-the-Loop (HITL) review checkpoints before irreversible tool calls.",
            "Coordinate collaborative agent roles: researcher, coder, reviewer, and synthesizer.",
          ],
          topics: [
            {
              id: "t-22.1",
              title: "Graph-Based Workflows: State Channels & Cyclical Execution",
              type: "Online Class",
              duration: "65 min",
              status: "Upcoming",
              description: "Orchestrating multi-turn agent conversations without unbounded infinite loops.",
            },
            {
              id: "t-22.2",
              title: "Project: Autonomous Multi-Agent Software Development Team",
              type: "Project",
              duration: "180 min",
              status: "Upcoming",
              description: "Coordinate product manager, developer, and tester agents to write validated Python modules.",
            },
          ],
        },
        {
          id: "mod-6.3",
          code: "MOD-6.3",
          weekRange: "Month-Wise Module",
          title: "Production Deployment, Latency & Serving",
          status: "Upcoming",
          progress: 0,
          learningObjectives: [
            "Package LLM pipelines into Docker containers and asynchronous FastAPI endpoints.",
            "Stream token responses via Server-Sent Events (SSE) and implement semantic caching.",
            "Manage GPU memory allocation and batching with vLLM and PagedAttention.",
          ],
          topics: [
            {
              id: "t-23.1",
              title: "Packaging LLM Systems: Docker, vLLM & Token Streaming",
              type: "Online Class",
              duration: "60 min",
              status: "Upcoming",
              description: "High-throughput model serving, KV caching optimizations, and API security.",
            },
            {
              id: "t-23.2",
              title: "Hands-on Lab: Deploying a Multi-Agent Microservice with FastAPI",
              type: "Hands-on Lab",
              duration: "120 min",
              status: "Upcoming",
              description: "Build an authenticated async API endpoint serving agentic workflows with Redis caching.",
            },
          ],
        },
        {
          id: "mod-6.4",
          code: "MOD-6.4",
          weekRange: "Month-Wise Module",
          title: "Final Capstone Defense & Portfolio Presentation",
          status: "Upcoming",
          progress: 0,
          learningObjectives: [
            "Complete a production-grade enterprise AI capstone meeting real-world latency standards.",
            "Author comprehensive architecture documentation and open-source GitHub showcase.",
            "Pass Gateway 6 final evaluation panel defense for placement qualification.",
          ],
          topics: [
            {
              id: "t-24.1",
              title: "Capstone Architecture Review & System Audit",
              type: "Project",
              duration: "180 min",
              status: "Upcoming",
              description: "Perform peer architectural review, latency benchmarking, and code security checks.",
            },
            {
              id: "t-24.2",
              title: "Gateway 6 Final Evaluation: Industry Panel Capstone Defense",
              type: "Assessment",
              duration: "180 min",
              status: "Upcoming",
              description: "Present and defend your capstone system live before senior industry AI directors.",
            },
          ],
        },
      ],
    },
  ];

  // Currently active month data
  const currentMonthData = useMemo(() => {
    if (!curriculumData || curriculumData.length === 0) return null;
    return curriculumData.find((m) => m.monthNumber === selectedMonth) || curriculumData[0];
  }, [curriculumData, selectedMonth]);

  // Filter modules/topics by search term
  const filteredModules = useMemo(() => {
    if (!currentMonthData) return [];
    if (!searchQuery.trim()) return currentMonthData.modules;
    const q = searchQuery.toLowerCase();

    return currentMonthData.modules
      .map((mod) => {
        const matchesModule =
          mod.title.toLowerCase().includes(q) ||
          mod.learningObjectives.some((obj) => obj.toLowerCase().includes(q));
        const filteredTopics = mod.topics.filter(
          (t) =>
            t.title.toLowerCase().includes(q) ||
            t.description.toLowerCase().includes(q) ||
            t.type.toLowerCase().includes(q)
        );

        if (matchesModule || filteredTopics.length > 0) {
          return {
            ...mod,
            topics: filteredTopics.length > 0 ? filteredTopics : mod.topics,
          };
        }
        return null;
      })
      .filter(Boolean) as ModuleItem[];
  }, [currentMonthData, searchQuery]);

  // Overall statistics
  const totalMonths = 6;
  const completedMonths = curriculumData.filter((m) => m.status === "Completed").length;
  const totalModules = curriculumData.reduce((acc, m) => acc + m.modules.length, 0); // 24
  const completedModules = curriculumData.reduce(
    (acc, m) => acc + m.modules.filter((mod) => mod.status === "Completed").length,
    0
  ); // 14
  const totalTopics = curriculumData.reduce(
    (acc, m) => acc + m.modules.reduce((mAcc, mod) => mAcc + mod.topics.length, 0),
    0
  ); // 68
  const completedTopics = curriculumData.reduce(
    (acc, m) =>
      acc +
      m.modules.reduce(
        (mAcc, mod) => mAcc + mod.topics.filter((t) => t.status === "Completed").length,
        0
      ),
    0
  ); // 50

  const handleNextMonth = () => {
    if (selectedMonth < 6) setSelectedMonth(selectedMonth + 1);
  };

  const handlePrevMonth = () => {
    if (selectedMonth > 1) setSelectedMonth(selectedMonth - 1);
  };

  // Helper for topic type badge
  const getTopicTypeMeta = (type: string) => {
    switch (type) {
      case "Online Class":
      case "Video":
        return {
          icon: Laptop,
          color: "text-blue-600 dark:text-blue-400",
          bg: "bg-blue-50 text-blue-700 border-blue-200/60 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-900/60",
        };
      case "Hands-on Lab":
        return {
          icon: Code2,
          color: "text-emerald-600 dark:text-emerald-400",
          bg: "bg-emerald-50 text-emerald-700 border-emerald-200/60 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-900/60",
        };
      case "Reading":
        return {
          icon: FileText,
          color: "text-purple-600 dark:text-purple-400",
          bg: "bg-purple-50 text-purple-700 border-purple-200/60 dark:bg-purple-950/50 dark:text-purple-300 dark:border-purple-900/60",
        };
      case "Project":
        return {
          icon: Layers,
          color: "text-amber-600 dark:text-amber-400",
          bg: "bg-amber-50 text-amber-700 border-amber-200/60 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-900/60",
        };
      case "Assessment":
        return {
          icon: Award,
          color: "text-rose-600 dark:text-rose-400",
          bg: "bg-rose-50 text-rose-700 border-rose-200/60 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-900/60",
        };
      default:
        return {
          icon: BookOpen,
          color: "text-slate-600 dark:text-slate-400",
          bg: "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
        };
    }
  };

  if (isLoading || !currentMonthData) {
    return (
      <DashboardLayout>
        <div className={styles.container}>
          <div className="flex items-center justify-center p-20">
            <div className={`text-sm font-semibold ${isDark ? "text-slate-400" : "text-slate-500"}`}>
              Loading Curriculum...
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className={styles.container}>
        {/* =========================================================================
            1. CLEAN ACADEMIC PAGE HEADER (No Images, Banners, or Decorative Art)
            ========================================================================= */}
        <section className={styles.headerCard}>
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-1.5 max-w-3xl">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-black uppercase tracking-wider text-[#0062eb] bg-blue-500/10 px-2.5 py-0.5 rounded-full border border-blue-500/20">
                  Program Curriculum
                </span>
                <span className={`text-xs font-semibold ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                  NIM AI Career Accelerator • 6-Month Structured Program
                </span>
              </div>

              <h1
                className={`text-2xl sm:text-3xl font-black tracking-tight leading-tight ${
                  isDark ? "text-white" : "text-[#0a1b39]"
                }`}
              >
                Curriculum
              </h1>

              <p
                className={`text-xs sm:text-sm leading-relaxed ${
                  isDark ? "text-slate-300" : "text-slate-600 font-medium"
                }`}
              >
                A rigorous 6-month hands-on pathway from Python and applied mathematical foundations to production-grade
                Generative AI and autonomous Agentic architectures.
              </p>
            </div>

            {/* Overall Course Progress Box & Action */}
            <div
              className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center gap-4 lg:gap-5 shrink-0 ${
                isDark ? "bg-[#0b1429] border-[#182952]" : "bg-slate-50 border-slate-200"
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-3 text-xs mb-1">
                  <span className={`font-semibold ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                    Overall Course Progress
                  </span>
                  <span className="font-black text-[#0062eb]">68%</span>
                </div>
                <div className="w-48 h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-600 to-indigo-500 rounded-full"
                    style={{ width: "68%" }}
                  />
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  3 of 6 Months Completed • Month 4 Active
                </span>
              </div>

              <button
                onClick={() => {
                  setSelectedMonth(4);
                  setSearchQuery("");
                }}
                className="px-4 py-2.5 rounded-xl bg-[#0062eb] hover:bg-[#0052cc] text-white text-xs font-bold transition shadow-md shadow-blue-600/25 flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
              >
                <span>Continue Learning</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </section>

                {/* =========================================================================
            2. SEARCH & QUICK FILTER ROW
            ========================================================================= */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search across all months, modules, topics & outcomes..."
              className={`w-full pl-9 pr-8 py-2.5 rounded-xl text-xs outline-none border transition ${
                isDark
                  ? "bg-[#0b1429] border-[#182952] text-white placeholder-slate-500 focus:border-[#0062eb]"
                  : "bg-white border-[#dce8f8] text-[#0a1b39] placeholder-slate-400 focus:border-[#0062eb]"
              }`}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-semibold">
              Showing All 6 Months ({curriculumData.reduce((acc, m) => acc + m.modules.length, 0)} Modules)
            </span>
          </div>
        </div>

        {/* =========================================================================
            2.1. MONTH SELECTOR NAVIGATION BAR (Month 1 to 6 + All Months)
            ========================================================================= */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-slate-400">
              Select Program Phase / Month
            </span>
            <span className="text-xs font-semibold text-[#0062eb]">
              {selectedMonth === 0 ? "Viewing All 6 Months" : `Viewing Month ${selectedMonth} of 6`}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2.5">
            {curriculumData.map((m) => {
              const isSelected = selectedMonth === m.monthNumber;
              const isCurrent = m.status === "Current";
              const isDone = m.status === "Completed";

              return (
                <button
                  key={m.monthNumber}
                  onClick={() => {
                    setSelectedMonth(m.monthNumber);
                    setSearchQuery("");
                  }}
                  className={`p-3 rounded-xl border text-left transition flex flex-col justify-between cursor-pointer gap-2 ${
                    isSelected
                      ? "bg-[#0062eb] text-white border-[#0062eb] shadow-md shadow-blue-600/25 ring-2 ring-blue-400/40"
                      : isDark
                      ? "bg-[#0b1429] border-[#182952] text-slate-300 hover:border-[#0062eb]/60"
                      : "bg-white border-slate-200 text-[#0a1b39] hover:border-blue-300 shadow-xs"
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 w-full">
                    <span
                      className={`text-[11px] font-black uppercase tracking-wider ${
                        isSelected ? "text-blue-100" : isDark ? "text-slate-400" : "text-slate-500"
                      }`}
                    >
                      Month {m.monthNumber}
                    </span>
                    <span
                      className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded-full ${
                        isSelected
                          ? "bg-white/20 text-white"
                          : isDone
                          ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                          : isCurrent
                          ? "bg-blue-500/15 text-[#0062eb] dark:text-blue-400"
                          : "bg-slate-100 text-slate-500 dark:bg-slate-800"
                      }`}
                    >
                      {isDone ? "Done" : isCurrent ? "Active" : "Upcoming"}
                    </span>
                  </div>

                  <div className="text-xs font-bold leading-snug line-clamp-1">
                    {m.shortTopic || m.title}
                  </div>

                  <div className="w-full">
                    <div className="flex items-center justify-between text-[10px] font-semibold mb-1 opacity-90">
                      <span>Progress</span>
                      <span>{m.progress}%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-black/10 dark:bg-white/10 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          isSelected
                            ? "bg-white"
                            : isDone
                            ? "bg-emerald-500"
                            : isCurrent
                            ? "bg-[#0062eb]"
                            : "bg-slate-300 dark:bg-slate-700"
                        }`}
                        style={{ width: `${m.progress}%` }}
                      />
                    </div>
                  </div>
                </button>
              );
            })}

            {/* Tab: All Months Overview */}
            <button
              onClick={() => {
                setSelectedMonth(0);
                setSearchQuery("");
              }}
              className={`p-3 rounded-xl border text-left transition flex flex-col justify-between cursor-pointer gap-2 ${
                selectedMonth === 0
                  ? "bg-[#0062eb] text-white border-[#0062eb] shadow-md shadow-blue-600/25 ring-2 ring-blue-400/40"
                  : isDark
                  ? "bg-[#0b1429] border-[#182952] text-slate-300 hover:border-[#0062eb]/60"
                  : "bg-white border-slate-200 text-[#0a1b39] hover:border-blue-300 shadow-xs"
              }`}
            >
              <div className="flex items-center justify-between gap-1 w-full">
                <span
                  className={`text-[11px] font-black uppercase tracking-wider ${
                    selectedMonth === 0 ? "text-blue-100" : isDark ? "text-slate-400" : "text-slate-500"
                  }`}
                >
                  Full View
                </span>
                <span
                  className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded-full ${
                    selectedMonth === 0 ? "bg-white/20 text-white" : "bg-blue-500/10 text-[#0062eb]"
                  }`}
                >
                  All 6
                </span>
              </div>

              <div className="text-xs font-bold leading-snug">
                All Months
              </div>

              <div className="text-[10px] text-slate-400 mt-auto pt-1 font-semibold flex items-center justify-between w-full">
                <span>Total Modules</span>
                <span className="font-bold">24</span>
              </div>
            </button>
          </div>
        </div>

        {/* =========================================================================
            2.2. FOCUSED MONTH BANNER (When a single month is active)
            ========================================================================= */}
        {selectedMonth !== 0 && currentMonthData && !searchQuery && (
          <div
            className={`p-5 sm:p-6 rounded-2xl border transition-all ${
              isDark ? "bg-[#081226] border-[#16274d]" : "bg-gradient-to-r from-blue-50/70 via-indigo-50/40 to-white border-blue-100 shadow-xs"
            }`}
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
              <div className="space-y-2 max-w-2xl">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="px-3 py-0.5 rounded-lg text-xs font-black bg-[#0062eb] text-white">
                    Month {currentMonthData.monthNumber} • {currentMonthData.code}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                      currentMonthData.status === "Completed"
                        ? "bg-emerald-500/15 text-emerald-600 border-emerald-500/30"
                        : currentMonthData.status === "Current"
                        ? "bg-blue-500/15 text-[#0062eb] border-blue-500/30"
                        : "bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border-slate-300 dark:border-slate-700"
                    }`}
                  >
                    {currentMonthData.status} Phase
                  </span>
                </div>

                <h2 className={`text-xl sm:text-2xl font-black ${isDark ? "text-white" : "text-[#0a1b39]"}`}>
                  {currentMonthData.title}
                </h2>

                <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                  {currentMonthData.summary}
                </p>
              </div>

              {/* Month KPI Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 shrink-0">
                <div className={`p-3 rounded-xl border text-center ${isDark ? "bg-[#0c1836] border-[#192b57]" : "bg-white border-blue-100 shadow-2xs"}`}>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Modules</span>
                  <span className={`text-base font-black ${isDark ? "text-white" : "text-[#0a1b39]"}`}>{currentMonthData.modules.length}</span>
                </div>
                <div className={`p-3 rounded-xl border text-center ${isDark ? "bg-[#0c1836] border-[#192b57]" : "bg-white border-blue-100 shadow-2xs"}`}>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Lessons</span>
                  <span className={`text-base font-black ${isDark ? "text-white" : "text-[#0a1b39]"}`}>
                    {currentMonthData.modules.reduce((acc, m) => acc + m.topics.length, 0)}
                  </span>
                </div>
                <div className={`p-3 rounded-xl border text-center ${isDark ? "bg-[#0c1836] border-[#192b57]" : "bg-white border-blue-100 shadow-2xs"}`}>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Duration</span>
                  <span className={`text-base font-black ${isDark ? "text-white" : "text-[#0a1b39]"}`}>{currentMonthData.hours}h</span>
                </div>
                <div className={`p-3 rounded-xl border text-center ${isDark ? "bg-[#0c1836] border-[#192b57]" : "bg-white border-blue-100 shadow-2xs"}`}>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Progress</span>
                  <span className="text-base font-black text-[#0062eb]">{currentMonthData.progress}%</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            3. MODULES DISPLAY (Properly Aligned Grid)
            ========================================================================= */}
        <div className="space-y-12">
          {curriculumData
            .filter((m) => selectedMonth === 0 || m.monthNumber === selectedMonth || searchQuery.trim().length > 0)
            .map((month) => {
            const monthModules = month.modules.filter((m) =>
              !searchQuery ||
              m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              m.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
              m.topics.some((t) => t.title.toLowerCase().includes(searchQuery.toLowerCase()))
            );

            if (monthModules.length === 0) return null;

            return (
              <section key={month.monthNumber} className="space-y-5">
                {/* Month Group Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-200/80 dark:border-slate-800 gap-2">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="px-3.5 py-1 rounded-xl text-xs font-black bg-[#0062eb] text-white shadow-sm">
                      Month {month.monthNumber}
                    </span>
                    <h2 className={`text-xl font-black ${isDark ? "text-white" : "text-[#0a1b39]"}`}>
                      {month.title}
                    </h2>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                        month.status === "Completed"
                          ? "bg-emerald-500/15 text-emerald-600 border-emerald-500/30"
                          : month.status === "Current"
                          ? "bg-blue-500/15 text-[#0062eb] border-blue-500/30"
                          : "bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border-slate-300 dark:border-slate-700"
                      }`}
                    >
                      {month.status}
                    </span>
                    <span className="text-xs text-slate-400 font-semibold">
                      {month.modules.length} Modules
                    </span>
                  </div>
                </div>

                {/* Modules Grid (2-Column Responsive) */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
                  {monthModules.map((module) => {
                    const isCurrentModule = module.status === "In Progress";
                    const isCompletedModule = module.status === "Completed";
                    const completedTopicsCount = module.topics.filter(
                      (t) => t.status === "Completed"
                    ).length;

                    return (
                      <div
                        key={module.id}
                        className={`${styles.card} p-5 sm:p-6 flex flex-col h-full ${
                          isCurrentModule ? "ring-2 ring-[#0062eb] border-[#0062eb]/50" : ""
                        }`}
                      >
                        {/* Section 1: Module Header & Progress */}
                        <div className="space-y-3">
                          {/* Top: Code & Status Badge */}
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <span className="px-2.5 py-0.5 rounded-lg text-xs font-black bg-blue-50 text-[#0062eb] dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800/60">
                                {module.code}
                              </span>
                              <span
                                className={`text-xs font-semibold ${
                                  isDark ? "text-slate-400" : "text-slate-500"
                                }`}
                              >
                                • Month {month.monthNumber}
                              </span>
                            </div>

                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                                isCompletedModule
                                  ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60"
                                  : isCurrentModule
                                  ? "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800/60 animate-pulse"
                                  : "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800/60 dark:text-slate-400 dark:border-slate-700"
                              }`}
                            >
                              {module.status}
                            </span>
                          </div>

                          {/* Module Title */}
                          <div className="min-h-[2.75rem] flex items-center">
                            <h3
                              className={`text-base sm:text-lg font-bold leading-snug ${
                                isDark ? "text-white" : "text-[#0a1b39]"
                              }`}
                            >
                              {module.title}
                            </h3>
                          </div>

                          {/* Progress Metrics & Bar */}
                          <div>
                            <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                              <span className={isDark ? "text-slate-400" : "text-slate-500"}>
                                {completedTopicsCount} of {module.topics.length} Topics Completed
                              </span>
                              <span
                                className={`font-black ${
                                  isCompletedModule
                                    ? "text-emerald-600 dark:text-emerald-400"
                                    : isCurrentModule
                                    ? "text-[#0062eb]"
                                    : isDark
                                    ? "text-slate-400"
                                    : "text-slate-500"
                                }`}
                              >
                                {module.progress}%
                              </span>
                            </div>
                            <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden border border-slate-200/50 dark:border-slate-700/50">
                              <div
                                className={`h-full rounded-full transition-all duration-500 ${
                                  isCompletedModule
                                    ? "bg-emerald-500"
                                    : isCurrentModule
                                    ? "bg-[#0062eb]"
                                    : "bg-transparent"
                                }`}
                                style={{ width: `${module.progress}%` }}
                              />
                            </div>
                          </div>
                        </div>

                        {/* Section 2: Learning Objectives */}
                        <div className="mt-4 rounded-xl p-3.5 sm:p-4 bg-slate-50/80 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800/80 min-h-[145px] flex flex-col justify-start">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                              <Target className="w-3.5 h-3.5 text-[#0062eb]" />
                              Learning Objectives
                            </span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                              {module.learningObjectives.length} Core Outcomes
                            </span>
                          </div>

                          <ul className="space-y-2 text-xs">
                            {module.learningObjectives.map((obj, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#0062eb] mt-1.5 shrink-0" />
                                <span
                                  className={`leading-snug font-medium ${
                                    isDark ? "text-slate-300" : "text-slate-700"
                                  }`}
                                >
                                  {obj}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Section 3: Topics & Exercises List */}
                        <div className="mt-5 flex-1 flex flex-col">
                          <div className="flex items-center justify-between mb-2.5">
                            <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                              <BookOpen className="w-3.5 h-3.5 text-[#0062eb]" />
                              Topics &amp; Exercises
                            </span>
                            <span className="text-[11px] font-semibold text-slate-400">
                              {module.topics.length} Lessons
                            </span>
                          </div>

                          <div className="space-y-2 flex-1">
                            {module.topics.map((topic) => {
                              const meta = getTopicTypeMeta(topic.type);
                              const Icon = meta.icon;
                              const isTopicActive = topic.status === "In Progress";
                              const isTopicDone = topic.status === "Completed";

                              return (
                                <div
                                  key={topic.id}
                                  onClick={() =>
                                    setActiveTopic({
                                      topic,
                                      moduleTitle: module.title,
                                      monthTitle: month.title,
                                    })
                                  }
                                  className={`${styles.topicTile} ${
                                    isTopicActive ? styles.topicTileActive : ""
                                  } group`}
                                >
                                  {/* Left: Status Indicator + Title + Meta */}
                                  <div className="flex items-start gap-3 min-w-0 flex-1">
                                    <div className="mt-0.5 shrink-0">
                                      {isTopicDone ? (
                                        <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xs">
                                          <Check className="w-3 h-3 stroke-[3]" />
                                        </div>
                                      ) : isTopicActive ? (
                                        <div className="w-5 h-5 rounded-full bg-[#0062eb] text-white flex items-center justify-center ring-4 ring-blue-500/20 animate-pulse">
                                          <Play className="w-2.5 h-2.5 fill-current ml-0.5" />
                                        </div>
                                      ) : (
                                        <div className="w-5 h-5 rounded-full border-2 border-slate-300 dark:border-slate-700 flex items-center justify-center text-slate-300 dark:text-slate-600">
                                          <Circle className="w-2 h-2 fill-current" />
                                        </div>
                                      )}
                                    </div>

                                    <div className="min-w-0 flex-1">
                                      <h4
                                        className={`text-xs sm:text-sm font-bold leading-snug transition-colors line-clamp-1 ${
                                          isTopicActive
                                            ? "text-[#0062eb] dark:text-blue-400"
                                            : isDark
                                            ? "text-slate-200 group-hover:text-white"
                                            : "text-[#0a1b39] group-hover:text-[#0062eb]"
                                        }`}
                                        title={topic.title}
                                      >
                                        {topic.title}
                                      </h4>

                                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                                        <span
                                          className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded border ${meta.bg}`}
                                        >
                                          <Icon className="w-3 h-3" />
                                          <span>{topic.type}</span>
                                        </span>
                                        <span className="text-slate-300 dark:text-slate-700">•</span>
                                        <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1">
                                          <Clock className="w-3 h-3 text-slate-400" />
                                          <span>{topic.duration}</span>
                                        </span>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="shrink-0 self-center pl-2 flex items-center gap-1 text-xs font-bold text-slate-400 group-hover:text-[#0062eb] transition-all">
                                    <span className="hidden sm:inline">Details</span>
                                    <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Module Card Footer */}
                        <div className="mt-4 pt-3.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                          <span className="text-[11px] font-semibold text-slate-400">
                            {module.topics.length} Lessons • Month {month.monthNumber}
                          </span>

                          <button
                            onClick={() =>
                              setActiveTopic({
                                topic: module.topics[0],
                                moduleTitle: module.title,
                                monthTitle: month.title,
                              })
                            }
                            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition flex items-center gap-1 cursor-pointer ${
                              isDark
                                ? "border-[#1c305c] text-slate-300 hover:bg-[#0f1d3d] hover:text-white"
                                : "border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-[#0062eb]"
                            }`}
                          >
                            <span>View Details</span>
                            <ChevronRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>

        {/* =========================================================================
            6. LEARNING SUMMARY METRICS
            ========================================================================= */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className={`${styles.card} p-4`}>
            <span className="text-xs text-slate-400 font-semibold block mb-1">
              Completed Modules
            </span>
            <div className={`text-xl sm:text-2xl font-black ${isDark ? "text-white" : "text-[#0a1b39]"}`}>
              {completedModules} <span className="text-xs text-slate-400 font-normal">/ {totalModules}</span>
            </div>
            <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">
              3 Months Finished (50%)
            </p>
          </div>

          <div className={`${styles.card} p-4`}>
            <span className="text-xs text-slate-400 font-semibold block mb-1">
              Completed Topics
            </span>
            <div className={`text-xl sm:text-2xl font-black ${isDark ? "text-white" : "text-[#0a1b39]"}`}>
              {completedTopics} <span className="text-xs text-slate-400 font-normal">/ {totalTopics}</span>
            </div>
            <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">
              Lectures, labs &amp; projects
            </p>
          </div>

          <div className={`${styles.card} p-4`}>
            <span className="text-xs text-slate-400 font-semibold block mb-1">
              Active Current Module
            </span>
            <div className="text-sm font-black text-[#0062eb] truncate">
              Module 4.3
            </div>
            <p className="text-[11px] text-slate-400 font-semibold mt-0.5 truncate">
              Sequence Models &amp; Attention
            </p>
          </div>

          <div className={`${styles.card} p-4`}>
            <span className="text-xs text-slate-400 font-semibold block mb-1">
              Remaining Modules
            </span>
            <div className={`text-xl sm:text-2xl font-black ${isDark ? "text-white" : "text-[#0a1b39]"}`}>
              {totalModules - completedModules}{" "}
              <span className="text-xs text-slate-400 font-normal">Modules</span>
            </div>
            <p className="text-[11px] text-slate-400 font-semibold mt-0.5">
              3 Months Remaining until Capstone
            </p>
          </div>
        </section>

        {/* =========================================================================
            7. INTERACTIVE TOPIC DETAIL MODAL
            ========================================================================= */}
        {activeTopic && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
            <div
              className={`w-full max-w-lg rounded-2xl p-6 border shadow-2xl space-y-4 animate-in zoom-in-95 ${
                isDark
                  ? "bg-[#0b1429] border-[#1e3363] text-white"
                  : "bg-white border-[#dce8f8] text-[#0a1b39]"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-blue-500/15 text-[#0062eb]">
                      {activeTopic.topic.type}
                    </span>
                    <span className="text-xs text-slate-400 font-semibold">
                      {activeTopic.topic.duration}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        activeTopic.topic.status === "Completed"
                          ? "bg-emerald-500/15 text-emerald-600"
                          : activeTopic.topic.status === "In Progress"
                          ? "bg-blue-500/15 text-[#0062eb]"
                          : "bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                      }`}
                    >
                      {activeTopic.topic.status}
                    </span>
                  </div>
                  <h3 className="text-base font-bold leading-snug">
                    {activeTopic.topic.title}
                  </h3>
                  <p className="text-xs text-slate-400 font-semibold">
                    {activeTopic.moduleTitle} • {activeTopic.monthTitle}
                  </p>
                </div>

                <button
                  onClick={() => setActiveTopic(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div
                className={`p-3.5 rounded-xl border text-xs leading-relaxed ${
                  isDark
                    ? "bg-[#070e1f] border-[#152345] text-slate-300"
                    : "bg-[#f8fbff] border-[#e2edf8] text-slate-700"
                }`}
              >
                {activeTopic.topic.description}
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-slate-400">
                  Prerequisites verified
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveTopic(null)}
                    className="px-4 py-2 rounded-xl text-xs font-bold border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      alert(`Launching learning environment for: ${activeTopic.topic.title}`);
                      setActiveTopic(null);
                    }}
                    className="px-5 py-2 rounded-xl bg-[#0062eb] hover:bg-[#0052cc] text-white text-xs font-bold transition shadow-md shadow-blue-600/25 flex items-center gap-1.5"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Launch Lesson</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
