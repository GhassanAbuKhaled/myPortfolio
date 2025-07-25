import { motion, useInView } from 'framer-motion'
import { useRef, useMemo, memo, FC } from 'react'
import { Award, ExternalLink, Calendar, Building, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useLanguage } from './LanguageProvider'

interface CertificationCardProps {
  certification: {
    id: string;
    titleKey: string;
    issuerKey: string;
    dateKey: string;
    descriptionKey: string;
    certificateUrl?: string;
  };
  t: (key: string) => string;
}

const CertificationCard: FC<CertificationCardProps> = memo(({ certification, t }) => (
  <Card className="border-border hover:border-primary/50 transition-all duration-300 hover:shadow-glow">
    <CardHeader>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <CardTitle className="flex items-center gap-2 mb-2">
            <Award className="h-5 w-5 text-primary" />
            <span className="text-xl">{t(certification.titleKey)}</span>
          </CardTitle>
          <div className="space-y-1 text-base text-muted-foreground">
            <div className="flex items-center gap-2">
              <Building className="h-4 w-4" />
              <span>{t(certification.issuerKey)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{t(certification.dateKey)}</span>
            </div>
          </div>
        </div>
        {certification.certificateUrl && (
          <Button variant="ghost" size="icon" asChild>
            <a 
              href={certification.certificateUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              aria-label={t('certifications.viewCertificate')}
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
        )}
      </div>
    </CardHeader>
    <CardContent>
      <CardDescription className="text-lg leading-relaxed">
        {t(certification.descriptionKey)}
      </CardDescription>
      {certification.certificateUrl && (
        <Button variant="outline" className="w-full group mt-4" asChild>
          <a href={certification.certificateUrl} target="_blank" rel="noopener noreferrer">
            {t('certifications.viewCertificate')}
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </Button>
      )}
    </CardContent>
  </Card>
));

const Certifications = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  const { t } = useLanguage()

  const certifications = useMemo(() => [
    {
      id: 'amazon-junior-dev',
      titleKey: 'certifications.amazonJuniorDev.title',
      issuerKey: 'certifications.amazonJuniorDev.issuer',
      dateKey: 'certifications.amazonJuniorDev.date',
      descriptionKey: 'certifications.amazonJuniorDev.description',
      certificateUrl: 'https://coursera.org/share/c1c2ef5d7efe51c911c240b186ed31e9'
    }
  ], [])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  }

  return (
    <section id="certifications" className="py-20 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="max-w-6xl mx-auto"
        >
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">{t('certifications.title')}</h2>
            <p className="text-xl text-muted-foreground">
              {t('certifications.subtitle')}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-8">
            {certifications.map((certification) => (
              <motion.div
                key={certification.id}
                variants={itemVariants}
                className="w-full md:max-w-2xl mx-auto lg:max-w-none"
              >
                <CertificationCard certification={certification} t={t} />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Certifications