'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTheme } from 'next-themes'
import { ChevronDown } from 'lucide-react'
import { useCallback, useEffect, useId, useRef, useState, type MouseEventHandler, type ReactNode, type TransitionEvent } from 'react'
import config from '@/config'
import type { NavLink } from '@/app/types'
import ThemeIcon from './ThemeIcon'

const navItem = 'rounded-lg font-medium whitespace-nowrap transition-colors [@media(hover:hover)]:hover:text-sky-700 dark:[@media(hover:hover)]:hover:text-sky-300 focus-visible:text-sky-700 dark:focus-visible:text-sky-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700 dark:focus-visible:outline-sky-300'

const NAV_TRANSITION_MS = 300

function MorphingBrand({ name, compact, expanded, hovered, onHover, onExpandedChange, onNavigate }: {
    name: string
    compact: boolean
    expanded: boolean
    hovered: boolean
    onHover: () => void
    onExpandedChange: (expanded: boolean) => void
    onNavigate: MouseEventHandler<HTMLAnchorElement>
}) {
    const root = useRef<HTMLAnchorElement>(null)
    const suppressClick = useRef(false)

    useEffect(() => {
        if (!expanded) return
        const onClick = (event: MouseEvent) => {
            if (!root.current?.contains(event.target as Node)) onExpandedChange(false)
        }
        document.addEventListener('click', onClick)
        return () => document.removeEventListener('click', onClick)
    }, [expanded, onExpandedChange])

    const parts = name.trim().split(/\s+/)
    const [first, ...rest] = parts
    const last = rest.join(' ')
    const firstInitial = first[0]
    const firstTail = first.slice(1)
    const lastInitial = last[0]
    const lastTail = last.slice(1)
    // Keep matching track definitions so the name interpolates in both directions.
    const collapseClasses = compact && (expanded || hovered)
        ? 'grid-cols-[minmax(0,1fr)] opacity-100'
        : `grid-cols-[minmax(0,0fr)] opacity-0 ${compact ? 'min-[460px]:group-focus-visible/brand:grid-cols-[minmax(0,1fr)] min-[460px]:group-focus-visible/brand:opacity-100' : 'min-[460px]:grid-cols-[minmax(0,1fr)] min-[460px]:opacity-100'}`

    return (
        <Link
            ref={root}
            href="/"
            aria-label={name}
            className="group/brand touch-pan-y select-none whitespace-nowrap rounded-lg px-1.5 py-px text-lg font-semibold leading-6 text-stone-950 dark:text-stone-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700 dark:focus-visible:outline-sky-300 min-[460px]:px-2.5"
            onPointerDown={event => {
                if (!event.isPrimary) return
                suppressClick.current = false
                if (compact && !expanded && event.pointerType !== 'mouse') {
                    suppressClick.current = true
                    onExpandedChange(true)
                }
            }}
            onPointerEnter={event => { if (compact && event.pointerType === 'mouse') onHover() }}
            onContextMenu={event => { if (suppressClick.current) event.preventDefault() }}
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
                    <span className={`grid transition-[grid-template-columns,opacity] duration-300 ease-in-out ${collapseClasses}`}>
                        <span className="overflow-hidden whitespace-nowrap">{firstTail}&nbsp;</span>
                    </span>
                    <span>{lastInitial}</span>
                    <span className={`grid transition-[grid-template-columns,opacity] duration-300 ease-in-out ${collapseClasses}`}>
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
            className={`group/soon relative inline-block cursor-default rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700 dark:focus-visible:outline-sky-300 ${className}`}
        >
            <span id={`${id}-label`}>{children}</span>
            <span
                id={`${id}-tooltip`}
                role="tooltip"
                className={`pointer-events-none invisible absolute z-50 w-max rounded border border-zinc-300 dark:border-zinc-700 backdrop-blur-sm ${!side ? 'bg-zinc-50/50' : 'bg-zinc-50'} dark:bg-neutral-900 ${side ? 'backdrop-blur-sm' : ''} px-2 pt-1 pb-1.5 text-xs font-normal leading-none whitespace-nowrap text-neutral-500 dark:text-neutral-200 shadow-lg [@media(hover:hover)]:group-hover/soon:visible group-focus/soon:visible ${
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
                        className="absolute -right-0.5 -mr-px top-1/2 h-2.5 w-1.5 -translate-y-1/2 translate-x-full overflow-visible"
                    >
                        <path
                            d="M 0 0 L 6 5 L 0 10 Z"
                            className="fill-zinc-50/50 dark:fill-neutral-900 stroke-zinc-300 dark:stroke-zinc-800"
                            strokeWidth="1"
                            strokeLinejoin="round"
                        />
                    </svg>
                ) : (
                    <svg
                        aria-hidden="true"
                        viewBox="0 0 10 6"
                        className="absolute -top-0.5 -mt-px left-1/2 h-1.5 w-2.5 -translate-x-1/2 -translate-y-full overflow-visible"
                    >
                        <path
                            d="M 0 6 L 5 0 L 10 6 Z"
                            className="fill-zinc-50/50 dark:fill-neutral-900 stroke-zinc-300 dark:stroke-zinc-800"
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
    window.scrollTo({ top: 0, behavior: 'smooth' })
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
    const className = `${navItem} px-1.5 py-px text-sm leading-6 min-[460px]:px-2.5 ${current ? 'bg-neutral-500/10 dark:bg-zinc-400/10 text-stone-950 dark:text-stone-50' : 'text-neutral-500 dark:text-zinc-400'}`
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
                    className={`${className} flex shrink-0 cursor-pointer items-center`}
                    onClick={event => {
                        if (compact) { scrollToTop(); return }
                        setOpen(value => event.detail > 0 && pointerType.current === 'mouse' ? true : !value)
                    }}
                >
                    {link.name}
                    <span
                        aria-hidden="true"
                        className={`inline-flex h-5 shrink-0 items-center overflow-hidden transition-[width,opacity] duration-300 ease-in-out ${compact ? 'w-0 opacity-0' : 'w-5 opacity-100'}`}
                    >
                        <ChevronDown
                            size={16}
                            className={`relative top-px ms-1 shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
                        />
                    </span>
                </button>

                {open && !compact && (
                    <div className="absolute end-0 top-full z-20 w-max pt-2">
                        <div className="flex flex-col rounded border border-zinc-300/70 dark:border-zinc-800/70 bg-zinc-50/40 dark:bg-neutral-900/75 shadow-lg backdrop-blur-sm">
                            {link.children.map(child => child.disabled
                                ? <ComingSoon key={child.href} side className={`${navItem} w-full px-3 py-2 text-sm leading-6 text-neutral-500 dark:text-zinc-400`}>{child.name}</ComingSoon>
                                : <Link
                                    key={child.href}
                                    href={child.href}
                                    className={`${navItem} block px-3 py-2 text-sm leading-6 text-neutral-500 dark:text-zinc-400`}
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
    const navbar = useRef<HTMLElement>(null)
    const [{ compact, moving }, setDrawer] = useState({ compact: false, moving: false })
    const [brandExpanded, setBrandExpanded] = useState(false)
    const [brandHovered, setBrandHovered] = useState(false)
    const links = config.header.nav_links ?? []
    const matches = (href: string) => pathname === href || (href !== '/' && pathname.startsWith(`${href}/`))
    const current = links.find(link => matches(link.href) || link.children?.some(child => matches(child.href)))

    useEffect(() => {
        setMounted(true)
    }, [])

    const onBrandExpansionChange = useCallback((expanded: boolean) => {
        setBrandExpanded(compact && expanded)
    }, [compact])

    const onBrandHoverChange = useCallback((hovered: boolean) => {
        setBrandHovered(compact && hovered)
    }, [compact])

    useEffect(() => {
        if (!brandHovered) return
        // Layout changes can move the navbar away from a stationary pointer.
        const onPointerMove = (event: PointerEvent) => {
            if (event.pointerType === 'mouse' && !navbar.current?.contains(event.target as Node)) {
                onBrandHoverChange(false)
            }
        }
        document.addEventListener('pointermove', onPointerMove)
        return () => document.removeEventListener('pointermove', onPointerMove)
    }, [brandHovered, onBrandHoverChange])

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            const next = !entry.isIntersecting && entry.boundingClientRect.top < 0
            if (!next) {
                setBrandExpanded(false)
                setBrandHovered(false)
            }
            setDrawer(previous => previous.compact === next ? previous : { compact: next, moving: true })
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
            if (event.type === 'transitioncancel') return
            setDrawer(previous => ({ ...previous, moving: false }))
        }
    }

    return (
        <header ref={header} className="h-16 w-full shrink-0">
            <div className="pointer-events-none fixed inset-x-4 top-4 z-30 flex justify-center">
                <nav
                    ref={navbar}
                    aria-label="Primary"
                    className="pointer-events-auto relative grid w-max max-w-full touch-manipulation select-none grid-cols-[max-content_auto] items-center rounded-xl border border-transparent p-1"
                    data-compact={compact}
                    dir={config.direction}
                >
                    {/* Unified backdrop blur behind navbar */}
                    <span
                        aria-hidden="true"
                        className="pointer-events-none absolute -inset-px -z-10 rounded-xl border border-zinc-300/50 dark:border-zinc-800/50 bg-zinc-50/50 dark:bg-neutral-900/75 shadow-sm backdrop-blur-md"
                    />
                    <div className={`relative z-10 flex items-center justify-center transition-[border-inline-end-width] duration-300 ease-in-out ${compact && !current ? 'border-e-0 border-transparent' : 'border-e border-zinc-300 dark:border-zinc-800'}`}>
                        <MorphingBrand name={config.blog_name} compact={compact} expanded={brandExpanded} hovered={brandHovered} onHover={() => onBrandHoverChange(true)} onExpandedChange={onBrandExpansionChange} onNavigate={onNavigate} />
                    </div>
                    <div className={`flex min-w-0 items-start justify-self-center transition-[padding-inline-start] duration-300 ease-in-out ${compact && !current ? 'ps-0' : 'ps-1.5'}`}>
                        {links.map(link => {
                            const isCurrent = link === current
                            const hidden = compact && !isCurrent
                            return (
                                <div
                                    key={link.href}
                                    className={`grid min-w-0 transition-[grid-template-columns] duration-300 ease-in-out ${hidden ? 'grid-cols-[minmax(0,0fr)]' : 'grid-cols-[minmax(0,1fr)]'} ${!isCurrent && (compact || moving) ? 'overflow-hidden' : 'overflow-visible'}`}
                                    data-moving={!isCurrent && moving}
                                    inert={hidden || undefined}
                                    onTransitionEnd={onDrawerTransitionEnd}
                                    onTransitionCancel={onDrawerTransitionEnd}
                                >
                                    <div className="min-w-0">
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
                                className={`grid min-w-0 transition-[grid-template-columns] duration-300 ease-in-out ${compact ? 'grid-cols-[minmax(0,0fr)]' : 'grid-cols-[minmax(0,1fr)]'} ${compact || moving ? 'overflow-hidden' : 'overflow-visible'}`}
                                data-moving={moving}
                                inert={compact || undefined}
                                onTransitionEnd={onDrawerTransitionEnd}
                                onTransitionCancel={onDrawerTransitionEnd}
                            >
                                <div className="min-w-0">
                                    <button
                                        type="button"
                                        aria-label="Toggle color theme"
                                        className={`${navItem} flex shrink-0 items-center justify-center h-6 px-1.5 text-neutral-500 dark:text-zinc-400`}
                                        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                                    >
                                        <span
                                            className={`block transition-transform duration-300 ease-in-out ${
                                                compact ? '-rotate-180' : 'rotate-0'
                                            }`}
                                        >
                                            {mounted ? (
                                                <span
                                                    key="theme-icon"
                                                    className={`block transition-transform duration-300 ease-in-out ${
                                                        theme === 'light' ? '-rotate-45' : 'rotate-0'
                                                    }`}
                                                >
                                                    <ThemeIcon theme={theme} />
                                                </span>
                                            ) : (
                                                <span className="inline-block h-5 w-5" aria-hidden="true" />
                                            )}
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
