import Link from 'next/link'
import { createElement, type ComponentPropsWithoutRef } from 'react'

export default function MarkdownLink({ href, className = '', ...props }: ComponentPropsWithoutRef<'a'>) {
    const classes = `text-sky-600 dark:text-sky-400 font-medium hover:text-sky-700 dark:hover:text-sky-300 hover:underline transition-colors ${className}`
    if (href?.startsWith('/') && !href.startsWith('//') && !props.download)
        return createElement(Link, { ...props, href, className: classes })
    return createElement('a', { ...props, href, className: classes })
}
