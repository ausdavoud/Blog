import { MDXRemote } from "next-mdx-remote/rsc";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import PostCard from "../PostCard";
import { ComingSoon } from "../Header";
import BinaryPhoto from "../BinaryPhoto";
import MarkdownLink from "./MarkdownLink";
import type { ComponentPropsWithoutRef } from "react";
import ProjectItem, { ProjectTag } from "../ProjectItem";
import { remarkProjectSections, type ProjectSection } from "../Projects";
import ProjectsView, { ProjectCollection, ProjectNavigation, ProjectSectionHeading } from "../ProjectsView";
import { notFound } from "next/navigation";

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

export default async function Markdown({
  source,
  components,
  projects = false,
  projectSection,
}: {
  source: string;
  components: any;
  projects?: boolean;
  projectSection?: string;
}) {
  const sections: ProjectSection[] = [];
  const content = await MDXRemote({
      source,
      components: {
        a: MarkdownLink,
        img: ({ className = "", ...props }: ComponentPropsWithoutRef<'img'>) => <img {...props} className={`object-cover ${className}`} />,
        ...components, PostCard, ComingSoon, BinaryPhoto, ProjectItem, ProjectTag, ProjectCollection,
        ...(projects ? { h2: ProjectSectionHeading } : {}),
      },
      options: {
        mdxOptions: {
          useDynamicImport: true,
          rehypePlugins: [
            rehypeKatex,
            [
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
            ...(projects ? [remarkProjectSections(sections)] : []),
          ],
        },
      },
  });

  if (projectSection && !sections.some(section => section.id === projectSection)) notFound();
  return projects ? <ProjectsView sections={sections} section={projectSection}><ProjectNavigation sections={sections} />{content}</ProjectsView> : content;
}
