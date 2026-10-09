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

const NAV_TRANSITION_MS = 300

function MorphingBrand({ name, compact, onNavigate }: {
    name: string
    compact: boolean
    onNavigate: MouseEventHandler<HTMLAnchorElement>
}) {
    const [longPressed, setLongPressed] = useState(false)
    const [hovered, setHovered] = useState(false)
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    const pressStart = useRef<{ x: number; y: number } | null>(null)
    const suppressClick = useRef(false)

    const clearPressTimer = () => {
        if (timerRef.current !== null) clearTimeout(timerRef.current)
        timerRef.current = null
    }

    useEffect(() => clearPressTimer, [])

    const cancelPress = () => {
        clearPressTimer()
        pressStart.current = null
        setLongPressed(false)
    }

    const parts = name.trim().split(/\s+/)
    const [first, ...rest] = parts
    const last = rest.join(' ')
    const firstInitial = first[0]
    const firstTail = first.slice(1)
    const lastInitial = last[0]
    const lastTail = last.slice(1)
    const collapseClasses = compact && !longPressed && !hovered
        ? 'grid-cols-drawer-closed opacity-0 group-focus-visible/brand:grid-cols-drawer-open group-focus-visible/brand:opacity-100'
        : 'grid-cols-drawer-open opacity-100'

    return (
        <Link
            href="/"
            aria-label={name}
            className="group/brand compact-site-name touch-pan-y select-none whitespace-nowrap rounded-nav-item px-2.5 py-px text-lg font-semibold leading-6 text-on-background-stronger focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            onPointerDown={event => {
                if (event.pointerType === 'mouse' || !event.isPrimary) return
                cancelPress()
                suppressClick.current = false
                pressStart.current = { x: event.clientX, y: event.clientY }
                timerRef.current = setTimeout(() => {
                    timerRef.current = null
                    suppressClick.current = true
                    setLongPressed(true)
                }, 500)
            }}
            onPointerUp={cancelPress}
            onPointerCancel={cancelPress}
            onPointerMove={event => {
                const start = pressStart.current
                if (start && Math.hypot(event.clientX - start.x, event.clientY - start.y) > 10) cancelPress()
            }}
            onPointerEnter={event => { if (event.pointerType === 'mouse') setHovered(true) }}
            onPointerLeave={() => { setHovered(false); cancelPress() }}
            onContextMenu={event => { if (pressStart.current || suppressClick.current) event.preventDefault() }}
            onClick={event => {
                if (suppressClick.current) {
                    event.preventDefault()
                    suppressClick.current = false
                    return
                }
                onNavigate(event)
            }}
        >
            {parts.length < 2 ? name : (
                <span aria-hidden="true" className="inline-flex items-baseline overflow-hidden">
                    <span>{firstInitial}</span>
                    <span className={`grid transition-brand duration-nav ease-nav motion-reduce:transition-none ${collapseClasses}`}>
                        <span className="overflow-hidden whitespace-nowrap">{firstTail}&nbsp;</span>
                    </span>
                    <span>{lastInitial}</span>
                    <span className={`grid transition-brand duration-nav ease-nav motion-reduce:transition-none ${collapseClasses}`}>
                        <span className="overflow-hidden whitespace-nowrap">{lastTail}</span>
                    </span>
                </span>
            )}
        </Link>
    )
}


export function ComingSoon({ children, className = '', side = false }: {
    children: ReactNode
    className?: string
    side?: boolean
}) {
    const id = useId()
    return (
        <span
            role="link"
            aria-disabled="true"
            aria-labelledby={`${id}-label`}
            aria-describedby={`${id}-tooltip`}
            tabIndex={0}
            className={`coming-soon group/soon relative inline-block cursor-default rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${className}`}
        >
            <span id={`${id}-label`}>{children}</span>
            <span
                id={`${id}-tooltip`}
                role="tooltip"
                className={`pointer-events-none invisible absolute z-50 w-max rounded border border-outline bg-background px-2 py-1 text-nav-tooltip font-normal leading-none whitespace-nowrap text-on-background shadow-lg group-hover/soon:visible group-focus-visible/soon:visible ${
                    side
                        ? 'right-full top-1/2 mr-4 -translate-y-1/2'
                        : 'left-1/2 top-full mt-3.5 -translate-x-1/2'
                }`}
            >
                {/* SVG triangle */}
                {side ? (
                    <svg
                        aria-hidden="true"
                        viewBox="0 0 6 10"
                        className="absolute right-0 top-1/2 h-2.5 w-1.5 -translate-y-1/2 translate-x-full overflow-visible"
                    >
                        <path
                            d="M 0 0 L 6 5 L 0 10 Z"
                            className="fill-background stroke-outline"
                            strokeWidth="1"
                            strokeLinejoin="round"
                        />
                    </svg>
                ) : (
                    <svg
                        aria-hidden="true"
                        viewBox="0 0 10 6"
                        className="absolute top-0 left-1/2 h-1.5 w-2.5 -translate-x-1/2 -translate-y-full overflow-visible"
                    >
                        <path
                            d="M 0 6 L 5 0 L 10 6 Z"
                            className="fill-background stroke-outline"
                            strokeWidth="1"
                            strokeLinejoin="round"
                        />
                    </svg>
                )}
                Coming soon
            </span>
        </span>
    )
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
    const pointerType = useRef('')
    const className = `${navItem} px-2.5 py-px text-sm leading-6 ${current ? 'nav-current bg-nav-current text-on-background-stronger' : 'text-on-background-muted'}`
    const close = () => setOpen(false)

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
                onPointerDown={event => { pointerType.current = event.pointerType }}
                onPointerEnter={event => { if (event.pointerType === 'mouse' && !compact) setOpen(true) }}
                onPointerLeave={event => { if (event.pointerType === 'mouse') close() }}
                onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) close() }}
            >
                <button
                    type="button"
                    aria-label={`${link.name} submenu`}
                    aria-expanded={open && !compact}
                    className={`${className} flex shrink-0 cursor-pointer items-center gap-1`}
                    onClick={event => {
                        if (compact) { scrollToTop(); return }
                        setOpen(value => event.detail > 0 && pointerType.current === 'mouse' ? true : !value)
                    }}
                >
                    {link.name}
                    <ChevronDown
                        size={16}
                        className={`relative top-px transition-transform duration-200 motion-reduce:transition-none ${open ? 'rotate-180' : ''} ${compact ? 'hidden' : ''}`}
                    />
                </button>

                {open && !compact && (
                    <div className="nav-dropdown-panel absolute end-0 top-full z-20 w-max pt-2">
                        <div className="flex flex-col rounded border border-nav-panel-border bg-nav-panel shadow-lg backdrop-blur-xl">
                            {link.children.map(child => child.disabled
                                ? <ComingSoon key={child.href} side className={`${navItem} w-full px-3 py-2 text-sm leading-6 text-on-background-muted`}>{child.name}</ComingSoon>
                                : <Link
                                    key={child.href}
                                    href={child.href}
                                    className={`${navItem} block px-3 py-2 text-sm leading-6 text-on-background-muted`}
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
    return (
        <Link
            href={link.href}
            className={`${className} inline-block`}
            aria-current={pathname === link.href ? 'page' : undefined}
            aria-label={pathname === link.href ? `${link.name}, scroll to top` : undefined}
            onClick={onNavigate}
        >
            {link.name}
        </Link>
    )
}

export default function Header() {
    const pathname = usePathname()
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)
    const header = useRef<HTMLElement>(null)
    const [{ compact, moving }, setDrawer] = useState({ compact: false, moving: false })
    const links = config.header.nav_links ?? []
    const matches = (href: string) => pathname === href || (href !== '/' && pathname.startsWith(`${href}/`))
    const current = links.find(link => matches(link.href) || link.children?.some(child => matches(child.href)))

    useEffect(() => {
        setMounted(true)
    }, [])

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            const next = !entry.isIntersecting && entry.boundingClientRect.top < 0
            const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
            setDrawer(previous => previous.compact === next ? previous : { compact: next, moving: !reduced })
        }, { rootMargin: '-16px 0px 0px 0px' })
        if (header.current) observer.observe(header.current)
        return () => observer.disconnect()
    }, [])

    useEffect(() => {
        if (!moving) return
        const id = window.setTimeout(
            () => setDrawer(previous => ({ ...previous, moving: false })),
            NAV_TRANSITION_MS + 100,
        )
        return () => window.clearTimeout(id)
    }, [moving])

    const onNavigate: MouseEventHandler<HTMLAnchorElement> = event => {
        if (event.currentTarget.hash) return
        if (
            event.currentTarget.pathname !== pathname ||
            event.button !== 0 ||
            event.metaKey ||
            event.ctrlKey ||
            event.shiftKey ||
            event.altKey
        ) {
            return
        }
        event.preventDefault()
        scrollToTop()
    }

    const onDrawerTransitionEnd = (event: TransitionEvent<HTMLDivElement>) => {
        if (event.target === event.currentTarget && event.propertyName === 'grid-template-columns') {
            if (event.type === 'transitioncancel' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
            setDrawer(previous => ({ ...previous, moving: false }))
        }
    }

    return (
        <header ref={header} className="h-nav-stacked w-full shrink-0 nav:h-16">
            <div className="pointer-events-none fixed inset-x-4 top-4 z-30 flex justify-center">
                <nav
                    aria-label="Primary"
                    className="morph-site-header pointer-events-auto relative grid w-max max-w-full grid-cols-1 items-center rounded-nav border border-transparent p-1 nav:grid-cols-nav"
                    data-compact={compact}
                    dir={config.direction}
                >
                    {/* Unified backdrop blur behind navbar */}
                    <span
                        aria-hidden="true"
                        className="pointer-events-none absolute -inset-px -z-10 rounded-nav border border-nav-border bg-nav-surface shadow-nav backdrop-blur-md"
                    />
                    <div className="relative z-10 flex items-center justify-center nav:border-e nav:border-outline">
                        <MorphingBrand name={config.blog_name} compact={compact} onNavigate={onNavigate} />
                    </div>
                    <div className="flex min-w-0 items-start justify-self-center ps-1.5">
                        {links.map(link => {
                            const isCurrent = link === current
                            const hidden = compact && !isCurrent
                            return (
                                <div
                                    key={link.href}
                                    className={`grid min-w-0 transition-drawer duration-nav ease-nav motion-reduce:transition-none ${hidden ? 'grid-cols-drawer-closed' : 'grid-cols-drawer-open'} ${!isCurrent && (compact || moving) ? 'overflow-hidden' : 'overflow-visible'}`}
                                    data-moving={!isCurrent && moving}
                                    inert={!isCurrent && (compact || moving) || undefined}
                                    onTransitionEnd={onDrawerTransitionEnd}
                                    onTransitionCancel={onDrawerTransitionEnd}
                                >
                                    <div className={`min-w-0 ${hidden ? 'invisible' : 'visible'}`}>
                                        <NavigationItem
                                            link={link}
                                            pathname={pathname}
                                            current={isCurrent}
                                            compact={compact}
                                            onNavigate={onNavigate}
                                        />
                                    </div>
                                </div>
                            )
                        })}
                        {config.header.theme_toggle && (
                            <div
                                className={`grid min-w-0 transition-drawer duration-nav ease-nav motion-reduce:transition-none ${compact ? 'grid-cols-drawer-closed' : 'grid-cols-drawer-open'} ${compact || moving ? 'overflow-hidden' : 'overflow-visible'}`}
                                data-moving={moving}
                                inert={compact || moving || undefined}
                                onTransitionEnd={onDrawerTransitionEnd}
                                onTransitionCancel={onDrawerTransitionEnd}
                            >
                                <div className="min-w-0">
                                    <button
                                        type="button"
                                        aria-label="Toggle color theme"
                                        className={`${navItem} flex shrink-0 items-center justify-center h-6 px-1.5 text-on-background-muted ${compact ? 'invisible' : 'visible'}`}
                                        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                                    >
                                        <span
                                            className={`block transition-transform duration-nav ease-nav motion-reduce:transition-none ${
                                                compact ? '-rotate-180' : 'rotate-0'
                                            }`}
                                        >
                                            <span
                                                className={`block transition-transform duration-300 ease-in-out motion-reduce:transition-none ${
                                                    mounted && theme === 'light' ? '-rotate-45' : 'rotate-0'
                                                }`}
                                            >
                                                {mounted ? (
                                                    <ThemeIcon theme={theme} />
                                                ) : (
                                                    <span className="inline-block h-4 w-4" aria-hidden="true" />
                                                )}
                                            </span>
                                        </span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </nav>
            </div>
        </header>
    )
}
