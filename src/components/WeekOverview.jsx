import { useMemo } from "react";
import { addDays, toDateKey } from "../utils/dates.js";

export default function WeekOverview({ habits, activeDate, today }) {
  const anchorDate = activeDate ?? today;
  const safeHabits = useMemo(
    () => (Array.isArray(habits) ? habits : []),
    [habits],
  );

  const days = useMemo(() => {
    if (!(anchorDate instanceof Date) || Number.isNaN(anchorDate.getTime())) {
      return [];
    }

    const selectedKey = toDateKey(anchorDate);
    return Array.from({ length: 7 }, (_, index) => {
      const date = addDays(anchorDate, index - 6);
      const key = toDateKey(date);
      const completed = safeHabits.filter(
        (habit) =>
          Array.isArray(habit.completions) && habit.completions.includes(key),
      ).length;

      return {
        key,
        weekday: date.toLocaleDateString("en-US", { weekday: "short" }),
        completed,
        total: safeHabits.length,
        isSelected: key === selectedKey,
      };
    });
  }, [safeHabits, anchorDate]);

  return (
    <section className="week-card">
      <h3>7-Day Overview</h3>
      <p className="week-subtitle">Completions ending on the selected day</p>
      <div className="week-grid">
        {days.map((day) => {
          const allDone = day.total > 0 && day.completed === day.total;
          return (
            <div
              key={day.key}
              className={`week-day ${day.isSelected ? "is-today" : ""}`}
              title={`${day.key}: ${day.completed}/${day.total}`}
            >
              <span>{day.weekday}</span>
              <span className={`week-dot ${allDone ? "is-complete" : ""}`}>
                {day.completed}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}