import { motion, useInView, AnimatePresence } from 'framer-motion'
import { useRef, useMemo, useState, useEffect, memo, FC } from 'react'
import { Sparkles, Wand2, Code2, TerminalSquare, GitPullRequest } from 'lucide-react'
import { useLanguage } from './LanguageProvider'

/**
 * The terminal "conversation" is intentionally kept in English regardless of the
 * UI language — a developer console reads as authentic that way, and the content
 * is mostly code anyway. Only the surrounding copy is translated.
 */
type LineType = 'sys' | 'ai' | 'code' | 'ok'

interface Session {
  tool: string
  prompt: string
  lines: Array<{ type: LineType; text: string }>
}

const SESSIONS: Session[] = [
  {
    tool: 'Claude Code',
    prompt: 'refactor the auth flow and add tests',
    lines: [
      { type: 'sys', text: 'analyzing 14 files across src/auth …' },
      { type: 'ai', text: 'extracted useSession() hook + token refresh' },
      { type: 'code', text: 'const { user } = useSession()  // typed · memoized' },
      { type: 'ok', text: '12 tests passing · coverage 94% · PR opened' },
    ],
  },
  {
    tool: 'Cursor',
    prompt: 'why does this list re-render on every keystroke?',
    lines: [
      { type: 'sys', text: 'tracing render cause …' },
      { type: 'ai', text: 'parent rebuilds the array literal each render' },
      { type: 'code', text: 'const items = useMemo(() => filter(q), [q])' },
      { type: 'ok', text: 'renders 38 → 2 · input feels instant' },
    ],
  },
  {
    tool: 'GitHub Copilot',
    prompt: 'scaffold a typed REST client with retries',
    lines: [
      { type: 'sys', text: 'generating client.ts …' },
      { type: 'code', text: 'export const api = createClient({ retries: 3 })' },
      { type: 'code', text: 'await api.get<User[]>("/users")' },
      { type: 'ok', text: 'shipped · fully typed · 0 any' },
    ],
  },
  {
    tool: 'Gemini',
    prompt: 'estimate calories from this meal photo',
    lines: [
      { type: 'sys', text: 'vision model · parsing image …' },
      { type: 'ai', text: 'grilled chicken, rice, side salad detected' },
      { type: 'code', text: '{ kcal: 612, protein: 48, carbs: 51, fat: 18 }' },
      { type: 'ok', text: 'wired into Lalisa · returned in 1.2s' },
    ],
  },
]

const TOOLS: Array<{ name: string; color: string }> = [
  { name: 'Claude Code', color: '#D97757' },
  { name: 'Claude', color: '#D97757' },
  { name: 'Cursor', color: '#9CA3AF' },
  { name: 'GitHub Copilot', color: '#A78BFA' },
  { name: 'ChatGPT', color: '#10A37F' },
  { name: 'Gemini', color: '#4285F4' },
]

const LINE_CLASS: Record<LineType, string> = {
  sys: 'text-muted-foreground',
  ai: 'text-primary',
  code: 'text-foreground/90',
  ok: 'text-emerald-500 dark:text-emerald-400',
}

const Caret = () => (
  <span className="animate-caret ml-0.5 inline-block h-[1.05em] w-[7px] translate-y-[2px] bg-primary align-middle" />
)

interface ToolChipProps {
  name: string
  color: string
  active: boolean
}

const ToolChip: FC<ToolChipProps> = memo(({ name, color, active }) => (
  <motion.div
    whileHover={{ y: -3 }}
    transition={{ type: 'tween', duration: 0.2 }}
    className={`flex items-center gap-2.5 rounded-full border px-4 py-2 text-sm font-medium backdrop-blur-sm transition-colors duration-300 ${
      active
        ? 'border-primary/60 bg-primary/10 text-foreground shadow-glow'
        : 'border-border bg-card/60 text-muted-foreground hover:border-primary/40 hover:text-foreground'
    }`}
  >
    <span
      className="h-2 w-2 shrink-0 rounded-full transition-all duration-300"
      style={{ backgroundColor: color, boxShadow: active ? `0 0 10px ${color}` : 'none' }}
    />
    {name}
  </motion.div>
))

const AIWorkflow = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  const { t } = useLanguage()

  const [sessionIndex, setSessionIndex] = useState(0)
  const [typed, setTyped] = useState('')
  const [revealed, setRevealed] = useState(0)

  const session = SESSIONS[sessionIndex]
  const promptDone = typed.length === session.prompt.length

  useEffect(() => {
    if (!isInView) return

    const reduced =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

    if (reduced) {
      setSessionIndex(0)
      setTyped(SESSIONS[0].prompt)
      setRevealed(SESSIONS[0].lines.length)
      return
    }

    let cancelled = false
    const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

    const run = async () => {
      let idx = 0
      while (!cancelled) {
        const s = SESSIONS[idx]
        setSessionIndex(idx)
        setTyped('')
        setRevealed(0)
        await sleep(550)

        for (let i = 1; i <= s.prompt.length; i++) {
          if (cancelled) return
          setTyped(s.prompt.slice(0, i))
          await sleep(34 + Math.random() * 46)
        }
        await sleep(520)

        for (let l = 1; l <= s.lines.length; l++) {
          if (cancelled) return
          setRevealed(l)
          await sleep(540 + Math.random() * 280)
        }
        await sleep(2700)
        idx = (idx + 1) % SESSIONS.length
      }
    }

    run()
    return () => {
      cancelled = true
    }
  }, [isInView])

  const animations = useMemo(
    () => ({
      container: {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { delayChildren: 0.2, staggerChildren: 0.12 } },
      },
      item: {
        hidden: { y: 40, opacity: 0 },
        visible: { y: 0, opacity: 1 },
      },
    }),
    [],
  )

  const capabilities = useMemo(
    () => [
      { icon: Wand2, key: 'prompt' },
      { icon: Code2, key: 'pair' },
      { icon: TerminalSquare, key: 'agentic' },
      { icon: GitPullRequest, key: 'review' },
    ],
    [],
  )

  return (
    <section id="ai-workflow" className="relative overflow-hidden py-20">
      {/* Atmosphere: faint blueprint grid + cyan glow */}
      <div className="pointer-events-none absolute inset-0 bg-grid-faint opacity-60" aria-hidden />
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[820px] max-w-full -translate-x-1/2 rounded-full opacity-30 blur-3xl"
        style={{ background: 'radial-gradient(circle, hsl(var(--primary) / 0.35), transparent 70%)' }}
        aria-hidden
      />

      <div className="container relative mx-auto px-4">
        <motion.div
          ref={ref}
          variants={animations.container}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="mx-auto max-w-6xl"
        >
          {/* Heading */}
          <motion.div variants={animations.item} className="mb-14 text-center">
            <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
              <Sparkles className="h-4 w-4" />
              {t('ai.eyebrow')}
            </span>
            <h2 className="mb-4 text-4xl font-bold md:text-5xl">{t('ai.title')}</h2>
            <p className="mx-auto max-w-2xl text-xl text-muted-foreground">{t('ai.subtitle')}</p>
          </motion.div>

          {/* Capabilities + Terminal */}
          <div className="grid items-center gap-8 lg:grid-cols-5">
            {/* Capabilities */}
            <motion.div variants={animations.item} className="order-2 space-y-4 lg:order-1 lg:col-span-2">
              {capabilities.map(({ icon: Icon, key }) => (
                <div
                  key={key}
                  className="flex gap-4 rounded-xl border border-border bg-card/60 p-4 backdrop-blur-sm transition-colors hover:border-primary/50"
                >
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="mb-1 font-semibold">{t(`ai.capabilities.${key}.title`)}</h4>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {t(`ai.capabilities.${key}.desc`)}
                    </p>
                  </div>
                </div>
              ))}
            </motion.div>

            {/* Terminal */}
            <motion.div variants={animations.item} className="order-1 lg:order-2 lg:col-span-3">
              <div className="overflow-hidden rounded-xl border border-border bg-card/80 shadow-glow backdrop-blur-md">
                {/* Window chrome */}
                <div className="flex items-center gap-2 border-b border-border bg-muted/40 px-4 py-3">
                  <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
                  <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
                  <span className="h-3 w-3 rounded-full bg-[#28c840]" />
                  <span className="ml-3 truncate font-mono-code text-xs text-muted-foreground">
                    ghassan@dev · ai-pair-session
                  </span>
                  <span className="ml-auto flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider text-primary">
                    <span className="animate-pulse-dot h-1.5 w-1.5 rounded-full bg-primary" />
                    AI online
                  </span>
                </div>

                {/* Body */}
                <div className="min-h-[268px] space-y-2 p-5 font-mono-code text-[13px] leading-relaxed sm:text-sm">
                  {/* Prompt */}
                  <div className="break-words">
                    <span className="mr-2 text-primary">❯</span>
                    <span className="text-foreground/90">{typed}</span>
                    {(!promptDone || revealed === 0) && <Caret />}
                  </div>

                  {/* Streamed response */}
                  <AnimatePresence mode="popLayout">
                    {session.lines.slice(0, revealed).map((line, i) => (
                      <motion.div
                        key={`${sessionIndex}-${i}`}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.25 }}
                        className={`break-words ${LINE_CLASS[line.type]}`}
                      >
                        {line.type === 'ai' && <span className="mr-2 select-none">✦</span>}
                        {line.type === 'code' && <span className="mr-2 select-none text-border">│</span>}
                        {line.type === 'ok' && <span className="mr-2 select-none">✓</span>}
                        {line.type === 'sys' && <span className="mr-2 select-none opacity-50">·</span>}
                        {line.text}
                        {promptDone && i === revealed - 1 && <Caret />}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Tool chips */}
          <motion.div variants={animations.item} className="mt-14 text-center">
            <p className="mb-6 text-sm uppercase tracking-wider text-muted-foreground">{t('ai.toolsLabel')}</p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              {TOOLS.map((tool) => (
                <ToolChip
                  key={tool.name}
                  name={tool.name}
                  color={tool.color}
                  active={tool.name === session.tool}
                />
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default AIWorkflow
