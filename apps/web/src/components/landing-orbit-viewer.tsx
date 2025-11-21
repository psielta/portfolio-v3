'use client';

import { useEffect, useRef, useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { useTheme } from 'next-themes';
import Plotly from 'plotly.js-dist-min';
import {
  propagateKepler,
  getOsculatingElements,
  getOrbitData,
  PLANET_LIST,
  type OrbitalElements,
  type Planet,
  type StateVector,
} from '@/lib/orbital-mechanics';

// Dynamic import to avoid SSR issues with Plotly
const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

const INITIAL_JULIAN_DATE = 2460676.5; // 1 Jan 2025

type PrecomputedPlanetData = {
  orbitX: number[];
  orbitY: number[];
  orbitZ: number[];
  baseState: StateVector;
};

interface LandingOrbitViewerProps {
  showPlanets?: boolean;
  showVectors?: boolean;
  axisLimit?: number | null;
  animationSpeed?: number;
  autoRotate?: boolean;
}

export function LandingOrbitViewer({
  showPlanets = true,
  showVectors = false,
  axisLimit = 30,
  animationSpeed = 50,
  autoRotate = true,
}: LandingOrbitViewerProps) {
  const { theme } = useTheme();
  const animationRef = useRef<number>();
  const currentJulianDateRef = useRef(INITIAL_JULIAN_DATE);
  const [isUserInteracting, setIsUserInteracting] = useState(false);
  const plotRef = useRef<any>(null);

  const isDark = theme === 'dark';

  // Color theme configuration
  const bgColor = isDark ? 'rgb(15, 23, 42)' : 'white';
  const gridColor = isDark ? 'rgb(51, 65, 85)' : 'rgb(220, 220, 220)';
  const textColor = isDark ? 'rgb(226, 232, 240)' : 'rgb(0, 0, 0)';
  const orbitColor = isDark ? 'rgba(147, 197, 253, 0.5)' : 'rgba(59, 130, 246, 0.5)';
  const sunColor = isDark ? '#FDB813' : '#FFA500';

  // Planet Portuguese names
  const planetNamesPt: Record<string, string> = {
    Mercury: 'Mercúrio',
    Venus: 'Vênus',
    Earth: 'Terra',
    Mars: 'Marte',
    Jupiter: 'Júpiter',
    Saturn: 'Saturno',
    Uranus: 'Urano',
    Neptune: 'Netuno',
    Pluto: 'Plutão',
  };

  // Planet colors
  const planetColors: Record<string, string> = {
    Mercury: '#8C7853',
    Venus: '#FFC649',
    Earth: '#4A90E2',
    Mars: '#CD5C5C',
    Jupiter: '#DAA520',
    Saturn: '#F4C542',
    Uranus: '#4FD0E7',
    Neptune: '#4166F5',
    Pluto: '#9B9B9B',
  };

  const precomputedPlanets = useMemo<Record<Planet, PrecomputedPlanetData> | null>(() => {
    if (!showPlanets) return null;

    const result = {} as Record<Planet, PrecomputedPlanetData>;
    const sampleStep = 4; // downsample orbit paths to reduce Plotly load

    PLANET_LIST.forEach((planet) => {
      const elements = getOsculatingElements(planet as Planet);
      const orbit = getOrbitData(elements, INITIAL_JULIAN_DATE);

      const orbitX = orbit.x.filter((_, idx) => idx % sampleStep === 0);
      const orbitY = orbit.y.filter((_, idx) => idx % sampleStep === 0);
      const orbitZ = orbit.z.filter((_, idx) => idx % sampleStep === 0);

      result[planet as Planet] = {
        orbitX,
        orbitY,
        orbitZ,
        baseState: orbit.refState,
      };
    });

    return result;
  }, [showPlanets]);

  const precomputedPlanetsRef = useRef(precomputedPlanets);
  useEffect(() => {
    precomputedPlanetsRef.current = precomputedPlanets;
  }, [precomputedPlanets]);

  // Animation effect - only animate when user is not interacting
  useEffect(() => {
    let lastUpdate = performance.now();

    const animate = () => {
      const now = performance.now();
      const delta = now - lastUpdate;

      if (
        animationSpeed > 0 &&
        !isUserInteracting &&
        delta >= 100 &&
        precomputedPlanetsRef.current &&
        plotRef.current
      ) {
        lastUpdate = now;
        currentJulianDateRef.current += animationSpeed * 0.06;

        PLANET_LIST.forEach((planet, index) => {
          const precomputed = precomputedPlanetsRef.current?.[planet as Planet];
          if (!precomputed) return;

          const dt = currentJulianDateRef.current - INITIAL_JULIAN_DATE;
          const state =
            dt === 0
              ? precomputed.baseState
              : propagateKepler(precomputed.baseState.pos, precomputed.baseState.vel, dt);
          const position = state.pos;

          // Sun is trace 0, then for each planet: orbit (1 + i*2), marker (2 + i*2)
          const markerIndex = 2 + index * 2;
          Plotly.restyle(
            plotRef.current,
            {
              x: [[position[0]]],
              y: [[position[1]]],
              z: [[position[2]]],
            },
            markerIndex
          );
        });
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [animationSpeed, isUserInteracting]);

  // Generate initial orbit data (static). Planet positions are updated imperativamente via Plotly.restyle.
  const orbitData = useMemo(() => {
    const data: any[] = [];

    // Add Sun
    data.push({
      x: [0],
      y: [0],
      z: [0],
      mode: 'markers',
      type: 'scatter3d',
      name: 'Sol',
      marker: {
        size: 15,
        color: sunColor,
        symbol: 'circle',
      },
      hovertemplate: '<b>Sol</b><extra></extra>',
    });

    if (!showPlanets || !precomputedPlanets) return data;

    // Add planets
    PLANET_LIST.forEach((planet) => {
      const planetKey = planet as Planet;
      const precomputed = precomputedPlanets[planetKey];

      // Use pre-generated orbit path from getOrbitData
      const orbitX = precomputed.orbitX;
      const orbitY = precomputed.orbitY;
      const orbitZ = precomputed.orbitZ;

      // Add orbit line
      data.push({
        x: orbitX,
        y: orbitY,
        z: orbitZ,
        mode: 'lines',
        type: 'scatter3d',
        name: `Órbita de ${planetNamesPt[planet]}`,
        line: {
          color: orbitColor,
          width: 2,
        },
        hoverinfo: 'skip',
        showlegend: false,
      });

      // Initial position from precomputed base state (will be updated via Plotly.restyle)
      const position = precomputed.baseState.pos;

      // Add planet marker
      data.push({
        x: [position[0]],
        y: [position[1]],
        z: [position[2]],
        mode: 'markers+text',
        type: 'scatter3d',
        name: planetNamesPt[planet],
        marker: {
          size: planet === 'Jupiter' ? 10 : planet === 'Saturn' ? 9 : 6,
          color: planetColors[planet],
          symbol: 'circle',
        },
        text: [planetNamesPt[planet]],
        textposition: 'top center',
        textfont: {
          color: textColor,
          size: 10,
        },
        hovertemplate: `<b>${planetNamesPt[planet]}</b><br>` +
          `Distância: ${Math.sqrt(position[0]**2 + position[1]**2 + position[2]**2).toFixed(2)} UA<br>` +
          `<extra></extra>`,
      });
    });

    return data;
  }, [showPlanets, isDark, sunColor, textColor, precomputedPlanets]);

  const layout = useMemo(() => ({
    scene: {
      xaxis: {
        title: 'X (UA)',
        gridcolor: gridColor,
        showbackground: true,
        backgroundcolor: bgColor,
        zerolinecolor: gridColor,
        range: axisLimit ? [-axisLimit, axisLimit] : [-40, 40],
      },
      yaxis: {
        title: 'Y (UA)',
        gridcolor: gridColor,
        showbackground: true,
        backgroundcolor: bgColor,
        zerolinecolor: gridColor,
        range: axisLimit ? [-axisLimit, axisLimit] : [-40, 40],
      },
      zaxis: {
        title: 'Z (UA)',
        gridcolor: gridColor,
        showbackground: true,
        backgroundcolor: bgColor,
        zerolinecolor: gridColor,
        range: axisLimit ? [-axisLimit / 4, axisLimit / 4] : [-10, 10],
      },
      aspectmode: 'manual',
      aspectratio: { x: 1, y: 1, z: 0.25 },
      camera: {
        eye: { x: 1.5, y: 1.5, z: 0.7 },
        center: { x: 0, y: 0, z: 0 },
      },
    },
    paper_bgcolor: bgColor,
    plot_bgcolor: bgColor,
    font: { color: textColor },
    showlegend: false,
    margin: { t: 0, r: 0, b: 0, l: 0 },
    hoverlabel: {
      bgcolor: isDark ? 'rgb(30, 41, 59)' : 'white',
      font: { color: textColor },
      bordercolor: isDark ? 'rgb(51, 65, 85)' : 'rgb(220, 220, 220)',
    },
    dragmode: 'turntable',
    hovermode: 'closest',
  }), [isDark, bgColor, gridColor, textColor, axisLimit]);

  const config = {
    responsive: true,
    displayModeBar: false,
    doubleClick: 'reset',
    scrollZoom: true,
  };

  return (
    <div
      style={{ width: '100%', height: '100vh' }}
      onMouseDown={() => setIsUserInteracting(true)}
      onMouseUp={() => setIsUserInteracting(false)}
      onWheel={() => {
        // Evitar múltiplos setState durante scroll contínuo
        if (!isUserInteracting) {
          setIsUserInteracting(true);
          setTimeout(() => setIsUserInteracting(false), 800);
        }
      }}
    >
      <Plot
        data={orbitData}
        layout={layout as any}
        config={config}
        onInitialized={(_, graphDiv) => {
          plotRef.current = graphDiv;
        }}
        onUpdate={(_, graphDiv) => {
          plotRef.current = graphDiv;
        }}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
}
