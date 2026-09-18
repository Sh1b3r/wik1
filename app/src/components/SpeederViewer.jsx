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

export default function SpeederViewer({ height = '460px', className = '' }) {
  return (
    <div
      style={{
        width: '100%',
        height,
        position: 'relative',
        borderRadius: '20px',
        overflow: 'hidden',
        background: 'radial-gradient(circle at 50% 35%, #182638 0%, #060b13 100%)',
        boxShadow: '0 20px 45px rgba(0, 0, 0, 0.45)',
        border: '1px solid rgba(56, 189, 248, 0.2)',
      }}
      className={className}
    >
      {/* Header Overlay */}
      <div
        style={{
          position: 'absolute',
          top: '20px',
          left: '24px',
          zIndex: 10,
          color: '#f8fafc',
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            fontSize: '0.8rem',
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
            fontSize: '1.4rem',
            fontWeight: 900,
            textShadow: '0 2px 12px rgba(0,0,0,0.6)',
            marginTop: '2px',
          }}
        >
          Retro-Futuristic Hover Speeder
        </div>
      </div>

      {/* Button to Launch Flappy Speeder Asteroids Game */}
      <Link
        to="/game"
        style={{
          position: 'absolute',
          bottom: '20px',
          right: '24px',
          zIndex: 15,
          background: 'linear-gradient(135deg, #0284c7, #2563eb)',
          color: '#ffffff',
          padding: '12px 24px',
          borderRadius: '14px',
          textDecoration: 'none',
          fontWeight: 800,
          fontSize: '0.95rem',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          boxShadow: '0 10px 25px rgba(37, 99, 235, 0.45)',
          transition: 'all 0.2s ease',
        }}
      >
        <span>Play</span>
      </Link>

      {/* Single Unified 3D Canvas Scene */}
      <Canvas
        camera={{ position: [0, 0.7, 5.2], fov: 36, near: 0.001, far: 1000 }}
        shadows
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.9} />
        <directionalLight
          position={[6, 12, 8]}
          intensity={2.0}
          castShadow
          shadow-mapSize={[1024, 1024]}
        />
        <pointLight position={[-6, 5, 2]} intensity={1.2} color="#38bdf8" />
        <pointLight position={[2, -1, 3]} intensity={0.6} color="#ffaa00" />
        <pointLight position={[0, 4, 0]} intensity={0.4} color="#ffe600" />

        <Suspense fallback={null}>
          {/* Astronaut: positioned lower in the block and shifted further left */}
          <group position={[-2.35, 0.15, 1.35]}>
            <AstronautModel
              scale={1.45}
              position={[0, 0, 0]}
              rotation={[0, 0, 0]}
            />
            {/* Astronaut contact shadow on the floor */}
            <ContactShadows
              position={[0, -0.805, 0]}
              opacity={0.7}
              scale={2.8}
              blur={1.6}
              far={1.8}
              color="#000000"
            />
          </group>

          {/* Speeder: placed to the right of the astronaut in the same 3D space, smoothly rotating */}
          <RotatingSpeeder />
        </Suspense>
      </Canvas>
    </div>
  )
}
