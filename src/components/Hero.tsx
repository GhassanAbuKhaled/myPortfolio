import { motion } from 'framer-motion'
import { useState, useEffect, useMemo, memo, FC, useCallback } from 'react'
import { ArrowDown, Github, Linkedin, Mail } from 'lucide-react'
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
    target={newTab && !href.startsWith('mailto:') ? "_blank" : undefined}
    rel={newTab && !href.startsWith('mailto:') ? "noopener noreferrer" : undefined}
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.95 }}
    className="p-3 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-all duration-300"
    aria-label={label}
  >
    <Icon className="h-6 w-6" />
  </motion.a>
));

interface BackgroundParticleProps {
  index: number
}

const BackgroundParticle: FC<BackgroundParticleProps> = memo(({ index }) => {
  const random = useMemo(() => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: Math.random() * 10 + 20
  }), []);

  return (
    <motion.div
      className="absolute w-2 h-2 bg-primary/20 rounded-full"
      initial={{ x: `${random.x}vw`, y: `${random.y}vh` }}
      animate={{ 
        x: [`${random.x}vw`, `${(random.x + 50) % 100}vw`],
        y: [`${random.y}vh`, `${(random.y + 50) % 100}vh`]
      }}
      transition={{
        duration: random.duration,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "linear"
      }}
    />
  );
});

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
  
  const variants = useMemo(() => ({
    container: {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: { delayChildren: 0.3, staggerChildren: 0.2 }
      }
    },
    item: {
      hidden: { y: 20, opacity: 0 },
      visible: { y: 0, opacity: 1 }
    }
  }), [])

  const socialLinks = useMemo(() => [
    { icon: Github, href: 'https://github.com/GhassanAbuKhaled', label: 'GitHub', newTab: true },
    { icon: Linkedin, href: 'https://www.linkedin.com/in/ghassanabukhaled', label: 'LinkedIn', newTab: true },
    { icon: Mail, href: 'mailto:ghassan.adnanabukhaled@gmail.com', label: 'Email' }
  ], [])

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16 md:pt-20">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-hero-gradient opacity-10" />
      
      {/* Animated background particles */}
      <div className="absolute inset-0">
        {Array.from({ length: 12 }).map((_, i) => (
          <BackgroundParticle key={i} index={i} />
        ))}
      </div>

      <div className="container mx-auto px-4 z-10 mt-4 sm:mt-0">
        <motion.div
          variants={variants.container}
          initial="hidden"
          animate="visible"
          className="text-center max-w-4xl mx-auto"
        >
          <motion.div variants={variants.item} className="mb-3">
            <span className="text-primary font-medium text-lg">{t('hero.greeting')}</span>
          </motion.div>

          <motion.h1 
            variants={variants.item}
            className="text-4xl sm:text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent"
          >
            {t('hero.name')}
          </motion.h1>

          <motion.div variants={variants.item} className="mb-6">
            <h2 className="text-2xl md:text-3xl text-muted-foreground mb-4">
              {t('hero.title')}
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              {t('hero.description')}
            </p>
          </motion.div>

          <motion.div variants={variants.item} className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button asChild variant="glow" size="lg" className="group">
              <motion.a 
                href="#projects"
                whileHover={{ scale: 1.02 }} 
                whileTap={{ scale: 0.98 }}
              >
                {t('hero.viewWork')}
                <ArrowDown className="ml-2 h-4 w-4" />
              </motion.a>
            </Button>
            
            <Button asChild variant="outline" size="lg">
              <motion.a 
                href="/resume.pdf" 
                download
                whileHover={{ scale: 1.02 }} 
                whileTap={{ scale: 0.98 }}
              >
                {t('hero.downloadResume')}
              </motion.a>
            </Button>
          </motion.div>

          <motion.div variants={variants.item} className="flex justify-center space-x-4 sm:space-x-6">
            {socialLinks.map((link) => (
              <SocialLink key={link.label} {...link} />
            ))}
          </motion.div>
        </motion.div>
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
          className="w-6 h-10 border-2 border-muted-foreground rounded-full flex justify-center"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1 h-3 bg-muted-foreground rounded-full mt-2"
          />
        </motion.div>
      </motion.div>
    </section>
  )
}

export default Hero