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

A white academic layout with persistent top navigation for all six sections, a profile aligned with About and Recent News, and full-width sections below the introduction. Mobile navigation wraps into two rows so every section remains visible. Anchor offsets track the header height. The introductory paragraph has a larger type size, section headings use fine gradient rules, and experience cards share consistent padding and borders. Education and skills use aligned rows. Blue, violet, and rose accents remain in the name, ambient light, portrait rim, and card edges. Contact buttons share one compact row, including an accessible copy-email icon; on mobile they sit below the profile. The portrait gently tilts and entry highlights follow fine-pointer movement; navigation uses a sliding active indicator. Motion includes gentle section entrances, portrait lift and scroll progress. Implementation details and animations are displayed inline. Reduced-motion preferences are respected, and explanations remain readable without JavaScript.

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

Each project has an always-visible animation. DynaFace has four scenes. MiniMind shows a persistent training map with eight narrated steps, using an illustrative dinner-planning conversation with ingredient, dietary, timing and equipment constraints. The map covers curation, tokenization, broad-text pretraining, SFT, optional LoRA, alternative DPO/GRPO branches, held-out evaluation, and export. Its nodes are half their previous width and height, with unchanged font sizes and rerouted connections. The authored replies, preference pairs and rubric illustrate training concepts; they are not dataset records, checkpoint outputs or measured training results. The earlier arithmetic and RMSNorm examples are no longer displayed.

ChatMind uses a single ten-step animation: Think, Act, Observe, Retry, Answer, Check, Context, Recover, Delegate, Replay. Task execution flows directly into proposed harness iteration on one shared architecture. The 12 modules each display one short label; MiniMind nodes also use only one short label. Separate mode controls, the Return stage and the public engineering-reference section are removed. Evaluation and verification share one module; context selection reuses Tools and Memory. Streaming is represented by the shared API/interface path.

The initial task illustrates a refined search for a room-booking policy. Excerpts are not complete tool responses; the tiny fixture may retrieve all sections in the first call. This is a scripted explanation, not a backend replay. Harness steps remain explicitly proposed: answer checks, context selection, checkpointed recovery, optional workers, and regression replay. Dashed paths and the Recovery/Workers modules mark proposed additions; their highlight color follows the current step. Existing retrieval evaluation does not imply implemented answer verification, and chat persistence does not imply execution checkpoints.

The data-driven walkthrough controller supports manual steps, pause, replay after completion, offscreen/hidden-tab pausing, and reduced-motion preferences. A complete pass stops at the final step. Without JavaScript, maps and every explanation remain readable.

These illustrations are schematic. The owner-provided English resume remains the source for personal information and dates; the detailed Chinese reference is not published.

When updating the source resume, check the homepage biography, dates, experience, projects, skills, metadata, and contact links against the new file. Display only the Gmail contact on the homepage; do not re-add the phone number or school email. Git commits use a generic maintainer identity.

The homepage portrait uses a JPEG display copy of the owner-provided photo with EXIF and GPS metadata removed. The original HEIC is available at `dist/assets/IMG_2675.HEIC`, unchanged including its embedded metadata, as explicitly authorized by the owner.

## Visitor map

The full-width map aligned with Skills uses the owner's MapMyVisitors widget, with a white background and pale blue land. Public statistics: https://mapmyvisitors.com/web/1c871 . The asynchronous script is the primary embed; the image alternative runs only when JavaScript is disabled, avoiding two counters on the same visit. The stats link remains available if the widget is blocked.

MapMyVisitors processes visitor connections and supplies all map locations and counts. IP-based locations are approximate, and visit counts are not a verified count of individual people. Collection starts with installation; earlier homepage traffic is not recovered. Account credentials and visitor records are not stored in this repository. Full-IP availability and account-only visibility have not been verified in the owner's authenticated dashboard.

## University marks

Education icons use unmodified university assets:

- JHU current shield: https://brand.jhu.edu/visual-identity/legacy-marks/ (current shield image, not the retired mark). Asset: https://brand.jhu.edu/wp-content/uploads/2024/07/legacy-correct-shield-1024x683.jpg
- UMN Block M: https://twin-cities.umn.edu/ . Asset: https://twin-cities.umn.edu/sites/twin-cities.umn.edu/files/block-m__gold-bg.png

The marks identify the listed schools and remain the property of their respective universities.

All visitor-facing content, including animation examples, must remain in English.

The Minnesota education entry shows the school and degree only; omit its attendance dates from the homepage.

DynaFace keeps its introductory use case. MiniMind and ChatMind omit the separate example cards and run/setup instructions; their examples appear within the animations.

## Repository-based examples (2026-09-16)

- MiniMind links to `llm-from-scratch` at `f7f344204c90483357f4aed7687f0c8063323eeb`. Its public code is a component reimplementation; it contains no trained checkpoint. Generation references a missing `new` package, and the RoPE chapter has an incomplete interface. Do not present authored chatbot answers as outputs from that checkout.
- `dist/examples/rmsnorm_demo.py` invokes the unmodified RMSNorm class via `runpy`, verifies two input vectors against numerical expectations, and prints the result. Executed successfully on CPU with Python 3.12 and PyTorch 2.14.0.
- ChatMind reviewed at `2e144959e33b8978c71a77c2cd82ac4317acd8a5`: checked Markdown parsing and upload/indexing, knowledge-base attachment, the fixed KnowledgeTool, retrieval and reranking, model registration, and SSE message definitions.
- `dist/examples/room-guide.md` is a fictional input fixture. `dist/examples/chatmind-walkthrough.md` explains configuration and expected results for an existing working installation. The full backend/LLM flow was not executed. No credentials or real room bookings are involved.
- ChatMind currently embeds section titles and retrieves up to five candidates before reranking to up to three. Upload success does not prove indexing succeeded; indexing exceptions are logged. The repository lacks the base-schema bootstrap, so V3/V4 alone are insufficient for a fresh database.
- Public repository contents substantiate the examples; the owner-provided resume remains the source for biography, experience dates, and the training experience description.

## Research basis for harness illustrations (reviewed 2026.09)

The primary sources below document the proposed concepts; the public reference section was removed at the owner’s request. These are selected engineering patterns, not an assertion that one agent is state of the art on every benchmark. No backend project changes or model training were performed in this update.

- Harness design (2026.03.24): https://www.anthropic.com/engineering/harness-design-long-running-apps — independent evaluation and iterative harness changes.
- Agent evaluation (2026.01.09): https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents — trajectories, outcome checks and regression suites.
- Managed-agent architecture (2026.04.08): https://www.anthropic.com/engineering/managed-agents — separate sessions, harnesses and execution environments.
- Persistence: https://docs.langchain.com/oss/python/langgraph/persistence — checkpoints and recovery.
- Advanced tools (2025.11.24): https://www.anthropic.com/engineering/advanced-tool-use — on-demand tool discovery.
- Specialist delegation (2025.06.13): https://www.anthropic.com/engineering/multi-agent-research-system — use independent workers only when task structure warrants them.

The ChatMind diagram now integrates existing and proposed components in one compact map. Nodes have centered labels, with explanations shown only for the current animation step. The MiniMind nodes retain their half-size geometry. Both project overview cards and standalone run/setup sections remain removed.

## Spring accents and music (2026-09-20)

The white portfolio layout now includes original SVG pixel artwork inspired by Stardew Valley: a portrait chicken, a small spring garden with a Junimo, blossoms, heading sprouts and decorative edge petals. Decorations are hidden from assistive technology and print. Motion respects reduced-motion preferences.

Spring music uses the supported SoundCloud Widget API for the ConcernedApe-account track “Spring (The Valley Comes Alive)” (track 232021152). The page sets volume to 12% before requesting playback. Browser autoplay restrictions still apply: after a blocked attempt, a page click/tap or Enter/Space retries. The main music button pauses/resumes directly; manual pause is remembered in localStorage and is never undone by browsing. The optional details panel has a 0–30% volume slider and the original player. Closing details leaves background playback alone. The track repeats after completion. Third-party failures show an unavailable state with the source link in details. Audio is neither copied nor self-hosted.

Track source: https://soundcloud.com/concernedape/spring-the-valley-comes-alive (public and embeddable, duration about 4:23). API documentation: https://developers.soundcloud.com/docs/api/html5-widget . This replaces the former Bandcamp embed, which did not offer the parent-page playback and volume controls required for this design.

Each major section uses a different original pixel motif: Junimo (About), mailbox (Recent News), pickaxe (Experience), chest (Projects), book (Education), crystal (Skills), and compass (visitor map). A fixed, non-interactive frame adds flowering vines, a small wooden fence, a star and a Junimo at the page edges. Mobile uses narrower edge decoration to keep reading space clear; print omits the frame.

## File System animation (2026-09-24)

Reviewed local ChatMind commit `2e14495`: `FileSystemTools.java` implements listing, reading, writing/creating, appending, deleting files and creating directories. Its Spring component annotation is commented out, so the diagram marks it as disabled with dotted routes and a text label. Four illustrative steps (Find, Read, Write, Review) use fictional booking rule and test files. Finding uses directory listings; no grep/search tool or test runner is claimed. Review reads changes back; executing tests would need a separate tool. No ChatMind backend code or tool enablement was changed.

## Numbered project scenes and profile music (2026-09-24)

The music play/pause and volume controls sit immediately after GitHub and LinkedIn in the profile. The optional player opens below that row, above page decorations; playback behavior and the quiet volume setting remain unchanged.

DynaFace illustrates a fictional at-home follow-up: a 12-second smile clip, upload and queued job DF-014, frame analysis, then clinician review of the annotated video and five-area report. Screens, filenames and timing are illustrative, not captured product UI or patient data. No clinical values or diagnoses are shown. Recording prompts, moving upload packets, a frame scan and a review scrubber provide distinct motion for the four stages. Manual step selection pauses playback so readers can inspect the scene.

All 26 steps (DynaFace 4, MiniMind 8, ChatMind 14) have numbered controls and matching individually colored explanation frames. Architecture frames, highlighted nodes, labels, routes and arrowheads follow the selected step palette. Disabled file access is dotted; proposed modules are dashed and identified by text. Maps, implementation details, and animation areas remain inline.

All step palettes are unique within each project. Diagram node fill, borders, labels, active connections and context-stroke arrowheads now inherit the same active palette as the step controls and captions. DynaFace schematic UI accents also use that palette; natural skin and hair colors stay constant. Static gray components indicate inactive nodes. Disabled/proposed status uses line patterns and explicit labels instead of fixed blue/amber colors.
