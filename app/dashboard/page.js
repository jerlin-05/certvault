"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { Search } from "lucide-react";
import Navbar from "@/components/Navbar";
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
      const matchesStatus =
        statusFilter === "all" ||
        getCertificateStatus(c).tone === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [certificates, search, statusFilter]);

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
      <div className="min-h-screen bg-paper">
        <div className="border-b border-ink/10 bg-ink py-4">
          <div className="container-page h-8" />
        </div>
        <main className="container-page py-10">
          <div className="skeleton h-4 w-56 rounded-sm" />
          <div className="skeleton mt-3 h-3 w-72 rounded-sm" />
          <div className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-sm border border-ink/10 bg-ink/10 sm:grid-cols-4">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="skeleton h-20 bg-paper" />
            ))}
          </div>
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="skeleton h-72 rounded-sm border border-ink/10"
              />
            ))}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper">
      <Navbar user={user} onAddClick={() => setModalState({})} />

      <main className="container-page py-10">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <h1 className="font-display text-2xl text-ink">
            Good to see you, {user?.name?.split(" ")[0]}
          </h1>
          <p className="mt-1 text-sm text-slate">
            {certificates.length === 0
              ? "Add your first certificate to get started."
              : "Here's the current state of your vault."}
          </p>
        </motion.div>

        {certificates.length > 0 && (
          <>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.06 }}
            >
              <StatBar certificates={certificates} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.12 }}
              className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="relative w-full max-w-xs sm:w-64">
                <Search
                  size={15}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-light"
                />
                <input
                  type="text"
                  placeholder="Search by name or issuer…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-sm border border-ink/15 bg-paper py-2 pl-9 pr-3 text-sm text-ink outline-none transition focus:border-gold focus:ring-1 focus:ring-gold/25"
                />
              </div>
              <LayoutGroup id="status-filter">
                <div className="flex flex-wrap gap-2">
                  {STATUS_FILTERS.map((f) => {
                    const active = statusFilter === f.value;
                    return (
                      <button
                        key={f.value}
                        onClick={() => setStatusFilter(f.value)}
                        className={`relative rounded-full px-3 py-1.5 text-xs font-medium transition-colors active:scale-95 ${
                          active
                            ? "text-paper"
                            : "border border-ink/15 text-slate hover:border-ink/40 hover:text-ink"
                        }`}
                      >
                        {active && (
                          <motion.span
                            layoutId="active-filter-pill"
                            className="absolute inset-0 rounded-full bg-ink"
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
