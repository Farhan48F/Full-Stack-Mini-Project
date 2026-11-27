import { addDays, toDateKey } from "./dates.js";

export const STORAGE_KEY = "daily_habits_v1";

function createSeedHabits() {
  const today = new Date();
  const yesterday = addDays(today, -1);
  const twoDaysAgo = addDays(today, -2);

  return [
    {
      id: "seed-water",
      name: "Drink 2L of water",
      category: "Health",
      completions: [toDateKey(twoDaysAgo), toDateKey(yesterday)],
    },
    {
      id: "seed-read",
      name: "Read 20 pages",
      category: "Learning",
      completions: [toDateKey(yesterday)],
    },
    {
      id: "seed-walk",
      name: "30-minute walk",
      category: "Fitness",
      completions: [],
    },
  ];
}

export function sanitizeHabits(raw) {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((item) => item && typeof item === "object" && typeof item.id === "string" && typeof item.name === "string")
    .map((item) => ({
      id: item.id,
      name: item.name.trim(),
      category: typeof item.category === "string" && item.category.trim() ? item.category.trim() : "General",
      completions: Array.isArray(item.completions)
        ? [...new Set(item.completions.filter((d) => typeof d === "string" && /^\d{4}-\d{2}-\d{2}$/.test(d)))]
        : [],
    }))
    .filter((item) => item.name.length > 0);
}

export function loadHabits() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw === null) {
      return createSeedHabits();
    }
    return sanitizeHabits(JSON.parse(raw));
  } catch {
    return createSeedHabits();
  }
}

export function saveHabits(habits) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(sanitizeHabits(habits)));
  } catch {
    // Ignore storage quota or private mode failures
  }
}
