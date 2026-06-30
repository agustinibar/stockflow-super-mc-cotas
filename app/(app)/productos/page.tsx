import Link from "next/link";
import { getDemoCompany } from "@/lib/demo-company";
import { prisma } from "@/lib/db";
import { formatQuantity } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ created?: string; updated?: string }>;
}) {
  const params = await searchParams;
  const company = await getDemoCompany();
  const products = await prisma.product.findMany({
    where: { companyId: company.id },
    include: { stockBalances: true },
    orderBy: [{ category: "asc" }, { name: "asc" }],
  });

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-emerald-700">Maestro de productos</p>
          <h2 className="mt-1 text-3xl font-semibold tracking-tight">Productos</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
            Carga y consulta los productos que despues se usan en ingresos, salidas y stock.
          </p>
        </div>
        <Link
          className="inline-flex justify-center rounded-md bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800"
          href="/productos/nuevo"
        >
          Nuevo producto
        </Link>
      </section>

      {params.created ? (
        <div className="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
          Producto creado correctamente. Ya puede usarse en ingresos y salidas.
        </div>
      ) : null}

      {params.updated ? (
        <div className="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
          Producto actualizado correctamente.
        </div>
      ) : null}

      <section className="rounded-lg border border-slate-200 bg-white">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50 text-left text-xs font-semibold uppercase text-slate-500">
              <tr>
                <th className="px-5 py-3">Producto</th>
                <th className="px-5 py-3">Categoria</th>
                <th className="px-5 py-3">Codigo de barras</th>
                <th className="px-5 py-3">SKU</th>
                <th className="px-5 py-3">Unidad</th>
                <th className="px-5 py-3 text-right">Stock total</th>
                <th className="px-5 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {products.length > 0 ? products.map((product) => {
                const totalStock = product.stockBalances.reduce(
                  (total, item) => total + Number(item.quantity),
                  0,
                );

                return (
                  <tr key={product.id}>
                    <td className="px-5 py-4">
                      <p className="font-medium text-slate-950">{product.name}</p>
                      <p className="mt-1 text-xs text-slate-500">{product.description}</p>
                    </td>
                    <td className="px-5 py-4 text-slate-600">{product.category}</td>
                    <td className="whitespace-nowrap px-5 py-4 text-slate-600">
                      {product.barcode}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-slate-600">{product.sku}</td>
                    <td className="px-5 py-4 text-slate-600">{product.unit}</td>
                    <td className="px-5 py-4 text-right font-semibold">
                      {formatQuantity(totalStock)}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <Link
                        className="font-semibold text-emerald-700 hover:text-emerald-900"
                        href={`/productos/${product.id}/editar`}
                      >
                        Editar
                      </Link>
                    </td>
                  </tr>
                );
              }) : (
                <tr>
                  <td className="px-5 py-10 text-center text-slate-500" colSpan={7}>
                    Todavia no hay productos cargados. Usa Nuevo producto para iniciar el catalogo.
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
