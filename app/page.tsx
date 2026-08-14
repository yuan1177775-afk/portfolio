import CombinedDemo from "./components/CombinedDemo";
import EssayDemo from "./components/EssayDemo";

const principles = [
  ["01", "好奇", "理解问题，而不是只接受需求。"],
  ["02", "判断", "在技术可能性中寻找真正值得做的方向。"],
  ["03", "落地", "把模糊的想法，推进为可验证的产品结果。"],
];

const essays = [
  ["2026", "从准确率到任务完成率：AI 时代，产品经理已经换了四份工作", "重新理解 AI 产品经理在模型、交互、评测与业务之间承担的工作。"],
  ["2026", "传统 PM 转型 AI PM，最难的不是技术，而是接受产品会“失控”", "拆解传统 PM 与 AI PM 在控制方式、质量标准和产出物上的核心差异。"],
];

export default function Home() {
  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#home" aria-label="返回首页"><strong>圆子</strong><span>SiYuan · Gao</span></a>
        <nav aria-label="主导航">
          <a href="#about">关于</a><a href="#work">项目</a><a href="#insights">思考</a><a href="#now">Now</a><a href="#contact">联系我</a>
        </nav>
        <a className="nav-github" href="https://github.com/yuan1177775-afk" target="_blank" rel="noreferrer">GitHub ↗</a>
      </header>

      <section className="hero" id="home">
        <div className="hero-copy">
          <p className="eyebrow">AI PRODUCT MANAGER · PORTFOLIO 2026</p>
          <h1>Yuan</h1>
          <p className="hero-line">让想法生长，<br />让技术抵达真实的人。</p>
          <p className="hero-desc">我是一名 AI 产品经理。这里记录我的产品项目、AI 实验与行业思考，探索模型能力如何转化为真实、清晰且可持续的用户价值。</p>
          <div className="hero-actions"><a className="button dark" href="#work">查看项目</a><a className="button light" href="#about">关于我</a></div>
        </div>
        <div className="hero-art" aria-hidden="true"><div className="sun"/><img className="tree" src="/assets/tree.png" alt=""/><img className="village" src="/assets/village.png" alt=""/><img className="bridge" src="/assets/bridge.png" alt=""/></div>
      </section>

      <section className="section about" id="about">
        <div className="section-heading"><p className="eyebrow">01 · ABOUT</p><h2>关于我</h2></div>
        <div className="about-copy"><p className="lead">你好，我是圆子，一名专注于 AI 应用落地的产品经理。</p><p>我习惯从用户问题出发，拆解业务场景、识别关键需求，并将模型能力转化为清晰、可验证的产品方案。</p><p>我关注的不只是“AI 能不能实现”，也关注它是否真正解决问题、是否值得用户使用，以及如何在技术能力、产品体验和业务价值之间建立平衡。</p></div>
        <div className="principles">{principles.map(([n,t,d])=><article key={n}><span>{n}</span><h3>{t}</h3><p>{d}</p></article>)}</div>
      </section>

      <section className="section work" id="work">
        <div className="work-intro"><div className="section-heading"><p className="eyebrow">02 · SELECTED WORK</p><h2>精选项目</h2></div><div><p className="lead">从问题出发，<br/>让方案走向真实场景。</p><p>这里收录我参与和主导的 AI 产品项目，记录从需求发现、方案设计到验证迭代的完整过程。</p></div></div>

        <article className="project" id="school-advisor">
          <div className="project-top"><div><p className="case">CASE 01 <span>AI ADVISOR</span></p><h3>考研择校择专业 AI 顾问</h3><p className="project-summary">面向信息分散、决策链路长的考研择校场景，通过对话收集用户背景与偏好，将硬约束筛选、分档规则和 AI 解释结合，帮助用户更清晰地完成“冲刺、稳妥、保底”院校决策。</p></div><time>2024 年 9 月</time></div>
          <div className="project-facts"><span>角色：AI 产品经理</span><span>AI 产品设计</span><span>规则引擎</span><span>用户决策</span><span>教育科技</span></div>
          <div className="demo-label"><span>INTERACTIVE PROTOTYPE</span><p>下方为可直接操作的完整原型，无需跳转新页面。</p></div>
          <div className="demo-shell"><CombinedDemo /></div>
        </article>

        <article className="project" id="essay-grading">
          <div className="project-top"><div><p className="case">CASE 02 <span>AI LEARNING TOOL</span></p><h3>考研英语作文 AI 批改</h3><p className="project-summary">围绕手写作文从识别到讲评的完整链路，组合 OCR 低置信度确认、五维评分、规则校验与人工复核机制，让 AI 反馈既可解释，也能在不确定时及时交还给老师。</p></div><time>AI 产品项目</time></div>
          <div className="project-facts"><span>角色：AI 产品经理</span><span>OCR</span><span>LLM 评测</span><span>人机协同</span><span>质量控制</span></div>
          <div className="demo-label"><span>INTERACTIVE PROTOTYPE</span><p>选择作文并上传后，可完整体验识别、确认、评分与复核流程。</p></div>
          <div className="demo-shell"><EssayDemo /></div>
        </article>

        <article className="project compact">
          <div className="project-top"><div><p className="case">CASE 03 <span>AI DEMO</span></p><h3>馕途 · 新疆深度旅行规划</h3><p className="project-summary">一站式新疆旅行规划原型，涵盖路线推荐、景点攻略、美食住宿与季节玩法，用 vibe coding 快速验证 AI 旅行助手体验。</p></div><time>Vibe Coding</time></div>
          <div className="project-facts"><span>角色：独立探索</span><span>AI 原型</span><span>旅行规划</span><span>交互 Demo</span></div>
          <a className="text-link" href="https://yvanzi.com/demos/nantu/" target="_blank" rel="noreferrer">体验 Demo →</a>
        </article>
      </section>

      <section className="section insights" id="insights">
        <div className="section-heading"><p className="eyebrow">03 · INSIGHTS & EXPERIMENTS</p><h2>思考与实验</h2></div>
        <p className="lead">正在生长的想法</p><p>有些内容已经成为产品，有些仍在验证。这里记录尚未完成的思考、实验与阶段性答案。</p>
        <div className="essay-list">{essays.map(([year,title,desc])=><article key={title}><span>{year}</span><div><h3>{title}</h3><p>{desc}</p></div><b>→</b></article>)}</div>
      </section>

      <section className="section now" id="now">
        <div className="section-heading"><p className="eyebrow">04 · NOW / ON MY RADAR</p><h2>最近在想</h2></div>
        <p className="lead">关注变化，<br/>也记录自己的判断。</p>
        <div className="now-grid"><article><span>MODEL RELEASE</span><h3>开放模型的竞争，正在从“能不能用”走向“能不能完成复杂任务”</h3><p>我关注的不是参数规模，而是能力、成本、部署方式与数据边界如何共同影响产品选择。</p></article><article><span>INTERACTION</span><h3>当语音不再只是输入方式，它会不会成为 AI 的默认界面？</h3><p>自然打断、上下文延续，以及知道什么时候应该停下来，可能比单纯识别准确更重要。</p></article><article><span>AGENTIC PRODUCTS</span><h3>从“给出答案”到“替用户完成任务”，产品边界正在重新划分</h3><p>Agent 产品需要同时定义权限、过程反馈、失败恢复与人工确认机制。</p></article></div>
      </section>

      <section className="section contact" id="contact"><p className="eyebrow">05 · CONTACT</p><h2>期待与你一起，<br/>做些真正有价值的事。</h2><p>我目前关注 AI 产品经理及 AI 应用产品相关机会，也欢迎关于产品实践与 AI 应用落地的交流。</p><a href="mailto:yuan1177775@gmail.com">yuan1177775@gmail.com ↗</a></section>

      <footer><a className="brand" href="#home"><strong>圆子</strong><span>SiYuan · Gao</span></a><p>AI PRODUCT MANAGER · PORTFOLIO 2026</p></footer>
    </main>
  );
}
