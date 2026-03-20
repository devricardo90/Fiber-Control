import type { Prisma } from "../../generated/prisma/client.js";
import { prisma } from "../../lib/prisma.js";

type RegionWithCustomersAndPayments = Prisma.RegionGetPayload<{
  include: {
    customers: {
      include: {
        payments: true;
      };
    };
  };
}>;

export class RegionsRepository {
  async findRegionsWithPerformanceData(referenceMonth: string): Promise<RegionWithCustomersAndPayments[]> {
    return prisma.region.findMany({
      include: {
        customers: {
          include: {
            payments: {
              where: {
                referenceMonth
              }
            }
          }
        }
      },
      orderBy: {
        name: "asc"
      }
    });
  }

  async findAll() {
    return prisma.region.findMany({
      orderBy: {
        name: "asc"
      }
    });
  }
}
