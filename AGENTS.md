# Agent instructions

1. Always use @Ponytail as the top priority.
2. Use Tailwind CSS utility classes directly in className instead of inline styles or external CSS files. Prefer standard utilities; use inline arbitrary values only when standard utilities cannot express the required style.
3. Do not add custom Tailwind CSS rules, utilities, variants, or theme/config extensions. Use standard utilities or inline arbitrary-value utilities instead.
4. Delete any additional check scripts created during evaluation after the checks pass.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
