export function toDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function formatLongDate(date) {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export function formatShortDay(date) {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(date);
}

export function addDays(date, offsetDays) {
  const copy = new Date(date);
  copy.setDate(copy.getDate() + offsetDays);
  return copy;
}

export function getDaysInMonth(year, monthIndex) {
  return new Date(year, monthIndex + 1, 0).getDate();
}

export function getMonthCalendarData(year, monthIndex) {
  const totalDays = getDaysInMonth(year, monthIndex);
  const firstWeekday = new Date(year, monthIndex, 1).getDay(); // 0 = Sun ... 6 = Sat
  const monthLabel = new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(new Date(year, monthIndex, 1));

  const days = Array.from({ length: totalDays }, (_, idx) => {
    const dayNumber = idx + 1;
    const date = new Date(year, monthIndex, dayNumber);
    return {
      dayNumber,
      date,
      key: toDateKey(date),
      label: formatLongDate(date),
    };
  });

  return {
    year,
    monthIndex,
    monthLabel,
    totalDays,
    firstWeekday,
    days,
  };
}

export function getRecentDays(anchorDate, pastCount = 7, futureCount = 2) {
  const days = [];
  for (let offset = -pastCount; offset <= futureCount; offset += 1) {
    const d = addDays(anchorDate, offset);
    days.push({
      date: d,
      key: toDateKey(d),
      label: formatShortDay(d),
      offset,
    });
  }
  return days;
}

export function getStreakOnDate(completions, targetDateKey) {
  const set = new Set(completions);
  const [y, m, d] = targetDateKey.split("-").map(Number);
  if (!y || !m || !d) return 0;

  let cursor = new Date(y, m - 1, d);
  let streak = 0;

  while (set.has(toDateKey(cursor))) {
    streak += 1;
    cursor = addDays(cursor, -1);
  }

  return streak;
}

export function getCurrentStreak(completions, referenceDateKey) {
  return getStreakOnDate(completions, referenceDateKey);
}

export function getBestStreak(completions) {
  if (!Array.isArray(completions) || completions.length === 0) return 0;
  const sortedKeys = [...new Set(completions)].sort();
  let best = 0;
  let current = 0;
  let prevKey = null;

  for (const key of sortedKeys) {
    if (!prevKey) {
      current = 1;
    } else {
      const [py, pm, pd] = prevKey.split("-").map(Number);
      const expectedNext = toDateKey(addDays(new Date(py, pm - 1, pd), 1));
      current = key === expectedNext ? current + 1 : 1;
    }
    if (current > best) best = current;
    prevKey = key;
  }

  return best;
}
