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
  endTime?: string;
  mentor: string;
  meetingLink: string;
  status: "Upcoming" | "Live Now" | "Past" | "Completed";
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
  category: "Class" | "Attendance" | "Assessment" | "Assignment" | "Fees" | "General" | string;
  date: string;
  read: boolean;
  action_url?: string;
  action_label?: string;
  student_name?: string;
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
  type?: string;
  duration?: string;
  status: "Completed" | "In Progress" | "Upcoming" | "Active" | "Not Started";
}

export interface CurriculumModule {
  id: string;
  code: string;
  title: string;
  description: string;
  duration: string;
  status: "Completed" | "In Progress" | "Upcoming" | "Available" | "Locked";
  progressPercentage: number;
  topics: ModuleTopic[];
}

export interface CurriculumMonth {
  monthNumber: number;
  title: string;
  description: string;
  status: string;
  modules: CurriculumModule[];
}

export interface CurriculumData {
  courseName: string;
  programCode: string;
  totalDuration: string;
  totalModules?: number;
  totalTopics?: number;
  completedTopics?: number;
  progressPercentage?: number;
  months?: CurriculumMonth[];
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
  
  const rawMentor = p.mentor || p.mentor_name;
  const mentorName = typeof rawMentor === "object" && rawMentor !== null
    ? (rawMentor.name || "Assigned Mentor")
    : (typeof rawMentor === "string" ? rawMentor : "Assigned Mentor");
  const mentorRole = typeof rawMentor === "object" && rawMentor !== null
    ? (rawMentor.role || "Lead Mentor")
    : (rawMentor ? "Lead Mentor" : "Mentor");

  return {
    id: p.student_id || studentId || "N/A",
    name: p.name || "Student",
    photoUrl: p.avatar_url || "",
    email: p.email || "N/A",
    phone: p.phone || "N/A",
    course: p.course || "Generative AI & LLMs",
    batch: p.batch || "Assigned Batch",
    mentor: mentorName,
    mentorRole: mentorRole,
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

  const rawParentName = p.parent_name || p.parent_guardian_name || p.guardian_name || p.parentName || p.parent_username;
  let parentName = "Parent / Guardian";
  if (rawParentName && typeof rawParentName === "string") {
    let clean = rawParentName.trim();
    if (clean.toLowerCase().startsWith("p_")) {
      clean = clean.slice(2).trim();
    }
    if (clean && clean.toLowerCase() !== "parent" && clean.toLowerCase() !== "n/a" && !clean.toLowerCase().startsWith("parent of")) {
      parentName = clean
        .split(/\s+/)
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(" ");
    } else if (p.name) {
      parentName = `Parent of ${p.name}`;
    }
  } else if (p.name) {
    parentName = `Parent of ${p.name}`;
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
  return res.history.map((item: any, idx: number) => {
    const rawMentor = item.mentor;
    const mentorStr = typeof rawMentor === "object" && rawMentor !== null
      ? (rawMentor.name || "Mentor")
      : (typeof rawMentor === "string" ? rawMentor : "Mentor");

    return {
      id: item.id || `att-${idx}`,
      date: item.date || "N/A",
      time: item.time || "N/A",
      topic: item.topic || "Class Session",
      module: item.module || "Curriculum Module",
      mentor: mentorStr,
      status: item.status || "Present",
    };
  });
}

export function isClassUpcomingOrLive(cls: {
  date: string;
  time: string;
  endTime?: string;
  status?: string;
}): boolean {
  if (!cls) return false;

  // Immediate exclude if marked past or completed
  const statusLower = (cls.status || "").toLowerCase().trim();
  if (statusLower === "past" || statusLower === "completed") {
    return false;
  }

  if (!cls.date || cls.date === "Scheduled" || cls.date === "N/A") {
    return cls.status === "Upcoming" || cls.status === "Live Now";
  }

  const now = new Date();

  // Match YYYY-MM-DD
  const dateMatch = cls.date.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!dateMatch) {
    return cls.status === "Upcoming" || cls.status === "Live Now";
  }

  const year = parseInt(dateMatch[1], 10);
  const month = parseInt(dateMatch[2], 10) - 1;
  const day = parseInt(dateMatch[3], 10);

  const todayYear = now.getFullYear();
  const todayMonth = now.getMonth();
  const todayDay = now.getDate();

  const classDateOnly = new Date(year, month, day);
  const todayDateOnly = new Date(todayYear, todayMonth, todayDay);

  // If date is before today -> past
  if (classDateOnly < todayDateOnly) {
    return false;
  }

  // If date is strictly in the future -> upcoming
  if (classDateOnly > todayDateOnly) {
    return true;
  }

  // Scheduled for TODAY: check start & end time
  const parseTime = (timeStr: string) => {
    if (!timeStr) return null;
    const match12 = timeStr.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    if (match12) {
      let h = parseInt(match12[1], 10);
      const m = parseInt(match12[2], 10);
      const ampm = match12[3].toUpperCase();
      if (ampm === "PM" && h < 12) h += 12;
      if (ampm === "AM" && h === 12) h = 0;
      return { h, m };
    }
    const match24 = timeStr.match(/^(\d{1,2}):(\d{2})$/);
    if (match24) {
      return { h: parseInt(match24[1], 10), m: parseInt(match24[2], 10) };
    }
    return null;
  };

  let endHour = 23;
  let endMinute = 59;

  const parsedEnd = parseTime(cls.endTime || "");
  if (parsedEnd) {
    endHour = parsedEnd.h;
    endMinute = parsedEnd.m;
  } else {
    const parsedStart = parseTime(cls.time || "");
    if (parsedStart) {
      const endTotalMins = parsedStart.h * 60 + parsedStart.m + 90;
      endHour = Math.floor(endTotalMins / 60);
      endMinute = endTotalMins % 60;
    }
  }

  const classEndDateTime = new Date(year, month, day, endHour, endMinute, 59);
  return now <= classEndDateTime;
}

export function sortClassesAscending(classes: any[]): any[] {
  if (!Array.isArray(classes)) return [];
  return [...classes].sort((a, b) => {
    const parseDateTime = (item: any) => {
      const datePart = item.date || "9999-12-31";
      let timeVal = 0;
      if (item.time) {
        const match = item.time.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
        if (match) {
          let h = parseInt(match[1], 10);
          const m = parseInt(match[2], 10);
          if (match[3].toUpperCase() === "PM" && h < 12) h += 12;
          if (match[3].toUpperCase() === "AM" && h === 12) h = 0;
          timeVal = h * 60 + m;
        }
      }
      const d = new Date(`${datePart}T00:00:00`);
      return (isNaN(d.getTime()) ? 0 : d.getTime()) + timeVal * 60000;
    };

    return parseDateTime(a) - parseDateTime(b);
  });
}

export async function getStudentClasses(studentId?: string): Promise<ClassSession[]> {
  const res = await fetchDjangoApi("classes", studentId);
  if (!res || !Array.isArray(res.classes)) return [];
  return res.classes.map((cls: any, idx: number) => {
    const rawMentor = cls.mentor || cls.trainer || cls.trainer_name;
    const mentorStr = typeof rawMentor === "object" && rawMentor !== null
      ? (rawMentor.name || "Mentor")
      : (typeof rawMentor === "string" ? rawMentor : "Mentor");

    return {
      id: cls.id || `cls-${idx}`,
      topic: cls.topic || cls.subject || cls.name || "Live Class",
      module: cls.module || cls.subject || "Module",
      date: cls.date || "Scheduled",
      time: cls.time || "TBD",
      endTime: cls.end_time || cls.endTime || "",
      mentor: mentorStr,
      meetingLink: cls.meeting_link || cls.meetingLink || "https://meet.google.com",
      status: cls.status || "Upcoming",
    };
  });
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

export function formatRelativeNotificationDate(dateStr?: string): string {
  if (!dateStr || dateStr === "N/A" || dateStr === "Recent") return "Today";

  const now = new Date();
  const parsed = new Date(dateStr);

  if (!isNaN(parsed.getTime())) {
    const isToday =
      parsed.getFullYear() === now.getFullYear() &&
      parsed.getMonth() === now.getMonth() &&
      parsed.getDate() === now.getDate();

    if (isToday) return "Today";

    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const isYesterday =
      parsed.getFullYear() === yesterday.getFullYear() &&
      parsed.getMonth() === yesterday.getMonth() &&
      parsed.getDate() === yesterday.getDate();

    if (isYesterday) return "Yesterday";
  }

  // Textual matching
  const lower = dateStr.toLowerCase();
  if (lower.includes("today")) return "Today";
  if (lower.includes("yesterday")) return "Yesterday";

  const todayFormat = now.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
  if (dateStr.includes(todayFormat)) return "Today";

  const yest = new Date(now);
  yest.setDate(yest.getDate() - 1);
  const yestFormat = yest.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
  if (dateStr.includes(yestFormat)) return "Yesterday";

  return dateStr;
}

export async function getStudentNotifications(studentId?: string): Promise<NotificationItem[]> {
  let sid = studentId && studentId !== "STU001" && studentId !== "PAR001" ? studentId : "";
  let rawList: any[] = [];
  
  // 1. Try dedicated parent notifications endpoint first
  try {
    const parentUrl = sid 
      ? `${BASE_URL}/api/parent/notifications/${sid}/` 
      : `${BASE_URL}/api/parent/notifications/`;
    const res = await fetch(parentUrl, { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.notifications)) {
        rawList = data.notifications;
      }
    }
  } catch (err) {
    console.warn("Parent notifications API fallback:", err);
  }

  // 2. Fallback to student endpoint if parent endpoint didn't return data
  if (rawList.length === 0) {
    const res = await fetchDjangoApi("notifications", studentId);
    if (Array.isArray(res?.notifications)) {
      rawList = res.notifications;
    }
  }

  // 3. Sort descending by date/timestamp
  const sorted = [...rawList].sort((a: any, b: any) => {
    const tA = new Date(a.timestamp || a.date || 0).getTime() || 0;
    const tB = new Date(b.timestamp || b.date || 0).getTime() || 0;
    return tB - tA;
  });

  // 4. Deduplicate by notification ID and preserve child relevance
  const seen = new Set<string>();
  const deduplicated: NotificationItem[] = [];

  for (const n of sorted) {
    const id = n.id ? String(n.id) : `notif-${deduplicated.length}`;
    if (seen.has(id)) continue;
    seen.add(id);

    // Normalize category into clean UI filters
    let cat = (n.category || "General").trim();
    const lCat = cat.toLowerCase();
    if (lCat.includes("assess") || lCat.includes("evaluat") || lCat.includes("score") || lCat.includes("result")) {
      cat = "Assessment";
    } else if (lCat.includes("attend") || lCat.includes("absent") || lCat.includes("presence")) {
      cat = "Attendance";
    } else if (lCat.includes("class") || lCat.includes("schedule") || lCat.includes("session") || lCat.includes("live")) {
      cat = "Class";
    } else if (lCat.includes("assign") || lCat.includes("task") || lCat.includes("lab") || lCat.includes("project")) {
      cat = "Assignment";
    } else if (lCat.includes("fee") || lCat.includes("payment") || lCat.includes("due")) {
      cat = "Fees";
    } else {
      cat = "General";
    }

    deduplicated.push({
      id,
      title: n.title || "Notification",
      message: n.message || "",
      category: cat,
      date: formatRelativeNotificationDate(n.timestamp || n.date),
      read: !!(n.is_read || n.read),
      action_url: n.action_url || undefined,
      action_label: n.action_label || undefined,
      student_name: n.student?.name || undefined,
    });
  }

  return deduplicated;
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
      description: p.installment_name || p.description || p.remarks || `Fee Payment #${idx + 1}`,
      date: p.payment_date || p.date || "N/A",
      amount: p.amount || 0,
      paymentMode: p.payment_method || "Online",
      status: p.status || "Paid",
      receiptNumber: p.transaction_id || (p.id ? `REC-#${p.id}` : (p.receipt_number || `INV-${idx + 1}`)),
    })),
  };
}

export async function getStudentCurriculum(studentId?: string): Promise<CurriculumData> {
  // 1. First fetch curriculum from the standard get endpoint matching student portal
  let curriculumRes: any = null;
  try {
    const rawGetRes = await fetch(`${BASE_URL}/api/curriculum/get/`, { cache: "no-store" });
    if (rawGetRes.ok) {
      curriculumRes = await rawGetRes.json();
    }
  } catch (err) {
    console.warn("Failed to fetch from /api/curriculum/get/, falling back to student curriculum endpoint", err);
  }

  // 2. Fallback to student specific curriculum endpoint if needed
  if (!curriculumRes || !Array.isArray(curriculumRes.curriculum)) {
    curriculumRes = await fetchDjangoApi("curriculum", studentId);
  }

  const rawMonths: any[] = Array.isArray(curriculumRes?.curriculum)
    ? curriculumRes.curriculum
    : Array.isArray(curriculumRes?.months)
    ? curriculumRes.months
    : [];

  const profileRes = await fetchDjangoApi("profile", studentId);
  const courseName = profileRes?.profile?.course || curriculumRes?.course_name || "Generative AI & LLMs";

  let totalTopicsCount = 0;
  let completedTopicsCount = 0;
  const flattenedModules: CurriculumModule[] = [];

  const months: CurriculumMonth[] = rawMonths.map((m: any, mIdx: number) => {
    const mNum = m.monthNumber || m.number || mIdx + 1;
    const rawModules = Array.isArray(m.modules) ? m.modules : [];

    const parsedModules: CurriculumModule[] = rawModules.map((mod: any, modIdx: number) => {
      const rawTopics = Array.isArray(mod.topics) ? mod.topics : [];
      const topics: ModuleTopic[] = rawTopics.map((top: any, topIdx: number) => {
        totalTopicsCount++;
        const isDone = top.status === "Completed";
        if (isDone) completedTopicsCount++;

        return {
          id: top.id ? String(top.id) : `t-${mNum}-${modIdx + 1}-${topIdx + 1}`,
          title: top.title || top.name || `Topic ${topIdx + 1}`,
          type: top.type || top.class_type || "Online Class",
          duration: top.duration || "90 Mins",
          status: top.status || (isDone ? "Completed" : "Upcoming"),
        };
      });

      const completedCount = topics.filter((t) => t.status === "Completed").length;
      const modProgress = topics.length > 0 ? Math.round((completedCount / topics.length) * 100) : (mod.status === "Completed" ? 100 : 0);

      const parsedMod: CurriculumModule = {
        id: mod.id ? String(mod.id) : `mod-${mNum}-${modIdx + 1}`,
        code: mod.code || `MOD 0${modIdx + 1}`,
        title: mod.title || mod.name || `Module ${modIdx + 1}`,
        description: mod.description || "",
        duration: mod.week_range || "4 Weeks",
        status: mod.status || (modProgress === 100 ? "Completed" : modProgress > 0 ? "In Progress" : "Upcoming"),
        progressPercentage: modProgress,
        topics,
      };

      flattenedModules.push(parsedMod);
      return parsedMod;
    });

    return {
      monthNumber: mNum,
      title: m.title || `Month ${mNum}`,
      description: m.description || "",
      status: m.status || (mNum === 1 ? "Current" : "Upcoming"),
      modules: parsedModules,
    };
  });

  const progressPercentage = totalTopicsCount > 0 ? Math.round((completedTopicsCount / totalTopicsCount) * 100) : 0;

  return {
    courseName,
    programCode: "NIM-PRO",
    totalDuration: `${Math.max(months.length, 6) * 4} Weeks`,
    totalModules: flattenedModules.length,
    totalTopics: totalTopicsCount,
    completedTopics: completedTopicsCount,
    progressPercentage,
    months,
    modules: flattenedModules,
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

  const validUpcomingClasses = sortClassesAscending(classes.filter(isClassUpcomingOrLive));

  return {
    parent,
    student,
    attendanceSummary: {
      totalClasses,
      presentCount,
      absentCount,
      percentage: student.attendancePercentage,
    },
    upcomingClasses: validUpcomingClasses.slice(0, 3),
    recentAssessments: assessments.slice(0, 3),
    recentNotifications: notifications.slice(0, 3),
    feeSummary: {
      totalFee: fees.totalFee,
      paidAmount: fees.paidAmount,
      pendingAmount: fees.pendingAmount,
      dueDate: fees.dueDate,
    },
  };
}
