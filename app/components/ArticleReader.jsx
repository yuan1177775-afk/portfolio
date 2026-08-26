"use client";

import { useEffect, useMemo, useState } from "react";

function inline(text) {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, index) =>
    part.startsWith("**") && part.endsWith("**")
      ? <strong key={index}>{part.slice(2, -2)}</strong>
      : part,
  );
}

function slugify(text, index) {
  return `section-${index}-${text.replace(/[\s，。：“”"'、！？：]/g, "-").replace(/-+/g, "-").slice(0, 32)}`;
}

function parseMarkdown(markdown) {
  const lines = markdown.replace(/\r/g, "").split("\n");
  const blocks = [];
  let list = [];
  let sectionIndex = 0;

  const flushList = () => {
    if (list.length) {
      blocks.push({ type: "list", items: list });
      list = [];
    }
  };

  for (const raw of lines) {
    const line = raw.trim();
    if (!line || line === "---") {
      flushList();
      continue;
    }
    if (line.startsWith("# ")) continue;
    if (line.startsWith("## ")) {
      flushList();
      const text = line.slice(3);
      blocks.push({ type: "heading", text, id: slugify(text, sectionIndex++) });
    } else if (line.startsWith("- ")) {
      list.push(line.slice(2));
    } else {
      flushList();
      blocks.push({ type: "paragraph", text: line });
    }
  }
  flushList();
  return blocks;
}

export default function ArticleReader({ source }) {
  const [markdown, setMarkdown] = useState("");

  useEffect(() => {
    let alive = true;
    fetch(source)
      .then((response) => {
        if (!response.ok) throw new Error("Article unavailable");
        return response.text();
      })
      .then((text) => { if (alive) setMarkdown(text); })
      .catch(() => { if (alive) setMarkdown("## 暂时无法读取正文\n请稍后刷新页面重试。"); });
    return () => { alive = false; };
  }, [source]);

  const blocks = useMemo(() => parseMarkdown(markdown), [markdown]);
  const headings = blocks.filter((block) => block.type === "heading");

  if (!markdown) return <p className="article-loading">正文加载中…</p>;

  return (
    <div className="article-reading-layout">
      <aside className="article-toc" aria-label="文章目录">
        <span>CONTENTS</span>
        <ol>{headings.map((heading) => <li key={heading.id}><a href={`#${heading.id}`}>{heading.text}</a></li>)}</ol>
      </aside>
      <article className="article-body">
        {blocks.map((block, index) => {
          if (block.type === "heading") return <h2 id={block.id} key={block.id}>{block.text}</h2>;
          if (block.type === "list") return <ul key={index}>{block.items.map((item) => <li key={item}>{inline(item)}</li>)}</ul>;
          return <p key={index}>{inline(block.text)}</p>;
        })}
      </article>
    </div>
  );
}
