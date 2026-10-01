import { NextResponse } from "next/server";
import { getParentLinkedStudent, getStudentNotifications } from "@/lib/parentData";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const parentId = searchParams.get("parentId") || "PAR001";
    const student = await getParentLinkedStudent(parentId);
    const notifications = await getStudentNotifications(student.id);

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
