export default function ProgressPanel({ total, completed, percentage }) {
  const safeTotal = Math.max(0, total);
  const safeCompleted = Math.min(safeTotal, Math.max(0, completed));
  const clampedPercentage = Math.min(100, Math.max(0, percentage));
  const remaining = Math.max(0, safeTotal - safeCompleted);
  const allDone = safeTotal > 0 && safeCompleted === safeTotal;

  return (
    <section className="progress-panel">
      <div className="progress-copy">
        <span className="eyebrow">DAY SUMMARY</span>
        <h2>{allDone ? "All done for this day" : "Daily progress"}</h2>
        <p>
          {safeCompleted} of {safeTotal} completed
        </p>
      </div>
      <div
        className="progress-visual"
        role="progressbar"
        aria-label="Daily habit completion"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={clampedPercentage}
      >
        <div
          className="progress-ring"
          style={{ "--progress": `${clampedPercentage * 3.6}deg` }}
        >
          <div className="progress-ring-inner">
            <strong>{clampedPercentage}%</strong>
            <span>done</span>
          </div>
        </div>
      </div>
      <div className="progress-bottom">
        <div className="progress-track">
          <span style={{ width: `${clampedPercentage}%` }} />
        </div>
        <span>{remaining} remaining</span>
      </div>
    </section>
  );
}
