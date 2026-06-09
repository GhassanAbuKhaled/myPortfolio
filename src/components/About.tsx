import { motion, useInView } from 'framer-motion'
import { useRef, useMemo, memo, FC } from 'react'
import { Coffee, Zap, FolderOpen, MapPin, Code } from 'lucide-react'
import { useLanguage } from './LanguageProvider'

const TILE = 'rounded-2xl border border-border bg-card/70 backdrop-blur-sm transition-colors hover:border-primary/50'

const itemVariant = {
  hidden: { y: 40, opacity: 0 },
  visible: { y: 0, opacity: 1 },
}

interface StatTileProps {
  icon: FC<{ className?: string }>
  value: string
  label: string
}

const StatTile: FC<StatTileProps> = memo(({ icon: Icon, value, label }) => (
  <motion.div variants={itemVariant} className={`${TILE} flex flex-col items-center justify-center gap-2 p-6 text-center`}>
    <Icon className="h-7 w-7 text-primary" />
    <div className="text-3xl font-bold text-foreground">{value}</div>
    <div className="text-xs text-muted-foreground">{label}</div>
  </motion.div>
))

const About = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  const { t } = useLanguage()

  const containerVariant = useMemo(
    () => ({
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { delayChildren: 0.2, staggerChildren: 0.1 } },
    }),
    [],
  )

  const stats = useMemo(
    () => [
      { icon: Coffee, value: '1000+', label: t('about.stats.coffee') },
      { icon: Zap, value: '3+', label: t('about.stats.years') },
      { icon: FolderOpen, value: '9', label: t('about.stats.projects') },
    ],
    [t],
  )

  return (
    <section id="about" className="bg-muted/30 py-20">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          variants={containerVariant}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="mx-auto max-w-6xl"
        >
          <motion.div variants={itemVariant} className="mb-12 text-center">
            <h2 className="mb-4 text-4xl font-bold md:text-5xl">{t('about.title')}</h2>
            <p className="mx-auto max-w-2xl text-xl text-muted-foreground">{t('about.subtitle')}</p>
          </motion.div>

          <div className="space-y-4">
            {/* Top band: portrait + bio */}
            <div className="grid gap-4 md:grid-cols-2">
              {/* Portrait */}
              <motion.div
                variants={itemVariant}
                className="group relative min-h-[380px] overflow-hidden rounded-2xl border border-border"
              >
                <img
                  src={`${import.meta.env.BASE_URL}images/profile/me.jpg`}
                  alt="Ghassan Abu Khaled"
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover object-[center_30%] transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/15 px-3 py-1.5 text-sm font-medium text-primary backdrop-blur-sm">
                    <Code className="h-3.5 w-3.5" />
                    {t('hero.title')}
                  </span>
                </div>
              </motion.div>

              {/* Bio */}
              <motion.div variants={itemVariant} className={`${TILE} flex flex-col justify-center gap-4 p-8`}>
                <span className="h-1 w-12 rounded-full bg-primary" />
                <h3 className="text-2xl font-semibold leading-snug">{t('about.intro')}</h3>
                <p className="leading-relaxed text-muted-foreground">{t('about.paragraph1')}</p>
                <p className="leading-relaxed text-muted-foreground">{t('about.paragraph2')}</p>
              </motion.div>
            </div>

            {/* Stats band */}
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              {stats.map(({ icon, value, label }) => (
                <StatTile key={label} icon={icon} value={value} label={label} />
              ))}

              {/* Availability */}
              <motion.div variants={itemVariant} className={`${TILE} flex flex-col justify-center gap-3 p-6`}>
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {t('about.availability')}
                </span>
                <div className="flex items-center gap-2.5">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75 motion-reduce:hidden" />
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  </span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                    {t('about.availabilityValue')}
                  </span>
                </div>
              </motion.div>
            </div>

            {/* Location */}
            <motion.div variants={itemVariant} className={`${TILE} relative flex items-center gap-4 overflow-hidden p-6`}>
              <div className="bg-grid-faint pointer-events-none absolute inset-0 opacity-40" aria-hidden />
              <div className="relative grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                <MapPin className="h-5 w-5" />
              </div>
              <div className="relative">
                <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {t('about.location')}
                </div>
                <div className="font-semibold">{t('about.locationValue')}</div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default About
