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
    const className = `${navItem} px-2.5 py-px text-sm leading-6 ${current ? 'nav-current bg-nav-current text-on-background-stronger' : 'text-on-background-muted'}`

    if (link.children?.length) {
        return <details className="relative shrink-0" open={open && !compact}
            onToggle={event => setOpen(event.currentTarget.open)}
            onPointerEnter={event => { if (event.pointerType === 'mouse' && !compact) setOpen(true) }}
            onPointerLeave={event => { if (event.pointerType === 'mouse') setOpen(false) }}
            onBlur={event => {
                if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false)
            }}
            onKeyDown={event => {
                if (event.key === 'Escape' && open) {
                    setOpen(false)
                    event.currentTarget.querySelector('summary')?.focus()
                    event.stopPropagation()
                }
            }}>
            <summary className={`${className} flex cursor-pointer list-none items-center gap-1 marker:content-none`} aria-label={compact ? `${link.name}, scroll to top` : link.name}
                onClick={event => {
                    if (compact) {
                        event.preventDefault()
                        scrollToTop()
                    } else if (event.detail > 0 && window.matchMedia('(hover: hover)').matches) {
                        // Hover already opened the menu; a mouse click should keep it open.
                        event.preventDefault()
                        setOpen(true)
                    }
                }}>
                {link.name}
                <ChevronDown size={16} className={`relative top-px transition-transform duration-200 motion-reduce:transition-none ${compact ? 'hidden' : ''} ${open ? 'rotate-180' : ''}`} />
            </summary>
            <div className="nav-dropdown-panel absolute end-0 top-full z-10 w-max pt-2">
                <div className="flex flex-col rounded border border-nav-panel-border bg-nav-panel py-1 shadow-lg backdrop-blur-lg">
                    {link.children.map(child => child.disabled
                        ? <ComingSoon key={child.href} side className={`${navItem} w-full px-3 py-2 text-label leading-6 text-on-background-muted`}>{child.name}</ComingSoon>
                        : <Link key={child.href} href={child.href} prefetch className={`${navItem} block px-3 py-2 text-label leading-6 text-on-background-muted`}
                            aria-current={pathname === child.href ? 'page' : undefined}
                            onClick={event => { setOpen(false); onNavigate(event) }}>
                            {child.name}
                        </Link>)}
                </div>
            </div>
        </details>
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
            const compact = !entry.isIntersecting && entry.boundingClientRect.top < 0
            const moving = !window.matchMedia('(prefers-reduced-motion: reduce)').matches
            // Clip before the first animation frame, not after transitionrun fires.
            setDrawer(previous => previous.compact === compact ? previous : { compact, moving })
        }, { rootMargin: '-16px 0px 0px 0px' })
        if (header.current) observer.observe(header.current)
        return () => observer.disconnect()
    }, [])

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
                        data-moving={moving} inert={compact || moving}
                        onTransitionEnd={onDrawerTransitionEnd} onTransitionCancel={onDrawerTransitionEnd}>
                        <div className={`flex w-max min-w-0 items-center gap-0.5 transition-transform duration-nav ease-nav motion-reduce:transition-none ${current ? 'ps-0.5' : 'ps-1.5'} ${compact ? '-translate-x-full rtl:translate-x-full' : 'translate-x-0'}`}>
                            {links.filter(link => link !== current).map(link =>
                                <NavigationItem key={link.href} link={link} pathname={pathname} compact={compact} onNavigate={onNavigate} />)}
                            {config.header.theme_toggle && (
                                <button
                                    aria-label="Toggle color theme"
                                    className={`${navItem} flex h-6 shrink-0 items-center justify-center px-1.5 text-on-background-muted`}
                                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                                >
                                    <span
                                        className={`block transition-transform duration-nav ease-nav motion-reduce:transition-none ${
                                            compact ? '-rotate-[360deg]' : '-rotate-0'
                                        }`}
                                    >
                                        <span
                                            className={`block transition-transform duration-300 ease-in-out motion-reduce:transition-none ${
                                                theme === 'light' ? '-rotate-45' : 'rotate-0'
                                            }`}
                                        >
                                            <ThemeIcon theme={theme} />
                                        </span>
                                    </span>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </nav>
        </div>
    </header>
}
