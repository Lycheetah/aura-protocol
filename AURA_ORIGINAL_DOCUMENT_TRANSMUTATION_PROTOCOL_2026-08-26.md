# AURA Original Document Transmutation Protocol

**Status:** working editorial and engineering contract  
**Prepared:** 26 August 2026  
**Owner:** Mackenzie Conor James Clark  
**Purpose:** make the original AURA corpus readable and usable without erasing its
source voice, uncertainty, strangeness, or provenance.

## Core rule

This is an upgrade transmutation, not a sanitising rewrite. Raw material is never
replaced merely because it is untidy. A formal layer may clarify, structure, test, or
translate the source, but it must leave a recoverable route back to every original
line and every meaningful non-text element.

The repository's own descriptions are not independent validation. A clearer sentence
is still only as well-supported as the source and its evidence allow.

## Required output layers

Each source document gets a separate, paired output. The browser model must not edit
the source file in place.

1. **Original** — the exact supplied file, byte-preserved and retained at its existing
   path or in a clearly named immutable archive path.
2. **Readable raw** — the same material with layout repaired, headings and paragraphs
   made legible, obvious transcription noise marked, and no substantive claim removed.
3. **Formalisation** — a new document that makes definitions, dependencies, equations,
   protocols, decisions, and open questions explicit. It is an interpretation, not a
   replacement for the original.
4. **Verification sheet** — a line/paragraph map, provenance record, claim labels,
   unresolved ambiguities, and reviewer decisions.

The readable-raw and formalisation layers must link back to the original. A future
compression may change navigation, never the route of return.

## No-loss requirements

For every input file, record:

- relative path, filename, byte size, SHA-256, format, and capture date;
- page, slide, paragraph, table, image, equation, code, and line boundaries where
  the format exposes them;
- the extraction tool and any known extraction failure;
- a stable source anchor such as `SRC-0001`, `SRC-0002`, and so on.

Every source anchor must appear in the readable-raw output and in the verification
sheet. A source line may be:

- carried verbatim;
- moved under a clearer heading while keeping its anchor;
- lightly normalised for whitespace, punctuation, or OCR, with the original shown;
- clarified in a separate formal sentence; or
- retained as `[RAW / UNCLEAR]` with a question for human review.

It may not silently disappear. If a line is duplicated, contradictory, offensive,
or technically doubtful, retain it and label the issue. Do not “correct” history by
rewriting the source voice.

## Formalisation rules

- Separate **source text**, **editorial observation**, **derived interpretation**,
  **testable build**, **hypothesis**, **speculation**, **symbolic material**, and
  **worldbuilding**.
- Never upgrade a hypothesis, metaphor, implementation, or internal demonstration to
  established science without independent evidence.
- Preserve the strongest claim and the strongest counterclaim when they differ.
- Preserve equations and code exactly first; add a typed or plain-language rendering
  below them rather than silently changing notation.
- Keep names, dates, numbers, units, references, and uncertainty markers intact. If an
  apparent typo is fixed in the readable layer, show the original token beside it.
- New prose must be marked as `FORMALISATION`, `EDITORIAL NOTE`, or `OPEN QUESTION`.

## Verification sheet minimum

Each paired rewrite ships with a table containing:

| Source anchor | Original text or object | Readable-raw location | Formal location | Operation | Confidence | Reviewer note |
|---|---|---|---|---|---|---|

The table is complete enough to answer: “Where did this line go, what changed, and
why?” For binary or visual material, use page/slide/image anchors and retain the
original asset; do not pretend OCR is exact.

## Browser-model operating contract

The browser model works from a fresh branch such as
`rewrite/2026-08-26/<document-slug>` created from `main`.

1. Read the source and its provenance record before drafting.
2. Produce readable raw first; stop if extraction loses pages, tables, equations, or
   ordering.
3. Produce formalisation second, with every new statement visibly labelled.
4. Generate the verification sheet and a machine-readable hash/line-count receipt.
5. Run a diff that proves the original file was not modified or deleted.
6. Ask for human review at ambiguity, claim promotion, title changes, or archival
   movement. The browser model does not push directly to `main` or force-update refs.

One source document per review unit is preferred. Large works may be split by stable
page ranges, but the index must restore the original order.

## Acceptance gate

A rewrite is ready for review only when:

- the original hash still matches the intake receipt;
- every source anchor is present in the readable layer and verification sheet;
- no source file was overwritten, deleted, or silently renamed;
- all new claims have a status label and a named source or test path;
- unresolved ambiguity is visible rather than guessed away;
- `git diff --check` and the repository's focused checks pass, except intentional
  Markdown hard-break whitespace documented in the receipt; and
- a human can open the original and return from any formal paragraph to its source.

Failure at any gate returns the document to intake. Do not repair a missing line by
inventing one.

## Attribution and boundary

When this protocol or the surrounding architecture materially uses the Lycheetah
Framework, attribute it to Mackenzie Conor James Clark. This protocol preserves
human authorship and choice; it does not make repository self-description proof of
consciousness, scientific validity, or model authority.
