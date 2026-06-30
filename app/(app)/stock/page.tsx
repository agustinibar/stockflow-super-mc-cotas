import Link from "next/link";
import { getDemoCompany } from "@/lib/demo-company";
import { prisma } from "@/lib/db";
import { formatQuantity } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function StockPage() {
  const company = await getDemoCompany();
  const branches = await prisma.branch.findMany({
    where: { companyId: company.id, isActive: true },
    include: {
      stockBalances: {
        include: { product: true },
        orderBy: { product: { name: "asc" } },
      },
    },
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-emerald-700">Stock por sucursal</p>
          <h2 className="mt-1 text-3xl font-semibold tracking-tight">Stock actual</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
            Consulta cuanto queda de cada producto en Lavalle y Belgrano.
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

      <section className="grid gap-6 xl:grid-cols-2">
        {branches.length > 0 ? branches.map((branch) => {
          const total = branch.stockBalances.reduce(
            (sum, item) => sum + Number(item.quantity),
            0,
          );

          return (
            <div className="rounded-lg border border-slate-200 bg-white" key={branch.id}>
              <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
                <div>
                  <h3 className="font-semibold">{branch.name}</h3>
                  <p className="mt-1 text-sm text-slate-500">{branch.address}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-medium uppercase text-slate-500">Total</p>
                  <p className="text-xl font-semibold">{formatQuantity(total)}</p>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200 text-sm">
                  <thead className="bg-slate-50 text-left text-xs font-semibold uppercase text-slate-500">
                    <tr>
                      <th className="px-5 py-3">Producto</th>
                      <th className="px-5 py-3">Categoria</th>
                      <th className="px-5 py-3 text-right">Cantidad</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {branch.stockBalances.length > 0 ? branch.stockBalances.map((item) => (
                      <tr key={item.id}>
                        <td className="px-5 py-3">
                          <p className="font-medium">{item.product.name}</p>
                          <p className="mt-1 text-xs text-slate-500">{item.product.sku}</p>
                        </td>
                        <td className="px-5 py-3 text-slate-600">{item.product.category}</td>
                        <td className="px-5 py-3 text-right font-semibold">
                          {formatQuantity(item.quantity)} {item.product.unit}
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td className="px-5 py-8 text-center text-slate-500" colSpan={3}>
                          Esta sucursal todavia no tiene stock cargado.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          );
        }) : (
          <div className="rounded-lg border border-slate-200 bg-white p-8 text-center text-slate-500 xl:col-span-2">
            Todavia no hay sucursales activas para consultar stock.
          </div>
        )}
      </section>
    </div>
  );
}
