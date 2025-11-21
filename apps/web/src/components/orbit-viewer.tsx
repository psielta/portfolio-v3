'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { useTheme } from 'next-themes';
import type { PlotParams } from 'react-plotly.js';
import {
  type OrbitalElements,
  type Planet,
  PLANET_LIST,
  PLANET_COLORS,
  getOrbitData,
  getOsculatingElements,
  getLineOfNodes,
  getAngularMomentumVector,
  getEccentricityVector,
  jd2cal,
  ma2ta,
  elem2cart,
  GM,
  AU2KM,
  DAY2SEC,
} from '@/lib/orbital-mechanics';

// Dynamic import to avoid SSR issues with Plotly
const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

interface OrbitViewerProps {
  elements: OrbitalElements;
  julianDate: number;
  showPlanets?: boolean;
  showVectors?: boolean;
  axisLimit?: number | null;
}

export function OrbitViewer({
  elements,
  julianDate,
  showPlanets = true,
  showVectors = false,
  axisLimit = null,
}: OrbitViewerProps) {
  const [cameraAngle, setCameraAngle] = useState<[number, number]>([45, 45]);
  const { theme, systemTheme } = useTheme();
  const currentTheme = theme === 'system' ? systemTheme : theme;
  const isDark = currentTheme === 'dark';

  // Calculate orbit data
  const orbitData = getOrbitData(elements, julianDate);
  const lineOfNodes = getLineOfNodes(elements);
  const angularMomentum = getAngularMomentumVector(elements);
  const eccentricity = getEccentricityVector(elements);
  const calDate = jd2cal(julianDate);

  const maxRange = axisLimit || orbitData.maxRange;

  // Scale for angular momentum vector
  const h = Math.sqrt(elements.qr * GM * (1 + elements.ecc));
  let scaleNormal =
    ((h * h) / GM / (1 - elements.ecc * elements.ecc)) * 0.67;
  if (
    elements.ecc >= 1 ||
    (h * h) / GM / (1 - elements.ecc) > maxRange / 3
  ) {
    scaleNormal = maxRange / 3;
  }

  // Build traces
  const traces: PlotParams['data'] = [];

  // User-defined orbit
  traces.push({
    type: 'scatter3d',
    mode: 'lines',
    name: 'Órbita personalizada',
    x: orbitData.x,
    y: orbitData.y,
    z: orbitData.z,
    hovertemplate:
      '<b>Órbita personalizada</b><br>' +
      'X: %{x:.3e} UA<br>' +
      'Y: %{y:.3e} UA<br>' +
      'Z: %{z:.3e} UA<extra></extra>',
    line: {
      width: 5,
      color: 'cornflowerblue',
    },
    hoverlabel: {
      font: { color: 'white' },
    },
  } as any);

  // User-defined body at reference date
  traces.push({
    type: 'scatter3d',
    mode: 'markers',
    name: 'Corpo personalizado',
    x: [orbitData.refState.pos[0]],
    y: [orbitData.refState.pos[1]],
    z: [orbitData.refState.pos[2]],
    hovertemplate:
      '<b>Corpo personalizado</b><br>' +
      'X: %{x:.3e} UA<br>' +
      'Y: %{y:.3e} UA<br>' +
      'Z: %{z:.3e} UA<extra></extra>',
    marker: {
      color: 'cornflowerblue',
      size: 5,
    },
    hoverlabel: {
      font: { color: 'white' },
    },
    showlegend: false,
  } as any);

  // Line of nodes - ascending
  traces.push({
    type: 'scatter3d',
    mode: 'lines',
    name: 'Linha dos nodos (ascendente)',
    x: [0, lineOfNodes.ascending.x],
    y: [0, lineOfNodes.ascending.y],
    z: [0, lineOfNodes.ascending.z],
    hoverinfo: 'none',
    line: {
      width: 2,
      dash: 'solid',
      color: 'cornflowerblue',
    },
    showlegend: false,
  } as any);

  // Line of nodes - descending
  traces.push({
    type: 'scatter3d',
    mode: 'lines',
    name: 'Linha dos nodos (descendente)',
    x: [0, lineOfNodes.descending.x],
    y: [0, lineOfNodes.descending.y],
    z: [0, lineOfNodes.descending.z],
    hoverinfo: 'none',
    line: {
      width: 4,
      dash: 'dash',
      color: 'cornflowerblue',
    },
    showlegend: false,
  } as any);

  // Sun
  traces.push({
    type: 'scatter3d',
    mode: 'markers',
    name: 'Sol',
    x: [0],
    y: [0],
    z: [0],
    hoverinfo: 'name',
    marker: {
      color: 'orange',
      size: 4,
    },
    showlegend: false,
  } as any);

  // Add planets
  if (showPlanets) {
    PLANET_LIST.forEach((planet, idx) => {
      const planetElem = getOsculatingElements(planet);
      const visible = 2 * maxRange * maxRange >= planetElem.r45 * planetElem.r45;

      if (visible) {
        const planetOrbit = getOrbitData(
          {
            qr: planetElem.qr,
            ecc: planetElem.ecc,
            inc: planetElem.inc,
            raan: planetElem.raan,
            omega: planetElem.omega,
            tp: planetElem.tp,
          },
          julianDate
        );

        // Planet orbit
        traces.push({
          type: 'scatter3d',
          mode: 'lines',
          name: planet,
          x: planetOrbit.x,
          y: planetOrbit.y,
          z: planetOrbit.z,
          hovertemplate: `<b>Órbita de ${planet}</b><extra></extra>`,
          line: {
            width: 2,
            color: PLANET_COLORS[idx],
          },
          showlegend: true,
        } as any);

        // Planet position
        const ta = ma2ta(
          planetElem.ecc,
          Math.sqrt(GM / Math.pow(planetElem.qr * (1 + planetElem.ecc), 3)) *
            (julianDate - planetElem.tp)
        );
        const pplelem = [
          Math.sqrt(planetElem.qr * (1 + planetElem.ecc) * GM),
          planetElem.ecc,
          planetElem.inc,
          planetElem.raan,
          planetElem.omega,
          ta * (180 / Math.PI),
        ];
        const planetPos = elem2cart(pplelem);

        traces.push({
          type: 'scatter3d',
          mode: 'markers',
          name: planet,
          x: [planetPos.pos[0]],
          y: [planetPos.pos[1]],
          z: [planetPos.pos[2]],
          hoverinfo: 'name',
          marker: {
            color: PLANET_COLORS[idx],
            size: 4,
          },
          showlegend: false,
        } as any);
      }
    });
  }

  // Angular momentum vector
  if (showVectors) {
    traces.push({
      type: 'scatter3d',
      mode: 'lines',
      name: 'Normal ao plano orbital',
      x: [0, angularMomentum.x * scaleNormal],
      y: [0, angularMomentum.y * scaleNormal],
      z: [0, angularMomentum.z * scaleNormal],
      hoverinfo: 'none',
      line: {
        width: 2,
        dash: 'solid',
        color: 'cornflowerblue',
      },
      showlegend: false,
    } as any);

    traces.push({
      type: 'scatter3d',
      mode: 'text',
      x: [angularMomentum.x * scaleNormal],
      y: [angularMomentum.y * scaleNormal],
      z: [angularMomentum.z * scaleNormal],
      text: ['<b>h</b>'],
      textfont: { size: 10 },
      showlegend: false,
    } as any);

    // Eccentricity vector
    traces.push({
      type: 'scatter3d',
      mode: 'lines',
      name: 'Vetor excentricidade',
      x: [0, eccentricity.x],
      y: [0, eccentricity.y],
      z: [0, eccentricity.z],
      hoverinfo: 'none',
      line: {
        width: 2,
        dash: 'solid',
        color: 'cornflowerblue',
      },
      showlegend: false,
    } as any);

    traces.push({
      type: 'scatter3d',
      mode: 'text',
      x: [eccentricity.x],
      y: [eccentricity.y],
      z: [eccentricity.z],
      text: ['<b>e</b>'],
      textfont: { size: 10 },
      showlegend: false,
    } as any);
  }

  // Theme-aware colors
  const bgColor = isDark ? 'rgb(15, 23, 42)' : 'white';
  const gridColor = isDark ? 'rgb(51, 65, 85)' : 'rgb(220, 220, 220)';
  const textColor = isDark ? 'rgb(226, 232, 240)' : 'black';
  const paperBgColor = isDark ? 'rgb(15, 23, 42)' : 'white';

  const layout: Partial<PlotParams['layout']> = {
    height: 700,
    width: 700,
    paper_bgcolor: paperBgColor,
    plot_bgcolor: paperBgColor,
    title: {
      text: `Estado em ${calDate.string} | Ângulo da câmera (${cameraAngle[0].toFixed(0)}, ${cameraAngle[1].toFixed(0)}) graus`,
      x: 0.4,
      font: { size: 12, color: textColor },
    },
    scene: {
      aspectmode: 'manual',
      aspectratio: { x: 1, y: 1, z: 1 },
      camera: { eye: { x: 1.4, y: 1.4, z: 1.4 } },
      xaxis: {
        backgroundcolor: bgColor,
        showbackground: true,
        gridcolor: gridColor,
        gridwidth: 1.5,
        showgrid: true,
        zerolinecolor: gridColor,
        zerolinewidth: 5,
        title: { text: 'X<sub>eclip</sub> (UA)', font: { color: textColor } },
        showspikes: false,
        mirror: false,
        color: textColor,
        showline: true,
        linecolor: gridColor,
        linewidth: 2,
        range: [-maxRange, maxRange],
      },
      yaxis: {
        backgroundcolor: bgColor,
        showbackground: true,
        gridcolor: gridColor,
        gridwidth: 1.5,
        zerolinecolor: gridColor,
        zerolinewidth: 5,
        showgrid: true,
        title: { text: 'Y<sub>eclip</sub> (UA)', font: { color: textColor } },
        showspikes: false,
        mirror: false,
        color: textColor,
        showline: true,
        linecolor: gridColor,
        linewidth: 2,
        range: [-maxRange, maxRange],
      },
      zaxis: {
        backgroundcolor: bgColor,
        showbackground: true,
        gridcolor: gridColor,
        gridwidth: 1.5,
        zerolinecolor: gridColor,
        zerolinewidth: 5,
        showgrid: true,
        title: { text: 'Z<sub>eclip</sub> (UA)', font: { color: textColor } },
        showspikes: false,
        color: textColor,
        mirror: false,
        showline: true,
        linecolor: gridColor,
        linewidth: 2,
        range: [-maxRange, maxRange],
      },
    } as any,
    margin: {
      t: 30,
      l: 0,
    },
    font: {
      color: textColor,
    },
    legend: {
      font: { color: textColor },
      bgcolor: isDark ? 'rgba(15, 23, 42, 0.8)' : 'rgba(255, 255, 255, 0.8)',
    },
  };

  const config: Partial<PlotParams['config']> = {
    doubleClick: false,
    showLink: false,
    displaylogo: false,
    editable: false,
    toImageButtonOptions: {
      format: 'png',
      scale: 5,
      filename: 'orbit',
    },
    modeBarButtonsToRemove: [
      'sendDataToCloud',
      'resetCameraLastSave3d',
      'orbitRotation',
      'hoverClosest3d',
    ],
  };

  const handleRelayout = (event: any) => {
    if (event['scene.camera']) {
      const cam = event['scene.camera'].eye;
      const r = Math.sqrt(cam.x * cam.x + cam.y * cam.y + cam.z * cam.z);
      const lat = (Math.asin(cam.z / r) * 180) / Math.PI;
      const lon = (Math.atan2(cam.y, cam.x) * 180) / Math.PI;
      setCameraAngle([lat, lon]);
    }
  };

  return (
    <div className="flex justify-center">
      <Plot data={traces} layout={layout} config={config} onRelayout={handleRelayout} />
    </div>
  );
}
