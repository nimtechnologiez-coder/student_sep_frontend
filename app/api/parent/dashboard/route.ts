import { NextResponse } from "next/server";
import { getParentDashboardData } from "@/lib/parentData";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const parentId = searchParams.get("parentId") || "PAR001";
    const data = await getParentDashboardData(parentId);

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
