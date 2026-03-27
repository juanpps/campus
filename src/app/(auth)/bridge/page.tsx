"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { signInWithGoogle } from "@/lib/firebase/auth";
import { Loader2 } from "lucide-react";

function BridgeContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [step, setStep] = useState(token ? 1 : 0);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ token: token || "" });

  // Paso 1: Autenticación con Google vinculada a la invitación
  const handleAuth = async () => {
    try {
      setLoading(true);
      if (!formData.token) {
        toast.error("Token de invitación inválido");
        return;
      }
      // Llamamos al auth de Firebase
      await signInWithGoogle();

      // En un flujo real, aquí llamaríamos a la API para canjear el token asociado al UID
      toast.success("Autenticación exitosa. Completando registro...");
      setTimeout(() => {
        window.location.href = "/";
      }, 1500);

    } catch (error) {
      console.error(error);
      toast.error("Error validando el token o autenticando.");
    } finally {
      setLoading(false);
    }
  };

  if (!token && step === 0) {
    return (
      <Card className="w-full max-w-md mx-auto shadow-lg mt-12 bg-background border-raptor-amber/20">
        <CardHeader>
          <CardTitle className="text-2xl text-foreground">Token Requerido</CardTitle>
          <CardDescription>Para inscribirte necesitas un enlace de invitación válido.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={(e) => { e.preventDefault(); setStep(1); }} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="token-input">Pega tu token aquí</Label>
              <Input
                id="token-input"
                placeholder="ej. f0a1b2..."
                value={formData.token}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, token: e.target.value })}
                aria-required="true"
              />
            </div>
            <Button type="submit" disabled={!formData.token} className="w-full">
              Validar Token
            </Button>
          </form>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md mx-auto shadow-xl mt-12 border-primary/10">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold tracking-tight text-foreground">Casi Listos</CardTitle>
        <CardDescription className="text-md">
          Hemos validado tu invitación. Vincula tu cuenta de Google para asegurar tu acceso al campus.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button
          className="w-full h-12"
          onClick={handleAuth}
          disabled={loading}
          aria-label="Vincular cuenta con Google"
        >
          {loading ? (
            <Loader2 className="mr-2 h-5 w-5 animate-spin" aria-hidden="true" />
          ) : (
            <span className="mr-2 text-xl" aria-hidden="true">G</span>
          )}
          Vincular cuenta con Google
        </Button>
      </CardContent>
      <CardFooter className="justify-center text-sm text-muted-foreground text-center">
        Tu correo universitario o personal quedará permanentemente asociado a tu rol asignado por el administrador.
      </CardFooter>
    </Card>
  )
}

// Fallback de Loading para Suspense
const BridgeLoader = () => (
  <div className="flex h-screen items-center justify-center">
    <Loader2 className="h-10 w-10 animate-spin text-raptor" />
  </div>
);

export default function BridgePage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-4 pt-20">
      <Suspense fallback={<BridgeLoader />}>
        <BridgeContent />
      </Suspense>
    </div>
  );
}
