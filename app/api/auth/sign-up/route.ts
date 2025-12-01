import { NextResponse } from "next/server";
import { signUp } from "@/lib/action/auth.action";

export async function POST(request: Request) {
  try {
    const { uid, name, email, password } = await request.json();

    if (!uid || !name || !email || !password) {
      return NextResponse.json(
        { success: false, message: "uid, name, email and password are required." },
        { status: 400 }
      );
    }

    const result = await signUp({ uid, name, email, password });

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
