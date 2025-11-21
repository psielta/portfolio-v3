'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { trpc } from '@/utils/trpc';
import { LandingOrbitViewer } from '@/components/landing-orbit-viewer';
import { OrbitControlsDrawer } from '@/components/orbit-controls-drawer';
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
  const healthCheck = useQuery(trpc.healthCheck.queryOptions());

  // State for orbit controls
  const [elements, setElements] = useState<OrbitalElements>(defaultElements);
  const [julianDate, setJulianDate] = useState(2460676.5); // 1 Jan 2025
  const [showPlanets, setShowPlanets] = useState(true);
  const [showVectors, setShowVectors] = useState(false);
  const [axisLimit, setAxisLimit] = useState<number | null>(30);
  const [animationSpeed, setAnimationSpeed] = useState(30);
  const [autoRotate, setAutoRotate] = useState(true);

  return (
    <div className="min-h-screen bg-background">
      {/* 3D Visualization */}
      <LandingOrbitViewer
        showPlanets={showPlanets}
        showVectors={showVectors}
        axisLimit={axisLimit}
        animationSpeed={animationSpeed}
        autoRotate={autoRotate}
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
