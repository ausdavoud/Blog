import { ArrowRight, Code2, Tag } from 'lucide-react'
import Link from 'next/link'
import { ComingSoon } from './Header'
import { ProjectDetails } from './ProjectsView'
import type { ReactNode } from 'react'

// shortcut: Headers share the full sheet; export optimized crops when the artwork is final.
const headerCrops = {
    teal: '-left-[32.743%] -top-[58.974%]',
    cyan: '-left-[151.77%] -top-[58.974%]',
    purple: '-left-[270.796%] -top-[58.974%]',
    navy: '-left-[32.743%] -top-[223.077%]',
    gray: '-left-[151.77%] -top-[223.077%]',
    mint: '-left-[270.796%] -top-[223.077%]',
    silver: '-left-[32.743%] -top-[387.692%]',
    emerald: '-left-[151.77%] -top-[387.692%]',
    charcoal: '-left-[270.796%] -top-[387.692%]',
    blue: '-left-[32.743%] -top-[551.795%]',
    lavender: '-left-[151.77%] -top-[551.795%]',
    sage: '-left-[270.796%] -top-[551.795%]',
}

const technologyLogos = new Set(['python', 'pytorch', 'numpy', 'django', 'postgresql', 'typescript', 'react', 'tailwindcss', 'c', 'linux', 'docker', 'jupyter', 'pandas', 'matplotlib'])

export function ProjectTag({ name, icon }: { name: string; icon?: string }) {
    const slug = name.toLowerCase() === 'tailwind' ? 'tailwindcss' : name.toLowerCase()
    const logo = icon ?? (technologyLogos.has(slug) ? `/projects/technology-icons/${slug}.svg` : undefined)

    return <span role="img" aria-label={name} title={name} tabIndex={0} className="group/tag relative inline-flex h-9 items-center rounded-full border border-zinc-400/60 bg-zinc-50 px-2.5 text-xs leading-4 text-neutral-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-700 dark:border-zinc-600/60 dark:bg-neutral-900/40 dark:text-zinc-400 dark:focus-visible:outline-zinc-300">
        {logo ? <span aria-hidden="true" className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white"><img src={logo} alt={name} className="!mb-0 h-4 w-4 object-contain" /></span> : <Tag aria-hidden="true" size={20} strokeWidth={1.5} className="shrink-0" />}
        <span aria-hidden="true" className="grid grid-cols-[minmax(0,0fr)] transition-[grid-template-columns] duration-300 ease-out group-hover/tag:grid-cols-[minmax(0,1fr)] group-focus/tag:grid-cols-[minmax(0,1fr)] [@media(hover:none)]:grid-cols-[minmax(0,1fr)] group-data-[view=pinned]/projects:!grid-cols-[minmax(0,0fr)] motion-reduce:transition-none">
            <span className="overflow-hidden whitespace-nowrap"><span className="pl-1.5 capitalize">{name}</span></span>
        </span>
        <svg aria-hidden="true" className="pointer-events-none absolute -inset-px h-[calc(100%_+_2px)] w-[calc(100%_+_2px)] overflow-visible fill-none stroke-zinc-700/70 opacity-0 group-hover/tag:opacity-100 group-focus/tag:opacity-100 dark:stroke-zinc-300/70">
            <rect x="0.5" y="0.5" rx="17.5" pathLength="100" strokeLinecap="round" className="h-[calc(100%_-_1px)] w-[calc(100%_-_1px)] [stroke-dasharray:101_101] [stroke-dashoffset:101] transition-[stroke-dashoffset] duration-700 ease-in-out group-hover/tag:[stroke-dashoffset:0] group-focus/tag:[stroke-dashoffset:0] motion-reduce:transition-none" />
        </svg>
    </span>
}

export default function ProjectItem({ title, description, details, subtitle, href, icon, children, expertise, expertiseShort, header, pinned = 'false' }: {
    title: string
    description: string
    details?: string
    subtitle?: string
    href?: string
    icon?: string
    children?: ReactNode
    expertise?: string
    expertiseShort?: string
    header?: keyof typeof headerCrops
    pinned?: string
}) {
    const arrow = <>
        <span className="sr-only">View {title}</span>
        <ArrowRight aria-hidden="true" size={22} strokeWidth={1.5} className="-rotate-45 transition-transform duration-200 group-hover/view:translate-x-0.5 group-hover/view:-translate-y-0.5 motion-reduce:transition-none" />
    </>
    const arrowClasses = 'group/view !flex h-11 w-11 shrink-0 items-center justify-center !rounded-xl border border-zinc-200/70 bg-zinc-50 text-neutral-600 transition-colors hover:border-zinc-300 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-700 group-data-[view=pinned]/projects:absolute group-data-[view=pinned]/projects:right-3 group-data-[view=pinned]/projects:top-3 dark:border-zinc-700 dark:bg-neutral-900/60 dark:text-zinc-300 dark:hover:border-zinc-600 dark:hover:bg-neutral-800 dark:hover:text-zinc-100 dark:focus-visible:outline-zinc-300'

    return (
        <div data-pinned={pinned} className={`group/card relative flex min-w-0 flex-col self-start rounded-3xl border border-zinc-200/70 bg-white p-4 shadow-sm group-data-[view=pinned]/projects:aspect-square group-data-[view=pinned]/projects:w-56 group-data-[view=pinned]/projects:shrink-0 group-data-[view=pinned]/projects:p-3 group-data-[view=pinned]/projects:rounded-2xl dark:border-zinc-800 dark:bg-neutral-800/40 ${pinned === 'true' ? '' : 'group-data-[view=pinned]/projects:hidden'}`}>
            {header && <div className="relative -mx-4 -mt-4 mb-4 aspect-[452/195] overflow-hidden rounded-t-3xl group-data-[view=pinned]/projects:hidden">
                <img src="/projects/header-sheet.png" alt="" className={`absolute h-auto w-[403.54%] !max-w-none transition-[filter] duration-500 group-has-[abbr:hover]/card:blur-sm group-has-[abbr:focus]/card:blur-sm motion-reduce:transition-none ${headerCrops[header]}`} />
            </div>}
            <div className={`mb-3 min-h-10 shrink-0 items-start group-data-[view=pinned]/projects:flex ${header ? 'hidden' : 'flex'}`}>
                <span aria-hidden="true" className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-sky-100 text-sky-700 dark:bg-sky-100 dark:text-sky-700">
                    {icon ? <img src={icon} alt="" className="!mb-0 h-6 w-6 object-contain" /> : <Code2 size={22} strokeWidth={1.5} />}
                </span>
            </div>
            <div className="min-w-0 flex-1 group-data-[view=pinned]/projects:flex group-data-[view=pinned]/projects:flex-col">
                <div className="flex items-start gap-3">
                    <div className="min-w-0 flex-1">
                        <div role="heading" aria-level={3} className="text-xl font-medium leading-tight text-stone-950 dark:text-stone-50">{title}</div>
                        {subtitle && <div className="mt-1 text-sm text-neutral-500 dark:text-zinc-400">{subtitle}</div>}
                    </div>
                    {href ? <Link href={href} className={arrowClasses}>{arrow}</Link> : <ComingSoon className={arrowClasses}>{arrow}</ComingSoon>}
                </div>
                <div className="mt-3 text-sm leading-relaxed text-neutral-600 group-data-[view=pinned]/projects:hidden dark:text-neutral-300">{description}</div>
                {details && <ProjectDetails title={title} text={details} />}
                {(children || expertise || details) && <>
                    {(children || details) && <div aria-hidden="true" className={`mx-auto my-4 w-2/3 border-t border-zinc-200/70 group-data-[view=pinned]/projects:mt-auto group-data-[view=pinned]/projects:mb-3 dark:border-zinc-700/70 ${details ? 'invisible peer-data-[expanded=true]/details:visible group-data-[view=pinned]/projects:visible' : ''}`} />}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                        {children && <div className="flex flex-wrap gap-2">{children}</div>}
                        {expertise && <abbr
                            title={expertise}
                            aria-label={expertise}
                            tabIndex={0}
                            className="group/expertise absolute right-4 top-4 z-10 flex h-10 max-w-[calc(100%-6rem)] items-center rounded-xl bg-stone-950 px-3 text-xs font-medium text-stone-50 no-underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 group-data-[view=pinned]/projects:static group-data-[view=pinned]/projects:h-8 group-data-[view=pinned]/projects:max-w-full group-data-[view=pinned]/projects:rounded-lg group-data-[view=pinned]/projects:bg-stone-100 group-data-[view=pinned]/projects:px-2 group-data-[view=pinned]/projects:text-neutral-600 dark:bg-stone-200 dark:text-stone-950 dark:group-data-[view=pinned]/projects:bg-neutral-900/40 dark:group-data-[view=pinned]/projects:text-zinc-300"
                        >
                            <span aria-hidden="true" className="grid grid-cols-[minmax(0,1fr)] transition-[grid-template-columns] duration-300 group-hover/expertise:grid-cols-[minmax(0,0fr)] group-focus/expertise:grid-cols-[minmax(0,0fr)] [@media(hover:none)]:grid-cols-[minmax(0,0fr)] group-data-[view=pinned]/projects:!grid-cols-[minmax(0,1fr)] motion-reduce:transition-none"><span className="overflow-hidden whitespace-nowrap">{expertiseShort ?? expertise}</span></span>
                            <span aria-hidden="true" className="grid min-w-0 grid-cols-[minmax(0,0fr)] transition-[grid-template-columns] duration-300 group-hover/expertise:grid-cols-[minmax(0,1fr)] group-focus/expertise:grid-cols-[minmax(0,1fr)] [@media(hover:none)]:grid-cols-[minmax(0,1fr)] group-data-[view=pinned]/projects:!grid-cols-[minmax(0,0fr)] motion-reduce:transition-none"><span className="overflow-hidden whitespace-nowrap capitalize">{expertise}</span></span>
                        </abbr>}
                    </div>
                </>}
            </div>
        </div>
    )
}
