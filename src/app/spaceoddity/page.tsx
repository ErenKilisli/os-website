import styles from './spaceoddity.module.css'
import { copy, flags } from './content'
import SignalImage from './components/SignalImage'
import BootIntro from './components/BootIntro'
import NewsletterField from './components/NewsletterField'

export default function SpaceOddityPage() {
  return (
    <>
      {flags.bootIntro && <BootIntro />}

      <main>
        <section className={styles.hero} aria-label="Hero">
          <div className={styles.heroBezel}>
            <div className={styles.heroScreen} />
          </div>
          <h1 className={styles.heroTitle}>{copy.title}</h1>
          <p className={styles.heroStatusLine}>{copy.status}</p>
        </section>

        <section className={styles.section} aria-label="Logline">
          <p className={styles.logline}>{copy.logline}</p>
        </section>

        <section className={styles.section} aria-label="The Look">
          <h2 className={styles.sectionLabel}>The Look</h2>
          <div className={styles.lookStack}>
            {copy.images.map((image) => (
              <SignalImage
                key={image.src}
                src={image.src}
                alt={image.alt}
                caption={image.caption}
              />
            ))}
          </div>
        </section>

        <section className={styles.section} aria-label="Readout">
          <h2 className={styles.sectionLabel}>Readout</h2>
          <dl className={styles.readout}>
            {copy.readout.map((row) => (
              <div className={styles.readoutRow} key={row.label}>
                <dt className={styles.readoutLabel}>{row.label}</dt>
                <dd className={styles.readoutValue}>{row.value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className={styles.section} aria-label="Credits">
          <h2 className={styles.sectionLabel}>Credits</h2>
          <ul className={styles.credits}>
            {copy.credits.map((credit) => (
              <li className={styles.creditRow} key={credit.role}>
                <span className={styles.creditRole}>{credit.role}</span>
                <span className={styles.creditName}>{credit.name}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className={styles.section} aria-label="Contact">
          <h2 className={styles.sectionLabel}>Contact</h2>
          <a className={styles.contactEmail} href={`mailto:${copy.contactEmail}`}>
            {copy.contactEmail}
          </a>
          {flags.newsletterEndpoint && (
            <NewsletterField endpoint={flags.newsletterEndpoint} />
          )}
        </section>
      </main>
    </>
  )
}
