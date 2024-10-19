import "../app/globals.css";
import { initialTasks } from '../app/data';
import { useState,useEffect } from 'react';

 function Home({ tasks: initialTasks }) {
  const [tasks, setTasks] = useState(initialTasks);
  const [newTask, setNewTask] = useState({ title: '', description: '', priority: 'medium' });
  const [error, setError] = useState('');

  // to preserve tasks between page reloads.
  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem('tasks'));
    if (savedTasks) {
      setTasks(savedTasks);
    }
  }, []);
  
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

   const addTask = () => {
      // Validation for title and description
      if (!newTask.title.trim() && !newTask.description.trim()) {
        setError('All fields are required.');
        return;
      }else if(!newTask.description.trim()){
        setError('Description is required.');
        return;
      }else if(!newTask.title.trim()){
        setError('Title is required.');
        return;
      }

   const newId= Date.now()
    const updatedTasks = [...tasks, { ...newTask, id: newId, completed: false }];

    // Sort tasks by priority dynamically
    const sortedTasks = updatedTasks.sort((a, b) => {
      const priorityOrder = { high: 1, medium: 2, low: 3 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });

    setTasks(sortedTasks);
    setNewTask({ title: '', description: '', priority: 'medium' });
    setError(''); // Clear the error message
  };
  
   const editTask = (id, updatedTask) => {
    setTasks(tasks.map(task => (task.id === id ? updatedTask : task)));
  };

   const toggleComplete = (id) => {
    setTasks(tasks.map(task => task.id === id ? { ...task, completed: !task.completed } : task));
  };

   const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };


  return (
    <div>
      <h1>Task Management App</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>} {/* Display error message */}
      <div>
        <input value={newTask.title} onChange={(e) => setNewTask({ ...newTask, title: e.target.value })} placeholder="Task Title" required/>
        <input value={newTask.description} onChange={(e) => setNewTask({ ...newTask, description: e.target.value })} placeholder="Description" required />
        <select value={newTask.priority} onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
        <button onClick={addTask}>Add Task</button>
      </div>
      <ul>
        {tasks.map(task => (
          <li key={task.id} style={{ color: task.priority === 'high' ? 'red' : task.priority === 'medium' ? 'yellow' : 'green' }}>
            <h2>Title: {task.title} <button onClick={() => toggleComplete(task.id)}>{task.completed ? 'Undo' : 'Complete'}</button></h2>
           <p>ID: {task.id}</p>
            <p>Description: {task.description}</p>
            <p>Priority: {task.priority}</p>
            <button onClick={() => editTask(task.id, { ...task, title: prompt('New title', task.title), description: prompt('New description', task.description),priority:prompt('New priority',task.priority) })}>Edit</button>
            <button onClick={() => deleteTask(task.id)}>Delete</button>
          </li>
        ))}
      </ul>
      <h2>Completed Tasks</h2>
      <ul>
        {tasks.filter(task => task.completed).map(task => (
          <li key={task.id}>{task.title}</li>
        ))}
      </ul>
    </div>
  );
}

export async function getServerSideProps() {
  return {
    props: {
      tasks: initialTasks,
    },
  };
}

export default Home;