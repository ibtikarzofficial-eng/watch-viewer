import { Suspense, useState, useRef, useEffect } from 'react'
import './App.css'
import { Canvas } from '@react-three/fiber'
import { Environment, OrbitControls, ContactShadows, PerspectiveCamera } from '@react-three/drei'
import { EffectComposer, ToneMapping } from '@react-three/postprocessing'
import gsap from 'gsap'
import CanvasLoader from './CanvasLoader'
import { Model as WatchModel } from './WatchModel'
import UI from './UI'

function App() {
  const [activeColor, setActiveColor] = useState('#00E5FF')
  const [env, setEnv] = useState('city')
  const controlsRef = useRef()
  const cameraRef = useRef()

  useEffect(() => {
    gsap.fromTo('.top-bar',
      { y: -30, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.2, ease: "power3.out", delay: 0.2 }
    );
  }, []);

  const viewCamera = (view) => {
    const views = {
      face: { pos: [0, -0.6, 0.4], target: [0, -1.05, -0.6] },
      side: { pos: [0.8, -0.9, -0.2], target: [0, -1.05, -0.55] },
      buckle: { pos: [0, -1.7, -1.2], target: [0, -1.05, -0.6] },
      macro: { pos: [0.16, -0.9, -0.36], target: [0, -0.98, -0.56] }
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
    <div className={`app-container ${env === 'sunset' ? 'sunset' : ''}`}>

      {/* RESPONSIVE UI OVERLAY */}
      <div className="ui-container">
        {/* TOP BAR */}
        <div className="top-bar">
          <div className="title-container">
            <h1>Edifice <span>Configurator v0.0.2</span></h1>
          </div>

          <div className="lighting-toggles">
            <button
              onClick={() => setEnv('city')}
              className="lighting-btn"
              style={{ background: env === 'city' ? '#00E5FF' : 'rgba(255,255,255,0.1)', color: env === 'city' ? 'black' : 'white' }}>
              STUDIO
            </button>
            <button
              onClick={() => setEnv('sunset')}
              className="lighting-btn"
              style={{ background: env === 'sunset' ? '#00E5FF' : 'rgba(255,255,255,0.1)', color: env === 'sunset' ? 'black' : 'white' }}>
              GOLDEN HOUR
            </button>
            <button
              onClick={() => viewCamera('macro')}
              className="lighting-btn"
              style={{ background: '#fff', color: '#000' }}>
              MACRO ZOOM
            </button>
          </div>
        </div>

        {/* BOTTOM AREA */}
        <div className="bottom-area">
          <UI setActiveColor={setActiveColor} activeColor={activeColor} viewCamera={viewCamera} />
        </div>
      </div>

      <Canvas shadows gl={{ alpha: true, antialias: true, stencil: false, depth: true }} style={{ width: '100%', height: '100%', background: 'transparent' }}>
        <PerspectiveCamera makeDefault ref={cameraRef} position={[0, -0.6, 0.4]} fov={40} />

        <OrbitControls
          ref={controlsRef}
          makeDefault
          enablePan={false}
          minDistance={0.1}
          maxDistance={3}
          target={[0, -1.0, -0.6]}
          autoRotate={true}
          autoRotateSpeed={0.5}
        />

        <Environment preset={env} environmentIntensity={1.5} />

        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} castShadow />

        <Suspense fallback={<CanvasLoader />}>
          <group scale={0.2} position={[0, -1.0, -0.6]}>
            <WatchModel accentColor={activeColor} />
          </group>

          {/* Contact Shadows for grounding */}
          <ContactShadows position={[0, -1.1, -0.6]} opacity={0.6} scale={2} blur={2} far={2.0} />
        </Suspense>

        {/* Post Processing */}
        <EffectComposer disableNormalPass>
          <ToneMapping />
        </EffectComposer>
      </Canvas>
    </div>
  )
}

export default App