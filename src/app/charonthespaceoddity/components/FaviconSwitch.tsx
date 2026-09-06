'use client'
import { useEffect } from 'react'

const ROCKET_ICON =
  "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🚀</text></svg>"

function isIconLink(node: Node): node is HTMLLinkElement {
  return (
    node instanceof HTMLLinkElement &&
    (node.rel === 'icon' || node.rel === 'shortcut icon')
  )
}

// The root layout hardcodes a 🦎 favicon via its own <head> JSX, which
// bypasses Next's per-segment metadata/icon-file merging — a metadata.icons
// entry or icon.tsx file in this route never reaches the rendered <head>.
// Some <link rel="icon"> tags also get (re)inserted after hydration, so a
// one-shot swap on mount misses them — a MutationObserver catches those too.
export default function FaviconSwitch() {
  useEffect(() => {
    const restore: { link: HTMLLinkElement; href: string }[] = []

    const CLAIMED = 'data-charon-icon'
    const claim = (link: HTMLLinkElement) => {
      // Compare raw attributes, not the resolved `.href` property (which
      // re-encodes data URIs) — a string mismatch there would make the
      // MutationObserver below re-fire on every write, hanging the tab.
      if (link.hasAttribute(CLAIMED)) return
      restore.push({ link, href: link.getAttribute('href') ?? '' })
      link.setAttribute(CLAIMED, '')
      link.setAttribute('href', ROCKET_ICON)
    }

    document
      .querySelectorAll<HTMLLinkElement>("link[rel~='icon']")
      .forEach(claim)

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        mutation.addedNodes.forEach((node) => {
          if (isIconLink(node)) claim(node)
        })
        if (mutation.type === 'attributes' && isIconLink(mutation.target)) {
          claim(mutation.target)
        }
      }
    })
    observer.observe(document.head, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['href'],
    })

    return () => {
      observer.disconnect()
      restore.forEach(({ link, href }) => {
        link.setAttribute('href', href)
        link.removeAttribute(CLAIMED)
      })
    }
  }, [])

  return null
}
