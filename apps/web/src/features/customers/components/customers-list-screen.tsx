"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api";
import { useAuth } from "@/components/layout/auth-provider";
import { PageHeader } from "@/components/shared/page-header";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

export function CustomersListScreen() {
  const { token } = useAuth();
  const searchParams = useSearchParams();
  const urlSearch = searchParams.get("search") || "";
  const [searchTerm, setSearchTerm] = useState(urlSearch);

  useEffect(() => {
    if (urlSearch) {
      setSearchTerm(urlSearch);
    }
  }, [urlSearch]);

  const { data: customersRes, isLoading } = useQuery({
    queryKey: ["customers", token],
    queryFn: () => apiRequest<any>("/customers", { token }),
    enabled: !!token,
  });

  const customers = customersRes?.data || [];

  const filteredCustomers = customers.filter((c: any) =>
    c.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.documentId?.includes(searchTerm)
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-500/10 text-green-500 border-green-500/20";
      case "overdue": return "bg-red-500/10 text-red-500 border-red-500/20";
      case "suspended": return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      default: return "bg-slate-500/10 text-slate-500 border-slate-500/20";
    }
  };

  return (
    <div className="page-shell">
      <PageHeader
        title="Clientes"
        description="Gerencie sua base de assinantes, visualize status e pagamentos."
        badge={`${customers.length} Registrados`}
      />

      <div className="mt-8 space-y-4">
        <div className="flex justify-between items-center gap-4">
          <Input
            placeholder="Buscar por nome ou CPF..."
            className="max-w-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Link href="/customers/new">
            <Button className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-container)]">
              Novo Cliente
            </Button>
          </Link>
        </div>

        <div className="card p-0 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Região</TableHead>
                <TableHead>Mensalidade</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-8 w-20 ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : filteredCustomers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center text-[var(--color-outline)]">
                    Nenhum cliente encontrado.
                  </TableCell>
                </TableRow>
              ) : (
                filteredCustomers.map((customer: any) => (
                  <TableRow key={customer.id}>
                    <TableCell className="font-medium">{customer.fullName}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getStatusColor(customer.status)}>
                        {customer.status.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>{customer.region?.name || "N/A"}</TableCell>
                    <TableCell>
                      {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(customer.monthlyFee)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Link href={`/customers/${customer.id}`}>
                          <Button variant="ghost" size="sm">Detalhes</Button>
                        </Link>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
