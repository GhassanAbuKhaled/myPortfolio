import { motion, useInView } from 'framer-motion'
import { useRef, useMemo, memo, FC } from 'react'
import { useLanguage } from './LanguageProvider'

interface TechStackItemProps {
  tech: string
  index: number
  isInView: boolean
}

const TechStackItem: FC<TechStackItemProps> = memo(({ tech, index, isInView }) => (
  <motion.div
    initial={{ scale: 0, opacity: 0 }}
    animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
    transition={{ 
      delay: index * 0.1, 
      duration: 0.3,
      type: "tween"
    }}
    whileHover={{ scale: 1.05 }}
    className="px-3 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm bg-primary/10 border border-primary/20 rounded-full text-primary hover:bg-primary/20 cursor-pointer"
  >
    {tech}
  </motion.div>
));

interface SkillCategoryProps {
  category: {
    title: string
    skills: Array<{
      name: string
      level: number
      color: string
    }>
  }
  categoryIndex: number
  isInView: boolean
  animations: any
}

const SkillCategory: FC<SkillCategoryProps> = memo(({ category, categoryIndex, isInView, animations }) => (
  <motion.div
    variants={animations.item}
    className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-colors"
  >
    <h3 className="text-2xl font-semibold mb-6 text-center">{category.title}</h3>
    <div className="space-y-4">
      {category.skills.map((skill, skillIndex) => (
        <SkillBar 
          key={skill.name} 
          skill={skill} 
          delay={categoryIndex * 0.2 + skillIndex * 0.1}
          isInView={isInView}
        />
      ))}
    </div>
  </motion.div>
));

interface SkillBarProps {
  skill: {
    name: string;
    level: number;
    color: string;
  };
  delay: number;
  isInView: boolean;
}

const SkillBar: FC<SkillBarProps> = memo(({ skill, delay, isInView }) => (
  <div className="space-y-2">
    <div className="flex justify-between items-center">
      <span className="font-medium">{skill.name}</span>
      <span className="text-sm text-muted-foreground">{skill.level}%</span>
    </div>
    <div className="h-2 bg-muted rounded-full overflow-hidden">
      <motion.div
        className={`h-full bg-gradient-to-r ${skill.color} rounded-full`}
        initial={{ width: 0 }}
        animate={isInView ? { width: `${skill.level}%` } : { width: 0 }}
        transition={{ duration: 1, delay, ease: "easeOut" }}
      />
    </div>
  </div>
));

const Skills = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  const { t } = useLanguage()

  const animations = useMemo(() => ({
    container: {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: { delayChildren: 0.3, staggerChildren: 0.1 }
      }
    },
    item: {
      hidden: { y: 50, opacity: 0 },
      visible: { y: 0, opacity: 1 }
    }
  }), [])

  const skillData = useMemo(() => [
    {
      title: t('skills.frontend'),
      skills: [
        { name: "React", level: 90, color: "from-blue-500 to-cyan-500" },
        { name: "TypeScript", level: 85, color: "from-blue-600 to-blue-400" },
        { name: "Next.js", level: 80, color: "from-gray-800 to-gray-600" },
        { name: "Tailwind CSS", level: 95, color: "from-cyan-500 to-blue-500" },
        { name: "Framer Motion", level: 75, color: "from-purple-500 to-pink-500" }
      ]
    },
    {
      title: t('skills.backend'),
      skills: [
        { name: "Node.js", level: 85, color: "from-green-600 to-green-400" },
        { name: "Express", level: 80, color: "from-gray-600 to-gray-400" },
        { name: "MongoDB", level: 75, color: "from-green-500 to-emerald-500" },
        { name: "PostgreSQL", level: 70, color: "from-blue-600 to-indigo-600" },
        { name: "REST APIs", level: 90, color: "from-orange-500 to-red-500" }
      ]
    },
    {
      title: t('skills.tools'),
      skills: [
        { name: "Git", level: 85, color: "from-orange-600 to-red-600" },
        { name: "Docker", level: 70, color: "from-blue-500 to-blue-700" },
        { name: "AWS", level: 65, color: "from-yellow-500 to-orange-500" },
        { name: "Figma", level: 80, color: "from-purple-500 to-pink-500" },
        { name: "Testing", level: 75, color: "from-green-500 to-teal-500" }
      ]
    }
  ], [t])

  const techStack = useMemo(() => 
    ['React', 'TypeScript', 'Node.js', 'MongoDB', 'PostgreSQL', 'AWS', 'Docker', 'Git'], 
  [])



  return (
    <section id="skills" className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          variants={animations.container}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="max-w-6xl mx-auto"
        >
          <motion.div variants={animations.item} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">{t('skills.title')}</h2>
            <p className="text-xl text-muted-foreground">
              {t('skills.subtitle')}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {skillData.map((category, categoryIndex) => (
              <SkillCategory
                key={category.title}
                category={category}
                categoryIndex={categoryIndex}
                isInView={isInView}
                animations={animations}
              />
            ))}
          </div>

          {/* Interactive Tech Stack */}
          <motion.div variants={animations.item} className="mt-16">
            <h3 className="text-2xl font-semibold text-center mb-8">{t('skills.techStack')}</h3>
            <div className="flex flex-wrap justify-center gap-4">
              {techStack.map((tech, index) => (
                <TechStackItem
                  key={tech}
                  tech={tech}
                  index={index}
                  isInView={isInView}
                />
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default Skills