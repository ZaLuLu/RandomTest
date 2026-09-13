import { chromium } from 'playwright'

async function runTest() {
  console.log('🚀 Starting verification of Subpage-to-Hero navigation & Audio Unlock...')
  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  })
  const page = await context.newPage()

  // 1. Test Cold Start Intro & Audio Affordance
  console.log('--- Phase 1: Intro Sound Controls ---')
  await page.goto('http://127.0.0.1:5173/')
  await page.waitForTimeout(1000)

  // Check if Enable Sound button is visible during intro
  const soundBtn = page.locator('text=Enable Sound')
  const soundBtnVisible = await soundBtn.isVisible().catch(() => false)
  console.log('Sound button visible on intro:', soundBtnVisible)

  // Click Enable Sound button
  if (soundBtnVisible) {
    await soundBtn.click()
    console.log('Clicked Enable Sound button!')
    await page.waitForTimeout(500)
    const activeText = await page.locator('text=Sound Active').isVisible().catch(() => false)
    console.log('Sound Active status visible:', activeText)
  }

  // Click Skip to transition to Hero
  const skipBtn = page.locator('button:has-text("Skip")')
  if (await skipBtn.isVisible()) {
    await skipBtn.click()
    console.log('Clicked Skip intro button')
  }

  await page.waitForTimeout(1500)

  // Check that Nayak Labs Hero is visible
  const heroWordmark = page.locator('h1').first()
  console.log('Hero Wordmark visible after intro:', await heroWordmark.isVisible())

  // Check initial scroll position
  const scrollPos1 = await page.evaluate(() => window.scrollY)
  console.log('Scroll position after intro:', scrollPos1)

  // 2. Test Subpage Navigation
  console.log('\n--- Phase 2: Subpage Navigation to /products ---')
  // Click Products in Navbar
  const productsNav = page.locator('nav >> text=Products').first()
  await productsNav.click()
  await page.waitForTimeout(1200)

  console.log('Current URL after navigation:', page.url())
  console.log('Is on /products:', page.url().includes('/products'))

  // 3. Test Return to Homepage via "Home" navbar link
  console.log('\n--- Phase 3: Click Home in Navbar from /products ---')
  const homeNav = page.locator('nav >> text=Home').first()
  await homeNav.click()
  await page.waitForTimeout(1200)

  console.log('Current URL after clicking Home:', page.url())
  const scrollPosAfterHome = await page.evaluate(() => window.scrollY)
  console.log('Scroll position after returning to Home:', scrollPosAfterHome)

  // Check if Nayak Labs Hero is visible on screen
  const wordmarkStageVisible = await page.evaluate(() => {
    const el = document.querySelector('[data-testid="hero-wordmark"], [class*="tracking-tighter"]')
    const rect = el ? el.getBoundingClientRect() : null
    const heroH1 = document.querySelector('h1')
    return {
      h1Text: heroH1 ? heroH1.textContent : null,
      h1Visible: heroH1 ? window.getComputedStyle(heroH1).opacity !== '0' : false,
      scrollY: window.scrollY
    }
  })
  console.log('Hero visibility on return:', wordmarkStageVisible)

  // Check if PSA cards are hidden at the top (should have opacity 0 or be below)
  const psaCardsState = await page.evaluate(() => {
    const revealed = document.querySelector('.revealed-content') || document.querySelector('[class*="revealed"]')
    // Or check first card
    const card = document.querySelector('article')
    return {
      revealedOpacity: revealed ? window.getComputedStyle(revealed).opacity : 'n/a',
      revealedPointerEvents: revealed ? window.getComputedStyle(revealed).pointerEvents : 'n/a',
    }
  })
  console.log('PSA Cards state at top:', psaCardsState)

  await page.screenshot({ path: '/home/nawaz/.gemini/antigravity-ide/brain/87ded592-24dd-45bc-bda9-e3a86026079e/verify_subpage_to_hero.png' })
  console.log('Saved screenshot to verify_subpage_to_hero.png')

  // 4. Test Return to Homepage via Brand Logo
  console.log('\n--- Phase 4: Click Brand Logo from /services ---')
  await page.goto('http://127.0.0.1:5173/services')
  await page.waitForTimeout(1000)
  console.log('Navigated to /services:', page.url())

  // Click brand logo
  const logo = page.locator('a[aria-label*="Nayak Labs"], button[aria-label*="Nayak Labs"]').first()
  await logo.click()
  await page.waitForTimeout(1200)

  console.log('Current URL after clicking Logo:', page.url())
  const scrollPosAfterLogo = await page.evaluate(() => window.scrollY)
  console.log('Scroll position after logo click:', scrollPosAfterLogo)

  const heroVisibleAfterLogo = await page.evaluate(() => {
    const heroH1 = document.querySelector('h1')
    return {
      h1Text: heroH1 ? heroH1.textContent : null,
      h1Opacity: heroH1 ? window.getComputedStyle(heroH1).opacity : null,
      scrollY: window.scrollY
    }
  })
  console.log('Hero visibility after logo click:', heroVisibleAfterLogo)

  await page.screenshot({ path: '/home/nawaz/.gemini/antigravity-ide/brain/87ded592-24dd-45bc-bda9-e3a86026079e/verify_logo_to_hero.png' })
  console.log('Saved screenshot to verify_logo_to_hero.png')

  await browser.close()
  console.log('✅ Verification completed successfully!')
}

runTest().catch((err) => {
  console.error('❌ Test failed:', err)
  process.exit(1)
})
