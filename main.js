/**
 * FLOOD-AI NE: AI-Based Detection of Flood-Affected Areas in North-East India Using Satellite Images
 * Environmental Studies (EVS) Academic Project Website
 * Script: main.js
 * Clean, structured vanilla JavaScript designed for easy understanding by a 1st year B.Tech CSE student.
 */

document.addEventListener("DOMContentLoaded", () => {
  initReadingProgressBar();
  initThemeToggle();
  initMobileNav();
  initStickyNav();
  initBeforeAfterSlider();
  initNeIndiaMap();
  initEnvironmentalImpactCards();
  initPipeline();
  initFloodAnalysisLab();
  initAssessmentModal();
  initScrollAnimations();
  initBackToTop();
  initDashboard();
});

/* ==========================================================================
   0. Top Reading Progress Bar & Web Audio Synthesizer
   ========================================================================== */
function initReadingProgressBar() {
  const bar = document.getElementById("readingProgressBar");
  if (!bar) return;
  window.addEventListener("scroll", () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = `${progress}%`;
  }, { passive: true });
}

let audioContext = null;
let isAudioMuted = false;

function playTechChime(freq = 580, duration = 0.08, type = "sine") {
  if (isAudioMuted) return;
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    if (!audioContext) audioContext = new AudioCtx();
    if (audioContext.state === "suspended") audioContext.resume();

    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioContext.currentTime);

    gain.gain.setValueAtTime(0.035, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + duration);

    osc.connect(gain);
    gain.connect(audioContext.destination);

    osc.start();
    osc.stop(audioContext.currentTime + duration);
  } catch (e) {
    // Audio synthesis silently disabled if browser permissions block it
  }
}

/* ==========================================================================
   1. Theme Toggle (Dark / Light Mode)
   ========================================================================== */
function initThemeToggle() {
  const themeToggleBtn = document.getElementById("themeToggleBtn");
  if (!themeToggleBtn) return;

  const savedTheme = localStorage.getItem("flood-ai-theme") || "dark";
  document.documentElement.setAttribute("data-theme", savedTheme);
  updateThemeIcon(savedTheme);

  themeToggleBtn.addEventListener("click", () => {
    const currentTheme = document.documentElement.getAttribute("data-theme") || "dark";
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("flood-ai-theme", newTheme);
    updateThemeIcon(newTheme);
    playTechChime(640, 0.06);
  });
}

function updateThemeIcon(theme) {
  const themeIcon = document.getElementById("themeIcon");
  if (!themeIcon) return;
  themeIcon.textContent = theme === "dark" ? "☀️" : "🌙";
  themeIcon.setAttribute("aria-label", theme === "dark" ? "Switch to light mode" : "Switch to dark mode");
}

/* ==========================================================================
   2. Sticky Navigation & Mobile Menu
   ========================================================================== */
function initStickyNav() {
  const navbar = document.querySelector(".navbar");
  const navLinks = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll("section[id]");

  window.addEventListener("scroll", () => {
    if (window.scrollY > 40) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }

    // Active link highlighting on scroll.
    // Sub-sections carry data-nav so they light up their parent nav item
    // (e.g. "Optical vs SAR" highlights "Methodology").
    let currentNavId = "home";
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 140;
      const sectionHeight = section.offsetHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        currentNavId = section.dataset.nav || section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      const isActive = link.getAttribute("href") === `#${currentNavId}`;
      link.classList.toggle("active", isActive);
      if (isActive) {
        link.setAttribute("aria-current", "true");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }, { passive: true });
}

function initMobileNav() {
  const hamburgerBtn = document.getElementById("hamburgerBtn");
  const navMenu = document.getElementById("navMenu");
  const navLinks = document.querySelectorAll(".nav-link");

  if (!hamburgerBtn || !navMenu) return;

  function toggleMenu(forceClose = false) {
    const isOpen = forceClose ? false : navMenu.classList.toggle("open");
    if (forceClose) navMenu.classList.remove("open");
    hamburgerBtn.setAttribute("aria-expanded", isOpen ? "true" : "false");
    hamburgerBtn.textContent = isOpen ? "✕" : "☰";
  }

  hamburgerBtn.addEventListener("click", () => toggleMenu());

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      toggleMenu(true);
    });
  });

  // Close when clicking outside
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".nav-container") && navMenu.classList.contains("open")) {
      toggleMenu(true);
    }
  });
}

/* ==========================================================================
   3. North-East India Geospatial Data & Leaflet Map
   ========================================================================== */
const NE_STATES_DATA = {
  assam: {
    name: "Assam",
    capital: "Dispur",
    risk: "High",
    riskClass: "risk-high",
    rivers: "Brahmaputra, Barak, Subansiri, Kopili",
    terrain: "Extensive alluvial river valley flanked by hills",
    rainfall: "2,000 - 3,500 mm annually",
    whyMatters: "Assam contains major river systems and flood-prone areas, making satellite-based flood monitoring an important environmental application.",
    concerns: [
      { icon: "🌾", title: "Agriculture", text: "Standing monsoon Sali paddy submergence and topsoil sand-casting." },
      { icon: "💧", title: "Wetlands", text: "Severe siltation of oxbow beels and braided river channel avulsion." },
      { icon: "🐘", title: "Wildlife", text: "Inundation of Kaziranga grasslands forcing rhinos across NH-715." },
      { icon: "🏘️", title: "Settlements", text: "Erosion of vulnerable riverine sandbar char habitations." },
      { icon: "🛣️", title: "Infrastructure", text: "Breaches of age-weakened earthen dykes and flooded roads." }
    ]
  },
  arunachal: {
    name: "Arunachal Pradesh",
    capital: "Itanagar",
    risk: "Moderate (Flash Floods)",
    riskClass: "risk-moderate",
    rivers: "Siang, Subansiri, Kameng, Lohit, Dibang",
    terrain: "Rugged Eastern Himalayas with steep gorges",
    rainfall: "2,500 - 4,500 mm annually",
    whyMatters: "Arunachal Pradesh acts as the Himalayan headwater catchment; cloudburst surges directly propagate downstream into Assam's floodplains.",
    concerns: [
      { icon: "🌾", title: "Agriculture", text: "Terraced farming slope collapse and topsoil erosion." },
      { icon: "💧", title: "Wetlands", text: "Torrential debris flows altering mountain river ecosystems." },
      { icon: "🐘", title: "Wildlife", text: "High-altitude forest fragmentation and wildlife corridor disturbances." },
      { icon: "🏘️", title: "Settlements", text: "Flash floods cutting off remote riverside mountain hamlets." },
      { icon: "🛣️", title: "Infrastructure", text: "Critical mountain highway washouts and bridge collapses." }
    ]
  },
  meghalaya: {
    name: "Meghalaya",
    capital: "Shillong",
    risk: "Moderate (Foothills)",
    riskClass: "risk-moderate",
    rivers: "Simsang, Umngot, Myntdu, Umiam",
    terrain: "Rolling plateau with steep southern & western gorges",
    rainfall: "Highest in the world (Mawsynram: ~11,800 mm)",
    whyMatters: "Record rainfall sheds rapidly off high tablelands, causing severe waterlogging and flash floods in foothill valleys bordering Bangladesh.",
    concerns: [
      { icon: "🌾", title: "Agriculture", text: "Lowland paddy waterlogging in West Garo Hills bordering Bangladesh." },
      { icon: "💧", title: "Wetlands", text: "Rapid runoff stripping nutrients from exposed tableland soils." },
      { icon: "🐘", title: "Wildlife", text: "Disturbance to elephant migration routes in Garo and Khasi hills." },
      { icon: "🏘️", title: "Settlements", text: "Localized flash surges flooding lowland border villages." },
      { icon: "🛣️", title: "Infrastructure", text: "Landslides blocking vital transit highways to Barak Valley." }
    ]
  },
  manipur: {
    name: "Manipur",
    capital: "Imphal",
    risk: "Moderate (Valley Congestion)",
    riskClass: "risk-moderate",
    rivers: "Imphal, Iril, Thoubal, Barak",
    terrain: "Central bowl-shaped Imphal valley enclosed by hills",
    rainfall: "1,400 - 1,800 mm annually",
    whyMatters: "The central valley forms a natural bowl draining into Loktak Lake; when rains overwhelm drainage, settlements face prolonged submergence.",
    concerns: [
      { icon: "🌾", title: "Agriculture", text: "Flooding of valley agricultural plains around Loktak Lake." },
      { icon: "💧", title: "Wetlands", text: "Ecological stress on phumdis (floating mats) in Keibul Lamjao." },
      { icon: "🐘", title: "Wildlife", text: "Threats to the endangered Eld's deer (Sangai) habitat." },
      { icon: "🏘️", title: "Settlements", text: "Urban drainage congestion and residential flooding in Imphal." },
      { icon: "🛣️", title: "Infrastructure", text: "Submergence of low-lying district access roadways." }
    ]
  },
  mizoram: {
    name: "Mizoram",
    capital: "Aizawl",
    risk: "Low-to-Moderate (Valleys)",
    riskClass: "risk-low",
    rivers: "Tlawng, Chhimtuipui (Kaladan), Tuivawl",
    terrain: "North-south parallel ridge terrain and steep valleys",
    rainfall: "2,500 - 3,000 mm annually",
    whyMatters: "Steep topography prevents prolonged standing water, but torrential downpours trigger rapid river surges and dangerous slope failures.",
    concerns: [
      { icon: "🌾", title: "Agriculture", text: "Loss of riverine terrace crops and jhum agricultural patches." },
      { icon: "💧", title: "Wetlands", text: "Heavy sediment load altering narrow mountain stream ecology." },
      { icon: "🐘", title: "Wildlife", text: "Disturbance to dense subtropical forest wildlife sanctuaries." },
      { icon: "🏘️", title: "Settlements", text: "High-risk slope landslides threatening hillside habitations." },
      { icon: "🛣️", title: "Infrastructure", text: "Road connectivity cutoffs along national highways." }
    ]
  },
  nagaland: {
    name: "Nagaland",
    capital: "Kohima",
    risk: "Low-to-Moderate (Foothills)",
    riskClass: "risk-low",
    rivers: "Doyang, Dhansiri, Dikhu, Tizu",
    terrain: "Rugged Naga hills and narrow foothill terraces",
    rainfall: "1,800 - 2,500 mm annually",
    whyMatters: "Upland hills experience localized flash floods and mudflows, with lowland river inundations striking near the Dhansiri river in Dimapur.",
    concerns: [
      { icon: "🌾", title: "Agriculture", text: "Damage to foothill crop terraces and horticultural plantations." },
      { icon: "💧", title: "Wetlands", text: "River choking and silt accumulation in narrow valley bottoms." },
      { icon: "🐘", title: "Wildlife", text: "Disturbances along migratory bird corridors near Doyang reservoir." },
      { icon: "🏘️", title: "Settlements", text: "Inundation of low-lying urban colonies around Dimapur." },
      { icon: "🛣️", title: "Infrastructure", text: "Bridge pier scouring and road washouts along foothill corridors." }
    ]
  },
  tripura: {
    name: "Tripura",
    capital: "Agartala",
    risk: "Moderate to High",
    riskClass: "risk-moderate",
    rivers: "Howrah, Gomati, Manu, Khowai",
    terrain: "Low undulating hills with broad alluvial plains",
    rainfall: "2,200 - 2,600 mm annually",
    whyMatters: "Surrounded by Bangladesh, low-elevation river basins face rapid bank overspills and urban drainage congestion during heavy monsoon spells.",
    concerns: [
      { icon: "🌾", title: "Agriculture", text: "Widespread submergence of lowland monsoon rice cultivations." },
      { icon: "💧", title: "Wetlands", text: "Trans-boundary drainage siltation and waterbody degradation." },
      { icon: "🐘", title: "Wildlife", text: "Habitat flooding in Sepahijala and Trishna sanctuaries." },
      { icon: "🏘️", title: "Settlements", text: "Flash floods displacing residents in Agartala and Khowai." },
      { icon: "🛣️", title: "Infrastructure", text: "Breaches in earthen embankments and severed border routes." }
    ]
  },
  sikkim: {
    name: "Sikkim",
    capital: "Gangtok",
    risk: "Moderate (GLOF & Flash)",
    riskClass: "risk-moderate",
    rivers: "Teesta, Rangeet",
    terrain: "Glaciated High Himalayas and deep gorges",
    rainfall: "2,700 - 3,200 mm annually",
    whyMatters: "High glacial lakes (such as South Lhonak) face breach risks; high hydraulic gradients turn outburst floods into devastating downstream surges.",
    concerns: [
      { icon: "🌾", title: "Agriculture", text: "Complete erosion of fertile river terrace farms along Teesta." },
      { icon: "💧", title: "Wetlands", text: "Destabilization of fragile alpine glacial moraine ecosystems." },
      { icon: "🐘", title: "Wildlife", text: "Destruction of high-altitude Himalayan riparian habitats." },
      { icon: "🏘️", title: "Settlements", text: "Severe flash flood impacts on riverside settlements (Chungthang)." },
      { icon: "🛣️", title: "Infrastructure", text: "Washout of hydroelectric dams, bridges, and highway NH-10." }
    ]
  }
};

/* --------------------------------------------------------------------------
   DEMO flood assessment values (SIMULATED — not real measurements).
   Used by the map risk layer, map popups, state panel and dashboard so that
   every view shows the same consistent demonstration numbers.
   -------------------------------------------------------------------------- */
const RISK_TIERS = {
  "very-high": { label: "Very High", color: "#ef4444" },
  high: { label: "High", color: "#f97316" },
  moderate: { label: "Moderate", color: "#eab308" },
  low: { label: "Low", color: "#10b981" }
};

const DEMO_FLOOD_ASSESSMENT = {
  assam: { tier: "very-high", areaKm2: 4820, probability: 86, regions: 9, status: "Flooding detected" },
  tripura: { tier: "high", areaKm2: 880, probability: 64, regions: 3, status: "Flooding detected" },
  manipur: { tier: "high", areaKm2: 720, probability: 61, regions: 3, status: "Flooding detected" },
  arunachal: { tier: "moderate", areaKm2: 640, probability: 48, regions: 3, status: "Localised flooding" },
  meghalaya: { tier: "moderate", areaKm2: 410, probability: 42, regions: 2, status: "Localised flooding" },
  nagaland: { tier: "low", areaKm2: 190, probability: 26, regions: 1, status: "Under observation" },
  mizoram: { tier: "low", areaKm2: 150, probability: 22, regions: 1, status: "Under observation" },
  sikkim: { tier: "moderate", areaKm2: 120, probability: 38, regions: 1, status: "Under observation (GLOF watch)" }
};

// Monthly % of scanned scene classified as water (DEMO)
const DEMO_WATER_TREND = [
  { month: "Apr", value: 3.1 },
  { month: "May", value: 4.0 },
  { month: "Jun", value: 6.2 },
  { month: "Jul", value: 9.8 },
  { month: "Aug", value: 8.7 },
  { month: "Sep", value: 6.1 },
  { month: "Oct", value: 4.2 }
];
const DEMO_PERMANENT_WATER = 2.9;

const NE_STATE_BOUNDARIES = {
  assam: [
    [27.85, 95.80], [27.50, 96.00], [27.00, 95.40], [26.60, 94.60], [26.20, 93.80],
    [25.80, 93.50], [25.40, 93.00], [25.00, 93.20], [24.70, 93.10], [24.40, 92.90],
    [24.65, 92.40], [25.00, 92.40], [25.50, 92.80], [25.80, 91.80], [25.90, 90.80],
    [26.02, 89.97], [26.40, 89.90], [26.60, 90.50], [26.80, 91.20], [26.95, 92.10],
    [27.05, 93.20], [27.35, 94.20], [27.85, 95.80]
  ],
  arunachal: [
    [27.60, 91.80], [28.00, 92.20], [28.25, 93.00], [28.80, 94.00], [29.10, 95.00],
    [28.85, 96.20], [28.30, 97.20], [27.80, 97.40], [27.00, 96.60], [26.80, 95.80],
    [27.20, 95.40], [27.85, 95.80], [27.35, 94.20], [27.05, 93.20], [26.95, 92.10],
    [27.20, 91.80], [27.60, 91.80]
  ],
  meghalaya: [
    [25.80, 90.00], [26.00, 90.80], [25.80, 91.80], [25.60, 92.80], [25.10, 92.80],
    [25.12, 91.50], [25.20, 90.20], [25.50, 89.90], [25.80, 90.00]
  ],
  nagaland: [
    [27.00, 95.20], [26.80, 95.80], [26.30, 95.20], [25.80, 94.80], [25.50, 94.30],
    [25.60, 93.80], [26.20, 94.20], [26.60, 94.60], [27.00, 95.20]
  ],
  manipur: [
    [25.70, 94.20], [25.50, 94.80], [24.80, 94.60], [24.20, 94.40], [23.90, 93.40],
    [24.40, 93.00], [25.00, 93.20], [25.40, 93.50], [25.70, 94.20]
  ],
  mizoram: [
    [24.40, 92.90], [24.20, 93.30], [23.80, 93.40], [23.00, 93.30], [22.20, 93.00],
    [22.00, 92.70], [22.50, 92.50], [23.20, 92.40], [24.00, 92.40], [24.40, 92.90]
  ],
  tripura: [
    [24.50, 92.20], [24.20, 92.40], [23.50, 92.20], [23.00, 91.80], [23.30, 91.20],
    [23.80, 91.20], [24.30, 91.80], [24.50, 92.20]
  ],
  sikkim: [
    [27.20, 88.10], [27.60, 88.10], [28.00, 88.50], [28.10, 88.70], [27.80, 88.90],
    [27.30, 88.80], [27.10, 88.50], [27.20, 88.10]
  ]
};

const BRAHMAPUTRA_RIVER_PATH = [
  [28.45, 95.35], [28.05, 95.33], [27.85, 95.40], [27.48, 94.92], [27.15, 94.52],
  [26.92, 94.18], [26.75, 93.65], [26.58, 92.85], [26.25, 92.05], [26.18, 91.75],
  [26.15, 91.20], [26.17, 90.62], [26.02, 89.97], [25.75, 89.72]
];

const BARAK_RIVER_PATH = [
  [25.20, 93.60], [24.95, 93.20], [24.82, 92.80], [24.86, 92.35]
];

const DISASTER_HOTSPOTS = [
  {
    name: "Majuli River Island",
    coords: [26.95, 94.21],
    risk: "Critical (Erosion & Inundation)",
    riskClass: "risk-high",
    desc: "World's largest inhabited river island; recurrent severe bank erosion and sandbar char submergence.",
    caution: false
  },
  {
    name: "Kaziranga National Park Corridor",
    coords: [26.58, 93.17],
    risk: "Severe (Wildlife Alert)",
    riskClass: "risk-high",
    desc: "Floods submerging animal habitats, forcing One-Horned Rhinoceroses across NH-715 to Karbi Anglong highlands.",
    caution: false
  },
  {
    name: "Morigaon Floodplains",
    coords: [26.25, 92.34],
    risk: "High (Agrarian Sand-Casting)",
    riskClass: "risk-high",
    desc: "Extensive submergence of monsoon Sali rice paddies with destructive sediment and sand deposition.",
    caution: false
  },
  {
    name: "Silchar (Barak Valley)",
    coords: [24.83, 92.79],
    risk: "High (Urban Deluge)",
    riskClass: "risk-high",
    desc: "Bethukandi embankment breach zone causing acute urban flooding and water supply contamination.",
    caution: false
  },
  {
    name: "Subansiri Lower Basin",
    coords: [27.55, 94.25],
    risk: "Moderate (Himalayan Surge)",
    riskClass: "risk-moderate",
    desc: "Steep catchment flash floods and landslide debris rushing down into Lakhimpur plains.",
    caution: true
  },
  {
    name: "South Lhonak Glacial Lake, Sikkim",
    coords: [27.91, 88.20],
    risk: "High (GLOF Hazard)",
    riskClass: "risk-high",
    desc: "High-altitude glacial lake vulnerable to catastrophic breach floods along the Teesta river basin.",
    caution: true
  }
];

let leafletMap = null;
let statePolygonLayers = {};
let riverLayersGroup = null;
let hotspotLayersGroup = null;
let currentBaseLayer = null;
let riskLayerEnabled = true;
let activeMapState = "assam";

// Polygon style depends on the (demo) risk layer toggle and selection state
function getStatePolygonStyle(stateKey, isActive, isHover = false) {
  const tier = RISK_TIERS[DEMO_FLOOD_ASSESSMENT[stateKey].tier];
  if (riskLayerEnabled) {
    return {
      fillColor: tier.color,
      fillOpacity: isActive ? 0.55 : isHover ? 0.5 : 0.32,
      color: isActive ? "#ffffff" : tier.color,
      weight: isActive ? 3 : isHover ? 2.5 : 1.4,
      opacity: 0.95
    };
  }
  return {
    fillColor: isActive || isHover ? "#10b981" : "#1e40af",
    fillOpacity: isActive ? 0.45 : isHover ? 0.5 : 0.18,
    color: isActive || isHover ? "#10b981" : "#38bdf8",
    weight: isActive ? 3 : isHover ? 3 : 1.5,
    opacity: 0.9
  };
}

function formatKm2(value) {
  return `${value.toLocaleString("en-IN")} km²`;
}

function buildStatePopupHtml(stateKey) {
  const data = NE_STATES_DATA[stateKey];
  const demo = DEMO_FLOOD_ASSESSMENT[stateKey];
  const tier = RISK_TIERS[demo.tier];
  return `
    <div class="state-popup">
      <div class="state-popup-head">
        <strong>${data.name}</strong>
        <span class="demo-chip demo-chip-sm">Demo Data</span>
      </div>
      <dl class="state-popup-grid">
        <dt>Risk Level</dt>
        <dd><i class="rl" style="background:${tier.color}"></i>${tier.label}</dd>
        <dt>Affected Area</dt>
        <dd>${formatKm2(demo.areaKm2)}</dd>
        <dt>Flood Probability</dt>
        <dd>${demo.probability}%</dd>
        <dt>Detection Status</dt>
        <dd>${demo.status}</dd>
      </dl>
      <p class="state-popup-note">Simulated values for demonstration only.</p>
    </div>
  `;
}

function renderStateAssessment(stateKey) {
  const demo = DEMO_FLOOD_ASSESSMENT[stateKey];
  if (!demo) return;
  const tier = RISK_TIERS[demo.tier];
  const riskEl = document.getElementById("assessRisk");
  const areaEl = document.getElementById("assessArea");
  const probEl = document.getElementById("assessProb");
  const barEl = document.getElementById("assessProbBar");
  const statusEl = document.getElementById("assessStatus");

  if (riskEl) {
    riskEl.textContent = tier.label;
    riskEl.style.color = tier.color;
  }
  if (areaEl) areaEl.textContent = formatKm2(demo.areaKm2);
  if (probEl) probEl.textContent = `${demo.probability}%`;
  if (barEl) {
    barEl.style.width = `${demo.probability}%`;
    barEl.style.background = tier.color;
  }
  if (statusEl) statusEl.textContent = demo.status;
}

function initNeIndiaMap() {
  const mapContainer = document.getElementById("neIndiaLeafletMap");
  const stateBtns = document.querySelectorAll(".state-btn");

  function updateInfoCard(stateKey) {
    const data = NE_STATES_DATA[stateKey];
    if (!data) return;

    // Update State Buttons
    stateBtns.forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.state === stateKey);
    });

    // Update Info Display Card
    const nameEl = document.getElementById("stateNameDisplay");
    const riskEl = document.getElementById("stateRiskDisplay");
    const whyEl = document.getElementById("stateWhyMatters");
    const capitalEl = document.getElementById("stateCapitalDisplay");
    const riversEl = document.getElementById("stateRiversDisplay");
    const terrainEl = document.getElementById("stateTerrainDisplay");
    const rainfallEl = document.getElementById("stateRainfallDisplay");
    const concernsEl = document.getElementById("stateConcernsList");

    if (nameEl) nameEl.textContent = data.name;
    if (riskEl) {
      riskEl.textContent = `${data.risk} Vulnerability`;
      riskEl.className = `risk-pill ${data.riskClass}`;
    }
    if (whyEl) whyEl.textContent = data.whyMatters;
    if (capitalEl) capitalEl.textContent = data.capital;
    if (riversEl) riversEl.textContent = data.rivers;
    if (terrainEl) terrainEl.textContent = data.terrain;
    if (rainfallEl) rainfallEl.textContent = data.rainfall;

    renderStateAssessment(stateKey);

    if (concernsEl && data.concerns) {
      concernsEl.innerHTML = data.concerns.map(c => `
        <li>${c.icon} <strong>${c.title}:</strong> ${c.text}</li>
      `).join("");
    }
  }

  function openStatePopup(stateKey) {
    const layer = statePolygonLayers[stateKey];
    if (!leafletMap || !layer) return;
    // Open after fitBounds animation so the popup is not pushed off-screen
    setTimeout(() => layer.openPopup(layer.getBounds().getCenter()), 850);
  }

  function highlightMapState(stateKey) {
    if (!leafletMap) return;

    activeMapState = stateKey;

    // Reset styles
    Object.keys(statePolygonLayers).forEach((key) => {
      const layer = statePolygonLayers[key];
      if (layer) layer.setStyle(getStatePolygonStyle(key, key === stateKey));
    });

    const targetLayer = statePolygonLayers[stateKey];
    if (targetLayer) {
      leafletMap.fitBounds(targetLayer.getBounds(), {
        padding: [30, 30],
        maxZoom: 8,
        animate: true,
        duration: 0.8
      });
    }
  }

  // Click listeners on State Pills
  stateBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const stateKey = btn.dataset.state;
      updateInfoCard(stateKey);
      highlightMapState(stateKey);
      openStatePopup(stateKey);
      playTechChime(520, 0.05);
    });
  });

  // Check if Leaflet library is available
  if (typeof L !== "undefined" && mapContainer) {
    initLeafletSatelliteMap(updateInfoCard, highlightMapState);
  }

  // Default selection: Assam
  updateInfoCard("assam");
}

function initLeafletSatelliteMap(updateInfoCard, highlightMapState) {
  const mapCenter = [26.15, 93.30];
  const initialZoom = window.innerWidth < 768 ? 5.8 : 6.8;

  // Initialize Map
  leafletMap = L.map("neIndiaLeafletMap", {
    center: mapCenter,
    zoom: initialZoom,
    minZoom: 5.2,
    maxZoom: 14,
    zoomControl: true,
    attributionControl: false
  });

  // Base Tile Layers
  const tileSatellite = L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
    maxZoom: 18,
    attribution: "Esri World Imagery"
  });

  const tileTopo = L.tileLayer("https://basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
    maxZoom: 18,
    attribution: "CartoDB Voyager"
  });

  const tileRadar = L.tileLayer("https://basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
    maxZoom: 18,
    attribution: "CartoDB Dark"
  });

  // Default to ESRI Satellite Basemap
  currentBaseLayer = tileSatellite;
  tileSatellite.addTo(leafletMap);

  // Basemap Toolbar Buttons
  const btnSat = document.getElementById("btnSatelliteBasemap");
  const btnTopo = document.getElementById("btnTopoBasemap");
  const btnRadar = document.getElementById("btnRadarBasemap");

  function switchBasemap(newLayer, activeBtn) {
    if (currentBaseLayer) leafletMap.removeLayer(currentBaseLayer);
    currentBaseLayer = newLayer;
    newLayer.addTo(leafletMap);

    [btnSat, btnTopo, btnRadar].forEach((b) => {
      if (b) b.classList.remove("active");
    });
    if (activeBtn) activeBtn.classList.add("active");
    playTechChime(480, 0.05);
  }

  if (btnSat) btnSat.addEventListener("click", () => switchBasemap(tileSatellite, btnSat));
  if (btnTopo) btnTopo.addEventListener("click", () => switchBasemap(tileTopo, btnTopo));
  if (btnRadar) btnRadar.addEventListener("click", () => switchBasemap(tileRadar, btnRadar));

  // Reset View Button
  const btnReset = document.getElementById("btnResetMapView");
  if (btnReset) {
    btnReset.addEventListener("click", () => {
      leafletMap.closePopup();
      updateInfoCard("assam");
      highlightMapState("assam");
      leafletMap.setView(mapCenter, initialZoom, { animate: true });
      playTechChime(400, 0.06);
    });
  }

  // Draw 8 State Boundaries with Polygons
  Object.keys(NE_STATE_BOUNDARIES).forEach((stateKey) => {
    const coords = NE_STATE_BOUNDARIES[stateKey];
    const data = NE_STATES_DATA[stateKey];
    const demo = DEMO_FLOOD_ASSESSMENT[stateKey];

    const polygon = L.polygon(coords, {
      ...getStatePolygonStyle(stateKey, stateKey === activeMapState),
      className: "state-boundary-polygon"
    }).addTo(leafletMap);

    polygon.bindPopup(() => buildStatePopupHtml(stateKey), {
      maxWidth: 280,
      className: "state-popup-wrapper"
    });

    polygon.bindTooltip(`<strong>${data.name}</strong><br><span style="font-size: 11px;">${RISK_TIERS[demo.tier].label} risk · Demo</span>`, {
      sticky: true,
      direction: "top",
      className: "custom-leaflet-tooltip"
    });

    polygon.on("mouseover", () => {
      polygon.setStyle(getStatePolygonStyle(stateKey, stateKey === activeMapState, true));
    });

    polygon.on("mouseout", () => {
      polygon.setStyle(getStatePolygonStyle(stateKey, stateKey === activeMapState));
    });

    polygon.on("click", () => {
      updateInfoCard(stateKey);
      highlightMapState(stateKey);
    });

    statePolygonLayers[stateKey] = polygon;
  });

  // Major River Networks
  riverLayersGroup = L.layerGroup();
  const brahmaputraLine = L.polyline(BRAHMAPUTRA_RIVER_PATH, {
    color: "#38bdf8",
    weight: 4.5,
    opacity: 0.9,
    dashArray: "10, 6"
  }).bindTooltip("🌊 Brahmaputra River Basin", { sticky: true });

  const barakLine = L.polyline(BARAK_RIVER_PATH, {
    color: "#60a5fa",
    weight: 3.5,
    opacity: 0.85
  }).bindTooltip("🌊 Barak River Channel", { sticky: true });

  riverLayersGroup.addLayer(brahmaputraLine);
  riverLayersGroup.addLayer(barakLine);
  riverLayersGroup.addTo(leafletMap);

  // Ecological Hotspots Layer
  hotspotLayersGroup = L.layerGroup();
  DISASTER_HOTSPOTS.forEach((spot) => {
    const pulsingIcon = L.divIcon({
      className: "leaflet-pulsing-icon",
      html: `<div class="pulsing-hotspot-pin ${spot.caution ? 'caution' : ''}"></div>`,
      iconSize: [20, 20],
      iconAnchor: [10, 10]
    });

    const marker = L.marker(spot.coords, { icon: pulsingIcon });
    const popupContent = `
      <div class="map-popup-card">
        <span class="badge ${spot.caution ? 'badge-warning' : 'badge-green'}" style="margin-bottom: 6px; padding: 2px 8px; font-size: 0.68rem;">
          ${spot.risk}
        </span>
        <h4 style="margin: 4px 0 6px; font-size: 0.96rem; font-weight: 750; color: #0f172a;">${spot.name}</h4>
        <p style="font-size: 0.82rem; color: #475569; margin: 0; line-height: 1.45;">${spot.desc}</p>
        <div style="margin-top: 8px; font-size: 0.75rem; color: #0284c7; font-family: monospace;">
          COORD: ${spot.coords[0].toFixed(2)}°N, ${spot.coords[1].toFixed(2)}°E
        </div>
      </div>
    `;

    marker.bindPopup(popupContent, { maxWidth: 280 });
    hotspotLayersGroup.addLayer(marker);
  });
  hotspotLayersGroup.addTo(leafletMap);

  // Checkbox layer toggles
  const checkRisk = document.getElementById("checkRiskLayer");
  if (checkRisk) {
    checkRisk.addEventListener("change", (e) => {
      riskLayerEnabled = e.target.checked;
      Object.keys(statePolygonLayers).forEach((key) => {
        statePolygonLayers[key].setStyle(getStatePolygonStyle(key, key === activeMapState));
      });
    });
  }

  const checkHotspots = document.getElementById("checkHotspotsLayer");
  const checkRivers = document.getElementById("checkRiversLayer");

  if (checkHotspots) {
    checkHotspots.addEventListener("change", (e) => {
      if (e.target.checked) {
        leafletMap.addLayer(hotspotLayersGroup);
      } else {
        leafletMap.removeLayer(hotspotLayersGroup);
      }
    });
  }

  if (checkRivers) {
    checkRivers.addEventListener("change", (e) => {
      if (e.target.checked) {
        leafletMap.addLayer(riverLayersGroup);
      } else {
        leafletMap.removeLayer(riverLayersGroup);
      }
    });
  }

  // Telemetry HUD tracking on mousemove
  const coordsDisplay = document.getElementById("mapCursorCoords");
  const zoomDisplay = document.getElementById("mapZoomLevel");

  leafletMap.on("mousemove", (e) => {
    if (coordsDisplay) {
      coordsDisplay.textContent = `Lat: ${e.latlng.lat.toFixed(4)}° N, Lng: ${e.latlng.lng.toFixed(4)}° E`;
    }
  });

  leafletMap.on("zoomend", () => {
    if (zoomDisplay) {
      zoomDisplay.textContent = `ZOOM: ${leafletMap.getZoom().toFixed(1)}x`;
    }
  });

  // Handle window resize gracefully
  window.addEventListener("resize", () => {
    if (leafletMap) leafletMap.invalidateSize();
  });
}

/* ==========================================================================
   4. Section 4: Before / After Flood Comparison Slider
   ========================================================================== */
function initBeforeAfterSlider() {
  const container = document.getElementById("comparisonSlider");
  const sliderImageAfter = document.getElementById("sliderImageAfter");
  const sliderHandle = document.getElementById("sliderHandle");

  if (!container || !sliderImageAfter || !sliderHandle) return;

  let isDragging = false;

  function updateSliderPosition(clientX) {
    const rect = container.getBoundingClientRect();
    let xPos = clientX - rect.left;

    // Constrain within bounds (2% to 98%)
    if (xPos < rect.width * 0.02) xPos = rect.width * 0.02;
    if (xPos > rect.width * 0.98) xPos = rect.width * 0.98;

    const percentage = (xPos / rect.width) * 100;

    sliderImageAfter.style.width = `${percentage}%`;
    sliderHandle.style.left = `${percentage}%`;
  }

  // Mouse Events
  sliderHandle.addEventListener("mousedown", (e) => {
    isDragging = true;
    e.preventDefault();
  });

  container.addEventListener("mousedown", (e) => {
    isDragging = true;
    updateSliderPosition(e.clientX);
  });

  window.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    updateSliderPosition(e.clientX);
  });

  window.addEventListener("mouseup", () => {
    if (isDragging) isDragging = false;
  });

  // Touch Events
  sliderHandle.addEventListener("touchstart", (e) => {
    isDragging = true;
    e.preventDefault();
  }, { passive: false });

  container.addEventListener("touchstart", (e) => {
    if (e.touches.length > 0) {
      isDragging = true;
      updateSliderPosition(e.touches[0].clientX);
    }
  }, { passive: true });

  window.addEventListener("touchmove", (e) => {
    if (!isDragging || e.touches.length === 0) return;
    updateSliderPosition(e.touches[0].clientX);
  }, { passive: true });

  window.addEventListener("touchend", () => {
    isDragging = false;
  });

  // Initial position: 50%
  sliderImageAfter.style.width = "50%";
  sliderHandle.style.left = "50%";
}

/* ==========================================================================
   5. Section 5: Environmental Impact Expandable Cards
   ========================================================================== */
function initEnvironmentalImpactCards() {
  const cards = document.querySelectorAll(".expandable-impact-card");

  cards.forEach((card) => {
    const btn = card.querySelector(".impact-expand-btn");

    function toggleCard() {
      const isExpanded = card.getAttribute("data-expanded") === "true";
      card.setAttribute("data-expanded", isExpanded ? "false" : "true");

      if (btn) {
        const textSpan = btn.querySelector(".expandtext");
        const arrowSpan = btn.querySelector(".expand-arrow");
        if (textSpan) textSpan.textContent = isExpanded ? "Read More" : "Show Less";
        if (arrowSpan) arrowSpan.textContent = isExpanded ? "↓" : "↑";
      }
      playTechChime(500, 0.04);
    }

    card.addEventListener("click", (e) => {
      // Don't double trigger if clicking button directly
      if (e.target.closest(".impact-expand-btn")) {
        toggleCard();
      } else {
        toggleCard();
      }
    });
  });
}

/* ==========================================================================
   6. Section 6: How Flood Detection Works (6-Stage Pipeline)
   ========================================================================== */
const PIPELINE_STAGES = [
  {
    stepNum: "01",
    title: "Satellite Image Acquisition",
    body: "<strong>Satellite imagery is collected for the area of interest.</strong><br><br>Spaceborne Earth observation constellations (such as ESA Copernicus Sentinel-1 Synthetic Aperture Radar or Sentinel-2 Multispectral sensors) acquire broad-area images over target North-East Indian river basins.",
    tip: "EVS Viva Insight: Optical satellites provide natural color images but cannot see through clouds. Radar satellites (Sentinel-1 SAR) operate day and night and penetrate monsoon clouds."
  },
  {
    stepNum: "02",
    title: "Image Preprocessing & Calibration",
    body: "<strong>Raw satellite data is cleaned and georeferenced.</strong><br><br>Satellite tiles undergo radiometric calibration, terrain correction using digital elevation models (DEM), and speckle noise filtering to eliminate sensor noise and align coordinates to standard geographic datum (WGS84).",
    tip: "EVS Viva Insight: Preprocessing ensures that steep Himalayan slopes and cloud shadows do not corrupt water backscatter readings."
  },
  {
    stepNum: "03",
    title: "AI-Assisted Feature Analysis",
    body: "<strong>Machine learning algorithms analyze pixel reflectance and backscatter.</strong><br><br>Convolutional neural networks (CNNs) evaluate spatial context, texture, and spectral indices (like NDWI for optical, or low microwave backscatter for SAR) to distinguish water features from surrounding landscapes.",
    tip: "EVS Viva Insight: Smooth water acts like a mirror to radar waves (specular reflection), scattering energy away from the sensor and appearing dark."
  },
  {
    stepNum: "04",
    title: "Flood Detection & Semantic Segmentation",
    body: "<strong>The model separates standing floodwater from normal river channels.</strong><br><br>Pixel-level segmentation produces clean binary masks identifying newly inundated lands by subtracting historical pre-monsoon baseline water masks from active flood scenes.",
    tip: "EVS Viva Insight: Change detection is vital—it prevents permanent river beds from being incorrectly counted as newly flooded agricultural land."
  },
  {
    stepNum: "05",
    title: "Flood Visualization & Vector Mapping",
    body: "<strong>Raw pixel classifications are converted into GIS map layers.</strong><br><br>The raster flood mask is vectorized into polygon boundaries and overlaid on base maps with geographic coordinates, contour lines, and infrastructure markers for intuitive human interpretation.",
    tip: "EVS Viva Insight: Vector layers can be exported directly into district GIS platforms for relief planning."
  },
  {
    stepNum: "06",
    title: "Environmental Interpretation",
    body: "<strong>Evaluating ecological consequences and community vulnerability.</strong><br><br>Hydrologists and environmental planners cross-reference detected flood boundaries against land-use maps to assess agricultural damage (sand-casting), wildlife migration disruption (Kaziranga), and community displacement.",
    tip: "EVS Viva Insight: The final goal of remote sensing in EVS is environmental awareness and protection—not just generating technological data."
  }
];

function initPipeline() {
  const nodes = document.querySelectorAll(".pipeline-step-node");
  const progressLine = document.getElementById("connectorProgress");
  const stepBadge = document.getElementById("pipelineDetailStep");
  const titleEl = document.getElementById("pipelineDetailTitle");
  const bodyEl = document.getElementById("pipelineDetailBody");
  const tipEl = document.getElementById("pipelineDetailTip");

  function setPipelineStep(index) {
    if (index < 0 || index >= PIPELINE_STAGES.length) return;
    const stage = PIPELINE_STAGES[index];

    nodes.forEach((node, i) => {
      node.classList.toggle("active", i === index);
    });

    if (progressLine) {
      const percent = (index / (PIPELINE_STAGES.length - 1)) * 100;
      progressLine.style.width = `${percent}%`;
    }

    if (stepBadge) stepBadge.textContent = `Step ${stage.stepNum}`;
    if (titleEl) titleEl.textContent = stage.title;
    if (bodyEl) bodyEl.innerHTML = stage.body;
    if (tipEl) tipEl.textContent = stage.tip;

    playTechChime(440 + index * 30, 0.05);
  }

  nodes.forEach((node) => {
    node.addEventListener("click", () => {
      const idx = parseInt(node.dataset.stepIndex, 10);
      setPipelineStep(idx);
    });
  });

  // Default: Step 0
  setPipelineStep(0);
}

/* ==========================================================================
   7. Section 7: Flood Analysis Lab (Main Interactive Feature)
   ========================================================================== */
const DEMO_PRESETS = [
  {
    id: "assam-majuli",
    state: "assam",
    name: "Assam — Majuli River Island",
    badge: "Primary Case Study",
    coords: "26.95° N, 94.21° E",
    river: "Brahmaputra Main Braided Channel",
    imageUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=80",
    riverPath: "M0,130 C120,110 210,190 310,140 T400,160",
    floodMain: "M110,120 Q190,70 280,135 T370,245 Q210,270 110,225 Z",
    floodSec: "M20,60 Q70,40 100,75 T60,110 Z",
    context: "Lowland alluvial river island subject to massive sand-casting and char village displacement.",
    threat: "Destructive sand deposits over agricultural rice paddies and riverbank erosion.",
    sensor: "Sentinel-1 SAR C-Band"
  },
  {
    id: "assam-kaziranga",
    state: "assam",
    name: "Assam — Kaziranga Wildlife Buffer",
    badge: "Wildlife Corridor",
    coords: "26.58° N, 93.17° E",
    river: "Brahmaputra & Diphlu Streams",
    imageUrl: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=900&q=80",
    riverPath: "M0,150 C90,130 180,200 270,160 T400,180",
    floodMain: "M70,110 Q160,80 260,130 T360,230 Q220,250 70,210 Z",
    floodSec: "M280,60 Q340,40 370,80 T330,120 Z",
    context: "Grassland sanctuary where monsoon inundation covers over 75% of animal grazing grounds.",
    threat: "Endangered One-Horned Rhinos forced across NH-715 toward Karbi Anglong highlands.",
    sensor: "Sentinel-1 SAR + Sentinel-2 NDWI"
  },
  {
    id: "assam-morigaon",
    state: "assam",
    name: "Assam — Morigaon Floodplains",
    badge: "Agricultural Belt",
    coords: "26.25° N, 92.34° E",
    river: "Kopili River Confluence",
    imageUrl: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=900&q=80",
    riverPath: "M0,110 C140,140 230,120 320,180 T400,150",
    floodMain: "M90,100 Q180,70 290,120 T380,220 Q200,260 90,210 Z",
    floodSec: "M30,160 Q80,140 120,180 T70,230 Z",
    context: "Agricultural rice bowl experiencing heavy monsoon inundation and drainage congestion.",
    threat: "Submergence of standing Sali paddy crops and prolonged farm waterlogging.",
    sensor: "Sentinel-1 SAR C-Band"
  },
  {
    id: "assam-silchar",
    state: "assam",
    name: "Assam — Silchar (Barak Valley)",
    badge: "Embankment Breach",
    coords: "24.83° N, 92.79° E",
    river: "Barak River Basin",
    imageUrl: "https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=900&q=80",
    riverPath: "M0,170 C100,150 190,180 290,140 T400,160",
    floodMain: "M100,130 Q190,90 280,140 T380,250 Q230,270 100,230 Z",
    floodSec: "M40,70 Q90,50 120,90 T80,130 Z",
    context: "Barak valley flood basin with Bethukandi dyke breach vulnerabilities.",
    threat: "Urban and rural residential flooding and drinking water contamination.",
    sensor: "Sentinel-1 SAR C-Band"
  },
  {
    id: "meghalaya-garo",
    state: "meghalaya",
    name: "Meghalaya — West Garo Foothills",
    badge: "Foothill Runoff",
    coords: "25.51° N, 90.22° E",
    river: "Jinjiram / Simsang Drainage",
    imageUrl: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=900&q=80",
    riverPath: "M0,140 C110,120 200,170 300,130 T400,150",
    floodMain: "M120,110 Q190,75 270,125 T360,230 Q210,250 120,215 Z",
    floodSec: "M30,80 Q80,60 110,95 T70,130 Z",
    context: "High plateau runoff draining into low-lying border plains.",
    threat: "Sudden foothill flash inundations and severe topsoil erosion.",
    sensor: "Sentinel-1 SAR C-Band"
  },
  {
    id: "arunachal-siang",
    state: "arunachal",
    name: "Arunachal — Siang River Valley",
    badge: "Himalayan Surge",
    coords: "28.06° N, 95.32° E",
    river: "Siang River (Upper Brahmaputra)",
    imageUrl: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=900&q=80",
    riverPath: "M0,160 C120,130 220,190 320,140 T400,170",
    floodMain: "M100,120 Q180,85 270,135 T370,240 Q220,265 100,220 Z",
    floodSec: "M25,75 Q75,55 105,90 T65,125 Z",
    context: "Steep Himalayan valley carrying heavy sediment loads and torrential runoff.",
    threat: "Debris flows, mountain road severance, and high downstream surges into Assam.",
    sensor: "Sentinel-1 SAR Microwave"
  }
];

function initFloodAnalysisLab() {
  let currentPreset = DEMO_PRESETS[0];
  let isAnalyzing = false;
  let customUploadedImage = null;

  // DOM elements
  const regionPills = document.querySelectorAll("#labRegionPills .region-pill-btn");
  const tabPresets = document.getElementById("tabPresetImages");
  const tabUpload = document.getElementById("tabUploadImage");
  const panelPresets = document.getElementById("panelPresetImages");
  const panelUpload = document.getElementById("panelUploadImage");
  const presetsGrid = document.getElementById("demoPresetsGrid");

  const fileInput = document.getElementById("satelliteFileInput");
  const dropzone = document.getElementById("uploadDropzone");

  const btnDualView = document.getElementById("btnLabDualView");
  const btnSwipeView = document.getElementById("btnLabSwipeView");
  const dualContainer = document.getElementById("labDualContainer");
  const swipeContainer = document.getElementById("labSwipeContainer");

  const btnMaskCyan = document.getElementById("btnMaskCyan");
  const btnMaskThermal = document.getElementById("btnMaskThermal");

  const btnToggleScanline = document.getElementById("btnToggleScanline");
  const scanlineIcon = document.getElementById("scanlineStatusIcon");
  const scanlineEl = document.getElementById("satelliteScanLine");

  const btnToggleAudio = document.getElementById("btnToggleAudio");
  const audioIcon = document.getElementById("audioStatusIcon");

  const btnRunAnalysis = document.getElementById("btnRunLabAnalysis");
  const btnReset = document.getElementById("btnResetLab");

  const animationBox = document.getElementById("processingAnimationBox");
  const stepText = document.getElementById("processingStepText");
  const percentText = document.getElementById("processingPercentage");
  const progressBar = document.getElementById("processingProgressBar");

  const labLeftImage = document.getElementById("labLeftImage");
  const labRightImage = document.getElementById("labRightImage");
  const swipeBgImg = document.getElementById("swipeBgImg");
  const swipeFgImg = document.getElementById("swipeFgImg");

  const svgInputCoordText = document.getElementById("svgInputCoordText");
  const svgInputLocationText = document.getElementById("svgInputLocationText");
  const svgRiverName = document.getElementById("svgRiverName");
  const svgPermanentRiver = document.getElementById("svgPermanentRiver");
  const svgFloodMain = document.getElementById("svgFloodMain");
  const svgFloodSec = document.getElementById("svgFloodSec");
  const svgInundationGroup = document.getElementById("svgInundationGroup");

  const labStatusDot = document.getElementById("labStatusDot");
  const labStatusMessage = document.getElementById("labStatusMessage");

  const interpRegion = document.getElementById("interpRegion");
  const interpRegionDesc = document.getElementById("interpRegionDesc");
  const interpThreat = document.getElementById("interpThreat");

  // Render Presets Buttons
  function renderPresets() {
    if (!presetsGrid) return;
    presetsGrid.innerHTML = DEMO_PRESETS.map((p, idx) => `
      <button class="preset-card-btn ${idx === 0 ? 'active' : ''}" data-preset-id="${p.id}">
        <span class="preset-name">${p.name}</span>
        <span class="preset-meta">${p.badge} • ${p.coords}</span>
      </button>
    `).join("");

    const presetBtns = presetsGrid.querySelectorAll(".preset-card-btn");
    presetBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.presetId;
        const found = DEMO_PRESETS.find(p => p.id === id);
        if (found) {
          presetBtns.forEach(b => b.classList.remove("active"));
          btn.classList.add("active");
          applyPreset(found);
        }
      });
    });
  }

  function applyPreset(preset) {
    currentPreset = preset;
    customUploadedImage = null;

    if (labLeftImage) labLeftImage.src = preset.imageUrl;
    if (labRightImage) labRightImage.src = preset.imageUrl;
    if (swipeBgImg) swipeBgImg.src = preset.imageUrl;
    if (swipeFgImg) swipeFgImg.src = preset.imageUrl;

    if (svgInputLocationText) svgInputLocationText.textContent = `INPUT SCENE: ${preset.name.toUpperCase()}`;
    if (svgInputCoordText) svgInputCoordText.textContent = `COORD: ${preset.coords} | ${preset.sensor.toUpperCase()}`;
    if (svgRiverName) svgRiverName.textContent = preset.river;

    if (svgPermanentRiver && preset.riverPath) svgPermanentRiver.setAttribute("d", preset.riverPath);
    if (svgFloodMain && preset.floodMain) svgFloodMain.setAttribute("d", preset.floodMain);
    if (svgFloodSec && preset.floodSec) svgFloodSec.setAttribute("d", preset.floodSec);

    // Update interpretation
    if (interpRegion) interpRegion.textContent = preset.name;
    if (interpRegionDesc) interpRegionDesc.textContent = preset.context;
    if (interpThreat) interpThreat.textContent = preset.threat;

    // Reset status
    if (labStatusDot) labStatusDot.className = "status-dot ready";
    if (labStatusMessage) labStatusMessage.textContent = `Preset loaded: ${preset.name}. Ready to analyze.`;

    // Highlight matching region pill
    regionPills.forEach((p) => {
      p.classList.toggle("active", p.dataset.region === preset.state);
    });

    playTechChime(500, 0.05);
  }

  // Region Pills click handlers
  regionPills.forEach((pill) => {
    pill.addEventListener("click", () => {
      const regionKey = pill.dataset.region;
      regionPills.forEach(p => p.classList.remove("active"));
      pill.classList.add("active");

      // Find matching preset or default
      const matchingPreset = DEMO_PRESETS.find(p => p.state === regionKey) || DEMO_PRESETS[0];
      const stateObj = NE_STATES_DATA[regionKey];

      applyPreset(matchingPreset);

      if (stateObj && interpRegionDesc) {
        interpRegionDesc.textContent = stateObj.whyMatters;
      }
    });
  });

  // Tab switching (Presets vs Upload)
  if (tabPresets && tabUpload && panelPresets && panelUpload) {
    tabPresets.addEventListener("click", () => {
      tabPresets.classList.add("active");
      tabUpload.classList.remove("active");
      panelPresets.classList.add("active");
      panelUpload.classList.remove("active");
      playTechChime(460, 0.04);
    });

    tabUpload.addEventListener("click", () => {
      tabUpload.classList.add("active");
      tabPresets.classList.remove("active");
      panelUpload.classList.add("active");
      panelPresets.classList.remove("active");
      playTechChime(460, 0.04);
    });
  }

  // File Upload Handling
  function handleUploadedFile(file) {
    if (!file || !file.type.startsWith("image/")) {
      alert("Please upload an image file (JPG or PNG).");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target.result;
      customUploadedImage = dataUrl;

      if (labLeftImage) labLeftImage.src = dataUrl;
      if (labRightImage) labRightImage.src = dataUrl;
      if (swipeBgImg) swipeBgImg.src = dataUrl;
      if (swipeFgImg) swipeFgImg.src = dataUrl;

      if (svgInputLocationText) svgInputLocationText.textContent = `USER DEMONSTRATION IMAGE: ${file.name.toUpperCase()}`;
      if (svgInputCoordText) svgInputCoordText.textContent = `USER UPLOAD • LOCAL BROWSER INGESTION`;

      if (labStatusDot) labStatusDot.className = "status-dot ready";
      if (labStatusMessage) labStatusMessage.textContent = `User image loaded: "${file.name}". Ready to analyze image.`;

      playTechChime(600, 0.08);
    };
    reader.readAsDataURL(file);
  }

  if (fileInput) {
    fileInput.addEventListener("change", (e) => {
      if (e.target.files && e.target.files[0]) {
        handleUploadedFile(e.target.files[0]);
      }
    });
  }

  if (dropzone) {
    dropzone.addEventListener("click", () => {
      if (fileInput) fileInput.click();
    });

    dropzone.addEventListener("dragover", (e) => {
      e.preventDefault();
      dropzone.classList.add("drag-hover");
    });

    dropzone.addEventListener("dragleave", () => {
      dropzone.classList.remove("drag-hover");
    });

    dropzone.addEventListener("drop", (e) => {
      e.preventDefault();
      dropzone.classList.remove("drag-hover");
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleUploadedFile(e.dataTransfer.files[0]);
      }
    });
  }

  // Layout View Toggles (Side-by-Side vs Swipe Curtain)
  if (btnDualView && btnSwipeView && dualContainer && swipeContainer) {
    btnDualView.addEventListener("click", () => {
      btnDualView.classList.add("active");
      btnSwipeView.classList.remove("active");
      dualContainer.style.display = "grid";
      swipeContainer.style.display = "none";
      playTechChime(480, 0.04);
    });

    btnSwipeView.addEventListener("click", () => {
      btnSwipeView.classList.add("active");
      btnDualView.classList.remove("active");
      dualContainer.style.display = "none";
      swipeContainer.style.display = "block";
      initLabSwipeDrag();
      playTechChime(480, 0.04);
    });
  }

  // Overlay Style Toggles
  if (btnMaskCyan && btnMaskThermal && svgFloodMain && svgFloodSec) {
    btnMaskCyan.addEventListener("click", () => {
      btnMaskCyan.classList.add("active");
      btnMaskThermal.classList.remove("active");
      svgFloodMain.setAttribute("fill", "rgba(6, 182, 212, 0.6)");
      svgFloodMain.setAttribute("stroke", "#06b6d4");
      svgFloodSec.setAttribute("fill", "rgba(6, 182, 212, 0.55)");
      svgFloodSec.setAttribute("stroke", "#06b6d4");
      playTechChime(500, 0.04);
    });

    btnMaskThermal.addEventListener("click", () => {
      btnMaskThermal.classList.add("active");
      btnMaskCyan.classList.remove("active");
      svgFloodMain.setAttribute("fill", "rgba(249, 115, 22, 0.65)");
      svgFloodMain.setAttribute("stroke", "#f97316");
      svgFloodSec.setAttribute("fill", "rgba(234, 179, 8, 0.6)");
      svgFloodSec.setAttribute("stroke", "#eab308");
      playTechChime(500, 0.04);
    });
  }

  // Scanning animation toggle
  if (btnToggleScanline && scanlineEl) {
    let scanActive = true;
    btnToggleScanline.addEventListener("click", () => {
      scanActive = !scanActive;
      scanlineEl.style.display = scanActive ? "block" : "none";
      btnToggleScanline.innerHTML = `<span id="scanlineStatusIcon">📡</span> Scan Animation: ${scanActive ? 'ON' : 'OFF'}`;
      btnToggleScanline.classList.toggle("active", scanActive);
      playTechChime(540, 0.04);
    });
  }

  // Audio synthesis toggle
  if (btnToggleAudio) {
    btnToggleAudio.addEventListener("click", () => {
      isAudioMuted = !isAudioMuted;
      btnToggleAudio.innerHTML = `<span id="audioStatusIcon">${isAudioMuted ? '🔇' : '🔊'}</span> Audio: ${isAudioMuted ? 'OFF' : 'ON'}`;
      btnToggleAudio.classList.toggle("active", !isAudioMuted);
      if (!isAudioMuted) playTechChime(620, 0.06);
    });
  }

  // Realistic Educational Processing Animation (5 Steps)
  if (btnRunAnalysis) {
    btnRunAnalysis.addEventListener("click", () => {
      if (isAnalyzing) return;
      isAnalyzing = true;

      btnRunAnalysis.disabled = true;
      if (animationBox) animationBox.style.display = "block";
      if (labStatusDot) labStatusDot.className = "status-dot processing";
      if (labStatusMessage) labStatusMessage.textContent = "Analyzing image through demonstration pipeline...";

      // Reset progress
      if (progressBar) progressBar.style.width = "0%";

      const steps = [
        { pct: 20, text: "Step 1: Preparing satellite image..." },
        { pct: 40, text: "Step 2: Checking image regions..." },
        { pct: 65, text: "Step 3: Identifying possible water patterns..." },
        { pct: 85, text: "Step 4: Generating visualization..." },
        { pct: 100, text: "Step 5: Preparing environmental interpretation..." }
      ];

      let currentStepIdx = 0;

      function runNextStep() {
        if (currentStepIdx < steps.length) {
          const s = steps[currentStepIdx];
          if (stepText) stepText.textContent = s.text;
          if (percentText) percentText.textContent = `${s.pct}%`;
          if (progressBar) progressBar.style.width = `${s.pct}%`;
          playTechChime(420 + currentStepIdx * 50, 0.06);

          currentStepIdx++;
          setTimeout(runNextStep, 450);
        } else {
          // Completed
          setTimeout(() => {
            isAnalyzing = false;
            btnRunAnalysis.disabled = false;
            if (animationBox) animationBox.style.display = "none";

            if (labStatusDot) labStatusDot.className = "status-dot ready";
            if (labStatusMessage) {
              labStatusMessage.textContent = "Prototype Flood Detection Result — Demonstration result for educational purposes.";
            }

            // Pulse reveal of detected mask
            if (svgInundationGroup) {
              svgInundationGroup.style.animation = "none";
              // Trigger reflow
              void svgInundationGroup.offsetWidth;
              svgInundationGroup.style.animation = "pulseMask 1.2s ease-out";
            }

            playTechChime(750, 0.12, "triangle");
          }, 400);
        }
      }

      runNextStep();
    });
  }

  // Reset button
  if (btnReset) {
    btnReset.addEventListener("click", () => {
      applyPreset(DEMO_PRESETS[0]);
      if (animationBox) animationBox.style.display = "none";
      playTechChime(400, 0.05);
    });
  }

  // Initial Render
  renderPresets();
  applyPreset(DEMO_PRESETS[0]);
}

/* ==========================================================================
   8. Swipe Curtain Dragging for Flood Analysis Lab
   ========================================================================== */
function initLabSwipeDrag() {
  const viewport = document.getElementById("labSwipeViewport");
  const fgLayer = document.getElementById("swipeFgLayer");
  const handleBar = document.getElementById("swipeHandleBar");

  if (!viewport || !fgLayer || !handleBar) return;

  let isDragging = false;

  function updateCurtain(clientX) {
    const rect = viewport.getBoundingClientRect();
    let x = clientX - rect.left;
    if (x < rect.width * 0.02) x = rect.width * 0.02;
    if (x > rect.width * 0.98) x = rect.width * 0.98;

    const pct = (x / rect.width) * 100;
    fgLayer.style.width = `${pct}%`;
    handleBar.style.left = `${pct}%`;
  }

  handleBar.onmousedown = (e) => {
    isDragging = true;
    e.preventDefault();
  };

  viewport.onmousedown = (e) => {
    isDragging = true;
    updateCurtain(e.clientX);
  };

  window.addEventListener("mousemove", (e) => {
    if (isDragging) updateCurtain(e.clientX);
  });

  window.addEventListener("mouseup", () => {
    isDragging = false;
  });

  // Touch support
  handleBar.ontouchstart = (e) => {
    isDragging = true;
    e.preventDefault();
  };

  viewport.ontouchstart = (e) => {
    if (e.touches.length > 0) {
      isDragging = true;
      updateCurtain(e.touches[0].clientX);
    }
  };

  window.addEventListener("touchmove", (e) => {
    if (isDragging && e.touches.length > 0) {
      updateCurtain(e.touches[0].clientX);
    }
  });

  window.addEventListener("touchend", () => {
    isDragging = false;
  });

  // Default: 50%
  fgLayer.style.width = "50%";
  handleBar.style.left = "50%";
}

/* ==========================================================================
   9. Assessment Brief Modal
   ========================================================================== */
function initAssessmentModal() {
  const modal = document.getElementById("assessmentModal");
  const openBtn = document.getElementById("btnOpenReportModal");
  const closeBtn = document.getElementById("closeModalBtn");
  const dismissBtn = document.getElementById("dismissModalBtn");
  const printBtn = document.getElementById("printReportBtn");

  if (!modal || !openBtn) return;

  function openModal() {
    modal.classList.add("open");
    playTechChime(560, 0.06);

    // Sync current values
    const regionDisplay = document.getElementById("interpRegion");
    const threatDisplay = document.getElementById("interpThreat");

    const modalRegion = document.getElementById("modalRegionName");
    const modalThreat = document.getElementById("modalEcoThreat");

    if (modalRegion && regionDisplay) modalRegion.textContent = regionDisplay.textContent;
    if (modalThreat && threatDisplay) modalThreat.textContent = threatDisplay.textContent;
  }

  function closeModal() {
    modal.classList.remove("open");
    playTechChime(420, 0.05);
  }

  openBtn.addEventListener("click", openModal);
  if (closeBtn) closeBtn.addEventListener("click", closeModal);
  if (dismissBtn) dismissBtn.addEventListener("click", closeModal);

  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("open")) {
      closeModal();
    }
  });

  if (printBtn) {
    printBtn.addEventListener("click", () => {
      window.print();
    });
  }
}

/* ==========================================================================
   10. Scroll Animations (Fade-in on scroll)
   ========================================================================== */
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll(".glass-card, .section-header, .state-overview-card, .expandable-impact-card");

  if (!("IntersectionObserver" in window)) {
    animatedElements.forEach(el => el.classList.add("visible"));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: "0px 0px -40px 0px"
  });

  animatedElements.forEach((el) => {
    el.classList.add("fade-on-scroll");
    observer.observe(el);
  });
}

/* ==========================================================================
   11. Back to Top Button
   ========================================================================== */
function initBackToTop() {
  const btn = document.getElementById("backToTopBtn");
  if (!btn) return;

  window.addEventListener("scroll", () => {
    if (window.scrollY > 350) {
      btn.classList.add("visible");
    } else {
      btn.classList.remove("visible");
    }
  }, { passive: true });

  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    playTechChime(680, 0.08);
  });
}

/* ==========================================================================
   12. Demo Environmental Monitoring Dashboard
   All values come from DEMO_FLOOD_ASSESSMENT / DEMO_WATER_TREND (simulated).
   Charts are hand-drawn SVG so no extra chart library is needed.
   ========================================================================== */
const SVG_NS = "http://www.w3.org/2000/svg";
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function svgEl(tag, attrs = {}, text) {
  const el = document.createElementNS(SVG_NS, tag);
  Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
  if (text !== undefined) el.textContent = text;
  return el;
}

function initDashboard() {
  if (!document.getElementById("dashboard")) return;
  initCounters();
  renderAreaByStateChart();
  renderWaterTrendChart();
  renderRiskDistributionChart();
}

// Shared tooltip for all dashboard charts
function getChartTooltip() {
  let tip = document.getElementById("chartTooltip");
  if (!tip) {
    tip = document.createElement("div");
    tip.id = "chartTooltip";
    tip.className = "chart-tooltip";
    tip.setAttribute("role", "status");
    document.body.appendChild(tip);
  }
  return tip;
}

function attachTooltip(target, html) {
  const tip = getChartTooltip();
  const show = (e) => {
    tip.innerHTML = html;
    tip.classList.add("visible");
    move(e);
  };
  const move = (e) => {
    const x = e.clientX ?? target.getBoundingClientRect().left;
    const y = e.clientY ?? target.getBoundingClientRect().top;
    tip.style.left = `${x}px`;
    tip.style.top = `${y - 14}px`;
  };
  const hide = () => tip.classList.remove("visible");
  target.addEventListener("pointerenter", show);
  target.addEventListener("pointermove", move);
  target.addEventListener("pointerleave", hide);
  target.addEventListener("focus", (e) => {
    const r = target.getBoundingClientRect();
    show({ clientX: r.left + r.width / 2, clientY: r.top });
  });
  target.addEventListener("blur", hide);
}

// Animated KPI counters (run once when the dashboard scrolls into view)
function initCounters() {
  const counters = document.querySelectorAll("[data-count]");
  if (!counters.length) return;

  const format = (value, type) => {
    if (type === "dec1") return value.toFixed(1);
    return Math.round(value).toLocaleString("en-IN");
  };

  const run = (el) => {
    const target = parseFloat(el.dataset.count);
    const type = el.dataset.format;
    if (prefersReducedMotion) {
      el.textContent = format(target, type);
      return;
    }
    const duration = 1400;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = format(target * eased, type);
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  if (!("IntersectionObserver" in window)) {
    counters.forEach(run);
    return;
  }

  // Show 0 until visible so the count-up is noticeable
  if (!prefersReducedMotion) counters.forEach((el) => (el.textContent = format(0, el.dataset.format)));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        run(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  counters.forEach((el) => observer.observe(el));
}

// Chart 1: horizontal bars — affected area per state, coloured by risk tier
function renderAreaByStateChart() {
  const host = document.getElementById("chartAreaByState");
  if (!host) return;

  const rows = Object.keys(DEMO_FLOOD_ASSESSMENT)
    .map((key) => ({ key, name: NE_STATES_DATA[key].name, ...DEMO_FLOOD_ASSESSMENT[key] }))
    .sort((a, b) => b.areaKm2 - a.areaKm2);

  const W = 720, rowH = 34, padL = 148, padR = 76, padT = 8;
  const H = padT + rows.length * rowH + 22;
  const max = Math.ceil(rows[0].areaKm2 / 1000) * 1000;
  const x = (v) => padL + (v / max) * (W - padL - padR);

  const svg = svgEl("svg", { viewBox: `0 0 ${W} ${H}`, class: "chart-svg" });

  // Gridlines + axis labels
  for (let v = 0; v <= max; v += 1000) {
    svg.appendChild(svgEl("line", { x1: x(v), x2: x(v), y1: padT, y2: H - 22, class: "chart-grid" }));
    svg.appendChild(svgEl("text", { x: x(v), y: H - 6, class: "chart-axis", "text-anchor": "middle" }, v.toLocaleString("en-IN")));
  }

  rows.forEach((row, i) => {
    const y = padT + i * rowH;
    const tier = RISK_TIERS[row.tier];
    svg.appendChild(svgEl("text", { x: padL - 12, y: y + rowH / 2 + 4, class: "chart-label", "text-anchor": "end" }, row.name));

    const bar = svgEl("rect", {
      x: padL,
      y: y + 8,
      width: Math.max(x(row.areaKm2) - padL, 2),
      height: rowH - 16,
      rx: 3,
      fill: tier.color,
      class: "chart-bar",
      tabindex: "0",
      style: `--d:${i * 70}ms`
    });
    svg.appendChild(bar);
    attachTooltip(bar, `<strong>${row.name}</strong><br>${formatKm2(row.areaKm2)} · ${tier.label} risk<br><em>Demo data</em>`);

    svg.appendChild(svgEl("text", { x: x(row.areaKm2) + 8, y: y + rowH / 2 + 4, class: "chart-value" }, row.areaKm2.toLocaleString("en-IN")));
  });

  host.appendChild(svg);
  host.appendChild(buildRiskLegend());
}

// Chart 2: line/area — monthly water coverage vs permanent water baseline
function renderWaterTrendChart() {
  const host = document.getElementById("chartWaterTrend");
  if (!host) return;

  const W = 420, H = 230, padL = 36, padR = 16, padT = 16, padB = 28;
  const max = 12;
  const step = (W - padL - padR) / (DEMO_WATER_TREND.length - 1);
  const x = (i) => padL + i * step;
  const y = (v) => padT + (1 - v / max) * (H - padT - padB);

  const svg = svgEl("svg", { viewBox: `0 0 ${W} ${H}`, class: "chart-svg" });
  const defs = svgEl("defs");
  const grad = svgEl("linearGradient", { id: "waterTrendFill", x1: "0", y1: "0", x2: "0", y2: "1" });
  grad.appendChild(svgEl("stop", { offset: "0%", "stop-color": "#22d3ee", "stop-opacity": "0.35" }));
  grad.appendChild(svgEl("stop", { offset: "100%", "stop-color": "#22d3ee", "stop-opacity": "0" }));
  defs.appendChild(grad);
  svg.appendChild(defs);

  for (let v = 0; v <= max; v += 3) {
    svg.appendChild(svgEl("line", { x1: padL, x2: W - padR, y1: y(v), y2: y(v), class: "chart-grid" }));
    svg.appendChild(svgEl("text", { x: padL - 8, y: y(v) + 4, class: "chart-axis", "text-anchor": "end" }, `${v}%`));
  }

  // Permanent water baseline
  svg.appendChild(svgEl("line", { x1: padL, x2: W - padR, y1: y(DEMO_PERMANENT_WATER), y2: y(DEMO_PERMANENT_WATER), class: "chart-baseline" }));
  svg.appendChild(svgEl("text", { x: W - padR, y: y(DEMO_PERMANENT_WATER) - 6, class: "chart-axis", "text-anchor": "end" }, "Permanent water"));

  const pts = DEMO_WATER_TREND.map((d, i) => [x(i), y(d.value)]);
  const line = pts.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");
  svg.appendChild(svgEl("path", { d: `${line} L${x(pts.length - 1)},${y(0)} L${x(0)},${y(0)} Z`, fill: "url(#waterTrendFill)" }));
  svg.appendChild(svgEl("path", { d: line, class: "chart-line" }));

  DEMO_WATER_TREND.forEach((d, i) => {
    svg.appendChild(svgEl("text", { x: x(i), y: H - 8, class: "chart-axis", "text-anchor": "middle" }, d.month));
    const isPeak = d.value === Math.max(...DEMO_WATER_TREND.map((t) => t.value));
    const dot = svgEl("circle", { cx: x(i), cy: y(d.value), r: isPeak ? 5 : 3.5, class: isPeak ? "chart-dot peak" : "chart-dot", tabindex: "0" });
    svg.appendChild(dot);
    attachTooltip(dot, `<strong>${d.month}</strong><br>${d.value.toFixed(1)}% water coverage<br><em>Demo data</em>`);
    if (isPeak) {
      svg.appendChild(svgEl("text", { x: x(i), y: y(d.value) - 12, class: "chart-value", "text-anchor": "middle" }, `${d.value}% peak`));
    }
  });

  host.appendChild(svg);
}

// Chart 3: segmented bar + list — number of states per risk tier
function renderRiskDistributionChart() {
  const host = document.getElementById("chartRiskDist");
  if (!host) return;

  const order = ["very-high", "high", "moderate", "low"];
  const groups = order.map((tier) => ({
    tier,
    states: Object.keys(DEMO_FLOOD_ASSESSMENT)
      .filter((k) => DEMO_FLOOD_ASSESSMENT[k].tier === tier)
      .map((k) => NE_STATES_DATA[k].name)
  }));
  const total = groups.reduce((sum, g) => sum + g.states.length, 0);

  const bar = document.createElement("div");
  bar.className = "risk-stack";
  groups.forEach((g) => {
    if (!g.states.length) return;
    const seg = document.createElement("span");
    seg.className = "risk-seg";
    seg.tabIndex = 0;
    seg.style.flexGrow = g.states.length;
    seg.style.background = RISK_TIERS[g.tier].color;
    seg.textContent = g.states.length;
    attachTooltip(seg, `<strong>${RISK_TIERS[g.tier].label}</strong><br>${g.states.join(", ")}<br><em>Demo data</em>`);
    bar.appendChild(seg);
  });

  const list = document.createElement("ul");
  list.className = "risk-list";
  list.innerHTML = groups.map((g) => `
    <li>
      <span class="risk-list-name"><i class="rl" style="background:${RISK_TIERS[g.tier].color}"></i>${RISK_TIERS[g.tier].label}</span>
      <span class="risk-list-states">${g.states.join(", ") || "—"}</span>
      <strong>${g.states.length}<small>/${total}</small></strong>
    </li>
  `).join("");

  host.appendChild(bar);
  host.appendChild(list);
}

function buildRiskLegend() {
  const legend = document.createElement("div");
  legend.className = "risk-legend-inline chart-legend";
  legend.innerHTML = Object.values(RISK_TIERS)
    .map((t) => `<span><i class="rl" style="background:${t.color}"></i>${t.label}</span>`)
    .join("");
  return legend;
}
