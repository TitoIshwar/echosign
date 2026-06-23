import { useRef, useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Webcam from 'react-webcam'
import {
  Camera, CameraOff, Mic, MicOff, Download, Trash2,
  Hand, MessageSquare, Zap, Volume2, VolumeX, Activity,
  RefreshCw
} from 'lucide-react'
import { useDemoStore } from '../store/demoStore'

// Demo signs for simulation
const demoSigns = [
  { sign: 'Namaste', sentence: 'Namaste, greetings to you.', confidence: 98.7 },
  { sign: 'Hello', sentence: 'Hello, how are you?', confidence: 96.2 },
  { sign: 'Thank You', sentence: 'Thank you very much.', confidence: 97.4 },
  { sign: 'Please', sentence: 'Please help me with this.', confidence: 94.8 },
  { sign: 'Yes', sentence: 'Yes, I agree with that.', confidence: 99.1 },
  { sign: 'No', sentence: 'No, that is not correct.', confidence: 95.5 },
  { sign: 'Water', sentence: 'I need water, please.', confidence: 93.7 },
  { sign: 'Help', sentence: 'I need help, please assist me.', confidence: 91.3 },
  { sign: 'Good Morning', sentence: 'Good morning, have a nice day!', confidence: 97.8 },
  { sign: 'My Name', sentence: 'My name is — nice to meet you.', confidence: 95.0 },
]

// Hand landmark positions for visualization (21 points)
const LANDMARKS = [
  { x: 0.5, y: 0.75 },   // 0 - wrist
  { x: 0.45, y: 0.65 }, { x: 0.42, y: 0.55 }, { x: 0.40, y: 0.47 }, { x: 0.38, y: 0.40 }, // thumb
  { x: 0.52, y: 0.60 }, { x: 0.51, y: 0.46 }, { x: 0.51, y: 0.36 }, { x: 0.51, y: 0.28 }, // index
  { x: 0.56, y: 0.59 }, { x: 0.57, y: 0.45 }, { x: 0.57, y: 0.34 }, { x: 0.57, y: 0.26 }, // middle
  { x: 0.61, y: 0.61 }, { x: 0.62, y: 0.48 }, { x: 0.62, y: 0.37 }, { x: 0.62, y: 0.29 }, // ring
  { x: 0.65, y: 0.65 }, { x: 0.67, y: 0.54 }, { x: 0.68, y: 0.44 }, { x: 0.69, y: 0.36 }, // pinky
]

const CONNECTIONS = [
  [0,1],[1,2],[2,3],[3,4],
  [0,5],[5,6],[6,7],[7,8],
  [0,9],[9,10],[10,11],[11,12],
  [0,13],[13,14],[14,15],[15,16],
  [0,17],[17,18],[18,19],[19,20],
  [5,9],[9,13],[13,17],
]

function HandCanvas({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animFrame = useRef<number>(0)
  const timeRef = useRef(0)

  useEffect(() => {
    if (!active) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const draw = (t: number) => {
      timeRef.current = t
      const W = canvas.width
      const H = canvas.height
      ctx.clearRect(0, 0, W, H)

      // Subtle noise for "live" feeling
      const jitter = (v: number) => v + (Math.sin(t * 0.003 + v * 100) * 0.008)

      // Map landmarks to canvas
      const pts = LANDMARKS.map(({ x, y }) => ({
        x: jitter(x) * W,
        y: jitter(y) * H,
      }))

      // Draw connections
      CONNECTIONS.forEach(([from, to]) => {
        const p1 = pts[from]
        const p2 = pts[to]
        const grad = ctx.createLinearGradient(p1.x, p1.y, p2.x, p2.y)
        grad.addColorStop(0, 'rgba(79,70,229,0.7)')
        grad.addColorStop(1, 'rgba(6,182,212,0.5)')
        ctx.beginPath()
        ctx.moveTo(p1.x, p1.y)
        ctx.lineTo(p2.x, p2.y)
        ctx.strokeStyle = grad
        ctx.lineWidth = 1.5
        ctx.lineCap = 'round'
        ctx.stroke()
      })

      // Draw points
      pts.forEach((pt, i) => {
        const pulse = 1 + Math.sin(t * 0.004 + i * 0.5) * 0.3
        const r = (i === 0 ? 6 : 4) * pulse

        // Outer glow
        const grd = ctx.createRadialGradient(pt.x, pt.y, 0, pt.x, pt.y, r * 3)
        grd.addColorStop(0, i === 0 ? 'rgba(79,70,229,0.4)' : 'rgba(6,182,212,0.3)')
        grd.addColorStop(1, 'transparent')
        ctx.beginPath()
        ctx.arc(pt.x, pt.y, r * 3, 0, Math.PI * 2)
        ctx.fillStyle = grd
        ctx.fill()

        // Core dot
        ctx.beginPath()
        ctx.arc(pt.x, pt.y, r * 0.7, 0, Math.PI * 2)
        ctx.fillStyle = i === 0 ? '#4F46E5' : '#06B6D4'
        ctx.fill()
      })

      // Bounding box
      const xs = pts.map(p => p.x)
      const ys = pts.map(p => p.y)
      const minX = Math.min(...xs) - 16
      const minY = Math.min(...ys) - 16
      const maxX = Math.max(...xs) + 16
      const maxY = Math.max(...ys) + 16
      ctx.strokeStyle = 'rgba(79,70,229,0.3)'
      ctx.lineWidth = 1
      ctx.setLineDash([4, 4])
      ctx.strokeRect(minX, minY, maxX - minX, maxY - minY)
      ctx.setLineDash([])

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
  const color = value >= 95 ? '#22C55E' : value >= 80 ? '#06B6D4' : '#F59E0B'
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-xs">
        <span style={{ color: 'var(--text-subtle)' }}>Confidence</span>
        <span className="font-bold" style={{ color }}>{ value.toFixed(1)}%</span>
      </div>
      <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--card-hover)' }}>
        <motion.div
          className="h-full rounded-full"
          style={{ background: `linear-gradient(90deg, #4F46E5, ${color})` }}
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
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
  const simulationRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const signIndexRef = useRef(0)
  const [webcamError, setWebcamError] = useState(false)

  // Simulate real-time sign detection
  const startSimulation = useCallback(() => {
    simulationRef.current = setInterval(() => {
      const idx = signIndexRef.current % demoSigns.length
      const demo = demoSigns[idx]
      setDetectedSign(demo.sign, demo.sentence, demo.confidence)
      addToTranscript(demo.sign, demo.sentence)
      signIndexRef.current++
    }, 3500)
  }, [setDetectedSign, addToTranscript])

  const stopSimulation = useCallback(() => {
    if (simulationRef.current) {
      clearInterval(simulationRef.current)
      simulationRef.current = null
    }
  }, [])

  const handleToggleWebcam = () => {
    if (isWebcamActive) {
      stopSimulation()
      setDetectedSign('Waiting...', 'Activate webcam to begin recognition', 0)
    } else {
      startSimulation()
    }
    toggleWebcam()
  }

  const handleSpeak = () => {
    if (!window.speechSynthesis) return

    const synth = window.speechSynthesis

    // Stop if already speaking
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

    // Chrome often pauses speechSynthesis silently — resume() wakes it up.
    // Do NOT call cancel() before speak() — that is what was breaking it.
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

  useEffect(() => () => stopSimulation(), [stopSimulation])

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
            Activate your webcam to begin. All processing runs locally in your browser — nothing leaves your device.
          </p>
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
                        <p className="text-sm text-center px-4" style={{ color: 'var(--text-subtle)' }}>Camera access denied. Using simulation mode.</p>
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

                <HandCanvas active={isWebcamActive} />

                {!isWebcamActive && (
                  <div className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
                    <p className="text-xs text-center" style={{ color: 'var(--text-subtle)' }}>Landmarks appear when<br />recognition is active</p>
                  </div>
                )}

                {/* Info overlay */}
                <div className="absolute top-3 right-3 glass rounded-lg px-2 py-1 text-xs" style={{ color: 'var(--text-subtle)' }} aria-hidden="true">
                  21 points
                </div>
              </div>

              {/* Stats bar */}
              <div className="p-5 grid grid-cols-3 gap-4" style={{ borderTop: '1px solid var(--border-color)' }}>
                {[
                  { label: 'Points', value: isWebcamActive ? '21' : '—', color: '#818CF8' },
                  { label: 'FPS', value: isWebcamActive ? '30' : '—', color: '#22D3EE' },
                  { label: 'Model', value: 'v2.1', color: '#4ADE80' },
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
                      aria-label={`Generated sentence: ${generatedSentence}`}
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
                    disabled={generatedSentence === 'Activate webcam to begin recognition'}
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
