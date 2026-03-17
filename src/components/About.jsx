import { useRef, useEffect, useState } from 'react'
import { motion, useInView, useMotionValue, useSpring, useTransform, useScroll } from 'framer-motion'
import aboutImg from '../assets/about.jpeg'

// Animated counter component
function AnimatedCounter({ value, suffix = '' }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })
  const count = useMotionValue(0)
  const spring = useSpring(count, { damping: 50, stiffness: 75 })
  const rounded = useTransform(spring, (latest) => Math.round(latest))
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    if (isInView) {
      count.set(value)
    }
  }, [isInView, value, count])

  useEffect(() => {
    const unsubscribe = rounded.on('change', (v) => setDisplayValue(v))
    return () => unsubscribe()
  }, [rounded])

  return <span ref={ref}>{displayValue}{suffix}</span>
}

// Tool icons - simplified brand-style
const PhotoshopIcon = () => (
  <svg viewBox="0 0 24 24" className="w-full h-full" fill="currentColor">
    <path d="M9 3h6v2h-6V3zm0 4h6v10H9V7zm-6 0h4v4H3V7zm0 6h4v4H3v-4z" />
  </svg>
)

const IllustratorIcon = () => (
  <svg viewBox="0 0 24 24" className="w-full h-full" fill="currentColor">
    <path d="M4 4h4v16H4V4zm6 0h4v4h4v4h-4v8h-4V4zm4 6h4v4h-4v-4z" />
  </svg>
)

const FigmaIcon = () => (
  <svg viewBox="0 0 24 24" className="w-full h-full" fill="currentColor">
    <path d="M8 2h4v8H8V2zm0 8h4v4H8v-4zm0 8h4v4H8v-4zm4-12h4v4h-4V6zm0 8h4v4h-4v-4z" />
  </svg>
)

const AfterEffectsIcon = () => (
  <svg viewBox="0 0 24 24" className="w-full h-full" fill="currentColor">
    <rect x="2" y="2" width="6" height="6" rx="1" />
    <rect x="10" y="2" width="6" height="6" rx="1" />
    <rect x="18" y="2" width="4" height="6" rx="1" />
    <rect x="2" y="10" width="6" height="6" rx="1" />
    <rect x="10" y="10" width="6" height="6" rx="1" />
  </svg>
)

// Floating design icons
const PenToolIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full">
    <path d="M12 19l7-7 3 3-7 7-3-3z" />
    <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
    <path d="M2 2l7.586 7.586" />
    <circle cx="11" cy="11" r="2" />
  </svg>
)

const PaletteIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full">
    <circle cx="13.5" cy="6.5" r="0.5" />
    <circle cx="17.5" cy="10.5" r="0.5" />
    <circle cx="8.5" cy="7.5" r="0.5" />
    <circle cx="6.5" cy="12.5" r="0.5" />
    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.648 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668c1.086 0 1.867-.938 1.867-2.063 0-.437-.18-.835-.438-1.125-.29-.29-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668C13.613 9 16 6.613 16 3.5 16 2.47 14.03 2 12 2z" />
  </svg>
)

const TypographyIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full">
    <path d="M4 4h16v2h-7v12h-2V6H4V4z" />
  </svg>
)

const cardStyle = 'bg-white/95 backdrop-blur-sm rounded-2xl border border-white/80 shadow-[0_8px_32px_rgba(0,0,0,0.08)] hover:shadow-[0_16px_48px_rgba(0,0,0,0.12)] transition-all duration-300'

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1 },
  }),
}

export default function About() {
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })

  const tools = [
    { name: 'Photoshop', Icon: PhotoshopIcon, color: 'text-[#31A8FF]', bg: 'bg-[#31A8FF]/10' },
    { name: 'Illustrator', Icon: IllustratorIcon, color: 'text-[#FF9A00]', bg: 'bg-[#FF9A00]/10' },
    { name: 'Figma', Icon: FigmaIcon, color: 'text-[#F24E1E]', bg: 'bg-[#F24E1E]/10' },
    { name: 'After Effects', Icon: AfterEffectsIcon, color: 'text-[#9999FF]', bg: 'bg-[#9999FF]/10' },
  ]

  const philosophy = [
    {
      title: 'Creativity',
      desc: 'Designing unique visual experiences',
      icon: '✨',
      gradient: 'from-violet-500 to-rose-500',
    },
    {
      title: 'Strategy',
      desc: 'Every design solves a problem',
      icon: '🎯',
      gradient: 'from-teal-500 to-emerald-500',
    },
    {
      title: 'Simplicity',
      desc: 'Clean design communicates better',
      icon: '◯',
      gradient: 'from-amber-500 to-orange-500',
    },
  ]

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen w-full overflow-hidden bg-slate-50 py-20 md:py-32 px-4 md:px-8"
    >
      {/* Soft gradient background blobs */}
      <motion.div
        className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
      >
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-violet-400/10 blur-3xl mix-blend-multiply" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-rose-400/10 blur-3xl mix-blend-multiply" />
        <div className="absolute top-[30%] left-[60%] w-[30%] h-[30%] rounded-full bg-amber-400/10 blur-3xl mix-blend-multiply" />
      </motion.div>

      {/* Grid background */}
      <div
        className="absolute inset-0 opacity-40 mix-blend-overlay"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Subtle depth vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-50/80 pointer-events-none" />

      {/* Floating design icons */}
      <motion.div
        className="absolute left-[5%] top-[15%] w-10 h-10 hidden md:flex items-center justify-center text-sky-500/60"
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div className={`w-10 h-10 rounded-xl ${cardStyle} flex items-center justify-center p-2`}>
          <PenToolIcon />
        </div>
      </motion.div>
      <motion.div
        className="absolute right-[8%] top-[20%] w-9 h-9 hidden md:flex items-center justify-center text-rose-500/60"
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
      >
        <div className={`w-9 h-9 rounded-lg ${cardStyle} flex items-center justify-center p-1.5`}>
          <PaletteIcon />
        </div>
      </motion.div>
      <motion.div
        className="absolute right-[5%] bottom-[25%] w-8 h-8 hidden lg:flex items-center justify-center text-violet-500/60"
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      >
        <div className={`w-8 h-8 rounded-lg ${cardStyle} flex items-center justify-center p-1.5`}>
          <TypographyIcon />
        </div>
      </motion.div>

      <div className="relative max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left: Designer photo with 3D tilt */}
          <motion.div
            className="relative order-2 md:order-1 flex justify-center md:justify-start"
            initial={{ opacity: 0, x: -60, filter: 'blur(10px)' }}
            whileInView={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, type: "spring", bounce: 0.3 }}
          >
            <motion.div
              className="relative w-72 h-80 md:w-80 md:h-[28rem] lg:w-96 lg:h-[32rem]"
              animate={{ y: [-10, 10, -10] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            >
              <motion.div
                className="absolute inset-0 rounded-[2rem] overflow-hidden bg-slate-200"
                style={{
                  boxShadow: '0 30px 60px -15px rgba(139, 92, 246, 0.3), 0 25px 50px -12px rgba(0,0,0,0.25)',
                }}
                whileHover={{ scale: 1.03, rotateY: 5, rotateX: -5 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                <img
                  src={aboutImg}
                  alt="Dinesh - Graphic Designer"
                  className="w-full h-full object-cover object-top"
                />

                {/* Image Inner Shadow for Depth */}
                <div className="absolute inset-0 rounded-[2rem] ring-1 ring-inset ring-white/20 pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent pointer-events-none" />
              </motion.div>

              {/* Backglow element */}
              <motion.div
                className="absolute -inset-6 bg-gradient-to-br from-violet-500/30 via-rose-400/20 to-amber-300/20 rounded-[3rem] blur-3xl -z-10"
                animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              />
            </motion.div>
          </motion.div>

          {/* Right: Content */}
          <motion.div
            className="order-1 md:order-2 space-y-6 lg:pl-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.15 } }
            }}
          >
            <motion.h2
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-800 tracking-tight"
              variants={{
                hidden: { opacity: 0, x: 40, filter: 'blur(4px)' },
                visible: { opacity: 1, x: 0, filter: 'blur(0px)', transition: { type: "spring", bounce: 0.4, duration: 1 } }
              }}
            >
              Who is the{' '}
              <span className="bg-gradient-to-r from-violet-600 to-rose-500 bg-clip-text text-transparent inline-block">
                Designer?
              </span>
            </motion.h2>

            <motion.p
              className="text-base md:text-lg text-slate-600 leading-relaxed font-medium max-w-lg"
              variants={{
                hidden: { opacity: 0, x: 40, filter: 'blur(4px)' },
                visible: { opacity: 1, x: 0, filter: 'blur(0px)', transition: { duration: 0.8 } }
              }}
            >
              I'm a passionate graphic designer who creates visually compelling brand identities and digital experiences that leave a lasting mark.
            </motion.p>

            {/* Experience counters */}
            <motion.div
              className="grid grid-cols-3 gap-3 lg:gap-4 pt-2 max-w-lg"
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
              }}
            >
              {[
                { value: 3, suffix: '+', label: 'Years Experience' },
                { value: 40, suffix: '+', label: 'Projects Completed' },
                { value: 20, suffix: '+', label: 'Happy Clients' },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  className="bg-white rounded-2xl p-4 text-center shadow-lg shadow-slate-200/50 border border-slate-100 hover:shadow-xl hover:shadow-violet-200/50 transition-shadow duration-300 cursor-default"
                  whileHover={{ y: -6, scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  <div className="text-2xl lg:text-3xl font-black bg-gradient-to-br from-violet-600 via-rose-500 to-amber-500 bg-clip-text text-transparent">
                    <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                  </div>
                  <p className="text-[10px] md:text-xs font-bold text-slate-500 mt-1.5 uppercase tracking-wider">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>

            {/* Philosophy cards */}
            <motion.div
              className="space-y-3 pt-2 max-w-lg"
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.1 } }
              }}
            >
              {philosophy.map((item, i) => (
                <motion.div
                  key={item.title}
                  className="group bg-white/80 backdrop-blur-sm rounded-2xl p-4 flex items-center gap-4 shadow-sm shadow-slate-200/40 border border-white hover:shadow-lg hover:shadow-slate-300/50 transition-all cursor-default relative overflow-hidden"
                  variants={{
                    hidden: { opacity: 0, x: 30, scale: 0.95 },
                    visible: { opacity: 1, x: 0, scale: 1, transition: { type: "spring", bounce: 0.4, duration: 0.8 } }
                  }}
                  whileHover={{ y: -4, scale: 1.02 }}
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center text-white text-xl shrink-0 shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                    {item.icon}
                  </div>
                  <div className="z-10">
                    <h3 className="text-base font-bold text-slate-800 group-hover:text-violet-600 transition-colors">{item.title}</h3>
                    <p className="text-slate-600 font-medium text-sm mt-0.5 leading-snug">{item.desc}</p>
                  </div>

                  {/* Subtle hover background highlight */}
                  <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-[0.03] blur-xl rounded-full transition-opacity duration-500`} />
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
