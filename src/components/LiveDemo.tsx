import { useRef, useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Webcam from 'react-webcam'
import {
  Camera, CameraOff, Mic, MicOff, Download, Trash2,
  Hand, MessageSquare, Zap, Volume2, VolumeX, Activity,
  RefreshCw, WifiOff, Wifi
} from 'lucide-react'
import { useDemoStore } from '../store/demoStore'

const API_URL = 'http://localhost:8000'

// Sentence templates for detected signs
function buildSentence(sign: string): string {
  const templates: Record<string, string> = {
    'A': 'The letter A.',
    'B': 'The letter B.',
    'C': 'The letter C.',
    'D': 'The letter D.',
    'E': 'The letter E.',
    'F': 'The letter F.',
    'G': 'The letter G.',
    'H': 'The letter H.',
    'I': 'The letter I.',
    'J': 'The letter J.',
    'K': 'The letter K.',
    'L': 'The letter L.',
    'M': 'The letter M.',
    'N': 'The letter N.',
    'O': 'The letter O.',
    'P': 'The letter P.',
    'Q': 'The letter Q.',
    'R': 'The letter R.',
    'S': 'The letter S.',
    'T': 'The letter T.',
    'U': 'The letter U.',
    'V': 'The letter V.',
    'W': 'The letter W.',
    'X': 'The letter X.',
    'Y': 'The letter Y.',
    'Z': 'The letter Z.',
    'Hello': 'Hello, how are you?',
    'Namaste': 'Namaste, greetings to you.',
    'Thank You': 'Thank you very much.',
    'Please': 'Please help me with this.',
    'Yes': 'Yes, I agree with that.',
    'No': 'No, that is not correct.',
    'Water': 'I need water, please.',
    'Help': 'I need help, please assist me.',
    'Good Morning': 'Good morning, have a nice day!',
    'My Name': 'My name is — nice to meet you.',
  }
  return templates[sign] ?? `Detected sign: ${sign}.`
}

// MediaPipe landmark connections
const CONNECTIONS = [
  [0,1],[1,2],[2,3],[3,4],
  [0,5],[5,6],[6,7],[7,8],
  [0,9],[9,10],[10,11],[11,12],
  [0,13],[13,14],[14,15],[15,16],
  [0,17],[17,18],[18,19],[19,20],
  [5,9],[9,13],[13,17],
]

type Landmark = { x: number; y: number; z: number }

function HandCanvas({ active, landmarks, handedness }: { active: boolean; landmarks: Landmark[][]; handedness: string[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animFrame = useRef<number>(0)
  const landmarksRef = useRef<Landmark[][]>(landmarks)
  const handednessRef = useRef<string[]>(handedness)

  useEffect(() => {
    landmarksRef.current = landmarks
    handednessRef.current = handedness
  }, [landmarks, handedness])

  useEffect(() => {
    if (!active) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const draw = (t: number) => {
      const W = canvas.width
      const H = canvas.height
      ctx.clearRect(0, 0, W, H)

      if (landmarksRef.current && landmarksRef.current.length > 0) {
        landmarksRef.current.forEach((handPts, handIdx) => {
          if (handPts.length !== 21) return
          const pts = handPts.map(lm => ({ x: lm.x * W, y: lm.y * H }))

          // Draw connections
          CONNECTIONS.forEach(([from, to]) => {
            const p1 = pts[from], p2 = pts[to]
            const grad = ctx.createLinearGradient(p1.x, p1.y, p2.x, p2.y)
            grad.addColorStop(0, 'rgba(79,70,229,0.8)')
            grad.addColorStop(1, 'rgba(6,182,212,0.6)')
            ctx.beginPath()
            ctx.moveTo(p1.x, p1.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.strokeStyle = grad
            ctx.lineWidth = 2
            ctx.lineCap = 'round'
            ctx.stroke()
          })

          // Draw points
          pts.forEach((pt, i) => {
            const pulse = 1 + Math.sin(t * 0.004 + i * 0.5) * 0.2
            const r = (i === 0 ? 6 : 4) * pulse

            const grd = ctx.createRadialGradient(pt.x, pt.y, 0, pt.x, pt.y, r * 3)
            grd.addColorStop(0, i === 0 ? 'rgba(79,70,229,0.5)' : 'rgba(6,182,212,0.4)')
            grd.addColorStop(1, 'transparent')
            ctx.beginPath()
            ctx.arc(pt.x, pt.y, r * 3, 0, Math.PI * 2)
            ctx.fillStyle = grd
            ctx.fill()

            ctx.beginPath()
            ctx.arc(pt.x, pt.y, r * 0.7, 0, Math.PI * 2)
            ctx.fillStyle = i === 0 ? '#4F46E5' : '#06B6D4'
            ctx.fill()
          })

          // Bounding box
          const xs = pts.map(p => p.x)
          const ys = pts.map(p => p.y)
          ctx.strokeStyle = 'rgba(79,70,229,0.3)'
          ctx.lineWidth = 1
          ctx.setLineDash([4, 4])
          ctx.strokeRect(
            Math.min(...xs) - 12, Math.min(...ys) - 12,
            Math.max(...xs) - Math.min(...xs) + 24,
            Math.max(...ys) - Math.min(...ys) + 24,
          )
          ctx.setLineDash([])

          // Handedness Label next to wrist
          const label = handednessRef.current[handIdx] || 'Hand'
          ctx.fillStyle = '#E0E7FF'
          ctx.font = 'bold 12px sans-serif'
          ctx.fillText(label, pts[0].x + 10, pts[0].y - 10)
        })

        // Draw global debug overlay
        ctx.fillStyle = 'rgba(15, 23, 42, 0.85)'
        ctx.fillRect(10, 10, 180, 75)
        ctx.strokeStyle = 'rgba(129, 140, 248, 0.4)'
        ctx.strokeRect(10, 10, 180, 75)
        ctx.fillStyle = '#fff'
        ctx.font = 'bold 11px monospace'
        ctx.fillText(`HANDS DETECTED : ${landmarksRef.current.length}`, 20, 30)
        landmarksRef.current.forEach((handPts, idx) => {
          const lbl = handednessRef.current[idx] || 'Unknown'
          ctx.fillText(`Hand ${idx + 1}        : ${lbl} (${handPts.length} pts)`, 20, 48 + idx * 15)
        })
      } else {
        // Idle animation when no hand detected
        const cx = W / 2, cy = H / 2
        const rings = [60, 90, 120]
        rings.forEach((r, i) => {
          const alpha = 0.08 + 0.05 * Math.sin(t * 0.002 + i)
          ctx.beginPath()
          ctx.arc(cx, cy, r, 0, Math.PI * 2)
          ctx.strokeStyle = `rgba(79,70,229,${alpha})`
          ctx.lineWidth = 1
          ctx.stroke()
        })
      }

      animFrame.current = requestAnimationFrame(draw)
    }

    animFrame.current = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(animFrame.current)
  }, [active])

  return (
    <canvas
      ref={canvasRef}
      width={400}
      height={300}
      className="absolute inset-0 w-full h-full"
      style={{ display: active ? 'block' : 'none' }}
      aria-label="Real-time hand landmark visualization"
    />
  )
}


function ConfidenceBar({ value }: { value: number }) {
  const color = value >= 90 ? '#22C55E' : value >= 70 ? '#06B6D4' : '#F59E0B'
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-xs">
        <span style={{ color: 'var(--text-subtle)' }}>Confidence</span>
        <span className="font-bold" style={{ color }}>{value.toFixed(1)}%</span>
      </div>
      <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--card-hover)' }}>
        <motion.div
          className="h-full rounded-full"
          style={{ background: `linear-gradient(90deg, #4F46E5, ${color})` }}
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
    </div>
  )
}

function WaveformDisplay({ active }: { active: boolean }) {
  return (
    <div className="flex items-center gap-0.5 h-6" aria-label="Speech waveform visualization">
      {Array.from({ length: 16 }).map((_, i) => (
        <motion.div
          key={i}
          className="w-1 rounded-full"
          style={{ background: 'linear-gradient(180deg, #06B6D4, #4F46E5)' }}
          animate={active ? {
            height: [4, 8 + Math.random() * 16, 4],
            opacity: [0.5, 1, 0.5],
          } : { height: 4, opacity: 0.3 }}
          transition={{
            duration: 0.4 + Math.random() * 0.4,
            repeat: Infinity,
            delay: i * 0.05,
          }}
        />
      ))}
    </div>
  )
}

export default function LiveDemo() {
  const {
    isWebcamActive, detectedSign, generatedSentence, confidence,
    isListening, transcript, isSpeaking,
    toggleWebcam, setDetectedSign, toggleListening, addToTranscript,
    clearTranscript, setIsSpeaking,
  } = useDemoStore()

  const webcamRef = useRef<Webcam>(null)
  const loopActiveRef = useRef(false)
  const loopTimerRef  = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [webcamError, setWebcamError] = useState(false)
  const [backendStatus, setBackendStatus] = useState<'checking' | 'online' | 'offline'>('checking')
  const [landmarks, setLandmarks] = useState<Landmark[][]>([])
  const [handedness, setHandedness] = useState<string[]>([])
  const [fps, setFps] = useState(0)
  const fpsCountRef = useRef(0)
  const lastFpsTime = useRef(Date.now())

  // ── Check backend health ──────────────────────────────────────────────────
  const checkBackend = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/health`, { signal: AbortSignal.timeout(2000) })
      if (res.ok) {
        setBackendStatus('online')
        return true
      }
    } catch {
      /* ignore */
    }
    setBackendStatus('offline')
    return false
  }, [])

  useEffect(() => {
    checkBackend()
    const t = setInterval(checkBackend, 5000)
    return () => clearInterval(t)
  }, [checkBackend])

  // ── Prediction loop (recursive setTimeout — never overlapping) ───────────
  const startPredictionLoop = useCallback(() => {
    loopActiveRef.current = true
    let lastSign = ''

    const tick = async () => {
      if (!loopActiveRef.current) return

      const screenshot = webcamRef.current?.getScreenshot()
      if (!screenshot) {
        loopTimerRef.current = setTimeout(tick, 200)
        return
      }

      try {
        const res = await fetch(`${API_URL}/predict`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: screenshot }),
          signal: AbortSignal.timeout(4000),
        })

        // 429 = backend busy with previous frame — silently skip, stay online
        if (res.status === 429) {
          if (loopActiveRef.current) loopTimerRef.current = setTimeout(tick, 50)
          return
        }

        if (!res.ok) {
          if (loopActiveRef.current) loopTimerRef.current = setTimeout(tick, 500)
          return
        }

        const data = await res.json()

        // Update FPS counter
        fpsCountRef.current++
        const now = Date.now()
        if (now - lastFpsTime.current >= 1000) {
          setFps(fpsCountRef.current)
          fpsCountRef.current = 0
          lastFpsTime.current = now
        }

        if (data.hand_detected && data.sign && data.sign !== 'No hand detected') {
          setBackendStatus('online')
          const sentence = buildSentence(data.sign)
          setDetectedSign(data.sign, sentence, data.confidence)

          if (data.sign !== lastSign) {
            addToTranscript(data.sign, sentence)
            lastSign = data.sign
          }

          if (data.landmarks) {
            setLandmarks(data.landmarks)
            setHandedness(data.handedness || [])
          }
        } else {
          setLandmarks([])
          setHandedness([])
          if (data.sign === 'No hand detected') {
            setDetectedSign('Waiting...', 'Show your hand to the camera', 0)
          }
        }

      } catch (err: unknown) {
        // AbortError = our own timeout — backend may still be running, don't mark offline
        const isAbort = err instanceof Error && err.name === 'AbortError'
        if (!isAbort) setBackendStatus('offline')
      }

      // Schedule next frame only after this one fully completes
      if (loopActiveRef.current) loopTimerRef.current = setTimeout(tick, 100)
    }

    tick()
  }, [setDetectedSign, addToTranscript])

  const stopPredictionLoop = useCallback(() => {
    loopActiveRef.current = false
    if (loopTimerRef.current) {
      clearTimeout(loopTimerRef.current)
      loopTimerRef.current = null
    }
    setLandmarks([])
    setHandedness([])
    setFps(0)
  }, [])

  const handleToggleWebcam = () => {
    if (isWebcamActive) {
      stopPredictionLoop()
      setDetectedSign('Waiting...', 'Activate webcam to begin recognition', 0)
    } else {
      startPredictionLoop()
    }
    toggleWebcam()
  }

  const handleSpeak = () => {
    if (!window.speechSynthesis) return
    const synth = window.speechSynthesis

    if (isSpeaking) {
      synth.cancel()
      setIsSpeaking(false)
      return
    }

    if (!generatedSentence || generatedSentence === 'Activate webcam to begin recognition') return

    const utterance = new SpeechSynthesisUtterance(generatedSentence)
    utterance.rate = 0.9
    utterance.pitch = 1
    utterance.volume = 1
    utterance.onstart = () => setIsSpeaking(true)
    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = () => setIsSpeaking(false)

    if (synth.paused) synth.resume()
    synth.speak(utterance)
  }

  const handleExport = () => {
    const content = transcript
      .map(t => `[${t.time}] Sign: ${t.sign} | Sentence: ${t.sentence}`)
      .join('\n')
    const blob = new Blob([`EchoSign Transcript\n${'='.repeat(40)}\n\n${content}`], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `echosign-transcript-${Date.now()}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  useEffect(() => () => stopPredictionLoop(), [stopPredictionLoop])

  return (
    <section
      id="demo"
      className="relative flex flex-col justify-center"
      style={{ minHeight: 'calc(100vh - 80px)', paddingTop: '5rem', paddingBottom: '5rem' }}
      aria-labelledby="demo-heading"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#4F46E5]/5 to-transparent pointer-events-none" aria-hidden="true" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#4F46E5]/5 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />

      <div style={{ width: '100%', maxWidth: '1400px', margin: '0 auto', paddingLeft: '2rem', paddingRight: '2rem' }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7 }}
          className="flex flex-col items-center text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 bg-[#4F46E5]/10 border border-[#4F46E5]/30 rounded-full px-4 py-1.5 mb-6">
            <div className={`w-2 h-2 rounded-full ${isWebcamActive ? 'bg-[#22C55E] animate-pulse' : 'bg-[#64748B]'}`} aria-hidden="true" />
            <span className="text-sm font-medium text-[#818CF8]">
              {isWebcamActive ? 'Recognition Active' : 'Live Recognition'}
            </span>
          </div>
          <h2 id="demo-heading" className="text-3xl md:text-4xl font-bold font-display mb-4 text-center" style={{lineHeight:'1.15', letterSpacing:'-0.02em', color: 'var(--text-primary)'}}>
            Real-Time <span className="gradient-text">ISL Recognition</span>
          </h2>
          <p className="text-base max-w-xl mx-auto text-center leading-[1.75]" style={{ color: 'var(--text-muted)' }}>
            Activate your webcam to begin. All processing runs locally — nothing leaves your device.
          </p>

          {/* Backend status pill */}
          <div className={`mt-4 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium border ${
            backendStatus === 'online'
              ? 'bg-[#22C55E]/10 border-[#22C55E]/30 text-[#4ADE80]'
              : backendStatus === 'offline'
              ? 'bg-red-500/10 border-red-500/30 text-red-400'
              : 'bg-[#64748B]/10 border-[#64748B]/30 text-[#64748B]'
          }`}>
            {backendStatus === 'online'
              ? <><Wifi size={11} /> Model API Online</>
              : backendStatus === 'offline'
              ? <><WifiOff size={11} /> Model API Offline — run backend/main.py</>
              : <><span className="w-2 h-2 rounded-full bg-current animate-pulse" /> Checking API...</>
            }
          </div>
        </motion.div>

        {/* Demo interface */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8 }}
          className="grid lg:grid-cols-5 gap-6 xl:gap-8"
        >
          {/* LEFT: Webcam Feed */}
          <div className="lg:col-span-2">
            <div className="glass rounded-2xl overflow-hidden h-full flex flex-col" style={{ border: '1px solid var(--border-color)' }}>
              {/* Panel header */}
              <div className="flex items-center gap-2.5 px-5 py-4" style={{ borderBottom: '1px solid var(--border-color)' }}>
                <Camera size={16} className="text-[#818CF8]" aria-hidden="true" />
                <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Camera Feed</span>
                {isWebcamActive && (
                  <span className="ml-auto flex items-center gap-1.5">
                    <span className="live-dot" aria-hidden="true" />
                    <span className="text-xs text-[#4ADE80] font-medium">LIVE</span>
                  </span>
                )}
              </div>

              {/* Camera area */}
              <div className="relative flex-1 bg-[#0D1117]" style={{ minHeight: 380 }}>
                {isWebcamActive && !webcamError ? (
                  <Webcam
                    ref={webcamRef}
                    className="w-full h-full object-cover"
                    mirrored
                    screenshotFormat="image/jpeg"
                    screenshotQuality={0.6}
                    onUserMediaError={() => setWebcamError(true)}
                    aria-label="Live webcam feed"
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                    {webcamError ? (
                      <>
                        <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center">
                          <CameraOff size={28} className="text-red-400" aria-hidden="true" />
                        </div>
                        <p className="text-sm text-center px-4" style={{ color: 'var(--text-subtle)' }}>Camera access denied.</p>
                        <button onClick={() => { setWebcamError(false); handleToggleWebcam() }} className="btn-secondary text-sm py-2 px-4">
                          <RefreshCw size={14} />
                          Retry
                        </button>
                      </>
                    ) : (
                      <>
                        <motion.div
                          animate={{ scale: [1, 1.05, 1], opacity: [0.5, 1, 0.5] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="w-16 h-16 rounded-2xl bg-[#4F46E5]/10 flex items-center justify-center"
                          aria-hidden="true"
                        >
                          <Camera size={28} className="text-[#818CF8]" />
                        </motion.div>
                        <div className="text-center px-4">
                          <p className="text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>Camera Inactive</p>
                          <p className="text-xs" style={{ color: 'var(--text-subtle)' }}>Click the button below to start</p>
                        </div>
                      </>
                    )}
                  </div>
                )}

                {/* Scan line animation */}
                {isWebcamActive && (
                  <motion.div
                    className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#4F46E5] to-transparent pointer-events-none"
                    animate={{ top: ['0%', '100%', '0%'] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                    aria-hidden="true"
                  />
                )}
              </div>

              {/* Camera control */}
              <div className="p-5" style={{ borderTop: '1px solid var(--border-color)' }}>
                <button
                  id="webcam-toggle"
                  onClick={handleToggleWebcam}
                  className={`w-full py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2.5 ${
                    isWebcamActive
                      ? 'bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20'
                      : 'btn-primary'
                  }`}
                  aria-pressed={isWebcamActive}
                  aria-label={isWebcamActive ? 'Stop webcam and recognition' : 'Start webcam and recognition'}
                >
                  {isWebcamActive ? (
                    <><CameraOff size={16} aria-hidden="true" /> Stop Recognition</>
                  ) : (
                    <><Camera size={16} aria-hidden="true" /> Start Recognition</>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* CENTER: Landmark Visualization */}
          <div className="lg:col-span-2">
            <div className="glass rounded-2xl overflow-hidden h-full flex flex-col" style={{ border: '1px solid var(--border-color)' }}>
              <div className="flex items-center gap-2.5 px-5 py-4" style={{ borderBottom: '1px solid var(--border-color)' }}>
                <Activity size={16} className="text-[#22D3EE]" aria-hidden="true" />
                <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Hand Landmarks</span>
              </div>

              <div className="relative flex-1 bg-gradient-to-br from-[#0D1117] to-[#111827]" style={{ minHeight: 380 }}>
                {/* Grid */}
                <div className="absolute inset-0 opacity-10" style={{
                  backgroundImage: 'linear-gradient(rgba(79,70,229,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(79,70,229,0.5) 1px, transparent 1px)',
                  backgroundSize: '24px 24px'
                }} aria-hidden="true" />

                <HandCanvas active={isWebcamActive} landmarks={landmarks} handedness={handedness} />

                {!isWebcamActive && (
                  <div className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
                    <p className="text-xs text-center" style={{ color: 'var(--text-subtle)' }}>Landmarks appear when<br />recognition is active</p>
                  </div>
                )}

                {isWebcamActive && landmarks.length === 0 && (
                  <div className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
                    <p className="text-xs text-center" style={{ color: 'var(--text-subtle)' }}>Show your hand<br />to the camera</p>
                  </div>
                )}

                {/* Info overlay */}
                <div className="absolute top-3 right-3 glass rounded-lg px-2 py-1 text-xs" style={{ color: 'var(--text-subtle)' }} aria-hidden="true">
                  {landmarks.length > 0 ? `${landmarks.length * 21} points` : '0 points'}
                </div>
              </div>

              {/* Stats bar */}
              <div className="p-5 grid grid-cols-3 gap-4" style={{ borderTop: '1px solid var(--border-color)' }}>
                {[
                  { label: 'Points', value: isWebcamActive && landmarks.length > 0 ? String(landmarks.length * 21) : '—', color: '#818CF8' },
                  { label: 'FPS', value: isWebcamActive ? String(fps) : '—', color: '#22D3EE' },
                  { label: 'API', value: backendStatus === 'online' ? 'Live' : 'Off', color: backendStatus === 'online' ? '#4ADE80' : '#f87171' },
                ].map(stat => (
                  <div key={stat.label} className="text-center">
                    <div className="text-base font-bold mb-0.5" style={{ color: stat.color }}>{stat.value}</div>
                    <div className="text-[10px]" style={{ color: 'var(--text-subtle)' }}>{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT: Output Panel */}
          <div className="lg:col-span-1 lg:row-span-1">
            <div className="glass rounded-2xl overflow-hidden h-full flex flex-col" style={{ border: '1px solid var(--border-color)' }}>
              <div className="flex items-center gap-2.5 px-5 py-4" style={{ borderBottom: '1px solid var(--border-color)' }}>
                <MessageSquare size={16} className="text-[#4ADE80]" aria-hidden="true" />
                <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Recognition Output</span>
              </div>

              <div className="flex-1 p-5 flex flex-col gap-5">
                {/* Detected Sign */}
                <div className="p-5 rounded-xl bg-[#4F46E5]/10 border border-[#4F46E5]/20">
                  <div className="flex items-center gap-2 mb-3">
                    <Hand size={14} className="text-[#818CF8]" aria-hidden="true" />
                    <span className="text-xs font-medium" style={{ color: 'var(--text-subtle)' }}>Detected Sign</span>
                  </div>
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={detectedSign}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="text-4xl font-bold"
                      style={{ color: 'var(--text-primary)' }}
                      aria-live="polite"
                      aria-label={`Detected sign: ${detectedSign}`}
                    >
                      {detectedSign}
                    </motion.p>
                  </AnimatePresence>
                </div>

                {/* Confidence */}
                <ConfidenceBar value={confidence} />

                {/* Generated Sentence */}
                <div className="p-5 rounded-xl bg-[#06B6D4]/10 border border-[#06B6D4]/20 flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <MessageSquare size={14} className="text-[#22D3EE]" aria-hidden="true" />
                    <span className="text-xs font-medium" style={{ color: 'var(--text-subtle)' }}>Generated Sentence</span>
                  </div>
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={generatedSentence}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="text-base font-medium leading-[1.75]"
                      style={{ color: 'var(--text-primary)' }}
                      aria-live="polite"
                    >
                      {generatedSentence}
                    </motion.p>
                  </AnimatePresence>
                </div>

                {/* Speech output */}
                <div className="p-4 rounded-xl" style={{ background: 'var(--card-hover)', border: '1px solid var(--border-color)' }}>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs" style={{ color: 'var(--text-subtle)' }}>Speech Output</span>
                    {isSpeaking && <span className="text-xs text-[#22D3EE] font-medium animate-pulse">Speaking...</span>}
                  </div>
                  <WaveformDisplay active={isSpeaking} />
                </div>

                {/* Action buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    id="speak-btn"
                    onClick={handleSpeak}
                    disabled={!generatedSentence || generatedSentence === 'Activate webcam to begin recognition'}
                    className="flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold bg-[#22C55E]/10 border border-[#22C55E]/20 text-[#4ADE80] hover:bg-[#22C55E]/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    aria-label="Speak the generated sentence"
                  >
                    {isSpeaking ? <VolumeX size={15} aria-hidden="true" /> : <Volume2 size={15} aria-hidden="true" />}
                    {isSpeaking ? 'Stop' : 'Speak'}
                  </button>
                  <button
                    id="export-btn"
                    onClick={handleExport}
                    disabled={transcript.length === 0}
                    className="flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold bg-[#06B6D4]/10 border border-[#06B6D4]/20 text-[#22D3EE] hover:bg-[#06B6D4]/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    aria-label="Export transcript as text file"
                  >
                    <Download size={15} aria-hidden="true" />
                    Export
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Transcript panel */}
        <AnimatePresence>
          {transcript.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4 }}
              className="mt-6"
            >
              <div className="glass rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border-color)' }}>
                <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <div className="flex items-center gap-2">
                    <Zap size={15} className="text-[#818CF8]" aria-hidden="true" />
                    <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Live Transcript</span>
                    <span className="text-xs ml-1" style={{ color: 'var(--text-subtle)' }}>({transcript.length} entries)</span>
                  </div>
                  <button
                    onClick={clearTranscript}
                    className="flex items-center gap-1.5 text-xs transition-colors px-2 py-1 rounded-lg hover:bg-red-500/5"
                    style={{ color: 'var(--text-subtle)' }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = '#f87171')}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = 'var(--text-subtle)')}
                    aria-label="Clear all transcript entries"
                  >
                    <Trash2 size={13} aria-hidden="true" />
                    Clear
                  </button>
                </div>
                <div className="max-h-56 overflow-y-auto p-4 space-y-2" role="log" aria-label="Recognition transcript">
                  <AnimatePresence>
                    {transcript.map((entry, i) => (
                      <motion.div
                        key={`${entry.time}-${i}`}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-start gap-3 p-3 rounded-lg transition-colors"
                        style={{ background: 'var(--card-hover)' }}
                      >
                        <span className="text-[10px] font-mono mt-0.5 flex-shrink-0" style={{ color: 'var(--text-subtle)' }}>{entry.time}</span>
                        <span className="text-xs font-semibold text-[#818CF8] flex-shrink-0">{entry.sign}</span>
                        <span className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>{entry.sentence}</span>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
