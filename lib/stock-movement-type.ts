export const STOCK_MOVEMENT_TYPE = {
  IN: "IN",
  OUT: "OUT",
} as const;

export type StockMovementTypeValue =
  (typeof STOCK_MOVEMENT_TYPE)[keyof typeof STOCK_MOVEMENT_TYPE];
