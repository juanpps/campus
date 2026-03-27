"use client";

import { useEffect, useState } from "react";
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
import { ShieldCheck, UserPlus, ShieldAlert, Loader2, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { asignarRolAdmin } from "@/actions/superadmin";
import { db } from "@/lib/firebase/client";
import { collection, query, where, getDocs } from "firebase/firestore";

export default function AdministradoresPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [admins, setAdmins] = useState<any[]>([]);
  const [fetching, setFetching] = useState(true);

  const fetchAdmins = async () => {
    try {
      setFetching(true);
      const q = query(
        collection(db, "usuarios"),
        where("rol", "in", ["admin", "superadmin"])
      );
      const querySnapshot = await getDocs(q);
      const adminList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setAdmins(adminList);
    } catch (error) {
      toast.error("Error al cargar administradores");
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleProvision = async () => {
    if (!email) return;
    try {
      setLoading(true);
      const res = await asignarRolAdmin(email);
      if (res.success) {
        toast.success("Cuenta aprovisionada. El usuario ya puede iniciar sesión con Google.");
        setIsOpen(false);
        setEmail("");
        fetchAdmins(); // Recargar lista
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
    <div className="p-6 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <ShieldCheck className="text-raptor h-8 w-8" />
            Control de Acceso Administrativo
          </h1>
          <p className="text-muted-foreground mt-1">
            Gestión de roles de alto nivel y aprovisionamiento Zero-Touch para el Método Raptor.
          </p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={fetchAdmins} disabled={fetching}>
            <RefreshCw className={`h-4 w-4 ${fetching ? "animate-spin" : ""}`} />
          </Button>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger
              render={
                <Button className="bg-raptor hover:bg-raptor/90 text-white">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Nuevo Administrador
                </Button>
              }
            />
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Aprovisionar Administrador</DialogTitle>
                <DialogDescription>
                  Ingresa el correo de Google del futuro administrador. Se le asignará el rol de forma inmediata en Firestore.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="admin-email">Correo Electrónico (Google)</Label>
                  <Input
                    id="admin-email"
                    placeholder="ej. director@metodoraptor.com"
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
                  className="bg-raptor hover:bg-raptor/90 text-white"
                >
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ShieldCheck className="mr-2 h-4 w-4" />}
                  Aprovisionar Acceso
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
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
            {fetching ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
                </TableCell>
              </TableRow>
            ) : admins.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center text-muted-foreground italic">
                  No se encontraron administradores registrados.
                </TableCell>
              </TableRow>
            ) : admins.map((admin) => (
              <TableRow key={admin.id}>
                <TableCell>
                  <div className="font-medium">{admin.nombre || "Sin nombre"}</div>
                  <div className="text-xs text-muted-foreground">{admin.email}</div>
                </TableCell>
                <TableCell>
                  <Badge variant={admin.rol === "superadmin" ? "default" : "secondary"} className="capitalize">
                    {admin.rol}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-emerald-500" />
                    <span className="capitalize text-sm">Activo</span>
                  </div>
                </TableCell>
                <TableCell className="text-right space-x-2">
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
