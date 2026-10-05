import { NextResponse } from "next/server";
import { getParentLinkedStudent, getParentProfile } from "@/lib/parentData";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get("studentId") || searchParams.get("parentId") || "";
    const student = await getParentLinkedStudent(studentId);
    const parent = await getParentProfile(student.id || studentId);

    return NextResponse.json({
      success: true,
      parent,
      student,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch student profile data" },
      { status: 500 }
    );
  }
}
