import { NextResponse } from "next/server";
import { getParentLinkedStudent, getStudentFees } from "@/lib/parentData";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const parentId = searchParams.get("parentId") || "PAR001";
    const student = await getParentLinkedStudent(parentId);
    const fees = await getStudentFees(student.id);

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
