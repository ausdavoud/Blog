'use client'

import { createContext, useContext, useEffect, useId, useRef, useState } from 'react'
import type { ComponentPropsWithoutRef, MouseEvent, ReactNode } from 'react'
import { ArrowLeft, ArrowRight, ChevronDown } from 'lucide-react'
import Link from 'next/link'
import type { ProjectSection } from './Projects'

const ProjectsContext = createContext<string | null>(null)

export function ProjectDetails({ title, text }: { title: string; text: string }) {
    const [expanded, setExpanded] = useState(false)
    const id = useId()

    return <div data-expanded={expanded} className={`peer/details relative transition-[padding-bottom] duration-500 ease-in-out motion-reduce:transition-none ${expanded ? 'pb-8' : 'pb-0'}`}>
        <div id={id} inert={!expanded || undefined} aria-hidden={!expanded} className={`grid transition-[grid-template-rows,opacity] duration-500 ease-in-out motion-reduce:transition-none ${expanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
            <div className="min-h-0 overflow-hidden"><div className="pt-3 whitespace-pre-line text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">{text}</div></div>
        </div>
        <span aria-hidden="true" className={`pointer-events-none absolute -inset-x-4 top-full -mt-0.5 h-6 overflow-hidden whitespace-nowrap text-sm leading-6 text-neutral-600 blur-[2px] [mask-image:linear-gradient(to_right,transparent,black_20%,black_80%,transparent)] transition-opacity duration-300 motion-reduce:transition-none dark:text-neutral-300 ${expanded ? 'opacity-0' : 'opacity-50'}`}>{text}</span>
        <button
            type="button"
            aria-expanded={expanded}
            aria-controls={id}
            aria-label={`${expanded ? 'Show less' : 'Read more'} about ${title}`}
            title={expanded ? 'Show less' : 'Read more'}
            onClick={() => setExpanded(value => !value)}
            className={`absolute left-1/2 top-full z-10 grid h-7 w-7 -translate-x-1/2 place-items-center rounded-full border border-zinc-200 bg-white text-neutral-600 transition-[background-color,margin-top] duration-500 ease-in-out hover:bg-zinc-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-700 motion-reduce:transition-none dark:border-zinc-700 dark:bg-neutral-900 dark:text-zinc-300 dark:hover:bg-neutral-800 dark:focus-visible:outline-zinc-300 ${expanded ? '-mt-5' : '-mt-1'}`}
        ><ChevronDown aria-hidden="true" size={16} strokeWidth={1.5} className={`block shrink-0 transition-transform duration-500 ease-in-out motion-reduce:transition-none ${expanded ? 'rotate-180' : ''}`} /></button>
    </div>
}

export default function ProjectsView({ sections, section = null, children }: { sections: ProjectSection[]; section?: string | null; children: ReactNode }) {
    return <ProjectsContext.Provider value={section}>
        <div className="group/projects" data-view={section ? 'all' : 'pinned'}>
            <span role="status" className="sr-only">{section ? `All ${sections.find(item => item.id === section)?.title}` : 'Pinned projects'}</span>
            {children}
        </div>
    </ProjectsContext.Provider>
}

export function ProjectSectionHeading({ id, className = '', children, ...props }: ComponentPropsWithoutRef<'h2'>) {
    const section = useContext(ProjectsContext)
    if (section && section !== id) return null

    const expanded = Boolean(section)

    return <h2 {...props} id={id} tabIndex={-1} className={`${className} flex flex-wrap items-center justify-between gap-3 capitalize`}>
        <span>{children}</span>
        {id && <Link
            href={expanded ? '/projects' : `/projects/${encodeURIComponent(id)}`}
            aria-label={expanded ? 'Back to pinned projects' : `See all ${typeof children === 'string' ? children : 'projects'}`}
            className="inline-flex min-h-11 shrink-0 items-center gap-2 text-sm font-medium leading-5 text-sky-600 no-underline transition-colors hover:text-sky-700 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-700 dark:text-sky-400 dark:hover:text-sky-300 dark:focus-visible:outline-zinc-300"
        >
            {expanded && <ArrowLeft aria-hidden="true" size={16} strokeWidth={1.5} />}
            {expanded ? 'Back' : 'See all'}
            {!expanded && <ArrowRight aria-hidden="true" size={16} strokeWidth={1.5} />}
        </Link>}
    </h2>
}

export function ProjectCollection({ section, children }: { section: string; children: ReactNode }) {
    const activeSection = useContext(ProjectsContext)
    if (activeSection && activeSection !== section) return null

    return <div id={`${section}-collection`} className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">{children}</div>
}

export function ProjectNavigation({ sections }: { sections: ProjectSection[] }) {
    const section = useContext(ProjectsContext)
    const [activeId, setActiveId] = useState(sections[0]?.id)
    const [hoveredId, setHoveredId] = useState<string>()
    const pointer = useRef<{ x: number; y: number } | null>(null)

    useEffect(() => {
        if (section || !sections.length) return
        const clearHover = () => {
            pointer.current = null
            setHoveredId(undefined)
        }
        const updateHoveredSection = () => {
            if (!pointer.current) return
            const { x, y } = pointer.current
            const navId = document.elementFromPoint(x, y)?.closest('[data-project-section]')?.getAttribute('data-project-section')
            const hovered = sections.find(item => {
                const heading = document.getElementById(item.id)?.getBoundingClientRect()
                const collection = document.getElementById(`${item.id}-collection`)?.getBoundingClientRect()
                return heading && collection && x >= Math.min(heading.left, collection.left) && x <= Math.max(heading.right, collection.right) && y >= heading.top && y <= collection.bottom
            })
            setHoveredId(navId ?? hovered?.id)
        }
        const onPointerMove = (event: PointerEvent) => {
            if (event.pointerType !== 'mouse') return
            pointer.current = { x: event.clientX, y: event.clientY }
            updateHoveredSection()
        }
        const updateActiveSection = () => {
            let current = sections[0].id
            for (const section of sections) {
                const heading = document.getElementById(section.id)
                if (heading && heading.getBoundingClientRect().top <= window.innerHeight * 0.35) current = section.id
            }
            if (window.scrollY > 0 && window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2) current = sections[sections.length - 1].id
            setActiveId(current)
            updateHoveredSection()
        }
        updateActiveSection()
        window.addEventListener('scroll', updateActiveSection, { passive: true })
        window.addEventListener('resize', updateActiveSection)
        document.addEventListener('pointermove', onPointerMove, { passive: true })
        document.addEventListener('pointerleave', clearHover)
        return () => {
            window.removeEventListener('scroll', updateActiveSection)
            window.removeEventListener('resize', updateActiveSection)
            document.removeEventListener('pointermove', onPointerMove)
            document.removeEventListener('pointerleave', clearHover)
            pointer.current = null
        }
    }, [sections, section])

    if (!sections.length) return null
    const currentId = section ?? hoveredId ?? activeId

    const scrollToSection = (event: MouseEvent<HTMLAnchorElement>, id: string) => {
        if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
        const heading = document.getElementById(id)
        if (!heading) return
        event.preventDefault()
        window.history.pushState(null, '', `#${encodeURIComponent(id)}`)
        heading.focus({ preventScroll: true })
        heading.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' })
    }

    return <nav
        aria-label="Project sections"
        className="hidden text-sm xl:fixed xl:left-[calc(50%+22rem)] xl:top-1/2 xl:z-20 xl:flex xl:max-h-[calc(100svh-8rem)] xl:w-52 xl:-translate-y-1/2 xl:flex-col xl:overflow-y-auto xl:p-3"
    >
        {sections.map(item => <a
            key={item.id}
            data-project-section={item.id}
            href={`#${encodeURIComponent(item.id)}`}
            onClick={event => scrollToSection(event, item.id)}
            aria-hidden={section && section !== item.id ? true : undefined}
            tabIndex={section && section !== item.id ? -1 : undefined}
            aria-current={currentId === item.id ? 'location' : undefined}
            className={`group/section flex min-h-11 items-center gap-3 rounded py-2 text-neutral-800 transition-opacity duration-200 hover:opacity-100 focus-visible:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-700 motion-reduce:transition-none dark:text-zinc-200 dark:focus-visible:outline-zinc-300 xl:px-2 ${currentId === item.id ? 'opacity-100' : 'opacity-60'} ${section && section !== item.id ? 'invisible pointer-events-none' : ''}`}
        >
            <span aria-hidden="true" className={`h-8 w-1 shrink-0 rounded-full transition-colors duration-200 group-hover/section:bg-zinc-400 group-focus-visible/section:bg-zinc-400 motion-reduce:transition-none dark:group-hover/section:bg-zinc-200 dark:group-focus-visible/section:bg-zinc-200 ${currentId === item.id ? 'bg-zinc-400 dark:bg-zinc-200' : 'bg-zinc-200 dark:bg-zinc-600'}`} />
            <span className="capitalize">{item.title}</span>
        </a>)}
    </nav>
}
