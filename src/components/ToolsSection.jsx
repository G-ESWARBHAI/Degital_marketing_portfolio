import { useRef, useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// Tool icons - brand-style SVGs
const PhotoshopIcon = () => (
  <svg viewBox="0 0 24 24" className="w-full h-full" fill="currentColor">
    <path d="M9.849 2.484h4.302v4.484h3.047V2.484h4.303v13.937h-4.303v-4.484h-3.047v4.484H9.849V2.484z" />
  </svg>
)

const PremiereIcon = () => (
  <svg viewBox="0 0 24 24" className="w-full h-full" fill="currentColor">
    <path d="M2.5 3.5h19v17h-19v-17zm4.5 5v9h2.5V13h1.5l2.5 4.5h3L13.5 13c1.5-.5 2-2 2-3.5 0-2-1.5-3-3-3H7zm2.5 2h2c.5 0 1 .5 1 1s-.5 1-1 1h-2v-2zm7 0h2v1.5h-2v-1.5z" />
  </svg>
)

const AfterEffectsIcon = () => (
  <svg viewBox="0 0 24 24" className="w-full h-full" fill="currentColor">
    <rect x="2" y="2" width="6" height="6" rx="1" />
    <rect x="10" y="2" width="6" height="6" rx="1" />
    <rect x="18" y="2" width="4" height="6" rx="1" />
    <rect x="2" y="10" width="6" height="6" rx="1" />
    <rect x="10" y="10" width="6" height="6" rx="1" />
    <rect x="18" y="10" width="4" height="6" rx="1" />
  </svg>
)

const FigmaIcon = () => (
  <svg viewBox="0 0 24 24" className="w-full h-full" fill="currentColor">
    <path d="M8 24a4 4 0 0 1 4-4h-4v4zm0-8a4 4 0 0 1 4-4h-4v4zm0-8a4 4 0 0 1 4-4h-4v4zm4-4a4 4 0 1 1 0 8h-4V4h4zm0 8a4 4 0 1 1 0 8 4 4 0 0 1 0-8z" />
  </svg>
)

const CanvaIcon = () => (
  <svg viewBox="0 0 24 24" className="w-full h-full" fill="currentColor">
    <path d="M12 2L2 7v10l10 5 10-5V7L12 2zm0 2.18l6.9 3.45L12 11.09 5.1 7.63 12 4.18zM4 8.82l7 3.5v7.36l-7-3.5V8.82zm9 10.86v-7.36l7-3.5v7.36l-7 3.5z" />
  </svg>
)

const tools = [
  { name: 'Photoshop', category: 'Design', Icon: PhotoshopIcon, color: '#31A8FF', glow: 'rgba(49, 168, 255, 0.5)' },
  { name: 'Premiere Pro', category: 'Video Editing', Icon: PremiereIcon, color: '#EA77FF', glow: 'rgba(234, 119, 255, 0.5)' },
  { name: 'After Effects', category: 'Motion', Icon: AfterEffectsIcon, color: '#9999FF', glow: 'rgba(153, 153, 255, 0.5)' },
  { name: 'Figma', category: 'UI/UX Design', Icon: FigmaIcon, color: '#F24E1E', glow: 'rgba(242, 78, 30, 0.5)' },
  { name: 'Canva', category: 'Creative Tools', Icon: CanvaIcon, color: '#00C4CC', glow: 'rgba(0, 196, 204, 0.5)' },
]

export default function ToolsSection() {
  const [activeIndex, setActiveIndex] = useState(2) // Start with middle element centered
  const [isDragging, setIsDragging] = useState(false)

  // Drag handling
  const handleDragEnd = (event, info) => {
    setIsDragging(false)
    const threshold = 50 // Minimum swipe distance in px

    if (info.offset.x < -threshold && activeIndex < tools.length - 1) {
      setActiveIndex(activeIndex + 1)
    } else if (info.offset.x > threshold && activeIndex > 0) {
      setActiveIndex(activeIndex - 1)
    }
  }

  // Auto-scroll effect
  useEffect(() => {
    if (isDragging) return // Pause auto-scroll while user is dragging

    const interval = setInterval(() => {
      setActiveIndex((current) => {
        // If at the end, circle back to the beginning
        return current === tools.length - 1 ? 0 : current + 1
      })
    }, 3000) // Change tool every 3 seconds

    return () => clearInterval(interval)
  }, [isDragging])

  return (
    <section className="relative py-24 md:py-32 overflow-hidden bg-slate-950">
      {/* Premium Dark Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black" />
      <div
        className="absolute inset-0 opacity-20 mix-blend-screen"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
        }}
      />

      {/* Floating background glowing orbs */}
      <motion.div
        className="absolute top-[10%] left-[5%] w-72 h-72 rounded-full bg-violet-600/20 blur-[100px]"
        animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.7, 0.4], x: [0, 50, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-[20%] right-[10%] w-96 h-96 rounded-full bg-teal-600/20 blur-[120px]"
        animate={{ scale: [1.2, 1, 1.2], opacity: [0.4, 0.7, 0.4], y: [0, -50, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      />

      <div className="relative max-w-[100rem] mx-auto flex flex-col items-center">

        {/* Section Header */}
        <div className="text-center px-4 mb-12 md:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-sm font-bold tracking-[0.2em] text-violet-400 uppercase mb-2 block -mt-10 drop-shadow-md">
              Creative Toolkit
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
              Tools I <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-teal-400 bg-clip-text text-transparent">Master</span>
            </h2>
            <p className="mt-4 -mb-10 text-slate-400 max-w-xl mx-auto text-lg leading-relaxed">
              The creative software that powers my design workflow and brings bold ideas to life with precision and style.
            </p>
          </motion.div>
        </div>

        {/* Horizontal Carousel Area */}
        <div className="relative w-full h-[450px] md:h-[550px] flex items-center justify-center pt-8">

          <div className="absolute inset-0 flex items-center justify-center perspective-1000">
            {tools.map((tool, index) => {
              const distance = index - activeIndex
              // Determine card state based on distance from center active card
              const isActive = distance === 0

              const baseOffset = 220 // Gap between cards in pixels
              const scale = Math.max(1 - Math.abs(distance) * 0.2, 0.6)
              const opacity = Math.max(1 - Math.abs(distance) * 0.4, 0.1)
              const zIndex = tools.length - Math.abs(distance)

              return (
                <motion.div
                  key={tool.name}
                  className="absolute cursor-grab active:cursor-grabbing"
                  style={{
                    zIndex,
                  }}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.2}
                  onDragStart={() => setIsDragging(true)}
                  onDragEnd={handleDragEnd}
                  onClick={() => {
                    if (!isDragging && !isActive) {
                      setActiveIndex(index)
                    }
                  }}
                  animate={{
                    x: distance * baseOffset * (window.innerWidth < 768 ? 0.8 : 1),
                    scale,
                    opacity,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                    mass: 0.8
                  }}
                >
                  <motion.div
                    className="relative w-[260px] h-[340px] md:w-[320px] md:h-[420px] rounded-[2rem] overflow-hidden backdrop-blur-xl"
                    style={{
                      background: 'linear-gradient(145deg, rgba(30,41,59,0.7), rgba(15,23,42,0.8))',
                      boxShadow: isActive
                        ? `0 30px 60px -15px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.1), 0 0 40px -10px ${tool.glow}`
                        : '0 10px 15px -3px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.05)',
                    }}
                    whileHover={isActive ? { y: -10, transition: { duration: 0.2 } } : {}}
                  >
                    {/* Active Soft Glow Background Inside Card */}
                    <div
                      className="absolute inset-0 transition-opacity duration-500 pointer-events-none"
                      style={{
                        background: `radial-gradient(ellipse at 50% 0%, ${tool.glow} 0%, transparent 70%)`,
                        opacity: isActive ? 0.6 : 0,
                      }}
                    />

                    {/* Content inside card */}
                    <div className="relative h-full flex flex-col items-center justify-start pt-16 z-10 transition-colors duration-500">

                      {/* Icon */}
                      <motion.div
                        className="w-28 h-28 md:w-36 md:h-36 flex items-center justify-center mb-[4.5rem]"
                        style={{ color: tool.color }}
                        animate={isActive ? {
                          scale: 1.15,
                          filter: `drop-shadow(0 20px 30px ${tool.glow})`,
                        } : {
                          scale: 1,
                          filter: `drop-shadow(0 4px 6px rgba(0,0,0,0.05))`,
                        }}
                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                      >
                        <div className="relative w-full h-full flex items-center justify-center">
                          <tool.Icon />
                        </div>
                      </motion.div>

                      {/* Text area with subtle dark gradient contrast on active */}
                      <div className="absolute bottom-0 left-0 w-full px-8 py-8 text-center flex flex-col items-center bg-gradient-to-t from-black/60 to-transparent">
                        <h3 className="font-bold text-2xl md:text-3xl tracking-wide text-white mb-2 drop-shadow-md">
                          {tool.name}
                        </h3>
                        <span
                          className="font-bold text-xs tracking-[0.2em] uppercase px-4 py-1.5 rounded-full text-slate-300 bg-white/10 backdrop-blur-md shadow-sm border border-white/10"
                        >
                          {tool.category}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )
            })}
          </div>

        </div>

        {/* Carousel Indicators */}
        <div className="flex justify-center gap-3 mt-3 -mb-10">
          {tools.map((_, idx) => (
            <button
              key={idx}
              className="relative w-12 h-2 rounded-full overflow-hidden bg-slate-800 transition-colors hover:bg-slate-700 focus:outline-none"
              onClick={() => setActiveIndex(idx)}
            >
              <motion.div
                className="absolute inset-y-0 left-0 bg-violet-400 w-full origin-left"
                initial={false}
                animate={{
                  scaleX: activeIndex === idx ? 1 : 0,
                  opacity: activeIndex === idx ? 1 : 0
                }}
                transition={{ duration: 0.3 }}
                style={{ originX: 0 }}
              />
            </button>
          ))}
        </div>

      </div>
    </section>
  )
}
