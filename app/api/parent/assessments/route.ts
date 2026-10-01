import { NextResponse } from "next/server";
import { getParentLinkedStudent, getStudentAssessments } from "@/lib/parentData";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const parentId = searchParams.get("parentId") || "PAR001";
    const student = await getParentLinkedStudent(parentId);
    const assessments = await getStudentAssessments(student.id);

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
