export function daysUntil(dateString) {
  const MS_PER_DAY = 1000 * 60 * 60 * 24;
  const now = new Date();
  const target = new Date(dateString);
  const start = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  const end = Date.UTC(
    target.getFullYear(),
    target.getMonth(),
    target.getDate()
  );
  return Math.round((end - start) / MS_PER_DAY);
}

export function getCertificateStatus(cert) {
  const days = daysUntil(cert.expiryDate);

  if (days < 0) {
    return {
      tone: "rust",
      label: `Expired ${Math.abs(days)} day${Math.abs(days) === 1 ? "" : "s"} ago`,
      days,
    };
  }
  if (days <= cert.alertDaysBefore) {
    return {
      tone: "amber",
      label:
        days === 0
          ? "Expires today"
          : `Expires in ${days} day${days === 1 ? "" : "s"}`,
      days,
    };
  }
  return {
    tone: "forest",
    label: `Expires in ${days} days`,
    days,
  };
}

export function formatDate(dateString) {
  if (!dateString) return "—";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
