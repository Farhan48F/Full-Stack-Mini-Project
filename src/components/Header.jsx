import { useEffect, useMemo, useState } from "react";
import { getMonthCalendarData, toDateKey } from "../utils/dates.js";

const WEEKDAY_HEADERS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function Header({
  activeDate,
  today,
  habits,
  onSelectDate,
}) {
  const [timetableOpen, setTimetableOpen] = useState(false);
  const [viewYear, setViewYear] = useState(() => activeDate.getFullYear());
  const [viewMonth, setViewMonth] = useState(() => activeDate.getMonth());

  useEffect(() => {
    setViewYear(activeDate.getFullYear());
    setViewMonth(activeDate.getMonth());
  }, [activeDate]);

  const activeKey = toDateKey(activeDate);
  const todayKey = toDateKey(today);
  const isViewingToday = activeKey === todayKey;

  const calendar = useMemo(() => {
    const base = getMonthCalendarData(viewYear, viewMonth);
    const daysWithCounts = base.days.map((day) => {
      const doneCount = habits.filter((h) => h.completions.includes(day.key)).length;
      return {
        ...day,
        doneCount,
        totalCount: habits.length,
        isToday: day.key === todayKey,
        isSelected: day.key === activeKey,
      };
    });
    return {
      ...base,
      days: daysWithCounts,
    };
  }, [viewYear, viewMonth, habits, todayKey, activeKey]);

  function handlePrevMonth() {
    if (viewMonth === 0) {
      setViewYear((y) => y - 1);
      setViewMonth(11);
    } else {
      setViewMonth((m) => m - 1);
    }
  }

  function handleNextMonth() {
    if (viewMonth === 11) {
      setViewYear((y) => y + 1);
      setViewMonth(0);
    } else {
      setViewMonth((m) => m + 1);
    }
  }

  return (
    <header className="app-header">
      <div>
        <p className="header-eyebrow">DAILY SCHEDULE</p>
        <h2 className="app-title">Habit Tracker</h2>
      </div>

      <div className="header-controls">
        <div
          className="day-timetable-wrapper"
          onMouseEnter={() => setTimetableOpen(true)}
          onMouseLeave={() => setTimetableOpen(false)}
          onFocus={() => setTimetableOpen(true)}
          onBlur={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget)) {
              setTimetableOpen(false);
            }
          }}
        >
          <button
            type="button"
            className="btn btn-secondary day-trigger"
            aria-expanded={timetableOpen}
            aria-haspopup="dialog"
            onClick={() => setTimetableOpen((prev) => !prev)}
          >
            <span>
              {activeDate.toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
              })}
            </span>
            {!isViewingToday && <span className="day-tag">Selected day</span>}
          </button>

          {timetableOpen && (
            <div className="day-timetable" role="dialog" aria-label="Monthly day timetable">
              <div className="timetable-header">
                <div>
                  <span className="timetable-month-title">{calendar.monthLabel}</span>
                  <span className="timetable-month-count">
                    Total days in month: {calendar.totalDays}
                  </span>
                </div>
                <div className="timetable-nav">
                  <button
                    type="button"
                    className="timetable-nav-btn"
                    onClick={handlePrevMonth}
                    aria-label="Previous month"
                  >
                    &lt;
                  </button>
                  <button
                    type="button"
                    className="timetable-nav-btn"
                    onClick={handleNextMonth}
                    aria-label="Next month"
                  >
                    &gt;
                  </button>
                  {!isViewingToday && (
                    <button
                      type="button"
                      className="timetable-reset"
                      onClick={() => {
                        onSelectDate(new Date(today));
                        setTimetableOpen(false);
                      }}
                    >
                      Today
                    </button>
                  )}
                </div>
              </div>

              <div className="timetable-weekdays" aria-hidden="true">
                {WEEKDAY_HEADERS.map((wd) => (
                  <span key={wd}>{wd}</span>
                ))}
              </div>

              <div className="timetable-calendar-grid">
                {Array.from({ length: calendar.firstWeekday }, (_, idx) => (
                  <span key={`empty-${idx}`} className="timetable-empty-cell" />
                ))}
                {calendar.days.map((day) => (
                  <button
                    key={day.key}
                    type="button"
                    aria-pressed={day.isSelected}
                    title={`${day.label} (${day.doneCount}/${day.totalCount} done)`}
                    className={`timetable-day-cell ${day.isSelected ? "is-selected" : ""} ${
                      day.isToday ? "is-today" : ""
                    }`}
                    onClick={() => {
                      onSelectDate(day.date);
                      setTimetableOpen(false);
                    }}
                  >
                    <span>{day.dayNumber}</span>
                    {day.totalCount > 0 && (
                      <span className="timetable-cell-progress">
                        {day.doneCount}/{day.totalCount}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              <div className="timetable-footer-note">
                <span>Day {activeDate.getDate()} of {calendar.totalDays}</span>
                <span>Global calendar</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}