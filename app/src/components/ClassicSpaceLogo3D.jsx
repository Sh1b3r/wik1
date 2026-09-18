import React, { useRef, useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

const MODEL_URL = `${import.meta.env.BASE_URL}custom-logo.glb`

export function ClassicSpaceLogo3D({ scale = 1, position = [0, 0, 0], rotation = [0, 0, 0], ...props }) {
  const group = useRef()
  const { scene } = useGLTF(MODEL_URL)

  // Clone scene so each logo in the world has its own independent scene node
  const clonedScene = useMemo(() => {
    if (!scene) return null
    const clone = scene.clone(true)

    // Compute bounding box of the clone
    const box = new THREE.Box3().setFromObject(clone)
    const size = new THREE.Vector3()
    const center = new THREE.Vector3()
    box.getSize(size)
    box.getCenter(center)

    // Fit model in a normalized 2-unit bounding box
    const maxDim = Math.max(size.x, size.y, size.z) || 1
    const baseScale = 2.0 / maxDim
    clone.scale.setScalar(baseScale)

    // Center pivot
    clone.position.sub(center.clone().multiplyScalar(baseScale))

    // Ensure frustum culling is disabled on all submeshes so it never disappears unexpectedly
    clone.traverse((child) => {
      if (child.isMesh) {
        child.frustumCulled = false
      }
    })

    return clone
  }, [scene])

  if (!clonedScene) {
    return (
      <group ref={group} position={position} rotation={rotation} scale={scale} {...props}>
        <mesh>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#ff4400" />
        </mesh>
      </group>
    )
  }

  return (
    <group ref={group} position={position} rotation={rotation} scale={scale} {...props} dispose={null}>
      <primitive object={clonedScene} />
    </group>
  )
}

export default ClassicSpaceLogo3D