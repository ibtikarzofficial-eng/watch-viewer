import { createXRStore } from '@react-three/xr';

// Extracted into a pure JS file so Vite Fast Refresh handles component exports correctly in AR.jsx
export const store = createXRStore();
