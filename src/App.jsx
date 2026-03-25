import { Suspense, useState, useRef, useEffect } from 'react'
import './App.css'
import { Canvas } from '@react-three/fiber'
import { Environment, OrbitControls } from '@react-three/drei'
import gsap from 'gsap'
import CanvasLoader from './CanvasLoader'
import { Model as WatchModel } from './WatchModel'
import UI from './UI'
import { createXRStore, XR, useHitTest } from '@react-three/xr'

// 1. Initialize XR with hit-testing required
const store = createXRStore({
  sessionInit: { requiredFeatures: ['hit-test'] }
})

// 2. THE AR ENGINE (Now with HUD communication)
function ARScanner({ activeColor, setToast }) {
  const reticleRef = useRef()
  const [placedPos, setPlacedPos] = useState(null)
  const hasFoundSurface = useRef(false)

  // Scan the physical room every frame
  useHitTest((hitMatrix) => {
    if (!placedPos && reticleRef.current) {
      hitMatrix.decompose(
        reticleRef.current.position,
        reticleRef.current.quaternion,
        reticleRef.current.scale
      )

      // If we just found the floor for the first time, update the HUD!
      if (!hasFoundSurface.current) {
        hasFoundSurface.current = true;
        setToast("TARGET LOCKED: Tap screen to place watch");
      }
    }
  })

  // Teleport the watch to the ring
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
      {/* The Targeting Ring: Made it a solid, bright disc so it is IMPOSSIBLE to miss */}
      {!placedPos && (
        <mesh ref={reticleRef} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.1, 32]} />
          <meshBasicMaterial color="#00E5FF" transparent opacity={0.6} />
        </mesh>
      )}

      {/* The Watch: Spawns exactly where tapped */}
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