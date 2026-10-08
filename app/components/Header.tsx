'use client'
import Link from "next/link";
import { usePathname } from "next/navigation";
import config from "@/config";
import ThemeIcon from "./ThemeIcon";
import { useTheme } from "next-themes";
import { ChevronDown, Menu } from "lucide-react";
import { ReactNode, useContext, useEffect, useRef, useState, type HTMLAttributes } from "react";
import "./compact-navigation.css";
import SidebarContext from "./providers/sidebar";

const dropdownEvents: HTMLAttributes<HTMLDetailsElement> = {
    onPointerEnter: (event) => {
        if (event.pointerType === 'mouse' && window.matchMedia('(hover: hover)').matches)
            event.currentTarget.setAttribute('open', '')
    },
    onPointerLeave: (event) => {
        if (event.pointerType === 'mouse' && window.matchMedia('(hover: hover)').matches)
            event.currentTarget.removeAttribute('open')
    },
    onBlur: (event) => {
        // A non-focusable menu item has no next focus target; keep it open during its click.
        if (event.relatedTarget && !event.currentTarget.contains(event.relatedTarget))
            event.currentTarget.removeAttribute('open')
    },
    onKeyDown: (event) => {
        if (event.key === 'Escape' && event.currentTarget.open) {
            event.currentTarget.removeAttribute('open')
            event.currentTarget.querySelector('summary')?.focus()
            event.stopPropagation()
        }
    },
}

const keepOpenOnMouseClick: HTMLAttributes<HTMLElement>['onClick'] = (event) => {
    if (event.detail > 0 && window.matchMedia('(hover: hover)').matches) {
        event.preventDefault()
        event.currentTarget.closest('details')?.setAttribute('open', '')
    }
}

export function ComingSoon({ children, className, side = false }: { children: ReactNode, className: string, side?: boolean }) {
    return <span role="link" aria-disabled="true" className={`group/soon nav-item relative cursor-default ${className}`}>
        {children}
        <span className={`nav-glass pointer-events-none absolute z-20 hidden w-fit rounded px-2 py-1 text-[9px] leading-none whitespace-nowrap group-hover/soon:block ${side ? "right-full top-1/2 -translate-y-1/2 mr-2" : "left-1/2 top-full -translate-x-1/2 mt-2"}`}>
            <span aria-hidden="true" className={`absolute h-2 w-2 rotate-45 bg-inherit border-outline ${side ? "-right-1.5 top-1/2 -translate-y-1/2 border-t border-r [clip-path:polygon(0_0,100%_0,100%_100%)]" : "-top-1.5 left-1/2 -translate-x-1/2 border-t border-l [clip-path:polygon(0_0,100%_0,0_100%)]"}`} />
            Coming soon
        </span>
    </span>
}

export default function Header({ sidebar, compactNavigation = true }: { sidebar: boolean, compactNavigation?: boolean }) {
    const pathname = usePathname()
    const { theme, setTheme } = useTheme()
    const context = useContext(SidebarContext)
    const header = useRef<HTMLDivElement>(null)
    const [compact, setCompact] = useState(false)
    const isCurrent = (href: string) => (pathname === '/posts-binary' && href === '/posts') || pathname === href || (href !== '/' && pathname.startsWith(`${href}/`))
    const current = config.header.nav_links?.find(link => [link, ...(link.children ?? [])].some(item => isCurrent(item.href)))

    useEffect(() => {
        if (!compactNavigation) return
        const observer = new IntersectionObserver(([entry]) => {
            const visible = !entry.isIntersecting && entry.boundingClientRect.top < 0
            setCompact(visible)
        }, { rootMargin: '-16px 0px 0px 0px' })
        if (header.current) observer.observe(header.current)
        return () => observer.disconnect()
    }, [compactNavigation])

    useEffect(() => {
        if (theme && theme !== "light" && theme !== "dark")
            setTheme(config.theme)
    }, [theme, setTheme])
    const scrollToTop = (event: React.MouseEvent<HTMLAnchorElement>) => {
        if (event.currentTarget.pathname !== pathname || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
        event.preventDefault()
        window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })
    }
    const navigation = config.header.nav_links?.map((link) => {
        const isHere = [link, ...(link.children ?? [])].some(item => isCurrent(item.href))
        if (link.children?.length)
            return <details key={link.href} className="relative text-label [&[open]>summary>svg]:rotate-180"
                {...dropdownEvents}>
                <summary aria-label={link.name} data-active={isHere}
                    onClick={keepOpenOnMouseClick}
                    className="nav-item flex cursor-pointer list-none items-center gap-1 px-2 py-1 [&::-webkit-details-marker]:hidden">
                    {link.name}
                    <ChevronDown size={16} className="relative top-px transition-transform duration-200 motion-reduce:transition-none" />
                </summary>
                <div className="absolute end-0 top-full z-10 w-max pt-2">
                    <div className="nav-glass rounded py-1 shadow-lg">
                        {link.children.map((child) => child.disabled
                          ? <ComingSoon key={child.href} side className="block px-3 py-2">{child.name}</ComingSoon>
                            : <Link key={child.href} href={child.href} prefetch
                            aria-current={pathname === child.href ? 'page' : undefined}
                            data-active={pathname === child.href}
                            className="nav-item block px-3 py-2"
                            onClick={(event) => event.currentTarget.closest('details')?.removeAttribute('open')}>
                            {child.name}
                        </Link>)}
                    </div>
                </div>
            </details>
        if (link.disabled)
          return <ComingSoon key={link.href} className="px-2 py-1 text-label block first:pl-0">{link.name}</ComingSoon>
        return <Link key={link.href}
            aria-current={pathname === link.href ? 'page' : undefined}
            data-active={isHere}
            className="nav-item px-2 py-1 text-label block first:pl-0"
            href={link.href} onClick={scrollToTop} prefetch>{link.name}
        </Link>
    })

    return <>
        <div ref={header} className="site-header" aria-hidden="true" />
        <nav aria-label="Primary" className="morph-site-header header-nav"
            data-compact={compact} data-floating={compactNavigation}
            style={{ direction: config.direction }}>
            <div className="morph-core">
                {sidebar && <button aria-label="Toggle sidebar" onClick={context.toggle} className="morph-sidebar xl:hidden">
                    <Menu size={18} />
                </button>}
                <Link href="/" className="compact-site-name">{config.blog_name}</Link>
            </div>
            <div className="morph-pages">
                {current && <div className="morph-current">
                    {current.children?.length ? <>
                        <div className="morph-current-full">{navigation?.find(item => item.key === current.href)}</div>
                        <Link href={current.href} aria-current="page" className="compact-current morph-current-small"
                            onClick={scrollToTop}>{current.name}</Link>
                    </> : <Link href={current.href} aria-current="page" className="compact-current"
                        aria-label={pathname === current.href ? `${current.name}, scroll to top` : current.name}
                        onClick={scrollToTop}>{current.name}</Link>}
                </div>}
                <div className="morph-extra" aria-hidden={compact}
                    ref={node => {
                        node?.toggleAttribute('inert', compact)
                        if (compact) node?.querySelectorAll('details[open]').forEach(item => item.removeAttribute('open'))
                    }}>
                    <div className="morph-extra-inner">
                        {navigation?.filter(item => item.key !== current?.href)}
                        {config.header.theme_toggle && <button aria-label="Toggle color theme" className="morph-theme"
                            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
                            <ThemeIcon theme={theme} />
                        </button>}
                    </div>
                </div>
            </div>
        </nav>
    </>
}
