import assert from 'node:assert/strict'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { compileMDX } from 'next-mdx-remote/rsc'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'

const { content } = await compileMDX({
    source: `<Label name="Coming soon" />

{1 + 1}

| Value |
| --- |
| $2^{10}$ |

\`\`\`js
const value = 'unchanged'
\`\`\`
`,
    components: { Label: ({ name }) => createElement('span', null, name) },
    options: { mdxOptions: { remarkPlugins: [remarkGfm, remarkMath], rehypePlugins: [rehypeKatex] } },
})
const html = renderToStaticMarkup(content)
assert.match(html, /<span>Coming soon<\/span>/)
assert.doesNotMatch(html, /<p>2<\/p>/, 'MDX JavaScript expressions must remain blocked')
assert.match(html, /<table>/)
assert.match(html, /class="katex"/)
assert.match(html, /const value = &#x27;unchanged&#x27;/)
console.log('MDX labels, expression blocking, tables, math, and code verified.')
