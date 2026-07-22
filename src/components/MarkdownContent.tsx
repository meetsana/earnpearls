import { Fragment, type ReactNode } from "react";

function inlineText(value: string): ReactNode {
  const parts = value.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, index) =>
    part.startsWith("**") && part.endsWith("**") ? (
      <strong key={index}>{part.slice(2, -2)}</strong>
    ) : (
      <Fragment key={index}>{part}</Fragment>
    ),
  );
}

/** Safe, intentionally small Markdown projection for managed EarnPearls content. */
export function MarkdownContent({ markdown }: { markdown: string }) {
  const lines = markdown.replaceAll("\r\n", "\n").split("\n");
  const blocks: ReactNode[] = [];
  let list: string[] = [];

  function flushList() {
    if (list.length === 0) return;
    blocks.push(
      <ul key={`list-${blocks.length}`}>
        {list.map((item, index) => (
          <li key={index}>{inlineText(item)}</li>
        ))}
      </ul>,
    );
    list = [];
  }

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (line.startsWith("- ")) {
      list.push(line.slice(2));
      continue;
    }
    flushList();
    if (!line) continue;
    const heading = /^(#{1,3})\s+(.+)$/.exec(line);
    if (heading) {
      const text = heading[2] ?? "";
      if (heading[1]?.length === 1)
        blocks.push(<h2 key={blocks.length}>{inlineText(text)}</h2>);
      else blocks.push(<h3 key={blocks.length}>{inlineText(text)}</h3>);
      continue;
    }
    blocks.push(<p key={blocks.length}>{inlineText(line)}</p>);
  }
  flushList();
  return <div className="markdown-content">{blocks}</div>;
}
