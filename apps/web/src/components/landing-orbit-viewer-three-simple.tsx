'use client';

import { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Line, Stars, Text, Billboard, Html } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';

// Dados simplificados dos planetas com cores mais vibrantes
const PLANETS_DATA = [
  {
    name: 'Mercury',
    distance: 4,
    color: '#B0B0B0',
    emissive: '#505050',
    size: 0.2,
    speed: 4.15,
    realDistance: '57.9 milhões km',
    orbitalPeriod: '88 dias',
    radius: '2,439 km'
  },
  {
    name: 'Venus',
    distance: 7,
    color: '#FFD700',
    emissive: '#FF8C00',
    size: 0.35,
    speed: 1.62,
    realDistance: '108.2 milhões km',
    orbitalPeriod: '225 dias',
    radius: '6,051 km'
  },
  {
    name: 'Earth',
    distance: 10,
    color: '#00BFFF',
    emissive: '#0000FF',
    size: 0.4,
    speed: 1,
    realDistance: '149.6 milhões km',
    orbitalPeriod: '365 dias',
    radius: '6,371 km'
  },
  {
    name: 'Mars',
    distance: 15,
    color: '#FF4500',
    emissive: '#8B0000',
    size: 0.25,
    speed: 0.53,
    realDistance: '227.9 milhões km',
    orbitalPeriod: '687 dias',
    radius: '3,389 km'
  },
  {
    name: 'Jupiter',
    distance: 25,
    color: '#FFA500',
    emissive: '#8B4513',
    size: 1.2,
    speed: 0.084,
    realDistance: '778.5 milhões km',
    orbitalPeriod: '12 anos',
    radius: '69,911 km'
  },
  {
    name: 'Saturn',
    distance: 35,
    color: '#F4E4C1',
    emissive: '#D2B48C',
    size: 1,
    speed: 0.034,
    realDistance: '1.43 bilhões km',
    orbitalPeriod: '29 anos',
    radius: '58,232 km'
  },
  {
    name: 'Uranus',
    distance: 45,
    color: '#00CED1',
    emissive: '#008B8B',
    size: 0.6,
    speed: 0.012,
    realDistance: '2.87 bilhões km',
    orbitalPeriod: '84 anos',
    radius: '25,362 km'
  },
  {
    name: 'Neptune',
    distance: 55,
    color: '#4169E1',
    emissive: '#191970',
    size: 0.6,
    speed: 0.006,
    realDistance: '4.49 bilhões km',
    orbitalPeriod: '165 anos',
    radius: '24,622 km'
  },
  {
    name: 'Pluto',
    distance: 65,
    color: '#DEB887',
    emissive: '#8B7355',
    size: 0.15,
    speed: 0.004,
    realDistance: '5.91 bilhões km',
    orbitalPeriod: '248 anos',
    radius: '1,188 km'
  },
];

// Componente do Sol
function Sun() {
  const meshRef = useRef<THREE.Mesh>(null);
  const [showInfo, setShowInfo] = useState(false);
  const [cardHovered, setCardHovered] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  useEffect(() => {
    // Limpar timeout ao desmontar
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      setShowInfo(false);
      setCardHovered(false);
    };
  }, []);

  // Reset card hover quando showInfo mudar para false
  useEffect(() => {
    if (!showInfo) {
      setCardHovered(false);
    }
  }, [showInfo]);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.002;
    }
  });

  const handlePointerOver = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = undefined;
    }
    setShowInfo(true);
  };

  const handlePointerOut = () => {
    timeoutRef.current = setTimeout(() => {
      if (!cardHovered) {
        setShowInfo(false);
        setCardHovered(false); // Reset card hover state
      }
    }, 500);
  };

  const handleClick = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = undefined;
    }

    // Toggle behavior
    if (showInfo) {
      setShowInfo(false);
      setCardHovered(false);
    } else {
      setShowInfo(true);
      timeoutRef.current = setTimeout(() => {
        if (!cardHovered) {
          setShowInfo(false);
          setCardHovered(false);
        }
      }, 3000);
    }
  };

  return (
    <group>
      <mesh
        ref={meshRef}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        onClick={handleClick}
      >
        <sphereGeometry args={[2, 64, 64]} />
        <meshStandardMaterial
          color="#FFFF00"
          emissive="#FFA500"
          emissiveIntensity={showInfo ? 6 : 5}
          toneMapped={false}
        />
      </mesh>
      <mesh>
        <sphereGeometry args={[2.3, 32, 32]} />
        <meshBasicMaterial
          color="#FFA500"
          transparent
          opacity={0.5}
          side={THREE.BackSide}
        />
      </mesh>
      <mesh>
        <sphereGeometry args={[2.8, 32, 32]} />
        <meshBasicMaterial
          color="#FFD700"
          transparent
          opacity={0.2}
          side={THREE.BackSide}
        />
      </mesh>
      <pointLight position={[0, 0, 0]} intensity={3} color="#FDB813" castShadow />
      <pointLight position={[0, 0, 0]} intensity={1} color="#FFFFFF" distance={100} />

      {/* Informações do Sol ao hover */}
      {showInfo && (
        <Html position={[0, 4, 0]} center>
          <div
            className="bg-black/90 text-white p-2 rounded-lg shadow-xl border border-yellow-500/50 min-w-[180px] cursor-pointer select-none"
            onMouseEnter={() => setCardHovered(true)}
            onMouseLeave={() => {
              setCardHovered(false);
              handlePointerOut();
            }}
            onClick={(e) => {
              e.stopPropagation();
              setShowInfo(false);
              setCardHovered(false);
              if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
                timeoutRef.current = undefined;
              }
            }}
          >
            <div className="flex justify-between items-start mb-1">
              <h3 className="font-bold text-lg text-yellow-400">Sol</h3>
              <span className="text-xs text-gray-500 hover:text-white">✕</span>
            </div>
            <div className="text-xs space-y-0.5">
              <p><span className="text-gray-400">Massa:</span> 1.989 × 10³⁰ kg</p>
              <p><span className="text-gray-400">Raio:</span> 696,340 km</p>
              <p><span className="text-gray-400">Temperatura:</span> 5,778 K</p>
              <p><span className="text-gray-400">Tipo:</span> Estrela anã amarela</p>
              <p><span className="text-gray-400">Gravidade superficial:</span> 274 m/s²</p>
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}

// Componente de Órbita
function OrbitRing({ radius }: { radius: number }) {
  const points = [];
  const segments = 64;

  for (let i = 0; i <= segments; i++) {
    const angle = (i / segments) * Math.PI * 2;
    points.push(new THREE.Vector3(
      Math.cos(angle) * radius,
      0,
      Math.sin(angle) * radius
    ));
  }

  return (
    <Line
      points={points}
      color="#4a5568"
      lineWidth={0.5}
      transparent
      opacity={0.3}
      fog={false}
    />
  );
}

// Componente do Planeta
interface PlanetProps {
  name: string;
  distance: number;
  color: string;
  emissive: string;
  size: number;
  speed: number;
  animationSpeed: number;
  showVectors: boolean;
  realDistance: string;
  orbitalPeriod: string;
  radius: string;
}

function Planet({
  name,
  distance,
  color,
  emissive,
  size,
  speed,
  animationSpeed,
  showVectors,
  realDistance,
  orbitalPeriod,
  radius
}: PlanetProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const [showInfo, setShowInfo] = useState(false);
  const [cardHovered, setCardHovered] = useState(false);
  const [currentAngle, setCurrentAngle] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  useEffect(() => {
    // Limpar timeout ao desmontar
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      setShowInfo(false);
      setCardHovered(false);
    };
  }, []);

  // Reset card hover quando showInfo mudar para false
  useEffect(() => {
    if (!showInfo) {
      setCardHovered(false);
    }
  }, [showInfo]);

  useFrame((state) => {
    if (groupRef.current) {
      if (animationSpeed > 0) {
        // Orbitar ao redor do sol
        groupRef.current.rotation.y += (speed * animationSpeed * 0.0001);
      }
      setCurrentAngle(groupRef.current.rotation.y);
    }
    if (meshRef.current) {
      // Rotação do planeta em si
      meshRef.current.rotation.y += 0.01;
    }
  });

  const handlePointerOver = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = undefined;
    }
    setShowInfo(true);
  };

  const handlePointerOut = () => {
    timeoutRef.current = setTimeout(() => {
      if (!cardHovered) {
        setShowInfo(false);
        setCardHovered(false); // Reset card hover state
      }
    }, 500);
  };

  const handleClick = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = undefined;
    }

    // Toggle behavior
    if (showInfo) {
      setShowInfo(false);
      setCardHovered(false);
    } else {
      setShowInfo(true);
      timeoutRef.current = setTimeout(() => {
        if (!cardHovered) {
          setShowInfo(false);
          setCardHovered(false);
        }
      }, 3000);
    }
  };

  return (
    <group ref={groupRef}>
      <mesh
        ref={meshRef}
        position={[distance, 0, 0]}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        onClick={handleClick}
        scale={showInfo ? 1.5 : 1}
      >
        <sphereGeometry args={[size, 32, 32]} />
        <meshStandardMaterial
          color={color}
          emissive={emissive}
          emissiveIntensity={showInfo ? 0.8 : 0.3}
          roughness={0.2}
          metalness={0.3}
          toneMapped={true}
        />
      </mesh>

      {/* Informações ao hover */}
      {showInfo && (
        <Html position={[distance, size + 2, 0]} center>
          <div
            className="bg-black/90 text-white p-2 rounded-lg shadow-xl border border-white/20 min-w-[180px] cursor-pointer select-none"
            onMouseEnter={() => setCardHovered(true)}
            onMouseLeave={() => {
              setCardHovered(false);
              handlePointerOut();
            }}
            onClick={(e) => {
              e.stopPropagation();
              setShowInfo(false);
              setCardHovered(false);
              if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
                timeoutRef.current = undefined;
              }
            }}
          >
            <div className="flex justify-between items-start mb-1">
              <h3 className="font-bold text-lg">{name}</h3>
              <span className="text-xs text-gray-500 hover:text-white">✕</span>
            </div>
            <div className="text-xs space-y-0.5">
              <p><span className="text-gray-400">Distância do Sol:</span> {realDistance}</p>
              <p><span className="text-gray-400">Período orbital:</span> {orbitalPeriod}</p>
              <p><span className="text-gray-400">Raio:</span> {radius}</p>
              {showVectors && (
                <>
                  <div className="border-t border-white/20 mt-1 pt-1">
                    <p className="text-green-400"><span className="text-gray-400">Velocidade orbital:</span> {(speed * 30).toFixed(2)} km/s</p>
                    <p className="text-red-400"><span className="text-gray-400">Aceleração gravitacional:</span> {(9.8 / (distance * distance / 100)).toFixed(3)} m/s²</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </Html>
      )}

      {/* Vetores de força */}
      {showVectors && (
        <group position={[distance, 0, 0]}>
          {(() => {
            // Ambos vetores partem do centro do planeta
            const origin = new THREE.Vector3(0, 0, 0);

            // Vetor de Velocidade (tangencial - verde) - proporcional à velocidade
            const velocityLength = Math.max(2, Math.min(speed * 50, 8)); // Proporcional à velocidade
            const velocityEnd = new THREE.Vector3(0, 0, -velocityLength); // Tangencial (perpendicular ao raio)

            // Vetor de Aceleração Gravitacional (radial - vermelho) - tamanho fixo
            const gravityLength = 4;
            const gravityEnd = new THREE.Vector3(-gravityLength, 0, 0); // Aponta para o Sol (centrípeta)

            return (
              <>
                {/* Vetor de Velocidade */}
                <group>
                  {/* Linha do vetor velocidade */}
                  <Line
                    points={[origin, velocityEnd]}
                    color="#00ff00"
                    lineWidth={3}
                    transparent
                    opacity={0.9}
                  />

                  {/* Ponta da seta velocidade */}
                  <mesh
                    position={velocityEnd}
                    rotation={[-Math.PI / 2, 0, 0]}
                  >
                    <coneGeometry args={[0.2, 0.5, 8]} />
                    <meshStandardMaterial
                      color="#00ff00"
                      emissive="#00ff00"
                      emissiveIntensity={0.5}
                    />
                  </mesh>

                  {/* Label com valor da velocidade */}
                  <Text
                    position={[velocityEnd.x, velocityEnd.y + 0.5, velocityEnd.z - 0.5]}
                    fontSize={0.35}
                    color="#00ff00"
                  >
                    v = {(speed * 30).toFixed(1)} km/s
                  </Text>
                </group>

                {/* Vetor de Aceleração Gravitacional */}
                <group>
                  {/* Linha do vetor aceleração gravitacional */}
                  <Line
                    points={[origin, gravityEnd]}
                    color="#ff0000"
                    lineWidth={3}
                    transparent
                    opacity={0.9}
                  />

                  {/* Ponta da seta aceleração gravitacional */}
                  <mesh
                    position={gravityEnd}
                    rotation={[0, 0, Math.PI / 2]}
                  >
                    <coneGeometry args={[0.2, 0.5, 8]} />
                    <meshStandardMaterial
                      color="#ff0000"
                      emissive="#ff0000"
                      emissiveIntensity={0.5}
                    />
                  </mesh>

                  {/* Label aceleração gravitacional */}
                  <Text
                    position={[gravityEnd.x - 0.5, gravityEnd.y + 0.5, gravityEnd.z]}
                    fontSize={0.35}
                    color="#ff0000"
                  >
                    g = {(9.8 / (distance * distance / 100)).toFixed(2)} m/s²
                  </Text>
                </group>

                {/* Ponto de origem dos vetores */}
                <mesh position={origin}>
                  <sphereGeometry args={[0.1, 16, 16]} />
                  <meshBasicMaterial color="#ffffff" />
                </mesh>
              </>
            );
          })()}
        </group>
      )}
    </group>
  );
}

// Sistema Solar
interface SolarSystemProps {
  showPlanets: boolean;
  showVectors: boolean;
  animationSpeed: number;
  autoRotate: boolean;
}

function SolarSystem({ showPlanets, showVectors, animationSpeed, autoRotate }: SolarSystemProps) {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 5]} intensity={1.2} color="#ffffff" />
      <directionalLight position={[-10, -10, -5]} intensity={0.5} color="#87CEEB" />
      <Stars radius={300} depth={50} count={3000} factor={4} saturation={0} fade />

      <Sun />


      {showPlanets && PLANETS_DATA.map((planet) => (
        <group key={planet.name}>
          <OrbitRing radius={planet.distance} />
          <Planet
            name={planet.name}
            distance={planet.distance}
            color={planet.color}
            emissive={planet.emissive}
            size={planet.size}
            speed={planet.speed}
            animationSpeed={animationSpeed}
            showVectors={showVectors}
            realDistance={planet.realDistance}
            orbitalPeriod={planet.orbitalPeriod}
            radius={planet.radius}
          />
        </group>
      ))}

      <OrbitControls
        enableZoom={true}
        enablePan={true}
        enableRotate={true}
        autoRotate={autoRotate}
        autoRotateSpeed={0.5}
        minDistance={10}
        maxDistance={200}
      />
    </>
  );
}

// Componente principal
interface LandingOrbitViewerThreeSimpleProps {
  showPlanets?: boolean;
  showVectors?: boolean;
  axisLimit?: number | null;
  animationSpeed?: number;
  autoRotate?: boolean;
  julianDate?: number;
}

export function LandingOrbitViewerThreeSimple({
  showPlanets = true,
  showVectors = false,
  animationSpeed = 30,
  autoRotate = false,
}: LandingOrbitViewerThreeSimpleProps) {
  return (
    <div className="absolute inset-0 w-full h-full bg-black">
      <Canvas
        camera={{
          position: [50, 40, 50],
          fov: 60,
          near: 0.1,
          far: 1000
        }}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2
        }}
      >
        <Suspense fallback={null}>
          <SolarSystem
            showPlanets={showPlanets}
            showVectors={showVectors}
            animationSpeed={animationSpeed}
            autoRotate={autoRotate}
          />

          {/* Efeitos de pós-processamento para cores mais vibrantes */}
          <EffectComposer multisampling={2}>
            <Bloom
              intensity={0.5}
              luminanceThreshold={0.2}
              luminanceSmoothing={0.9}
              blendFunction={BlendFunction.ADD}
              mipmapBlur
            />
            <Vignette
              darkness={0.2}
              offset={0.2}
              blendFunction={BlendFunction.NORMAL}
            />
          </EffectComposer>
        </Suspense>
      </Canvas>

      {/* Legenda dos vetores no canto inferior esquerdo */}
      {showVectors && (
        <div className="absolute bottom-4 left-4 bg-black/80 text-white p-3 rounded-lg text-xs border border-white/20 backdrop-blur-sm">
          <h4 className="font-semibold mb-2 text-sm">Vetores Orbitais</h4>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-4 h-1 bg-green-500 rounded"></div>
            <span>Velocidade (tangencial)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-1 bg-red-500 rounded"></div>
            <span>Aceleração Gravitacional (radial)</span>
          </div>
        </div>
      )}
    </div>
  );
}