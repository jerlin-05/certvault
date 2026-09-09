"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { Search, Plus } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import UserMenu from "@/components/UserMenu";
import StatBar from "@/components/StatBar";
import CertificateCard from "@/components/CertificateCard";
import CertificateModal from "@/components/CertificateModal";
import CertificateViewModal from "@/components/CertificateViewModal";
import ConfirmDialog from "@/components/ConfirmDialog";
import EmptyState from "@/components/EmptyState";
import { getCertificateStatus } from "@/lib/status";

const STATUS_FILTERS = [
  { value: "all", label: "All" },
  { value: "amber", label: "Expiring soon" },
  { value: "rust", label: "Expired" },
  { value: "forest", label: "In good standing" },
  { value: "archived", label: "Archived" },
];

const gridVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.06, delayChildren: 0.05 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 18, scale: 0.98 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 260, damping: 24 },
  },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.15 } },
};

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [modalState, setModalState] = useState(null); // null | {} | certificate
  const [viewTarget, setViewTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    (async () => {
      const meRes = await fetch("/api/auth/me");
      const meData = await meRes.json();
      if (!meData.user) {
        router.push("/login");
        return;
      }
      setUser(meData.user);

      const certRes = await fetch("/api/certificates");
      const certData = await certRes.json();
      setCertificates(certData.certificates || []);
      setLoading(false);
    })();
  }, [router]);

  const filtered = useMemo(() => {
    return certificates.filter((c) => {
      const matchesSearch =
        !search ||
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.issuer?.toLowerCase().includes(search.toLowerCase());

      if (statusFilter === "archived") {
        return matchesSearch && c.archived;
      }
      if (c.archived) return false;

      const matchesStatus =
        statusFilter === "all" ||
        getCertificateStatus(c).tone === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [certificates, search, statusFilter]);

  const attentionItems = useMemo(
    () =>
      certificates
        .filter((c) => !c.archived && getCertificateStatus(c).tone !== "forest")
        .slice(0, 3),
    [certificates]
  );

  async function handleArchiveToggle(certificate) {
    const res = await fetch(`/api/certificates/${certificate._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ archived: !certificate.archived }),
    });
    const data = await res.json();
    if (data.certificate) {
      setCertificates((prev) =>
        prev.map((c) => (c._id === certificate._id ? data.certificate : c))
      );
      setViewTarget((prev) =>
        prev?._id === certificate._id ? data.certificate : prev
      );
    }
  }

  function handleSaved(certificate) {
    setCertificates((prev) => {
      const exists = prev.some((c) => c._id === certificate._id);
      return exists
        ? prev.map((c) => (c._id === certificate._id ? certificate : c))
        : [...prev, certificate];
    });
    setViewTarget((prev) =>
      prev && prev._id === certificate._id ? certificate : prev
    );
    setModalState(null);
  }

  async function handleDeleteConfirmed() {
    await fetch(`/api/certificates/${deleteTarget._id}`, {
      method: "DELETE",
    });
    setCertificates((prev) => prev.filter((c) => c._id !== deleteTarget._id));
    setViewTarget((prev) => (prev?._id === deleteTarget._id ? null : prev));
    setDeleteTarget(null);
  }

  function openEditFromView(certificate) {
    setViewTarget(null);
    setModalState(certificate);
  }

  function openDeleteFromView(certificate) {
    setDeleteTarget(certificate);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-paper lg:pl-64">
        <div className="fixed inset-y-0 left-0 hidden w-64 bg-ink lg:block" />
        <main className="container-page py-10">
          <div className="skeleton h-4 w-56 rounded-xl" />
          <div className="skeleton mt-3 h-3 w-72 rounded-xl" />
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="skeleton h-24 rounded-2xl" />
            ))}
          </div>
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="skeleton h-64 rounded-2xl" />
            ))}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper lg:pl-64">
      <Sidebar
        user={user}
        statusFilter={statusFilter}
        onFilter={(v) => setStatusFilter(v || "all")}
      />

      {/* Top bar */}
      <header className="sticky top-0 z-20 border-b border-ink/10 bg-paper/90 backdrop-blur">
        <div className="flex items-center justify-between gap-4 px-6 py-4">
          <div className="relative w-full max-w-xs">
            <Search
              size={15}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-light"
            />
            <input
              type="text"
              placeholder="Search certificates…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-ink/15 bg-paper-card py-2.5 pl-9 pr-3 text-sm text-ink outline-none transition focus:border-gold focus:ring-1 focus:ring-gold/25"
            />
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setModalState({})}
              className="flex items-center gap-1.5 rounded-xl bg-gold px-4 py-2.5 text-sm font-semibold text-ink shadow-glow transition hover:bg-gold-light active:scale-95"
            >
              <Plus size={15} strokeWidth={2.25} />
              Add certificate
            </button>
            <UserMenu user={user} />
          </div>
        </div>
      </header>

      <main className="container-page py-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <h1 className="font-display text-2xl text-ink">
            Good to see you, {user?.name?.split(" ")[0]} 👋
          </h1>
          <p className="mt-1 text-sm text-slate">
            {certificates.length === 0
              ? "Add your first certificate to get started."
              : "Here's what needs your attention today."}
          </p>
        </motion.div>

        {certificates.length > 0 && (
          <>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.06 }}
            >
              <StatBar certificates={certificates.filter((c) => !c.archived)} />
            </motion.div>

            {attentionItems.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="mt-6 rounded-2xl border border-amber/25 bg-amber-light/60 p-5"
              >
                <p className="text-sm font-medium text-amber-dark">
                  {attentionItems.length} certificate
                  {attentionItems.length === 1 ? "" : "s"} require attention
                </p>
                <div className="mt-3 space-y-2">
                  {attentionItems.map((c) => {
                    const status = getCertificateStatus(c);
                    return (
                      <button
                        key={c._id}
                        onClick={() => setViewTarget(c)}
                        className="flex w-full items-center justify-between rounded-xl bg-paper-card px-4 py-2.5 text-left text-sm shadow-panel transition hover:-translate-y-0.5"
                      >
                        <span className="text-ink">{c.name}</span>
                        <span
                          className={
                            status.tone === "rust"
                              ? "text-rust"
                              : "text-amber-dark"
                          }
                        >
                          {status.label} →
                        </span>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.14 }}
              className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <h2 className="font-display text-lg text-ink">
                {statusFilter === "archived" ? "Archived certificates" : "Your certificates"}
              </h2>
              <LayoutGroup id="status-filter">
                <div className="flex flex-wrap gap-2">
                  {STATUS_FILTERS.map((f) => {
                    const active = statusFilter === f.value;
                    return (
                      <button
                        key={f.value}
                        onClick={() => setStatusFilter(f.value)}
                        className={`relative rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors active:scale-95 ${
                          active
                            ? "text-ink"
                            : "border border-ink/15 text-slate hover:border-ink/40 hover:text-ink"
                        }`}
                      >
                        {active && (
                          <motion.span
                            layoutId="active-filter-pill"
                            className="absolute inset-0 rounded-full bg-gold"
                            transition={{
                              type: "spring",
                              stiffness: 400,
                              damping: 32,
                            }}
                          />
                        )}
                        <span className="relative z-10">{f.label}</span>
                      </button>
                    );
                  })}
                </div>
              </LayoutGroup>
            </motion.div>
          </>
        )}

        <div className="mt-6">
          {certificates.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <EmptyState onAddClick={() => setModalState({})} />
            </motion.div>
          ) : filtered.length === 0 ? (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-16 text-center text-sm text-slate"
            >
              No certificates match your search.
            </motion.p>
          ) : (
            <motion.div
              variants={gridVariants}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
            >
              <AnimatePresence mode="popLayout">
                {filtered.map((c) => (
                  <motion.div
                    key={c._id}
                    layout
                    variants={cardVariants}
                    exit="exit"
                    className="h-full"
                  >
                    <CertificateCard
                      certificate={c}
                      onView={setViewTarget}
                      onEdit={setModalState}
                      onDelete={setDeleteTarget}
                      onArchive={handleArchiveToggle}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </main>

      <AnimatePresence>
        {viewTarget && (
          <CertificateViewModal
            key="view-modal"
            certificate={viewTarget}
            onClose={() => setViewTarget(null)}
            onEdit={openEditFromView}
            onDelete={openDeleteFromView}
            onArchive={handleArchiveToggle}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {modalState !== null && (
          <CertificateModal
            key="edit-modal"
            initial={modalState._id ? modalState : null}
            onClose={() => setModalState(null)}
            onSaved={handleSaved}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {deleteTarget && (
          <ConfirmDialog
            key="delete-modal"
            title="Delete this certificate?"
            body={`"${deleteTarget.name}" will be permanently removed from your vault.`}
            onConfirm={handleDeleteConfirmed}
            onCancel={() => setDeleteTarget(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
