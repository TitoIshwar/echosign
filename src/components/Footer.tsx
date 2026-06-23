import { GitFork, Mail } from 'lucide-react'
import Logo from './Logo'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer
      className="relative py-10"
      style={{ borderTop: '1px solid var(--border-color)' }}
      role="contentinfo"
    >
      {/* Top gradient accent */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#4F46E5]/40 to-transparent" aria-hidden="true" />

      <div className="container-custom">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">

          {/* Brand */}
          <a href="#" className="flex items-center" aria-label="EchoSign Home">
            <Logo height={28} textSize="text-lg" />
          </a>

          {/* Copyright */}
          <p className="text-sm order-last sm:order-none" style={{ color: 'var(--text-subtle)' }}>
            © {currentYear} EchoSign · Hackathon Project
          </p>

          {/* Links */}
          <div className="flex items-center gap-2">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all"
              style={{ color: 'var(--text-muted)' }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-primary)'
                ;(e.currentTarget as HTMLAnchorElement).style.background = 'var(--card-hover)'
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-muted)'
                ;(e.currentTarget as HTMLAnchorElement).style.background = 'transparent'
              }}
              aria-label="View EchoSign on GitHub"
            >
              <GitFork size={16} aria-hidden="true" />
              GitHub
            </a>
            <a
              href="mailto:contact@echosign.dev"
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all"
              style={{ color: 'var(--text-muted)' }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-primary)'
                ;(e.currentTarget as HTMLAnchorElement).style.background = 'var(--card-hover)'
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-muted)'
                ;(e.currentTarget as HTMLAnchorElement).style.background = 'transparent'
              }}
              aria-label="Contact the EchoSign team"
            >
              <Mail size={16} aria-hidden="true" />
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
