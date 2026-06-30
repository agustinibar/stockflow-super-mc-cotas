"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getDemoCompany } from "@/lib/demo-company";
import { prisma } from "@/lib/db";

export type ProductFormState = {
  message?: string;
  errors?: {
    name?: string;
    barcode?: string;
    category?: string;
    description?: string;
    form?: string;
  };
  values?: {
    name?: string;
    barcode?: string;
    category?: string;
    description?: string;
  };
};

function readProductForm(formData: FormData) {
  return {
    name: String(formData.get("name") ?? "").trim(),
    barcode: String(formData.get("barcode") ?? "").trim(),
    category: String(formData.get("category") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
  };
}

function validateProductForm(values: ReturnType<typeof readProductForm>) {
  const errors: ProductFormState["errors"] = {};

  if (!values.name) {
    errors.name = "Ingresa el nombre del producto.";
  }

  if (!values.barcode) {
    errors.barcode = "Ingresa el codigo de barras.";
  }

  if (!values.category) {
    errors.category = "Ingresa la categoria.";
  }

  if (values.name.length > 120) {
    errors.name = "El nombre no puede superar 120 caracteres.";
  }

  if (values.barcode.length > 40) {
    errors.barcode = "El codigo de barras no puede superar 40 caracteres.";
  }

  if (values.category.length > 80) {
    errors.category = "La categoria no puede superar 80 caracteres.";
  }

  if (values.description.length > 300) {
    errors.description = "La descripcion no puede superar 300 caracteres.";
  }

  return errors;
}

function hasErrors(errors: ProductFormState["errors"]) {
  return Boolean(errors && Object.keys(errors).length > 0);
}

function isUniqueBarcodeError(error: unknown) {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2002" &&
    Array.isArray(error.meta?.target) &&
    error.meta.target.includes("barcode")
  );
}

export async function createProduct(
  _previousState: ProductFormState,
  formData: FormData,
): Promise<ProductFormState> {
  const values = readProductForm(formData);
  const errors = validateProductForm(values);

  if (hasErrors(errors)) {
    return { errors, values };
  }

  try {
    const company = await getDemoCompany();

    await prisma.product.create({
      data: {
        companyId: company.id,
        name: values.name,
        barcode: values.barcode,
        category: values.category,
        description: values.description || null,
      },
    });
  } catch (error) {
    if (isUniqueBarcodeError(error)) {
      return {
        errors: {
          barcode: "Ya existe un producto con ese codigo de barras.",
        },
        values,
      };
    }

    return {
      errors: {
        form: "No se pudo guardar el producto. Intenta nuevamente.",
      },
      values,
    };
  }

  revalidatePath("/productos");
  redirect("/productos?created=1");
}

export async function updateProduct(
  _previousState: ProductFormState,
  formData: FormData,
): Promise<ProductFormState> {
  const id = String(formData.get("id") ?? "").trim();
  const values = readProductForm(formData);
  const errors = validateProductForm(values);

  if (!id) {
    errors.form = "No se pudo identificar el producto a editar.";
  }

  if (hasErrors(errors)) {
    return { errors, values };
  }

  try {
    const company = await getDemoCompany();

    const updated = await prisma.product.updateMany({
      where: {
        id,
        companyId: company.id,
      },
      data: {
        name: values.name,
        barcode: values.barcode,
        category: values.category,
        description: values.description || null,
      },
    });

    if (updated.count === 0) {
      return {
        errors: {
          form: "No se encontro el producto a editar.",
        },
        values,
      };
    }
  } catch (error) {
    if (isUniqueBarcodeError(error)) {
      return {
        errors: {
          barcode: "Ya existe otro producto con ese codigo de barras.",
        },
        values,
      };
    }

    return {
      errors: {
        form: "No se pudo actualizar el producto. Intenta nuevamente.",
      },
      values,
    };
  }

  revalidatePath("/productos");
  redirect("/productos?updated=1");
}
