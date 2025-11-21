'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { OrbitalElements } from '@/lib/orbital-mechanics';
import { cal2jd, jd2cal, GM, RMAX, AU2KM, KM2AU, DAY2SEC } from '@/lib/orbital-mechanics';

interface OrbitControlsProps {
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
}

type Unit = 'au' | 'km';

export function OrbitControls({
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
}: OrbitControlsProps) {
  const [units, setUnits] = useState<Unit>('au');
  const [useAxisLimit, setUseAxisLimit] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleElementChange = (field: keyof OrbitalElements, value: string) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return;

    let finalValue = numValue;
    if (field === 'qr' && units === 'km') {
      finalValue = numValue * KM2AU;
    }

    // Validate input
    const validRanges: Record<keyof OrbitalElements, [number, number]> = {
      qr: [0.01, RMAX * 0.95],
      ecc: [0, 10],
      inc: [0, 180],
      raan: [0, 360],
      omega: [0, 360],
      tp: [2300000, 2600000],
    };

    const range = validRanges[field];
    if (finalValue < range[0] || finalValue > range[1]) {
      setErrors({
        ...errors,
        [field]: `Deve estar entre ${range[0]} e ${range[1]}`,
      });
      return;
    }

    setErrors({ ...errors, [field]: '' });
    onElementsChange({ ...elements, [field]: finalValue });
  };

  const handleDateChange = (value: string) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return;

    if (numValue < 2300000 || numValue > 2600000) {
      setErrors({ ...errors, date: 'Deve estar entre 2300000 e 2600000' });
      return;
    }

    setErrors({ ...errors, date: '' });
    onDateChange(numValue);
  };

  const handleUnitsChange = (newUnits: Unit) => {
    if (newUnits === units) return;

    const newQr = units === 'au' ? elements.qr * AU2KM : elements.qr * KM2AU;
    onElementsChange({ ...elements, qr: newQr });
    setUnits(newUnits);
  };

  const handleAxisLimitToggle = (checked: boolean) => {
    setUseAxisLimit(checked);
    if (!checked) {
      onAxisLimitChange(null);
    }
  };

  const handleAxisLimitChange = (value: string) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return;

    if (numValue < 1 || numValue > RMAX) {
      setErrors({ ...errors, axisLimit: `Deve estar entre 1 e ${RMAX}` });
      return;
    }

    setErrors({ ...errors, axisLimit: '' });
    onAxisLimitChange(numValue);
  };

  // Calculate derived properties
  const sma = elements.qr / (1 - elements.ecc);
  const period = 2 * Math.PI * Math.sqrt((sma * sma * sma) / GM);
  const n = Math.sqrt(GM / sma / sma / sma);
  const vper = Math.sqrt((2 * GM) / elements.qr - GM / sma) * AU2KM / DAY2SEC;
  const vapo =
    Math.sqrt((2 * GM) / (sma * (1 + elements.ecc)) - GM / sma) * AU2KM / DAY2SEC;

  let orbitType = 'Circular';
  let smaDisplay = sma.toFixed(2);
  let periodDisplay = period.toFixed(2);
  let nDisplay = n.toExponential(4);
  let vapoDisplay = vapo.toFixed(2);

  if (elements.ecc > 0 && elements.ecc < 1) {
    orbitType = 'Elíptica';
  } else if (elements.ecc === 1) {
    orbitType = 'Parabólica';
    smaDisplay = 'Inf';
    periodDisplay = 'N/A';
    nDisplay = 'N/A';
    vapoDisplay = 'N/A';
  } else if (elements.ecc > 1) {
    orbitType = 'Hiperbólica';
    periodDisplay = 'N/A';
    nDisplay = 'N/A';
    vapoDisplay = 'N/A';
  }

  const periDate = jd2cal(elements.tp);
  const currentDate = jd2cal(julianDate);

  const displayQr = units === 'au' ? elements.qr : elements.qr * AU2KM;

  return (
    <Tabs defaultValue="elements" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="elements">Elementos</TabsTrigger>
        <TabsTrigger value="display">Visualização</TabsTrigger>
        <TabsTrigger value="info">Informações</TabsTrigger>
      </TabsList>

      <TabsContent value="elements" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Elementos Orbitais</CardTitle>
            <CardDescription>
              Defina os parâmetros da órbita personalizada
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="qr">Distância do Periélio</Label>
              <div className="flex gap-2">
                <Input
                  id="qr"
                  type="number"
                  step={units === 'au' ? 0.1 : 10000000}
                  value={displayQr.toFixed(units === 'au' ? 2 : 0)}
                  onChange={(e) => handleElementChange('qr', e.target.value)}
                  className={errors.qr ? 'border-red-500' : ''}
                />
                <Select value={units} onValueChange={(value) => handleUnitsChange(value as Unit)}>
                  <SelectTrigger className="w-[100px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="au">UA</SelectItem>
                    <SelectItem value="km">km</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {errors.qr && <p className="text-red-500 text-sm">{errors.qr}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="ecc">Excentricidade</Label>
              <Input
                id="ecc"
                type="number"
                step="0.01"
                value={elements.ecc}
                onChange={(e) => handleElementChange('ecc', e.target.value)}
                className={errors.ecc ? 'border-red-500' : ''}
              />
              {errors.ecc && <p className="text-red-500 text-sm">{errors.ecc}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="inc">Inclinação (graus)</Label>
              <Input
                id="inc"
                type="number"
                step="0.1"
                value={elements.inc}
                onChange={(e) => handleElementChange('inc', e.target.value)}
                className={errors.inc ? 'border-red-500' : ''}
              />
              {errors.inc && <p className="text-red-500 text-sm">{errors.inc}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="raan">RAAN (graus)</Label>
              <Input
                id="raan"
                type="number"
                step="1"
                value={elements.raan}
                onChange={(e) => handleElementChange('raan', e.target.value)}
                className={errors.raan ? 'border-red-500' : ''}
              />
              {errors.raan && <p className="text-red-500 text-sm">{errors.raan}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="omega">Argumento do Periélio (graus)</Label>
              <Input
                id="omega"
                type="number"
                step="1"
                value={elements.omega}
                onChange={(e) => handleElementChange('omega', e.target.value)}
                className={errors.omega ? 'border-red-500' : ''}
              />
              {errors.omega && <p className="text-red-500 text-sm">{errors.omega}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="tp">Tempo do Periélio (JD)</Label>
              <Input
                id="tp"
                type="number"
                step="1"
                value={elements.tp}
                onChange={(e) => handleElementChange('tp', e.target.value)}
                className={errors.tp ? 'border-red-500' : ''}
              />
              {errors.tp && <p className="text-red-500 text-sm">{errors.tp}</p>}
              <p className="text-sm text-muted-foreground">Data: {periDate.string}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Data de Observação</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="date">Data Juliana</Label>
              <Input
                id="date"
                type="number"
                step="1"
                value={julianDate}
                onChange={(e) => handleDateChange(e.target.value)}
                className={errors.date ? 'border-red-500' : ''}
              />
              {errors.date && <p className="text-red-500 text-sm">{errors.date}</p>}
              <p className="text-sm text-muted-foreground">Calendário: {currentDate.string}</p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="display" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Opções de Visualização</CardTitle>
            <CardDescription>
              Controle o que é exibido no gráfico 3D
            </CardDescription>
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
                Mostrar Vetores (h, e)
              </Label>
            </div>

            <Separator />

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="useAxisLimit"
                  checked={useAxisLimit}
                  onCheckedChange={(checked) => handleAxisLimitToggle(checked as boolean)}
                />
                <Label htmlFor="useAxisLimit" className="cursor-pointer">
                  Limite Personalizado dos Eixos
                </Label>
              </div>
              {useAxisLimit && (
                <div className="pl-6 space-y-2">
                  <Input
                    id="axisLimit"
                    type="number"
                    step="1"
                    value={axisLimit || 10}
                    onChange={(e) => handleAxisLimitChange(e.target.value)}
                    className={errors.axisLimit ? 'border-red-500' : ''}
                  />
                  {errors.axisLimit && (
                    <p className="text-red-500 text-sm">{errors.axisLimit}</p>
                  )}
                  <p className="text-sm text-muted-foreground">Em UA (Unidades Astronômicas)</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="info" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Propriedades Derivadas</CardTitle>
            <CardDescription>
              Informações calculadas a partir dos elementos orbitais
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-medium text-muted-foreground">Tipo de Órbita</p>
                <p className="text-lg font-semibold">{orbitType}</p>
              </div>
              <div>
                <p className="font-medium text-muted-foreground">Semi-eixo Maior</p>
                <p className="text-lg font-semibold">{smaDisplay} UA</p>
              </div>
              <div>
                <p className="font-medium text-muted-foreground">Período Orbital</p>
                <p className="text-lg font-semibold">{periodDisplay} dias</p>
              </div>
              <div>
                <p className="font-medium text-muted-foreground">Movimento Médio</p>
                <p className="text-lg font-semibold">{nDisplay} rad/dia</p>
              </div>
              <div>
                <p className="font-medium text-muted-foreground">Velocidade no Periélio</p>
                <p className="text-lg font-semibold">{vper.toFixed(2)} km/s</p>
              </div>
              <div>
                <p className="font-medium text-muted-foreground">Velocidade no Afélio</p>
                <p className="text-lg font-semibold">{vapoDisplay} km/s</p>
              </div>
            </div>

            <Separator className="my-4" />

            <div>
              <p className="font-medium text-muted-foreground mb-1">Data do Periélio</p>
              <p className="text-sm">{periDate.string}</p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
