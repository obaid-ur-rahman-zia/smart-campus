import Link from "next/link";
import { GraduationCap, Sparkles } from "lucide-react";
import { LoginForm } from "@/components/auth/login-form";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function LoginPage() {
  return (
    <main className="flex min-h-screen bg-white selection:bg-primary/10">
      <div className="flex flex-1 flex-col justify-center px-8 py-12 md:px-24 lg:flex-none lg:w-[600px]">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div className="mb-12">
            <Link href="/" className="inline-flex items-center gap-2">
               <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-white shadow-xl shadow-primary/20">
                  <GraduationCap className="size-6" />
               </div>
               <span className="text-xl font-black tracking-tight text-primary">Academic Meridian</span>
            </Link>
          </div>

          <div className="mb-10">
            <h1 className="text-4xl font-black tracking-tight text-primary">Welcome Back.</h1>
            <p className="mt-3 text-lg font-bold text-slate-400">
               Access your institutional workspace and service portal.
            </p>
          </div>

          <div className="mt-8">
            <LoginForm />
          </div>

          <div className="mt-12 text-center text-sm font-bold text-slate-500">
            Institutional account required.{" "}
            <Link href="/register" className="text-primary hover:underline underline-offset-4 decoration-2 decoration-secondary">
               Request Enrollment
            </Link>
          </div>
        </div>
      </div>

      <div className="relative hidden flex-1 lg:block">
        <div className="absolute inset-0 h-full w-full bg-primary overflow-hidden">
           <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(70,130,180,0.5),transparent)]" />
           <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
           
           <div className="flex h-full flex-col justify-center px-24 text-white relative z-10">
              <div className="max-w-xl space-y-8">
                 <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-widest text-secondary backdrop-blur-md">
                    <Sparkles className="size-3.5" />
                    Verified Institution
                 </div>
                 <h2 className="text-5xl font-black leading-[1.1]">The Future of Campus Administration.</h2>
                 <p className="text-xl font-medium text-slate-300 leading-relaxed">
                    Digitalize every institutional workflow. From document requests to complex complaint handling, 
                    Meridian provides a seamless, transparent experience for everyone.
                 </p>
                 <div className="flex gap-8 pt-6">
                    <div>
                       <p className="text-3xl font-black">99.9%</p>
                       <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Uptime</p>
                    </div>
                    <div>
                       <p className="text-3xl font-black">15k+</p>
                       <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Active Users</p>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </main>
  );
}
