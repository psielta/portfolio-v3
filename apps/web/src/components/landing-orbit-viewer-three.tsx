'use client';

import { useRef, useMemo, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import {
  OrbitControls,
  Line,
  Sphere,
  Stars,
  Trail,
  Text,
  Billboard,
  Environment,
  Preload
} from '@react-three/drei';
import {
  EffectComposer,
  Bloom,
  ChromaticAberration,
  Vignette
} from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';
import { propagateKepler, type OrbitalElements } from '@/lib/orbital-mechanics';
import { PLANETS } from '@/lib/planets';

// Escala logarítmica para distâncias (para visualização)
const DISTANCE_SCALE = 8; // Escala mais compacta para ver planetas próximos
const PLANET_SCALE = 1; // Escala base para planetas
const SUN_SCALE = 1; // Escala base para o Sol
const MIN_PLANET_SIZE = 0.3; // Tamanho mínimo para planetas pequenos
const MAX_PLANET_SIZE = 1.5; // Tamanho máximo para planetas grandes

// Configuração de cores dos planetas
const PLANET_COLORS: Record<string, string> = {
  Mercury: '#8C8C8C',
  Venus: '#FFC87C',
  Earth: '#4A90E2',
  Mars: '#CD5C5C',
  Jupiter: '#DAA520',
  Saturn: '#F4E7D1',
  Uranus: '#4FD0E7',
  Neptune: '#4166F5',
  Pluto: '#D2B48C',
};

// Componente do Sol com glow effect
function Sun() {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.001;
    }
    if (glowRef.current) {
      // Pulsação sutil do glow
      const scale = 1.5 + Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      glowRef.current.scale.setScalar(scale);
    }
  });

  return (
    <group>
      {/* Sol principal */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.5, 64, 64]} /> {/* Tamanho fixo para o Sol */}
        <meshStandardMaterial
          color="#FDB813"
          emissive="#FFA500"
          emissiveIntensity={4}
          toneMapped={false}
        />
      </mesh>

      {/* Camada de glow interna */}
      <mesh>
        <sphereGeometry args={[0.6, 64, 64]} />
        <meshBasicMaterial
          color="#FFA500"
          transparent
          opacity={0.4}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Camada de glow externa */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.75, 32, 32]} />
        <meshBasicMaterial
          color="#FFD700"
          transparent
          opacity={0.2}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Luz principal do Sol */}
      <pointLight position={[0, 0, 0]} intensity={3} color="#FDB813" />
      <pointLight position={[0, 0, 0]} intensity={1} color="#FFFFFF" distance={100} />
    </group>
  );
}

// Componente para órbita
interface OrbitLineProps {
  elements: OrbitalElements;
  color: string;
  segments?: number;
}

function OrbitLine({ elements, color, segments = 256 }: OrbitLineProps) {
  const points = useMemo(() => {
    const pts: THREE.Vector3[] = [];

    // Calcular período orbital (em dias) usando a terceira lei de Kepler
    // T = 2π * sqrt(a³/μ) onde μ = GM_sun
    const a = elements.qr / (1 - elements.ecc); // Semi-eixo maior
    const periodDays = Math.sqrt(a * a * a) * 365.25; // Aproximação em dias

    console.log(`Calculating orbit with period: ${periodDays} days`);

    for (let i = 0; i <= segments; i++) {
      // Distribuir pontos ao longo de um período orbital completo
      const fraction = i / segments;
      const julianDate = elements.tp + (fraction * periodDays);

      try {
        const state = propagateKepler(
          elements.qr,
          elements.ecc,
          elements.inc,
          elements.omega,
          elements.raan,
          elements.tp,
          julianDate
        );

        if (state && state.r && !isNaN(state.r[0]) && !isNaN(state.r[1]) && !isNaN(state.r[2])) {
          // Aplicar escala consistente com os planetas
          const distance = Math.sqrt(state.r[0]**2 + state.r[1]**2 + state.r[2]**2);
          const scaledDistance = Math.log10(distance + 1) * 10;

          pts.push(new THREE.Vector3(
            (state.r[0] / distance) * scaledDistance,
            (state.r[2] / distance) * scaledDistance, // Y up em Three.js
            (state.r[1] / distance) * scaledDistance
          ));
        }
      } catch (error) {
        console.error('Error in orbit calculation:', error);
      }
    }

    console.log(`Orbit points calculated: ${pts.length}`);
    return pts;
  }, [elements]);

  if (points.length < 2) return null;

  return (
    <Line
      points={points}
      color={color}
      lineWidth={1}
      transparent
      opacity={0.6}
    />
  );
}

// Componente do Planeta
interface PlanetProps {
  name: string;
  elements: OrbitalElements;
  julianDate: number;
  color: string;
  radius: number;
  showLabel: boolean;
  animationSpeed: number;
  onClick?: () => void;
}

function Planet({
  name,
  elements,
  julianDate,
  color,
  radius,
  showLabel,
  animationSpeed,
  onClick
}: PlanetProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [position, setPosition] = useState<[number, number, number]>([5, 0, 0]); // Posição inicial visível
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    console.log(`Rendering planet: ${name}, radius: ${radius}, color: ${color}`);
  }, [name, radius, color]);

  // Posição inicial baseada no planeta
  useEffect(() => {
    // Calcular posição inicial
    try {
      const orbitalState = propagateKepler(
        elements.qr,
        elements.ecc,
        elements.inc,
        elements.omega,
        elements.raan,
        elements.tp,
        julianDate
      );

      if (orbitalState && orbitalState.r &&
          !isNaN(orbitalState.r[0]) &&
          !isNaN(orbitalState.r[1]) &&
          !isNaN(orbitalState.r[2])) {

        // Aplicar escala logarítmica mais agressiva
        const distance = Math.sqrt(
          orbitalState.r[0]**2 +
          orbitalState.r[1]**2 +
          orbitalState.r[2]**2
        );
        // Escala logarítmica para comprimir distâncias grandes
        const scaledDistance = Math.log10(distance + 1) * 10;

        setPosition([
          (orbitalState.r[0] / distance) * scaledDistance,
          (orbitalState.r[2] / distance) * scaledDistance, // Y up
          (orbitalState.r[1] / distance) * scaledDistance
        ]);
      }
    } catch (error) {
      console.error(`Error calculating position for ${name}:`, error);
    }
  }, [elements, julianDate, name]);

  // Animar posição do planeta
  useFrame((state, delta) => {
    if (animationSpeed > 0) {
      try {
        const currentJD = julianDate + (state.clock.elapsedTime * animationSpeed * 0.1); // Velocidade ajustada
        const orbitalState = propagateKepler(
          elements.qr,
          elements.ecc,
          elements.inc,
          elements.omega,
          elements.raan,
          elements.tp,
          currentJD
        );

        if (orbitalState && orbitalState.r &&
            !isNaN(orbitalState.r[0]) &&
            !isNaN(orbitalState.r[1]) &&
            !isNaN(orbitalState.r[2])) {

          // Aplicar escala logarítmica mais simples
          const distance = Math.sqrt(
            orbitalState.r[0]**2 +
            orbitalState.r[1]**2 +
            orbitalState.r[2]**2
          );
          // Escala não-linear para comprimir distâncias grandes
          const scaledDistance = Math.pow(distance, 0.6) * 3;

          setPosition([
            (orbitalState.r[0] / distance) * scaledDistance,
            (orbitalState.r[2] / distance) * scaledDistance, // Y up
            (orbitalState.r[1] / distance) * scaledDistance
          ]);
        }
      } catch (error) {
        // Ignorar erros durante animação
      }
    }

    // Rotação do planeta
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.5;
    }
  });

  // Escala simplificada e visível para os planetas
  const baseScale = 0.3; // Tamanho base visível
  const sizeMultiplier = Math.log10(radius / 1000 + 1) * 0.5; // Fator baseado no tamanho real
  const scale = Math.max(MIN_PLANET_SIZE, Math.min(MAX_PLANET_SIZE, baseScale * sizeMultiplier)) * (hovered ? 1.3 : 1);

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[scale, 32, 32]} />
        <meshStandardMaterial
          color={color}
          roughness={0.5}
          metalness={0.3}
        />
      </mesh>

      {(showLabel || hovered) && (
        <Billboard>
          <Text
            position={[0, scale * 2, 0]}
            fontSize={0.5}
            color="white"
            anchorX="center"
            anchorY="middle"
          >
            {name}
          </Text>
        </Billboard>
      )}
    </group>
  );
}

// Componente de controles de câmera customizados
function CameraController({ autoRotate }: { autoRotate: boolean }) {
  const { camera } = useThree();

  useEffect(() => {
    // Posição inicial da câmera
    camera.position.set(20, 15, 20);
    camera.lookAt(0, 0, 0);
  }, [camera]);

  return (
    <OrbitControls
      enableZoom={true}
      zoomSpeed={1.2}
      enablePan={true}
      panSpeed={0.8}
      enableRotate={true}
      rotateSpeed={0.5}
      autoRotate={autoRotate}
      autoRotateSpeed={0.5}
      minDistance={5}
      maxDistance={200}
      makeDefault
    />
  );
}

// Sistema Solar completo
interface SolarSystemProps {
  showPlanets: boolean;
  showVectors: boolean;
  animationSpeed: number;
  autoRotate: boolean;
  julianDate: number;
}

function SolarSystem({
  showPlanets,
  showVectors,
  animationSpeed,
  autoRotate,
  julianDate
}: SolarSystemProps) {
  const [selectedPlanet, setSelectedPlanet] = useState<string | null>(null);

  return (
    <>
      {/* Iluminação ambiente mais forte */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 10]} intensity={0.5} />

      {/* Estrelas de fundo otimizadas */}
      <Stars
        radius={300}
        depth={50}
        count={3000}
        factor={4}
        saturation={0}
        fade
        speed={0.5}
      />

      {/* Sol */}
      <Sun />

      {/* Planetas e órbitas */}
      {showPlanets && Object.entries(PLANETS).map(([name, data]) => {
        console.log(`Creating planet: ${name}`);
        return (
          <group key={name}>
            {/* Órbita */}
            <OrbitLine
              elements={data.elements}
              color={data.color}
              segments={128}
            />

            {/* Planeta */}
            <Planet
              name={name}
              elements={data.elements}
              julianDate={julianDate}
              color={data.color}
              radius={data.radiusKm}
              showLabel={selectedPlanet === name}
              animationSpeed={animationSpeed}
              onClick={() => setSelectedPlanet(name === selectedPlanet ? null : name)}
            />
          </group>
        );
      })}

      {/* Vetores de velocidade (se habilitado) */}
      {showVectors && showPlanets && Object.entries(PLANETS).map(([name, data]) => {
        try {
          const state = propagateKepler(
            data.elements.qr,
            data.elements.ecc,
            data.elements.inc,
            data.elements.omega,
            data.elements.raan,
            data.elements.tp,
            julianDate
          );

          if (!state || !state.r || !state.v) return null;

          const distance = Math.sqrt(state.r[0]**2 + state.r[1]**2 + state.r[2]**2);
          const scaleFactor = Math.log10(distance + 1) * DISTANCE_SCALE / distance;

          const start = new THREE.Vector3(
            state.r[0] * scaleFactor,
            state.r[2] * scaleFactor,
            state.r[1] * scaleFactor
          );

          const velocityScale = 2; // Escala para visualização dos vetores
          const end = new THREE.Vector3(
            state.r[0] * scaleFactor + state.v[0] * velocityScale,
            state.r[2] * scaleFactor + state.v[2] * velocityScale,
            state.r[1] * scaleFactor + state.v[1] * velocityScale
          );

          return (
            <Line
              key={`vector-${name}`}
              points={[start, end]}
              color="#00FF00"
              lineWidth={2}
              transparent
              opacity={0.8}
            />
          );
        } catch (error) {
          return null;
        }
      })}

      {/* Eixos de referência */}
      <axesHelper args={[50]} />

      {/* Controles de câmera */}
      <CameraController autoRotate={autoRotate} />
    </>
  );
}

// Componente principal
interface LandingOrbitViewerThreeProps {
  showPlanets?: boolean;
  showVectors?: boolean;
  axisLimit?: number | null;
  animationSpeed?: number;
  autoRotate?: boolean;
  julianDate?: number;
}

export function LandingOrbitViewerThree({
  showPlanets = true,
  showVectors = false,
  axisLimit = null,
  animationSpeed = 30,
  autoRotate = false, // Desabilitado por padrão
  julianDate = 2460676.5, // 1 Jan 2025
}: LandingOrbitViewerThreeProps) {
  return (
    <div className="absolute inset-0 w-full h-full bg-black">
      <Canvas
        camera={{
          position: [20, 15, 20], // Posição mais próxima
          fov: 75, // Campo de visão maior
          near: 0.1,
          far: 1000
        }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "high-performance",
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2
        }}
        dpr={[1, 2]}
      >
        <Suspense fallback={null}>
          <SolarSystem
            showPlanets={showPlanets}
            showVectors={showVectors}
            animationSpeed={animationSpeed}
            autoRotate={autoRotate}
            julianDate={julianDate}
          />

          {/* Efeitos de pós-processamento otimizados */}
          <EffectComposer multisampling={2}>
            <Bloom
              intensity={0.6}
              luminanceThreshold={0.4}
              luminanceSmoothing={0.85}
              blendFunction={BlendFunction.ADD}
              mipmapBlur
            />
            <Vignette
              darkness={0.3}
              offset={0.3}
              blendFunction={BlendFunction.NORMAL}
            />
          </EffectComposer>
          <Preload all />
        </Suspense>
      </Canvas>
    </div>
  );
}