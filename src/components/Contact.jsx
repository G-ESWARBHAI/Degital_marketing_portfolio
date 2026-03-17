import { useState, useRef, useCallback } from 'react'
import { motion, useInView, useMotionValue, useSpring, useTransform } from 'framer-motion'

const socialLinks = [
  { name: 'Email', href: 'mailto:alex@example.com', gradient: 'from-rose-500 to-pink-500' },
  { name: 'LinkedIn', href: 'https://linkedin.com', gradient: 'from-blue-500 to-blue-700' },
  { name: 'Instagram', href: 'https://instagram.com', gradient: 'from-pink-500 via-rose-500 to-amber-500' },
  { name: 'Behance', href: 'https://behance.net', gradient: 'from-blue-600 to-indigo-700' },
]

function ContactCard({ children, className = '' }) {
  const cardRef = useRef(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [6, -6]), { damping: 25, stiffness: 150 })
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-6, 6]), { damping: 25, stiffness: 150 })

  return (
    <motion.div
      ref={cardRef}
      className={className}
      onMouseMove={(e) => {
        if (!cardRef.current) return
        const rect = cardRef.current.getBoundingClientRect()
        const cx = rect.left + rect.width / 2
        const cy = rect.top + rect.height / 2
        x.set((e.clientX - cx) / rect.width)
        y.set((e.clientY - cy) / rect.height)
      }}
      onMouseLeave={() => { x.set(0); y.set(0) }}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d', perspective: 1000 }}
    >
      {children}
    </motion.div>
  )
}

export default function Contact() {
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' })

  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null)
  const [copied, setCopied] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value.slice(0, name === 'message' ? 400 : undefined) }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const copyEmail = useCallback(async () => {
    await navigator.clipboard.writeText('alex@example.com')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [])

  const validate = () => {
    const newErrors = {}
    if (!formData.name.trim()) newErrors.name = 'Required'
    if (!formData.email.trim()) newErrors.email = 'Required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid'
    if (!formData.message.trim()) newErrors.message = 'Required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setIsSubmitting(true)
    setSubmitStatus(null)
    await new Promise((r) => setTimeout(r, 1800))
    setIsSubmitting(false)
    setSubmitStatus('success')
    setFormData({ name: '', email: '', message: '' })
  }

  return (
    <section ref={sectionRef} id="contact" className="relative py-24 md:py-32 overflow-hidden">
      {/* Dark gradient background */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(165deg, #0f0f23 0%, #1a1a2e 40%, #16213e 70%, #1a1a2e 100%)',
        }}
      />
      <div
        className="absolute inset-0 opacity-70"
        style={{
          backgroundImage: `
            radial-gradient(ellipse 60% 50% at 30% 20%, rgba(139, 92, 246, 0.2) 0%, transparent 50%),
            radial-gradient(ellipse 50% 60% at 70% 80%, rgba(244, 63, 94, 0.15) 0%, transparent 50%)
          `,
        }}
      />
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
          backgroundSize: '48px 48px',
        }}
      />

      {/* Floating orbs */}
      <motion.div
        className="absolute top-[10%] left-[5%] w-32 h-32 rounded-full bg-violet-500/20 blur-3xl"
        animate={{ x: [0, 20, 0], y: [0, -15, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-[15%] right-[8%] w-40 h-40 rounded-full bg-rose-500/15 blur-3xl"
        animate={{ x: [0, -15, 0], y: [0, 10, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      />

      <div className="relative max-w-5xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.h2
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4"
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            Let's Create{' '}
            <span className="bg-gradient-to-r from-violet-400 via-rose-400 to-amber-400 bg-clip-text text-transparent">
              Something Great
            </span>
          </motion.h2>
          <motion.p
            className="text-slate-400 text-lg max-w-xl mx-auto"
            initial={{ opacity: 0, y: 15 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Drop a creative brief. I'll bring your vision to life.
          </motion.p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8 lg:gap-10">
          {/* Main form card - 3D tilt, gradient border */}
          <motion.div
            className="lg:col-span-3"
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <ContactCard>
              <motion.div
                className="relative rounded-3xl overflow-hidden"
                whileHover={{ scale: 1.01 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              >
                {/* Gradient border */}
                <div className="absolute inset-0 rounded-3xl p-[1px] bg-gradient-to-br from-violet-500/60 via-rose-500/60 to-amber-500/60">
                  <div className="absolute inset-[1px] rounded-3xl bg-slate-900/95 backdrop-blur-xl" />
                </div>

                <div className="relative p-8 md:p-10">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Your name"
                          className={`w-full bg-transparent border-b-2 py-3 px-1 text-white placeholder-slate-500 outline-none transition-all duration-300 ${
                            errors.name ? 'border-rose-500' : 'border-slate-600 focus:border-violet-400'
                          }`}
                        />
                        {errors.name && <p className="mt-1 text-xs text-rose-400">{errors.name}</p>}
                      </div>
                      <div>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="you@example.com"
                          className={`w-full bg-transparent border-b-2 py-3 px-1 text-white placeholder-slate-500 outline-none transition-all duration-300 ${
                            errors.email ? 'border-rose-500' : 'border-slate-600 focus:border-violet-400'
                          }`}
                        />
                        {errors.email && <p className="mt-1 text-xs text-rose-400">{errors.email}</p>}
                      </div>
                    </div>

                    <div>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Your creative brief..."
                        rows={4}
                        maxLength={400}
                        className={`w-full bg-transparent border-b-2 py-3 px-1 text-white placeholder-slate-500 outline-none resize-none transition-all duration-300 ${
                          errors.message ? 'border-rose-500' : 'border-slate-600 focus:border-violet-400'
                        }`}
                      />
                      <div className="flex justify-between mt-1">
                        {errors.message && <p className="text-xs text-rose-400">{errors.message}</p>}
                        <span className="text-xs text-slate-500 ml-auto">{formData.message.length}/400</span>
                      </div>
                    </div>

                    <motion.button
                      type="submit"
                      disabled={isSubmitting}
                      className="group relative w-full py-4 rounded-2xl font-semibold text-white overflow-hidden"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-violet-500 via-rose-500 to-amber-500 opacity-90 group-hover:opacity-100 transition-opacity" />
                      <div className="absolute inset-0 bg-gradient-to-r from-violet-400 to-rose-400 opacity-0 group-hover:opacity-30 transition-opacity" />
                      <span className="relative flex items-center justify-center gap-2">
                        {isSubmitting ? (
                          <>
                            <motion.span
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                              className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                            />
                            Sending...
                          </>
                        ) : submitStatus === 'success' ? (
                          <>
                            <motion.span
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                            >
                              ✓
                            </motion.span>
                            Sent!
                          </>
                        ) : (
                          <>
                            Send brief
                            <span className="group-hover:translate-x-1 transition-transform">→</span>
                          </>
                        )}
                      </span>
                    </motion.button>
                  </form>
                </div>
              </motion.div>
            </ContactCard>
          </motion.div>

          {/* Right side - contact options */}
          <motion.div
            className="lg:col-span-2 space-y-6"
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {/* Copy email card */}
            <ContactCard>
              <motion.div
                className="relative rounded-2xl p-6 border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden group cursor-pointer"
                onClick={copyEmail}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 to-rose-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative flex items-center justify-between gap-4">
                  <div>
                    <p className="text-slate-400 text-sm mb-1">Email me directly</p>
                    <p className="text-white font-medium">alex@example.com</p>
                  </div>
                  <motion.span
                    className="px-4 py-2 rounded-xl bg-white/10 text-sm font-medium text-white"
                    animate={copied ? { scale: [1, 1.05, 1] } : {}}
                    transition={{ duration: 0.3 }}
                  >
                    {copied ? '✓ Copied!' : 'Copy'}
                  </motion.span>
                </div>
              </motion.div>
            </ContactCard>

            {/* Social links - stacked cards */}
            <div className="space-y-3">
              {socialLinks.map((link, i) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                  initial={{ opacity: 0, x: 20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.4 + i * 0.06 }}
                >
                  <ContactCard>
                    <motion.div
                      className="relative rounded-2xl p-4 border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden group"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className={`absolute inset-0 bg-gradient-to-r ${link.gradient} opacity-0 group-hover:opacity-20 transition-opacity`} />
                      <div className="relative flex items-center justify-between">
                        <span className="text-white font-medium">{link.name}</span>
                        <span className="text-slate-400 group-hover:text-white transition-colors">→</span>
                      </div>
                    </motion.div>
                  </ContactCard>
                </motion.a>
              ))}
            </div>

            {/* Decorative - "Available" badge */}
            <motion.div
              className="flex items-center gap-2 text-slate-500 text-sm"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.8 }}
            >
              <motion.span
                className="w-2 h-2 rounded-full bg-emerald-400"
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              Available for new projects
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
