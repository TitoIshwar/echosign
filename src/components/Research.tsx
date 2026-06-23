import { motion } from 'framer-motion'
import { BookOpen, CheckCircle, XCircle, ArrowRight, BarChart2 } from 'lucide-react'

const currentGaps = [
  { title: 'Word-Level Recognition Only', detail: 'Most systems detect isolated signs, not continuous sentences.' },
  { title: 'No Indian Language Support', detail: 'International solutions rarely support ISL or Devanagari output.' },
  { title: 'Expensive Hardware Required', detail: 'Many systems require specialized cameras or gloves.' },
  { title: 'Server-Side Processing', detail: 'Cloud-based solutions raise data privacy concerns.' },
  { title: 'No Classroom Integration', detail: 'Existing tools are not designed for educational contexts.' },
  { title: 'Interpreter Dependency', detail: 'Human interpreters remain the primary solution — costly and scarce.' },
]

const echosignSolutions = [
  { title: 'Continuous Conversation Support', detail: 'Supports multi-sign sentence construction in real-time.' },
  { title: 'ISL-Native Design', detail: 'Purpose-built for Indian Sign Language with Indian context.' },
  { title: 'Zero Hardware Required', detail: 'Works with any standard webcam on any modern browser.' },
  { title: '100% On-Device AI', detail: 'Privacy-first: all inference runs locally on your device.' },
  { title: 'Classroom Integration', detail: 'Designed specifically for educational and workplace environments.' },
  { title: 'Unified Accessibility Platform', detail: 'One tool for communication, captioning, and transcription.' },
]

const marketData = [
  { label: 'Dictionary-Based', value: 45, color: '#374151' },
  { label: 'Server-Side AI', value: 30, color: '#4B5563' },
  { label: 'Hardware-Based', value: 20, color: '#6B7280' },
  { label: 'EchoSign Approach', value: 85, color: '#4F46E5' },
]

export default function Research() {
  return (
    <section
      id="research"
      className="section-padding relative"
      aria-labelledby="research-heading"
    >
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
            <BookOpen size={14} className="text-[#22D3EE]" aria-hidden="true" />
            <span className="text-sm font-medium text-[#22D3EE]">Market Research & Gap Analysis</span>
          </div>
          <h2 id="research-heading" className="text-3xl md:text-4xl font-bold font-display mb-6 mx-auto max-w-3xl text-center" style={{ color: 'var(--text-primary)', lineHeight: '1.15', letterSpacing: '-0.02em' }}>
            Why Existing Solutions <span className="gradient-text">Fall Short</span>
          </h2>
          <p className="max-w-4xl mx-auto text-center text-[1.0625rem] leading-[1.8]" style={{ color: 'var(--text-muted)' }}>
            Our research identified critical gaps in existing ISL solutions. EchoSign was designed to bridge every one of them.
          </p>
        </motion.div>

        {/* Comparison table */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7 }}
          className="glass rounded-3xl border overflow-hidden mb-10"
          style={{ borderColor: 'var(--border-color)' }}
        >
          {/* Table header */}
          <div className="grid grid-cols-2" style={{ borderBottom: '1px solid var(--border-color)' }}>
            <div className="px-6 py-4 bg-red-500/5" style={{ borderRight: '1px solid var(--border-color)' }}>
              <div className="flex items-center gap-2">
                <XCircle size={18} className="text-red-400" aria-hidden="true" />
                <span className="font-bold" style={{ color: 'var(--text-primary)' }}>Current Solutions</span>
              </div>
              <p className="text-xs mt-1" style={{ color: 'var(--text-subtle)' }}>What exists today</p>
            </div>
            <div className="px-6 py-4 bg-[#4F46E5]/5">
              <div className="flex items-center gap-2">
                <CheckCircle size={18} className="text-[#4ADE80]" aria-hidden="true" />
                <span className="font-bold" style={{ color: 'var(--text-primary)' }}>EchoSign Platform</span>
              </div>
              <p className="text-xs mt-1" style={{ color: 'var(--text-subtle)' }}>What we've built</p>
            </div>
          </div>

          {/* Table rows */}
          {currentGaps.map((gap, i) => (
            <motion.div
              key={gap.title}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              className={`grid grid-cols-2 ${i % 2 === 0 ? '' : ''}`}
              style={{ borderBottom: '1px solid var(--border-color)' }}
            >
              {/* Gap */}
              <div className="px-6 py-4" style={{ borderRight: '1px solid var(--border-color)' }}>
                <div className="flex items-start gap-2.5">
                  <XCircle size={15} className="text-red-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <div className="text-sm font-semibold mb-0.5" style={{ color: 'var(--text-primary)' }}>{gap.title}</div>
                    <div className="text-xs" style={{ color: 'var(--text-subtle)' }}>{gap.detail}</div>
                  </div>
                </div>
              </div>
              {/* Solution */}
              <div className="px-6 py-4">
                <div className="flex items-start gap-2.5">
                  <CheckCircle size={15} className="text-[#4ADE80] flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <div className="text-sm font-semibold mb-0.5" style={{ color: 'var(--text-primary)' }}>{echosignSolutions[i].title}</div>
                    <div className="text-xs" style={{ color: 'var(--text-subtle)' }}>{echosignSolutions[i].detail}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Approach score bars */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="glass rounded-2xl p-6 border"
          style={{ borderColor: 'var(--border-color)' }}
        >
          <div className="flex items-center gap-2 mb-6">
            <BarChart2 size={18} className="text-[#818CF8]" aria-hidden="true" />
            <h3 className="font-bold" style={{ color: 'var(--text-primary)' }}>Comparative Capability Score</h3>
            <span className="ml-auto text-xs" style={{ color: 'var(--text-subtle)' }}>Based on our gap analysis</span>
          </div>
          <div className="space-y-4">
            {marketData.map((item, i) => (
              <div key={item.label} className="space-y-1.5">
                <div className="flex justify-between text-sm">
                  <span
                    style={{ color: item.label === 'EchoSign Approach' ? 'var(--text-primary)' : 'var(--text-subtle)',
                             fontWeight: item.label === 'EchoSign Approach' ? 600 : 400 }}
                  >
                    {item.label}
                  </span>
                  <span
                    style={{ color: item.label === 'EchoSign Approach' ? '#818CF8' : 'var(--text-subtle)',
                             fontWeight: item.label === 'EchoSign Approach' ? 700 : 400 }}
                  >
                    {item.value}/100
                  </span>
                </div>
                <div className="h-2.5 rounded-full overflow-hidden" style={{ background: 'var(--card-hover)' }}>
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: item.color }}
                    initial={{ width: 0 }}
                    whileInView={{ width: `${item.value}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: i * 0.15, ease: 'easeOut' }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 rounded-xl bg-[#4F46E5]/10 border border-[#4F46E5]/20 flex items-center gap-3">
            <ArrowRight size={16} className="text-[#818CF8] flex-shrink-0" aria-hidden="true" />
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              EchoSign scores <strong className="text-[#818CF8]">85/100</strong> on our composite capability index — the highest among all evaluated approaches,
              particularly excelling in privacy, accessibility, and ISL-specific features.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
