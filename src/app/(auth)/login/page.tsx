"use client";

import { useState } from "react";
import Image from "next/image";
import { signInWithGoogle } from "@/lib/firebase/auth";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      await signInWithGoogle();
      // El middleware redireccionará adecuadamente
      window.location.href = "/";
    } catch (error) {
      toast.error("Error al iniciar sesión. Intenta nuevamente.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full items-center justify-center bg-gradient-to-br from-raptor-light to-raptor-dark p-4">
      <Card className="w-full max-w-md shadow-2xl border-none ring-1 ring-black/5 bg-background dark:bg-zinc-950">
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto bg-raptor rounded-xl p-3 w-fit shadow-md">
            {/* Logo de Raptor, asumiendo un asset local o placeholder de identidad */}
            <div className="h-12 w-12 rounded-lg bg-white flex items-center justify-center font-bold text-raptor text-2xl" aria-label="Logo Método Raptor" role="img">
              🦖
            </div>
          </div>
          <CardTitle className="text-3xl font-bold tracking-tight text-foreground">
            Método Raptor
          </CardTitle>
          <CardDescription className="text-muted-foreground text-sm">
            Ingresa a tu Campus Online PREICFES y domina la prueba.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            className="w-full h-12 text-base font-semibold"
            variant="default"
            size="lg"
            onClick={handleGoogleLogin}
            disabled={loading}
            aria-label="Acceder mediante Google"
          >
            {loading ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" aria-hidden="true" />
            ) : (
              <span className="mr-2 text-xl" aria-hidden="true">G</span>
            )}
            Continuar con Google
          </Button>
        </CardContent>
        <CardFooter className="justify-center text-sm text-muted-foreground">
          <p>
            Al ingresar aceptas nuestros {' '}
            <a href="/terminos" className="underline hover:text-raptor focus:outline-none focus-visible:ring-2 focus-visible:ring-raptor rounded-sm" aria-label="Términos y condiciones">
              Términos y Condiciones
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
