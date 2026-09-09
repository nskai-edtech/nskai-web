# Foundation photographs

The Foundation page shows one photograph per programme. The design leaves these
as drop slots — "Drop your own photograph here" — so none were supplied with the
handoff.

Udara's slot reuses `/udara/participants.webp`, which is the cohort session the
caption describes. The RAG bootcamp slot now reuses `/bootcamp/poster.webp` —
square, so the 4:3 cover crop only loses the top and bottom edges. Before that
it had no `src` at all and rendered as an empty panel.

To fill it, add the file under `public/` and set `figure.src` for the `rag`
programme in `components/foundation/ProgrammeTabs.tsx`. Figures are 4:3 and
cover-cropped.
