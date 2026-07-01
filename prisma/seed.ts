import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import {
  STOCK_MOVEMENT_TYPE,
  type StockMovementTypeValue,
} from "../lib/stock-movement-type";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

const companyName = "Super Mc Cotas";

const branches = [
  {
    name: "Lavalle",
    code: "LAV",
    address: "Sucursal Lavalle",
  },
  {
    name: "Belgrano",
    code: "BEL",
    address: "Sucursal Belgrano",
  },
];

const products = [
  {
    name: "Alimento balanceado adulto perro 15 kg",
    barcode: "7790001000011",
    sku: "ALI-PER-ADU-15",
    category: "Alimentos balanceados",
    unit: "bolsa",
    description: "Bolsa de alimento balanceado para perro adulto.",
  },
  {
    name: "Alimento balanceado cachorro perro 10 kg",
    barcode: "7790001000028",
    sku: "ALI-PER-CAC-10",
    category: "Alimentos balanceados",
    unit: "bolsa",
    description: "Alimento completo para cachorros.",
  },
  {
    name: "Alimento premium gato adulto 7.5 kg",
    barcode: "7790001000035",
    sku: "ALI-GAT-ADU-75",
    category: "Alimentos balanceados",
    unit: "bolsa",
    description: "Alimento premium para gato adulto.",
  },
  {
    name: "Piedras sanitarias perfumadas 4 kg",
    barcode: "7790001000042",
    sku: "HIG-PIE-PER-4",
    category: "Higiene",
    unit: "bolsa",
    description: "Piedras sanitarias para gatos.",
  },
  {
    name: "Shampoo antipulgas perro 250 ml",
    barcode: "7790001000059",
    sku: "HIG-SHA-ANT-250",
    category: "Higiene",
    unit: "unidad",
    description: "Shampoo antipulgas para perros.",
  },
  {
    name: "Collar regulable perro mediano",
    barcode: "7790001000066",
    sku: "ACC-COL-PER-M",
    category: "Accesorios",
    unit: "unidad",
    description: "Collar regulable para perro mediano.",
  },
  {
    name: "Correa reforzada 1.5 m",
    barcode: "7790001000073",
    sku: "ACC-COR-REF-15",
    category: "Accesorios",
    unit: "unidad",
    description: "Correa reforzada para paseo.",
  },
  {
    name: "Comedero acero inoxidable chico",
    barcode: "7790001000080",
    sku: "ACC-COM-ACE-CH",
    category: "Accesorios",
    unit: "unidad",
    description: "Comedero chico de acero inoxidable.",
  },
  {
    name: "Cama acolchada mascota mediana",
    barcode: "7790001000097",
    sku: "ACC-CAM-MED",
    category: "Accesorios",
    unit: "unidad",
    description: "Cama acolchada para mascotas medianas.",
  },
  {
    name: "Antiparasitario interno perro hasta 10 kg",
    barcode: "7790001000103",
    sku: "CUI-ANT-PER-10",
    category: "Cuidado animal",
    unit: "unidad",
    description: "Tratamiento antiparasitario interno.",
  },
  {
    name: "Pipeta antipulgas gato",
    barcode: "7790001000110",
    sku: "CUI-PIP-GAT",
    category: "Cuidado animal",
    unit: "unidad",
    description: "Pipeta antipulgas para gatos.",
  },
  {
    name: "Vitaminas para aves 30 ml",
    barcode: "7790001000127",
    sku: "CUI-VIT-AVE-30",
    category: "Cuidado animal",
    unit: "unidad",
    description: "Suplemento vitaminico para aves.",
  },
  {
    name: "Semillas mixtas para aves 1 kg",
    barcode: "7790001000134",
    sku: "ALI-AVE-MIX-1",
    category: "Alimentos balanceados",
    unit: "bolsa",
    description: "Mezcla de semillas para aves.",
  },
  {
    name: "Heno para conejo 500 g",
    barcode: "7790001000141",
    sku: "ALI-CON-HEN-500",
    category: "Alimentos balanceados",
    unit: "bolsa",
    description: "Heno seleccionado para conejos.",
  },
  {
    name: "Juguete mordillo dental",
    barcode: "7790001000158",
    sku: "ACC-JUG-MOR",
    category: "Accesorios",
    unit: "unidad",
    description: "Mordillo dental para perro.",
  },
  {
    name: "Arena aglomerante premium 8 kg",
    barcode: "7790001000165",
    sku: "HIG-ARE-AGL-8",
    category: "Higiene",
    unit: "bolsa",
    description: "Arena aglomerante premium para gatos.",
  },
];

const initialStock: Record<string, Record<string, number>> = {
  Lavalle: {
    "ALI-PER-ADU-15": 34,
    "ALI-PER-CAC-10": 22,
    "ALI-GAT-ADU-75": 18,
    "HIG-PIE-PER-4": 45,
    "HIG-SHA-ANT-250": 16,
    "ACC-COL-PER-M": 28,
    "ACC-COR-REF-15": 21,
    "ACC-COM-ACE-CH": 19,
    "ACC-CAM-MED": 8,
    "CUI-ANT-PER-10": 24,
    "CUI-PIP-GAT": 30,
    "CUI-VIT-AVE-30": 13,
    "ALI-AVE-MIX-1": 27,
    "ALI-CON-HEN-500": 14,
    "ACC-JUG-MOR": 17,
    "HIG-ARE-AGL-8": 26,
  },
  Belgrano: {
    "ALI-PER-ADU-15": 18,
    "ALI-PER-CAC-10": 15,
    "ALI-GAT-ADU-75": 24,
    "HIG-PIE-PER-4": 31,
    "HIG-SHA-ANT-250": 11,
    "ACC-COL-PER-M": 14,
    "ACC-COR-REF-15": 12,
    "ACC-COM-ACE-CH": 10,
    "ACC-CAM-MED": 5,
    "CUI-ANT-PER-10": 20,
    "CUI-PIP-GAT": 18,
    "CUI-VIT-AVE-30": 9,
    "ALI-AVE-MIX-1": 34,
    "ALI-CON-HEN-500": 20,
    "ACC-JUG-MOR": 13,
    "HIG-ARE-AGL-8": 15,
  },
};

const followUpMovements = [
  {
    branch: "Lavalle",
    sku: "ALI-PER-ADU-15",
    type: STOCK_MOVEMENT_TYPE.OUT,
    quantity: 3,
    reason: "Salida por venta mostrador",
    notes: "Venta registrada manualmente para demo.",
  },
  {
    branch: "Belgrano",
    sku: "ALI-GAT-ADU-75",
    type: STOCK_MOVEMENT_TYPE.IN,
    quantity: 6,
    reason: "Ingreso de mercaderia",
    notes: "Reposicion semanal.",
  },
  {
    branch: "Lavalle",
    sku: "HIG-PIE-PER-4",
    type: STOCK_MOVEMENT_TYPE.OUT,
    quantity: 5,
    reason: "Salida por venta mostrador",
    notes: "Movimiento de ejemplo.",
  },
  {
    branch: "Belgrano",
    sku: "CUI-PIP-GAT",
    type: STOCK_MOVEMENT_TYPE.OUT,
    quantity: 4,
    reason: "Salida por venta mostrador",
    notes: "Venta registrada manualmente para demo.",
  },
  {
    branch: "Lavalle",
    sku: "ACC-COR-REF-15",
    type: STOCK_MOVEMENT_TYPE.IN,
    quantity: 8,
    reason: "Ingreso de mercaderia",
    notes: "Reposicion de accesorios.",
  },
  {
    branch: "Belgrano",
    sku: "ALI-AVE-MIX-1",
    type: STOCK_MOVEMENT_TYPE.OUT,
    quantity: 7,
    reason: "Salida por venta mostrador",
    notes: "Movimiento de ejemplo.",
  },
];

async function registerMovement(input: {
  companyId: string;
  branchId: string;
  productId: string;
  type: StockMovementTypeValue;
  quantity: number;
  reason: string;
  notes?: string;
}) {
  await prisma.$transaction(async (tx) => {
    const balance = await tx.stockBalance.upsert({
      where: {
        companyId_branchId_productId: {
          companyId: input.companyId,
          branchId: input.branchId,
          productId: input.productId,
        },
      },
      create: {
        companyId: input.companyId,
        branchId: input.branchId,
        productId: input.productId,
        quantity: 0,
      },
      update: {},
    });

    const nextQuantity =
      input.type === STOCK_MOVEMENT_TYPE.IN
        ? balance.quantity.plus(input.quantity)
        : balance.quantity.minus(input.quantity);

    if (nextQuantity.isNegative()) {
      throw new Error("El seed intento generar stock negativo.");
    }

    await tx.stockMovement.create({
      data: {
        companyId: input.companyId,
        branchId: input.branchId,
        productId: input.productId,
        type: input.type,
        quantity: input.quantity,
        reason: input.reason,
        notes: input.notes,
      },
    });

    await tx.stockBalance.update({
      where: {
        companyId_branchId_productId: {
          companyId: input.companyId,
          branchId: input.branchId,
          productId: input.productId,
        },
      },
      data: {
        quantity: nextQuantity,
      },
    });
  });
}

async function main() {
  await prisma.company.deleteMany({
    where: {
      name: companyName,
    },
  });

  const company = await prisma.company.create({
    data: {
      name: companyName,
    },
  });

  const createdBranches = await Promise.all(
    branches.map((branch) =>
      prisma.branch.create({
        data: {
          ...branch,
          companyId: company.id,
        },
      }),
    ),
  );

  const createdProducts = await Promise.all(
    products.map((product) =>
      prisma.product.create({
        data: {
          ...product,
          companyId: company.id,
        },
      }),
    ),
  );

  const branchByName = new Map(createdBranches.map((branch) => [branch.name, branch]));
  const productBySku = new Map(createdProducts.map((product) => [product.sku, product]));

  for (const [branchName, stockBySku] of Object.entries(initialStock)) {
    const branch = branchByName.get(branchName);

    if (!branch) {
      throw new Error(`Sucursal inexistente en seed: ${branchName}`);
    }

    for (const [sku, quantity] of Object.entries(stockBySku)) {
      const product = productBySku.get(sku);

      if (!product) {
        throw new Error(`Producto inexistente en seed: ${sku}`);
      }

      await registerMovement({
        companyId: company.id,
        branchId: branch.id,
        productId: product.id,
        type: STOCK_MOVEMENT_TYPE.IN,
        quantity,
        reason: "Stock inicial",
        notes: `Carga inicial para sucursal ${branch.name}.`,
      });
    }
  }

  for (const movement of followUpMovements) {
    const branch = branchByName.get(movement.branch);
    const product = productBySku.get(movement.sku);

    if (!branch || !product) {
      throw new Error(`Movimiento invalido en seed: ${movement.branch} ${movement.sku}`);
    }

    await registerMovement({
      companyId: company.id,
      branchId: branch.id,
      productId: product.id,
      type: movement.type,
      quantity: movement.quantity,
      reason: movement.reason,
      notes: movement.notes,
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
