// Parent Portal Data Service & API Integration Layer
// Returns real linked student data for logged-in parent from Django Backend

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

const BASE_URL = "http://127.0.0.1:8000";

async function fetchDjangoApi(endpoint: string, studentId?: string) {
  let sid = studentId && studentId !== "STU001" && studentId !== "PAR001" ? studentId : "";
  const url = sid 
    ? `${BASE_URL}/api/student/${endpoint}/data/${sid}/`
    : `${BASE_URL}/api/student/${endpoint}/data/`;

  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.warn(`Error fetching ${endpoint} from Django API:`, err);
    return null;
  }
}

// API Service functions using Real Backend API Data
export async function getParentLinkedStudent(studentId?: string): Promise<LinkedStudent> {
  let profileRes = await fetchDjangoApi("profile", studentId);
  let p = profileRes?.profile || profileRes?.student;
  if (!p || !p.name) {
    const dashRes = await fetchDjangoApi("dashboard", studentId);
    p = dashRes?.student || dashRes?.profile || p || {};
  }
  const attendanceRes = await fetchDjangoApi("attendance", studentId);
  
  return {
    id: p.student_id || studentId || "N/A",
    name: p.name || "Student",
    photoUrl: p.avatar_url || "",
    email: p.email || "N/A",
    phone: p.phone || "N/A",
    course: p.course || "Generative AI & LLMs",
    batch: p.batch || "Assigned Batch",
    mentor: p.mentor || p.mentor_name || "Assigned Mentor",
    mentorRole: (p.mentor || p.mentor_name) ? "Lead Mentor" : "Mentor",
    enrollmentStatus: p.status || "Active",
    joiningDate: p.join_date || "N/A",
    expectedGraduation: "N/A",
    attendancePercentage: attendanceRes?.overall_percentage || 0,
  };
}

export async function getParentProfile(studentId?: string): Promise<ParentProfile> {
  let profileRes = await fetchDjangoApi("profile", studentId);
  let p = profileRes?.profile || profileRes?.student;
  if (!p || !p.name) {
    const dashRes = await fetchDjangoApi("dashboard", studentId);
    p = dashRes?.student || dashRes?.profile || p || {};
  }

  const rawParentName = p.parent_name || p.parent_guardian_name || p.guardian_name || p.parentName;
  let parentName = "";
  if (rawParentName && typeof rawParentName === "string" && !rawParentName.startsWith("P_") && rawParentName !== p.parent_username) {
    parentName = rawParentName;
  } else if (p.name) {
    parentName = `Parent of ${p.name}`;
  } else {
    parentName = "Parent / Guardian";
  }

  return {
    id: p.parent_username || "N/A",
    name: parentName,
    email: p.email || "N/A",
    phone: p.phone || "N/A",
    relation: "Parent / Guardian",
    linkedStudentId: p.student_id || studentId || "N/A",
  };
}

export async function getStudentAttendance(studentId?: string): Promise<AttendanceRecord[]> {
  const res = await fetchDjangoApi("attendance", studentId);
  if (!res || !Array.isArray(res.history)) return [];
  return res.history.map((item: any, idx: number) => ({
    id: item.id || `att-${idx}`,
    date: item.date || "N/A",
    time: item.time || "N/A",
    topic: item.topic || "Class Session",
    module: item.module || "Curriculum Module",
    mentor: item.mentor || "Mentor",
    status: item.status || "Present",
  }));
}

export async function getStudentClasses(studentId?: string): Promise<ClassSession[]> {
  const res = await fetchDjangoApi("classes", studentId);
  if (!res || !Array.isArray(res.classes)) return [];
  return res.classes.map((cls: any, idx: number) => ({
    id: cls.id || `cls-${idx}`,
    topic: cls.topic || cls.name || "Live Class",
    module: cls.module || cls.subject || "Module",
    date: cls.date || "Scheduled",
    time: cls.time || "TBD",
    mentor: cls.mentor || cls.trainer || "Mentor",
    meetingLink: cls.meeting_link || cls.meetingLink || "https://meet.google.com",
    status: cls.status || "Upcoming",
  }));
}

export async function getStudentAssessments(studentId?: string): Promise<AssessmentRecord[]> {
  const res = await fetchDjangoApi("tasks", studentId);
  if (!res || !Array.isArray(res.tasks)) return [];
  return res.tasks.map((t: any, idx: number) => ({
    id: t.id || `ass-${idx}`,
    name: t.title || t.name || "Assignment",
    module: t.module || "Course Module",
    date: t.due_date || t.date || "N/A",
    score: t.score ? `${t.score}%` : (t.status === "Evaluated" ? "Evaluated" : "Pending"),
    status: t.status === "Evaluated" || t.status === "Passed" ? "Passed" : "Pending",
    feedback: t.feedback || t.comments || "No feedback recorded",
  }));
}

export async function getStudentNotifications(studentId?: string): Promise<NotificationItem[]> {
  const res = await fetchDjangoApi("notifications", studentId);
  if (!res || !Array.isArray(res.notifications)) return [];
  return res.notifications.map((n: any, idx: number) => ({
    id: n.id || `notif-${idx}`,
    title: n.title || "Notification",
    message: n.message || "",
    category: n.category || "General",
    date: n.timestamp || n.date || "N/A",
    read: !!n.is_read,
  }));
}

export async function getStudentFees(studentId?: string): Promise<FeeRecord> {
  const res = await fetchDjangoApi("fees", studentId);
  const kpi = res?.kpi || {};
  const payments = Array.isArray(res?.payments) ? res.payments : [];

  const totalPaid = kpi.total_paid || 0;
  const totalDue = kpi.total_due || 0;
  const totalFee = totalPaid + totalDue;

  return {
    totalFee,
    paidAmount: totalPaid,
    pendingAmount: totalDue,
    dueDate: kpi.next_due_date || "N/A",
    nextInstallmentAmount: totalDue,
    paymentHistory: payments.map((p: any, idx: number) => ({
      id: p.id || `pay-${idx}`,
      description: p.description || p.remarks || `Fee Payment #${idx + 1}`,
      date: p.payment_date || p.date || "N/A",
      amount: p.amount || 0,
      paymentMode: p.payment_method || "Online",
      status: p.status || "Paid",
      receiptNumber: p.transaction_id || p.receipt_number || `INV-${p.id}`,
    })),
  };
}

export async function getStudentCurriculum(studentId?: string): Promise<CurriculumData> {
  const res = await fetchDjangoApi("curriculum", studentId);
  const months = Array.isArray(res?.months) ? res.months : [];
  const profileRes = await fetchDjangoApi("profile", studentId);
  const courseName = profileRes?.profile?.course || "Course Curriculum";

  const modules: CurriculumModule[] = months.map((m: any, idx: number) => ({
    id: `mod-${m.number || idx + 1}`,
    code: `MOD 0${m.number || idx + 1}`,
    title: m.title || `Module ${m.number || idx + 1}`,
    description: m.description || "",
    duration: "4 Weeks",
    status: m.status || "Upcoming",
    progressPercentage: m.status === "Completed" ? 100 : (m.status === "In Progress" ? 50 : 0),
    topics: Array.isArray(m.modules) ? m.modules.map((t: any, tIdx: number) => ({
      id: `t-${tIdx}`,
      title: t.title || t.name || `Topic ${tIdx + 1}`,
      type: "Online Class",
      duration: "3 hrs",
      status: t.status || "Upcoming",
    })) : [],
  }));

  return {
    courseName,
    programCode: "NIM-PRO",
    totalDuration: `${modules.length * 4} Weeks`,
    modules,
  };
}

export async function getParentDashboardData(studentId?: string) {
  const parent = await getParentProfile(studentId);
  const student = await getParentLinkedStudent(studentId);
  const attendance = await getStudentAttendance(student.id);
  const classes = await getStudentClasses(student.id);
  const assessments = await getStudentAssessments(student.id);
  const notifications = await getStudentNotifications(student.id);
  const fees = await getStudentFees(student.id);

  const totalClasses = attendance.length;
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
