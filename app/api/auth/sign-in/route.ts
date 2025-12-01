import { NextResponse } from "next/server";
import { signIn } from "@/lib/action/auth.action";

export async function POST(request: Request) {
  try {
    const { email, idToken } = await request.json();

    if (!email || !idToken) {
      return NextResponse.json(
        { success: false, message: "Email and idToken are required." },
        { status: 400 }
      );
    }

    const result = await signIn({ email, idToken });

    if (!result || !result.success) {
      return NextResponse.json(
        {
          success: false,
          message: result?.message || "Failed to sign in.",
        },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, message: result.message });
  } catch (error) {
    console.error("Error in /api/auth/sign-in", error);
    return NextResponse.json(
      { success: false, message: "Internal server error." },
      { status: 500 }
    );
  }
}
