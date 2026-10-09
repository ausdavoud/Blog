'use client'

import { useEffect, useRef, useState } from 'react'

const rails = [
    {
        edge: 'top',
        position: 'left-[10px] top-0',
        digits: '',
        horizontal: true,
    },
    {
        edge: 'left',
        position: 'left-0 top-[10px]',
        digits: 'flex-col',
        horizontal: false,
    },
    {
        edge: 'bottom',
        position: 'bottom-0 right-[10px]',
        digits: 'absolute right-0 flex-row-reverse',
        horizontal: true,
    },
    {
        edge: 'right',
        position: 'bottom-[10px] right-0',
        digits: 'absolute bottom-0 flex-col-reverse',
        horizontal: false,
    },
]

export default function BinaryPhoto({
    src,
    alt,
}: {
    src: string
    alt: string
}) {
    const frame = useRef<HTMLDivElement>(null)
    const [hovered, setHovered] = useState(false)
    const [bits, setBits] = useState(['', '', '', ''])
    const [size, setSize] = useState({ width: 0, height: 0 })

    useEffect(() => {
        const element = frame.current
        if (!element) return

        const observer = new ResizeObserver(([entry]) => {
            setSize({
                width: entry.contentRect.width,
                height: entry.contentRect.height,
            })
        })

        observer.observe(element)
        return () => observer.disconnect()
    }, [])

    useEffect(() => {
        if (!hovered) return

        const stopOutside = (event: PointerEvent) => {
            if (!frame.current?.contains(event.target as Node)) {
                setHovered(false)
            }
        }

        document.addEventListener('pointerdown', stopOutside, true)
        return () => {
            document.removeEventListener('pointerdown', stopOutside, true)
        }
    }, [hovered])

    useEffect(() => {
        if (
            !hovered ||
            window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ) return

        const randomize = () => {
            setBits(
                [size.width, size.height, size.width, size.height].map(length =>
                    Array.from(
                        { length: Math.floor(length / 10) },
                        () => Math.random() < 0.5 ? '0' : '1',
                    ).join(''),
                ),
            )
        }

        randomize()
        const timer = window.setInterval(randomize, 120)
        return () => window.clearInterval(timer)
    }, [hovered, size])

    useEffect(() => {
        if (
            !hovered ||
            window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ) return

        const animations = Array.from(
            frame.current?.querySelectorAll('[data-binary-digits]') ?? [],
            element => element.animate(
                [
                    { opacity: 1, offset: 0 },
                    { opacity: 0.55, offset: 0.35 },
                    { opacity: 0.85, offset: 0.65 },
                    { opacity: 1, offset: 1 },
                ],
                {
                    duration: 480,
                    easing: 'steps(1)',
                    iterations: Infinity,
                },
            ),
        )

        return () => animations.forEach(animation => animation.cancel())
    }, [hovered])

    return (
        <div
            ref={frame}
            className="relative mb-[4px] p-[10px]"
            onPointerEnter={event => {
                if (event.pointerType === 'mouse') setHovered(true)
            }}
            onPointerLeave={event => {
                if (event.pointerType === 'mouse') setHovered(false)
            }}
            onPointerDown={event => {
                if (event.pointerType !== 'mouse') {
                    setHovered(active => !active)
                }
            }}
        >
            <img
                className="!mb-0 w-full rounded-md object-cover border border-gray-200 dark:border-gray-700"
                src={src}
                alt={alt}
            />

            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 text-[10px] leading-[10px] text-[var(--on-background-muted)] [font-family:ui-monospace,SFMono-Regular,Consolas,monospace]"
            >
                <span className="absolute left-0 top-0 z-[1] h-[10px] w-[10px] bg-[var(--background)] text-center">
                    0
                </span>

                <span className="absolute bottom-0 right-0 z-[1] h-[10px] w-[10px] bg-[var(--background)] text-center">
                    0
                </span>

                {rails.map(({ edge, position, digits, horizontal }, index) => (
                    <span
                        key={edge}
                        className={`
                            absolute overflow-hidden whitespace-nowrap
                            bg-no-repeat
                            [background-image:linear-gradient(currentColor,currentColor)]
                            transition-[width,height] duration-[800ms]
                            [transition-timing-function:ease]
                            motion-reduce:transition-none
                            ${position}
                            ${horizontal
                                ? `h-[10px] bg-[position:left_center] bg-[length:100%_1px] ${
                                    hovered ? 'w-[calc(100%-15px)]' : 'w-[18px]'
                                }`
                                : `w-[10px] bg-[position:center_top] bg-[length:1px_100%] ${
                                    hovered ? 'h-[calc(100%-15px)]' : 'h-[18px]'
                                }`
                            }
                        `}
                    >
                        <span
                            data-binary-digits
                            className={`
                                flex justify-between
                                [&>span]:h-[10px]
                                [&>span]:w-[10px]
                                [&>span]:flex-[0_0_10px]
                                [&>span]:bg-[var(--background)]
                                [&>span]:text-center
                                ${digits}
                            `}
                            style={horizontal
                                ? { width: size.width }
                                : { height: size.height }
                            }
                        >
                            {(hovered ? bits[index] : '')
                                .split('')
                                .map((bit, position) => (
                                    <span key={position}>{bit}</span>
                                ))}
                        </span>
                    </span>
                ))}
            </div>
        </div>
    )
}
