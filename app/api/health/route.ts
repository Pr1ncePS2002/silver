import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const commit = process.env.NEXT_PUBLIC_COMMIT || process.env.VERCEL_GIT_COMMIT_SHA || process.env.GIT_COMMIT || "unknown";
  const branch = process.env.NEXT_PUBLIC_BRANCH || process.env.VERCEL_GIT_COMMIT_REF || process.env.GIT_BRANCH || "unknown";
  const version = process.env.NEXT_PUBLIC_APP_VERSION || "unknown";
  let db: { ok: boolean; error?: string } = { ok: true };

  try {
    await prisma.$queryRaw`SELECT 1`;
  } catch (err: any) {
    db = { ok: false, error: err?.message || String(err) };
  }

  return NextResponse.json({
    status: "ok",
    app: { version, commit, branch, node: process.version },
    env: {
      nodeEnv: process.env.NODE_ENV || "unknown",
      telemetryDisabled: process.env.NEXT_TELEMETRY_DISABLED === "1",
    },
    db,
    time: new Date().toISOString(),
  });
}
