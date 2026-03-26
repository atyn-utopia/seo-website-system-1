# Orchestrator Guide

This guide explains how to run the SEO Website System agent team using Claude's Agent tool. Each agent is a real subagent spawned as a separate subprocess — not role-playing in the same session.

## How to spawn an agent

Use the Agent tool with the contents of the agent's `.md` file as the prompt. Pass all required inputs inline.

```
Agent tool:
  prompt: [contents of agents/alpha.md] + [your project inputs]
```

The agent runs independently, completes its task, and returns its output to you. You then pass that output as input to the next agent.

## Agent execution order

Run agents in this sequence. Some can run in parallel (marked ∥).

```
Step 1:  Alpha  — System architecture
         ∥ Joy asks user: "What languages should the website support?"

Step 2:  Cyclops — Supabase schema       (needs: Alpha's output)
         ∥ Sora  — SEO plan              (needs: Alpha's output)

Step 3:  Nana   — Homepage copy          (needs: Sora's output)

Step 4:  Fanny  — Location page copy     (needs: Alpha + Sora + Nana's output)
         ∥ Kimmy — Technical SEO         (needs: Alpha + Sora + Nana's output)

Step 5:  Joy    — i18n implementation    (needs: Alpha + Nana + confirmed languages)
```

Steps 2 agents (Cyclops + Sora) can run in parallel after Alpha.
Steps 4 agents (Fanny + Kimmy) can run in parallel after Nana.

## What to pass each agent

| Agent   | Required inputs |
|---------|----------------|
| Alpha   | Product name/slug, domain, target country, locations list, languages, special requirements |
| Cyclops | Alpha's architecture doc, locations list |
| Sora    | Alpha's architecture doc, product name, locations list, languages |
| Nana    | Alpha's doc, Sora's SEO plan, product description, brand tone |
| Fanny   | Alpha's doc, Sora's plan, Nana's templates, full locations list |
| Kimmy   | Alpha's doc, Sora's plan, Nana's copy, Fanny's location copy, domain |
| Joy     | Alpha's doc, confirmed languages, Nana's copy, existing codebase state |

## Collecting outputs

After each agent completes, save its output to the project folder:

```
projects/{project-name}/
  architecture.md        ← Alpha's output
  database.md            ← Cyclops's output
  seo-plan.md            ← Sora's output
  copy-homepage.md       ← Nana's output
  copy-locations.md      ← Fanny's output
  technical-seo.md       ← Kimmy's output
  i18n-implementation.md ← Joy's output
```

## Parallelism

When spawning parallel agents, send both Agent tool calls in a single message. Do not wait for one to finish before starting the other when inputs are independent.

## Applying outputs to the codebase

After all agents complete, apply their outputs to the project codebase:
1. Cyclops's SQL → run in Supabase SQL editor
2. Kimmy's metadata → paste into Next.js page files
3. Joy's translation files → write to `messages/*.json`
4. Fanny's copy → populate `lib/locationCopy.ts`
