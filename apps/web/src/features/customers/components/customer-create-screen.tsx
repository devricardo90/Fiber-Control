"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api";
import { useAuth } from "@/components/layout/auth-provider";
import { PageHeader } from "@/components/shared/page-header";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const customerSchema = z.object({
  fullName: z.string().min(3, "Full name is required"),
  documentId: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  addressLine: z.string().optional(),
  addressNumber: z.string().optional(),
  neighborhood: z.string().optional(),
  city: z.string().optional(),
  state: z.string().max(2).optional(),
  postalCode: z.string().optional(),
  regionId: z.string().min(1, "Region is required"),
  monthlyFee: z.number().positive("Monthly fee must be positive"),
  dueDay: z.number().min(1).max(31, "Due day must be between 1 and 31"),
  notes: z.string().optional(),
});

type CustomerFormValues = z.infer<typeof customerSchema>;

export function CustomerCreateScreen() {
  const router = useRouter();
  const { token } = useAuth();
  
  const { data: regionsRes } = useQuery({
    queryKey: ["regions", token],
    queryFn: () => apiRequest<any>("/regions", { token }),
    enabled: !!token,
  });

  const regions = regionsRes?.data || [];

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      fullName: "",
      monthlyFee: 0,
      dueDay: 10,
      regionId: "",
    },
  });

  const onSubmit = async (values: CustomerFormValues) => {
    try {
      await apiRequest("/customers", {
        method: "POST",
        body: JSON.stringify(values),
        token,
      });
      router.push("/customers");
    } catch (error) {
      console.error("Failed to create customer:", error);
      alert("Error creating customer. Check if all required fields are filled.");
    }
  };

  return (
    <div className="page-shell">
      <PageHeader
        title="Novo Cliente"
        description="Cadastre um novo assinante preenchendo as informações abaixo."
        badge="Cadastro"
      />

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8">
        <div className="grid grid-cols-12 gap-6">
          {/* Dados Pessoais */}
          <article className="col-span-12 lg:col-span-8 card">
            <h3 className="text-lg font-bold text-[var(--color-primary)] mb-6">Informações Pessoais</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Nome Completo *</Label>
                <Input id="fullName" {...register("fullName")} placeholder="Ex: João da Silva" />
                {errors.fullName && <span className="text-xs text-[var(--color-error)]">{errors.fullName.message}</span>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="documentId">CPF / CNPJ</Label>
                <Input id="documentId" {...register("documentId")} placeholder="000.000.000-00" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Telefone / WhatsApp</Label>
                <Input id="phone" {...register("phone")} placeholder="(00) 00000-0000" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" {...register("email")} placeholder="joao@exemplo.com" />
                {errors.email && <span className="text-xs text-[var(--color-error)]">{errors.email.message}</span>}
              </div>
            </div>

            <div className="mt-6 space-y-2">
              <Label htmlFor="notes">Observações</Label>
              <Textarea id="notes" {...register("notes")} placeholder="Notas adicionais sobre o cliente..." className="min-h-[100px]" />
            </div>
          </article>

          {/* Endereço e Região */}
          <article className="col-span-12 lg:col-span-4 card">
            <h3 className="text-lg font-bold text-[var(--color-primary)] mb-6">Localização</h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Região de Atendimento *</Label>
                <Select onValueChange={(val) => setValue("regionId", val)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma região" />
                  </SelectTrigger>
                  <SelectContent>
                    {regions.map((region: any) => (
                      <SelectItem key={region.id} value={region.id}>{region.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.regionId && <span className="text-xs text-[var(--color-error)]">{errors.regionId.message}</span>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="addressLine">Logradouro / Rua</Label>
                <Input id="addressLine" {...register("addressLine")} placeholder="Rua exemplo..." />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="addressNumber">Número</Label>
                  <Input id="addressNumber" {...register("addressNumber")} placeholder="123" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="postalCode">CEP</Label>
                  <Input id="postalCode" {...register("postalCode")} placeholder="00000-000" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="neighborhood">Bairro</Label>
                <Input id="neighborhood" {...register("neighborhood")} placeholder="Bairro centro" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="city">Cidade</Label>
                  <Input id="city" {...register("city")} placeholder="Cacequi" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">UF</Label>
                  <Input id="state" {...register("state")} maxLength={2} placeholder="RS" />
                </div>
              </div>
            </div>
          </article>

          {/* Plano e Cobrança */}
          <article className="col-span-12 lg:col-span-8 card">
            <h3 className="text-lg font-bold text-[var(--color-primary)] mb-6">Plano e Faturamento</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="monthlyFee">Valor da Mensalidade (R$) *</Label>
                <Input id="monthlyFee" type="number" step="0.01" {...register("monthlyFee", { valueAsNumber: true })} />
                {errors.monthlyFee && <span className="text-xs text-[var(--color-error)]">{errors.monthlyFee.message}</span>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="dueDay">Dia de Vencimento *</Label>
                <Input id="dueDay" type="number" {...register("dueDay", { valueAsNumber: true })} />
                {errors.dueDay && <span className="text-xs text-[var(--color-error)]">{errors.dueDay.message}</span>}
              </div>
            </div>
          </article>

          {/* Ações */}
          <div className="col-span-12 flex justify-end gap-4 mt-4">
            <Button variant="outline" type="button" onClick={() => router.back()}>
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-container)]"
            >
              {isSubmitting ? "Salvando..." : "Salvar Cliente"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
