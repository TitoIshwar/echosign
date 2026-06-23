import { motion } from 'framer-motion'
import { Quote, Star } from 'lucide-react'

const testimonials = [
  {
    name: 'Priya Mehta',
    role: 'Deaf Student, IIT Bombay',
    avatar: 'PM',
    avatarColor: '#4F46E5',
    rating: 5,
    quote:
      'EchoSign transformed my experience in lectures. I can now follow along in real time without depending on a note-taker. This is what inclusive education looks like.',
    tag: 'Student',
    tagColor: '#4F46E5',
  },
  {
    name: 'Dr. Rajeev Krishnan',
    role: 'Special Education Teacher, Delhi',
    avatar: 'RK',
    avatarColor: '#06B6D4',
    rating: 5,
    quote:
      'As a teacher with deaf students, I\'ve been looking for a tool like this for years. EchoSign works right in the browser — no setup, no cost. My students love it.',
    tag: 'Educator',
    tagColor: '#06B6D4',
  },
  {
    name: 'Ananya Sharma',
    role: 'Accessibility Advocate, NGO Director',
    avatar: 'AS',
    avatarColor: '#22C55E',
    rating: 5,
    quote:
      'The privacy-first approach makes EchoSign stand apart. For marginalized communities, data trust is critical. EchoSign gets that completely right.',
    tag: 'Advocate',
    tagColor: '#22C55E',
  },
  {
    name: 'Vikram Nair',
    role: 'HR Manager, TCS Bangalore',
    avatar: 'VN',
    avatarColor: '#EC4899',
    rating: 5,
    quote:
      'We integrated EchoSign in our interview process for differently-abled candidates. It\'s enterprise-ready and genuinely makes our workplace more inclusive.',
    tag: 'Employer',
    tagColor: '#EC4899',
  },
  {
    name: 'Kavitha Rao',
    role: 'Parent of a Deaf Child, Chennai',
    avatar: 'KR',
    avatarColor: '#F59E0B',
    rating: 5,
    quote:
      'My son can now communicate with his teachers without me having to be present to translate. EchoSign gave our family a piece of freedom we didn\'t know was possible.',
    tag: 'Parent',
    tagColor: '#F59E0B',
  },
  {
    name: 'Arjun Patel',
    role: 'Software Engineer (Deaf), Pune',
    avatar: 'AP',
    avatarColor: '#8B5CF6',
    rating: 5,
    quote:
      'I\'ve tried so many ISL tools and none of them understood the nuance of Indian Sign Language. EchoSign is the first one that truly feels like it was built for us.',
    tag: 'Professional',
    tagColor: '#8B5CF6',
  },
]

export default function Testimonials() {
  return (
    <section className="section-padding" aria-labelledby="testimonials-heading">
      <div className="container-custom">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7 }}
          className="flex flex-col items-center text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-[#F59E0B]/10 border border-[#F59E0B]/30 rounded-full px-4 py-2 mb-6">
            <Star size={14} className="text-[#F59E0B]" aria-hidden="true" />
            <span className="text-sm font-medium text-[#F59E0B]">Community Voices</span>
          </div>
          <h2 id="testimonials-heading" className="text-3xl md:text-5xl font-bold font-display mb-6 mx-auto max-w-3xl text-center" style={{ color: 'var(--text-primary)', lineHeight: '1.15', letterSpacing: '-0.02em' }}>
            Changing Lives,{' '}
            <span className="gradient-text">One Gesture at a Time</span>
          </h2>
          <p className="max-w-3xl mx-auto text-center text-[1.0625rem] leading-[1.8]" style={{ color: 'var(--text-muted)' }}>
            Hear from students, educators, employers, and advocates who experience EchoSign's impact firsthand.
          </p>
        </motion.div>

        {/* Testimonial grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <div className="testimonial-card h-full flex flex-col" role="article" aria-label={`Testimonial from ${t.name}`}>
                {/* Quote icon */}
                <Quote size={32} className="mb-5 flex-shrink-0" style={{ color: 'var(--text-subtle)' }} aria-hidden="true" />

                {/* Stars */}
                <div className="flex gap-1.5 mb-5" aria-label={`${t.rating} out of 5 stars`}>
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} size={14} className="text-[#F59E0B] fill-[#F59E0B]" aria-hidden="true" />
                  ))}
                </div>

                {/* Quote text */}
                <blockquote className="text-[0.9375rem] leading-[1.8] flex-1 mb-8 italic" style={{ color: 'var(--text-muted)' }}>
                  "{t.quote}"
                </blockquote>

                {/* Author */}
                <div className="flex items-center gap-4 mt-auto">
                  {/* Avatar */}
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                    style={{ background: `${t.avatarColor}30`, border: `2px solid ${t.avatarColor}50` }}
                    aria-hidden="true"
                  >
                    {t.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold mb-0.5" style={{ color: 'var(--text-primary)' }}>{t.name}</div>
                    <div className="text-xs leading-relaxed truncate" style={{ color: 'var(--text-subtle)' }}>{t.role}</div>
                  </div>
                  <span
                    className="text-xs px-2.5 py-1 rounded-full font-medium flex-shrink-0"
                    style={{ background: `${t.tagColor}15`, color: t.tagColor }}
                  >
                    {t.tag}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
