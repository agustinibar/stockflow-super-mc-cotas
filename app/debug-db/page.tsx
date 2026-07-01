import { getDatabaseUrlStatus } from "@/lib/database-url";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

function formatError(error: unknown) {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
    };
  }

  return {
    name: "UnknownError",
    message: "Error desconocido al consultar la base.",
  };
}

export default async function DebugDbPage() {
  const databaseUrl = getDatabaseUrlStatus();
  let result:
    | { ok: true; companyCount: number; error: null }
    | { ok: false; companyCount: null; error: { name: string; message: string } };

  try {
    const companyCount = await prisma.company.count();
    result = { ok: true, companyCount, error: null };
  } catch (error) {
    result = { ok: false, companyCount: null, error: formatError(error) };
  }

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-8 text-slate-950">
      <section className="mx-auto max-w-3xl rounded-lg border border-slate-200 bg-white p-6">
        <p className="text-sm font-medium text-emerald-700">StockFlow</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">Diagnostico de base</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Esta pantalla no muestra credenciales. Solo confirma si la app puede leer la variable de
          entorno y consultar Prisma.
        </p>

        <dl className="mt-6 divide-y divide-slate-100 text-sm">
          <DebugRow label="DATABASE_URL existe" value={databaseUrl.exists ? "Si" : "No"} />
          <DebugRow label="Tipo detectado" value={databaseUrl.kind} />
          <DebugRow label="Host" value={databaseUrl.host ?? "No disponible"} />
          <DebugRow label="Base" value={databaseUrl.database ?? "No disponible"} />
          <DebugRow label="Consulta prisma.company.count()" value={result.ok ? "OK" : "ERROR"} />
          <DebugRow
            label="Cantidad de empresas"
            value={result.companyCount == null ? "No disponible" : String(result.companyCount)}
          />
        </dl>

        {result.error ? (
          <div className="mt-6 rounded-md border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">
            <p className="font-semibold">{result.error.name}</p>
            <p className="mt-1">{result.error.message}</p>
          </div>
        ) : (
          <div className="mt-6 rounded-md border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-800">
            OK: Prisma pudo consultar la tabla Company.
          </div>
        )}
      </section>
    </main>
  );
}

function DebugRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-1 py-3 sm:grid-cols-[220px_1fr]">
      <dt className="font-medium text-slate-500">{label}</dt>
      <dd className="font-mono text-slate-900">{value}</dd>
    </div>
  );
}
