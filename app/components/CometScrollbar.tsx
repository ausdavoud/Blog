'use client'

import { useEffect, useRef, useState, type RefObject } from 'react'
import { usePathname } from 'next/navigation'

type Metrics = { length: number; thumb: number; position: number; max: number; value: number }
type Bit = { id: number; position: number; offset: number; opacity: number }
type Marker = { heading: HTMLElement; title: string; position: number }

export default function CometScrollbar({ targetRef, horizontal = false, label = 'Page scroll' }: {
    targetRef?: RefObject<HTMLElement | null>
    horizontal?: boolean
    label?: string
}) {
    const track = useRef<HTMLDivElement>(null)
    const target = useRef<HTMLElement | null>(null)
    const drag = useRef<number | null>(null)
    const metrics = useRef<Metrics>({ length: 0, thumb: 0, position: 0, max: 0, value: 0 })
    const [view, setView] = useState(metrics.current)
    const [bits, setBits] = useState<Bit[]>([])
    const [dragging, setDragging] = useState(false)
    const [markers, setMarkers] = useState<Marker[]>([])
    const pathname = usePathname()

    useEffect(() => {
        const element = targetRef?.current ?? document.scrollingElement as HTMLElement | null
        const bar = track.current
        if (!element || !bar || window.matchMedia('(forced-colors: active)').matches) return
        target.current = element
        element.setAttribute('data-comet-scrollbar', '')
        const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
        let particles: (Omit<Bit, 'opacity'> & { born: number })[] = []
        let frame = 0
        let sequence = 0
        let direction = 0
        let lastEmission = 0
        let lastScrollTime = performance.now()
        setMarkers([])

        const animate = (now: number) => {
            particles = particles.filter(bit => now - bit.born < 800)
            setBits(particles.map(bit => ({ ...bit, opacity: 0.8 * (1 - (now - bit.born) / 800) ** 2 })))
            frame = particles.length ? requestAnimationFrame(animate) : 0
        }
        const update = (scrolling = false) => {
            const length = horizontal ? bar.clientWidth : bar.clientHeight
            const viewport = horizontal ? element.clientWidth : element.clientHeight
            const content = horizontal ? element.scrollWidth : element.scrollHeight
            const max = Math.max(0, content - viewport)
            const value = Math.min(max, Math.max(0, horizontal ? element.scrollLeft : element.scrollTop))
            const thumb = Math.min(length, Math.max(32, length * viewport / Math.max(1, content)))
            const position = max ? value / max * (length - thumb) : 0
            const previous = metrics.current
            const distance = position - previous.position
            const now = performance.now()
            const speed = Math.abs(distance) / Math.max(1, now - lastScrollTime)
            if (scrolling) lastScrollTime = now
            if (scrolling && max && distance !== 0 && !motion.matches) {
                const nextDirection = Math.sign(distance)
                if (direction !== nextDirection) {
                    lastEmission = previous.position + (nextDirection < 0 ? previous.thumb : 0)
                }
                direction = nextDirection
                const end = position + (direction < 0 ? thumb : 0)
                const count = Math.floor((end - lastEmission) * direction / 12)
                const variation = Math.min(1, Math.max(0, (speed - 0.5) / 1.5))
                for (let i = Math.max(0, count - 24); i < count; i++) {
                    const id = sequence++
                    particles.push({
                        id,
                        position: lastEmission + direction * i * 12 + (Math.random() - 0.5) * variation * 3,
                        offset: (Math.random() - 0.5) * variation * 4,
                        born: now,
                    })
                }
                lastEmission += direction * count * 12
                particles = particles.slice(-60)
                if (!frame && particles.length) frame = requestAnimationFrame(animate)
            }
            metrics.current = { length, thumb, position, max, value }
            setView(metrics.current)
        }
        const onScroll = () => update(true)
        const clearTrail = () => {
            particles = []
            cancelAnimationFrame(frame)
            frame = 0
            setBits([])
            direction = 0
        }
        const onResize = () => {
            clearTrail()
            update()
            if (!horizontal) {
                const nextMarkers = Array.from(document.querySelectorAll<HTMLElement>('[data-scroll-headings] :is(h1,h2,h3,h4,h5,h6)')).map(heading => ({
                    heading,
                    title: heading.textContent?.trim().replace(/\s+/g, ' ') ?? '',
                    position: Math.min(metrics.current.length - 10, Math.max(10, (heading.getBoundingClientRect().top + element.scrollTop) / element.scrollHeight * metrics.current.length)),
                })).filter(marker => marker.title)
                const gap = Math.min(20, (metrics.current.length - 20) / Math.max(1, nextMarkers.length - 1))
                for (let i = 1; i < nextMarkers.length; i++) nextMarkers[i].position = Math.max(nextMarkers[i].position, nextMarkers[i - 1].position + gap)
                for (let i = nextMarkers.length - 1; i >= 0; i--) nextMarkers[i].position = Math.min(nextMarkers[i].position, i === nextMarkers.length - 1 ? metrics.current.length - 10 : nextMarkers[i + 1].position - gap)
                setMarkers(nextMarkers)
            }
        }
        const events = horizontal ? element : window
        onResize()
        events.addEventListener('scroll', onScroll, { passive: true })
        window.addEventListener('resize', onResize)
        motion.addEventListener('change', clearTrail)
        const observer = new ResizeObserver(onResize)
        observer.observe(bar)
        observer.observe(element)
        observer.observe(horizontal ? element.firstElementChild ?? element : document.body)
        return () => {
            events.removeEventListener('scroll', onScroll)
            window.removeEventListener('resize', onResize)
            motion.removeEventListener('change', clearTrail)
            observer.disconnect()
            cancelAnimationFrame(frame)
            element.removeAttribute('data-comet-scrollbar')
            target.current = null
        }
    }, [targetRef, horizontal, pathname])

    const scrollTo = (value: number) => {
        const offset = Math.min(metrics.current.max, Math.max(0, value))
        target.current?.scrollTo({ [horizontal ? 'left' : 'top']: offset, behavior: 'instant' })
    }
    const moveThumb = (coordinate: number) => {
        const travel = metrics.current.length - metrics.current.thumb
        if (travel > 0) scrollTo((coordinate - (drag.current ?? metrics.current.thumb / 2)) / travel * metrics.current.max)
    }
    const percent = view.max ? Math.round(view.value / view.max * 100) : 0

    return <div className={`${horizontal ? 'absolute inset-x-1 bottom-0 z-10 h-6' : 'fixed inset-y-2 right-0 z-40 w-6'} ${view.max ? '' : 'invisible pointer-events-none'}`}>
      <div
        ref={track}
        role="scrollbar"
        aria-label={label}
        aria-controls={targetRef?.current?.id || 'page-scroll'}
        aria-orientation={horizontal ? 'horizontal' : 'vertical'}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
        aria-valuetext={`${percent}%`}
        aria-hidden={!view.max || undefined}
        tabIndex={view.max ? 0 : -1}
        data-dragging={dragging}
        className="group/scrollbar h-full w-full touch-none select-none cursor-grab outline-none data-[dragging=true]:cursor-grabbing"
        onPointerDown={event => {
            if (!event.isPrimary || event.button !== 0) return
            event.preventDefault()
            event.currentTarget.focus({ preventScroll: true })
            event.currentTarget.setPointerCapture(event.pointerId)
            const bounds = event.currentTarget.getBoundingClientRect()
            const coordinate = horizontal ? event.clientX - bounds.left : event.clientY - bounds.top
            const { position, thumb } = metrics.current
            drag.current = coordinate >= position - 4 && coordinate <= position + thumb + 4 ? coordinate - position : thumb / 2
            setDragging(true)
            moveThumb(coordinate)
        }}
        onPointerMove={event => {
            if (drag.current === null) return
            const bounds = event.currentTarget.getBoundingClientRect()
            moveThumb(horizontal ? event.clientX - bounds.left : event.clientY - bounds.top)
        }}
        onPointerUp={() => { drag.current = null; setDragging(false) }}
        onPointerCancel={() => { drag.current = null; setDragging(false) }}
        onLostPointerCapture={() => { drag.current = null; setDragging(false) }}
        onKeyDown={event => {
            const backward = horizontal ? 'ArrowLeft' : 'ArrowUp'
            const forward = horizontal ? 'ArrowRight' : 'ArrowDown'
            const page = horizontal ? target.current?.clientWidth ?? 0 : target.current?.clientHeight ?? 0
            const offsets: Record<string, number> = { [backward]: -40, [forward]: 40, PageUp: -page, PageDown: page, Home: -view.value, End: view.max - view.value }
            if (!(event.key in offsets)) return
            event.preventDefault()
            scrollTo(view.value + offsets[event.key])
        }}
    >
        <svg aria-hidden="true" className="block h-full w-full overflow-hidden">
            <line x1={horizontal ? 0 : 12} y1={horizontal ? 12 : 0} x2={horizontal ? view.length : 12} y2={horizontal ? 12 : view.length} className="stroke-sky-600/15 dark:stroke-sky-400/15" />
            <g className="fill-sky-600 font-mono text-[9px] dark:fill-sky-400" textAnchor="middle" dominantBaseline="central">
                {bits.map(bit => <text key={bit.id} x={horizontal ? bit.position : 12 + bit.offset} y={horizontal ? 12 + bit.offset : bit.position} opacity={bit.opacity}>{'01001101'[bit.id % 8]}</text>)}
            </g>
            <g data-scroll-thumb="" className="cursor-grab active:cursor-grabbing">
                <rect x={horizontal ? view.position : 0} y={horizontal ? 0 : view.position} width={horizontal ? view.thumb : 24} height={horizontal ? 24 : view.thumb} fill="transparent" />
                <rect x={horizontal ? view.position : 10.5} y={horizontal ? 10.5 : view.position} width={horizontal ? view.thumb : 3} height={horizontal ? 3 : view.thumb} rx={3} className="fill-sky-600  stroke-none transition-colors group-hover/scrollbar:fill-sky-700/60 group-data-[dragging=true]/scrollbar:fill-sky-700/70 group-focus-visible/scrollbar:stroke-sky-600 dark:fill-sky-400/60 dark:group-hover/scrollbar:fill-sky-300/80 dark:group-data-[dragging=true]/scrollbar:fill-sky-300 dark:group-focus-visible/scrollbar:stroke-sky-400" />
            </g>
        </svg>
      </div>
      {markers.length > 0 && <nav aria-label="Post sections" className="pointer-events-none absolute inset-0">
        <svg role="presentation" className="h-full w-full overflow-visible">
            {markers.map((marker, index) => <g key={index} className="group/marker">
                <foreignObject x={-14} y={marker.position - 10} width={20} height={20}>
                    <button type="button" aria-label={`Go to ${marker.title}`} className="pointer-events-auto flex h-5 w-5 items-center justify-center rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-sky-600 dark:focus-visible:outline-sky-400" onClick={() => {
                        marker.heading.tabIndex = -1
                        marker.heading.focus({ preventScroll: true })
                        marker.heading.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' })
                    }}><span aria-hidden="true" className="h-0.5 w-2.5 rounded-full bg-sky-600/15 transition-colors group-hover/marker:bg-sky-700/60 group-focus-within/marker:bg-sky-700/60 dark:bg-sky-400/15 dark:group-hover/marker:bg-sky-300/80 dark:group-focus-within/marker:bg-sky-300/80" /></button>
                </foreignObject>
                <foreignObject aria-hidden="true" x={-272} y={marker.position - 18} width={248} height={36} className="pointer-events-none opacity-0 transition-opacity group-hover/marker:opacity-100 group-focus-within/marker:opacity-100 motion-reduce:transition-none">
                    <div className="flex h-full items-center justify-end"><span className="max-w-full truncate rounded-lg border border-sky-600/20 bg-zinc-50 px-2 py-1 text-xs text-sky-600 dark:border-sky-400/20 dark:bg-neutral-900 dark:text-sky-400">{marker.title}</span></div>
                </foreignObject>
            </g>)}
        </svg>
      </nav>}
    </div>
}
