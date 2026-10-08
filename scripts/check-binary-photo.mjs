import assert from 'node:assert/strict'

// Add this fixture as app/photo-check/page.tsx in a temporary checkout, then run
// checkBinaryPhoto(tab) from cua_repl on /photo-check. No test route is shipped.
export const fixture = `'use client'
import BinaryPhoto from '../components/BinaryPhoto'
export default function PhotoCheck() {
    return <>
        <BinaryPhoto src="/whome-2.webp" alt="Photo test" />
        <button onClick={() => document.querySelector('.binary-photo')?.dispatchEvent(
            new PointerEvent('pointerdown', { pointerType: 'touch', bubbles: true })
        )}>Tap photo</button>
        <button onPointerDown={event => event.stopPropagation()}>Outside control</button>
    </>
}`

export async function checkBinaryPhoto(tab) {
    const active = () => tab.playwright.locator('.binary-photo').getAttribute('data-hovered')
    const tap = async () => {
        await tab.playwright.getByRole('button', { name: 'Tap photo', exact: true }).press('Return')
        await tab.getAXState({ emit: false })
    }
    await tap()
    assert.equal(await active(), 'true', 'Touch starts the photo animation')
    await tap()
    assert.equal(await active(), 'false', 'A second touch still toggles it off')
    await tap()
    await tab.playwright.getByRole('button', { name: 'Outside control' }).click()
    await tab.getAXState({ emit: false })
    assert.equal(await active(), 'false', 'Outside taps stop it even when a control stops bubbling')
    await tap()
    assert.equal(await active(), 'true', 'Touch can restart the animation after dismissing it')
    return 'Photo touch toggles, outside dismissal, capture handling, and restart passed.'
}
