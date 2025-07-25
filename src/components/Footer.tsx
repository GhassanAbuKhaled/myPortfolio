import { motion } from 'framer-motion'
import { Github, Mail, Linkedin } from 'lucide-react'
import { useLanguage } from './LanguageProvider'

const Footer = () => {
  const currentYear = new Date().getFullYear()
  const { t } = useLanguage()

  const socialLinks = [
    { icon: Github, href: 'https://github.com/GhassanAbuKhaled', label: 'GitHub', newTab: true },
    { icon: Linkedin, href: 'https://www.linkedin.com/in/ghassanabukhaled', label: 'LinkedIn', newTab: true },
    { icon: Mail, href: 'mailto:ghassan.adnanabukhaled@gmail.com', label: 'Email' }
  ]
  
  const navLinks = [
    { key: 'nav.home', href: '#home' },
    { key: 'nav.about', href: '#about' },
    { key: 'nav.projects', href: '#projects' },
    { key: 'nav.skills', href: '#skills' },
    { key: 'nav.certifications', href: '#certifications' },
    { key: 'nav.contact', href: '#contact' }
  ]

  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            {/* Brand */}
            <div className="space-y-4">
              <h3 className="text-2xl font-bold">Ghassan Abu Khaled</h3>
              <p className="text-muted-foreground">
                {t('footer.description')}
              </p>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h4 className="font-semibold">{t('footer.quickLinks')}</h4>
              <nav className="flex flex-col space-y-2">
                {navLinks.map((item) => (
                  <a
                    key={item.key}
                    href={item.href}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {t(item.key)}
                  </a>
                ))}
              </nav>
            </div>

            {/* Social Links */}
            <div className="space-y-4">
              <h4 className="font-semibold">{t('footer.connect')}</h4>
              <div className="flex space-x-4">
                {socialLinks.map(({ icon: Icon, href, label, newTab }) => (
                  <motion.a
                    key={label}
                    href={href}
                    {...(newTab && !href.startsWith('mailto:') ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                    aria-label={label}
                  >
                    <Icon className="h-5 w-5" />
                  </motion.a>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-muted-foreground text-center md:text-left">
              <span>{t('footer.copyright').replace('{year}', String(currentYear))}</span>
            </div>
            <div className="text-muted-foreground text-xs sm:text-sm text-center md:text-right">
              {t('footer.builtWith')}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer