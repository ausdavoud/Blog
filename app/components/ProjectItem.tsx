import { ArrowRight, Cable, ChartColumn, ChartScatter, Code2, Globe, Tag, Terminal } from 'lucide-react'
import Link from 'next/link'
import { ComingSoon } from './Header'
import { ProjectDetails } from './ProjectsView'
import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

const technologyLogos: Record<string, string> = {
    python: 'python.svg', pytorch: 'pytorch.svg', numpy: 'numpy.svg', django: 'django.svg', postgresql: 'postgresql.svg',
    typescript: 'typescript.svg', react: 'react.svg', tailwind: 'tailwindcss.svg', tailwindcss: 'tailwindcss.svg', c: 'c.svg',
    linux: 'linux.svg', docker: 'docker.svg', jupyter: 'jupyter.svg', pandas: 'pandas.svg', matplotlib: 'matplotlib.svg',
    javascript: 'javascript.svg', html: 'html5.svg', css: 'css3.svg', fastapi: 'fastapi.svg', latex: 'latex.svg',
    'sql server': 'sqlserver.svg', 'risc-v': 'riscv.svg', aiogram: 'telegram.svg', yolov8: 'ultralytics.svg',
    manim: 'manim.png', pygame: 'pygame.png',
}

// Tags without a real logo get a lucide glyph instead of the generic tag.
const technologyGlyphs: Record<string, LucideIcon> = { 'k-means': ChartScatter, xv6: Terminal, sockets: Cable, spss: ChartColumn }

export function ProjectTag({ name, icon }: { name: string; icon?: string }) {
    const key = name.toLowerCase()
    const logo = icon ?? (technologyLogos[key] ? `/projects/technology-icons/${technologyLogos[key]}` : undefined)
    const Glyph = technologyGlyphs[key] ?? Tag

    return <span role="img" aria-label={name} title={name} tabIndex={0} className="group/tag relative inline-flex h-9 items-center rounded-full border border-zinc-400/60 bg-zinc-50 px-[7px] text-xs leading-4 text-neutral-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-700 dark:border-zinc-600/60 dark:bg-neutral-900/40 dark:text-zinc-400 dark:focus-visible:outline-zinc-300">
        {logo ? <span aria-hidden="true" className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white"><img src={logo} alt={name} className="!mb-0 h-4 w-4 object-contain" /></span> : <Glyph aria-hidden="true" size={20} strokeWidth={1.5} className="shrink-0" />}
        <span aria-hidden="true" className="grid grid-cols-[minmax(0,0fr)] transition-[grid-template-columns] duration-300 ease-out group-hover/tag:grid-cols-[minmax(0,1fr)] group-focus/tag:grid-cols-[minmax(0,1fr)] motion-reduce:transition-none">
            <span className="overflow-hidden whitespace-nowrap"><span className="pl-1.5 capitalize">{name}</span></span>
        </span>
        <svg aria-hidden="true" className="pointer-events-none absolute -inset-px h-[calc(100%_+_2px)] w-[calc(100%_+_2px)] overflow-visible fill-none stroke-zinc-700/70 opacity-0 group-hover/tag:opacity-100 group-focus/tag:opacity-100 dark:stroke-zinc-300/70">
            <rect x="0.5" y="0.5" rx="17.5" pathLength="100" strokeLinecap="round" className="h-[calc(100%_-_1px)] w-[calc(100%_-_1px)] [stroke-dasharray:101_101] [stroke-dashoffset:101] transition-[stroke-dashoffset] duration-700 ease-in-out group-hover/tag:[stroke-dashoffset:0] group-focus/tag:[stroke-dashoffset:0] motion-reduce:transition-none" />
        </svg>
    </span>
}

export default function ProjectItem({ title, description, details, subtitle, href, demo, icon, children, expertise, expertiseShort, banner, wide = false, pinned = 'false' }: {
    title: string
    description: string
    details?: string
    subtitle?: string
    href?: string
    demo?: string
    icon?: string
    children?: ReactNode
    expertise?: string
    expertiseShort?: string
    banner?: string
    wide?: boolean
    pinned?: string
}) {
    const arrow = <>
        <span className="sr-only">View {title}</span>
        <ArrowRight aria-hidden="true" size={22} strokeWidth={1.5} className="-rotate-45 transition-transform duration-200 group-hover/view:translate-x-0.5 group-hover/view:-translate-y-0.5 motion-reduce:transition-none" />
    </>
    const arrowClasses = 'group/view !flex h-11 w-11 shrink-0 items-center justify-center !rounded-xl border border-zinc-200/70 bg-zinc-50 text-neutral-600 transition-colors hover:border-zinc-300 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-700 dark:border-zinc-700 dark:bg-neutral-900/60 dark:text-zinc-300 dark:hover:border-zinc-600 dark:hover:bg-neutral-800 dark:hover:text-zinc-100 dark:focus-visible:outline-zinc-300'

    // The wide card takes the dark tone of its banner so the two halves read as one.
    const surface = wide ? 'dark border-zinc-800 bg-[#0d1117]' : 'border-zinc-200/70 bg-white dark:border-zinc-800 dark:bg-neutral-800/40'
    // Blur reveals soft edges, so zoom hides them; the wide card sits on the banner's own dark tone and doesn't need it.
    const zoom = wide ? '' : 'group-has-[abbr:hover]/card:scale-110 group-has-[abbr:focus]/card:scale-110'

    const external = (url: string) => /^https?:/.test(url) ? { target: '_blank', rel: 'noopener noreferrer' } : {}

    return (
        <div data-pinned={pinned} className={`group/card relative flex min-w-0 flex-col self-start rounded-3xl border p-4 shadow-sm ${surface} ${wide ? 'sm:col-span-2 sm:flex-row sm:self-stretch' : ''} ${pinned === 'true' ? '' : 'group-data-[view=pinned]/projects:hidden'}`}>
            {banner && <div className={`relative -mx-4 -mt-4 mb-4 aspect-[452/195] overflow-hidden rounded-t-3xl ${wide ? 'sm:-my-4 sm:mr-4 sm:aspect-auto sm:min-h-[16.5rem] sm:w-1/2 sm:bg-[#0d1117] sm:shrink-0 sm:rounded-l-3xl sm:rounded-tr-none' : ''}`}>
                <img src={banner} alt="" className={`absolute inset-0 !mb-0 h-full w-full !max-w-none object-cover object-left ${wide ? 'sm:bottom-auto sm:h-[16.5rem]' : ''} transition-[filter,transform] duration-500 ${zoom} group-has-[abbr:hover]/card:blur-sm group-has-[abbr:focus]/card:blur-sm motion-reduce:transition-none`} />
            </div>}
            <div className={`mb-3 min-h-10 shrink-0 items-start ${banner ? 'hidden' : 'flex'}`}>
                <span aria-hidden="true" className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-sky-100 text-sky-700 dark:bg-sky-100 dark:text-sky-700">
                    {icon ? <img src={icon} alt="" className="!mb-0 h-6 w-6 object-contain" /> : <Code2 size={22} strokeWidth={1.5} />}
                </span>
            </div>
            <div className="min-w-0 flex-1">
                <div className="flex items-start gap-3">
                    <div className="min-w-0 flex-1">
                        <div role="heading" aria-level={3} className={`${wide ? 'sm:text-2xl ' : ''}text-xl font-medium leading-tight text-stone-950 dark:text-stone-50`}>{title}</div>
                        {subtitle && <div className="mt-1 text-sm text-neutral-500 dark:text-zinc-400">{subtitle}</div>}
                    </div>
                    {href ? <Link href={href} {...external(href)} className={arrowClasses}>{arrow}</Link> : <ComingSoon className={arrowClasses}>{arrow}</ComingSoon>}
                </div>
                <div className="mt-3 min-h-[3lh] text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">{description}</div>
                {details && <ProjectDetails title={title} text={details} />}
                {(children || expertise || details) && <>
                    {(children || details) && <div aria-hidden="true" className={`mx-auto my-4 w-2/3 border-t border-zinc-200/70 dark:border-zinc-700/70 ${details ? 'invisible peer-data-[expanded=true]/details:visible' : ''}`} />}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                        {children && <div className="flex flex-wrap gap-2">{children}</div>}
                        {demo && <Link href={demo} {...external(demo)} className={`${arrowClasses.replace('h-11 w-11', 'h-9 w-9')} ml-auto`}>
                            <span className="sr-only">Open the live site of {title}</span>
                            <Globe aria-hidden="true" size={18} strokeWidth={1.5} />
                        </Link>}
                        {expertise && <abbr
                            title={expertise}
                            aria-label={expertise}
                            tabIndex={0}
                            className={`group/expertise absolute right-4 top-4 z-10 flex h-10 max-w-[calc(100%-6rem)] items-center rounded-xl bg-stone-950 px-3 text-xs font-medium text-stone-50 no-underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 dark:bg-stone-200 dark:text-stone-950 ${wide ? 'sm:right-[calc(50%+2rem)] sm:max-w-[calc(50%-4rem)]' : ''}`}
                        >
                            <span aria-hidden="true" className="grid grid-cols-[minmax(0,1fr)] transition-[grid-template-columns] duration-300 group-hover/expertise:grid-cols-[minmax(0,0fr)] group-focus/expertise:grid-cols-[minmax(0,0fr)] [@media(hover:none)]:grid-cols-[minmax(0,0fr)] motion-reduce:transition-none"><span className="overflow-hidden whitespace-nowrap">{expertiseShort ?? expertise}</span></span>
                            <span aria-hidden="true" className="grid min-w-0 grid-cols-[minmax(0,0fr)] transition-[grid-template-columns] duration-300 group-hover/expertise:grid-cols-[minmax(0,1fr)] group-focus/expertise:grid-cols-[minmax(0,1fr)] [@media(hover:none)]:grid-cols-[minmax(0,1fr)] motion-reduce:transition-none"><span className="overflow-hidden whitespace-nowrap capitalize">{expertise}</span></span>
                        </abbr>}
                    </div>
                </>}
            </div>
        </div>
    )
}
