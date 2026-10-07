'use client'

import dynamic from 'next/dynamic'
import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react'
import Link from 'next/link'
import config from '@/config'
import './posts-banner.css'

// The package reads navigator during render, so load it only in the browser.
// ponytail: 1.1.1 uses a scoped React 18 peer override; remove it when upgrading React.
const LiquidGlass = dynamic(() => import('liquid-glass-react'), {
    ssr: false,
    loading: () => <h1 className="posts-title-fallback !m-0">Posts</h1>,
})

// The package maps blurAmount to 4 + blurAmount * 32 pixels.
const blurAmount = 0.15

export default function PostsBanner() {
    const mouseContainer = useRef<HTMLElement | null>(null)
    const sentinel = useRef<HTMLDivElement>(null)
    const title = useRef<HTMLDivElement>(null)
    const sizeObserver = useRef<ResizeObserver | null>(null)
    const [docked, setDocked] = useState(false)

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            setDocked(!entry.isIntersecting && entry.boundingClientRect.top < 48)
        }, { rootMargin: '-48px 0px 0px 0px', threshold: 0 })
        if (sentinel.current) observer.observe(sentinel.current)
        return () => observer.disconnect()
    }, [])

    const measureGlass = useCallback((node: HTMLDivElement | null) => {
        sizeObserver.current?.disconnect()
        const glass = node?.closest('.glass')
        if (!glass) return
        // The package only measures on window resize. Size its separate rims locally.
        sizeObserver.current = new ResizeObserver(([entry]) => {
            const { inlineSize, blockSize } = entry.borderBoxSize[0]
            title.current?.style.setProperty('--glass-width', `${inlineSize}px`)
            title.current?.style.setProperty('--glass-height', `${blockSize}px`)
        })
        sizeObserver.current.observe(glass)
    }, [])

    return <div className="relative pb-12"
        style={{ '--photo-blur': `${4 + blurAmount * 32}px` } as CSSProperties}
        ref={(node) => { mouseContainer.current = node?.closest('article') ?? node }}>
        <img src="/posts/pink-sky.webp" alt="" className="!mb-0 w-full rounded-md" />
        <div ref={sentinel} data-posts-anchor className="h-px -mt-px" aria-hidden="true" />
        <div ref={title} className="posts-title select-none absolute left-1/2 bottom-12" data-docked={docked}>
            <LiquidGlass
                mouseContainer={mouseContainer}
                style={docked ? { position: 'fixed', top: '48px', left: '50%' } : { position: 'absolute', top: '0px', left: '0px' }}
                padding="8px 24px"
                cornerRadius={999}
                displacementScale={40}
                blurAmount={blurAmount}
                aberrationIntensity={5}
                elasticity={docked ? 0 : 0.25}
            >
                <div ref={measureGlass} className="posts-glass-content">
                    <span className="posts-glass-name" aria-hidden={!docked}>
                        <Link href="/" tabIndex={docked ? 0 : -1}>{config.blog_name}</Link>
                    </span>
                    <h1 className="!m-0 whitespace-nowrap"><span className="text-white relative -top-px">Posts</span></h1>
                </div>
            </LiquidGlass>
        </div>
    </div>
}
