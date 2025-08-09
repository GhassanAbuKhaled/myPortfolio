import { motion, useInView } from 'framer-motion'
import { useRef, useMemo, memo, FC, useCallback } from 'react'
import { Code, Coffee, Zap, FolderOpen } from 'lucide-react'
import { useLanguage } from './LanguageProvider'
import { ImageWithLoading } from './ui/image-with-loading'

interface StatItemProps {
  icon: FC<{ className?: string }>
  value: string
  label: string
}

const StatItem: FC<StatItemProps> = memo(({ icon: Icon, value, label }) => (
  <motion.div
    variants={{
      hidden: { y: 50, opacity: 0 },
      visible: { y: 0, opacity: 1 }
    }}
    className="text-center p-6 rounded-xl bg-card border border-border hover:border-primary/50 transition-colors w-[calc(50%-1rem)] md:w-[220px]"
  >
    <Icon className="h-8 w-8 text-primary mx-auto mb-4" />
    <div className="text-3xl font-bold text-foreground mb-2">{value}</div>
    <div className="text-sm text-muted-foreground">{label}</div>
  </motion.div>
));

interface InfoItemProps {
  label: string
  value: string
  className: string
}

const InfoItem: FC<InfoItemProps> = memo(({ label, value, className }) => (
  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
    <span className="font-medium">{label}</span>
    <span className={className}>{value}</span>
  </div>
));

const About = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  const { t } = useLanguage()

  const animations = useMemo(() => ({
    container: {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          delayChildren: 0.3,
          staggerChildren: 0.2
        }
      }
    },
    item: {
      hidden: { y: 50, opacity: 0 },
      visible: { y: 0, opacity: 1 }
    }
  }), [])

  const stats = useMemo(() => [
    { icon: Coffee, value: "1000+", label: t('about.stats.coffee') },
    { icon: Zap, value: "2+", label: t('about.stats.years') },
    { icon: FolderOpen, value: "7", label: t('about.stats.projects') },
  ], [t])

  const infoItems = useMemo(() => [
    { key: 'location', valueKey: 'locationValue', className: 'text-muted-foreground' },
    { key: 'experience', valueKey: 'experienceValue', className: 'text-muted-foreground' },
    { key: 'availability', valueKey: 'availabilityValue', className: 'text-primary' },
  ], [])

  return (
    <section id="about" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          variants={animations.container}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="max-w-6xl mx-auto"
        >
          <motion.div variants={animations.item} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">{t('about.title')}</h2>
            <p className="text-xl text-muted-foreground">
              {t('about.subtitle')}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <motion.div variants={animations.item}>
              <div className="aspect-square bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl overflow-hidden">
                <ImageWithLoading 
                  src="/images/profile/me.jpg" 
                  alt="Ghassan Abu Khaled" 
                  className="w-full h-full object-cover"
                  loadingSize="lg"
                />
              </div>
            </motion.div>

            <motion.div variants={animations.item} className="space-y-6">
              <h3 className="text-2xl font-semibold">
                {t('about.intro')}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {t('about.paragraph1')}
              </p>
              <p className="text-muted-foreground leading-relaxed">
                {t('about.paragraph2')}
              </p>
              <div className="space-y-4">
                {infoItems.map(({ key, valueKey, className }) => (
                  <InfoItem
                    key={key}
                    label={t(`about.${key}`)}
                    value={t(`about.${valueKey}`)}
                    className={className}
                  />
                ))}
              </div>
            </motion.div>
          </div>

          {/* Stats */}
          <motion.div variants={animations.item} className="flex flex-wrap justify-center gap-8">
            {stats.map(({ icon, value, label }) => (
              <StatItem key={label} icon={icon} value={value} label={label} />
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default About