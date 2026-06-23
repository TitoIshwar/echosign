import { motion } from 'framer-motion'
import { GitFork, Globe2, Code2 } from 'lucide-react'

const teamMembers = [
  {
    name: 'Team Member',
    role: 'Lead Developer & AI Engineer',
    initials: 'TI',
    color: '#4F46E5',
    bio: 'Architecting the AI pipeline and real-time inference engine for ISL recognition.',
    skills: ['Deep Learning', 'Computer Vision', 'React'],
    github: '#',
    linkedin: '#',
  },
  {
    name: 'Team Member',
    role: 'Frontend Engineer',
    initials: 'TM',
    color: '#06B6D4',
    bio: 'Building the accessible, responsive UI and ensuring WCAG compliance across the platform.',
    skills: ['TypeScript', 'Framer Motion', 'Accessibility'],
    github: '#',
    linkedin: '#',
  },
  {
    name: 'Team Member',
    role: 'ML Researcher',
    initials: 'ML',
    color: '#22C55E',
    bio: 'Training and optimizing the ISL gesture classification models for real-time performance.',
    skills: ['TensorFlow.js', 'MediaPipe', 'ISL Research'],
    github: '#',
    linkedin: '#',
  },
  {
    name: 'Team Member',
    role: 'UX Designer',
    initials: 'UX',
    color: '#EC4899',
    bio: 'Designing inclusive, human-centered experiences that work for everyone regardless of ability.',
    skills: ['UI/UX', 'Figma', 'Accessibility'],
    github: '#',
    linkedin: '#',
  },
]

export default function Team() {
  return (
    <section id="team" className="section-padding" aria-labelledby="team-heading">
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
            <Code2 size={14} className="text-[#818CF8]" aria-hidden="true" />
            <span className="text-sm font-medium text-[#818CF8]">Built by Passionate Innovators</span>
          </div>
          <h2
            id="team-heading"
            className="text-3xl md:text-4xl font-bold font-display mb-6 mx-auto max-w-3xl text-center"
            style={{ lineHeight: '1.15', letterSpacing: '-0.02em', color: 'var(--text-primary)' }}
          >
            Meet the <span className="gradient-text">Team</span>
          </h2>
          <p
            className="max-w-3xl mx-auto text-center text-[1.0625rem] leading-[1.8]"
            style={{ color: 'var(--text-muted)' }}
          >
            A multidisciplinary team united by a shared mission — making communication accessible for every person in India.
          </p>
        </motion.div>

        {/* Team grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7">
          {teamMembers.map((member, i) => (
            <motion.div
              key={member.name + i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <div
                className="glass rounded-2xl p-8 text-center card-hover group h-full flex flex-col"
                style={{ borderColor: 'var(--border-color)' }}
                role="article"
                aria-label={`Team member: ${member.name}, ${member.role}`}
              >
                {/* Avatar */}
                <div className="relative mx-auto mb-6">
                  <div
                    className="w-24 h-24 rounded-2xl flex items-center justify-center text-2xl font-black text-white mx-auto transition-transform duration-300 group-hover:scale-105"
                    style={{
                      background: `linear-gradient(135deg, ${member.color}40, ${member.color}15)`,
                      border: `2px solid ${member.color}40`,
                    }}
                    aria-hidden="true"
                  >
                    {member.initials}
                  </div>
                  {/* Online indicator */}
                  <div
                    className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center"
                    style={{
                      background: member.color,
                      border: '2px solid var(--bg-primary)',
                    }}
                    aria-hidden="true"
                  >
                    <div className="w-2 h-2 rounded-full bg-white" />
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1">
                  <h3
                    className="text-base font-bold mb-2"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {member.name}
                  </h3>
                  <p className="text-xs font-semibold mb-4 tracking-wide" style={{ color: member.color }}>
                    {member.role}
                  </p>
                  <p
                    className="text-xs leading-[1.75] mb-6"
                    style={{ color: 'var(--text-subtle)' }}
                  >
                    {member.bio}
                  </p>

                  {/* Skills */}
                  <div className="flex flex-wrap gap-2 justify-center mb-6">
                    {member.skills.map((skill) => (
                      <span
                        key={skill}
                        className="text-[10px] px-2.5 py-1 rounded-md font-medium"
                        style={{ background: `${member.color}12`, color: member.color }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Social links */}
                <div className="flex gap-3 justify-center">
                  <a
                    href={member.github}
                    className="w-9 h-9 rounded-lg flex items-center justify-center transition-all"
                    style={{
                      background: 'var(--card-hover)',
                      color: 'var(--text-subtle)',
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-primary)'
                      ;(e.currentTarget as HTMLAnchorElement).style.background = 'var(--elevated)'
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-subtle)'
                      ;(e.currentTarget as HTMLAnchorElement).style.background = 'var(--card-hover)'
                    }}
                    aria-label={`${member.name}'s GitHub`}
                  >
                    <GitFork size={14} aria-hidden="true" />
                  </a>
                  <a
                    href={member.linkedin}
                    className="w-9 h-9 rounded-lg flex items-center justify-center transition-all"
                    style={{
                      background: 'var(--card-hover)',
                      color: 'var(--text-subtle)',
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-primary)'
                      ;(e.currentTarget as HTMLAnchorElement).style.background = 'var(--elevated)'
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-subtle)'
                      ;(e.currentTarget as HTMLAnchorElement).style.background = 'var(--card-hover)'
                    }}
                    aria-label={`${member.name}'s LinkedIn`}
                  >
                    <Globe2 size={14} aria-hidden="true" />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
