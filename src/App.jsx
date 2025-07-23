import {useState} from 'react';
import './App.css'
import TodoList from './TodoList';
import TodoForm from './TodoForm'
{/* Extract from App.jsx */ }
function App() {
  
const [newTodo, setNewTodo]  = useState('example text');
  return (

    <div>
      <h1>My Todos</h1>
      <TodoForm />
      <p>{newTodo}</p>
      <TodoList />
      
    </div>

  )
}

export default App
