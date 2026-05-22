import Link from "next/link";
import { GraduationCap, Sparkles } from "lucide-react";
import { RegisterForm } from "@/components/auth/register-form";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen bg-white selection:bg-primary/10">
      <div className="flex flex-1 flex-col justify-center px-8 py-12 md:px-24 lg:flex-none lg:w-[640px]">
        <div className="mx-auto w-full max-w-md lg:w-full">
          <div className="mb-12">
            <Link href="/" className="inline-flex items-center gap-2">
              <span className="text-xl font-black tracking-tight text-primary">Academic Meridian</span>
            </Link>
          </div>

          <div className="mb-10">
            <h1 className="text-4xl font-black tracking-tight text-primary">Join the Portal.</h1>
            <p className="mt-3 text-lg font-bold text-slate-400">
              Create your student account to submit requests and track campus services.
            </p>
          </div>

          <RegisterForm />
        </div>
      </div>

      <div className="relative hidden flex-1 lg:block">
        <div className="absolute inset-0 h-full w-full overflow-hidden bg-primary">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(70,130,180,0.5),transparent)]" />
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />

          <div className="relative z-10 flex h-full flex-col justify-center px-24 text-white">
            <div className="max-w-xl space-y-8">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-widest text-secondary backdrop-blur-md">
                <Sparkles className="size-3.5" />
                Student enrollment
              </div>
              <h2 className="text-5xl font-black leading-[1.1]">One account for every campus service.</h2>
              <p className="text-xl font-medium leading-relaxed text-slate-300">
                Register with your university email, submit complaints and document requests, and follow
                progress in real time from your dashboard.
              </p>
              <ul className="space-y-4 pt-2 text-sm font-bold uppercase tracking-widest text-slate-200">
                <li className="flex items-center gap-3">
                  <Sparkles className="size-4 text-secondary" />
                  Secure Supabase authentication
                </li>
                <li className="flex items-center gap-3">
                  <Sparkles className="size-4 text-secondary" />
                  Complaints & document workflows
                </li>
                <li className="flex items-center gap-3">
                  <Sparkles className="size-4 text-secondary" />
                  Live status tracking
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
