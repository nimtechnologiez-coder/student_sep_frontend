import { NextResponse } from "next/server";
import { getParentLinkedStudent, getParentProfile } from "@/lib/parentData";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const parentId = searchParams.get("parentId") || "PAR001";
    const student = await getParentLinkedStudent(parentId);
    const parent = await getParentProfile(parentId);

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
