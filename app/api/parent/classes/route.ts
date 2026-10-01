import { NextResponse } from "next/server";
import { getParentLinkedStudent, getStudentClasses } from "@/lib/parentData";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const parentId = searchParams.get("parentId") || "PAR001";
    const student = await getParentLinkedStudent(parentId);
    const classes = await getStudentClasses(student.id);

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
