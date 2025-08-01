import {useState} from 'react';
import TodoList from './TodoList';
import TodoForm from './TodoForm'

function App() {
  
const [todoList, setTodoList]  = useState([]);

function addTodo(title){
  const newTodo = {title: title, id: Date.now()}
  setTodoList([...todoList, newTodo]);
}

  return (
    <div>
      <h1>My Todos</h1>
      <TodoForm onAddTodo = {addTodo}/>
      
      <TodoList list = {todoList}/>
    </div>
  )
}

export default App
