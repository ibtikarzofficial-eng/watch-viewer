import { Suspense, useState, useRef } from 'react'
import './App.css'
import { Canvas } from '@react-three/fiber'
import { Environment, OrbitControls } from '@react-three/drei'
import { createXRStore, XR } from '@react-three/xr'
import gsap from 'gsap'
import CanvasLoader from './CanvasLoader'
import { Model as WatchModel } from './WatchModel'
import UI from './UI'

const store = createXRStore()

function App() {
  const [activeColor, setActiveColor] = useState('#00E5FF')
  const controlsRef = useRef()

  const viewCamera = (view) => {
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

      <button
        onClick={() => store.enterAR()}
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
      </button>

      <UI setActiveColor={setActiveColor} activeColor={activeColor} viewCamera={viewCamera} />

      <Canvas camera={{ position: [0, 0, 5], fov: 50 }} gl={{ alpha: true, antialias: true }}>
        <XR store={store}>
          <OrbitControls
            ref={controlsRef}
            makeDefault
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={Math.PI / 1.5}
            enablePan={false}
          />

          {/* THE AR LIFESAVER: Raw lighting that cannot fail in WebXR */}
          <ambientLight intensity={2.5} />
          <directionalLight position={[5, 10, 5]} intensity={4} />
          <directionalLight position={[-5, -5, -5]} intensity={2} />

          <Environment preset='city' environmentIntensity={1.2} />

          <Suspense fallback={<CanvasLoader />}>
            {/* ANCHOR POINT: 0.5 meters exactly in front of your phone camera */}
            <group position={[0, 0, -0.5]}>

              {/* THE DEBUG CUBE: This proves if the AR positioning is working */}
              <mesh position={[0.2, 0, 0]} scale={[0.05, 0.05, 0.05]}>
                <boxGeometry />
                <meshBasicMaterial color="#FF0000" />
              </mesh>

              {/* THE WATCH */}
              <group scale={[0.15, 0.15, 0.15]}>
                <WatchModel position={[0, 0, 0]} accentColor={activeColor} />
              </group>

            </group>
          </Suspense>
        </XR>
      </Canvas>
    </div>
  )
}

export default App