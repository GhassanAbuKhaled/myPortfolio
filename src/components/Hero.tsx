import { motion } from 'framer-motion'
import { useState, useEffect, useMemo, memo, FC, useCallback } from 'react'
import { ArrowDown, Download, Github, Linkedin, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useLanguage } from './LanguageProvider'

interface SocialLinkProps {
  icon: FC<{ className?: string }>
  href: string
  label: string
  newTab?: boolean
}

const SocialLink: FC<SocialLinkProps> = memo(({ icon: Icon, href, label, newTab }) => (
  <motion.a
    href={href}
    target={newTab && !href.startsWith('mailto:') ? '_blank' : undefined}
    rel={newTab && !href.startsWith('mailto:') ? 'noopener noreferrer' : undefined}
    whileHover={{ scale: 1.1, y: -2 }}
    whileTap={{ scale: 0.95 }}
    className="grid h-11 w-11 place-items-center rounded-full border border-border bg-card/70 text-muted-foreground backdrop-blur-sm transition-colors duration-300 hover:border-primary/50 hover:text-primary"
    aria-label={label}
  >
    <Icon className="h-5 w-5" />
  </motion.a>
))

const Hero = () => {
  const { t } = useLanguage()
  const [isSmallHeight, setIsSmallHeight] = useState(false)

  const checkHeight = useCallback(() => {
    setIsSmallHeight(window.innerHeight <= 701)
  }, [])

  useEffect(() => {
    checkHeight()
    window.addEventListener('resize', checkHeight)
    return () => window.removeEventListener('resize', checkHeight)
  }, [checkHeight])

  const variants = useMemo(
    () => ({
      container: {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { delayChildren: 0.2, staggerChildren: 0.12 } },
      },
      item: {
        hidden: { y: 24, opacity: 0 },
        visible: { y: 0, opacity: 1 },
      },
    }),
    [],
  )

  const socialLinks = useMemo(
    () => [
      { icon: Github, href: 'https://github.com/GhassanAbuKhaled', label: 'GitHub', newTab: true },
      { icon: Linkedin, href: 'https://www.linkedin.com/in/ghassanabukhaled', label: 'LinkedIn', newTab: true },
      { icon: Mail, href: 'mailto:ghassan.adnanabukhaled@gmail.com', label: 'Email' },
    ],
    [],
  )

  const nameGradient =
    'block animate-gradient-text bg-gradient-to-r from-primary via-foreground to-primary bg-clip-text text-transparent'

  return (
    <section
      id="home"
      className="relative flex min-h-screen items-center overflow-hidden pt-24 md:pt-20"
    >
      {/* Atmosphere: aurora blobs + blueprint grid */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute -left-32 -top-40 h-[640px] w-[640px] rounded-full bg-primary/20 blur-[130px]" />
        <div className="absolute -bottom-40 right-0 h-[560px] w-[560px] rounded-full bg-[hsl(var(--hero-gradient-to))]/15 blur-[130px]" />
        <div className="bg-grid-faint absolute inset-0 opacity-50" />
      </div>

      <div className="container relative z-10 mx-auto px-4">
        <div className="mx-auto max-w-6xl">
          <motion.div
            variants={variants.container}
            initial="hidden"
            animate="visible"
            className="max-w-4xl"
          >
          {/* Status pill */}
          <motion.div variants={variants.item} className="mb-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1.5 text-sm font-medium text-emerald-600 dark:text-emerald-400">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75 motion-reduce:hidden" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              {t('about.availabilityValue')}
            </span>
          </motion.div>

          {/* Greeting */}
          <motion.div variants={variants.item} className="mb-3">
            <span className="text-lg font-medium text-primary">{t('hero.greeting')}</span>
          </motion.div>

          {/* Name */}
          <motion.h1
            variants={variants.item}
            className="mb-6 text-5xl font-bold uppercase leading-[0.92] tracking-tight sm:text-7xl lg:text-8xl"
          >
            <span className={nameGradient}>Ghassan</span>
            <span className={nameGradient}>Abu Khaled</span>
          </motion.h1>

          {/* Role */}
          <motion.div variants={variants.item} className="mb-5 text-xl font-semibold text-foreground md:text-2xl">
            {t('hero.title')}
          </motion.div>

          {/* Description */}
          <motion.p
            variants={variants.item}
            className="mb-9 max-w-xl text-lg leading-relaxed text-muted-foreground"
          >
            {t('hero.description')}
          </motion.p>

          {/* CTAs */}
          <motion.div variants={variants.item} className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center">
            <Button asChild variant="glow" size="lg" className="group">
              <motion.a href="#projects" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                {t('hero.viewWork')}
                <ArrowDown className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-y-0.5" />
              </motion.a>
            </Button>

            <Button asChild variant="outline" size="lg" className="group">
              <motion.a href="/resume.pdf" download whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                {t('hero.downloadResume')}
                <Download className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-y-0.5" />
              </motion.a>
            </Button>
          </motion.div>

          {/* Socials */}
          <motion.div variants={variants.item} className="flex gap-3">
            {socialLinks.map((link) => (
              <SocialLink key={link.label} {...link} />
            ))}
          </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className={`absolute bottom-2 ${isSmallHeight ? 'right-4' : 'left-1/2 -translate-x-1/2'}`}
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="flex h-10 w-6 justify-center rounded-full border-2 border-muted-foreground"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="mt-2 h-3 w-1 rounded-full bg-muted-foreground"
          />
        </motion.div>
      </motion.div>
    </section>
  )
}

export default Hero
