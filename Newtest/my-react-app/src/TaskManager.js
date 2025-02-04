import React, { useReducer, useEffect, useState } from "react"; 

const ACTIONS = {
  ADD_TASK: 'add-task',
  REMOVE_TASK: 'remove-task',
  TOGGLE_TASK: 'toggle-task',
  SET_TASKS: 'set-tasks',
  EDIT_TASK: 'edit-task',
  MARK_AS_COMPLETED: 'mark-as-completed',
  MARK_AS_PENDING: 'mark-as-pending',
};

const initialState = {
  tasks: [],
};

const reducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.ADD_TASK:
      return { ...state, tasks: [...state.tasks, action.payload] };
    case ACTIONS.REMOVE_TASK:
      return { ...state, tasks: state.tasks.filter(task => task.id !== action.payload) };
    case ACTIONS.TOGGLE_TASK:
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload ? { ...task, completed: !task.completed } : task
        ),
      };
    case ACTIONS.SET_TASKS:
      return { ...state, tasks: action.payload };
    case ACTIONS.EDIT_TASK:
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload.id ? { ...task, text: action.payload.text } : task
        ),
      };
    case ACTIONS.MARK_AS_COMPLETED:
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload ? { ...task, completed: true } : task
        ),
      };
    case ACTIONS.MARK_AS_PENDING:
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload ? { ...task, completed: false } : task
        ),
      };
    default:
      return state;
  }
};

function TaskManager() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [taskInput, setTaskInput] = useState("");
  const [editTaskId, setEditTaskId] = useState(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const savedTasks = localStorage.getItem("tasks");
    if (savedTasks) {
      dispatch({ type: ACTIONS.SET_TASKS, payload: JSON.parse(savedTasks) });
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(state.tasks));
  }, [state.tasks]);

  const addTask = () => {
    if (taskInput.trim()) {
      if (editTaskId) {
        dispatch({
          type: ACTIONS.EDIT_TASK,
          payload: { id: editTaskId, text: taskInput },
        });
        setEditTaskId(null);
      } else {
        dispatch({
          type: ACTIONS.ADD_TASK,
          payload: { id: Date.now(), text: taskInput, completed: false },
        });
      }
      setTaskInput("");
    }
  };

  const removeTask = (id) => {
    dispatch({ type: ACTIONS.REMOVE_TASK, payload: id });
  };

  const toggleTask = (id) => {
    dispatch({ type: ACTIONS.TOGGLE_TASK, payload: id });
  };

  const startEdit = (task) => {
    setTaskInput(task.text);
    setEditTaskId(task.id);
  };

  const markAsCompleted = (id) => {
    dispatch({ type: ACTIONS.MARK_AS_COMPLETED, payload: id });
  };

  const markAsPending = (id) => {
    dispatch({ type: ACTIONS.MARK_AS_PENDING, payload: id });
  };

  const filteredTasks = state.tasks.filter((task) => {
    if (filter === "completed") return task.completed;
    if (filter === "pending") return !task.completed;
    return true; // "all"
  });

  return (
    <div className="container">
      <h2>Task Manager</h2>
      <input
        type="text"
        value={taskInput}
        onChange={(e) => setTaskInput(e.target.value)}
        placeholder="Enter a task..."
      />
      <button onClick={addTask}>{editTaskId ? "Update Task" : "Add Task"}</button>

      <div className="filters">
        <button onClick={() => setFilter("all")}>All</button>
        <button onClick={() => setFilter("completed")}>Completed</button>
        <button onClick={() => setFilter("pending")}>Pending</button>
      </div>

      <ul>
        {filteredTasks.map((task) => (
          <li key={task.id} className={task.completed ? "completed" : ""}>
            <span onClick={() => toggleTask(task.id)}>{task.text}</span>
            <button onClick={() => startEdit(task)}>✏️</button>
            <button onClick={() => removeTask(task.id )}>❌</button>
            <button onClick={() => markAsCompleted(task.id)}>✔️</button>
            <button onClick={() => markAsPending(task.id)}>⏳</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

// Default export at the top level
export default TaskManager;