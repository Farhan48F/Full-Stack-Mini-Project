import test from "node:test";
import assert from "node:assert/strict";
import { sanitizeHabits } from "../src/utils/storage.js";

test("sanitizeHabits filters invalid items and deduplicates valid date keys", () => {
  const cleaned = sanitizeHabits([
    null,
    { id: "1", name: "  Meditate ", category: "", completions: ["2026-11-25", "2026-11-25", "bad"] },
    { id: "2", name: "   " },
  ]);

  assert.equal(cleaned.length, 1);
  assert.deepEqual(cleaned[0], {
    id: "1",
    name: "Meditate",
    category: "General",
    completions: ["2026-11-25"],
  });
});
