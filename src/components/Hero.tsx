import { motion } from 'framer-motion'
import { Zap, Hand, MessageSquare, Mic } from 'lucide-react'
import Logo from './Logo'

// Hand landmark positions — shifted up 75px total from original to clear overlay
const landmarks = [
  [150, 205], [140, 165], [130, 125], [120,  90], [110,  60],
  [170, 155], [175, 110], [178,  80], [180,  55],
  [195, 160], [200, 113], [202,  83], [203,  58],
  [220, 165], [225, 120], [227,  90], [228,  65],
  [242, 175], [248, 140], [250, 113], [252,  90],
]



const connections = [
  [0,1],[1,2],[2,3],[3,4],
  [0,5],[5,6],[6,7],[7,8],
  [0,9],[9,10],[10,11],[11,12],
  [0,13],[13,14],[14,15],[15,16],
  [0,17],[17,18],[18,19],[19,20],
  [5,9],[9,13],[13,17],
]

const floatingCards = [
  {
    id: 1,
    label: 'Detected Sign',
    value: 'Namaste',
    icon: Hand,
    color: 'text-[#818CF8]',
    bg: 'from-[#4F46E5]/20 to-[#4F46E5]/5',
    delay: 0,
    position: 'top-8 -left-4 md:-left-12',
  },
  {
    id: 2,
    label: 'Confidence',
    value: '98.7%',
    icon: Zap,
    color: 'text-[#4ADE80]',
    bg: 'from-[#22C55E]/20 to-[#22C55E]/5',
    delay: 0.8,
    position: 'bottom-8 -left-2 md:-left-8',
  },
]

export default function Hero() {
  return (
    <section
      className="relative min-h-screen flex items-center pt-20 pb-16 hero-gradient grid-bg overflow-hidden"
      aria-labelledby="hero-heading"
    >
      {/* Background glow orbs */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#4F46E5]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#06B6D4]/8 rounded-full blur-3xl" />
        <div className="absolute top-3/4 left-1/2 w-64 h-64 bg-[#22C55E]/5 rounded-full blur-3xl" />
      </div>

      <div className="container-custom relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 xl:gap-24 items-center">

          {/* Left Content */}
          <div className="text-center lg:text-left">

            {/* Tagline / H1 */}
            <motion.h1
              id="hero-heading"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="text-5xl sm:text-6xl lg:text-7xl font-bold font-display leading-[1.1] tracking-tight mb-6"
              style={{ color: 'var(--text-primary)' }}
            >
              Every Gesture{' '}
              <span className="gradient-text">Has A Voice</span>
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.35 }}
              className="text-lg md:text-xl max-w-lg mx-auto lg:mx-0 text-center lg:text-left mb-10 leading-[1.75]"
              style={{ color: 'var(--text-muted)' }}
            >
              Real-time Indian Sign Language recognition powered by AI. Convert gestures into text and speech directly in your browser.
            </motion.p>

            {/* Single CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <a
                href="#demo"
                className="btn-primary text-base py-4 px-10 animate-glow inline-flex"
                aria-label="Start ISL recognition"
              >
                <Logo iconOnly height={22} className="-ml-1" monochrome />
                <span className="font-semibold tracking-wide">EchoSign</span>
              </a>
            </motion.div>
          </div>

          {/* Right Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex justify-center"
            aria-label="Live ISL recognition visualization"
          >
            <div className="relative w-full max-w-md">
              {/* Glow behind card */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#4F46E5]/20 to-[#06B6D4]/20 rounded-3xl blur-2xl" aria-hidden="true" />

              {/* Webcam mockup */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="relative glass rounded-3xl p-1 shadow-2xl"
                style={{ border: '1px solid rgba(79,70,229,0.3)' }}
              >
                {/* Camera header bar */}
                <div
                  className="flex items-center gap-2 px-4 py-3"
                  style={{ borderBottom: '1px solid var(--border-color)' }}
                >
                  <div className="flex gap-1.5" aria-hidden="true">
                    <div className="w-3 h-3 rounded-full bg-red-500/70" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                    <div className="w-3 h-3 rounded-full bg-green-500/70" />
                  </div>
                  <div className="flex items-center gap-2 ml-2">
                    <div className="live-dot" aria-hidden="true" />
                    <span className="text-xs text-[#4ADE80] font-medium">LIVE</span>
                  </div>
                  <span className="ml-auto text-xs" style={{ color: 'var(--text-subtle)' }}>EchoSign Cam</span>
                </div>

                {/* Camera feed area with SVG hand landmarks */}
                <div className="relative bg-[#0D1117] rounded-2xl overflow-hidden" style={{ aspectRatio: '4/3' }}>
                  {/* Dark gradient background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#0D1117] via-[#111827] to-[#0D1117]" aria-hidden="true" />

                  {/* Grid overlay */}
                  <div className="absolute inset-0 opacity-10" style={{
                    backgroundImage: 'linear-gradient(rgba(79,70,229,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(79,70,229,0.3) 1px, transparent 1px)',
                    backgroundSize: '32px 32px'
                  }} aria-hidden="true" />

                  {/* Hand landmark SVG */}
                  <svg
                    className="absolute inset-0 w-full h-full"
                    viewBox="0 0 380 290"
                    aria-label="Hand landmark visualization"
                    role="img"
                  >
                    {connections.map(([from, to], i) => (
                      <motion.line
                        key={i}
                        x1={landmarks[from][0]}
                        y1={landmarks[from][1]}
                        x2={landmarks[to][0]}
                        y2={landmarks[to][1]}
                        stroke="rgba(79, 70, 229, 0.6)"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0.4, 1, 0.4] }}
                        transition={{ duration: 2, repeat: Infinity, delay: i * 0.05 }}
                      />
                    ))}
                    {landmarks.map(([x, y], i) => (
                      <motion.circle
                        key={i}
                        cx={x}
                        cy={y}
                        r={i === 0 ? 5 : 3.5}
                        fill={i === 0 ? '#4F46E5' : '#06B6D4'}
                        initial={{ scale: 0 }}
                        animate={{ scale: [0.8, 1.2, 0.8] }}
                        transition={{ duration: 2, repeat: Infinity, delay: i * 0.03 }}
                        style={{ filter: `drop-shadow(0 0 4px ${i === 0 ? '#4F46E5' : '#06B6D4'})` }}
                      />
                    ))}
                  </svg>

                  {/* Recognition badge */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.2 }}
                    className="absolute bottom-4 left-4 right-4"
                  >
                    <div className="glass rounded-xl px-4 py-3 flex items-center gap-3 border border-[#4F46E5]/30">
                      <div className="w-8 h-8 rounded-lg bg-[#4F46E5]/20 flex items-center justify-center flex-shrink-0">
                        <Hand size={16} className="text-[#818CF8]" aria-hidden="true" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs" style={{ color: 'var(--text-subtle)' }}>Recognized</div>
                        <div className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>Namaste 🙏</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs" style={{ color: 'var(--text-subtle)' }}>Conf.</div>
                        <div className="text-sm font-bold text-[#4ADE80]">98%</div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>

              {/* Floating info cards */}
              {floatingCards.map((card) => {
                const Icon = card.icon
                return (
                  <motion.div
                    key={card.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1, y: [0, -6, 0] }}
                    transition={{
                      opacity: { delay: 0.8 + card.delay, duration: 0.5 },
                      scale: { delay: 0.8 + card.delay, duration: 0.5 },
                      y: { duration: 3 + card.delay, repeat: Infinity, ease: 'easeInOut', delay: card.delay }
                    }}
                    className={`absolute ${card.position} glass rounded-xl px-3 py-2 shadow-lg min-w-max`}
                    style={{ border: '1px solid var(--border-color)' }}
                    aria-hidden="true"
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${card.bg} flex items-center justify-center`}>
                        <Icon size={13} className={card.color} />
                      </div>
                      <div>
                        <div className="text-[10px]" style={{ color: 'var(--text-subtle)' }}>{card.label}</div>
                        <div className={`text-xs font-semibold ${card.color}`}>{card.value}</div>
                      </div>
                    </div>
                  </motion.div>
                )
              })}

              {/* Speech bubble */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5, duration: 0.5 }}
                className="absolute -right-2 md:-right-8 bottom-24 glass rounded-2xl rounded-br-sm px-4 py-2.5 border border-[#06B6D4]/30 shadow-lg max-w-[180px]"
                aria-hidden="true"
              >
                <div className="flex items-center gap-2 mb-1">
                  <Mic size={12} className="text-[#22D3EE]" />
                  <span className="text-[10px]" style={{ color: 'var(--text-subtle)' }}>Speech output</span>
                </div>
                <p className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>"Hello, how are you?"</p>
                <div className="flex items-center gap-0.5 mt-2">
                  {[0, 0.1, 0.2, 0.15, 0.05, 0.2, 0.1, 0, 0.15, 0.05].map((delay, i) => (
                    <div
                      key={i}
                      className="wave-bar"
                      style={{ animationDelay: `${delay}s`, animationDuration: `${0.6 + delay}s` }}
                    />
                  ))}
                </div>
              </motion.div>

              {/* Generated text card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1, y: [0, -6, 0] }}
                transition={{
                  opacity: { delay: 1.3, duration: 0.5 },
                  scale: { delay: 1.3, duration: 0.5 },
                  y: { duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }
                }}
                className="absolute top-1/2 -right-4 md:-right-10 glass rounded-xl px-3 py-2 shadow-lg min-w-max"
                style={{ border: '1px solid var(--border-color)' }}
                aria-hidden="true"
              >
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#06B6D4]/20 to-[#06B6D4]/5 flex items-center justify-center">
                    <MessageSquare size={13} className="text-[#22D3EE]" />
                  </div>
                  <div>
                    <div className="text-[10px]" style={{ color: 'var(--text-subtle)' }}>Generated Text</div>
                    <div className="text-xs font-semibold text-[#22D3EE]">"Hello, how are you?"</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
