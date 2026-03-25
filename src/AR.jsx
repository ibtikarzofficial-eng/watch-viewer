import React, { useState, useEffect } from 'react'
import { store } from './ARStore'

export function ARInterface() {
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    // Check WebXR
    if ('xr' in navigator) {
      navigator.xr.isSessionSupported('immersive-ar').then((isSupported) => {
        setSupported(isSupported);
      });
    }
  }, []);

  // Always show the AR button as requested (will trigger WebXR sequence if clicked on mobile Chrome)
  return (
    <div className="ar-container">
      <button
        onClick={() => store.enterAR()}
        className="ar-btn"
      >
        {supported ? "SHOW IN AR" : "OPEN AR CAMERA"}
      </button>
    </div>
  );
}

export function ARScaler({ children }) {
  // In WebXR, the origin (0,0,0) is usually your head level.
  // By pushing the watch down (y: -1.0) and forward (z: -0.6), we simulate it securely resting on a table or the floor natively.
  return (
    <group
      scale={0.2}
      position={[0, -1.0, -0.6]}
    >
      {children}
    </group>
  );
}