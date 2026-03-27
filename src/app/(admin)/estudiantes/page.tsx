"use client";

import { useState } from "react";
import Papa from "papaparse";
import { toast } from "sonner";
import { EmptyState } from "@/components/shared/EmptyState";
import { Users, Search, Download, Link as LinkIcon, AlertTriangle } from "lucide-react";
// Mock asumiendo TanStack Table
import { useReactTable, getCoreRowModel, flexRender, getFilteredRowModel, getPaginationRowModel } from "@tanstack/react-table";

const MOCK_DATA = [
  { id: "1", nombre: "Ana Gómez", email: "ana@ejemplo.com", estado: "activo" },
  { id: "2", nombre: "Carlos Ruiz", email: "carlos@ejemplo.com", estado: "pendiente" },
];

export default function EstudiantesAdminPage() {
  const [globalFilter, setGlobalFilter] = useState("");
  const [data] = useState(MOCK_DATA);

  // Progressive Disclosure: Paginación en lugar de Scroll infinito
  const table = useReactTable({
    data,
    columns: [
      { header: "Nombre", accessorKey: "nombre" },
      { header: "Email", accessorKey: "email" },
      { header: "Estado", accessorKey: "estado" },
      {
        id: "acciones",
        cell: ({ row }) => {
          return (
            <div className="flex space-x-2">
              <button
                onClick={() => generarLink(row.original.id)}
                className="p-2 border rounded-md hover:bg-muted"
                title="Generar Link Acceso Fase 02"
              >
                <LinkIcon className="h-4 w-4" />
              </button>
              <button
                onClick={() => expulsar(row.original.id)}
                className="p-2 border rounded-md hover:bg-destructive/10 text-destructive"
                title="Expulsar"
              >
                <AlertTriangle className="h-4 w-4" />
              </button>
            </div>
          );
        }
      }
    ],
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(), // Required for pagination Progressive Disclosure
  });

  const generarLink = (id: string) => {
    toast.success(`Link seguro de acceso copiado al portapapeles para el estudiante ${id}.`);
  };

  const expulsar = (id: string) => {
    // Acá iría un AlertDialog, simplificado para el dummy UI
    if (confirm("¿Estás seguro de inhabilitar este estudiante?")) {
      toast.success("Estudiante inhabilitado.");
    }
  };

  const exportarCSV = () => {
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "estudiantes-raptor.csv");
    document.body.appendChild(link);
    link.click();
    toast.success("Reporte CSV descargado.");
  };

  return (
    <div className="p-8 max-w-7xl mx-auto animate-in slide-in-from-bottom-4">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Gestión de Estudiantes</h1>
        <button onClick={exportarCSV} className="flex items-center space-x-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80">
          <Download className="h-4 w-4" />
          <span>Exportar a CSV</span>
        </button>
      </div>

      {/* Smarter Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <input
          value={globalFilter ?? ""}
          onChange={(e) => setGlobalFilter(e.target.value)}
          placeholder="Buscar estudiante por nombre o correo (Smarter Search)..."
          className="pl-10 h-10 w-full md:w-1/2 rounded-md border px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        />
      </div>

      <div className="rounded-md border">
        {data.length > 0 ? (
          <table className="w-full text-sm text-left">
            <thead className="bg-muted bg-opacity-50">
              {table.getHeaderGroups().map(hg => (
                <tr key={hg.id}>
                  {hg.headers.map(h => (
                    <th key={h.id} className="p-4 font-medium border-b">{flexRender(h.column.columnDef.header, h.getContext())}</th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map(row => (
                <tr key={row.id} className="border-b last:border-0 hover:bg-muted/50">
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id} className="p-4">{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <EmptyState icon={<Users />} title="No hay resultados" description="No se encontraron estudiantes." />
        )}
      </div>

      {/* Progressive Disclosure Pagination */}
      <div className="flex items-center justify-end space-x-2 py-4">
        <button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Anterior
        </button>
        <button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}
