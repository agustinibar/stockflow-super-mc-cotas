import Link from "next/link";
import { AppErrorState } from "../app-error-state";
import { getDemoCompanyStatus } from "@/lib/demo-company";
import { prisma } from "@/lib/db";
import { formatDateTime, formatQuantity, movementTypeLabel } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function MovementsPage({
  searchParams,
}: {
  searchParams: Promise<{ entry?: string; exit?: string }>;
}) {
  const params = await searchParams;
  const companyStatus = await getDemoCompanyStatus();

  if (!companyStatus.ok) {
    return (
      <AppErrorState
        detail={companyStatus.detail}
        message={companyStatus.message}
        title={companyStatus.title}
      />
    );
  }

  const company = companyStatus.company;
  const movements = await prisma.stockMovement.findMany({
    where: { companyId: company.id },
    include: { branch: true, product: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-emerald-700">Historial operativo</p>
          <h2 className="mt-1 text-3xl font-semibold tracking-tight">Movimientos</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
            Historial de todo lo que entro y salio de cada sucursal.
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Link
            className="inline-flex justify-center rounded-md bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800"
            href="/movimientos/nueva-entrada"
          >
            Registrar ingreso
          </Link>
          <Link
            className="inline-flex justify-center rounded-md bg-rose-700 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-800"
            href="/movimientos/nueva-salida"
          >
            Registrar salida
          </Link>
        </div>
      </section>

      {params.entry ? (
        <div className="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
          Ingreso registrado correctamente. El stock subio en la sucursal seleccionada.
        </div>
      ) : null}

      {params.exit ? (
        <div className="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
          Salida registrada correctamente. El stock bajo en la sucursal seleccionada.
        </div>
      ) : null}

      <section className="rounded-lg border border-slate-200 bg-white">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50 text-left text-xs font-semibold uppercase text-slate-500">
              <tr>
                <th className="px-5 py-3">Fecha</th>
                <th className="px-5 py-3">Tipo</th>
                <th className="px-5 py-3">Producto</th>
                <th className="px-5 py-3">Sucursal</th>
                <th className="px-5 py-3">Motivo</th>
                <th className="px-5 py-3 text-right">Cantidad</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {movements.length > 0 ? movements.map((movement) => (
                <tr key={movement.id}>
                  <td className="whitespace-nowrap px-5 py-4 text-slate-600">
                    {formatDateTime(movement.createdAt)}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={
                        movement.type === "IN"
                          ? "rounded-full bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700"
                          : "rounded-full bg-rose-50 px-2 py-1 text-xs font-semibold text-rose-700"
                      }
                    >
                      {movementTypeLabel(movement.type)}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <p className="font-medium">{movement.product.name}</p>
                    <p className="mt-1 text-xs text-slate-500">{movement.product.sku}</p>
                  </td>
                  <td className="px-5 py-4 text-slate-600">{movement.branch.name}</td>
                  <td className="px-5 py-4 text-slate-600">
                    <p>{movement.reason}</p>
                    {movement.notes ? (
                      <p className="mt-1 text-xs text-slate-400">{movement.notes}</p>
                    ) : null}
                  </td>
                  <td className="px-5 py-4 text-right font-semibold">
                    {movement.type === "IN" ? "+" : "-"}
                    {formatQuantity(movement.quantity)}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td className="px-5 py-10 text-center text-slate-500" colSpan={6}>
                    Todavia no hay movimientos. Registra un ingreso o una salida para ver el historial.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
