'use client'

import { useEffect, useRef, useState } from 'react'
import './binary-photo.css'

export default function BinaryPhoto({ src, alt }: { src: string, alt: string }) {
    const frame = useRef<HTMLDivElement>(null)
    const [hovered, setHovered] = useState(false)
    const [bits, setBits] = useState(['', '', '', ''])
    const [size, setSize] = useState({ width: 0, height: 0 })

    useEffect(() => {
        const observer = new ResizeObserver(([entry]) => setSize({
            width: entry.contentRect.width, height: entry.contentRect.height,
        }))
        observer.observe(frame.current!)
        return () => observer.disconnect()
    }, [])

    useEffect(() => {
        if (!hovered || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
        const randomize = () => {
            setBits([size.width, size.height, size.width, size.height].map(length =>
                Array.from({ length: Math.floor(length / 10) }, () => Math.random() < 0.5 ? '0' : '1').join('')))
        }
        randomize()
        const timer = window.setInterval(randomize, 120)
        return () => window.clearInterval(timer)
    }, [hovered, size])

    return <div ref={frame} className="binary-photo" data-hovered={hovered}
        onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
        <img className="w-full !mb-0 dark:border dark:border-gray-700 rounded-md" src={src} alt={alt} />
        <div className="binary-frame" aria-hidden="true">
            <span className="binary-zero binary-zero-tl">0</span>
            <span className="binary-zero binary-zero-br">0</span>
            {['top', 'left', 'bottom', 'right'].map((edge, index) =>
                <span key={edge} className={`binary-rail binary-rail-${edge}`}>
                    <span className="binary-digits" style={index % 2 === 0 ? { width: size.width } : { height: size.height }}>
                        {(hovered ? bits[index] : '').split('').map((bit, position) => <span key={position}>{bit}</span>)}
                    </span>
                </span>)}
        </div>
    </div>
}
