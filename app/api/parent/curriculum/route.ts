import { NextResponse } from "next/server";
import { getStudentCurriculum } from "@/lib/parentData";

export async function GET() {
  try {
    const curriculum = await getStudentCurriculum();
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
