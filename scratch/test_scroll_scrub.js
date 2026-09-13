import { chromium } from 'playwright'

async function testScrollScrub() {
  const browser = await chromium.launch({ headless: true })
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })

  await page.goto('http://127.0.0.1:5173/')
  const skipBtn = page.locator('button:has-text("Skip")')
  if (await skipBtn.isVisible()) await skipBtn.click()
  await page.waitForTimeout(2500)

  // Navigate to /services
  await page.locator('nav >> text=Services').first().click()
  await page.waitForTimeout(1000)

  // Navigate back to Home
  await page.locator('nav >> text=Home').first().click()
  await page.waitForTimeout(1000)

  // Now scroll down by 400px
  console.log('Scrolling down by 400px...')
  await page.evaluate(() => window.scrollBy({ top: 400, behavior: 'instant' }))
  await page.waitForTimeout(800)

  await page.screenshot({ path: '/home/nawaz/.gemini/antigravity-ide/brain/87ded592-24dd-45bc-bda9-e3a86026079e/debug_scrub_400px.png' })
  console.log('Saved debug_scrub_400px.png')

  // Scroll down to 700px (full card reveal)
  console.log('Scrolling down to 700px...')
  await page.evaluate(() => window.scrollBy({ top: 300, behavior: 'instant' }))
  await page.waitForTimeout(800)

  await page.screenshot({ path: '/home/nawaz/.gemini/antigravity-ide/brain/87ded592-24dd-45bc-bda9-e3a86026079e/debug_scrub_700px.png' })
  console.log('Saved debug_scrub_700px.png')

  // Scroll back to top
  console.log('Scrolling back to top (0px)...')
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }))
  await page.waitForTimeout(800)

  await page.screenshot({ path: '/home/nawaz/.gemini/antigravity-ide/brain/87ded592-24dd-45bc-bda9-e3a86026079e/debug_scrub_back_to_0.png' })
  console.log('Saved debug_scrub_back_to_0.png')

  await browser.close()
  console.log('Scroll scrub test complete!')
}

testScrollScrub().catch(console.error)
