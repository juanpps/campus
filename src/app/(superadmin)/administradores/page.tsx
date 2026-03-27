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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShieldCheck, UserPlus, ShieldAlert, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { asignarRolAdmin } from "@/actions/superadmin";

const MOCK_ADMINS = [
  { id: "1", name: "Super Admin Central", email: "admin@metodoraptor.com", role: "superadmin", status: "activo" },
  { id: "2", name: "Tutor Lead", email: "tutor@metodoraptor.com", role: "admin", status: "activo" },
];

export default function AdministradoresPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleProvision = async () => {
    if (!email) return;
    try {
      setLoading(true);
      const res = await asignarRolAdmin(email);
      if (res.success) {
        toast.success("Cuenta aprovisionada. El usuario ya puede iniciar sesión con Google para acceder como Administrador.");
        setIsOpen(false);
        setEmail("");
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      toast.error("Error crítico en el servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <ShieldCheck className="text-primary h-8 w-8" />
            Control de Acceso Administrativo
          </h1>
          <p className="text-muted-foreground mt-1">
            Gestión de roles de alto nivel y aprovisionamiento Zero-Touch.
          </p>
        </div>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger
            render={
              <Button className="shrink-0 bg-raptor hover:bg-raptor/90">
                <UserPlus className="mr-2 h-4 w-4" />
                Nuevo Administrador
              </Button>
            }
          />
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Aprovisionar Administrador</DialogTitle>
              <DialogDescription>
                Ingresa el correo de Google del futuro administrador. No necesita invitación previa.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="admin-email">Correo Electrónico</Label>
                <Input
                  id="admin-email"
                  placeholder="ej. tutor@campusraptor.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsOpen(false)} disabled={loading}>Cancelar</Button>
              <Button
                onClick={handleProvision}
                disabled={loading || !email}
                className="bg-raptor hover:bg-raptor/90"
              >
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ShieldCheck className="mr-2 h-4 w-4" />}
                Aprovisionar Acceso
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-xl bg-card overflow-hidden shadow-sm">
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
                  <Badge variant={admin.role === "superadmin" ? "default" : "secondary"} className="capitalize">
                    {admin.role}
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
                  <Button variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10">
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
