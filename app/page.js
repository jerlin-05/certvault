import Link from "next/link";
import { FolderLock, BellRing, MailCheck } from "lucide-react";

const features = [
  {
    icon: FolderLock,
    title: "Every credential, one shelf",
    body: "Upload a photo or scan of each certificate alongside its name, issuer and dates. Search and filter the whole collection in seconds.",
  },
  {
    icon: BellRing,
    title: "You choose the warning window",
    body: "Set how many days before expiry each certificate should raise a flag — 90 days for a passport, 7 for a food-hygiene badge.",
  },
  {
    icon: MailCheck,
    title: "Alerts land in your inbox",
    body: "A daily check runs quietly in the background and emails you the moment a certificate enters its warning window, and again if it lapses.",
  },
];

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-paper">
      <header className="border-b border-ink/10">
        <div className="container-page flex items-center justify-between py-5">
          <div className="flex items-center gap-2">
            <SealMark />
            <span className="font-display text-lg tracking-tight text-ink">
              CertVault
            </span>
          </div>
          <nav className="flex items-center gap-6 text-sm">
            <Link
              href="/login"
              className="text-ink/70 transition hover:text-ink"
            >
              Sign in
            </Link>
            <Link
              href="/register"
              className="rounded-sm bg-ink px-4 py-2 text-paper transition hover:bg-ink-light"
            >
              Create account
            </Link>
          </nav>
        </div>
      </header>

      <section className="container-page grid gap-16 py-20 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-28">
        <div>
          <p className="mb-5 font-sans text-sm text-gold-dark">
            Certificate &amp; license tracking
          </p>
          <h1 className="font-display text-[2.6rem] leading-[1.08] text-ink sm:text-5xl">
            Every certificate, tracked to the day it matters.
          </h1>
          <p className="mt-6 max-w-md text-[17px] leading-relaxed text-slate">
            Diplomas, licenses, insurance policies, domain certs, safety
            training — keep them in one vault and know exactly when each one
            needs renewing, without checking a spreadsheet.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Link
              href="/register"
              className="rounded-sm bg-ink px-6 py-3 text-sm font-medium text-paper transition hover:bg-ink-light"
            >
              Start your vault
            </Link>
            <Link
              href="/login"
              className="rounded-sm border border-ink/15 px-6 py-3 text-sm font-medium text-ink transition hover:border-ink/40"
            >
              I already have an account
            </Link>
          </div>
          <p className="mt-6 text-xs text-slate-light">
            No credit card. Set an alert window once and forget about it.
          </p>
        </div>

        <HeroStack />
      </section>

      <section className="border-y border-ink/10 bg-ink-light/[0.02]">
        <div className="container-page grid gap-12 py-20 sm:grid-cols-3">
          {features.map((f) => (
            <div key={f.title}>
              <span className="mb-4 flex h-10 w-10 items-center justify-center rounded-full border border-gold/30 bg-gold/10 text-gold-dark">
                <f.icon size={17} strokeWidth={1.75} />
              </span>
              <h3 className="font-display text-lg text-ink">{f.title}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-slate">
                {f.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      <footer className="container-page flex flex-col items-center justify-between gap-4 py-10 text-xs text-slate-light sm:flex-row">
        <span>© {new Date().getFullYear()} CertVault</span>
        <span>Built for people who'd rather not find out at the border.</span>
      </footer>
    </main>
  );
}

function SealMark() {
  return (
    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-seal text-[11px] font-semibold text-ink">
      CV
    </span>
  );
}

function HeroStack() {
  return (
    <div className="relative mx-auto h-[360px] w-full max-w-sm">
      <MockCard
        className="absolute left-4 top-10 -rotate-6"
        title="AWS Solutions Architect"
        issuer="Amazon Web Services"
        date="Expires 14 Mar 2027"
        tone="forest"
      />
      <MockCard
        className="absolute right-2 top-0 rotate-3"
        title="Food Hygiene Level 2"
        issuer="City Council"
        date="Expires 2 Oct 2026"
        tone="amber"
      />
      <MockCard
        className="absolute bottom-2 left-10 -rotate-2"
        title="Fire Safety Certificate"
        issuer="National Safety Board"
        date="Expired 19 Jun 2026"
        tone="rust"
      />
    </div>
  );
}

function MockCard({ className, title, issuer, date, tone }) {
  const toneMap = {
    forest: "bg-forest-light text-forest",
    amber: "bg-amber-light text-amber",
    rust: "bg-rust-light text-rust",
  };
  return (
    <div
      className={`w-64 rounded-sm border border-ink/10 bg-paper p-5 shadow-card ${className}`}
    >
      <div className="mb-3 flex items-center justify-between">
        <span className="h-2 w-2 rounded-full bg-gold" />
        <span
          className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${toneMap[tone]}`}
        >
          {date}
        </span>
      </div>
      <p className="font-display text-[15px] leading-snug text-ink">
        {title}
      </p>
      <p className="mt-1 text-xs text-slate">{issuer}</p>
    </div>
  );
}
