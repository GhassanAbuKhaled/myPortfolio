import { motion, useInView } from 'framer-motion'
import { useRef, useMemo, memo, useState, useEffect, FC } from 'react'
import { ExternalLink, Code2, ArrowRight, Apple } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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

interface ProjectCardProps {
  project: {
    id: number;
    titleKey: string;
    descriptionKey: string;
    longDescriptionKey: string;
    image: string;
    imageType?: string;
    images?: string[];
    technologies: string[];
    githubUrl: string;
    appStoreUrl?: string;
    liveUrl: string;
    date: string;
    place: string;
    role: string;
    featured: boolean;
    isEducational?: boolean;
  };
  t: (key: string) => string;
}

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
    <div className="relative">
      <Carousel setApi={setApi} opts={{ loop: true }} className="w-full">
        <CarouselContent className="ml-0">
          {images.map((src, i) => (
            <CarouselItem key={src} className="pl-0">
              {/* Backdrop stays light in both themes — it matches the screenshots' own background */}
              <div className="aspect-video w-full flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#eef2ee] to-[#dde7de]">
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
              selected === i ? 'w-5 bg-primary' : 'w-1.5 bg-foreground/25 hover:bg-foreground/50'
            )}
          />
        ))}
      </div>
    </div>
  )
}

const ProjectCard: FC<ProjectCardProps> = memo(({ project, t }) => (
  <Card className="overflow-hidden border-border hover:border-primary/50 transition-all duration-300 hover:shadow-glow flex flex-col">
    {project.images && project.images.length > 1 ? (
      <ProjectGallery images={project.images} alt={t(project.titleKey)} />
    ) : (
      <div className="aspect-video overflow-hidden">
        {project.imageType === "file" ? (
          <ImageWithLoading
            src={project.image}
            alt={t(project.titleKey)}
            className="w-full h-full object-cover"
            loadingSize="lg"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
            <div className="text-6xl">{project.image}</div>
          </div>
        )}
      </div>
    )}
    <CardHeader>
      <CardTitle className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xl">{t(project.titleKey)}</span>
          {project.isEducational && (
            <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded text-xs font-medium">
              Practice
            </span>
          )}
        </div>
        <div className="flex space-x-2">
          {project.githubUrl && (
            <Button variant="ghost" size="icon" asChild>
              <a href={project.githubUrl} aria-label="GitHub" target="_blank" rel="noopener noreferrer">
                <Code2 className="h-4 w-4" />
              </a>
            </Button>
          )}
          {project.appStoreUrl && (
            <Button variant="ghost" size="icon" asChild>
              <a href={project.appStoreUrl} aria-label="Download on the App Store" target="_blank" rel="noopener noreferrer">
                <Apple className="h-4 w-4" />
              </a>
            </Button>
          )}
          {!project.appStoreUrl && (
            <Button variant="ghost" size="icon" asChild>
              <a href={project.liveUrl} aria-label="Live Demo" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          )}
        </div>
      </CardTitle>
      <div className="mt-2">
        <div className="flex flex-col space-y-2 mb-4 text-base text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="font-medium">📅</span>
            <span>{project.date}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium">🏢</span>
            <span>{project.place}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium">👤</span>
            <span>{project.role}</span>
          </div>
        </div>
        <CardDescription className="text-base">{t(project.longDescriptionKey)}</CardDescription>
      </div>
    </CardHeader>
    <CardContent>
      <div className="flex flex-wrap gap-2 mb-4">
        {project.technologies.map((tech) => (
          <span
            key={tech}
            className="px-2 py-1 bg-primary/10 text-primary rounded-md text-sm"
          >
            {tech}
          </span>
        ))}
      </div>
      <Button variant="outline" className="w-full group" asChild>
        <a href={project.appStoreUrl || project.liveUrl} target="_blank" rel="noopener noreferrer">
          {t('projects.viewProject')}
          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </a>
      </Button>
    </CardContent>
  </Card>
));

const Projects = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  const { t } = useLanguage()

  const ProjectWithAnimation = ({ project, index }: { project: any, index: number }) => {
    const projectRef = useRef(null)
    const projectInView = useInView(projectRef, { once: true, margin: "0px" })
    
    return (
      <motion.div
        ref={projectRef}
        initial={{ y: 60, opacity: 0, scale: 0.95 }}
        animate={projectInView ? { y: 0, opacity: 1, scale: 1 } : { y: 60, opacity: 0, scale: 0.95 }}
        transition={{ 
          duration: 0.5, 
          delay: index * 0.05,
          ease: "easeOut",
          type: "tween"
        }}
        whileHover={{ y: -5, transition: { duration: 0.2 } }}
        className="group w-full md:max-w-2xl mx-auto lg:max-w-none"
      >
        <ProjectCard project={project} t={t} />
      </motion.div>
    )
  }

  const projects = [
    {
      id: 9,
      titleKey: "project.lalisa.title",
      descriptionKey: "project.lalisa.description",
      longDescriptionKey: "project.lalisa.longDescription",
      image: `${import.meta.env.BASE_URL}images/projects/lalisa/01-scan.png`,
      imageType: "file",
      images: [
        `${import.meta.env.BASE_URL}images/projects/lalisa/01-scan.png`,
        `${import.meta.env.BASE_URL}images/projects/lalisa/02-dashboard.png`,
        `${import.meta.env.BASE_URL}images/projects/lalisa/03-ai-chat.png`,
        `${import.meta.env.BASE_URL}images/projects/lalisa/04-insights.png`,
      ],
      technologies: ["React Native", "Expo", "TypeScript", "Supabase", "Gemini AI", "RevenueCat"],
      githubUrl: "",
      appStoreUrl: "https://apps.apple.com/us/app/lalisa/id6763659459",
      liveUrl: "https://lalisa.app",
      date: "03/2026 - Present",
      place: "Personal Project",
      role: "Founder & Full Stack Developer",
      featured: true
    },
    {
      id: 1,
      titleKey: "project.taskManager.title",
      descriptionKey: "project.taskManager.description",
      longDescriptionKey: "project.taskManager.longDescription",
      image: `${import.meta.env.BASE_URL}images/projects/taskapp-welcome.png`,
      imageType: "file",
      technologies: ["React", "TypeScript", "Java", "Spring Boot", "MySQL", "AWS EC2", "AWS S3", "Tailwind"],
      githubUrl: "https://github.com/GhassanAbuKhaled/TaskFlow",
      liveUrl: "https://ghassanabukhaled.github.io/TaskFlow/",
      date: "07/2025 - Present",
      place: "Personal Project",
      role: "Full Stack Developer",
      featured: true
    },
    {
      id: 2,
      titleKey: "project.lalissa.title",
      descriptionKey: "project.lalissa.description",
      longDescriptionKey: "project.lalissa.longDescription",
      image: `${import.meta.env.BASE_URL}images/projects/lalissa.png`,
      imageType: "file",
      technologies: ["Vue 3", "TypeScript", "Socket.io", "WebRTC", "Bootstrap", "Node.js"],
      githubUrl: "https://github.com/GhassanAbuKhaled/lalissa-frontend",
      liveUrl: "https://lalissa.onrender.com",
      date: "03/2024",
      place: "Personal Project",
      role: "Full Stack Developer",
      featured: true
    },
    {
      id: 3,
      titleKey: "project.lernplano.title",
      descriptionKey: "project.lernplano.description",
      longDescriptionKey: "project.lernplano.longDescription",
      image: `${import.meta.env.BASE_URL}images/projects/lernplano.png`,
      imageType: "file",
      technologies: ["Vue.js", "JavaScript", "PDF Export", "Web Application"],
      githubUrl: "https://github.com/GhassanAbuKhaled/LernPlano",
      liveUrl: "https://lernplano.onrender.com",
      date: "12/2023",
      place: "University of Wuppertal (ZIM)",
      role: "Intern Developer",
      featured: true
    },
    {
      id: 4,
      titleKey: "project.thesis.title",
      descriptionKey: "project.thesis.description",
      longDescriptionKey: "project.thesis.longDescription",
      image: `${import.meta.env.BASE_URL}images/projects/sparse-graphs.png`,
      imageType: "file",
      technologies: ["C", "JavaScript", "Algorithms", "Graph Theory", "Data Structures"],
      githubUrl: "https://github.com/GhassanAbuKhaled/GraphVisualisierung",
      liveUrl: "https://graph-akjt.onrender.com",
      date: "09/2023 - 11/2023",
      place: "University of Wuppertal",
      role: "Bachelor Student",
      featured: true
    },
    {
      id: 5,
      titleKey: "project.isabel.title",
      descriptionKey: "project.isabel.description",
      longDescriptionKey: "project.isabel.longDescription",
      image: `${import.meta.env.BASE_URL}images/projects/Isabel.png`,
      imageType: "file",
      technologies: ["HTML", "CSS", "JavaScript", "Responsive Design"],
      githubUrl: "https://github.com/GhassanAbuKhaled/isabelMercado",
      liveUrl: "https://isabelmercado.onrender.com/",
      date: "08/2023",
      place: "Personal Project",
      role: "Frontend Developer",
      featured: true,
      isEducational: true
    },
    {
      id: 6,
      titleKey: "project.breakfastAlley.title",
      descriptionKey: "project.breakfastAlley.description",
      longDescriptionKey: "project.breakfastAlley.longDescription",
      image: `${import.meta.env.BASE_URL}images/projects/BreakfastAlley.png`,
      imageType: "file",
      technologies: ["HTML", "CSS", "JavaScript", "Responsive Design"],
      githubUrl: "https://github.com/GhassanAbuKhaled/BreakfastAlley",
      liveUrl: "https://breakfastalley.onrender.com",
      date: "07/2023",
      place: "Personal Project",
      role: "Frontend Developer",
      featured: true,
      isEducational: true
    },
    {
      id: 7,
      titleKey: "project.leslieBoatwright.title",
      descriptionKey: "project.leslieBoatwright.description",
      longDescriptionKey: "project.leslieBoatwright.longDescription",
      image: `${import.meta.env.BASE_URL}images/projects/leslieBoatwright.png`,
      imageType: "file",
      technologies: ["HTML", "CSS", "JavaScript", "Responsive Design"],
      githubUrl: "https://github.com/GhassanAbuKhaled/leslieBoatwright",
      liveUrl: "https://leslieboatwright.onrender.com",
      date: "07/2023",
      place: "Personal Project",
      role: "Frontend Developer",
      featured: true,
      isEducational: true
    },
    {
      id: 8,
      titleKey: "project.maxwell.title",
      descriptionKey: "project.maxwell.description",
      longDescriptionKey: "project.maxwell.longDescription",
      image: `${import.meta.env.BASE_URL}images/projects/maxwell.png`,
      imageType: "file",
      technologies: ["HTML", "CSS", "JavaScript", "Responsive Design"],
      githubUrl: "https://github.com/GhassanAbuKhaled/maxwell",
      liveUrl: "https://maxwell-xrwe.onrender.com",
      date: "06/2023",
      place: "Personal Project",
      role: "Frontend Developer",
      featured: true,
      isEducational: true
    },
  ]

  // All projects are now featured
  const allProjects = useMemo(() => projects, [projects])

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
    <section id="projects" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="max-w-7xl mx-auto"
        >


          {/* Projects Header */}
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">{t('projects.myTitle')}</h2>
            <p className="text-xl text-muted-foreground">
              {t('projects.subtitle')}
            </p>
          </motion.div>

          {/* All Projects */}
          <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            {allProjects.map((project, index) => (
              <ProjectWithAnimation key={project.id} project={project} index={index} />
            ))}
          </div>

        </motion.div>
      </div>
    </section>
  )
}

export default Projects