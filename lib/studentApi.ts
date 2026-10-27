export function getBaseUrl(): string {
  if (typeof window !== "undefined") {
    const host = window.location.hostname;
    if (host === "localhost" || host === "127.0.0.1") {
      return process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
    }
  }
  return process.env.NEXT_PUBLIC_API_URL || "https://student-sep-backend.onrender.com";
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://student-sep-backend.onrender.com";

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
      return parsed.student_id || parsed.username || (parsed.id ? String(parsed.id) : "");
    }
  } catch (e) {
    console.error("Error reading stored student session:", e);
  }
  return "";
}

async function fetchFromApi(endpoint: string, studentId?: string) {
  const sid = studentId || getLoggedInStudentId();
  const base = getBaseUrl();
  const url = sid
    ? `${base}/api/student/${endpoint}/data/${encodeURIComponent(sid)}/`
    : `${base}/api/student/${endpoint}/data/`;

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
    const base = getBaseUrl();
    const url = `${base}/api/student/topic/complete/`;
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
    const base = getBaseUrl();
    const url = sid
      ? `${base}/api/student/notifications/mark-read/${notifId}/${encodeURIComponent(sid)}/`
      : `${base}/api/student/notifications/mark-read/${notifId}/`;
    try {
      const res = await fetch(url, { method: "POST", cache: "no-store" });
      return await res.json();
    } catch (e) {
      return { success: false };
    }
  },
  markAllNotificationsRead: async (studentId?: string) => {
    const sid = studentId || getLoggedInStudentId();
    const base = getBaseUrl();
    const url = sid
      ? `${base}/api/student/notifications/mark-all-read/${encodeURIComponent(sid)}/`
      : `${base}/api/student/notifications/mark-all-read/`;
    try {
      const res = await fetch(url, { method: "POST", cache: "no-store" });
      return await res.json();
    } catch (e) {
      return { success: false };
    }
  },
  deleteNotification: async (notifId: number | string, studentId?: string) => {
    const sid = studentId || getLoggedInStudentId();
    const isLocal = typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");
    const base = getBaseUrl();
    const candidateUrls = isLocal
      ? [
          `http://127.0.0.1:8000/api/student/notifications/delete/${notifId}/${sid ? encodeURIComponent(sid) + '/' : ''}`,
          `http://localhost:8000/api/student/notifications/delete/${notifId}/${sid ? encodeURIComponent(sid) + '/' : ''}`,
          `${base}/api/student/notifications/delete/${notifId}/${sid ? encodeURIComponent(sid) + '/' : ''}`
        ]
      : [
          `${base}/api/student/notifications/delete/${notifId}/${sid ? encodeURIComponent(sid) + '/' : ''}`,
          `http://127.0.0.1:8000/api/student/notifications/delete/${notifId}/${sid ? encodeURIComponent(sid) + '/' : ''}`
        ];
    const uniqueUrls = Array.from(new Set(candidateUrls));

    for (const url of uniqueUrls) {
      try {
        const res = await fetch(url, {
          method: "POST",
          cache: "no-store",
          headers: sid ? { "X-Student-Id": sid } : {}
        });
        if (res.ok) {
          const data = await res.json().catch(() => null);
          if (data && (data.status === "success" || data.success)) return data;
        }
      } catch (e) {
        // try next endpoint
      }
    }
    return { status: "error", success: false, message: "Failed to delete notification" };
  },
  deleteRequest: async (requestId: number | string, studentId?: string) => {
    const sid = studentId || getLoggedInStudentId();
    const isLocal = typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");
    const base = getBaseUrl();
    const candidateUrls = isLocal
      ? [
          `http://127.0.0.1:8000/api/student/requests/delete/${requestId}/${sid ? encodeURIComponent(sid) + '/' : ''}`,
          `http://localhost:8000/api/student/requests/delete/${requestId}/${sid ? encodeURIComponent(sid) + '/' : ''}`,
          `${base}/api/student/requests/delete/${requestId}/${sid ? encodeURIComponent(sid) + '/' : ''}`
        ]
      : [
          `${base}/api/student/requests/delete/${requestId}/${sid ? encodeURIComponent(sid) + '/' : ''}`,
          `http://127.0.0.1:8000/api/student/requests/delete/${requestId}/${sid ? encodeURIComponent(sid) + '/' : ''}`
        ];
    const uniqueUrls = Array.from(new Set(candidateUrls));

    for (const url of uniqueUrls) {
      try {
        const res = await fetch(url, {
          method: "POST",
          cache: "no-store",
          headers: sid ? { "X-Student-Id": sid } : {}
        });
        if (res.ok) {
          const data = await res.json().catch(() => null);
          if (data && (data.status === "success" || data.success)) return data;
        }
      } catch (e) {
        // try next candidate URL
      }
    }
    return { status: "error", success: false, message: "Failed to delete doubt" };
  },
  getRequests: async (studentId?: string) => {
    const sid = studentId || getLoggedInStudentId();
    const base = getBaseUrl();
    const url = sid
      ? `${base}/api/student/requests/${encodeURIComponent(sid)}/`
      : `${base}/api/student/requests/`;
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
    const base = getBaseUrl();
    const url = sid
      ? `${base}/api/student/requests/${encodeURIComponent(sid)}/`
      : `${base}/api/student/requests/`;
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
    const base = getBaseUrl();
    const url = sid
      ? `${base}/api/student/career/save-asset/${encodeURIComponent(sid)}/`
      : `${base}/api/student/career/save-asset/`;
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
  toggleStar: async (notifId: number | string, studentId?: string) => {
    const sid = studentId || getLoggedInStudentId();
    const base = getBaseUrl();
    const url = sid
      ? `${base}/api/student/notifications/toggle-star/${notifId}/${encodeURIComponent(sid)}/`
      : `${base}/api/student/notifications/toggle-star/${notifId}/`;
    try {
      const res = await fetch(url, { method: "POST", cache: "no-store" });
      return await res.json();
    } catch (e) {
      return { success: false };
    }
  },
  replyToRequest: async (requestId: number | string, message: string, studentId?: string) => {
    const sid = studentId || getLoggedInStudentId();
    const base = getBaseUrl();
    const url = sid
      ? `${base}/api/student/requests/${encodeURIComponent(sid)}/reply/${requestId}/`
      : `${base}/api/student/requests/${requestId}/reply/`;
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
      return await res.json();
    } catch (e: any) {
      return { status: "error", message: e.message || "Network Error" };
    }
  },
  getParentChildren: async (parentId?: string) => {
    const pid = parentId || getLoggedInStudentId();
    if (!pid) return { success: false, children: [] };
    const base = getBaseUrl();
    try {
      const res = await fetch(`${base}/api/parent/children/${encodeURIComponent(pid)}/`, { cache: "no-store" });
      if (!res.ok) return { success: false, children: [] };
      return await res.json();
    } catch (e: any) {
      return { success: false, children: [], error: e.message };
    }
  },
  createRazorpayOrder: async (amount?: number, paymentId?: string | number, studentId?: string) => {
    const sid = studentId || getLoggedInStudentId();
    const payload = JSON.stringify({ student_id: sid, amount, payment_id: paymentId });
    const isLocal = typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");
    const urls = isLocal
      ? [
          "http://127.0.0.1:8000/api/student/razorpay/create-order/",
          "http://localhost:8000/api/student/razorpay/create-order/",
          `${BASE_URL}/api/student/razorpay/create-order/`
        ]
      : [
          `${BASE_URL}/api/student/razorpay/create-order/`,
          "http://127.0.0.1:8000/api/student/razorpay/create-order/",
          "http://localhost:8000/api/student/razorpay/create-order/"
        ];
    const uniqueUrls = Array.from(new Set(urls));

    for (const url of uniqueUrls) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 4000);
        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: payload,
          cache: "no-store",
          signal: controller.signal
        });
        clearTimeout(timeoutId);
        const data = await res.json().catch(() => null);
        if (res.ok && data?.success) return data;
        if (data?.error) return { success: false, error: data.error };
      } catch (e) {
        // try next endpoint URL
      }
    }
    return { success: false, error: "Unable to reach Razorpay order endpoint" };
  },
  verifyRazorpayPayment: async (payload: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
    student_id?: string;
    amount?: number;
    payment_id?: string | number;
  }) => {
    const sid = payload.student_id || getLoggedInStudentId();
    const bodyStr = JSON.stringify({ ...payload, student_id: sid });
    const isLocal = typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");
    const urls = isLocal
      ? [
          "http://127.0.0.1:8000/api/student/razorpay/verify-payment/",
          "http://localhost:8000/api/student/razorpay/verify-payment/",
          `${BASE_URL}/api/student/razorpay/verify-payment/`
        ]
      : [
          `${BASE_URL}/api/student/razorpay/verify-payment/`,
          "http://127.0.0.1:8000/api/student/razorpay/verify-payment/",
          "http://localhost:8000/api/student/razorpay/verify-payment/"
        ];
    const uniqueUrls = Array.from(new Set(urls));

    for (const url of uniqueUrls) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 4000);
        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: bodyStr,
          cache: "no-store",
          signal: controller.signal
        });
        clearTimeout(timeoutId);
        const data = await res.json().catch(() => null);
        if (res.ok && data?.success) return data;
        if (data?.error) return { success: false, error: data.error };
      } catch (e) {
        // try next endpoint URL
      }
    }
    return { success: false, error: "Unable to verify payment with server" };
  },
};

