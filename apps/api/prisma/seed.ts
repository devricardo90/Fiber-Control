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
  // Admin users preservation
  const admin = await prisma.user.upsert({
    where: { email: "admin@fibercontrol.local" },
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
    where: { email: "operator@fibercontrol.local" },
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
    where: { email: "acesso@fibercontrol.local" },
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

  // Base configurations
  await prisma.taxConfig.upsert({
    where: { singletonKey: "default" },
    update: {
      regimeLabel: "Simples Nacional",
      estimatedRate: "6.50",
      dueDay: 20,
      notes: "Configuracao fiscal padrao para operacao fibra"
    },
    create: {
      singletonKey: "default",
      regimeLabel: "Simples Nacional",
      estimatedRate: "6.50",
      dueDay: 20,
      notes: "Configuracao fiscal padrao para operacao fibra"
    }
  });

  const northRegion = await prisma.region.upsert({
    where: { code: "NORTH" },
    update: { name: "Zona Norte - Santa Rosa", description: "Setor de expansao norte" },
    create: { name: "Zona Norte - Santa Rosa", code: "NORTH", description: "Setor de expansao norte" }
  });

  const centerRegion = await prisma.region.upsert({
    where: { code: "CENTER" },
    update: { name: "Centro Historico", description: "Area central de alta densidade" },
    create: { name: "Centro Historico", code: "CENTER", description: "Area central de alta densidade" }
  });

  // Business Narrative: João Silva (Active, Paid)
  const joaoSilva = await prisma.customer.upsert({
    where: { documentId: "SEED-0001" },
    update: {
      fullName: "João Silva Telecom",
      phone: "+55 11 98888-0001",
      email: "joao.silva@demo.fiber.local",
      addressLine: "Rua das Palmeiras",
      addressNumber: "450",
      neighborhood: "Centro",
      city: "Santa Rosa",
      state: "RS",
      postalCode: "98900-000",
      notes: "Cliente corporativo - Plano 300MB Fibra",
      status: "ACTIVE",
      monthlyFee: "150.00",
      dueDay: 10,
      graceDays: 2,
      cutoffDays: 5,
      serviceStartDate: new Date(Date.UTC(currentYear, currentMonth - 6, 10)),
      regionId: centerRegion.id
    },
    create: {
      fullName: "João Silva Telecom",
      documentId: "SEED-0001",
      phone: "+55 11 98888-0001",
      email: "joao.silva@demo.fiber.local",
      addressLine: "Rua das Palmeiras",
      addressNumber: "450",
      neighborhood: "Centro",
      city: "Santa Rosa",
      state: "RS",
      postalCode: "98900-000",
      notes: "Cliente corporativo - Plano 300MB Fibra",
      status: "ACTIVE",
      monthlyFee: "150.00",
      dueDay: 10,
      graceDays: 2,
      cutoffDays: 5,
      serviceStartDate: new Date(Date.UTC(currentYear, currentMonth - 6, 10)),
      regionId: centerRegion.id
    }
  });

  // Business Narrative: Maria Oliveira (Overdue, Inadimplente)
  const mariaOliveira = await prisma.customer.upsert({
    where: { documentId: "SEED-0002" },
    update: {
      fullName: "Maria Oliveira",
      phone: "+55 11 97777-0002",
      email: "maria.oliveira@demo.fiber.local",
      addressLine: "Avenida das Industrias",
      addressNumber: "1200",
      neighborhood: "Distrito Industrial",
      city: "Santa Rosa",
      state: "RS",
      postalCode: "98910-000",
      notes: "Cliente residencial - Plano 100MB Fibra",
      status: "OVERDUE",
      monthlyFee: "99.90",
      dueDay: 5,
      graceDays: 2,
      cutoffDays: 5,
      serviceStartDate: new Date(Date.UTC(currentYear, currentMonth - 3, 5)),
      regionId: northRegion.id
    },
    create: {
      fullName: "Maria Oliveira",
      documentId: "SEED-0002",
      phone: "+55 11 97777-0002",
      email: "maria.oliveira@demo.fiber.local",
      addressLine: "Avenida das Industrias",
      addressNumber: "1200",
      neighborhood: "Distrito Industrial",
      city: "Santa Rosa",
      state: "RS",
      postalCode: "98910-000",
      notes: "Cliente residencial - Plano 100MB Fibra",
      status: "OVERDUE",
      monthlyFee: "99.90",
      dueDay: 5,
      graceDays: 2,
      cutoffDays: 5,
      serviceStartDate: new Date(Date.UTC(currentYear, currentMonth - 3, 5)),
      regionId: northRegion.id
    }
  });

  // Payments for current month
  const joaoPayment = await prisma.payment.upsert({
    where: {
      customerId_referenceMonth: { customerId: joaoSilva.id, referenceMonth: currentReferenceMonth }
    },
    update: {
      expectedAmount: "150.00",
      receivedAmount: "150.00",
      status: "PAID",
      paidAt: new Date(Date.UTC(currentYear, currentMonth, 10)),
      notes: "Fatura paga integralmente via Pix"
    },
    create: {
      customerId: joaoSilva.id,
      referenceMonth: currentReferenceMonth,
      expectedAmount: "150.00",
      receivedAmount: "150.00",
      status: "PAID",
      paidAt: new Date(Date.UTC(currentYear, currentMonth, 10)),
      notes: "Fatura paga integralmente via Pix"
    }
  });

  // Maria's payment is pending/partial to show in Dashboard alerts
  await prisma.payment.upsert({
    where: {
      customerId_referenceMonth: { customerId: mariaOliveira.id, referenceMonth: currentReferenceMonth }
    },
    update: {
      expectedAmount: "99.90",
      receivedAmount: "0.00",
      status: "PENDING",
      paidAt: null,
      notes: "Fatura em atraso - Aguardando pagamento"
    },
    create: {
      customerId: mariaOliveira.id,
      referenceMonth: currentReferenceMonth,
      expectedAmount: "99.90",
      receivedAmount: "0.00",
      status: "PENDING",
      paidAt: null,
      notes: "Fatura em atraso - Aguardando pagamento"
    }
  });

  // Previous month history
  await prisma.payment.upsert({
    where: {
      customerId_referenceMonth: { customerId: joaoSilva.id, referenceMonth: previousReferenceMonth }
    },
    update: {
      expectedAmount: "150.00",
      receivedAmount: "150.00",
      status: "PAID",
      paidAt: new Date(Date.UTC(currentYear, currentMonth - 1, 10))
    },
    create: {
      customerId: joaoSilva.id,
      referenceMonth: previousReferenceMonth,
      expectedAmount: "150.00",
      receivedAmount: "150.00",
      status: "PAID",
      paidAt: new Date(Date.UTC(currentYear, currentMonth - 1, 10))
    }
  });

  // Bank reconciliation evidence
  await upsertBankEntry({
    amount: "150.00",
    occurredAt: new Date(Date.UTC(currentYear, currentMonth, 10, 14, 30, 0)),
    description: "PIX RECEBIDO - JOAO SILVA TELECOM",
    paymentId: joaoPayment.id,
    referenceCode: "BANK-JOAO-001",
    source: "bank_import",
    status: "MATCHED"
  });

  // Alerts narrative
  await upsertFiscalReminder({
    title: "Vencimento DAS Simples Nacional",
    description: "Imposto mensal sobre faturamento de telecom",
    dueDate: new Date(Date.UTC(currentYear, currentMonth, 20)),
    reminderDate: new Date(Date.UTC(currentYear, currentMonth, 15)),
    severity: "HIGH"
  });

  await upsertFiscalReminder({
    title: "Conferência de Notas Fiscais",
    description: "Revisar notas fiscais emitidas para o periodo",
    dueDate: new Date(Date.UTC(currentYear, currentMonth, 28)),
    reminderDate: new Date(Date.UTC(currentYear, currentMonth, 25)),
    severity: "MEDIUM"
  });

  console.log("Demo seed concluido com sucesso.");
  console.log(`Admin Staging: ${admin.email} / Admin@123456`);
  console.log(`Local Access: ${localAccessAdmin.email} / Fiber@123456`);
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
    where: { referenceCode: input.referenceCode }
  });

  if (existingEntry) {
    return prisma.bankEntry.update({ where: { id: existingEntry.id }, data: input });
  }

  return prisma.bankEntry.create({ data: input });
}

async function upsertFiscalReminder(input: {
  title: string;
  description: string;
  dueDate: Date;
  reminderDate: Date;
  severity: "LOW" | "MEDIUM" | "HIGH";
}) {
  const existingReminder = await prisma.fiscalReminder.findFirst({
    where: { title: input.title, dueDate: input.dueDate }
  });

  if (existingReminder) {
    return prisma.fiscalReminder.update({ where: { id: existingReminder.id }, data: input });
  }

  return prisma.fiscalReminder.create({ data: input });
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
