import { NextResponse } from "next/server";
import { getParentLinkedStudent, getStudentAttendance } from "@/lib/parentData";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const parentId = searchParams.get("parentId") || "PAR001";
    const student = await getParentLinkedStudent(parentId);
    const attendance = await getStudentAttendance(student.id);

    const presentCount = attendance.filter((a) => a.status === "Present").length;
    const absentCount = attendance.filter((a) => a.status === "Absent").length;
    const lateCount = attendance.filter((a) => a.status === "Late").length;
    const totalClasses = attendance.length;
    const percentage = totalClasses > 0 ? Math.round((presentCount / totalClasses) * 100) : 0;

    return NextResponse.json({
      success: true,
      student,
      summary: {
        totalClasses,
        presentCount,
        absentCount,
        lateCount,
        percentage,
      },
      attendance,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch attendance data" },
      { status: 500 }
    );
  }
}
