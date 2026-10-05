import { NextResponse } from "next/server";
import { getParentLinkedStudent, getStudentFees } from "@/lib/parentData";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get("studentId") || searchParams.get("parentId") || "";
    const student = await getParentLinkedStudent(studentId);
    const fees = await getStudentFees(student.id || studentId);

    return NextResponse.json({
      success: true,
      student,
      fees,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch fees data" },
      { status: 500 }
    );
  }
}
