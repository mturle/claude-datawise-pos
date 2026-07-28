import { useState, useEffect, useRef } from "react";
import { Analytics } from "@vercel/analytics/react";
import GLOBAL_CSS from "./styles.js";
import T from "./translations.js";

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

/* Shape encodes the consumer profile (profile_level, from Visa card data). */
const PROFILE_SHAPES = {
  Premium:  "triangle",
  Mieszany: "square",
  Base:     "circle",
};
const profileShape = (p) => PROFILE_SHAPES[p] ?? "circle";

/* Colour encodes daytime traffic affinity (traffic_12pm_n1000 vs. sample avg).
   Affinity = value / avg * 100  (100 = average). Five classes, light → navy. */
const AFFINITY_CLASSES = [
  { key: "veryLow",  max: 45,       color: "#8AA8CC" },
  { key: "low",      max: 85,       color: "#6B8EC4" },
  { key: "medium",   max: 120,      color: "#2E5CA8" },
  { key: "high",     max: 170,      color: "#1A3A7A" },
  { key: "veryHigh", max: Infinity, color: "#0A1F5C" },
];
const affinityClass = (aff) =>
  AFFINITY_CLASSES.find((c) => aff < c.max) ?? AFFINITY_CLASSES[AFFINITY_CLASSES.length - 1];

/* SVG shape primitive — shared by Leaflet markers (string) and the legend (JSX). */
const shapePrim = (shape, fill, stroke, sw) => {
  if (shape === "square")
    return `<rect x="5" y="5" width="14" height="14" rx="2.5" fill="${fill}" stroke="${stroke}" stroke-width="${sw}" stroke-linejoin="round"/>`;
  if (shape === "triangle")
    return `<polygon points="12,3.5 20.5,19.5 3.5,19.5" fill="${fill}" stroke="${stroke}" stroke-width="${sw}" stroke-linejoin="round"/>`;
  return `<circle cx="12" cy="12" r="7.5" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>`;
};
const markerSvg = (shape, fill, selected) =>
  `<svg width="26" height="26" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">${shapePrim(
    shape, fill, selected ? "#F5C242" : "#ffffff", selected ? 3 : 1.5
  )}</svg>`;
const makeIcon = (L, shape, fill, selected) =>
  L.divIcon({ className: "dw-marker", html: markerSvg(shape, fill, selected), iconSize: [26, 26], iconAnchor: [13, 13] });

/* React shape for the legend. */
function Shape({ shape, color = "#2E5CA8", size = 14 }) {
  const stroke = "rgba(120,140,170,0.55)";
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
      {shape === "square" && <rect x="5" y="5" width="14" height="14" rx="2.5" fill={color} stroke={stroke} strokeWidth="1.5" strokeLinejoin="round" />}
      {shape === "triangle" && <polygon points="12,3.5 20.5,19.5 3.5,19.5" fill={color} stroke={stroke} strokeWidth="1.5" strokeLinejoin="round" />}
      {shape === "circle" && <circle cx="12" cy="12" r="7.5" fill={color} stroke={stroke} strokeWidth="1.5" />}
    </svg>
  );
}

/* value formatters */
const nf = (v) => (typeof v === "number" ? v.toLocaleString("pl-PL") : v);
const pct = (v) =>
  typeof v === "number" ? `${(v * 100).toLocaleString("pl-PL", { maximumFractionDigits: 1 })}%` : null;
const yesNo = (v, t) => (v === "tak" ? t.yes : v === "nie" ? t.no : v);
const nonEmpty = (v) => (v == null || v === "" ? null : v);

function PointPanel({ p, t }) {
  if (!p) return null;
  const pt = t.popup;
  const f = pt.fields;
  const addr = `${p.prefix || ""} ${p.street || ""} ${p.building || ""}, ${p.zip || ""} ${p.city || ""}`
    .replace(/\s+/g, " ").trim();

  const affCls = affinityClass(p._affinity ?? 0);
  const affLabel = t.przyklad.affinityClasses[affCls.key];

  // header name: chain (+ optional store number) → location_name → subcategory
  const chain = nonEmpty(p.name_chain);
  const headName = chain
    ? `${chain}${nonEmpty(p.location_number) ? ` #${p.location_number}` : ""}`
    : nonEmpty(p.location_name) || nonEmpty(p.subcategory_name) || "—";

  // ── grouped sections (label, value) ──────────────────────────────────────
  const basic = [
    [f.category,     nonEmpty(p.category_name)],
    [f.subcategory,  nonEmpty(p.subcategory_name)],
    [f.inMall,        yesNo(p.centrum_taknie, pt)],
    [f.mallName,      nonEmpty(p.centrum_nazwa)],
    [f.mallFormat,    nonEmpty(p.centrum_format)],
  ];

  const location = [
    [f.voiv,         nonEmpty(p.voiv)],
    [f.pov,          nonEmpty(p.pov)],
    [f.mun,          nonEmpty(p.mun)],
    [f.segment,      nonEmpty(p.municipality_segment)],
    [f.buildingClass, nonEmpty(p.klasa_zabudowy)],
    [f.iahu,       nf(p.iahu)],
  ];

  // DataWise — demographics & commercial potential
  const demographics = [
    [f.population, nf(p.pop_tot)],
    [f.popUnder14, pct(p.pop_0014_perc)],
    [f.jobs,       nf(p.emplo)],
    [f.dochSum,    typeof p.doch_ro_sum === "number" ? `${nf(p.doch_ro_sum)} zł` : null],
    [f.dochAvg,    typeof p.doch_ro_avg === "number" ? `${nf(p.doch_ro_avg)} zł` : null],
  ];

  // DataWise spatial — POI & competition in the surroundings
  const surroundings = [
    [f.poi75,          nf(p.poi_75m)],
    [f.compet150,      nf(p.cnt_compet_150m)],
    [f.convenience150, nf(p.convenience_cnt_150m)],
    [f.retailChain150, nf(p.cnt_retail_chain_150m)],
    [f.busStop150,     nf(p.bus_stop_cnt_150m)],
    [f.compet500,      nf(p.cnt_compet_500m)],
    [f.supermarket500, nf(p.supermarket_cnt_500m)],
    [f.petrol500,      nf(p.cnt_petrol_500m)],
    [f.paczkomat500,   nf(p.paczkomat_cnt_500m)],
    [f.compet1000,     nf(p.cnt_compet_1000m)],
    [f.hypermarket1000,nf(p.hypermarket_cnt_1000m)],
    [f.retailPark1000, nf(p.retail_park_cnt_1000m)],
  ];

  // T-Mobile — mobile-network traffic
  const traffic = [
    [f.trafficLevel,  nonEmpty(p.traffic_level)],
    [f.traffic12pm,   nf(p.traffic_12pm_n1000)],
    [f.traffic5pm,    nf(p.traffic_5pm_n1000)],
    [f.traffic4am,    nf(p.traffic_4am_n1000)],
    [f.trafficRatio,  typeof p.traffic_5pm_to_4am_ratio === "number" ? p.traffic_5pm_to_4am_ratio.toLocaleString("pl-PL") : null],
  ];

  // Visa — transactional
  const cards = [
    [f.cardsUniq,     nf(p.total_cards_uniq)],
    [f.totalTrn,      nf(p.total_trn)],
    [f.onlineTrn,     nf(p.online_total_trn)],
    [f.f2fPerOnline,  typeof p.f2f_per_online_tr === "number" ? p.f2f_per_online_tr.toLocaleString("pl-PL") : null],
    [f.monthlySpend,  typeof p.monthly_spend_avg === "number" ? `${p.monthly_spend_avg.toLocaleString("pl-PL", { maximumFractionDigits: 0 })} zł` : null],
    [f.spendAffinity, nf(p.monthly_spend_avg_affinity)],
    [f.foodShare,     pct(p.food_spend_perc)],
    [f.eatingOut,     pct(p.eatingout_spend_perc)],
    [f.clothingCosm,  typeof p.clothing_and_cosm_spend_mth_avg_usd === "number" ? `${p.clothing_and_cosm_spend_mth_avg_usd.toLocaleString("pl-PL", { maximumFractionDigits: 0 })} USD` : null],
  ];

  // Visa — lifestyle (share of active cards)
  const lifestyle = [
    [f.lsCar,          pct(p.car_active_cards_share)],
    [f.lsTransit,      pct(p.public_transport_active_cards_share)],
    [f.lsTravel,       pct(p.travel_world_active_cards_share)],
    [f.lsAlcohol,      pct(p.alcohol_active_cards_share)],
    [f.lsFit,          pct(p.keepingfit_active_cards_share)],
    [f.lsEco,          pct(p.ecofood_active_cards_share)],
    [f.lsVegan,        pct(p.vegan_active_cards_share)],
    [f.lsPremiumWear,  pct(p.premiumclothes_active_cards_share)],
    [f.lsOnlineGroc,   pct(p.onlinegrocery_active_cards_share)],
    [f.lsOrderFood,    pct(p.orderingfood_active_cards_share)],
  ];

  const sections = [
    [pt.sectionBasic,        basic],
    [pt.sectionLocation,     location],
    [pt.sectionDemographics, demographics],
    [pt.sectionTraffic,      traffic],
    [pt.sectionCards,        cards],
    [pt.sectionLifestyle,    lifestyle],
    [pt.sectionSurroundings, surroundings],
  ];

  return (
    <>
      <div className="dw-popup-head">
        <div className="dw-popup-name">{headName}</div>
        <div className="dw-popup-addr">{addr}</div>
        <div className="dw-popup-badges">
          <span className="dw-badge-chip">
            <span className="dw-legend-dot" style={{ background: affCls.color, width: 9, height: 9 }} />
            {pt.affinityLabel}: {p._affinity != null ? Math.round(p._affinity) : "–"} · {affLabel}
          </span>
          <span className="dw-badge-chip">
            <Shape shape={profileShape(p.profile_level)} color="#fff" size={12} />
            {pt.profileLabel}: {p.profile_level || "–"}
          </span>
        </div>
      </div>
      <div className="dw-popup-body">
        {sections.map(([title, rows]) => {
          const filled = rows.filter(([, v]) => v != null);
          if (filled.length === 0) return null;
          return (
            <div key={title}>
              <div className="dw-popup-section">{title}</div>
              {filled.map(([k, v]) => (
                <div className="dw-popup-row" key={k}>
                  <span className="dw-popup-key">{k}</span>
                  <span className="dw-popup-val">{v}</span>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </>
  );
}

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

      <div className="dw-services-block dw-fade">
        <div className="dw-services-eyebrow">
          <Icon name="auto_awesome" size={15} />
          {t.zrodla.servicesBanner.eyebrow}
        </div>
        <div className="dw-services-htitle">{t.zrodla.servicesBanner.title}</div>
        <div className="dw-services-hsub">{t.zrodla.servicesBanner.sub}</div>
        <div className="dw-services-grid">
          {t.services.map((s) => (
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
      </div>
    </div>
  );
}

function TabPrzyklad({ t }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [selectedPoint, setSelectedPoint] = useState(null);
  const onClickRef = useRef(null);
  const selectedLayerRef = useRef(null);

  // keep click handler up-to-date without re-running map init
  onClickRef.current = (props, layer) => {
    const L = window.L;
    if (selectedLayerRef.current) {
      const prev = selectedLayerRef.current;
      prev.setIcon(makeIcon(L, prev._dwShape, prev._dwFill, false));
    }
    layer.setIcon(makeIcon(L, layer._dwShape, layer._dwFill, true));
    selectedLayerRef.current = layer;
    setSelectedPoint(props);
  };

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

      fetch("/assets/data-sample-new.geojson")
        .then((r) => r.json())
        .then((geojson) => {
          const feats = geojson.features ?? [];

          // traffic affinity = value / sample-average * 100 (100 = average)
          const traf = feats
            .map((ft) => ft.properties?.traffic_12pm_n1000)
            .filter((v) => typeof v === "number");
          const avg = traf.length ? traf.reduce((a, b) => a + b, 0) / traf.length : 0;
          feats.forEach((ft) => {
            const v = ft.properties?.traffic_12pm_n1000;
            ft.properties._affinity = avg > 0 && typeof v === "number" ? (v / avg) * 100 : null;
          });

          if (feats.length > 0) setSelectedPoint(feats[0].properties);

          L.geoJSON(geojson, {
            pointToLayer: (feature, latlng) => {
              const props = feature.properties;
              const fill = affinityClass(props._affinity ?? 0).color;
              const shape = profileShape(props.profile_level);
              const marker = L.marker(latlng, { icon: makeIcon(L, shape, fill, false) });
              marker._dwShape = shape;
              marker._dwFill = fill;
              return marker;
            },
            onEachFeature: (feature, layer) => {
              layer.on("click", () => onClickRef.current(feature.properties, layer));
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
        <span className="dw-map-legend-title">{t.przyklad.legendSizeTitle}</span>
        {AFFINITY_CLASSES.map((c) => (
          <span className="dw-legend-item" key={c.key}>
            <span className="dw-legend-dot" style={{ background: c.color }} />
            {t.przyklad.affinityClasses[c.key]}
          </span>
        ))}
        <span className="dw-legend-sep" />
        <span className="dw-map-legend-title">{t.przyklad.legendColorTitle}</span>
        {["Premium", "Mieszany", "Base"].map((prof) => (
          <span className="dw-legend-item" key={prof}>
            <Shape shape={profileShape(prof)} color="#4E74B4" />
            {prof}
          </span>
        ))}
      </div>

      <div className="dw-map-layout">
        <div ref={mapRef} className="dw-map-container" />
        <div className="dw-point-panel">
          <PointPanel p={selectedPoint} t={t} />
        </div>
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
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
  const valid = form.name.trim() && form.email.includes("@");

  const handleSubmit = async () => {
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          company: form.company,
          email: form.email,
          sector: form.sector,
        }),
      });
      setStatus(res.ok ? "success" : "error");
    } catch {
      setStatus("error");
    }
  };

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
          {status === "success" ? (
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
              {status === "error" && (
                <div style={{ fontSize: "12.5px", color: "#DC2626", marginBottom: "8px" }}>
                  {k.errorMsg}
                </div>
              )}
              <button
                className="dw-form-btn"
                disabled={!valid || status === "loading"}
                onClick={handleSubmit}
              >
                {status === "loading" ? k.sendingBtn : k.submitBtn}
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
      <Analytics />
    </>
  );
}
