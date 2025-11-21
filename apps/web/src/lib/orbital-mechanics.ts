// Orbital Mechanics Library
// Adapted from NASA JPL Solar System Dynamics

// Constants
export const RAD2DEG = 57.2957795130823;
export const DEG2RAD = 1 / RAD2DEG;
export const RMAX = 55; // AU
export const GM = 0.00029591220828559; // Gravitational parameter (AU^3/day^2)
export const AU2KM = 149597870.7;
export const KM2AU = 1 / AU2KM;
export const DAY2SEC = 86400;

export const PLANET_LIST = [
  'Mercury',
  'Venus',
  'Earth',
  'Mars',
  'Jupiter',
  'Saturn',
  'Uranus',
  'Neptune',
  'Pluto',
] as const;

export const PLANET_COLORS = [
  'gold',
  'hotpink',
  'limegreen',
  'orange',
  'red',
  'dimgray',
  'mediumspringgreen',
  'black',
  'mediumorchid',
] as const;

export type Planet = (typeof PLANET_LIST)[number];

export interface OrbitalElements {
  qr: number; // Perihelion distance (AU)
  ecc: number; // Eccentricity
  inc: number; // Inclination (degrees)
  raan: number; // Right ascension of ascending node (degrees)
  omega: number; // Argument of perihelion (degrees)
  tp: number; // Time of perihelion passage (Julian Date)
}

export interface Vector3 {
  x: number;
  y: number;
  z: number;
}

export interface StateVector {
  pos: [number, number, number];
  vel: [number, number, number];
}

export interface PlanetElements extends OrbitalElements {
  r45: number;
}

// Vector operations
export function norm(vec: [number, number, number]): number {
  return Math.sqrt(vec[0] * vec[0] + vec[1] * vec[1] + vec[2] * vec[2]);
}

export function cross(
  u: [number, number, number],
  v: [number, number, number]
): [number, number, number] {
  return [
    u[1] * v[2] - u[2] * v[1],
    -u[0] * v[2] + u[2] * v[0],
    u[0] * v[1] - u[1] * v[0],
  ];
}

export function dot(u: [number, number, number], v: [number, number, number]): number {
  return u[0] * v[0] + u[1] * v[1] + u[2] * v[2];
}

// Convert orbital elements to cartesian coordinates
export function elem2cart(elem: number[]): StateVector {
  const h = elem[0];
  const ecc = elem[1];
  const inc = elem[2] * DEG2RAD;
  const raan = elem[3] * DEG2RAD;
  const peri = elem[4] * DEG2RAD;
  const ta = elem[5] * DEG2RAD;
  const long = ta + peri;

  // Compute radial distance
  const r = (h * h) / GM / (1 + ecc * Math.cos(ta));

  // Compute radial and tangential velocities
  const vr = (GM / h) * ecc * Math.sin(ta);
  const vth = (GM / h) * (1 + ecc * Math.cos(ta));

  // Project radial and tangential unit vectors on the inertial frame
  const ur: [number, number, number] = [
    Math.cos(raan) * Math.cos(long) - Math.sin(raan) * Math.cos(inc) * Math.sin(long),
    Math.sin(raan) * Math.cos(long) + Math.cos(raan) * Math.cos(inc) * Math.sin(long),
    Math.sin(inc) * Math.sin(long),
  ];

  const uth: [number, number, number] = [
    -Math.cos(raan) * Math.sin(long) - Math.sin(raan) * Math.cos(inc) * Math.cos(long),
    -Math.sin(raan) * Math.sin(long) + Math.cos(raan) * Math.cos(inc) * Math.cos(long),
    Math.sin(inc) * Math.cos(long),
  ];

  // State vector
  const pos: [number, number, number] = [ur[0] * r, ur[1] * r, ur[2] * r];
  const vel: [number, number, number] = [
    vr * ur[0] + vth * uth[0],
    vr * ur[1] + vth * uth[1],
    vr * ur[2] + vth * uth[2],
  ];

  return { pos, vel };
}

// Find C2 and C3 universal functions
function findC2C3(psi: number, tol: number): { c2: number; c3: number } {
  let c2: number, c3: number;

  if (psi > tol) {
    c2 = (1 - Math.cos(Math.sqrt(psi))) / psi;
    c3 = (Math.sqrt(psi) - Math.sin(Math.sqrt(psi))) / Math.sqrt(psi * psi * psi);
  } else if (psi < -tol) {
    c2 = (1 - Math.cosh(Math.sqrt(-psi))) / psi;
    c3 = (Math.sinh(Math.sqrt(-psi)) - Math.sqrt(-psi)) / Math.sqrt(-psi * psi * psi);
  } else {
    c2 = 0.5;
    c3 = 0.16666666666666667;
  }

  return { c2, c3 };
}

// Propagate Keplerian orbit
export function propagateKepler(
  vr0: [number, number, number],
  vv0: [number, number, number],
  dt: number
): StateVector {
  const tol = 1e-12;

  // Compute vector norms
  const r0 = norm(vr0);
  const v0 = norm(vv0);

  // Compute energy and derived quantities
  const xi = v0 * v0 * 0.5 - GM / r0;
  const sma = -GM / (2 * xi);
  const alpha = 1.0 / sma;

  let chi0: number;
  if (alpha > 0.000001) {
    chi0 = Math.sqrt(GM) * dt * alpha;
  } else if (alpha < -0.000001) {
    chi0 =
      Math.sign(dt) *
      Math.sqrt(-sma) *
      Math.log(
        (-2 * GM * alpha * dt) /
          (dot(vr0, vv0) + Math.sign(dt) * Math.sqrt(-GM * sma) * (1 - r0 * alpha))
      );
  } else {
    const vh = cross(vr0, vv0);
    const p = Math.pow(norm(vh), 2) / GM;
    const s = 0.5 * Math.atan(1.0 / (3 * Math.sqrt(GM / (p * p * p)) * dt));
    const w = Math.atan(Math.pow(Math.tan(s), 0.3333333333333333));
    chi0 = (Math.sqrt(p) * 2) / Math.tan(2 * w);
  }

  let r: number, chi: number, c2: number, c3: number, psi: number;
  for (let j = 0; j < 500; j++) {
    psi = chi0 * chi0 * alpha;
    const result = findC2C3(psi, tol);
    c2 = result.c2;
    c3 = result.c3;
    r =
      chi0 * chi0 * c2 +
      (dot(vr0, vv0) / Math.sqrt(GM)) * chi0 * (1 - psi * c3) +
      r0 * (1 - psi * c2);
    chi =
      chi0 +
      (Math.sqrt(GM) * dt -
        chi0 * chi0 * chi0 * c3 -
        (dot(vr0, vv0) / Math.sqrt(GM)) * chi0 * chi0 * c2 -
        r0 * chi0 * (1 - psi * c3)) /
        r;
    if (Math.abs(chi - chi0) < tol) break;
    chi0 = chi;
  }

  // Compute f and g functions
  const f = 1 - (chi! * chi!) / r0 * c2!;
  const g = dt - (chi! * chi! * chi!) / Math.sqrt(GM) * c3!;
  const dg = 1 - (chi! * chi!) / r! * c2!;
  const df = (Math.sqrt(GM) / (r! * r0)) * chi! * (psi! * c3! - 1);

  // Compute state vector
  const vr: [number, number, number] = [
    vr0[0] * f + vv0[0] * g,
    vr0[1] * f + vv0[1] * g,
    vr0[2] * f + vv0[2] * g,
  ];
  const vv: [number, number, number] = [
    vr0[0] * df + vv0[0] * dg,
    vr0[1] * df + vv0[1] * dg,
    vr0[2] * df + vv0[2] * dg,
  ];

  return { pos: vr, vel: vv };
}

// Mean anomaly to true anomaly conversion
function ea2ta(ecc: number, ea: number): number {
  return Math.atan2(Math.sqrt(1 - ecc * ecc) * Math.sin(ea), Math.cos(ea) - ecc);
}

function fkepler(ecc: number, ea: number, dm: number): number {
  return ea - ecc * Math.sin(ea) - dm;
}

function dfkepler(ecc: number, ea: number): number {
  return 1 - ecc * Math.cos(ea);
}

export function ma2ta(ecc: number, ma: number): number {
  let ea = ma;
  for (let iter = 0; iter < 50; iter++) {
    const de = -fkepler(ecc, ea, ma) / dfkepler(ecc, ea);
    ea = ea + de;
    const errorf = Math.abs(fkepler(ecc, ea, ma));
    const errorx = Math.abs(de) / Math.abs(ea);
    if (errorf < 1e-10 && errorx < 1e-10) break;
  }
  return ea2ta(ecc, ea);
}

// Get osculating elements for planets
export function getOsculatingElements(planet: Planet): PlanetElements {
  const elements: Record<Planet, Omit<PlanetElements, 'r45'>> = {
    Mercury: {
      ecc: 2.056408220896557e-1,
      qr: 3.074958016246215e-1,
      tp: 2459067.650840002578,
      raan: 4.830597718083336e1,
      omega: 2.918348714438387e1,
      inc: 7.003733902930839,
    },
    Venus: {
      ecc: 6.762399503226460e-3,
      qr: 7.184498538218194e-1,
      tp: 2458928.746738597285,
      raan: 7.662382745452284e1,
      omega: 5.508424062115083e1,
      inc: 3.394576883214484,
    },
    Earth: {
      ecc: 1.596622548529253e-2,
      qr: 9.847638666827956e-1,
      tp: 2458852.059663722757,
      raan: 1.444234845362845e2,
      omega: 3.181651506357810e2,
      inc: 3.251531504436147e-3,
    },
    Mars: {
      ecc: 9.345385724812259e-2,
      qr: 1.381380519592450,
      tp: 2459064.867384146899,
      raan: 4.949761968250743e1,
      omega: 2.865976300648143e2,
      inc: 1.847890654037755,
    },
    Jupiter: {
      ecc: 4.859977273897987e-2,
      qr: 4.950293643194364,
      tp: 2459965.784028965980,
      raan: 1.005188687941560e2,
      omega: 2.735384345047322e2,
      inc: 1.303874556209337,
    },
    Saturn: {
      ecc: 5.111420347186896e-2,
      qr: 9.092964078253944,
      tp: 2463550.111982490402,
      raan: 1.136005677953501e2,
      omega: 3.370669187238602e2,
      inc: 2.489627626792582,
    },
    Uranus: {
      ecc: 4.590222901851362e-2,
      qr: 1.830882300588441e1,
      tp: 2470253.757045442238,
      raan: 7.408400460182800e1,
      omega: 9.832413508468296e1,
      inc: 7.705441985590336e-1,
    },
    Neptune: {
      ecc: 1.098118165219995e-2,
      qr: 2.989413845714193e1,
      tp: 2463514.590601669159,
      raan: 1.318922210631964e2,
      omega: 2.440980588412000e2,
      inc: 1.775000722400165,
    },
    Pluto: {
      ecc: 2.571893642274664e-1,
      qr: 2.991037668682205e1,
      tp: 2448287.417436909862,
      raan: 1.103222267937496e2,
      omega: 1.169758522861960e2,
      inc: 1.723293551253252e1,
    },
  };

  const elem = elements[planet];
  const r45 = (elem.qr * (1 + elem.ecc)) / (1 + 0.5 * Math.sqrt(2) * elem.ecc);

  return { ...elem, r45 };
}

// Calendar to Julian Date
export function cal2jd(year: number, month: number, day: number): number {
  const diff = Date.UTC(year, month - 1, day);
  const days = diff / 86400000;
  return days + 40587 + 2400000.5;
}

// Julian Date to calendar
export function jd2cal(jd: number): { year: number; month: number; day: number; string: string } {
  const Q = jd + 0.5;
  const Z = Math.floor(Q);
  const W = Math.floor((Z - 1867216.25) * 0.273790700698850763533816573920e-4);
  const X = Math.floor(W * 0.25);
  const A = Z + 1 + W - X;
  const B = A + 1524;
  const C = Math.floor((B - 122.1) * 0.273785078713210130047912388775e-2);
  const D = Math.floor(365.25 * C);
  const E = Math.floor((B - D) * 0.326796317659092617344387763439e-1);
  const F = Math.floor(30.6001 * E);
  const day = Math.floor(B - D - F + (Q - Z));
  let month = E - 1;
  if (month > 12 || month < 1) {
    month = E - 13;
  }
  const year = month === 1 || month === 2 ? C - 4715 : C - 4716;

  const formatted = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;

  return { year, month, day, string: formatted };
}

// Get orbit data
export function getOrbitData(elem: OrbitalElements, jd: number) {
  const h = Math.sqrt(elem.qr * GM * (1 + elem.ecc));

  // Get limits in true anomaly
  let taLim = [0, 360];
  const isHyperbolic = elem.ecc >= 1 || (elem.qr / (1 - elem.ecc)) * (1 + elem.ecc) > RMAX * 1.74;

  if (isHyperbolic) {
    taLim[0] = -Math.acos(1 / elem.ecc - (h * h) / GM / elem.ecc / (RMAX * 1.74)) * RAD2DEG;
    taLim[1] = -taLim[0];
  }

  // Create true anomaly vector
  const nta = 360;
  const dta = (taLim[1] - taLim[0]) / (nta - 1);

  const x: number[] = [];
  const y: number[] = [];
  const z: number[] = [];
  const vx: number[] = [];
  const vy: number[] = [];
  const vz: number[] = [];

  let maxCoord = 0;

  for (let i = 0; i < nta; i++) {
    const ta = taLim[0] + i * dta;
    const elemArray = [h, elem.ecc, elem.inc, elem.raan, elem.omega, ta];
    const result = elem2cart(elemArray);

    x.push(result.pos[0]);
    y.push(result.pos[1]);
    z.push(result.pos[2]);
    vx.push(result.vel[0]);
    vy.push(result.vel[1]);
    vz.push(result.vel[2]);

    maxCoord = Math.max(
      maxCoord,
      Math.abs(result.pos[0]),
      Math.abs(result.pos[1]),
      Math.abs(result.pos[2])
    );
  }

  // Compute reference state at given date
  const elemArray = [h, elem.ecc, elem.inc, elem.raan, elem.omega, 0];
  const result0 = elem2cart(elemArray);
  const refState = propagateKepler(result0.pos, result0.vel, jd - elem.tp);

  const maxRange = Math.ceil(maxCoord * 1.1);

  return {
    x,
    y,
    z,
    vx,
    vy,
    vz,
    refState,
    maxRange: Math.min(maxRange, RMAX),
    isHyperbolic,
  };
}

// Line of nodes
export function getLineOfNodes(elem: OrbitalElements) {
  const h = Math.sqrt(elem.qr * GM * (1 + elem.ecc));
  const raan = elem.raan * DEG2RAD;
  const peri = elem.omega * DEG2RAD;

  const th1 = raan;
  const th2 = Math.PI + raan;

  let ra = (h * h) / GM / (1.0 + elem.ecc * Math.cos(-peri));
  let rd = (h * h) / GM / (1.0 + elem.ecc * Math.cos(Math.PI - peri));

  if (ra < 0 || ra > RMAX) ra = 0;
  if (rd < 0 || rd > RMAX) rd = 0;

  return {
    ascending: { x: ra * Math.cos(th1), y: ra * Math.sin(th1), z: 0 },
    descending: { x: rd * Math.cos(th2), y: rd * Math.sin(th2), z: 0 },
  };
}

// Angular momentum vector
export function getAngularMomentumVector(elem: OrbitalElements): Vector3 {
  const inc = elem.inc * DEG2RAD;
  const raan = elem.raan * DEG2RAD;

  return {
    x: Math.sin(raan) * Math.sin(inc),
    y: -Math.cos(raan) * Math.sin(inc),
    z: Math.cos(inc),
  };
}

// Eccentricity vector
export function getEccentricityVector(elem: OrbitalElements): Vector3 {
  const h = Math.sqrt(elem.qr * GM * (1 + elem.ecc));
  const inc = elem.inc * DEG2RAD;
  const raan = elem.raan * DEG2RAD;
  const peri = elem.omega * DEG2RAD;

  const rp = (h * h) / GM / (1 + elem.ecc);

  return {
    x: rp * (Math.cos(raan) * Math.cos(peri) - Math.sin(raan) * Math.cos(inc) * Math.sin(peri)),
    y: rp * (Math.sin(raan) * Math.cos(peri) + Math.cos(raan) * Math.cos(inc) * Math.sin(peri)),
    z: rp * Math.sin(peri) * Math.sin(inc),
  };
}
