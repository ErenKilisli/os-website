import { DynamicIsland } from '@/components/navigation/DynamicIsland'
import { Hero } from '@/components/hero/Hero'

/**
 * Main page — assembles all sections.
 * Projects and Contact sections are wired in subsequent phases.
 */
export default function Home() {
  return (
    <main>
      {/* ── Navigation ── */}
      <DynamicIsland />

      {/* ── Hero ── */}
      <Hero />

      {/* ── Projects (Phase 2) ── */}
      {/* <ProjectsSection /> */}

      {/* ── Contact FAB (Phase 2) ── */}
      {/* <ContactFAB /> */}
    </main>
  )
}
