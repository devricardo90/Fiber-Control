import type { FastifyInstance } from "fastify";

import { createPaymentSchema, listPaymentsSchema } from "./payments.schema.js";
import { PaymentsRepository } from "./payments.repository.js";
import { PaymentsService } from "./payments.service.js";

const paymentsRepository = new PaymentsRepository();
const paymentsService = new PaymentsService(paymentsRepository);

export async function paymentRoutes(app: FastifyInstance): Promise<void> {
  app.post("/", { schema: createPaymentSchema }, async (request, reply) => {
    const body = request.body as {
      customerId: string;
      referenceMonth: string;
      receivedAmount: number;
      paidAt?: string;
      notes?: string;
    };

    const payment = await paymentsService.createPayment({
      customerId: body.customerId,
      referenceMonth: body.referenceMonth,
      receivedAmount: body.receivedAmount,
      paidAt: body.paidAt ? new Date(body.paidAt) : undefined,
      notes: body.notes
    });

    return reply.status(201).send({
      data: payment
    });
  });

  app.get("/", { schema: listPaymentsSchema }, async () => {
    const payments = await paymentsService.listPayments();

    return {
      data: payments
    };
  });
}
