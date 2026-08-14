import CombinedDemo from "./components/CombinedDemo";
import EssayDemo from "./components/EssayDemo";

const originalSite = "https://yvanzi.com";

export default function Home() {
  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#home"><strong>圆子</strong><span>SiYuan · Gao</span></a>
        <nav aria-label="主导航"><a href="#about">关于</a><a href="#work">项目</a><a href="#insights">思考</a><a href="#now">Now</a><a href="#contact">联系我</a></nav>
        <div className="header-actions"><a href="https://github.com/yuan1177775-afk" target="_blank" rel="noreferrer">GitHub <i>↗</i></a><a href={`${originalSite}/assets/gaosiyuan-ai-product-manager-resume.pdf`} target="_blank" rel="noreferrer">简历 PDF <i>↓</i></a></div>
        <button className="menu-button" aria-label="打开菜单" aria-expanded="false"><span/><span/></button>
      </header>

      <section className="hero" id="home">
        <div className="hero-copy reveal visible">
          <p className="section-mark">AI PRODUCT MANAGER · PORTFOLIO 2026</p><h1>Yuan</h1>
          <p className="hero-statement">让想法生长，<br/>让技术抵达真实的人。</p>
          <p className="body-copy hero-summary">我是一名 AI 产品经理。这里记录我的产品项目、AI 实验与行业思考，探索模型能力如何转化为真实、清晰且可持续的用户价值。</p>
          <div className="hero-actions"><a className="button button-primary" href="#work">查看项目</a><a className="button button-secondary" href="#about">关于我</a><a className="button button-ai" href="#contact">和我聊聊</a><a className="button button-text" href={`${originalSite}/assets/gaosiyuan-ai-product-manager-resume.pdf`} target="_blank" rel="noreferrer">下载简历 ↓</a></div>
          <a className="scroll-link" href="#about">向下浏览 <span>↓</span></a>
        </div>
      </section>

      <section className="about section" id="about">
        <div className="content-panel about-panel reveal visible"><p className="section-mark">01 · ABOUT</p><h2>关于我</h2>
          <div className="about-body"><p>你好，我是圆子，一名专注于 AI 应用落地的产品经理。</p><p>我习惯从用户问题出发，拆解业务场景、识别关键需求，并将模型能力转化为清晰、可验证的产品方案。</p><p>我关注的不只是“AI 能不能实现”，也关注它是否真正解决问题、是否值得用户使用，以及如何在技术能力、产品体验和业务价值之间建立平衡。</p></div>
          <div className="principles"><article><span>01</span><h3>好奇</h3><p>理解问题，而不是只接受需求。</p></article><article><span>02</span><h3>判断</h3><p>在技术可能性中寻找真正值得做的方向。</p></article><article><span>03</span><h3>落地</h3><p>把模糊的想法，推进为可验证的产品结果。</p></article></div>
          <a className="about-ai-link" href="#contact"><span>🌱</span> 还有问题？来和我聊聊 →</a>
        </div>
      </section>

      <section className="work section clean-section" id="work">
        <div className="section-heading reveal visible"><p className="section-mark">02 · SELECTED WORK</p><h2>精选项目</h2><p className="section-claim">从问题出发，<br/>让方案走向真实场景。</p><p className="body-copy">这里收录我参与和主导的 AI 产品项目，记录从需求发现、方案设计到验证迭代的完整过程。</p></div>
        <div className="project-grid">
          <article className="project-card reveal visible">
            <div className="project-cover cover-education"><span className="cover-index">CASE 01</span><div className="cover-window"><i/><i/><i/><strong>AI ADVISOR</strong></div></div>
            <div className="project-content"><div className="project-topline"><span>AI 产品项目</span><time>2024 年 9 月</time></div><h3>考研择校择专业 AI 顾问</h3><p>用“规则引擎 + RAG + LLM”把顾问经验产品化，通过多轮追问，为管综 199 考生生成冲刺、稳妥、保底的个性化择校方案。</p><ul className="project-tags"><li>多轮对话</li><li>RAG</li><li>规则引擎</li><li>Bad Case</li></ul><div className="project-footer"><span>角色：AI 产品经理 · 管综199</span><a href="#school-demo">体验 Demo →</a></div></div>
          </article>
          <article className="project-card reveal visible">
            <div className="project-cover cover-knowledge"><span className="cover-index">CASE 02</span><div className="cover-orbit"><i/><i/><i/></div></div>
            <div className="project-content"><div className="project-topline"><span>AI 产品项目</span><time>已全量上线</time></div><h3>考研英语作文 AI 批改</h3><p>将人工批改重构为“OCR 识别 + 规则校验 + LLM 五维评分 + 人工兜底”，让大部分作文在几分钟内获得可追溯讲评。</p><ul className="project-tags"><li>OCR</li><li>LLM 评测</li><li>Rubric</li><li>人机协同</li></ul><div className="project-footer"><span>角色：AI 产品经理 · 独立负责</span><a href="#essay-demo">体验 Demo →</a></div></div>
          </article>
          <article className="project-card reveal visible">
            <div className="project-cover cover-lab"><span className="cover-index">CASE 03</span><div className="cover-grid"><i/><i/><i/><i/></div></div>
            <div className="project-content"><div className="project-topline"><span>AI Demo</span><time>Vibe Coding</time></div><h3>馕途 · 新疆深度旅行规划</h3><p>一站式新疆旅行规划原型，涵盖路线推荐、景点攻略、美食住宿与季节玩法，用 vibe coding 快速验证 AI 旅行助手体验。</p><ul className="project-tags"><li>AI 原型</li><li>旅行规划</li><li>交互 Demo</li></ul><div className="project-footer"><span>角色：独立探索</span><a href={`${originalSite}/demos/nantu/`} target="_blank" rel="noreferrer">体验 Demo →</a></div></div>
          </article>
        </div>

        <div className="project-demo" id="school-demo">
          <div className="project-demo-head"><span>CASE 01 · INTERACTIVE PROTOTYPE</span><p>基于真实产品架构制作的简化演示，院校数据均为 Mock 数据。</p></div>
          <div className="demo-shell"><CombinedDemo/></div>
        </div>
        <div className="project-demo" id="essay-demo">
          <div className="project-demo-head"><span>CASE 02 · INTERACTIVE PROTOTYPE</span><p>可完整体验 OCR 置信度确认、五维评分、规则校验与转人工流程。</p></div>
          <div className="demo-shell"><EssayDemo/></div>
        </div>
      </section>

      <section className="insights section" id="insights">
        <div className="content-panel insights-panel"><div className="section-heading reveal visible"><p className="section-mark">03 · INSIGHTS &amp; EXPERIMENTS</p><h2>思考与实验</h2><p className="section-claim">正在生长的想法</p><p className="body-copy">有些内容已经成为产品，有些仍在验证。这里记录尚未完成的思考、实验与阶段性答案。</p></div>
          <div className="insights-tabs reveal visible" role="tablist" aria-label="思考与实验分类"><button className="insights-tab active" type="button">产品文章</button><button className="insights-tab" type="button">学习笔记</button><button className="insights-tab" type="button">项目复盘</button></div>
          <div className="insights-panels reveal visible"><div className="insights-list-panel active"><ul className="insights-list"><li><a className="insight-row" href={`${originalSite}/articles/ai-pm-four-jobs.html`}><span className="insight-date">2026</span><span className="insight-copy"><strong>从准确率到任务完成率：AI 时代，产品经理已经换了四份工作</strong><em>重新理解 AI 产品经理在模型、交互、评测与业务之间承担的工作。</em></span><i>→</i></a></li><li><a className="insight-row" href={`${originalSite}/articles/traditional-pm-to-ai-pm.html`}><span className="insight-date">2026</span><span className="insight-copy"><strong>传统 PM 转型 AI PM，最难的不是技术，而是接受产品会“失控”</strong><em>拆解传统 PM 与 AI PM 在控制方式、质量标准和产出物上的核心差异。</em></span><i>→</i></a></li></ul></div></div>
        </div>
      </section>

      <section className="now section clean-section" id="now">
        <div className="now-heading section-heading reveal visible"><p className="section-mark">04 · NOW / ON MY RADAR</p><h2>最近在想</h2><p className="section-claim">关注变化，<br/>也记录自己的判断。</p><p className="body-copy">这里不是新闻列表，而是我近期关注的模型、产品与行业变化，以及它们带给我的产品启发。</p><p className="now-updated">LAST UPDATED · AUGUST 2026</p></div>
        <div className="now-grid"><article className="now-card now-card--featured reveal visible"><div className="now-card-topline"><span>MODEL RELEASE</span><time dateTime="2026-07">JUL 2026</time></div><h3>Kimi K3：开放模型的竞争，正在从“能不能用”走向“能不能完成复杂任务”</h3><div className="now-thinking"><div><span>20% · 发生了什么</span><p>Moonshot AI 发布 Kimi K3，并开放完整模型权重，重点覆盖长任务、编程与 Agent 场景。</p></div><div className="now-observation"><span>60% · 我的观察</span><p>我关注的不是参数规模，而是开放模型正在缩小与闭源前沿模型之间的产品能力差距。模型选择也开始从单纯比较效果，转向能力、成本、部署方式与数据边界的综合判断。</p></div><div><span>20% · 产品启发</span><p>AI 产品经理需要更早建立模型评测与切换机制，而不是把产品长期绑定在单一模型上。</p></div></div></article>
          <div className="now-side"><article className="now-card reveal visible"><div className="now-card-topline"><span>INTERACTION</span><time dateTime="2026-07">JUL 2026</time></div><h3>当语音不再只是输入方式，它会不会成为 AI 的默认界面？</h3><div className="now-thinking now-thinking--compact"><div><span>20% · 事实</span><p>OpenAI 发布新一代实时语音模型 GPT-Live。</p></div><div className="now-observation"><span>60% · 观察</span><p>语音体验的核心可能不再是“识别得准”，而是自然打断、上下文延续，以及知道什么时候应该停下来。</p></div><div><span>20% · 启发</span><p>语音产品需要一套不同于聊天框的交互与评测标准。</p></div></div></article><article className="now-card reveal visible"><div className="now-card-topline"><span>AGENTIC PRODUCTS</span><time dateTime="2026-05">MAY 2026</time></div><h3>从“给出答案”到“替用户完成任务”，产品边界正在重新划分</h3><div className="now-thinking now-thinking--compact"><div><span>20% · 事实</span><p>Google 在 I/O 2026 中将产品方向概括为 Agentic Gemini era。</p></div><div className="now-observation"><span>60% · 观察</span><p>Agent 的难点不只在工具调用，而在于怎样让用户理解它做了什么、为什么这样做，以及什么时候需要人来接管。</p></div><div><span>20% · 启发</span><p>AI 产品设计需要同时定义权限、过程反馈、失败恢复与人工确认机制。</p></div></div></article></div>
        </div>
      </section>

      <section className="contact section clean-section" id="contact"><div className="contact-heading reveal visible"><p className="section-mark">05 · CONTACT</p><h2>联系我</h2><p className="section-claim">期待与你一起，<br/>做些真正有价值的事。</p><p className="body-copy">我目前关注 AI 产品经理及 AI 应用产品相关机会，也欢迎关于产品实践与 AI 应用落地的交流。</p></div><div className="contact-list reveal visible"><a className="contact-email" href="mailto:yuan1177775@gmail.com"><span>关于联系</span><strong>yuan1177775@gmail.com</strong><i>↗</i></a><article><span>项目合作</span><strong>AI 产品设计、原型验证与应用落地。</strong></article><article><span>内容交流</span><strong>产品思考、行业观察与实践经验分享。</strong></article></div></section>
      <footer><a className="brand" href="#home"><strong>圆子</strong><span>SiYuan · Gao</span></a><p>AI PRODUCT MANAGER · PORTFOLIO 2026</p></footer>
    </main>
  );
}
