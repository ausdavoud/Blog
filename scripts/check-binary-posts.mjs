import assert from 'node:assert/strict'

// Run with a cua_repl tab at /posts-binary, at desktop and phone widths.
export async function checkBinaryPosts(tab) {
    const read = () => tab.playwright.evaluate(() => {
        const frame = document.querySelector('.binary-posts-frame')
        const label = document.querySelector('.binary-posts-label text')
        const zeros = [...frame.querySelectorAll('.binary-posts-anchors text')]
        const digits = [...frame.querySelectorAll('.binary-posts-digits text')]
        const boxes = [...zeros, ...digits, label].map(text => text.getBoundingClientRect())
        let collisions = 0
        for (let i = 0; i < boxes.length; i++) for (let j = i + 1; j < boxes.length; j++) {
            const a = boxes[i], b = boxes[j]
            if (a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top) collisions++
        }
        const cutout = document.querySelector('.binary-posts-cutout').getBoundingClientRect()
        const path = frame.querySelector('.binary-posts-connection').getBoundingClientRect()
        return {
            width: cutout.width, height: cutout.height,
            active: document.querySelector('.binary-posts-banner').dataset.hovered,
            zeros: zeros.length, collisions,
            baselines: [label, ...zeros].map(text => text.getAttribute('y')),
            path: { left: Math.round(path.left - cutout.left), right: Math.round(path.right - cutout.left), top: Math.round(path.top - cutout.top) },
            crop: getComputedStyle(document.querySelector('.binary-posts-banner > img')).clipPath,
            guide: getComputedStyle(frame.querySelector('.binary-posts-guides path')).stroke,
            overflow: document.documentElement.scrollWidth > innerWidth,
            compact: !!document.querySelector('.compact-site-header'),
        }
    })
    await tab.playwright.locator('.binary-posts-label').press('ArrowRight')
    await tab.getAXState({ emit: false })
    const active = await read()
    assert.equal(active.active, 'true')
    assert.equal(active.zeros, 2)
    assert.equal(active.width, 150)
    assert.equal(active.height, 36)
    assert.equal(active.collisions, 0, 'Digits, anchors, and title must not overlap')
    assert.equal(active.baselines.join(','), '33,33,33', 'Title and zeros share a baseline')
    assert.equal([active.path.left, active.path.right, active.path.top].join(','), '5,145,7', 'Curves stay inset and symmetrical')
    assert.match(active.crop, /10px/)
    assert.notEqual(active.guide, 'none', 'Guide lines stay present on hover')
    assert.equal(active.overflow, false)
    assert.equal(active.compact, false)
    await tab.playwright.locator('.binary-posts-label').press('Tab')
    await tab.getAXState({ emit: false })
    assert.equal((await read()).active, 'false')
    return 'Aligned baselines, inset curves, no glyph collisions or overflow; focus effect resets.'
}
