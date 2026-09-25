import { MDXRemote } from "next-mdx-remote/rsc";
import "./markdown.css";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import PostCard from "../PostCard";

type MarkdownNode = {
  type: string;
  children?: MarkdownNode[];
  position?: {
    start: { offset?: number };
    end: { offset?: number };
  };
  data?: {
    hProperties?: { className?: string[] };
  };
};

function remarkDisplayDoubleDollarMath() {
  return (tree: MarkdownNode, file: { value: unknown }) => {
    const source = String(file.value);

    function visit(node: MarkdownNode) {
      const start = node.position?.start.offset;
      const end = node.position?.end.offset;

      if (
        node.type === "inlineMath" &&
        start !== undefined &&
        end !== undefined &&
        source.slice(start, start + 2) === "$$" &&
        source.slice(end - 2, end) === "$$" &&
        node.data?.hProperties
      ) {
        node.data.hProperties.className = ["language-math", "math-display"];
      }

      node.children?.forEach(visit);
    }

    visit(tree);
  };
}

export default function Markdown({
  source,
  components,
}: {
  source: string;
  components: any;
}) {
  return (
    <MDXRemote
      source={source}
      components={{ ...components, PostCard }}
      options={{
        mdxOptions: {
          useDynamicImport: true,
          rehypePlugins: [
            //@ts-ignore
            rehypeKatex,
            [
              // @ts-ignore -- next-mdx-remote and rehype-pretty-code use incompatible unified type versions
              rehypePrettyCode,
              {
                keepBackground: false,
                theme: {
                  dark: "github-dark",
                  light: "github-light",
                },
              },
            ],
          ],
          remarkPlugins: [
            remarkGfm,
            remarkMath,
            remarkDisplayDoubleDollarMath,
          ],
        },
      }}
    />
  );
}
