# FLOOD-AI NE
## AI-Based Detection of Flood-Affected Areas in North-East India Using Satellite Images

**An Environmental Studies (EVS) Academic Project Website**  
**Created By:** **Vivaan Saxena**, **Gagan Deep Kaur**, and **Abdul Muhmin**  
*1st Year B.Tech Computer Science & Engineering • Built with HTML5, CSS3, and Modern Vanilla JavaScript*

---

## 📌 Project Overview
**FLOOD-AI NE** is an educational web application demonstrating how spaceborne remote sensing satellite imagery paired with computer-vision image processing workflows can assist in detecting, assessing, and visualizing seasonal flood-affected areas across the eight states of North-East India (**Assam, Arunachal Pradesh, Meghalaya, Manipur, Mizoram, Nagaland, Tripura, and Sikkim**).

### 🎯 Core Focus: Environmental Studies (EVS)
While the website demonstrates satellite remote sensing and image analysis principles, the **central focus remains ecological and humanitarian conservation**:
- **Agriculture:** Understanding monsoon Sali paddy submergence and topsoil sand-casting (coarse river silt deposition).
- **Forests & Riverbanks:** Riparian forest loss and accelerated riverbank slicing along the Brahmaputra braided system.
- **Wildlife Corridors:** Protecting wildlife migration corridors during Kaziranga National Park grassland submergence (One-Horned Rhinoceros migration across NH-715 toward Karbi Anglong highlands).
- **Water Quality:** Mitigating tube-well contamination and waterborne disease outbreaks in marooned riverine sandbar settlements (*chars*).
- **Ecosystem Equilibrium:** Differentiating natural wetland (*beel*) replenishment from catastrophic silt choking and invasive weed spread.

---

## 🧭 Site Structure (14 Comprehensive Sections)

1. **Section 1: Navbar** — Sticky navigation with reading progress bar, theme switcher (Dark / Light mode), smooth scroll links, and mobile menu.
2. **Section 2: Hero Section** — Satellite aesthetic hero visual with Brahmaputra braided river flows, orbital path telemetry, satellite scanline, coordinate badges (`26.20° N, 92.94° E`), and fact-based descriptive environmental cards (no invented metrics).
3. **Section 3: Homepage Feature Cards** — Three cards introducing *Satellite Imagery*, *Flood Detection*, and *Environmental Impact*.
4. **Section 4: Project Overview ("Why This Project Matters")** — Plain-language EVS explanation paired with an interactive 4-stage visual flow (`Satellite Image → Analysis → Flood Visualization → Environmental Understanding`).
5. **Section 5: Flood Analysis Lab (Main Feature)** — Interactive demonstration lab with all 8 North-Eastern states, preset demonstration satellite scenes, drag-and-drop image upload dropzone, realistic 5-step progress animation (`Preparing image → Checking regions → Identifying water patterns → Generating visualization → Environmental interpretation`), dual-panel side-by-side view, swipe curtain wipe, and qualitative EVS interpretation cards.
6. **Section 6: Before / After Flooding** — Draggable comparison slider comparing pre-monsoon normal river channels with peak flood inundation across touch and desktop.
7. **Section 7: Interactive North-East India Map** — Interactive Leaflet map featuring ESRI World Satellite, Carto Topographic, and Dark Radar basemaps, river networks, pulsing ecological hotspots, 8 state boundaries, clean legend, and dynamic state information panel.
8. **Section 8: Understanding North-East India** — Interactive state profile cards for all 8 states with environmental vulnerabilities, highlighting Assam as the primary case study.
9. **Section 9: Environmental Impact (Core EVS)** — 6 expandable accordion cards: *Agriculture*, *Forests*, *Water Bodies*, *Wildlife & Ecosystems*, *Human Settlements*, and *Infrastructure*.
10. **Section 10: Optical vs SAR Satellite Imagery** — Side-by-side educational comparison of optical reflected sunlight vs Synthetic Aperture Radar (SAR) all-weather cloud-penetrating microwaves.
11. **Section 11: How Flood Detection Works** — 6-step interactive processing timeline from raw orbital pixels to environmental interpretation.
12. **Section 12: How Can AI Help Detect Floods?** — Beginner-friendly AI explanation, semantic segmentation concepts, real-world deployment requirements, and clear distinction between *Proposed Workflow* and *Actual Prototype Functionality*.
13. **Section 13: Limitations** — Scientifically responsible evaluation of cloud cover on optical sensors, SAR terrain distortions, spatial resolution limits, satellite revisit intervals, and the necessity of ground-truth validation.
14. **Section 14: References, Viva Guide & Footer** — Clickable credible references (ISRO Bhuvan, NRSC, ESA Copernicus, NDMA, CWC, ASDMA), 4-question student viva cheat-sheet, creator attributions, and academic disclaimer.

---

## 🚀 How to Run & Test the Website

### Option 1: Direct Browser Launch (Zero Setup Required)
Simply double-click `index.html` or drag and drop it into any modern web browser (Google Chrome, Microsoft Edge, Mozilla Firefox, or Safari).

### Option 2: Local Python Web Server
Open a terminal in the project directory and run:
```powershell
python -m http.server 8000
```
Then visit `http://localhost:8000` in your web browser.

### Option 3: GitHub Pages Deployment
The codebase consists purely of semantic HTML5, CSS3, and modern Vanilla JavaScript with zero server-side dependencies. It is ready for direct 1-click deployment on GitHub Pages.

---

## 🏆 Recommended 2-Minute Viva Presentation Flow

When presenting this project to your college EVS professor:

1. **Step 1: Open Homepage (15 seconds)**
   - Introduce **FLOOD-AI NE**.
   - Explain the environmental problem: North-East India receives over 2,500 mm of annual monsoon rainfall through a narrow valley, making floods an annual ecological crisis.
2. **Step 2: Flood Analysis Lab**
   - Click **Explore Flood Analysis** and select **Assam**.
   - Choose a demonstration satellite scene or show the upload dropzone.
   - Click **Analyze Image** and explain the 5-step educational processing animation.
3. **Step 3: Reveal Prototype Result**
   - Point out that this is an **educational prototype demonstration**, showing how water backscatter creates distinct surface contrast against dry land.
4. **Step 4: Before vs After Slider**
   - Drag the slider left and right to demonstrate the dramatic physical expansion of monsoon floodwaters compared to the dry-season baseline.
5. **Step 5: Interactive Map**
   - Zoom into North-East India on the Leaflet map. Click **Assam** or another state to display the dynamic EVS panel showing river systems, terrain, and environmental concerns.
6. **Step 6: Environmental Impact**
   - Click on the **Agriculture** and **Wildlife** cards to expand and explain sand-casting and the Kaziranga rhino migration across NH-715.
7. **Step 7: How Flood Detection Works & Optical vs SAR**
   - Explain why Radar (SAR) is crucial: it penetrates monsoon clouds that blind optical cameras.
   - Walk through the 6 pipeline stages and conclude with the limitations and ground-truth validation requirements.

---

## 🎓 Viva Cheat-Sheet (4 Core Questions & Answers)

1. **Why is this an EVS project, not just a CSE project?**  
   *Because the central objective is understanding and protecting fragile ecosystems—evaluating cropland loss, wildlife migration disturbances at Kaziranga, topsoil erosion, and potable water contamination. AI and remote sensing are simply observational tools.*

2. **Why use Radar (SAR) instead of regular photos?**  
   *North-East India floods during peak monsoon downpours when heavy cloud cover blocks optical cameras. Synthetic Aperture Radar (SAR) transmits microwave pulses that penetrate clouds, haze, and rain day and night.*

3. **How does AI identify floodwater in radar images?**  
   *Smooth standing water acts like a specular reflector (mirror), bouncing radar energy away from the satellite antenna and appearing dark. Machine learning models classify these dark low-backscatter clusters and subtract baseline pre-monsoon river channels.*

4. **Why is this project presented as a prototype?**  
   *To maintain scientific honesty. A genuine emergency dispatch platform requires live satellite downlinks, extensive ground-truth river gauges from CWC, and institutional authorization. Our project demonstrates the workflow and environmental science principles for academic evaluation.*

---

## 👥 Authors
Developed by 1st Year B.Tech Computer Science & Engineering students for the Environmental Studies (EVS) Project:
- **Vivaan Saxena** — Lead Developer & Geospatial Systems
- **Gagan Deep Kaur** — EVS Research & Remote Sensing Lead
- **Abdul Muhmin** — UI/UX Design & Data Preprocessing Lead
