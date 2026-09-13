import { chromium } from 'playwright'

async function inspectHero() {
  const browser = await chromium.launch({ headless: true })
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })

  await page.goto('http://127.0.0.1:5173/')
  // Skip intro
  const skipBtn = page.locator('button:has-text("Skip")')
  if (await skipBtn.isVisible()) await skipBtn.click()
  await page.waitForTimeout(3000) // Wait for full bounce

  console.log('--- Initial Hero on / ---')
  const initialStyles = await page.evaluate(() => {
    const wordmark = document.querySelector('h1')
    const letters = Array.from(document.querySelectorAll('.hero-letter')).map((el) => ({
      char: el.textContent,
      opacity: window.getComputedStyle(el).opacity,
      transform: window.getComputedStyle(el).transform,
    }))
    return {
      wordmarkTransform: wordmark ? window.getComputedStyle(wordmark).transform : null,
      letters,
    }
  })
  console.log('Initial letters:', initialStyles.letters.map(l => `${l.char}:${l.opacity}`).join(' '))

  // Navigate to /products
  await page.locator('nav >> text=Products').first().click()
  await page.waitForTimeout(1000)

  // Navigate back to Home
  await page.locator('nav >> text=Home').first().click()
  await page.waitForTimeout(1000)

  console.log('\n--- Returned to Home ---')
  const returnStyles = await page.evaluate(() => {
    const wordmark = document.querySelector('h1')
    const stage = document.querySelector('[class*="wordmarkStage"]') || wordmark?.parentElement
    const letters = Array.from(document.querySelectorAll('.hero-letter')).map((el) => ({
      char: el.textContent,
      opacity: window.getComputedStyle(el).opacity,
      transform: window.getComputedStyle(el).transform,
      rect: el.getBoundingClientRect(),
    }))
    return {
      scrollY: window.scrollY,
      wordmarkTransform: wordmark ? window.getComputedStyle(wordmark).transform : null,
      wordmarkOpacity: wordmark ? window.getComputedStyle(wordmark).opacity : null,
      wordmarkRect: wordmark?.getBoundingClientRect(),
      letters,
    }
  })
  console.log('Return scrollY:', returnStyles.scrollY)
  console.log('Return wordmarkTransform:', returnStyles.wordmarkTransform)
  console.log('Return wordmarkRect:', returnStyles.wordmarkRect)
  console.log('Return letters:', returnStyles.letters.map(l => `${l.char}:${l.opacity} (x:${Math.round(l.rect.x)})`).join(' '))

  await page.screenshot({ path: '/home/nawaz/.gemini/antigravity-ide/brain/87ded592-24dd-45bc-bda9-e3a86026079e/debug_inspect_hero.png' })
  await browser.close()
}

inspectHero().catch(console.error)
