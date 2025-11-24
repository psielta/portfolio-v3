'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { trpc } from '@/utils/trpc';
import { LandingOrbitViewerThreeSimple } from '@/components/landing-orbit-viewer-three-simple';
import { OrbitControlsDrawer } from '@/components/orbit-controls-drawer';
import { FloatingHeader } from '@/components/floating-header';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { Rocket, CheckSquare } from 'lucide-react';
import type { OrbitalElements } from '@/lib/orbital-mechanics';

// Default orbital elements for custom orbit (hidden by default)
const defaultElements: OrbitalElements = {
  qr: 1.0,
  ecc: 0.0167,
  inc: 0.0,
  raan: 0.0,
  omega: 102.9,
  tp: 2459580.5,
};

export default function Home() {
  const healthCheck = useQuery({
    queryKey: ['healthCheck'],
    queryFn: () => trpc.healthCheck.query(),
  });

  // State for orbit controls
  const [elements, setElements] = useState<OrbitalElements>(defaultElements);
  const [julianDate, setJulianDate] = useState(2460676.5); // 1 Jan 2025
  const [showPlanets, setShowPlanets] = useState(true);
  const [showVectors, setShowVectors] = useState(false);
  const [axisLimit, setAxisLimit] = useState<number | null>(30);
  const [animationSpeed, setAnimationSpeed] = useState(30);
  const [autoRotate, setAutoRotate] = useState(false); // Desabilitado por padrão

  return (
    <div className="h-screen w-screen overflow-hidden bg-black fixed inset-0">
      {/* Floating Header */}
      <FloatingHeader />

      {/* 3D Visualization */}
      <LandingOrbitViewerThreeSimple
        showPlanets={showPlanets}
        showVectors={showVectors}
        axisLimit={axisLimit}
        animationSpeed={animationSpeed}
        autoRotate={autoRotate}
        julianDate={julianDate}
      />

      {/* Orbit Controls Drawer */}
      <OrbitControlsDrawer
        elements={elements}
        julianDate={julianDate}
        onElementsChange={setElements}
        onDateChange={setJulianDate}
        showPlanets={showPlanets}
        onShowPlanetsChange={setShowPlanets}
        showVectors={showVectors}
        onShowVectorsChange={setShowVectors}
        axisLimit={axisLimit}
        onAxisLimitChange={setAxisLimit}
        animationSpeed={animationSpeed}
        onAnimationSpeedChange={setAnimationSpeed}
        autoRotate={autoRotate}
        onAutoRotateChange={setAutoRotate}
      />
    </div>
  );
}
