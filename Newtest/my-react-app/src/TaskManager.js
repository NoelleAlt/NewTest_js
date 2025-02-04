import React, { useState, useEffect } from "react"; 

function TaskManager() { 
 const [tasks, setTasks] = useState(() => {
   const savedTasks = localStorage.getItem("tasks");
   return savedTasks ? JSON.parse(savedTasks) : [];
 }); 
 const [taskInput, setTaskInput] = useState(""); 
 const [filter, setFilter] = useState("all"); 
 const [editTaskId, setEditTaskId] = useState(null); 

 useEffect(() => {
   localStorage.setItem("tasks", JSON.stringify(tasks));
 }, [tasks]);

 const addTask = () => { 
   if (taskInput.trim()) { 
     if (editTaskId) {
       setTasks(tasks.map(task => 
         task.id === editTaskId ? { ...task, text: taskInput } : task
       ));
       setEditTaskId(null);
     } else {
       setTasks([...tasks, { id: Date.now(), text: taskInput, completed: false }]); 
     }
     setTaskInput(""); 
   } 
 }; 

 const toggleTask = (id) => { 
   setTasks(tasks.map((task) => 
     task.id === id ? { ...task, completed: !task.completed } : task 
   )); 
 }; 

 const markAsCompleted = (id) => {
   setTasks(tasks.map((task) => 
     task.id === id ? { ...task, completed: true } : task 
   ));
 };

 const markAsPending = (id) => {
   setTasks(tasks.map((task) => 
     task.id === id ? { ...task, completed: false } : task 
   ));
 };

 const removeTask = (id) => { 
   setTasks(tasks.filter((task) => task.id !== id)); 
 }; 

 const startEdit = (task) => {
   setTaskInput(task.text);
   setEditTaskId(task.id);
 };

 const filteredTasks = tasks.filter((task) => { 
   if (filter === "completed") return task.completed; 
   if (filter === "pending") return !task.completed; 
   return true; 
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
           <button onClick={() => removeTask(task.id)}>❌</button> 
           <button onClick={() => markAsCompleted(task.id)} disabled={task.completed}>✔️</button>
           <button onClick={() => markAsPending(task.id)} disabled={!task.completed}>⏳</button>
         </li> 
       ))} 
     </ul> 
   </div> 
 ); 
} 

export default TaskManager; 