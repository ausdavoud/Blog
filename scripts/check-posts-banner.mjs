// Run from cua_repl with a localhost /posts-glass tab:
// const { checkPostsBanner } = await import('file:///Users/davoud/dev/Blog/scripts/check-posts-banner.mjs')
// await checkPostsBanner(tab)
import assert from 'node:assert/strict'

export async function checkPostsBanner(tab) {
    await tab.pressKey(null, 'Home')
    await tab.getAXState({ emit: false })
    await tab.playwright.locator('.glass').waitFor({ state: 'visible' })
    const read = () => tab.playwright.evaluate(() => {
        const title = document.querySelector('.posts-title')
        return {
            docked: title.dataset.docked,
            anchor: document.querySelector('[data-posts-anchor]').getBoundingClientRect().top,
            width: innerWidth,
            height: innerHeight,
            overflow: document.documentElement.scrollWidth > innerWidth,
            blur: getComputedStyle(title.querySelector('.glass__warp')).backdropFilter,
            nameHidden: title.querySelector('.posts-glass-name').getAttribute('aria-hidden'),
        }
    })
    assert.equal((await read()).docked, 'false')
    for (let i = 0; i < 3; i++) {
        for (let step = 0; step < 60 && (await read()).docked !== 'true'; step++) {
            await tab.pressKey(null, 'Down')
            await tab.getAXState({ emit: false })
        }
        let current = await read()
        assert.equal(current.docked, 'true', 'The badge must expand above the cutoff')
        assert.equal(current.nameHidden, 'false')
        assert.match(current.blur, /blur\(/)
        assert.equal(current.overflow, false)

        await tab.pressKey(null, 'Home')
        await tab.getAXState({ emit: false })
        assert.equal((await read()).docked, 'false', 'Returning to the top must collapse the bar')
        assert.equal((await read()).nameHidden, 'true')
        assert.equal(await tab.playwright.locator('.compact-site-header').count(), 0, 'The current navbar must not overlap the glass design')
    }
    await tab.pressKey(null, 'Home')
    await tab.getAXState({ emit: false })
    return 'Three scroll reversals passed; blur remains enabled, no overlapping navbar or horizontal overflow.'
}
