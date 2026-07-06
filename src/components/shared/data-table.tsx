"use client";

import { Pencil, Trash2 } from "lucide-react";
import type { ReactNode } from "react";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";

/** A column: a header label and how to render the cell for a row. */
export interface Column<T> {
  header: string;
  cell: (row: T) => ReactNode;
  /** Right-align (used for numeric/status columns when desired). */
  align?: "left" | "right";
}

interface DataTableProps<T extends { id: string }> {
  rows: T[];
  columns: Column<T>[];
  /** Label used in the delete confirmation and aria labels. */
  rowLabel: (row: T) => string;
  onEdit: (row: T) => void;
  onDelete: (row: T) => void;
  emptyMessage: string;
}

/**
 * Generic admin listing table with edit/delete row actions. Extracted once
 * two managers (Webinars, Informes) proved identical except for columns —
 * every content module now shares this instead of copy-pasting a table.
 */
export function DataTable<T extends { id: string }>({
  rows,
  columns,
  rowLabel,
  onEdit,
  onDelete,
  emptyMessage,
}: DataTableProps<T>) {
  if (rows.length === 0) {
    return <EmptyState message={emptyMessage} />;
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-white">
      <table className="w-full text-sm">
        <thead className="border-b border-border bg-surface text-left text-xs uppercase tracking-wide text-ink-muted">
          <tr>
            {columns.map((col, idx) => (
              <th
                key={idx}
                className={`px-4 py-3 font-medium ${
                  col.align === "right" ? "text-right" : ""
                }`}
              >
                {col.header}
              </th>
            ))}
            <th className="px-4 py-3 text-right font-medium">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {rows.map((row) => (
            <tr key={row.id} className="hover:bg-surface/50">
              {columns.map((col, idx) => (
                <td
                  key={idx}
                  className={`px-4 py-3 ${
                    col.align === "right" ? "text-right" : ""
                  }`}
                >
                  {col.cell(row)}
                </td>
              ))}
              <td className="px-4 py-3">
                <div className="flex justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(row)}
                    aria-label={`Editar ${rowLabel(row)}`}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(row)}
                    aria-label={`Eliminar ${rowLabel(row)}`}
                    className="text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
