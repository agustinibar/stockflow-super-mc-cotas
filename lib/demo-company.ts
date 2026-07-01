import { prisma } from "@/lib/db";

export const DEMO_COMPANY_NAME = "Super Mc Cotas";

export class DemoCompanyError extends Error {
  constructor(
    public readonly code: "DATABASE_ERROR" | "NOT_FOUND",
    message: string,
    public readonly detail?: string,
  ) {
    super(message);
    this.name = "DemoCompanyError";
  }
}

export async function getDemoCompany() {
  try {
    const company = await prisma.company.findFirst({
      where: {
        name: DEMO_COMPANY_NAME,
      },
    });

    if (!company) {
      throw new DemoCompanyError(
        "NOT_FOUND",
        `No existe la empresa demo "${DEMO_COMPANY_NAME}".`,
        "Ejecuta el seed o crea la empresa Super Mc Cotas en la base configurada.",
      );
    }

    return company;
  } catch (error) {
    if (error instanceof DemoCompanyError) {
      throw error;
    }

    throw new DemoCompanyError(
      "DATABASE_ERROR",
      "No se pudo conectar a la base de datos.",
      error instanceof Error ? error.message : "Error desconocido de Prisma.",
    );
  }
}

export async function getDemoCompanyStatus() {
  try {
    const company = await getDemoCompany();

    return {
      ok: true as const,
      company,
    };
  } catch (error) {
    if (error instanceof DemoCompanyError) {
      return {
        ok: false as const,
        title:
          error.code === "NOT_FOUND"
            ? "Falta cargar la empresa demo"
            : "No se pudo conectar con la base",
        message: error.message,
        detail: error.detail,
      };
    }

    return {
      ok: false as const,
      title: "Error inesperado",
      message: "No se pudo cargar la empresa demo.",
      detail: error instanceof Error ? error.message : undefined,
    };
  }
}
