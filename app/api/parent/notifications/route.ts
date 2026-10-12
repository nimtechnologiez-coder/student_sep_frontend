import { NextResponse } from "next/server";
import { getParentLinkedStudent, getStudentNotifications } from "@/lib/parentData";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get("studentId") || searchParams.get("parentId") || "";
    const student = await getParentLinkedStudent(studentId);
    const notifications = await getStudentNotifications(student.id || studentId);

    return NextResponse.json({
      success: true,
      student,
      notifications,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch notifications data" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, notifId, studentId } = body;
    const sid = studentId || "";

    if (action === "mark-read" && notifId) {
      const res = await fetch(
        `http://127.0.0.1:8000/api/parent/notifications/mark-read/${notifId}/?student_id=${sid}`,
        { method: "POST" }
      );
      const data = await res.json();
      return NextResponse.json(data);
    }

    if (action === "mark-all-read") {
      const res = await fetch(
        `http://127.0.0.1:8000/api/parent/notifications/mark-all-read/?student_id=${sid}`,
        { method: "POST" }
      );
      const data = await res.json();
      return NextResponse.json(data);
    }

    return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to process notification status" },
      { status: 500 }
    );
  }
}
