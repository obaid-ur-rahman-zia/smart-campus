import Link from "next/link";
import { GraduationCap, Sparkles } from "lucide-react";
import { RegisterForm } from "@/components/auth/register-form";

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen flex-1 items-center justify-center bg-slate-50 px-6 py-12">
      <div className="w-full max-w-2xl space-y-8 rounded-2xl border border-slate-200 bg-white shadow-2xl overflow-hidden md:flex">
        <div className="hidden md:flex flex-col justify-center bg-primary p-12 text-white w-2/5">
          <div className="mb-8 h-12 w-12 items-center justify-center rounded-lg bg-white/20 flex backdrop-blur-sm">
             <GraduationCap className="size-8" />
          </div>
          <h2 className="text-3xl font-black leading-tight">Join the Digital Academic Ecosystem.</h2>
          <p className="mt-4 text-slate-300 text-sm leading-relaxed">
            Secure identity management, manage your academic life through a single, secure portal designed for excellence.
          </p>
          <div className="mt-10 space-y-4">
             <p className="flex items-center gap-3 text-xs font-bold text-slate-100 uppercase tracking-widest"><Sparkles className="size-4 text-secondary"/> Secure Identity</p>
             <p className="flex items-center gap-3 text-xs font-bold text-slate-100 uppercase tracking-widest"><Sparkles className="size-4 text-secondary"/> Real-time Tracking</p>
          </div>
        </div>

        <div className="flex-1 p-8 md:p-12">
          <div className="mb-10">
            <h1 className="text-3xl font-extrabold tracking-tight text-primary">Create Student Account</h1>
            <p className="mt-2 text-sm text-slate-500">Provide your official university credentials to register.</p>
          </div>
          
          <RegisterForm />

          <div className="mt-10 border-t border-slate-100 pt-8 text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link href="/login" className="font-bold text-primary hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
