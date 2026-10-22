(() => {
"use strict";
const MEM = {}; const store = { getItem: k => (k in MEM ? MEM[k] : null), setItem: (k, v) => { MEM[k] = String(v); }, removeItem: k => { delete MEM[k]; } };
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const view = $("#view");
const O = window.OFFICE;
const TODAY = (() => { const d = new Date(); const k = new Date(d.getTime() + (9 * 60 + d.getTimezoneOffset()) * 60000); return iso(k); })();
let YEAR = store.getItem("jsh-year") || "2026";
const baseDate = () => (YEAR === "2027" ? "2027-01-01" : TODAY);

function iso(d) { return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); }
function pd(s) { const [y, m, d] = s.split("-").map(Number); return new Date(y, m - 1, d); }
function addDays(s, n) { const d = pd(s); d.setDate(d.getDate() + n); return iso(d); }
function addMonths(s, n) { const d = pd(s); const day = d.getDate(); d.setDate(1); d.setMonth(d.getMonth() + n); const last = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate(); d.setDate(Math.min(day, last)); return iso(d); }
function diffDays(a, b) { return Math.round((pd(b) - pd(a)) / 86400000); }
function kdate(s) { const d = pd(s); return `${d.getFullYear()}. ${d.getMonth() + 1}. ${d.getDate()}.`; }
const won = n => (isFinite(n) ? Math.round(n).toLocaleString("ko-KR") : "-");
const floor10 = n => Math.floor((n + 1e-6) / 10) * 10;
const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const fmtV = (key, v) => { const u = FIG[key].unit; return u === "%" ? `${v}%` : `${won(v)}원`; };
const toast = msg => { const t = $("#toast"); t.textContent = msg; t.classList.add("on"); clearTimeout(t._t); t._t = setTimeout(() => t.classList.remove("on"), 1800); };
$("#checked").textContent = kdate(META.checked);

/* ---------- Icons ---------- */
const IC = {
  wage: '<svg viewBox="0 0 24 24"><path d="M4 7h16v10H4z"/><circle cx="12" cy="12" r="2.5"/></svg>',
  clock: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
  cal: '<svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>',
  exit: '<svg viewBox="0 0 24 24"><path d="M14 4h5v16h-5M10 8l-4 4 4 4M6 12h10"/></svg>',
  shield: '<svg viewBox="0 0 24 24"><path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/></svg>',
  umb: '<svg viewBox="0 0 24 24"><path d="M3 12a9 9 0 0118 0zM12 12v6a2 2 0 004 0"/></svg>',
  baby: '<svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M5 21c1-4 4-6 7-6s6 2 7 6"/></svg>',
  bell: '<svg viewBox="0 0 24 24"><path d="M6 16V11a6 6 0 0112 0v5l2 2H4zM10 21h4"/></svg>',
  gavel: '<svg viewBox="0 0 24 24"><path d="M14 4l6 6M11 7l6 6M4 20l8-8M9 9l6 6"/></svg>',
  people: '<svg viewBox="0 0 24 24"><circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c.8-3.5 3.4-5 6.5-5s5.7 1.5 6.5 5M16 4.5a3.5 3.5 0 010 7M18 15c2 .6 3.2 2.3 3.5 5"/></svg>',
  hard: '<svg viewBox="0 0 24 24"><path d="M3 18h18M5 18v-3a7 7 0 0114 0v3M10 8V5h4v3"/></svg>',
  store: '<svg viewBox="0 0 24 24"><path d="M4 9l1-5h14l1 5M4 9v11h16V9M4 9h16M9 20v-6h6v6"/></svg>',
  coin: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M8 9l2 7 2-5 2 5 2-7"/></svg>'
};

const FI = {
  calc: '<svg viewBox="0 0 32 32"><rect x="6" y="3" width="20" height="26" rx="4" class="d"/><rect x="6" y="3" width="20" height="26" rx="4"/><rect x="9.5" y="6.5" width="13" height="6" rx="1.5" class="f"/><circle cx="11" cy="17" r="1.3" class="f"/><circle cx="16" cy="17" r="1.3" class="f"/><circle cx="21" cy="17" r="1.3" class="f"/><circle cx="11" cy="21.5" r="1.3" class="f"/><circle cx="16" cy="21.5" r="1.3" class="f"/><circle cx="11" cy="26" r="1.3" class="f"/><circle cx="16" cy="26" r="1.3" class="f"/><rect x="19.7" y="20.2" width="2.6" height="7.1" rx="1.3" class="f"/></svg>',
  grant: '<svg viewBox="0 0 32 32"><ellipse cx="13" cy="23" rx="8" ry="3" class="d"/><path d="M5 23v3c0 1.7 3.6 3 8 3s8-1.3 8-3v-3"/><ellipse cx="13" cy="23" rx="8" ry="3"/><path d="M5 17.5v3c0 1.7 3.6 3 8 3"/><ellipse cx="13" cy="17.5" rx="8" ry="3" class="d"/><ellipse cx="13" cy="17.5" rx="8" ry="3"/><circle cx="22.5" cy="10" r="6.5" class="bg"/><circle cx="22.5" cy="10" r="6.5" class="d"/><circle cx="22.5" cy="10" r="6.5"/><path d="M19.8 7.5l1.2 5 1.5-3.5 1.5 3.5 1.2-5M19.3 10h6.4"/></svg>',
  clock: '<svg viewBox="0 0 32 32"><rect x="3.5" y="6" width="20" height="19" rx="3.5" class="d"/><rect x="3.5" y="6" width="20" height="19" rx="3.5"/><path d="M3.5 11.5h20M9 3.5v5M18 3.5v5"/><rect x="7" y="15" width="3" height="3" rx=".8" class="f"/><rect x="12" y="15" width="3" height="3" rx=".8" class="f"/><rect x="7" y="19.5" width="3" height="3" rx=".8" class="f"/><circle cx="23" cy="22.5" r="6.5" class="bg"/><circle cx="23" cy="22.5" r="6.5" class="d"/><circle cx="23" cy="22.5" r="6.5"/><path d="M23 19.3v3.5l2.3 1.6"/></svg>',
  people: '<svg viewBox="0 0 32 32"><circle cx="11" cy="11" r="4.5" class="d"/><circle cx="11" cy="11" r="4.5"/><path d="M3 26.5c.6-4.6 3.8-7.5 8-7.5s7.4 2.9 8 7.5z" class="d"/><path d="M3 26.5c.6-4.6 3.8-7.5 8-7.5s7.4 2.9 8 7.5"/><path d="M18.5 4.5h9a1.5 1.5 0 011.5 1.5v6a1.5 1.5 0 01-1.5 1.5h-5l-3.5 3v-3h-.5A1.5 1.5 0 0117 12V6a1.5 1.5 0 011.5-1.5z" class="d"/><path d="M18.5 4.5h9a1.5 1.5 0 011.5 1.5v6a1.5 1.5 0 01-1.5 1.5h-5l-3.5 3v-3h-.5A1.5 1.5 0 0117 12V6a1.5 1.5 0 011.5-1.5z"/><path d="M23 6.8v2.6"/><circle cx="23" cy="11.4" r=".9" class="f"/></svg>',
  hard: '<svg viewBox="0 0 32 32"><path d="M5 21a11 11 0 0122 0z" class="d"/><path d="M5 21a11 11 0 0122 0"/><path d="M13 11.2V8.5a1.5 1.5 0 011.5-1.5h3A1.5 1.5 0 0119 8.5v2.7M16 7v7"/><rect x="3" y="21" width="26" height="4" rx="2" class="f2"/><rect x="3" y="21" width="26" height="4" rx="2"/><path d="M9.5 14.5c-.8 1.3-1.3 3-1.5 4.5M22.5 14.5c.8 1.3 1.3 3 1.5 4.5"/></svg>'
};
/* ---------- Calculators ---------- */
const money = (name, label, val = "", hint = "") => `<label class="fld"><span>${label}${hint ? ` <small>${hint}</small>` : ""}</span><div class="inp"><input class="has-u" name="${name}" inputmode="numeric" data-money value="${val ? won(val) : ""}" placeholder="0" autocomplete="off"><i class="u" style="font-style:normal">원</i></div></label>`;
const numF = (name, label, val = "", unit = "", hint = "", step = "any") => `<label class="fld"><span>${label}${hint ? ` <small>${hint}</small>` : ""}</span><div class="inp"><input class="${unit ? "has-u" : ""}" name="${name}" type="number" inputmode="decimal" step="${step}" min="0" value="${val}"><i class="u" style="font-style:normal">${unit}</i></div></label>`;
const dateF = (name, label, val, hint = "") => `<label class="fld"><span>${label}${hint ? ` <small>${hint}</small>` : ""}</span><div class="inp"><input name="${name}" type="date" value="${val}"></div></label>`;
const optF = (name, label, opts, val, cls = "full") => `<div class="fld ${cls}"><span>${label}</span><div class="opts" role="radiogroup" aria-label="${label}">${opts.map(([v, t]) => `<label class="opt"><input type="radio" name="${name}" value="${v}" ${String(v) === String(val) ? "checked" : ""}><span>${t}</span></label>`).join("")}</div></div>`;
const selF = (name, label, opts, val) => `<label class="fld"><span>${label}</span><div class="inp"><select name="${name}">${opts.map(([v, t]) => `<option value="${v}" ${String(v) === String(val) ? "selected" : ""}>${t}</option>`).join("")}</select></div></label>`;

const CALCS = [
  { id: "minwage", grp: "임금", name: "최저임금 위반 확인", ic: "wage", desc: "월급을 시급으로 환산해 최저임금 미달 여부와 부족액을 확인합니다.",
    form: d => `${money("pay", "월 지급액", 2300000, "최저임금 산입 임금 기준")}${numF("wh", "주 소정근로시간", 40, "시간")}${optF("probe", "수습 여부", [["0", "해당 없음"], ["1", "수습 3개월 이내(1년 이상 계약)"]], "0")}`,
    calc(f, d) {
      const wh = +f.wh || 0, pay = f.pay;
      const hh = wh >= 15 ? Math.min(wh, 40) / 40 * 8 : 0;
      const mh = Math.round((wh + hh) * 365 / 7 / 12);
      const mw = getV("mw_h", d) * (f.probe === "1" ? 0.9 : 1);
      const hr = mh ? pay / mh : 0;
      const need = Math.ceil(mw * mh);
      const ok = hr >= mw;
      return { label: "환산 시급", value: won(hr), unit: "원",
        rows: [["월 소정근로시간(주휴 포함)", `${mh}시간`], [`적용 최저임금${f.probe === "1" ? "(90%)" : ""}`, `${won(mw)}원`], ["최저임금 기준 월 필요액", `${won(need)}원`], ["차액", `${ok ? "+" : "−"}${won(Math.abs(pay - need))}원`]],
        alert: ok ? ["good", "최저임금 이상입니다."] : ["bad", `월 ${won(need - pay)}원이 부족합니다. 미달 차액은 3년간 청구될 수 있습니다.`],
        notes: ["2024년부터 정기상여금·현금성 복리후생비는 전액 최저임금에 산입됩니다.", "수습 감액은 1년 이상 계약 + 수습 3개월 이내 + 단순노무직 제외일 때만 가능합니다."] };
    } },
  { id: "overtime", grp: "임금", name: "연장·야간·휴일수당", ic: "clock", desc: "통상시급과 근로시간으로 가산수당을 계산합니다. 5인 미만은 가산이 없습니다.",
    form: d => `${money("hw", "통상시급", getV("mw_h", d))}${optF("size", "사업장 규모", [["5", "상시 5인 이상"], ["4", "5인 미만"]], "5", "")}${numF("ot", "연장근로", 10, "시간", "월 합계")}${numF("nt", "야간근로(22~06시)", 0, "시간")}${numF("h8", "휴일근로 8시간 이내", 0, "시간")}${numF("h9", "휴일근로 8시간 초과", 0, "시간")}`,
    calc(f) {
      const w = f.hw, big = f.size === "5";
      const ot = (+f.ot || 0) * w * (big ? 1.5 : 1), nt = (+f.nt || 0) * w * (big ? 0.5 : 0), h8 = (+f.h8 || 0) * w * (big ? 1.5 : 1), h9 = (+f.h9 || 0) * w * (big ? 2 : 1);
      return { label: "수당 합계", value: won(ot + nt + h8 + h9), unit: "원",
        rows: [[`연장수당(${big ? "150" : "100"}%)`, won(ot) + "원"], [`야간 가산(${big ? "50" : "0"}%)`, won(nt) + "원"], [`휴일 8h 이내(${big ? "150" : "100"}%)`, won(h8) + "원"], [`휴일 8h 초과(${big ? "200" : "100"}%)`, won(h9) + "원"]],
        alert: big ? null : ["info", "5인 미만 사업장은 근로기준법 제56조 가산임금이 적용되지 않아 실제 근로시간분만 지급합니다."],
        notes: ["야간근로는 근로시간 자체 임금과 별도로 50% 가산분만 표시했습니다.", "포괄임금 약정이 있어도 실제 수당이 약정액을 넘으면 차액을 지급해야 합니다."] };
    } },
  { id: "weekly", grp: "임금", name: "주휴수당", ic: "cal", desc: "주 15시간 이상 근무하고 소정근로일을 개근한 근로자의 주휴수당입니다.",
    form: d => `${money("hw", "시급", getV("mw_h", d))}${numF("wh", "주 소정근로시간", 20, "시간")}`,
    calc(f) {
      const wh = +f.wh || 0; const h = wh >= 15 ? Math.min(wh, 40) / 40 * 8 : 0; const p = h * f.hw;
      return { label: "1주 주휴수당", value: won(p), unit: "원", rows: [["주휴시간", `${+h.toFixed(2)}시간`], ["월 환산(×4.345주)", `${won(p * 4.345)}원`]],
        alert: wh < 15 ? ["warn", "주 소정근로시간 15시간 미만은 주휴일이 발생하지 않습니다(제18조 제3항)."] : null,
        notes: ["주휴시간 = 주 소정근로시간 ÷ 40 × 8 (최대 8시간)"] };
    } },
  { id: "severance", grp: "퇴직", name: "퇴직금", ic: "exit", desc: "평균임금 × 30일 × 재직일수/365. 통상임금이 더 크면 통상임금 기준으로 계산합니다.",
    form: d => `${dateF("s", "입사일", addDays(TODAY, -365 * 3 - 1))}${dateF("e", "마지막 근무일", TODAY)}${money("w3", "최근 3개월 임금총액", 9000000, "세전")}${money("bonus", "연간 상여금", 0, "최근 1년")}${money("leave", "연차수당", 0, "전년도 미사용분")}${money("ord", "월 통상임금", 0, "선택")}`,
    calc(f) {
      if (!f.s || !f.e || f.e < f.s) return { err: "입사일과 마지막 근무일을 확인해 주세요." };
      const svc = diffDays(f.s, f.e) + 1;
      const pStart = addMonths(addDays(f.e, 1), -3);
      const pdays = diffDays(pStart, f.e) + 1;
      const avg = (f.w3 + f.bonus * 3 / 12 + f.leave * 3 / 12) / pdays;
      const ordD = f.ord ? f.ord / 209 * 8 : 0;
      const base = Math.max(avg, ordD);
      const sev = base * 30 * svc / 365;
      const r = { label: "예상 퇴직금", value: won(sev), unit: "원",
        rows: [["재직일수", `${won(svc)}일 (약 ${(svc / 365).toFixed(1)}년)`], ["평균임금 산정기간", `${kdate(pStart)} ~ ${kdate(f.e)} (${pdays}일)`], ["1일 평균임금", `${won(avg)}원`], ...(ordD ? [["1일 통상임금", `${won(ordD)}원`]] : []), ["적용 1일 임금", `${won(base)}원${ordD > avg ? " (통상임금)" : ""}`]],
        notes: ["퇴직금은 퇴직일부터 14일 이내 지급해야 하며, 당사자 합의로 기일을 연장할 수 있습니다.", "산정기간 중 휴업·육아휴직·산재 요양 기간 등은 제외 대상이므로 별도 검토가 필요합니다.", "세전 금액이며 퇴직소득세가 원천징수됩니다."] };
      if (svc < 365) r.alert = ["warn", "계속근로기간 1년 미만은 퇴직금 지급 의무가 없습니다(주 15시간 이상 요건 포함)."];
      return r;
    } },
  { id: "annual", grp: "퇴직", name: "연차유급휴가", ic: "cal", desc: "입사일 기준 연차 발생일수와 향후 발생 일정을 보여줍니다.",
    form: d => `${dateF("s", "입사일", addDays(TODAY, -400))}${dateF("t", "확인 기준일", TODAY)}`,
    calc(f) {
      if (!f.s || !f.t || f.t < f.s) return { err: "날짜를 확인해 주세요." };
      let yrs = 0; while (addMonths(f.s, 12 * (yrs + 1)) <= f.t) yrs++;
      let main, sub;
      if (yrs < 1) { let m = 0; while (addMonths(f.s, m + 1) <= f.t) m++; main = Math.min(m, 11); sub = `입사 1년 미만: 1개월 개근 시 1일씩 (현재 ${m}개월 경과)`; }
      else { main = Math.min(15 + Math.floor((yrs - 1) / 2), 25); sub = `근속 ${yrs}년차 연차 (${kdate(addMonths(f.s, 12 * yrs))} 발생)`; }
      const rows = [];
      for (let i = Math.max(1, yrs); i < Math.max(1, yrs) + 5; i++) rows.push([`${kdate(addMonths(f.s, 12 * i))} (${i}년 근속)`, `${Math.min(15 + Math.floor((i - 1) / 2), 25)}일`]);
      return { label: yrs < 1 ? "현재까지 발생" : "올해 연차", value: main, unit: "일", rows: [["기준", sub], ...rows],
        notes: ["1년간 80% 이상 출근 기준입니다. 80% 미만이면 개근한 달마다 1일이 발생합니다.", "1년 계약직은 최대 11일입니다(366일째 근로관계 존속 시 15일 추가).", "5인 미만 사업장은 연차 규정이 적용되지 않습니다."] };
    } },
  { id: "notice", grp: "퇴직", name: "해고예고수당", ic: "bell", desc: "30일 전 예고 없이 해고하면 30일분 이상 통상임금을 지급해야 합니다.",
    form: d => `${money("ord", "월 통상임금", 2600000)}${numF("dh", "1일 소정근로시간", 8, "시간")}${numF("given", "실제 예고일수", 0, "일", "예고 없으면 0")}${optF("short", "근속 3개월 미만", [["0", "아니오"], ["1", "예"]], "0")}`,
    calc(f) {
      const daily = f.ord / 209 * (+f.dh || 8);
      const pay = (+f.given || 0) >= 30 ? 0 : daily * 30;
      return { label: "해고예고수당", value: won(f.short === "1" ? 0 : pay), unit: "원", rows: [["1일 통상임금", `${won(daily)}원`], ["예고일수", `${+f.given || 0}일`]],
        alert: f.short === "1" ? ["info", "계속 근로한 기간이 3개월 미만이면 해고예고 적용이 제외됩니다(제26조 단서)."] : (+f.given >= 30 ? ["good", "30일 이상 예고하여 예고수당이 발생하지 않습니다."] : ["warn", "30일 미만 예고 시에도 30일분 전액을 지급해야 합니다."]),
        notes: ["해고예고수당 지급과 별개로 해고의 정당성(제23조)은 따로 판단됩니다."] };
    } },
  { id: "ins", grp: "보험", name: "4대보험료", ic: "shield", desc: "월 보수 기준 근로자·사업주 부담액을 계산합니다. 상단 연도 전환으로 2027년 요율도 확인됩니다.",
    form: d => `${money("pay", "월 보수(비과세 제외)", 3000000)}${selF("sz", "고용안정·직능개발 구분", [["0.25", "150인 미만"], ["0.45", "150인 이상 우선지원대상"], ["0.65", "150~1,000인 미만"], ["0.85", "1,000인 이상"]], "0.25")}${numF("ia", "산재보험 요율", getV("ia_avg", d), "%", "업종별 상이", "0.01")}`,
    calc(f, d) {
      const np = getV("np_rate", d), hi = getV("hi_rate", d), ltc = getV("ltc_rate", d);
      const npBase = Math.min(Math.max(f.pay, getV("np_lower", d)), getV("np_upper", d));
      const npE = floor10(npBase * np / 100 / 2), hiE = floor10(f.pay * hi / 100 / 2), ltE = floor10(hiE * ltc / hi), eiE = floor10(f.pay * 0.009);
      const eiC = floor10(f.pay * (0.009 + (+f.sz) / 100)), iaC = floor10(f.pay * (+f.ia || 0) / 100);
      const emp = npE + hiE + ltE + eiE, com = npE + hiE + ltE + eiC + iaC;
      const pend = getEntry("ltc_rate", d).status === "pending";
      return { label: "근로자 부담 합계", value: won(emp), unit: "원", side: `사업주 부담 ${won(com)}원`,
        rows: [[`국민연금 ${np / 2}%`, `${won(npE)}원 / ${won(npE)}원`], [`건강보험 ${(hi / 2).toFixed(3)}%`, `${won(hiE)}원 / ${won(hiE)}원`], [`장기요양 ${ltc}%${pend ? " (미정)" : ""}`, `${won(ltE)}원 / ${won(ltE)}원`], ["고용보험", `${won(eiE)}원 / ${won(eiC)}원`], [`산재보험 ${f.ia}%`, `0원 / ${won(iaC)}원`], ["합계 (근로자 / 사업주)", `${won(emp)}원 / ${won(com)}원`]],
        alert: pend ? ["warn", "2027년 장기요양보험료율은 아직 결정되지 않아 2026년 요율을 임시 적용했습니다."] : null,
        notes: [`국민연금 기준소득월액 ${won(getV("np_lower", d))}원~${won(getV("np_upper", d))}원 범위 적용`, "공단 고지액과 원 단위 절사 방식에 따라 소액 차이가 있을 수 있습니다."] };
    } },
  { id: "ui", grp: "보험", name: "실업급여(구직급여)", ic: "umb", desc: "이직 전 3개월 평균임금의 60%, 상·하한액과 소정급여일수를 적용합니다.",
    form: d => `${dateF("e", "이직일(마지막 근무일)", baseDate())}${money("w3", "이직 전 3개월 임금총액", 9000000)}${selF("yr", "고용보험 가입기간", window.UI_DAYS.map((r, i) => [i, r.lbl]), 2)}${optF("old", "이직일 당시 50세 이상 또는 장애인", [["0", "아니오"], ["1", "예"]], "0", "")}${numF("dh", "1일 소정근로시간", 8, "시간")}`,
    calc(f) {
      if (!f.e) return { err: "이직일을 입력해 주세요." };
      const pStart = addMonths(addDays(f.e, 1), -3), days = diffDays(pStart, f.e) + 1;
      const base = f.w3 / days, raw = base * 0.6;
      const mx = getV("ui_max", f.e), mn = Math.round(getV("mw_h", f.e) * 0.8 * (+f.dh || 8));
      const daily = Math.max(Math.min(raw, mx), mn);
      const n = window.UI_DAYS[+f.yr].v[f.old === "1" ? 1 : 0];
      const fut = f.e >= "2027-01-01";
      return { label: "1일 구직급여", value: won(daily), unit: "원", side: `총 ${won(daily * n)}원 · ${n}일`,
        rows: [["평균임금(1일)", `${won(base)}원 (${days}일 기준)`], ["평균임금 × 60%", `${won(raw)}원`], ["상한 / 하한", `${won(mx)}원 / ${won(mn)}원`], ["소정급여일수", `${n}일`], ["월 환산(30일)", `${won(daily * 30)}원`]],
        alert: fut ? ["warn", "2027년 이직분은 최저임금 인상으로 하한(68,480원)이 현행 상한(68,100원)을 넘습니다. 상한 연동 개정안이 입법예고 중이어서 금액이 바뀔 수 있습니다."] : null,
        notes: ["수급요건: 이직 전 18개월 중 피보험단위기간 180일 이상, 비자발적 이직 등", "수급기간은 이직일 다음 날부터 12개월이며, 대기기간 7일은 지급하지 않습니다."] };
    } },
  { id: "parental", grp: "출산·육아", name: "육아휴직급여", ic: "baby", desc: "2025년 개편 기준. 1~3개월 100%(250만원), 4~6개월 100%(200만원), 7개월부터 80%(160만원).",
    form: d => `${money("ord", "월 통상임금", 3200000)}${numF("m", "사용 개월수", 12, "개월", "최대 18", "1")}${optF("ss", "6+6 부모 함께 육아휴직", [["0", "해당 없음"], ["1", "자녀 생후 18개월 내 부모 모두 사용"]], "0")}`,
    calc(f) {
      const m = Math.min(Math.max(+f.m || 0, 0), 18); const ss = [2500000, 2500000, 3000000, 3500000, 4000000, 4500000];
      let tot = 0; const list = [];
      for (let i = 1; i <= m; i++) {
        let v;
        if (f.ss === "1" && i <= 6) v = Math.min(f.ord, ss[i - 1]);
        else if (i <= 3) v = Math.min(f.ord, 2500000);
        else if (i <= 6) v = Math.min(f.ord, 2000000);
        else v = Math.min(f.ord * 0.8, 1600000);
        v = Math.max(v, 700000); tot += v; list.push(v);
      }
      const grp = []; let i = 0; while (i < list.length) { let j = i; while (j + 1 < list.length && list[j + 1] === list[i]) j++; grp.push([`${i + 1}${j > i ? "~" + (j + 1) : ""}개월`, `월 ${won(list[i])}원`]); i = j + 1; }
      return { label: "총 육아휴직급여", value: won(tot), unit: "원", rows: grp,
        notes: ["하한 월 70만원. 사후지급금은 2025년 폐지되어 전액 휴직 중 지급됩니다.", "부모 각각 3개월 이상 사용 등 요건 충족 시 최대 1년 6개월까지 사용할 수 있습니다.", "사업주는 육아휴직지원금(월 30만원, 특례 월 100만원)을 별도로 받을 수 있습니다."] };
    } },
  { id: "maternity", grp: "출산·육아", name: "출산전후휴가급여", ic: "baby", desc: "90일(다태아 120일) 통상임금 100%, 정부 지원 상한은 월 220만원입니다.",
    form: d => `${money("ord", "월 통상임금", 3000000)}${optF("multi", "자녀 수", [["0", "단태아(90일)"], ["1", "다태아(120일)"]], "0", "")}${optF("pref", "기업 구분", [["1", "우선지원대상기업"], ["0", "대규모기업"]], "1", "")}`,
    calc(f, d) {
      const cap = getV("mat_cap", d), mo = f.multi === "1" ? 4 : 3, paidMo = f.multi === "1" ? 2.5 : 2;
      const gov = f.pref === "1" ? Math.min(f.ord, cap) * mo : Math.min(f.ord, cap) * (mo - paidMo);
      const comp = f.pref === "1" ? Math.max(f.ord - cap, 0) * paidMo : f.ord * paidMo;
      return { label: "고용보험 지급액(정부)", value: won(gov), unit: "원", side: `사업주 부담 ${won(comp)}원`,
        rows: [["휴가기간", `${mo * 30}일`], ["근로자 수령 총액", `${won(f.ord * paidMo + Math.min(f.ord, cap) * (mo - paidMo))}원`], ["월 상한", `${won(cap)}원`]],
        notes: [`최초 ${f.multi === "1" ? 75 : 60}일은 유급휴가로 사업주가 통상임금을 지급하며, 우선지원대상기업은 이 중 월 ${won(cap)}원까지 정부가 지원합니다.`, "마지막 30일(다태아 45일)은 고용보험에서 상한 범위 내 지급하며 초과분은 사업주 지급 의무가 없습니다."] };
    } },
  { id: "deadline", grp: "권리구제", name: "노동사건 기한 계산", ic: "gavel", desc: "해고·퇴직·판정서 수령일 등 기준일로부터 놓치면 안 되는 법정 기한을 정리합니다.",
    form: d => `${selF("ev", "기준 사건", [["dismiss", "해고(통보 받은 날)"], ["retire", "퇴직(마지막 근무일)"], ["first", "지방노동위 판정서 받은 날"], ["review", "중앙노동위 재심판정서 받은 날"], ["accident", "산업재해 발생"], ["discrim", "차별적 처우 종료일"]], "dismiss")}${dateF("dt", "기준일", TODAY)}`,
    calc(f) {
      if (!f.dt) return { err: "기준일을 입력해 주세요." };
      const L = {
        dismiss: [["부당해고 구제신청(노동위원회)", addDays(addMonths(f.dt, 3), -1), "근로기준법 제28조, 해고일부터 3개월"], ["해고예고수당 청구 소멸시효", addDays(addMonths(f.dt, 36), -1), "3년"], ["실업급여 수급기간 만료", addDays(addMonths(addDays(f.dt, 1), 12), -1), "이직일 다음 날부터 12개월"]],
        retire: [["금품청산(임금·퇴직금 지급)", addDays(f.dt, 14), "근로기준법 제36조, 14일 이내"], ["실업급여 수급기간 만료", addDays(addMonths(addDays(f.dt, 1), 12), -1), "고용보험법 제48조"], ["임금·퇴직금 소멸시효", addDays(addMonths(f.dt, 36), 0), "근로기준법 제49조, 퇴직급여법 제10조 3년"]],
        first: [["재심신청(중앙노동위원회)", addDays(f.dt, 10), "판정서 송달일부터 10일"]],
        review: [["행정소송 제기", addDays(f.dt, 15), "재심판정서 송달일부터 15일"]],
        accident: [["요양·휴업급여 청구 소멸시효", addDays(addMonths(f.dt, 36), 0), "산재보험법 제112조, 3년(지급사유 발생일 기준)"], ["장해·유족급여·장례비 청구 소멸시효", addDays(addMonths(f.dt, 60), 0), "5년"], ["산업재해조사표 제출(사업주)", addDays(addMonths(f.dt, 1), 0), "3일 이상 휴업 재해, 발생일부터 1개월"]],
        discrim: [["차별시정 신청(노동위원회)", addDays(addMonths(f.dt, 6), -1), "기간제법 제9조, 6개월"]]
      }[f.ev];
      const rows = L.map(([t, dd, b]) => { const k = diffDays(TODAY, dd); return [`${t}<br><small class="src">${b}</small>`, `${kdate(dd)}<br><small class="src">${k >= 0 ? "D-" + k : "기한 경과 " + -k + "일"}</small>`]; });
      const first = L[0]; const k = diffDays(TODAY, first[1]);
      return { label: first[0], value: k >= 0 ? `D-${k}` : "기한 경과", unit: "", side: kdate(first[1]), rows, html: true,
        alert: k >= 0 && k <= 14 ? ["bad", "기한이 2주 이내로 남았습니다. 서둘러 상담받으세요."] : null,
        notes: ["실제 기산점은 통지 방식·송달일에 따라 달라질 수 있어 사건별 확인이 필요합니다."] };
    } }
];

/* ---------- Diagnostics ---------- */
const CHECKS = {
  harass: { name: "직장 내 괴롭힘 자가진단", ic: "people", desc: "근로기준법 제76조의2의 세 가지 요소를 기준으로 상황을 점검합니다." },
  sapa: { name: "중대재해처벌법 의무 점검", ic: "hard", desc: "상시근로자 5인 이상 사업장의 안전보건관리체계 구축 의무(시행령 제4조)를 점검합니다." },
  small: { name: "5인 미만 사업장 적용 법규", ic: "store", desc: "상시근로자 5인 미만 사업장에 적용되는 근로기준법 규정과 제외 규정입니다." }
};
const HQ = {
  a: [["상급자·관리자의 행위", "직급·직책상 우위"], ["다수 직원이 함께 한 행위", "수적 우위"], ["정규직이 비정규직에게, 또는 근속·전문성·노조 등 관계상 우위", "관계상 우위"], ["사용자(대표) 또는 사용자의 친족 직원의 행위", "2021.10. 이후 과태료 대상"]],
  b: [["폭언·욕설·모욕적 언행", ""], ["업무와 무관한 사적 심부름 강요", ""], ["정당한 이유 없는 업무 배제·대기발령", ""], ["달성 불가능한 업무 지시, 과도한 업무 몰아주기", ""], ["집단 따돌림·의도적 무시", ""], ["CCTV·메신저 등을 통한 과도한 감시", ""], ["회식·음주 강요, 신체적 위협·폭행", ""], ["반복적인 공개 질책·인격 비하", ""]],
  c: [["정신적 고통으로 진료·상담을 받았거나 필요함", ""], ["출근이 두렵거나 업무 수행이 어려워짐", ""], ["퇴사·전보를 고민하게 됨", ""]]
};
const SQ = [["안전·보건 목표와 경영방침 수립", "제4조 제1호"], ["안전·보건 전담조직 설치(해당 규모)", "제2호, 상시 500인 이상 등"], ["유해·위험요인 확인·개선 절차 마련 및 반기 1회 점검", "제3호"], ["안전·보건 예산 편성 및 용도대로 집행", "제4호"], ["안전보건관리책임자 등에게 권한·예산 부여, 반기 평가", "제5호"], ["안전관리자·보건관리자 등 전문인력 배치", "제6호"], ["종사자 의견 청취 절차 마련 및 반기 점검", "제7호"], ["중대산업재해 대비 작업중지·대피·구호 매뉴얼", "제8호"], ["도급·용역 시 수급인 안전보건 평가 기준·절차", "제9호"]];

/* ---------- Routing ---------- */
const ROUTES = { home: "홈", graph: "지식 그래프", calc: "계산기", grants: "지원금", check: "진단", table: "기준표", ask: "상담" };
const TABS = [["home", "홈", "M3 11l9-7 9 7v9a1 1 0 01-1 1h-5v-6H9v6H4a1 1 0 01-1-1z"], ["calc", "계산기", "M5 3h14v18H5zM8 7h8M8 12h2M14 12h2M8 16h2M14 16h2"], ["grants", "지원금", "M12 3a9 9 0 110 18 9 9 0 010-18zM8 9l2 7 2-5 2 5 2-7"], ["check", "진단", "M9 11l2 2 4-4M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"], ["ask", "상담", "M4 5h16v11H8l-4 4z"]];
$("#tabbar").innerHTML = TABS.map(([r, t, p]) => `<a href="#${r}" data-r="${r}"><svg viewBox="0 0 24 24"><path d="${p}"/></svg>${t}</a>`).join("");

function route() {
  const [r = "home", sub] = location.hash.replace(/^#/, "").split("/");
  const R = ROUTES[r] ? r : "home";
  $$("[data-r]").forEach(a => a.dataset.r === R ? a.setAttribute("aria-current", "page") : a.removeAttribute("aria-current"));
  $("#pageTitle").textContent = ROUTES[R];
  document.title = `${ROUTES[R]} | 노무 워크스페이스 · 조성현노동법률컨설팅`;
  view.classList.remove("wide"); stopSky(); destroyGraphs();
  ({ home: renderHome, graph: renderGraph, calc: renderCalc, grants: renderGrants, check: renderCheck, table: renderTable, ask: renderAsk })[R](sub);
  window.scrollTo({ top: 0 });
}
window.addEventListener("hashchange", route);

/* ---------- Year toggle ---------- */
function syncSeg() { $$(".seg button").forEach(b => b.setAttribute("aria-checked", b.dataset.y === YEAR)); }
$$(".seg button").forEach(b => b.addEventListener("click", () => { YEAR = b.dataset.y; store.setItem("jsh-year", YEAR); syncSeg(); route(); toast(YEAR === "2027" ? "2027년 1월 1일 기준으로 보여드립니다" : "오늘 기준으로 보여드립니다"); }));
syncSeg();

/* ---------- Theme ---------- */
$("#theme").addEventListener("click", () => { const r = document.documentElement; r.dataset.theme = r.dataset.theme === "light" ? "dark" : "light"; document.querySelector('meta[name="theme-color"]').content = r.dataset.theme === "light" ? "#f7f8fa" : "#070c12"; });

/* ---------- Home ---------- */
function upcoming(n = 4) {
  const out = []; const t = pd(TODAY);
  for (let k = 0; k < 3; k++) {
    const y = t.getFullYear(), m = t.getMonth() + k; const base = new Date(y, m, 1);
    const yy = base.getFullYear(), mm = base.getMonth() + 1; const last = new Date(yy, mm, 0).getDate();
    CAL_MONTHLY.forEach(e => out.push({ ...e, date: iso(new Date(yy, mm - 1, Math.min(e.d, last))) }));
    CAL_ANNUAL.filter(e => e.m === mm).forEach(e => out.push({ ...e, date: iso(new Date(yy, mm - 1, Math.min(e.d, last))) }));
  }
  return out.filter(e => e.date >= TODAY).sort((a, b) => a.date < b.date ? -1 : 1).slice(0, n);
}
function starsSVG(n = 90) { let r = 7, o = ""; const rnd = () => (r = (r * 9301 + 49297) % 233280) / 233280; for (let i = 0; i < n; i++) { const x = (rnd() * 100).toFixed(2), y = (rnd() * 100).toFixed(2), s = (rnd() * 1.1 + .3).toFixed(2), op = (rnd() * .6 + .2).toFixed(2); o += `<circle cx="${x}%" cy="${y}%" r="${s}" fill="#fff" opacity="${op}"/>`; } return `<svg class="stars" aria-hidden="true">${o}</svg>`; }
/* ---------- 노무 지식 그래프 (사이트 데이터에서 자동 생성 · 실시간 물리 시뮬레이션) ---------- */
const KGT = { core: ["노무 워크스페이스", "#0a1622"], hub: ["분류", "#3b8089"], calc: ["계산기", "#47a2b2"], check: ["자가진단", "#7c5cff"], grant: ["지원금", "#c27803"], post: ["칼럼", "#8796a7"] };
let _KG = null;
function KG() {
  if (_KG) return _KG;
  const N = [], E = [], M = {}, add = (id, t, type, h, extra = {}) => { if (M[id]) return M[id]; const n = { id, t, type, h, ...extra }; M[id] = n; N.push(n); return n; }, link = (a, b) => { if (M[a] && M[b] && a !== b && !E.some(e => (e[0] === a && e[1] === b) || (e[0] === b && e[1] === a))) E.push([a, b]); };
  add("core", "노무 워크스페이스", "core", "#home", { d: "계산·진단·지원금·칼럼이 하나로 연결된 노무 지식 지도입니다." });
  [...new Set(CALCS.map(c => c.grp))].forEach(g => { add("h:" + g, g, "hub", "#calc/" + CALCS.find(c => c.grp === g).id, { d: g + " 관련 계산기 묶음" }); link("core", "h:" + g); });
  [["h:진단", "자가진단", "#check/harass"], ["h:지원금", "정부지원금", "#grants"], ["h:칼럼", "노무 칼럼", O.blog]].forEach(([id, t, h]) => { add(id, t, "hub", h, { d: t + " 묶음" }); link("core", id); });
  CALCS.forEach(c => { add(c.id, c.name, "calc", "#calc/" + c.id, { d: c.desc }); link("h:" + c.grp, c.id); });
  Object.entries(CHECKS).forEach(([k, c]) => { add("ck:" + k, c.name, "check", "#check/" + k, { d: c.desc, key: k }); link("h:진단", "ck:" + k); });
  GRANTS.forEach(g => { add("g:" + g.id, g.name, "grant", "#grants", { d: g.head }); link("h:지원금", "g:" + g.id); });
  const posts = window.POSTS || {}, seen = {};
  Object.entries(posts).forEach(([k, L]) => L.forEach(([t, u, dt]) => { const id = "p:" + u.split("/").pop(); add(id, t, "post", u, { d: dt + " · 조성현 노무사 블로그", ext: 1 }); seen[id] = 1;
    const tgt = k === "latest" ? "h:칼럼" : k === "grants" ? "h:지원금" : CHECKS[k] ? "ck:" + k : k; link(tgt, id); }));
  /* 주제 간 교차 연결 */
  [["g:parental", "parental"], ["g:replace", "parental"], ["g:share", "parental"], ["g:replace", "maternity"], ["g:elder", "severance"], ["g:retain", "ui"], ["g:wlb", "overtime"], ["g:w45", "overtime"], ["g:flex", "annual"], ["g:youth", "minwage"], ["g:promo", "ui"], ["g:regular", "ins"], ["notice", "deadline"], ["severance", "deadline"], ["ck:small", "overtime"], ["ck:small", "notice"], ["ck:small", "annual"], ["ck:harass", "deadline"], ["minwage", "weekly"], ["ui", "ins"], ["maternity", "ins"]].forEach(([a, b]) => link(a, b));
  const nb = {}; N.forEach(n => nb[n.id] = new Set()); E.forEach(([a, b]) => { nb[a].add(b); nb[b].add(a); });
  return (_KG = { N, E, M, nb });
}
const kgNeighbors = id => [...(KG().nb[id] || [])].map(x => KG().M[x]).filter(Boolean);

/* 그래프 인스턴스: host 요소 안에 SVG를 만들고 계속 움직임 */
const KGI = [];
function mountGraph(host, { compact = false, onSelect = () => {}, selected = null, filter = null } = {}) {
  const { N, E } = KG(); const ns = "http://www.w3.org/2000/svg";
  const W = host.clientWidth || 400, H = host.clientHeight || 400;
  const svg = document.createElementNS(ns, "svg"); svg.setAttribute("viewBox", `0 0 ${W} ${H}`); svg.setAttribute("role", "img"); svg.setAttribute("aria-label", "노무 지식 그래프"); host.innerHTML = ""; host.appendChild(svg);
  const gE = document.createElementNS(ns, "g"), gN = document.createElementNS(ns, "g"); svg.append(gE, gN);
  const R = { core: compact ? 9 : 12, hub: compact ? 6.5 : 9, calc: compact ? 4.6 : 6.5, check: compact ? 4.6 : 6.5, grant: compact ? 3.8 : 5.5, post: compact ? 3 : 4.5 };
  const seed = s => { let x = Math.sin(s * 99.13) * 1e4; return x - Math.floor(x); };
  const P = N.map((n, i) => { const a = i * 2.399, rr = n.type === "core" ? 0 : n.type === "hub" ? .22 : n.type === "post" ? .46 : .36; return { n, x: W / 2 + Math.cos(a) * W * rr, y: H / 2 + Math.sin(a) * H * rr, vx: 0, vy: 0, ph: seed(i) * 6.28, fx: null, fy: null }; });
  const PI = Object.fromEntries(P.map((p, i) => [p.n.id, i])); const L = E.map(([a, b]) => [PI[a], PI[b]]);
  const lines = L.map(() => { const l = document.createElementNS(ns, "line"); gE.appendChild(l); return l; });
  const nodes = P.map(p => { const g = document.createElementNS(ns, "g"); g.setAttribute("class", "n t-" + p.n.type); g.setAttribute("tabindex", "0"); g.setAttribute("role", "button"); g.setAttribute("aria-label", p.n.t);
    const c = document.createElementNS(ns, "circle"); c.setAttribute("r", R[p.n.type]); c.style.fill = p.n.type === "core" ? "var(--ink)" : KGT[p.n.type][1];
    const t = document.createElementNS(ns, "text"); const lim = compact ? 9 : 14; t.textContent = p.n.t.length > lim ? p.n.t.slice(0, lim - 1) + "…" : p.n.t; t.setAttribute("text-anchor", "middle"); t.setAttribute("dy", -(R[p.n.type] + 6));
    g.append(c, t); gN.appendChild(g); return g; });
  let sel = selected, hov = null, alpha = 1, drag = null, raf = 0, alive = true, hidden = new Set();
  const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const paint = () => {
    const focus = hov || sel, nb = focus ? KG().nb[focus] : null;
    P.forEach((p, i) => { const g = nodes[i], on = !focus || p.n.id === focus || nb.has(p.n.id), hid = hidden.has(p.n.type);
      g.style.display = hid ? "none" : ""; g.classList.toggle("dim", !on); g.classList.toggle("sel", p.n.id === sel); g.classList.toggle("lbl", p.n.type === "core" || p.n.type === "hub" || (focus && on) || (!compact && p.n.type !== "post")); });
    L.forEach(([a, b], i) => { const l = lines[i], A = P[a], B = P[b], hid = hidden.has(A.n.type) || hidden.has(B.n.type); l.style.display = hid ? "none" : ""; const hot = focus && (A.n.id === focus || B.n.id === focus); l.setAttribute("class", hot ? "hot" : focus ? "dim" : ""); });
  };
  const tick = () => {
    if (!alive) return;
    const k = Math.max(alpha, .025), t = performance.now() / 1000;
    for (let i = 0; i < P.length; i++) { const a = P[i]; if (hidden.has(a.n.type)) continue; for (let j = i + 1; j < P.length; j++) { const b = P[j]; if (hidden.has(b.n.type)) continue; let dx = a.x - b.x, dy = a.y - b.y, d2 = dx * dx + dy * dy || .01; if (d2 > 40000) continue; const f = (compact ? 140 : 520) / d2 * k; a.vx += dx * f; a.vy += dy * f; b.vx -= dx * f; b.vy -= dy * f; } }
    L.forEach(([i, j]) => { const a = P[i], b = P[j]; if (hidden.has(a.n.type) || hidden.has(b.n.type)) return; const dx = b.x - a.x, dy = b.y - a.y, d = Math.hypot(dx, dy) || 1, rest = (compact ? 26 : 50) + (a.n.type === "core" || b.n.type === "core" ? (compact ? 18 : 40) : 0), f = (d - rest) * .035 * k; a.vx += dx / d * f; a.vy += dy / d * f; b.vx -= dx / d * f; b.vy -= dy / d * f; });
    P.forEach((p, i) => {
      const gr = p.n.type === "core" ? .02 : .006; p.vx += (W / 2 - p.x) * gr * k; p.vy += (H / 2 - p.y) * gr * k;
      if (!still) { p.vx += Math.cos(t * .6 + p.ph) * .018; p.vy += Math.sin(t * .5 + p.ph * 1.3) * .018; }
      if (p.fx != null) { p.x = p.fx; p.y = p.fy; p.vx = p.vy = 0; } else { p.vx *= .82; p.vy *= .82; p.x += p.vx; p.y += p.vy; }
      const mxg = compact ? 58 : 70; p.x = Math.max(mxg, Math.min(W - mxg, p.x)); p.y = Math.max(28, Math.min(H - 16, p.y));
      nodes[i].setAttribute("transform", `translate(${p.x.toFixed(1)},${p.y.toFixed(1)})`);
    });
    L.forEach(([a, b], i) => { const l = lines[i]; l.setAttribute("x1", P[a].x.toFixed(1)); l.setAttribute("y1", P[a].y.toFixed(1)); l.setAttribute("x2", P[b].x.toFixed(1)); l.setAttribute("y2", P[b].y.toFixed(1)); });
    alpha *= .985;
    if (!document.hidden && !still) raf = requestAnimationFrame(tick); else if (still && alpha > .03) raf = requestAnimationFrame(tick);
  };
  const pt = e => { const r = svg.getBoundingClientRect(); return [(e.clientX - r.left) * W / r.width, (e.clientY - r.top) * H / r.height]; };
  nodes.forEach((g, i) => {
    const p = P[i];
    g.addEventListener("pointerenter", () => { hov = p.n.id; paint(); });
    g.addEventListener("pointerleave", () => { hov = null; paint(); });
    g.addEventListener("pointerdown", e => { e.preventDefault(); g.setPointerCapture(e.pointerId); const [x, y] = pt(e); drag = { i, x, y, moved: false }; p.fx = p.x; p.fy = p.y; alpha = Math.max(alpha, .4); });
    g.addEventListener("pointermove", e => { if (!drag || drag.i !== i) return; const [x, y] = pt(e); if (Math.hypot(x - drag.x, y - drag.y) > 3) drag.moved = true; p.fx = x; p.fy = y; alpha = Math.max(alpha, .3); });
    g.addEventListener("pointerup", () => { if (!drag) return; const moved = drag.moved; drag = null; p.fx = p.fy = null; if (!moved) api.select(p.n.id, true); });
    g.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); api.select(p.n.id, true); } });
  });
  const vis = () => { if (!document.hidden && alive) { cancelAnimationFrame(raf); raf = requestAnimationFrame(tick); } };
  document.addEventListener("visibilitychange", vis);
  const api = {
    select(id, user) { sel = id; paint(); alpha = Math.max(alpha, .25); const i = PI[id]; if (i != null && nodes[i]) { nodes[i].classList.remove("pulse"); void nodes[i].getBBox(); nodes[i].classList.add("pulse"); } if (user) onSelect(KG().M[id]); },
    setHidden(set) { hidden = new Set(set); alpha = .6; paint(); },
    reheat() { alpha = 1; },
    destroy() { alive = false; cancelAnimationFrame(raf); document.removeEventListener("visibilitychange", vis); }
  };
  paint(); raf = requestAnimationFrame(tick); KGI.push(api); return api;
}
function destroyGraphs() { while (KGI.length) KGI.pop().destroy(); }

/* 노드 상세 (홈 목업·그래프 페이지·각 화면 공통) */
function kgDetail(n, { mini = false } = {}) {
  if (!n) return "";
  const nb = kgNeighbors(n.id).filter(x => x.type !== "core");
  const act = n.ext ? `<a class="btn grad sm" href="${n.h}" target="_blank" rel="noopener">블로그에서 읽기</a>` : n.type === "core" ? `<a class="btn grad sm" href="#calc">계산기 둘러보기</a>` : `<a class="btn grad sm" href="${n.h}">${n.type === "calc" ? "계산기 열기" : n.type === "check" ? "진단 시작" : n.type === "grant" ? "지원금 찾기" : "열기"}</a>`;
  return `<span class="kg-type" style="--c:${KGT[n.type][1]}">${KGT[n.type][0]}</span><h4>${esc(n.t)}</h4><p class="kg-d">${esc(n.d || "")}</p>
    <div class="kg-act">${act}<a class="btn sm" href="#ask">이 주제로 상담</a></div>
    ${nb.length ? `<p class="kg-h">연결된 주제 ${nb.length}</p><div class="kg-nb">${nb.slice(0, mini ? 8 : 30).map(x => `<button type="button" class="kg-chip" data-kg="${x.id}" style="--c:${KGT[x.type][1]}">${esc(x.t.length > 22 ? x.t.slice(0, 21) + "…" : x.t)}</button>`).join("")}</div>` : ""}`;
}

function kgLinks(id) { const n = KG().M[id]; if (!n) return ""; const nb = kgNeighbors(id).filter(x => x.type !== "core" && x.type !== "hub" && x.type !== "post"); if (!nb.length) return ""; return `<section class="kg-links"><div class="posts-h"><b>지식 그래프로 연결된 주제</b><a href="#graph/${encodeURIComponent(id)}">그래프에서 보기 →</a></div><div class="kg-nb">${nb.map(x => `<a class="kg-chip" href="${x.h}" style="--c:${KGT[x.type][1]}">${esc(x.t)}</a>`).join("")}</div></section>`; }
function renderGraph(sub) {
  const start = sub ? decodeURIComponent(sub) : "core"; const { N, E } = KG();
  const cnt = t => N.filter(n => n.type === t).length;
  view.innerHTML = `<p class="eyebrow">지식 그래프</p><h2 class="h2">노무 지식 그래프</h2>
  <p class="lede">계산기 ${cnt("calc")}개, 자가진단 ${cnt("check")}개, 지원금 ${cnt("grant")}개, 블로그 칼럼 ${cnt("post")}편이 ${E.length}개의 연결로 이어져 있습니다. 점을 끌어 옮기거나 눌러서 관련 주제를 따라가 보세요.</p>
  <div class="kg-bar"><div class="kg-filter">${Object.entries(KGT).filter(([k]) => k !== "core").map(([k, [t, c]]) => `<button type="button" class="kg-f on" data-t="${k}" style="--c:${c}" aria-pressed="true"><i></i>${t} <span>${cnt(k)}</span></button>`).join("")}</div>
    <label class="kg-search"><svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/></svg><input id="kgQ" placeholder="주제 검색 (예: 퇴직금, 육아, 괴롭힘)" list="kgList" autocomplete="off"><datalist id="kgList">${N.map(n => `<option value="${esc(n.t)}">`).join("")}</datalist></label></div>
  <div class="kg-page"><div class="card kg-stage"><div class="graph big" id="kgBig"></div><button class="btn sm kg-re" type="button" id="kgRe">다시 정렬</button></div><aside class="card pad kg-side" id="kgSide"></aside></div>`;
  const side = $("#kgSide"); const show = n => { side.innerHTML = kgDetail(n); };
  const g = mountGraph($("#kgBig"), { selected: start, onSelect: n => { show(n); history.replaceState(null, "", "#graph/" + encodeURIComponent(n.id)); } });
  show(KG().M[start] || KG().M.core);
  side.addEventListener("click", e => { const c = e.target.closest("[data-kg]"); if (c) { g.select(c.dataset.kg); show(KG().M[c.dataset.kg]); history.replaceState(null, "", "#graph/" + encodeURIComponent(c.dataset.kg)); } });
  const hid = new Set();
  $$(".kg-f", view).forEach(b => b.onclick = () => { const t = b.dataset.t; hid.has(t) ? hid.delete(t) : hid.add(t); b.classList.toggle("on", !hid.has(t)); b.setAttribute("aria-pressed", !hid.has(t)); g.setHidden(hid); });
  $("#kgQ").addEventListener("change", e => { const q = e.target.value.trim(); if (!q) return; const n = N.find(x => x.t === q) || N.find(x => x.t.includes(q)); if (n) { g.select(n.id); show(n); } else toast("일치하는 주제가 없습니다"); });
  $("#kgRe").onclick = () => g.reheat();
}
function renderHome() {
  view.classList.add("wide");
  const d = baseDate(), py = YEAR === "2027" ? "2026-12-31" : "2025-12-31";
  const mw = getV("mw_h", d), pmw = getV("mw_h", py), dl = ((mw - pmw) / pmw * 100).toFixed(1);
  const ev = upcoming(4), p27 = YEAR === "2027";
  const stats = [["np_rate", "국민연금"], ["hi_rate", "건강보험"], ["ltc_rate", "장기요양"], ["ui_max", "구직급여 1일 상한"], ["np_upper", "국민연금 상한"], ["mat_cap", "출산휴가급여 상한"], ["pl_cap1", "육아휴직 1~3개월"], ["dis_quota", "장애인 의무고용률"]];
  const stat = ([k, t]) => { const e = getEntry(k, d); const v = getV(k, d); const u = FIG[k].unit; return `<a class="card stat" href="#table"><img class="st-ic" src="img/st_${k}.webp" alt="" width="64" height="64" loading="lazy"><span>${t}</span><b>${u === "%" ? v + "<small>%</small>" : won(v) + "<small>원</small>"}</b><em>${e && e.status === "pending" ? '<span class="pend">미정 · 직전 값</span>' : esc(FIG[k].n)}</em></a>`; };
  const tree = [["임금", [["minwage", "최저임금"], ["overtime", "가산수당"], ["weekly", "주휴수당"]]], ["퇴직·해고", [["severance", "퇴직금", 1], ["notice", "해고예고"], ["deadline", "사건 기한"]]], ["휴가·휴직", [["annual", "연차"], ["parental", "육아휴직"]]]];
  view.innerHTML = `
  <section class="hero">
    <canvas class="stars" id="sky" aria-hidden="true"></canvas>
    <div class="proof"><span>부산 연제구</span><i></i><span>공인노무사 조성현</span><i class="hide-s"></i><span class="hide-s">기준 수치 확인 <b>${kdate(META.checked)}</b></span></div>
    <h2><span class="lt">막막한 노무 문제,</span><br><em>숫자부터</em> 차분하게.</h2>
    <p class="sub">월급이 맞게 나왔는지, 퇴직금은 얼마인지, 해고 통보를 받았다면 언제까지 움직여야 하는지. 먼저 여기서 확인해 보시고, 판단이 어려운 부분은 제가 직접 봐 드리겠습니다.<span class="sign">공인노무사 조성현</span></p>
    <div class="hero-cta"><a class="btn grad lg" href="#calc">계산해 보기</a><a class="btn kakao lg" href="${O.kakao}" target="_blank" rel="noopener">카카오톡 상담</a><a class="btn talk lg" href="${O.talk}" target="_blank" rel="noopener">네이버 톡톡</a></div>
    <p class="hero-meta">${p27 ? "2027년 1월 1일 기준 미리보기" : "오늘 " + kdate(TODAY) + " 기준"} · 최저임금 <b class="num">${won(mw)}원</b> (전년 대비 ${dl}%↑)</p>
    <div class="mock-wrap">
      <div class="mock">
        <aside class="mk-side"><div class="dots"><i></i><i></i><i></i></div>
          <ul class="tree">${tree.map(([g, L]) => `<li class="fold">${g}</li>${L.map(([id, t, on]) => `<li class="leaf ${on ? "on" : ""}" data-kg="${id}">${t}</li>`).join("")}`).join("")}<li class="fold">진단</li><li class="leaf" data-kg="ck:harass">직장 내 괴롭힘</li><li class="leaf" data-kg="ck:sapa">중대재해처벌법</li><li class="fold">지원금</li><li class="leaf" data-kg="g:youth">청년도약</li><li class="leaf" data-kg="g:elder">고령자 계속고용</li></ul>
        </aside>
        <div class="mk-main">
          <div class="tabs"><span class="on" id="mkTab0" data-tab="0">퇴직금 빠른계산</span><span id="mkTab1" data-tab="1" hidden></span></div>
          <div class="doc kg-doc" id="mkDetail" hidden></div>
          <div class="doc" id="mkCalc">
            <h4>퇴직금, 대략 얼마일까</h4><span class="tag">#빠른계산</span>
            <div class="mini"><label>월 평균 급여<input id="mkPay" inputmode="numeric" value="3,000,000" aria-label="월 평균 급여(원)"></label><label>근속 기간(년)<input id="mkYr" inputmode="decimal" value="3" aria-label="근속 기간(년)"></label></div>
            <div class="mini-out"><span>예상 퇴직금(근사치)</span><b id="mkOut">-</b><em>월 평균 급여 × 근속연수 기준. <a href="#calc/severance">정밀 계산 →</a></em></div>
            <ul><li>1년 이상·주 15시간 이상 근무 시 발생</li><li>퇴직일부터 14일 이내 지급</li></ul>
          </div>
        </div>
        <div class="mk-graph"><div class="tabs"><span class="on">노무 지식 그래프</span><a class="tab-link" href="#graph">전체 화면 →</a></div><div class="graph" id="mkGraph"></div><p class="graph-hint">점을 끌어 보거나 눌러 보세요</p></div>
      </div>
      <div class="phone" aria-label="다가오는 노무 일정"><div class="st"><span>9:41</span><span>●●●</span></div><h5>다가오는 일정</h5>
        ${ev.map(e => { const k = diffDays(TODAY, e.date); return `<div class="ph-ev"><b class="${k > 10 ? "cool" : ""}">${k === 0 ? "오늘" : "D-" + k}</b><span>${esc(e.t)}</span></div>`; }).join("")}
      </div>
    </div>
  </section>
  <div class="strip">
    <div><b>${CALCS.length}</b><span>노무 계산기</span></div>
    <div><b>${GRANTS.length}</b><span>2026 고용장려금</span></div>
    <div><b>3</b><span>자가진단</span></div>
    <div><b>2027</b><span>내년 기준 미리보기</span></div>
  </div>
  <div class="wrap">
    <section class="manifesto">
      <div class="mf-list">
        <div><h4>숫자는 고시 원문에서 가져왔습니다.</h4><p>최저임금, 보험료율, 급여 상한액은 고용노동부와 보건복지부 고시를 하나씩 대조해 넣었습니다. 기준이 바뀌면 바로 고칩니다. 출처는 <a href="#table">기준표</a>에서 확인하실 수 있습니다.</p></div>
        <div><h4>기한은 생각보다 짧습니다.</h4><p>부당해고 구제신청은 해고된 날부터 3개월, 재심은 판정서를 받고 10일 안입니다. 날짜만 넣으시면 남은 날을 세어 드립니다.</p></div>
        <div><h4>애매하면 그냥 물어보세요.</h4><p>계산 결과를 그대로 카카오톡이나 네이버 톡톡으로 보내 주시면, 제가 직접 읽고 답을 드립니다.</p></div>
      </div>
      <figure class="photo mf-photo"><img src="img/office.jpg" alt="광안대교가 보이는 저녁 사무실 책상 위의 근로계약서와 계산기"><figcaption><b>${p27 ? "2027" : "2026"}년 최저임금 시간당 ${won(mw)}원</b>월 환산 ${won(getV("mw_m", d))}원(209시간 기준) · <a href="#calc/minwage" style="color:#a8e3ec">우리 회사 급여 확인 →</a></figcaption></figure>
    </section>
    <section class="block">
      <p class="eyebrow">분야별 도구</p>
      <h3 class="big">자주 묻는 질문,<br>바로 계산해 보세요.</h3>
      <nav class="cat-row" aria-label="분야">${[["임금", "#calc/minwage"], ["퇴직·해고", "#calc/severance"], ["4대보험", "#calc/ins"], ["출산·육아", "#calc/parental"], ["사건 기한", "#calc/deadline"], ["지원금", "#grants"], ["괴롭힘", "#check/harass"], ["중대재해", "#check/sapa"]].map(([t, h]) => `<a class="cat" href="${h}">${t}</a>`).join("")}</nav>
      <div class="feat">
        <a class="card ft span2 img" href="#calc"><div class="ft-body"><span class="ft-cat">임금 · 퇴직 · 보험</span><img class="fi3" src="img/ic_calc.webp" alt="" width="80" height="80" loading="lazy"><b>“이번 달 월급, 맞게 나온 걸까요?”</b><span>최저임금, 연장·야간수당, 주휴수당, 퇴직금, 연차, 4대보험, 실업급여, 육아휴직 급여까지. 월급명세서 한 장만 있으면 됩니다.</span><div class="vis">${CALCS.length}<small>가지 계산기</small></div></div><div class="ft-pic" style="background-image:url(img/docs.jpg)" role="img" aria-label="달력과 급여명세서, 사무소 로고 노트와 공인노무사 배지가 놓인 책상"></div></a>
        <a class="card ft" href="#grants"><span class="ft-cat">지원금</span><img class="fi3" src="img/ic_grant.webp" alt="" width="80" height="80" loading="lazy"><b>“우리 회사도 받을 수 있나요?”</b><span>세 가지만 고르시면 해당될 만한 고용장려금을 추려 드립니다. 부산은 비수도권 우대 금액으로 보여 드립니다.</span><div class="vis">1,440<small>만원까지 (고령자 계속고용)</small></div></a>
        <a class="card ft" href="#calc/deadline"><span class="ft-cat">사건 기한</span><img class="fi3" src="img/ic_clock.webp" alt="" width="80" height="80" loading="lazy"><b>“언제까지 신청해야 하죠?”</b><span>해고일이나 판정서 받은 날만 넣으시면 구제신청·재심·임금 시효 마감일을 알려 드립니다.</span><div class="vis">3<small>개월 · 구제신청</small></div></a>
        <a class="card ft" href="#check/harass"><span class="ft-cat">괴롭힘</span><img class="fi3" src="img/ic_people.webp" alt="" width="80" height="80" loading="lazy"><b>“이것도 괴롭힘인가요?”</b><span>법이 보는 세 가지 요소에 비춰 상황을 정리해 보고, 회사가 해야 할 조치도 함께 확인합니다.</span><div class="vis">3<small>분 진단</small></div></a>
        <a class="card ft" href="#check/sapa"><span class="ft-cat">중대재해</span><img class="fi3" src="img/ic_hard.webp" alt="" width="80" height="80" loading="lazy"><b>“중대재해법, 우리도 대상인가요?”</b><span>5인 이상이면 대상입니다. 안전보건관리체계 9개 항목 중 무엇이 준비됐는지 체크해 보세요.</span><div class="vis">9<small>개 항목</small></div></a>
      </div>
    </section>
    <section class="about">
      <figure class="photo"><img src="img/consult.jpg" alt="상담 테이블에서 노무사가 서류를 짚으며 설명하는 모습" loading="lazy"></figure>
      <div><p class="eyebrow">이런 분들이 찾아오십니다</p><h3>혼자 고민하시다가<br>늦게 오시는 분이 많습니다.</h3>
        <p>노무 문제는 기한이 있고, 처음 대응이 결과를 좌우하는 경우가 많습니다. 조금이라도 걸리는 부분이 있으면 일찍 물어보시는 편이 낫습니다.</p>
        <ul class="who-list">
          <li><i>01</i><div><b>직원을 처음 채용한 사장님</b><span>근로계약서, 4대보험, 주휴수당부터 차근차근</span></div></li>
          <li><i>02</i><div><b>갑자기 해고나 권고사직 통보를 받은 분</b><span>3개월 안에 노동위원회 구제신청을 검토해야 합니다</span></div></li>
          <li><i>03</i><div><b>괴롭힘 신고가 들어와 조사가 필요한 회사</b><span>객관적인 외부 조사와 사후 조치까지</span></div></li>
          <li><i>04</i><div><b>지원금과 중대재해 대응을 챙겨야 하는 중소기업</b><span>신청 요건 검토부터 안전보건관리체계 구축까지</span></div></li>
        </ul></div>
    </section>
    ${p27 ? `<section class="sec card pad"><p class="eyebrow">2027 미리보기</p><h3 class="h2" style="font-size:22px">내년에 달라지는 기준</h3>
      <ul class="small-list" style="margin-top:10px">
        <li>최저임금 시간급 10,320원 → 10,700원 (3.7%↑)<span>확정</span></li>
        <li>국민연금 보험료율 9.5% → 10% (근로자·사업주 각 5%)<span>확정</span></li>
        <li>건강보험료율 7.19% 동결<span>확정</span></li>
        <li>장기요양보험료율<span class="pend">미정</span></li>
        <li>구직급여 하한(68,480원)이 현행 상한(68,100원) 초과 → 상한 연동 개정 추진<span class="pend">입법예고</span></li>
      </ul></section>` : ""}
    <section class="block">
      <div class="sec-h"><h3>핵심 기준 수치</h3><a href="#table">연도별 비교표 →</a></div>
      <div class="bento">${stats.map(stat).join("")}</div>
    </section>
    <section class="sec" style="margin-top:56px"><div class="sec-h"><h3>최근 노무 칼럼</h3><a href="${O.blog}" target="_blank" rel="noopener">네이버 블로그 →</a></div>
      <div class="cols">${POSTS.latest.map(([t, u, dd, c]) => `<a class="card col" href="${u}" target="_blank" rel="noopener"><span class="chip teal">${c}</span><b>${esc(t)}</b><small>${dd}</small></a>`).join("")}</div></section>
    ${ctaBand()}
  </div>`;
  const pay = $("#mkPay"), yr = $("#mkYr"), out = $("#mkOut");
  const calc = () => { const p = +pay.value.replace(/[^\d]/g, ""), y = +yr.value.replace(/[^\d.]/g, ""); out.textContent = p && y >= 1 ? won(Math.round(p * y / 10) * 10) + "원" : y && y < 1 ? "1년 미만은 발생하지 않음" : "-"; };
  pay.addEventListener("input", () => { const v = pay.value.replace(/[^\d]/g, ""); pay.value = v ? won(+v) : ""; calc(); }); yr.addEventListener("input", calc); calc();
  const det = $("#mkDetail"), cal = $("#mkCalc"), t0 = $("#mkTab0"), t1 = $("#mkTab1");
  const show = n => { if (!n) return; det.innerHTML = kgDetail(n, { mini: true }); det.hidden = false; cal.hidden = true; t1.textContent = n.t.length > 16 ? n.t.slice(0, 15) + "…" : n.t; t1.hidden = false; t1.classList.add("on"); t0.classList.remove("on");
    $$(".tree li.leaf", view).forEach(li => li.classList.toggle("on", li.dataset.kg === n.id)); };
  const g = mountGraph($("#mkGraph"), { compact: true, selected: "severance", onSelect: show });
  $(".mock", view).addEventListener("click", e => { const c = e.target.closest("[data-kg]"); if (c) { g.select(c.dataset.kg); show(KG().M[c.dataset.kg]); } });
  t0.addEventListener("click", () => { det.hidden = true; cal.hidden = false; t0.classList.add("on"); t1.classList.remove("on"); g.select("severance"); $$(".tree li.leaf", view).forEach(li => li.classList.toggle("on", li.dataset.kg === "severance")); });
  t1.addEventListener("click", () => { if (det.innerHTML) { det.hidden = false; cal.hidden = true; t1.classList.add("on"); t0.classList.remove("on"); } });
  startSky();
}
/* 움직이는 별자리 배경 */
let skyRAF = 0, skyOff = null;
function stopSky() { cancelAnimationFrame(skyRAF); if (skyOff) skyOff(); skyOff = null; }
function startSky() {
  stopSky();
  const cv = $("#sky"); if (!cv) return;
  const ctx = cv.getContext("2d"), host = cv.parentElement, dpr = Math.min(devicePixelRatio || 1, 2);
  const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let W = 0, H = 0, P = [], mx = -999, my = -999;
  const size = () => { W = host.clientWidth; H = Math.min(host.clientHeight, 900); cv.width = W * dpr; cv.height = H * dpr; cv.style.height = H + "px"; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const n = Math.round(Math.min(110, W * H / 11000));
    P = Array.from({ length: n }, () => ({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - .5) * .28, vy: (Math.random() - .5) * .28, r: Math.random() * 1.6 + .7, t: Math.random() * 6.28, s: Math.random() * .03 + .01, c: Math.random() < .5 ? 0 : Math.random() < .5 ? 1 : 2 })); };
  const light = () => document.documentElement.dataset.theme === "light";
  const COL = { light: ["29,103,214", "11,138,123", "124,92,255"], dark: ["255,255,255", "124,232,216", "160,180,255"] };
  const draw = () => {
    ctx.clearRect(0, 0, W, H); const pal = light() ? COL.light : COL.dark, L = light();
    for (const p of P) {
      if (!still) { p.x += p.vx; p.y += p.vy; p.t += p.s; if (p.x < -10) p.x = W + 10; if (p.x > W + 10) p.x = -10; if (p.y < -10) p.y = H + 10; if (p.y > H + 10) p.y = -10;
        const dx = mx - p.x, dy = my - p.y, d = Math.hypot(dx, dy); if (d < 140) { p.x -= dx / d * .6; p.y -= dy / d * .6; } }
    }
    for (let i = 0; i < P.length; i++) for (let j = i + 1; j < P.length; j++) { const a = P[i], b = P[j], d = Math.hypot(a.x - b.x, a.y - b.y); if (d < 120) { ctx.strokeStyle = `rgba(${pal[a.c]},${(1 - d / 120) * (L ? .22 : .18)})`; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); } }
    for (const p of P) { const tw = .55 + Math.sin(p.t) * .45; ctx.fillStyle = `rgba(${pal[p.c]},${(L ? .75 : .9) * tw})`; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.283); ctx.fill();
      if (p.r > 1.9) { ctx.fillStyle = `rgba(${pal[p.c]},${.12 * tw})`; ctx.beginPath(); ctx.arc(p.x, p.y, p.r * 4, 0, 6.283); ctx.fill(); } }
    if (!still && !document.hidden) skyRAF = requestAnimationFrame(draw);
  };
  const mv = e => { const r = cv.getBoundingClientRect(); mx = e.clientX - r.left; my = e.clientY - r.top; }, lv = () => { mx = my = -999; };
  const vis = () => { if (!document.hidden) { cancelAnimationFrame(skyRAF); draw(); } };
  size(); draw();
  addEventListener("resize", size); host.addEventListener("pointermove", mv); host.addEventListener("pointerleave", lv); document.addEventListener("visibilitychange", vis);
  skyOff = () => { removeEventListener("resize", size); host.removeEventListener("pointermove", mv); host.removeEventListener("pointerleave", lv); document.removeEventListener("visibilitychange", vis); };
}
const ctaBand = () => `<section class="cta-band"><div><h3>계산은 여기까지, 나머지는 같이 보겠습니다</h3><p>첫 문의는 메신저로 편하게 남겨 주세요. 대표 노무사가 직접 읽고 답합니다.</p></div><div class="btns"><a class="btn kakao" href="${O.kakao}" target="_blank" rel="noopener">카카오톡 상담</a><a class="btn talk" href="${O.talk}" target="_blank" rel="noopener">네이버 톡톡</a><a class="btn ghost" href="${O.telHref}">전화 ${O.tel}</a></div></section>`;

const postsBox = (k, title = "조성현 노무사의 관련 칼럼") => { const L = (window.POSTS || {})[k]; if (!L || !L.length) return ""; return `<section class="posts"><div class="posts-h"><b>${title}</b><a href="${O.blog}" target="_blank" rel="noopener">블로그 전체 →</a></div>${L.map(([t, u, d]) => `<a class="post" href="${u}" target="_blank" rel="noopener"><span>${esc(t)}</span><small>${d}</small></a>`).join("")}</section>`; };
/* ---------- Calculator ---------- */
function renderCalc(id) {
  const c = CALCS.find(x => x.id === id) || CALCS[0];
  const d = baseDate();
  const groups = [...new Set(CALCS.map(x => x.grp))];
  view.innerHTML = `<div class="calc-wrap">
    <nav class="card calc-list" aria-label="계산기 목록">${groups.map(g => `<h4>${g}</h4>${CALCS.filter(x => x.grp === g).map(x => `<a href="#calc/${x.id}" ${x.id === c.id ? 'aria-current="true"' : ""}>${IC[x.ic]}${x.name}</a>`).join("")}`).join("")}</nav>
    <section class="card calc-panel">
      <div class="calc-head"><div><p class="eyebrow">${c.grp}</p><h2 class="h2">${c.name}</h2><p class="lede">${c.desc}</p></div><span class="chip ${YEAR === "2027" ? "amber" : "teal"}">${YEAR === "2027" ? "2027 기준" : "2026 기준"}</span></div>
      <form class="form" id="cf" onsubmit="return false">${c.form(d)}</form>
      <div id="cres"></div>
      ${kgLinks(c.id)}
      ${postsBox(c.id)}
    </section></div>`;
  const form = $("#cf");
  const run = () => {
    const f = {}; new FormData(form).forEach((v, k) => { const el = form.elements[k]; f[k] = (el && el.dataset && el.dataset.money !== undefined) ? (+String(v).replace(/[^\d]/g, "") || 0) : v; });
    $$("[data-money]", form).forEach(el => { f[el.name] = +el.value.replace(/[^\d]/g, "") || 0; });
    const r = c.calc(f, d);
    if (r.err) { $("#cres").innerHTML = `<div class="alert warn">${r.err}</div>`; return; }
    const txt = `[${c.name}] ${r.label}: ${r.value}${r.unit}${r.side ? " (" + r.side + ")" : ""}\n` + r.rows.map(([a, b]) => `- ${String(a).replace(/<[^>]+>/g, " ").trim()}: ${String(b).replace(/<[^>]+>/g, " ").trim()}`).join("\n");
    $("#cres").innerHTML = `<div class="result">
      <div class="res-top"><div><span>${r.label}</span><b class="num">${r.value}<small>${r.unit}</small></b></div>${r.side ? `<span style="color:#cfe0ee;font-weight:600">${r.side}</span>` : ""}</div>
      <div class="res-rows">${r.rows.map(([a, b]) => `<div class="rr"><span>${a}</span><b>${b}</b></div>`).join("")}</div>
      ${r.alert ? `<div style="padding:0 22px 4px"><div class="alert ${r.alert[0]}">${r.alert[1]}</div></div>` : ""}
      <div class="res-note">${(r.notes || []).map(n => `<p>· ${n}</p>`).join("")}</div>
      <div class="res-act"><button class="btn sm" id="cp">결과 복사</button><button class="btn sm pri" id="toAsk">이 결과로 상담하기</button><button class="btn sm" id="lnk">계산기 링크 복사</button></div>
    </div>`;
    $("#cp").onclick = () => copy(txt, "결과를 복사했습니다");
    $("#lnk").onclick = () => copy(location.href.split("#")[0] + "#calc/" + c.id, "링크를 복사했습니다");
    $("#toAsk").onclick = () => { store.setItem("jsh-attach", txt); location.hash = "ask"; };
  };
  form.addEventListener("input", e => {
    if (e.target.dataset.money !== undefined) { const p = e.target.selectionStart, l = e.target.value.length; const n = e.target.value.replace(/[^\d]/g, ""); e.target.value = n ? (+n).toLocaleString("ko-KR") : ""; const np = p + (e.target.value.length - l); try { e.target.setSelectionRange(np, np); } catch (_) {} }
    run();
  });
  form.addEventListener("change", run);
  run();
}
function copy(t, m) { (navigator.clipboard ? navigator.clipboard.writeText(t) : Promise.reject()).then(() => toast(m)).catch(() => { const a = document.createElement("textarea"); a.value = t; document.body.appendChild(a); a.select(); document.execCommand("copy"); a.remove(); toast(m); }); }

/* ---------- Grants ---------- */
function gCard(g) {
  return `<article class="card g"><div class="top-row"><span class="chip">${g.fam}</span>${g.pref ? '<span class="chip">우선지원대상기업</span>' : ""}${g.id === "elder" || g.id === "youth" || g.id === "w45" ? '<span class="chip teal">비수도권 우대</span>' : ""}</div>
    <h4>${g.name}</h4><p class="head" style="margin:0">${g.head}</p>
    <details><summary>요건·금액 자세히</summary><dl><dt>대상</dt><dd>${g.target}</dd><dt>요건</dt><dd>${g.req}</dd><dt>지원 금액</dt><dd>${g.amt}</dd>${g.note ? `<dt>유의</dt><dd>${g.note}</dd>` : ""}</dl></details>
    <p class="src" style="margin:auto 0 0">출처: <a href="${g.s.u}" target="_blank" rel="noopener">${g.s.t}</a></p></article>`;
}
function renderGrants() {
  const st = JSON.parse(store.getItem("jsh-wiz") || '{"pref":"1","n":"12","tags":[]}');
  const tagOpts = [["hireYouth", "청년(15~34세) 정규직 채용"], ["hireVuln", "취업취약계층 채용"], ["retire", "정년 도달 직원 계속 고용"], ["parental", "출산·육아휴직·단축 사용자 발생"], ["regular", "계약직·파견직 정규직 전환"], ["shorten", "근로시간 단축 요청"], ["fourHalf", "주 4.5일제 도입 검토"], ["flex", "재택·시차·선택근무 운영"], ["system", "근태·인사 시스템 도입"], ["downturn", "매출 감소로 휴업·휴직 검토"]];
  view.innerHTML = `<p class="eyebrow">2026 고용장려금</p><h2 class="h2">우리 회사가 받을 수 있는 지원금 찾기</h2><p class="lede">세 가지만 선택하면 해당 가능성이 있는 지원금을 골라 드립니다. 부산 소재 사업장 기준으로 비수도권 우대 금액을 먼저 표시합니다.</p>
  <section class="card wiz sec" style="margin-top:18px">
    <form id="wf" onsubmit="return false">
      <div class="wiz-q"><p>1. 우선지원대상기업(중소기업 등)인가요?</p><div class="opts">${[["1", "예"], ["0", "아니오(대규모기업)"], ["?", "잘 모르겠음"]].map(([v, t]) => `<label class="opt"><input type="radio" name="pref" value="${v}" ${st.pref === v ? "checked" : ""}><span>${t}</span></label>`).join("")}</div></div>
      <div class="wiz-q"><p>2. 고용보험 피보험자 수</p><div class="inp" style="max-width:220px"><input class="has-u" type="number" name="n" min="1" value="${st.n}"><i class="u" style="font-style:normal">명</i></div></div>
      <div class="wiz-q"><p>3. 해당하는 상황을 모두 고르세요</p><div class="opts">${tagOpts.map(([v, t]) => `<label class="opt"><input type="checkbox" name="tags" value="${v}" ${st.tags.includes(v) ? "checked" : ""}><span>${t}</span></label>`).join("")}</div></div>
    </form>
    <div id="wres"></div>
  </section>
  <div class="card pad sec">${postsBox("grants")}</div>
  <section class="sec"><div class="sec-h"><h3>전체 지원금 ${GRANTS.length}개</h3><span class="src">기준: <a href="${SRC.grant.u}" target="_blank" rel="noopener">${SRC.grant.t}</a></span></div><div class="g-list" style="margin-top:0">${GRANTS.map(gCard).join("")}</div></section>
  ${ctaBand()}`;
  const wf = $("#wf");
  const run = () => {
    const pref = (wf.querySelector("[name=pref]:checked") || {}).value || "1"; const n = +wf.n.value || 0;
    const tags = $$("[name=tags]:checked", wf).map(x => x.value);
    store.setItem("jsh-wiz", JSON.stringify({ pref, n: String(n), tags }));
    if (!tags.length) { $("#wres").innerHTML = `<div class="alert info" style="margin-top:18px">상황을 하나 이상 선택하면 결과가 표시됩니다.</div>`; return; }
    const m = GRANTS.filter(g => g.tags.some(t => tags.includes(t)));
    const ok = [], warn = [];
    m.forEach(g => { const why = []; if (g.pref && pref === "0") why.push("우선지원대상기업만 지원"); if (g.min5 && n < 5) why.push("원칙적으로 피보험자 5인 이상(일부 업종 예외)"); if (g.under30 && n >= 30) why.push("30인 미만 기업 대상"); if (g.min20 && n < 20) why.push("20인 이상 기업 대상"); (why.length ? warn : ok).push([g, why]); });
    const sum = ok.reduce((a, [g]) => a + g.max, 0);
    $("#wres").innerHTML = `<div class="match-sum"><div><span>해당 가능 지원금</span><b>${ok.length}개</b></div><div><span>1인 기준 최대 지원 합계(추정)</span><b>${won(sum)}원</b></div><a class="btn kakao sm" style="margin-left:auto" href="#ask" id="gAsk">신청 대행 문의</a></div>
      ${ok.length ? `<div class="g-list">${ok.map(([g]) => gCard(g)).join("")}</div>` : ""}
      ${warn.length ? `<p class="grp-t" style="margin-top:20px">요건 확인이 필요한 지원금</p><div class="g-list" style="margin-top:0">${warn.map(([g, w]) => gCard(g).replace('<h4>', `<div class="alert warn" style="margin:0">${w.join(" · ")}</div><h4>`)).join("")}</div>` : ""}`;
    $("#gAsk").onclick = () => store.setItem("jsh-attach", `[지원금 찾기] 피보험자 ${n}명, 상황: ${tags.map(t => tagOpts.find(o => o[0] === t)[1]).join(", ")}\n해당 가능: ${ok.map(([g]) => g.name).join(", ")}`);
  };
  wf.addEventListener("change", run); wf.addEventListener("input", run); run();
}

/* ---------- Checks ---------- */
function renderCheck(id) {
  const k = CHECKS[id] ? id : "harass"; const c = CHECKS[k];
  view.innerHTML = `<p class="eyebrow">자가진단</p><h2 class="h2">${c.name}</h2><p class="lede">${c.desc}</p>
  <nav class="ck-tabs">${Object.entries(CHECKS).map(([i, x]) => `<a href="#check/${i}" ${i === k ? 'aria-current="true"' : ""}>${x.name}</a>`).join("")}</nav>
  <div id="ck"></div><div class="card pad sec">${kgLinks("ck:" + k)}${postsBox(k)}</div>${ctaBand()}`;
  ({ harass: chkHarass, sapa: chkSapa, small: chkSmall })[k]($("#ck"));
}
function qList(name, arr) { return `<div class="qs">${arr.map(([t, s], i) => `<label class="q"><input type="checkbox" name="${name}" value="${i}"><div><b>${t}</b>${s ? `<small>${s}</small>` : ""}</div></label>`).join("")}</div>`; }
function chkHarass(el) {
  el.innerHTML = `<div class="card pad"><form id="hf">
    <p class="grp-t"><i>1</i>행위자가 지위 또는 관계상 우위에 있나요?</p>${qList("a", HQ.a)}
    <p class="grp-t"><i>2</i>업무상 적정 범위를 넘는 행위가 있었나요?</p>${qList("b", HQ.b)}
    <p class="grp-t"><i>3</i>신체적·정신적 고통 또는 근무환경 악화가 있나요?</p>${qList("c", HQ.c)}
  </form><div id="hres"></div></div>
  <section class="sec card pad"><h3 style="margin:0 0 4px;font-size:17px">회사가 신고를 받았다면 (제76조의3)</h3><p class="lede" style="margin-bottom:12px">조치 의무를 이행하지 않으면 과태료 또는 형사처벌 대상이 될 수 있습니다.</p>
  <ul class="small-list"><li>지체 없이 객관적으로 조사 착수<span>제2항</span></li><li>조사 기간 중 피해자 보호(근무장소 변경·유급휴가 등)<span>제3항</span></li><li>괴롭힘 확인 시 피해자 요청에 따른 근무장소 변경·배치전환<span>제4항</span></li><li>행위자 징계·근무장소 변경 등 조치(피해자 의견 청취)<span>제5항</span></li><li>신고자·피해자에 대한 불리한 처우 금지<span>제6항, 형사처벌</span></li><li>조사 내용 비밀 유지<span>제7항</span></li></ul></section>`;
  const f = $("#hf");
  const run = () => {
    const a = $$("[name=a]:checked", f).length, b = $$("[name=b]:checked", f).length, c = $$("[name=c]:checked", f).length;
    const n = (a > 0) + (b > 0) + (c > 0);
    let al = ["info", "해당 항목을 선택하면 결과가 표시됩니다."];
    if (a + b + c) al = n === 3 ? ["bad", "세 가지 요소가 모두 확인됩니다. 직장 내 괴롭힘에 해당할 가능성이 높아 증거(메시지·녹취·진료기록)를 정리하고 전문가 상담을 권합니다."] : n === 2 ? ["warn", `세 요소 중 2개가 확인됩니다. ${a ? "" : "우위 관계"}${b ? "" : " 적정 범위 초과 행위"}${c ? "" : " 고통·환경 악화"} 부분을 구체적으로 검토해야 합니다.`] : ["info", "현재 선택만으로는 성립 가능성이 낮지만, 행위의 반복성·지속성에 따라 달라질 수 있습니다."];
    $("#hres").innerHTML = `<div class="meter" aria-hidden="true"><i style="width:${n / 3 * 100}%"></i></div><p class="src" style="margin:0">성립 요소 ${n}/3 충족</p><div class="alert ${al[0]}">${al[1]}</div>${n >= 2 ? `<div style="margin-top:12px"><a class="btn pri sm" href="#ask" id="hAsk">괴롭힘 사건 상담하기</a></div>` : ""}`;
    const h = $("#hAsk"); if (h) h.onclick = () => store.setItem("jsh-attach", `[직장 내 괴롭힘 자가진단] 성립 요소 ${n}/3\n- 우위: ${a}개, 행위: ${b}개, 피해: ${c}개 항목 해당`);
  };
  f.addEventListener("change", run); run();
}
function chkSapa(el) {
  el.innerHTML = `<div class="card pad"><form id="sf" class="form" onsubmit="return false">${numF("n", "상시근로자 수", 12, "명")}${optF("ind", "업종", [["g", "일반"], ["c", "건설업"]], "g", "")}<div class="full">${qList("q", SQ)}</div></form><div id="sres"></div></div>`;
  const f = $("#sf");
  const run = () => {
    const n = +f.n.value || 0, done = $$("[name=q]:checked", f).length;
    const pct = Math.round(done / SQ.length * 100);
    const app = n >= 5;
    $("#sres").innerHTML = `<div class="alert ${app ? "warn" : "good"}" style="margin-top:16px">${app ? `상시근로자 ${n}명: 중대재해처벌법 적용 대상입니다(5~49인 사업장은 2024.1.27.부터 적용).` : "상시근로자 5인 미만은 중대재해처벌법 중대산업재해 규정이 적용되지 않습니다. 산업안전보건법 의무는 별도로 확인하세요."}</div>
      ${app ? `<div class="meter"><i style="width:${pct}%"></i></div><p class="src" style="margin:0">이행 ${done}/${SQ.length} 항목 (${pct}%)</p>
      <div class="alert ${pct >= 89 ? "good" : pct >= 50 ? "warn" : "bad"}">${pct >= 89 ? "체계의 틀은 갖추었습니다. 반기 점검 기록과 증빙 관리가 핵심입니다." : pct >= 50 ? "일부 항목이 비어 있습니다. 사고 발생 시 경영책임자 의무 위반으로 판단될 수 있습니다." : "안전보건관리체계 구축이 시급합니다. 사망사고 시 경영책임자에게 1년 이상 징역 또는 10억원 이하 벌금이 규정되어 있습니다."}</div>
      <div style="margin-top:12px"><a class="btn pri sm" href="#ask" id="sAsk">안전보건관리체계 구축 상담</a></div>` : ""}`;
    const s = $("#sAsk"); if (s) s.onclick = () => store.setItem("jsh-attach", `[중대재해처벌법 점검] 상시근로자 ${n}명, 이행 ${done}/${SQ.length} 항목(${pct}%)`);
  };
  f.addEventListener("input", run); f.addEventListener("change", run); run();
}
function chkSmall(el) {
  el.innerHTML = `<div class="two"><div class="card pad"><p class="eyebrow" style="color:var(--ok)">적용됩니다</p><ul class="small-list">${SMALL.yes.map(([t, a]) => `<li>${t}<span>${a}</span></li>`).join("")}</ul></div>
  <div class="card pad"><p class="eyebrow" style="color:var(--red)">적용되지 않습니다</p><ul class="small-list">${SMALL.no.map(([t, a]) => `<li>${t}<span>${a}</span></li>`).join("")}</ul></div></div>
  <div class="alert info" style="margin-top:14px">상시근로자 수는 법 적용 사유 발생일 전 1개월 동안 사용한 근로자 연인원을 가동일수로 나누어 산정합니다(시행령 제7조의2). 단시간·일용직도 포함됩니다. 근거: <a href="${SRC.lsa.u}" target="_blank" rel="noopener">근로기준법 시행령 별표1</a></div>`;
}

/* ---------- Table ---------- */
function renderTable() {
  const cols = [["2025", "2025-07-01", "2025년"], ["2026", TODAY, "2026년 현재"], ["2027", "2027-01-01", "2027년 1월"]];
  view.innerHTML = `<p class="eyebrow">기준표</p><h2 class="h2">연도별 노무 기준 수치</h2><p class="lede">고시·법령 원문으로 확인한 수치입니다. 아직 결정되지 않은 값은 직전 값을 표시하고 '미정'으로 표기했습니다. 확인일 ${kdate(META.checked)}</p>
  ${SUMMARY.map(s => `<section class="sec"><div class="sec-h"><h3>${s.title}</h3></div><div class="tbl-wrap card"><table class="tbl"><thead><tr><th>항목</th>${cols.map(c => `<th class="r ${c[0] === YEAR ? "yr-cur" : ""}">${c[2]}</th>`).join("")}<th>근거</th></tr></thead><tbody>
  ${s.keys.map(k => { const f = FIG[k]; const e = getEntry(k, (cols.find(c => c[0] === YEAR) || cols[1])[1]) || {}; return `<tr><td><b style="font-weight:600">${f.n}</b>${e.note ? `<br><small class="src">${e.note}</small>` : ""}</td>${cols.map(c => { const en = getEntry(k, c[1]); return `<td class="r ${c[0] === YEAR ? "yr-cur" : ""}">${fmtV(k, getV(k, c[1]))}${en && en.status === "pending" ? '<br><span class="pend">미정</span>' : ""}</td>`; }).join("")}<td class="src">${f.calc ? f.basisText : `<a href="${e.s.u}" target="_blank" rel="noopener">${e.s.t}</a>`}</td></tr>`; }).join("")}
  </tbody></table></div></section>`).join("")}
  <section class="sec"><div class="sec-h"><h3>구직급여 소정급여일수</h3><span class="src"><a href="${SRC.eia.u}" target="_blank" rel="noopener">고용보험법 별표1</a></span></div><div class="tbl-wrap card"><table class="tbl"><thead><tr><th>피보험기간</th><th class="r">50세 미만</th><th class="r">50세 이상·장애인</th></tr></thead><tbody>${UI_DAYS.map(r => `<tr><td>${r.lbl}</td><td class="r">${r.v[0]}일</td><td class="r">${r.v[1]}일</td></tr>`).join("")}</tbody></table></div></section>
  <section class="sec"><div class="sec-h"><h3>연간 노무 일정</h3></div><div class="tbl-wrap card"><table class="tbl"><thead><tr><th>시기</th><th>할 일</th><th>기관</th></tr></thead><tbody>
  ${CAL_MONTHLY.map(e => `<tr><td>매월 ${e.d === 31 ? "말일" : e.d + "일"}</td><td>${e.t}${e.note ? `<br><small class="src">${e.note}</small>` : ""}</td><td>${e.who}</td></tr>`).join("")}
  ${CAL_ANNUAL.map(e => `<tr><td>${e.m}월 ${e.d}일</td><td>${e.t}${e.note ? `<br><small class="src">${e.note}</small>` : ""}</td><td>${e.who}</td></tr>`).join("")}</tbody></table></div></section>`;
}

/* ---------- Ask ---------- */
function renderAsk() {
  const att = store.getItem("jsh-attach") || "";
  view.innerHTML = `<p class="eyebrow">상담</p><h2 class="h2">대표 노무사에게 바로 문의하기</h2><p class="lede">작성한 내용이 정리된 메시지로 만들어집니다. 카카오톡·네이버 톡톡에서 붙여넣기만 하면 됩니다.</p>
  <div class="ask-grid sec" style="margin-top:18px">
    <section class="card pad"><form class="form" id="af" onsubmit="return false">
      <label class="fld"><span>성함 / 회사명</span><div class="inp"><input name="who" placeholder="홍길동 / ○○병원" autocomplete="name"></div></label>
      <label class="fld"><span>연락처</span><div class="inp"><input name="tel" inputmode="tel" placeholder="010-0000-0000" autocomplete="tel"></div></label>
      ${selF("size", "사업장 규모", [["", "선택"], ["5인 미만", "5인 미만"], ["5~29인", "5~29인"], ["30~99인", "30~99인"], ["100인 이상", "100인 이상"], ["근로자 개인", "근로자 개인 문의"]], "")}
      ${selF("role", "문의자", [["사업주", "사업주·인사담당자"], ["근로자", "근로자"]], "사업주")}
      ${optF("topic", "문의 분야", [["부당해고·징계", "부당해고·징계"], ["임금·퇴직금", "임금·퇴직금"], ["직장 내 괴롭힘", "직장 내 괴롭힘"], ["산재", "산재"], ["중대재해·안전", "중대재해·안전"], ["정부지원금", "정부지원금"], ["노무자문·규정", "노무자문·규정"], ["급여·4대보험", "급여·4대보험"]], "노무자문·규정")}
      <label class="fld full"><span>상담 내용</span><textarea name="msg" placeholder="상황을 간단히 적어 주세요. (언제, 누가, 무엇을)"></textarea></label>
      ${att ? `<div class="full"><p class="grp-t" style="margin:0 0 6px">첨부되는 계산·진단 결과 <button class="btn sm" type="button" id="rmAtt" style="height:26px;margin-left:auto">빼기</button></p><div class="attach">${esc(att)}</div></div>` : ""}
      <div class="full" style="display:flex;gap:8px;flex-wrap:wrap">
        <button class="btn kakao" type="button" data-go="kakao">카카오톡으로 보내기</button>
        <button class="btn talk" type="button" data-go="talk">네이버 톡톡으로 보내기</button>
        <button class="btn" type="button" data-go="mail">이메일</button>
      </div>
      <p class="src full" style="margin:0">입력한 내용은 이 기기 밖으로 저장·전송되지 않으며, 선택한 메신저로 직접 보내실 때만 전달됩니다.</p>
    </form></section>
    <aside class="card contact-card">
      <h3>${O.name}</h3><p>${O.rep} · 중대재해·산재·노동사건 전문</p>
      <div class="cc-list">
        <a class="btn kakao" href="${O.kakao}" target="_blank" rel="noopener">카카오톡 오픈채팅으로 상담</a>
        <a class="btn talk" href="${O.talk}" target="_blank" rel="noopener">네이버 톡톡으로 상담</a>
        <a class="btn line" href="${O.telHref}">${IC.bell} 전화 ${O.tel}</a>
        <a class="btn line" href="mailto:${O.email}">${O.email}</a>
        <a class="btn line" href="${O.home}" target="_blank" rel="noopener">홈페이지 jshlabor.co.kr</a>
        <a class="btn line" href="${O.blog}" target="_blank" rel="noopener">네이버 블로그 칼럼</a>
      </div>
      <p class="cc-t">주요 위촉 이력</p>
      <ul class="cc-career">${O.career.map(c => `<li>${c}</li>`).join("")}</ul>
      <p style="margin-top:18px">${O.addr}</p>
      <p style="margin-top:10px;font-size:12.5px">첫 상담 무료 · 상담부터 사건 종결까지 대표 노무사 직접 담당</p>
    </aside>
  </div>`;
  const rm = $("#rmAtt"); if (rm) rm.onclick = () => { store.removeItem("jsh-attach"); renderAsk(); };
  const f = $("#af");
  $$("[data-go]").forEach(b => b.onclick = () => {
    const v = k => (f.elements[k] && f.elements[k].value || "").trim();
    const topic = (f.querySelector("[name=topic]:checked") || {}).value || "";
    if (!v("msg") && !store.getItem("jsh-attach")) { toast("상담 내용을 적어 주세요"); f.msg.focus(); return; }
    const text = `[노무 워크스페이스 상담 신청]\n· 성함/회사: ${v("who") || "-"}\n· 연락처: ${v("tel") || "-"}\n· 구분: ${v("role")} / ${v("size") || "-"}\n· 분야: ${topic}\n\n${v("msg")}${store.getItem("jsh-attach") ? "\n\n" + store.getItem("jsh-attach") : ""}`;
    if (b.dataset.go === "mail") { location.href = `mailto:${O.email}?subject=${encodeURIComponent("[상담 신청] " + topic + " - " + (v("who") || ""))}&body=${encodeURIComponent(text)}`; return; }
    copy(text, "상담 내용을 복사했습니다. 채팅창에 붙여넣어 주세요");
    setTimeout(() => window.open(b.dataset.go === "kakao" ? O.kakao : O.talk, "_blank", "noopener"), 450);
  });
}

/* ---------- Command palette ---------- */
const IDX = [
  ...Object.entries(ROUTES).map(([r, t]) => ({ t, s: "메뉴", h: "#" + r, k: t })),
  ...CALCS.map(c => ({ t: c.name, s: "계산기", h: "#calc/" + c.id, k: c.name + c.desc + c.grp })),
  ...Object.entries(CHECKS).map(([i, c]) => ({ t: c.name, s: "진단", h: "#check/" + i, k: c.name + c.desc })),
  ...GRANTS.map(g => ({ t: g.name, s: "지원금", h: "#grants", k: g.name + g.head + g.req })),
  ...Object.entries(FIG).map(([k, f]) => ({ t: f.n, s: `기준표 · ${fmtV(k, getV(k, TODAY))}`, h: "#table", k: f.n + f.g }))
];
const pal = $("#palette"), pq = $("#palQ"), pl = $("#palList"); let sel = 0, res = [];
function palRender() {
  const q = pq.value.trim().replace(/\s/g, "");
  res = (q ? IDX.filter(x => x.k.replace(/\s/g, "").includes(q) || x.t.replace(/\s/g, "").includes(q)) : IDX.filter(x => x.s === "계산기" || x.s === "진단")).slice(0, 12);
  sel = Math.min(sel, Math.max(res.length - 1, 0));
  pl.innerHTML = res.length ? res.map((x, i) => `<li><a href="${x.h}" role="option" aria-selected="${i === sel}">${esc(x.t)}<span>${esc(x.s)}</span></a></li>`).join("") : `<li style="padding:14px;color:var(--muted)">검색 결과가 없습니다.</li>`;
}
function palOpen() { pal.hidden = false; pq.value = ""; sel = 0; palRender(); setTimeout(() => pq.focus(), 10); }
function palClose() { pal.hidden = true; }
$("#openSearch").onclick = palOpen;
pal.addEventListener("click", e => { if (e.target === pal || e.target.closest("a")) palClose(); });
pq.addEventListener("input", () => { sel = 0; palRender(); });
pq.addEventListener("keydown", e => {
  if (e.key === "ArrowDown") { sel = Math.min(sel + 1, res.length - 1); palRender(); e.preventDefault(); }
  if (e.key === "ArrowUp") { sel = Math.max(sel - 1, 0); palRender(); e.preventDefault(); }
  if (e.key === "Enter" && res[sel]) { location.hash = res[sel].h; palClose(); }
});
document.addEventListener("keydown", e => {
  if (e.key === "Escape" && !pal.hidden) palClose();
  if ((e.key === "/" || (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey))) && pal.hidden && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) { e.preventDefault(); palOpen(); }
});

route();
})();
