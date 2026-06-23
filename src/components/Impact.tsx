import { motion } from 'framer-motion'
import { GraduationCap, Briefcase, Accessibility, Heart, TrendingUp, Users } from 'lucide-react'

const impacts = [
  {
    icon: GraduationCap,
    title: 'Education',
    stat: '8.5M',
    statLabel: 'deaf students in India',
    description:
      'EchoSign enables real-time classroom captioning, helping deaf students follow lectures, participate in discussions, and access equitable education.',
    color: '#4F46E5',
    gradient: 'from-[#4F46E5]/20 to-transparent',
    examples: ['Inclusive classrooms', 'Live lecture captioning', 'Student participation'],
  },
  {
    icon: Briefcase,
    title: 'Employment',
    stat: '76%',
    statLabel: 'unemployment among deaf',
    description:
      'Professional accessibility tools enable ISL users to participate in meetings, interviews, and workplace communication without interpreters.',
    color: '#06B6D4',
    gradient: 'from-[#06B6D4]/20 to-transparent',
    examples: ['Meeting accessibility', 'Interview support', 'Workplace inclusion'],
  },
  {
    icon: Accessibility,
    title: 'Accessibility',
    stat: '100%',
    statLabel: 'browser-based, no install',
    description:
      'Universal design that works on any device, any browser — removing financial and technical barriers to communication support.',
    color: '#22C55E',
    gradient: 'from-[#22C55E]/20 to-transparent',
    examples: ['Device agnostic', 'Free access', 'Low bandwidth'],
  },
  {
    icon: Heart,
    title: 'Social Inclusion',
    stat: '63M+',
    statLabel: 'lives impacted',
    description:
      'Breaking down communication barriers in healthcare, public services, and everyday social interactions for millions of ISL users.',
    color: '#EC4899',
    gradient: 'from-[#EC4899]/20 to-transparent',
    examples: ['Healthcare access', 'Public services', 'Community connection'],
  },
]

export default function Impact() {
  return (
    <section
      id="impact"
      className="section-padding relative"
      aria-labelledby="impact-heading"
    >
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'var(--elevated)' }} aria-hidden="true" />

      <div className="container-custom relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7 }}
          className="flex flex-col items-center text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-[#EC4899]/10 border border-[#EC4899]/30 rounded-full px-4 py-2 mb-6">
            <Heart size={14} className="text-[#EC4899]" aria-hidden="true" />
            <span className="text-sm font-medium text-[#EC4899]">Social Mission</span>
          </div>
          <h2 id="impact-heading" className="text-3xl md:text-4xl font-bold font-display mb-6 mx-auto max-w-3xl text-center" style={{ color: 'var(--text-primary)', lineHeight: '1.15', letterSpacing: '-0.02em' }}>
            Technology That Creates <span className="gradient-text">Equal Opportunities</span>
          </h2>
          <p className="max-w-3xl mx-auto text-center text-[1.0625rem] leading-[1.8]" style={{ color: 'var(--text-muted)' }}>
            EchoSign isn't just software — it's a movement to ensure communication is a right, not a privilege.
          </p>
        </motion.div>

        {/* Impact grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {impacts.map((impact, i) => {
            const Icon = impact.icon
            return (
              <motion.div
                key={impact.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.6, delay: i * 0.12 }}
              >
                <div
                  className="glass rounded-2xl p-6 h-full card-hover border"
                  style={{ '--hover-border': `${impact.color}30`, borderColor: 'var(--border-color)' } as React.CSSProperties}
                  role="article"
                  aria-label={`${impact.title} impact`}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-5">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-12 h-12 rounded-xl bg-gradient-to-br ${impact.gradient} flex items-center justify-center`}
                        aria-hidden="true"
                      >
                        <Icon size={22} style={{ color: impact.color }} />
                      </div>
                      <div>
                        <div className="text-xs font-medium uppercase tracking-wider mb-0.5" style={{ color: 'var(--text-subtle)' }}>
                          {impact.title}
                        </div>
                        <div className="text-2xl font-black" style={{ color: impact.color }}>
                          {impact.stat}
                        </div>
                        <div className="text-xs" style={{ color: 'var(--text-subtle)' }}>{impact.statLabel}</div>
                      </div>
                    </div>
                    <TrendingUp size={18} style={{ color: impact.color }} className="opacity-40" aria-hidden="true" />
                  </div>

                  <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-muted)' }}>{impact.description}</p>

                  {/* Examples */}
                  <div className="flex flex-wrap gap-2">
                    {impact.examples.map((ex) => (
                      <span
                        key={ex}
                        className="text-xs px-2.5 py-1 rounded-lg font-medium"
                        style={{
                          background: `${impact.color}12`,
                          color: impact.color,
                          border: `1px solid ${impact.color}25`,
                        }}
                      >
                        {ex}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Bottom quote */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-12 text-center"
        >
          <div className="glass rounded-2xl p-8 border max-w-3xl mx-auto" style={{ borderColor: 'var(--border-color)' }}>
            <div className="flex items-center justify-center gap-2 mb-4">
              <Users size={20} className="text-[#818CF8]" aria-hidden="true" />
            </div>
            <blockquote className="text-xl md:text-2xl font-semibold mb-3 italic" style={{ color: 'var(--text-primary)' }}>
              "Breaking Communication Barriers Through AI"
            </blockquote>
            <p style={{ color: 'var(--text-subtle)' }}>
              Every line of code in EchoSign is written with one goal: to give voice to every gesture.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
