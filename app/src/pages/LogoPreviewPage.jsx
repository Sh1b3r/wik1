import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stars } from '@react-three/drei'
import { Link } from 'react-router-dom'
import { ClassicSpaceLogo3D } from '../components/ClassicSpaceLogo3D.jsx'

function LogoScene() {
  return (
    <Canvas camera={{ position: [0, 0.6, 9], fov: 42, near: 0.001, far: 1000 }} dpr={[1, 1.5]}>
      <color attach="background" args={['#030712']} />
      <ambientLight intensity={1.15} />
      <directionalLight position={[5, 7, 8]} intensity={2.2} />
      <directionalLight position={[-5, -3, 3]} color="#60a5fa" intensity={0.7} />
      <Stars radius={80} depth={30} count={700} factor={2} fade />
      <ClassicSpaceLogo3D scale={1.45} />
      <OrbitControls enablePan={false} minDistance={5} maxDistance={15} />
    </Canvas>
  )
}

export default function LogoPreviewPage() {
  return (
    <main style={{ position: 'fixed', inset: 0, background: '#030712' }}>
      <LogoScene />
      <Link
        to="/game"
        style={{
          position: 'fixed', top: 20, left: 20, zIndex: 2,
          color: '#e2e8f0', textDecoration: 'none', fontWeight: 700,
          padding: '10px 16px', borderRadius: 12,
          background: 'rgba(15, 23, 42, 0.82)', border: '1px solid rgba(96, 165, 250, 0.45)',
        }}
      >
        ← До гри
      </Link>
      <p style={{
        position: 'fixed', bottom: 18, left: '50%', transform: 'translateX(-50%)',
        margin: 0, zIndex: 2, color: '#94a3b8', fontSize: '0.9rem',
      }}>
        Перетягуйте мишкою для огляду • Колесо — масштаб
      </p>
    </main>
  )
}
