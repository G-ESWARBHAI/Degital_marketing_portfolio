import { useState, useRef } from 'react'
import { motion, useInView, AnimatePresence, useScroll, useTransform } from 'framer-motion'

const categories = ['All', 'Branding', 'Logo Design', 'Posters', 'Social Media', 'UI Design', 'Packaging', 'Motion']

const PROJECTS_PER_PAGE = 8

const projects = [
  { id: 1, title: 'Nova Coffee Brand', category: 'Branding', description: 'Full brand identity for a specialty coffee roaster. Logo, packaging, and store signage.', image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&h=400&fit=crop', layout: 'portrait' },
  { id: 2, title: 'TechFlow Logo', category: 'Logo Design', description: 'Modern tech startup mark with clean geometry and versatile lockups.', image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=500&fit=crop', layout: 'portrait' },
  { id: 3, title: 'Summer Festival Poster', category: 'Posters', description: 'Vibrant event poster with bold typography and energetic color palette.', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=700&fit=crop', layout: 'portrait' },
  { id: 4, title: 'Instagram Campaign', category: 'Social Media', description: 'Social media kit and carousel designs for a lifestyle brand launch.', image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=450&fit=crop', layout: 'landscape' },
  { id: 5, title: 'Finance App UI', category: 'UI Design', description: 'Mobile-first banking app with intuitive dashboards and clear data visualization.', image: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&h=450&fit=crop', layout: 'landscape' },
  { id: 6, title: 'Organic Skincare Pack', category: 'Packaging', description: 'Eco-friendly packaging design with minimalist aesthetic and sustainable materials.', image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&h=400&fit=crop', layout: 'square' },
  { id: 7, title: 'Brand Motion Reel', category: 'Motion', description: 'Animated brand reveal and social media motion graphics.', video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=450&fit=crop', layout: 'landscape' },
  { id: 8, title: 'Minimalist A Logo', category: 'Logo Design', description: 'Single-letter monogram with refined proportions for luxury brand.', image: 'https://images.unsplash.com/photo-1626785774626-2b35e4d1c585?w=600&h=400&fit=crop', layout: 'square' },
  { id: 9, title: 'Concert Poster', category: 'Posters', description: 'Retro-inspired concert poster with bold typography and neon accents.', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=450&fit=crop', layout: 'landscape' },
  { id: 10, title: 'Social Media Kit', category: 'Social Media', description: 'Complete social templates for consistent brand presence across platforms.', image: 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=600&h=450&fit=crop', layout: 'portrait' },
  { id: 11, title: 'Dashboard Design', category: 'UI Design', description: 'Analytics dashboard with real-time charts and customizable widgets.', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop', layout: 'landscape' },
  { id: 12, title: 'Wine Box Packaging', category: 'Packaging', description: 'Premium wine gift box with embossed details and elegant typography.', image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&h=550&fit=crop', layout: 'portrait' },
  { id: 13, title: 'Product Demo Video', category: 'Motion', description: 'Product showcase video with smooth transitions and call-to-action.', video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=450&fit=crop', layout: 'landscape' },
  { id: 14, title: 'Urban Wear Brand', category: 'Branding', description: 'Streetwear brand identity with bold graphics and urban aesthetic.', image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&h=600&fit=crop', layout: 'square' },
  { id: 15, title: 'App Promo Video', category: 'Motion', description: 'Short-form app promo for social media and landing pages.', video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', image: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&h=450&fit=crop', layout: 'landscape' },
  { id: 16, title: 'Brand Campaign Banner', category: 'Branding', description: 'Wide-format campaign visuals for digital billboards and web headers.', image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200&h=400&fit=crop', layout: 'wide' },
]

const layoutClasses = {
  portrait: 'aspect-[3/4]',
  landscape: 'aspect-video',
  square: 'aspect-square',
  wide: 'aspect-[2/1]',
}

function StackedProjectCard({ project, index, totalProjects, scrollYProgress, onSelect }) {
  // Each card's animation range:
  // Starts coming into focus slightly before its "turn"
  // Is fully focused during its "turn"
  // Fades out and moves up as the next card comes in

  const cardFocusRange = 1 / totalProjects;
  const startFocus = index * cardFocusRange;
  const endFocus = startFocus + cardFocusRange;

  // The card's position in the stack (0 = front, 1 = behind, 2 = way behind)
  // We use scrollYProgress to determine this relative position dynamically
  const relativePosition = useTransform(
    scrollYProgress,
    [startFocus - cardFocusRange * 2, startFocus, endFocus, endFocus + cardFocusRange],
    [2, 0, 0, -1] // Comes from distance 2 -> Front (0) -> Stays Front (0) -> Moves Away (-1)
  );

  // Alternating rotation for a more natural scattered stack feel
  const isEven = index % 2 === 0;
  const rotateAmount = isEven ? 2 : -2;

  // Compute styles based on relative position
  // Increased Y offsets so cards peek out noticeably from the bottom to show clear depth
  const y = useTransform(relativePosition, [-1, 0, 1, 2, 3], [-800, 0, 45, 90, 135]);
  const scale = useTransform(relativePosition, [-1, 0, 1, 2, 3], [1.05, 1, 0.96, 0.92, 0.88]);
  const opacity = useTransform(relativePosition, [-1, -0.2, 0, 1, 2, 3], [0, 0, 1, 0.85, 0.5, 0]);
  const zIndex = useTransform(relativePosition, pos => Math.round(50 - pos * 10));
  const blur = useTransform(relativePosition, [-1, 0, 1, 2], ['blur(0px)', 'blur(0px)', 'blur(1px)', 'blur(3px)']);

  // Background layers get a slight rotation, front stays totally straight (0deg)
  const rotate = useTransform(
    relativePosition,
    [-1, 0, 1, 2, 3],
    [0, 0, rotateAmount * 0.5, rotateAmount, rotateAmount * 1.5]
  );

  // Dynamic shadows depending on depth level + a soft focal glow for the front layer
  const boxShadow = useTransform(
    relativePosition,
    [-1, 0, 1, 2],
    [
      "0px 0px 0px 0px rgba(0,0,0,0)",
      "0px 40px 80px -20px rgba(0,0,0,0.7), 0px 0px 80px 15px rgba(139, 92, 246, 0.15)", // Front layer
      "0px 20px 40px -10px rgba(0,0,0,0.4), 0px 0px 0px 0px rgba(139, 92, 246, 0)", // Mid layer
      "0px 10px 20px -5px rgba(0,0,0,0.2), 0px 0px 0px 0px rgba(139, 92, 246, 0)" // Deeper layer
    ]
  );

  // Ensure un-rendered cards don't stay in the DOM taking up space far away
  const display = useTransform(relativePosition, pos => pos > 3 || pos < -1.5 ? 'none' : 'block');

  return (
    <motion.article
      style={{
        y,
        scale,
        rotate,
        opacity,
        zIndex,
        filter: blur,
        display,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '100%',
        transformOrigin: "top center"
      }}
      className="w-full max-w-6xl mx-auto will-change-transform"
    >
      <motion.button
        type="button"
        onClick={() => onSelect(project)}
        style={{ boxShadow }}
        className="group block w-full h-full text-left relative rounded-3xl overflow-hidden bg-slate-900 border border-white/10 cursor-pointer"
        whileHover={{ y: -8, scale: 1.01 }}
        transition={{ type: 'spring', stiffness: 350, damping: 30 }}
        onMouseEnter={(e) => {
          const video = e.currentTarget.querySelector('video')
          if (video) video.play()
        }}
        onMouseLeave={(e) => {
          const video = e.currentTarget.querySelector('video')
          if (video) { video.pause(); video.currentTime = 0 }
        }}
      >
        <div className={`relative overflow-hidden w-full h-full`}>
          {project.video ? (
            <>
              <video
                src={project.video}
                poster={project.image}
                muted
                loop
                playsInline
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-slate-700 shadow-lg">
                <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4l12 6-12 6z" /></svg>
              </div>
            </>
          ) : (
            <motion.img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover"
              loading="lazy"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            />
          )}

          {/* Elegant Dark Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent flex flex-col justify-end p-6 md:p-10">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <span className="inline-block px-3 py-1 mb-3 text-rose-300 text-xs md:text-sm font-bold uppercase tracking-widest bg-rose-500/20 backdrop-blur-md rounded-full border border-rose-400/30">
                {project.category}
              </span>
              <h3 className="text-white font-bold text-3xl md:text-4xl lg:text-5xl mb-3 tracking-tight">{project.title}</h3>
              <p className="text-slate-200 text-sm md:text-base max-w-2xl line-clamp-2 md:line-clamp-none mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {project.description}
              </p>

              <div className="text-white/90 text-sm font-medium flex items-center gap-2 group-hover:text-rose-300 transition-colors">
                View Project Details
                <svg className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.button>
    </motion.article>
  )
}

function ProjectModal({ project, onClose }) {
  if (!project) return null
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-sm" />
      <motion.div
        className="relative max-w-4xl w-full max-h-[90vh] rounded-2xl overflow-hidden flex flex-col"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'linear-gradient(135deg, rgba(26,26,46,0.98) 0%, rgba(15,15,35,0.98) 100%)',
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 25px 80px rgba(0,0,0,0.5), 0 0 60px -10px rgba(139, 92, 246, 0.3)',
        }}
      >
        <div className="flex-1 overflow-y-auto">
          <div className="relative aspect-video max-h-[50vh] bg-slate-800/50">
            {project.video ? (
              <video
                src={project.video}
                poster={project.image}
                muted
                loop
                playsInline
                autoPlay
                className="w-full h-full object-contain"
              />
            ) : (
              <img src={project.image} alt={project.title} className="w-full h-full object-contain" />
            )}
          </div>
          <div className="p-6 md:p-8">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <span className="text-rose-400 text-xs font-semibold uppercase tracking-wider">{project.category}</span>
                <h3 className="text-2xl font-bold text-white mt-1">{project.title}</h3>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors shrink-0"
                aria-label="Close"
              >
                <span className="text-xl">×</span>
              </button>
            </div>
            <p className="text-slate-400">{project.description}</p>
            <motion.a
              href="#contact"
              onClick={onClose}
              className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white transition-colors"
              style={{
                background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.8) 0%, rgba(244, 63, 94, 0.8) 100%)',
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Discuss this project
              <span>→</span>
            </motion.a>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function ProjectsGallery() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [selectedProject, setSelectedProject] = useState(null)

  const sectionRef = useRef(null)
  const headerRef = useRef(null)

  // Use scroll for the sticky section to power the stacked animation
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"]
  })

  // To animate headers appearing
  const isInView = useInView(headerRef, { once: true, margin: '-80px' })

  const filteredProjects = activeCategory === 'All'
    ? projects
    : projects.filter((p) => p.category === activeCategory)

  return (
    <section
      id="work"
      className="relative pt-24 md:pt-32 px-4 md:px-8 bg-slate-50"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-slate-50" />
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,0,0,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.02) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
        }}
      />

      {/* Floating shapes */}
      <motion.div
        className="absolute top-[15%] right-[5%] w-24 h-24 rounded-full bg-violet-400/10 blur-2xl"
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-[20%] left-[5%] w-32 h-32 rounded-full bg-rose-400/10 blur-2xl"
        animate={{ scale: [1.2, 1, 1.2], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      />

      <div ref={headerRef} className="relative max-w-6xl mx-auto">
        {/* Section title */}
        <motion.h2
          className="text-3xl md:text-4xl lg:text-5xl font-bold text-center text-slate-800 mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          Featured{' '}
          <span className="bg-gradient-to-r from-violet-600 via-rose-500 to-amber-500 bg-clip-text text-transparent">
            Projects
          </span>
        </motion.h2>

        <motion.p
          className="text-center text-slate-500 mb-12 max-w-xl mx-auto"
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Explore my design work across branding, UI, and beyond
        </motion.p>

        {/* Filter tabs */}
        <motion.div
          className="flex flex-wrap justify-center gap-2 mb-12"
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 md:px-4 py-1.5 md:py-2.5 rounded-full md:rounded-xl text-xs sm:text-sm font-medium transition-all duration-300 ${activeCategory === cat
                ? 'bg-slate-800 text-white shadow-lg shadow-slate-300/50'
                : 'bg-white/80 text-slate-600 hover:bg-white hover:text-slate-800 border border-slate-200 hover:border-slate-300'
                }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {/* Stacked Depth Scroll Container */}
        {/* The height dictates how long the user has to scroll to see all cards */}
        <div ref={sectionRef} style={{ height: `${filteredProjects.length * 100}vh`, position: 'relative' }}>

          {/* Sticky container that stays fixed while scrolling through the tall div */}
          <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden py-16 md:py-24 px-4">

            <div className="relative w-full max-w-5xl mx-auto aspect-[4/5] sm:aspect-[16/9] md:aspect-[21/9]">
              <AnimatePresence mode="popLayout">
                {filteredProjects.map((project, i) => (
                  <StackedProjectCard
                    key={project.id}
                    project={project}
                    index={i}
                    totalProjects={filteredProjects.length}
                    scrollYProgress={scrollYProgress}
                    onSelect={setSelectedProject}
                  />
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Empty state */}
        {filteredProjects.length === 0 && (
          <motion.p
            className="text-center text-slate-500 py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            No projects in this category yet.
          </motion.p>
        )}
      </div>

      {/* Project detail modal */}
      <AnimatePresence>
        {selectedProject && (
          <ProjectModal
            key={selectedProject.id}
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </AnimatePresence>
    </section>
  )
}
