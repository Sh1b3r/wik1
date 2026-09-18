import React, { useState, useEffect, useRef, useMemo } from 'react'
import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import { Stars } from '@react-three/drei'
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js'
import * as THREE from 'three'
import { SpeederModel } from '../components/SpeederModel.jsx'
import { ClassicSpaceLogo3D } from '../components/ClassicSpaceLogo3D.jsx'
import { Link } from 'react-router-dom'
import GameOverScreen from '../components/GameOverScreen.jsx'
import { assetUrl } from '../utils/asset.js'

// Unique ID generator to avoid key collisions
let idCounter = 0
const uniqueId = () => `${Date.now()}-${++idCounter}-${Math.random().toString(36).slice(2, 9)}`

// Calculate dynamic elliptical boundary radii based on screen aspect ratio
// Widescreen PCs get wide freedom (up to 10.5+), mobile gets responsive comfortable bounds
export const getScreenBounds = () => {
  if (typeof window === 'undefined') return { x: 8.5, y: 4.8 }
  const aspect = window.innerWidth / (window.innerHeight || 1)
  const isMobile = window.innerWidth <= 900 || ('ontouchstart' in window)

  let boundX, boundY
  if (aspect >= 1.7) {
    // Ultrawide and standard 16:9 / 16:10 desktop
    boundX = isMobile ? 8.2 : 9.8
    boundY = 4.8
  } else if (aspect >= 1.3) {
    // 4:3 or landscape tablet
    boundX = isMobile ? 7.6 : 8.8
    boundY = 5.2
  } else {
    // Square or portrait
    boundX = 6.2
    boundY = 6.8
  }
  return { x: boundX, y: boundY }
}

const initialBounds = getScreenBounds()
let CURRENT_BOUND_X = initialBounds.x
let CURRENT_BOUND_Y = initialBounds.y

// Cohesive warm stone palette for LEGO Asteroids (no Z-fighting)
const legoStoneBaseMat = new THREE.MeshStandardMaterial({
  color: '#c49a6c',
  roughness: 0.55,
  metalness: 0.08,
})
const legoStoneShadeMat = new THREE.MeshStandardMaterial({
  color: '#b0885a',
  roughness: 0.58,
  metalness: 0.08,
})
const legoStoneHighlightMat = new THREE.MeshStandardMaterial({
  color: '#d6ae80',
  roughness: 0.52,
  metalness: 0.08,
})

const studGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.08, 12)

// Reticle crosshair materials for targeted asteroids
const reticleRingGeo = new THREE.RingGeometry(0.9, 1.05, 18)
const reticleMat = new THREE.MeshBasicMaterial({
  color: '#ef4444',
  side: THREE.DoubleSide,
})

// Authentic LEGO Gold Stud Coin materials (Plate, Round 1 x 1 with stud)
const goldBaseMat = new THREE.MeshStandardMaterial({
  color: '#ffd700', // Iconic LEGO Metallic Gold
  roughness: 0.15,
  metalness: 0.85,
})
const goldHighlightMat = new THREE.MeshStandardMaterial({
  color: '#ffe55c',
  roughness: 0.1,
  metalness: 0.9,
})
const coinPlateGeo = new THREE.CylinderGeometry(0.38, 0.38, 0.18, 20)
const coinStudGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.12, 16)

const STUD_URL = assetUrl('lego-stud.stl')
try {
  useLoader.preload(STLLoader, STUD_URL)
} catch {
  // Ignore SSR
}

// 3D LEGO Coin: Plate, Round 1 x 1 rotating like in classic LEGO games
function CoinItem({ coin, isVacuumPulled, studGeometry }) {
  const groupRef = useRef()
  const materialRef = useRef()

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 3.8 * delta

      // Vacuum pull visual effect: glow pulse + faster spin
      if (materialRef.current && isVacuumPulled) {
        const pulse = 0.5 + Math.sin(state.clock.elapsedTime * 12) * 0.5
        materialRef.current.emissiveIntensity = pulse * 0.8
        groupRef.current.rotation.y += 8 * delta // Faster spin when pulled
      } else if (materialRef.current) {
        materialRef.current.emissiveIntensity = 0
      }
    }
  })

  return (
    <group ref={groupRef} position={[coin.x, coin.y, coin.z]} rotation={[0.3, 0, 0]} scale={0.0125}>
      <mesh
        ref={materialRef}
        geometry={studGeometry}
        material={goldBaseMat}
      />
      {/* Vacuum pull glow ring */}
      {isVacuumPulled && (
        <mesh position={[0, 0.25, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.55, 0.85, 16]} />
          <meshBasicMaterial
            color="#a855f7"
            transparent
            opacity={0.6}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
      )}
    </group>
  )
}

// --- 3 VARIETIES OF UNIFIED LEGO ASTEROIDS ---
function LegoAsteroidVariantA() {
  return (
    <group>
      <mesh material={legoStoneBaseMat}>
        <boxGeometry args={[1.2, 0.6, 1.2]} />
      </mesh>
      <mesh position={[0.2, 0.55, 0.0]} material={legoStoneShadeMat}>
        <boxGeometry args={[0.7, 0.5, 1.0]} />
      </mesh>
      <mesh position={[-0.25, -0.45, 0.2]} material={legoStoneHighlightMat}>
        <boxGeometry args={[0.65, 0.3, 0.7]} />
      </mesh>
      {[
        [-0.35, 0.34, -0.35],
        [-0.35, 0.34, 0.35],
        [0.05, 0.84, -0.25],
        [0.05, 0.84, 0.25],
        [0.38, 0.84, -0.25],
        [0.38, 0.84, 0.25],
      ].map(([sx, sy, sz], i) => (
        <mesh key={`a-stud-${i}`} position={[sx, sy, sz]} geometry={studGeo} material={legoStoneHighlightMat} />
      ))}
    </group>
  )
}

function LegoAsteroidVariantB() {
  return (
    <group>
      <mesh material={legoStoneBaseMat}>
        <boxGeometry args={[1.0, 0.7, 1.0]} />
      </mesh>
      <mesh position={[0.7, -0.05, 0.1]} material={legoStoneHighlightMat}>
        <boxGeometry args={[0.4, 0.5, 0.8]} />
      </mesh>
      <mesh position={[-0.15, 0.55, -0.1]} material={legoStoneShadeMat}>
        <boxGeometry args={[0.7, 0.4, 0.7]} />
      </mesh>
      {[
        [0.25, 0.39, -0.25],
        [0.25, 0.39, 0.25],
        [-0.15, 0.79, -0.25],
        [-0.15, 0.79, 0.1],
        [0.7, 0.24, 0.0],
      ].map(([sx, sy, sz], i) => (
        <mesh key={`b-stud-${i}`} position={[sx, sy, sz]} geometry={studGeo} material={legoStoneBaseMat} />
      ))}
    </group>
  )
}

function LegoAsteroidVariantC() {
  return (
    <group>
      <mesh material={legoStoneBaseMat}>
        <boxGeometry args={[1.3, 0.5, 1.1]} />
      </mesh>
      <mesh position={[-0.15, 0.5, 0.1]} material={legoStoneHighlightMat}>
        <boxGeometry args={[0.8, 0.5, 0.7]} />
      </mesh>
      <mesh position={[0.2, -0.45, -0.1]} material={legoStoneShadeMat}>
        <boxGeometry args={[0.7, 0.4, 0.8]} />
      </mesh>
      {[
        [0.35, 0.29, -0.25],
        [0.35, 0.29, 0.25],
        [-0.35, 0.79, -0.05],
        [0.05, 0.79, -0.05],
        [-0.35, 0.79, 0.25],
        [0.05, 0.79, 0.25],
      ].map(([sx, sy, sz], i) => (
        <mesh key={`c-stud-${i}`} position={[sx, sy, sz]} geometry={studGeo} material={legoStoneShadeMat} />
      ))}
    </group>
  )
}

// Tall columnar spire asteroid (Variant D)
function LegoAsteroidVariantD() {
  return (
    <group>
      <mesh material={legoStoneBaseMat}>
        <boxGeometry args={[0.7, 1.3, 0.7]} />
      </mesh>
      <mesh position={[0.2, 0.2, -0.15]} material={legoStoneHighlightMat}>
        <boxGeometry args={[0.5, 0.8, 0.5]} />
      </mesh>
      <mesh position={[-0.2, -0.3, 0.15]} material={legoStoneShadeMat}>
        <boxGeometry args={[0.55, 0.6, 0.55]} />
      </mesh>
      {[
        [0.0, 0.69, 0.0],
        [0.2, 0.64, -0.15],
        [-0.2, 0.04, 0.15],
        [0.39, 0.2, 0.0],
        [-0.39, -0.2, 0.0],
      ].map(([sx, sy, sz], i) => (
        <mesh key={`d-stud-${i}`} position={[sx, sy, sz]} geometry={studGeo} material={legoStoneHighlightMat} />
      ))}
    </group>
  )
}

// Flat wide boulder cluster asteroid (Variant E)
function LegoAsteroidVariantE() {
  return (
    <group>
      <mesh material={legoStoneShadeMat}>
        <boxGeometry args={[1.5, 0.45, 0.9]} />
      </mesh>
      <mesh position={[0.3, 0.4, 0.1]} material={legoStoneBaseMat}>
        <boxGeometry args={[0.7, 0.4, 0.6]} />
      </mesh>
      <mesh position={[-0.35, 0.35, -0.1]} material={legoStoneHighlightMat}>
        <boxGeometry args={[0.6, 0.35, 0.6]} />
      </mesh>
      {[
        [-0.5, 0.26, 0.25],
        [-0.1, 0.26, 0.25],
        [0.3, 0.64, 0.1],
        [-0.35, 0.56, -0.1],
        [0.6, 0.26, -0.2],
      ].map(([sx, sy, sz], i) => (
        <mesh key={`e-stud-${i}`} position={[sx, sy, sz]} geometry={studGeo} material={legoStoneBaseMat} />
      ))}
    </group>
  )
}

// Saturn background
function SaturnBackground() {
  const ringsTexture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 256
    canvas.height = 16
    const ctx = canvas.getContext('2d')
    const grad = ctx.createLinearGradient(0, 0, 256, 0)
    grad.addColorStop(0.0, 'rgba(0,0,0,0)')
    grad.addColorStop(0.2, 'rgba(235, 210, 165, 0.85)')
    grad.addColorStop(0.48, 'rgba(30, 20, 10, 0.1)')
    grad.addColorStop(0.55, 'rgba(210, 175, 130, 0.8)')
    grad.addColorStop(0.85, 'rgba(180, 150, 110, 0.35)')
    grad.addColorStop(1.0, 'rgba(0,0,0,0)')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, 256, 16)
    return new THREE.CanvasTexture(canvas)
  }, [])

  return (
    <group position={[40, 20, -140]} rotation={[0.35, -0.4, 0.2]}>
      <mesh>
        <sphereGeometry args={[22, 28, 28]} />
        <meshStandardMaterial color="#d4b48c" roughness={0.7} />
      </mesh>
      <mesh rotation={[Math.PI / 2 + 0.35, 0, 0]}>
        <ringGeometry args={[27, 52, 48]} />
        <meshBasicMaterial map={ringsTexture} side={THREE.DoubleSide} transparent opacity={0.9} />
      </mesh>
    </group>
  )
}

// High-performance infinite space stars (background particles)
function InfiniteSpaceStars({ speedRef }) {
  const pointsRef = useRef()
  const count = 60 // Drastically reduced for performance

  const [positions] = useMemo(() => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2
      const radius = 0.5 + Math.random() * 14.5
      pos[i * 3] = Math.cos(angle) * radius
      pos[i * 3 + 1] = Math.sin(angle) * radius
      pos[i * 3 + 2] = -Math.random() * 120
    }
    return [pos]
  }, [])

  useFrame((_, delta) => {
    if (pointsRef.current) {
      const pos = pointsRef.current.geometry.attributes.position.array
      const speed = speedRef.current * 1.4 * delta

      for (let i = 0; i < count; i++) {
        const i3 = i * 3
        pos[i3 + 2] += speed

        if (pos[i3 + 2] > -2) {
          pos[i3 + 2] -= 120
          // Reuse angle/radius from initial spawn pattern
          const angle = (i * 2.39996) % (Math.PI * 2)
          const radius = 0.5 + (i * 0.234) % 14.5
          pos[i3] = Math.cos(angle) * radius
          pos[i3 + 1] = Math.sin(angle) * radius
        }
      }
      pointsRef.current.geometry.attributes.position.needsUpdate = true
    }
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        color='#e0f2fe'
        transparent
        opacity={0.85}
        sizeAttenuation={true}
      />
    </points>
  )
}

// Active Homing Missiles for Buff Q
function ActiveMissiles({ missiles }) {
  return (
    <group>
      {missiles.map((m) => (
        <group key={m.id} position={[m.x, m.y, m.z]} scale={0.4}>
          <mesh rotation={[0, 0, -Math.PI / 2]}>
            <cylinderGeometry args={[0.18, 0.22, 1.0, 10]} />
            <meshBasicMaterial color="#ef4444" />
          </mesh>
        </group>
      ))}
    </group>
  )
}

// Single Obstacle: Asteroid OR Classic Space Logo
function ObstacleItem({ obs }) {
  const groupRef = useRef()

  // Only animate asteroids, not logos (logos are static)
  useFrame((_, delta) => {
    if (groupRef.current && !obs.isLogo) {
      groupRef.current.rotation.x += obs.rotSpeed.x * delta
      groupRef.current.rotation.y += obs.rotSpeed.y * delta
    }
  })

  if (obs.isLogo) {
    // Logo scale: 0.75 (obs.scale) * 0.02 (ClassicSpaceLogo3D internal) = 0.015 too small
    // Compensate by scaling up the logo model
    return (
      <group ref={groupRef} position={[obs.x, obs.y, obs.z]} scale={obs.scale}>
        <ClassicSpaceLogo3D />
      </group>
    )
  }

  return (
    <group ref={groupRef} position={[obs.x, obs.y, obs.z]} scale={obs.scale}>
      {obs.shapeType === 0 && <LegoAsteroidVariantA />}
      {obs.shapeType === 1 && <LegoAsteroidVariantB />}
      {obs.shapeType === 2 && <LegoAsteroidVariantC />}
      {obs.shapeType === 3 && <LegoAsteroidVariantD />}
      {obs.shapeType === 4 && <LegoAsteroidVariantE />}

      {obs.isTargeted && (
        <group position={[0, 0, 0.5]}>
          <mesh geometry={reticleRingGeo} material={reticleMat} />
        </group>
      )}
    </group>
  )
}

// Vacuum System - runs in separate useFrame to avoid blocking main game loop
function VacuumSystem({ isActive, playerRef, coinsRef, obstaclesRef }) {
  const timeRef = useRef(0)

  useFrame((_, delta) => {
    if (!isActive) return

    timeRef.current += delta
    const p = playerRef.current
    if (!p) return

    const vacuumRadius = 20.5
    const vacuumMaxPull = 0.42
    const vacuumFalloff = 0.35
    const vacuumZRange = 25
    const now = timeRef.current

    // Pull coins toward ship - HERD EFFECT
    for (const coin of coinsRef.current) {
      if (coin.z < vacuumZRange && coin.z > -5) {
        const dx = p.x - coin.x
        const dy = p.y - coin.y
        const dist = Math.hypot(dx, dy)

        if (dist < vacuumRadius && dist > 0.01) {
          const proximity = 1 - dist / vacuumRadius
          const pullForce = vacuumMaxPull * (proximity * proximity + 0.15) * (1 + vacuumFalloff * proximity)

          // Spiral effect using timeRef instead of performance.now()
          const spiralFactor = Math.sin(coin.id.charCodeAt(0) * 0.1 + now * 3) * 0.08

          coin.x += dx * pullForce + spiralFactor * dy * 0.1
          coin.y += dy * pullForce - spiralFactor * dx * 0.1

          // Vertical alignment - pull coins to ship's Y level for cleaner herd
          if (coin.z < 8 && coin.z > -2) {
            coin.y += (p.y - coin.y) * 0.06
            coin.x += (p.x - coin.x) * 0.06
          }
        }
      }
    }

  })

  return null
}

// Player Ship with responsive agile banking and dynamic tilt
function PlayerShip({ playerRef, isInvulnerable, isSuperSpeed, isVacuumActive }) {
  const meshGroup = useRef()

  useFrame((state) => {
    if (meshGroup.current) {
      const p = playerRef.current
      meshGroup.current.position.set(p.x, p.y, p.z)

      // Agile, swift banking angles: snappier roll, pitch, and slight dynamic yaw
      const targetRoll = -p.vx * 0.075 // Faster, deeper bank into turns
      const targetPitch = p.vy * 0.055 // Quicker nose dip/climb
      const targetYaw = Math.PI - p.vx * 0.035 // Subtle nose point into turn direction

      meshGroup.current.rotation.z = THREE.MathUtils.lerp(meshGroup.current.rotation.z, targetRoll, 0.32)
      meshGroup.current.rotation.x = THREE.MathUtils.lerp(meshGroup.current.rotation.x, targetPitch, 0.32)
      meshGroup.current.rotation.y = THREE.MathUtils.lerp(meshGroup.current.rotation.y, targetYaw, 0.28)

      if (isInvulnerable) {
        meshGroup.current.visible = Math.floor(state.clock.elapsedTime * 14) % 2 === 0
      } else {
        meshGroup.current.visible = true
      }
    }
  })

  return (
    <group ref={meshGroup} rotation={[0, Math.PI, 0]} scale={0.65}>
      <SpeederModel floating={false} />
    </group>
  )
}

// SpaceWorld Canvas Content with single shared geometry instance for high performance
function SpaceWorldContent({ playerRef, obstacles, coins, missiles, speedRef, isInvulnerable, isSuperSpeed, isVacuumActive, coinsRef, obstaclesRef }) {
  const studGeometry = useLoader(STLLoader, STUD_URL)

  return (
    <>
      <color attach="background" args={['#040816']} />

      <ambientLight intensity={0.95} />
      <directionalLight position={[15, 25, 15]} intensity={2.2} />
      <directionalLight position={[-15, 8, 10]} color="#fde047" intensity={0.8} />

      <Stars radius={120} depth={50} count={220} factor={3.0} fade speed={0.6} />

      <InfiniteSpaceStars speedRef={speedRef} />

      <ActiveMissiles missiles={missiles} />

      <SaturnBackground />

      <PlayerShip
        playerRef={playerRef}
        isInvulnerable={isInvulnerable}
        isSuperSpeed={isSuperSpeed}
        isVacuumActive={isVacuumActive}
      />

      <VacuumSystem
        isActive={isVacuumActive}
        playerRef={playerRef}
        coinsRef={coinsRef}
        obstaclesRef={obstaclesRef}
      />

      {/* Gold LEGO Studs Coins (Plate, Round 1 x 1) leading safe path */}
      {coins.map((coin) => (
        <CoinItem
          key={coin.id}
          coin={coin}
          studGeometry={studGeometry}
          isVacuumPulled={
            isVacuumActive &&
            coin.z < 25 &&
            coin.z > -5 &&
            Math.hypot(coin.x - playerRef.current.x, coin.y - playerRef.current.y) < 5.5
          }
        />
      ))}

      {obstacles.map((obs) => (
        <ObstacleItem key={obs.id} obs={obs} />
      ))}
    </>
  )
}

// 3D Canvas Scene
function SpaceWorld(props) {
  // Use optimal pixel ratio: up to 1.5 on mobile to keep 60fps perfectly fluid without stutter
  const dpr = useMemo(() => {
    const isMobile = typeof window !== 'undefined' && (window.innerWidth <= 900 || ('ontouchstart' in window))
    return isMobile ? [1, 1.5] : [1, 2]
  }, [])

  return (
    <Canvas
      camera={{ position: [0, 2.0, 9.2], fov: 62, near: 0.1, far: 500 }}
      dpr={dpr}
      gl={{
        antialias: true,
        powerPreference: 'high-performance',
        precision: 'mediump',
      }}
      style={{ width: '100%', height: '100%', pointerEvents: 'none' }}
    >
      <SpaceWorldContent {...props} />
    </Canvas>
  )
}

// Buff Definitions: key, label, duration, description
// All buffs auto-activate EXCEPT shield (F) which requires Space
const BUFF_TYPES = [
  {
    key: 'F',
    activationKey: 'Space', // Manual activation only
    name: 'SHIELD',
    duration: 30,
    icon: '🛡️',
    color: '#38bdf8',
    desc: 'Невразливість на 15 секунд АЛЕ ломається при першому зіткненні',
  },
  {
    key: 'E',
    activationKey: 'Auto',
    name: 'SUPER SPEED',
    duration: 7.5,
    icon: '⚡',
    color: '#facc15',
    desc: 'Гіпер-прискорення та невразливість на 7.5 секунд',
  },
  {
    key: 'Space',
    activationKey: 'Auto',
    name: 'ROCKETS',
    duration: 10,
    icon: '🚀',
    color: '#ef4444',
    desc: 'Запуск по дві ракети одночасно для знищення астероїдів 10 секунд',
  },
  {
    key: 'Q',
    activationKey: 'Auto',
    name: 'VACUUM',
    duration: 12,
    icon: '🧲',
    color: '#a855f7',
    desc: 'Притягує та збирає стади (монетки та логотипи) в радіусі 3.5 одиниць на 12 секунд',
  },
]

export default function SpeederGamePage() {
  const [gameState, setGameState] = useState('IDLE')
  const [score, setScore] = useState(0)
  const [distance, setDistance] = useState(0)
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem('saturn_speeder_freeflight_highscore') || '0', 10)
  })

  // Buff Slots: collected & active
  const [collectedBuff, setCollectedBuff] = useState(null)
  const [activeBuff, setActiveBuff] = useState(null)
  const [buffTimeRemaining, setBuffTimeRemaining] = useState(0)
  const [pickupBanner, setPickupBanner] = useState(null)

  // Player state: tuned for light, responsive, snappy flight
  const playerRef = useRef({
    x: 0,
    y: 0,
    z: 0,
    vx: 0,
    vy: 0,
  })

  const keysRef = useRef({
    KeyW: false,
    KeyA: false,
    KeyS: false,
    KeyD: false,
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false,
  })

  const obstaclesRef = useRef([])
  const [displayObstacles, setDisplayObstacles] = useState([])
  const coinsRef = useRef([])
  const [displayCoins, setDisplayCoins] = useState([])
  const [studsCount, setStudsCount] = useState(0)
  const studsCountRef = useRef(0)
  const coinPathRef = useRef({ x: 0, y: 0, angle: 0, radius: 1.2 })
  const missilesRef = useRef([])
  const [displayMissiles, setDisplayMissiles] = useState([])

  const sectorIndexRef = useRef(0)
  const spawnCounterRef = useRef(0)

  const BASE_SPEED = 24
  const speedRef = useRef(BASE_SPEED)
  const scoreRef = useRef(0)
  const highScoreRef = useRef(highScore)
  const distanceRef = useRef(0)

  // Invulnerability timer
  const invulnTimerRef = useRef(0)
  const [isInvulnerable, setIsInvulnerable] = useState(false)
  const [isSuperSpeed, setIsSuperSpeed] = useState(false)
  const [isVacuumActive, setIsVacuumActive] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const isPausedRef = useRef(false) // sync ref for game loop

  // Touch controls state
  const touchInputRef = useRef({ x: 0, y: 0, active: false })
  const [touchStickPos, setTouchStickPos] = useState({ x: 0, y: 0 })
  const joystickCenterRef = useRef({ x: 0, y: 0 })
  const [isFullscreen, setIsFullscreen] = useState(false)

  // Fullscreen and Orientation helpers
  const requestGameFullscreen = async () => {
    try {
      const docEl = document.documentElement
      if (!document.fullscreenElement) {
        if (docEl.requestFullscreen) {
          await docEl.requestFullscreen()
        } else if (docEl.webkitRequestFullscreen) {
          await docEl.webkitRequestFullscreen()
        }
      }
      if (screen.orientation && screen.orientation.lock) {
        await screen.orientation.lock('landscape').catch(() => {})
      }
      setIsFullscreen(true)
    } catch {
      // Ignore if user gesture or browser doesn't permit orientation lock
    }
  }

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement || document.webkitFullscreenElement))
    }
    document.addEventListener('fullscreenchange', handleFsChange)
    document.addEventListener('webkitfullscreenchange', handleFsChange)
    return () => {
      document.removeEventListener('fullscreenchange', handleFsChange)
      document.removeEventListener('webkitfullscreenchange', handleFsChange)
    }
  }, [])

  // Dynamic boundaries based on actual device / window aspect ratio
  const boundsRef = useRef(getScreenBounds())

  useEffect(() => {
    const handleResize = () => {
      const b = getScreenBounds()
      boundsRef.current = b
      CURRENT_BOUND_X = b.x
      CURRENT_BOUND_Y = b.y
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Buff Timers Refs
  const activeBuffRef = useRef(null)
  const collectedBuffRef = useRef(null)
  const lastBuffKeyRef = useRef(null)
  const buffTimeRemainingRef = useRef(0)
  const missileFireCooldownRef = useRef(0)
  const oneHitShieldRef = useRef(false) // Shield breaks on first hit

  // Track cumulative world distance for smooth, endless, non-repeating continuous highway generation
  const highwayWorldDistRef = useRef(0)

  // The Canonical Safe Highway Function: computes the exact (x, y) road center for any absolute worldZ
  // Uses multi-frequency harmonious sines to create a glorious winding roller-coaster road that NEVER breaks
  const getRoadPoint = (worldZ, b) => {
    // worldZ advances smoothly forward
    const rx = Math.sin(worldZ * 0.022) * (b.x * 0.65) + Math.sin(worldZ * 0.0093 + 1.2) * (b.x * 0.22)
    const ry = Math.cos(worldZ * 0.019 + 0.4) * (b.y * 0.50) + Math.sin(worldZ * 0.0076) * (b.y * 0.18)
    return {
      x: THREE.MathUtils.clamp(rx, -b.x * 0.82, b.x * 0.82),
      y: THREE.MathUtils.clamp(ry, -b.y * 0.76, b.y * 0.76),
    }
  }

  // Generate a steady mix of asteroids and collectible Classic Space logos.
  // CRITICAL GUARANTEE: Asteroids must NEVER spawn directly inside or near the coin road corridor!
  // Any asteroid closer than 3.6 units to the road is strictly pushed away to the sides.
  const generateObstacle = (screenZ, currentWorldDist = 0) => {
    spawnCounterRef.current += 1

    const b = boundsRef.current || { x: CURRENT_BOUND_X, y: CURRENT_BOUND_Y }

    // Alternate sectors sequentially: 0 = right, 1 = top, 2 = left, 3 = bottom
    sectorIndexRef.current = (sectorIndexRef.current + 1) % 4
    const sector = sectorIndexRef.current

    const baseAngle = sector * (Math.PI / 2)
    const angle = baseAngle + (Math.random() * 0.7 + 0.15) * (Math.PI / 2)
    const normDist = 0.30 + Math.sqrt(Math.random()) * 0.65
    let x = Math.cos(angle) * (b.x * normDist)
    let y = Math.sin(angle) * (b.y * normDist)

    // Ensure asteroids in the upper region actively threaten y > 1.2
    if (sector === 1 && y < 1.3) {
      y = 1.3 + Math.random() * (b.y * 0.70)
    }

    // Absolute worldZ of this obstacle
    const obstacleWorldZ = currentWorldDist + Math.abs(screenZ)
    const roadPt = getRoadPoint(obstacleWorldZ, b)
    const dX = x - roadPt.x
    const dY = y - roadPt.y
    const distToRoad = Math.hypot(dX, dY)
    // Hitbox clearance: Player radius (0.825) + Coin pickup radius (1.2) + Max asteroid radius (1.05 * 0.81 = ~0.85) + safety padding (1.35)
    // Ensures a 100% clear sanctuary corridor around the coin path where no asteroid can ever exist or hit the player
    const minSafeCorridor = 4.25

    if (distToRoad < minSafeCorridor) {
      const push = (minSafeCorridor - distToRoad) + 1.2
      const nx = distToRoad > 0.001 ? dX / distToRoad : (Math.random() > 0.5 ? 1 : -1)
      const ny = distToRoad > 0.001 ? dY / distToRoad : (Math.random() > 0.5 ? 1 : -1)
      x = THREE.MathUtils.clamp(x + nx * push, -b.x * 0.88, b.x * 0.88)
      y = THREE.MathUtils.clamp(y + ny * push, -b.y * 0.82, b.y * 0.82)
    }

    // Rare collectible Classic Space logo: arrives only every ~12-18 obstacles
    const isLogo = spawnCounterRef.current >= 12 && Math.random() < 0.32
    if (isLogo) {
      spawnCounterRef.current = 0
      return {
        id: uniqueId(),
        isLogo: true,
        isTargeted: false,
        shapeType: -1,
        hitMultiplier: 0.85,
        x,
        y,
        z: screenZ,
        scale: 2.4,
        driftX: 0, // Keep path static and predictable
        driftY: 0,
        rotSpeed: { x: 0.25, y: 0.6 },
      }
    }

    const shapeType = Math.floor(Math.random() * 5)
    const scale = 0.80 + Math.random() * 0.25

    let hitMultiplier = 0.792
    if (shapeType === 1) hitMultiplier = 0.774
    if (shapeType === 2) hitMultiplier = 0.81
    if (shapeType === 3) hitMultiplier = 0.765 // Spire
    if (shapeType === 4) hitMultiplier = 0.792 // Boulder cluster

    return {
      id: uniqueId(),
      isLogo: false,
      isTargeted: false,
      shapeType,
      hitMultiplier,
      x,
      y,
      z: screenZ,
      scale,
      driftX: 0, // Fixed position so asteroids never drift into the safe coin road
      driftY: 0,
      rotSpeed: {
        x: (Math.random() - 0.5) * 1.5,
        y: (Math.random() - 0.5) * 1.5,
      },
    }
  }

  // Continuous Highway Path Generator for Gold LEGO Studs
  // Generates coins along the optimal road path getRoadPoint(s, b).
  // Continuous Highway Path Generator for Gold LEGO Studs
  // Generates coins along the optimal road path getRoadPoint(worldZ, b).
  // Because asteroids are spawned outside the 3.65-unit road buffer,
  // the player following this coin road can NEVER crash into an asteroid!
  const generateCoinsAlongSafePath = (startZ, count = 24) => {
    const newCoins = []
    const b = boundsRef.current || { x: CURRENT_BOUND_X, y: CURRENT_BOUND_Y }
    const stepZ = 4.8 // Consistent rhythmic step along the highway road

    for (let i = 0; i < count; i++) {
      const z = startZ - i * stepZ
      const worldZ = highwayWorldDistRef.current
      highwayWorldDistRef.current += stepZ

      const pt = getRoadPoint(worldZ, b)

      newCoins.push({
        id: uniqueId(),
        worldZ,
        x: pt.x,
        y: pt.y,
        z,
      })
    }
    return newCoins
  }

  // Activate Collected Buff
  const activateBuff = (buff) => {
    if (!buff) return

    activeBuffRef.current = buff
    buffTimeRemainingRef.current = buff.duration
    setActiveBuff(buff)
    setBuffTimeRemaining(buff.duration)

    // Clear collected slot
    collectedBuffRef.current = null
    setCollectedBuff(null)

    if (buff.key === 'F') {
      invulnTimerRef.current = 15
      setIsInvulnerable(true)
      oneHitShieldRef.current = true // One-hit shield
    } else if (buff.key === 'E') {
      invulnTimerRef.current = 7.5
      setIsInvulnerable(true)
      setIsSuperSpeed(true)
      speedRef.current = BASE_SPEED * 2.2
    } else if (buff.key === 'Space') {
      missileFireCooldownRef.current = 0
    } else if (buff.key === 'Q') {
      setIsVacuumActive(true)
    }
  }

  // Start Game
  const startGame = () => {
    playerRef.current = { x: 0, y: 0, z: 0, vx: 0, vy: 0 }
    scoreRef.current = 0
    distanceRef.current = 0
    speedRef.current = BASE_SPEED
    sectorIndexRef.current = 0
    spawnCounterRef.current = 0
    coinPathRef.current = { x: 0, y: 0, angle: 0, radius: 1.2 }

    collectedBuffRef.current = null
    activeBuffRef.current = null
    lastBuffKeyRef.current = null
    buffTimeRemainingRef.current = 0
    setCollectedBuff(null)
    setActiveBuff(null)
    setIsSuperSpeed(false)
    setIsVacuumActive(false)
    isPausedRef.current = false
    setIsPaused(false)
    missilesRef.current = []
    setDisplayMissiles([])

    studsCountRef.current = 0
    setStudsCount(0)

    setScore(0)
    setDistance(0)

    invulnTimerRef.current = 2.0
    setIsInvulnerable(true)
    oneHitShieldRef.current = false // Reset one-hit shield on new game

    highwayWorldDistRef.current = 0

    const initialList = []
    for (let i = 0; i < 30; i++) {
      const z = -14 - i * 6.0
      initialList.push(generateObstacle(z, 0))
    }
    obstaclesRef.current = initialList
    setDisplayObstacles([...initialList])

    // Generate initial stream of gold studs immediately visible ahead in a long smooth unbroken arc
    const initialCoins = generateCoinsAlongSafePath(-2, 52)
    coinsRef.current = initialCoins
    setDisplayCoins([...initialCoins])

    setGameState('PLAYING')
  }

  // Track keys held at moment of game over & cooldown timestamp
  const gameOverTimeRef = useRef(0)
  const heldKeysAtGameOverRef = useRef(new Set())

  // Keyboard & Mouse Listeners
  useEffect(() => {
    const handleKeyDown = (e) => {
      const code = e.code

      // Toggle pause with F or Escape (only during active play)
      if (gameState === 'PLAYING' && (code === 'KeyF' || code === 'Escape')) {
        e.preventDefault()
        const next = !isPausedRef.current
        isPausedRef.current = next
        setIsPaused(next)
        // Stop ship movement on pause
        if (next) {
          Object.keys(keysRef.current).forEach((k) => { keysRef.current[k] = false })
        }
        return
      }

      // Start / Restart game ONLY on Left Shift
      if ((gameState === 'IDLE' || gameState === 'GAMEOVER') && code === 'ShiftLeft') {
        // Grace period for game over
        if (gameState === 'GAMEOVER' && performance.now() - gameOverTimeRef.current < 250) {
          return
        }
        e.preventDefault()
        startGame()
        return
      }

      // Check for Buff Activation Key (Space for all except missiles which auto-activate)
      const cBuff = collectedBuffRef.current
      if (cBuff && code === 'Space' && cBuff.activationKey !== 'Auto') {
        e.preventDefault()
        activateBuff(cBuff)
        return
      }

      if (code in keysRef.current) {
        e.preventDefault()
        keysRef.current[code] = true
      }
    }

    const handleKeyUp = (e) => {
      const code = e.code
      // If a held key is released after game over, remove it from the block list
      heldKeysAtGameOverRef.current.delete(code)

      if (code in keysRef.current) {
        e.preventDefault()
        keysRef.current[code] = false
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [gameState])

  // High-Performance Game Loop
  useEffect(() => {
    if (gameState !== 'PLAYING') return

    let lastTime = performance.now()
    let animationFrameId
    let frameCount = 0

    const loop = (now) => {
      // Skip physics while paused, but keep RAF running
      if (isPausedRef.current) {
        animationFrameId = requestAnimationFrame(loop)
        return
      }

      const dt = Math.min((now - lastTime) / 1000, 0.05)
      lastTime = now

      // Update React state only every 2 frames to reduce re-renders
      const shouldUpdateUI = (frameCount & 1) === 0
      frameCount++

      // 1. Manage Active Buff Durations
      if (activeBuffRef.current) {
        const curBuff = activeBuffRef.current
        buffTimeRemainingRef.current = Math.max(0, buffTimeRemainingRef.current - dt)
        if (shouldUpdateUI) setBuffTimeRemaining(buffTimeRemainingRef.current)

        if (buffTimeRemainingRef.current <= 0) {
          // Expire Buff
          if (curBuff.key === 'F') {
            oneHitShieldRef.current = false // Reset one-hit shield
          } else if (curBuff.key === 'E') {
            setIsSuperSpeed(false)
            speedRef.current = BASE_SPEED
          } else if (curBuff.key === 'Space') {
            // Release all remaining target locks as soon as the missile buff ends.
            obstaclesRef.current.forEach((obstacle) => {
              obstacle.isTargeted = false
            })
            missilesRef.current = []
          } else if (curBuff.key === 'Q') {
            setIsVacuumActive(false)
          }
          activeBuffRef.current = null
          setActiveBuff(null)
        }

        // curBuff.key === 'Q': vacuum pulls studs (coins) and logos within radius
        // curBuff.key === 'Space': homing missiles (fires TWO missiles at a time at closest threats)
        if (curBuff.key === 'Space') {
          missileFireCooldownRef.current -= dt
          if (missileFireCooldownRef.current <= 0) {
            missileFireCooldownRef.current = 0.414  // 45% faster (was 0.6)

            // Prioritize asteroids closest to the player with UNLIMITED range ahead
            const eligible = obstaclesRef.current.filter(
              (o) => !o.isLogo && !o.isTargeted && o.z < -1.5
            )

            if (eligible.length > 0) {
              const px = playerRef.current.x
              const py = playerRef.current.y

              // Sort by proximity to player (front + lateral distance)
              eligible.sort((a, b) => {
                const distA = Math.hypot(a.x - px, a.y - py, (a.z - 0) * 0.7)
                const distB = Math.hypot(b.x - px, b.y - py, (b.z - 0) * 0.7)
                return distA - distB
              })

              // Fire two rockets at a time
              const targets = eligible.slice(0, 2)
              const wingOffsets = [-0.45, 0.45]

              targets.forEach((target, idx) => {
                target.isTargeted = true
                missilesRef.current.push({
                  id: uniqueId(),
                  x: playerRef.current.x + (wingOffsets[idx] !== undefined ? wingOffsets[idx] : 0),
                  y: playerRef.current.y - 0.1,
                  z: -0.5,
                  targetId: target.id,
                })
              })
            }
          }
        }
      }

      // Update Invulnerability
      if (invulnTimerRef.current > 0) {
        invulnTimerRef.current -= dt
        if (invulnTimerRef.current <= 0) {
          if (shouldUpdateUI) setIsInvulnerable(false)
        }
      }

      // Speed progression
      if (!activeBuffRef.current || activeBuffRef.current.key !== 'E') {
        speedRef.current = BASE_SPEED + Math.min(22, distanceRef.current * 0.01)
      }
      const currentSpeed = speedRef.current

      distanceRef.current += currentSpeed * dt
      scoreRef.current = Math.floor(distanceRef.current * 0.5)

      if (scoreRef.current > highScoreRef.current) {
        highScoreRef.current = scoreRef.current
        setHighScore(scoreRef.current)
        localStorage.setItem('saturn_speeder_freeflight_highscore', scoreRef.current.toString())
      }

      // 2. High-Agility, Ultra-Responsive WASD & Touch Flight Physics
      const p = playerRef.current
      const keys = keysRef.current
      const isMobileDevice = typeof window !== 'undefined' && (window.innerWidth <= 900 || ('ontouchstart' in window))
      // PC: Extremely light, lightning-fast steering and effortless safe-path following
      // Mobile: Calibrated to be smooth, steady, and not overly twitchy/difficult
      const ACCEL = isMobileDevice ? 135 : 270
      const FRICTION = isMobileDevice ? 0.88 : 0.91

      if (keys.KeyA || keys.ArrowLeft) p.vx -= ACCEL * dt
      if (keys.KeyD || keys.ArrowRight) p.vx += ACCEL * dt
      if (keys.KeyW || keys.ArrowUp) p.vy += ACCEL * dt
      if (keys.KeyS || keys.ArrowDown) p.vy -= ACCEL * dt

      // Virtual touch joystick input: smooth, controlled response without wild overshooting
      if (touchInputRef.current.active) {
        p.vx += touchInputRef.current.x * ACCEL * 0.95 * dt
        p.vy += touchInputRef.current.y * ACCEL * 0.95 * dt
      }

      p.vx *= FRICTION
      p.vy *= FRICTION

      // Max velocities: maximum freedom on PC, safe controlled limit on mobile
      const maxVx = isMobileDevice ? 26 : 48
      const maxVy = isMobileDevice ? 22 : 36
      p.vx = Math.max(-maxVx, Math.min(maxVx, p.vx))
      p.vy = Math.max(-maxVy, Math.min(maxVy, p.vy))

      p.x += p.vx * dt
      p.y += p.vy * dt

      // Dynamic screen-adaptive boundary clamp
      const activeBounds = boundsRef.current || { x: CURRENT_BOUND_X, y: CURRENT_BOUND_Y }
      const normX = p.x / activeBounds.x
      const normY = p.y / activeBounds.y
      const currentDist = Math.hypot(normX, normY)
      if (currentDist > 1.0) {
        const angle = Math.atan2(normY, normX)
        p.x = Math.cos(angle) * activeBounds.x
        p.y = Math.sin(angle) * activeBounds.y

        // Bounce/friction slide along boundary
        const nx = Math.cos(angle)
        const ny = Math.sin(angle)
        const dot = p.vx * nx + p.vy * ny
        if (dot > 0) {
          p.vx -= dot * nx
          p.vy -= dot * ny
        }
      }

      // 3. Update Missiles Flight & Guaranteed Asteroid Destruction
      for (let mIdx = missilesRef.current.length - 1; mIdx >= 0; mIdx--) {
        const m = missilesRef.current[mIdx]
        const target = obstaclesRef.current.find((o) => o.id === m.targetId)

        if (target) {
          // Rapid homing flight directly towards target
          const forwardSpeed = currentSpeed + 75
          m.z -= forwardSpeed * dt

          // Strong homing interpolation to guarantee intercept
          const homeRate = Math.min(1, 16 * dt)
          m.x += (target.x - m.x) * homeRate
          m.y += (target.y - m.y) * homeRate

          // Destruction condition
          if (m.z <= target.z + 0.5) {
            target.z = 999
            missilesRef.current.splice(mIdx, 1)
            scoreRef.current += 150
            distanceRef.current += 40
          }
        } else {
          m.z -= (currentSpeed + 75) * dt
          if (m.z < -250) {
            missilesRef.current.splice(mIdx, 1)
          }
        }
      }

      // 4. Obstacles Movement & Collision / Buff Pickup
      let collision = false
      const shipHitRadius = 0.825

      // Can pickup a new logo ONLY if:
      // - No buff is currently waiting in slot (`!collectedBuffRef.current`)
      // - AND no buff is currently active with running timer (`!activeBuffRef.current`)
      const canCollectNewLogo = !collectedBuffRef.current && !activeBuffRef.current

      // When rocket ability or missiles are active, freeze asteroid lateral shifting so they don't change position
      const isMissileAbilityActive = (activeBuffRef.current && activeBuffRef.current.key === 'Space') || missilesRef.current.length > 0

      for (let i = 0; i < obstaclesRef.current.length; i++) {
        const obs = obstaclesRef.current[i]

        obs.z += currentSpeed * dt
        if (!isMissileAbilityActive) {
          obs.x += obs.driftX * dt
          obs.y += obs.driftY * dt
        }

        const obsNormX = obs.x / activeBounds.x
        const obsNormY = obs.y / activeBounds.y
        const obsDist = Math.hypot(obsNormX, obsNormY)
        if (obsDist > 1.0) {
          obs.driftX *= -1
          obs.driftY *= -1
          // Clamp position so asteroid can't escape the play area
          const angle = Math.atan2(obsNormY, obsNormX)
          obs.x = Math.cos(angle) * activeBounds.x
          obs.y = Math.sin(angle) * activeBounds.y
        }

        // Collision check
        if (obs.z > -1.1 && obs.z < 1.1) {
          const dx = obs.x - p.x
          const dy = obs.y - p.y
          const distSq = dx * dx + dy * dy

          const combinedRadius = shipHitRadius + obs.scale * obs.hitMultiplier
          if (distSq < combinedRadius * combinedRadius) {
            if (obs.isLogo) {
              // Classic Space Logo Collected
              if (canCollectNewLogo) {
                const availableBuffs = BUFF_TYPES.filter((b) => b.key !== lastBuffKeyRef.current)
                const pool = availableBuffs.length > 0 ? availableBuffs : BUFF_TYPES
                const randomBuff = pool[Math.floor(Math.random() * pool.length)]
                lastBuffKeyRef.current = randomBuff.key

                // Missiles (activationKey === 'Auto') activate immediately
                if (randomBuff.activationKey === 'Auto') {
                  activateBuff(randomBuff)
                } else {
                  collectedBuffRef.current = randomBuff
                  setCollectedBuff(randomBuff)
                }
                obs.z = 999 // remove logo
              }
              scoreRef.current += 100
              distanceRef.current += 30
            } else {
              // Hit Asteroid
              // One-hit shield (F buff): breaks on first hit, prevents game over
              if (oneHitShieldRef.current) {
                oneHitShieldRef.current = false
                invulnTimerRef.current = 0
                setIsInvulnerable(false)
                obs.z = 999 // Shield destroys asteroid on impact

                // Immediately expire the shield buff so player can pick up next buff
                if (activeBuffRef.current && activeBuffRef.current.key === 'F') {
                  activeBuffRef.current = null
                  setActiveBuff(null)
                  setIsInvulnerable(false)
                  oneHitShieldRef.current = false
                }
              } else if (invulnTimerRef.current <= 0) {
                collision = true
                break
              }
              // Regular invulnerability (E buff, start invuln): just prevents collision, no break
            }
          }
        }
      }

      // Vacuum auto-collect logos within range
      if (isVacuumActive) {
        for (let i = 0; i < obstaclesRef.current.length; i++) {
          const obs = obstaclesRef.current[i]
          if (obs.isLogo && obs.z > -2 && obs.z < 2) {
            const dx = obs.x - p.x
            const dy = obs.y - p.y
            const dist = Math.hypot(dx, dy)
            if (dist < 3.5) {
              if (canCollectNewLogo) {
                const availableBuffs = BUFF_TYPES.filter((b) => b.key !== lastBuffKeyRef.current)
                const pool = availableBuffs.length > 0 ? availableBuffs : BUFF_TYPES
                const randomBuff = pool[Math.floor(Math.random() * pool.length)]
                lastBuffKeyRef.current = randomBuff.key

                if (randomBuff.activationKey === 'Auto') {
                  activateBuff(randomBuff)
                } else {
                  collectedBuffRef.current = randomBuff
                  setCollectedBuff(randomBuff)
                }
              }
              scoreRef.current += 100
              distanceRef.current += 30
              obs.z = 999 // remove
            }
          }
        }
      }

      if (collision) {
        gameOverTimeRef.current = performance.now()
        heldKeysAtGameOverRef.current = new Set()
        Object.keys(keysRef.current).forEach((k) => {
          if (keysRef.current[k]) {
            heldKeysAtGameOverRef.current.add(k)
          }
        })
        // Reset ship inputs so it stops moving
        Object.keys(keysRef.current).forEach((k) => {
          keysRef.current[k] = false
        })

        setGameState('GAMEOVER')
        setScore(scoreRef.current)
        setDistance(distanceRef.current)
        return
      }

      // Collect studs on contact.
      for (const coin of coinsRef.current) {
        if (coin.z > -1.1 && coin.z < 1.1 && Math.hypot(coin.x - p.x, coin.y - p.y) < 2) {
          coin.z = 999
          studsCountRef.current += 1
          scoreRef.current += 10
          setStudsCount(studsCountRef.current)
        }
      }

      // Move the collectible trail with the world, then replenish it well
      // beyond the camera so objects never visibly pop into existence.
      coinsRef.current.forEach((coin) => {
        coin.z += currentSpeed * dt
      })
      // Filter out passed coins and collected coins (z > 12 or z > 900)
      coinsRef.current = coinsRef.current.filter((coin) => coin.z < 12 && coin.z > -900)
      // Find furthest coin currently ahead
      const furthestCoinZ = coinsRef.current.reduce((min, coin) => Math.min(min, coin.z), 0)
      // Always maintain an unbroken highway spanning at least -250 units ahead
      if (furthestCoinZ > -250) {
        // Continue trail seamlessly without any gaps, stepping exactly 4.8 units from the furthest coin
        const nextStartZ = furthestCoinZ < -5 ? furthestCoinZ - 4.8 : -20
        const batchCount = 30
        coinsRef.current.push(...generateCoinsAlongSafePath(nextStartZ, batchCount))
      }

      // Filter passed obstacles
      obstaclesRef.current = obstaclesRef.current.filter((obs) => obs.z < 12 && obs.z > -900)

      // Keep the asteroid field dense, lively, and frequent across the entire screen (including top).
      while (obstaclesRef.current.length < 34) {
        const furthestZ = obstaclesRef.current.reduce((min, o) => Math.min(min, o.z), 0)
        const spawnZ = Math.min(-180, furthestZ - (3.6 + Math.random() * 2.8))
        // Pass distanceRef.current so the obstacle is strictly deflected away from the exact road position
        obstaclesRef.current.push(generateObstacle(spawnZ, distanceRef.current))
      }

      frameCount++
      if (frameCount % 2 === 0) {
        setScore(scoreRef.current)
        setDistance(distanceRef.current)
        setDisplayObstacles([...obstaclesRef.current])
        setDisplayCoins([...coinsRef.current])
        setDisplayMissiles([...missilesRef.current])
      }

      animationFrameId = requestAnimationFrame(loop)
    }

    animationFrameId = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(animationFrameId)
  }, [gameState])

  // Touch Joystick Handlers
  const handleTouchStart = (e) => {
    e.preventDefault()
    const touch = e.touches[0]
    const rect = e.currentTarget.getBoundingClientRect()
    joystickCenterRef.current = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    }
    handleTouchMove(e)
  }

  const handleTouchMove = (e) => {
    e.preventDefault()
    if (!e.touches || e.touches.length === 0) return
    const touch = e.touches[0]
    const center = joystickCenterRef.current
    const dx = touch.clientX - center.x
    const dy = touch.clientY - center.y
    const maxRadius = 45
    const distance = Math.hypot(dx, dy)
    const clampedDist = Math.min(distance, maxRadius)
    const angle = Math.atan2(dy, dx)
    const stickX = Math.cos(angle) * clampedDist
    const stickY = Math.sin(angle) * clampedDist

    setTouchStickPos({ x: stickX, y: stickY })
    touchInputRef.current = {
      x: stickX / maxRadius,
      y: -(stickY / maxRadius), // Invert Y: pushing up is +vy
      active: true,
    }
  }

  const handleTouchEnd = (e) => {
    e.preventDefault()
    setTouchStickPos({ x: 0, y: 0 })
    touchInputRef.current = { x: 0, y: 0, active: false }
  }

  return (
    <div className="speeder-game-wrapper">
      {/* Landscape Orientation Requirement Warning (Mobile/Tablets) */}
      <div className="game-rotate-device-overlay">
        <svg className="phone-rotate-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
          <line x1="12" y1="18" x2="12.01" y2="18"></line>
        </svg>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 900, margin: '0 0 12px', color: '#38bdf8', fontFamily: '"Orbitron", sans-serif' }}>
          ПОВЕРНІТЬ ТЕЛЕФОН
        </h2>
        <p style={{ fontSize: '1rem', color: '#94a3b8', maxWidth: '300px', lineHeight: 1.5, margin: '0 0 24px' }}>
          Для комфортної гри поверніть пристрій у горизонтальний режим (альбомна орієнтація).
        </p>
        <button
          onClick={requestGameFullscreen}
          style={{
            background: 'linear-gradient(135deg, #0284c7, #2563eb)',
            border: '2px solid #38bdf8',
            color: '#ffffff',
            padding: '12px 28px',
            borderRadius: '999px',
            fontWeight: 800,
            fontSize: '1rem',
            cursor: 'pointer',
            boxShadow: '0 0 25px rgba(56, 189, 248, 0.4)',
          }}
        >
          Увімкнути повний екран
        </button>
      </div>

      {/* Fullscreen Toggle Button (hides browser top URL bar on mobile) */}
      <button
        type="button"
        className="game-fullscreen-toggle"
        onClick={requestGameFullscreen}
        title="На весь екран (приховує рядок браузера)"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          {isFullscreen ? (
            <>
              <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"></path>
            </>
          ) : (
            <>
              <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"></path>
            </>
          )}
        </svg>
        <span>{isFullscreen ? 'Exit Full' : 'Fullscreen'}</span>
      </button>

      {/* 3D Space Canvas */}
      <SpaceWorld
        playerRef={playerRef}
        obstacles={displayObstacles}
        coins={displayCoins}
        missiles={displayMissiles}
        speedRef={speedRef}
        isInvulnerable={isInvulnerable}
        isSuperSpeed={isSuperSpeed}
        isVacuumActive={isVacuumActive}
        isPaused={isPaused}
        coinsRef={coinsRef}
        obstaclesRef={obstaclesRef}
      />

      {/* In-Game HUD Elements: only visible during gameplay */}
      {gameState === 'PLAYING' && (
        <>
          {/* Top HUD */}
          <div
            className="game-top-hud"
            style={{
              position: 'absolute',
              top: 20,
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              zIndex: 20,
              background: 'rgba(15, 23, 42, 0.85)',
              borderRadius: '30px',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(56, 189, 248, 0.4)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6)',
              pointerEvents: 'none',
            }}
          >
            <div style={{ textAlign: 'center' }}>
              <div className="hud-lbl" style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
                Distance
              </div>
              <div className="hud-val" style={{ fontSize: '1.75rem', fontWeight: 900, color: '#38bdf8' }}>
                {Math.floor(distance)}m
              </div>
            </div>
            <div style={{ width: '1px', background: 'rgba(255,255,255,0.15)' }} />
            <div style={{ textAlign: 'center' }}>
              <div className="hud-lbl" style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
                Score
              </div>
              <div className="hud-val" style={{ fontSize: '1.75rem', fontWeight: 900, color: '#ffffff' }}>
                {score}
              </div>
            </div>
            <div style={{ width: '1px', background: 'rgba(255,255,255,0.15)' }} />
            <div style={{ textAlign: 'center' }}>
              <div className="hud-lbl" style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
                Studs
              </div>
              <div className="hud-val" style={{ fontSize: '1.75rem', fontWeight: 900, color: '#ffd700' }}>
                {studsCount}
              </div>
            </div>
            <div style={{ width: '1px', background: 'rgba(255,255,255,0.15)' }} />
            <div style={{ textAlign: 'center' }}>
              <div className="hud-lbl" style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
                Best Score
              </div>
              <div className="hud-val" style={{ fontSize: '1.75rem', fontWeight: 900, color: '#facc15' }}>
                {highScore}
              </div>
            </div>
          </div>

          {/* Collected Buff Box */}
          {collectedBuff && (
            <div
              className="game-collected-buff-box"
              onClick={() => activateBuff(collectedBuff)}
              style={{
                border: `2px solid ${collectedBuff.color}`,
                boxShadow: `0 0 16px ${collectedBuff.color}44`,
              }}
            >
              <div className="buff-icon" style={{ fontSize: '2rem' }}>{collectedBuff.icon}</div>
              <div>
                <div className="buff-prompt" style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase' }}>
                  ГОТОВО:
                </div>
                <div className="buff-key" style={{ fontSize: '1.05rem', fontWeight: 900, color: collectedBuff.color }}>
                  [{collectedBuff.activationKey === 'Auto' ? 'АВТО' : 'SPACE / TAP'}]
                </div>
                <div className="buff-title" style={{ fontSize: '0.75rem', color: '#e2e8f0' }}>{collectedBuff.name}</div>
              </div>
            </div>
          )}

          {/* Active Buff Timer Bar */}
          {activeBuff && (
            <div
              className="game-active-buff-bar"
              style={{
                border: `2px solid ${activeBuff.color}`,
                color: activeBuff.color,
                boxShadow: `0 0 25px ${activeBuff.color}55`,
              }}
            >
              <span>{activeBuff.icon}</span>
              <span>{activeBuff.name}</span>
              <span style={{ color: '#fff', fontSize: '1.05rem' }}>
                {buffTimeRemaining.toFixed(1)}s
              </span>
            </div>
          )}

          {/* Pickup Banner Notification */}
          {pickupBanner && (
            <div
              style={{
                position: 'absolute',
                top: 140,
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 35,
                background: 'rgba(250, 204, 21, 0.3)',
                border: '2px solid #facc15',
                color: '#fef08a',
                padding: '10px 28px',
                borderRadius: '30px',
                fontSize: '1.1rem',
                fontWeight: 900,
                letterSpacing: '0.08em',
                boxShadow: '0 0 35px rgba(250, 204, 21, 0.7)',
                backdropFilter: 'blur(12px)',
                pointerEvents: 'none',
              }}
            >
              {pickupBanner}
            </div>
          )}

          {/* Touch Controls Overlay (Mobile Joystick + Action Buttons) */}
          <div className="mobile-controls-overlay">
            {/* Virtual Joystick */}
            <div
              className="touch-dpad-zone"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onTouchCancel={handleTouchEnd}
            >
              <div className="touch-dpad-bg" />
              <div
                className="touch-dpad-stick"
                style={{
                  transform: `translate(${touchStickPos.x}px, ${touchStickPos.y}px)`,
                }}
              />
            </div>

            {/* Mobile Action Buttons */}
            <div className="touch-action-buttons">
              {/* Pause Button */}
              <button
                type="button"
                className="touch-btn-circle"
                onClick={() => {
                  const next = !isPausedRef.current
                  isPausedRef.current = next
                  setIsPaused(next)
                }}
                onTouchStart={(e) => {
                  e.preventDefault()
                  const next = !isPausedRef.current
                  isPausedRef.current = next
                  setIsPaused(next)
                }}
                style={{
                  background: 'rgba(15, 23, 42, 0.85)',
                  border: '2px solid #facc15',
                  color: '#facc15',
                }}
                title="Пауза"
              >
                ⏸
              </button>

              {/* Shield / Buff Action Button */}
              <button
                type="button"
                className="touch-btn-circle"
                onClick={() => {
                  const cBuff = collectedBuffRef.current
                  if (cBuff && cBuff.activationKey !== 'Auto') {
                    activateBuff(cBuff)
                  }
                }}
                onTouchStart={(e) => {
                  e.preventDefault()
                  const cBuff = collectedBuffRef.current
                  if (cBuff && cBuff.activationKey !== 'Auto') {
                    activateBuff(cBuff)
                  }
                }}
                style={{
                  background: collectedBuff ? 'linear-gradient(135deg, #0284c7, #2563eb)' : 'rgba(15, 23, 42, 0.75)',
                  border: `2px solid ${collectedBuff ? collectedBuff.color : 'rgba(56, 189, 248, 0.4)'}`,
                  color: '#ffffff',
                  width: '68px',
                  height: '68px',
                  fontSize: '1.4rem',
                  boxShadow: collectedBuff ? `0 0 25px ${collectedBuff.color}88` : 'none',
                }}
                title="Активувати здатність"
              >
                {collectedBuff ? collectedBuff.icon : '🛡️'}
              </button>
            </div>
          </div>

          {/* Desktop Controls Hint Box */}
          <div
            style={{
              position: 'absolute',
              bottom: 24,
              right: 24,
              zIndex: 20,
              background: 'rgba(15, 23, 42, 0.85)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '16px',
              padding: '12px 18px',
              color: '#94a3b8',
              fontSize: '0.82rem',
              display: 'none',
              flexDirection: 'column',
              gap: '5px',
              pointerEvents: 'none',
            }}
            className="desktop-controls-hint"
          >
            <div style={{ color: '#fff' }}><b style={{ color: '#fff' }}>WASD / Joystick</b> to move</div>
            <div style={{ color: '#38bdf8' }}><b style={{ color: '#fff' }}>[SPACE / 🛡️]</b> to activate shield</div>
            <div style={{ color: '#facc15' }}><b style={{ color: '#fff' }}>[F / ⏸]</b> to pause</div>
          </div>
        </>
      )}

      {/* Back Button: always accessible except in GameOver */}
      {gameState !== 'GAMEOVER' && (
        <Link
          to="/"
          className="game-back-btn"
          style={{
            position: 'absolute',
            top: 20,
            left: 20,
            zIndex: 35,
            color: '#e2e8f0',
            background: 'rgba(30, 41, 59, 0.85)',
            border: '1px solid rgba(255,255,255,0.15)',
            padding: '8px 16px',
            borderRadius: '12px',
            textDecoration: 'none',
            fontSize: '0.9rem',
            fontWeight: 600,
            backdropFilter: 'blur(8px)',
            pointerEvents: 'auto',
            cursor: 'pointer',
          }}
        >
          ← To wiki
        </Link>
      )}

      {/* Pause Overlay */}
      {isPaused && gameState === 'PLAYING' && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 50,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(3, 7, 18, 0.72)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <div style={{
            fontSize: '0.85rem',
            color: '#38bdf8',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            fontWeight: 800,
            marginBottom: '16px',
          }}>PAUSED</div>
          <div style={{
            fontSize: '4rem',
            fontWeight: 900,
            color: '#fff',
            textShadow: '0 0 30px rgba(56,189,248,0.6)',
            marginBottom: '32px',
          }}>⏸</div>
          <button
            onClick={() => {
              isPausedRef.current = false
              setIsPaused(false)
            }}
            style={{
              background: 'linear-gradient(135deg, #0284c7, #2563eb)',
              border: '2px solid #38bdf8',
              color: '#fff',
              padding: '12px 32px',
              borderRadius: '999px',
              fontSize: '1rem',
              fontWeight: 800,
              cursor: 'pointer',
              marginBottom: '12px',
            }}
          >
            Resume
          </button>
          <div style={{
            color: '#94a3b8',
            fontSize: '0.85rem',
          }}>Press <b style={{ color: '#fff' }}>[F]</b> or tap Resume</div>
        </div>
      )}

      {/* Start Modal Overlay */}
      {gameState === 'IDLE' && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(3, 7, 18, 0.85)',
            backdropFilter: 'blur(8px)',
            zIndex: 50,
            padding: '20px',
          }}
        >
          <div
            style={{
              fontSize: '0.85rem',
              color: '#38bdf8',
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              fontWeight: 800,
              marginBottom: '8px',
              fontFamily: '"Orbitron", "Rajdhani", sans-serif',
            }}
          >
            LEGO Classic Space
          </div>
          <h1
            style={{
              fontSize: 'clamp(2.4rem, 6vw, 3.6rem)',
              fontWeight: 900,
              color: '#ffffff',
              margin: '0 0 20px 0',
              fontFamily: '"Orbitron", "Rajdhani", sans-serif',
              textShadow: '0 0 35px rgba(56, 189, 248, 0.7), 0 0 70px rgba(37, 99, 235, 0.4)',
              textAlign: 'center',
              letterSpacing: '0.04em',
            }}
          >
            SPEEDER
          </h1>
          <button
            type="button"
            className="game-btn-start"
            onClick={(e) => {
              e.preventDefault()
              requestGameFullscreen().catch(() => {})
              startGame()
            }}
            onTouchStart={(e) => {
              // Ensure immediate 1st tap response on mobile without waiting for 300ms click delay
              e.preventDefault()
              requestGameFullscreen().catch(() => {})
              startGame()
            }}
            title="Press to start"
            style={{
              background: 'linear-gradient(135deg, #0284c7, #2563eb)',
              border: '2px solid #38bdf8',
              color: '#ffffff',
              padding: '14px 38px',
              borderRadius: '999px',
              fontWeight: 800,
              fontSize: 'clamp(1.05rem, 3.5vw, 1.25rem)',
              fontFamily: '"Orbitron", "Rajdhani", sans-serif',
              letterSpacing: '0.06em',
              boxShadow: '0 0 30px rgba(37, 99, 235, 0.7), 0 0 60px rgba(56, 189, 248, 0.4), inset 0 0 15px rgba(255, 255, 255, 0.2)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '12px',
              cursor: 'pointer',
              outline: 'none',
              userSelect: 'none',
              pointerEvents: 'auto',
              touchAction: 'manipulation',
              marginBottom: '20px',
            }}
          >
            <span>START</span>
            <span
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                border: '1px solid rgba(255, 255, 255, 0.5)',
                borderRadius: '6px',
                padding: '3px 10px',
                fontSize: '0.95rem',
                fontWeight: 900,
                boxShadow: '0 2px 4px rgba(0,0,0,0.4)',
              }}
            >
              L SHIFT / TAP
            </span>
          </button>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '6px',
              color: '#94a3b8',
              fontSize: '0.85rem',
              background: 'rgba(15, 23, 42, 0.6)',
              padding: '10px 20px',
              borderRadius: '12px',
              border: '1px solid rgba(56, 189, 248, 0.2)',
              backdropFilter: 'blur(4px)',
              textAlign: 'center',
            }}
          >
            <div><b>WASD / Джойстик</b> для руху &nbsp;|&nbsp; <b>[F] / ⏸</b> пауза</div>
            <div><b>[SPACE] / Кнопка 🛡️</b> для щита</div>
          </div>
        </div>
      )}

      {gameState === 'GAMEOVER' && (
        <GameOverScreen
          onRestart={startGame}
          finalScore={score}
          finalDistance={Math.floor(distance)}
          finalStuds={studsCount}
          highScore={highScore}
        />
      )}
    </div>
  )
}
