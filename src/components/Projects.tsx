import { motion, useInView } from 'framer-motion'
import { useRef, useMemo, memo, useState, useEffect, FC } from 'react'
import { ExternalLink, Code2, ArrowRight, Calendar, Building2, UserRound, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/components/LanguageProvider'
import { ImageWithLoading } from '@/components/ui/image-with-loading'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  type CarouselApi,
} from '@/components/ui/carousel'
import { cn } from '@/lib/utils'

interface Project {
  id: number
  titleKey: string
  descriptionKey: string
  longDescriptionKey: string
  image: string
  imageType?: string
  images?: string[]
  technologies: string[]
  githubUrl: string
  appStoreUrl?: string
  liveUrl: string
  date: string
  place: string
  role: string
  featured: boolean
  isEducational?: boolean
}

type TFn = (key: string) => string

// Official Apple logo (lucide's "Apple" is a fruit, not the brand mark)
const AppleIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
    <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701z" />
  </svg>
)

const ProjectGallery: FC<{ images: string[]; alt: string }> = ({ images, alt }) => {
  const [api, setApi] = useState<CarouselApi>()
  const [selected, setSelected] = useState(0)

  useEffect(() => {
    if (!api) return
    const onSelect = () => setSelected(api.selectedScrollSnap())
    onSelect()
    api.on('select', onSelect)
    api.on('reInit', onSelect)
    return () => {
      api.off('select', onSelect)
      api.off('reInit', onSelect)
    }
  }, [api])

  return (
    <div className="relative w-full">
      <Carousel setApi={setApi} opts={{ loop: true }} className="w-full">
        <CarouselContent className="ml-0">
          {images.map((src, i) => (
            <CarouselItem key={src} className="pl-0">
              {/* Backdrop stays light in both themes — it matches the screenshots' own background */}
              <div className="flex aspect-video w-full items-center justify-center overflow-hidden bg-gradient-to-b from-[#eef2ee] to-[#dde7de]">
                <img
                  src={src}
                  alt={`${alt} — screenshot ${i + 1} of ${images.length}`}
                  loading="lazy"
                  className="h-full w-auto object-contain"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-2 border-0 bg-background/70 text-foreground shadow-sm backdrop-blur-sm hover:bg-background hover:text-foreground" />
        <CarouselNext className="right-2 border-0 bg-background/70 text-foreground shadow-sm backdrop-blur-sm hover:bg-background hover:text-foreground" />
      </Carousel>
      <div className="absolute bottom-2.5 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1.5">
        {images.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => api?.scrollTo(i)}
            aria-label={`Go to screenshot ${i + 1}`}
            className={cn(
              'h-1.5 rounded-full transition-all duration-300',
              selected === i ? 'w-5 bg-primary' : 'w-1.5 bg-foreground/25 hover:bg-foreground/50',
            )}
          />
        ))}
      </div>
    </div>
  )
}

const Meta: FC<{ icon: FC<{ className?: string }>; text: string }> = ({ icon: Icon, text }) => (
  <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
    <Icon className="h-3.5 w-3.5 text-primary/70" />
    {text}
  </span>
)

const MetaRow: FC<{ project: Project }> = ({ project }) => (
  <div className="flex flex-wrap gap-x-4 gap-y-1.5">
    <Meta icon={Calendar} text={project.date} />
    <Meta icon={Building2} text={project.place} />
    <Meta icon={UserRound} text={project.role} />
  </div>
)

const TechChips: FC<{ items: string[] }> = ({ items }) => (
  <div className="flex flex-wrap gap-2">
    {items.map((tech) => (
      <span key={tech} className="rounded-md bg-primary/10 px-2 py-1 text-sm text-primary">
        {tech}
      </span>
    ))}
  </div>
)

const IconLink: FC<{ href: string; label: string; children: React.ReactNode }> = ({ href, label, children }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={label}
    className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
  >
    {children}
  </a>
)

const ProjectLinks: FC<{ project: Project }> = ({ project }) => (
  <div className="flex shrink-0 gap-1">
    {project.githubUrl && (
      <IconLink href={project.githubUrl} label="GitHub">
        <Code2 className="h-4 w-4" />
      </IconLink>
    )}
    {project.appStoreUrl ? (
      <IconLink href={project.appStoreUrl} label="Download on the App Store">
        <AppleIcon className="h-4 w-4" />
      </IconLink>
    ) : (
      <IconLink href={project.liveUrl} label="Live Demo">
        <ExternalLink className="h-4 w-4" />
      </IconLink>
    )}
  </div>
)

const CARD = 'rounded-2xl border border-border bg-card/70 backdrop-blur-sm transition-all duration-300 hover:border-primary/50 hover:shadow-glow'

/* ── Flagship feature card ─────────────────────────────────── */
const FeatureCard: FC<{ project: Project; t: TFn }> = memo(({ project, t }) => (
  <div className={`group grid overflow-hidden lg:grid-cols-2 ${CARD}`}>
    <div className="relative flex items-center bg-muted/30">
      <span className="absolute left-4 top-4 z-10 inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground shadow-glow">
        <Star className="h-3 w-3 fill-current" />
        {t('projects.featured')}
      </span>
      {project.images && project.images.length > 1 ? (
        <ProjectGallery images={project.images} alt={t(project.titleKey)} />
      ) : (
        <div className="aspect-video w-full overflow-hidden">
          <ImageWithLoading src={project.image} alt={t(project.titleKey)} className="h-full w-full object-cover" loadingSize="lg" />
        </div>
      )}
    </div>

    <div className="flex flex-col justify-center gap-4 p-7 md:p-9">
      <h3 className="text-2xl font-bold md:text-3xl">{t(project.titleKey)}</h3>
      <MetaRow project={project} />
      <p className="leading-relaxed text-muted-foreground">{t(project.longDescriptionKey)}</p>
      <TechChips items={project.technologies} />
      <div className="flex flex-wrap items-center gap-3 pt-1">
        <Button variant="glow" size="lg" asChild>
          <a href={project.appStoreUrl || project.liveUrl} target="_blank" rel="noopener noreferrer">
            {project.appStoreUrl ? (
              <>
                <AppleIcon className="mr-2 h-4 w-4" />
                {t('projects.appStore')}
              </>
            ) : (
              <>
                {t('projects.viewProject')}
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </a>
        </Button>
        {project.appStoreUrl && project.liveUrl && (
          <Button variant="outline" size="lg" asChild>
            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="mr-2 h-4 w-4" />
              {t('projects.liveSite')}
            </a>
          </Button>
        )}
      </div>
    </div>
  </div>
))

/* ── Standard project card ─────────────────────────────────── */
const ProjectCard: FC<{ project: Project; t: TFn }> = memo(({ project, t }) => (
  <div className={`group flex h-full flex-col overflow-hidden ${CARD}`}>
    {project.images && project.images.length > 1 ? (
      <ProjectGallery images={project.images} alt={t(project.titleKey)} />
    ) : (
      <div className="aspect-video overflow-hidden">
        {project.imageType === 'file' ? (
          <ImageWithLoading
            src={project.image}
            alt={t(project.titleKey)}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loadingSize="lg"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20">
            <div className="text-6xl">{project.image}</div>
          </div>
        )}
      </div>
    )}

    <div className="flex flex-1 flex-col p-6">
      <div className="mb-3 flex items-start justify-between gap-3">
        <h3 className="text-xl font-semibold">{t(project.titleKey)}</h3>
        <ProjectLinks project={project} />
      </div>
      <div className="mb-4">
        <MetaRow project={project} />
      </div>
      <p className="mb-5 text-sm leading-relaxed text-muted-foreground">{t(project.longDescriptionKey)}</p>
      <div className="mt-auto space-y-4">
        <TechChips items={project.technologies} />
        <Button variant="outline" className="group/btn w-full" asChild>
          <a href={project.appStoreUrl || project.liveUrl} target="_blank" rel="noopener noreferrer">
            {t('projects.viewProject')}
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
          </a>
        </Button>
      </div>
    </div>
  </div>
))

/* ── Compact practice card ─────────────────────────────────── */
const CompactCard: FC<{ project: Project; t: TFn }> = memo(({ project, t }) => (
  <a
    href={project.liveUrl}
    target="_blank"
    rel="noopener noreferrer"
    className={`group block overflow-hidden ${CARD}`}
  >
    <div className="aspect-video overflow-hidden">
      <ImageWithLoading
        src={project.image}
        alt={t(project.titleKey)}
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        loadingSize="md"
      />
    </div>
    <div className="flex items-center justify-between gap-2 p-4">
      <div className="min-w-0">
        <h4 className="truncate font-semibold">{t(project.titleKey)}</h4>
        <p className="truncate text-xs text-muted-foreground">{project.technologies.slice(0, 3).join(' · ')}</p>
      </div>
      <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
    </div>
  </a>
))

const Projects = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  const { t } = useLanguage()

  const projects: Project[] = useMemo(
    () => [
      {
        id: 9,
        titleKey: 'project.lalisa.title',
        descriptionKey: 'project.lalisa.description',
        longDescriptionKey: 'project.lalisa.longDescription',
        image: `${import.meta.env.BASE_URL}images/projects/lalisa/01-scan.png`,
        imageType: 'file',
        images: [
          `${import.meta.env.BASE_URL}images/projects/lalisa/01-scan.png`,
          `${import.meta.env.BASE_URL}images/projects/lalisa/02-dashboard.png`,
          `${import.meta.env.BASE_URL}images/projects/lalisa/03-ai-chat.png`,
          `${import.meta.env.BASE_URL}images/projects/lalisa/04-insights.png`,
        ],
        technologies: ['React Native', 'Expo', 'TypeScript', 'Supabase', 'Gemini AI', 'RevenueCat'],
        githubUrl: '',
        appStoreUrl: 'https://apps.apple.com/us/app/lalisa/id6763659459',
        liveUrl: 'https://lalisa.app',
        date: '03/2026 - Present',
        place: 'Personal Project',
        role: 'Founder & Full Stack Developer',
        featured: true,
      },
      {
        id: 1,
        titleKey: 'project.taskManager.title',
        descriptionKey: 'project.taskManager.description',
        longDescriptionKey: 'project.taskManager.longDescription',
        image: `${import.meta.env.BASE_URL}images/projects/taskapp-welcome.png`,
        imageType: 'file',
        technologies: ['React', 'TypeScript', 'Java', 'Spring Boot', 'MySQL', 'AWS EC2', 'AWS S3', 'Tailwind'],
        githubUrl: 'https://github.com/GhassanAbuKhaled/TaskFlow',
        liveUrl: 'https://ghassanabukhaled.github.io/TaskFlow/',
        date: '07/2025 - Present',
        place: 'Personal Project',
        role: 'Full Stack Developer',
        featured: true,
      },
      {
        id: 2,
        titleKey: 'project.lalissa.title',
        descriptionKey: 'project.lalissa.description',
        longDescriptionKey: 'project.lalissa.longDescription',
        image: `${import.meta.env.BASE_URL}images/projects/lalissa.png`,
        imageType: 'file',
        technologies: ['Vue 3', 'TypeScript', 'Socket.io', 'WebRTC', 'Bootstrap', 'Node.js'],
        githubUrl: 'https://github.com/GhassanAbuKhaled/lalissa-frontend',
        liveUrl: 'https://lalissa.onrender.com',
        date: '03/2024',
        place: 'Personal Project',
        role: 'Full Stack Developer',
        featured: true,
      },
      {
        id: 3,
        titleKey: 'project.lernplano.title',
        descriptionKey: 'project.lernplano.description',
        longDescriptionKey: 'project.lernplano.longDescription',
        image: `${import.meta.env.BASE_URL}images/projects/lernplano.png`,
        imageType: 'file',
        technologies: ['Vue.js', 'JavaScript', 'PDF Export', 'Web Application'],
        githubUrl: 'https://github.com/GhassanAbuKhaled/LernPlano',
        liveUrl: 'https://lernplano.onrender.com',
        date: '12/2023',
        place: 'University of Wuppertal (ZIM)',
        role: 'Intern Developer',
        featured: true,
      },
      {
        id: 4,
        titleKey: 'project.thesis.title',
        descriptionKey: 'project.thesis.description',
        longDescriptionKey: 'project.thesis.longDescription',
        image: `${import.meta.env.BASE_URL}images/projects/sparse-graphs.png`,
        imageType: 'file',
        technologies: ['C', 'JavaScript', 'Algorithms', 'Graph Theory', 'Data Structures'],
        githubUrl: 'https://github.com/GhassanAbuKhaled/GraphVisualisierung',
        liveUrl: 'https://graph-akjt.onrender.com',
        date: '09/2023 - 11/2023',
        place: 'University of Wuppertal',
        role: 'Bachelor Student',
        featured: true,
      },
      {
        id: 5,
        titleKey: 'project.isabel.title',
        descriptionKey: 'project.isabel.description',
        longDescriptionKey: 'project.isabel.longDescription',
        image: `${import.meta.env.BASE_URL}images/projects/Isabel.png`,
        imageType: 'file',
        technologies: ['HTML', 'CSS', 'JavaScript', 'Responsive Design'],
        githubUrl: 'https://github.com/GhassanAbuKhaled/isabelMercado',
        liveUrl: 'https://isabelmercado.onrender.com/',
        date: '08/2023',
        place: 'Personal Project',
        role: 'Frontend Developer',
        featured: true,
        isEducational: true,
      },
      {
        id: 6,
        titleKey: 'project.breakfastAlley.title',
        descriptionKey: 'project.breakfastAlley.description',
        longDescriptionKey: 'project.breakfastAlley.longDescription',
        image: `${import.meta.env.BASE_URL}images/projects/BreakfastAlley.png`,
        imageType: 'file',
        technologies: ['HTML', 'CSS', 'JavaScript', 'Responsive Design'],
        githubUrl: 'https://github.com/GhassanAbuKhaled/BreakfastAlley',
        liveUrl: 'https://breakfastalley.onrender.com',
        date: '07/2023',
        place: 'Personal Project',
        role: 'Frontend Developer',
        featured: true,
        isEducational: true,
      },
      {
        id: 7,
        titleKey: 'project.leslieBoatwright.title',
        descriptionKey: 'project.leslieBoatwright.description',
        longDescriptionKey: 'project.leslieBoatwright.longDescription',
        image: `${import.meta.env.BASE_URL}images/projects/leslieBoatwright.png`,
        imageType: 'file',
        technologies: ['HTML', 'CSS', 'JavaScript', 'Responsive Design'],
        githubUrl: 'https://github.com/GhassanAbuKhaled/leslieBoatwright',
        liveUrl: 'https://leslieboatwright.onrender.com',
        date: '07/2023',
        place: 'Personal Project',
        role: 'Frontend Developer',
        featured: true,
        isEducational: true,
      },
      {
        id: 8,
        titleKey: 'project.maxwell.title',
        descriptionKey: 'project.maxwell.description',
        longDescriptionKey: 'project.maxwell.longDescription',
        image: `${import.meta.env.BASE_URL}images/projects/maxwell.png`,
        imageType: 'file',
        technologies: ['HTML', 'CSS', 'JavaScript', 'Responsive Design'],
        githubUrl: 'https://github.com/GhassanAbuKhaled/maxwell',
        liveUrl: 'https://maxwell-xrwe.onrender.com',
        date: '06/2023',
        place: 'Personal Project',
        role: 'Frontend Developer',
        featured: true,
        isEducational: true,
      },
    ],
    [],
  )

  const { spotlight, mainProjects, practiceProjects } = useMemo(() => {
    const showcase = projects.filter((p) => !p.isEducational)
    return {
      spotlight: showcase[0],
      mainProjects: showcase.slice(1),
      practiceProjects: projects.filter((p) => p.isEducational),
    }
  }, [projects])

  const variants = useMemo(
    () => ({
      container: {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { delayChildren: 0.15, staggerChildren: 0.12 } },
      },
      item: { hidden: { y: 40, opacity: 0 }, visible: { y: 0, opacity: 1 } },
    }),
    [],
  )

  return (
    <section id="projects" className="bg-muted/30 py-20">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          variants={variants.container}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="mx-auto max-w-6xl"
        >
          {/* Header */}
          <motion.div variants={variants.item} className="mb-12 text-center">
            <h2 className="mb-4 text-4xl font-bold md:text-5xl">{t('projects.myTitle')}</h2>
            <p className="mx-auto max-w-2xl text-xl text-muted-foreground">{t('projects.subtitle')}</p>
          </motion.div>

          {/* Spotlight */}
          {spotlight && (
            <motion.div variants={variants.item} className="mb-8">
              <FeatureCard project={spotlight} t={t} />
            </motion.div>
          )}

          {/* Main grid */}
          <div className="mb-16 grid gap-6 lg:grid-cols-2">
            {mainProjects.map((project) => (
              <motion.div key={project.id} variants={variants.item}>
                <ProjectCard project={project} t={t} />
              </motion.div>
            ))}
          </div>

          {/* Practice & learning */}
          {practiceProjects.length > 0 && (
            <motion.div variants={variants.item}>
              <div className="mb-8 text-center">
                <h3 className="mb-2 text-2xl font-bold">{t('projects.practiceTitle')}</h3>
                <p className="text-muted-foreground">{t('projects.practiceSubtitle')}</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {practiceProjects.map((project) => (
                  <CompactCard key={project.id} project={project} t={t} />
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  )
}

export default Projects
