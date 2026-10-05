import { NextResponse } from "next/server";
import { getParentLinkedStudent, getStudentClasses } from "@/lib/parentData";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get("studentId") || searchParams.get("parentId") || "";
    const student = await getParentLinkedStudent(studentId);
    const classes = await getStudentClasses(student.id || studentId);

    return NextResponse.json({
      success: true,
      student,
      classes,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch classes data" },
      { status: 500 }
    );
  }
}
