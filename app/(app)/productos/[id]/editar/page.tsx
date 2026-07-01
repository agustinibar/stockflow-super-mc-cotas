import { notFound } from "next/navigation";
import { AppErrorState } from "../../../app-error-state";
import { getDemoCompanyStatus } from "@/lib/demo-company";
import { prisma } from "@/lib/db";
import { updateProduct } from "../../actions";
import { ProductForm } from "../../product-form";

export const dynamic = "force-dynamic";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
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
  const product = await prisma.product.findFirst({
    where: {
      id,
      companyId: company.id,
    },
  });

  if (!product) {
    notFound();
  }

  return (
    <div className="max-w-3xl space-y-6">
      <section>
        <p className="text-sm font-medium text-emerald-700">Editar producto</p>
        <h2 className="mt-1 text-3xl font-semibold tracking-tight">{product.name}</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Actualiza los datos basicos del producto sin modificar su historial de stock.
        </p>
      </section>

      <ProductForm action={updateProduct} initialValues={product} submitLabel="Guardar cambios" />
    </div>
  );
}
