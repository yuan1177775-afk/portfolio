import type { Metadata } from "next";
import ArticleReader from "../../components/ArticleReader";

const title = "从长表单到分步追问：一个考研择校 AI 顾问的产品复盘";
const description = "复盘规则引擎、RAG 与 LLM 的职责边界，以及完成率、Bad Case 和顾问经验产品化背后的关键决策。";

export const metadata: Metadata = {
  title: `${title} · 圆子`,
  description,
  openGraph: { title, description, images: [] },
  twitter: { title, description, images: [] },
};

export default function SchoolAdvisorRetrospective() {
  return (
    <main className="article-page">
      <header className="article-site-header"><a className="brand" href="/"><strong>圆子</strong><span>SiYuan · Gao</span></a><a href="/?insights=reviews#insights">← 返回项目复盘</a></header>
      <section className="article-hero">
        <p className="section-mark">PROJECT RETROSPECTIVE · 2024—2025</p>
        <h1>{title}</h1>
        <p>{description}</p>
        <div className="article-meta"><span>AI 产品设计</span><span>规则引擎</span><span>RAG</span><span>多轮对话</span><span>评测体系</span></div>
        <aside className="article-note"><strong>阅读说明</strong><p>出于职业操守与信息保密考虑，文中不涉及公司内部真实数据、院校名称和具体金额；百分比均为约数，用于说明变化方向和量级。</p></aside>
      </section>
      <ArticleReader source="/articles-md/school-advisor-retrospective.md" />
      <footer className="article-footer"><a href="/?insights=reviews#insights">返回项目复盘</a><a href="/articles/essay-grading-retrospective">下一篇：作文批改 AI 产品复盘 →</a></footer>
    </main>
  );
}
