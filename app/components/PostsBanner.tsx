'use client'

import dynamic from 'next/dynamic'
import { useRef } from 'react'
import './posts-banner.css'

// The package reads navigator during render, so load it only in the browser.
// ponytail: 1.1.1 uses a scoped React 18 peer override; remove it when upgrading React.
const LiquidGlass = dynamic(() => import('liquid-glass-react'), {
    ssr: false,
    loading: () => <h1 className="posts-title-fallback !m-0">Posts</h1>,
})

export default function PostsBanner() {
    const mouseContainer = useRef<HTMLElement | null>(null)
    return <div ref={(node) => { mouseContainer.current = node?.closest('article') ?? node }} className="relative pb-12">
        <img src="/posts/pink-sky.webp" alt="" className="!mb-0 w-full rounded-md" />
        <div className="posts-title select-none absolute left-1/2 bottom-12">
            <LiquidGlass
                mouseContainer={mouseContainer}
                style={{ position: 'absolute', top: '0px', left: '0px' }}
                padding="8px 24px"
                cornerRadius={999}
                displacementScale={40}
                blurAmount={0.15}
                aberrationIntensity={5}
                elasticity={0.25}
            >
                <h1 className="!m-0 whitespace-nowrap"><span className="text-white relative -top-px">Posts</span></h1>
            </LiquidGlass>
        </div>
    </div>
}
