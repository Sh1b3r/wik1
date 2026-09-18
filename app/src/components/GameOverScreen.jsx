import React, { useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { assetUrl } from '../utils/asset.js'

// Inject keyframe CSS once
const STYLE_ID = 'game-over-styles'
function injectStyles() {
  if (document.getElementById(STYLE_ID)) return
  const style = document.createElement('style')
  style.id = STYLE_ID
  style.textContent = `
    @keyframes goFadeIn {
      from { opacity: 0; transform: scale(0.92); }
      to   { opacity: 1; transform: scale(1); }
    }
    @keyframes goSlideUp {
      from { opacity: 0; transform: translateY(24px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes pulse {
      0%, 100% { opacity: 0.5; }
      50%       { opacity: 1; }
    }
  `
  document.head.appendChild(style)
}

function GameOverScreen({ onRestart, finalScore = 0, finalDistance = 0, finalStuds = 0, highScore = 0 }) {
  const [ready, setReady] = useState(false)

  useEffect(() => { injectStyles() }, [])

  // Show UI after short delay so video has time to start
  useEffect(() => {
    const t = setTimeout(() => setReady(true), 400)
    return () => clearTimeout(t)
  }, [])

  // Keyboard listener
  useEffect(() => {
    const handleKey = (e) => {
      if (e.code === 'ShiftLeft' && ready) onRestart()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [ready, onRestart])

  return (
    <div
      id="game-over-screen"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        background: '#040816',
      }}
    >
      {/* Background overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at 50% 50%, rgba(20, 5, 5, 0.7) 0%, rgba(4, 8, 22, 0.95) 100%)',
          zIndex: 1,
          pointerEvents: 'none',
        }}
      />

      {/* Top HUD: Identical in structure to in-game HUD, but with Game Over red/crimson theme */}
      <div
        className="game-top-hud"
        style={{
          position: 'absolute',
          top: 20,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          zIndex: 20,
          background: 'rgba(25, 10, 10, 0.92)',
          borderRadius: '30px',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(239, 68, 68, 0.55)',
          boxShadow: '0 8px 32px rgba(239, 68, 68, 0.25), 0 4px 16px rgba(0, 0, 0, 0.8)',
          pointerEvents: 'none',
          opacity: ready ? 1 : 0,
          transition: 'opacity 0.5s ease',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div className="hud-lbl" style={{ fontSize: '0.72rem', color: '#f87171', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
            Distance
          </div>
          <div className="hud-val" style={{ fontSize: '1.75rem', fontWeight: 900, color: '#f87171' }}>
            {finalDistance}m
          </div>
        </div>

        <div style={{ width: '1px', background: 'rgba(239, 68, 68, 0.25)' }} />

        <div style={{ textAlign: 'center' }}>
          <div className="hud-lbl" style={{ fontSize: '0.72rem', color: '#fca5a5', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
            Score
          </div>
          <div className="hud-val" style={{ fontSize: '1.75rem', fontWeight: 900, color: '#ffffff' }}>
            {finalScore.toLocaleString()}
          </div>
        </div>

        <div style={{ width: '1px', background: 'rgba(239, 68, 68, 0.25)' }} />

        <div style={{ textAlign: 'center' }}>
          <div className="hud-lbl" style={{ fontSize: '0.72rem', color: '#fcd34d', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
            Studs
          </div>
          <div className="hud-val" style={{ fontSize: '1.75rem', fontWeight: 900, color: '#ffd700' }}>
            {finalStuds}
          </div>
        </div>

        <div style={{ width: '1px', background: 'rgba(239, 68, 68, 0.25)' }} />

        <div style={{ textAlign: 'center' }}>
          <div className="hud-lbl" style={{ fontSize: '0.72rem', color: '#facc15', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
            Best Score
          </div>
          <div className="hud-val" style={{ fontSize: '1.75rem', fontWeight: 900, color: '#facc15' }}>
            {highScore.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Center Video instead of GAME OVER text */}
      <div
        className="game-over-video-wrap"
        style={{
          position: 'relative',
          zIndex: 10,
          maxWidth: '440px',
          width: 'min(440px, 86vw)',
          borderRadius: '20px',
          overflow: 'hidden',
          boxShadow: '0 0 45px rgba(239, 68, 68, 0.45), 0 16px 45px rgba(0, 0, 0, 0.8)',
          border: '2px solid rgba(239, 68, 68, 0.55)',
          opacity: ready ? 1 : 0,
          transform: ready ? 'scale(1)' : 'scale(0.95)',
          transition: 'opacity 0.6s ease 0.1s, transform 0.6s ease 0.1s',
          marginTop: '70px',
          marginBottom: '16px',
          lineHeight: 0,
        }}
      >
        <video
          src={assetUrl('Game Over.mp4')}
          autoPlay
          loop
          muted
          playsInline
          style={{
            width: '100%',
            height: 'auto',
            maxHeight: '230px',
            display: 'block',
            objectFit: 'cover',
            objectPosition: 'center 42%',
          }}
        />
      </div>

      {/* Restart button */}
      <div
        className="game-over-restart-wrap"
        style={{
          opacity: ready ? 1 : 0,
          transform: 'translateY(0)',
          transition: 'opacity 0.5s ease 0.4s, transform 0.5s ease 0.4s',
          marginTop: '8px',
          marginBottom: '16px',
          pointerEvents: 'auto',
          cursor: 'pointer',
          zIndex: 10,
          position: 'relative',
        }}
        onClick={onRestart}
      >
        <button
          onClick={onRestart}
          style={{
            background: 'linear-gradient(135deg, #8b0000 0%, #dc2626 50%, #ef4400 100%)',
            border: '2px solid #f87171',
            borderRadius: '999px',
            padding: '1rem 3rem',
            fontSize: '1.2rem',
            fontWeight: '800',
            fontFamily: '"Orbitron", "Rajdhani", sans-serif',
            color: '#fff',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            boxShadow: `
              0 0 15px #dc2626,
              0 0 30px #ef4400,
              0 0 60px rgba(220, 38, 38, 0.5),
              inset 0 0 20px rgba(255, 255, 255, 0.15)
            `,
            textShadow: '0 0 4px #ff0000, 0 0 8px #ff3300',
            transition: 'all 0.2s ease',
            outline: 'none',
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'scale(1.05)'
            e.target.style.boxShadow = `
              0 0 25px #dc2626,
              0 0 50px #ef4400,
              0 0 80px rgba(220, 38, 38, 0.7),
              inset 0 0 30px rgba(255, 255, 255, 0.25)
            `
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'scale(1)'
            e.target.style.boxShadow = `
              0 0 15px #dc2626,
              0 0 30px #ef4400,
              0 0 60px rgba(220, 38, 38, 0.5),
              inset 0 0 20px rgba(255, 255, 255, 0.15)
            `
          }}
        >
          <span>Restart</span>
          <span
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              border: '1px solid rgba(255, 255, 255, 0.5)',
              borderRadius: '6px',
              padding: '2px 8px',
              fontSize: '0.9rem',
              fontWeight: 900,
              boxShadow: '0 2px 4px rgba(0,0,0,0.4)',
              marginLeft: '8px',
            }}
          >
            L SHIFT / TAP
          </span>
        </button>
        <div
          style={{
            marginTop: '0.8rem',
            textAlign: 'center',
            fontSize: '0.85rem',
            color: '#f87171',
            fontWeight: 600,
            letterSpacing: '0.05em',
            textShadow: '0 0 4px #ef4400',
            animation: 'pulse 1.5s ease-in-out infinite',
          }}
        >
        </div>
      </div>
    </div>
  )
}

export default GameOverScreen