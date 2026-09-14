import React from 'react'
import { useDeviceProfile } from '../../utils/useDeviceProfile'

// Mobile-Dedicated Components (Isolated in src/components/tiers/mobile/)
import { MobileNavbar } from './mobile/MobileNavbar'
import { MobileHero } from './mobile/MobileHero'

// Tablet-Dedicated Components
import { TabletNavbar } from './tablet/TabletNavbar'
import { TabletHero } from './tablet/TabletHero'

// Desktop & Laptop Components (UNTOUCHED)
import { Navbar } from '../Navbar'
import { Hero3D } from '../Hero3D'
import { PillarStack } from '../pillars/PillarStack'
import { About } from '../About'
import { WhyChooseUs } from '../WhyChooseUs'
import { Contact } from '../Contact'
import { CurvedLoop } from '../ui/react-bits'

// ── 1. NAVBAR DISPATCHER ──
interface TierNavbarProps {
  onScrollTo?: (id: string) => void
  onReplayIntro?: () => void
}

export function TierNavbarDispatcher({ onScrollTo, onReplayIntro }: TierNavbarProps) {
  const device = useDeviceProfile()

  if (device.isMobile) {
    return <MobileNavbar onScrollTo={onScrollTo} />
  }

  if (device.isTablet || (device.isTouch && device.width < 1024)) {
    return <TabletNavbar onScrollTo={onScrollTo} />
  }

  return <Navbar onScrollTo={onScrollTo} onReplayIntro={onReplayIntro} />
}

// ── 2. HERO DISPATCHER ──
interface TierHeroProps {
  visible?: boolean
  isIntroHandoff?: boolean
  onScrollToDivision?: (id: string) => void
  onWordmarkDocked?: () => void
}

export function TierHeroDispatcher({
  visible = true,
  isIntroHandoff = false,
  onScrollToDivision,
  onWordmarkDocked,
}: TierHeroProps) {
  const device = useDeviceProfile()

  if (device.isMobile) {
    return <MobileHero onScrollToDivision={onScrollToDivision} />
  }

  if (device.isTablet || (device.isTouch && device.width < 1024)) {
    return <TabletHero onScrollToDivision={onScrollToDivision} />
  }

  return (
    <Hero3D
      visible={visible}
      isIntroHandoff={isIntroHandoff}
      onScrollToDivision={onScrollToDivision}
      onWordmarkDocked={onWordmarkDocked}
    />
  )
}

// ── 3. PILLAR STACK (DIVISIONS) DISPATCHER ──
export function TierPillarStackDispatcher() {
  return <PillarStack />
}

// ── 4. RIBBON MARQUEE DISPATCHER ──
interface TierMarqueeProps {
  text: string
  direction?: 'left' | 'right'
}

export function TierMarqueeDispatcher({ text, direction = 'left' }: TierMarqueeProps) {
  return (
    <CurvedLoop
      text={text}
      direction={direction}
      speed={0.065}
      fontSize={15}
      curveHeight={22}
      className="w-full my-1 opacity-95"
    />
  )
}

// ── 5. ABOUT / MANIFESTO DISPATCHER ──
export function TierAboutDispatcher() {
  return <About />
}

// ── 6. WHY CHOOSE US (WORKFLOW) DISPATCHER ──
export function TierWhyChooseUsDispatcher() {
  return <WhyChooseUs />
}

// ── 7. CONTACT DISPATCHER ──
export function TierContactDispatcher() {
  return <Contact />
}
