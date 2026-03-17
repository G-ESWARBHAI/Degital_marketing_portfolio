import { useRef, useState } from 'react'
import { motion, useInView, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion'

const services = [
  {
    title: 'Brand Identity Design',
    description: 'Complete visual systems that define your brand',
    gradient: 'from-violet-500 to-rose-500',
    glow: 'rgba(139, 92, 246, 0.6)',
    details: [
      'Logo & wordmark design',
      'Color palette & typography guidelines',
      'Brand style guide document',
      'Business cards, letterhead & templates',
      'Social media kit',
    ],
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-8 h-8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 8h20v8H12v-8z" />
        <path d="M12 20h20v8H12v-8z" />
        <path d="M12 32h12v8H12v-8z" />
        <path d="M8 8v32" />
        <path d="M40 8v32" />
      </svg>
    ),
  },
  {
    title: 'Logo Design',
    description: 'Memorable marks that make lasting impressions',
    gradient: 'from-amber-500 to-orange-500',
    glow: 'rgba(245, 158, 11, 0.6)',
    details: [
      '3–5 unique logo concepts',
      'Refinement rounds',
      'Final files (AI, PNG, SVG)',
      'Logo variations (light/dark)',
      'Usage guidelines',
    ],
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-8 h-8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M24 8l4 12h12l-10 7 4 12-10-7-10 7 4-12-10-7h12z" />
      </svg>
    ),
  },
  {
    title: 'Social Media Design',
    description: 'Scroll-stopping content for every platform',
    gradient: 'from-rose-500 to-pink-500',
    glow: 'rgba(244, 63, 94, 0.6)',
    details: [
      'Instagram posts & stories',
      'Facebook & LinkedIn graphics',
      'Pinterest pins',
      'Reels & short-form visuals',
      'Content calendar templates',
    ],
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-8 h-8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="8" y="8" width="32" height="32" rx="4" />
        <path d="M16 16h16" />
        <path d="M16 24h16" />
        <path d="M16 32h10" />
      </svg>
    ),
  },
  {
    title: 'Poster & Marketing Design',
    description: 'Bold visuals that capture attention',
    gradient: 'from-teal-500 to-emerald-500',
    glow: 'rgba(20, 184, 166, 0.6)',
    details: [
      'Event posters & flyers',
      'Banner ads & billboards',
      'Brochures & pamphlets',
      'Email newsletter templates',
      'Print-ready files',
    ],
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-8 h-8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="6" y="6" width="36" height="36" rx="2" />
        <path d="M12 20h24" />
        <path d="M12 28h24" />
        <path d="M12 36h12" />
      </svg>
    ),
  },
  {
    title: 'UI / App Interface Design',
    description: 'Intuitive interfaces users love',
    gradient: 'from-sky-500 to-blue-500',
    glow: 'rgba(14, 165, 233, 0.6)',
    details: [
      'Wireframes & prototypes',
      'Mobile & web UI design',
      'Design system creation',
      'User flow mapping',
      'Developer handoff (Figma)',
    ],
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-8 h-8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="8" y="8" width="14" height="10" rx="1" />
        <rect x="26" y="8" width="14" height="10" rx="1" />
        <rect x="8" y="22" width="14" height="10" rx="1" />
        <rect x="26" y="22" width="14" height="10" rx="1" />
      </svg>
    ),
  },
  {
    title: 'Packaging Design',
    description: 'Products that stand out on the shelf',
    gradient: 'from-indigo-500 to-violet-500',
    glow: 'rgba(99, 102, 241, 0.6)',
    details: [
      'Box & label design',
      'Product packaging concepts',
      'Dieline-ready artwork',
      '3D mockups',
      'Print specifications',
    ],
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-8 h-8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M24 8v32" />
        <path d="M16 8l8 16 8-16" />
        <path d="M8 24v16h32V24" />
        <path d="M16 32h16" />
      </svg>
    ),
  },
]

function ServiceCard({ service, index, size = 'normal', onClick }) {
  const cardRef = useRef(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springConfig = { damping: 25, stiffness: 150 }
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [6, -6]), springConfig)
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-6, 6]), springConfig)

  const isLarge = size === 'large'
  const isWide = size === 'wide'

  return (
    <motion.div
      ref={cardRef}
      onClick={() => onClick?.(service)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick?.(service)}
      className="group relative rounded-2xl overflow-hidden cursor-pointer"
      onMouseMove={(e) => {
        if (!cardRef.current) return
        const rect = cardRef.current.getBoundingClientRect()
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2
        const moveX = (e.clientX - centerX) / rect.width
        const moveY = (e.clientY - centerY) / rect.height
        x.set(moveX)
        y.set(moveY)
      }}
      onMouseLeave={() => {
        x.set(0)
        y.set(0)
      }}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
        perspective: 800,
      }}
    >
      <motion.div
        className={`relative h-full min-h-[200px] md:min-h-[240px] rounded-2xl p-6 md:p-8 flex overflow-hidden ${isWide ? 'flex-row items-center gap-6 md:gap-8' : 'flex-col justify-between'}`}
        style={{
          background: `linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.05) 100%)`,
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.15)',
          boxShadow: `0 8px 32px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.1)`,
        }}
        whileHover={{
          boxShadow: `0 20px 60px rgba(0,0,0,0.3), 0 0 60px -10px ${service.glow}, inset 0 1px 0 rgba(255,255,255,0.15)`,
          scale: 1.02,
        }}
        transition={{ duration: 0.4 }}
      >
        {/* Gradient glow on hover */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse 80% 80% at 50% 0%, ${service.glow} 0%, transparent 60%)`,
          }}
        />

        <div className={`relative z-10 flex-1 ${isWide ? 'flex items-center gap-6 md:gap-8' : ''}`}>
          <motion.div
            className={`${isLarge ? 'w-20 h-20' : 'w-14 h-14'} flex-shrink-0 rounded-2xl bg-gradient-to-br ${service.gradient} flex items-center justify-center text-white shadow-lg`}
            style={{ transform: 'translateZ(20px)' }}
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          >
            {service.icon}
          </motion.div>

          <div>
            <h3 className={`font-bold text-white ${isLarge ? 'text-2xl md:text-3xl' : 'text-lg md:text-xl'} ${!isWide ? 'mt-4 mb-2' : ''}`} style={{ transform: 'translateZ(12px)' }}>
              {service.title}
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed max-w-md" style={{ transform: 'translateZ(8px)' }}>
              {service.description}
            </p>
          </div>
        </div>

        <motion.span
          className={`inline-flex items-center gap-2 text-sm font-medium text-slate-400 group-hover:text-white transition-colors flex-shrink-0 ${!isWide ? 'mt-4' : ''}`}
          style={{ transform: 'translateZ(10px)' }}
        >
          Learn more
          <motion.span animate={{ x: [0, 4, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}>
            →
          </motion.span>
        </motion.span>
      </motion.div>
    </motion.div>
  )
}

function ServiceModal({ service, onClose }) {
  if (!service) return null
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm" />
      <motion.div
        className="relative max-w-lg w-full rounded-2xl overflow-hidden"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'linear-gradient(135deg, rgba(26,26,46,0.98) 0%, rgba(15,15,35,0.98) 100%)',
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: `0 25px 80px rgba(0,0,0,0.5), 0 0 60px -10px ${service.glow}`,
        }}
      >
        <div className="p-6 md:p-8">
          <div className="flex items-start justify-between gap-4 mb-6">
            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${service.gradient} flex items-center justify-center text-white shrink-0`}>
              {service.icon}
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
              aria-label="Close"
            >
              <span className="text-xl">×</span>
            </button>
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">{service.title}</h3>
          <p className="text-slate-400 mb-6">{service.description}</p>
          <div>
            <h4 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-3">What's included</h4>
            <ul className="space-y-2">
              {service.details?.map((item, i) => (
                <motion.li
                  key={item}
                  className="flex items-center gap-2 text-slate-300"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.05 }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-current shrink-0" />
                  {item}
                </motion.li>
              ))}
            </ul>
          </div>
          <motion.a
            href="#contact"
            onClick={onClose}
            className="mt-8 inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white transition-colors"
            style={{
              background: `linear-gradient(135deg, rgba(139, 92, 246, 0.8) 0%, rgba(244, 63, 94, 0.8) 100%)`,
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Get started
            <span>→</span>
          </motion.a>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function ServicesSection() {
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' })
  const [selectedService, setSelectedService] = useState(null)

  return (
    <section
      ref={sectionRef}
      id="services"
      className="relative py-24 md:py-32 overflow-hidden"
    >
      {/* Bold dark gradient background */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            linear-gradient(160deg, #0f0f23 0%, #1a1a2e 25%, #16213e 50%, #1a1a2e 75%, #0f0f23 100%)
          `,
        }}
      />

      {/* Mesh gradient overlay */}
      <div
        className="absolute inset-0 opacity-80"
        style={{
          backgroundImage: `
            radial-gradient(ellipse 80% 50% at 20% 20%, rgba(139, 92, 246, 0.25) 0%, transparent 50%),
            radial-gradient(ellipse 60% 80% at 80% 80%, rgba(244, 63, 94, 0.2) 0%, transparent 50%),
            radial-gradient(ellipse 50% 50% at 50% 50%, rgba(99, 102, 241, 0.1) 0%, transparent 70%)
          `,
        }}
      />

      {/* Animated grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Auto-scrolling marquee strip (decorative) */}
      <div className="absolute top-0 left-0 right-0 h-px overflow-hidden opacity-30">
        <motion.div
          className="flex gap-12 whitespace-nowrap"
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        >
          {[...Array(2)].map((_, i) => (
            <span key={i} className="flex gap-12">
              {['Design', 'Brand', 'Creative', 'Identity', 'Visual', 'Innovation', 'Strategy', 'Impact'].map((word) => (
                <span key={word} className="text-slate-500 text-xs font-medium">
                  {word}
                </span>
              ))}
            </span>
          ))}
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px overflow-hidden opacity-30">
        <motion.div
          className="flex gap-12 whitespace-nowrap"
          animate={{ x: ['-50%', '0%'] }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
        >
          {[...Array(2)].map((_, i) => (
            <span key={i} className="flex gap-12">
              {['Logo', 'Social', 'UI', 'Packaging', 'Poster', 'Marketing', 'Interface', 'Content'].map((word) => (
                <span key={word} className="text-slate-500 text-xs font-medium">
                  {word}
                </span>
              ))}
            </span>
          ))}
        </motion.div>
      </div>

      <div className="relative px-4 md:px-8">
        {/* Header */}
        <div className="mb-16 text-center">
          <motion.h2
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4"
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            What I Can Do{' '}
            <span className="bg-gradient-to-r from-violet-400 via-rose-400 to-amber-400 bg-clip-text text-transparent">
              For You
            </span>
          </motion.h2>
          <motion.p
            className="text-slate-400 text-lg max-w-xl mx-auto"
            initial={{ opacity: 0, y: 15 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Creative design services that help brands stand out.
          </motion.p>
        </div>

        {/* Bento grid - all 6 services visible, no scroll needed */}
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {/* Row 1: 2 large featured cards */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="md:col-span-2"
            >
              <ServiceCard service={services[0]} index={0} size="large" onClick={setSelectedService} />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.15 }}
            >
              <ServiceCard service={services[1]} index={1} onClick={setSelectedService} />
            </motion.div>

            {/* Row 2: 1 small + 2 small */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <ServiceCard service={services[2]} index={2} />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.25 }}
            >
              <ServiceCard service={services[3]} index={3} onClick={setSelectedService} />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <ServiceCard service={services[4]} index={4} onClick={setSelectedService} />
            </motion.div>

            {/* Row 3: 1 card spanning full width for packaging */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.35 }}
              className="md:col-span-3"
            >
              <ServiceCard service={services[5]} index={5} size="wide" onClick={setSelectedService} />
            </motion.div>
          </div>
        </div>

      </div>

      {/* Service detail modal */}
      <AnimatePresence>
        {selectedService && (
          <ServiceModal
            key={selectedService.title}
            service={selectedService}
            onClose={() => setSelectedService(null)}
          />
        )}
      </AnimatePresence>
    </section>
  )
}
