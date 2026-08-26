import CombinedDemo from "./components/CombinedDemo";
import EssayDemo from "./components/EssayDemo";
import InsightsTabs from "./components/InsightsTabs";
import WatercolorWorld from "./components/WatercolorWorld";

const originalSite = "https://yvanzi.com";

const nowItems = [
  {
    id: "abundant-intelligence",
    category: "AI ECONOMICS",
    date: "JUL 31 · 2026",
    title: "当智能变得更便宜，AI 产品真正稀缺的会是什么？",
    summary: "OpenAI 将竞争重点从模型规模转向“可负担、可交付的有用智能”。",
    fact: "OpenAI 发布《Building abundant intelligence》，强调通过模型、系统与基础设施的全栈协同，让高级智能变得更强、更便宜，也覆盖更多真实工作。",
    observation: "当模型能力逐渐商品化，产品差异不再只来自“用了哪个模型”，而会更多来自任务闭环、上下文质量、工作流整合，以及能否用可控成本稳定交付结果。",
    insight: "AI 产品规划应该同时看任务完成率、单位任务成本和交付稳定性，避免只用模型榜单决定产品路线。",
    source: "https://openai.com/index/building-abundant-intelligence/",
    sourceLabel: "OpenAI · Building abundant intelligence",
    isNew: true,
  },
  {
    id: "claude-for-teachers",
    category: "VERTICAL AI",
    date: "JUL 14 · 2026",
    title: "Claude for Teachers：垂直 AI 的壁垒，正在从 Prompt 变成可信上下文",
    summary: "Anthropic 把课程标准、教学技能与教育工具连接到教师工作流中。",
    fact: "Anthropic 推出 Claude for Teachers，为美国 K–12 教师提供教学技能、课程标准连接器和教育工具生态，并计划在真实学区中评估使用效果。",
    observation: "它不是简单给通用聊天框套一个教育入口，而是把专业标准、可信资料、技能模板和现有工具一起放进工作流。垂直 AI 的价值正在从“会回答”转向“知道该依据什么完成任务”。",
    insight: "做行业 AI 时，应优先建设权威上下文、流程接口和效果评测，而不是把差异化押在一组不可复用的 Prompt 上。",
    source: "https://www.anthropic.com/news/claude-for-teachers",
    sourceLabel: "Anthropic · Introducing Claude for Teachers",
    isNew: true,
  },
  {
    id: "kimi-k3",
    category: "MODEL RELEASE",
    date: "JUL · 2026",
    title: "Kimi K3：开放模型的竞争，正在从“能不能用”走向“能不能完成复杂任务”",
    summary: "开放模型缩小能力差距后，模型选择会变成效果、成本与数据边界的综合判断。",
    fact: "Moonshot AI 发布 Kimi K3，并开放完整模型权重，重点覆盖长任务、编程与 Agent 场景。",
    observation: "我关注的不是参数规模，而是开放模型正在缩小与闭源前沿模型之间的产品能力差距。模型选择也开始从单纯比较效果，转向能力、成本、部署方式与数据边界的综合判断。",
    insight: "AI 产品经理需要更早建立模型评测与切换机制，而不是把产品长期绑定在单一模型上。",
  },
  {
    id: "voice-interface",
    category: "INTERACTION",
    date: "JUL · 2026",
    title: "当语音不再只是输入方式，它会不会成为 AI 的默认界面？",
    summary: "自然打断、上下文延续和适时沉默，可能比单纯识别准确更重要。",
    fact: "新一代实时语音模型继续降低延迟，并增强对话中的打断、情绪与上下文处理能力。",
    observation: "语音体验的核心可能不再是“识别得准”，而是自然打断、上下文延续，以及知道什么时候应该停下来。",
    insight: "语音产品需要一套不同于聊天框的交互与评测标准。",
  },
  {
    id: "agentic-products",
    category: "AGENTIC PRODUCTS",
    date: "MAY · 2026",
    title: "从“给出答案”到“替用户完成任务”，产品边界正在重新划分",
    summary: "Agent 产品的关键不只是工具调用，还包括权限、反馈、恢复和人工接管。",
    fact: "Google 在 I/O 2026 中集中展示了 Gemini 3.5、Gemini Spark 与多类可执行任务的 Agent 体验。",
    observation: "Agent 的难点不只在工具调用，而在于怎样让用户理解它做了什么、为什么这样做，以及什么时候需要人来接管。",
    insight: "AI 产品设计需要同时定义权限、过程反馈、失败恢复与人工确认机制。",
    source: "https://blog.google/innovation-and-ai/technology/developers-tools/google-io-2026-collection/",
    sourceLabel: "Google · I/O 2026 AI announcements",
  },
];

export default function Home() {
  return (
    <>
      <WatercolorWorld />
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
          <a className="project-card reveal visible" href="#school-project" aria-label="打开考研择校择专业 AI 顾问项目与 Demo">
            <div className="project-cover cover-education"><span className="cover-index">CASE 01</span><div className="cover-window"><i/><i/><i/><strong>AI ADVISOR</strong></div></div>
            <div className="project-content"><div className="project-topline"><span>AI 产品项目</span><time>2024 年 9 月</time></div><h3>考研择校择专业 AI 顾问</h3><p>用“规则引擎 + RAG + LLM”把顾问经验产品化，通过多轮追问，为管综 199 考生生成冲刺、稳妥、保底的个性化择校方案。</p><ul className="project-tags"><li>多轮对话</li><li>RAG</li><li>规则引擎</li><li>Bad Case</li></ul><div className="project-footer"><span>角色：AI 产品经理 · 管综199</span><strong>体验 Demo →</strong></div></div>
          </a>
          <a className="project-card reveal visible" href="#essay-project" aria-label="打开考研英语作文 AI 批改项目与 Demo">
            <div className="project-cover cover-knowledge"><span className="cover-index">CASE 02</span><div className="cover-orbit"><i/><i/><i/></div></div>
            <div className="project-content"><div className="project-topline"><span>AI 产品项目</span><time>已全量上线</time></div><h3>考研英语作文 AI 批改</h3><p>将人工批改重构为“OCR 识别 + 规则校验 + LLM 五维评分 + 人工兜底”，让大部分作文在几分钟内获得可追溯讲评。</p><ul className="project-tags"><li>OCR</li><li>LLM 评测</li><li>Rubric</li><li>人机协同</li></ul><div className="project-footer"><span>角色：AI 产品经理 · 独立负责</span><strong>体验 Demo →</strong></div></div>
          </a>
          <a className="project-card reveal visible" href={`${originalSite}/demos/nantu/`} target="_blank" rel="noreferrer" aria-label="打开馕途新疆深度旅行规划 Demo">
            <div className="project-cover cover-lab"><span className="cover-index">CASE 03</span><div className="cover-grid"><i/><i/><i/><i/></div></div>
            <div className="project-content"><div className="project-topline"><span>AI Demo</span><time>Vibe Coding</time></div><h3>馕途 · 新疆深度旅行规划</h3><p>一站式新疆旅行规划原型，涵盖路线推荐、景点攻略、美食住宿与季节玩法，用 vibe coding 快速验证 AI 旅行助手体验。</p><ul className="project-tags"><li>AI 原型</li><li>旅行规划</li><li>交互 Demo</li></ul><div className="project-footer"><span>角色：独立探索</span><strong>体验 Demo →</strong></div></div>
          </a>
        </div>
      </section>

      <section className="project-modal" id="school-project" role="dialog" aria-modal="true" aria-labelledby="school-project-title">
        <a className="project-modal-backdrop" href="#work" aria-label="关闭项目详情"/>
        <div className="project-modal-panel">
          <header className="project-modal-header">
            <div><p>CASE 01 · AI PRODUCT CASE</p><h2 id="school-project-title">考研择校择专业 AI 顾问</h2></div>
            <a className="project-modal-close" href="#work" aria-label="关闭项目详情">×</a>
          </header>
          <div className="project-modal-scroll">
            <section className="case-overview" aria-labelledby="school-overview-title">
              <div className="case-intro">
                <p className="case-kicker">项目介绍</p>
                <h3 id="school-overview-title">把顾问经验拆成一套可验证的择校决策系统</h3>
                <p>考研学生在择校阶段面对信息分散、数据难懂和决策焦虑；传统院校库只能提供静态筛选，人工顾问又难以规模化承接。项目以管综 199 为试点，通过多轮追问理解考生背景与偏好，生成冲刺、稳妥、保底三档个性化方案。</p>
              </div>
              <dl className="case-facts">
                <div><dt>我的角色</dt><dd>AI 产品经理 · 管综 199 试点落地</dd></div>
                <div><dt>业务目标</dt><dd>承接市场流量，提升预约转化，并减少顾问前置沟通</dd></div>
                <div><dt>验证方法</dt><dd>30+ 场顾问访谈、历史咨询案例与灰度数据</dd></div>
                <div><dt>数据说明</dt><dd>Demo 院校与分数均为 Mock 数据，不代表真实推荐</dd></div>
              </dl>
              <div className="case-system" aria-label="产品方案">
                <article><span>01 · RULES</span><h4>规则引擎</h4><p>先处理专业、工作年限、地区与学习方式等硬约束，保证候选池可解释、可控制。</p></article>
                <article><span>02 · RAG</span><h4>事实检索</h4><p>复试线、招生人数等事实数据只从知识库检索，避免模型自行编造。</p></article>
                <article><span>03 · LLM</span><h4>理解与解释</h4><p>识别模糊偏好、决定追问路径，并将已计算的结果组织为自然的推荐理由。</p></article>
              </div>
              <div className="case-results" aria-label="项目结果">
                <div><strong>42% → 65%</strong><span>多轮对话完成率</span></div>
                <div><strong>18% → 8%</strong><span>Bad Case 率</span></div>
                <div><strong>+15–20 pct</strong><span>使用工具用户的预约咨询率提升</span></div>
              </div>
            </section>
            <section className="prototype-section" aria-labelledby="school-prototype-title">
              <div className="prototype-heading"><div><p className="case-kicker">交互原型</p><h3 id="school-prototype-title">从分步追问到三档择校方案</h3></div><span>建议从“择校”开始体验 · 内含 PM 抽检视角</span></div>
              <div className="demo-stage"><CombinedDemo/></div>
            </section>
          </div>
        </div>
      </section>

      <section className="project-modal" id="essay-project" role="dialog" aria-modal="true" aria-labelledby="essay-project-title">
        <a className="project-modal-backdrop" href="#work" aria-label="关闭项目详情"/>
        <div className="project-modal-panel">
          <header className="project-modal-header">
            <div><p>CASE 02 · AI PRODUCT CASE</p><h2 id="essay-project-title">考研英语作文 AI 批改</h2></div>
            <a className="project-modal-close" href="#work" aria-label="关闭项目详情">×</a>
          </header>
          <div className="project-modal-scroll">
            <section className="case-overview" aria-labelledby="essay-overview-title">
              <div className="case-intro">
                <p className="case-kicker">项目介绍</p>
                <h3 id="essay-overview-title">把老师的“印象分”产品化，让批改从天级缩短到分钟级</h3>
                <p>考研英语作文原本依赖纯人工批改，学生通常需要等待 1–2 天，不同老师的评分尺度也存在差异。我独立推进从调研、流程与评分体系设计，到 AI 效果调优、上线和迭代的完整链路，让大部分作文自动获得可追溯讲评，高风险结果再交给老师复核。</p>
              </div>
              <dl className="case-facts">
                <div><dt>我的角色</dt><dd>AI 产品经理 · 全链路负责</dd></div>
                <div><dt>核心挑战</dt><dd>把模糊的人工判断拆成稳定、可执行的评分标准</dd></div>
                <div><dt>评测方式</dt><dd>300 篇固定评测集，按题型、分数段与维度切片分析</dd></div>
                <div><dt>上线范围</dt><dd>覆盖上千名学生的日常作文批改场景</dd></div>
              </dl>
              <div className="case-system" aria-label="产品方案">
                <article><span>01 · OCR</span><h4>识别与置信度</h4><p>将手写作文转成文本并标记低置信度字符，先让学生核对，避免“机器认错、学生背锅”。</p></article>
                <article><span>02 · RUBRIC</span><h4>五维评分</h4><p>将内容、逻辑、语言、词汇和格式拆成统一 Rubric，由模型引用原文给分与讲评。</p></article>
                <article><span>03 · HUMAN LOOP</span><h4>人工兜底</h4><p>规则校验总分与格式；分差超阈值或 OCR 置信度过低时自动转人工复核。</p></article>
              </div>
              <div className="case-results" aria-label="项目结果">
                <div><strong>1–2 天 → 分钟级</strong><span>大部分作文反馈时间</span></div>
                <div><strong>3 → 1.5 分</strong><span>AI 与教研平均绝对分差</span></div>
                <div><strong>约 30%</strong><span>低置信度或超阈值结果转人工</span></div>
              </div>
            </section>
            <section className="prototype-section" aria-labelledby="essay-prototype-title">
              <div className="prototype-heading"><div><p className="case-kicker">交互原型</p><h3 id="essay-prototype-title">从作文上传到五维讲评</h3></div><span>可切换作文样例，体验 OCR 核对、评分与人工复核</span></div>
              <div className="demo-stage"><EssayDemo/></div>
            </section>
          </div>
        </div>
      </section>

      <section className="insights section" id="insights">
        <div className="content-panel insights-panel"><div className="section-heading reveal visible"><p className="section-mark">03 · INSIGHTS &amp; EXPERIMENTS</p><h2>思考与实验</h2><p className="section-claim">正在生长的想法</p><p className="body-copy">有些内容已经成为产品，有些仍在验证。这里记录尚未完成的思考、实验与阶段性答案。</p></div>
          <InsightsTabs />
        </div>
      </section>

      <section className="now section clean-section" id="now">
        <div className="now-heading section-heading reveal visible"><p className="section-mark">04 · NOW / ON MY RADAR</p><h2>最近在想</h2><p className="section-claim">关注变化，也记录自己的判断。</p><p className="body-copy">近期关注的模型、产品与行业变化。点击标题后，再看完整的事实、观察与产品启发。</p><p className="now-updated">LAST UPDATED · AUGUST 16, 2026</p></div>
        <ol className="now-list reveal visible">
          {nowItems.map((item) => (
            <li key={item.id}>
              <a className="now-list-row" href={`#now-${item.id}`}>
                <span className="now-list-meta"><time>{item.date}</time><em>{item.category}</em></span>
                <span className="now-list-copy"><strong>{item.title}</strong><small>{item.summary}</small></span>
                {item.isNew && <b>NEW</b>}
                <i>→</i>
              </a>
            </li>
          ))}
        </ol>
      </section>

      {nowItems.map((item) => (
        <section className="project-modal now-detail-modal" id={`now-${item.id}`} role="dialog" aria-modal="true" aria-labelledby={`now-${item.id}-title`} key={item.id}>
          <a className="project-modal-backdrop" href="#now" aria-label="关闭最近在想详情"/>
          <article className="project-modal-panel now-detail-panel">
            <header className="project-modal-header">
              <div><p>{item.category} · {item.date}</p><h2 id={`now-${item.id}-title`}>{item.title}</h2></div>
              <a className="project-modal-close" href="#now" aria-label="关闭最近在想详情">×</a>
            </header>
            <div className="now-detail-scroll">
              <p className="now-detail-lead">{item.summary}</p>
              <div className="now-detail-thinking">
                <section><span>20% · 发生了什么</span><p>{item.fact}</p></section>
                <section className="now-detail-observation"><span>60% · 我的观察</span><p>{item.observation}</p></section>
                <section><span>20% · 产品启发</span><p>{item.insight}</p></section>
              </div>
              {item.source && <a className="now-detail-source" href={item.source} target="_blank" rel="noreferrer">查看原始来源 · {item.sourceLabel} ↗</a>}
            </div>
          </article>
        </section>
      ))}

      <section className="contact section clean-section" id="contact"><div className="contact-heading reveal visible"><p className="section-mark">05 · CONTACT</p><h2>联系我</h2><p className="section-claim">期待与你一起，<br/>做些真正有价值的事。</p><p className="body-copy">我目前关注 AI 产品经理及 AI 应用产品相关机会，也欢迎关于产品实践与 AI 应用落地的交流。</p></div><div className="contact-list reveal visible"><a className="contact-email" href="mailto:yuan1177775@gmail.com"><span>关于联系</span><strong>yuan1177775@gmail.com</strong><i>↗</i></a><article><span>项目合作</span><strong>AI 产品设计、原型验证与应用落地。</strong></article><article><span>内容交流</span><strong>产品思考、行业观察与实践经验分享。</strong></article></div></section>
      <footer><a className="brand" href="#home"><strong>圆子</strong><span>SiYuan · Gao</span></a><p>AI PRODUCT MANAGER · PORTFOLIO 2026</p></footer>
      </main>
    </>
  );
}
