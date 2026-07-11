(() => {
  const currentScript = document.currentScript;
  const base = currentScript?.dataset.base || '';
  const pagePath = window.location.pathname;
  let currentContext = pagePath.includes('/projects/')
    ? '考研择校择专业 AI 顾问项目'
    : pagePath.includes('/articles/traditional-pm-to-ai-pm')
      ? '产品文章：传统 PM 转型 AI PM'
      : pagePath.includes('/articles/transformer-llm-principles')
        ? '学习笔记：大模型根本不懂你'
        : pagePath.includes('/articles/')
          ? '产品文章：AI 时代产品经理的四份工作'
          : '作品集首页';

  const quickQuestions = [
    '她最有代表性的项目是什么？',
    '她在项目中具体负责什么？',
    '她如何使用 RAG？',
    '为什么她适合 AI 产品经理岗位？'
  ];

  const launcher = document.createElement('button');
  launcher.className = 'portfolio-ai-launcher';
  launcher.type = 'button';
  launcher.setAttribute('aria-label', '打开圆子的 AI 作品集向导');
  launcher.innerHTML = '<span class="portfolio-ai-leaf"></span><span>问问我的 AI</span>';

  const backdrop = document.createElement('div');
  backdrop.className = 'portfolio-ai-backdrop';

  const panel = document.createElement('aside');
  panel.className = 'portfolio-ai-panel';
  panel.setAttribute('aria-label', '圆子的 AI 作品集向导');
  panel.innerHTML = `
    <header class="portfolio-ai-header">
      <span class="portfolio-ai-logo" aria-hidden="true">🌱</span>
      <div>
        <h2 class="portfolio-ai-title">圆子的 AI 作品集向导</h2>
        <p class="portfolio-ai-subtitle">基于我的项目、经历和产品思考回答问题</p>
      </div>
      <button class="portfolio-ai-close" type="button" aria-label="关闭并返回浏览">×</button>
    </header>
    <div class="portfolio-ai-context"></div>
    <div class="portfolio-ai-messages" aria-live="polite"></div>
    <form class="portfolio-ai-form">
      <input type="text" maxlength="160" placeholder="问项目、能力、RAG 或联系方式…" aria-label="输入问题">
      <button type="submit" aria-label="发送问题">→</button>
    </form>
  `;

  document.body.append(launcher, backdrop, panel);

  const closeButton = panel.querySelector('.portfolio-ai-close');
  const contextElement = panel.querySelector('.portfolio-ai-context');
  const messages = panel.querySelector('.portfolio-ai-messages');
  const form = panel.querySelector('.portfolio-ai-form');
  const input = form.querySelector('input');
  let initialized = false;

  const contextLabels = {
    home: '首页',
    about: '关于圆子',
    work: '精选项目',
    insights: '思考与实验',
    contact: '联系圆子'
  };

  const updateContext = () => {
    contextElement.textContent = `当前浏览：${currentContext}`;
  };

  if (!pagePath.includes('/projects/') && !pagePath.includes('/articles/')) {
    const sections = [...document.querySelectorAll('main section[id]')];
    const contextObserver = new IntersectionObserver(entries => {
      const visible = entries
        .filter(entry => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      currentContext = contextLabels[visible.target.id] || '作品集首页';
      updateContext();
    }, { threshold: [.3, .55] });
    sections.forEach(section => contextObserver.observe(section));
  }

  const addMessage = (role, text, link) => {
    const row = document.createElement('div');
    row.className = `portfolio-ai-message ${role}`;
    const bubble = document.createElement('div');
    bubble.className = 'portfolio-ai-bubble';
    bubble.textContent = text;
    if (link) {
      const anchor = document.createElement('a');
      anchor.className = 'portfolio-ai-answer-link';
      anchor.href = link.href;
      anchor.textContent = link.label;
      bubble.append(anchor);
    }
    row.append(bubble);
    messages.append(row);
    messages.scrollTop = messages.scrollHeight;
  };

  const addQuickQuestions = () => {
    const label = document.createElement('p');
    label.className = 'portfolio-ai-quick-label';
    label.textContent = '你可以这样问';
    const quick = document.createElement('div');
    quick.className = 'portfolio-ai-quick';
    quickQuestions.forEach(question => {
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = question;
      button.addEventListener('click', () => ask(question));
      quick.append(button);
    });
    messages.append(label, quick);
  };

  const initialize = () => {
    if (initialized) return;
    initialized = true;
    addMessage(
      'assistant',
      '你好，我是圆子的 AI 作品集向导。你可以问我关于她的项目经历、AI 产品能力和工作方法。'
    );
    addQuickQuestions();
  };

  const openPanel = () => {
    initialize();
    updateContext();
    panel.classList.add('open');
    backdrop.classList.add('open');
    document.body.classList.add('portfolio-ai-open');
    window.setTimeout(() => input.focus(), 360);
  };

  const closePanel = () => {
    panel.classList.remove('open');
    backdrop.classList.remove('open');
    document.body.classList.remove('portfolio-ai-open');
    launcher.focus();
  };

  const answerFor = rawQuestion => {
    const question = rawQuestion.toLowerCase();
    const projectLink = {
      href: `${base}projects/graduate-ai-advisor.html`,
      label: '查看完整项目案例 →'
    };

    if (/解决.*问题|项目问题|用户问题|痛点/.test(question)) {
      return {
        text: '结论：这个项目试图解决考研用户在择校择专业时信息分散、比较维度复杂，以及通用建议难以匹配个人背景的问题。\n\n项目证据：当前公开方案会结合用户背景与院校数据提供个性化建议，并将 RAG 与用户决策列为核心设计方向。\n\n说明：更具体的用户研究证据和效果指标尚未公开，我不会替圆子补写不存在的数据。',
        link: projectLink
      };
    }

    if (/代表|项目是什么|精选项目|考研/.test(question)) {
      return {
        text: '结论：目前最具代表性的公开案例是「考研择校择专业 AI 顾问」。\n\n项目证据：它围绕考研用户的真实决策难题，结合用户背景与院校数据提供个性化建议；页面公开的方案标签包括 AI 产品设计、RAG、用户决策与教育科技。\n\n说明：当前案例仍在补充项目时间和更详细的验证结果。',
        link: projectLink
      };
    }

    if (/负责|职责|角色|做了什么/.test(question)) {
      return {
        text: '结论：圆子的核心职责是把模糊的 AI 想法推进为可验证的产品方案。\n\n项目证据：作品集公开的信息包括从用户问题出发、拆解业务场景、识别关键需求、设计 AI 方案与原型，并关注验证迭代。考研 AI 顾问项目中，她的公开角色是 AI 产品经理；更细的团队边界仍待案例页补充。\n\n对应入口：你可以从项目页查看当前已公开的职责与方案信息。',
        link: projectLink
      };
    }

    if (/rag|检索|知识库/.test(question)) {
      return {
        text: '结论：RAG 在她的项目中被视为连接模型能力与可信业务数据的方案，而不是单纯增加一个聊天框。\n\n项目证据：考研 AI 顾问将 RAG 列为核心方案标签，目标是根据用户背景检索院校与专业信息，再辅助生成个性化决策建议。当前网站尚未公开切片策略、召回链路和评测数据，因此我不会编造这些细节。\n\n对应入口：项目案例页会作为后续方案细节的主要入口。',
        link: projectLink
      };
    }

    if (/适合|岗位|能力|优势/.test(question)) {
      return {
        text: '结论：她的匹配点在于同时关注用户问题、模型边界与业务价值。\n\n项目证据：作品集呈现了三项稳定的方法——先理解问题而不是直接接受需求；在技术可能性中判断值得做的方向；把方案推进到可以验证的产品结果。她也持续记录 Agent、评测和任务完成率等 AI 产品议题。\n\n对应入口：关于页面总结了她的工作原则，思考页面提供了文章证据。',
        link: { href: `${base}index.html#about`, label: '查看关于我 →' }
      };
    }

    if (/agent|智能体|工具调用/.test(question)) {
      return {
        text: '结论：她关注 Agent 的重点是任务能否安全完成，而不仅是模型能否生成答案。\n\n内容证据：在公开文章中，她把 Agent 产品经理的责任概括为任务拆解、工具调用、状态管理、权限确认、失败恢复与结果验收。\n\n对应入口：文章《从准确率到任务完成率》对这套观点有完整说明。',
        link: { href: `${base}articles/ai-pm-four-jobs.html`, label: '阅读相关产品文章 →' }
      };
    }

    if (/简历|联系方式|邮箱|联系|合作/.test(question)) {
      return {
        text: '结论：可以通过邮箱联系圆子，简历 PDF 目前仍在上传准备中。\n\n联系信息：yuan1177775@gmail.com\n\n合作方向：AI 产品设计、原型验证、应用落地，以及产品实践与行业观察交流。',
        link: { href: 'mailto:yuan1177775@gmail.com', label: '发送邮件 →' }
      };
    }

    if (/文章|思考|写作|学习/.test(question)) {
      return {
        text: '结论：她的公开思考分为产品文章、学习笔记和项目复盘三类，目前已发布多篇关于 AI 产品经理职责、模型原理与转型方法的内容。\n\n内容证据：产品文章包括《从准确率到任务完成率》和《传统 PM 转型 AI PM》；学习笔记包括《大模型根本不懂你：产品经理必须看懂的 Transformer 底层逻辑》。',
        link: { href: `${base}index.html#insights`, label: '查看思考与实验 →' }
      };
    }

    if (/导航|首页|哪里|页面/.test(question)) {
      return {
        text: `你当前正在浏览「${currentContext}」。作品集分为关于、精选项目、思考与实验、联系四个主要部分。`,
        link: { href: `${base}index.html`, label: '返回作品集首页 →' }
      };
    }

    return {
      text: '我只回答与圆子的作品集相关的问题，包括个人能力、项目作品、RAG / Agent 方案、产品思考、简历与联系方式。\n\n你可以试着问：“她最有代表性的项目是什么？”或“为什么她适合 AI 产品经理岗位？”',
      link: { href: `${base}index.html#work`, label: '浏览精选项目 →' }
    };
  };

  const ask = question => {
    const cleanQuestion = question.trim();
    if (!cleanQuestion) return;
    addMessage('user', cleanQuestion);
    input.value = '';
    const answer = answerFor(cleanQuestion);
    window.setTimeout(() => addMessage('assistant', answer.text, answer.link), 260);
  };

  launcher.addEventListener('click', openPanel);
  closeButton.addEventListener('click', closePanel);
  backdrop.addEventListener('click', closePanel);
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && panel.classList.contains('open')) closePanel();
  });
  form.addEventListener('submit', event => {
    event.preventDefault();
    ask(input.value);
  });

  document.querySelectorAll('[data-open-ai]').forEach(button => {
    button.addEventListener('click', () => {
      openPanel();
      const suggestedQuestion = button.dataset.aiQuestion;
      if (suggestedQuestion) window.setTimeout(() => ask(suggestedQuestion), 180);
    });
  });
})();
