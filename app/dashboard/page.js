"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import Navbar from "@/components/Navbar";
import StatBar from "@/components/StatBar";
import CertificateCard from "@/components/CertificateCard";
import CertificateModal from "@/components/CertificateModal";
import ConfirmDialog from "@/components/ConfirmDialog";
import EmptyState from "@/components/EmptyState";
import { getCertificateStatus } from "@/lib/status";

const STATUS_FILTERS = [
  { value: "all", label: "All" },
  { value: "amber", label: "Expiring soon" },
  { value: "rust", label: "Expired" },
  { value: "forest", label: "In good standing" },
];

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [modalState, setModalState] = useState(null); // null | {} | certificate
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
    setModalState(null);
  }

  async function handleDeleteConfirmed() {
    await fetch(`/api/certificates/${deleteTarget._id}`, {
      method: "DELETE",
    });
    setCertificates((prev) => prev.filter((c) => c._id !== deleteTarget._id));
    setDeleteTarget(null);
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-paper">
        <p className="text-sm text-slate">Loading your vault…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper">
      <Navbar user={user} onAddClick={() => setModalState({})} />

      <main className="container-page py-10">
        <div className="mb-8">
          <h1 className="font-display text-2xl text-ink">
            Good to see you, {user?.name?.split(" ")[0]}
          </h1>
          <p className="mt-1 text-sm text-slate">
            {certificates.length === 0
              ? "Add your first certificate to get started."
              : "Here's the current state of your vault."}
          </p>
        </div>

        {certificates.length > 0 && (
          <>
            <StatBar certificates={certificates} />

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
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
              <div className="flex flex-wrap gap-2">
                {STATUS_FILTERS.map((f) => (
                  <button
                    key={f.value}
                    onClick={() => setStatusFilter(f.value)}
                    className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                      statusFilter === f.value
                        ? "border-ink bg-ink text-paper"
                        : "border-ink/15 text-slate hover:border-ink/40"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        <div className="mt-6">
          {certificates.length === 0 ? (
            <EmptyState onAddClick={() => setModalState({})} />
          ) : filtered.length === 0 ? (
            <p className="py-16 text-center text-sm text-slate">
              No certificates match your search.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((c) => (
                <CertificateCard
                  key={c._id}
                  certificate={c}
                  onEdit={setModalState}
                  onDelete={setDeleteTarget}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {modalState !== null && (
        <CertificateModal
          initial={modalState._id ? modalState : null}
          onClose={() => setModalState(null)}
          onSaved={handleSaved}
        />
      )}

      {deleteTarget && (
        <ConfirmDialog
          title="Delete this certificate?"
          body={`"${deleteTarget.name}" will be permanently removed from your vault.`}
          onConfirm={handleDeleteConfirmed}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
