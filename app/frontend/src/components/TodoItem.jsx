import { useState } from 'react';

const PRIORITY_CONFIG = {
  high:   { label: 'Cao',    dot: 'bg-red-400',    text: 'text-red-500' },
  medium: { label: 'Vừa',   dot: 'bg-amber-400',  text: 'text-amber-500' },
  low:    { label: 'Thấp',  dot: 'bg-green-400',  text: 'text-green-500' },
};

export default function TodoItem({ todo, onToggle, onDelete, onUpdate }) {
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editPriority, setEditPriority] = useState(todo.priority);
  const [removing, setRemoving] = useState(false);

  const handleDelete = () => {
    setRemoving(true);
    setTimeout(() => onDelete(todo.id), 240);
  };

  const handleSave = () => {
    if (!editTitle.trim()) return;
    onUpdate(todo.id, { title: editTitle.trim(), priority: editPriority });
    setEditing(false);
  };

  const p = PRIORITY_CONFIG[todo.priority] || PRIORITY_CONFIG.medium;

  return (
    <div
      className={`group flex items-start gap-3 p-4 rounded-xl border border-[var(--border)] bg-white/60 backdrop-blur-sm
        transition-all duration-200 hover:shadow-md hover:border-[var(--muted)]/40
        ${removing ? 'animate-fade-out' : 'animate-slide-in'}
        ${todo.completed ? 'opacity-60' : ''}`}
    >
      <input
        type="checkbox"
        className="checkbox-custom mt-0.5"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
      />

      <div className="flex-1 min-w-0">
        {editing ? (
          <div className="space-y-2">
            <input
              autoFocus
              value={editTitle}
              onChange={e => setEditTitle(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleSave(); if (e.key === 'Escape') setEditing(false); }}
              className="w-full text-sm border-b border-[var(--rust)] bg-transparent outline-none pb-1 font-body text-[var(--ink)]"
            />
            <div className="flex items-center gap-2">
              {['high','medium','low'].map(pr => (
                <button
                  key={pr}
                  onClick={() => setEditPriority(pr)}
                  className={`text-xs px-2 py-0.5 rounded-full border transition-all
                    ${editPriority === pr
                      ? 'border-[var(--ink)] bg-[var(--ink)] text-[var(--cream)]'
                      : 'border-[var(--border)] text-[var(--muted)] hover:border-[var(--muted)]'}`}
                >
                  {PRIORITY_CONFIG[pr].label}
                </button>
              ))}
              <div className="ml-auto flex gap-1">
                <button onClick={handleSave} className="text-xs px-3 py-1 bg-[var(--sage)] text-white rounded-lg hover:opacity-90 transition-opacity">Lưu</button>
                <button onClick={() => setEditing(false)} className="text-xs px-3 py-1 border border-[var(--border)] text-[var(--muted)] rounded-lg hover:bg-[var(--border)]/40 transition-colors">Huỷ</button>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <p className={`text-sm leading-relaxed break-words font-body ${todo.completed ? 'line-through text-[var(--muted)]' : 'text-[var(--ink)]'}`}>
              {todo.title}
            </p>
            <div className="flex items-center gap-2 mt-1.5">
              <span className={`inline-flex items-center gap-1 text-xs font-mono ${p.text}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${p.dot}`}></span>
                {p.label}
              </span>
              <span className="text-xs text-[var(--muted)]">
                {new Date(todo.created_at).toLocaleDateString('vi-VN')}
              </span>
            </div>
          </div>
        )}
      </div>

      {!editing && (
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
          <button
            onClick={() => { setEditTitle(todo.title); setEditPriority(todo.priority); setEditing(true); }}
            className="p-1.5 rounded-lg text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--border)]/60 transition-colors"
            title="Chỉnh sửa"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
          </button>
          <button
            onClick={handleDelete}
            className="p-1.5 rounded-lg text-[var(--muted)] hover:text-red-500 hover:bg-red-50 transition-colors"
            title="Xoá"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
