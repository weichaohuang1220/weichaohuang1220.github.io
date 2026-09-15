# Weichao Huang — personal website

A responsive, static personal website for a computer science master's student at Johns Hopkins University.

Live site: https://weichaohuang1220.github.io/

Repository: https://github.com/weichaohuang1220/weichaohuang1220.github.io

## Edit

- `dist/index.html`: biography, selected projects, education, skills, and contact details.
- `dist/styles.css`: typography, layout, and responsive styles.
- `dist/script.js`: copy-email interaction and copyright year.

All content is based on the supplied résumé and the stated interests in AI agents, AI infrastructure, and LLM inference. Research interests are presented as interests rather than completed research or publications. No clinical data or patient media is included.

## Local preview

```sh
cd dist
python3 -m http.server 4173 --bind 127.0.0.1
```

Visit `http://127.0.0.1:4173`.

## GitHub Pages

Use a repository named `<username>.github.io` under the matching GitHub account. In **Settings → Pages → Build and deployment**, select **GitHub Actions**. The included workflow deploys `dist/` when changes are pushed to `main`.

No package installation or build step is required. Typography uses local system fonts. The copy-email button uses the Clipboard API over HTTPS or localhost and displays a manual-copy instruction when clipboard access is unavailable.

## Design and motion

A white academic layout with persistent top navigation for all six sections, a profile aligned with About and Recent News, and full-width sections below the introduction. Mobile navigation wraps into two rows so every section remains visible. Anchor offsets track the header height. The introductory paragraph has a larger type size, section headings use fine gradient rules, and experience cards share consistent padding and borders. Education and skills use aligned rows. Blue, violet, and rose accents remain in the name, ambient light, portrait rim, and card edges. Contact buttons share one compact row, including an accessible copy-email icon; on mobile they sit below the profile. The portrait gently tilts and entry highlights follow fine-pointer movement; navigation uses a sliding active indicator. Motion includes gentle section entrances, portrait lift, scroll progress, and interruptible expand/collapse transitions. Reduced-motion preferences are respected, and native details remain usable without JavaScript.

References: https://sethzhangjs.github.io/ for compact academic structure and expandable details; https://llong-cs.github.io/ for clear section navigation and experience records; https://www.jenniferhu.org/ for restrained typography and news hierarchy. Personal content and implementation are original.

## Recent News

Edit the JSON array in `#news-data` in `dist/index.html`. Each verified update has a `date` in YYYY-MM-DD format and a `text` string. Entries appear newest first, with dates displayed as YYYY.MM. The list scrolls once it exceeds its height limit and supports keyboard scrolling when needed. Keep the array empty until there is real news.

## Working locally

Make future changes in `/Users/pioneerrr/weichaohuang1220.github.io`, check the local files, then commit and push to `main`. GitHub Actions publishes `dist/`. Use the repository-local generic maintainer identity for commits.

## Content notes

- DynaFace is described as software engineering experience. The 1,000–2,000 patient figure is a design capacity target, not a measured adoption count.
- Project repositories are not linked because no verified public source URLs were supplied.

## Content source

The website uses the owner-provided `WH-resume.pdf` as its factual source. The resume is not published or offered for download. The homepage displays only the Gmail contact; its phone number and school email are omitted.

The current projects are MiniMind (2026.03–2026.06) and ChatMind (2025.12–2026.02). DynaFace includes account security and patient data-visibility controls. Parallel Programming remains coursework in the PDF and is not presented as a research direction on the homepage.

Each project has a native “View animation” disclosure that expands inline. DynaFace has four independent scenes (capture, upload, inference, results); MiniMind has five (pre-training, SFT, LoRA, DPO, GRPO); ChatMind has five (Think, Execute, pgvector retrieval, model switching, SSE streaming). Each step uses its own illustration and motion. Step buttons allow direct selection, with automatic playback and a pause control. Playback stops when closed, offscreen, or in a hidden tab. Reduced-motion preferences disable animation and automatic playback while retaining manual step selection.

Each scene includes a concrete illustrative example: a synthetic video job for DynaFace, an English arithmetic training example for MiniMind, and a fictional meeting-room guide lookup for ChatMind. Automatic steps allow 8.5 seconds for reading. These are authored examples, not recorded runs or verified model outputs.

These workflow illustrations are schematic, not actual app screenshots, patient images, training measurements, or generated task results. MiniMind and ChatMind use the owner-provided detailed Chinese resume only as an animation reference. That reference is not published; website dates continue to follow `WH-resume.pdf`.

When updating the source resume, check the homepage biography, dates, experience, projects, skills, metadata, and contact links against the new file. Display only the Gmail contact on the homepage; do not re-add the phone number or school email. Git commits use a generic maintainer identity.

The homepage portrait uses a JPEG display copy of the owner-provided photo with EXIF and GPS metadata removed. The original HEIC is available at `dist/assets/IMG_2675.HEIC`, unchanged including its embedded metadata, as explicitly authorized by the owner.

## Visitor map

The compact map below Skills uses the owner's MapMyVisitors widget, with a white background and pale blue land. Public statistics: https://mapmyvisitors.com/web/1c871 . The asynchronous script is the primary embed; the image alternative runs only when JavaScript is disabled, avoiding two counters on the same visit. The stats link remains available if the widget is blocked.

MapMyVisitors processes visitor connections and supplies all map locations and counts. IP-based locations are approximate, and visit counts are not a verified count of individual people. Collection starts with installation; earlier homepage traffic is not recovered. Account credentials and visitor records are not stored in this repository. Full-IP availability and account-only visibility have not been verified in the owner's authenticated dashboard.

## University marks

Education icons use unmodified university assets:

- JHU current shield: https://brand.jhu.edu/visual-identity/legacy-marks/ (current shield image, not the retired mark). Asset: https://brand.jhu.edu/wp-content/uploads/2024/07/legacy-correct-shield-1024x683.jpg
- UMN Block M: https://twin-cities.umn.edu/ . Asset: https://twin-cities.umn.edu/sites/twin-cities.umn.edu/files/block-m__gold-bg.png

The marks identify the listed schools and remain the property of their respective universities.

All visitor-facing content, including animation examples, must remain in English.
