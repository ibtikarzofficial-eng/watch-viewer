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

// 1. THE DOM OVERLAY FIX: This forces the browser to show your HTML toasts over the AR camera
const store = createXRStore({
  sessionInit: {
    requiredFeatures: ['hit-test'],
    optionalFeatures: ['dom-overlay'],
    domOverlay: { root: document.body }
  }
})

function ARScanner({ activeColor, setToast }) {
  const reticleRef = useRef()
  const watchGroupRef = useRef() // We use a ref to move the watch, NOT React State
  const [isPlaced, setIsPlaced] = useState(false)

  const matrixHelper = useMemo(() => new THREE.Matrix4(), [])

  useXRHitTest((results, getWorldMatrix) => {
    if (!isPlaced && reticleRef.current) {
      if (results.length > 0) {
        getWorldMatrix(matrixHelper, results[0])
        reticleRef.current.position.setFromMatrixPosition(matrixHelper)
        reticleRef.current.visible = true
        setToast("TARGET LOCKED: Tap the blue circle to place watch")
      } else {
        reticleRef.current.visible = false
        setToast("SCANNING... Point camera at the floor and move it slowly")
      }
    }
  }, 'viewer')

  const placeWatch = () => {
    // 2. THE GPU FIX: We don't re-render. We just move the hidden watch and make it visible.
    if (!isPlaced && reticleRef.current?.visible) {
      watchGroupRef.current.position.copy(reticleRef.current.position)
      watchGroupRef.current.visible = true
      reticleRef.current.visible = false
      setIsPlaced(true)
      setToast("WATCH PLACED! You can now walk around it.")
    }
  }

  return (
    <group>
      {/* Attach the tap event directly to the glowing ring */}
      <mesh ref={reticleRef} rotation={[-Math.PI / 2, 0, 0]} visible={false} onPointerDown={placeWatch}>
        <ringGeometry args={[0.08, 0.1, 32]} />
        <meshBasicMaterial color="#00E5FF" />
      </mesh>

      {/* The watch is loaded into memory instantly, but stays invisible until you tap */}
      <group ref={watchGroupRef} visible={false}>
        {/* The 10cm Red Debug Cube */}
        <mesh position={[0, 0.1, 0]}>
          <boxGeometry args={[0.1, 0.1, 0.1]} />
          <meshBasicMaterial color="#FF0000" />
        </mesh>
        <WatchModel position={[0, 0, 0]} accentColor={activeColor} />
      </group>
    </group>
  )
}

function App() {
  const [activeColor, setActiveColor] = useState('#00E5FF')
  const [isAR, setIsAR] = useState(false)
  const [toast, setToast] = useState("")
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
    setToast("STARTING AR...");

    store.enterAR().catch(() => {
      setIsAR(false);
      setToast("");
    });
  };

  return (
    <div style={{ position: 'relative', height: '100%', width: '100%' }}>

      {/* THIS TOAST WILL NOW FLOAT OVER THE CAMERA */}
      {isAR && toast && (
        <div style={{
          position: 'absolute', top: '10%', left: '50%', transform: 'translateX(-50%)',
          background: 'rgba(0, 0, 0, 0.8)', border: '2px solid #00E5FF',
          color: '#00E5FF', padding: '15px 30px', borderRadius: '8px', zIndex: 9999,
          fontWeight: '800', letterSpacing: '1px', textAlign: 'center', width: '80%'
        }}>
          {toast}
        </div>
      )}

      {!isAR && (
        <button
          onClick={handleEnterAR}
          style={{
            position: 'absolute', bottom: '35%', left: '50%', transform: 'translateX(-50%)',
            zIndex: 20, background: 'white', color: 'black', padding: '12px 24px',
            borderRadius: '30px', fontWeight: '800', letterSpacing: '2px', textTransform: 'uppercase',
            border: 'none', cursor: 'pointer', boxShadow: '0 4px 15px rgba(255,255,255,0.3)'
          }}
        >
          View in Your Space
        </button>
      )}

      {!isAR && <UI setActiveColor={setActiveColor} activeColor={activeColor} viewCamera={viewCamera} />}

      <Canvas camera={{ position: [0, 0, 5], fov: 50 }} gl={{ alpha: true, antialias: true }}>
        <XR store={store}>
          <OrbitControls ref={controlsRef} makeDefault minPolarAngle={Math.PI / 4} maxPolarAngle={Math.PI / 1.5} enablePan={false} />

          {/* AR Lighting */}
          <ambientLight intensity={2.5} />
          <directionalLight position={[5, 10, 5]} intensity={4} />
          <Environment preset='city' environmentIntensity={1.2} />

          <Suspense fallback={<CanvasLoader />}>
            {isAR ? (
              <ARScanner activeColor={activeColor} setToast={setToast} />
            ) : (
              <WatchModel position={[0, 0.35, 0]} accentColor={activeColor} />
            )}
          </Suspense>
        </XR>
      </Canvas>
    </div>
  )
}

export default App