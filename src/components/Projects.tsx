import { motion, useInView } from 'framer-motion'
import { useRef, useMemo, memo, FC } from 'react'
import { ExternalLink, Code2, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useLanguage } from '@/components/LanguageProvider'
import { ImageWithLoading } from '@/components/ui/image-with-loading'

interface ProjectCardProps {
  project: {
    id: number;
    titleKey: string;
    descriptionKey: string;
    longDescriptionKey: string;
    image: string;
    imageType?: string;
    technologies: string[];
    githubUrl: string;
    liveUrl: string;
    date: string;
    place: string;
    role: string;
    featured: boolean;
  };
  t: (key: string) => string;
}

const ProjectCard: FC<ProjectCardProps> = memo(({ project, t }) => (
  <Card className="overflow-hidden border-border hover:border-primary/50 transition-all duration-300 hover:shadow-glow flex flex-col">
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
    <CardHeader>
      <CardTitle className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <span className="text-xl">{t(project.titleKey)}</span>
        <div className="flex space-x-2">
          <Button variant="ghost" size="icon" asChild>
            <a href={project.githubUrl} aria-label="GitHub" target="_blank" rel="noopener noreferrer">
              <Code2 className="h-4 w-4" />
            </a>
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <a href={project.liveUrl} aria-label="Live Demo" target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
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
        <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
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

  const projects = [
    {
      id: 1,
      titleKey: "project.taskManager.title",
      descriptionKey: "project.taskManager.description",
      longDescriptionKey: "project.taskManager.longDescription",
      image: "/images/projects/taskapp-welcome.png",
      imageType: "file",
      technologies: ["React", "TypeScript", "Framer Motion", "Tailwind"],
      githubUrl: "https://github.com/GhassanAbuKhaled/TaskFlow",
      liveUrl: "https://taskflow.ghassanabukhaled.com/",
      date: "07/2025 - Present",
      place: "Personal Project",
      role: "Full Stack Developer",
      featured: true
    },
    {
      id: 2,
      titleKey: "project.thesis.title",
      descriptionKey: "project.thesis.description",
      longDescriptionKey: "project.thesis.longDescription",
      image: "/images/projects/sparse-graphs.png",
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
      id: 3,
      titleKey: "project.lernplano.title",
      descriptionKey: "project.lernplano.description",
      longDescriptionKey: "project.lernplano.longDescription",
      image: "/images/projects/lernplano.png",
      imageType: "file",
      technologies: ["Vue.js", "JavaScript", "PDF Export", "Web Application"],
      githubUrl: "https://github.com/GhassanAbuKhaled/LernPlano",
      liveUrl: "https://lernplano.onrender.com",
      date: "05/2022 - 08/2022",
      place: "University of Wuppertal (ZIM)",
      role: "Intern Developer",
      featured: true
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
            {allProjects.map((project) => (
              <motion.div
                key={project.id}
                variants={itemVariants}
                className="group w-full md:max-w-2xl mx-auto lg:max-w-none"
              >
                <ProjectCard project={project} t={t} />
              </motion.div>
            ))}
          </div>

        </motion.div>
      </div>
    </section>
  )
}

export default Projects