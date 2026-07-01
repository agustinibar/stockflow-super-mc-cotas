export function getDatabaseUrlStatus() {
  const rawUrl = process.env.DATABASE_URL;

  if (!rawUrl) {
    return {
      exists: false,
      kind: "missing",
      host: null,
      database: null,
    };
  }

  try {
    const url = new URL(rawUrl);
    const host = url.hostname;
    const database = url.pathname.replace(/^\//, "") || null;
    const lowered = rawUrl.toLowerCase();

    let kind = "external";

    if (["localhost", "127.0.0.1", "::1"].includes(host)) {
      kind = "local";
    } else if (host.includes("pooler.supabase.com") || lowered.includes("pgbouncer")) {
      kind = "supabase-pooler";
    } else if (host.includes("supabase.co")) {
      kind = "supabase-direct";
    }

    return {
      exists: true,
      kind,
      host,
      database,
    };
  } catch {
    return {
      exists: true,
      kind: "invalid-url",
      host: null,
      database: null,
    };
  }
}
