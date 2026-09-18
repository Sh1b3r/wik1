import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

const MODEL_URL = `${import.meta.env.BASE_URL}model.glb`

export function SpeederModel({ floating = true, tilt = 0, ...props }) {
  const group = useRef()
  const { scene } = useGLTF(MODEL_URL)
  // Clone so each Canvas gets its own independent scene graph
  const clonedScene = useMemo(() => scene.clone(true), [scene])

  // Floating hover animation
  useFrame((state) => {
    if (group.current) {
      if (floating) {
        group.current.position.y = Math.sin(state.clock.elapsedTime * 2.5) * 0.05
      }
      group.current.rotation.z = THREE.MathUtils.lerp(group.current.rotation.z, tilt, 0.1)
    }
  })

  return (
    <group ref={group} {...props} dispose={null}>
      <primitive object={clonedScene} scale={11.3535} position={[0, 0, 0]} rotation={[0, 0, 0]} />
    </group>
  )
}


