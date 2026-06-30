import { createProduct } from "../actions";
import { ProductForm } from "../product-form";

export default function NewProductPage() {
  return (
    <div className="max-w-3xl space-y-6">
      <section>
        <p className="text-sm font-medium text-emerald-700">Nuevo producto</p>
        <h2 className="mt-1 text-3xl font-semibold tracking-tight">Cargar producto</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Alta manual para probar el flujo real de carga de mercaderia.
        </p>
      </section>

      <ProductForm action={createProduct} submitLabel="Guardar producto" />
    </div>
  );
}
