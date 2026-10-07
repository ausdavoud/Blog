// Run from cua_repl with a localhost /posts tab:
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
        const state = await read()
        const point = [state.width - 20, state.height - 100]
        await tab.scroll(point, 'down', (state.anchor - 46.5) / state.height)
        await tab.getAXState({ emit: false })
        let current = await read()
        assert.equal(current.docked, 'true', 'The badge must expand above the cutoff')
        assert.equal(current.nameHidden, 'false')
        assert.match(current.blur, /blur\(/)
        assert.equal(current.overflow, false)

        // Its bottom re-enters at 48px before its top does: the original stuck-state bug.
        await tab.scroll(point, 'up', 1 / state.height)
        await tab.getAXState({ emit: false })
        assert.equal((await read()).docked, 'false', 'A one-pixel reversal must collapse the bar')
        await tab.scroll(point, 'up', 72 / state.height)
        await tab.getAXState({ emit: false })
        assert.equal((await read()).docked, 'false', 'The bar must remain collapsed above the banner')
    }
    await tab.pressKey(null, 'Home')
    await tab.getAXState({ emit: false })
    return 'Three one-pixel reversals passed; blur remains enabled and no horizontal overflow.'
}
