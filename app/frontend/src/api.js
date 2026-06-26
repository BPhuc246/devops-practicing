import axios from "axios";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_URL}/api`,
});

export const getTodos = () => api.get("/todos").then((r) => r.data);
export const createTodo = (data) =>
  api.post("/todos", data).then((r) => r.data);
export const toggleTodo = (id) =>
  api.patch(`/todos/${id}/toggle`).then((r) => r.data);
export const updateTodo = (id, data) =>
  api.put(`/todos/${id}`, data).then((r) => r.data);
export const deleteTodo = (id) =>
  api.delete(`/todos/${id}`).then((r) => r.data);
export const deleteCompleted = () =>
  api.delete("/todos/completed/all").then((r) => r.data);
