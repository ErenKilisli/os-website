import { Navbar }              from '@/components/navigation/Navbar'
import { Hero }                from '@/components/hero/Hero'
import { AboutSection }        from '@/components/about/AboutSection'
import { CodeProjectsSection } from '@/components/projects/CodeProjectsSection'
import { FilmProjectsSection } from '@/components/projects/FilmProjectsSection'
import { ContactSection }      from '@/components/contact/ContactSection'
import { ContactFAB }          from '@/components/contact/ContactFAB'

export default function Home() {
  return (
    <main>
      {/* Always-visible full-width navbar with glass surface + active indicator */}
      <Navbar />

      {/* Wodniack-style bottom-anchored hero */}
      <Hero />

      {/* Code projects — dark #050505, green terminal aesthetic */}
      <CodeProjectsSection />

      {/* About — three GSAP parallax columns */}
      <AboutSection />

      {/* Film projects — warmer #080506, orange cinematic aesthetic */}
      <FilmProjectsSection />

      {/* Contact — character wave email + social links + signature */}
      <ContactSection />

      {/* Floating contact button */}
      <ContactFAB />
    </main>
  )
}
