import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { generateSchemaGraph } from '../../data/schemaGraph'

interface SEOProps {
  title?: string
  description?: string
  image?: string
  type?: string
}

const ROUTE_SEO: Record<string, { title: string; description: string; keywords: string }> = {
  '/': {
    title: 'Nayak Labs — Software Studio, Platforms & Engineering',
    description:
      'Independent software studio creating interactive platforms, production web software, and hands-on engineering programs.',
    keywords:
      'Software Studio, Platforms, Full-Stack Engineering, FastAPI, Next.js, Interactive Tools, Technical Training, Nayak Labs',
  },
  '/products': {
    title: 'Products & Platforms — Nayak Labs',
    description:
      'Products made for the way you work. Making complex things feel simple. Explore DI Notes sorting visualizer and Event Mesh global event radar.',
    keywords:
      'Software Products, Event Mesh, DI Notes, Visualizer, Interactive Tools, SaaS, Nayak Labs Products',
  },
  '/services': {
    title: 'Software Engineering Services — Nayak Labs',
    description:
      'Senior engineering teams for your product. We build production web applications, FastAPI backends, and cloud architecture with 100% code ownership.',
    keywords:
      'Full-Stack Development, FastAPI, Next.js, Web Applications, Cloud Architecture, Nayak Labs Services',
  },
  '/academics': {
    title: 'Engineering Training & Mentorship — Nayak Labs',
    description:
      'Practical, hands-on engineering programs covering real-world architecture, backend stacks, and systems design taught by practicing builders.',
    keywords:
      'Engineering Mentorship, Systems Design, Backend Development, Hands-on Training, Nayak Labs Training',
  },
  '/coming-soon': {
    title: 'Releasing Soon — Nayak Labs',
    description:
      'Upcoming developer tools, open-source projects, and training tracks from Nayak Labs.',
    keywords: 'Nayak Labs, Upcoming Tools, Software Studio',
  },
}

export function SEOHead({ title, description, image = '/NayakLabs.png', type = 'website' }: SEOProps) {
  const { pathname } = useLocation()
  const currentSEO = ROUTE_SEO[pathname] || ROUTE_SEO['/']

  const activeTitle = title || currentSEO.title
  const activeDesc = description || currentSEO.description
  const activeUrl = `https://nayaklabs.com${pathname === '/' ? '' : pathname}`

  useEffect(() => {
    // 1. Document Title
    document.title = activeTitle

    // 2. Meta Description
    let metaDesc = document.querySelector('meta[name="description"]')
    if (!metaDesc) {
      metaDesc = document.createElement('meta')
      metaDesc.setAttribute('name', 'description')
      document.head.appendChild(metaDesc)
    }
    metaDesc.setAttribute('content', activeDesc)

    // 3. Meta Keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]')
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta')
      metaKeywords.setAttribute('name', 'keywords')
      document.head.appendChild(metaKeywords)
    }
    metaKeywords.setAttribute('content', currentSEO.keywords)

    // 4. Canonical Link
    let canonical = document.querySelector('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.setAttribute('rel', 'canonical')
      document.head.appendChild(canonical)
    }
    canonical.setAttribute('href', activeUrl)

    // 5. OpenGraph Tags
    const updateOG = (property: string, content: string) => {
      let el = document.querySelector(`meta[property="${property}"]`)
      if (!el) {
        el = document.createElement('meta')
        el.setAttribute('property', property)
        document.head.appendChild(el)
      }
      el.setAttribute('content', content)
    }

    updateOG('og:title', activeTitle)
    updateOG('og:description', activeDesc)
    updateOG('og:url', activeUrl)
    updateOG('og:type', type)
    updateOG('og:image', `https://nayaklabs.com${image}`)
    updateOG('og:site_name', 'Nayak Labs')

    // 6. Twitter Card Tags
    const updateTwitter = (name: string, content: string) => {
      let el = document.querySelector(`meta[name="${name}"]`)
      if (!el) {
        el = document.createElement('meta')
        el.setAttribute('name', name)
        document.head.appendChild(el)
      }
      el.setAttribute('content', content)
    }

    updateTwitter('twitter:card', 'summary_large_image')
    updateTwitter('twitter:title', activeTitle)
    updateTwitter('twitter:description', activeDesc)
    updateTwitter('twitter:image', `https://nayaklabs.com${image}`)
    updateTwitter('twitter:site', '@nayaklabs')

    // 7. Inject JSON-LD Schema.org graph
    let jsonLdScript = document.getElementById('nayaklabs-schema-jsonld')
    if (!jsonLdScript) {
      jsonLdScript = document.createElement('script')
      jsonLdScript.id = 'nayaklabs-schema-jsonld'
      jsonLdScript.setAttribute('type', 'application/ld+json')
      document.head.appendChild(jsonLdScript)
    }
    jsonLdScript.textContent = JSON.stringify(generateSchemaGraph(pathname))
  }, [activeTitle, activeDesc, activeUrl, image, pathname, type, currentSEO.keywords])

  return null
}
