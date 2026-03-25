import { Suspense, useState, useRef, useMemo } from 'react'
import * as THREE from 'three'
import './App.css'
import { Canvas } from '@react-three/fiber'
import { Environment, OrbitControls } from '@react-three/drei'
import gsap from 'gsap'
import CanvasLoader from './CanvasLoader'
import { Model as WatchModel } from './WatchModel'
import UI from './UI'
import { createXRStore, XR, useXRHitTest } from '@react-three/xr'

// 1. PURE XR STORE: No DOM Overlays to crash your Android device
const store = createXRStore()

function ARScanner({ activeColor }) {
  const reticleRef = useRef()
  const watchGroupRef = useRef()
  const [isPlaced, setIsPlaced] = useState(false)

  const matrixHelper = useMemo(() => new THREE.Matrix4(), [])

  // 2. THE HIT TESTER: Scans the physical floor
  useXRHitTest((results, getWorldMatrix) => {
    if (!isPlaced && reticleRef.current) {
      if (results.length > 0) {
        getWorldMatrix(matrixHelper, results[0])
        reticleRef.current.position.setFromMatrixPosition(matrixHelper)
        reticleRef.current.visible = true
      } else {
        reticleRef.current.visible = false
      }
    }
  }, 'viewer')

  const placeWatch = () => {
    if (!isPlaced && reticleRef.current?.visible) {
      // Move the hidden watch to where the ring is, then show it
      watchGroupRef.current.position.copy(reticleRef.current.position)
      watchGroupRef.current.visible = true
      reticleRef.current.visible = false
      setIsPlaced(true)
    }
  }

  return (
    <group>
      {/* THE RING: Tap this to place the watch */}
      <mesh ref={reticleRef} rotation={[-Math.PI / 2, 0, 0]} visible={false} onPointerDown={placeWatch}>
        <ringGeometry args={[0.08, 0.1, 32]} />
        <meshBasicMaterial color="#00E5FF" />
      </mesh>

      {/* THE WATCH: Starts hidden. Scale is set to 1 so we can see its true size. */}
      <group ref={watchGroupRef} visible={false} scale={[1, 1, 1]}>

        {/* THE RED DEBUG CUBE: A 5cm glowing box. If you see this but no watch, the watch materials are broken in AR. */}
        <mesh position={[0, 0.1, 0]}>
          <boxGeometry args={[0.05, 0.05, 0.05]} />
          <meshBasicMaterial color="#FF0000" />
        </mesh>

        <WatchModel position={[0, 0, 0]} accentColor={activeColor} />
      </group>
    </group>
  )
}

export default function App() {
  const [activeColor, setActiveColor] = useState('#00E5FF')
  const [isAR, setIsAR] = useState(false)
  const controlsRef = useRef()

  const viewCamera = (view) => {
    const views = {
      face: { pos: [0, 0, 5], target: [0, 0, 0] },
      side: { pos: [4, 0.5, 2], target: [0, -0.1, 0] },
      buckle: { pos: [0, -3.5, -3], target: [0, -0.5, -0.5] }
    }
    const { pos, target } = views[view]

    gsap.to(controlsRef.current.object.position, { x: pos[0], y: pos[1], z: pos[2], duration: 1.5, ease: "power3.inOut" })
    gsap.to(controlsRef.current.target, { x: target[0], y: target[1], z: target[2], duration: 1.5, ease: "power3.inOut" })
  }

  const handleEnterAR = () => {
    setIsAR(true);
    // Requesting hit-test explicitly, but completely removing domOverlay
    store.enterAR({ requiredFeatures: ['hit-test'] }).catch((err) => {
      console.error(err);
      setIsAR(false);
    });
  };

  return (
    <div style={{ position: 'relative', height: '100%', width: '100%' }}>

      {/* 3. THE UI FIX: Moved the button down to 4% so it sits perfectly under the color swatches */}
      {!isAR && (
        <button
          onClick={handleEnterAR}
          style={{
            position: 'absolute', bottom: '4%', left: '50%', transform: 'translateX(-50%)',
            zIndex: 20, background: 'white', color: 'black', padding: '10px 24px',
            borderRadius: '30px', fontWeight: '800', letterSpacing: '2px', textTransform: 'uppercase',
            border: 'none', cursor: 'pointer', boxShadow: '0 4px 15px rgba(255,255,255,0.3)',
            fontSize: '0.8rem'
          }}
        >
          View in Your Space
        </button>
      )}

      {!isAR && <UI setActiveColor={setActiveColor} activeColor={activeColor} viewCamera={viewCamera} />}

      <Canvas camera={{ position: [0, 0, 5], fov: 50 }} gl={{ alpha: true, antialias: true }}>
        <XR store={store}>
          <OrbitControls ref={controlsRef} makeDefault minPolarAngle={Math.PI / 4} maxPolarAngle={Math.PI / 1.5} enablePan={false} />

          {/* Heavy lighting so the watch doesn't go invisible in AR */}
          <ambientLight intensity={3} />
          <directionalLight position={[5, 10, 5]} intensity={5} />
          <Environment preset='city' environmentIntensity={1.2} />

          <Suspense fallback={<CanvasLoader />}>
            {isAR ? (
              <ARScanner activeColor={activeColor} />
            ) : (
              <WatchModel position={[0, 0.35, 0]} accentColor={activeColor} />
            )}
          </Suspense>
        </XR>
      </Canvas>
    </div>
  )
}