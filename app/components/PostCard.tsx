import Link from "next/link"
import { PostData } from "../types"
import { getMdDirection } from "../actions/mdProperties"
import { getPost } from "../actions/posts"

const PostCard = async ({ post }: { post: string | PostData }) => {
    const data = typeof post === "string" ? { ...(await getPost(post)).data, slug: post } : post
    const date = data.date ? new Date(data.date).toISOString().slice(0, 10) : undefined
    return (
        <Link className="flex items-baseline gap-4 py-3 font-normal text-neutral-800 dark:text-neutral-200 no-underline transition-opacity duration-150 ease-in-out [@media(hover:hover)]:group-has-[a:hover]/list:[&:not(:hover)]:opacity-40" href={data.slug}>
            <span dir={getMdDirection(data)}>{data.title}</span>
            <span className="flex-1 min-w-4 self-center border-b border-zinc-300 dark:border-zinc-800 opacity-50" aria-hidden="true" />
            {date && <time className="shrink-0 text-sm text-neutral-500 dark:text-zinc-400" dateTime={date}>{date.replaceAll("-", ".")}</time>}
        </Link>
    )
}

export default PostCard
