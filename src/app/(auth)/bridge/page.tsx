"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";
import { signInWithGoogle, auth } from "@/lib/firebase/auth";
import { db } from "@/lib/firebase/client";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { Loader2, ShieldCheck, MapPin, Search, Check, ChevronsUpDown } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import colombiaData from "@/lib/data/colombia.json";

interface Departamento {
  id: number;
  departamento: string;
  ciudades: string[];
}

const COLOMBIA: Departamento[] = colombiaData as Departamento[];

// Esquema Zod con validación de coincidencia (Doble Input)
const registrationSchema = z.object({
  departamento: z.string().min(2, "Requerido"),
  municipio: z.string().min(2, "Requerido"),
  documento: z.string().min(5, "Documento inválido"),
  confirmar_documento: z.string(),
  telefono: z.string().min(10, "Teléfono debe tener 10 dígitos"),
  confirmar_telefono: z.string(),
}).refine((data) => data.documento === data.confirmar_documento, {
  message: "Los documentos no coinciden",
  path: ["confirmar_documento"],
}).refine((data) => data.telefono === data.confirmar_telefono, {
  message: "Los teléfonos no coinciden",
  path: ["confirmar_telefono"],
});

type RegistrationFormValues = z.infer<typeof registrationSchema>;

function BridgeContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tokenFromUrl = searchParams.get("token");

  const [step, setStep] = useState(tokenFromUrl ? 1 : 0);
  const [loading, setLoading] = useState(false);
  const [tokenInput, setTokenInput] = useState(tokenFromUrl || "");
  const [userUid, setUserUid] = useState<string | null>(null);

  const form = useForm<RegistrationFormValues>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      departamento: "",
      municipio: "",
      documento: "",
      confirmar_documento: "",
      telefono: "",
      confirmar_telefono: "",
    },
  });

  const selectedDepto = form.watch("departamento");
  const municipios = COLOMBIA.find((d) => d.departamento === selectedDepto)?.ciudades || [];

  // Resetear municipio si cambia el departamento
  useEffect(() => {
    form.setValue("municipio", "");
  }, [selectedDepto, form]);

  const [openMunicipio, setOpenMunicipio] = useState(false);

  // Paso 1: Autenticación con Google
  const handleAuth = async () => {
    try {
      setLoading(true);
      const userCredential = await signInWithGoogle();
      if (userCredential?.user) {
        setUserUid(userCredential.user.uid);
        toast.success("Autenticación exitosa. Completa tus datos.");
        setStep(2); // Avanzar al formulario de datos
      }
    } catch (error) {
      console.error(error);
      toast.error("Error autenticando con Google.");
    } finally {
      setLoading(false);
    }
  };

  // Paso 2: Envío de datos al Firestore
  const onSubmit = async (values: RegistrationFormValues) => {
    if (!userUid) return;

    try {
      setLoading(true);

      // SANEAMIENTO: Descartar campos redundantes de confirmación
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { confirmar_documento, confirmar_telefono, ...cleanData } = values;

      // Actualizar perfil en Firestore
      await setDoc(doc(db, "usuarios", userUid), {
        ...cleanData,
        rol: "estudiante",
        estado: "activo",
        fecha_registro: new Date(),
        onboarding_completado: true,
      }, { merge: true });

      toast.success("¡Registro completado exitosamente!");
      router.push("/dashboard");
    } catch (error) {
      console.error(error);
      toast.error("Error al guardar tus datos. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  if (step === 0) {
    return (
      <Card className="w-full max-w-md mx-auto shadow-lg bg-background border-primary/20">
        <CardHeader>
          <CardTitle className="text-2xl">Token de Invitación</CardTitle>
          <CardDescription>Ingresa el código que te envió tu tutor.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Token de acceso</Label>
              <Input
                placeholder="f0a1b2..."
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
              />
            </div>
            <Button className="w-full" disabled={!tokenInput} onClick={() => setStep(1)}>Validar Acceso</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (step === 1) {
    return (
      <Card className="w-full max-w-md mx-auto shadow-xl border-primary/10">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Paso 1: Identidad</CardTitle>
          <CardDescription>Vincula tu cuenta para asegurar tu acceso.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button className="w-full h-12 gap-2" onClick={handleAuth} disabled={loading}>
            {loading ? <Loader2 className="animate-spin h-5 w-5" /> : "G"}
            Continuar con Google
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-2xl border-raptor/20">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center gap-2">
          <ShieldCheck className="text-raptor h-6 w-6" />
          Paso 2: Registro Formal
        </CardTitle>
        <CardDescription>
          Asegúrate de que tus datos coincidan exactamente con tu documento de identidad.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="departamento"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 italic">
                      <MapPin className="h-4 w-4" /> Departamento
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona un departamento" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {COLOMBIA.map((d) => (
                          <SelectItem key={d.id} value={d.departamento}>
                            {d.departamento}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="municipio"
                render={({ field }) => (
                  <FormItem className="flex flex-col mt-0.5">
                    <FormLabel className="flex items-center gap-2 italic mb-2">
                      <MapPin className="h-4 w-4" /> Municipio
                    </FormLabel>
                    <Popover open={openMunicipio} onOpenChange={setOpenMunicipio}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                              "w-full justify-between font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                            disabled={!selectedDepto}
                          >
                            {field.value
                              ? municipios.find((m) => m === field.value)
                              : selectedDepto ? "Selecciona municipio..." : "Elige departamento primero"}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-[300px] p-0" align="start">
                        <Command>
                          <CommandInput placeholder="Buscar municipio..." />
                          <CommandList>
                            <CommandEmpty>No se encontró el municipio.</CommandEmpty>
                            <CommandGroup>
                              {municipios.map((m) => (
                                <CommandItem
                                  value={m}
                                  key={m}
                                  onSelect={() => {
                                    form.setValue("municipio", m);
                                    setOpenMunicipio(false);
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      m === field.value
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  {m}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="documento"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>N° de Documento</FormLabel>
                    <FormControl><Input placeholder="Escribe tu documento" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmar_documento"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirmar Documento</FormLabel>
                    <FormControl><Input placeholder="Vuelve a escribir tu documento" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="telefono"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Teléfono Celular</FormLabel>
                    <FormControl><Input placeholder="Escribe tu teléfono" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmar_telefono"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirmar Teléfono</FormLabel>
                    <FormControl><Input placeholder="Vuelve a escribir tu teléfono" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" className="w-full bg-raptor hover:bg-raptor/90 py-6 text-lg" disabled={loading}>
              {loading && <Loader2 className="mr-2 animate-spin" />}
              Completar Inscripción Final
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

export default function BridgePage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-4 pt-20">
      <Suspense fallback={<div className="flex justify-center mt-20"><Loader2 className="animate-spin h-10 w-10 text-raptor" /></div>}>
        <BridgeContent />
      </Suspense>
    </div>
  );
}
