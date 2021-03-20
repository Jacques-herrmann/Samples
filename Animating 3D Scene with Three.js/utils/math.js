export const lerp = (a, b, n) => (1 - n) * a + n * b;
export const clamp = (val, min, max) => Math.max(Math.min(val, max), min);
export const normalize = (v, vmin, vmax, tmin, tmax) => {
    const nv = clamp(v, vmin, vmax);
    const dv = vmax - vmin;
    const pc = (nv - vmin) / dv;
    const dt = tmax - tmin;
    return tmin + (pc * dt)
};