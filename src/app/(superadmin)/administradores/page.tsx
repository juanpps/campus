"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, UserPlus, ShieldAlert } from "lucide-react";

const MOCK_ADMINS = [
  { id: "1", name: "User Admin 01", email: "admin@metodoraptor.com", role: "superadmin", status: "activo" },
  { id: "2", name: "Tutor Lead", email: "tutor@metodoraptor.com", role: "admin", status: "activo" },
  { id: "3", name: "Audit Raptor", email: "audit@metodoraptor.com", role: "admin", status: "suspendido" },
];

export default function AdministradoresPage() {
  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <ShieldCheck className="text-primary h-8 w-8" />
            Control de Acceso Administrativo
          </h1>
          <p className="text-muted-foreground mt-1">
            Gestión de roles de alto nivel y auditoría de sesiones.
          </p>
        </div>
        <Button className="shrink-0 bg-raptor hover:bg-raptor/90">
          <UserPlus className="mr-2 h-4 w-4" />
          Nuevo Administrador
        </Button>
      </div>

      <div className="border rounded-xl bg-card overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead>Nombre / Email</TableHead>
              <TableHead>Rol del Sistema</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {MOCK_ADMINS.map((admin) => (
              <TableRow key={admin.id}>
                <TableCell>
                  <div className="font-medium">{admin.name}</div>
                  <div className="text-xs text-muted-foreground">{admin.email}</div>
                </TableCell>
                <TableCell>
                  <Badge variant={admin.role === "superadmin" ? "default" : "secondary"}>
                    {admin.role.toUpperCase()}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className={`h-2 w-2 rounded-full ${admin.status === "activo" ? "bg-emerald-500" : "bg-destructive"}`} />
                    <span className="capitalize text-sm">{admin.status}</span>
                  </div>
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button variant="ghost" size="sm">Editar</Button>
                  <Button variant="ghost" size="sm" className="text-destructive">
                    <ShieldAlert className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
