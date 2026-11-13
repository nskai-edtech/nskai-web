import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { getSession } from "@/lib/hub-session";

export async function POST(req: Request) {
  try {
    const session = await getSession();
    // Only super admins can trigger manual revalidation
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized. Admin privileges required." }, { status: 403 });
    }

    revalidateTag("chapter-data");
    return NextResponse.json({
      success: true,
      message: "Cache successfully revalidated. Chapter Hub data refreshed from Google Sheet.",
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error("Revalidation error:", err);
    return NextResponse.json({ error: "Revalidation failed." }, { status: 500 });
  }
}
