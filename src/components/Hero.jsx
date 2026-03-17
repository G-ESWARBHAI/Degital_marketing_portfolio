// @ts-nocheck
import { useRef, useState, useCallback, useEffect } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import heroImg from '../assets/hero.png'

// Video editing & graphic design tool icons (SVG)
const FilmStripIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
    <rect x="2" y="2" width="20" height="20" rx="2" />
    <line x1="7" y1="2" x2="7" y2="22" />
    <line x1="17" y1="2" x2="17" y2="22" />
    <rect x="4" y="6" width="2" height="3" />
    <rect x="4" y="15" width="2" height="3" />
    <rect x="18" y="6" width="2" height="3" />
    <rect x="18" y="15" width="2" height="3" />
  </svg>
)
const ScissorsIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
    <circle cx="6" cy="6" r="3" />
    <circle cx="6" cy="18" r="3" />
    <line x1="20" y1="4" x2="8.12" y2="15.88" />
    <line x1="14.47" y1="14.48" x2="20" y2="20" />
    <line x1="8.12" y1="8.12" x2="12" y2="12" />
  </svg>
)
const PlayIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
    <polygon points="5 3 19 12 5 21 5 3" />
  </svg>
)
const PenToolIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
    <path d="M12 19l7-7 3 3-7 7-3-3z" />
    <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
  </svg>
)
const ColorPaletteIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
    <circle cx="13.5" cy="6.5" r=".5" fill="currentColor" />
    <circle cx="17.5" cy="10.5" r=".5" fill="currentColor" />
    <circle cx="8.5" cy="7.5" r=".5" fill="currentColor" />
    <circle cx="6.5" cy="12.5" r=".5" fill="currentColor" />
    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.648 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 011.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.555C21.965 6.012 17.461 2 12 2z" />
  </svg>
)
const TypographyIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
    <polyline points="4 7 4 4 20 4 20 7" />
    <line x1="9" y1="20" x2="15" y2="20" />
    <line x1="12" y1="4" x2="12" y2="20" />
  </svg>
)
const LayersIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
    <polygon points="12 2 2 7 12 12 22 7 12 2" />
    <polyline points="2 17 12 22 22 17" />
  </svg>
)

// Dummy portfolio preview URLs for the cards
const previewImages = [
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=300&auto=format&fit=crop', // Abstract
  'https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=300&auto=format&fit=crop', // Branding
  'https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=300&auto=format&fit=crop', // UI
  'https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=300&auto=format&fit=crop', // Social
  'https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=300&auto=format&fit=crop', // Poster
  'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?q=80&w=300&auto=format&fit=crop', // 3D
]



const Typewriter = ({ words, delay = 2000 }) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentWord = words[currentWordIndex];

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (currentText.length < currentWord.length) {
          setCurrentText(currentWord.slice(0, currentText.length + 1));
        } else {
          setTimeout(() => setIsDeleting(true), delay);
        }
      } else {
        if (currentText.length > 0) {
          setCurrentText(currentWord.slice(0, currentText.length - 1));
        } else {
          setIsDeleting(false);
          setCurrentWordIndex((prev) => (prev + 1) % words.length);
        }
      }
    }, isDeleting ? 50 : 100);

    return () => clearTimeout(timeout);
  }, [currentText, isDeleting, currentWordIndex, words, delay]);

  return (
    <span className="inline-block">
      {currentText}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
      >
        |
      </motion.span>
    </span>
  );
};

// Floating element - supports size scale and blur for depth
const FloatingElement = ({ children, className = '', delay = 0, duration = 5, scale = 1, xOffset = 0, yOffset = 0 }) => {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springConfig = { damping: 30, stiffness: 120 }
  const xSpring = useSpring(x, springConfig)
  const ySpring = useSpring(y, springConfig)

  const handleMouseMove = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const moveX = (e.clientX - centerX) * 0.012 + xOffset
    const moveY = (e.clientY - centerY) * 0.012 + yOffset
    x.set(moveX)
    y.set(moveY)
  }, [x, y, xOffset, yOffset])

  const handleMouseLeave = useCallback(() => {
    x.set(0)
    y.set(0)
  }, [x, y])

  return (
    <motion.div
      className={className}
      style={{ x: xSpring, y: ySpring }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 20, scale: scale * 0.85 }}
      animate={{
        opacity: 1,
        y: [0, -8, 0],
        scale,
      }}
      transition={{
        opacity: { duration: 0.8, delay },
        scale: { duration: 0.5, delay },
        y: {
          duration,
          repeat: Infinity,
          repeatType: "reverse",
          ease: 'easeInOut',
          delay,
        },
      }}
      whileHover={{ scale: scale * 1.08, transition: { duration: 0.2 } }}
    >
      {children}
    </motion.div>
  )
}

// Portfolio Card Animation Wrapper
const PortfolioCard = ({ children, delay, isLeft, index }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile(); // Check immediately on mount
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const xDirection = isLeft ? -1 : 1;

  // Calculate spread logic to fill extreme edges
  // Index 0: Furthest away (outer edge)
  // Index 1: Middle
  // Index 2: Closest to center portrait

  // Base distances outward -> making them spread far
  const baseSpreadX = isMobile ? 65 : 140;
  const gapX = isMobile ? 50 : 120;

  // The magic spread logic for wide distribution
  const getSpreadX = (idx) => {
    switch (idx) {
      case 0: return xDirection * (baseSpreadX + gapX * 2.2); // Outer
      case 1: return xDirection * (baseSpreadX + gapX);       // Middle
      case 2: return xDirection * baseSpreadX;                // Inner
      default: return 0;
    }
  }

  // Y layout to form an upward arc shape like wings
  const getSpreadY = (idx) => {
    switch (idx) {
      case 0: return isMobile ? -60 : -120; // Highest
      case 1: return isMobile ? -30 : -60;  // Mid
      case 2: return isMobile ? 10 : 20;    // Lowest 
      default: return 0;
    }
  }

  // Scale calculations for depth effect
  const getScale = (idx) => {
    const mobileScaleFactor = isMobile ? 0.65 : 1; // Make cards smaller on mobile
    switch (idx) {
      case 0: return 0.8 * mobileScaleFactor;  // Smallest (furthest)
      case 1: return 0.9 * mobileScaleFactor;  // Medium
      case 2: return 1.05 * mobileScaleFactor; // Largest (closest)
      default: return 1 * mobileScaleFactor;
    }
  }

  // Rotation: tilting outward like wings
  const getRotation = (idx) => {
    switch (idx) {
      case 0: return xDirection * 24; // Steeper angle on outside
      case 1: return xDirection * 15;
      case 2: return xDirection * 6;  // Gentle angle near center
      default: return 0;
    }
  }

  const spreadX = getSpreadX(index);
  const spreadY = getSpreadY(index);
  const rotation = getRotation(index);
  const finalScale = getScale(index);

  // Slight blur effect on outer elements to create field depth
  const blurValue = index === 0 ? 'blur(1px)' : 'blur(0px)';

  return (
    <motion.div
      className="absolute top-1/2 left-1/2 -mt-24 -ml-16 md:-mt-36 md:-ml-24 z-10" // Centered starting position behind portrait
      initial={{
        opacity: 0,
        x: 0,
        y: 0,
        scale: 0.3,
        rotate: 0,
        filter: 'blur(4px)'
      }}
      animate={{
        opacity: 1,
        x: spreadX,
        y: spreadY,
        scale: finalScale,
        rotate: rotation,
        filter: blurValue
      }}
      transition={{
        type: "spring",
        stiffness: 60,  // Softer spring
        damping: 12,    // Bouncier
        delay: 0.4 + delay, // Staggered delays
      }}
      whileHover={{
        scale: finalScale * 1.15,
        y: spreadY - 20,
        rotate: rotation + (xDirection * 4),
        zIndex: 50,
        filter: 'blur(0px)', // Remove blur on hover
        transition: { type: 'spring', stiffness: 300, damping: 20 }
      }}
    >
      <motion.div
        animate={{
          y: [0, -12, 0], // Larger floating movement
        }}
        transition={{
          duration: 3 + index * 0.5, // Unique float durations
          repeat: Infinity,
          repeatType: "reverse",
          ease: 'easeInOut',
          delay: delay + 1.5, // Float starts after spread finishes
        }}
        className={`w-36 h-48 md:w-56 md:h-72 rounded-2xl overflow-hidden shadow-2xl border border-white/80 bg-white/70 backdrop-blur-md p-1.5`}
      >
        <div className="w-full h-full rounded-xl overflow-hidden relative group">
          <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition-colors duration-300 z-10" />
          {children}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Hero() {
  const containerRef = useRef(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  const handleMouseMove = useCallback((e) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left - rect.width / 2) / rect.width
    const y = (e.clientY - rect.top - rect.height / 2) / rect.height
    setMousePosition({ x: x * 25, y: y * 25 })
  }, [])

  const handleMouseLeave = useCallback(() => {
    setMousePosition({ x: 0, y: 0 })
  }, [])

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative min-h-screen w-full overflow-hidden bg-[#f5f5f7] flex flex-col"
    >
      {/* Canvas grid background */}
      <div
        className="absolute inset-0 opacity-75"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,0,0,0.035) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.035) 1px, transparent 1px)
          `,
          backgroundSize: '36px 36px',
        }}
      />

      {/* Vibrant gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-50/50 via-transparent to-amber-50/40 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-white/50 via-transparent to-transparent pointer-events-none" />

      {/* TOP: Text content */}
      <div className="relative z-30 flex flex-col items-center text-center pt-10 md:pt-16 pb-4 px-6">


        <motion.h1
          className=" text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-slate-800 mb-4 tracking-tight leading-[1.1]"
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          Hi, I'm Dinesh —{' '}
          <span className="bg-gradient-to-r from-violet-600 via-rose-500 to-amber-500 bg-clip-text text-transparent min-h-[1.2em] inline-block">
            <Typewriter words={['Graphic Designer', 'UI Designer', 'Brand Designer', 'video editor']} />
          </span>
        </motion.h1>
      </div>

      {/* Tags and Buttons - Moved to order-last (bottom) on mobile, normal order on md+ */}
      <div className="relative z-30 flex flex-col items-center order-last md:order-none px-6 pb-20 md:pb-4 mt-4 md:mt-0">
        <motion.div
          className="flex flex-wrap gap-2 justify-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
        >
          {['Branding', 'UI', 'Posters', 'Social Media'].map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 md:px-4 md:py-1.5 rounded-lg text-xs md:text-sm font-medium text-slate-600 bg-white/70 backdrop-blur border border-slate-200/60 shadow-sm"
            >
              {tag}
            </span>
          ))}
        </motion.div>

        <motion.div
          className="flex flex-row gap-2 md:gap-4 justify-center w-full sm:w-auto px-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <motion.a
            href="#work"
            className="group flex-1 sm:flex-none flex items-center justify-center gap-1.5 md:gap-2 px-3 py-2.5 md:px-7 md:py-3.5 bg-gradient-to-r from-teal-500 to-emerald-400 text-white rounded-xl text-xs sm:text-sm md:text-base font-semibold shadow-lg shadow-teal-200/50 hover:shadow-xl hover:shadow-teal-300/40 transition-all whitespace-nowrap"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            View Work
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </motion.a>
          <motion.a
            href="#"
            className="group flex-1 sm:flex-none flex items-center justify-center gap-1.5 md:gap-2 px-3 py-2.5 md:px-7 md:py-3.5 bg-gradient-to-r from-violet-500 to-rose-400 text-white rounded-xl text-xs sm:text-sm md:text-base font-semibold shadow-lg shadow-violet-200/50 hover:shadow-xl hover:shadow-rose-200/40 transition-all whitespace-nowrap"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            Download Portfolio
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </motion.a>
        </motion.div>
      </div>



      {/* CENTER: Portrait + Portfolio Cards Container */}
      <div className="relative flex-1 min-h-[350px] md:min-h-[600px] flex items-center justify-center w-full py-2 md:py-0 overflow-hidden order-none">

        {/* Animated Portfolio Preview Cards */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {/* Left Cards (Outer to Inner) */}
          <div className="pointer-events-auto">
            <PortfolioCard delay={0.6} isLeft={true} index={0}>
              <img src={previewImages[0]} alt="Abstract Design" className="w-full h-full object-cover" />
            </PortfolioCard>
            <PortfolioCard delay={0.4} isLeft={true} index={1}>
              <img src={previewImages[1]} alt="Branding" className="w-full h-full object-cover" />
            </PortfolioCard>
            <PortfolioCard delay={0.2} isLeft={true} index={2}>
              <img src={previewImages[2]} alt="UI Design" className="w-full h-full object-cover" />
            </PortfolioCard>

            {/* Right Cards (Outer to Inner) */}
            <PortfolioCard delay={0.7} isLeft={false} index={0}>
              <img src={previewImages[3]} alt="Social Media" className="w-full h-full object-cover" />
            </PortfolioCard>
            <PortfolioCard delay={0.5} isLeft={false} index={1}>
              <img src={previewImages[4]} alt="Poster" className="w-full h-full object-cover" />
            </PortfolioCard>
            <PortfolioCard delay={0.3} isLeft={false} index={2}>
              <img src={previewImages[5]} alt="3D Work" className="w-full h-full object-cover" />
            </PortfolioCard>
          </div>
        </div>

        {/* Center portrait */}
        <motion.div
          className="relative z-30 flex justify-center items-center pointer-events-none"
          style={{ x: mousePosition.x, y: mousePosition.y }}
          transition={{ type: 'spring', damping: 25, stiffness: 150 }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.88 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{
              scale: 0.92,
              transition: { type: 'spring', stiffness: 400, damping: 25 }
            }}
            whileTap={{ scale: 0.88 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="relative w-40 h-52 sm:w-48 sm:h-60 md:w-64 md:h-80 lg:w-72 lg:h-92 shrink-0 pointer-events-auto cursor-pointer"
          >
            {/* Animated gradient border */}
            <motion.div
              className="absolute -inset-1 rounded-[1.4rem] opacity-75"
              style={{
                background: 'linear-gradient(135deg, rgba(139,92,246,0.6), rgba(251,113,133,0.5), rgba(251,191,36,0.4))',
                filter: 'blur(8px)',
              }}
              animate={{ opacity: [0.6, 0.9, 0.6] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            />
            <div
              className="absolute inset-0 rounded-3xl overflow-hidden ring-2 ring-white/90"
              style={{
                boxShadow: '0 0 60px -10px rgba(139, 92, 246, 0.5), 0 0 100px -20px rgba(251, 113, 133, 0.35), 0 25px 50px -12px rgba(0,0,0,0.15)',
              }}
            >
              <img
                src={heroImg}
                alt="Dinesh - Graphic Designer"
                className="w-full h-full object-cover object-top rounded-3xl"
              />
            </div>
          </motion.div>
        </motion.div>

        {/* Floating background UI graphic tools layer */}
        <div className="absolute inset-0 pointer-events-none z-10">
          {/* Left side tools */}
          <FloatingElement className="absolute left-[8%] top-[15%] hidden md:block" delay={0.15} duration={5} scale={0.95} xOffset={2} yOffset={-1}>
            <div className={`w-14 h-14 flex items-center justify-center text-rose-500 p-3 bg-white/95 backdrop-blur-sm rounded-2xl border border-white/80 shadow-lg`} style={{ transform: 'rotate(-5deg)' }}>
              <FilmStripIcon />
            </div>
          </FloatingElement>
          <FloatingElement className="absolute left-[15%] bottom-[20%] hidden md:block" delay={0.35} duration={5.5} scale={0.9} xOffset={-1} yOffset={1}>
            <div className={`flex gap-1 p-2.5 bg-white/95 backdrop-blur-sm rounded-xl border border-white/80 shadow-lg`} style={{ transform: 'rotate(4deg)' }}>
              <div className="w-2.5 h-2.5 rounded-full bg-rose-400" />
              <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <div className="w-2.5 h-2.5 rounded-full bg-sky-400" />
              <div className="w-2.5 h-2.5 rounded-full bg-violet-400" />
            </div>
          </FloatingElement>

          {/* Right side tools */}
          <FloatingElement className="absolute right-[8%] top-[18%] hidden md:block" delay={0.18} duration={5.2} scale={0.95} xOffset={-2} yOffset={1}>
            <div className={`w-14 h-14 flex items-center justify-center text-teal-500 p-3 bg-white/95 backdrop-blur-sm rounded-2xl border border-white/80 shadow-lg`} style={{ transform: 'rotate(5deg)' }}>
              <ScissorsIcon />
            </div>
          </FloatingElement>
          <FloatingElement className="absolute right-[16%] bottom-[22%] hidden md:block" delay={0.38} duration={5.6} scale={0.9} xOffset={1} yOffset={-1}>
            <div className={`w-14 h-14 flex items-center justify-center text-sky-500 p-2.5 bg-white/95 backdrop-blur-sm rounded-2xl border border-white/80 shadow-lg`} style={{ transform: 'rotate(-4deg)' }}>
              <TypographyIcon />
            </div>
          </FloatingElement>

          {/* Corner accents */}
          <FloatingElement className="absolute left-[5%] top-[8%] hidden md:block" delay={0.4} duration={6} scale={0.8} xOffset={1} yOffset={-1}>
            <div className={`w-11 h-11 flex items-center justify-center text-indigo-500 p-2 bg-white/95 backdrop-blur-sm rounded-2xl border border-white/80 shadow-sm`} style={{ transform: 'rotate(-8deg)' }}>
              <LayersIcon />
            </div>
          </FloatingElement>
          <FloatingElement className="absolute right-[5%] bottom-[8%] hidden md:block" delay={0.42} duration={5.8} scale={0.8} xOffset={-1} yOffset={2}>
            <div className={`w-11 h-11 flex items-center justify-center text-amber-500 p-2 bg-white/95 backdrop-blur-sm rounded-2xl border border-white/80 shadow-sm`} style={{ transform: 'rotate(6deg)' }}>
              <LayersIcon />
            </div>
          </FloatingElement>
        </div>
      </div>




      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 hidden md:flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.6 }}
      >
        <span className="text-xs font-medium text-slate-500 uppercase tracking-widest">Scroll</span>
        <motion.div
          className="w-6 h-10 rounded-full border-2 border-slate-300 flex justify-center pt-2"
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <motion.div className="w-1.5 h-1.5 rounded-full bg-slate-400" />
        </motion.div>
      </motion.div>
    </section>
  )
}
