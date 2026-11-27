import test from "node:test";
import assert from "node:assert/strict";
import {
  addDays,
  getBestStreak,
  getCurrentStreak,
  getDaysInMonth,
  getMonthCalendarData,
  getRecentDays,
  getStreakOnDate,
  toDateKey,
} from "../src/utils/dates.js";

test("toDateKey formats local YYYY-MM-DD", () => {
  const date = new Date(2026, 10, 26);
  assert.equal(toDateKey(date), "2026-11-26");
});

test("getDaysInMonth and getMonthCalendarData handle standard and leap years", () => {
  assert.equal(getDaysInMonth(2026, 10), 30); // November 2026 has 30 days
  assert.equal(getDaysInMonth(2024, 1), 29);  // Leap year Feb
  assert.equal(getDaysInMonth(2026, 1), 28);  // Non-leap Feb

  const nov2026 = getMonthCalendarData(2026, 10);
  assert.equal(nov2026.totalDays, 30);
  assert.equal(nov2026.firstWeekday, 0); // Nov 1, 2026 is Sunday
  assert.equal(nov2026.days[0].key, "2026-11-01");
  assert.equal(nov2026.days[29].key, "2026-11-30");
});

test("getStreakOnDate and getCurrentStreak count consecutive days ending on target date", () => {
  const completions = ["2026-11-24", "2026-11-25", "2026-11-26"];
  assert.equal(getStreakOnDate(completions, "2026-11-26"), 3);
  assert.equal(getStreakOnDate(completions, "2026-11-25"), 2);
  assert.equal(getCurrentStreak(completions, "2026-11-23"), 0);
});

test("getBestStreak finds longest consecutive run", () => {
  const completions = ["2026-11-10", "2026-11-11", "2026-11-15", "2026-11-16", "2026-11-17"];
  assert.equal(getBestStreak(completions), 3);
});

test("getRecentDays returns expected range around anchor date", () => {
  const anchor = new Date(2026, 10, 26);
  const days = getRecentDays(anchor, 2, 1);
  assert.equal(days.length, 4);
  assert.equal(days[0].key, toDateKey(addDays(anchor, -2)));
  assert.equal(days[3].key, toDateKey(addDays(anchor, 1)));
});
