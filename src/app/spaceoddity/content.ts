// All copy and toggles for /spaceoddity live here.
// Edit this file to change what the page says or shows. See README.md
// in this folder for the full "how do I..." guide.

export const flags = {
  // Keeps the page out of search engines while the project is unlisted.
  // Flip to false when the film is ready to be publicly linked/indexed.
  noindex: true,

  // Full-screen boot readout on first visit (sessionStorage, skippable).
  // Off by default — the page must never be gated behind it.
  bootIntro: false,

  // If set to a URL, CONTACT renders a single email field that POSTs
  // { email } as JSON to this endpoint via fetch. Leave null to only
  // show the mailto link.
  newsletterEndpoint: null as string | null,
}

export const copy = {
  title: 'Space Oddity or Blues (WT)',
  status: 'Short film · Berlin · In pre-production, 2026',

  // TODO: write the real logline. Do not invent one.
  logline: 'TODO: logline',

  images: [
    {
      src: '/spaceoddity/still-01.svg',
      alt: 'TODO: describe this frame',
      caption: 'TODO: caption 01',
    },
    {
      src: '/spaceoddity/still-02.svg',
      alt: 'TODO: describe this frame',
      caption: 'TODO: caption 02',
    },
    {
      src: '/spaceoddity/still-03.svg',
      alt: 'TODO: describe this frame',
      caption: 'TODO: caption 03',
    },
  ],

  readout: [
    { label: 'FORMAT', value: 'TODO' },
    { label: 'RUNTIME', value: 'TODO' },
    { label: 'LOCATION', value: 'Berlin' },
    { label: 'SHOOT', value: 'TODO' },
    { label: 'STATUS', value: 'Pre-production' },
  ],

  credits: [
    { role: 'Written & Directed by', name: 'I. Eren Kilisli' },
    { role: 'Production', name: 'Page One Production' },
  ],

  contactEmail: 'ibr@himerenkilisli.com',
}
