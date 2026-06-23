import { motion } from 'framer-motion'
import { Camera, Brain, Volume2, ArrowDown } from 'lucide-react'

const steps = [
  {
    number: '01',
    icon: Camera,
    title: 'Webcam Captures Gesture',
    description:
      'Your browser accesses the webcam feed locally. No video is ever sent to any server — all processing stays on your device.',
    detail: '30 FPS frame capture',
    color: '#4F46E5',
    colorLight: 'rgba(79,70,229,0.15)',
    badge: 'Privacy First',
  },
  {
    number: '02',
    icon: Brain,
    title: 'AI Detects ISL Signs',
    description:
      'Our on-device AI model identifies 21 hand landmarks per frame, classifies the ISL gesture in real-time with <50ms latency.',
    detail: '21 landmark points tracked',
    color: '#06B6D4',
    colorLight: 'rgba(6,182,212,0.15)',
    badge: 'On-Device AI',
  },
  {
    number: '03',
    icon: Volume2,
    title: 'Text + Speech Generated',
    description:
      'Recognized signs are assembled into natural sentences and instantly synthesized to speech using the Web Speech API.',
    detail: 'Multi-language support',
    color: '#22C55E',
    colorLight: 'rgba(34,197,94,0.15)',
    badge: 'Instant Output',
  },
]

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="section-padding relative"
      aria-labelledby="how-it-works-heading"
    >
      {/* Background accent */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#06B6D4]/3 to-transparent pointer-events-none" aria-hidden="true" />

      <div className="container-custom">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7 }}
          className="flex flex-col items-center text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-[#06B6D4]/10 border border-[#06B6D4]/30 rounded-full px-4 py-2 mb-6">
            <span className="text-sm font-medium text-[#22D3EE]">Simple. Fast. Private.</span>
          </div>
          <h2 id="how-it-works-heading" className="text-3xl md:text-4xl font-bold font-display mb-6 mx-auto max-w-3xl text-center" style={{lineHeight:'1.15', letterSpacing:'-0.02em', color:'var(--text-primary)'}}>
            How <span className="gradient-text">EchoSign</span> Works
          </h2>
          <p className="max-w-3xl mx-auto text-center text-[1.0625rem] leading-[1.8]" style={{ color: 'var(--text-muted)' }}>
            Three intelligent steps — from raw camera input to natural speech output in under 50 milliseconds.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="max-w-4xl mx-auto">
          {steps.map((step, i) => {
            const Icon = step.icon
            return (
              <div key={step.number}>
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.7, delay: i * 0.15 }}
                  className="grid md:grid-cols-[88px_1fr] gap-7 items-start"
                >
                  {/* Number + connector */}
                  <div className="flex flex-col items-center">
                    <div
                      className="w-16 h-16 rounded-2xl flex items-center justify-center font-black text-2xl font-display shadow-lg"
                      style={{
                        background: `linear-gradient(135deg, ${step.colorLight}, transparent)`,
                        border: `1px solid ${step.color}30`,
                        color: step.color,
                      }}
                      aria-hidden="true"
                    >
                      {step.number}
                    </div>
                  </div>

                  {/* Content card */}
                  <div
                    className="glass rounded-2xl p-8 card-hover mb-2"
                    style={{ borderColor: `${step.color}15` }}
                  >
                    <div className="flex items-start gap-5">
                      {/* Icon */}
                      <div
                        className="w-13 h-13 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ background: step.colorLight }}
                        aria-hidden="true"
                      >
                        <Icon size={22} style={{ color: step.color }} />
                      </div>

                      <div className="flex-1">
                        {/* Badge */}
                        <span
                          className="inline-block text-xs font-semibold px-2.5 py-1 rounded-full mb-3"
                          style={{ background: `${step.color}15`, color: step.color }}
                        >
                          {step.badge}
                        </span>

                        <h3 className="text-lg md:text-xl font-bold mb-3" style={{lineHeight:'1.2', color:'var(--text-primary)'}}>{step.title}</h3>
                        <p className="text-[0.9375rem] leading-relaxed text-balance max-w-sm" style={{ color: 'var(--text-muted)' }}>{step.description}</p>

                        {/* Detail chip */}
                        <div className="inline-flex items-center gap-2 rounded-lg px-3 py-1.5" style={{ background: 'var(--card-hover)' }}>
                          <div
                            className="w-2 h-2 rounded-full animate-pulse"
                            style={{ background: step.color }}
                            aria-hidden="true"
                          />
                          <span className="text-sm font-medium" style={{ color: step.color }}>
                            {step.detail}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Connector arrow */}
                {i < steps.length - 1 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: (i + 1) * 0.15 }}
                    className="flex justify-center md:justify-start md:pl-10 my-4"
                    aria-hidden="true"
                  >
                    <motion.div
                      animate={{ y: [0, 6, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <ArrowDown size={20} style={{ color: 'var(--text-subtle)' }} />
                    </motion.div>
                  </motion.div>
                )}
              </div>
            )
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mt-20"
        >
          <p className="mb-5 text-[1.0625rem]" style={{ color: 'var(--text-subtle)' }}>Ready to experience this yourself?</p>
          <a href="#demo" className="btn-primary inline-flex">
            Try it Live Now
          </a>
        </motion.div>
      </div>
    </section>
  )
}
