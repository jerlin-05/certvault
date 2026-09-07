/**
 * Local/self-hosted alternative to Vercel Cron.
 *
 * Runs a daily job (default 08:00 server time) that hits the
 * /api/cron/check-expiry endpoint so expiry alert emails go out.
 *
 * Usage:
 *   npm run cron          -> starts the daily schedule and keeps running
 *   npm run cron -- --now -> runs the check once immediately, then exits
 */
require("dotenv").config({ path: ".env.local" });
require("dotenv").config();
const cron = require("node-cron");

const APP_URL = process.env.APP_URL || "http://localhost:3000";
const CRON_SECRET = process.env.CRON_SECRET || "";
const SCHEDULE = process.env.CRON_SCHEDULE || "0 8 * * *"; // 08:00 daily

async function runCheck() {
  const url = `${APP_URL}/api/cron/check-expiry?secret=${encodeURIComponent(
    CRON_SECRET
  )}`;
  console.log(`[cron] Checking certificate expiry at ${new Date().toISOString()}`);
  try {
    const res = await fetch(url);
    const data = await res.json();
    console.log("[cron] Result:", data);
  } catch (err) {
    console.error("[cron] Failed to run expiry check:", err.message);
  }
}

if (process.argv.includes("--now")) {
  runCheck().then(() => process.exit(0));
} else {
  console.log(`[cron] Scheduling expiry check with pattern "${SCHEDULE}"`);
  cron.schedule(SCHEDULE, runCheck);
  runCheck(); // also run once on startup
}
