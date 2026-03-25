import { Suspense, useState, useRef, useMemo } from 'react'
import * as THREE from 'three' // THE NEW REQUIREMENT FOR HIT TESTING
import './App.css'
import { Canvas } from '@react-three/fiber'
import { Environment, OrbitControls } from '@react-three/drei'
import gsap from 'gsap'
import CanvasLoader from './CanvasLoader'
import { Model as WatchModel } from './WatchModel'
import UI from './UI'

// THE FIXED IMPORT
import { createXRStore, XR, useXRHitTest } from '@react-three/xr'

const store = createXRStore() // hit-testing is now enabled by default in v6

// 2. THE AR ENGINE (Now with HUD communication)
function ARScanner({ activeColor, setToast }) {
  const reticleRef = useRef()
  const [placedPos, setPlacedPos] = useState(null)
  const hasFoundSurface = useRef(false)

  // We need a blank 3D matrix to hold the floor's coordinates
  const matrixHelper = useMemo(() => new THREE.Matrix4(), [])

  // THE NEW V6 HIT TEST API
  useXRHitTest(
    (results, getWorldMatrix) => {
      // If we haven't placed the watch yet, keep scanning
      if (!placedPos && reticleRef.current) {
        // If the scanner finds a physical floor (results > 0)
        if (results.length > 0) {
          // Extract the exact 3D coordinates from the physical world
          getWorldMatrix(matrixHelper, results[0])

          // Move our glowing cyan ring to those coordinates
          reticleRef.current.position.setFromMatrixPosition(matrixHelper)

          // Trigger the HUD update only once
          if (!hasFoundSurface.current) {
            hasFoundSurface.current = true;
            setToast("TARGET LOCKED: Tap screen to place watch");
          }
        }
      }
    },
    'viewer' // Casts the scanning ray directly from the center of your phone screen
  )

  const placeWatch = () => {
    if (!placedPos && reticleRef.current && hasFoundSurface.current) {
      setPlacedPos([
        reticleRef.current.position.x,
        reticleRef.current.position.y,
        reticleRef.current.position.z
      ])
      setToast("WATCH PLACED! Walk around to inspect.");
    }
  }

  return (
    <group onPointerDown={placeWatch}>
      {!placedPos && (
        <mesh ref={reticleRef} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.1, 32]} />
          <meshBasicMaterial color="#00E5FF" transparent opacity={0.6} />
        </mesh>
      )}

      {placedPos && (
        <group position={placedPos} scale={[0.15, 0.15, 0.15]}>
          <WatchModel position={[0, 0, 0]} accentColor={activeColor} />
        </group>
      )}
    </group>
  )
}

// 3. THE MAIN APP
function App() {
  const [activeColor, setActiveColor] = useState('#00E5FF')
  const [isAR, setIsAR] = useState(false)
  const [toast, setToast] = useState("") // THE NEW HUD STATE
  const controlsRef = useRef()

  const viewCamera = (view) => {
    const views = {
      face: { pos: [0, 0, 5], target: [0, 0, 0] },
      side: { pos: [4, 0.5, 2], target: [0, -0.1, 0] },
      buckle: { pos: [0, -3.5, -3], target: [0, -0.5, -0.5] }
    }
    const { pos, target } = views[view]

    gsap.to(controlsRef.current.object.position, {
      x: pos[0], y: pos[1], z: pos[2], duration: 1.5, ease: "power3.inOut"
    })
    gsap.to(controlsRef.current.target, {
      x: target[0], y: target[1], z: target[2], duration: 1.5, ease: "power3.inOut"
    })
  }

  const handleEnterAR = () => {
    setIsAR(true);
    setToast("SCANNING ROOM... Point camera at a flat, bright floor.");

    store.enterAR().catch(() => {
      setIsAR(false);
      setToast(""); // Clear toast if AR fails or is canceled
    });
  };

  return (
    <div style={{ position: 'relative', height: '100%', width: '100%' }}>

      {/* THE HUD / TOAST NOTIFICATION */}
      {toast && (
        <div style={{
          position: 'absolute', top: '10%', left: '50%', transform: 'translateX(-50%)',
          background: 'rgba(0, 229, 255, 0.2)', border: '1px solid #00E5FF',
          color: '#fff', padding: '15px 30px', borderRadius: '8px', zIndex: 100,
          fontWeight: '600', letterSpacing: '1px', textAlign: 'center',
          backdropFilter: 'blur(10px)', width: '80%', maxWidth: '400px'
        }}>
          {toast}
        </div>
      )}

      {/* Hide the AR button when already inside AR */}
      {!isAR && (
        <button
          onClick={handleEnterAR}
          style={{
            position: 'absolute', bottom: '35%', left: '50%', transform: 'translateX(-50%)',
            zIndex: 20, background: 'white', color: 'black', padding: '12px 24px',
            borderRadius: '30px', fontWeight: '800', letterSpacing: '2px',
            textTransform: 'uppercase', border: 'none', cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(255,255,255,0.3)'
          }}
        >
          View in Your Space
        </button>
      )}

      {/* Hide UI swatches while in AR so user can focus on placing the watch */}
      {!isAR && <UI setActiveColor={setActiveColor} activeColor={activeColor} viewCamera={viewCamera} />}

      <Canvas camera={{ position: [0, 0, 5], fov: 50 }} gl={{ alpha: true, antialias: true }}>
        <XR store={store}>
          <OrbitControls ref={controlsRef} makeDefault minPolarAngle={Math.PI / 4} maxPolarAngle={Math.PI / 1.5} enablePan={false} />

          <ambientLight intensity={2.5} />
          <directionalLight position={[5, 10, 5]} intensity={4} />
          <directionalLight position={[-5, -5, -5]} intensity={2} />
          <Environment preset='city' environmentIntensity={1.2} />

          <Suspense fallback={<CanvasLoader />}>
            {isAR ? (
              <ARScanner activeColor={activeColor} setToast={setToast} />
            ) : (
              // NON-AR MODE: perfectly centered, normal size, no red cube
              <WatchModel position={[0, 0.35, 0]} accentColor={activeColor} />
            )}
          </Suspense>
        </XR>
      </Canvas>
    </div>
  )
}

export default App