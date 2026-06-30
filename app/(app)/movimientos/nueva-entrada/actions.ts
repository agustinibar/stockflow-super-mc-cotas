"use server";

import { Prisma, StockMovementType } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getDemoCompany } from "@/lib/demo-company";
import { prisma } from "@/lib/db";

export type StockEntryFormState = {
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

function readEntryForm(formData: FormData) {
  return {
    productId: String(formData.get("productId") ?? "").trim(),
    branchId: String(formData.get("branchId") ?? "").trim(),
    quantity: String(formData.get("quantity") ?? "").trim().replace(",", "."),
    notes: String(formData.get("notes") ?? "").trim(),
  };
}

function parsePositiveQuantity(value: string) {
  if (!value) {
    return null;
  }

  if (!/^\d+(\.\d{1,3})?$/.test(value)) {
    return null;
  }

  const quantity = new Prisma.Decimal(value);
  return quantity.gt(0) ? quantity : null;
}

export async function createStockEntry(
  _previousState: StockEntryFormState,
  formData: FormData,
): Promise<StockEntryFormState> {
  const values = readEntryForm(formData);
  const errors: StockEntryFormState["errors"] = {};
  const quantity = parsePositiveQuantity(values.quantity);

  if (!values.productId) {
    errors.productId = "Selecciona un producto.";
  }

  if (!values.branchId) {
    errors.branchId = "Selecciona una sucursal.";
  }

  if (!values.quantity) {
    errors.quantity = "Ingresa una cantidad.";
  } else if (!quantity) {
    errors.quantity = "La cantidad debe ser mayor a 0 y tener hasta 3 decimales.";
  }

  if (values.notes.length > 300) {
    errors.notes = "La observacion no puede superar 300 caracteres.";
  }

  if (Object.keys(errors).length > 0 || !quantity) {
    return { errors, values };
  }

  try {
    const company = await getDemoCompany();

    await prisma.$transaction(async (tx) => {
      const [product, branch] = await Promise.all([
        tx.product.findFirst({
          where: {
            id: values.productId,
            companyId: company.id,
            isActive: true,
          },
          select: { id: true },
        }),
        tx.branch.findFirst({
          where: {
            id: values.branchId,
            companyId: company.id,
            isActive: true,
          },
          select: { id: true },
        }),
      ]);

      if (!product) {
        throw new Error("PRODUCT_NOT_FOUND");
      }

      if (!branch) {
        throw new Error("BRANCH_NOT_FOUND");
      }

      await tx.stockMovement.create({
        data: {
          companyId: company.id,
          branchId: branch.id,
          productId: product.id,
          type: StockMovementType.IN,
          quantity,
          reason: "Ingreso de mercaderia",
          notes: values.notes || null,
        },
      });

      await tx.stockBalance.upsert({
        where: {
          companyId_branchId_productId: {
            companyId: company.id,
            branchId: branch.id,
            productId: product.id,
          },
        },
        create: {
          companyId: company.id,
          branchId: branch.id,
          productId: product.id,
          quantity,
        },
        update: {
          quantity: {
            increment: quantity,
          },
        },
      });
    });
  } catch (error) {
    if (error instanceof Error && error.message === "PRODUCT_NOT_FOUND") {
      return {
        errors: { productId: "El producto seleccionado no existe o esta inactivo." },
        values,
      };
    }

    if (error instanceof Error && error.message === "BRANCH_NOT_FOUND") {
      return {
        errors: { branchId: "La sucursal seleccionada no existe o esta inactiva." },
        values,
      };
    }

    return {
      errors: {
        form: "No se pudo registrar el ingreso. El stock no fue modificado.",
      },
      values,
    };
  }

  revalidatePath("/dashboard");
  revalidatePath("/stock");
  revalidatePath("/movimientos");
  redirect("/movimientos?entry=1");
}
