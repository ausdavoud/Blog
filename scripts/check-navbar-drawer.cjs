// Run: node scripts/check-navbar-drawer.cjs
// Exercise navbar order, scroll transitions, dropdowns, and touch holds without a browser.
const assert = require('node:assert/strict')
const fs = require('node:fs')
const vm = require('node:vm')
const ts = require('typescript')

let states = [], cursor = 0, observer, reducedMotion = false, viewportWidth = 1024, pathname = '/posts', theme = 'light', now = 0, nextTimer = 0, scrolls = 0
const timers = new Map()
const documentListeners = new Map()
const setTimer = (callback, delay) => {
    const id = ++nextTimer
    timers.set(id, { callback, deadline: now + delay })
    return id
}
function advance(ms) {
    now += ms
    for (const [id, timer] of timers) {
        if (timer.deadline <= now) {
            timers.delete(id)
            timer.callback()
        }
    }
}
const element = (type, props, key) => ({ type, props: props ?? {}, key })
const react = {
    useState(initial) {
        const index = cursor++
        if (!(index in states)) states[index] = initial
        return [states[index], update => {
            states[index] = typeof update === 'function' ? update(states[index]) : update
        }]
    },
    useRef(initial) {
        const index = cursor++
        return states[index] ??= { current: initial }
    },
    useEffect(effect, dependencies) {
        const index = cursor++
        const previous = states[index]
        if (!previous || dependencies.some((value, i) => value !== previous.dependencies[i])) {
            previous?.cleanup?.()
            states[index] = { dependencies, cleanup: effect() }
        }
    },
    useId: () => 'tooltip',
    useCallback: callback => callback,
}
const config = { blog_name: 'Davoud Nosrati', direction: 'ltr', header: {
    nav_links: [
        { name: 'Posts', href: '/posts' },
        { name: 'Projects', href: '/projects' },
        { name: 'Art', href: '/art', children: [{ name: 'Poetry', href: '/poetry' }] },
        { name: 'About', href: '/about' },
    ],
    theme_toggle: true,
} }
const moduleObject = { exports: {} }
const source = fs.readFileSync('app/components/Header.tsx', 'utf8') + '\nexport { MorphingBrand, NavigationItem };'
const code = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
}).outputText
vm.runInNewContext(code, {
    exports: moduleObject.exports, module: moduleObject,
    setTimeout: setTimer,
    clearTimeout: id => timers.delete(id),
    window: {
        matchMedia: query => ({
            matches: query.includes('min-width: 460px') ? viewportWidth >= 460 : reducedMotion,
            addEventListener() {}, removeEventListener() {},
        }),
        setTimeout: setTimer,
        clearTimeout: id => timers.delete(id),
        scrollTo: () => scrolls++,
    },
    document: {
        addEventListener(type, callback) {
            if (!documentListeners.has(type)) documentListeners.set(type, new Set())
            documentListeners.get(type).add(callback)
        },
        removeEventListener(type, callback) { documentListeners.get(type)?.delete(callback) },
    },
    IntersectionObserver: class {
        constructor(callback) { observer = callback }
        disconnect() {}
    },
    require(name) {
        if (name === 'react') return react
        if (name === 'react/jsx-runtime') return { jsx: element, jsxs: element }
        if (name === 'next/navigation') return { usePathname: () => pathname }
        if (name === 'next-themes') return { useTheme: () => ({ theme, setTheme(value) { theme = value } }) }
        if (name === '@/config') return config
        return () => null
    },
})
function findAll(node, predicate) {
    if (!node?.props) return []
    return [
        ...(predicate(node) ? [node] : []),
        ...[node.props.children].flat(Infinity).flatMap(child => findAll(child, predicate)),
    ]
}
function renderComponent(component, props) {
    cursor = 0
    return component(props)
}
function reset() {
    states.forEach(state => state?.cleanup?.())
    states = []
    timers.clear()
}
function renderHeader() {
    return renderComponent(moduleObject.exports.default)
}
function render() {
    const tree = renderHeader()
    const drawer = findAll(tree, node => 'data-moving' in node.props && !findAll(node, child => child.props.current).length)[0]
    assert.ok(drawer, 'Drawer must exist')
    return drawer.props
}
function scroll(compact) {
    observer([{ isIntersecting: !compact, boundingClientRect: { top: compact ? -100 : 0 } }])
    return render()
}
function transition(props, type, bubbled = false) {
    const target = {}
    props[type === 'transitionend' ? 'onTransitionEnd' : 'onTransitionCancel']({
        type, target, currentTarget: bubbled ? {} : target, propertyName: 'grid-template-columns',
    })
    return render()
}
function clipped(props) {
    assert.ok(props.className.includes('overflow-hidden'), 'Items must be clipped before the first expanding frame')
    assert.equal(props.inert, true, 'Moving items must not receive focus')
}
render()
const drawerCollapse = scroll(true)
for (const node of findAll(renderHeader(), node => typeof node.props.className === 'string')) {
    assert.ok(!node.props.className.split(/\s+/).includes('invisible'), 'Collapsing items must remain visible while their width animates')
}
transition(drawerCollapse, 'transitionend')
let drawer = scroll(false)
clipped(drawer)
clipped(transition(drawer, 'transitionend', true))
clipped(transition(scroll(true), 'transitioncancel'))
drawer = transition(scroll(false), 'transitioncancel')
clipped(drawer)
drawer = transition(drawer, 'transitionend')
assert.ok(drawer.className.includes('overflow-visible'), 'Settled tooltips must remain unclipped')
assert.ok(!drawer.inert)
assert.equal(scroll(false)['data-moving'], false, 'Repeated observer entries must not restart clipping')
reducedMotion = true
scroll(true)
drawer = scroll(false)
assert.equal(drawer['data-moving'], false, 'Reduced motion must not wait for a transition that never runs')
assert.ok(!drawer.inert)

// Each route keeps a single copy of every section, in its configured position.
for (const route of ['/posts', '/projects', '/art', '/poetry', '/posts/page-tables']) {
    reset()
    pathname = route
    for (const compact of [false, true, false]) {
        renderHeader()
        scroll(compact)
        const items = findAll(renderHeader(), node => node.props.link)
        assert.deepEqual(items.map(item => item.props.link.name), ['Posts', 'Projects', 'Art', 'About'])
        assert.equal(items.filter(item => item.props.current).length, 1)
    }
}

// The entire Art button opens the dropdown; compact Art scrolls back to the full menu.
reset()
const navigationProps = { link: config.header.nav_links[2], pathname: '/posts', onNavigate() {} }
const renderNavigation = () => renderComponent(moduleObject.exports.NavigationItem, navigationProps)
let art = findAll(renderNavigation(), node => node.type === 'button')[0]
assert.ok(art.props.children.includes('Art'))
renderNavigation().props.onPointerDown({ pointerType: 'touch' })
art.props.onClick({ detail: 1 })
assert.equal(findAll(renderNavigation(), node => node.type === 'button')[0].props['aria-expanded'], true)
findAll(renderNavigation(), node => node.type === 'button')[0].props.onClick({ detail: 1 })
assert.equal(findAll(renderNavigation(), node => node.type === 'button')[0].props['aria-expanded'], false)
renderNavigation().props.onPointerEnter({ pointerType: 'mouse' })
renderNavigation().props.onPointerDown({ pointerType: 'mouse' })
findAll(renderNavigation(), node => node.type === 'button')[0].props.onClick({ detail: 1 })
assert.equal(findAll(renderNavigation(), node => node.type === 'button')[0].props['aria-expanded'], true, 'Mouse hover must not make the following click close the menu')
navigationProps.compact = true
findAll(renderNavigation(), node => node.type === 'button')[0].props.onClick()
assert.equal(scrolls, 1)

// On narrow screens the expanded name makes room by drawing in the other items.
reset()
viewportWidth = 390
reducedMotion = false
pathname = '/poetry'
renderHeader()
const headerBrand = () => findAll(renderHeader(), node => node.props.onExpandedChange)[0]
headerBrand().props.onExpandedChange(true)
assert.equal(findAll(renderHeader(), node => node.type === 'nav')[0].props['data-compact'], true)
const narrowItems = findAll(renderHeader(), node => node.props.link)
assert.equal(narrowItems.find(node => node.props.current).props.link.name, 'Art')
assert.ok(narrowItems.every(node => node.props.compact))
headerBrand().props.onExpandedChange(false)
clipped(render())
drawer = transition(render(), 'transitionend')
assert.ok(!drawer.inert)
assert.equal(findAll(renderHeader(), node => node.type === 'nav')[0].props['data-compact'], false)
viewportWidth = 1024

// A completed hold lasts while reading, but returning to the top restores scroll compaction.
for (const width of [390, 768]) {
    reset()
    viewportWidth = width
    renderHeader()
    scroll(true)
    headerBrand().props.onExpandedChange(true)
    scroll(true)
    assert.equal(headerBrand().props.expanded, true, 'Repeated compact observations must preserve the hold')
    scroll(false)
    assert.equal(headerBrand().props.expanded, false, 'Returning to the top must clear the held expansion')
    scroll(true)
    assert.equal(headerBrand().props.compact, true)
    assert.equal(headerBrand().props.expanded, false, 'Subsequent scrolls must compact the name again')
}
viewportWidth = 1024

// Route mounts insert the theme rotation at its final angle; toggles still animate it.
const themeRotation = tree => findAll(tree, node => node.props.className?.includes('duration-300 ease-in-out'))
for (const route of ['/poetry', '/posts']) {
    reset()
    pathname = route
    const initial = renderHeader()
    assert.equal(themeRotation(initial).length, 0, 'Hydration must not mount an unrotated theme wrapper')
    const placeholder = findAll(initial, node => node.props.className === 'inline-block h-4 w-4')[0]
    const rotation = themeRotation(renderHeader())[0]
    assert.notEqual(rotation.key, placeholder.key, 'The rotated icon must not reuse the placeholder span')
    assert.ok(rotation.props.className.includes('-rotate-45'), 'The sun must appear at its final angle')
}
findAll(renderHeader(), node => node.props['aria-label'] === 'Toggle color theme')[0].props.onClick()
assert.ok(themeRotation(renderHeader())[0].props.className.includes('rotate-0'), 'A theme toggle must still update the angle')
theme = 'light'

// Touch taps and movement never expand the name. A hold expands after 500 ms,
// suppresses its following click, and stays expanded until an outside click.
reset()
let navigations = 0
const brandProps = {
    name: 'Davoud Nosrati', compact: true, expanded: false,
    onExpandedChange(expanded) { brandProps.expanded = expanded },
    onNavigate() { navigations++ },
}
const renderBrand = () => renderComponent(moduleObject.exports.MorphingBrand, brandProps)
const collapsed = () => findAll(renderBrand(), node => node.props.className?.includes('transition-brand'))
    .every(node => node.props.className.includes('grid-cols-drawer-closed'))
const touch = { pointerType: 'touch', isPrimary: true, clientX: 10, clientY: 10 }
let prevented = false
const click = { preventDefault() { prevented = true } }
renderBrand().props.onPointerEnter(touch)
assert.ok(collapsed())
renderBrand().props.onPointerDown(touch)
advance(499)
assert.ok(collapsed())
renderBrand().props.onPointerUp()
renderBrand().props.onClick(click)
advance(1)
assert.ok(collapsed())
assert.equal(navigations, 1)
assert.equal(prevented, false)
renderBrand().props.onPointerDown(touch)
advance(500)
assert.ok(!collapsed())
renderBrand().props.onPointerUp()
renderBrand().props.onClick(click)
assert.ok(!collapsed(), 'Releasing a long press must leave the name expanded')
assert.equal(prevented, true)
assert.equal(navigations, 1)
const inside = {}
renderBrand().props.ref.current = { contains: target => target === inside }
for (const callback of documentListeners.get('click')) callback({ target: inside })
assert.ok(!collapsed(), 'Pressing within the name must not dismiss it')
renderBrand().props.onPointerLeave()
assert.ok(!collapsed(), 'Leaving the name must not dismiss a completed long press')
advance(1000)
assert.ok(!collapsed(), 'The expanded name must not time out')
for (const callback of documentListeners.get('pointerdown') ?? []) callback({ target: {} })
assert.ok(!collapsed(), 'Starting a scroll elsewhere must not dismiss the expanded name')
for (const callback of documentListeners.get('click')) callback({ target: {} })
assert.ok(collapsed(), 'Clicking elsewhere must dismiss the expanded name')
for (const cancel of ['onPointerCancel', 'onPointerLeave', 'onPointerMove']) {
    renderBrand().props.onPointerDown(touch)
    renderBrand().props[cancel]({ ...touch, clientY: 30 })
    advance(500)
    assert.ok(collapsed())
}
renderBrand().props.onPointerDown(touch)
advance(500)
assert.ok(!collapsed())
reset()
assert.equal(documentListeners.get('click').size, 0, 'Unmount must remove outside-click listeners')
brandProps.expanded = false
renderBrand().props.onPointerDown(touch)
reset()
assert.equal(timers.size, 0)
renderBrand().props.onPointerEnter({ pointerType: 'mouse' })
assert.ok(findAll(renderBrand(), node => node.props.className?.includes('transition-brand'))
    .every(node => node.props.className.includes('nav:grid-cols-drawer-open')), 'Desktop hover still expands the brand above the mobile breakpoint')
reset()

console.log('Navbar order, drawer transitions, dropdowns, long-press scroll reset, and theme rotation passed.')

if (process.argv.includes('--export')) {
    for (const route of ['index', 'posts', 'posts/page-tables', 'posts/hacking-through-x-content-type-options', 'posts/resurrecting-lms-log-part-1']) {
        const html = fs.readFileSync(`out/${route}.html`, 'utf8')
        assert.ok(html.includes('<article'), `${route} must contain its article`)
        assert.ok(!html.includes('<!--$?-->'), `${route} must not wait for a loading boundary`)
        assert.ok(!html.includes('<div hidden id="S:'), `${route} must not require JavaScript to reveal its content`)
    }
    console.log('Home, post list, and first three articles render without JavaScript reveal steps.')
}
