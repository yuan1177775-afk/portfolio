import type { Metadata } from "next";
import ArticleReader from "../../components/ArticleReader";

const title = "把老师的印象分翻译成机器能执行的标准：一次作文批改 AI 产品复盘";
const description = "从五维 Rubric、OCR 公平性到 AI 优先与人工兜底，复盘考研英语作文批改产品的完整质量闭环。";

export const metadata: Metadata = {
  title: `${title} · 圆子`,
  description,
  openGraph: { title, description, images: [] },
  twitter: { title, description, images: [] },
};

export default function EssayGradingRetrospective() {
  return (
    <main className="article-page">
      <header className="article-site-header"><a className="brand" href="/"><strong>圆子</strong><span>SiYuan · Gao</span></a><a href="/?insights=reviews#insights">← 返回项目复盘</a></header>
      <section className="article-hero">
        <p className="section-mark">PROJECT RETROSPECTIVE · 2025—2026</p>
        <h1>{title}</h1>
        <p>{description}</p>
        <div className="article-meta"><span>OCR</span><span>五维 Rubric</span><span>LLM 评测</span><span>人机协同</span><span>质量闭环</span></div>
        <aside className="article-note"><strong>阅读说明</strong><p>出于职业操守与信息保密考虑，文中数字均为约数，用于说明变化方向和量级，不代表精确统计口径。</p></aside>
      </section>
      <ArticleReader source="/articles-md/essay-grading-retrospective.md" />
      <footer className="article-footer"><a href="/articles/school-advisor-retrospective">← 上一篇：择校 AI 顾问复盘</a><a href="/?insights=reviews#insights">返回项目复盘</a></footer>
    </main>
  );
}
