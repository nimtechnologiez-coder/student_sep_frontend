import { NextResponse } from "next/server";
import { getParentDashboardData } from "@/lib/parentData";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get("studentId") || searchParams.get("parentId") || "";
    const data = await getParentDashboardData(studentId);

    return NextResponse.json({
      success: true,
      ...data,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch parent dashboard data" },
      { status: 500 }
    );
  }
}
