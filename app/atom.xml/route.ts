import { generateFeed } from "../actions/feed"

export const dynamic = 'force-static'

export async function GET() {
    const feed = await generateFeed()
    const xml = feed.atom1()
    return new Response(xml)
}
