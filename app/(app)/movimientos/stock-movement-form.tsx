"use client";

import Link from "next/link";
import { useActionState, useMemo, useState } from "react";

export type StockMovementFormState = {
  errors?: {
    productId?: string;
    branchId?: string;
    quantity?: string;
    notes?: string;
    form?: string;
  };
  values?: {
    productId?: string;
    branchId?: string;
    quantity?: string;
    notes?: string;
  };
};

type ProductOption = {
  id: string;
  name: string;
  barcode: string | null;
  sku: string | null;
  category: string;
};

type BranchOption = {
  id: string;
  name: string;
};

type StockMovementFormProps = {
  action: (
    previousState: StockMovementFormState,
    formData: FormData,
  ) => Promise<StockMovementFormState>;
  branches: BranchOption[];
  description: string;
  products: ProductOption[];
  submitLabel: string;
  tone: "entry" | "exit";
};

const initialState: StockMovementFormState = {};

export function StockMovementForm({
  action,
  branches,
  description,
  products,
  submitLabel,
  tone,
}: StockMovementFormProps) {
  const [state, formAction, isPending] = useActionState(action, initialState);
  const [query, setQuery] = useState("");

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return products;
    }

    return products.filter((product) => {
      const searchable = [product.name, product.barcode, product.sku, product.category]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchable.includes(normalizedQuery);
    });
  }, [products, query]);

  const buttonClass =
    tone === "entry"
      ? "bg-emerald-700 hover:bg-emerald-800"
      : "bg-rose-700 hover:bg-rose-800";

  return (
    <form action={formAction} className="rounded-lg border border-slate-200 bg-white">
      <div className="border-b border-slate-200 px-5 py-4">
        <h3 className="font-semibold">Datos del movimiento</h3>
        <p className="mt-1 text-sm text-slate-500">{description}</p>
      </div>

      <div className="grid gap-5 p-5 md:grid-cols-2">
        <Field className="md:col-span-2" label="Buscar producto" error={state.errors?.productId}>
          <input
            className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar por nombre, codigo de barras, SKU o categoria"
            type="search"
            value={query}
          />
          <select
            className="mt-3 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            defaultValue={state.values?.productId ?? ""}
            name="productId"
          >
            <option value="">Seleccionar producto</option>
            {filteredProducts.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name} - {product.barcode ?? product.sku ?? "sin codigo"}
              </option>
            ))}
          </select>
          <p className="mt-2 text-xs text-slate-500">
            {filteredProducts.length} productos disponibles para seleccionar.
          </p>
        </Field>

        <Field label="Sucursal" error={state.errors?.branchId}>
          <select
            className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            defaultValue={state.values?.branchId ?? ""}
            name="branchId"
          >
            <option value="">Seleccionar sucursal</option>
            {branches.map((branch) => (
              <option key={branch.id} value={branch.id}>
                {branch.name}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Cantidad" error={state.errors?.quantity}>
          <input
            className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            defaultValue={state.values?.quantity ?? ""}
            inputMode="decimal"
            min="0.001"
            name="quantity"
            placeholder={tone === "entry" ? "Ej: 12" : "Ej: 2"}
            step="0.001"
            type="number"
          />
        </Field>

        <Field className="md:col-span-2" label="Observacion opcional" error={state.errors?.notes}>
          <textarea
            className="mt-2 min-h-28 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            defaultValue={state.values?.notes ?? ""}
            maxLength={300}
            name="notes"
            placeholder={
              tone === "entry"
                ? "Ej: Reposicion recibida en mostrador."
                : "Ej: Salida por venta en mostrador."
            }
          />
        </Field>
      </div>

      {state.errors?.form ? (
        <div className="mx-5 mb-5 rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {state.errors.form}
        </div>
      ) : null}

      <div className="flex flex-col-reverse gap-3 border-t border-slate-200 px-5 py-4 sm:flex-row sm:justify-end">
        <Link
          className="inline-flex justify-center rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          href="/movimientos"
        >
          Cancelar
        </Link>
        <button
          className={`inline-flex justify-center rounded-md px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-300 ${buttonClass}`}
          disabled={isPending}
          type="submit"
        >
          {isPending ? "Registrando..." : submitLabel}
        </button>
      </div>
    </form>
  );
}

function Field({
  children,
  className,
  error,
  label,
}: {
  children: React.ReactNode;
  className?: string;
  error?: string;
  label: string;
}) {
  return (
    <label className={className}>
      <span className="text-sm font-medium text-slate-700">{label}</span>
      {children}
      {error ? <span className="mt-2 block text-sm text-rose-700">{error}</span> : null}
    </label>
  );
}
