import { prisma } from "@/lib/db";

export const DEMO_COMPANY_NAME = "Super Mc Cotas";

export async function getDemoCompany() {
  return prisma.company.findFirstOrThrow({
    where: {
      name: DEMO_COMPANY_NAME,
    },
  });
}
