

import { memo, useMemo } from "react";
import { getBestStreak, getCurrentStreak } from "../utils/dates.js";

function HabitCard({ habit, todayKey, onToggle, onDelete }) {
  const completionSet = useMemo(
    () => new Set(habit.completions),
    [habit.completions]
  );

  const done = completionSet.has(todayKey);

  const streak = useMemo(
    () => getCurrentStreak(habit.completions, todayKey),
    [habit.completions, todayKey]
  );

  const best = useMemo(
    () => getBestStreak(habit.completions),
    [habit.completions]
  );

  const handleDelete = () => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${habit.name}"?`
    );

    if (confirmed) {
      onDelete(habit.id);
    }
  };

  return (
    <article
      className={`habit-card ${done ? "is-done" : ""}`}
      aria-label={`Habit: ${habit.name}`}
    >
      <div className="habit-info">
        <div className="habit-title-row">
          <h3>{habit.name}</h3>

          {done && (
            <span className="done-pill" aria-label="Completed">
              DONE
            </span>
          )}
        </div>

        <div className="habit-meta">
          <span>{habit.category}</span>
          <span aria-hidden="true">/</span>
          <span>
            Streak: {streak} day{streak === 1 ? "" : "s"}
          </span>
          <span aria-hidden="true">/</span>
          <span>Best: {best}</span>
        </div>
      </div>

      <button
        type="button"
        className={`check-button ${done ? "checked" : ""}`}
        onClick={() => onToggle(habit.id)}
        aria-pressed={done}
        aria-label={
          done
            ? `Mark ${habit.name} incomplete`
            : `Complete ${habit.name}`
        }
        title={done ? "Undo completion" : "Mark complete"}
      >
        <span aria-hidden="true">{done ? "✓" : ""}</span>
      </button>

      <button
        type="button"
        className="delete-button"
        onClick={handleDelete}
        aria-label={`Delete ${habit.name}`}
        title={`Delete ${habit.name}`}
      >
        Delete
      </button>
    </article>
  );
}

export default memo(HabitCard);
