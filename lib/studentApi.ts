const BASE_URL = "http://127.0.0.1:8000";

export function getSelectedChildId(): string {
  if (typeof window === "undefined") return "";
  try {
    const selectedChild = localStorage.getItem("parent_selected_child_id");
    if (selectedChild) return selectedChild;
    const stored = localStorage.getItem("userData");
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed.selected_student_id || parsed.student_id || (parsed.children?.[0]?.student_id) || "";
    }
  } catch (e) {
    console.error("Error reading selected child:", e);
  }
  return "";
}

export function setSelectedChildId(studentId: string) {
  if (typeof window === "undefined" || !studentId) return;
  try {
    localStorage.setItem("parent_selected_child_id", studentId);
    const stored = localStorage.getItem("userData");
    if (stored) {
      const parsed = JSON.parse(stored);
      parsed.selected_student_id = studentId;
      parsed.student_id = studentId;
      localStorage.setItem("userData", JSON.stringify(parsed));
    }
    window.dispatchEvent(new CustomEvent("parent_child_changed", { detail: studentId }));
    window.dispatchEvent(new Event("storage"));
  } catch (e) {
    console.error("Error setting selected child:", e);
  }
}

export function getLoggedInStudentId(): string {
  if (typeof window === "undefined") return "";
  try {
    const role = localStorage.getItem("userRole");
    if (role === "parent") {
      const childId = getSelectedChildId();
      if (childId) return childId;
    }
    const stored = localStorage.getItem("userData");
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed.role === "parent") {
        const childId = getSelectedChildId();
        if (childId) return childId;
      }
      return parsed.student_id || parsed.username || "";
    }
  } catch (e) {
    console.error("Error reading stored student session:", e);
  }
  return "";
}

async function fetchFromApi(endpoint: string, studentId?: string) {
  const sid = studentId || getLoggedInStudentId();
  const url = sid 
    ? `${BASE_URL}/api/student/${endpoint}/data/${sid}/`
    : `${BASE_URL}/api/student/${endpoint}/data/`;

  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return { success: false, error: `HTTP ${res.status}` };
    return await res.json();
  } catch (err: any) {
    console.warn(`API fetch error for ${endpoint}:`, err);
    return { success: false, error: err.message || "Network Error" };
  }
}

export const StudentApi = {
  getDashboard: (studentId?: string) => fetchFromApi("dashboard", studentId),
  getProfile: (studentId?: string) => fetchFromApi("profile", studentId),
  getCurriculum: (studentId?: string) => fetchFromApi("curriculum", studentId),
  getClasses: (studentId?: string) => fetchFromApi("classes", studentId),
  getTasks: (studentId?: string) => fetchFromApi("tasks", studentId),
  getAttendance: (studentId?: string) => fetchFromApi("attendance", studentId),
  getCareer: (studentId?: string) => fetchFromApi("career", studentId),
  getFees: (studentId?: string) => fetchFromApi("fees", studentId),
  completeTopic: async (topicId: number | string, completed: boolean = true, studentId?: string) => {
    const sid = studentId || getLoggedInStudentId();
    const url = `${BASE_URL}/api/student/topic/complete/`;
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ student_id: sid, topic_id: topicId, completed }),
        cache: "no-store",
      });
      return await res.json();
    } catch (e) {
      return { success: false, error: e };
    }
  },
  getNotifications: (studentId?: string) => fetchFromApi("notifications", studentId),
  markNotificationRead: async (notifId: number | string, studentId?: string) => {
    const sid = studentId || getLoggedInStudentId();
    const url = sid 
      ? `${BASE_URL}/api/student/notifications/mark-read/${notifId}/${sid}/`
      : `${BASE_URL}/api/student/notifications/mark-read/${notifId}/`;
    try {
      const res = await fetch(url, { method: "POST", cache: "no-store" });
      return await res.json();
    } catch (e) {
      return { success: false };
    }
  },
  markAllNotificationsRead: async (studentId?: string) => {
    const sid = studentId || getLoggedInStudentId();
    const url = sid 
      ? `${BASE_URL}/api/student/notifications/mark-all-read/${sid}/`
      : `${BASE_URL}/api/student/notifications/mark-all-read/`;
    try {
      const res = await fetch(url, { method: "POST", cache: "no-store" });
      return await res.json();
    } catch (e) {
      return { success: false };
    }
  },
  deleteNotification: async (notifId: number | string, studentId?: string) => {
    const sid = studentId || getLoggedInStudentId();
    const url = sid 
      ? `${BASE_URL}/api/student/notifications/delete/${notifId}/${sid}/`
      : `${BASE_URL}/api/student/notifications/delete/${notifId}/`;
    try {
      const res = await fetch(url, { method: "POST", cache: "no-store" });
      return await res.json();
    } catch (e) {
      return { success: false };
    }
  },
  getRequests: async (studentId?: string) => {
    const sid = studentId || getLoggedInStudentId();
    const url = sid 
      ? `${BASE_URL}/api/student/requests/${sid}/`
      : `${BASE_URL}/api/student/requests/`;
    try {
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) return { success: false, error: `HTTP ${res.status}` };
      return await res.json();
    } catch (e: any) {
      return { success: false, error: e.message || "Network Error" };
    }
  },
  submitRequest: async (data: FormData | Record<string, any>, studentId?: string) => {
    const sid = studentId || getLoggedInStudentId();
    const url = sid 
      ? `${BASE_URL}/api/student/requests/${sid}/`
      : `${BASE_URL}/api/student/requests/`;
    try {
      let options: RequestInit = { method: "POST" };
      if (data instanceof FormData) {
        options.body = data;
      } else {
        options.headers = { "Content-Type": "application/json" };
        options.body = JSON.stringify(data);
      }
      const res = await fetch(url, options);
      return await res.json();
    } catch (e: any) {
      return { status: "error", message: e.message || "Network Error" };
    }
  },
  saveCareerAsset: async (data: FormData | Record<string, any>, studentId?: string) => {
    const sid = studentId || getLoggedInStudentId();
    const url = sid 
      ? `${BASE_URL}/api/student/career/save-asset/${sid}/`
      : `${BASE_URL}/api/student/career/save-asset/`;
    try {
      let options: RequestInit = { method: "POST" };
      if (data instanceof FormData) {
        options.body = data;
      } else {
        options.headers = { "Content-Type": "application/json" };
        options.body = JSON.stringify(data);
      }
      const res = await fetch(url, options);
      return await res.json();
    } catch (e: any) {
      return { status: "error", message: e.message || "Network Error" };
    }
  },
  getParentChildren: async (parentId?: string) => {
    const pid = parentId || getLoggedInStudentId();
    if (!pid) return { success: false, children: [] };
    try {
      const res = await fetch(`${BASE_URL}/api/parent/children/${pid}/`, { cache: "no-store" });
      if (!res.ok) return { success: false, children: [] };
      return await res.json();
    } catch (e: any) {
      return { success: false, children: [], error: e.message };
    }
  },
};

