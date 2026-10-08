import Link from "next/link"
import { PostData } from "../types"
import { getMdDirection } from "../actions/mdProperties"
import { getPost } from "../actions/posts"

const PostCard = async ({ post }: { post: string | PostData }) => {
    const data = typeof post === "string" ? { ...(await getPost(post)).data, slug: post } : post
    const date = data.date ? new Date(data.date).toISOString().slice(0, 10) : undefined
    return (
        <Link className="post-row" href={data.slug} prefetch>
            <span dir={getMdDirection(data)}>{data.title}</span>
            <span className="post-leader" aria-hidden="true" />
            {date && <time dateTime={date}>{date.replaceAll("-", ".")}</time>}
        </Link>
    )
}

export default PostCard
