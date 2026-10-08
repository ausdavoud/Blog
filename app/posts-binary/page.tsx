import { getPost } from '@/app/actions/posts'
import Header from '@/app/components/Header'
import Markdown from '@/app/components/Markdown/Markdown'
import BinaryPostsBanner from '@/app/components/BinaryPostsBanner'

export const metadata = { title: 'Posts Binary' }

export default async function PostsBinaryPage() {
    const { content, components } = await getPost('posts')
    return <div className="flex flex-col items-center max-w-post w-[calc(100%-4rem)]">
        <Header sidebar={false} compactNavigation={false} />
        <main className="flex-1 w-full pt-2 pb-8">
            <article className="markdown">
                <BinaryPostsBanner />
                <Markdown source={content} components={components} />
            </article>
        </main>
    </div>
}
