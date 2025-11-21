'use client';
import { Settings, Rocket, Pause, Play, RotateCw } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { OrbitalElements } from '@/lib/orbital-mechanics';

interface OrbitControlsDrawerProps {
  elements: OrbitalElements;
  julianDate: number;
  onElementsChange: (elements: OrbitalElements) => void;
  onDateChange: (date: number) => void;
  showPlanets: boolean;
  onShowPlanetsChange: (show: boolean) => void;
  showVectors: boolean;
  onShowVectorsChange: (show: boolean) => void;
  axisLimit: number | null;
  onAxisLimitChange: (limit: number | null) => void;
  animationSpeed: number;
  onAnimationSpeedChange: (speed: number) => void;
  autoRotate: boolean;
  onAutoRotateChange: (rotate: boolean) => void;
}

export function OrbitControlsDrawer({
  elements,
  julianDate,
  onElementsChange,
  onDateChange,
  showPlanets,
  onShowPlanetsChange,
  showVectors,
  onShowVectorsChange,
  axisLimit,
  onAxisLimitChange,
  animationSpeed,
  onAnimationSpeedChange,
  autoRotate,
  onAutoRotateChange,
}: OrbitControlsDrawerProps) {
  const isPaused = animationSpeed === 0;

  const handlePlayPause = () => {
    if (isPaused) {
      onAnimationSpeedChange(30);
    } else {
      onAnimationSpeedChange(0);
    }
  };

  const handleReset = () => {
    onDateChange(2460676.5); // Reset to 1 Jan 2025
    onAnimationSpeedChange(30);
    onAutoRotateChange(true);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="fixed bottom-6 right-6 z-40 h-14 w-14 rounded-full shadow-lg bg-card/95 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-all hover:scale-110"
        >
          <Settings className="h-6 w-6" />
          <span className="sr-only">Configurações Orbitais</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Rocket className="h-5 w-5" />
            Controles Orbitais
          </SheetTitle>
          <SheetDescription>
            Ajuste os parâmetros da visualização do sistema solar e explore órbitas personalizadas
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Animation Controls */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Controles de Animação</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePlayPause}
                  className="flex-1"
                >
                  {isPaused ? (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Reproduzir
                    </>
                  ) : (
                    <>
                      <Pause className="h-4 w-4 mr-2" />
                      Pausar
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleReset}
                  className="flex-1"
                >
                  <RotateCw className="h-4 w-4 mr-2" />
                  Reiniciar
                </Button>
              </div>

              <div className="space-y-2">
                <Label htmlFor="speed">Velocidade da Animação</Label>
                <Slider
                  id="speed"
                  min={0}
                  max={200}
                  step={10}
                  value={[animationSpeed]}
                  onValueChange={([value]) => {
                    onAnimationSpeedChange(value);
                  }}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  {animationSpeed === 0 ? 'Pausado' : `${animationSpeed}x velocidade`}
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="autoRotate"
                  checked={autoRotate}
                  onCheckedChange={(checked) => onAutoRotateChange(checked as boolean)}
                />
                <Label htmlFor="autoRotate" className="cursor-pointer">
                  Rotação Automática da Câmera
                </Label>
              </div>
            </CardContent>
          </Card>

          {/* Display Options */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Opções de Visualização</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="showPlanets"
                  checked={showPlanets}
                  onCheckedChange={(checked) => onShowPlanetsChange(checked as boolean)}
                />
                <Label htmlFor="showPlanets" className="cursor-pointer">
                  Mostrar Planetas
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="showVectors"
                  checked={showVectors}
                  onCheckedChange={(checked) => onShowVectorsChange(checked as boolean)}
                />
                <Label htmlFor="showVectors" className="cursor-pointer">
                  Mostrar Vetores Orbitais
                </Label>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="zoom">Zoom (Limite dos Eixos)</Label>
                <Slider
                  id="zoom"
                  min={5}
                  max={50}
                  step={5}
                  value={[axisLimit || 30]}
                  onValueChange={([value]) => onAxisLimitChange(value)}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  {axisLimit || 30} UA de distância
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Info Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Sobre o Sistema Solar</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Esta visualização mostra as órbitas reais dos planetas do nosso sistema solar,
                calculadas usando mecânica orbital Kepleriana. As posições dos planetas são
                atualizadas em tempo real baseadas em dados astronômicos precisos.
              </p>
              <Separator className="my-3" />
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Planetas visíveis:</span>
                  <span>8 planetas</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Escala:</span>
                  <span>Unidades Astronômicas (UA)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Precisão:</span>
                  <span>NASA/JPL</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Advanced Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Órbita Personalizada</CardTitle>
              <CardDescription>
                Para explorar órbitas personalizadas, visite a{' '}
                <a href="/orbits" className="text-primary hover:underline">
                  página de órbitas avançadas
                </a>
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </SheetContent>
    </Sheet>
  );
}
