import React, { useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export function Model({ accentColor = "#00E5FF", ...props }) {
  const { nodes, materials } = useGLTF('./watch-opt.glb', true)

  // 1. Create ONE single material instance for performance
  const accentMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#00E5FF',
    emissive: '#00E5FF',
    emissiveIntensity: 0.5,
    roughness: 0.2,
    metalness: 0.8
  }), []);

  // 2. Target color to lerp towards
  const targetColor = useMemo(() => new THREE.Color(), []);

  // 3. Glide the color smoothly every frame
  useFrame((state, delta) => {
    targetColor.set(accentColor);
    accentMaterial.color.lerp(targetColor, delta * 5);
    accentMaterial.emissive.lerp(targetColor, delta * 5);
  });

  return (
    <group {...props} dispose={null}>
      <group position={[0, -0.352, 0.732]}>
        <group rotation={[Math.PI / 2, 0, 0]}>
          <group position={[0.003, 0, 0.229]} rotation={[0, 0.001, 0]}>
            <mesh geometry={nodes.Object_4.geometry} material={materials['Material.001']} />
            {/* Apply the memoized material instance directly */}
            <mesh geometry={nodes.Object_5.geometry} material={accentMaterial} />
          </group>
          <group position={[0, -0.007, 0]} scale={[0.014, 0.012, 0.038]}>
            <mesh geometry={nodes.Object_7.geometry} material={materials['Material.009']} />
            <mesh geometry={nodes.Object_8.geometry} material={accentMaterial} />
          </group>
          <group position={[-0.002, 0.014, -0.002]} rotation={[0, 0.941, 0]} scale={[0.024, 0.016, 0.024]}>
            <mesh geometry={nodes.Object_10.geometry} material={materials['Material.001']} />
            <mesh geometry={nodes.Object_11.geometry} material={accentMaterial} />
          </group>
          <group position={[-0.002, 0.014, -0.002]} rotation={[-3.14, -0.475, Math.PI]}>
            <mesh geometry={nodes.Object_13.geometry} material={accentMaterial} />
            <mesh geometry={nodes.Object_14.geometry} material={materials['Material.003']} />
          </group>
          <group position={[-0.002, 0.014, -0.002]} rotation={[0, 0.889, 0]} scale={[0.024, 0.016, 0.024]}>
            <mesh geometry={nodes.Object_16.geometry} material={materials['Material.001']} />
            <mesh geometry={nodes.Object_17.geometry} material={accentMaterial} />
          </group>
          <group position={[0, -0.134, -0.754]} rotation={[-Math.PI, 0, -Math.PI]}>
            <mesh geometry={nodes.Object_33.geometry} material={materials['Material.001']} />
            <mesh geometry={nodes.Object_34.geometry} material={accentMaterial} />
          </group>
          <group position={[-0.213, -0.004, 0.008]} scale={[0.024, 0.016, 0.024]}>
            <mesh geometry={nodes.Object_36.geometry} material={materials['Material.001']} />
            <mesh geometry={nodes.Object_37.geometry} material={accentMaterial} />
          </group>
          <group position={[0.227, -0.002, 0.005]} rotation={[0, 1.017, 0]} scale={[0.024, 0.016, 0.024]}>
            <mesh geometry={nodes.Object_39.geometry} material={materials['Material.001']} />
            <mesh geometry={nodes.Object_40.geometry} material={accentMaterial} />
          </group>

          <group position={[0, -0.008, 0]} scale={0.438}>
            <mesh geometry={nodes.Object_66.geometry} material={materials['Material.006']} />
            <mesh geometry={nodes.Object_67.geometry} material={materials['Material.007']} />
            <mesh geometry={nodes.Object_68.geometry} material={materials['Material.010']} />
          </group>
          <group position={[0, 0.028, 0]} scale={[0.488, 0.42, 0.488]}>
            <mesh geometry={nodes.Object_72.geometry} material={materials.Material} />
            <mesh geometry={nodes.Object_73.geometry} material={materials.Material} />
          </group>

          <mesh geometry={nodes.Object_19.geometry} material={materials.Material} position={[0, -0.013, -0.592]} scale={[0.219, 0.105, 0.024]} />
          <mesh geometry={nodes.Object_21.geometry} material={materials.Material} position={[0, -0.013, 0.593]} rotation={[-Math.PI, 0, -Math.PI]} scale={[0.219, 0.105, 0.024]} />
          <mesh geometry={nodes.Object_23.geometry} material={materials.Material} position={[0.662, -0.065, -0.003]} rotation={[0, 0, -Math.PI / 2]} scale={0.063} />
          <mesh geometry={nodes.Object_25.geometry} material={materials.Material} position={[0.55, -0.061, -0.303]} rotation={[0, 0.496, -Math.PI / 2]} scale={0.06} />
          <mesh geometry={nodes.Object_27.geometry} material={materials.Material} position={[0.545, -0.061, 0.312]} rotation={[-Math.PI, 0.509, -Math.PI / 2]} scale={[-0.06, 0.06, 0.06]} />
          <mesh geometry={nodes.Object_29.geometry} material={materials.Material} position={[0.655, -0.053, 0.118]} rotation={[0, 0, -Math.PI / 2]} scale={0.047} />
          <mesh geometry={nodes.Object_31.geometry} material={materials.Material} position={[0.655, -0.053, -0.124]} rotation={[-Math.PI, 0, -Math.PI / 2]} scale={0.047} />
          <mesh geometry={nodes.Object_42.geometry} material={materials['Material.011']} position={[-0.002, 0.001, -0.235]} scale={[0.111, 0.111, 0.071]} />
          <mesh geometry={nodes.Object_44.geometry} material={materials['Material.009']} position={[-0.002, -0.013, -0.235]} scale={0.102} />
          <mesh geometry={nodes.Object_46.geometry} material={materials['Material.015']} position={[0, 0.001, -0.002]} />
          <mesh geometry={nodes.Object_48.geometry} material={materials['Material.016']} position={[0.003, 0.002, 0.229]} rotation={[0, -0.194, 0]} />
          <mesh geometry={nodes.Object_50.geometry} material={materials['Material.016']} position={[-0.213, -0.002, 0.008]} />
          <mesh geometry={nodes.Object_52.geometry} material={materials['Material.016']} position={[0.226, 0.001, 0.006]} scale={0.955} />
          <mesh geometry={nodes.Object_54.geometry} material={materials['Material.016']} position={[0.226, 0.005, 0.006]} scale={0.984} />

          <mesh geometry={nodes.Object_60.geometry} material={materials.Material} position={[0.014, -1.032, -0.22]} rotation={[-2.972, 0, 0]} scale={0.108} />
          <mesh geometry={nodes.Object_62.geometry} material={materials['Material.013']} position={[0, -0.136, 0]} rotation={[0, 0.442, 0]} />
          <mesh geometry={nodes.Object_64.geometry} material={materials['Material.004']} position={[0, -0.976, -0.455]} rotation={[0.103, 0, 0]} scale={[0.322, 0.061, 0.061]} />
          <mesh geometry={nodes.Object_70.geometry} material={materials['Material.001']} position={[0, -0.002, 0]} scale={[0.438, 0.377, 0.438]} />
          <mesh geometry={nodes.Object_75.geometry} material={materials['Material.012']} position={[0, 0.028, 0]} />
          <mesh geometry={nodes.Object_77.geometry} material={materials['Material.005']} position={[0, -0.002, 0]} />
          <mesh geometry={nodes.Object_79.geometry} material={materials['Material.016']} position={[0, -0.008, 0]} />
          <mesh geometry={nodes.Object_81.geometry} material={materials.material_0} position={[0, 0.028, 0]} scale={1.011} />
        </group>
      </group>
    </group>
  )
}

useGLTF.preload('/watch.glb')