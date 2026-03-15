# AI Strategy

Concise planning notes for how `401kcalc` can benefit from AI in two ways:

- become more visible and usable in LLM / agent workflows
- add AI-powered product features without weakening trust

## Core idea

`401kcalc` should not try to be "AI-first" in a gimmicky way.

The best long-term position is:

- strong calculators and workflows
- transparent assumptions and methodology
- structured outputs that humans and agents can both use
- AI features that help explain and compare scenarios, not replace the product

## Two AI paths

### 1. AI-ready distribution

Make the site easy for LLMs and agents to:

- understand
- summarize
- cite
- call as a tool later

This helps `401kcalc` show up in AI chats and agent workflows.

### 2. AI as a product feature

Use AI to help users:

- understand outputs
- compare scenarios
- decide what to change next
- navigate retirement planning tradeoffs

This should make the site more useful, not more vague.

## Why this is a real opportunity

Most existing retirement calculators are:

- outdated
- visually weak
- hard to parse
- unclear about assumptions
- not designed for programmatic use

If `401kcalc` is cleaner, more structured, and more transparent, it can be more useful to both people and AI systems.

## AI-ready foundation

### Content structure

Important pages should be easy to parse and quote.

Prefer:

- one primary question per page
- clear summaries near the top
- explicit assumptions
- labeled inputs and outputs
- concise methodology sections
- FAQ-style explanations for key decisions and caveats

### Tool structure

Every core calculator or workflow should have:

- clear input definitions
- explicit formulas or assumptions
- understandable outputs
- explainable edge cases
- stable labels and sections

### Trust requirements

Never let AI introduce ambiguity where finance content needs precision.

Prefer:

- calculations first
- AI explanation second

Avoid:

- freeform AI answers without grounding in model outputs
- pretending to provide personalized advice
- vague "recommended" actions without showing why

## Best near-term AI-ready improvements

1. Make calculator outputs more structured and explainable
2. Expand methodology pages and assumptions summaries
3. Add clearer decision pages for Roth, rollover, and self-employed flows
4. Add summary blocks that are easy for LLMs to quote or cite
5. Keep guide content highly specific and explicit

## Agent-ready product direction

Long term, `401kcalc` could expose tools that agents can call.

Best candidates:

- 401(k) projection calculator
- retirement benchmark lookup
- Roth vs traditional comparison tool
- old 401(k) rollover decision workflow
- backdoor Roth / pro-rata calculator
- solo 401(k) vs SEP IRA workflow

## MCP / tool direction

If the product eventually exposes AI-callable tools, the ideal pattern is:

- deterministic calculations
- structured inputs
- structured outputs
- short explanatory metadata
- transparent limitations

That is much stronger than letting an agent guess the math.

## Best future AI features on-site

### Highest ROI

1. Scenario explainer
   Explain why one result is on track, tight margin, or needs changes.
2. Scenario comparison summary
   Compare two saved scenarios in plain language.
3. "What changed?" assistant
   Explain how a contribution, retirement age, or return assumption changed the result.
4. Guided next-step suggestions
   Suggest which inputs to test next, based on the current outcome.

### Medium-term

5. Decision helper for Roth vs traditional
6. Guided rollover / job-change workflow
7. Backdoor Roth explainer driven by actual inputs
8. Self-employed retirement setup assistant

### Lower priority

- generic chatbot on every page
- open-ended finance Q&A without grounding
- AI summaries that duplicate what the page already says

## Best UX pattern for AI features

Use AI as a layer on top of deterministic results.

Good pattern:

- user enters inputs
- calculator returns structured outputs
- AI explains the results and tradeoffs
- user can ask follow-up questions tied to the current scenario

Bad pattern:

- user asks broad retirement questions
- AI improvises answers with no structured calculation behind them

## Product ideas worth exploring

### Scenario explainer

Example output:

- "You are on track mainly because your current contribution rate and employer match compound for 30+ years."
- "Your plan is tight because your retirement age is close and the contribution rate is below the modeled target."

### Scenario comparison

Compare:

- current plan vs 1% higher contribution
- current plan vs later retirement age
- Roth-heavy vs traditional-heavy mix

### AI planning coach

Not a financial advisor.

Instead:

- explains tradeoffs
- suggests additional scenarios to test
- points users to relevant guides and workflows

### Guide navigator

Given a user question, route them to:

- a calculator
- a guide
- a workflow
- a methodology page

## Risks to avoid

- compliance drift into advice-like language
- hallucinated tax or legal claims
- AI outputs that contradict calculator math
- trust loss from overusing chat UI
- expensive AI features with weak user value

## Best roadmap

### Now

- strengthen structured outputs and methodology
- write pages and guides with explicit assumptions
- identify which existing calculators could become agent-callable later

### Next

- build scenario explanation and comparison features
- create workflow-style tools with deterministic logic
- design outputs that can be reused by future APIs or agent tools

### Later

- expose selected calculators as AI-callable tools
- add guided decision assistants tied to real workflows
- explore integrations with AI agents that can cite or call `401kcalc`

## Rules

- deterministic math first
- AI explanation second
- trust over novelty
- workflows over generic chat
- structured outputs over prose-only output
- use AI where it reduces confusion or adds decision support
