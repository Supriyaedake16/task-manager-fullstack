import { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:8080/api/tasks";

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const loadTasks = async () => {
    const res = await axios.get(API);
    setTasks(res.data);
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const addTask = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    await axios.post(API, { title, description, completed: false });
    setTitle("");
    setDescription("");
    loadTasks();
  };

  const toggleTask = async (task) => {
    await axios.put(`${API}/${task.id}`, { ...task, completed: !task.completed });
    loadTasks();
  };

  const deleteTask = async (id) => {
    await axios.delete(`${API}/${id}`);
    loadTasks();
  };

  return (
    <div style={{ maxWidth: 500, margin: "40px auto", fontFamily: "sans-serif" }}>
      <h1>Task Manager</h1>

      <form onSubmit={addTask} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <input placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
        <button type="submit">Add Task</button>
      </form>

      <ul style={{ padding: 0, listStyle: "none" }}>
        {tasks.map((task) => (
          <li key={task.id} style={{ display: "flex", gap: 8, alignItems: "center", margin: "12px 0" }}>
            <input type="checkbox" checked={task.completed} onChange={() => toggleTask(task)} />
            <div style={{ flex: 1, textDecoration: task.completed ? "line-through" : "none" }}>
              <strong>{task.title}</strong>
              <div>{task.description}</div>
            </div>
            <button onClick={() => deleteTask(task.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}