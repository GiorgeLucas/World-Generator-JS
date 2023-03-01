var m_permutation = [151, 160, 137, 91, 90, 15,
  131, 13, 201, 95, 96, 53, 194, 233, 7, 225, 140, 36, 103, 30, 69, 142, 8, 99, 37, 240, 21, 10, 23,
  190, 6, 148, 247, 120, 234, 75, 0, 26, 197, 62, 94, 252, 219, 203, 117, 35, 11, 32, 57, 177, 33,
  88, 237, 149, 56, 87, 174, 20, 125, 136, 171, 168, 68, 175, 74, 165, 71, 134, 139, 48, 27, 166,
  77, 146, 158, 231, 83, 111, 229, 122, 60, 211, 133, 230, 220, 105, 92, 41, 55, 46, 245, 40, 244,
  102, 143, 54, 65, 25, 63, 161, 1, 216, 80, 73, 209, 76, 132, 187, 208, 89, 18, 169, 200, 196,
  135, 130, 116, 188, 159, 86, 164, 100, 109, 198, 173, 186, 3, 64, 52, 217, 226, 250, 124, 123,
  5, 202, 38, 147, 118, 126, 255, 82, 85, 212, 207, 206, 59, 227, 47, 16, 58, 17, 182, 189, 28, 42,
  223, 183, 170, 213, 119, 248, 152, 2, 44, 154, 163, 70, 221, 153, 101, 155, 167, 43, 172, 9,
  129, 22, 39, 253, 19, 98, 108, 110, 79, 113, 224, 232, 178, 185, 112, 104, 218, 246, 97, 228,
  251, 34, 242, 193, 238, 210, 144, 12, 191, 179, 162, 241, 81, 51, 145, 235, 249, 14, 239, 107,
  49, 192, 214, 31, 181, 199, 106, 157, 184, 84, 204, 176, 115, 121, 50, 45, 127, 4, 150, 254,
  138, 236, 205, 93, 222, 114, 67, 29, 24, 72, 243, 141, 128, 195, 78, 66, 215, 61, 156, 180];


function RemapClamp_01(x) {
  if (x <= -1.0) {
    return 0.0;
  }
  else if (1.0 <= x) {
    return 1.0;
  }
  return (x * 0.5 + 0.5);
}

function Remap_01(x) {
  return (x * 0.5 + 0.5);
}
function Fade(t) {
  return t * t * t * (t * (t * 6 - 15) + 10);
}

function Lerp(a, b, t) {
  return (a + (b - a) * t);
}

function Grad(hash, x, y, z) {
  let h = hash & 15;

  let u = h < 8 ? x : y,
    v = h < 4 ? y : h == 12 || h == 14 ? x : z;

  return ((h & 1) == 0 ? u : -u) + ((h & 2) == 0 ? v : -v);
}

function Octave3D(x, y, z, octaves, persistence) {
  let result = 0;
  let amplitude = 1;

  for (let i = 0; i < octaves; i++) {
    result += (noise3d(x, y, z) * amplitude);
    x *= 2;
    y *= 2;
    z *= 2;
    amplitude *= persistence;
  }
  return result;
}

function noise3d(x, y, z) {
  let _x = Math.floor(x);
  let _y = Math.floor(y);
  let _z = Math.floor(z);

  let ix = _x & 255;
  let iy = _y & 255;
  let iz = _z & 255;

  let fx = (x - _x);
  let fy = (y - _y);
  let fz = (z - _z);

  let u = Fade(fx);
  let v = Fade(fy);
  let w = Fade(fz);

  let A = (m_permutation[ix & 255] + iy) & 255;
  let B = (m_permutation[(ix + 1) & 255] + iy) & 255;

  let AA = (m_permutation[A] + iz) & 255;
  let AB = (m_permutation[(A + 1) & 255] + iz) & 255;

  let BA = (m_permutation[B] + iz) & 255;
  let BB = (m_permutation[(B + 1) & 255] + iz) & 255;

  let p0 = Grad(m_permutation[AA], fx, fy, fz);
  let p1 = Grad(m_permutation[BA], fx - 1, fy, fz);
  let p2 = Grad(m_permutation[AB], fx, fy - 1, fz);
  let p3 = Grad(m_permutation[BB], fx - 1, fy - 1, fz);
  let p4 = Grad(m_permutation[(AA + 1) & 255], fx, fy, fz - 1);
  let p5 = Grad(m_permutation[(BA + 1) & 255], fx - 1, fy, fz - 1);
  let p6 = Grad(m_permutation[(AB + 1) & 255], fx, fy - 1, fz - 1);
  let p7 = Grad(m_permutation[(BB + 1) & 255], fx - 1, fy - 1, fz - 1);

  let q0 = Lerp(p0, p1, u);
  let q1 = Lerp(p2, p3, u);
  let q2 = Lerp(p4, p5, u);
  let q3 = Lerp(p6, p7, u);

  let r0 = Lerp(q0, q1, v);
  let r1 = Lerp(q2, q3, v);

  return Lerp(r0, r1, w);
}

function noise3D_01(x, y, z) {
  return Remap_01(noise3d(x, y, z));
}

function octave3D(x, y, z, octaves, persistence) {
  return Octave3D(x, y, z, octaves, persistence);
}

function octave3D_01(x, y, z, octaves, persistence) {
  return RemapClamp_01(octave3D(x, y, z, octaves, persistence));
}

function MaxAmplitude(octaves, persistence) {
  let result = 0;
  let amplitude = 1;

  for (let i = 0; i < octaves; i++) {
    result += amplitude;
    amplitude *= persistence;
  }
  return result;
}

function normalizedOctave3D(x, y, z, octaves, persistence) {
  return (octave3D(x, y, z, octaves, persistence) / MaxAmplitude(octaves, persistence));
}
function normalizedOctave3D_01(x, y, z, octaves, persistence) {
  return Remap_01(normalizedOctave3D(x, y, z, octaves, persistence));
}