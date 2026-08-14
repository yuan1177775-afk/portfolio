"use client";

import React, { useState } from "react";
import {
  Home,
  GraduationCap,
  BookOpen,
  User,
  PenLine,
  Check,
  HelpCircle,
  ChevronLeft,
  BookMarked,
  ListChecks,
  CalendarClock,
} from "lucide-react";

/* ============================================================
   合并版 Demo —— 项目一（考研管综199择校推荐）+ 项目二（考研英语作文AI批改）
   放进同一个App里，用同一套底部导航承载：
     首页（占位） / 择校（项目一完整功能） / 学习（内嵌"英语作文批改"=项目二完整功能） / 我的（占位）
   两个项目原本各自独立成篇，合并时做了两件事：
     1. 避免命名冲突：两边都有WEIGHTS/BADCASE_STYLE，分别重命名为
        SCHOOL_WEIGHTS/SCHOOL_BADCASE_STYLE 和 RUBRIC_WEIGHTS/ESSAY_BADCASE_STYLE
     2. 两个项目各自的"App"整体外壳（自己的底部导航、自己的首页/我的占位页）
        被拆掉，只保留各自的核心功能区，套进这一个共享的外壳里
   ============================================================ */

/* ============================================================
   项目一：考研管综199择校推荐 —— Mock数据 + 规则引擎 + Prompt组装
   ============================================================ */
/* ============================================================
   Mock 知识库 —— 14 所虚构院校（demo数据，非真实院校）
   dims 四个维度是「简化后的静态打分」：
   真实项目里 major/region 会结合用户背景动态计算，
   这里为了让你先专注规则引擎本身，直接给定了固定分值。
   ============================================================ */
const SCHOOLS = [
  { id: 1, name: "华东商业大学", degreeType: "MBA", region: "华东", fullTime: true, tuition: 18, workYearsRequired: 2, retestLineHistory: [169, 172, 175], adRatio: "3:1", enrollNum: 120, mentorField: "战略管理/市场营销", dims: { major: 85, region: 80, admission: 40, city: 88 } },
  { id: 2, name: "华东财经学院", degreeType: "MBA", region: "华东", fullTime: false, tuition: 12, workYearsRequired: 3, retestLineHistory: [168, 166, 165], adRatio: "2.5:1", enrollNum: 90, mentorField: "金融/财务管理", dims: { major: 78, region: 75, admission: 65, city: 82 } },
  { id: 3, name: "江南理工大学", degreeType: "MBA", region: "华东", fullTime: true, tuition: 9, workYearsRequired: 2, retestLineHistory: [155, 158, 160], adRatio: "1.8:1", enrollNum: 150, mentorField: "运营管理/供应链", dims: { major: 70, region: 72, admission: 85, city: 75 } },
  { id: 4, name: "北方经济大学", degreeType: "MBA", region: "华北", fullTime: true, tuition: 16, workYearsRequired: 2, retestLineHistory: [166, 169, 172], adRatio: "3.2:1", enrollNum: 110, mentorField: "创业管理/投融资", dims: { major: 82, region: 78, admission: 45, city: 90 } },
  { id: 5, name: "燕京商学院", degreeType: "MBA", region: "华北", fullTime: false, tuition: 20, workYearsRequired: 5, retestLineHistory: [173, 176, 178], adRatio: "3.6:1", enrollNum: 80, mentorField: "领导力/组织行为", dims: { major: 88, region: 85, admission: 38, city: 92 } },
  { id: 6, name: "岭南大学", degreeType: "MBA", region: "华南", fullTime: true, tuition: 14, workYearsRequired: 3, retestLineHistory: [163, 166, 168], adRatio: "2.4:1", enrollNum: 100, mentorField: "国际商务/品牌管理", dims: { major: 75, region: 70, admission: 60, city: 80 } },
  { id: 7, name: "西南财经学院", degreeType: "MPAcc", region: "西南", fullTime: true, tuition: 8, workYearsRequired: 0, retestLineHistory: [152, 155, 158], adRatio: "1.6:1", enrollNum: 130, mentorField: "审计/税务筹划", dims: { major: 72, region: 65, admission: 78, city: 65 } },
  { id: 8, name: "华东会计学院", degreeType: "MPAcc", region: "华东", fullTime: true, tuition: 7, workYearsRequired: 0, retestLineHistory: [157, 160, 162], adRatio: "1.9:1", enrollNum: 140, mentorField: "财务分析/内控", dims: { major: 80, region: 78, admission: 82, city: 85 } },
  { id: 9, name: "中原大学", degreeType: "MEM", region: "华中", fullTime: true, tuition: 10, workYearsRequired: 3, retestLineHistory: [150, 153, 155], adRatio: "1.7:1", enrollNum: 95, mentorField: "工程项目管理", dims: { major: 68, region: 60, admission: 70, city: 60 } },
  { id: 10, name: "沿海大学", degreeType: "MBA", region: "华东", fullTime: true, tuition: 22, workYearsRequired: 2, retestLineHistory: [176, 179, 182], adRatio: "4:1", enrollNum: 70, mentorField: "科技创新/数字化转型", dims: { major: 90, region: 82, admission: 30, city: 95 } },
  { id: 11, name: "江城公共管理学院", degreeType: "MPA", region: "华中", fullTime: true, tuition: 6, workYearsRequired: 2, retestLineHistory: [148, 151, 154], adRatio: "1.5:1", enrollNum: 100, mentorField: "公共政策/应急管理", dims: { major: 76, region: 68, admission: 75, city: 62 } },
  { id: 12, name: "南方旅游学院", degreeType: "MTA", region: "华南", fullTime: true, tuition: 9, workYearsRequired: 0, retestLineHistory: [145, 148, 150], adRatio: "1.4:1", enrollNum: 85, mentorField: "文旅规划/会展管理", dims: { major: 73, region: 74, admission: 80, city: 78 } },
  { id: 13, name: "华北信息管理大学", degreeType: "MLIS", region: "华北", fullTime: true, tuition: 8, workYearsRequired: 0, retestLineHistory: [150, 153, 156], adRatio: "1.6:1", enrollNum: 95, mentorField: "数据资源管理/信息系统", dims: { major: 71, region: 70, admission: 76, city: 83 } },
  { id: 14, name: "西南审计学院", degreeType: "MAud", region: "西南", fullTime: true, tuition: 7, workYearsRequired: 0, retestLineHistory: [147, 150, 153], adRatio: "1.5:1", enrollNum: 90, mentorField: "内部审计/风险控制", dims: { major: 74, region: 66, admission: 79, city: 64 } },
  { id: 15, name: "蜀山商业财经大学", degreeType: "MBA", region: "西南", fullTime: false, tuition: 8, workYearsRequired: 3, retestLineHistory: [140, 143, 146], adRatio: "2.8:1", enrollNum: 139, mentorField: "数字化转型/创新创业", dims: { major: 83, region: 73, admission: 32, city: 56 } },
  { id: 16, name: "江汉工商学院", degreeType: "MBA", region: "华中", fullTime: true, tuition: 6, workYearsRequired: 2, retestLineHistory: [146, 149, 152], adRatio: "2.9:1", enrollNum: 139, mentorField: "供应链管理/运营优化", dims: { major: 72, region: 74, admission: 67, city: 72 } },
  { id: 17, name: "燕山财经理工大学", degreeType: "MPAcc", region: "华北", fullTime: true, tuition: 8, workYearsRequired: 0, retestLineHistory: [155, 158, 161], adRatio: "1.5:1", enrollNum: 118, mentorField: "财务分析/内控", dims: { major: 76, region: 87, admission: 52, city: 71 } },
  { id: 18, name: "岭南财务大学", degreeType: "MPAcc", region: "华南", fullTime: true, tuition: 14, workYearsRequired: 0, retestLineHistory: [169, 172, 175], adRatio: "1.9:1", enrollNum: 150, mentorField: "税务筹划/审计实务", dims: { major: 83, region: 66, admission: 75, city: 59 } },
  { id: 19, name: "蜀山财经财经大学", degreeType: "MPAcc", region: "西南", fullTime: true, tuition: 9, workYearsRequired: 0, retestLineHistory: [158, 161, 164], adRatio: "1.9:1", enrollNum: 116, mentorField: "财务分析/内控", dims: { major: 76, region: 71, admission: 43, city: 72 } },
  { id: 20, name: "江汉税会学院", degreeType: "MPAcc", region: "华中", fullTime: true, tuition: 9, workYearsRequired: 0, retestLineHistory: [163, 166, 169], adRatio: "2.1:1", enrollNum: 141, mentorField: "财务分析/内控", dims: { major: 86, region: 70, admission: 83, city: 58 } },
  { id: 21, name: "江南工程财经大学", degreeType: "MEM", region: "华东", fullTime: true, tuition: 7, workYearsRequired: 0, retestLineHistory: [170, 173, 176], adRatio: "3.2:1", enrollNum: 110, mentorField: "工程项目管理", dims: { major: 85, region: 75, admission: 55, city: 84 } },
  { id: 22, name: "京华项目学院", degreeType: "MEM", region: "华北", fullTime: false, tuition: 18, workYearsRequired: 2, retestLineHistory: [150, 153, 156], adRatio: "2.9:1", enrollNum: 124, mentorField: "智能制造/项目管控", dims: { major: 76, region: 67, admission: 38, city: 87 } },
  { id: 23, name: "海滨工程大学", degreeType: "MEM", region: "华南", fullTime: true, tuition: 8, workYearsRequired: 3, retestLineHistory: [144, 147, 150], adRatio: "3.0:1", enrollNum: 124, mentorField: "工程项目管理", dims: { major: 77, region: 72, admission: 68, city: 84 } },
  { id: 24, name: "巴蜀机电大学", degreeType: "MEM", region: "西南", fullTime: true, tuition: 7, workYearsRequired: 3, retestLineHistory: [168, 171, 174], adRatio: "3.0:1", enrollNum: 113, mentorField: "工程项目管理", dims: { major: 74, region: 73, admission: 40, city: 84 } },
  { id: 25, name: "东海政务学院", degreeType: "MPA", region: "华东", fullTime: true, tuition: 7, workYearsRequired: 3, retestLineHistory: [153, 156, 159], adRatio: "3.2:1", enrollNum: 134, mentorField: "公共政策/应急管理", dims: { major: 69, region: 71, admission: 78, city: 65 } },
  { id: 26, name: "燕山民生财经大学", degreeType: "MPA", region: "华北", fullTime: true, tuition: 7, workYearsRequired: 0, retestLineHistory: [153, 156, 159], adRatio: "1.8:1", enrollNum: 100, mentorField: "公共政策/应急管理", dims: { major: 67, region: 83, admission: 61, city: 59 } },
  { id: 27, name: "珠江行政理工大学", degreeType: "MPA", region: "华南", fullTime: true, tuition: 8, workYearsRequired: 0, retestLineHistory: [167, 170, 173], adRatio: "3.2:1", enrollNum: 124, mentorField: "公共政策/应急管理", dims: { major: 82, region: 84, admission: 76, city: 67 } },
  { id: 28, name: "巴蜀治理财经大学", degreeType: "MPA", region: "西南", fullTime: true, tuition: 18, workYearsRequired: 2, retestLineHistory: [141, 144, 147], adRatio: "1.8:1", enrollNum: 78, mentorField: "基层治理/社会保障", dims: { major: 65, region: 78, admission: 65, city: 69 } },
  { id: 29, name: "江南旅游大学", degreeType: "MTA", region: "华东", fullTime: true, tuition: 6, workYearsRequired: 0, retestLineHistory: [138, 141, 144], adRatio: "3.3:1", enrollNum: 112, mentorField: "文旅规划/会展管理", dims: { major: 81, region: 67, admission: 47, city: 86 } },
  { id: 30, name: "京华休闲学院", degreeType: "MTA", region: "华北", fullTime: true, tuition: 16, workYearsRequired: 0, retestLineHistory: [164, 167, 170], adRatio: "3.1:1", enrollNum: 94, mentorField: "文旅规划/会展管理", dims: { major: 68, region: 81, admission: 57, city: 77 } },
  { id: 31, name: "滇南酒店理工大学", degreeType: "MTA", region: "西南", fullTime: true, tuition: 6, workYearsRequired: 3, retestLineHistory: [140, 143, 146], adRatio: "1.4:1", enrollNum: 113, mentorField: "文旅规划/会展管理", dims: { major: 72, region: 66, admission: 42, city: 89 } },
  { id: 32, name: "楚天文旅理工大学", degreeType: "MTA", region: "华中", fullTime: false, tuition: 16, workYearsRequired: 0, retestLineHistory: [138, 141, 144], adRatio: "2.3:1", enrollNum: 140, mentorField: "文旅规划/会展管理", dims: { major: 66, region: 80, admission: 64, city: 55 } },
  { id: 33, name: "东海图书学院", degreeType: "MLIS", region: "华东", fullTime: true, tuition: 16, workYearsRequired: 0, retestLineHistory: [159, 162, 165], adRatio: "3.3:1", enrollNum: 91, mentorField: "知识服务/档案管理", dims: { major: 65, region: 72, admission: 46, city: 84 } },
  { id: 34, name: "南粤情报理工大学", degreeType: "MLIS", region: "华南", fullTime: false, tuition: 10, workYearsRequired: 0, retestLineHistory: [137, 140, 143], adRatio: "2.6:1", enrollNum: 139, mentorField: "数据资源管理/信息系统", dims: { major: 88, region: 70, admission: 33, city: 58 } },
  { id: 35, name: "滇南档案学院", degreeType: "MLIS", region: "西南", fullTime: false, tuition: 18, workYearsRequired: 0, retestLineHistory: [145, 148, 151], adRatio: "1.5:1", enrollNum: 78, mentorField: "数据资源管理/信息系统", dims: { major: 77, region: 63, admission: 86, city: 91 } },
  { id: 36, name: "中原档案大学", degreeType: "MLIS", region: "华中", fullTime: true, tuition: 14, workYearsRequired: 3, retestLineHistory: [171, 174, 177], adRatio: "2.5:1", enrollNum: 110, mentorField: "知识服务/档案管理", dims: { major: 71, region: 81, admission: 75, city: 75 } },
  { id: 37, name: "江南稽核理工大学", degreeType: "MAud", region: "华东", fullTime: false, tuition: 10, workYearsRequired: 2, retestLineHistory: [154, 157, 160], adRatio: "3.3:1", enrollNum: 79, mentorField: "内部审计/风险控制", dims: { major: 79, region: 79, admission: 66, city: 61 } },
  { id: 38, name: "燕山内审学院", degreeType: "MAud", region: "华北", fullTime: true, tuition: 8, workYearsRequired: 0, retestLineHistory: [138, 141, 144], adRatio: "3.2:1", enrollNum: 117, mentorField: "国家审计/绩效审计", dims: { major: 70, region: 74, admission: 83, city: 89 } },
  { id: 39, name: "南粤内审大学", degreeType: "MAud", region: "华南", fullTime: true, tuition: 18, workYearsRequired: 0, retestLineHistory: [140, 143, 146], adRatio: "3.4:1", enrollNum: 87, mentorField: "国家审计/绩效审计", dims: { major: 68, region: 88, admission: 36, city: 90 } },
  { id: 40, name: "中原稽核财经大学", degreeType: "MAud", region: "华中", fullTime: true, tuition: 12, workYearsRequired: 0, retestLineHistory: [174, 177, 180], adRatio: "3.2:1", enrollNum: 134, mentorField: "国家审计/绩效审计", dims: { major: 73, region: 88, admission: 88, city: 58 } },
  { id: 41, name: "钱塘审计学院(非全)", degreeType: "MPAcc", region: "华东", fullTime: false, tuition: 8, workYearsRequired: 2, retestLineHistory: [155, 158, 161], adRatio: "3.0:1", enrollNum: 100, mentorField: "税务筹划/审计实务", dims: { major: 70, region: 83, admission: 58, city: 90 } },
  { id: 42, name: "蜀山工程学院(非全)", degreeType: "MEM", region: "西南", fullTime: false, tuition: 8, workYearsRequired: 2, retestLineHistory: [168, 171, 174], adRatio: "1.4:1", enrollNum: 83, mentorField: "工程项目管理", dims: { major: 78, region: 64, admission: 32, city: 74 } },
  { id: 43, name: "岭南政务学院(非全)", degreeType: "MPA", region: "华南", fullTime: false, tuition: 10, workYearsRequired: 2, retestLineHistory: [140, 143, 146], adRatio: "2.1:1", enrollNum: 95, mentorField: "基层治理/社会保障", dims: { major: 84, region: 83, admission: 39, city: 70 } },
  { id: 44, name: "京华酒店学院(非全)", degreeType: "MTA", region: "华北", fullTime: false, tuition: 8, workYearsRequired: 2, retestLineHistory: [155, 158, 161], adRatio: "3.0:1", enrollNum: 86, mentorField: "文旅规划/会展管理", dims: { major: 73, region: 65, admission: 80, city: 61 } },
  { id: 45, name: "蜀山情报学院(非全)", degreeType: "MLIS", region: "西南", fullTime: false, tuition: 10, workYearsRequired: 2, retestLineHistory: [163, 166, 169], adRatio: "2.1:1", enrollNum: 112, mentorField: "数据资源管理/信息系统", dims: { major: 72, region: 60, admission: 72, city: 67 } },
  { id: 46, name: "巴蜀稽核学院(非全)", degreeType: "MAud", region: "西南", fullTime: false, tuition: 8, workYearsRequired: 3, retestLineHistory: [156, 159, 162], adRatio: "2.7:1", enrollNum: 85, mentorField: "国家审计/绩效审计", dims: { major: 65, region: 63, admission: 86, city: 71 } },
];

/* 打分权重 —— 示意值，非真实公司权重（真实权重是历史case反推校准出来的） */
const SCHOOL_WEIGHTS = { major: 0.3, admission: 0.3, region: 0.2, city: 0.2 };

/* 分档阈值（按录取概率dims.admission），示意值 */
const TIER_RULES = { baodi: 80, wen: 50 }; // >=80 保底；50~80 稳妥；<50 冲刺

const WORK_YEARS_OPTIONS = [
  { label: "0年", value: 0 },
  { label: "1-2年", value: 1 },
  { label: "3-5年", value: 3 },
  { label: "5年以上", value: 5 },
];
const REGION_OPTIONS = ["华东", "华北", "华南", "西南", "华中"];

/* 管综199覆盖的7个专业类别，intro是聊天时"没想好目标专业"分支要展示的一句话介绍 */
const MAJORS = [
  { value: "MBA", label: "MBA", intro: "工商管理 — 培养管理通才，适合想全面提升管理能力、转型管理岗的人" },
  { value: "MPAcc", label: "MPAcc", intro: "会计 — 偏财务/审计方向，适合相关背景或想深耕财务领域" },
  { value: "MPA", label: "MPA", intro: "公共管理 — 面向政府机关、事业单位、公共部门管理岗" },
  { value: "MEM", label: "MEM", intro: "工程管理 — 适合有工程/技术背景、想往项目管理方向发展的人" },
  { value: "MTA", label: "MTA", intro: "旅游管理 — 面向文旅、酒店、会展等行业管理岗" },
  { value: "MLIS", label: "MLIS", intro: "图书情报 — 偏信息管理、数据资源管理方向" },
  { value: "MAud", label: "MAud", intro: "审计 — 偏审计实务，适合想考公/进事务所做审计的人" },
];

/* ============================================================
   规则引擎 —— 硬约束过滤（第一步：筛选与入池）
   注：预算这一项按讨论过的方案延后，本轮聊天不收集，
   demo里默认按 Infinity（不限）处理，不影响过滤逻辑本身。
   ============================================================ */
function filterByHardConstraints(schools, constraints) {
  return schools.filter((school) => {
    const majorOk = school.degreeType === constraints.major;
    const workYearsOk = school.workYearsRequired <= constraints.workYears;
    const regionOk = school.region === constraints.region;
    const fullTimeOk = school.fullTime === constraints.fullTime;
    const budgetOk = school.tuition <= constraints.budget;
    return majorOk && workYearsOk && regionOk && fullTimeOk && budgetOk;
  });
}

/* ============================================================
   规则引擎 —— 加权打分 + 分档 + 同档排序（第二、三步）
   ============================================================ */
function scoreAndTier(candidates, weights, tierRules) {
  const scored = candidates.map((school) => {
    const { major, region, admission, city } = school.dims;
    const compositeScore =
      major * weights.major +
      admission * weights.admission +
      region * weights.region +
      city * weights.city;
    return { ...school, compositeScore };
  });

  const tiers = { 冲刺: [], 稳妥: [], 保底: [] };
  scored.forEach((school) => {
    const p = school.dims.admission;
    const tierName = p >= tierRules.baodi ? "保底" : p >= tierRules.wen ? "稳妥" : "冲刺";
    tiers[tierName].push({ ...school, tier: tierName });
  });

  Object.keys(tiers).forEach((tier) => {
    tiers[tier].sort((a, b) => b.compositeScore - a.compositeScore);
  });

  return tiers;
}

/* ============================================================
   Prompt 组装 —— 单校推荐理由生成
   softPreference 是聊天里最后自由文本收集到的软偏好，
   只用来影响LLM的表达，不参与规则引擎的任何计算。
   ============================================================ */
function buildPrompt(school, softPreference) {
  return `你是考研择校顾问的解释助手。下面会给你一所学校的推荐结果和相关资料，这些数据已经由系统计算完成，你的任务只是基于这些数据写一段推荐理由，不是重新判断。

【必须遵守】
1. 档位（冲刺/稳妥/保底）以给定结果为准，不能自行调整或质疑
2. 【本校数据】里的四维度分、综合匹配分是系统内部计算用的，绝对不能出现在你写的文案里——不能写"专业匹配度85分"这种话，只能用文字描述倾向（比如"专业方向比较契合""地区不是你最想去的那个"），不能报数字
3. 涉及复试线、报录比、招生人数等事实性数据，可以引用具体数字，但必须来自下方提供的资料，不能编造；资料中没有的信息，如实说明"暂无数据"
4. 语言亲和自然，不生硬、不谄媚
5. 不能因为不让报数字就写"综合考虑各方面因素"这类空话——用具体描述代替数字，比如"跟你想去的城市不算太远""导师方向偏实务，跟你背景比较搭"，理由要让人看得懂"为什么"，不是走过场
6. 如果下面【学生的补充说明】里提到了具体顾虑（比如怕考不上、想离家近），解释里可以适当呼应，但依然要遵守以上规则，不能因此编造数据或改变档位

【本校数据】
学校名：${school.name}
档位：${school.tier}
四维度分：专业匹配度${school.dims.major} / 地区偏好${school.dims.region} / 录取概率${school.dims.admission} / 城市发展${school.dims.city}
综合匹配分：${school.compositeScore.toFixed(1)}
近3年复试线：${school.retestLineHistory.join(" → ")}
报录比：${school.adRatio}　招生人数：${school.enrollNum}　导师方向：${school.mentorField}

【学生的补充说明】
${softPreference ? softPreference : "（暂无）"}

请输出一段150字以内的推荐解释。`;
}

/* ============================================================
   Prompt 组装 —— 整体方案说明（跨三档的总结性文字，非单校）
   按需触发，不在结果卡片出现时自动生成
   ============================================================ */
function buildOverallPrompt(tiers, constraints, softPreference) {
  const majorLabel = MAJORS.find((m) => m.value === constraints.major)?.label || constraints.major;
  const workYearsLabel =
    WORK_YEARS_OPTIONS.find((o) => o.value === constraints.workYears)?.label || constraints.workYears;
  const tierSummary = ["冲刺", "稳妥", "保底"]
    .map((t) => `${t}档（${tiers[t].length}所）：${tiers[t].map((s) => s.name).join("、") || "无"}`)
    .join("\n");

  return `你是考研择校顾问的解释助手。系统已经根据学生条件，用规则引擎筛出候选院校并分好了冲刺/稳妥/保底三档，你的任务是写一段"整体方案说明"，帮学生理解这套推荐背后的整体逻辑，不是逐校介绍。

【必须遵守】
1. 不能出现任何内部打分数字（维度分、综合匹配分），只能用文字描述倾向
2. 三档的院校名单以下方给定的为准，不能新增或删除院校，也不能调整某所学校所在的档位
3. 涉及学校的事实信息（复试线、报录比等）不在这里展开，那是每所学校单独的推荐理由要做的事，这段话只讲"整体思路"
4. 语言自然、有逻辑，说清楚"为什么冲刺档这样选、稳妥档这样选、保底档这样选"，不能写"综合考虑各方面因素"这类空话
5. 如果学生有补充说明（软偏好），可以呼应，但不能编造没给的信息

【学生情况】
目标专业：${majorLabel}　工作年限：${workYearsLabel}　地区：${constraints.region}　学习方式：${constraints.fullTime ? "全日制" : "非全日制"}
补充说明：${softPreference || "（暂无）"}

【三档院校名单】
${tierSummary}

请输出一段200字以内的整体方案说明。`;
}

/* ============================================================ UI ============================================================ */

const TIER_STYLE = {
  冲刺: { bar: "bg-amber-500", text: "text-amber-700", bg: "bg-amber-50", ring: "ring-amber-200" },
  稳妥: { bar: "bg-teal-500", text: "text-teal-700", bg: "bg-teal-50", ring: "ring-teal-200" },
  保底: { bar: "bg-emerald-500", text: "text-emerald-700", bg: "bg-emerald-50", ring: "ring-emerald-200" },
};

const SCHOOL_BADCASE_STYLE = {
  规则错: { bg: "bg-rose-100", text: "text-rose-700" },
  数据错: { bg: "bg-amber-100", text: "text-amber-700" },
  表达错: { bg: "bg-violet-100", text: "text-violet-700" },
  没问题: { bg: "bg-emerald-100", text: "text-emerald-700" },
};

function SchoolCard({ school, explanation, onGenerate, badCaseValue, onMark, pmMode, feedback, onFeedback, favorited, onToggleFavorite }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3">
      <div className="flex items-start justify-between">
        <div className="font-medium text-slate-800">{school.name}</div>
        <button
          onClick={onToggleFavorite}
          className={`text-lg leading-none ${favorited ? "text-amber-400" : "text-slate-300 hover:text-slate-400"}`}
          title={favorited ? "取消收藏" : "收藏"}
        >
          {favorited ? "★" : "☆"}
        </button>
      </div>
      <div className="mt-1 text-xs text-slate-500">
        {school.degreeType} · {school.region} · {school.fullTime ? "全日制" : "非全日制"} · 学费{school.tuition}万
      </div>
      <div className="mt-1 text-xs text-slate-400">
        近3年复试线 {school.retestLineHistory.join(" → ")} · 报录比{school.adRatio} · 导师方向：{school.mentorField}
      </div>

      {!explanation && (
        <button
          onClick={onGenerate}
          className="mt-2 rounded-md border border-teal-200 bg-teal-50 px-2 py-1 text-xs font-medium text-teal-700 hover:bg-teal-100"
        >
          生成推荐理由
        </button>
      )}
      {explanation?.loading && <div className="mt-2 text-xs text-slate-400">生成中...</div>}
      {explanation?.error && <div className="mt-2 text-xs text-rose-500">生成失败，稍后重试</div>}
      {explanation?.text && (
        <>
          <div className="mt-2 rounded-md bg-slate-50 p-2 text-xs leading-relaxed text-slate-600">{explanation.text}</div>

          {!pmMode && (
            <div className="mt-2 flex items-center gap-3 text-xs text-slate-400">
              <button
                onClick={() => onFeedback("up")}
                className={`flex items-center gap-1 rounded-md px-1.5 py-0.5 ${
                  feedback === "up" ? "bg-teal-50 text-teal-600" : "hover:text-slate-600"
                }`}
              >
                👍 有帮助
              </button>
              <button
                onClick={() => onFeedback("down")}
                className={`flex items-center gap-1 rounded-md px-1.5 py-0.5 ${
                  feedback === "down" ? "bg-rose-50 text-rose-500" : "hover:text-slate-600"
                }`}
              >
                👎 不适合
              </button>
            </div>
          )}

          {pmMode && (
            <div className="mt-2 flex flex-wrap items-center gap-1">
              <span className="text-xs text-slate-400">这条解释：</span>
              {["没问题", "数据错", "规则错", "表达错"].map((c) => (
                <button
                  key={c}
                  onClick={() => onMark(c)}
                  className={`rounded-full border px-2 py-0.5 text-xs ${
                    badCaseValue === c
                      ? `${SCHOOL_BADCASE_STYLE[c].bg} ${SCHOOL_BADCASE_STYLE[c].text} border-transparent`
                      : "border-slate-200 text-slate-400 hover:border-slate-300"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

/* 聊天流里插入的"初版结果卡片"——只展示裸列表（校名+档位），不含推荐理由，
   点开单校的推荐理由要去右侧完整结果区操作，跟demo原有机制保持一致 */
function ChatResultCard({ tiers }) {
  const order = ["冲刺", "稳妥", "保底"];
  const total = order.reduce((sum, t) => sum + tiers[t].length, 0);

  if (total === 0) {
    return (
      <div className="rounded-lg border border-dashed border-slate-300 bg-white p-3 text-xs text-slate-400">
        这次条件下没有找到完全匹配的候选院校呢，要不换个条件再聊聊？
      </div>
    );
  }

  return (
    <div className="space-y-1.5 rounded-lg border border-slate-200 bg-white p-3">
      {order
        .filter((t) => tiers[t].length > 0)
        .map((t) => (
          <div key={t} className="text-xs">
            <span className={`mr-1 inline-block h-2 w-2 rounded-full ${TIER_STYLE[t].bar}`} />
            <span className={`font-medium ${TIER_STYLE[t].text}`}>{t}</span>
            <span className="text-slate-400">（{tiers[t].length}）：</span>
            <span className="text-slate-600">{tiers[t].map((s) => s.name).join("、")}</span>
          </div>
        ))}
      <div className="pt-1 text-[11px] text-slate-400">完整结果和推荐理由见右侧 →</div>
    </div>
  );
}

/* ============================================================
   项目二：考研英语作文AI批改 —— Mock数据 + 规则引擎 + Prompt组装
   ============================================================ */
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
const RUBRIC_WEIGHTS = { content: 0.25, language: 0.25, logic: 0.2, vocab: 0.15, format: 0.15 };
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
  const dimKeys = Object.keys(RUBRIC_WEIGHTS);
  for (const k of dimKeys) {
    if (typeof dims[k] !== "number") errors.push({ type: "格式错", detail: `缺少维度分：${DIM_LABELS[k]}` });
    else if (dims[k] < 0 || dims[k] > 10) errors.push({ type: "边界错", detail: `${DIM_LABELS[k]} 超出0-10区间：${dims[k]}` });
  }
  const weightedSum = dimKeys.reduce((sum, k) => sum + (dims[k] || 0) * RUBRIC_WEIGHTS[k], 0); // 0-10量纲
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
  const dimList = Object.keys(RUBRIC_WEIGHTS)
    .map((k) => `${DIM_LABELS[k]}（权重${RUBRIC_WEIGHTS[k] * 100}%）`)
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

const ESSAY_BADCASE_STYLE = {
  "OCR/公平错": { bg: "bg-amber-100", text: "text-amber-700" },
  规则错: { bg: "bg-rose-100", text: "text-rose-700" },
  Rubric错: { bg: "bg-orange-100", text: "text-orange-700" },
  表达错: { bg: "bg-violet-100", text: "text-violet-700" },
  没问题: { bg: "bg-emerald-100", text: "text-emerald-700" },
};

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


/* ============================================================
   共享外壳组件 —— PlaceholderScreen / 学习页菜单 / 底部导航
   ============================================================ */

/* 首页/我的是纯视觉占位，不接任何真实逻辑——这两个不在我实际负责的项目范围内，
   做成静态页面是刻意的选择，不假装有产品判断在背后，避免被追问细节时露怯。 */
function PlaceholderScreen({ title, desc, icon: Icon, hint }) {
  return (
    <div className="p-6">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white px-6 py-20 text-center">
          <Icon className="mb-3 h-8 w-8 text-slate-300" />
          <div className="text-sm font-medium text-slate-500">{title}</div>
          <div className="mt-1 text-xs text-slate-400">{desc}</div>
          <div className="mt-6 text-[11px] text-slate-300">{hint || "占位页面，非本次demo重点"}</div>
        </div>
      </div>
    </div>
  );
}

/* "学习"这个tab下面还有一层菜单——英语作文批改是真实实现的功能，
   其余几项（背单词/题库/学习计划）是纯占位，标灰且不可点，
   目的是让"学习"这个页面看起来像一个完整产品的一部分，而不是只有一个孤零零的功能。 */
const STUDY_MENU_ITEMS = [
  { key: "writing", label: "英语作文批改", desc: "OCR识别 + 规则校验 + LLM五维评分", icon: PenLine, enabled: true },
  { key: "vocab", label: "背单词", desc: "敬请期待", icon: BookMarked, enabled: false },
  { key: "bank", label: "题库", desc: "敬请期待", icon: ListChecks, enabled: false },
  { key: "plan", label: "学习计划", desc: "敬请期待", icon: CalendarClock, enabled: false },
];

function StudyMenu({ onSelect }) {
  return (
    <div className="p-6">
      <div className="mx-auto max-w-5xl">
        <header className="mb-6">
          <div className="text-xs font-medium uppercase tracking-wide text-teal-600">学习</div>
          <h1 className="text-2xl font-semibold text-slate-900">学习中心</h1>
          <p className="mt-1 text-sm text-slate-500">"英语作文批改"是完整实现的demo，其余几项是占位，标了"敬请期待"</p>
        </header>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {STUDY_MENU_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.key}
                onClick={() => item.enabled && onSelect(item.key)}
                disabled={!item.enabled}
                className={`flex items-center gap-3 rounded-xl border p-4 text-left transition ${
                  item.enabled
                    ? "border-slate-200 bg-white hover:border-teal-300 hover:bg-teal-50/50 cursor-pointer"
                    : "cursor-not-allowed border-slate-100 bg-slate-50 opacity-60"
                }`}
              >
                <div className={`rounded-lg p-2 ${item.enabled ? "bg-teal-100 text-teal-600" : "bg-slate-200 text-slate-400"}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm font-medium text-slate-800">{item.label}</div>
                  <div className="mt-0.5 text-xs text-slate-400">{item.desc}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* "学习"tab的路由容器：菜单 ⇄ 英语作文批改功能页，来回切换 */
function StudyTab() {
  const [subPage, setSubPage] = useState(null); // null | "writing"

  if (subPage === "writing") {
    return <EssayGradingFeature onBack={() => setSubPage(null)} />;
  }
  return <StudyMenu onSelect={(key) => setSubPage(key)} />;
}

const TABS = [
  { key: "home", label: "首页", icon: Home },
  { key: "school", label: "择校", icon: GraduationCap },
  { key: "study", label: "学习", icon: BookOpen },
  { key: "me", label: "我的", icon: User },
];

export default function App() {
  const [activeTab, setActiveTab] = useState("school");

  return (
    <div className="min-h-[720px] bg-slate-50 font-sans text-slate-800">
      {activeTab === "home" && (
        <PlaceholderScreen title="首页" desc="资讯、社区、热门帖等内容" icon={Home} hint='占位页面，非本次demo重点 · 完整功能见"择校"或"学习"' />
      )}
      {activeTab === "school" && <SchoolSelectionFeature />}
      {activeTab === "study" && <StudyTab />}
      {activeTab === "me" && (
        <PlaceholderScreen title="我的" desc="个人中心、订单、批改历史等内容" icon={User} hint='占位页面，非本次demo重点 · 完整功能见"择校"或"学习"' />
      )}

      <nav className="sticky bottom-0 z-10 border-t border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-around px-6 py-2">
          {TABS.map((t) => {
            const Icon = t.icon;
            const active = activeTab === t.key;
            return (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key)}
                className={`flex flex-col items-center gap-0.5 px-3 py-1 text-xs ${active ? "text-teal-600" : "text-slate-400"}`}
              >
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

/* ============================================================
   项目一功能区：择校推荐（完整聊天+结果+PM抽检逻辑）
   ============================================================ */
function SchoolSelectionFeature() {

  /* 硬约束最终会通过聊天逐步收集齐；预算延后不收集，demo里按不限处理 */
  const [constraints, setConstraints] = useState({
    major: null,
    workYears: null,
    region: null,
    fullTime: null,
    budget: Infinity,
  });

  const [results, setResults] = useState(null);
  const [showDebug, setShowDebug] = useState(false);
  const [explanations, setExplanations] = useState({});
  const [badCases, setBadCases] = useState({});
  const [pmMode, setPmMode] = useState(true);
  const [activeTier, setActiveTier] = useState("冲刺");
  const [studentFeedback, setStudentFeedback] = useState({});
  const [overallSummary, setOverallSummary] = useState(null);
  const [contactMode, setContactMode] = useState(null); // null | "choose" | "phone" | "wechat"
  const [favorites, setFavorites] = useState({});
  const [shareText, setShareText] = useState(null);

  function toggleFavorite(schoolId) {
    setFavorites((prev) => ({ ...prev, [schoolId]: !prev[schoolId] }));
  }

  function generateShareText() {
    if (!results) return "";
    const lines = ["冲刺", "稳妥", "保底"]
      .filter((t) => results.tiers[t].length > 0)
      .map((t) => `${t}档：${results.tiers[t].map((s) => s.name).join("、")}`);
    return `我的考研择校推荐结果\n${lines.join("\n")}\n（demo演示生成，仅供参考）`;
  }

  async function handleCopyShareText() {
    try {
      await navigator.clipboard.writeText(shareText || "");
      alert("已复制，可以粘贴发给家人/同学啦～");
    } catch (err) {
      alert("复制失败，可以手动选中文字复制");
    }
  }

  function setFeedback(schoolId, value) {
    setStudentFeedback((prev) => ({ ...prev, [schoolId]: prev[schoolId] === value ? undefined : value }));
  }

  /* ---------------- 聊天状态机 ---------------- */
  const [stage, setStage] = useState("ask_has_major");
  const [messages, setMessages] = useState([
    { from: "bot", text: "嗨～我是你的择校小助手，先问一下，你现在心里有没有已经想好要考的专业方向呀？" },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [regionPick, setRegionPick] = useState(null);
  const [fullTimePick, setFullTimePick] = useState(null);
  const [softPreference, setSoftPreference] = useState("");

  function pushBot(text) {
    setMessages((prev) => [...prev, { from: "bot", text }]);
  }
  function pushUser(text) {
    setMessages((prev) => [...prev, { from: "user", text }]);
  }
  function pushResultCard(tiers) {
    setMessages((prev) => [...prev, { type: "result-card", tiers }]);
  }

  function answerHasMajor(value) {
    pushUser(value === "yes" ? "已经想好了" : "还没想好");
    if (value === "yes") {
      pushBot("那你想考管综类的哪一门呢？");
      setStage("ask_major_direct");
    } else {
      pushBot("没关系，先说说你本科学的是什么专业吧，我帮你参考一下~");
      setStage("ask_undergrad_input");
    }
  }

  function chooseMajor(value, label) {
    pushUser(label);
    setConstraints((c) => ({ ...c, major: value }));
    pushBot("了解啦～那你工作几年了呀？");
    setStage("ask_work_years");
  }

  function submitUndergrad() {
    if (!chatInput.trim()) return;
    pushUser(chatInput);
    pushBot("管综类目前主要有这7个方向，你可以看看哪个更感兴趣：");
    setStage("ask_major_with_intro");
    setChatInput("");
  }

  function answerWorkYears(value, label) {
    pushUser(label);
    setConstraints((c) => ({ ...c, workYears: value }));
    pushBot("最后两个问题～你比较倾向去哪个地区？希望是全日制还是非全日制呢？");
    setStage("ask_region_fulltime");
  }

  function pickRegion(r) {
    setRegionPick(r);
    if (fullTimePick !== null) finishRegionFullTime(r, fullTimePick);
  }
  function pickFullTime(f) {
    setFullTimePick(f);
    if (regionPick !== null) finishRegionFullTime(regionPick, f);
  }

  function finishRegionFullTime(region, fullTime) {
    pushUser(`${region} · ${fullTime ? "全日制" : "非全日制"}`);
    const finalConstraints = { ...constraints, region, fullTime };
    setConstraints(finalConstraints);
    pushBot("好嘞，信息我都记下啦，先给你看一版初步结果～");
    runRuleEngineAndShow(finalConstraints);
  }

  function runRuleEngineAndShow(finalConstraints) {
    const candidates = filterByHardConstraints(SCHOOLS, finalConstraints);
    const tiers = scoreAndTier(candidates, SCHOOL_WEIGHTS, TIER_RULES);
    const scoredCandidates = [...tiers["冲刺"], ...tiers["稳妥"], ...tiers["保底"]];
    setResults({ candidates: scoredCandidates, tiers });
    setExplanations({});
    setBadCases({});
    setOverallSummary(null);
    setContactMode(null);
    setFavorites({});
    setShareText(null);
    pushResultCard(tiers);
    pushBot(
      "这版是按你目前的条件先出的初步方向，咱们再聊聊细化一下——你择校的时候，更看重学校的名气、上岸的把握，还是这个城市未来的发展？可以随便说说你的想法～"
    );
    setStage("ask_soft_pref");
  }

  function submitSoftPref() {
    if (!chatInput.trim()) return;
    pushUser(chatInput);
    setSoftPreference(chatInput);
    pushBot("好的，我记下啦～你可以点开右边任意一所学校看具体的推荐理由，也可以直接预约人工顾问细聊。");
    setStage("done");
    setChatInput("");
  }

  function handleChatTextSubmit() {
    if (stage === "ask_undergrad_input") submitUndergrad();
    else if (stage === "ask_soft_pref") submitSoftPref();
  }

  /* ---------------- 抽检 / Bad Case ---------------- */
  function markBadCase(schoolId, category) {
    setBadCases((prev) => {
      const next = { ...prev };
      if (next[schoolId] === category) {
        delete next[schoolId];
      } else {
        next[schoolId] = category;
      }
      return next;
    });
  }

  function generateAllExplanations() {
    if (!results) return;
    results.candidates.forEach((s) => {
      if (!explanations[s.id]) generateExplanation(s);
    });
  }

  async function generateExplanation(school) {
    setExplanations((prev) => ({ ...prev, [school.id]: { loading: true } }));
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 300,
          messages: [{ role: "user", content: buildPrompt(school, softPreference) }],
        }),
      });
      const data = await response.json();
      const text =
        (data.content || []).map((b) => b.text || "").join("").trim() || "（生成失败，返回内容为空）";
      setExplanations((prev) => ({ ...prev, [school.id]: { loading: false, text } }));
    } catch (err) {
      setExplanations((prev) => ({ ...prev, [school.id]: { loading: false, error: true } }));
    }
  }

  async function generateOverallSummary() {
    if (!results) return;
    setOverallSummary({ loading: true });
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 400,
          messages: [{ role: "user", content: buildOverallPrompt(results.tiers, constraints, softPreference) }],
        }),
      });
      const data = await response.json();
      const text =
        (data.content || []).map((b) => b.text || "").join("").trim() || "（生成失败，返回内容为空）";
      setOverallSummary({ loading: false, text });
    } catch (err) {
      setOverallSummary({ loading: false, error: true });
    }
  }

  const totalResults = results
    ? results.tiers["冲刺"].length + results.tiers["稳妥"].length + results.tiers["保底"].length
    : 0;

  const badCaseCounts = { 规则错: 0, 数据错: 0, 表达错: 0, 没问题: 0 };
  Object.values(badCases).forEach((c) => {
    if (badCaseCounts[c] !== undefined) badCaseCounts[c]++;
  });
  const totalMarked = Object.values(badCases).length;
  const priorityOrder = ["规则错", "数据错", "表达错"]; // 按"伤害用户信任程度"排序，非单纯频次
  const topIssue = priorityOrder
    .filter((c) => badCaseCounts[c] > 0)
    .sort((a, b) => badCaseCounts[b] - badCaseCounts[a] || priorityOrder.indexOf(a) - priorityOrder.indexOf(b))[0];

  return (
      <div className="p-6">
      <div className="mx-auto max-w-5xl">
        <header className="mb-6">
          <div className="text-xs font-medium uppercase tracking-wide text-teal-600">多轮对话 Demo</div>
          <h1 className="text-2xl font-semibold text-slate-900">考研管综199 择校推荐</h1>
          <p className="mt-1 text-sm text-slate-500">
            和小助手聊几句 → 硬约束齐了自动出初版结果 → 点开学校看推荐理由（以下院校均为demo虚构数据）
          </p>
          <div className="mt-3 inline-flex rounded-lg border border-slate-200 bg-white p-1 text-xs">
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
        </header>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-[360px_1fr]">
          {/* 左侧：聊天式交互 */}
          <div className="flex h-fit flex-col rounded-xl border border-slate-200 bg-white p-4">
            <div className="mb-3 text-sm font-medium text-slate-700">和小助手聊聊你的情况</div>

            <div className="mb-3 space-y-2">
              {messages.map((m, i) =>
                m.type === "result-card" ? (
                  <div key={i} className="flex justify-start">
                    <div className="max-w-[92%]">
                      <ChatResultCard tiers={m.tiers} />
                    </div>
                  </div>
                ) : (
                  <div key={i} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${
                        m.from === "user" ? "bg-teal-600 text-white" : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {m.text}
                    </div>
                  </div>
                )
              )}
            </div>

            <div>
              {stage === "ask_has_major" && (
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => answerHasMajor("yes")}
                    className="rounded-full border border-teal-300 bg-teal-50 px-3 py-1.5 text-xs font-medium text-teal-700 hover:bg-teal-100"
                  >
                    已经想好了
                  </button>
                  <button
                    onClick={() => answerHasMajor("no")}
                    className="rounded-full border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
                  >
                    还没想好
                  </button>
                </div>
              )}

              {stage === "ask_major_direct" && (
                <div className="flex flex-wrap gap-2">
                  {MAJORS.map((m) => (
                    <button
                      key={m.value}
                      onClick={() => chooseMajor(m.value, m.label)}
                      className="rounded-full border border-teal-300 bg-teal-50 px-3 py-1.5 text-xs font-medium text-teal-700 hover:bg-teal-100"
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              )}

              {stage === "ask_major_with_intro" && (
                <div className="space-y-2">
                  {MAJORS.map((m) => (
                    <button
                      key={m.value}
                      onClick={() => chooseMajor(m.value, m.label)}
                      className="block w-full rounded-lg border border-slate-200 bg-white p-2 text-left hover:border-teal-300 hover:bg-teal-50"
                    >
                      <div className="text-xs font-medium text-slate-700">{m.label}</div>
                      <div className="text-[11px] text-slate-400">{m.intro}</div>
                    </button>
                  ))}
                </div>
              )}

              {stage === "ask_work_years" && (
                <div className="flex flex-wrap gap-2">
                  {WORK_YEARS_OPTIONS.map((o) => (
                    <button
                      key={o.label}
                      onClick={() => answerWorkYears(o.value, o.label)}
                      className="rounded-full border border-teal-300 bg-teal-50 px-3 py-1.5 text-xs font-medium text-teal-700 hover:bg-teal-100"
                    >
                      {o.label}
                    </button>
                  ))}
                </div>
              )}

              {stage === "ask_region_fulltime" && (
                <div className="space-y-3">
                  <div>
                    <div className="mb-1 text-[11px] text-slate-400">地区</div>
                    <div className="flex flex-wrap gap-2">
                      {REGION_OPTIONS.map((r) => (
                        <button
                          key={r}
                          onClick={() => pickRegion(r)}
                          className={`rounded-full border px-3 py-1.5 text-xs font-medium ${
                            regionPick === r
                              ? "border-teal-600 bg-teal-600 text-white"
                              : "border-teal-300 bg-teal-50 text-teal-700 hover:bg-teal-100"
                          }`}
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="mb-1 text-[11px] text-slate-400">学习方式</div>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { label: "全日制", value: true },
                        { label: "非全日制", value: false },
                      ].map((o) => (
                        <button
                          key={o.label}
                          onClick={() => pickFullTime(o.value)}
                          className={`rounded-full border px-3 py-1.5 text-xs font-medium ${
                            fullTimePick === o.value
                              ? "border-teal-600 bg-teal-600 text-white"
                              : "border-teal-300 bg-teal-50 text-teal-700 hover:bg-teal-100"
                          }`}
                        >
                          {o.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {(stage === "ask_undergrad_input" || stage === "ask_soft_pref") && (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleChatTextSubmit();
                    }}
                    placeholder={stage === "ask_undergrad_input" ? "比如：金融学" : "随便说说你的想法~"}
                    className="flex-1 rounded-md border border-slate-300 px-2 py-1.5 text-sm"
                  />
                  <button
                    onClick={handleChatTextSubmit}
                    className="rounded-md bg-teal-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-teal-700"
                  >
                    发送
                  </button>
                </div>
              )}

              {stage === "done" && (
                <div className="text-xs text-slate-400">聊完啦～完整结果在右侧，可以点开每所学校看推荐理由</div>
              )}
            </div>
          </div>

          {/* 右侧：结果 */}
          <div>
            {!results && (
              <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-400">
                在左边和小助手聊几句，收集齐硬约束后这里会自动出现完整的推荐结果
              </div>
            )}

            {results && totalResults === 0 && (
              <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-400">
                当前条件下没有找到完全匹配的候选院校——候选池为空时不硬凑结果，是我们一直坚持的设计原则，
                <br />
                要不换个条件再聊聊？
              </div>
            )}

            {results && pmMode && (
              <label className="mb-3 flex items-center gap-2 text-xs text-slate-400">
                <input type="checkbox" checked={showDebug} onChange={(e) => setShowDebug(e.target.checked)} />
                显示计算明细
              </label>
            )}

            {results && totalResults > 0 && (
              <>
                {pmMode && (
                  <div className="mb-4 rounded-xl border border-slate-200 bg-white p-3">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-xs font-medium text-slate-500">抽检记录（已标记 {totalMarked} 条）</span>
                      <button
                        onClick={generateAllExplanations}
                        className="rounded-md border border-teal-200 bg-teal-50 px-2 py-1 text-xs font-medium text-teal-700 hover:bg-teal-100"
                      >
                        一键生成全部推荐理由
                      </button>
                    </div>
                    {totalMarked === 0 ? (
                      <div className="text-xs text-slate-400">生成推荐理由后，可以对每条结果做Bad Case标记</div>
                    ) : (
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        {["规则错", "数据错", "表达错", "没问题"].map((c) => (
                          <span key={c} className={`rounded-full px-2 py-1 ${SCHOOL_BADCASE_STYLE[c].bg} ${SCHOOL_BADCASE_STYLE[c].text}`}>
                            {c} {badCaseCounts[c]}
                          </span>
                        ))}
                        {topIssue && (
                          <span className="ml-1 text-slate-500">
                            → 占比最高：<b className={SCHOOL_BADCASE_STYLE[topIssue].text}>{topIssue}</b>，建议优先处理
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                )}
                <div className="rounded-xl border border-slate-200 bg-white p-1">
                  <div className="flex gap-1">
                    {["冲刺", "稳妥", "保底"].map((tier) => (
                      <button
                        key={tier}
                        onClick={() => setActiveTier(tier)}
                        className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium ${
                          activeTier === tier
                            ? `${TIER_STYLE[tier].bg} ${TIER_STYLE[tier].text} ring-1 ${TIER_STYLE[tier].ring}`
                            : "text-slate-400 hover:bg-slate-50"
                        }`}
                      >
                        {tier}档 <span className="text-xs">({results.tiers[tier].length})</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-3 space-y-2">
                  {results.tiers[activeTier].length === 0 ? (
                    <div className="rounded-lg border border-dashed border-slate-200 p-4 text-center text-xs text-slate-400">
                      这一档暂时没有匹配的院校
                    </div>
                  ) : (
                    results.tiers[activeTier].map((s) => (
                      <SchoolCard
                        key={s.id}
                        school={s}
                        explanation={explanations[s.id]}
                        onGenerate={() => generateExplanation(s)}
                        badCaseValue={badCases[s.id]}
                        onMark={(c) => markBadCase(s.id, c)}
                        pmMode={pmMode}
                        feedback={studentFeedback[s.id]}
                        onFeedback={(v) => setFeedback(s.id, v)}
                        favorited={!!favorites[s.id]}
                        onToggleFavorite={() => toggleFavorite(s.id)}
                      />
                    ))
                  )}
                </div>

                <div className="mt-4 rounded-xl border border-slate-200 bg-white p-3">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-500">方案说明</span>
                    {!overallSummary && (
                      <button
                        onClick={generateOverallSummary}
                        className="rounded-md border border-teal-200 bg-teal-50 px-2 py-1 text-xs font-medium text-teal-700 hover:bg-teal-100"
                      >
                        生成方案说明
                      </button>
                    )}
                  </div>
                  {!overallSummary && (
                    <div className="text-xs text-slate-400">点一下，了解这套冲刺/稳妥/保底方案背后的整体思路</div>
                  )}
                  {overallSummary?.loading && <div className="text-xs text-slate-400">生成中...</div>}
                  {overallSummary?.error && <div className="text-xs text-rose-500">生成失败，稍后重试</div>}
                  {overallSummary?.text && (
                    <div className="text-xs leading-relaxed text-slate-600">{overallSummary.text}</div>
                  )}
                </div>

                <div className="mt-4 border-t border-slate-200 pt-4">
                  {contactMode === null && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => setContactMode("choose")}
                        className="flex-1 rounded-md bg-teal-600 py-2 text-sm font-medium text-white hover:bg-teal-700"
                      >
                        预约人工顾问
                      </button>
                      <button
                        onClick={() => setShareText(generateShareText())}
                        className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
                      >
                        分享报告
                      </button>
                    </div>
                  )}

                  {contactMode === "choose" && (
                    <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                      <div className="mb-2 text-xs text-slate-500">留资方式任选一种，顾问会通过对应方式联系你</div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setContactMode("phone")}
                          className="flex-1 rounded-md border border-teal-300 bg-white py-2 text-xs font-medium text-teal-700 hover:bg-teal-50"
                        >
                          留手机号
                        </button>
                        <button
                          onClick={() => setContactMode("wechat")}
                          className="flex-1 rounded-md border border-teal-300 bg-white py-2 text-xs font-medium text-teal-700 hover:bg-teal-50"
                        >
                          加顾问微信
                        </button>
                      </div>
                    </div>
                  )}

                  {contactMode === "phone" && (
                    <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                      <div className="mb-2 text-xs text-slate-500">
                        留下手机号，顾问会尽快联系你（demo演示，不会真实收集）
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="tel"
                          placeholder="请输入手机号"
                          className="flex-1 rounded-md border border-slate-300 px-2 py-1.5 text-sm"
                        />
                        <button
                          onClick={() => {
                            alert("demo演示：已记录留资，顾问会尽快联系～");
                            setContactMode(null);
                          }}
                          className="rounded-md bg-teal-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-teal-700"
                        >
                          提交
                        </button>
                      </div>
                    </div>
                  )}

                  {contactMode === "wechat" && (
                    <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-center">
                      <div className="mx-auto mb-2 flex h-24 w-24 items-center justify-center rounded-lg border border-dashed border-slate-300 bg-white text-[10px] text-slate-300">
                        顾问微信名片（demo占位）
                      </div>
                      <div className="text-xs text-slate-500">长按识别，添加顾问微信</div>
                      <button onClick={() => setContactMode(null)} className="mt-2 text-xs text-slate-400 underline">
                        返回
                      </button>
                    </div>
                  )}

                  {shareText !== null && (
                    <div className="mt-2 rounded-lg border border-slate-200 bg-slate-50 p-3">
                      <div className="mb-2 text-xs text-slate-500">生成的文字版，方便复制发给家人/同学看</div>
                      <pre className="whitespace-pre-wrap rounded-md bg-white p-2 text-xs text-slate-600">{shareText}</pre>
                      <div className="mt-2 flex gap-2">
                        <button
                          onClick={handleCopyShareText}
                          className="rounded-md bg-teal-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-teal-700"
                        >
                          复制
                        </button>
                        <button onClick={() => setShareText(null)} className="text-xs text-slate-400 underline">
                          收起
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}

            {results && pmMode && showDebug && (
              <div className="mt-6 overflow-x-auto rounded-xl border border-slate-200 bg-white p-3">
                <div className="mb-2 text-xs font-medium text-slate-500">计算明细（候选池 {results.candidates.length} 所）</div>
                <table className="w-full text-left text-xs">
                  <thead className="text-slate-400">
                    <tr>
                      <th className="py-1 pr-3">院校</th>
                      <th className="py-1 pr-3">专业匹配</th>
                      <th className="py-1 pr-3">地区偏好</th>
                      <th className="py-1 pr-3">录取概率</th>
                      <th className="py-1 pr-3">城市发展</th>
                      <th className="py-1 pr-3">综合匹配分</th>
                    </tr>
                  </thead>
                  <tbody className="font-mono text-slate-600">
                    {results.candidates.map((s) => (
                      <tr key={s.id} className="border-t border-slate-100">
                        <td className="py-1 pr-3 font-sans">{s.name}</td>
                        <td className="py-1 pr-3">{s.dims.major}</td>
                        <td className="py-1 pr-3">{s.dims.region}</td>
                        <td className="py-1 pr-3">{s.dims.admission}</td>
                        <td className="py-1 pr-3">{s.dims.city}</td>
                        <td className="py-1 pr-3">{s.compositeScore !== undefined ? s.compositeScore.toFixed(1) : "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
      </div>
  );
}

/* ============================================================
   项目二功能区：作文批改（完整OCR核对+评分+转人工逻辑）
   ============================================================ */
function EssayGradingFeature({ onBack }) {
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
        <div className="p-6">
          <div className="mx-auto max-w-5xl">
            <button
              onClick={onBack}
              className="mb-3 flex items-center gap-1 text-xs font-medium text-slate-400 hover:text-teal-600"
            >
              <ChevronLeft className="h-3.5 w-3.5" /> 返回学习
            </button>
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
                        {Object.keys(RUBRIC_WEIGHTS).map((k) => (
                          <DimBar key={k} label={DIM_LABELS[k]} score={finalOutput.dims[k]} weight={RUBRIC_WEIGHTS[k]} />
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
                                badCase === c ? `${ESSAY_BADCASE_STYLE[c].bg} ${ESSAY_BADCASE_STYLE[c].text} border-transparent` : "border-slate-200 text-slate-400 hover:border-slate-300"
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
  );
}
