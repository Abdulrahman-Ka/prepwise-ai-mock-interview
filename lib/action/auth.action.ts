"use server";

import { auth, db } from "@/firebase/admin";
import { cookies } from "next/headers";

const ONE_WEEK = 60 * 60 * 24 * 7;

export async function signUp(params: SignUpParams) {
  const { uid, name, email } = params;

  try {
    const userRecord = await db.collection("users").doc(uid).get();
    if (userRecord.exists) {
      return {
        success: false,
        message: "User already exists. Please sign in instead.",
      };
    }

    await db.collection("users").doc(uid).set({
      name,
      email,
    });
    return {
      success: true,
      message: "Account created successfully. Please sign in.",
    };
  } catch (err: unknown) {
    console.error("Error creating a user", err);

    if (err.code === "auth/email-already-exists") {
      return {
        success: false,
        message: "This email is already in use.",
      };
    }
    return {
      success: false,
      message: "Failed to create an email.",
    };
  }
}

export async function signIn(params: SignInParams) {
  const { email, idToken } = params;
  try {
    const userRecord = await auth.getUserByEmail(email);

    if (!userRecord) {
      return {
        success: false,
        message: "User does not exist. Create an account instead.",
      };
    }

    await setSessionCookie(idToken);

    return {
      success: true,
      message: "Signed in successfully.",
    };
  } catch (err: unknown) {
    console.error("Error logging in ", err);
    return {
      success: false,
      message: "Failed to log in",
    };
  }
}

export async function setSessionCookie(idToken: string) {
  const cookieStore = await cookies();

  const sessionCookie = await auth.createSessionCookie(idToken, {
    expiresIn: ONE_WEEK * 1000,
  });

  cookieStore.set("session", sessionCookie, {
    maxAge: ONE_WEEK,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "lax",
  });
}

export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies();

  const sessionCookie = cookieStore.get("session")?.value;
  console.log("[getCurrentUser] Session cookie:", sessionCookie ? "exists" : "missing");
  if (!sessionCookie) return null;

  try {
    const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);
    console.log("[getCurrentUser] Token verified, uid:", decodedClaims.uid);

    // Try to load user profile from Firestore, but don't fail auth if it's missing
    const userDocRef = db.collection("users").doc(decodedClaims.uid);
    const userRecord = await userDocRef.get();
    console.log("[getCurrentUser] User doc exists:", userRecord.exists);

    if (!userRecord.exists) {
      const userData = {
        name: (decodedClaims as any).name || "",
        email: decodedClaims.email || "",
      };

      // Best-effort: create a basic user profile document
      try {
        await userDocRef.set(userData, { merge: true });
      } catch (e) {
        console.error("Failed to create user profile document", e);
      }

      return {
        ...userData,
        id: decodedClaims.uid,
      } as User;
    }

    return {
      ...userRecord.data(),
      id: userRecord.id,
    } as User;
  } catch (e) {
    console.error("[getCurrentUser] Error:", e);
    return null;
  }
}

export async function isAuthenticated() {
  const user = await getCurrentUser();
  const result = !!user;
  console.log("[isAuthenticated] Result:", result, user ? `(user: ${user.email})` : "(no user)");
  return result;
}
