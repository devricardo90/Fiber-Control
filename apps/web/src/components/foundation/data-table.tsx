import { cn } from "@/lib/utils";

type DataTableProps = {
  columns: string[];
  rows: string[][];
  className?: string;
};

export function DataTable({ className, columns, rows }: DataTableProps) {
  return (
    <div className={cn("overflow-x-auto rounded-md border border-[var(--fc-border)]", className)}>
      <table className="min-w-full border-collapse bg-[var(--fc-surface)] text-sm">
        <thead className="bg-[var(--fc-surface-muted)]">
          <tr>
            {columns.map((column) => (
              <th
                key={column}
                className="border-b border-[var(--fc-border)] px-3 py-2 text-left text-xs font-semibold uppercase tracking-[0.08em] text-[var(--fc-text-muted)]"
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={`${row[0]}-${rowIndex}`} className="odd:bg-white even:bg-[#fafbfd]">
              {row.map((cell, cellIndex) => (
                <td
                  key={`${rowIndex}-${cellIndex}`}
                  className="border-b border-[var(--fc-border)] px-3 py-2 text-[var(--fc-text-soft)]"
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
