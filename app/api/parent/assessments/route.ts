import { NextResponse } from "next/server";
import { getParentLinkedStudent, getStudentAssessments } from "@/lib/parentData";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get("studentId") || searchParams.get("parentId") || "";
    const student = await getParentLinkedStudent(studentId);
    const assessments = await getStudentAssessments(student.id || studentId);

    return NextResponse.json({
      success: true,
      student,
      assessments,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch assessments data" },
      { status: 500 }
    );
  }
}
