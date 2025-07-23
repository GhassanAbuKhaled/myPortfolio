import { motion, useInView } from 'framer-motion'
import { useRef, useState, useMemo } from 'react'
import { ExternalLink, Code2, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { scrollbarClasses } from '@/lib/scrollbar-utils'
import { useLanguage } from '@/components/LanguageProvider'
import { SectionDivider } from '@/components/ui/section-divider'

const ProjectCard = ({ project, t }) => (
  <Card className="h-full border-border hover:border-primary/50 transition-all duration-300">
    <CardHeader>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
        {project.imageType === "file" ? (
          <div className="w-12 h-12 flex items-center justify-center overflow-hidden rounded-md">
            <img src={project.image} alt={t(project.titleKey)} className="w-full h-full object-cover" />
          </div>
        ) : (
          <div className="text-3xl">{project.image}</div>
        )}
        <div className="flex space-x-2 mt-2 sm:mt-0">
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
      </div>
      <CardTitle>{t(project.titleKey)}</CardTitle>
      <CardDescription>{t(project.longDescriptionKey)}</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="flex flex-wrap gap-2">
        {project.technologies.map((tech) => (
          <span
            key={tech}
            className="px-2 py-1 bg-primary/10 text-primary rounded-md text-sm"
          >
            {tech}
          </span>
        ))}
      </div>
    </CardContent>
  </Card>
);

const Projects = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  const [showAllProjects, setShowAllProjects] = useState(false)
  const { t } = useLanguage()

  const projects = [
    {
      id: 1,
      titleKey: "project.ecommerce.title",
      descriptionKey: "project.ecommerce.description",
      longDescriptionKey: "project.ecommerce.longDescription",
      image: "🛒",
      technologies: ["React", "Node.js", "MongoDB", "Stripe", "Tailwind CSS"],
      githubUrl: "#",
      liveUrl: "#",
      featured: true
    },
    {
      id: 2,
      titleKey: "project.taskManager.title",
      descriptionKey: "project.taskManager.description",
      longDescriptionKey: "project.taskManager.longDescription",
      image: "/task-welcome.png",
      imageType: "file",
      technologies: ["React", "TypeScript", "Socket.io", "Express", "PostgreSQL"],
      githubUrl: "https://github.com/GhassanAbuKhaled/TaskFlow",
      liveUrl: "https://taskflow.ghassanabukhaled.com/",
      featured: true
    },
    {
      id: 3,
      titleKey: "project.thesis.title",
      descriptionKey: "project.thesis.description",
      longDescriptionKey: "project.thesis.longDescription",
      image: "📊",
      technologies: ["C", "JavaScript", "Algorithms", "Graph Theory", "Data Structures"],
      githubUrl: "https://github.com/GhassanAbuKhaled/GraphVisualisierung",
      liveUrl: "https://graph-akjt.onrender.com",
      featured: false
    },
    {
      id: 4,
      titleKey: "project.lernplano.title",
      descriptionKey: "project.lernplano.description",
      longDescriptionKey: "project.lernplano.longDescription",
      image: "📚",
      technologies: ["Vue.js", "JavaScript", "PDF Export", "Web Application"],
      githubUrl: "https://github.com/GhassanAbuKhaled/LernPlano",
      liveUrl: "https://lernplano.onrender.com",
      featured: false
    },
    {
      id: 5,
      titleKey: "project.personalProjects.title",
      descriptionKey: "project.personalProjects.description",
      longDescriptionKey: "project.personalProjects.longDescription",
      image: "🌟",
      technologies: ["HTML/CSS", "JavaScript", "React", "Responsive Design"],
      githubUrl: "#",
      liveUrl: "#",
      featured: true
    },
  ]

  const featuredProjects = useMemo(() => projects.filter(project => project.featured), [projects])
  const nonFeaturedProjects = useMemo(() => projects.filter(project => !project.featured), [projects])

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


          {/* My Projects */}
          <motion.div variants={itemVariants}>
            <h3 className="text-4xl font-bold mb-8 md:text-5xl text-center">{t('projects.myTitle')}</h3>
            <div className="grid md:grid-cols-2 gap-6">
              {nonFeaturedProjects.map((project) => (
                <motion.div
                  key={project.id}
                  variants={itemVariants}
                  whileHover={{ y: -5 }}
                  className="group"
                >
                  <ProjectCard project={project} t={t} />
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* View All Projects Button */}
          <motion.div variants={itemVariants} className="text-center mt-12">
            <Button variant="glow" size="lg" onClick={() => setShowAllProjects(true)}>
              {t('projects.viewAll')}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>

          {/* All Projects Dialog */}
          <Dialog open={showAllProjects} onOpenChange={setShowAllProjects}>
            <DialogContent className={`max-w-4xl max-h-[80vh] overflow-y-auto ${scrollbarClasses}`}>
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold">{t('projects.allProjectsTitle')}</DialogTitle>
                <DialogDescription>
                  {t('projects.allProjectsDescription')}
                </DialogDescription>
              </DialogHeader>
              <div className="grid sm:grid-cols-2 gap-6 mt-6">
                {projects.map((project) => (
                  <div key={project.id}>
                    <ProjectCard project={project} t={t} />
                  </div>
                ))}
              </div>
            </DialogContent>
          </Dialog>

          {/* Section Divider */}
          <SectionDivider label={t('projects.featuredWork')} />

          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mt-12 mb-4">{t('projects.title')}</h2>
            <p className="text-xl text-muted-foreground">
              {t('projects.subtitle')}
            </p>
          </motion.div>

          {/* Featured Projects */}
          <div className="grid lg:grid-cols-2 gap-8 mb-16">
            {featuredProjects.map((project) => (
              <motion.div
                key={project.id}
                variants={itemVariants}
                className="group w-full lg:w-auto mx-auto lg:mx-0 max-w-md lg:max-w-none"
              >
                <Card className="overflow-hidden border-border hover:border-primary/50 transition-all duration-300 hover:shadow-glow flex flex-col">
                  <div className="aspect-video overflow-hidden">
                    {project.imageType === "file" ? (
                      <img 
                        src={project.image} 
                        alt={t(project.titleKey)} 
                        className="w-full h-full object-cover"
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
                    <CardDescription>{t(project.longDescriptionKey)}</CardDescription>
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
                    <Button variant="outline" className="w-full group">
                      {t('projects.viewCaseStudy')}
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

        </motion.div>
      </div>
    </section>
  )
}

export default Projects