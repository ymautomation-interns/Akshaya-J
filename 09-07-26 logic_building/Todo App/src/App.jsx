import { useState } from "react";
import "./App.css";

function App() {
  const [task, setTask] = useState("");
  const [todos, setTodos] = useState([]);

  const addTodo = () => {
    if (task.trim() === "") return;

    const newTodo = {
      id: Date.now(),
      text: task,
      completed: false,
    };

    setTodos([...todos, newTodo]);
    setTask("");
  };

  const toggleComplete = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id
          ? { ...todo, completed: !todo.completed }
          : todo
      )
    );
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  return (
    <div className="container">
      <div className="todo-card">

        <h1>📝 My Todo List</h1>
        <p>Stay organized and productive</p>

        <div className="input-section">
          <input
            type="text"
            placeholder="Enter your task..."
            value={task}
            onChange={(e) => setTask(e.target.value)}
          />

          <button onClick={addTodo}>
            Add
          </button>
        </div>

        <div className="todo-list">

          {todos.length === 0 && (
            <p className="empty">
              No tasks available
            </p>
          )}

          {todos.map((todo) => (
            <div className="todo-item" key={todo.id}>

              <div className="left">

                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleComplete(todo.id)}
                />

                <span
                  className={
                    todo.completed
                      ? "completed"
                      : ""
                  }
                >
                  {todo.text}
                </span>

              </div>

              <button
                className="delete"
                onClick={() => deleteTodo(todo.id)}
              >
                🗑
              </button>

            </div>
          ))}

        </div>

      </div>
    </div>
  );
}

export default App;