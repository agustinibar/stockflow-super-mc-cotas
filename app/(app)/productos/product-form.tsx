"use client";

import Link from "next/link";
import { useActionState } from "react";
import type { ProductFormState } from "./actions";

type ProductFormProps = {
  action: (
    previousState: ProductFormState,
    formData: FormData,
  ) => Promise<ProductFormState>;
  submitLabel: string;
  initialValues?: {
    id?: string;
    name?: string;
    barcode?: string | null;
    category?: string;
    description?: string | null;
  };
};

const initialState: ProductFormState = {};

export function ProductForm({ action, submitLabel, initialValues }: ProductFormProps) {
  const [state, formAction, isPending] = useActionState(action, initialState);
  const values = {
    name: state.values?.name ?? initialValues?.name ?? "",
    barcode: state.values?.barcode ?? initialValues?.barcode ?? "",
    category: state.values?.category ?? initialValues?.category ?? "",
    description: state.values?.description ?? initialValues?.description ?? "",
  };

  return (
    <form action={formAction} className="rounded-lg border border-slate-200 bg-white">
      {initialValues?.id ? <input name="id" type="hidden" value={initialValues.id} /> : null}

      <div className="border-b border-slate-200 px-5 py-4">
        <h3 className="font-semibold">Datos del producto</h3>
        <p className="mt-1 text-sm text-slate-500">
          Estos datos se usan para identificar mercaderia en stock y movimientos.
        </p>
      </div>

      <div className="grid gap-5 p-5 md:grid-cols-2">
        <Field label="Nombre" error={state.errors?.name}>
          <input
            className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            defaultValue={values.name}
            maxLength={120}
            name="name"
            placeholder="Ej: Alimento balanceado adulto perro 15 kg"
          />
        </Field>

        <Field label="Codigo de barras" error={state.errors?.barcode}>
          <input
            className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            defaultValue={values.barcode}
            maxLength={40}
            name="barcode"
            placeholder="Ej: 7790001000172"
          />
        </Field>

        <Field label="Categoria" error={state.errors?.category}>
          <input
            className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            defaultValue={values.category}
            maxLength={80}
            name="category"
            placeholder="Ej: Alimentos balanceados"
          />
        </Field>

        <Field className="md:col-span-2" label="Descripcion opcional" error={state.errors?.description}>
          <textarea
            className="mt-2 min-h-28 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            defaultValue={values.description}
            maxLength={300}
            name="description"
            placeholder="Detalle breve para diferenciar presentaciones o variantes."
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
          href="/productos"
        >
          Cancelar
        </Link>
        <button
          className="inline-flex justify-center rounded-md bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-slate-300"
          disabled={isPending}
          type="submit"
        >
          {isPending ? "Guardando..." : submitLabel}
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
