import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Header from "./components/Header.jsx";
import HabitForm from "./components/HabitForm.jsx";
import HabitCard from "./components/HabitCard.jsx";
import ProgressPanel from "./components/ProgressPanel.jsx";
import WeekOverview from "./components/WeekOverview.jsx";
import StreakHistoryPanel from "./components/StreakHistoryPanel.jsx";
import { formatLongDate, getDaysInMonth, toDateKey } from "./utils/dates.js";
import { loadHabits, saveHabits } from "./utils/storage.js";
import "./App.css";

function createHabitId() {
  if (typeof globalThis.crypto?.randomUUID === "function") {
    return globalThis.crypto.randomUUID();
  }
  return `habit-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export default function App() {
  const [habits, setHabits] = useState(loadHabits);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState("All");
  const [today, setToday] = useState(() => new Date());
  const [activeDate, setActiveDate] = useState(() => new Date());
  const [showHistory, setShowHistory] = useState(false);
  const [deletedHabit, setDeletedHabit] = useState(null);
  const undoTimeoutRef = useRef(null);

  useEffect(() => {
    const updateToday = () => {
      const now = new Date();
      setToday((prev) => {
        if (toDateKey(prev) === toDateKey(now)) return prev;
        setActiveDate((curr) => (toDateKey(curr) === toDateKey(prev) ? now : curr));
        return now;
      });
    };

    const intervalId = window.setInterval(updateToday, 60_000);
    window.addEventListener("focus", updateToday);
    document.addEventListener("visibilitychange", updateToday);

    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener("focus", updateToday);
      document.removeEventListener("visibilitychange", updateToday);
    };
  }, []);

  useEffect(() => {
    saveHabits(habits);
  }, [habits]);

  useEffect(() => {
    const handleStorage = (event) => {
      if (event.key === null) {
        setHabits(loadHabits());
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  useEffect(() => {
    return () => {
      if (undoTimeoutRef.current) {
        window.clearTimeout(undoTimeoutRef.current);
      }
    };
  }, []);

  const activeDateKey = useMemo(() => toDateKey(activeDate), [activeDate]);
  const activeMonthDays = useMemo(
    () => getDaysInMonth(activeDate.getFullYear(), activeDate.getMonth()),
    [activeDate],
  );

  const completedCount = useMemo(
    () =>
      habits.reduce(
        (count, habit) => (habit.completions.includes(activeDateKey) ? count + 1 : count),
        0,
      ),
    [habits, activeDateKey],
  );

  const percentage = useMemo(
    () => (habits.length ? Math.round((completedCount / habits.length) * 100) : 0),
    [completedCount, habits.length],
  );

  const categories = useMemo(() => {
    const unique = [...new Set(habits.map((habit) => habit.category).filter(Boolean))];
    return ["All", ...unique];
  }, [habits]);

  useEffect(() => {
    if (!categories.includes(filter)) {
      setFilter("All");
    }
  }, [categories, filter]);

  const visibleHabits = useMemo(
    () =>
      filter === "All"
        ? habits
        : habits.filter((habit) => habit.category === filter),
    [habits, filter],
  );

  const addHabit = useCallback((details) => {
    const trimmedName = details.name?.trim();
    if (!trimmedName) return;

    const newHabit = {
      ...details,
      name: trimmedName,
      category: details.category?.trim() || "General",
      completions: [],
      id: createHabitId(),
    };

    setHabits((current) => [newHabit, ...current]);
    setShowForm(false);
    setFilter("All");
  }, []);

  const toggleHabit = useCallback(
    (id) => {
      setHabits((current) =>
        current.map((habit) => {
          if (habit.id !== id) return habit;
          const alreadyDone = habit.completions.includes(activeDateKey);
          return {
            ...habit,
            completions: alreadyDone
              ? habit.completions.filter((date) => date !== activeDateKey)
              : [...habit.completions, activeDateKey],
          };
        }),
      );
    },
    [activeDateKey],
  );

  const deleteHabit = useCallback((id) => {
    setHabits((current) => {
      const targetIndex = current.findIndex((item) => item.id === id);
      if (targetIndex === -1) return current;

      const target = current[targetIndex];
      setDeletedHabit({ habit: target, index: targetIndex });

      if (undoTimeoutRef.current) {
        window.clearTimeout(undoTimeoutRef.current);
      }
      undoTimeoutRef.current = window.setTimeout(() => {
        setDeletedHabit(null);
      }, 5000);

      return current.filter((item) => item.id !== id);
    });
  }, []);

  const undoDelete = useCallback(() => {
    if (!deletedHabit) return;
    if (undoTimeoutRef.current) {
      window.clearTimeout(undoTimeoutRef.current);
    }
    setHabits((current) => {
      const next = [...current];
      const insertAt = Math.min(deletedHabit.index, next.length);
      next.splice(insertAt, 0, deletedHabit.habit);
      return next;
    });
    setDeletedHabit(null);
  }, [deletedHabit]);

  return (
    <div className="app-shell">
      <Header
        activeDate={activeDate}
        today={today}
        habits={habits}
        onSelectDate={(date) => setActiveDate(date)}
        isHistoryOpen={showHistory}
        onToggleHistory={() => setShowHistory((prev) => !prev)}
      />

      <main className="dashboard">
        <section className="welcome-row">
          <div>
            <h1>Daily habits</h1>
            <p>
              {formatLongDate(activeDate)} &middot; Day {activeDate.getDate()} of{" "}
              {activeMonthDays}
            </p>
          </div>
          <button
            className="button button-primary add-main"
            type="button"
            onClick={() => setShowForm((prev) => !prev)}
            aria-expanded={showForm}
            aria-controls="habit-form"
          >
            + New habit
          </button>
        </section>

        {showHistory && (
          <StreakHistoryPanel
            habits={habits}
            today={today}
            onSelectDate={(date) => {
              setActiveDate(date);
              setShowHistory(false);
            }}
          />
        )}

        {deletedHabit && (
          <div className="undo-banner" role="status" aria-live="polite">
            <span>Removed &ldquo;{deletedHabit.habit.name}&rdquo;.</span>
            <button type="button" className="text-button" onClick={undoDelete}>
              Undo
            </button>
          </div>
        )}

        <div className="dashboard-grid">
          <div className="main-column">
            <ProgressPanel
              total={habits.length}
              completed={completedCount}
              percentage={percentage}
            />

            <section className="habits-section">
              <div className="section-title-row">
                <div>
                  <h2>
                    Habits <span className="count-badge">{habits.length}</span>
                  </h2>
                </div>
                <button
                  type="button"
                  className="text-button"
                  onClick={() => setShowForm(true)}
                >
                  + Add habit
                </button>
              </div>

              <div className="filter-row" aria-label="Filter habits">
                {categories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    className={`filter-chip ${filter === category ? "active" : ""}`}
                    onClick={() => setFilter(category)}
                    aria-pressed={filter === category}
                  >
                    {category}
                  </button>
                ))}
              </div>

              {showForm && (
                <HabitForm
                  onAdd={addHabit}
                  onCancel={() => setShowForm(false)}
                />
              )}

              <div className="habit-list">
                {visibleHabits.length ? (
                  visibleHabits.map((habit) => (
                    <HabitCard
                      key={habit.id}
                      habit={habit}
                      todayKey={activeDateKey}
                      onToggle={toggleHabit}
                      onDelete={deleteHabit}
                    />
                  ))
                ) : (
                  <div className="empty-state">
                    <h3>
                      {habits.length
                        ? "No habits in this category"
                        : "No habits added yet"}
                    </h3>
                    <p>
                      {habits.length
                        ? "Switch filters to view other habits."
                        : "Add a habit to start tracking daily completions."}
                    </p>
                    {!habits.length && (
                      <button
                        type="button"
                        className="button button-primary"
                        onClick={() => setShowForm(true)}
                      >
                        Add habit
                      </button>
                    )}
                  </div>
                )}
              </div>
            </section>
          </div>

          <aside className="side-column">
            <WeekOverview habits={habits} today={activeDate} />
            <section className="tip-card">
              <div>
                <h3>Note</h3>
                <p>
                  Keep the target low on busy days so you don&apos;t lose the
                  routine.
                </p>
              </div>
            </section>
          </aside>
        </div>

        <footer className="footer">
          <span>Habit tracker</span>
          <span>Stored in browser localStorage</span>
        </footer>
      </main>
    </div>
  );
}
