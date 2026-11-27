import { useState } from "react";

const CATEGORIES = ["Health", "Fitness", "Learning", "Focus", "General"];

export default function HabitForm({ onAdd, onCancel }) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Health");

  function handleSubmit(event) {
    event.preventDefault();
    if (!name.trim()) return;
    onAdd({
      name: name.trim(),
      category,
    });
    setName("");
  }

  return (
    <form id="habit-form" className="habit-form" onSubmit={handleSubmit}>
      <div className="habit-form-grid">
        <input
          type="text"
          className="habit-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Habit name (e.g., Read 20 pages)"
          aria-label="Habit name"
          required
          autoFocus
        />
        <select
          className="habit-input"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          aria-label="Habit category"
        >
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>
      <div className="habit-form-actions">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          Save habit
        </button>
      </div>
    </form>
  );
}
