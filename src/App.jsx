import { Suspense, useState } from 'react'
import './App.css'
import { Canvas } from '@react-three/fiber'
import { Environment, OrbitControls } from '@react-three/drei'
import CanvasLoader from './CanvasLoader'
import { Model as WatchModel } from './WatchModel'
import UI from './UI' // Import your UI file

function App() {
  // 1. The Master State (Default to Electric Cyan)
  const [activeColor, setActiveColor] = useState('#00E5FF')

  return (
    <div style={{ position: 'relative', height: '100vh', width: '100vw', background: 'radial-gradient(circle at 50% 50%, #2a2c30 0%, #0a0a0b 100%)' }}>

      {/* 2. THE FACE: Float the UI over the canvas and pass it the state updater */}
      <UI setActiveColor={setActiveColor} activeColor={activeColor} />

      {/* THE 3D UNIVERSE */}
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <OrbitControls
          makeDefault
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 1.5}
          enablePan={false} // <--- This is the magic lock
        />
        {/* Warehouse is a great, highly reflective HDRI for metal watches */}
        <Environment preset='studio' environmentIntensity={0.8} />

        <Suspense fallback={<CanvasLoader />}>
          {/* 3. Pass the brain's color down to the watch model */}
          <WatchModel position={[0, 0.35, 0]} accentColor={activeColor} />
        </Suspense>

      </Canvas>
    </div>
  )
}

export default App