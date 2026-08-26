"use client";

import { useEffect, useState } from "react";

const tabs = [
  { key: "articles", label: "产品文章" },
  { key: "notes", label: "学习笔记" },
  { key: "reviews", label: "项目复盘" },
];

const panels = {
  articles: [
    {
      year: "2026",
      title: "从准确率到任务完成率：AI 时代，产品经理已经换了四份工作",
      description: "重新理解 AI 产品经理在模型、交互、评测与业务之间承担的工作。",
      href: "https://yvanzi.com/articles/ai-pm-four-jobs.html",
    },
    {
      year: "2026",
      title: "传统 PM 转型 AI PM，最难的不是技术，而是接受产品会“失控”",
      description: "拆解传统 PM 与 AI PM 在控制方式、质量标准和产出物上的核心差异。",
      href: "https://yvanzi.com/articles/traditional-pm-to-ai-pm.html",
    },
  ],
  notes: [],
  reviews: [
    {
      year: "2024—25",
      title: "从长表单到分步追问：一个考研择校 AI 顾问的产品复盘",
      description: "规则、RAG 与 LLM 如何分工，以及完成率、Bad Case 与顾问经验产品化背后的关键决策。",
      href: "/articles/school-advisor-retrospective",
    },
    {
      year: "2025—26",
      title: "把老师的印象分翻译成机器能执行的标准：一次作文批改 AI 产品复盘",
      description: "从五维 Rubric、OCR 公平性到 AI 优先与人工兜底，复盘评分产品的完整质量闭环。",
      href: "/articles/essay-grading-retrospective",
    },
  ],
};

export default function InsightsTabs() {
  const [active, setActive] = useState("articles");
  const items = panels[active];

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("insights") === "reviews") {
      setActive("reviews");
    }
  }, []);

  return (
    <>
      <div className="insights-tabs reveal visible" role="tablist" aria-label="思考与实验分类">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            className={`insights-tab${active === tab.key ? " active" : ""}`}
            type="button"
            role="tab"
            aria-selected={active === tab.key}
            aria-controls={`insights-${tab.key}`}
            onClick={() => setActive(tab.key)}
          >
            {tab.label}
            {tab.key === "reviews" && <span className="tab-count">2</span>}
          </button>
        ))}
      </div>
      <div className="insights-panels reveal visible">
        <div className="insights-list-panel active" id={`insights-${active}`} role="tabpanel">
          {items.length ? (
            <ul className="insights-list">
              {items.map((item) => (
                <li key={item.title}>
                  <a className="insight-row" href={item.href}>
                    <span className="insight-date">{item.year}</span>
                    <span className="insight-copy"><strong>{item.title}</strong><em>{item.description}</em></span>
                    <i>→</i>
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="insights-empty">学习过程中的阶段性笔记，正在整理中。</p>
          )}
        </div>
      </div>
    </>
  );
}
