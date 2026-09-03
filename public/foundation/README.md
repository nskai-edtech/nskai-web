# Foundation photographs

The Foundation page shows one photograph per programme. The design leaves these
as drop slots — "Drop your own photograph here" — so none were supplied with the
handoff.

Udara's slot now reuses `/udara/participants.png`, which is the cohort session
the caption describes. The RAG bootcamp has no photograph, so its frame renders
as the empty panel the design specifies rather than a broken image.

To fill it, add the file under `public/` and set `figure.src` for the `rag`
programme in `components/foundation/ProgrammeTabs.tsx`. Figures are 4:3 and
cover-cropped.
