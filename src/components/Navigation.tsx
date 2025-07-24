import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Moon, Sun, Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTheme } from './ThemeProvider'
import { useLanguage } from './LanguageProvider'

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const { theme, setTheme } = useTheme()
  const { language, setLanguage, t } = useLanguage()

  // Close mobile menu when resizing to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024 && isOpen) {
        setIsOpen(false)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [isOpen])

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    { href: '#home', label: t('nav.home') },
    { href: '#about', label: t('nav.about') },
    { href: '#projects', label: t('nav.projects') },
    { href: '#skills', label: t('nav.skills') },
    { href: '#certifications', label: t('nav.certifications') },
    { href: '#contact', label: t('nav.contact') },
  ]

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled || isOpen
          ? 'bg-background/90 backdrop-blur-md border-b border-border/50 shadow-sm' 
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <a 
              href="#home" 
              className="text-lg sm:text-xl md:text-2xl font-bold text-foreground truncate max-w-[180px] sm:max-w-none"
              onClick={() => setIsOpen(false)}
            >
              Ghassan Abu Khaled
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:items-center lg:space-x-6">
            <div className="flex items-center space-x-4">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="text-muted-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                >
                  {item.label}
                </a>
              ))}
            </div>
            
            {/* Language Switcher */}
            <div className="flex items-center border border-border/50 rounded-full overflow-hidden">
              <Button
                variant={language === 'en' ? "default" : "ghost"}
                size="sm"
                onClick={() => setLanguage('en')}
                className={`px-2 py-1 h-8 rounded-none ${language === 'en' ? 'bg-primary text-primary-foreground' : 'hover:bg-transparent hover:text-foreground'}`}
              >
                EN
              </Button>
              <div className="h-8 w-px bg-border/50"></div>
              <Button
                variant={language === 'de' ? "default" : "ghost"}
                size="sm"
                onClick={() => setLanguage('de')}
                className={`px-2 py-1 h-8 rounded-none ${language === 'de' ? 'bg-primary text-primary-foreground' : 'hover:bg-transparent hover:text-foreground'}`}
              >
                DE
              </Button>
            </div>
            
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full h-9 w-9"
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
          </div>

          {/* Mobile Controls */}
          <div className="flex lg:hidden items-center space-x-3">
            {/* Theme Toggle (Mobile) */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full h-8 w-8"
            >
              {theme === 'dark' ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>
            
            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              className="rounded-full"
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden bg-background/95 backdrop-blur-md border-t border-border/50"
          >
            <div className="px-4 pt-2 pb-4 space-y-2">
              {/* Nav Links */}
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="text-muted-foreground hover:text-primary block px-3 py-2.5 rounded-md text-base font-medium transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </a>
              ))}
              
              {/* Language Switcher (Mobile) */}
              <div className="px-3 py-3 mt-2">
                <p className="text-sm font-medium text-muted-foreground mb-2">Language</p>
                <div className="flex items-center border border-border/50 rounded-full overflow-hidden w-fit">
                  <Button
                    variant={language === 'en' ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setLanguage('en')}
                    className={`px-2 py-1 h-8 rounded-none ${language === 'en' ? 'bg-primary text-primary-foreground' : 'hover:bg-transparent hover:text-foreground'}`}
                  >
                    EN
                  </Button>
                  <div className="h-8 w-px bg-border/50"></div>
                  <Button
                    variant={language === 'de' ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setLanguage('de')}
                    className={`px-2 py-1 h-8 rounded-none ${language === 'de' ? 'bg-primary text-primary-foreground' : 'hover:bg-transparent hover:text-foreground'}`}
                  >
                    DE
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}

export default Navigation