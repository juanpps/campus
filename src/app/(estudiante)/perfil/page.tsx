"use client";

import { useEffect, useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, BookOpen, Target, Info, ShieldCheck, Loader2 } from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";
import { db } from "@/lib/firebase/client";
import { doc, getDoc } from "firebase/firestore";
import { completarOnboarding } from "@/actions/config";
import { toast } from "sonner";

export default function PerfilPage() {
  const { user } = useAuth();
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    async function fetchUserData() {
      if (!user) return;
      try {
        const docRef = doc(db, "usuarios", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserData(docSnap.data());
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchUserData();
  }, [user]);

  const handleCompleteTour = async () => {
    if (!user) return;
    setUpdating(true);
    try {
      const res = await completarOnboarding(user.uid);
      if (res.success) {
        setUserData((prev: any) => ({ ...prev, onboarding_completado: true }));
        toast.success("¡Tour completado! Bienvenido oficialmente.");
      }
    } catch (error) {
      toast.error("Error al guardar progreso.");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-raptor" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center gap-4">
        <div className="h-20 w-20 rounded-full bg-raptor/10 flex items-center justify-center border-4 border-raptor/20">
          {user?.photoURL ? (
            <img src={user.photoURL} alt="Perfil" className="h-full w-full rounded-full object-cover" />
          ) : (
            <User className="h-10 w-10 text-raptor" />
          )}
        </div>
        <div>
          <h1 className="text-3xl font-bold">{user?.displayName || "Estudiante Raptor"}</h1>
          <p className="text-muted-foreground">
            {userData?.grado ? `${userData.grado}º Grado` : "Grado no definido"} · {userData?.municipio || "Colombia"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 border-raptor/10">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              Información Académica
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Datos validados por el equipo del Método Raptor.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground uppercase">Correo Registrado</label>
                <p className="font-medium text-primary break-all">{user?.email}</p>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground uppercase">Teléfono de Contacto</label>
                <p className="font-medium">{userData?.telefono || "No registrado"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-raptor/5 to-transparent border-raptor/20">
          <CardHeader>
            <CardTitle className="text-xl">Métricas de Éxito</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-blue-500" />
                <span className="text-sm">Lecciones</span>
              </div>
              <span className="font-bold">Alpha-v1</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-purple-500" />
                <span className="text-sm">Simulacros</span>
              </div>
              <span className="font-bold">4/10</span>
            </div>
            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-raptor w-[40%]" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Onboarding Real Persistence */}
      {userData && !userData.onboarding_completado && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-300 border-raptor/30">
            <CardHeader className="text-center">
              <div className="mx-auto h-16 w-16 rounded-full bg-raptor/20 flex items-center justify-center mb-4">
                <ShieldCheck className="h-10 w-10 text-raptor" />
              </div>
              <CardTitle className="text-2xl text-raptor">¡Bienvenido al Método Raptor!</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 text-center">
              <p className="text-muted-foreground leading-relaxed">
                Has ingresado a la comunidad de alto rendimiento académico. ¿Deseas explorar tus herramientas o ir directo al entrenamiento?
              </p>
              <div className="flex gap-4">
                <Button
                  variant="ghost"
                  className="flex-1"
                  onClick={handleCompleteTour}
                  disabled={updating}
                >
                  Omitir
                </Button>
                <Button
                  className="flex-1 bg-raptor hover:bg-raptor/90 text-white"
                  onClick={handleCompleteTour}
                  disabled={updating}
                >
                  {updating ? <Loader2 className="h-4 w-4 animate-spin" /> : "Empezar Tour"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
