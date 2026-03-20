import { useState, useEffect, useRef } from "react";
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

function PointPanel({ p, t }) {
  if (!p) return null;
  const pt = t.popup;
  const f = pt.fields;
  const addr = `${p["Prefix"] || ""} ${p["Ulica"] || ""} ${p["Nr Ulicy"] || ""}, ${p["Kod pocztowy"] || ""} ${p["Miejscowość"] || ""}`.trim();

  const basic = [
    [f.category,      p["Kategoria"]],
    [f.subcategory,   p["Podkategoria"]],
    [f.chain,         p["Sieć"]],
    [f.storeNo,       p["Numer sklepu"]],
    [f.municipalType, p["Typ gminy"]],
  ].filter(([, v]) => v != null);

  const location = [
    [f.inMall,       p["Lokalizacja w centrum handl."]],
    [f.mallName,     p["Nazwa centrum"]],
    [f.mallFormat,   p["Format centrum"]],
    [f.inRetailPark, p["Lokalizacja w parku handl."]],
  ].filter(([, v]) => v != null);

  const data = [
    [f.ranking,        p["Rankig-0-100"]],
    [f.poi75,          p["Liczba POI w promieniu 75m"]],
    [f.discounters1km, p["Liczba innych dyskontów w promieniu 1km"]],
    [f.pop1km,         p["Liczba ludności 1km"]?.toLocaleString("pl-PL")],
    [f.popUnder14,     p["Odsetek populacji w wieku do 14 lat"]],
    [f.jobs1km,        p["Liczba miejsc pracy w promieniu 1km"]?.toLocaleString("pl-PL")],
    [f.income,         p["Dochod rozporzadzalny per capita"]?.toLocaleString("pl-PL")],
    [f.trafficIndex,   p["Indeks koncentracji generatorów ruchu"]],
  ].filter(([, v]) => v != null);

  return (
    <>
      <div className="dw-popup-head">
        <div className="dw-popup-name">{p["Sieć"]} #{p["Numer sklepu"]}</div>
        <div className="dw-popup-addr">{addr}</div>
        <div className="dw-popup-rank">{pt.rankLabel}: {p["Rankig-0-100"] ?? "–"} / 100</div>
      </div>
      <div className="dw-popup-body">
        <div className="dw-popup-section">{pt.sectionBasic}</div>
        {basic.map(([k, v]) => (
          <div className="dw-popup-row" key={k}>
            <span className="dw-popup-key">{k}</span>
            <span className="dw-popup-val">{v}</span>
          </div>
        ))}
        {location.length > 0 && <>
          <div className="dw-popup-section">{pt.sectionLocation}</div>
          {location.map(([k, v]) => (
            <div className="dw-popup-row" key={k}>
              <span className="dw-popup-key">{k}</span>
              <span className="dw-popup-val">{v}</span>
            </div>
          ))}
        </>}
        <div className="dw-popup-section">{pt.sectionData}</div>
        {data.map(([k, v]) => (
          <div className="dw-popup-row" key={k}>
            <span className="dw-popup-key">{k}</span>
            <span className="dw-popup-val">{v}</span>
          </div>
        ))}
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
    if (selectedLayerRef.current) {
      selectedLayerRef.current.setStyle({ color: "#ffffff", weight: 1.5 });
    }
    layer.setStyle({ color: "#F5C242", weight: 2.5 });
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

      fetch("/assets/data-sample.geojson")
        .then((r) => r.json())
        .then((geojson) => {
          if (geojson.features?.length > 0) {
            setSelectedPoint(geojson.features[0].properties);
          }
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
        <span className="dw-map-legend-title">{t.przyklad.legendTitle}</span>
        {LEGEND.map((l) => (
          <span className="dw-legend-item" key={l.label}>
            <span className="dw-legend-dot" style={{ background: l.color }} />
            {l.label}
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
