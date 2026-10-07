# Quiz App

Browser-based multiple-choice quiz inspired by [roadmap.sh — Quiz App](https://roadmap.sh/projects/quiz-app).

Built with **React**, **Vite**, **TypeScript**, and **Zustand**.

## Run locally

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
npm run preview
```

## Features

- Welcome screen with quiz title, description, and **Start**
- Questions shown as **cards** with answer **buttons**
- Immediate feedback: selected answer turns green/red; correct answer is highlighted
- **+1** point for each correct answer
- **60 seconds** per question; if time runs out, the question is skipped and **score −1** (minimum score **0**)
- Final screen with total score and per-question results
- **Restart** returns to the welcome screen

## Customize the quiz

Edit [`src/data/quiz.json`](src/data/quiz.json). Each question needs:

- `id`, `prompt`, `options` (`id` + `label`), and `correctOptionId` matching one option `id`

Types live in [`src/types/quiz.ts`](src/types/quiz.ts).

## Manual test checklist

1. Welcome → **Start** → first question; timer counts down from 60s
2. Correct answer → green, score +1, auto-advance after ~1.2s
3. Wrong answer → red on choice, green on correct answer, score unchanged
4. Let timer expire → timeout message, score −1, advance to next question
5. Finish all questions → results list and final score
6. **Restart** → welcome screen
7. `npm run build` succeeds

## Project structure

```
src/
  data/quiz.json       # Quiz content
  store/quizStore.ts   # Zustand state
  hooks/               # Per-question timer
  components/          # UI screens
  styles/global.css
```
