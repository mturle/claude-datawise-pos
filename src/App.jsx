import { useState, useEffect, useRef } from "react";

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
  .dw-header-right {
    display: flex; align-items: center; gap: 12px;
  }

  /* ── LANG SWITCH ─────────────────────────────────────────────────────────── */
  .dw-lang-switch {
    display: flex; align-items: center;
    border: 1px solid var(--border); border-radius: 4px; overflow: hidden;
  }
  .dw-lang-btn {
    padding: 5px 11px; font-size: 11px; font-weight: 700;
    background: none; border: none; cursor: pointer;
    color: var(--mid); font-family: 'Manrope', sans-serif;
    transition: background 0.15s, color 0.15s;
    letter-spacing: 0.06em; text-transform: uppercase;
  }
  .dw-lang-btn + .dw-lang-btn { border-left: 1px solid var(--border); }
  .dw-lang-btn.active { background: var(--blue); color: var(--white); }
  .dw-lang-btn:not(.active):hover { background: var(--light); color: var(--text); }

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

  /* ── MAP ─────────────────────────────────────────────────────────────────── */
  .dw-map-wrap {
    height: 520px; width: 100%;
    border-top: 1px solid var(--border);
    border-bottom: 1px solid var(--border);
    position: relative;
  }
  .dw-map-container { height: 100%; width: 100%; }
  .dw-map-legend {
    display: flex; align-items: center; gap: 20px; flex-wrap: wrap;
    padding: 16px 48px;
    background: var(--light);
    border-bottom: 1px solid var(--border);
    font-size: 12px; color: var(--mid);
  }
  .dw-map-legend-title { font-weight: 700; color: var(--blue); font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; margin-right: 4px; }
  .dw-legend-item { display: flex; align-items: center; gap: 6px; font-weight: 500; }
  .dw-legend-dot { width: 11px; height: 11px; border-radius: 50%; border: 1.5px solid rgba(255,255,255,0.6); flex-shrink: 0; }
  .dw-map-info {
    padding: 20px 48px 0;
    font-size: 13px; color: var(--mid); line-height: 1.65;
    max-width: 1100px; margin: 0 auto;
  }

  /* ── LEAFLET POPUP OVERRIDES ─────────────────────────────────────────────── */
  .leaflet-popup-content-wrapper {
    border-radius: 8px !important;
    border: 1px solid var(--border) !important;
    box-shadow: 0 4px 16px rgba(0,0,0,0.1) !important;
    padding: 0 !important;
    overflow: hidden;
  }
  .leaflet-popup-content { margin: 0 !important; width: auto !important; min-width: 260px; }
  .leaflet-popup-tip-container { display: none; }
  .leaflet-popup-close-button {
    top: 8px !important; right: 10px !important;
    color: rgba(255,255,255,0.7) !important; font-size: 18px !important;
    z-index: 1;
  }
  .dw-popup-head {
    background: var(--blue); padding: 14px 16px;
  }
  .dw-popup-name {
    font-size: 14px; font-weight: 700; color: #fff;
    display: flex; align-items: center; gap: 8px;
  }
  .dw-popup-addr { font-size: 11.5px; color: rgba(255,255,255,0.65); margin-top: 3px; }
  .dw-popup-rank {
    display: inline-flex; align-items: center; gap: 5px;
    font-size: 10px; font-weight: 800; letter-spacing: 0.08em;
    background: var(--yellow); color: var(--blue);
    padding: 2px 8px; border-radius: 4px; margin-top: 6px;
  }
  .dw-popup-body { padding: 10px 0; max-height: 280px; overflow-y: auto; }
  .dw-popup-section { padding: 6px 16px 4px; font-size: 9px; font-weight: 800; letter-spacing: 0.12em; text-transform: uppercase; color: var(--muted); }
  .dw-popup-row { display: flex; justify-content: space-between; align-items: baseline; gap: 12px; padding: 4px 16px; font-size: 12px; }
  .dw-popup-row:nth-child(even) { background: var(--light); }
  .dw-popup-key { color: var(--mid); font-weight: 400; flex-shrink: 0; }
  .dw-popup-val { color: var(--text); font-weight: 600; text-align: right; }

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
/*  TRANSLATIONS                                                                */
/* ─────────────────────────────────────────────────────────────────────────── */
const T = {
  pl: {
    badge: "Baza POS FMCG",
    tabs: [
      { id: "baza",     label: "Baza POS",        icon: "store" },
      { id: "zrodla",   label: "Źródła danych",   icon: "hub" },
      { id: "przyklad", label: "Przykład",         icon: "map" },
      { id: "pakiety",  label: "Pakiety",          icon: "apps" },
      { id: "uzycia",   label: "Zastosowania",     icon: "lightbulb" },
      { id: "kontakt",  label: "Próbka & Kontakt", icon: "mail" },
    ],
    hero: {
      label: "Produkt dostępny od ręki",
      title: "Wszechstronny Univers Punktów Sprzedaży",
      titleEm: "z danymi o potencjale otoczenia — dla rynku FMCG w Polsce",
      sub: "Baza 135\u00a0000+ lokalizacji FMCG i HoReCa wzbogacona o dane przestrzenne, demograficzne, mobilne (T-Mobile) i transakcyjne (Visa). Gotowa do integracji z CRM i BI.",
    },
    stats: [
      { val: "135", unit: "\u00a0000+", lbl: "Punktów sprzedaży FMCG" },
      { val: "47",  unit: "\u00a0000+", lbl: "Lokali HoReCa" },
      { val: "100", unit: "+",          lbl: "Sieci grocery" },
    ],
    baza: {
      eyebrow: "Kategorie w bazie",
      title: "Pełne pokrycie kanałów",
      titleEm: "grocery i HoReCa",
      avail: "Baza dostępna od ręki — gotowe pliki i API",
    },
    cats: [
      { icon: "shopping_cart", name: "Supermarkety & Hipermarkety", sub: "sieci ogólnopolskie" },
      { icon: "store",         name: "Sklepy spożywcze",            sub: "dyskont, convenience" },
      { icon: "coffee",        name: "Kawiarnie & Café",            sub: "w tym sieci kawowe" },
      { icon: "restaurant",    name: "Restauracje & Bary",          sub: "kanał on-trade" },
      { icon: "fastfood",      name: "Fast-food & Puby",            sub: "QSR i gastro nieformalna" },
      { icon: "storefront",    name: "Sieci detaliczne",            sub: "~100 sieci, 60k+ punktów" },
    ],
    zrodla: {
      eyebrow: "Partnerzy danych",
      title: "Trzy unikalne źródła",
      titleEm: "w jednym produkcie",
      note: "Jako jedyna firma w Polsce łączymy te trzy źródła w jednym produkcie — gotowym do integracji z systemami CRM i BI.",
    },
    sources: [
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
    ],
    przyklad: {
      eyebrow: "Przykład danych",
      title: "Próbka bazy POS —",
      titleEm: "Biedronka, wybrane lokalizacje",
      desc: "Poniżej 50 punktów sprzedaży z rzeczywistej bazy DataWise wraz z pełnym zestawem zmiennych. Kolor markera odpowiada rankingowi potencjału (0–100). Kliknij lub najedź na punkt, aby zobaczyć wszystkie kolumny warstwy.",
      legendTitle: "Ranking 0–100:",
    },
    popup: {
      rankLabel: "Ranking",
      sectionBasic: "Podstawowe",
      sectionLocation: "Lokalizacja",
      sectionData: "Dane o otoczeniu",
      fields: {
        category: "Kategoria",
        subcategory: "Podkategoria",
        chain: "Sieć",
        storeNo: "Numer sklepu",
        municipalType: "Typ gminy",
        inMall: "W centrum handlowym",
        mallName: "Nazwa centrum",
        mallFormat: "Format centrum",
        inRetailPark: "W parku handlowym",
        ranking: "Ranking (0–100)",
        poi75: "POI w promieniu 75m",
        discounters1km: "Dyskontów w promieniu 1km",
        pop1km: "Ludność 1km",
        popUnder14: "Populacja do 14 lat",
        jobs1km: "Miejsca pracy 1km",
        income: "Dochód per capita (zł)",
        trafficIndex: "Indeks generatorów ruchu",
      },
    },
    pakiety: {
      eyebrow: "Oferta modułowa",
      title: "5 pakietów danych —",
      titleEm: "płacisz tylko za to, czego potrzebujesz",
      flexNote: "Klient może wybrać dowolną kombinację pakietów i dokupować je w miarę potrzeb — brak konieczności zakupu całości.",
    },
    packages: [
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
    ],
    uzycia: {
      eyebrow: "Zastosowania",
      title: "Kto i jak korzysta z danych?",
      whyEyebrow: "Dlaczego DataWise",
    },
    useCases: [
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
    ],
    benefits: [
      { icon: "bolt",      title: "Dostępna od ręki", sub: "Gotowe pliki + API — zero czasu na zbieranie" },
      { icon: "extension", title: "Modularna oferta",  sub: "Kupujesz tylko potrzebne pakiety danych" },
      { icon: "handshake", title: "Unikalne źródła",   sub: "DataWise + T-Mobile + Visa w jednym produkcie" },
    ],
    kontakt: {
      eyebrow: "Próbka & Kontakt",
      title: "Zainteresowany próbką danych?",
      ctaTag: "Bezpłatna próbka",
      ctaTitle: "Wyślemy Ci fragment bazy dla Twojej kategorii",
      ctaSub: "Przygotujemy próbkę dopasowaną do Twojego sektora, portfolio marek i obszaru geograficznego.",
      ctaItems: [
        "Dane dostępne od ręki",
        "Prezentacja i demo na żądanie",
        "Bezpłatna próbka dla nowych klientów",
        "Integracja z Twoim CRM / BI",
      ],
      formTitle: "Poproś o próbkę danych",
      lblName: "Imię i Nazwisko *",
      lblCompany: "Firma",
      lblEmail: "Email *",
      lblSector: "Sektor / kategoria",
      placeholderName: "Jan Kowalski",
      placeholderCompany: "Coca-Cola, PepsiCo, Maspex…",
      placeholderEmail: "jan@firma.pl",
      sectorDefault: "Wybierz…",
      sectors: [
        "Napoje bezalkoholowe",
        "Piwo i alkohole",
        "Wyroby tytoniowe",
        "Lody i mrożonki",
        "Kosmetyki / FMCG non-food",
        "Retail / Sieci handlowe",
        "Inne FMCG",
      ],
      submitBtn: "Wyślij zapytanie o próbkę →",
      successTitle: "Dziękujemy!",
      successSub: "Skontaktujemy się w ciągu 24h z próbką danych dopasowaną do Twojej kategorii.",
    },
    footer: "DataWise · Baza Punktów Sprzedaży FMCG · Polska",
  },

  en: {
    badge: "FMCG POS Database",
    tabs: [
      { id: "baza",     label: "POS Database",    icon: "store" },
      { id: "zrodla",   label: "Data Sources",     icon: "hub" },
      { id: "przyklad", label: "Example",          icon: "map" },
      { id: "pakiety",  label: "Packages",         icon: "apps" },
      { id: "uzycia",   label: "Use Cases",        icon: "lightbulb" },
      { id: "kontakt",  label: "Sample & Contact", icon: "mail" },
    ],
    hero: {
      label: "Product ready to use",
      title: "Comprehensive Universe of Points of Sale",
      titleEm: "with surrounding potential data — for the Polish FMCG market",
      sub: "A database of 135\u00a0000+ FMCG and HoReCa locations enriched with spatial, demographic, mobile (T-Mobile) and transactional (Visa) data. Ready to integrate with CRM and BI.",
    },
    stats: [
      { val: "135", unit: "\u00a0000+", lbl: "FMCG Points of Sale" },
      { val: "47",  unit: "\u00a0000+", lbl: "HoReCa Venues" },
      { val: "100", unit: "+",          lbl: "Grocery Chains" },
    ],
    baza: {
      eyebrow: "Categories in the database",
      title: "Full channel coverage",
      titleEm: "grocery & HoReCa",
      avail: "Database ready to use — files and API",
    },
    cats: [
      { icon: "shopping_cart", name: "Supermarkets & Hypermarkets", sub: "nationwide chains" },
      { icon: "store",         name: "Grocery Stores",              sub: "discount, convenience" },
      { icon: "coffee",        name: "Coffee Shops & Cafés",        sub: "including coffee chains" },
      { icon: "restaurant",    name: "Restaurants & Bars",          sub: "on-trade channel" },
      { icon: "fastfood",      name: "Fast Food & Pubs",            sub: "QSR and informal gastro" },
      { icon: "storefront",    name: "Retail Chains",               sub: "~100 chains, 60k+ locations" },
    ],
    zrodla: {
      eyebrow: "Data partners",
      title: "Three unique sources",
      titleEm: "in one product",
      note: "We are the only company in Poland combining these three sources in a single product — ready to integrate with CRM and BI systems.",
    },
    sources: [
      {
        icon: "database", color: "#0A1F5C",
        name: "DataWise", sub: "Proprietary Spatial Database",
        items: [
          "Population & demographics (CSO + modeling)",
          "Competitive landscape — detailed market map",
          "Purchasing power & demographic forecasts",
          "Traffic generators (offices, malls, transit)",
        ],
      },
      {
        icon: "cell_tower", color: "#003DA5",
        name: "T-Mobile Big Data", sub: "Mobile Network Data",
        items: [
          "Daily & weekly footfall around POS",
          "Tourism indicators & seasonal flows",
          "Anonymous population flows",
          "Peak hours & weekly profiles",
        ],
      },
      {
        icon: "credit_card", color: "#1A1F71",
        name: "Visa", sub: "Transaction Data",
        items: [
          "Channel spending (grocery, HoReCa, e-com…)",
          "Basket value & purchase frequency",
          "Customer segments by lifestyle",
          "Consumer behavior & preferences",
        ],
      },
    ],
    przyklad: {
      eyebrow: "Data example",
      title: "POS database sample —",
      titleEm: "Biedronka, selected locations",
      desc: "Below are 50 points of sale from the real DataWise database with the full set of variables. Marker color corresponds to the potential ranking (0–100). Click or hover over a point to see all layer columns.",
      legendTitle: "Ranking 0–100:",
    },
    popup: {
      rankLabel: "Ranking",
      sectionBasic: "Basic",
      sectionLocation: "Location",
      sectionData: "Surroundings data",
      fields: {
        category: "Category",
        subcategory: "Subcategory",
        chain: "Chain",
        storeNo: "Store number",
        municipalType: "Municipality type",
        inMall: "In shopping centre",
        mallName: "Centre name",
        mallFormat: "Centre format",
        inRetailPark: "In retail park",
        ranking: "Ranking (0–100)",
        poi75: "POI within 75m",
        discounters1km: "Discounters within 1km",
        pop1km: "Population 1km",
        popUnder14: "Population under 14",
        jobs1km: "Jobs within 1km",
        income: "Disposable income per capita (PLN)",
        trafficIndex: "Traffic generator index",
      },
    },
    pakiety: {
      eyebrow: "Modular offer",
      title: "5 data packages —",
      titleEm: "pay only for what you need",
      flexNote: "Clients can choose any combination of packages and add more as needed — no obligation to buy the full suite.",
    },
    packages: [
      {
        icon: "group",
        name: "BASIC", sub: "Foundation of every analysis",
        tags: ["Population", "Demographics", "Competition"],
        detail: "Demographic data with age and gender breakdown, number of residents and workers within POS catchment (250m / 500m / 1km / 3km / 5km). Competitive map with typology and distances. The ideal starting point for network segmentation and prioritization.",
      },
      {
        icon: "map",
        name: "COMPETITION", sub: "Detailed competitive map",
        tags: ["Competition", "Traffic Generators", "Surroundings"],
        detail: "Extended competitive analysis with format typology and isochrone catchments. Traffic generators: offices, shopping centres, railway stations, universities, hospitals. Answers the key question: what draws customers to a given POS?",
      },
      {
        icon: "signal_cellular_alt",
        name: "TRAFFIC", sub: "Footfall & spatial behavior",
        tags: ["Traffic", "Tourism", "T-Mobile"],
        detail: "T-Mobile mobile network data: number of unique users within POS catchment broken down by hour and day of week, tourism and seasonality indicators. Critical for decisions on cooler and POS material placement.",
      },
      {
        icon: "payments",
        name: "SPENDINGS", sub: "Spending & basket value",
        tags: ["Spending", "Channels", "Visa"],
        detail: "Visa data: transaction volume and value by category (grocery, horeca, e-com, fuel stations), average basket value, card penetration. Helps answer: where are the high-purchasing-power customers?",
      },
      {
        icon: "person_search",
        name: "LIFE-STYLE", sub: "Segments & lifestyle",
        tags: ["Segments", "Lifestyle", "Visa"],
        detail: "Consumer segmentation based on Visa transaction behavior. Enables matching brand portfolio and promotional mechanics to the actual preferences of customers within POS catchment.",
      },
    ],
    uzycia: {
      eyebrow: "Use cases",
      title: "Who uses the data and how?",
      whyEyebrow: "Why DataWise",
    },
    useCases: [
      {
        icon: "bar_chart", dept: "Trade Marketing",
        body: "Where to invest fixed assets (coolers, lightboxes, taps)? Which POS locations should get priority exposure? Data lets you answer these questions with numbers, not intuition.",
        pills: ["Investment priorities", "Asset optimization", "Exposure"],
      },
      {
        icon: "star", dept: "Brand Management",
        body: "Which brands to promote in which POS locations? Surroundings segmentation lets you match portfolio to consumer profile — premium where premium belongs, value where value fits.",
        pills: ["Portfolio fit", "POS segmentation", "Brand matching"],
      },
      {
        icon: "local_shipping", dept: "Route to Market",
        body: "Visit frequency, priorities and tasks for field forces. Route and distributor coverage optimization based on actual potential, not sales history.",
        pills: ["Route optimization", "Visit priorities", "SFA / distribution"],
      },
      {
        icon: "trending_up", dept: "BI & Reporting",
        body: "Enriching internal data (sales, distribution) with spatial context. Performance benchmarking vs. potential — finally knowing which POS is under- and which is over-performing.",
        pills: ["Benchmarking", "CRM enrichment", "Dashboard"],
      },
    ],
    benefits: [
      { icon: "bolt",      title: "Ready to use",     sub: "Ready files + API — zero time on data collection" },
      { icon: "extension", title: "Modular offer",     sub: "Buy only the data packages you need" },
      { icon: "handshake", title: "Unique sources",    sub: "DataWise + T-Mobile + Visa in one product" },
    ],
    kontakt: {
      eyebrow: "Sample & Contact",
      title: "Interested in a data sample?",
      ctaTag: "Free sample",
      ctaTitle: "We will send you a database extract for your category",
      ctaSub: "We will prepare a sample tailored to your sector, brand portfolio and geographic area.",
      ctaItems: [
        "Data available immediately",
        "Presentation and demo on request",
        "Free sample for new clients",
        "Integration with your CRM / BI",
      ],
      formTitle: "Request a data sample",
      lblName: "Full name *",
      lblCompany: "Company",
      lblEmail: "Email *",
      lblSector: "Sector / category",
      placeholderName: "John Smith",
      placeholderCompany: "Coca-Cola, PepsiCo, Heineken…",
      placeholderEmail: "john@company.com",
      sectorDefault: "Select…",
      sectors: [
        "Soft drinks",
        "Beer & spirits",
        "Tobacco products",
        "Ice cream & frozen food",
        "Cosmetics / FMCG non-food",
        "Retail / Grocery chains",
        "Other FMCG",
      ],
      submitBtn: "Send sample request →",
      successTitle: "Thank you!",
      successSub: "We will get back to you within 24h with a data sample tailored to your category.",
    },
    footer: "DataWise · FMCG Points of Sale Database · Poland",
  },
};

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
/*  MAP HELPERS                                                                 */
/* ─────────────────────────────────────────────────────────────────────────── */
const ratingColor = (r) => {
  if (r == null) return "#8AA8CC";
  if (r >= 80) return "#0A1F5C";
  if (r >= 60) return "#1A3A7A";
  if (r >= 40) return "#2E5CA8";
  return "#6B8EC4";
};

const LEGEND = [
  { label: "80–100", color: "#0A1F5C" },
  { label: "60–79",  color: "#1A3A7A" },
  { label: "40–59",  color: "#2E5CA8" },
  { label: "0–39",   color: "#6B8EC4" },
];

const buildPopup = (p, pt) => {
  const addr = `${p["Prefix"] || ""} ${p["Ulica"] || ""} ${p["Nr Ulicy"] || ""}, ${p["Kod pocztowy"] || ""} ${p["Miejscowość"] || ""}`.trim();
  const f = pt.fields;

  const basic = [
    [f.category,     p["Kategoria"]],
    [f.subcategory,  p["Podkategoria"]],
    [f.chain,        p["Sieć"]],
    [f.storeNo,      p["Numer sklepu"]],
    [f.municipalType,p["Typ gminy"]],
  ];

  const location = [
    [f.inMall,       p["Lokalizacja w centrum handl."]],
    [f.mallName,     p["Nazwa centrum"]],
    [f.mallFormat,   p["Format centrum"]],
    [f.inRetailPark, p["Lokalizacja w parku handl."]],
  ].filter(([, v]) => v !== null && v !== undefined);

  const data = [
    [f.ranking,        p["Rankig-0-100"]],
    [f.poi75,          p["Liczba POI w promieniu 75m"]],
    [f.discounters1km, p["Liczba innych dyskontów w promieniu 1km"]],
    [f.pop1km,         p["Liczba ludności 1km"]?.toLocaleString("pl-PL")],
    [f.popUnder14,     p["Odsetek populacji w wieku do 14 lat"]],
    [f.jobs1km,        p["Liczba miejsc pracy w promieniu 1km"]?.toLocaleString("pl-PL")],
    [f.income,         p["Dochod rozporzadzalny per capita"]?.toLocaleString("pl-PL")],
    [f.trafficIndex,   p["Indeks koncentracji generatorów ruchu"]],
  ].filter(([, v]) => v !== null && v !== undefined);

  const rows = (arr) => arr.map(([k, v]) =>
    `<div class="dw-popup-row"><span class="dw-popup-key">${k}</span><span class="dw-popup-val">${v}</span></div>`
  ).join("");

  return `
    <div class="dw-popup-head">
      <div class="dw-popup-name">${p["Sieć"]} #${p["Numer sklepu"]}</div>
      <div class="dw-popup-addr">${addr}</div>
      <div class="dw-popup-rank">${pt.rankLabel}: ${p["Rankig-0-100"] ?? "–"} / 100</div>
    </div>
    <div class="dw-popup-body">
      <div class="dw-popup-section">${pt.sectionBasic}</div>
      ${rows(basic)}
      ${location.length ? `<div class="dw-popup-section">${pt.sectionLocation}</div>${rows(location)}` : ""}
      <div class="dw-popup-section">${pt.sectionData}</div>
      ${rows(data)}
    </div>
  `;
};

/* ─────────────────────────────────────────────────────────────────────────── */
/*  TAB COMPONENTS                                                              */
/* ─────────────────────────────────────────────────────────────────────────── */

function TabBaza({ t }) {
  return (
    <>
      <div className="dw-hero">
        <div className="dw-hero-inner">
          <div className="dw-hero-label dw-fade">
            <span className="dw-hero-ldot" />
            {t.hero.label}
          </div>
          <h1 className="dw-hero-title dw-fade1">
            {t.hero.title}
            <em>{t.hero.titleEm}</em>
          </h1>
          <p className="dw-hero-sub dw-fade2">{t.hero.sub}</p>
          <div className="dw-hero-stats dw-fade3">
            {t.stats.map((s) => (
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
        <p className="dw-eyebrow dw-fade">{t.baza.eyebrow}</p>
        <h2 className="dw-section-title dw-fade1">
          {t.baza.title}<br />
          <em>{t.baza.titleEm}</em>
        </h2>
        <div className="dw-cats">
          {t.cats.map((c) => (
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
          {t.baza.avail}
        </div>
      </div>
    </>
  );
}

function TabZrodla({ t }) {
  return (
    <div className="dw-section">
      <p className="dw-eyebrow dw-fade">{t.zrodla.eyebrow}</p>
      <h2 className="dw-section-title dw-fade1">
        {t.zrodla.title}<br />
        <em>{t.zrodla.titleEm}</em>
      </h2>
      <div className="dw-sources">
        {t.sources.map((s) => (
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
        {t.zrodla.note}
      </div>
    </div>
  );
}

function TabPrzyklad({ t }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const popupT = t.popup;

  useEffect(() => {
    if (!document.getElementById("lf-css")) {
      const link = document.createElement("link");
      link.id = "lf-css";
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }

    const init = () => {
      if (mapInstanceRef.current || !mapRef.current) return;
      const L = window.L;

      const map = L.map(mapRef.current, { zoomControl: true }).setView([52.1, 19.4], 6);

      L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors © <a href="https://carto.com/">CARTO</a>',
        subdomains: "abcd",
        maxZoom: 19,
      }).addTo(map);

      fetch("/assets/data-sample.geojson")
        .then((r) => r.json())
        .then((geojson) => {
          L.geoJSON(geojson, {
            pointToLayer: (feature, latlng) => {
              const rating = feature.properties["Rankig-0-100"];
              const radius = rating >= 80 ? 9 : rating >= 60 ? 8 : rating >= 40 ? 7 : 6;
              return L.circleMarker(latlng, {
                radius,
                fillColor: ratingColor(rating),
                color: "#ffffff",
                weight: 1.5,
                opacity: 1,
                fillOpacity: 0.88,
              });
            },
            onEachFeature: (feature, layer) => {
              layer.bindPopup(buildPopup(feature.properties, popupT), {
                maxWidth: 300,
                minWidth: 260,
              });
              layer.on("mouseover", function () { this.openPopup(); });
            },
          }).addTo(map);
        });

      mapInstanceRef.current = map;
    };

    if (window.L) {
      init();
    } else {
      const script = document.createElement("script");
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
      script.onload = init;
      document.head.appendChild(script);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div className="dw-fade">
      <div className="dw-section" style={{ paddingBottom: "24px" }}>
        <p className="dw-eyebrow">{t.przyklad.eyebrow}</p>
        <h2 className="dw-section-title" style={{ marginBottom: "12px" }}>
          {t.przyklad.title} <em>{t.przyklad.titleEm}</em>
        </h2>
        <p className="dw-map-info" style={{ padding: 0, maxWidth: "none" }}>
          {t.przyklad.desc}
        </p>
      </div>

      <div className="dw-map-legend">
        <span className="dw-map-legend-title">{t.przyklad.legendTitle}</span>
        {LEGEND.map((l) => (
          <span className="dw-legend-item" key={l.label}>
            <span className="dw-legend-dot" style={{ background: l.color }} />
            {l.label}
          </span>
        ))}
      </div>

      <div className="dw-map-wrap">
        <div ref={mapRef} className="dw-map-container" />
      </div>
    </div>
  );
}

function TabPakiety({ t }) {
  const [open, setOpen] = useState(null);
  const toggle = (name) => setOpen((prev) => (prev === name ? null : name));

  return (
    <div className="dw-section">
      <p className="dw-eyebrow dw-fade">{t.pakiety.eyebrow}</p>
      <h2 className="dw-section-title dw-fade1">
        {t.pakiety.title}<br />
        <em>{t.pakiety.titleEm}</em>
      </h2>
      <div className="dw-pkgs">
        {t.packages.map((p) => (
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
              {p.tags.map((tag) => <span className="dw-tag" key={tag}>{tag}</span>)}
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
      <div className="dw-flex-note dw-fade">{t.pakiety.flexNote}</div>
    </div>
  );
}

function TabUzycia({ t }) {
  return (
    <div className="dw-section">
      <p className="dw-eyebrow dw-fade">{t.uzycia.eyebrow}</p>
      <h2 className="dw-section-title dw-fade1">{t.uzycia.title}</h2>
      <div className="dw-uses">
        {t.useCases.map((u) => (
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
      <p className="dw-eyebrow" style={{ marginBottom: "14px" }}>{t.uzycia.whyEyebrow}</p>
      <div className="dw-benefits">
        {t.benefits.map((b) => (
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

function TabKontakt({ t }) {
  const k = t.kontakt;
  const [form, setForm] = useState({ name: "", company: "", email: "", sector: "" });
  const [sent, setSent] = useState(false);
  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
  const valid = form.name.trim() && form.email.includes("@");

  return (
    <div className="dw-section">
      <p className="dw-eyebrow dw-fade">{k.eyebrow}</p>
      <h2 className="dw-section-title dw-fade1">{k.title}</h2>
      <div className="dw-contact">
        <div className="dw-cta dw-fade">
          <div className="dw-cta-tag">{k.ctaTag}</div>
          <div className="dw-cta-title">{k.ctaTitle}</div>
          <div className="dw-cta-sub">{k.ctaSub}</div>
          <div className="dw-cta-list">
            {k.ctaItems.map((b) => (
              <div className="dw-cta-item" key={b}>
                <div className="dw-cta-chk">
                  <Icon name="check" size={13} />
                </div>
                {b}
              </div>
            ))}
          </div>
          <div className="dw-cta-footer">
            <span>info@datawise.pl</span>
            <span>www.datawise.pl</span>
          </div>
        </div>

        <div className="dw-form-box dw-fade1">
          {sent ? (
            <div className="dw-success">
              <div className="dw-success-ico">
                <Icon name="check_circle" size={52} />
              </div>
              <div className="dw-success-title">{k.successTitle}</div>
              <div className="dw-success-sub">{k.successSub}</div>
            </div>
          ) : (
            <>
              <div className="dw-form-title">{k.formTitle}</div>
              <div className="dw-form-row">
                <label className="dw-form-lbl">{k.lblName}</label>
                <input className="dw-form-input" placeholder={k.placeholderName} value={form.name} onChange={set("name")} />
              </div>
              <div className="dw-form-row">
                <label className="dw-form-lbl">{k.lblCompany}</label>
                <input className="dw-form-input" placeholder={k.placeholderCompany} value={form.company} onChange={set("company")} />
              </div>
              <div className="dw-form-row">
                <label className="dw-form-lbl">{k.lblEmail}</label>
                <input className="dw-form-input" type="email" placeholder={k.placeholderEmail} value={form.email} onChange={set("email")} />
              </div>
              <div className="dw-form-row">
                <label className="dw-form-lbl">{k.lblSector}</label>
                <select className="dw-form-select" value={form.sector} onChange={set("sector")}>
                  <option value="">{k.sectorDefault}</option>
                  {k.sectors.map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>
              <button className="dw-form-btn" disabled={!valid} onClick={() => setSent(true)}>
                {k.submitBtn}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function Footer({ t }) {
  return (
    <>
      <div className="dw-hr" />
      <footer className="dw-footer">
        <span className="dw-footer-tagline">{t.footer}</span>
        <div className="dw-footer-contact">
          <a href="mailto:info@datawise.pl">info@datawise.pl</a>
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
  const [lang, setLang] = useState("pl");
  const t = T[lang];

  const panels = {
    baza:     <TabBaza t={t} />,
    zrodla:   <TabZrodla t={t} />,
    przyklad: <TabPrzyklad t={t} />,
    pakiety:  <TabPakiety t={t} />,
    uzycia:   <TabUzycia t={t} />,
    kontakt:  <TabKontakt t={t} />,
  };

  return (
    <>
      <style>{GLOBAL_CSS}</style>

      <header className="dw-header">
        <img src="/assets/DataWise_logo.png" alt="DataWise" className="dw-logo-img" />
        <div className="dw-header-right">
          <div className="dw-badge">{t.badge}</div>
          <div className="dw-lang-switch">
            <button
              className={`dw-lang-btn${lang === "pl" ? " active" : ""}`}
              onClick={() => setLang("pl")}
            >
              PL
            </button>
            <button
              className={`dw-lang-btn${lang === "en" ? " active" : ""}`}
              onClick={() => setLang("en")}
            >
              EN
            </button>
          </div>
        </div>
      </header>

      <nav className="dw-nav">
        {t.tabs.map((tab) => (
          <button
            key={tab.id}
            className={`dw-tab${active === tab.id ? " active" : ""}`}
            onClick={() => setActive(tab.id)}
          >
            <Icon name={tab.icon} size={16} style={{ opacity: 0.7 }} />
            {tab.label}
          </button>
        ))}
      </nav>

      <main key={`${active}-${lang}`}>
        {panels[active]}
      </main>

      <Footer t={t} />
    </>
  );
}
