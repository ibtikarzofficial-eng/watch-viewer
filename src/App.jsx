import { Suspense, useState, useRef } from 'react'
import './App.css'
import { Canvas } from '@react-three/fiber'
import { Environment, OrbitControls } from '@react-three/drei'
import { ARButton, XR } from '@react-three/xr' // THE NEW AR IMPORTS
import gsap from 'gsap'
import CanvasLoader from './CanvasLoader'
import { Model as WatchModel } from './WatchModel'
import UI from './UI'

function App() {
  const [activeColor, setActiveColor] = useState('#00E5FF')
  const controlsRef = useRef()

  const viewCamera = (view) => {
    // ... keep your existing GSAP viewCamera logic exactly the same
    const views = {
      face: { pos: [0, 0, 5], target: [0, 0, 0] },
      side: { pos: [4, 0.5, 2], target: [0, -0.1, 0] },
      buckle: { pos: [0, -3.5, -3], target: [0, -0.5, -0.5] }
    }
    const { pos, target } = views[view]

    gsap.to(controlsRef.current.object.position, {
      x: pos[0], y: pos[1], z: pos[2],
      duration: 1.5,
      ease: "power3.inOut"
    })
    gsap.to(controlsRef.current.target, {
      x: target[0], y: target[1], z: target[2],
      duration: 1.5,
      ease: "power3.inOut"
    })
  }

  return (
    <div style={{ position: 'relative', height: '100%', width: '100%' }}>

      {/* THE AR BUTTON: This automatically detects if the device supports AR */}
      <ARButton
        style={{
          position: 'absolute',
          bottom: '35%',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 20,
          background: 'white',
          color: 'black',
          padding: '12px 24px',
          borderRadius: '30px',
          fontWeight: '800',
          letterSpacing: '2px',
          textTransform: 'uppercase',
          border: 'none',
          cursor: 'pointer',
          boxShadow: '0 4px 15px rgba(255,255,255,0.3)'
        }}
      >
        View in Your Space
      </ARButton>

      <UI setActiveColor={setActiveColor} activeColor={activeColor} viewCamera={viewCamera} />

      <Canvas camera={{ position: [0, 0, 5], fov: 50 }} gl={{ alpha: true, antialias: true }}>
        {/* Wrap your 3D world in the XR provider */}
        <XR>
          <OrbitControls
            ref={controlsRef}
            makeDefault
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={Math.PI / 1.5}
            enablePan={false}
          />
          <Environment preset='city' environmentIntensity={1.2} />

          <Suspense fallback={<CanvasLoader />}>
            {/* THE GODZILLA FIX: 
                If the watch looks massive in AR, you will need to wrap it in a group 
                and scale it down drastically like: scale={[0.05, 0.05, 0.05]} 
                For now, test its native scale first.
            */}
            <WatchModel position={[0, 0.35, 0]} accentColor={activeColor} />
          </Suspense>
        </XR>
      </Canvas>
    </div>
  )
}

export default App