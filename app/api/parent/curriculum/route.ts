import { NextResponse } from "next/server";
import { getStudentCurriculum } from "@/lib/parentData";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get("studentId") || searchParams.get("parentId") || "";
    const curriculum = await getStudentCurriculum(studentId);
    return NextResponse.json({
      success: true,
      curriculum,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch curriculum data" },
      { status: 500 }
    );
  }
}
