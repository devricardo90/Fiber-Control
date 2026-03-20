import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";

import { hashPassword } from "../src/lib/auth.js";
import { PrismaClient } from "../src/generated/prisma/client.js";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required to run the seed");
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: databaseUrl
  })
});

const now = new Date();
const currentReferenceMonth = formatReferenceMonth(now);
const previousReferenceMonth = formatReferenceMonth(addMonths(now, -1));
const currentYear = now.getUTCFullYear();
const currentMonth = now.getUTCMonth();

async function main() {
  const admin = await prisma.user.upsert({
    where: {
      email: "admin@fibercontrol.local"
    },
    update: {
      fullName: "Fiber Control Admin",
      passwordHash: hashPassword("Admin@123456"),
      role: "ADMIN",
      isActive: true
    },
    create: {
      fullName: "Fiber Control Admin",
      email: "admin@fibercontrol.local",
      passwordHash: hashPassword("Admin@123456"),
      role: "ADMIN",
      isActive: true
    }
  });

  await prisma.user.upsert({
    where: {
      email: "operator@fibercontrol.local"
    },
    update: {
      fullName: "Fiber Control Operator",
      passwordHash: hashPassword("Operator@123456"),
      role: "OPERATOR",
      isActive: true
    },
    create: {
      fullName: "Fiber Control Operator",
      email: "operator@fibercontrol.local",
      passwordHash: hashPassword("Operator@123456"),
      role: "OPERATOR",
      isActive: true
    }
  });

  const localAccessAdmin = await prisma.user.upsert({
    where: {
      email: "acesso@fibercontrol.local"
    },
    update: {
      fullName: "Fiber Control Local Access",
      passwordHash: hashPassword("Fiber@123456"),
      role: "ADMIN",
      isActive: true
    },
    create: {
      fullName: "Fiber Control Local Access",
      email: "acesso@fibercontrol.local",
      passwordHash: hashPassword("Fiber@123456"),
      role: "ADMIN",
      isActive: true
    }
  });

  await prisma.taxConfig.upsert({
    where: {
      singletonKey: "default"
    },
    update: {
      regimeLabel: "Simples Nacional",
      estimatedRate: "6.50",
      dueDay: 20,
      notes: "Seed padrao para ambiente local"
    },
    create: {
      singletonKey: "default",
      regimeLabel: "Simples Nacional",
      estimatedRate: "6.50",
      dueDay: 20,
      notes: "Seed padrao para ambiente local"
    }
  });

  const northRegion = await prisma.region.upsert({
    where: {
      code: "NORTH"
    },
    update: {
      name: "North Route",
      description: "Rota seed para clientes do setor norte"
    },
    create: {
      name: "North Route",
      code: "NORTH",
      description: "Rota seed para clientes do setor norte"
    }
  });

  const centerRegion = await prisma.region.upsert({
    where: {
      code: "CENTER"
    },
    update: {
      name: "Central Route",
      description: "Rota seed para clientes da area central"
    },
    create: {
      name: "Central Route",
      code: "CENTER",
      description: "Rota seed para clientes da area central"
    }
  });

  const southRegion = await prisma.region.upsert({
    where: {
      code: "SOUTH"
    },
    update: {
      name: "South Route",
      description: "Rota seed para clientes do setor sul"
    },
    create: {
      name: "South Route",
      code: "SOUTH",
      description: "Rota seed para clientes do setor sul"
    }
  });

  const activeCustomer = await prisma.customer.upsert({
    where: {
      documentId: "SEED-0001"
    },
    update: {
      fullName: "Ana Martins",
      phone: "+55 11 99999-1001",
      email: "ana.martins@example.com",
      addressLine: "Rua das Flores",
      addressNumber: "120",
      neighborhood: "Centro",
      city: "Santa Rosa",
      state: "RS",
      postalCode: "98900-000",
      notes: "Cliente seed com pagamento em dia",
      status: "ACTIVE",
      monthlyFee: "120.00",
      dueDay: 28,
      graceDays: 2,
      cutoffDays: 5,
      serviceStartDate: new Date(Date.UTC(currentYear, currentMonth - 5, 5)),
      regionId: northRegion.id
    },
    create: {
      fullName: "Ana Martins",
      documentId: "SEED-0001",
      phone: "+55 11 99999-1001",
      email: "ana.martins@example.com",
      addressLine: "Rua das Flores",
      addressNumber: "120",
      neighborhood: "Centro",
      city: "Santa Rosa",
      state: "RS",
      postalCode: "98900-000",
      notes: "Cliente seed com pagamento em dia",
      status: "ACTIVE",
      monthlyFee: "120.00",
      dueDay: 28,
      graceDays: 2,
      cutoffDays: 5,
      serviceStartDate: new Date(Date.UTC(currentYear, currentMonth - 5, 5)),
      regionId: northRegion.id
    }
  });

  const overdueCustomer = await prisma.customer.upsert({
    where: {
      documentId: "SEED-0002"
    },
    update: {
      fullName: "Bruno Alves",
      phone: "+55 11 99999-1002",
      email: "bruno.alves@example.com",
      addressLine: "Avenida do Campo",
      addressNumber: "88",
      neighborhood: "Interior",
      city: "Santa Rosa",
      state: "RS",
      postalCode: "98910-000",
      notes: "Cliente seed com pagamento parcial e status overdue",
      status: "OVERDUE",
      monthlyFee: "95.00",
      dueDay: 15,
      graceDays: 2,
      cutoffDays: 5,
      serviceStartDate: new Date(Date.UTC(currentYear, currentMonth - 8, 12)),
      regionId: centerRegion.id
    },
    create: {
      fullName: "Bruno Alves",
      documentId: "SEED-0002",
      phone: "+55 11 99999-1002",
      email: "bruno.alves@example.com",
      addressLine: "Avenida do Campo",
      addressNumber: "88",
      neighborhood: "Interior",
      city: "Santa Rosa",
      state: "RS",
      postalCode: "98910-000",
      notes: "Cliente seed com pagamento parcial e status overdue",
      status: "OVERDUE",
      monthlyFee: "95.00",
      dueDay: 15,
      graceDays: 2,
      cutoffDays: 5,
      serviceStartDate: new Date(Date.UTC(currentYear, currentMonth - 8, 12)),
      regionId: centerRegion.id
    }
  });

  const suspendedCustomer = await prisma.customer.upsert({
    where: {
      documentId: "SEED-0003"
    },
    update: {
      fullName: "Carla Souza",
      phone: "+55 11 99999-1003",
      email: "carla.souza@example.com",
      addressLine: "Estrada Velha",
      addressNumber: "410",
      neighborhood: "Zona Rural",
      city: "Santa Rosa",
      state: "RS",
      postalCode: "98920-000",
      notes: "Cliente seed sem pagamento e status suspended",
      status: "SUSPENDED",
      monthlyFee: "150.00",
      dueDay: 10,
      graceDays: 2,
      cutoffDays: 5,
      serviceStartDate: new Date(Date.UTC(currentYear, currentMonth - 10, 20)),
      regionId: southRegion.id
    },
    create: {
      fullName: "Carla Souza",
      documentId: "SEED-0003",
      phone: "+55 11 99999-1003",
      email: "carla.souza@example.com",
      addressLine: "Estrada Velha",
      addressNumber: "410",
      neighborhood: "Zona Rural",
      city: "Santa Rosa",
      state: "RS",
      postalCode: "98920-000",
      notes: "Cliente seed sem pagamento e status suspended",
      status: "SUSPENDED",
      monthlyFee: "150.00",
      dueDay: 10,
      graceDays: 2,
      cutoffDays: 5,
      serviceStartDate: new Date(Date.UTC(currentYear, currentMonth - 10, 20)),
      regionId: southRegion.id
    }
  });

  const activePayment = await prisma.payment.upsert({
    where: {
      customerId_referenceMonth: {
        customerId: activeCustomer.id,
        referenceMonth: currentReferenceMonth
      }
    },
    update: {
      expectedAmount: "120.00",
      receivedAmount: "120.00",
      status: "PAID",
      paidAt: new Date(Date.UTC(currentYear, currentMonth, 7)),
      notes: "Mensalidade seed recebida integralmente"
    },
    create: {
      customerId: activeCustomer.id,
      referenceMonth: currentReferenceMonth,
      expectedAmount: "120.00",
      receivedAmount: "120.00",
      status: "PAID",
      paidAt: new Date(Date.UTC(currentYear, currentMonth, 7)),
      notes: "Mensalidade seed recebida integralmente"
    }
  });

  const overduePayment = await prisma.payment.upsert({
    where: {
      customerId_referenceMonth: {
        customerId: overdueCustomer.id,
        referenceMonth: currentReferenceMonth
      }
    },
    update: {
      expectedAmount: "95.00",
      receivedAmount: "40.00",
      status: "PARTIAL",
      paidAt: new Date(Date.UTC(currentYear, currentMonth, 16)),
      notes: "Pagamento seed parcial"
    },
    create: {
      customerId: overdueCustomer.id,
      referenceMonth: currentReferenceMonth,
      expectedAmount: "95.00",
      receivedAmount: "40.00",
      status: "PARTIAL",
      paidAt: new Date(Date.UTC(currentYear, currentMonth, 16)),
      notes: "Pagamento seed parcial"
    }
  });

  await prisma.payment.upsert({
    where: {
      customerId_referenceMonth: {
        customerId: suspendedCustomer.id,
        referenceMonth: currentReferenceMonth
      }
    },
    update: {
      expectedAmount: "150.00",
      receivedAmount: "0.00",
      status: "PENDING",
      paidAt: null,
      notes: "Pagamento seed pendente"
    },
    create: {
      customerId: suspendedCustomer.id,
      referenceMonth: currentReferenceMonth,
      expectedAmount: "150.00",
      receivedAmount: "0.00",
      status: "PENDING",
      paidAt: null,
      notes: "Pagamento seed pendente"
    }
  });

  await prisma.payment.upsert({
    where: {
      customerId_referenceMonth: {
        customerId: activeCustomer.id,
        referenceMonth: previousReferenceMonth
      }
    },
    update: {
      expectedAmount: "120.00",
      receivedAmount: "120.00",
      status: "PAID",
      paidAt: new Date(Date.UTC(currentYear, currentMonth - 1, 6)),
      notes: "Historico seed do mes anterior"
    },
    create: {
      customerId: activeCustomer.id,
      referenceMonth: previousReferenceMonth,
      expectedAmount: "120.00",
      receivedAmount: "120.00",
      status: "PAID",
      paidAt: new Date(Date.UTC(currentYear, currentMonth - 1, 6)),
      notes: "Historico seed do mes anterior"
    }
  });

  await upsertBankEntry({
    amount: "120.00",
    occurredAt: new Date(Date.UTC(currentYear, currentMonth, 7, 13, 0, 0)),
    description: "Transferencia seed conciliada de Ana Martins",
    paymentId: activePayment.id,
    referenceCode: "SEED-BANK-0001",
    source: "bank_import",
    status: "MATCHED"
  });

  await upsertBankEntry({
    amount: "40.00",
    occurredAt: new Date(Date.UTC(currentYear, currentMonth, 16, 10, 30, 0)),
    description: "Transferencia seed conciliada parcial de Bruno Alves",
    paymentId: overduePayment.id,
    referenceCode: "SEED-BANK-0002",
    source: "bank_import",
    status: "MATCHED"
  });

  await upsertBankEntry({
    amount: "55.00",
    occurredAt: new Date(Date.UTC(currentYear, currentMonth, 18, 9, 15, 0)),
    description: "Entrada seed ainda nao conciliada",
    paymentId: null,
    referenceCode: "SEED-BANK-0003",
    source: "bank_import",
    status: "UNMATCHED"
  });

  await upsertFiscalReminder({
    title: "[Seed] DAS Simples Nacional",
    description: "Lembrete fiscal seed para pagamento recorrente",
    dueDate: new Date(Date.UTC(currentYear, currentMonth, 20)),
    reminderDate: new Date(Date.UTC(currentYear, currentMonth, 18)),
    severity: "HIGH"
  });

  await upsertFiscalReminder({
    title: "[Seed] Fechamento financeiro mensal",
    description: "Checklist seed para conferencia do caixa e conciliacao",
    dueDate: new Date(Date.UTC(currentYear, currentMonth, 25)),
    reminderDate: new Date(Date.UTC(currentYear, currentMonth, 23)),
    severity: "MEDIUM"
  });

  console.log("Seed concluido com sucesso.");
  console.log(`Admin: ${admin.email} / Admin@123456`);
  console.log(`Local access admin: ${localAccessAdmin.email} / Fiber@123456`);
  console.log("Operator: operator@fibercontrol.local / Operator@123456");
  console.log(`Reference month seeded: ${currentReferenceMonth}`);
}

async function upsertBankEntry(input: {
  amount: string;
  occurredAt: Date;
  description: string;
  paymentId: string | null;
  referenceCode: string;
  source: string;
  status: "MATCHED" | "UNMATCHED";
}) {
  const existingEntry = await prisma.bankEntry.findFirst({
    where: {
      referenceCode: input.referenceCode
    }
  });

  if (existingEntry) {
    return prisma.bankEntry.update({
      where: {
        id: existingEntry.id
      },
      data: input
    });
  }

  return prisma.bankEntry.create({
    data: input
  });
}

async function upsertFiscalReminder(input: {
  title: string;
  description: string;
  dueDate: Date;
  reminderDate: Date;
  severity: "LOW" | "MEDIUM" | "HIGH";
}) {
  const existingReminder = await prisma.fiscalReminder.findFirst({
    where: {
      title: input.title,
      dueDate: input.dueDate
    }
  });

  if (existingReminder) {
    return prisma.fiscalReminder.update({
      where: {
        id: existingReminder.id
      },
      data: input
    });
  }

  return prisma.fiscalReminder.create({
    data: input
  });
}

function formatReferenceMonth(date: Date) {
  return date.toISOString().slice(0, 7);
}

function addMonths(date: Date, amount: number) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + amount, 1));
}

main()
  .catch((error) => {
    console.error("Seed falhou.", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
