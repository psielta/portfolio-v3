import type { OrbitalElements } from './orbital-mechanics';

// Dados dos planetas com elementos orbitais e propriedades físicas
export const PLANETS = {
  Mercury: {
    elements: {
      qr: 0.3074958016246215, // Perihelion distance (AU)
      ecc: 0.2056408220896557, // Eccentricity
      inc: 7.003733902930839, // Inclination (degrees)
      raan: 48.30597718083336, // Right ascension of ascending node
      omega: 29.18348714438387, // Argument of perihelion
      tp: 2459067.650840002578, // Time of perihelion passage (Julian Date)
    },
    radiusKm: 2439.7,
    color: '#8C8C8C',
  },
  Venus: {
    elements: {
      qr: 0.7184498538218194,
      ecc: 0.006762399503226460,
      inc: 3.394576883214484,
      raan: 76.62382745452284,
      omega: 55.08424062115083,
      tp: 2458928.746738597285,
    },
    radiusKm: 6051.8,
    color: '#FFC87C',
  },
  Earth: {
    elements: {
      qr: 0.9847638666827956,
      ecc: 0.01596622548529253,
      inc: 0.003251531504436147,
      raan: 144.4234845362845,
      omega: 318.1651506357810,
      tp: 2458852.059663722757,
    },
    radiusKm: 6371.0,
    color: '#4A90E2',
  },
  Mars: {
    elements: {
      qr: 1.381380519592450,
      ecc: 0.09345385724812259,
      inc: 1.847890654037755,
      raan: 49.49761968250743,
      omega: 286.5976300648143,
      tp: 2459064.867384146899,
    },
    radiusKm: 3389.5,
    color: '#CD5C5C',
  },
  Jupiter: {
    elements: {
      qr: 4.950293643194364,
      ecc: 0.04859977273897987,
      inc: 1.303874556209337,
      raan: 100.5188687941560,
      omega: 273.5384345047322,
      tp: 2459965.784028965980,
    },
    radiusKm: 69911,
    color: '#DAA520',
  },
  Saturn: {
    elements: {
      qr: 9.092964078253944,
      ecc: 0.05111420347186896,
      inc: 2.489627626792582,
      raan: 113.6005677953501,
      omega: 337.0669187238602,
      tp: 2463550.111982490402,
    },
    radiusKm: 58232,
    color: '#F4E7D1',
  },
  Uranus: {
    elements: {
      qr: 18.30882300588441,
      ecc: 0.04590222901851362,
      inc: 0.7705441985590336,
      raan: 74.08400460182800,
      omega: 98.32413508468296,
      tp: 2470253.757045442238,
    },
    radiusKm: 25362,
    color: '#4FD0E7',
  },
  Neptune: {
    elements: {
      qr: 29.89413845714193,
      ecc: 0.01098118165219995,
      inc: 1.775000722400165,
      raan: 131.8922210631964,
      omega: 244.0980588412000,
      tp: 2463514.590601669159,
    },
    radiusKm: 24622,
    color: '#4166F5',
  },
  Pluto: {
    elements: {
      qr: 29.91037668682205,
      ecc: 0.2571893642274664,
      inc: 17.23293551253252,
      raan: 110.3222267937496,
      omega: 116.9758522861960,
      tp: 2448287.417436909862,
    },
    radiusKm: 1188.3,
    color: '#D2B48C',
  },
} satisfies Record<string, {
  elements: OrbitalElements;
  radiusKm: number;
  color: string;
}>;

export const PLANET_LIST = Object.keys(PLANETS) as (keyof typeof PLANETS)[];

export type Planet = keyof typeof PLANETS;