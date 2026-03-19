import { useState } from "react";

/* ─────────────────────────────────────────────────────────────────────────── */
/*  GLOBAL CSS                                                                  */
/* ─────────────────────────────────────────────────────────────────────────── */
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=Manrope:wght@300;400;500;600;700;800&family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20,400,0,0&display=swap');

  :root {
    --blue:        #0A1F5C;
    --blue-mid:    #1A3580;
    --blue-light:  #EDF0F8;
    --yellow:      #F5C242;
    --yellow-dark: #D4A020;
    --yellow-light:#FEFAE8;
    --light:       #F4F5F6;
    --border:      #E2E5EA;
    --text:        #1A202C;
    --mid:         #5C6B78;
    --muted:       #9AA3AE;
    --white:       #FFFFFF;
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  html, body, #root {
    font-family: 'Manrope', sans-serif;
    background: var(--white);
    color: var(--text);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  .material-symbols-outlined {
    font-family: 'Material Symbols Outlined';
    font-weight: normal; font-style: normal;
    font-size: inherit; line-height: 1;
    display: inline-flex; align-items: center; justify-content: center;
    letter-spacing: normal; text-transform: none;
    white-space: nowrap; word-wrap: normal;
    -webkit-font-feature-settings: 'liga'; font-feature-settings: 'liga';
    -webkit-font-smoothing: antialiased;
    user-select: none;
  }

  /* ── HEADER ─────────────────────────────────────────────────────────────── */
  .dw-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 14px 48px;
    background: var(--white);
    border-bottom: 1px solid var(--border);
    position: sticky; top: 0; z-index: 200;
  }
  .dw-logo-img { height: 32px; width: auto; object-fit: contain; display: block; }
  .dw-badge {
    font-size: 10px; font-weight: 800; letter-spacing: 0.12em;
    color: var(--blue); background: var(--blue-light);
    padding: 5px 14px; border-radius: 4px; text-transform: uppercase;
    border: 1px solid #C8D0E8;
  }

  /* ── NAV ─────────────────────────────────────────────────────────────────── */
  .dw-nav {
    display: flex; padding: 0 48px;
    border-bottom: 1px solid var(--border);
    background: var(--white);
    overflow-x: auto; scrollbar-width: none;
    position: sticky; top: 61px; z-index: 199;
  }
  .dw-nav::-webkit-scrollbar { display: none; }
  .dw-tab {
    display: flex; align-items: center; gap: 7px;
    padding: 15px 20px;
    font-size: 12px; font-weight: 700; color: var(--mid);
    cursor: pointer; white-space: nowrap;
    border: none; border-bottom: 2px solid transparent;
    background: none; font-family: 'Manrope', sans-serif;
    letter-spacing: 0.06em; text-transform: uppercase;
    transition: color 0.15s, border-color 0.15s;
  }
  .dw-tab:hover { color: var(--text); }
  .dw-tab.active { color: var(--blue); border-bottom-color: var(--blue); }
  .dw-tab-ico { font-size: 16px; opacity: 0.75; }

  /* ── HERO ────────────────────────────────────────────────────────────────── */
  .dw-hero {
    background: var(--blue);
    padding: 72px 48px 64px;
  }
  .dw-hero-inner { max-width: 1004px; margin: 0 auto; }

  .dw-hero-label {
    display: inline-flex; align-items: center; gap: 8px;
    font-size: 9.5px; font-weight: 800; letter-spacing: 0.2em; text-transform: uppercase;
    color: var(--yellow);
    border: 1px solid rgba(245,194,66,0.4);
    padding: 5px 14px; border-radius: 4px;
    margin-bottom: 28px;
  }
  .dw-hero-ldot {
    width: 6px; height: 6px; border-radius: 50%; background: var(--yellow);
    animation: livePulse 2s ease-in-out infinite;
  }
  .dw-hero-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 56px; font-weight: 600;
    color: var(--white); line-height: 1.08;
    margin-bottom: 18px; letter-spacing: -0.02em;
  }
  .dw-hero-title em {
    font-style: italic; color: rgba(255,255,255,0.5);
    font-size: 0.76em; display: block; margin-top: 8px;
  }
  .dw-hero-sub {
    font-size: 15px; color: rgba(255,255,255,0.6);
    line-height: 1.75; max-width: 560px; margin-bottom: 52px; font-weight: 400;
  }

  .dw-hero-stats {
    display: flex; gap: 0; align-items: stretch;
    border: 1px solid rgba(255,255,255,0.15);
    border-radius: 8px; overflow: hidden; width: fit-content;
  }
  .dw-hstat {
    padding: 24px 36px;
    border-right: 1px solid rgba(255,255,255,0.12);
  }
  .dw-hstat:last-child { border-right: none; }
  .dw-hstat-val {
    font-family: 'Cormorant Garamond', serif;
    font-size: 44px; font-weight: 700; line-height: 1;
    color: var(--white); letter-spacing: -0.03em;
  }
  .dw-hstat-val .accent { color: var(--yellow); }
  .dw-hstat-lbl {
    font-size: 10.5px; color: rgba(255,255,255,0.5);
    margin-top: 7px; font-weight: 600;
    letter-spacing: 0.07em; text-transform: uppercase;
  }

  /* ── SECTIONS ────────────────────────────────────────────────────────────── */
  .dw-section { padding: 52px 48px; max-width: 1100px; margin: 0 auto; }

  .dw-eyebrow {
    font-size: 9.5px; font-weight: 800; letter-spacing: 0.2em;
    text-transform: uppercase; color: var(--yellow-dark); margin-bottom: 12px;
  }
  .dw-section-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 36px; font-weight: 600; color: var(--blue); line-height: 1.18;
    margin-bottom: 36px; letter-spacing: -0.015em;
  }
  .dw-section-title em { font-style: italic; color: var(--mid); }

  /* ── CATEGORY CARDS ──────────────────────────────────────────────────────── */
  .dw-cats {
    display: grid; grid-template-columns: repeat(3, 1fr);
    gap: 10px; margin-bottom: 36px;
  }
  .dw-cat {
    display: flex; align-items: center; gap: 14px;
    padding: 14px 16px;
    border: 1px solid var(--border); border-radius: 6px;
    background: var(--white);
    transition: border-color 0.18s;
    animation: fadeUp 0.4s ease both;
  }
  .dw-cat:nth-child(1) { animation-delay: 0.04s; }
  .dw-cat:nth-child(2) { animation-delay: 0.08s; }
  .dw-cat:nth-child(3) { animation-delay: 0.12s; }
  .dw-cat:nth-child(4) { animation-delay: 0.16s; }
  .dw-cat:nth-child(5) { animation-delay: 0.20s; }
  .dw-cat:nth-child(6) { animation-delay: 0.24s; }
  .dw-cat:hover { border-color: var(--blue); }
  .dw-cat-ico {
    width: 38px; height: 38px; border-radius: 6px;
    background: var(--light);
    display: flex; align-items: center; justify-content: center;
    font-size: 20px; color: var(--blue); flex-shrink: 0;
  }
  .dw-cat-name { font-size: 13px; font-weight: 600; color: var(--text); }
  .dw-cat-sub  { font-size: 11px; color: var(--muted); margin-top: 2px; }

  /* ── AVAIL PILL ──────────────────────────────────────────────────────────── */
  .dw-avail {
    display: inline-flex; align-items: center; gap: 10px;
    padding: 10px 18px;
    background: var(--light); border: 1px solid var(--border);
    border-radius: 4px;
    font-size: 13px; font-weight: 600; color: var(--blue);
  }
  .dw-dot {
    width: 7px; height: 7px; border-radius: 50%; background: #22C55E;
    animation: livePulse 2s ease-in-out infinite;
  }
  @keyframes livePulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50%       { opacity: 0.6; transform: scale(1.35); }
  }

  /* ── SOURCE CARDS ────────────────────────────────────────────────────────── */
  .dw-sources {
    display: grid; grid-template-columns: repeat(3, 1fr);
    gap: 14px; margin-bottom: 28px;
  }
  .dw-src {
    border: 1px solid var(--border); border-radius: 8px; overflow: hidden;
    background: var(--white);
    transition: border-color 0.2s;
    animation: fadeUp 0.4s ease both;
  }
  .dw-src:nth-child(1) { animation-delay: 0.04s; }
  .dw-src:nth-child(2) { animation-delay: 0.10s; }
  .dw-src:nth-child(3) { animation-delay: 0.16s; }
  .dw-src:hover { border-color: var(--blue); }
  .dw-src-head {
    display: flex; align-items: flex-start; gap: 14px;
    padding: 20px 20px 14px;
    border-bottom: 1px solid var(--border);
    background: var(--light);
  }
  .dw-src-ico {
    width: 42px; height: 42px; border-radius: 6px;
    background: var(--white); border: 1px solid var(--border);
    display: flex; align-items: center; justify-content: center;
    font-size: 20px; flex-shrink: 0;
  }
  .dw-src-name { font-size: 14px; font-weight: 700; }
  .dw-src-sub  { font-size: 11.5px; color: var(--mid); margin-top: 3px; }
  .dw-src-body { padding: 14px 20px 18px; display: flex; flex-direction: column; gap: 9px; }
  .dw-src-item { display: flex; align-items: flex-start; gap: 10px; font-size: 12.5px; color: var(--mid); line-height: 1.5; }
  .dw-src-dot  { width: 4px; height: 4px; border-radius: 50%; flex-shrink: 0; margin-top: 7px; background: var(--blue); }

  /* ── NOTE BOX ────────────────────────────────────────────────────────────── */
  .dw-note {
    display: flex; align-items: center; gap: 14px;
    padding: 16px 20px;
    background: var(--yellow-light);
    border: 1px solid #EDD878;
    border-radius: 6px;
    font-size: 13.5px; color: var(--text); line-height: 1.65; font-weight: 500;
  }
  .dw-note-ico { color: var(--yellow-dark); font-size: 22px; flex-shrink: 0; }

  /* ── PACKAGES ────────────────────────────────────────────────────────────── */
  .dw-pkgs { display: flex; flex-direction: column; gap: 6px; margin-bottom: 24px; }
  .dw-pkg {
    display: grid; grid-template-columns: 42px 170px 1fr auto;
    align-items: center; gap: 18px;
    padding: 16px 20px;
    border: 1px solid var(--border); border-radius: 6px;
    cursor: pointer;
    transition: border-color 0.18s, background 0.18s;
    background: var(--white);
    position: relative; overflow: hidden;
  }
  .dw-pkg::before {
    content: ''; position: absolute;
    left: 0; top: 0; bottom: 0; width: 3px;
    background: transparent; transition: background 0.18s;
  }
  .dw-pkg:hover { background: var(--light); }
  .dw-pkg:hover::before { background: var(--border); }
  .dw-pkg.open { border-color: var(--blue); }
  .dw-pkg.open::before { background: var(--blue); }
  .dw-pkg-ico {
    width: 42px; height: 42px; border-radius: 6px;
    background: var(--light);
    display: flex; align-items: center; justify-content: center;
    font-size: 20px; color: var(--blue);
  }
  .dw-pkg-name { font-size: 12px; font-weight: 800; letter-spacing: 0.07em; text-transform: uppercase; color: var(--blue); }
  .dw-pkg-sub  { font-size: 11.5px; color: var(--mid); margin-top: 3px; font-weight: 400; }
  .dw-tags { display: flex; flex-wrap: wrap; gap: 5px; }
  .dw-tag {
    font-size: 10.5px; font-weight: 600; padding: 3px 9px;
    border-radius: 4px;
    background: var(--light); color: var(--mid);
    border: 1px solid var(--border);
  }
  .dw-pkg.open .dw-tag { background: var(--blue-light); color: var(--blue); border-color: #C8D0E8; }
  .dw-chevron {
    display: flex; align-items: center; justify-content: center;
    font-size: 20px; color: var(--muted);
    transition: transform 0.22s;
  }
  .dw-pkg.open .dw-chevron { transform: rotate(180deg); color: var(--blue); }
  .dw-pkg-detail {
    grid-column: 1 / -1;
    padding-top: 14px; margin-top: 6px;
    border-top: 1px solid var(--border);
    font-size: 13.5px; color: var(--mid); line-height: 1.75;
  }
  .dw-flex-note {
    font-size: 13px; color: var(--blue); font-weight: 500;
    padding: 13px 18px;
    border-left: 3px solid var(--yellow);
    background: var(--light); border-radius: 0 6px 6px 0;
    line-height: 1.65;
  }

  /* ── USE CASES ───────────────────────────────────────────────────────────── */
  .dw-uses {
    display: grid; grid-template-columns: 1fr 1fr;
    gap: 12px; margin-bottom: 28px;
  }
  .dw-use {
    padding: 24px; border: 1px solid var(--border); border-radius: 8px;
    background: var(--white);
    transition: border-color 0.18s;
    animation: fadeUp 0.4s ease both;
  }
  .dw-use:nth-child(1) { animation-delay: 0.04s; }
  .dw-use:nth-child(2) { animation-delay: 0.09s; }
  .dw-use:nth-child(3) { animation-delay: 0.14s; }
  .dw-use:nth-child(4) { animation-delay: 0.19s; }
  .dw-use:hover { border-color: var(--blue); }
  .dw-use-head { display: flex; align-items: center; gap: 13px; margin-bottom: 12px; }
  .dw-use-ico {
    width: 42px; height: 42px; border-radius: 6px;
    background: var(--light);
    display: flex; align-items: center; justify-content: center;
    font-size: 22px; color: var(--blue); flex-shrink: 0;
  }
  .dw-use-dept { font-size: 14.5px; font-weight: 700; color: var(--blue); }
  .dw-use-body { font-size: 13px; color: var(--mid); line-height: 1.72; }
  .dw-pills    { display: flex; flex-wrap: wrap; gap: 5px; margin-top: 13px; }
  .dw-pill {
    font-size: 11px; font-weight: 500; padding: 3px 10px;
    border: 1px solid var(--border); border-radius: 4px;
    color: var(--mid); background: var(--light);
  }

  /* ── BENEFITS ────────────────────────────────────────────────────────────── */
  .dw-benefits {
    display: grid; grid-template-columns: repeat(3, 1fr);
    gap: 1px; background: var(--border);
    border: 1px solid var(--border); border-radius: 8px; overflow: hidden;
  }
  .dw-ben {
    background: var(--light); padding: 20px 18px;
    display: flex; align-items: flex-start; gap: 14px;
  }
  .dw-ben-ico {
    width: 38px; height: 38px; border-radius: 6px;
    background: var(--blue);
    display: flex; align-items: center; justify-content: center;
    font-size: 20px; color: var(--white); flex-shrink: 0;
  }
  .dw-ben-title { font-size: 13px; font-weight: 700; color: var(--blue); margin-bottom: 3px; }
  .dw-ben-sub   { font-size: 12px; color: var(--mid); line-height: 1.5; }

  /* ── CONTACT ─────────────────────────────────────────────────────────────── */
  .dw-contact { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; align-items: start; }

  .dw-cta {
    background: var(--blue);
    border-radius: 10px; padding: 38px 34px; color: var(--white);
  }
  .dw-cta-tag {
    display: inline-block;
    font-size: 9px; font-weight: 800; letter-spacing: 0.18em; text-transform: uppercase;
    color: var(--yellow); border: 1px solid rgba(245,194,66,0.35);
    padding: 4px 12px; border-radius: 4px; margin-bottom: 20px;
  }
  .dw-cta-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 28px; font-weight: 600; line-height: 1.25; margin-bottom: 12px;
  }
  .dw-cta-sub  { font-size: 13.5px; opacity: .68; line-height: 1.7; margin-bottom: 28px; }
  .dw-cta-list { display: flex; flex-direction: column; gap: 10px; }
  .dw-cta-item { display: flex; align-items: center; gap: 11px; font-size: 13px; font-weight: 500; }
  .dw-cta-chk  {
    width: 20px; height: 20px; border-radius: 50%;
    background: rgba(245,194,66,0.18); border: 1px solid rgba(245,194,66,0.4);
    display: flex; align-items: center; justify-content: center;
    font-size: 13px; flex-shrink: 0; color: var(--yellow);
  }
  .dw-cta-footer {
    margin-top: 30px; padding-top: 20px;
    border-top: 1px solid rgba(255,255,255,0.12);
    font-size: 12.5px; opacity: .55;
    display: flex; flex-direction: column; gap: 6px;
  }

  .dw-form-box {
    border: 1px solid var(--border); border-radius: 10px;
    padding: 32px 28px; background: var(--light);
  }
  .dw-form-title { font-size: 15px; font-weight: 700; color: var(--blue); margin-bottom: 22px; }
  .dw-form-row   { display: flex; flex-direction: column; gap: 5px; margin-bottom: 13px; }
  .dw-form-lbl   { font-size: 10px; font-weight: 800; color: var(--mid); text-transform: uppercase; letter-spacing: 0.1em; }
  .dw-form-input, .dw-form-select {
    padding: 10px 13px; width: 100%;
    border: 1px solid var(--border); border-radius: 6px;
    font-size: 13.5px; font-family: 'Manrope', sans-serif;
    background: var(--white); color: var(--text); outline: none;
    transition: border-color 0.18s;
    appearance: auto;
  }
  .dw-form-input:focus, .dw-form-select:focus { border-color: var(--blue); }
  .dw-form-btn {
    width: 100%; padding: 13px;
    background: var(--blue); color: var(--white); border: none;
    border-radius: 6px; font-size: 14px; font-weight: 700;
    font-family: 'Manrope', sans-serif; cursor: pointer;
    margin-top: 8px; transition: background 0.18s;
  }
  .dw-form-btn:hover { background: var(--blue-mid); }
  .dw-form-btn:disabled { background: #C5CDD5; cursor: default; }
  .dw-success { text-align: center; padding: 40px 16px; }
  .dw-success-ico { font-size: 48px; color: #22C55E; margin-bottom: 14px; }
  .dw-success-title { font-family: 'Cormorant Garamond', serif; font-size: 26px; font-weight: 600; color: var(--blue); margin-bottom: 10px; }
  .dw-success-sub   { font-size: 13px; color: var(--mid); line-height: 1.65; }

  /* ── FOOTER ──────────────────────────────────────────────────────────────── */
  .dw-footer {
    background: var(--blue);
    padding: 28px 48px;
    display: flex; align-items: center; justify-content: space-between;
    gap: 24px;
    border-top: 1px solid rgba(255,255,255,0.06);
  }
  .dw-footer-tagline { font-size: 12px; color: rgba(255,255,255,0.4); font-weight: 400; }
  .dw-footer-contact {
    font-size: 12.5px; color: rgba(255,255,255,0.45);
    display: flex; gap: 20px; align-items: center;
  }
  .dw-footer-contact a { color: var(--yellow); text-decoration: none; font-weight: 500; }
  .dw-footer-contact a:hover { text-decoration: underline; }

  /* ── HR ──────────────────────────────────────────────────────────────────── */
  .dw-hr { height: 1px; background: var(--border); }

  /* ── ANIMATIONS ──────────────────────────────────────────────────────────── */
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(14px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .dw-fade  { animation: fadeUp 0.35s ease both; }
  .dw-fade1 { animation: fadeUp 0.35s 0.06s ease both; }
  .dw-fade2 { animation: fadeUp 0.35s 0.12s ease both; }
  .dw-fade3 { animation: fadeUp 0.35s 0.18s ease both; }

  /* ── RESPONSIVE ──────────────────────────────────────────────────────────── */
  @media (max-width: 820px) {
    .dw-header { padding: 14px 20px; }
    .dw-nav    { padding: 0 12px; }
    .dw-tab    { padding: 13px 12px; font-size: 11px; }
    .dw-hero   { padding: 44px 20px 40px; }
    .dw-hero-title { font-size: 36px; }
    .dw-hero-stats { flex-direction: column; width: 100%; border-radius: 6px; }
    .dw-hstat { border-right: none; border-bottom: 1px solid rgba(255,255,255,0.1); padding: 18px 22px; }
    .dw-hstat:last-child { border-bottom: none; }
    .dw-section { padding: 36px 20px; }
    .dw-cats, .dw-sources, .dw-uses, .dw-benefits, .dw-contact { grid-template-columns: 1fr; }
    .dw-pkg { grid-template-columns: 42px 1fr auto; }
    .dw-tags { display: none; }
    .dw-footer { flex-direction: column; align-items: flex-start; padding: 28px 20px; gap: 12px; }
    .dw-footer-contact { flex-direction: column; gap: 6px; }
  }
`;

/* ─────────────────────────────────────────────────────────────────────────── */
/*  ICON COMPONENT                                                              */
/* ─────────────────────────────────────────────────────────────────────────── */
function Icon({ name, size = 20, style = {} }) {
  return (
    <span
      className="material-symbols-outlined"
      style={{ fontSize: size, lineHeight: 1, ...style }}
    >
      {name}
    </span>
  );
}

/* ─────────────────────────────────────────────────────────────────────────── */
/*  DATA                                                                        */
/* ─────────────────────────────────────────────────────────────────────────── */

const STATS = [
  { val: "135", unit: " 000+", lbl: "Punktów sprzedaży FMCG" },
  { val: "47",  unit: " 000+", lbl: "Lokali HoReCa" },
  { val: "100", unit: "+",     lbl: "Sieci grocery" },
];

const CATS = [
  { icon: "shopping_cart",    name: "Supermarkety & Hipermarkety", sub: "sieci ogólnopolskie" },
  { icon: "store",            name: "Sklepy spożywcze",            sub: "dyskont, convenience" },
  { icon: "coffee",           name: "Kawiarnie & Café",            sub: "w tym sieci kawowe" },
  { icon: "restaurant",       name: "Restauracje & Bary",          sub: "kanał on-trade" },
  { icon: "fastfood",         name: "Fast-food & Puby",            sub: "QSR i gastro nieformalna" },
  { icon: "storefront",       name: "Sieci detaliczne",            sub: "~100 sieci, 60k+ punktów" },
];

const SOURCES = [
  {
    icon: "database", color: "#0A1F5C",
    name: "DataWise", sub: "Własna baza przestrzenna",
    items: [
      "Populacja i demografia (GUS + modelowanie)",
      "Konkurencja w otoczeniu — szczegółowa mapa rynku",
      "Siła nabywcza i prognozy demograficzne",
      "Generatory ruchu (biura, galerie, komunikacja)",
    ],
  },
  {
    icon: "cell_tower", color: "#003DA5",
    name: "T-Mobile Big Data", sub: "Dane z sieci komórkowej",
    items: [
      "Ruch dzienny i tygodniowy w otoczeniu POS",
      "Wskaźniki turystyki i przepływy sezonowe",
      "Anonimowe przepływy ludności",
      "Godziny szczytowe i profile tygodniowe",
    ],
  },
  {
    icon: "credit_card", color: "#1A1F71",
    name: "Visa", sub: "Dane transakcyjne",
    items: [
      "Wydatki w kanałach (grocery, HoReCa, e-com…)",
      "Wartość koszyka i częstotliwość zakupów",
      "Segmenty klientów wg life-style",
      "Zachowania i preferencje konsumentów",
    ],
  },
];

const PACKAGES = [
  {
    icon: "group",
    name: "BASIC", sub: "Fundament każdej analizy",
    tags: ["Populacja", "Demografia", "Konkurencja"],
    detail: "Dane demograficzne z rozkładem wiekowym i płciowym, liczba mieszkańców i pracujących w zasięgu POS (250m / 500m / 1km / 3km / 5km). Mapa konkurencji z typologią i odległościami. Idealny punkt startowy do segmentacji i priorytetyzacji sieci sprzedaży.",
  },
  {
    icon: "map",
    name: "COMPETITION", sub: "Szczegółowa mapa konkurencji",
    tags: ["Konkurencja", "Generatory ruchu", "Otoczenie"],
    detail: "Rozszerzona analiza konkurencji z typologią formatów i zasięgami izochron. Generatory ruchu: biura, centra handlowe, dworce, uczelnie, szpitale. Pozwala odpowiedzieć: co przyciąga klientów do danego POS?",
  },
  {
    icon: "signal_cellular_alt",
    name: "TRAFFIC", sub: "Ruch i zachowania przestrzenne",
    tags: ["Ruch", "Turystyka", "T-Mobile"],
    detail: "Dane z sieci komórkowej T-Mobile: liczba unikalnych użytkowników w zasięgu POS z podziałem na godziny i dni tygodnia, wskaźniki turystyki i sezonowości. Kluczowe dla decyzji o rozmieszczeniu chłodziarek i materiałów POS.",
  },
  {
    icon: "payments",
    name: "SPENDINGS", sub: "Wydatki i wartość koszyka",
    tags: ["Wydatki", "Kanały", "Visa"],
    detail: "Dane Visa: wolumen i wartość transakcji wg kategorii (grocery, horeca, e-com, stacje), średnia wartość koszyka, penetracja kart. Pomaga odpowiedzieć: gdzie są klienci z wysoką siłą nabywczą?",
  },
  {
    icon: "person_search",
    name: "LIFE-STYLE", sub: "Segmenty i styl życia",
    tags: ["Segmenty", "Life-style", "Visa"],
    detail: "Segmentacja konsumentów wg zachowań transakcyjnych Visa. Pozwala dopasować portfolio marek i mechanizmy promocyjne do realnych preferencji klientów w zasięgu POS.",
  },
];

const USE_CASES = [
  {
    icon: "bar_chart", dept: "Trade Marketing",
    body: "Gdzie inwestować majątek trwały (lodówki, kasetony, nalewaki)? W których POS-ach priorytetyzować ekspozycję? Dane pozwalają odpowiadać na pytania numerycznie, a nie intuicyjnie.",
    pills: ["Priorytety inwestycji", "Optymalizacja majątku", "Ekspozycja"],
  },
  {
    icon: "star", dept: "Brand Management",
    body: "Które marki promować w jakich POS-ach? Segmentacja otoczenia pozwala dopasować portfolio do profilu konsumenta — premium tam gdzie premium, value tam gdzie value.",
    pills: ["Portfolio fit", "Segmentacja POS", "Dobór marki"],
  },
  {
    icon: "local_shipping", dept: "Route to Market",
    body: "Częstotliwość wizyt, priorytety i zadania dla sił terenowych. Optymalizacja tras i zasięgu dystrybutorów opartych o faktyczny potencjał, nie historię sprzedaży.",
    pills: ["Optymalizacja tras", "Priorytety wizyt", "SFA / dystrybucja"],
  },
  {
    icon: "trending_up", dept: "BI & Raportowanie",
    body: "Wzbogacenie danych wewnętrznych (sprzedaż, dystrybucja) o kontekst przestrzenny. Benchmarking wyników vs. potencjał — wreszcie wiadomo, który POS jest pod-, a który nad-realizatorem.",
    pills: ["Benchmarking", "Enrichment CRM", "Dashboard"],
  },
];

const BENEFITS = [
  { icon: "bolt",      title: "Dostępna od ręki", sub: "Gotowe pliki + API — zero czasu na zbieranie" },
  { icon: "extension", title: "Modularna oferta",  sub: "Kupujesz tylko potrzebne pakiety danych" },
  { icon: "handshake", title: "Unikalne źródła",   sub: "DataWise + T-Mobile + Visa w jednym produkcie" },
];

const TABS = [
  { id: "baza",    label: "Baza POS",        icon: "store" },
  { id: "zrodla",  label: "Źródła danych",   icon: "hub" },
  { id: "pakiety", label: "Pakiety",          icon: "apps" },
  { id: "uzycia",  label: "Zastosowania",     icon: "lightbulb" },
  { id: "kontakt", label: "Próbka & Kontakt", icon: "mail" },
];

/* ─────────────────────────────────────────────────────────────────────────── */
/*  TAB COMPONENTS                                                              */
/* ─────────────────────────────────────────────────────────────────────────── */

function TabBaza() {
  return (
    <>
      <div className="dw-hero">
        <div className="dw-hero-inner">
          <div className="dw-hero-label dw-fade">
            <span className="dw-hero-ldot" />
            Produkt dostępny od ręki
          </div>
          <h1 className="dw-hero-title dw-fade1">
            Wszechstronny Univers Punktów Sprzedaży
            <em>z danymi o potencjale otoczenia — dla rynku FMCG w Polsce</em>
          </h1>
          <p className="dw-hero-sub dw-fade2">
            Baza 135&nbsp;000+ lokalizacji FMCG i HoReCa wzbogacona o dane przestrzenne,
            demograficzne, mobilne (T-Mobile) i transakcyjne (Visa). Gotowa do integracji z CRM i BI.
          </p>
          <div className="dw-hero-stats dw-fade3">
            {STATS.map((s) => (
              <div className="dw-hstat" key={s.lbl}>
                <div className="dw-hstat-val">
                  {s.val}<span className="accent">{s.unit}</span>
                </div>
                <div className="dw-hstat-lbl">{s.lbl}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="dw-section">
        <p className="dw-eyebrow dw-fade">Kategorie w bazie</p>
        <h2 className="dw-section-title dw-fade1">
          Pełne pokrycie kanałów<br />
          <em>grocery i HoReCa</em>
        </h2>
        <div className="dw-cats">
          {CATS.map((c) => (
            <div className="dw-cat" key={c.name}>
              <div className="dw-cat-ico">
                <Icon name={c.icon} size={20} />
              </div>
              <div>
                <div className="dw-cat-name">{c.name}</div>
                <div className="dw-cat-sub">{c.sub}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="dw-avail dw-fade">
          <div className="dw-dot" />
          Baza dostępna od ręki — gotowe pliki i API
        </div>
      </div>
    </>
  );
}

function TabZrodla() {
  return (
    <div className="dw-section">
      <p className="dw-eyebrow dw-fade">Partnerzy danych</p>
      <h2 className="dw-section-title dw-fade1">
        Trzy unikalne źródła<br />
        <em>w jednym produkcie</em>
      </h2>
      <div className="dw-sources">
        {SOURCES.map((s) => (
          <div className="dw-src" key={s.name}>
            <div className="dw-src-head">
              <div className="dw-src-ico" style={{ color: s.color }}>
                <Icon name={s.icon} size={22} />
              </div>
              <div>
                <div className="dw-src-name" style={{ color: s.color }}>{s.name}</div>
                <div className="dw-src-sub">{s.sub}</div>
              </div>
            </div>
            <div className="dw-src-body">
              {s.items.map((item) => (
                <div className="dw-src-item" key={item}>
                  <div className="dw-src-dot" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="dw-note dw-fade">
        <Icon name="emoji_events" size={22} style={{ color: "#D4A020", flexShrink: 0 }} />
        Jako jedyna firma w Polsce łączymy te trzy źródła w jednym produkcie — gotowym do integracji z systemami CRM i BI.
      </div>
    </div>
  );
}

function TabPakiety() {
  const [open, setOpen] = useState(null);
  const toggle = (name) => setOpen((prev) => (prev === name ? null : name));

  return (
    <div className="dw-section">
      <p className="dw-eyebrow dw-fade">Oferta modułowa</p>
      <h2 className="dw-section-title dw-fade1">
        5 pakietów danych —<br />
        <em>płacisz tylko za to, czego potrzebujesz</em>
      </h2>
      <div className="dw-pkgs">
        {PACKAGES.map((p) => (
          <div
            key={p.name}
            className={`dw-pkg${open === p.name ? " open" : ""}`}
            onClick={() => toggle(p.name)}
          >
            <div className="dw-pkg-ico">
              <Icon name={p.icon} size={20} />
            </div>
            <div>
              <div className="dw-pkg-name">{p.name}</div>
              <div className="dw-pkg-sub">{p.sub}</div>
            </div>
            <div className="dw-tags">
              {p.tags.map((t) => <span className="dw-tag" key={t}>{t}</span>)}
            </div>
            <div className="dw-chevron">
              <Icon name="expand_more" size={20} />
            </div>
            {open === p.name && (
              <div className="dw-pkg-detail">{p.detail}</div>
            )}
          </div>
        ))}
      </div>
      <div className="dw-flex-note dw-fade">
        Klient może wybrać dowolną kombinację pakietów i dokupować je w miarę potrzeb — brak konieczności zakupu całości.
      </div>
    </div>
  );
}

function TabUzycia() {
  return (
    <div className="dw-section">
      <p className="dw-eyebrow dw-fade">Zastosowania</p>
      <h2 className="dw-section-title dw-fade1">Kto i jak korzysta z danych?</h2>
      <div className="dw-uses">
        {USE_CASES.map((u) => (
          <div className="dw-use" key={u.dept}>
            <div className="dw-use-head">
              <div className="dw-use-ico">
                <Icon name={u.icon} size={22} />
              </div>
              <div className="dw-use-dept">{u.dept}</div>
            </div>
            <div className="dw-use-body">{u.body}</div>
            <div className="dw-pills">
              {u.pills.map((p) => <span className="dw-pill" key={p}>{p}</span>)}
            </div>
          </div>
        ))}
      </div>
      <p className="dw-eyebrow" style={{ marginBottom: "14px" }}>Dlaczego DataWise</p>
      <div className="dw-benefits">
        {BENEFITS.map((b) => (
          <div className="dw-ben" key={b.title}>
            <div className="dw-ben-ico">
              <Icon name={b.icon} size={20} />
            </div>
            <div>
              <div className="dw-ben-title">{b.title}</div>
              <div className="dw-ben-sub">{b.sub}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TabKontakt() {
  const [form, setForm] = useState({ name: "", company: "", email: "", sector: "" });
  const [sent, setSent] = useState(false);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const valid = form.name.trim() && form.email.includes("@");

  return (
    <div className="dw-section">
      <p className="dw-eyebrow dw-fade">Próbka & Kontakt</p>
      <h2 className="dw-section-title dw-fade1">Zainteresowany próbką danych?</h2>
      <div className="dw-contact">
        <div className="dw-cta dw-fade">
          <div className="dw-cta-tag">Bezpłatna próbka</div>
          <div className="dw-cta-title">Wyślemy Ci fragment bazy dla Twojej kategorii</div>
          <div className="dw-cta-sub">
            Przygotujemy próbkę dopasowaną do Twojego sektora, portfolio marek i obszaru geograficznego.
          </div>
          <div className="dw-cta-list">
            {[
              "Dane dostępne od ręki",
              "Prezentacja i demo na żądanie",
              "Bezpłatna próbka dla nowych klientów",
              "Integracja z Twoim CRM / BI",
            ].map((b) => (
              <div className="dw-cta-item" key={b}>
                <div className="dw-cta-chk">
                  <Icon name="check" size={13} />
                </div>
                {b}
              </div>
            ))}
          </div>
          <div className="dw-cta-footer">
            <span>kontakt@datawise.pl</span>
            <span>www.datawise.pl</span>
          </div>
        </div>

        <div className="dw-form-box dw-fade1">
          {sent ? (
            <div className="dw-success">
              <div className="dw-success-ico">
                <Icon name="check_circle" size={52} />
              </div>
              <div className="dw-success-title">Dziękujemy!</div>
              <div className="dw-success-sub">
                Skontaktujemy się w ciągu 24h z próbką danych dopasowaną do Twojej kategorii.
              </div>
            </div>
          ) : (
            <>
              <div className="dw-form-title">Poproś o próbkę danych</div>
              <div className="dw-form-row">
                <label className="dw-form-lbl">Imię i Nazwisko *</label>
                <input className="dw-form-input" placeholder="Jan Kowalski" value={form.name} onChange={set("name")} />
              </div>
              <div className="dw-form-row">
                <label className="dw-form-lbl">Firma</label>
                <input className="dw-form-input" placeholder="Coca-Cola, PepsiCo, Maspex…" value={form.company} onChange={set("company")} />
              </div>
              <div className="dw-form-row">
                <label className="dw-form-lbl">Email *</label>
                <input className="dw-form-input" type="email" placeholder="jan@firma.pl" value={form.email} onChange={set("email")} />
              </div>
              <div className="dw-form-row">
                <label className="dw-form-lbl">Sektor / kategoria</label>
                <select className="dw-form-select" value={form.sector} onChange={set("sector")}>
                  <option value="">Wybierz…</option>
                  <option>Napoje bezalkoholowe</option>
                  <option>Piwo i alkohole</option>
                  <option>Wyroby tytoniowe</option>
                  <option>Lody i mrożonki</option>
                  <option>Kosmetyki / FMCG non-food</option>
                  <option>Retail / Sieci handlowe</option>
                  <option>Inne FMCG</option>
                </select>
              </div>
              <button className="dw-form-btn" disabled={!valid} onClick={() => setSent(true)}>
                Wyślij zapytanie o próbkę →
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function Footer() {
  return (
    <>
      <div className="dw-hr" />
      <footer className="dw-footer">
        <span className="dw-footer-tagline">DataWise · Baza Punktów Sprzedaży FMCG · Polska</span>
        <div className="dw-footer-contact">
          <a href="mailto:kontakt@datawise.pl">kontakt@datawise.pl</a>
          <a href="https://www.datawise.pl" target="_blank" rel="noopener noreferrer">www.datawise.pl</a>
        </div>
      </footer>
    </>
  );
}

/* ─────────────────────────────────────────────────────────────────────────── */
/*  ROOT                                                                        */
/* ─────────────────────────────────────────────────────────────────────────── */

export default function App() {
  const [active, setActive] = useState("baza");

  const panels = {
    baza:    <TabBaza />,
    zrodla:  <TabZrodla />,
    pakiety: <TabPakiety />,
    uzycia:  <TabUzycia />,
    kontakt: <TabKontakt />,
  };

  return (
    <>
      <style>{GLOBAL_CSS}</style>

      <header className="dw-header">
        <img src="/assets/DataWise_logo.png" alt="DataWise" className="dw-logo-img" />
        <div className="dw-badge">Baza POS FMCG</div>
      </header>

      <nav className="dw-nav">
        {TABS.map((t) => (
          <button
            key={t.id}
            className={`dw-tab${active === t.id ? " active" : ""}`}
            onClick={() => setActive(t.id)}
          >
            <Icon name={t.icon} size={16} style={{ opacity: 0.7 }} />
            {t.label}
          </button>
        ))}
      </nav>

      <main key={active}>
        {panels[active]}
      </main>

      <Footer />
    </>
  );
}
