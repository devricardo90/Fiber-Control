import type { Prisma } from "../../generated/prisma/client.js";
import { prisma } from "../../lib/prisma.js";

type PaymentRecord = Prisma.PaymentGetPayload<Record<string, never>>;

export class FinanceRepository {
  async findPayments(): Promise<PaymentRecord[]> {
    return prisma.payment.findMany();
  }
}
