import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Menu, X, Github } from 'lucide-react';

// Wrap Link with motion for animation support on routing links
const MotionLink = motion(Link);

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setMobileOpen(false); };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const navStyle = {
    background: scrolled ? 'rgba(255,255,255,0.85)' : 'transparent',
    backdropFilter: scrolled ? 'blur(20px)' : 'none',
    WebkitBackdropFilter: scrolled ? 'blur(20px)' : 'none',
    borderBottom: scrolled ? '1px solid rgba(108,99,255,0.12)' : '1px solid transparent',
    transition: 'all 0.3s ease',
  };

  const links = [
    { label: 'Home', href: '/' },
    { label: 'Analyze', href: '/analyze' },
  ];

  return (
    <>
      <motion.nav
        style={{ ...navStyle, position: 'sticky', top: 0, zIndex: 100, height: 68 }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex items-center justify-between h-full">

            {/* ── Logo ── */}
            <Link to="/" className="flex items-center gap-2" style={{ textDecoration: 'none' }}>
              <motion.svg
                className="animate-bounce-soft"
                width="28" height="28" viewBox="0 0 24 24"
                fill="#6C63FF" aria-hidden="true"
              >
                <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
              </motion.svg>

              <span
                className="text-xl tracking-tight"
                style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, color: '#0F0E17' }}
              >
                Genre
              </span>
              <span
                className="text-xl tracking-tight gradient-text"
                style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700 }}
              >
                AI
              </span>

              <span style={{
                fontSize: 11,
                fontWeight: 600,
                color: '#6C63FF',
                background: 'rgba(108,99,255,0.10)',
                borderRadius: 9999,
                padding: '2px 8px',
                marginLeft: 4,
              }}>
                Beta
              </span>
            </Link>

            {/* ── Desktop Links ── */}
            <div className="hidden md:flex items-center gap-6">
              {links.map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  style={{
                    fontSize: 14,
                    color: '#6E6D7A',
                    textDecoration: 'none',
                    fontWeight: 500,
                    position: 'relative',
                    transition: 'color 0.2s ease',
                  }}
                  className="nav-link-hover"
                  onMouseEnter={e => { e.currentTarget.style.color = '#0F0E17'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = '#6E6D7A'; }}
                >
                  {link.label}
                </Link>
              ))}

              <a
                href="https://github.com/neeraj214/Music-Genre-Classification-from-Spectrograms"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                style={{ color: '#6E6D7A', transition: 'all 0.2s ease' }}
                onMouseEnter={e => {
                  e.currentTarget.style.color = '#6C63FF';
                  e.currentTarget.style.boxShadow = '0 0 20px rgba(108,99,255,0.3)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.color = '#6E6D7A';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <Github size={20} />
              </a>

              {/* Try Now CTA */}
              <MotionLink
                to="/analyze"
                whileHover={{ scale: 1.05, boxShadow: '0 8px 24px rgba(108,99,255,0.4)' }}
                whileTap={{ scale: 0.95 }}
                style={{
                  background: 'linear-gradient(135deg, #6C63FF, #FF6584)',
                  color: '#fff',
                  fontWeight: 600,
                  fontSize: 14,
                  borderRadius: 9999,
                  padding: '8px 20px',
                  textDecoration: 'none',
                  display: 'inline-block',
                  transition: 'box-shadow 0.2s ease',
                }}
              >
                Try Now
              </MotionLink>
            </div>

            {/* ── Mobile Hamburger ── */}
            <button
              className="md:hidden"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              style={{ color: '#0F0E17', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </motion.nav>

      {/* ── Mobile Full-screen Overlay ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 200,
              background: '#fff',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 32,
            }}
          >
            <button
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
              style={{
                position: 'absolute',
                top: 20,
                right: 20,
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#0F0E17',
              }}
            >
              <X size={28} />
            </button>

            {[...links, { label: 'GitHub', href: 'https://github.com/neeraj214/Music-Genre-Classification-from-Spectrograms', external: true }].map((link) => (
              link.external ? (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMobileOpen(false)}
                  style={{
                    fontSize: 28,
                    fontWeight: 700,
                    color: '#0F0E17',
                    textDecoration: 'none',
                    fontFamily: "'Space Grotesk', sans-serif",
                  }}
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.label}
                  to={link.href}
                  onClick={() => setMobileOpen(false)}
                  style={{
                    fontSize: 28,
                    fontWeight: 700,
                    color: '#0F0E17',
                    textDecoration: 'none',
                    fontFamily: "'Space Grotesk', sans-serif",
                  }}
                >
                  {link.label}
                </Link>
              )
            ))}

            <MotionLink
              to="/analyze"
              onClick={() => setMobileOpen(false)}
              whileTap={{ scale: 0.95 }}
              style={{
                background: 'linear-gradient(135deg, #6C63FF, #FF6584)',
                color: '#fff',
                fontWeight: 700,
                fontSize: 18,
                borderRadius: 9999,
                padding: '14px 40px',
                textDecoration: 'none',
              }}
            >
              Try Now
            </MotionLink>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
