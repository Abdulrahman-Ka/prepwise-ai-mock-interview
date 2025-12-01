import { NextResponse } from "next/server";
import { signUp } from "@/lib/action/auth.action";

export async function POST(request: Request) {
  try {
    const { uid, name, email } = await request.json();

    if (!uid || !name || !email) {
      return NextResponse.json(
        { success: false, message: "uid, name, and email are required." },
        { status: 400 }
      );
    }

    const result = await signUp({ uid, name, email });

    if (!result || !result.success) {
      return NextResponse.json(
        {
          success: false,
          message: result?.message || "Failed to create account.",
        },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, message: result.message });
  } catch (error) {
    console.error("Error in /api/auth/sign-up", error);
    return NextResponse.json(
      { success: false, message: "Internal server error." },
      { status: 500 }
    );
  }
}
