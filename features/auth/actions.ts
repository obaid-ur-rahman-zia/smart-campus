"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { registerSchema, type RegisterInput } from "@/features/auth/schemas";

type LoginState = { error: string | null };

export type RegisterState = {
  error: string | null;
  success: string | null;
  fieldErrors: Partial<Record<keyof RegisterInput, string>>;
};

export async function loginWithPassword(
  _prevState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const supabase = await createClient();
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  console.log("[auth] login success user:", user?.id ?? "none");

  redirect("/dashboard");
}

export async function registerAccount(
  _prevState: RegisterState,
  formData: FormData,
): Promise<RegisterState> {
  const emptyFieldErrors = {} as RegisterState["fieldErrors"];

  const parsed = registerSchema.safeParse({
    full_name: formData.get("full_name"),
    email: formData.get("email"),
    roll_number: formData.get("roll_number") || undefined,
    department: formData.get("department") || undefined,
    password: formData.get("password"),
    confirm_password: formData.get("confirm_password"),
  });

  if (!parsed.success) {
    const fieldErrors: RegisterState["fieldErrors"] = { ...emptyFieldErrors };
    for (const issue of parsed.error.issues) {
      const field = issue.path[0];
      if (typeof field === "string" && !fieldErrors[field as keyof RegisterInput]) {
        fieldErrors[field as keyof RegisterInput] = issue.message;
      }
    }
    return {
      error: "Please fix the highlighted fields.",
      success: null,
      fieldErrors,
    };
  }

  const { full_name, email, password, roll_number, department } = parsed.data;
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name,
        role: "student",
        roll_number: roll_number ?? null,
        department: department ?? null,
      },
    },
  });

  if (error) {
    return {
      error: error.message,
      success: null,
      fieldErrors: emptyFieldErrors,
    };
  }

  if (data.session) {
    redirect("/dashboard");
  }

  return {
    error: null,
    success:
      "Account created. Check your email to verify your address, then sign in.",
    fieldErrors: emptyFieldErrors,
  };
}
