'use client';

import { useState } from 'react';
import { OrbitViewer } from '@/components/orbit-viewer';
import { OrbitControls } from '@/components/orbit-controls';
import type { OrbitalElements } from '@/lib/orbital-mechanics';
import { cal2jd } from '@/lib/orbital-mechanics';

export default function OrbitsPage() {
  // Initialize with Earth-like orbit
  const today = new Date();
  const initialJulianDate = cal2jd(
    today.getFullYear(),
    today.getMonth() + 1,
    today.getDate()
  );

  const [elements, setElements] = useState<OrbitalElements>({
    qr: 1.0, // 1 AU perihelion
    ecc: 0.0167, // Earth's eccentricity
    inc: 0.0, // Near-zero inclination
    raan: 0.0, // Ascending node
    omega: 102.9, // Argument of perihelion
    tp: initialJulianDate - 3, // A few days ago
  });

  const [julianDate, setJulianDate] = useState(initialJulianDate);
  const [showPlanets, setShowPlanets] = useState(true);
  const [showVectors, setShowVectors] = useState(false);
  const [axisLimit, setAxisLimit] = useState<number | null>(null);

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Visualização de Mecânica Orbital</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Visualização 3D interativa de órbitas planetárias. Ajuste os elementos orbitais para ver como
          eles afetam a forma e orientação da órbita.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <OrbitViewer
            elements={elements}
            julianDate={julianDate}
            showPlanets={showPlanets}
            showVectors={showVectors}
            axisLimit={axisLimit}
          />
        </div>

        <div className="lg:col-span-1">
          <OrbitControls
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
          />
        </div>
      </div>

      <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">Sobre os Elementos Orbitais</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h3 className="font-semibold mb-2">Distância do Periélio (qr)</h3>
            <p className="text-gray-600 dark:text-gray-400">
              A menor distância entre o corpo em órbita e o Sol, medida em
              Unidades Astronômicas (UA) ou quilômetros.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Excentricidade (ecc)</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Determina a forma da órbita. 0 = circular, 0-1 = elíptica, 1 = parabólica,
              &gt;1 = hiperbólica.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Inclinação (inc)</h3>
            <p className="text-gray-600 dark:text-gray-400">
              A inclinação do plano orbital em relação ao plano da eclíptica, medida em graus.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">RAAN</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Ascensão Reta do Nodo Ascendente - o ângulo da direção de referência até o
              ponto onde a órbita cruza o plano da eclíptica indo para o norte.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Argumento do Periélio (ω)</h3>
            <p className="text-gray-600 dark:text-gray-400">
              O ângulo do nodo ascendente até o periélio, definindo a orientação da
              elipse no plano orbital.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Tempo do Periélio (tp)</h3>
            <p className="text-gray-600 dark:text-gray-400">
              A Data Juliana quando o corpo passa pelo periélio (aproximação mais próxima do
              Sol).
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4 text-center text-sm text-gray-500">
        <p>
          Cálculos de mecânica orbital adaptados do NASA JPL Solar System Dynamics
        </p>
        <p className="mt-1">
          Fonte original:{' '}
          <a
            href="https://ssd.jpl.nasa.gov/tools/orbit_diagram.html"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            NASA JPL Orbit Diagram Tool
          </a>
        </p>
      </div>
    </div>
  );
}
