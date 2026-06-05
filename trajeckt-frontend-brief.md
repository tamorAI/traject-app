# Trajeckt Landing Page — Positioning & Copy Brief

**For:** Frontend developer
**Purpose:** The current page mixes three positionings (observability, governance, enforcement). We are committing to one: **runtime enforcement**. This brief contains the exact copy, the structural changes, and the reasoning so you can make judgment calls without checking back.

---

## The one-sentence positioning

Companies need commitments about agent behavior that hold even when the agent itself doesn't — and the commitments that matter most are properties of *sequences* of actions, which nothing else can enforce. Trajeckt enforces them at runtime, below the model, where a compromised agent can't reach.

Every element on the page either serves that sentence or gets cut.

## What this is NOT (kill on sight)

- NOT observability. Remove "See inside your AI agents' minds" — it sells the opposite of our thesis (we don't trust the mind; we enforce regardless of it).
- NOT a governance platform. Remove "Understand, govern, and control how AI agents operate" everywhere it appears (eyebrow, meta tags, OG description).
- NOT soulful/contemplative language. No "minds," "learn," "improve," "recovery branch" in the hero. The buyer's emotion is fear → relief, not curiosity. Keep the visual restraint; harden the language.

---

## Hero — exact copy

**Eyebrow (replaces "Understand, govern, and control…"):**
> Runtime enforcement for autonomous agents

**Headline:**
> A single tool call can't be wrong. Only the sequence can.

Two-tone treatment: if we keep the black/grey split, the GREY half is the setup ("A single tool call can't be wrong.") and the BLACK half is the claim ("Only the sequence can."). Current page has this inverted — emphasis must land on the claim, not the setup.

**Subhead (replaces the current 3-sentence paragraph):**
> Every agent guardrail today inspects actions one at a time — so the failures that only exist across steps walk right through. Trajeckt enforces commitments across the whole trajectory, at runtime, below the model, before any irreversible action fires.

**CTAs (unchanged structure, two buttons):**
- Primary: `Request demo →`
- Secondary: `▷ View the platform`

Do NOT ship "See it block a live exfiltration" or similar until the demo video exists and is final. No promises the click can't keep.

---

## Trajectory Dashboard module — reorder

Current order: Success rate (92%) → Avg replans (1.4) → Escalations (3%) → Violations blocked (127, half cut off).

Problem: the first three are *agent quality* metrics (the customer's numbers). The fourth is *our product*. Flip the hierarchy:

1. **127 — VIOLATIONS BLOCKED** (first position, largest; add small sub-label: "before execution")
2. 3% — Escalations
3. 92% — Success rate
4. 1.4 — Avg replans

The goal of this module: a visitor should ask "blocked *how*?" That question is the conversion. Make sure the 4th cell is never clipped at any breakpoint (currently truncating on mobile).

---

## Page structure below the fold

Section order tells the argument. Use this sequence:

**Section 1 — The claim, expanded.**
Header: `Failures live in the path, not the action.`
One short paragraph: each step in an attack or failure looks innocent on its own — read a file, format a payload, make an HTTP call. The violation only exists in the order. Per-action gates are structurally blind to it. Trajeckt models the trajectory as a first-class object and enforces on it.
Visual: a simple 3-step sequence diagram where steps 1 and 2 are green individually, and the 1→2→3 path is red/blocked. This single graphic carries the whole thesis — prioritize it over any other illustration on the page.

**Section 2 — Below the model.**
Header: `Enforcement the agent can't reach.`
Paragraph: prompts, system messages, and model-side guardrails all live inside the thing being attacked. Trajeckt sits at the gateway, outside the model's trust boundary. A hijacked agent can change what it *tries*; it cannot change what is *allowed*.

**Section 3 — The artifact (deployment-unblocker).**
Header: `The answer your security review is waiting for.`
Paragraph: declared commitments in a human-readable spec, deterministic enforcement, tamper-evident audit lineage. This is what turns "trust the model" into a document a security team can approve.
IMPORTANT wording constraint: use "deterministic enforcement" and "tamper-evident audit trail." Do NOT use "provably," "formally verified," or "guaranteed" anywhere on the site. (Core hasn't had external formal review yet; we don't write checks the review hasn't cashed.)

**Section 4 — Feature row (small, three items, no fanfare):**
- Action ceilings — autonomy with hard limits (approval thresholds, write scopes)
- Process commitments — "X must precede Y" controls, enforced not suggested
- Scope & termination — bounded toolsets, call budgets, agents that actually stop

These three are deliberately demoted to bullets. They are real features but contested territory; the sequence claim is the differentiator and gets the headlines.

---

## Tone & design notes

- Keep the current visual direction: editorial serif display, monochrome, restraint. The design was never the problem; the copy's identity crisis was.
- Language register: concrete and slightly menacing. Verbs like *blocks, kills, intercepts, enforces, holds* over *observes, learns, improves, empowers*.
- One idea per section. If a sentence could appear on a Langfuse or generic "AI governance" site unchanged, rewrite or delete it.
- Mobile: verify headline line-breaks don't orphan single words; verify dashboard cells don't clip (see above).

## Quick QA checklist before deploy

- [ ] No instance of "understand, govern, and control" remains (check meta/OG tags too)
- [ ] No "minds" / observability language in hero
- [ ] Violations blocked is the first dashboard stat and reads "before execution"
- [ ] No "provably / formally verified / guaranteed" anywhere
- [ ] Both CTAs point at things that exist today
- [ ] Sequence diagram (green steps, red path) renders on mobile
