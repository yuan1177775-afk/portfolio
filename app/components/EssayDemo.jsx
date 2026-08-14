"use client";

import React, { useState } from "react";
import { Home, PenLine, BookOpen, User, Check, HelpCircle } from "lucide-react";

/* ============================================================
   这一版demo默认不依赖真实调用Claude API，全部离线可跑通，
   目的是保证在任何环境下打开都能完整走完一遍流程、看到最终评分。
   如果你的环境支持调用 https://api.anthropic.com/v1/messages
   （比如在claude.ai的Artifact里），可以在页面顶部把"使用离线模拟评分"
   关掉，切换成真实调用；两条路径共用同一套规则引擎/转人工逻辑。
   ============================================================ */

/* ============================================================
   Mock 数据 —— 2 篇虚构考研英语作文题目 + 学生手写OCR识别结果
   ocrSegments 是"字符/词级置信度"的简化模拟：
   真实项目里置信度来自OCR模型解码时的概率分布，
   这里为了让你专注规则引擎和转人工逻辑本身，直接给定了固定值。
   humanBaseScore 是历史教研老师批改的基准分，用于计算AI-人工分差。
   ============================================================ */
const ESSAYS = [
  {
    id: 1,
    type: "小作文",
    title: "英语二·小作文·书信",
    prompt:
      "Directions: Suppose you are Li Ming. Write a letter to your friend John to invite him to attend an English speech contest at your school. You should write about 100 words.",
    fullScore: 10,
    humanBaseScore: 7,
    ocrSegments: [
      { text: "Dear John,\n\nI am writing to ", conf: 0.98 },
      { text: "invit", conf: 0.55 },
      { text: "e", conf: 0.97 },
      { text: " you to attend an English speech contest ", conf: 0.98 },
      { text: "hel", conf: 0.6 },
      { text: "d", conf: 0.96 },
      { text: " in our school this Friday afternoon. The contest will ", conf: 0.97 },
      { text: "begi", conf: 0.58 },
      { text: "n", conf: 0.97 },
      { text: " at 2 p.m. in the school hall, and many students will ", conf: 0.98 },
      { text: "participat", conf: 0.62 },
      { text: "e in it.\n\nI know you are interested in English speaking, so I think you will enjoy it very much. ", conf: 0.97 },
      { text: "Beside", conf: 0.65 },
      { text: "s, it will also be a good chance for you to practice your spoken English.\n\nI am looking forward to your ", conf: 0.98 },
      { text: "repl", conf: 0.59 },
      { text: "y.\n\nYours,\nLi Ming", conf: 0.98 },
    ],
    // 离线模拟评分：数值参考"11 数据&标注"材料里给的示例（内容8/逻辑7/语言6/词汇7/格式9）
    mockGrading: {
      dims: { content: 8, logic: 7, language: 6, vocab: 7, format: 9 },
      baseTotal: 7.5,
      evidences: [
        { dim: "内容完整性", quote: "invite him to attend an English speech contest", comment: "邀请信三要素（时间/地点/事由）齐全，任务完成度高。" },
        { dim: "逻辑连贯性", quote: "Besides, it will also be a good chance for you to practice", comment: "使用Besides做递进过渡，段落衔接自然。" },
        { dim: "语言准确性", quote: "invite / held / begin / participate / reply", comment: "这几处原文书写较潦草、识别置信度偏低，从宽处理未按拼写错误计分，建议核对原文书写是否与识别一致。" },
        { dim: "格式规范性", quote: "Dear John, ... Yours, Li Ming", comment: "书信称呼与落款格式完整规范。" },
      ],
      suggestions: [
        "结尾处可以补充一句具体的期待理由，比如提到希望John能一起讨论演讲话题，让邀请更有温度。",
        "第二段可以加一个具体细节（比如比赛的主题或形式），让内容更充实。",
      ],
    },
  },
  {
    id: 2,
    type: "大作文",
    title: "英语一·大作文·图画作文",
    prompt:
      "Directions: Write an essay based on the picture below. In your essay, you should describe the picture briefly, interpret its meaning, and give your comments. You should write about 200 words.",
    fullScore: 20,
    humanBaseScore: 12,
    ocrSegments: [
      { text: "As is vividly depicted in the picture, a young man is ", conf: 0.97 },
      { text: "starin", conf: 0.5 },
      { text: "g at his phone while walking, completely ", conf: 0.95 },
      { text: "ignorin", conf: 0.48 },
      { text: "g the beautiful scenery around him. This ", conf: 0.96 },
      { text: "phenomen", conf: 0.52 },
      { text: "on is quite common nowadays.\n\nThe picture ", conf: 0.97 },
      { text: "reflect", conf: 0.56 },
      { text: "s a widespread problem in modern society: people are becoming increasingly ", conf: 0.96 },
      { text: "dependen", conf: 0.5 },
      { text: "t on their phones, to the point that they neglect what is happening around them. On the one hand, smartphones ", conf: 0.97 },
      { text: "provid", conf: 0.6 },
      { text: "e us with convenience and entertainment. On the other hand, ", conf: 0.97 },
      { text: "excessiv", conf: 0.49 },
      { text: "e use of phones may cause us to miss precious moments in real life and even ", conf: 0.95 },
      { text: "damag", conf: 0.53 },
      { text: "e our relationships with people around us.\n\nIn my opinion, we should try to strike a balance between the digital world and real life, and pay more attention to the people and scenery around us.", conf: 0.96 },
    ],
    mockGrading: {
      dims: { content: 7, logic: 6, language: 5, vocab: 6, format: 7 },
      baseTotal: 12.5,
      evidences: [
        { dim: "内容完整性", quote: "a young man is staring at his phone while walking, completely ignoring the beautiful scenery", comment: "图画描述+现象解读+评论三部分齐全，但评论部分展开略显单薄。" },
        { dim: "逻辑连贯性", quote: "On the one hand ... On the other hand", comment: "正反两面论证结构清晰，但两段之间缺少总结性过渡句。" },
        { dim: "语言准确性", quote: "staring / ignoring / phenomenon / reflects / dependent / provide / excessive / damage", comment: "这几处原文书写潦草、识别置信度偏低，从宽处理未按拼写错误计分，建议核对原文书写是否与识别一致。" },
        { dim: "词汇丰富度", quote: "widespread problem / strike a balance", comment: "用词有一定高级表达，但重复使用了phone/phones，可以替换为smartphone/device增加多样性。" },
      ],
      suggestions: [
        "在'On the one hand'和'On the other hand'两段之间加一句过渡总结，让正反论证更连贯。",
        "结尾评论部分可以补充一个具体的行动建议（比如设定'无手机时间'），让文章更有说服力。",
        "适当替换重复使用的phone/phones，增加词汇多样性。",
      ],
    },
  },
];

/* 五维Rubric权重（历史case反推校准出来的最终版，示意值） */
const WEIGHTS = { content: 0.25, language: 0.25, logic: 0.2, vocab: 0.15, format: 0.15 };
const DIM_LABELS = {
  content: "内容完整性",
  logic: "逻辑连贯性",
  language: "语言准确性",
  vocab: "词汇丰富度",
  format: "格式规范性",
};

/* 阈值设定（demo示意值，非真实项目数字）
   为了让你能在demo里亲手体验到"确认后置信度依然偏低会不会转人工"这个场景，
   这里把OCR转人工阈值调得比较敏感（5%），方便交互演示；
   真实项目里这类阈值是在评测集上模拟不同切点反推出来的，参考"07一致性校验"文档。 */
const THRESHOLDS = {
  scoreDiffRatio: 0.2, // AI分与人工基准分差 超过满分的20% → 触发
  lowConfRatio: 0.05, // "确认之后仍然存疑"的字符占比 超过5% → 触发转人工（demo演示值）
  confThreshold: 0.75, // 单个片段置信度低于此值视为"低置信度"，需要学生核对
  needConfirmRatio: 0.06, // 识别完成时，低置信度占比超过6%才弹出"核对确认"这一步
};

/* ============================================================
   OCR层 —— 置信度统计
   ============================================================ */
function analyzeConfidence(segments) {
  const totalLen = segments.reduce((s, seg) => s + seg.text.length, 0);
  const lowSegs = segments.filter((s) => s.conf < THRESHOLDS.confThreshold);
  const lowLen = lowSegs.reduce((s, seg) => s + seg.text.length, 0);
  return {
    lowConfRatio: totalLen ? lowLen / totalLen : 0,
    lowSegCount: lowSegs.length,
    needConfirm: totalLen ? lowLen / totalLen > THRESHOLDS.needConfirmRatio : false,
  };
}

/* 把学生的"确认无误 / 我也认不清"操作，转换成"确认后的有效置信度"：
   - 学生选"确认无误" → 这一段不再算低置信度（等同于人工核实过的确定文本）
   - 学生选"我也认不清" → 保留低置信度状态，继续往下走（从宽处理 or 转人工）
   - 原本就不是低置信度的片段 → 不受影响 */
function applyResolutions(segments, resolutions) {
  return segments.map((seg, i) => {
    if (seg.conf >= THRESHOLDS.confThreshold) return seg;
    const r = resolutions[i];
    if (r === "confirmed") return { ...seg, conf: 1, resolvedAs: "confirmed" };
    if (r === "unclear") return { ...seg, resolvedAs: "unclear" };
    return seg; // 尚未处理
  });
}

function ocrTextForPrompt(segments) {
  return segments
    .map((seg) => {
      if (seg.conf >= THRESHOLDS.confThreshold) return seg.text;
      const tag =
        seg.resolvedAs === "unclear"
          ? `低置信度${Math.round(seg.conf * 100)}%，学生本人核对后也无法确认，请从宽处理，不得当拼写错误硬扣分`
          : `低置信度${Math.round(seg.conf * 100)}%，请从宽处理，不得当拼写错误硬扣分`;
      return `【${seg.text}｜${tag}】`;
    })
    .join("");
}

/* ============================================================
   规则引擎 —— 后置校验（LLM打完分之后检查形式是否合规）
   四项：算术一致性 / 格式合规 / 边界合法 / 题型约束
   ============================================================ */
function ruleEngineValidate(llmOutput, essay) {
  const errors = [];
  if (!llmOutput || !llmOutput.dims || typeof llmOutput.total !== "number") {
    errors.push({ type: "格式错", detail: "字段缺失，无法解析五维分数或总分" });
    return { pass: false, errors, expectedTotal: null };
  }
  const dims = llmOutput.dims;
  const dimKeys = Object.keys(WEIGHTS);
  for (const k of dimKeys) {
    if (typeof dims[k] !== "number") errors.push({ type: "格式错", detail: `缺少维度分：${DIM_LABELS[k]}` });
    else if (dims[k] < 0 || dims[k] > 10) errors.push({ type: "边界错", detail: `${DIM_LABELS[k]} 超出0-10区间：${dims[k]}` });
  }
  const weightedSum = dimKeys.reduce((sum, k) => sum + (dims[k] || 0) * WEIGHTS[k], 0); // 0-10量纲
  const expectedTotal = Math.round(((essay.fullScore * weightedSum) / 10) * 2) / 2; // 换算成满分制，按0.5分取整
  if (Math.abs(expectedTotal - llmOutput.total) > 0.6) {
    errors.push({
      type: "算术错",
      detail: `各维加权后应为${expectedTotal}分，模型报的总分是${llmOutput.total}分，各维之和≠总分`,
    });
  }
  if (llmOutput.total < 0 || llmOutput.total > essay.fullScore) {
    errors.push({ type: "边界错", detail: `总分越界：${llmOutput.total} / 满分${essay.fullScore}` });
  }
  return { pass: errors.length === 0, errors, expectedTotal };
}

/* ============================================================
   一致性校验 & 转人工 —— 双阈值，满足任一即触发
   ============================================================ */
function decideHumanReview(llmOutput, essay, confStats) {
  const reasons = [];
  const scoreDiff = llmOutput ? Math.abs(llmOutput.total - essay.humanBaseScore) : Infinity;
  const scoreDiffTrigger = scoreDiff > essay.fullScore * THRESHOLDS.scoreDiffRatio;
  const ocrTrigger = confStats.lowConfRatio > THRESHOLDS.lowConfRatio;
  if (scoreDiffTrigger)
    reasons.push(`AI分与教研基准分差${scoreDiff.toFixed(1)}分，超过阈值${(essay.fullScore * THRESHOLDS.scoreDiffRatio).toFixed(1)}分`);
  if (ocrTrigger)
    reasons.push(`核对后仍存疑的字符占比${(confStats.lowConfRatio * 100).toFixed(1)}%，超过阈值${(THRESHOLDS.lowConfRatio * 100).toFixed(0)}%`);
  return { needHuman: scoreDiffTrigger || ocrTrigger, reasons, scoreDiffTrigger, ocrTrigger, scoreDiff };
}

/* ============================================================
   离线模拟评分 —— 不依赖网络请求，保证demo在任何环境都能跑通
   会根据"确认后仍存疑"的比例，对语言维度做很轻微的扰动，
   模拟"输入本身还有一点不确定性"这件事本身也会影响AI判断力，
   但幅度克制（±0.5分以内），因为这正是"从宽处理"要守住的边界——
   不能因为有疑问就大幅扣分。
   ============================================================ */
function generateMockGrading(essay, effectiveSegments) {
  const stats = analyzeConfidence(effectiveSegments);
  const g = essay.mockGrading;
  const dims = { ...g.dims };
  let total = g.baseTotal;

  if (stats.lowConfRatio > THRESHOLDS.needConfirmRatio) {
    // 仍有较多存疑内容，语言维度打分保守一点点，但不做惩罚性大幅扣分
    dims.language = Math.max(0, dims.language - 0.5);
    total = Math.round((total - 0.3) * 2) / 2;
  }

  const evidences = [...g.evidences];
  if (stats.lowSegCount > 0) {
    evidences.push({
      dim: "OCR识别说明",
      quote: effectiveSegments
        .filter((s) => s.conf < THRESHOLDS.confThreshold)
        .map((s) => s.text)
        .join(" / "),
      comment: "以上片段识别置信度较低，本次评分已按从宽原则处理，未作为语言错误扣分，仅供你核对原文书写是否清晰。",
    });
  }

  return { dims, total, evidences, suggestions: g.suggestions };
}

/* ============================================================
   Prompt 组装 —— 真实调用API时使用（可选路径）
   ============================================================ */
function buildGradingPrompt(essay, effectiveSegments) {
  const dimList = Object.keys(WEIGHTS)
    .map((k) => `${DIM_LABELS[k]}（权重${WEIGHTS[k] * 100}%）`)
    .join("、");
  const annotatedText = ocrTextForPrompt(effectiveSegments);

  return `你是考研英语作文批改助手，按五维Rubric给出分项评分和讲评，你的判断只能基于下方提供的OCR识别文本，不能编造文本中不存在的内容。

【角色与任务】
按考研英语大纲的五维标准评分，并给出可执行的修改建议。

【题型信息】
题型：${essay.type}　满分：${essay.fullScore}分（每个维度按0-10分制评分，最终按权重换算成总分）

【五维Rubric与权重】
${dimList}

【强制约束】
1. 每处扣分必须引用原文具体位置，不能空泛描述
2. 文本中标注了"【xxx｜低置信度...】"的位置，绝不能当作拼写错误扣分
3. 不得编造OCR文本中不存在的句子或错误
4. 修改建议必须可执行
5. 只输出JSON，不要输出任何JSON之外的文字

【题目要求】
${essay.prompt}

【学生作文OCR识别文本】
${annotatedText}

请严格按下面的JSON结构输出：
{
  "dims": { "content": 0-10, "logic": 0-10, "language": 0-10, "vocab": 0-10, "format": 0-10 },
  "total": 0-${essay.fullScore},
  "evidences": [ { "dim": "维度中文名", "quote": "引用的原文片段", "comment": "问题说明" } ],
  "suggestions": [ "可执行的修改建议1", "可执行的修改建议2" ]
}`;
}

function parseGradingResponse(rawText) {
  let cleaned = rawText.replace(/```json|```/g, "").trim();
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start === -1 || end === -1 || end < start) {
    throw new Error("响应中未找到完整的JSON结构（可能被截断）");
  }
  cleaned = cleaned.slice(start, end + 1);
  const parsed = JSON.parse(cleaned);
  if (parsed.dims) Object.keys(parsed.dims).forEach((k) => (parsed.dims[k] = Number(parsed.dims[k])));
  parsed.total = Number(parsed.total);
  return parsed;
}

/* ============================================================ UI ============================================================ */

const BADCASE_STYLE = {
  "OCR/公平错": { bg: "bg-amber-100", text: "text-amber-700" },
  规则错: { bg: "bg-rose-100", text: "text-rose-700" },
  Rubric错: { bg: "bg-orange-100", text: "text-orange-700" },
  表达错: { bg: "bg-violet-100", text: "text-violet-700" },
  没问题: { bg: "bg-emerald-100", text: "text-emerald-700" },
};

const TABS = [
  { key: "home", label: "首页", icon: Home },
  { key: "grading", label: "批改", icon: PenLine },
  { key: "study", label: "学习", icon: BookOpen },
  { key: "me", label: "我的", icon: User },
];

/* 首页/学习/我的是纯视觉占位，不接任何真实逻辑——不在考研作文批改项目的真实经历范围内，
   刻意做成静态页面，避免被追问细节时露怯。 */
function PlaceholderScreen({ title, desc, icon: Icon }) {
  return (
    <div className="p-6">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white px-6 py-20 text-center">
          <Icon className="mb-3 h-8 w-8 text-slate-300" />
          <div className="text-sm font-medium text-slate-500">{title}</div>
          <div className="mt-1 text-xs text-slate-400">{desc}</div>
          <div className="mt-6 text-[11px] text-slate-300">占位页面，非本次demo重点 · 完整功能见"批改"</div>
        </div>
      </div>
    </div>
  );
}

function OCRText({ segments, resolutions }) {
  return (
    <div className="whitespace-pre-wrap rounded-md bg-slate-50 p-3 text-xs leading-relaxed text-slate-700">
      {segments.map((seg, i) => {
        if (seg.conf >= THRESHOLDS.confThreshold) return <span key={i}>{seg.text}</span>;
        const r = resolutions ? resolutions[i] : null;
        const cls = r === "confirmed" ? "bg-emerald-200/70" : r === "unclear" ? "bg-rose-200/70" : "bg-amber-200/70";
        return (
          <span key={i} className={`rounded px-0.5 ${cls}`} title={`原始置信度 ${Math.round(seg.conf * 100)}%`}>
            {seg.text}
          </span>
        );
      })}
    </div>
  );
}

function DimBar({ label, score, weight }) {
  const pct = (Math.max(0, score) / 10) * 100;
  return (
    <div className="mb-1.5">
      <div className="mb-0.5 flex items-center justify-between text-[11px] text-slate-500">
        <span>
          {label} <span className="text-slate-300">（权重{weight * 100}%）</span>
        </span>
        <span className="font-mono text-slate-600">{score}/10</span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-slate-100">
        <div className="h-1.5 rounded-full bg-teal-500" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState("grading");
  const [pmMode, setPmMode] = useState(true);
  const [showDebug, setShowDebug] = useState(false);
  const [useMock, setUseMock] = useState(true); // 默认离线模拟，保证demo一定能跑通

  const [essayId, setEssayId] = useState(ESSAYS[0].id);
  const essay = ESSAYS.find((e) => e.id === essayId);

  /* 流水线阶段：idle → uploaded → ocr_processing → ocr_confirm(可选，逐条确认) → ocr_done → grading → result */
  const [stage, setStage] = useState("idle");
  const [resolutions, setResolutions] = useState({}); // { segIndex: 'confirmed' | 'unclear' }
  const [effectiveSegments, setEffectiveSegments] = useState(null);
  const [llmOutput, setLlmOutput] = useState(null);
  const [finalOutput, setFinalOutput] = useState(null);
  const [ruleResult, setRuleResult] = useState(null);
  const [reviewDecision, setReviewDecision] = useState(null);
  const [retried, setRetried] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [rawResponseForDebug, setRawResponseForDebug] = useState(null);
  const [humanReviewed, setHumanReviewed] = useState(false);
  const [badCase, setBadCase] = useState(null);
  const [studentFeedback, setStudentFeedback] = useState(null);

  function resetPipeline(nextEssayId) {
    setEssayId(nextEssayId);
    setStage("idle");
    setResolutions({});
    setEffectiveSegments(null);
    setLlmOutput(null);
    setFinalOutput(null);
    setRuleResult(null);
    setReviewDecision(null);
    setRetried(false);
    setErrorMsg(null);
    setRawResponseForDebug(null);
    setHumanReviewed(false);
    setBadCase(null);
    setStudentFeedback(null);
  }

  function handleUpload() {
    setStage("ocr_processing");
    setTimeout(() => {
      const stats = analyzeConfidence(essay.ocrSegments);
      if (stats.needConfirm) {
        setStage("ocr_confirm");
      } else {
        setEffectiveSegments(essay.ocrSegments);
        setStage("ocr_done");
      }
    }, 700);
  }

  function resolveSegment(index, choice) {
    setResolutions((prev) => ({ ...prev, [index]: choice }));
  }

  function resolveAll(choice) {
    const next = {};
    essay.ocrSegments.forEach((seg, i) => {
      if (seg.conf < THRESHOLDS.confThreshold) next[i] = choice;
    });
    setResolutions(next);
  }

  const lowSegIndexes = essay.ocrSegments
    .map((seg, i) => (seg.conf < THRESHOLDS.confThreshold ? i : null))
    .filter((i) => i !== null);
  const allResolved = lowSegIndexes.every((i) => resolutions[i]);

  function finishConfirm() {
    const eff = applyResolutions(essay.ocrSegments, resolutions);
    setEffectiveSegments(eff);
    setStage("ocr_done");
  }

  async function runGrading(isRetry) {
    setStage("grading");
    setErrorMsg(null);
    const segs = effectiveSegments || essay.ocrSegments;
    if (!isRetry) {
      setLlmOutput(null);
      setFinalOutput(null);
      setRuleResult(null);
      setReviewDecision(null);
      setRawResponseForDebug(null);
      setRetried(false);
      setHumanReviewed(false);
    }

    const finishWithOutput = (parsed) => {
      const rule = ruleEngineValidate(parsed, essay);
      if (!rule.pass && !isRetry) {
        setRetried(true);
        setTimeout(() => runGrading(true), 400);
        return;
      }
      setLlmOutput(parsed);
      setRuleResult(rule);
      if (!rule.pass) {
        setReviewDecision({ needHuman: true, reasons: ["规则校验多次未通过（算术/格式/边界），AI结果不可靠"], scoreDiffTrigger: false, ocrTrigger: false });
        setStage("result");
        return;
      }
      const stats = analyzeConfidence(segs);
      const decision = decideHumanReview(parsed, essay, stats);
      setReviewDecision(decision);
      if (!decision.needHuman) setFinalOutput({ ...parsed, source: "ai" });
      setStage("result");
    };

    if (useMock) {
      // 离线模拟：加一点延迟营造"批改中"的感觉，但不依赖任何网络请求
      setTimeout(() => {
        const parsed = generateMockGrading(essay, segs);
        finishWithOutput(parsed);
      }, 900);
      return;
    }

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1800,
          messages: [{ role: "user", content: buildGradingPrompt(essay, segs) }],
        }),
      });
      const data = await response.json();
      const rawText = (data.content || []).map((b) => b.text || "").join("").trim();
      setRawResponseForDebug(rawText);
      const parsed = parseGradingResponse(rawText);
      finishWithOutput(parsed);
    } catch (err) {
      setErrorMsg(`批改结果解析失败：${err.message || "未知错误"}（可以在页面顶部切换回"离线模拟评分"保证demo可用）`);
      setStage("ocr_done");
    }
  }

  function simulateHumanReview() {
    setHumanReviewed(true);
    if (!llmOutput) return;
    const diff = essay.humanBaseScore - llmOutput.total;
    const delta = Math.sign(diff) * Math.min(Math.abs(diff), 1);
    const adjustedTotal = Math.round((llmOutput.total + delta) * 2) / 2;
    setFinalOutput({
      ...llmOutput,
      total: adjustedTotal,
      source: "human",
      teacherNote:
        delta === 0
          ? "老师复核后认为AI评分合理，确认维持原分数。"
          : `老师复核后，将总分由${llmOutput.total}分微调为${adjustedTotal}分，其余分维讲评和修改建议予以保留。`,
    });
  }

  const confStatsForDisplay = effectiveSegments ? analyzeConfidence(effectiveSegments) : null;

  return (
    <div className="min-h-[720px] bg-slate-50 font-sans text-slate-800">
      {activeTab === "grading" && (
        <div className="p-6">
          <div className="mx-auto max-w-5xl">
            <header className="mb-6">
              <div className="text-xs font-medium uppercase tracking-wide text-teal-600">单次流水线 Demo</div>
              <h1 className="text-2xl font-semibold text-slate-900">考研英语作文AI批改</h1>
              <p className="mt-1 text-sm text-slate-500">
                上传（模拟拍照）→ OCR识别 → 低置信度逐条核对 → 规则校验+LLM五维评分 → 结果展示 / 转人工复核（以下均为demo虚构数据）
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <div className="inline-flex rounded-lg border border-slate-200 bg-white p-1 text-xs">
                  <button
                    onClick={() => setPmMode(false)}
                    className={`rounded-md px-3 py-1 font-medium ${!pmMode ? "bg-teal-600 text-white" : "text-slate-500"}`}
                  >
                    学生视角
                  </button>
                  <button
                    onClick={() => setPmMode(true)}
                    className={`rounded-md px-3 py-1 font-medium ${pmMode ? "bg-teal-600 text-white" : "text-slate-500"}`}
                  >
                    PM抽检视角
                  </button>
                </div>
                <label className="flex items-center gap-1.5 text-xs text-slate-500">
                  <input type="checkbox" checked={useMock} onChange={(e) => setUseMock(e.target.checked)} />
                  离线模拟评分（保证demo一定能跑通；取消勾选则尝试调用真实Claude API）
                </label>
              </div>
            </header>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-[380px_1fr]">
              {/* 左侧：题目选择 + 流水线状态 */}
              <div className="flex h-fit flex-col rounded-xl border border-slate-200 bg-white p-4">
                <div className="mb-3 text-sm font-medium text-slate-700">选择一篇demo作文</div>
                <div className="mb-4 space-y-2">
                  {ESSAYS.map((e) => (
                    <button
                      key={e.id}
                      onClick={() => resetPipeline(e.id)}
                      className={`block w-full rounded-lg border p-2 text-left text-xs ${
                        essayId === e.id ? "border-teal-300 bg-teal-50 text-teal-700" : "border-slate-200 bg-white text-slate-500 hover:border-slate-300"
                      }`}
                    >
                      <div className="font-medium">{e.title}</div>
                      <div className="mt-0.5 text-[11px] text-slate-400">满分{e.fullScore}分 · 历史人工基准分{e.humanBaseScore}分</div>
                    </button>
                  ))}
                </div>

                <div className="mb-3 rounded-md bg-slate-50 p-2 text-[11px] leading-relaxed text-slate-500">
                  <span className="font-medium text-slate-600">题目：</span>
                  {essay.prompt}
                </div>

                {stage === "idle" && (
                  <button onClick={handleUpload} className="rounded-md bg-teal-600 py-2 text-sm font-medium text-white hover:bg-teal-700">
                    点击模拟拍照上传
                  </button>
                )}

                {stage === "ocr_processing" && (
                  <div className="rounded-md border border-dashed border-slate-300 bg-slate-50 p-3 text-center text-xs text-slate-400">识别中...</div>
                )}

                {stage === "ocr_confirm" && (
                  <div className="space-y-2">
                    <div className="text-[11px] font-medium text-amber-600">
                      低置信度字符较多（{(analyzeConfidence(essay.ocrSegments).lowConfRatio * 100).toFixed(1)}%），请逐条核对
                    </div>
                    <OCRText segments={essay.ocrSegments} resolutions={resolutions} />
                    <div className="flex gap-2 pt-1">
                      <button onClick={() => resolveAll("confirmed")} className="flex-1 rounded-md border border-emerald-200 bg-emerald-50 py-1 text-[11px] font-medium text-emerald-700 hover:bg-emerald-100">
                        全部标记"确认无误"
                      </button>
                      <button onClick={() => resolveAll("unclear")} className="flex-1 rounded-md border border-rose-200 bg-rose-50 py-1 text-[11px] font-medium text-rose-700 hover:bg-rose-100">
                        全部标记"我也认不清"
                      </button>
                    </div>
                    <div className="space-y-1.5 pt-1">
                      {lowSegIndexes.map((i) => {
                        const seg = essay.ocrSegments[i];
                        const r = resolutions[i];
                        return (
                          <div key={i} className="flex items-center justify-between gap-2 rounded-md bg-slate-50 p-1.5">
                            <span className="font-mono text-xs text-slate-600">"{seg.text}"</span>
                            <div className="flex shrink-0 gap-1">
                              <button
                                onClick={() => resolveSegment(i, "confirmed")}
                                className={`rounded p-1 ${r === "confirmed" ? "bg-emerald-500 text-white" : "bg-white text-emerald-600 border border-emerald-200"}`}
                                title="确认无误"
                              >
                                <Check className="h-3 w-3" />
                              </button>
                              <button
                                onClick={() => resolveSegment(i, "unclear")}
                                className={`rounded p-1 ${r === "unclear" ? "bg-rose-500 text-white" : "bg-white text-rose-600 border border-rose-200"}`}
                                title="我也认不清"
                              >
                                <HelpCircle className="h-3 w-3" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <button
                      onClick={finishConfirm}
                      disabled={!allResolved}
                      className={`mt-2 w-full rounded-md py-1.5 text-xs font-medium text-white ${
                        allResolved ? "bg-amber-600 hover:bg-amber-700" : "cursor-not-allowed bg-slate-300"
                      }`}
                    >
                      {allResolved ? "核对完成，开始批改" : `还有${lowSegIndexes.filter((i) => !resolutions[i]).length}处未核对`}
                    </button>
                  </div>
                )}

                {(stage === "ocr_done" || stage === "grading" || stage === "result") && effectiveSegments && (
                  <div className="space-y-2">
                    <div className="text-[11px] font-medium text-slate-500">OCR识别结果（绿色=已确认无误，红色=学生也认不清，黄色=未核对过）</div>
                    <OCRText segments={effectiveSegments} resolutions={resolutions} />
                    {confStatsForDisplay && (
                      <div className="text-[11px] text-slate-400">核对后仍存疑字符占比 {(confStatsForDisplay.lowConfRatio * 100).toFixed(1)}%</div>
                    )}
                  </div>
                )}

                {stage === "ocr_done" && (
                  <button onClick={() => runGrading(false)} className="mt-2 rounded-md bg-teal-600 py-2 text-sm font-medium text-white hover:bg-teal-700">
                    开始AI批改
                  </button>
                )}

                {stage === "grading" && (
                  <div className="mt-2 rounded-md border border-dashed border-slate-300 bg-slate-50 p-3 text-center text-xs text-slate-400">
                    AI批改中，预计几分钟内{retried ? "（规则校验未通过，正在自动重试）" : "..."}
                  </div>
                )}

                {errorMsg && (
                  <div className="mt-2 rounded-md border border-rose-200 bg-rose-50 p-2 text-xs text-rose-600">
                    {errorMsg}
                    <button onClick={() => runGrading(false)} className="ml-2 underline hover:text-rose-700">
                      重试
                    </button>
                  </div>
                )}
                {errorMsg && pmMode && rawResponseForDebug && (
                  <details className="mt-1 rounded-md border border-slate-200 bg-slate-50 p-2 text-[11px] text-slate-500">
                    <summary className="cursor-pointer font-medium text-slate-600">模型原始返回内容（调试用）</summary>
                    <pre className="mt-1 max-h-40 overflow-auto whitespace-pre-wrap">{rawResponseForDebug}</pre>
                  </details>
                )}

                {stage === "result" && (
                  <button onClick={() => runGrading(false)} className="mt-2 rounded-md border border-slate-300 bg-white py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50">
                    重新生成一次（验证稳定性）
                  </button>
                )}
              </div>

              {/* 右侧：结果区 */}
              <div>
                {stage !== "result" && (
                  <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-400">
                    左侧完成上传、核对、批改后，这里会展示五维评分结果
                  </div>
                )}

                {stage === "result" && reviewDecision?.needHuman && !finalOutput && ruleResult?.pass && (
                  <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                    <div className="text-sm font-medium text-amber-700">老师复核中，完成后通知</div>
                    <div className="mt-1 text-xs text-amber-600">触发原因：{reviewDecision.reasons.join("；")}</div>
                    {llmOutput && (
                      <div className="mt-3 rounded-md bg-white p-2 text-xs text-slate-500">
                        AI初稿总分 {llmOutput.total} / {essay.fullScore} 分，老师会在此基础上确认/微调，不是从零批改
                      </div>
                    )}
                    <button onClick={simulateHumanReview} className="mt-3 rounded-md bg-amber-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-amber-700">
                      模拟老师复核完成
                    </button>
                  </div>
                )}

                {stage === "result" && finalOutput && ruleResult?.pass && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-semibold text-slate-800">最终评分结果</div>
                      {finalOutput.source === "human" ? (
                        <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-medium text-amber-700">老师复核确认</span>
                      ) : (
                        <span className="rounded-full bg-teal-100 px-2 py-0.5 text-[11px] font-medium text-teal-700">AI直接出分</span>
                      )}
                    </div>

                    {finalOutput.source === "human" && (
                      <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700">{finalOutput.teacherNote}</div>
                    )}

                    <div className="rounded-xl border border-slate-200 bg-white p-4">
                      <div className="flex items-baseline justify-between">
                        <div className="text-sm font-medium text-slate-700">总分</div>
                        <div className="text-2xl font-semibold text-teal-600">
                          {finalOutput.total} <span className="text-sm text-slate-400">/ {essay.fullScore}</span>
                        </div>
                      </div>
                      {finalOutput.source === "human" && finalOutput.total !== llmOutput.total && (
                        <div className="mt-1 text-right text-[11px] text-slate-400">AI初稿曾给出 {llmOutput.total} 分</div>
                      )}
                      <div className="mt-3">
                        {Object.keys(WEIGHTS).map((k) => (
                          <DimBar key={k} label={DIM_LABELS[k]} score={finalOutput.dims[k]} weight={WEIGHTS[k]} />
                        ))}
                      </div>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-white p-4">
                      <div className="mb-2 text-sm font-medium text-slate-700">分维度讲评（含原文引用）</div>
                      <div className="space-y-2">
                        {(finalOutput.evidences || []).map((ev, i) => (
                          <div key={i} className="rounded-md bg-slate-50 p-2 text-xs">
                            <span className="mr-1 rounded bg-teal-100 px-1.5 py-0.5 font-medium text-teal-700">{ev.dim}</span>
                            <span className="text-slate-500">引用：</span>
                            <span className="text-slate-700">"{ev.quote}"</span>
                            <div className="mt-1 text-slate-600">{ev.comment}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-white p-4">
                      <div className="mb-2 text-sm font-medium text-slate-700">修改建议</div>
                      <ul className="list-disc space-y-1 pl-4 text-xs text-slate-600">
                        {(finalOutput.suggestions || []).map((s, i) => (
                          <li key={i}>{s}</li>
                        ))}
                      </ul>
                    </div>

                    {!pmMode && (
                      <div className="flex items-center gap-3 text-xs text-slate-400">
                        <button
                          onClick={() => setStudentFeedback((v) => (v === "up" ? null : "up"))}
                          className={`flex items-center gap-1 rounded-md px-1.5 py-0.5 ${studentFeedback === "up" ? "bg-teal-50 text-teal-600" : "hover:text-slate-600"}`}
                        >
                          👍 讲评有帮助
                        </button>
                        <button
                          onClick={() => setStudentFeedback((v) => (v === "down" ? null : "down"))}
                          className={`flex items-center gap-1 rounded-md px-1.5 py-0.5 ${studentFeedback === "down" ? "bg-rose-50 text-rose-500" : "hover:text-slate-600"}`}
                        >
                          👎 讲评不准确
                        </button>
                      </div>
                    )}

                    {pmMode && (
                      <div className="rounded-xl border border-slate-200 bg-white p-3">
                        <div className="mb-2 flex flex-wrap items-center gap-1">
                          <span className="text-xs text-slate-400">这条结果：</span>
                          {["没问题", "OCR/公平错", "规则错", "Rubric错", "表达错"].map((c) => (
                            <button
                              key={c}
                              onClick={() => setBadCase((v) => (v === c ? null : c))}
                              className={`rounded-full border px-2 py-0.5 text-xs ${
                                badCase === c ? `${BADCASE_STYLE[c].bg} ${BADCASE_STYLE[c].text} border-transparent` : "border-slate-200 text-slate-400 hover:border-slate-300"
                              }`}
                            >
                              {c}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {stage === "result" && reviewDecision?.needHuman && !ruleResult?.pass && (
                  <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-xs text-rose-700">
                    规则校验多次未通过（{(ruleResult?.errors || []).map((e) => e.detail).join("；")}），AI结果不可靠，不展示给学生，已直接进入老师复核队列。
                  </div>
                )}

                {pmMode && (
                  <label className="mt-4 flex items-center gap-2 text-xs text-slate-400">
                    <input type="checkbox" checked={showDebug} onChange={(e) => setShowDebug(e.target.checked)} />
                    显示规则校验与转人工判断明细
                  </label>
                )}

                {pmMode && showDebug && ruleResult && (
                  <div className="mt-2 space-y-2 rounded-xl border border-slate-200 bg-white p-3 text-xs">
                    <div className="font-medium text-slate-500">规则校验（后置检测LLM输出）</div>
                    <div className="text-slate-400">
                      算术一致性：期望总分 {ruleResult.expectedTotal ?? "-"} 分，模型报总分 {llmOutput?.total ?? "-"} 分 —{" "}
                      {ruleResult.pass ? <span className="text-emerald-600">通过</span> : <span className="text-rose-600">未通过</span>}
                    </div>
                    {ruleResult.errors.length > 0 && (
                      <ul className="list-disc pl-4 text-rose-500">
                        {ruleResult.errors.map((e, i) => (
                          <li key={i}>
                            [{e.type}] {e.detail}
                          </li>
                        ))}
                      </ul>
                    )}
                    {reviewDecision && (
                      <>
                        <div className="mt-2 font-medium text-slate-500">转人工判断（双阈值，满足任一即触发）</div>
                        <div className="text-slate-400">
                          分差触发：{reviewDecision.scoreDiffTrigger ? "是" : "否"}（AI分与教研基准分差 {reviewDecision.scoreDiff?.toFixed?.(1) ?? "-"} 分）
                        </div>
                        <div className="text-slate-400">
                          OCR触发：{reviewDecision.ocrTrigger ? "是" : "否"}（核对后仍存疑占比 {confStatsForDisplay ? (confStatsForDisplay.lowConfRatio * 100).toFixed(1) : "-"}%）
                        </div>
                        <div className={reviewDecision.needHuman ? "font-medium text-amber-600" : "font-medium text-emerald-600"}>
                          最终判断：{reviewDecision.needHuman ? "转人工复核" : "AI直接出分"}
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "home" && <PlaceholderScreen title="首页" desc="学习资讯、练习打卡等内容" icon={Home} />}
      {activeTab === "study" && <PlaceholderScreen title="学习" desc="真题、词汇、课程等内容" icon={BookOpen} />}
      {activeTab === "me" && <PlaceholderScreen title="我的" desc="个人中心、批改历史、订单等内容" icon={User} />}

      <nav className="sticky bottom-0 z-10 border-t border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-around px-6 py-2">
          {TABS.map((t) => {
            const Icon = t.icon;
            const active = activeTab === t.key;
            return (
              <button key={t.key} onClick={() => setActiveTab(t.key)} className={`flex flex-col items-center gap-0.5 px-3 py-1 text-xs ${active ? "text-teal-600" : "text-slate-400"}`}>
                <Icon className="h-5 w-5" strokeWidth={active ? 2.5 : 2} />
                {t.label}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
