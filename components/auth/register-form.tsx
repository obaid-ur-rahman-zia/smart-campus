"use client";

import { useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { toast } from "sonner";
import { registerAccount, type RegisterState } from "@/features/auth/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const initialState: RegisterState = {
  error: null,
  success: null,
  fieldErrors: {},
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button className="h-12 w-full rounded-xl text-base font-bold" disabled={pending} type="submit">
      {pending ? "Creating account..." : "Create Student Account"}
    </Button>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-xs font-medium text-red-600">{message}</p>;
}

export function RegisterForm() {
  const [state, formAction] = useActionState(registerAccount, initialState);

  useEffect(() => {
    if (state.error) toast.error(state.error);
    if (state.success) toast.success(state.success);
  }, [state.error, state.success]);

  return (
    <form action={formAction} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="full_name">Full name</Label>
        <Input
          id="full_name"
          name="full_name"
          autoComplete="name"
          placeholder="Obaid Rahman"
          required
          className={cn(state.fieldErrors.full_name && "border-red-300 focus-visible:ring-red-200")}
        />
        <FieldError message={state.fieldErrors.full_name} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">University email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="student@university.edu"
          required
          className={cn(state.fieldErrors.email && "border-red-300 focus-visible:ring-red-200")}
        />
        <FieldError message={state.fieldErrors.email} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="roll_number">Roll number</Label>
          <Input
            id="roll_number"
            name="roll_number"
            placeholder="BSCS-23-001"
            className={cn(state.fieldErrors.roll_number && "border-red-300 focus-visible:ring-red-200")}
          />
          <FieldError message={state.fieldErrors.roll_number} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="department">Department</Label>
          <Input
            id="department"
            name="department"
            placeholder="Computer Science"
            className={cn(state.fieldErrors.department && "border-red-300 focus-visible:ring-red-200")}
          />
          <FieldError message={state.fieldErrors.department} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          minLength={8}
          required
          className={cn(state.fieldErrors.password && "border-red-300 focus-visible:ring-red-200")}
        />
        <FieldError message={state.fieldErrors.password} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirm_password">Confirm password</Label>
        <Input
          id="confirm_password"
          name="confirm_password"
          type="password"
          autoComplete="new-password"
          minLength={8}
          required
          className={cn(state.fieldErrors.confirm_password && "border-red-300 focus-visible:ring-red-200")}
        />
        <FieldError message={state.fieldErrors.confirm_password} />
      </div>

      <p className="rounded-xl border border-indigo-100 bg-indigo-50/50 px-4 py-3 text-xs font-medium text-slate-600">
        New accounts are registered as <span className="font-bold text-primary">Student</span>. Staff,
        teacher, and admin access is assigned by your institution.
      </p>

      <SubmitButton />

      <p className="text-center text-sm font-bold text-slate-500">
        Already have an account?{" "}
        <Link href="/login" className="text-primary underline-offset-4 hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}
