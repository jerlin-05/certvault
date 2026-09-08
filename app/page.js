"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  FolderLock,
  BellRing,
  MailCheck,
  ShieldCheck,
  ArrowRight,
  PlayCircle,
  CheckCircle2,
} from "lucide-react";
import GradientMesh from "@/components/GradientMesh";

const features = [
  {
    icon: FolderLock,
    title: "Secure vault",
    body: "Your certificates, safely stored and always accessible from one place.",
  },
  {
    icon: BellRing,
    title: "Smart reminders",
    body: "Get notified before certificates expire — you choose the warning window.",
  },
  {
    icon: MailCheck,
    title: "Expiry intelligence",
    body: "See what needs attention at a glance, before it becomes a problem.",
  },
];

const trustLogos = ["Amazon", "Google", "Microsoft", "Deloitte"];

export default function LandingPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-paper">
      {/* ---------- Header ---------- */}
      <header className="relative z-20 border-b border-white/10 bg-ink">
        <div className="container-page flex items-center justify-between py-5">
          <div className="flex items-center gap-2.5">
            <SealMark />
            <span className="font-display text-lg tracking-tight text-paper">
              CertVault
            </span>
          </div>
          <nav className="hidden items-center gap-8 text-sm text-paper/70 md:flex">
            <a href="#features" className="transition hover:text-paper">
              Features
            </a>
            <a href="#how" className="transition hover:text-paper">
              How it works
            </a>
            <a href="#" className="transition hover:text-paper">
              Pricing
            </a>
          </nav>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden text-sm text-paper/80 transition hover:text-paper sm:block"
            >
              Sign in
            </Link>
            <Link
              href="/register"
              className="rounded-xl bg-gold px-4 py-2.5 text-sm font-medium text-ink shadow-glow transition hover:bg-gold-light active:scale-95"
            >
              Get started
            </Link>
          </div>
        </div>
      </header>

      {/* ---------- Hero ---------- */}
      <section className="relative bg-ink">
        <GradientMesh variant="dark" />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: "radial-gradient(#FAF9F6 1px, transparent 1px)",
            backgroundSize: "22px 22px",
          }}
        />
        <div className="container-page relative z-10 grid gap-16 py-20 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-28">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-gold/25 bg-gold/10 px-3.5 py-1.5 text-[11px] font-medium uppercase tracking-wider text-gold-light">
              <ShieldCheck size={13} strokeWidth={2} />
              Trusted by professionals
            </span>
            <h1 className="font-display text-[2.75rem] leading-[1.08] text-paper sm:text-6xl">
              Certificate intelligence,
              <br />
              <span className="text-gold-light">without the spreadsheet.</span>
            </h1>
            <p className="mt-6 max-w-md text-[17px] leading-relaxed text-paper/60">
              Store, monitor and renew every important certificate from one
              secure workspace. Diplomas, licenses, insurance, safety
              training — never miss a renewal again.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Link
                href="/register"
                className="group flex items-center gap-2 rounded-xl bg-gold px-6 py-3.5 text-sm font-semibold text-ink shadow-glow transition hover:bg-gold-light active:scale-95"
              >
                Start your vault
                <ArrowRight
                  size={16}
                  className="transition group-hover:translate-x-0.5"
                />
              </Link>
              <button className="flex items-center gap-2 rounded-xl border border-white/15 px-6 py-3.5 text-sm font-medium text-paper transition hover:border-white/35 active:scale-95">
                <PlayCircle size={16} />
                View demo
              </button>
            </div>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-xs text-paper/45">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-gold-light" />
                Expiry monitoring
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-gold-light" />
                Smart email reminders
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-gold-light" />
                Secure document storage
              </span>
            </div>
          </motion.div>

          <HeroStack />
        </div>

        <div className="container-page relative z-10 flex flex-wrap items-center justify-center gap-x-12 gap-y-4 border-t border-white/10 py-8 text-xs uppercase tracking-wider text-paper/30">
          {trustLogos.map((l) => (
            <span key={l} className="font-medium">
              {l}
            </span>
          ))}
        </div>
      </section>

      {/* ---------- Features ---------- */}
      <section id="features" className="relative bg-paper">
        <div className="container-page py-24">
          <div className="mx-auto max-w-xl text-center">
            <span className="text-xs font-medium uppercase tracking-wider text-gold-dark">
              Why CertVault
            </span>
            <h2 className="mt-3 font-display text-3xl text-ink sm:text-4xl">
              Everything under control
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-slate">
              Powerful features to help you stay compliant, organised and
              ahead of every renewal.
            </p>
          </div>

          <div className="mt-16 grid gap-6 sm:grid-cols-3">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="rounded-2xl border border-ink/10 bg-paper-card p-7 shadow-card transition hover:-translate-y-1 hover:shadow-glow"
              >
                <span className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-gold-soft text-gold-dark">
                  <f.icon size={19} strokeWidth={1.75} />
                </span>
                <h3 className="font-display text-lg text-ink">{f.title}</h3>
                <p className="mt-2.5 text-[15px] leading-relaxed text-slate">
                  {f.body}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Dashboard preview ---------- */}
      <section id="how" className="relative overflow-hidden bg-ink">
        <div
          aria-hidden
          className="pointer-events-none absolute -left-32 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-gold opacity-[0.08] blur-3xl"
        />
        <div className="container-page grid gap-14 py-24 lg:grid-cols-2 lg:items-center">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="relative overflow-hidden rounded-2xl border border-white/10 bg-ink-soft p-5 shadow-dark"
          >
            <div className="mb-5 flex items-center justify-between">
              <p className="font-display text-base text-paper">
                Good afternoon, Alex 👋
              </p>
              <span className="rounded-xl bg-gold px-3 py-1.5 text-xs font-medium text-ink">
                + Add certificate
              </span>
            </div>
            <div className="grid grid-cols-4 gap-2.5">
              {[
                ["24", "Total"],
                ["4", "Expiring"],
                ["2", "Expired"],
                ["18", "Healthy"],
              ].map(([n, l]) => (
                <div
                  key={l}
                  className="rounded-xl border border-white/10 bg-ink px-3 py-3"
                >
                  <p className="font-display text-lg text-paper">{n}</p>
                  <p className="text-[10px] text-paper/45">{l}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 space-y-2.5">
              {[
                ["ISO 27001", "8 days left", "83"],
                ["Food Safety Level 3", "21 days left", "40"],
              ].map(([name, days, pct]) => (
                <div
                  key={name}
                  className="rounded-xl border border-white/10 bg-ink px-4 py-3"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-paper/80">{name}</span>
                    <span className="text-amber">{days}</span>
                  </div>
                  <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-amber"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <span className="text-xs font-medium uppercase tracking-wider text-gold-light">
              See what needs your attention
            </span>
            <h2 className="mt-3 font-display text-3xl text-paper sm:text-4xl">
              A beautiful, intuitive dashboard that keeps you informed and in
              control.
            </h2>
            <p className="mt-5 max-w-md text-[15px] leading-relaxed text-paper/55">
              Every certificate at a glance — status badges, days remaining
              and an activity feed that surfaces what actually needs your
              attention today.
            </p>
            <Link
              href="/register"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-gold px-6 py-3.5 text-sm font-semibold text-ink shadow-glow transition hover:bg-gold-light active:scale-95"
            >
              Explore the dashboard
              <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ---------- Testimonial / CTA ---------- */}
      <section className="bg-paper">
        <div className="container-page py-24 text-center">
          <p className="mx-auto max-w-2xl font-display text-2xl italic leading-relaxed text-ink sm:text-3xl">
            "CertVault has saved me from missing critical renewals. It's a
            must-have."
          </p>
          <p className="mt-5 text-sm text-slate">— Sarah K., IT Professional</p>

          <div className="mt-14">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-xl bg-ink px-7 py-3.5 text-sm font-semibold text-paper transition hover:bg-ink-light active:scale-95"
            >
              Start your vault — it's free
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-ink/10">
        <div className="container-page flex flex-col items-center justify-between gap-4 py-10 text-xs text-slate-light sm:flex-row">
          <div className="flex items-center gap-2">
            <SealMark small />
            <span>© {new Date().getFullYear()} CertVault</span>
          </div>
          <span>Built for people who'd rather not find out at the border.</span>
        </div>
      </footer>
    </main>
  );
}

function SealMark({ small }) {
  return (
    <span
      className={`flex items-center justify-center rounded-full bg-seal font-semibold text-ink ${
        small ? "h-5 w-5 text-[9px]" : "h-7 w-7 text-[11px]"
      }`}
    >
      CV
    </span>
  );
}

function HeroStack() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
      className="relative mx-auto h-[380px] w-full max-w-sm"
    >
      <p className="pointer-events-none absolute -right-2 -top-8 z-0 rotate-3 font-display text-sm italic text-gold-light/40">
        Your certificates, in safe hands
      </p>
      <MockCard
        className="absolute left-4 top-12 -rotate-6"
        style={{ animationDelay: "0s", animationDuration: "6.5s" }}
        title="AWS Solutions Architect"
        issuer="Amazon Web Services"
        date="186 days left"
        tone="forest"
        badge="Active"
      />
      <MockCard
        className="absolute right-2 top-2 rotate-3"
        style={{ animationDelay: "1.2s", animationDuration: "7.5s" }}
        title="ISO 27001"
        issuer="Information Security"
        date="28 days left"
        tone="amber"
        badge="Expiring"
      />
      <MockCard
        className="absolute bottom-4 left-12 -rotate-2"
        style={{ animationDelay: "2.1s", animationDuration: "6.9s" }}
        title="Food Safety Level 3"
        issuer="Highfield"
        date="Renew now"
        tone="rust"
        badge="Expired"
      />
    </motion.div>
  );
}

function MockCard({ className, style, title, issuer, date, tone, badge }) {
  const toneMap = {
    forest: "bg-forest-light text-forest-dark",
    amber: "bg-amber-light text-amber-dark",
    rust: "bg-rust-light text-rust-dark",
  };
  return (
    <div
      style={style}
      className={`animate-float w-64 rounded-2xl border border-white/10 bg-ink-soft p-5 shadow-dark transition-shadow duration-300 hover:shadow-glow ${className}`}
    >
      <div className="mb-4 flex items-center justify-between">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-seal text-[10px] font-bold text-ink">
          {title[0]}
        </span>
        <span
          className={`rounded-full px-2.5 py-1 text-[10px] font-medium ${toneMap[tone]}`}
        >
          {badge}
        </span>
      </div>
      <p className="font-display text-[15px] leading-snug text-paper">
        {title}
      </p>
      <p className="mt-1 text-xs text-paper/45">{issuer}</p>
      <p className="mt-3 text-[11px] font-medium text-gold-light">{date}</p>
    </div>
  );
}
