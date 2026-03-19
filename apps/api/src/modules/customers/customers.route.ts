import type { FastifyInstance } from "fastify";

import { CustomersRepository } from "./customers.repository.js";
import {
  createCustomerSchema,
  getCustomerByIdSchema,
  listCustomersSchema,
  recalculateCustomerStatusSchema,
  updateCustomerSchema
} from "./customers.schema.js";
import { CustomersService } from "./customers.service.js";

const customersRepository = new CustomersRepository();
const customersService = new CustomersService(customersRepository);

export async function customerRoutes(app: FastifyInstance): Promise<void> {
  app.post("/", { schema: createCustomerSchema }, async (request, reply) => {
    const body = request.body as {
      fullName: string;
      documentId?: string;
      phone?: string;
      email?: string;
      addressLine?: string;
      addressNumber?: string;
      neighborhood?: string;
      city?: string;
      state?: string;
      postalCode?: string;
      notes?: string;
      monthlyFee: number;
      dueDay: number;
      graceDays?: number;
      cutoffDays?: number;
      serviceStartDate?: string;
      regionId?: string;
    };

    const customer = await customersService.createCustomer({
      ...pickDefinedFields({
        documentId: body.documentId,
        phone: body.phone,
        email: body.email,
        addressLine: body.addressLine,
        addressNumber: body.addressNumber,
        neighborhood: body.neighborhood,
        city: body.city,
        state: body.state,
        postalCode: body.postalCode,
        notes: body.notes,
        serviceStartDate: body.serviceStartDate ? new Date(body.serviceStartDate) : undefined,
        regionId: body.regionId
      }),
      monthlyFee: body.monthlyFee,
      fullName: body.fullName,
      dueDay: body.dueDay,
      graceDays: body.graceDays ?? 0,
      cutoffDays: body.cutoffDays ?? 0
    });

    return reply.status(201).send({
      data: customer
    });
  });

  app.get("/", { schema: listCustomersSchema }, async () => {
    const customers = await customersService.listCustomers();

    return {
      data: customers
    };
  });

  app.get("/:id", { schema: getCustomerByIdSchema }, async (request) => {
    const params = request.params as { id: string };
    const customer = await customersService.getCustomerById(params.id);

    return {
      data: customer
    };
  });

  app.patch("/:id", { schema: updateCustomerSchema }, async (request) => {
    const params = request.params as { id: string };
    const body = request.body as {
      fullName?: string;
      documentId?: string;
      phone?: string;
      addressLine?: string;
      addressNumber?: string;
      neighborhood?: string;
      city?: string;
      state?: string;
      postalCode?: string;
      monthlyFee?: number;
      dueDay?: number;
      graceDays?: number;
      cutoffDays?: number;
      regionId?: string;
    };

    const customer = await customersService.updateCustomer(params.id, {
      ...pickDefinedFields({
        fullName: body.fullName,
        documentId: body.documentId,
        phone: body.phone,
        addressLine: body.addressLine,
        addressNumber: body.addressNumber,
        neighborhood: body.neighborhood,
        city: body.city,
        state: body.state,
        postalCode: body.postalCode,
        monthlyFee: body.monthlyFee,
        dueDay: body.dueDay,
        graceDays: body.graceDays,
        cutoffDays: body.cutoffDays,
        regionId: body.regionId
      })
    });

    return {
      data: customer
    };
  });

  app.post("/:id/recalculate-status", { schema: recalculateCustomerStatusSchema }, async (request) => {
    const params = request.params as { id: string };
    const query = request.query as { referenceDate?: string };
    const customer = await customersService.recalculateCustomerStatus(params.id, query.referenceDate);

    return {
      data: customer
    };
  });
}

function pickDefinedFields<T extends Record<string, unknown>>(input: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(input).filter(([, value]) => value !== undefined)
  ) as Partial<T>;
}
