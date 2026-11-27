# Daily Habit & Streak Tracker

A simple habit tracker built with Vite, React, JavaScript, and CSS. It runs completely in the browser with `localStorage` persistence and no external UI libraries or backend.

## Features

* Add habits with a name and category
* Hover or focus on the active day in the header to open a full-month calendar timetable (with accurate days per month, leap years, and total days in the month) to switch days or browse months
* Toggle completions for the selected day and track current and best streaks
* Filter habits by category and view daily completion progress
* Delete habits with a 5-second undo option
* Persist data in browser `localStorage` across refreshes and open tabs

## Requirements

* Node.js 20.19+ or 22.12+
* npm

## Getting started

1. Extract the ZIP archive.
2. Open the `daily-habit-streak-tracker` folder in your editor or terminal.
3. Install dependencies:
```bash
npm install

```


4. Start the development server:
```bash
npm run dev

```


5. Open the local URL shown in the terminal (usually `http://localhost:5173`).

## Running tests

```bash
npm test

```

## Build and preview

```bash
npm run build
npm run preview

```

## Project structure

```text
daily-habit-streak-tracker/
├── index.html
├── package.json
├── vite.config.js
├── README.md
├── tests/
│   ├── dates.test.js
│   └── storage.test.js
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── index.css
    ├── App.css
    ├── components/
    │   ├── Header.jsx
    │   ├── HabitForm.jsx
    │   ├── HabitCard.jsx
    │   ├── ProgressPanel.jsx
    │   └── WeekOverview.jsx
    └── utils/
        ├── dates.js
        └── storage.js

```














<img width="2940" height="1767" alt="image" src="https://github.com/user-attachments/assets/9b072f86-ec00-4bae-8861-4590856c19c7" />


















<img width="2940" height="1768" alt="image" src="https://github.com/user-attachments/assets/93f8107a-0ed9-4b00-b948-b73f56f26251" />




















<img width="2940" height="1775" alt="image" src="https://github.com/user-attachments/assets/a8bb84e6-2dbf-4663-9145-8e860978ec31" />



















<img width="2940" height="1777" alt="image" src="https://github.com/user-attachments/assets/d34c945f-94b7-40c8-8237-b2e177718849" />



