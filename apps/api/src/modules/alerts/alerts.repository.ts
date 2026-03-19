import type { Prisma } from "../../generated/prisma/client.js";
import { prisma } from "../../lib/prisma.js";

type CustomerWithCurrentPayments = Prisma.CustomerGetPayload<{
  include: {
    payments: {
      where: {
        referenceMonth: string;
      };
    };
    region: true;
  };
}>;

export class AlertsRepository {
  async findCustomersForReferenceMonth(
    referenceMonth: string
  ): Promise<CustomerWithCurrentPayments[]> {
    return prisma.customer.findMany({
      where: {
        status: {
          not: "INACTIVE"
        }
      },
      include: {
        payments: {
          where: {
            referenceMonth
          }
        },
        region: true
      },
      orderBy: {
        fullName: "asc"
      }
    });
  }
}
