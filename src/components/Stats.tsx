import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { Users, Cpu, Globe, ShieldCheck } from 'lucide-react'

interface StatItem {
  value: string
  numericTarget: number
  suffix: string
  label: string
  sublabel: string
  icon: React.ElementType
  color: string
  gradient: string
}

const stats: StatItem[] = [
  {
    value: '63',
    numericTarget: 63,
    suffix: 'M+',
    label: 'Deaf Individuals in India',
    sublabel: 'Empowered through EchoSign',
    icon: Users,
    color: '#818CF8',
    gradient: 'from-[#4F46E5]/20 to-transparent',
  },
  {
    value: '<50',
    numericTarget: 50,
    suffix: 'ms',
    label: 'Real-Time Recognition',
    sublabel: 'Gesture to text latency',
    icon: Cpu,
    color: '#22D3EE',
    gradient: 'from-[#06B6D4]/20 to-transparent',
  },
  {
    value: '100',
    numericTarget: 100,
    suffix: '%',
    label: 'Browser Based',
    sublabel: 'No installation required',
    icon: Globe,
    color: '#4ADE80',
    gradient: 'from-[#22C55E]/20 to-transparent',
  },
  {
    value: '0',
    numericTarget: 0,
    suffix: '',
    label: 'Privacy First',
    sublabel: 'On-device processing only',
    icon: ShieldCheck,
    color: '#C084FC',
    gradient: 'from-[#A855F7]/20 to-transparent',
  },
]

function AnimatedCounter({ target, suffix, isSpecial }: { target: number; suffix: string; isSpecial?: boolean }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  useEffect(() => {
    if (!inView) return
    if (isSpecial) {
      setCount(target)
      return
    }
    const duration = 2000
    const steps = 60
    const increment = target / steps
    let current = 0
    const timer = setInterval(() => {
      current = Math.min(current + increment, target)
      setCount(Math.round(current))
      if (current >= target) clearInterval(timer)
    }, duration / steps)
    return () => clearInterval(timer)
  }, [inView, target, isSpecial])

  return (
    <span ref={ref}>
      {isSpecial && target === 0 ? (
        <span className="text-5xl md:text-6xl font-black font-display gradient-text">Zero</span>
      ) : (
        <span className="text-5xl md:text-6xl font-black font-display gradient-text">
          {suffix === 'ms' ? '<' : ''}{count}{suffix}
        </span>
      )}
    </span>
  )
}

export default function Stats() {
  return (
    <section className="section-padding relative" aria-labelledby="stats-heading">
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
          <h2 id="stats-heading" className="text-3xl md:text-4xl font-bold font-display mb-6 mx-auto max-w-3xl text-center" style={{lineHeight:'1.15', letterSpacing:'-0.02em', color:'var(--text-primary)'}}>
            The Scale of <span className="gradient-text">Our Mission</span>
          </h2>
          <p className="max-w-3xl mx-auto text-center text-[1.0625rem] leading-[1.8]" style={{ color: 'var(--text-muted)' }}>
            EchoSign is built to create meaningful impact at scale — from individual conversations to classroom-wide accessibility.
          </p>
        </motion.div>

        {/* Stats grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7">
          {stats.map((stat, i) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
              >
                <div
                  className="stat-card card-hover rounded-2xl p-8 h-full flex flex-col"
                  aria-label={`${stat.label}: ${stat.value}${stat.suffix}`}
                >
                  {/* Icon */}
                  <div
                    className={`w-14 h-14 rounded-xl bg-gradient-to-br ${stat.gradient} border flex items-center justify-center mb-6`}
                    style={{ borderColor: 'var(--border-color)' }}
                    aria-hidden="true"
                  >
                    <Icon size={24} style={{ color: stat.color }} />
                  </div>

                  {/* Value */}
                  <div className="mb-3" aria-label={`${stat.numericTarget}${stat.suffix}`}>
                    <AnimatedCounter
                      target={stat.numericTarget}
                      suffix={stat.suffix}
                      isSpecial={stat.suffix === 'ms' || stat.numericTarget === 0}
                    />
                  </div>

                  {/* Label */}
                  <div className="mt-auto">
                    <div className="font-semibold mb-2 text-base" style={{ color: 'var(--text-primary)' }}>{stat.label}</div>
                    <div className="text-sm leading-relaxed" style={{ color: 'var(--text-subtle)' }}>{stat.sublabel}</div>
                  </div>

                  {/* Bottom accent */}
                  <div
                    className="mt-6 h-0.5 rounded-full"
                    style={{ background: `linear-gradient(90deg, ${stat.color}40, transparent)` }}
                    aria-hidden="true"
                  />
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
