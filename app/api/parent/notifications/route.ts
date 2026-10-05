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
