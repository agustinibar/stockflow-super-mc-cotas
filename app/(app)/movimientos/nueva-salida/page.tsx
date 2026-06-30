import { getDemoCompany } from "@/lib/demo-company";
import { prisma } from "@/lib/db";
import { StockMovementForm } from "../stock-movement-form";
import { createStockExit } from "./actions";

export const dynamic = "force-dynamic";

export default async function NewStockExitPage() {
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
        <p className="text-sm font-medium text-rose-700">Salida de mercaderia</p>
        <h2 className="mt-1 text-3xl font-semibold tracking-tight">Registrar salida</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Carga mercaderia que sale de una sucursal. El sistema valida stock disponible antes de
          registrar el movimiento.
        </p>
      </section>

      <StockMovementForm
        action={createStockExit}
        branches={branches}
        description="Selecciona producto, sucursal y cantidad. Al guardar, el stock baja automaticamente."
        products={products}
        submitLabel="Registrar salida"
        tone="exit"
      />
    </div>
  );
}
