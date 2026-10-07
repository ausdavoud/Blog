import assert from 'node:assert/strict'
import MarkdownLink from '../app/components/Markdown/MarkdownLink'
import Link from 'next/link'

const internal = MarkdownLink({ href: '/posts', children: 'Posts', className: 'example' })
assert.equal(internal.type, Link)
assert.equal(internal.props.href, '/posts')
assert.equal(internal.props.className, 'example')
for (const href of ['https://example.com', '//example.com', '#section', 'mailto:hi@example.com'])
    assert.equal(MarkdownLink({ href }).type, 'a')
assert.equal(MarkdownLink({ href: '/file.pdf', download: true }).type, 'a')
console.log('Internal Markdown links use Next navigation; external links, anchors, and downloads stay native.')
