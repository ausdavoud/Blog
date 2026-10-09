// Run: node scripts/check-navbar-drawer.cjs
// Exercise the scroll/transition callbacks before any browser transition event fires.
const assert = require('node:assert/strict')
const fs = require('node:fs')
const vm = require('node:vm')
const ts = require('typescript')

let states = [], cursor = 0, observer, mounted = false, reducedMotion = false
const element = (type, props) => ({ type, props: props ?? {} })
const react = {
    useState(initial) {
        const index = cursor++
        if (!(index in states)) states[index] = initial
        return [states[index], update => {
            states[index] = typeof update === 'function' ? update(states[index]) : update
        }]
    },
    useRef: () => ({ current: null }),
    useEffect(effect) { if (!mounted) effect() },
}
const config = { blog_name: 'Davoud Nosrati', direction: 'ltr', header: {
    nav_links: [{ name: 'Posts', href: '/posts' }, { name: 'Projects', href: '/projects' }],
    theme_toggle: true,
} }
const moduleObject = { exports: {} }
const code = ts.transpileModule(fs.readFileSync('app/components/Header.tsx', 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
}).outputText
vm.runInNewContext(code, {
    exports: moduleObject.exports, module: moduleObject,
    window: { matchMedia: () => ({ matches: reducedMotion }) },
    IntersectionObserver: class {
        constructor(callback) { observer = callback }
        disconnect() {}
    },
    require(name) {
        if (name === 'react') return react
        if (name === 'react/jsx-runtime') return { jsx: element, jsxs: element }
        if (name === 'next/navigation') return { usePathname: () => '/posts' }
        if (name === 'next-themes') return { useTheme: () => ({ theme: 'light', setTheme() {} }) }
        if (name === '@/config') return config
        return () => null
    },
})
function findDrawer(node) {
    if (!node?.props) return
    if ('data-moving' in node.props) return node
    for (const child of [node?.props?.children].flat()) {
        const found = findDrawer(child)
        if (found) return found
    }
}
function render() {
    cursor = 0
    const drawer = findDrawer(moduleObject.exports.default())
    mounted = true
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
transition(scroll(true), 'transitionend')
let drawer = scroll(false)
clipped(drawer)
clipped(transition(drawer, 'transitionend', true))
clipped(transition(scroll(true), 'transitioncancel'))
drawer = transition(scroll(false), 'transitioncancel')
clipped(drawer)
drawer = transition(drawer, 'transitionend')
assert.ok(drawer.className.includes('overflow-visible'), 'Settled tooltips must remain unclipped')
assert.equal(drawer.inert, false)
assert.equal(scroll(false)['data-moving'], false, 'Repeated observer entries must not restart clipping')
reducedMotion = true
scroll(true)
drawer = scroll(false)
assert.equal(drawer['data-moving'], false, 'Reduced motion must not wait for a transition that never runs')
assert.equal(drawer.inert, false)
console.log('Navbar expansion clipping, reversal, tooltip recovery, and reduced motion passed.')
