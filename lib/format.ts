import type { Prisma } from "@prisma/client";

export function formatQuantity(value: Prisma.Decimal | number | null | undefined) {
  if (value == null) {
    return "0";
  }

  const numericValue = Number(value);

  return new Intl.NumberFormat("es-AR", {
    maximumFractionDigits: 3,
  }).format(numericValue);
}

export function formatDateTime(value: Date) {
  return new Intl.DateTimeFormat("es-AR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(value);
}

export function movementTypeLabel(type: "IN" | "OUT") {
  return type === "IN" ? "Entrada" : "Salida";
}
