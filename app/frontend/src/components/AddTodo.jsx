import { useState } from "react";

const PRIORITIES = [
  { value: "high", label: "Cao", color: "text-red-500" },
  { value: "medium", label: "Vừa", color: "text-amber-500" },
  { value: "low", label: "Thấp", color: "text-green-500" },
];

export default function AddTodo({ onAdd }) {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("medium");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || loading) return;
    setLoading(true);
    await onAdd({ title: title.trim(), priority });
    setTitle("");
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex gap-2">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Thêm công việc mới..."
          className="flex-1 px-4 py-3 rounded-xl border border-[var(--border)] bg-white/70
            text-sm font-body text-[var(--ink)] placeholder:text-[var(--muted)]/60
            outline-none focus:border-[var(--rust)] focus:ring-2 focus:ring-[var(--rust)]/10
            transition-all duration-200"
        />
        <button
          type="submit"
          disabled={!title.trim() || loading}
          className="px-5 py-3 rounded-xl bg-[var(--ink)] text-[var(--cream)] text-sm font-body font-medium
            hover:bg-[var(--rust)] disabled:opacity-40 disabled:cursor-not-allowed
            transition-all duration-200 active:scale-95"
        >
          {loading ? "..." : "Thêm"}
        </button>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs text-[var(--muted)] font-mono">Ưu tiên:</span>
        {PRIORITIES.map((p) => (
          <button
            key={p.value}
            type="button"
            onClick={() => setPriority(p.value)}
            className={`text-xs px-3 py-1 rounded-full border transition-all duration-150
              ${
                priority === p.value
                  ? "border-[var(--ink)] bg-[var(--ink)] text-[var(--cream)] font-medium"
                  : `border-[var(--border)] ${p.color} hover:border-current`
              }`}
          >
            {p.label}
          </button>
        ))}
      </div>
    </form>
  );
}
