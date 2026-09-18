import React, { Suspense, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, ContactShadows } from '@react-three/drei'
import { SpeederModel } from './SpeederModel.jsx'
import { AstronautModel } from './AstronautModel.jsx'
import { Link } from 'react-router-dom'

// Standalone rotating speeder ship inside the shared 3D scene
function RotatingSpeeder() {
  const speederGroup = useRef()

  useFrame((_, delta) => {
    if (speederGroup.current) {
      speederGroup.current.rotation.y += delta * 0.95
    }
  })

  return (
    <group position={[0.85, 0, 0]}>
      {/* Gentle hover float effect */}
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
        <group ref={speederGroup}>
          <SpeederModel floating={false} />
        </group>
      </Float>

      {/* Ship contact shadow on the floor */}
      <ContactShadows
        position={[0, -0.4, 0]}
        opacity={0.65}
        scale={8}
        blur={2.2}
        far={4.5}
        color="#000000"
      />
    </group>
  )
}

export default function SpeederViewer({ height = '420px', className = '' }) {
  return (
    <div
      style={{
        width: '100%',
        maxWidth: '100%',
        height,
        position: 'relative',
        borderRadius: '20px',
        overflow: 'hidden',
        background: 'radial-gradient(circle at 50% 35%, #182638 0%, #060b13 100%)',
        boxShadow: '0 20px 45px rgba(0, 0, 0, 0.45)',
        border: '1px solid rgba(56, 189, 248, 0.2)',
        boxSizing: 'border-box',
      }}
      className={className}
    >
      {/* Header Overlay */}
      <div
        style={{
          position: 'absolute',
          top: '16px',
          left: '18px',
          zIndex: 10,
          color: '#f8fafc',
          pointerEvents: 'none',
          maxWidth: 'calc(100% - 36px)',
        }}
      >
        <div
          style={{
            fontSize: '0.75rem',
            textTransform: 'uppercase',
            letterSpacing: '0.15em',
            color: '#38bdf8',
            fontWeight: 800,
          }}
        >
          LEGO Classic Space
        </div>
        <div
          style={{
            fontSize: 'clamp(1.1rem, 3.5vw, 1.4rem)',
            fontWeight: 900,
            textShadow: '0 2px 12px rgba(0,0,0,0.6)',
            marginTop: '2px',
          }}
        >
          Retro-Futuristic Hover Speeder
        </div>
      </div>

      {/* Button to Launch Speeder Asteroids Game */}
      <Link
        to="/game"
        style={{
          position: 'absolute',
          bottom: '16px',
          right: '18px',
          zIndex: 15,
          background: 'linear-gradient(135deg, #0284c7, #2563eb)',
          border: '1px solid #38bdf8',
          color: '#ffffff',
          padding: '10px 22px',
          borderRadius: '14px',
          textDecoration: 'none',
          fontWeight: 800,
          fontSize: '0.95rem',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          boxShadow: '0 10px 25px rgba(37, 99, 235, 0.45)',
          transition: 'all 0.2s ease',
        }}
      >
        <span>Play Speeder</span>
        <span>🚀</span>
      </Link>

      {/* Desktop 3D Canvas Scene (hidden on mobile to prevent any lag) */}
      <div className="speeder-viewer-canvas-wrap">
        <Canvas
          camera={{ position: [0, 0.7, 5.2], fov: 36, near: 0.001, far: 1000 }}
          dpr={[1, 1.5]}
          shadows={false}
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        >
          <ambientLight intensity={1.1} />
          <directionalLight position={[6, 12, 8]} intensity={1.8} />
          <pointLight position={[-6, 5, 2]} intensity={1.0} color="#38bdf8" />
          <pointLight position={[2, -1, 3]} intensity={0.5} color="#ffaa00" />

          <Suspense fallback={null}>
            {/* Astronaut: positioned on the left */}
            <group position={[-1.7, 0.1, 1.0]}>
              <AstronautModel
                scale={1.25}
                position={[0, 0, 0]}
                rotation={[0, 0.2, 0]}
              />
            </group>

            {/* Speeder: placed to the right of the astronaut in the same 3D space, smoothly rotating */}
            <RotatingSpeeder />
          </Suspense>
        </Canvas>
      </div>

      {/* Mobile-only lightweight graphic decoration */}
      <div className="speeder-viewer-mobile-art">
        <div style={{ fontSize: '4rem', filter: 'drop-shadow(0 0 20px #38bdf8)' }}>🚀</div>
        <div style={{ color: '#94a3b8', fontSize: '0.9rem', textAlign: 'center', padding: '0 20px' }}>
          3D-симулятор польоту у космосі LEGO Classic Space
        </div>
      </div>
    </div>
  )
}
