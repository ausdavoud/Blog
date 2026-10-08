import assert from 'node:assert/strict'
import { getAllPosts, getPost } from '../app/actions/posts'

async function check() {
    const posts = await getAllPosts({ recursive: true, self: true })
    assert.ok(posts.some(post => post.slug === '/posts'))
    for (const post of posts) {
        const loaded = await getPost(post.slug)
        assert.equal(loaded.data.title, post.title)
        assert.equal(typeof loaded.content, 'string')
        assert.deepEqual(loaded.components, {})
    }
    console.log(`${posts.length} pages and posts load without optional component imports`)
}

check().catch(error => { console.error(error); process.exitCode = 1 })
