import { motion, useInView } from 'framer-motion'
import { useRef, useState, useMemo, memo, FC, useCallback } from 'react'
import { Mail, MapPin, Phone, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { useLanguage } from './LanguageProvider'

interface ContactInfoItemProps {
  icon: FC<{ className?: string }>
  label: string
  value: string
  href: string
  t: (key: string) => string
}

const ContactInfoItem: FC<ContactInfoItemProps> = memo(({ icon: Icon, label, value, href, t }) => (
  <motion.a
    href={href}
    target={label === t('contact.location') ? "_blank" : undefined}
    rel={label === t('contact.location') ? "noopener noreferrer" : undefined}
    whileHover={{ x: 5 }}
    className="flex items-center space-x-4 p-4 rounded-lg bg-card border border-border hover:border-primary/50 transition-all duration-300 group"
  >
    <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
      <Icon className="h-5 w-5" />
    </div>
    <div>
      <div className="font-medium">{label}</div>
      <div className="text-muted-foreground text-sm sm:text-base break-all">{value}</div>
    </div>
  </motion.a>
));

interface FormFieldProps {
  field: {
    id: string
    type: string
    label: string
    placeholder: string
  }
  t: (key: string) => string
}

const FormField: FC<FormFieldProps> = memo(({ field, t }) => (
  <div className="space-y-2">
    <label htmlFor={field.id} className="text-sm font-medium">
      {t(field.label)}
    </label>
    <Input
      id={field.id}
      name={field.id}
      type={field.type}
      required
      placeholder={t(field.placeholder)}
      className="focus:ring-2 focus:ring-primary/20"
    />
  </div>
));

const Contact = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { t } = useLanguage()

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    const formData = new FormData(e.target)
    
    try {
      await fetch('https://formsubmit.co/ghassan.adnanabukhaled@gmail.com', {
        method: 'POST',
        body: formData
      })
      
      toast({
        title: t('contact.success'),
        description: t('contact.successMessage'),
      })
      
      e.target.reset()
    } catch (error) {
      console.error('Error submitting form:', error)
      toast({
        title: 'Error',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive'
      })
    } finally {
      setIsSubmitting(false)
    }
  }, [toast, t])

  const contactInfo = useMemo(() => [
    {
      icon: Mail,
      label: t('contact.email'),
      value: "ghassan.adnanabukhaled@gmail.com",
      href: "mailto:ghassan.adnanabukhaled@gmail.com"
    },
    {
      icon: Phone,
      label: t('contact.phone'),
      value: "+49 15737809372",
      href: "tel:+4915737809372"
    },
    {
      icon: MapPin,
      label: t('contact.location'),
      value: t('about.locationValue'),
      href: "https://www.google.com/maps/search/?api=1&query=Wuppertal+42107+Germany"
    }
  ], [t])

  const formFields = useMemo(() => [
    { id: 'name', type: 'text', label: 'contact.name', placeholder: 'contact.namePlaceholder' },
    { id: 'email', type: 'email', label: 'contact.email', placeholder: 'contact.emailPlaceholder' }
  ], [])

  const availabilityItems = useMemo(() => 
    ['fullTime', 'freelance', 'consulting', 'openSource'], []
  )

  const containerVariants = useMemo(() => ({
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  }), [])

  const itemVariants = useMemo(() => ({
    hidden: { y: 50, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  }), [])

  return (
    <section id="contact" className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="max-w-6xl mx-auto"
        >
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">{t('contact.title')}</h2>
            <p className="text-xl text-muted-foreground">
              {t('contact.subtitle')}
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <motion.div variants={itemVariants} className="space-y-8">
              <div>
                <h3 className="text-2xl font-semibold mb-4">{t('contact.conversation')}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {t('contact.conversationText')}
                </p>
              </div>

              <div className="space-y-4">
                {contactInfo.map((info) => (
                  <ContactInfoItem key={info.label} {...info} t={t} />
                ))}
              </div>

              <div className="p-6 rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20">
                <h4 className="font-semibold mb-2">{t('contact.availableFor')}</h4>
                <ul className="text-muted-foreground space-y-1">
                  {availabilityItems.map((item) => (
                    <li key={item}>• {t(`contact.${item}`)}</li>
                  ))}
                </ul>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader>
                  <CardTitle>{t('contact.formTitle')}</CardTitle>
                  <CardDescription>
                    {t('contact.formDescription')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      {formFields.map((field) => (
                        <FormField key={field.id} field={field} t={t} />
                      ))}
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="subject" className="text-sm font-medium">
                        {t('contact.subject')}
                      </label>
                      <Input
                        id="subject"
                        name="subject"
                        required
                        placeholder={t('contact.subjectPlaceholder')}
                        className="focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="message" className="text-sm font-medium">
                        {t('contact.message')}
                      </label>
                      <Textarea
                        id="message"
                        name="message"
                        required
                        placeholder={t('contact.messagePlaceholder')}
                        rows={5}
                        className="transition-all duration-300 focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                    <Button
                      type="submit"
                      variant="glow"
                      size="lg"
                      className="w-full"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? t('contact.sending') : t('contact.send')}
                      <Send className="ml-2 h-4 w-4" />
                    </Button>
                    
                    {/* FormSubmit.co configuration */}
                    <input type="hidden" name="_subject" value="New Portfolio Contact Form Submission" />
                    <input type="hidden" name="_template" value="table" />
                    <input type="hidden" name="_captcha" value="false" />
                    <input type="text" name="_honey" style={{ display: 'none' }} />
                    
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Contact