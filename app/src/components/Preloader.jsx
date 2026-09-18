import { useState, useEffect } from 'react'
import { useGLTF } from '@react-three/drei'
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js'
import { assetUrl } from '../utils/asset.js'

// Preload 3D Models & geometries in browser cache during preloader
try {
  useGLTF.preload(assetUrl('model.glb'))
  useGLTF.preload(assetUrl('custom-logo.glb'))
  // Pre-fetch STL stud mesh
  new STLLoader().load(assetUrl('lego-stud.stl'), () => {})
} catch {
  // Ignore if running in SSR / non-DOM
}

export default function Preloader() {
    const [hidden, setHidden] = useState(false)

    useEffect(() => {
        const hide = setTimeout(() => setHidden(true), 900)
        const fallback = setTimeout(() => setHidden(true), 2500)
        return () => {
            clearTimeout(hide)
            clearTimeout(fallback)
        }
    }, [])

    return (
        <div id="preloader" className={hidden ? 'preloader preloader-hidden' : 'preloader'}>
            <div className="preloader-spinner"></div>
            <div className="preloader-text">Вікіпедія</div>
        </div>
    )
}
