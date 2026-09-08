"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ShieldCheck, BellRing, FolderLock } from "lucide-react";
import GradientMesh from "@/components/GradientMesh";

const PANEL_POINTS = [
  {
    icon: FolderLock,
    title: "One vault, every credential",
    body: "Diplomas, licenses, policies and domain certs — stop hunting through folders and inboxes.",
  },
  {
    icon: BellRing,
    title: "Alerts on your schedule",
    body: "Choose the exact day you want to hear from us before each one lapses.",
  },
  {
    icon: ShieldCheck,
    title: "Private by default",
    body: "Every certificate is scoped to your account alone — nobody else can see it.",
  },
];

export default function AuthShell({ children }) {
  return (
    <main className="grid min-h-screen lg:grid-cols-[1fr_1fr] xl:grid-cols-[1.05fr_0.95fr]">
      <section className="relative hidden overflow-hidden bg-ink lg:flex lg:flex-col lg:justify-between lg:px-14 lg:py-12 xl:px-20">
        <GradientMesh variant="dark" />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "radial-gradient(#FBFAF7 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-seal opacity-[0.12] blur-3xl"
        />

        <Link href="/" className="relative flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-seal text-xs font-semibold text-ink">
            CV
          </span>
          <span className="font-display text-xl text-paper">CertVault</span>
        </Link>

        <div className="relative max-w-md">
          <p className="font-display text-[1.7rem] italic leading-snug text-paper/90">
            "The certificate that expires quietly is the one that costs you
            the most."
          </p>
          <div className="mt-10 space-y-7">
            {PANEL_POINTS.map((p) => (
              <div key={p.title} className="flex gap-4">
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gold/30 bg-gold/10 text-gold-light">
                  <p.icon size={17} strokeWidth={1.75} />
                </span>
                <div>
                  <p className="text-sm font-medium text-paper">{p.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-paper/55">
                    {p.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="relative text-xs text-paper/35">
          © {new Date().getFullYear()} CertVault — built for people who'd
          rather not find out at the border.
        </p>
      </section>

      <section className="flex items-center justify-center bg-paper px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-sm"
        >
          <Link
            href="/"
            className="mb-10 flex items-center gap-2 text-sm text-slate lg:hidden"
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-seal text-[10px] font-semibold text-ink">
              CV
            </span>
            CertVault
          </Link>
          {children}
        </motion.div>
      </section>
    </main>
  );
}
