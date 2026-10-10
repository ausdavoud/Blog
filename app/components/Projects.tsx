import { fromMarkdown } from 'mdast-util-from-markdown'

export type ProjectSection = { id: string; title: string }

type MarkdownNode = {
    type: string
    depth?: number
    value?: string
    children?: MarkdownNode[]
    data?: { hProperties?: Record<string, unknown> }
}

export function remarkProjectSections(sections: ProjectSection[]) {
    return () => (tree: MarkdownNode) => {
        const ids = new Set<string>()
        const text = (node: MarkdownNode): string => node.value ?? node.children?.map(text).join('') ?? ''

        for (const node of tree.children ?? []) {
            if (node.type !== 'heading' || node.depth !== 2) continue
            const title = text(node)
            const base = title.trim().toLowerCase().replace(/[\s&]+/g, '-').replace(/-projects$/, '') || 'section'
            let id = base
            let suffix = 2
            while (ids.has(id)) id = `${base}-${suffix++}`
            ids.add(id)
            node.data = { ...node.data, hProperties: { ...node.data?.hProperties, id, className: 'scroll-mt-24' } }
            sections.push({ id, title })
        }
    }
}

export function getProjectSections(source: string) {
    const sections: ProjectSection[] = []
    remarkProjectSections(sections)()(fromMarkdown(source))
    return sections
}
