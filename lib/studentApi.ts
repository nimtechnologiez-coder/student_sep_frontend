const BASE_URL = "http://127.0.0.1:8000";

export function getLoggedInStudentId(): string {
  if (typeof window === "undefined") return "";
  try {
    const stored = localStorage.getItem("userData");
    if (stored) {
      const parsed = JSON.parse(stored);
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
  getNotifications: (studentId?: string) => fetchFromApi("notifications", studentId),
};
