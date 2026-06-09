import { motion, useInView } from 'framer-motion'
import { useRef, useMemo, memo, FC } from 'react'
import { IconType } from 'react-icons'
import {
  SiReact,
  SiVuedotjs,
  SiAngular,
  SiTypescript,
  SiTailwindcss,
  SiFramer,
  SiNodedotjs,
  SiExpress,
  SiMongodb,
  SiMysql,
  SiSpringboot,
  SiGit,
  SiDocker,
  SiFigma,
} from 'react-icons/si'
import { FaJava, FaAws } from 'react-icons/fa'
import { Webhook, FlaskConical } from 'lucide-react'
import { useLanguage } from './LanguageProvider'

interface Tech {
  name: string
  Icon: IconType
  /** Brand color, or a CSS var string for theme-aware tokens. */
  color: string
}

const PRIMARY = 'hsl(var(--primary))'
const FOREGROUND = 'hsl(var(--foreground))'

/**
 * Two balanced rows that mix frontend / backend / tools. Each row is long
 * enough (and includes wide labels like "Tailwind CSS") that a single copy
 * always overflows the capped container — so the seamless duplicate used for
 * the loop is never visible on screen at the same time.
 */
const ROWS: { items: Tech[]; duration: number; reverse: boolean }[] = [
  {
    reverse: false,
    duration: 52,
    items: [
      { name: 'React', Icon: SiReact, color: '#61DAFB' },
      { name: 'TypeScript', Icon: SiTypescript, color: '#3178C6' },
      { name: 'Tailwind CSS', Icon: SiTailwindcss, color: '#06B6D4' },
      { name: 'Node.js', Icon: SiNodedotjs, color: '#5FA04E' },
      { name: 'Spring Boot', Icon: SiSpringboot, color: '#6DB33F' },
      { name: 'MongoDB', Icon: SiMongodb, color: '#47A248' },
      { name: 'Docker', Icon: SiDocker, color: '#2496ED' },
      { name: 'Figma', Icon: SiFigma, color: '#F24E1E' },
      { name: 'Angular', Icon: SiAngular, color: '#DD0031' },
    ],
  },
  {
    reverse: true,
    duration: 58,
    items: [
      { name: 'Vue', Icon: SiVuedotjs, color: '#4FC08D' },
      { name: 'Framer Motion', Icon: SiFramer, color: '#0055FF' },
      { name: 'Express', Icon: SiExpress, color: FOREGROUND },
      { name: 'Java', Icon: FaJava, color: '#E76F00' },
      { name: 'MySQL', Icon: SiMysql, color: '#4479A1' },
      { name: 'REST APIs', Icon: Webhook, color: PRIMARY },
      { name: 'Git', Icon: SiGit, color: '#F05032' },
      { name: 'AWS', Icon: FaAws, color: '#FF9900' },
      { name: 'Testing', Icon: FlaskConical, color: PRIMARY },
    ],
  },
]

const TechChip: FC<{ tech: Tech; clone?: boolean }> = memo(({ tech, clone }) => (
  <div
    aria-hidden={clone || undefined}
    className={`mr-4 flex shrink-0 items-center gap-3 rounded-xl border border-border bg-card/70 px-5 py-3 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-glow ${
      clone ? 'motion-reduce:hidden' : ''
    }`}
  >
    <tech.Icon className="h-5 w-5 shrink-0" style={{ color: tech.color }} aria-hidden />
    <span className="whitespace-nowrap text-sm font-medium">{tech.name}</span>
  </div>
))

const MarqueeRow: FC<{ items: Tech[]; reverse: boolean; duration: number }> = memo(
  ({ items, reverse, duration }) => (
    <div className="group relative overflow-hidden py-6 [mask-image:linear-gradient(to_right,transparent,#000_7%,#000_93%,transparent)] motion-reduce:overflow-visible motion-reduce:py-0 motion-reduce:[mask-image:none]">
      <div
        className="flex w-max animate-marquee group-hover:[animation-play-state:paused] motion-reduce:w-full motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:gap-y-3"
        style={{
          ['--marquee-duration' as string]: `${duration}s`,
          animationDirection: reverse ? 'reverse' : 'normal',
        }}
      >
        {items.map((tech) => (
          <TechChip key={tech.name} tech={tech} />
        ))}
        {/* Seamless duplicate — hidden from AT and from reduced-motion layout */}
        {items.map((tech) => (
          <TechChip key={`dup-${tech.name}`} tech={tech} clone />
        ))}
      </div>
    </div>
  ),
)

const Skills = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  const { t } = useLanguage()

  const animations = useMemo(
    () => ({
      container: {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { delayChildren: 0.2, staggerChildren: 0.15 } },
      },
      item: {
        hidden: { y: 40, opacity: 0 },
        visible: { y: 0, opacity: 1 },
      },
    }),
    [],
  )

  return (
    <section id="skills" className="overflow-hidden py-20">
      <motion.div
        ref={ref}
        variants={animations.container}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        className="mx-auto max-w-6xl"
      >
        <motion.div variants={animations.item} className="mb-16 px-4 text-center">
          <h2 className="mb-4 text-4xl font-bold md:text-5xl">{t('skills.title')}</h2>
          <p className="mx-auto max-w-2xl text-xl text-muted-foreground">{t('skills.subtitle')}</p>
        </motion.div>

        <div className="mx-auto max-w-5xl space-y-1">
          {ROWS.map((row, i) => (
            <motion.div key={i} variants={animations.item}>
              <MarqueeRow items={row.items} reverse={row.reverse} duration={row.duration} />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}

export default Skills
