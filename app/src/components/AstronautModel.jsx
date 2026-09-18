import React, { useMemo } from 'react'
import { useLoader } from '@react-three/fiber'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js'
import { TextureLoader } from 'three'
import * as THREE from 'three'

const OBJ_URL = `${import.meta.env.BASE_URL}33ea5f182f154eb58632d4463077fd18/3716c913eaabe33c871442eb53379c9e.obj`
const TEXTURE_URL = `${import.meta.env.BASE_URL}33ea5f182f154eb58632d4463077fd18/texture_20250901.png`

export function AstronautModel({
  scale = 1.35,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  ...props
}) {
  const obj = useLoader(OBJLoader, OBJ_URL)
  const texture = useLoader(TextureLoader, TEXTURE_URL)

  const clonedObj = useMemo(() => {
    const clone = obj.clone(true)
    texture.colorSpace = THREE.SRGBColorSpace
    texture.flipY = true

    const material = new THREE.MeshStandardMaterial({
      map: texture,
      roughness: 0.4,
      metalness: 0.15,
    })

    clone.traverse((child) => {
      if (child.isMesh) {
        child.material = material
        child.castShadow = true
        child.receiveShadow = true
      }
    })

    return clone
  }, [obj, texture])

  return (
    <group position={position} rotation={rotation} {...props}>
      <primitive object={clonedObj} scale={scale} />
    </group>
  )
}
