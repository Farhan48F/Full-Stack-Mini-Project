import { useMemo } from "react";
import { getRecentDays, getStreakOnDate } from "../utils/dates.js";

export default function StreakHistoryPanel({
  habits,
  today,
  onSelectDate,
}) {
  const safeHabits = Array.isArray(habits) ? habits : [];

  const pastDays = useMemo(() => {
    if (!(today instanceof Date) || Number.isNaN(today.getTime())) {
      return [];
    }

    return getRecentDays(today, 7, 0)
      .filter((day) => day.offset < 0)
      .sort((a, b) => b.date - a.date);
  }, [today]);

  if (!safeHabits.length) {
    return (
      <section
        className="history-panel"
        aria-label="Previous day streak history"
      >
        <h3>Previous Day Streaks</h3>
        <p className="history-empty">
          No habits to show history for yet.
        </p>
      </section>
    );
  }

  return (
    <section
      className="history-panel"
      aria-label="Previous day streak history"
    >
      <div className="history-header">
        <h3>Previous Day Streaks</h3>
        <span>Last 7 days</span>
      </div>

      <div className="history-days">
        {pastDays.map((day) => {
          const completedCount = safeHabits.filter(
            (habit) =>
              Array.isArray(habit.completions) &&
              habit.completions.includes(day.key)
          ).length;

          return (
            <div key={day.key} className="history-day-card">
              <div className="history-day-top">
                <strong>{day.label}</strong>

                <div className="history-day-actions">
                  <span>
                    {completedCount}/{safeHabits.length} done
                  </span>

                  <button
                    type="button"
                    className="btn btn-secondary btn-compact"
                    onClick={() => onSelectDate?.(day.date)}
                    aria-label={`View habits for ${day.label}`}
                  >
                    View day
                  </button>
                </div>
              </div>

              <ul className="history-habit-list">
                {safeHabits.map((habit) => {
                  const completions = Array.isArray(habit.completions)
                    ? habit.completions
                    : [];

                  const wasDone = completions.includes(day.key);
                  const streak = getStreakOnDate(completions, day.key);

                  return (
                    <li
                      key={habit.id}
                      className={`history-habit-row ${
                        wasDone ? "done" : "missed"
                      }`}
                    >
                      <span>{habit.name}</span>

                      <span className="history-streak-pill">
                        {wasDone ? `${streak}d streak` : "Missed"}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );
}