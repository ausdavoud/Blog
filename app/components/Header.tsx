'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTheme } from 'next-themes'
import { ChevronDown } from 'lucide-react'
import { useEffect, useId, useRef, useState, type MouseEventHandler, type ReactNode, type TransitionEvent } from 'react'
import config from '@/config'
import type { NavLink } from '@/app/types'
import ThemeIcon from './ThemeIcon'

const navItem = 'nav-item rounded-nav-item font-medium whitespace-nowrap transition-colors hover:text-primary focus-visible:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'

// Match this to the `duration-nav` token used by the drawer transition, plus slack.
const NAV_TRANSITION_MS = 300

export function ComingSoon({ children, className = '', side = false }: {
    children: ReactNode
    className?: string
    side?: boolean
}) {
    const id = useId()
    return <span role="link" aria-disabled="true" aria-labelledby={`${id}-label`} aria-describedby={`${id}-tooltip`} tabIndex={0}
        className={`coming-soon group/soon relative inline-block cursor-default rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${className}`}>
        <span id={`${id}-label`}>{children}</span>
        <span id={`${id}-tooltip`} role="tooltip"
            className={`coming-soon-tooltip pointer-events-none invisible absolute z-20 w-max rounded border border-nav-panel-border bg-nav-panel px-2 py-1 text-nav-tooltip font-normal leading-none whitespace-nowrap text-on-background backdrop-blur-lg group-hover/soon:visible group-focus-visible/soon:visible ${side ? 'right-full top-1/2 mr-2 -translate-y-1/2' : 'left-1/2 top-full mt-2 -translate-x-1/2'}`}>
            <span aria-hidden="true" className={`absolute h-1.5 w-1.5 rotate-45 border-nav-panel-border bg-inherit ${side ? '-right-1 top-1/2 -translate-y-1/2 border-r border-t' : '-top-1 left-1/2 -translate-x-1/2 border-l border-t'}`} />
            Coming soon
        </span>
    </span>
}

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })
}

function NavigationItem({ link, pathname, current = false, compact = false, onNavigate }: {
    link: NavLink
    pathname: string
    current?: boolean
    compact?: boolean
    onNavigate: MouseEventHandler<HTMLAnchorElement>
}) {
    const [open, setOpen] = useState(false)
    const root = useRef<HTMLDivElement>(null)
    const className = `${navItem} px-2.5 py-px text-sm leading-6 ${current ? 'nav-current bg-nav-current text-on-background-stronger' : 'text-on-background-muted'}`
    const close = () => setOpen(false)

    // Close the dropdown on outside pointer-down and on Escape. Using a plain
    // wrapper + real <Link> + toggle <button> instead of <details>/<summary>
    // means the label can navigate while the chevron opens the panel; there is
    // no native toggle racing React state.
    useEffect(() => {
        if (!open) return
        const onPointerDown = (event: PointerEvent) => {
            if (!root.current?.contains(event.target as Node)) close()
        }
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') close()
        }
        document.addEventListener('pointerdown', onPointerDown)
        document.addEventListener('keydown', onKeyDown)
        return () => {
            document.removeEventListener('pointerdown', onPointerDown)
            document.removeEventListener('keydown', onKeyDown)
        }
    }, [open])

    if (link.children?.length) {
        return (
            <div
                ref={root}
                className="relative shrink-0"
                onPointerEnter={event => { if (event.pointerType === 'mouse' && !compact) setOpen(true) }}
                onPointerLeave={event => { if (event.pointerType === 'mouse') close() }}
                onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) close() }}
            >
                <div className={`${className} flex items-center gap-1`}>
                    <Link
                        href={link.href}
                        prefetch
                        className="rounded-nav-item"
                        aria-current={pathname === link.href ? 'page' : undefined}
                        onClick={event => { close(); onNavigate(event) }}
                    >
                        {link.name}
                    </Link>

                    <button
                        type="button"
                        aria-label={`${link.name} submenu`}
                        aria-expanded={open && !compact}
                        className={`flex shrink-0 cursor-pointer items-center ${compact ? 'hidden' : ''}`}
                        onClick={() => {
                            if (compact) { scrollToTop(); return }
                            setOpen(value => !value)
                        }}
                    >
                        <ChevronDown
                            size={16}
                            className={`relative top-px transition-transform duration-200 motion-reduce:transition-none ${open ? 'rotate-180' : ''}`}
                        />
                    </button>
                </div>

                {open && !compact && (
                    <div className="nav-dropdown-panel absolute end-0 top-full z-10 w-max pt-2">
                        <div className="flex flex-col rounded border border-nav-panel-border bg-nav-panel py-1 shadow-lg backdrop-blur-lg">
                            {link.children.map(child => child.disabled
                                ? <ComingSoon key={child.href} side className={`${navItem} w-full px-3 py-2 text-label leading-6 text-on-background-muted`}>{child.name}</ComingSoon>
                                : <Link
                                    key={child.href}
                                    href={child.href}
                                    prefetch
                                    className={`${navItem} block px-3 py-2 text-label leading-6 text-on-background-muted`}
                                    aria-current={pathname === child.href ? 'page' : undefined}
                                    onClick={event => { close(); onNavigate(event) }}
                                >
                                    {child.name}
                                </Link>)}
                        </div>
                    </div>
                )}
            </div>
        )
    }

    if (link.disabled) return <ComingSoon className={className}>{link.name}</ComingSoon>
    return <Link href={link.href} prefetch className={`${className} inline-block`} aria-current={pathname === link.href ? 'page' : undefined}
        aria-label={pathname === link.href ? `${link.name}, scroll to top` : undefined} onClick={onNavigate}>
        {link.name}
    </Link>
}

export default function Header() {
    const pathname = usePathname()
    const { theme, setTheme } = useTheme()
    const header = useRef<HTMLElement>(null)
    const [{ compact, moving }, setDrawer] = useState({ compact: false, moving: false })
    const links = config.header.nav_links ?? []
    const matches = (href: string) => pathname === href || (href !== '/' && pathname.startsWith(`${href}/`))
    const current = links.find(link => matches(link.href) || link.children?.some(child => matches(child.href)))

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            const next = !entry.isIntersecting && entry.boundingClientRect.top < 0
            const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
            // Clip before the first animation frame, not after transitionrun fires.
            setDrawer(previous => previous.compact === next ? previous : { compact: next, moving: !reduced })
        }, { rootMargin: '-16px 0px 0px 0px' })
        if (header.current) observer.observe(header.current)
        return () => observer.disconnect()
    }, [])

    // Safety net: transitionend is not guaranteed (cancelled transitions,
    // re-renders, reduced-motion toggling mid-flight). If it never lands,
    // `moving` would stay true and the drawer would remain `inert`, making
    // every nav link inside it silently unclickable.
    useEffect(() => {
        if (!moving) return
        const id = window.setTimeout(
            () => setDrawer(previous => ({ ...previous, moving: false })),
            NAV_TRANSITION_MS + 100,
        )
        return () => window.clearTimeout(id)
    }, [moving])

    const onNavigate: MouseEventHandler<HTMLAnchorElement> = event => {
        if (event.currentTarget.pathname !== pathname || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
        event.preventDefault()
        scrollToTop()
    }
    const onDrawerTransitionEnd = (event: TransitionEvent<HTMLDivElement>) => {
        if (event.target === event.currentTarget && event.propertyName === 'grid-template-columns') {
            // A reversed transition cancels its predecessor; keep clipping until the new one ends.
            if (event.type === 'transitioncancel' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
            setDrawer(previous => ({ ...previous, moving: false }))
        }
    }

    return <header ref={header} className="h-nav-stacked w-full shrink-0 nav:h-16">
        <div className="pointer-events-none fixed inset-x-4 top-4 z-30 flex justify-center">
            <nav aria-label="Primary" className="morph-site-header pointer-events-auto relative grid w-max max-w-full grid-cols-1 items-center rounded-nav border border-transparent p-1 nav:grid-cols-nav" data-compact={compact} dir={config.direction}>
                <span aria-hidden="true" className="pointer-events-none absolute -inset-px -z-10 rounded-nav border border-nav-border bg-nav-surface shadow-nav backdrop-blur-nav" />
                <div className="relative z-10 flex items-center justify-center nav:border-e nav:border-outline">
                    <Link href="/" className="compact-site-name whitespace-nowrap rounded-nav-item px-2.5 py-px text-lg font-semibold leading-6 text-on-background-stronger focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary" onClick={onNavigate}>{config.blog_name}</Link>
                </div>
                <div className={`grid min-w-0 items-start justify-self-center ${current ? 'grid-cols-nav' : 'grid-cols-1'}`}>
                    {current && <div className="relative z-10 ms-1.5">
                        <NavigationItem link={current} pathname={pathname} current compact={compact} onNavigate={onNavigate} />
                    </div>}
                    <div className={`grid min-w-0 transition-drawer duration-nav ease-nav motion-reduce:transition-none ${compact ? 'grid-cols-drawer-closed' : 'grid-cols-drawer-open'} ${compact || moving ? 'overflow-hidden' : 'overflow-visible'}`}
                        data-moving={moving} inert={compact || moving || undefined}
                        onTransitionEnd={onDrawerTransitionEnd} onTransitionCancel={onDrawerTransitionEnd}>
                        <div className={`flex w-max min-w-0 items-center gap-0.5 transition-transform duration-nav ease-nav motion-reduce:transition-none ${current ? 'ps-0.5' : 'ps-1.5'} ${compact ? '-translate-x-full rtl:translate-x-full' : 'translate-x-0'}`}>
                            {links.filter(link => link !== current).map(link =>
                                <NavigationItem key={link.href} link={link} pathname={pathname} compact={compact} onNavigate={onNavigate} />)}
                            {config.header.theme_toggle && <button aria-label="Toggle color theme" className={`${navItem} flex shrink-0 items-center justify-center h-6 px-1.5 text-on-background-muted`}
                                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
                                  {/* Outer: rotation driven by the header's compact/expanded state. */}
                                  <span className={`block transition-transform duration-nav ease-nav motion-reduce:transition-none ${
                                      compact ? '-rotate-180' : 'rotate-0'
                                  }`}>
                                      {/* Inner: rotation driven by the current theme. */}
                                      <span className={`block transition-transform duration-300 ease-in-out motion-reduce:transition-none ${
                                          theme === 'light' ? '-rotate-45' : 'rotate-0'
                                      }`}>
                                          <ThemeIcon theme={theme} />
                                      </span>
                                  </span>
                            </button>}
                        </div>
                    </div>
                </div>
            </nav>
        </div>
    </header>
}