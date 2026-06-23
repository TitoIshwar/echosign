import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Sun, Moon } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import Logo from './Logo'

interface NavbarProps {
  scrolled: boolean
}

const navLinks = [
  { href: '#', label: 'Home' },
  { href: '#demo', label: 'Recognition' },
]

export default function Navbar({ scrolled }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { theme, toggleTheme } = useTheme()

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'glass-strong shadow-lg' : 'bg-transparent'
        }`}
        style={scrolled ? { boxShadow: '0 4px 24px var(--shadow-color)' } : {}}
        role="banner"
      >
        <div className="container-custom">
          <div className="flex items-center justify-between h-18 md:h-20">
            {/* Logo */}
            <a href="#" className="flex items-center group" aria-label="EchoSign Home">
              <Logo height={36} />
            </a>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-1.5" aria-label="Main navigation">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 tracking-wide"
                  style={{ color: 'var(--text-muted)' }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-primary)'
                    ;(e.currentTarget as HTMLAnchorElement).style.background = 'var(--card-hover)'
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-muted)'
                    ;(e.currentTarget as HTMLAnchorElement).style.background = 'transparent'
                  }}
                >
                  {link.label}
                </a>
              ))}
            </nav>

            {/* Desktop: CTA + Theme Toggle */}
            <div className="hidden md:flex items-center gap-3">
              {/* Theme toggle */}
              <button
                className="theme-toggle"
                onClick={toggleTheme}
                aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                <AnimatePresence mode="wait" initial={false}>
                  {theme === 'dark' ? (
                    <motion.span
                      key="sun"
                      initial={{ opacity: 0, rotate: -30, scale: 0.7 }}
                      animate={{ opacity: 1, rotate: 0, scale: 1 }}
                      exit={{ opacity: 0, rotate: 30, scale: 0.7 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Sun size={18} aria-hidden="true" />
                    </motion.span>
                  ) : (
                    <motion.span
                      key="moon"
                      initial={{ opacity: 0, rotate: 30, scale: 0.7 }}
                      animate={{ opacity: 1, rotate: 0, scale: 1 }}
                      exit={{ opacity: 0, rotate: -30, scale: 0.7 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Moon size={18} aria-hidden="true" />
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </div>

            {/* Mobile: Theme toggle + menu button */}
            <div className="md:hidden flex items-center gap-2">
              <button
                className="theme-toggle"
                onClick={toggleTheme}
                aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                <AnimatePresence mode="wait" initial={false}>
                  {theme === 'dark' ? (
                    <motion.span
                      key="sun-m"
                      initial={{ opacity: 0, rotate: -30, scale: 0.7 }}
                      animate={{ opacity: 1, rotate: 0, scale: 1 }}
                      exit={{ opacity: 0, rotate: 30, scale: 0.7 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Sun size={17} aria-hidden="true" />
                    </motion.span>
                  ) : (
                    <motion.span
                      key="moon-m"
                      initial={{ opacity: 0, rotate: 30, scale: 0.7 }}
                      animate={{ opacity: 1, rotate: 0, scale: 1 }}
                      exit={{ opacity: 0, rotate: -30, scale: 0.7 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Moon size={17} aria-hidden="true" />
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>

              <button
                className="p-2 rounded-lg transition-colors"
                style={{ color: 'var(--text-muted)' }}
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-expanded={mobileOpen}
                aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
              >
                {mobileOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed top-18 md:top-20 left-0 right-0 z-40 glass-strong p-6"
            style={{ borderBottom: '1px solid var(--border-color)' }}
            role="navigation"
            aria-label="Mobile navigation"
          >
            <div className="flex flex-col gap-1.5">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="px-4 py-3.5 text-sm font-medium rounded-lg transition-all"
                  style={{ color: 'var(--text-muted)' }}
                  onClick={() => setMobileOpen(false)}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-primary)'
                    ;(e.currentTarget as HTMLAnchorElement).style.background = 'var(--card-hover)'
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-muted)'
                    ;(e.currentTarget as HTMLAnchorElement).style.background = 'transparent'
                  }}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
