import assert from 'node:assert/strict'

// Run with a cua_repl /posts tab, at desktop and phone widths.
export async function checkCompactNavigation(tab) {
    const read = () => tab.playwright.evaluate(() => {
        const nav = document.querySelector('.morph-site-header')
        const rect = nav.getBoundingClientRect()
        const extra = nav.querySelector('.morph-extra')
        return {
            count: document.querySelectorAll('.morph-site-header').length,
            compact: nav.dataset.compact,
            width: rect.width, height: rect.height, top: rect.top,
            centered: Math.abs(rect.left + rect.width / 2 - innerWidth / 2) < 1,
            hidden: extra.hasAttribute('inert') && extra.getAttribute('aria-hidden') === 'true',
            sections: nav.textContent,
            dropdown: !!nav.querySelector('details summary'),
            overflow: document.documentElement.scrollWidth > innerWidth,
            family: getComputedStyle(nav.querySelector('.compact-site-name')).fontFamily === getComputedStyle(document.body).fontFamily,
            current: nav.querySelector('.compact-current')?.getAttribute('href'),
            transition: getComputedStyle(extra).transitionProperty,
            url: location.pathname,
            viewport: innerWidth,
            nameTop: nav.querySelector('.compact-site-name').getBoundingClientRect().top,
            currentTop: nav.querySelector('.compact-current').getBoundingClientRect().top,
            extraTop: extra.querySelector('.nav-item').getBoundingClientRect().top,
            drawer: getComputedStyle(extra).clipPath !== 'none' && getComputedStyle(extra.firstElementChild).transitionProperty.includes('transform'),
            drawerHeight: extra.firstElementChild.getBoundingClientRect().height,
            rows: getComputedStyle(nav).gridTemplateRows.split(' ').length,
        }
    })
    await tab.pressKey(null, 'Home')
    await tab.getAXState({ emit: false })
    await tab.screenshot({ fullPage: false })
    const initial = await read()
    assert.equal(initial.compact, 'false')
    assert.equal(initial.hidden, false)
    for (const name of ['Posts', 'Projects', 'Art', 'About']) assert.ok(initial.sections.includes(name))
    assert.equal(initial.dropdown, true)
    assert.equal(initial.overflow, false)
    assert.equal(initial.drawer, true, 'Extras slide through a clipped drawer')
    assert.ok(Math.abs(initial.currentTop - initial.extraTop) < 1, 'Selected and other items share a row')
    if (initial.viewport >= 460) assert.ok(Math.abs(initial.nameTop - initial.currentTop) < 1, 'One row from 460px upward')
    else assert.ok(initial.nameTop < initial.currentTop - 20, 'Name sits above all sections below 460px')
    for (let cycle = 0; cycle < 2; cycle++) {
        for (let i = 0; i < 8; i++) await tab.pressKey(null, 'Down')
        await tab.getAXState({ emit: false })
        await tab.screenshot({ fullPage: false })
        const pinned = await read()
        assert.equal(pinned.compact, 'true')
        assert.equal(pinned.count, 1, 'One navbar remains mounted throughout the transition')
        assert.ok(pinned.width < initial.width - 1 || pinned.height < initial.height - 1, 'Navbar shrinks')
        assert.equal(pinned.hidden, true, 'Collapsed links leave the tab order')
        assert.ok(Math.abs(pinned.top - 16) < 1)
        assert.equal(pinned.centered, true)
        assert.equal(pinned.overflow, false)
        assert.equal(pinned.family, true)
        assert.equal(pinned.current, '/posts')
        assert.equal(pinned.rows, initial.rows, 'Row layout stays fixed during both transitions')
        assert.equal(pinned.drawerHeight, 26, 'Drawer contents retain their height while shrinking')
        assert.ok(Math.abs(pinned.currentTop - pinned.extraTop) < 1, 'Drawer remains level with the current badge')
        assert.ok(pinned.transition.includes('grid-template-columns'))
        await tab.playwright.locator('.morph-current .compact-current').click()
        await tab.playwright.locator('.morph-site-header[data-compact="false"]').waitFor({ state: 'visible' })
        await tab.getAXState({ emit: false })
        await tab.pressKey(null, 'Home')
        await tab.getAXState({ emit: false })
        await tab.screenshot({ fullPage: false })
        const returned = await read()
        assert.equal(returned.compact, 'false')
        assert.equal(returned.url, '/posts')
        assert.equal(returned.hidden, false)
        assert.ok(Math.abs(returned.width - initial.width) < 1 && Math.abs(returned.height - initial.height) < 1, 'Full navbar returns to its original size')
    }
    return 'Two reversible transitions passed; one navbar, accessible collapse, no overflow, and scroll-to-top preserved.'
}
