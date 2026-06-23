import { motion } from 'framer-motion'
import { AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react'

const problems = [
  {
    icon: '🚫',
    title: 'Communication Barriers',
    description: 'Deaf individuals face daily communication challenges with hearing peers, teachers, and employers.',
  },
  {
    icon: '🏫',
    title: 'Classroom Accessibility',
    description: 'Students with hearing impairments lack real-time captioning tools in Indian educational settings.',
  },
  {
    icon: '💼',
    title: 'Workplace Inclusion',
    description: 'Professional environments rarely accommodate ISL users, limiting career opportunities and growth.',
  },
  {
    icon: '💰',
    title: 'Interpreter Costs',
    description: 'Human ISL interpreters are expensive, scarce, and unavailable in most rural and semi-urban areas.',
  },
]

const solutions = [
  {
    icon: '⚡',
    title: 'Real-Time AI Translation',
    description: 'EchoSign converts ISL gestures to text and speech instantly using on-device AI.',
  },
  {
    icon: '🎓',
    title: 'Classroom Integration',
    description: 'Seamlessly integrates into any digital learning environment — no hardware required.',
  },
  {
    icon: '🏢',
    title: 'Workplace Accessibility',
    description: 'Enables inclusive meetings and conversations using just a webcam and browser.',
  },
  {
    icon: '🌐',
    title: 'Universal Access',
    description: 'Free, browser-based, and works across all modern devices — democratizing communication.',
  },
]

export default function ProblemSolution() {
  return (
    <section className="section-padding" aria-labelledby="problem-solution-heading">
      <div className="container-custom">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7 }}
          className="flex flex-col items-center text-center mb-16"
        >
          <h2
            id="problem-solution-heading"
            className="text-3xl md:text-4xl font-bold font-display mb-6 mx-auto max-w-3xl text-center"
            style={{ lineHeight: '1.15', letterSpacing: '-0.02em', color: 'var(--text-primary)' }}
          >
            The Problem <span style={{ color: 'var(--text-muted)' }}>&</span>{' '}
            <span className="gradient-text">Our Solution</span>
          </h2>
          <p
            className="max-w-3xl mx-auto text-center text-[1.0625rem] leading-[1.8]"
            style={{ color: 'var(--text-muted)' }}
          >
            63 million deaf and hard-of-hearing individuals in India face communication barriers every day.
            EchoSign is our answer.
          </p>
        </motion.div>

        {/* Split screen */}
        <div className="grid lg:grid-cols-2 gap-8 xl:gap-14">
          {/* Problem Side */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7 }}
          >
            <div
              className="glass rounded-3xl p-10 h-full"
              style={{ border: '1px solid rgba(239,68,68,0.1)' }}
            >
              {/* Header */}
              <div className="flex items-center gap-4 mb-10">
                <div className="w-11 h-11 rounded-xl bg-red-500/10 flex items-center justify-center flex-shrink-0">
                  <AlertCircle size={20} className="text-red-400" aria-hidden="true" />
                </div>
                <div>
                  <div className="text-xs font-medium text-red-400 uppercase tracking-wider mb-0.5">The Challenge</div>
                  <h3 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Current Barriers</h3>
                </div>
              </div>

              {/* Problem items */}
              <div className="space-y-4">
                {problems.map((problem, i) => (
                  <motion.div
                    key={problem.title}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 + 0.2 }}
                    className="flex gap-4 p-5 rounded-2xl transition-colors"
                    style={{ background: 'var(--card-hover)', border: '1px solid var(--border-color)' }}
                  >
                    <span className="text-2xl flex-shrink-0" role="img" aria-hidden="true">{problem.icon}</span>
                     <div>
                       <h4 className="font-semibold mb-1.5" style={{ color: 'var(--text-primary)' }}>{problem.title}</h4>
                       <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{problem.description}</p>
                     </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Arrow connector (visible on lg) */}
          <div className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10" aria-hidden="true">
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="w-12 h-12 rounded-full bg-gradient-to-r from-[#4F46E5] to-[#06B6D4] flex items-center justify-center shadow-lg shadow-indigo-500/30"
            >
              <ArrowRight size={20} className="text-white" />
            </motion.div>
          </div>

          {/* Solution Side */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7 }}
          >
            <div
              className="glass rounded-3xl p-10 h-full"
              style={{ border: '1px solid rgba(79,70,229,0.2)' }}
            >
              {/* Header */}
              <div className="flex items-center gap-4 mb-10">
                <div className="w-11 h-11 rounded-xl bg-[#22C55E]/10 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 size={20} className="text-[#4ADE80]" aria-hidden="true" />
                </div>
                <div>
                  <div className="text-xs font-medium text-[#4ADE80] uppercase tracking-wider mb-0.5">Our Answer</div>
                  <h3 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>EchoSign Platform</h3>
                </div>
              </div>

              {/* Solution items */}
              <div className="space-y-4">
                {solutions.map((solution, i) => (
                  <motion.div
                    key={solution.title}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 + 0.2 }}
                    className="flex gap-4 p-5 rounded-2xl transition-colors"
                    style={{ background: 'var(--card-hover)', border: '1px solid var(--border-color)' }}
                  >
                    <span className="text-2xl flex-shrink-0" role="img" aria-hidden="true">{solution.icon}</span>
                     <div>
                       <h4 className="font-semibold mb-1.5" style={{ color: 'var(--text-primary)' }}>{solution.title}</h4>
                       <p className="text-sm leading-[1.7]" style={{ color: 'var(--text-muted)' }}>{solution.description}</p>
                     </div>
                  </motion.div>
                ))}
              </div>

              {/* CTA */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 }}
                className="mt-8"
              >
                <a href="#demo" className="btn-primary w-full justify-center">
                  Experience EchoSign
                  <ArrowRight size={16} aria-hidden="true" />
                </a>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
