"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api";
import { useAppState } from "./app-state-provider";
import { useAuth } from "./auth-provider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function AppHeader() {
  const { user, token, logout } = useAuth();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const { isOnline } = useAppState();

  const { data: alertsRes } = useQuery({
    queryKey: ["alerts", "header", token],
    queryFn: () => apiRequest<any>("/alerts/overview", { token }),
    enabled: !!token,
  });

  const alerts = alertsRes?.data?.alerts || [];
  const hasAlerts = alerts.length > 0;

  const handleSearch = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && search.trim()) {
      router.push(`/customers?search=${encodeURIComponent(search.trim())}`);
    }
  };

  return (
    <header className="fixed top-0 right-0 w-[calc(100%-16rem)] z-40 bg-slate-900/80 backdrop-blur-xl flex justify-between items-center h-20 px-8 ml-64 shadow-sm shadow-indigo-900/5">
      <div className="flex items-center gap-4 w-96">
        <div className="relative w-full group">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-outline)] group-focus-within:text-[var(--color-primary)]">
            search
          </span>
          <input
            type="text"
            className="w-full bg-[var(--color-surface-container-highest)] border-none rounded-full py-2.5 pl-12 pr-4 focus:ring-2 focus:ring-[var(--color-secondary)] outline-none text-sm text-white"
            placeholder="Buscar clientes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleSearch}
          />
        </div>
      </div>
      
      <div className="flex items-center gap-6">
        <span className={`network-indicator ${isOnline ? "online" : "offline"}`}>
          {isOnline ? "Online" : "Offline"}
        </span>
        <div className="flex items-center gap-4 border-r border-[#414753] pr-6">
          {/* Notifications Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-2 text-slate-500 hover:text-[var(--color-primary)] transition-all relative">
                <span className="material-symbols-outlined">notifications</span>
                {hasAlerts && (
                  <span className="absolute top-2 right-2 w-2 h-2 bg-[var(--color-error)] rounded-full"></span>
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notificações</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {alerts.length === 0 ? (
                <div className="p-4 text-center text-xs text-[var(--color-outline)]">
                  Nenhum alerta pendente.
                </div>
              ) : (
                alerts.slice(0, 5).map((alert: any, idx: number) => (
                  <DropdownMenuItem key={idx} className="flex flex-col items-start gap-1 p-3 cursor-pointer">
                    <span className="font-bold text-xs">{alert.message}</span>
                    <span className="text-[10px] opacity-70">{alert.customer.regionName || "Geral"}</span>
                  </DropdownMenuItem>
                ))
              )}
              {alerts.length > 5 && (
                <DropdownMenuItem className="justify-center text-[var(--color-primary)] text-xs font-bold">
                  Ver todos
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-2 text-slate-500 hover:text-[var(--color-primary)] transition-all">
                <span className="material-symbols-outlined">account_circle</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
              <p className="px-2 pb-2 text-[10px] text-[var(--color-outline)] truncate">
                {user?.email}
              </p>
              <DropdownMenuSeparator />
              <Link href="/settings">
                <DropdownMenuItem className="cursor-pointer">
                  <span className="material-symbols-outlined text-sm mr-2">settings</span>
                  Configurações
                </DropdownMenuItem>
              </Link>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="text-[var(--color-error)] cursor-pointer"
                onClick={() => logout()}
              >
                <span className="material-symbols-outlined text-sm mr-2">logout</span>
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <Link href="/customers/new">
          <button className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-container)] text-white px-6 py-2.5 rounded-full text-sm font-bold shadow-lg shadow-indigo-900/20 hover:scale-105 transition-all">
            Add Customer
          </button>
        </Link>
      </div>
    </header>
  );
}
