import Link from "next/link";
import { StockMovementType } from "@prisma/client";
import { getDemoCompany } from "@/lib/demo-company";
import { prisma } from "@/lib/db";
import { formatDateTime, formatQuantity, movementTypeLabel } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const company = await getDemoCompany();

  const [
    branchCount,
    productCount,
    stockSummary,
    stockBalances,
    recentMovements,
    movementCount,
  ] = await Promise.all([
    prisma.branch.count({ where: { companyId: company.id, isActive: true } }),
    prisma.product.count({ where: { companyId: company.id, isActive: true } }),
    prisma.stockBalance.aggregate({
      where: { companyId: company.id },
      _sum: { quantity: true },
    }),
    prisma.stockBalance.findMany({
      where: { companyId: company.id },
      include: { branch: true, product: true },
    }),
    prisma.stockMovement.findMany({
      where: { companyId: company.id },
      include: { branch: true, product: true },
      orderBy: { createdAt: "desc" },
      take: 6,
    }),
    prisma.stockMovement.count({ where: { companyId: company.id } }),
  ]);

  const lowStockItems = stockBalances
    .filter((item) => Number(item.quantity) > 0 && Number(item.quantity) <= 12)
    .sort((a, b) => Number(a.quantity) - Number(b.quantity))
    .slice(0, 5);

  const outMovements = recentMovements.filter(
    (movement) => movement.type === StockMovementType.OUT,
  ).length;

  return (
    <div className="space-y-8">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-emerald-700">
            Demo funcional - StockFlow para Super Mc Cotas
          </p>
          <h2 className="mt-1 text-3xl font-semibold tracking-tight">Control de stock diario</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
            Un lugar simple para ver que mercaderia hay, que entro y que salio en cada sucursal.
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Link className="rounded-md bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800" href="/movimientos/nueva-entrada">
            Registrar ingreso
          </Link>
          <Link className="rounded-md bg-rose-700 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-800" href="/movimientos/nueva-salida">
            Registrar salida
          </Link>
          <Link className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50" href="/stock">
            Ver stock
          </Link>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <p className="text-sm font-medium text-slate-500">Productos activos</p>
          <p className="mt-3 text-3xl font-semibold">{productCount}</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <p className="text-sm font-medium text-slate-500">Sucursales</p>
          <p className="mt-3 text-3xl font-semibold">{branchCount}</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <p className="text-sm font-medium text-slate-500">Stock total consolidado</p>
          <p className="mt-3 text-3xl font-semibold">
            {formatQuantity(stockSummary._sum.quantity)}
          </p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <p className="text-sm font-medium text-slate-500">Entradas y salidas registradas</p>
          <p className="mt-3 text-3xl font-semibold">{movementCount}</p>
          <p className="mt-1 text-xs text-slate-500">{outMovements} salidas en los ultimos movimientos</p>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-lg border border-slate-200 bg-white">
          <div className="border-b border-slate-200 px-5 py-4">
            <h3 className="font-semibold">Ultimos movimientos</h3>
            <p className="mt-1 text-sm text-slate-500">Cada fila explica por que cambio el stock.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50 text-left text-xs font-semibold uppercase text-slate-500">
                <tr>
                  <th className="px-5 py-3">Fecha</th>
                  <th className="px-5 py-3">Tipo</th>
                  <th className="px-5 py-3">Producto</th>
                  <th className="px-5 py-3">Sucursal</th>
                  <th className="px-5 py-3 text-right">Cantidad</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentMovements.length > 0 ? recentMovements.map((movement) => (
                  <tr key={movement.id}>
                    <td className="whitespace-nowrap px-5 py-3 text-slate-600">
                      {formatDateTime(movement.createdAt)}
                    </td>
                    <td className="px-5 py-3">
                      <span className={movement.type === "IN" ? "text-emerald-700" : "text-rose-700"}>
                        {movementTypeLabel(movement.type)}
                      </span>
                    </td>
                    <td className="px-5 py-3 font-medium">{movement.product.name}</td>
                    <td className="px-5 py-3 text-slate-600">{movement.branch.name}</td>
                    <td className="px-5 py-3 text-right font-medium">
                      {formatQuantity(movement.quantity)}
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td className="px-5 py-8 text-center text-slate-500" colSpan={5}>
                      Todavia no hay movimientos. Registra un ingreso para iniciar el historial.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white">
          <div className="border-b border-slate-200 px-5 py-4">
            <h3 className="font-semibold">Stock bajo</h3>
            <p className="mt-1 text-sm text-slate-500">Productos con poca cantidad por sucursal.</p>
          </div>
          <div className="divide-y divide-slate-100">
            {lowStockItems.length > 0 ? lowStockItems.map((item) => (
              <div className="px-5 py-4" key={item.id}>
                <p className="font-medium">{item.product.name}</p>
                <p className="mt-1 text-sm text-slate-500">{item.branch.name}</p>
                <p className="mt-2 text-sm font-semibold text-amber-700">
                  {formatQuantity(item.quantity)} {item.product.unit}
                </p>
              </div>
            )) : (
              <div className="px-5 py-8 text-sm text-slate-500">
                No hay productos con stock bajo en este momento.
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
