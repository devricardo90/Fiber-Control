export function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL"
  }).format(value);
}

export function formatMonthLabel(value: string) {
  const [year, month] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, (month ?? 1) - 1, 1));

  return new Intl.DateTimeFormat("pt-BR", {
    month: "long",
    year: "numeric",
    timeZone: "UTC"
  }).format(date);
}
