# Plate photography

The six industry pages each open on an archival photograph, and some carry a
second one. The handoff says to **self-host** these rather than hotlink
Wikimedia, so this directory holds them and the pages reference `/plates/<file>`.

**These are present in the repo.** Every plate is public domain or carries no
known restrictions, with one exception noted in the table below (`ene-det-1.jpg`
is CC BY 2.0 and is credited in its on-page caption). Fetched from Wikimedia
Commons at:

    https://commons.wikimedia.org/wiki/Special:FilePath/<SOURCE>?width=1600

Commons served them at 1920px wide. The largest frame on any page is ~1240px,
so they can be downscaled if page weight matters more than headroom.

| File | Source file on Commons |
| --- | --- |
| `fin-plate-hero.jpg` | Crowd on stock exchange floor, London LCCN2014683111.jpg |
| `fin-det-1.jpg` | The floor of the New York Stock Exchange, secretly shot with a camera hidden in the photographer's sleeve LCCN2006685050.jpg |
| `tel-plate-hero.jpg` | Photograph of Women Working at a Bell System Telephone Switchboard (3660047829).jpg |
| `tel-plate-city.jpg` | Seattle City Light telephone operators, 1945 (51722835290).jpg |
| `tel-plate-net.jpg` | WAC telephone operators operate the Victory switchboard during the Potsdam Conference in their headquarters in... - NARA - 199007.jpg |
| `pub-plate-hero.jpg` | Office of War Information research workers 8d28681v.jpg |
| `pub-det-1.jpg` | Mannelijke kantoorbedienden achter schrijfmachines, Bestanddeelnr 189-0019.jpg |
| `ret-plate-hero.jpg` | Interior of Katz drug store. Kansas City, Mo - NARA - 283620.jpg |
| `ret-det-1.webp` | Joseph Street, Lagos, with the Royal Cinema.png |
| `hea-plate-hero.jpg` | Ward in the Elliot Community Hospital (2435790785).jpg |
| `hea-det-1.webp` | Mothers wait in line at Child Clinic Centre in Lagos, Nigeria.png |
| `ene-plate-hero.jpg` | Lewis Hine Power house mechanic working on steam pump.jpg |
| `ene-det-1.jpg` | Georgetown Power Station workers, 1909.jpg — **CC BY 2.0**, Seattle Municipal Archives (attributed in the caption) |

The pages render correctly without them — the frames hold their size — so the
build does not depend on any of these files.

The solutions overview uses one more:

| File | Source file on Commons |
| --- | --- |
| `sol-band.jpg` | Werkkamer van de administratie in het gebouw op Keizersgracht 174-176 te Amsterd, Bestanddeelnr 189-1303.jpg |

Two notes on the 2026-09-08 pass:

- The London floor photograph replaced the New York one as the financial hero,
  and New York moved down to Fig. 2. The sweeping-up shot is no longer used.
- `ene-det-1.jpg` was a second scan of the very same Lewis Hine photograph as
  `ene-plate-hero.jpg`, so the page showed one picture twice. It is now the
  Georgetown switchboard.

1990s trading-floor photography was asked for and looked for; essentially none
of it is openly licensed, since that era's press images are still held by
Reuters, AP and Getty. These archival plates are the closest available, and they
match the rest of the site's photography.

## Encoding

Fetched at 1600px wide, then re-encoded on 2026-09-09: the JPEGs in place at
quality 80 (mozjpeg, progressive), and the two files that arrived as PNG —
`ret-det-1` at 2.1MB and `hea-det-1` at 1.0MB — as WebP at quality 82, which is
123KB and 111KB. The source names in the table above are the original Wikimedia
filenames and still end `.png`.
