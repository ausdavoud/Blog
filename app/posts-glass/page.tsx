import { getPost } from '@/app/actions/posts'
import Header from '@/app/components/Header'
import Markdown from '@/app/components/Markdown/Markdown'
import PostsBanner from '@/app/components/PostsBanner'

export const metadata = { title: 'Posts Glass' }

export default async function PostsGlassPage() {
    const { content, components } = await getPost('posts')
    return <div className="flex flex-col items-center max-w-post w-[calc(100%-4rem)]">
        <Header sidebar={false} compactNavigation={false} />
        <main className="flex-1 w-full pt-2 pb-8">
            <article className="markdown">
                <PostsBanner />
                <Markdown source={content} components={components} />
            </article>
        </main>
    </div>
}
