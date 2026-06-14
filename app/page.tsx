'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Image from 'next/image'

gsap.registerPlugin(ScrollTrigger)

const products = [
  {
    name: 'CHARCUTERIE CUPS',
    price: '$15+',
    tag: 'Perfect for events',
    desc: 'Individual cups filled with premium selections.',
  },
  {
    name: 'SIGNATURE BOARDS',
    price: '$85+',
    tag: 'Best seller',
    desc: 'Live-edge olive wood boards styled to perfection.',
  },
  {
    name: 'GRAZING TABLES',
    price: '$270+',
    tag: 'Full experience',
    desc: 'An abundant spread for gatherings of all sizes.',
  },
]

const overlays = [
  { at: 0.15, end: 0.25, text: 'GATHERED WITH CARE' },
  { at: 0.40, end: 0.50, text: 'ABUNDANCE, BY HAND' },
  { at: 0.70, end: 0.80, text: 'A TABLE SET WITH INTENTION' },
  { at: 0.90, end: 1.00, text: 'BEGIN THE GATHERING' },
]

export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const heroRef = useRef<HTMLDivElement>(null)
  const navRef = useRef<HTMLElement>(null)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [navScrolled, setNavScrolled] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    const hero = heroRef.current
    if (!video || !hero) return

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: hero,
        start: 'top top',
        end: 'bottom bottom',
        onUpdate: (self) => {
          const progress = self.progress
          setScrollProgress(progress)
          if (video.duration) {
            video.currentTime = video.duration * progress
          }
        },
      })
    })

    const handleScroll = () => {
      setNavScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)

    return () => {
      ctx.revert()
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const getOverlayOpacity = (at: number, end: number) => {
    const fadeIn = at
    const fadeOut = end
    const midStart = at + (end - at) * 0.2
    const midEnd = end - (end - at) * 0.2

    if (scrollProgress < fadeIn) return 0
    if (scrollProgress < midStart) return (scrollProgress - fadeIn) / (midStart - fadeIn)
    if (scrollProgress < midEnd) return 1
    if (scrollProgress < fadeOut) return 1 - (scrollProgress - midEnd) / (fadeOut - midEnd)
    return 0
  }

  return (
    <main style={{ backgroundColor: 'var(--cream)' }}>
      {/* NAVBAR */}
      <nav
        ref={navRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          padding: '1.5rem 2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: navScrolled ? 'rgba(245,240,232,0.85)' : 'transparent',
          backdropFilter: navScrolled ? 'blur(12px)' : 'none',
          transition: 'all 0.4s ease',
        }}
      >
        <img src="/logo.svg" alt="Grazing Harmony" style={{ height: '48px' }} />
        <a
          href="#collection"
          style={{
            fontFamily: 'var(--font-inter)',
            fontSize: '0.75rem',
            letterSpacing: '0.2em',
            color: 'var(--burgundy)',
            textDecoration: 'none',
            borderBottom: '1px solid var(--burgundy)',
            paddingBottom: '2px',
          }}
        >
          SHOP
        </a>
      </nav>

      {/* HERO */}
      <div
        ref={heroRef}
        style={{ height: '400vh', position: 'relative' }}
      >
        <div
          style={{
            position: 'sticky',
            top: 0,
            height: '100vh',
            overflow: 'hidden',
            backgroundColor: 'var(--cream)',
          }}
        >
          <video
            ref={videoRef}
            src="/hero.mp4"
            muted
            playsInline
            preload="auto"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />

          {/* TEXT OVERLAYS */}
          {overlays.map((o, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: getOverlayOpacity(o.at, o.end),
                transition: 'opacity 0.1s',
                pointerEvents: 'none',
              }}
            >
              <h1
                style={{
                  fontFamily: 'var(--font-cormorant)',
                  fontSize: 'clamp(2rem, 6vw, 5rem)',
                  fontWeight: 300,
                  letterSpacing: '0.15em',
                  color: 'var(--charcoal)',
                  textAlign: 'center',
                  textShadow: '0 2px 20px rgba(245,240,232,0.8)',
                  padding: '0 2rem',
                }}
              >
                {o.text}
              </h1>
            </div>
          ))}
        </div>
      </div>

      {/* PRODUCTS */}
      <section
        id="collection"
        style={{
          backgroundColor: 'var(--cream)',
          padding: '6rem 2rem',
          textAlign: 'center',
        }}
      >
        <p style={{ fontSize: '0.7rem', letterSpacing: '0.3em', color: 'var(--gold)', marginBottom: '1rem' }}>
          THE COLLECTION
        </p>
        <h2
          style={{
            fontFamily: 'var(--font-cormorant)',
            fontSize: 'clamp(2rem, 4vw, 3.5rem)',
            fontWeight: 300,
            color: 'var(--charcoal)',
            marginBottom: '4rem',
          }}
        >
          Crafted for Every Gathering
        </h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '2rem',
            maxWidth: '1100px',
            margin: '0 auto',
          }}
        >
          {products.map((p, i) => (
            <div
              key={i}
              style={{
                backgroundColor: 'rgba(255,255,255,0.5)',
                border: '1px solid rgba(107,39,55,0.15)',
                borderRadius: '4px',
                padding: '2.5rem 2rem',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget
                el.style.transform = 'scale(1.02)'
                el.style.boxShadow = '0 8px 40px rgba(107,39,55,0.15)'
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget
                el.style.transform = 'scale(1)'
                el.style.boxShadow = 'none'
              }}
            >
              <span
                style={{
                  display: 'inline-block',
                  fontSize: '0.65rem',
                  letterSpacing: '0.2em',
                  color: 'var(--gold)',
                  backgroundColor: 'rgba(212,165,116,0.1)',
                  padding: '4px 12px',
                  borderRadius: '20px',
                  marginBottom: '1.5rem',
                }}
              >
                {p.tag}
              </span>
              <h3
                style={{
                  fontFamily: 'var(--font-cormorant)',
                  fontSize: '1.5rem',
                  fontWeight: 400,
                  letterSpacing: '0.1em',
                  color: 'var(--burgundy)',
                  marginBottom: '0.75rem',
                }}
              >
                {p.name}
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--charcoal)', opacity: 0.7, marginBottom: '1.5rem', lineHeight: 1.6 }}>
                {p.desc}
              </p>
              <p
                style={{
                  fontFamily: 'var(--font-cormorant)',
                  fontSize: '1.75rem',
                  color: 'var(--charcoal)',
                }}
              >
                {p.price}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer
        style={{
          backgroundColor: 'var(--cream)',
          borderTop: '1px solid rgba(107,39,55,0.1)',
          padding: '3rem 2rem',
          textAlign: 'center',
        }}
      >
        <img src="/logo.svg" alt="Grazing Harmony" style={{ height: '40px', marginBottom: '1.5rem' }} />
        <p style={{ fontSize: '0.7rem', letterSpacing: '0.2em', color: 'var(--charcoal)', opacity: 0.5 }}>
          © 2026 GRAZING HARMONY
        </p>
      </footer>
    </main>
  )
}
