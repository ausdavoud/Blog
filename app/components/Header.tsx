'use client'
import Link from "next/link";
import { usePathname } from "next/navigation";
import config from "@/config";
import ThemeIcon from "./ThemeIcon";
import { useTheme } from "next-themes";
import { ChevronDown, Menu } from "lucide-react";
import { useContext, useEffect, useRef } from "react";
import SidebarContext from "./providers/sidebar";
import { NavLink } from "../types";

function ComingSoon({ link, className, side = false }: { link: NavLink, className: string, side?: boolean }) {
    return <span role="link" aria-disabled="true" className={`group/soon nav-item relative cursor-default ${className}`}>
        {link.name}
        <span className={`nav-glass pointer-events-none absolute z-20 hidden w-fit rounded px-2 py-1 text-[9px] leading-none whitespace-nowrap group-hover/soon:block ${side ? "right-full top-1/2 -translate-y-1/2 mr-2" : "left-1/2 top-full -translate-x-1/2 mt-2"}`}>
            <span aria-hidden="true" className={`absolute h-2 w-2 rotate-45 bg-inherit border-outline ${side ? "-right-1.5 top-1/2 -translate-y-1/2 border-t border-r [clip-path:polygon(0_0,100%_0,100%_100%)]" : "-top-1.5 left-1/2 -translate-x-1/2 border-t border-l [clip-path:polygon(0_0,100%_0,0_100%)]"}`} />
            Coming soon
        </span>
    </span>
}

export default function Header({ sidebar }: { sidebar: boolean }) {
    const pathname = usePathname()
    const { theme, setTheme } = useTheme()
    const context = useContext(SidebarContext)
    const headerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (theme && theme !== "light" && theme !== "dark")
            setTheme(config.theme)
    }, [theme, setTheme])
    useEffect(() => {
        const header = headerRef.current
        const nav = header?.querySelector('nav')
        if (!header || !nav) return
        const items = Array.from(nav.children)
        const observer = new ResizeObserver(() => {
            header.style.setProperty('--menu-item-width',
                `${Math.max(0, ...items.map(item => item.getBoundingClientRect().width))}px`)
        })
        items.forEach(item => observer.observe(item))
        return () => observer.disconnect()
    }, [])
    return <div ref={headerRef} className="site-header relative flex flex-wrap items-center gap-y-4 px-4 pr-14 md:px-0 md:pr-10 pt-3 md:pt-5 pb-2 w-full"
        style={{ direction: config.direction }}>
        <div className="flex grow items-center gap-3 whitespace-nowrap">
            {sidebar &&
                <button onClick={context.toggle} className="xl:hidden text-on-background-muted">
                    <Menu />
                </button>
            }
            <Link className="text-name-sm sm:text-name flex font-bold items-center gap-2 md:gap-3"
                href={'/'}>
                {config.header.logo && <img className="w-logo h-logo sm:w-logo sm:h-logo" src={config.logo} alt="logo" />}
                {config.header.blog_name && config.blog_name}
            </Link>
        </div>
        <nav aria-label="Primary" className="header-nav flex shrink-0 max-w-[calc(100%+2.5rem)] flex-wrap gap-4 text-[24px] items-center">
            {config.header.nav_links?.map((link) => {
                const isHere = [link, ...(link.children ?? [])].some(({ href }) =>
                    pathname === href || (href !== '/' && pathname.startsWith(`${href}/`)))
                if (link.children?.length)
                    return <details key={link.href} className="group relative text-label"
                        onPointerEnter={(event) => {
                            if (event.pointerType === 'mouse')
                                event.currentTarget.setAttribute('open', '')
                        }}
                        onPointerLeave={(event) => {
                            if (event.pointerType === 'mouse')
                                event.currentTarget.removeAttribute('open')
                        }}
                        onBlur={(event) => {
                            if (!event.currentTarget.contains(event.relatedTarget))
                                event.currentTarget.removeAttribute('open')
                        }}
                        onKeyDown={(event) => {
                            if (event.key === 'Escape') {
                                event.currentTarget.removeAttribute('open')
                                event.currentTarget.querySelector('summary')?.focus()
                            }
                        }}>
                        <summary data-active={isHere} className="nav-item flex cursor-pointer list-none items-center gap-1 px-2 py-1 [&::-webkit-details-marker]:hidden">
                            {link.name}
                            <ChevronDown size={16} className="group-open:rotate-180" />
                        </summary>
                        <div className="absolute end-0 top-full z-10 min-w-36 pt-2">
                            <div className="nav-glass rounded py-1 shadow-lg">
                                {link.children.map((child) => child.disabled
                                    ? <ComingSoon key={child.href} link={child} side className="block px-3 py-2" />
                                    : <Link key={child.href} href={child.href}
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
                    return <ComingSoon key={link.href} link={link} className="px-2 py-1 text-label block first:pl-0" />
                return <Link key={link.href}
                    aria-current={pathname === link.href ? 'page' : undefined}
                    data-active={isHere}
                    className="nav-item px-2 py-1 text-label block first:pl-0"
                    href={link.href}>{link.name}
                </Link>
            })}
        </nav>
        {
            config.header.theme_toggle &&
            <button aria-label="Toggle color theme" className="absolute right-4 md:right-0 top-3 md:top-5 flex h-9 sm:h-[42px] items-center cursor-pointer" onClick={() => {
                setTheme(theme === "dark" ? "light" : "dark")
            }}>
                <ThemeIcon theme={theme} />
            </button>
        }
    </div>
}
