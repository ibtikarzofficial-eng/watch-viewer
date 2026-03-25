import { Suspense, useState, useRef } from 'react'
import './App.css'
import { Canvas } from '@react-three/fiber'
import { Environment, OrbitControls, ContactShadows, PerspectiveCamera } from '@react-three/drei'
import { EffectComposer, Bloom, ToneMapping } from '@react-three/postprocessing'
import gsap from 'gsap'
import CanvasLoader from './CanvasLoader'
import { Model as WatchModel } from './WatchModel'
import UI from './UI'

function App() {
  const [activeColor, setActiveColor] = useState('#00E5FF')
  const [env, setEnv] = useState('city') // Lighting toggle state
  const controlsRef = useRef()
  const cameraRef = useRef()

  const viewCamera = (view) => {
    const views = {
      face: { pos: [0, 0, 5], target: [0, 0, 0] },
      side: { pos: [4, 0.5, 2], target: [0, -0.1, 0] },
      buckle: { pos: [0, -3.5, -3], target: [0, -0.5, -0.5] },
      macro: { pos: [0.8, 0.5, 1.2], target: [0, 0.1, 0.2] } // NEW: Macro Zoom
    }

    const { pos, target } = views[view]

    gsap.to(cameraRef.current.position, {
      x: pos[0], y: pos[1], z: pos[2],
      duration: 2,
      ease: "expo.inOut"
    })

    gsap.to(controlsRef.current.target, {
      x: target[0], y: target[1], z: target[2],
      duration: 2,
      ease: "expo.inOut"
    })
  }

  return (
    <div style={{ position: 'relative', height: '100vh', width: '100vw', background: env === 'city' ? '#050505' : '#1a1a1a' }}>

      {/* 1. LIGHTING TOGGLE */}
      <div style={{ position: 'absolute', top: '100px', left: '40px', zIndex: 10, display: 'flex', gap: '10px' }}>
        <button onClick={() => setEnv('city')} style={btnStyle(env === 'city')}>STUDIO</button>
        <button onClick={() => setEnv('sunset')} style={btnStyle(env === 'sunset')}>GOLDEN HOUR</button>
        <button onClick={() => viewCamera('macro')} style={macroBtnStyle}>MACRO ZOOM</button>
      </div>

      <UI setActiveColor={setActiveColor} activeColor={activeColor} viewCamera={viewCamera} />

      <Canvas shadows gl={{ antialias: true, stencil: false, depth: true }}>
        <PerspectiveCamera makeDefault ref={cameraRef} position={[0, 0, 5]} fov={50} />

        <OrbitControls
          ref={controlsRef}
          makeDefault
          enablePan={false}
          minDistance={1}
          maxDistance={8}
        />

        {/* 2. DYNAMIC ENVIRONMENT */}
        <Environment preset={env} environmentIntensity={env === 'city' ? 1 : 1.5} />

        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} castShadow />

        <Suspense fallback={<CanvasLoader />}>
          <WatchModel position={[0, 0.2, 0]} accentColor={activeColor} />

          {/* 3. CONTACT SHADOWS: Makes the watch feel "grounded" */}
          <ContactShadows position={[0, -1.5, 0]} opacity={0.4} scale={10} blur={2} far={4.5} />
        </Suspense>

        {/* 4. POST-PROCESSING: THE MOVIE LOOK */}
        <EffectComposer disableNormalPass>
          <Bloom
            luminanceThreshold={1.2}
            mipmapBlur
            intensity={0.4}
            radius={0.3}
          />
          <ToneMapping />
        </EffectComposer>
      </Canvas>
    </div>
  )
}

// Quick Styles
const btnStyle = (active) => ({
  background: active ? '#00E5FF' : 'rgba(255,255,255,0.1)',
  color: active ? 'black' : 'white',
  border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '10px'
});

const macroBtnStyle = {
  background: '#fff', color: '#000', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '10px'
};

export default App