// Evaluate checkCompactNavigation("initial"), then scroll past the site header
// and evaluate "pinned" after the entrance animation settles and after focusing
// the badge. During the return animation use "exiting".
// Repeat "initial" after scrolling back; run at desktop and phone widths.
export function checkCompactNavigation(phase) {
    const check = (condition, message) => {
        if (!condition) throw new Error(message)
    }
    const nav = document.querySelector('.compact-site-header')
    check(nav, 'Compact navigation rendered')
    check(!document.querySelector('.posts-header-strip'), 'Old notch removed')
    check(document.documentElement.scrollWidth <= innerWidth, 'No horizontal overflow')
    if (phase === 'initial') {
        check(nav.dataset.visible === 'false' && getComputedStyle(nav).opacity === '0', 'Compact navigation faded out at the top')
        check(nav.hasAttribute('inert') && nav.getAttribute('aria-hidden') === 'true', 'Hidden navigation cannot receive focus')
        return { phase, width: innerWidth }
    }
    const rect = nav.getBoundingClientRect()
    const style = getComputedStyle(nav)
    const current = nav.querySelector('.compact-current')
    check(current.tagName === 'A' && !current.querySelector('svg'), 'Badge has no dropdown or chevron')
    check(rect.height <= 38, 'Navbar remains compact')
    if (phase === 'exiting') {
        check(nav.dataset.visible === 'false', 'Exit triggered')
        check(Number(style.opacity) > 0 && Number(style.opacity) < 1 && style.visibility === 'visible', 'Exit fades instead of disappearing')
        check(nav.hasAttribute('inert'), 'Exiting navigation is not interactive')
        return { phase, opacity: Number(style.opacity) }
    }
    check(nav.dataset.visible === 'true' && !nav.hasAttribute('inert'), 'Compact navigation visible and interactive after scrolling')
    check(style.position === 'fixed' && Math.abs(rect.top - 16) < 1, 'Pinned with a top margin')
    check(Math.abs(rect.left + rect.width / 2 - innerWidth / 2) < 1, 'Navbar stays centered')
    check(getComputedStyle(nav.querySelector('.compact-site-name')).fontFamily === getComputedStyle(document.body).fontFamily, 'Site name uses the default Garamond font')
    check(rect.width < document.querySelector('.site-header').getBoundingClientRect().width, 'Content-sized rather than full-width')
    check(rect.left >= 0 && rect.right <= innerWidth, 'Fits the viewport')
    check(style.backdropFilter === 'blur(8px)' && Number(style.borderRadius.replace('px', '')) >= 10, 'Light blur and rounded corners')
    check(nav.querySelector('.compact-site-name').getAttribute('href') === '/', 'Site name links home')
    check(current.textContent.trim() === 'Posts' && current.getAttribute('href') === '/posts', 'Current section links directly to posts')
    check(current.getAttribute('aria-current') === 'page', 'Current page is accessible')
    check(phase === 'pinned', 'Known test phase')
    check(nav.querySelectorAll('a').length === 2 && !nav.querySelector('details, .compact-extra'), 'Only site name and current page remain')
    return { phase, width: innerWidth, navWidth: rect.width }
}
