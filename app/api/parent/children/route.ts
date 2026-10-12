import { NextResponse } from "next/server";

const BASE_URL = "http://127.0.0.1:8000";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const parentId = searchParams.get("parentId") || searchParams.get("studentId") || "";
    if (!parentId) {
      return NextResponse.json({ success: true, children: [], count: 0 });
    }

    const res = await fetch(`${BASE_URL}/api/parent/children/${parentId}/`, { cache: "no-store" });
    if (!res.ok) {
      return NextResponse.json({ success: false, error: "Failed to fetch children" }, { status: res.status });
    }
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
