"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, GraduationCap, LayoutDashboard, ShieldCheck, Sparkles, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { CampusSceneComponent } from "@/components/landing/campus-scene";
import { FadeIn, Stagger } from "@/components/animated/fade-in";
import { CountUp } from "@/components/animated/count-up";

const navItems = ["Home", "Services", "Dashboards", "Announcements"];

const features = [
  { title: "Student Dashboard", icon: LayoutDashboard, desc: "Submit, track, and manage all your service requests from a single interface." },
  { title: "Staff Processing", icon: Users, desc: "Integrated queue management for departments to handle student inquiries efficiently." },
  { title: "Academic Records", icon: BookOpen, desc: "Instant digital access to verification, transcripts, and enrollment certificates." },
  { title: "Document Vault", icon: ShieldCheck, desc: "Secure storage for all official institutional communications and certificates." },
  { title: "Live Notification", icon: Sparkles, desc: "Real-time updates via SMS and Email for every step of your request journey." },
  { title: "Role-Based Access", icon: ShieldCheck, desc: "Enterprise-grade security ensuring only authorized personnel access sensitive data." }
];

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-[#fcfdfe] selection:bg-primary/10 selection:text-primary overflow-hidden">
      {/* Animated Background */}
      <motion.div
        className="absolute inset-0 -z-10 h-full w-full bg-white bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:32px_32px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"
        animate={{ backgroundPosition: "0 0, 32px 32px" }}
        transition={{ duration: 20, repeat: Infinity, repeatType: "reverse" }}
      />

      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200/60 bg-white/70 backdrop-blur-xl">
        <div className="container mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
          <motion.div
            className="flex items-center gap-2.5"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-white shadow-lg shadow-primary/20">
              <GraduationCap className="size-6" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-xl font-black tracking-tight text-primary">Academic Meridian</span>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-secondary">Service Portal</span>
            </div>
          </motion.div>

          <nav className="hidden items-center gap-10 lg:flex">
            {navItems.map((item, i) => (
              <Link
                key={item}
                href={`#${item.toLowerCase()}`}
                className={cn(
                  "text-sm font-bold transition-colors hover:text-primary",
                  item === 'Home' ? "text-primary" : "text-slate-500"
                )}
              >
                {item}
              </Link>
            ))}
          </nav>

          <motion.div
            className="flex items-center gap-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Link href="/login">
              <Button variant="ghost" className="hidden text-sm font-bold text-slate-600 hover:text-primary sm:flex">Log in</Button>
            </Link>
            <Link href="/register">
              <Button className="h-11 rounded-lg px-6 text-sm font-bold shadow-xl shadow-primary/10 transition-all hover:scale-[1.02] active:scale-95">
                Join Portal
              </Button>
            </Link>
          </motion.div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-10 pb-32 md:pt-20 md:pb-20 overflow-hidden">
          <div className="container relative z-10 mx-auto max-w-7xl px-6">
            <div className="grid lg:grid-cols-2 lg:items-center lg:gap-20">
              <motion.div
                className="space-y-2"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                <FadeIn direction="up" delay={0.4}>
                  <div className="inline-flex items-center gap-2 rounded-full border border-secondary/20 bg-secondary/5 px-4 py-2 text-[11px] font-black uppercase tracking-widest text-secondary">
                    <Sparkles className="size-3.5" />
                    Redefining Campus Operations
                  </div>
                </FadeIn>

                <FadeIn direction="up" delay={0.5}>
                  <h1 className="text-2xl font-black leading-[1.05] tracking-tight text-primary md:text-6xl">
                    Academic Excellence Through{" "}
                    <span className="bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
                      Smart Services.
                    </span>
                  </h1>
                </FadeIn>

                <FadeIn direction="up" delay={0.6}>
                  <p className="max-w-xl text-lg font-medium leading-relaxed text-slate-500 md:text-xl">
                    Unified student-services portal for modern institutions.
                    Streamline complaints, documents, and records with real-time tracking.
                  </p>
                </FadeIn>

                <FadeIn direction="up" delay={0.7}>
                  <div className="flex flex-wrap gap-5 pt-4">
                    <Link href="/login">
                      <Button size="lg" className="h-16 rounded-xl px-10 text-lg font-black shadow-2xl shadow-primary/30 transition-all hover:translate-y-[-2px] hover:shadow-primary/40">
                        Get Started
                        <ArrowRight className="ml-3 size-6" />
                      </Button>
                    </Link>
                    <Link href="/register">
                      <Button variant="outline" size="lg" className="group h-16 rounded-xl px-10 text-lg font-black border-2 border-slate-200 bg-white hover:bg-slate-50 transition-all">
                        Learn More
                        <div className="ml-3 flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 group-hover:bg-primary group-hover:text-white transition-colors">
                          <ArrowRight className="size-3.5" />
                        </div>
                      </Button>
                    </Link>
                  </div>
                </FadeIn>

                <FadeIn direction="up" delay={0.8}>
                  <div className="flex items-center gap-10 pt-10 border-t border-slate-100 mt-10">
                    <div className="flex -space-x-4">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <motion.div
                          key={i}
                          className="h-12 w-12 rounded-full border-4 border-white bg-slate-200 ring-1 ring-slate-200"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.9 + i * 0.1 }}
                        />
                      ))}
                    </div>
                    <div>
                      <p className="text-sm font-black text-primary">
                        Joining <CountUp from={0} to={15000} duration={2} suffix="+" /> Students
                      </p>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Across <CountUp from={0} to={40} duration={2} suffix="+" /> Departments</p>
                    </div>
                  </div>
                </FadeIn>
              </motion.div>

              <motion.div
                className="relative mt-20 lg:mt-0"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
              >
                <div className="relative z-10 overflow-hidden rounded-[40px] p-2 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] ring-1 ring-slate-100">
                  <div className="aspect-[4/3] rounded-[32px] overflow-hidden bg-black">
                    <CampusSceneComponent />
                  </div>
                </div>
                {/* Decorative gradients */}
                <motion.div
                  className="absolute -top-24 -right-24 -z-10 h-96 w-96 rounded-full bg-primary/5 blur-[120px]"
                  animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                  transition={{ duration: 8, repeat: Infinity }}
                />
                <motion.div
                  className="absolute -bottom-24 -left-24 -z-10 h-96 w-96 rounded-full bg-secondary/10 blur-[120px]"
                  animate={{ scale: [1.2, 1, 1.2], opacity: [0.5, 0.3, 0.5] }}
                  transition={{ duration: 8, repeat: Infinity, delay: 4 }}
                />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Feature Grid - Services Section */}
        <section id="services" className="bg-slate-50/50 py-32 border-y border-slate-200/60 relative overflow-hidden">
          <div className="container mx-auto max-w-7xl px-6">
            <div className="mb-20 space-y-4">
              <FadeIn direction="up">
                <div className="text-center">
                  <h2 className="text-4xl font-black tracking-tight text-primary md:text-5xl">Digital Ecosystem</h2>
                  <div className="mx-auto mt-6 h-1.5 w-20 rounded-full bg-secondary" />
                  <p className="mt-8 mx-auto max-w-2xl text-lg font-medium text-slate-500 leading-relaxed">
                    Every institutional workflow, reimagined for the digital age.
                    Faster, transparent, and completely paperless.
                  </p>
                </div>
              </FadeIn>
            </div>

            <div className="grid gap-8 md:grid-cols-3 lg:gap-10">
              <Stagger staggerDelay={0.1}>
                {features.map((feature, i) => (
                  <Card key={i} className="group overflow-hidden border-none bg-white p-10 shadow-sm transition-all duration-500 hover:translate-y-[-8px] hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.08)]">
                    <CardContent className="p-0 flex flex-col h-full">
                      <div className="mb-8 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50 text-primary transition-all duration-500 group-hover:bg-primary group-hover:text-white group-hover:scale-110 group-hover:rotate-3">
                        <feature.icon className="size-8" />
                      </div>
                      <h3 className="mb-4 text-2xl font-black text-primary">{feature.title}</h3>
                      <p className="text-slate-500 font-medium leading-relaxed flex-1">{feature.desc}</p>
                      <div className="mt-8 flex items-center text-secondary font-black text-sm uppercase tracking-widest opacity-0 translate-x-[-10px] transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
                        Learn More
                        <ArrowRight className="ml-2 size-4" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </Stagger>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-32">
          <div className="container mx-auto max-w-7xl px-6">
            <FadeIn direction="up">
              <div className="rounded-[40px] bg-primary p-12 md:p-24 text-center text-white relative overflow-hidden shadow-2xl">
                <motion.div
                  className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(70,130,180,0.4),transparent)]"
                  animate={{ opacity: [0.5, 0.7, 0.5] }}
                  transition={{ duration: 4, repeat: Infinity }}
                />
                <div className="relative z-10 space-y-8">
                  <h2 className="text-4xl font-black md:text-6xl">Ready to transform your campus experience?</h2>
                  <p className="mx-auto max-w-2xl text-lg font-medium text-slate-300">
                    Join thousands of students and faculty members who are already using Academic Meridian to streamline their daily institutional lives.
                  </p>
                  <div className="flex flex-wrap justify-center gap-5 pt-8">
                    <Link href="/register">
                      <Button size="lg" className="h-16 rounded-xl bg-white px-10 text-lg font-black text-primary hover:bg-slate-100">
                        Create Account
                      </Button>
                    </Link>
                    <Link href="/login">
                      <Button size="lg" variant="outline" className="h-16 rounded-xl border-white/20 bg-white/5 px-10 text-lg font-black text-white backdrop-blur-sm hover:bg-white/10">
                        Login Now
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200/60 bg-white py-20">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="grid gap-12 md:grid-cols-4">
            <div className="col-span-2 space-y-6">
              <motion.div
                className="flex items-center gap-2"
                whileHover={{ scale: 1.02 }}
              >
                <GraduationCap className="size-8 text-primary" />
                <span className="text-2xl font-black tracking-tight text-primary">Academic Meridian</span>
              </motion.div>
              <p className="max-w-sm text-lg font-medium text-slate-500 leading-relaxed">
                Empowering the next generation of academic institutions with world-class digital service infrastructure.
              </p>
            </div>
            {['Platforms', 'Services'].map((title) => (
              <div key={title} className="space-y-6">
                <h4 className="text-sm font-black uppercase tracking-widest text-primary">{title}</h4>
                <ul className="space-y-4">
                  {['Student Portal', 'Admin Control', 'Staff Queue', 'API Access'].map((link) => (
                    <li key={link}>
                      <Link href="#" className="text-slate-500 font-bold transition-colors hover:text-primary">{link}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-20 flex flex-col items-center justify-between gap-8 border-t border-slate-100 pt-10 md:flex-row">
            <p className="text-sm font-bold text-slate-400">
              &copy; 2026 Academic Meridian Pro. All rights reserved. Built for institutional excellence.
            </p>
            <div className="flex gap-8">
              {['Privacy', 'Terms', 'Support', 'GitHub'].map((link) => (
                <Link key={link} href="#" className="text-sm font-black text-slate-400 transition-colors hover:text-primary uppercase tracking-widest">{link}</Link>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
