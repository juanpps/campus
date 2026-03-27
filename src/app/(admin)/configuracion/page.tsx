"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Settings,
  Image as ImageIcon,
  ShieldAlert,
  Calendar,
  Quote,
  ExternalLink,
  History,
  Save,
  RefreshCw
} from "lucide-react";
import { toast } from "sonner";
import { getGlobalConfig, updateGlobalConfig } from "@/actions/config";

export default function AdminConfigPage() {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [config, setConfig] = useState<any>({
    fecha_icfes: "",
    frase_motivacional: "",
    modo_mantenimiento: false,
    mensaje_mantenimiento: ""
  });

  useEffect(() => {
    async function load() {
      const res = await getGlobalConfig();
      if (res.success) setConfig(res.data);
      setFetching(false);
    }
    load();
  }, []);

  const handleSave = async (section: string, data: any) => {
    setLoading(true);
    try {
      const res = await updateGlobalConfig(data);
      if (res.success) {
        toast.success(`Configuración updated: ${section}`);
      }
    } catch (e) {
      toast.error("Error al guardar");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="p-20 text-center"><RefreshCw className="animate-spin mx-auto h-8 w-8 text-raptor" /></div>;

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-4 md:p-6 lg:p-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Configuración del Campus</h1>
          <p className="text-muted-foreground">Orquesta la infraestructura, visuales y modo de operación del Método Raptor.</p>
        </div>
        <Badge variant="outline" className="w-fit h-fit px-4 py-1 border-raptor/20 text-raptor bg-raptor/5">
          Release v1.0.0
        </Badge>
      </header>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="bg-muted/50 p-1">
          <TabsTrigger value="general" className="gap-2">
            <Settings className="h-4 w-4" /> General
          </TabsTrigger>
          <TabsTrigger value="visuales" className="gap-2">
            <ImageIcon className="h-4 w-4" /> Visuales
          </TabsTrigger>
          <TabsTrigger value="infraestructura" className="gap-2">
            <ShieldAlert className="h-4 w-4" /> Seguridad
          </TabsTrigger>
          <TabsTrigger value="apps" className="gap-2">
            <ExternalLink className="h-4 w-4" /> Apps
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6 outline-none">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Fecha ICFES */}
            <Card className="border-raptor/10 shadow-sm overflow-hidden group">
              <CardHeader className="bg-raptor/5 border-b border-raptor/10">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-raptor" /> Fecha del Próximo ICFES
                </CardTitle>
                <CardDescription>Define la meta temporal para todos los estudiantes.</CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fecha-icfes">Fecha del Examen</Label>
                  <Input
                    id="fecha-icfes"
                    type="date"
                    value={config.fecha_icfes}
                    onChange={(e) => setConfig({ ...config, fecha_icfes: e.target.value })}
                    className="max-w-[200px]"
                  />
                </div>
                <Button
                  onClick={() => handleSave("Fecha ICFES", { fecha_icfes: config.fecha_icfes })}
                  className="bg-raptor hover:bg-raptor/90 text-white"
                  disabled={loading}
                >
                  {loading ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                  Actualizar Meta
                </Button>
              </CardContent>
            </Card>

            {/* Frase Motivacional */}
            <Card className="border-blue-500/10 shadow-sm overflow-hidden">
              <CardHeader className="bg-blue-500/5 border-b border-blue-500/10">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Quote className="h-5 w-5 text-blue-500" /> Frase del Día (Glow Highlight)
                </CardTitle>
                <CardDescription>Aparecerá en el Dashboard de todos los estudiantes.</CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="frase">Contenido de la Frase</Label>
                  <Textarea
                    id="frase"
                    value={config.frase_motivacional}
                    onChange={(e) => setConfig({ ...config, frase_motivacional: e.target.value })}
                    placeholder="Escribe algo inspirador..."
                    className="resize-none min-h-[100px]"
                  />
                </div>
                <Button
                  variant="outline"
                  onClick={() => handleSave("Frase Motivacional", { frase_motivacional: config.frase_motivacional })}
                  disabled={loading}
                >
                  Publicar Frase
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="infraestructura" className="space-y-6 outline-none">
          {/* Modo Mantenimiento */}
          <Card className="border-destructive/20 shadow-md">
            <CardHeader className="bg-destructive/5 space-y-1">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl flex items-center gap-2 text-destructive uppercase tracking-widest text-xs font-black">
                  <ShieldAlert className="h-5 w-5" /> Protocolo de Emergencia
                </CardTitle>
                <Switch
                  checked={config.modo_mantenimiento}
                  onCheckedChange={(val: boolean) => {
                    setConfig({ ...config, modo_mantenimiento: val });
                    handleSave("Modo Mantenimiento", { modo_mantenimiento: val });
                  }}
                  className="data-[state=checked]:bg-destructive"
                />
              </div>
              <CardDescription>
                Al activar el Modo Mantenimiento, se denegará el acceso a todos los estudiantes.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="msg-mantenimiento">Mensaje para Estudiantes</Label>
                <Textarea
                  id="msg-mantenimiento"
                  value={config.mensaje_mantenimiento}
                  onChange={(e) => setConfig({ ...config, mensaje_mantenimiento: e.target.value })}
                  onBlur={() => handleSave("Mensaje Mantenimiento", { mensaje_mantenimiento: config.mensaje_mantenimiento })}
                  placeholder="Explica qué está sucediendo..."
                  className="resize-none"
                />
              </div>
              <div className="bg-muted p-4 rounded-lg flex items-start gap-3 border">
                <History className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium">Última activación:</p>
                  <p className="text-muted-foreground italic">24 de Marzo, 2026 - Duración: 2h 15m</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Secciones de Banners y Apps (Phase 10 Future Expansion Templates) */}
        <TabsContent value="visuales">
          <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-xl opacity-60">
            <ImageIcon className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">Gestión de Banners (Cloudinary)</h3>
            <p className="text-sm text-muted-foreground">Módulo listo para integración de API Cloudinary.</p>
          </div>
        </TabsContent>

        <TabsContent value="apps">
          <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-xl opacity-60">
            <ExternalLink className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">Marketplace de Apps Externas</h3>
            <p className="text-sm text-muted-foreground">Configura herramientas como SimuLatam o Canales de WhatsApp.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
