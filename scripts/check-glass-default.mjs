import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

// Run after npm run build to catch catch-all routes overwriting the glass export.
const output = process.env.NEXT_DIST_DIR || 'out'
const html = await readFile(new URL(`../${output}/posts.html`, import.meta.url), 'utf8')
assert.ok(html.includes('data-posts-anchor'), '/posts must export the liquid glass banner')
assert.ok(html.includes('<title>Posts | Davoud Nosrati</title>'))
console.log('/posts exports the liquid glass design with the correct page title')
