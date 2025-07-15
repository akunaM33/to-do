import TodoList from './TodoList';
import './App.css'
import TodoForm from './TodoForm'
{/* Extract from App.jsx */ }
function App() {
  

  return (

    <div>
      <h1>My Todos</h1>
      <TodoForm />
      <TodoList />
      
    </div>

  )
}

export default App
