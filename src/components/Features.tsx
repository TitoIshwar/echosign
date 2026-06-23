import { motion } from 'framer-motion'
import {
  Zap, Cpu, FileText, Volume2, BookOpen, Briefcase,
  MessageCircle, Shield, Globe, Wifi, Layers, Sparkles
} from 'lucide-react'

const features = [
  {
    icon: Zap,
    title: 'Real-Time ISL Recognition',
    description: 'Sub-50ms gesture detection using optimized on-device ML models for fluent conversations.',
    variant: 'indigo',
    tag: 'Core',
  },
  {
    icon: Cpu,
    title: 'On-Device AI Processing',
    description: 'All inference runs locally in your browser — no cloud, no latency, no privacy risk.',
    variant: 'cyan',
    tag: 'Privacy',
  },
  {
    icon: FileText,
    title: 'Text Generation',
    description: 'Converts recognized signs into grammatically correct text sentences in real-time.',
    variant: 'green',
    tag: 'NLP',
  },
  {
    icon: Volume2,
    title: 'Speech Synthesis',
    description: 'Text-to-speech output using the Web Speech API — no plugins required.',
    variant: 'purple',
    tag: 'Audio',
  },
  {
    icon: BookOpen,
    title: 'Classroom Captioning',
    description: 'Live transcript generation for inclusive education in schools and universities.',
    variant: 'indigo',
    tag: 'Education',
  },
  {
    icon: Briefcase,
    title: 'Workplace Accessibility',
    description: 'Enables ISL users to participate fully in meetings, presentations, and 1:1s.',
    variant: 'cyan',
    tag: 'Enterprise',
  },
  {
    icon: MessageCircle,
    title: 'Continuous Conversation',
    description: 'Supports flowing multi-sign sentences — not just isolated word recognition.',
    variant: 'green',
    tag: 'Advanced',
  },
  {
    icon: Shield,
    title: 'Privacy Focused',
    description: 'Zero data leaves your device. No accounts, no uploads, no tracking.',
    variant: 'purple',
    tag: 'Security',
  },
  {
    icon: Globe,
    title: 'No Installation Required',
    description: 'Launch EchoSign instantly in any modern browser on any operating system.',
    variant: 'indigo',
    tag: 'Accessible',
  },
]

const variantStyles = {
  indigo: {
    icon: 'feature-icon-indigo',
    tag: 'text-[#818CF8]',
    hover: 'hover:border-[#4F46E5]/30 hover:bg-[#4F46E5]/5',
    glow: 'hover:shadow-[0_8px_32px_rgba(79,70,229,0.15)]',
  },
  cyan: {
    icon: 'feature-icon-cyan',
    tag: 'text-[#22D3EE]',
    hover: 'hover:border-[#06B6D4]/30 hover:bg-[#06B6D4]/5',
    glow: 'hover:shadow-[0_8px_32px_rgba(6,182,212,0.15)]',
  },
  green: {
    icon: 'feature-icon-green',
    tag: 'text-[#4ADE80]',
    hover: 'hover:border-[#22C55E]/30 hover:bg-[#22C55E]/5',
    glow: 'hover:shadow-[0_8px_32px_rgba(34,197,94,0.15)]',
  },
  purple: {
    icon: 'feature-icon-purple',
    tag: 'text-purple-400',
    hover: 'hover:border-purple-500/30 hover:bg-purple-500/5',
    glow: 'hover:shadow-[0_8px_32px_rgba(168,85,247,0.15)]',
  },
}

export default function Features() {
  return (
    <section
      id="features"
      className="section-padding relative"
      aria-labelledby="features-heading"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#4F46E5]/3 to-transparent pointer-events-none" aria-hidden="true" />

      <div className="container-custom">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7 }}
          className="flex flex-col items-center text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-[#4F46E5]/10 border border-[#4F46E5]/30 rounded-full px-4 py-2 mb-6">
            <Sparkles size={14} className="text-[#818CF8]" aria-hidden="true" />
            <span className="text-sm font-medium text-[#818CF8]">Everything you need</span>
          </div>
          <h2 id="features-heading" className="text-3xl md:text-5xl font-bold font-display mb-6 tracking-tight mx-auto max-w-3xl text-center" style={{lineHeight:'1.15', letterSpacing:'-0.02em', color:'var(--text-primary)'}}>
            Powerful Features, <span className="gradient-text">Zero Barriers</span>
          </h2>
          <p className="max-w-3xl mx-auto text-center text-lg leading-[1.8]" style={{ color: 'var(--text-muted)' }}>
            EchoSign is built from the ground up for accessibility, privacy, and real-world performance.
          </p>
        </motion.div>

        {/* Feature grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => {
            const Icon = feature.icon
            const styles = variantStyles[feature.variant as keyof typeof variantStyles]
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: i * 0.07 }}
              >
                <div
                  className={`rounded-2xl p-6 md:p-8 h-full flex flex-col ${styles.hover} ${styles.glow} card-hover transition-all duration-300 cursor-default`}
                  style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)' }}
                  role="article"
                  aria-label={feature.title}
                >
                  {/* Top Row */}
                  <div className="flex items-start justify-between mb-6">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${styles.icon}`}>
                      <Icon size={22} aria-hidden="true" />
                    </div>
                    <span className={`text-[13px] font-semibold tracking-wide ${styles.tag}`}>
                      {feature.tag}
                    </span>
                  </div>

                  <h3 className="text-[1.125rem] font-bold mb-2.5 leading-snug" style={{ color: 'var(--text-primary)' }}>{feature.title}</h3>
                  <p className="text-[0.9375rem] leading-relaxed text-balance flex-1" style={{ color: 'var(--text-muted)' }}>{feature.description}</p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
