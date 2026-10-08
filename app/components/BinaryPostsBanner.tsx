'use client'

import { useEffect, useId, useState } from 'react'
import './binary-posts-banner.css'

export default function BinaryPostsBanner() {
    const id = useId().replaceAll(':', '')
    const [hovered, setHovered] = useState(false)
    const [focused, setFocused] = useState(false)
    const [touched, setTouched] = useState(false)
    const active = hovered || focused || touched
    const [bits, setBits] = useState('010010110101001011010010')

    useEffect(() => {
        if (!active || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
        const timer = window.setInterval(() => {
            setBits(Array.from({ length: 24 }, () => Math.random() < 0.5 ? '0' : '1').join(''))
        }, 120)
        return () => window.clearInterval(timer)
    }, [active])

    return <div className="binary-posts-banner" data-hovered={active}>
        <img src="/posts/pink-sky.webp" alt="" className="w-full !mb-0 rounded-md" />
        <div className="binary-posts-cutout">
            <h1 className="!m-0"><button type="button" className="binary-posts-label" aria-label="Posts"
                onPointerEnter={event => { if (event.pointerType === 'mouse') setHovered(true) }}
                onPointerLeave={() => setHovered(false)}
                onFocus={() => setFocused(true)} onBlur={() => { setFocused(false); setTouched(false) }}
                onPointerDown={event => { if (event.pointerType !== 'mouse') setTouched(value => !value) }}>
                <svg viewBox="0 0 150 36" aria-hidden="true"><text x="75" y="33" textAnchor="middle">Posts</text></svg>
            </button></h1>
            <svg className="binary-posts-frame" viewBox="-80 0 310 36" aria-hidden="true">
                <defs>
                    <linearGradient id={`${id}-left`} x1="0" x2="1">
                        <stop offset="0" stopColor="white" stopOpacity="0" />
                        <stop offset="0.65" stopColor="white" stopOpacity="0.5" />
                        <stop offset="1" stopColor="white" />
                    </linearGradient>
                    <linearGradient id={`${id}-right`} x1="0" x2="1">
                        <stop offset="0" stopColor="white" />
                        <stop offset="0.35" stopColor="white" stopOpacity="0.5" />
                        <stop offset="1" stopColor="white" stopOpacity="0" />
                    </linearGradient>
                    <mask id={`${id}-fade-left`} maskUnits="userSpaceOnUse" x="-80" y="0" width="85" height="36">
                        <rect x="-80" width="85" height="36" fill={`url(#${id}-left)`} />
                    </mask>
                    <mask id={`${id}-fade-right`} maskUnits="userSpaceOnUse" x="145" y="0" width="85" height="36">
                        <rect x="145" width="85" height="36" fill={`url(#${id}-right)`} />
                    </mask>
                </defs>
                <g className="binary-posts-guides">
                    <path d="M5 26V16 M145 26V16" />
                    <path className="binary-posts-connection" d="M5 26V14Q5 7 12 7H138Q145 7 145 14V26" />
                </g>
                {['left', 'right'].map(side => <g key={side} mask={`url(#${id}-fade-${side})`}>
                    <path className="binary-posts-out-guide" d={side === 'left' ? 'M5 30H-80' : 'M145 30H230'} />
                    <g className="binary-posts-digits">
                        {Array.from({ length: 8 }, (_, index) => <text key={index}
                            x={side === 'left' ? -5 - index * 10 : 155 + index * 10} y="33">{bits[index]}</text>)}
                    </g>
                </g>)}
                <g className="binary-posts-digits">
                    <text x="5" y="23">{bits[13]}</text>
                    <text x="145" y="23">{bits[14]}</text>
                    {Array.from({ length: 13 }, (_, index) => <text key={index} x={15 + index * 10} y="10">{bits[index]}</text>)}
                </g>
                <g className="binary-posts-anchors">
                    <text x="5" y="33">0</text>
                    <text x="145" y="33">0</text>
                </g>
            </svg>
        </div>
    </div>
}
