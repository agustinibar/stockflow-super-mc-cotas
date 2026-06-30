import Link from "next/link";
import { getDemoCompany } from "@/lib/demo-company";
import { prisma } from "@/lib/db";
import { formatQuantity } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function BranchesPage() {
  const company = await getDemoCompany();
  const branches = await prisma.branch.findMany({
    where: { companyId: company.id },
    include: {
      stockBalances: true,
      _count: {
        select: {
          stockMovements: true,
        },
      },
    },
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-6">
      <section>
        <p className="text-sm font-medium text-emerald-700">Puntos de stock</p>
        <h2 className="mt-1 text-3xl font-semibold tracking-tight">Sucursales</h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
          Cada sucursal muestra su stock total y la cantidad de movimientos registrados.
        </p>
      </section>

      <section className="grid gap-5 md:grid-cols-2">
        {branches.length > 0 ? branches.map((branch) => {
          const totalStock = branch.stockBalances.reduce(
            (sum, item) => sum + Number(item.quantity),
            0,
          );

          return (
            <div className="rounded-lg border border-slate-200 bg-white p-5" key={branch.id}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-emerald-700">{branch.code}</p>
                  <h3 className="mt-1 text-2xl font-semibold">{branch.name}</h3>
                  <p className="mt-2 text-sm text-slate-500">{branch.address}</p>
                </div>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                  Activa
                </span>
              </div>

              <dl className="mt-6 grid grid-cols-2 gap-4">
                <div className="rounded-md bg-slate-50 p-4">
                  <dt className="text-xs font-medium uppercase text-slate-500">Stock total</dt>
                  <dd className="mt-2 text-2xl font-semibold">{formatQuantity(totalStock)}</dd>
                </div>
                <div className="rounded-md bg-slate-50 p-4">
                  <dt className="text-xs font-medium uppercase text-slate-500">Movimientos</dt>
                  <dd className="mt-2 text-2xl font-semibold">{branch._count.stockMovements}</dd>
                </div>
              </dl>

              <Link
                className="mt-5 inline-flex rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                href="/stock"
              >
                Ver stock de sucursal
              </Link>
            </div>
          );
        }) : (
          <div className="rounded-lg border border-slate-200 bg-white p-8 text-center text-slate-500 md:col-span-2">
            Todavia no hay sucursales cargadas.
          </div>
        )}
      </section>
    </div>
  );
}
