import { getDemoCompany } from "@/lib/demo-company";
import { prisma } from "@/lib/db";
import { StockMovementForm } from "../stock-movement-form";
import { createStockEntry } from "./actions";

export const dynamic = "force-dynamic";

export default async function NewStockEntryPage() {
  const company = await getDemoCompany();
  const [products, branches] = await Promise.all([
    prisma.product.findMany({
      where: {
        companyId: company.id,
        isActive: true,
      },
      orderBy: [{ category: "asc" }, { name: "asc" }],
      select: {
        id: true,
        name: true,
        barcode: true,
        sku: true,
        category: true,
      },
    }),
    prisma.branch.findMany({
      where: {
        companyId: company.id,
        isActive: true,
      },
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
      },
    }),
  ]);

  return (
    <div className="max-w-3xl space-y-6">
      <section>
        <p className="text-sm font-medium text-emerald-700">Entrada de mercaderia</p>
        <h2 className="mt-1 text-3xl font-semibold tracking-tight">Registrar ingreso</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Carga mercaderia que entra a una sucursal. El movimiento queda en historial y el stock
          se actualiza en el mismo guardado.
        </p>
      </section>

      <StockMovementForm
        action={createStockEntry}
        branches={branches}
        description="Selecciona producto, sucursal y cantidad. Al guardar, el stock sube automaticamente."
        products={products}
        submitLabel="Registrar ingreso"
        tone="entry"
      />
    </div>
  );
}
