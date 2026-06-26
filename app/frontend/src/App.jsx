import { useState, useEffect } from "react";
import {
  getTodos,
  createTodo,
  toggleTodo,
  deleteTodo,
  updateTodo,
  deleteCompleted,
} from "./api";
import TodoItem from "./components/TodoItem";
import AddTodo from "./components/AddTodo";

const FILTERS = ["Tất cả", "Đang làm", "Hoàn thành"];

export default function App() {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState("Tất cả");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() =>
        setError("Không thể kết nối server. Hãy chắc chắn backend đang chạy."),
      )
      .finally(() => setLoading(false));
  }, []);

  const handleAdd = async (data) => {
    try {
      const todo = await createTodo(data);
      setTodos((prev) => [todo, ...prev]);
    } catch {
      setError("Lỗi khi thêm công việc.");
    }
  };

  const handleToggle = async (id) => {
    try {
      const updated = await toggleTodo(id);
      setTodos((prev) => prev.map((t) => (t.id === id ? updated : t)));
    } catch {
      setError("Lỗi khi cập nhật.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTodo(id);
      setTimeout(
        () => setTodos((prev) => prev.filter((t) => t.id !== id)),
        250,
      );
    } catch {
      setError("Lỗi khi xoá.");
    }
  };

  const handleUpdate = async (id, data) => {
    try {
      const updated = await updateTodo(id, data);
      setTodos((prev) => prev.map((t) => (t.id === id ? updated : t)));
    } catch {
      setError("Lỗi khi cập nhật.");
    }
  };

  const handleDeleteCompleted = async () => {
    try {
      await deleteCompleted();
      setTodos((prev) => prev.filter((t) => !t.completed));
    } catch {
      setError("Lỗi khi xoá.");
    }
  };

  console.log("todos =", todos);
  console.log("Array?", Array.isArray(todos));
  console.log("typeof =", typeof todos);

  const filtered = (todos || []).filter((t) => {
    if (filter === "Đang làm") return !t.completed;
    if (filter === "Hoàn thành") return t.completed;
    return true;
  });

  const doneCount = todos.filter((t) => t.completed).length;
  const totalCount = todos.length;
  const progress = totalCount ? Math.round((doneCount / totalCount) * 100) : 0;

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <p className="font-mono text-xs text-[var(--rust)] tracking-widest uppercase mb-2">
            Danh sách công việc
          </p>
          <h1 className="font-display text-4xl text-[var(--ink)] leading-tight">
            Hôm nay,
            <br />
            <em className="font-display italic text-[var(--rust)]">
              làm gì nhỉ?
            </em>
          </h1>

          {totalCount > 0 && (
            <div className="mt-6">
              <div className="flex justify-between text-xs font-mono text-[var(--muted)] mb-2">
                <span>
                  {doneCount}/{totalCount} hoàn thành
                </span>
                <span>{progress}%</span>
              </div>
              <div className="h-1.5 bg-[var(--border)] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[var(--sage)] rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Add form */}
        <div className="mb-6 p-5 rounded-2xl border border-[var(--border)] bg-white/50 backdrop-blur-sm shadow-sm">
          <AddTodo onAdd={handleAdd} />
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm font-body flex justify-between items-center">
            <span>{error}</span>
            <button
              onClick={() => setError(null)}
              className="ml-2 opacity-60 hover:opacity-100"
            >
              ✕
            </button>
          </div>
        )}

        {/* Filter tabs */}
        <div className="flex gap-1 mb-4 p-1 rounded-xl bg-[var(--border)]/40">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex-1 py-2 text-xs font-body font-medium rounded-lg transition-all duration-150
                ${
                  filter === f
                    ? "bg-white text-[var(--ink)] shadow-sm"
                    : "text-[var(--muted)] hover:text-[var(--ink)]"
                }`}
            >
              {f}
              {f === "Tất cả" && totalCount > 0 && (
                <span className="ml-1 font-mono text-[10px] opacity-60">
                  ({totalCount})
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Todo list */}
        <div className="space-y-2 max-h-[480px] overflow-y-auto scrollbar-thin pr-0.5">
          {loading ? (
            <div className="py-16 text-center">
              <div className="inline-block w-6 h-6 border-2 border-[var(--border)] border-t-[var(--rust)] rounded-full animate-spin mb-3" />
              <p className="text-sm text-[var(--muted)] font-body animate-pulse-soft">
                Đang tải...
              </p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-3xl mb-3">
                {filter === "Hoàn thành"
                  ? "🎉"
                  : filter === "Đang làm"
                    ? "✨"
                    : "📝"}
              </p>
              <p className="text-sm text-[var(--muted)] font-body">
                {filter === "Hoàn thành"
                  ? "Chưa có gì hoàn thành."
                  : filter === "Đang làm"
                    ? "Không có việc đang làm."
                    : "Chưa có công việc nào. Thêm ngay!"}
              </p>
            </div>
          ) : (
            filtered.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={handleToggle}
                onDelete={handleDelete}
                onUpdate={handleUpdate}
              />
            ))
          )}
        </div>

        {/* Footer actions */}
        {doneCount > 0 && (
          <div className="mt-4 flex justify-end">
            <button
              onClick={handleDeleteCompleted}
              className="text-xs text-[var(--muted)] hover:text-red-500 font-mono transition-colors duration-150 underline underline-offset-2"
            >
              Xoá {doneCount} việc đã xong
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
