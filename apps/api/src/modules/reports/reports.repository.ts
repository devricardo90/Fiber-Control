import { prisma } from "../../lib/prisma.js";

export class ReportsRepository {
  async findPaymentsByReferenceMonth(referenceMonth: string) {
    return prisma.payment.findMany({
      where: {
        referenceMonth
      },
      include: {
        customer: {
          include: {
            region: true
          }
        }
      },
      orderBy: [
        {
          createdAt: "asc"
        }
      ]
    });
  }

  async findPaymentsByYear(year: number) {
    return prisma.payment.findMany({
      where: {
        referenceMonth: {
          startsWith: `${year}-`
        }
      },
      include: {
        customer: true
      }
    });
  }

  async findOverdueCustomers() {
    return prisma.customer.findMany({
      where: {
        status: {
          in: ["OVERDUE", "SUSPENDED"]
        }
      },
      include: {
        region: true,
        payments: {
          orderBy: {
            referenceMonth: "desc"
          }
        }
      },
      orderBy: {
        fullName: "asc"
      }
    });
  }

  async findRegionsWithPayments(referenceMonth: string) {
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

  async findCustomerDetail(customerId: string) {
    return prisma.customer.findUnique({
      where: {
        id: customerId
      },
      include: {
        region: true,
        payments: {
          orderBy: [
            {
              referenceMonth: "desc"
            },
            {
              createdAt: "desc"
            }
          ]
        }
      }
    });
  }
}
