import Link from 'next/link'
import { createElement, type ComponentPropsWithoutRef } from 'react'

export default function MarkdownLink({ href, ...props }: ComponentPropsWithoutRef<'a'>) {
    if (href?.startsWith('/') && !href.startsWith('//') && !props.download)
        return createElement(Link, { ...props, href, prefetch: true })
    return createElement('a', { ...props, href })
}
