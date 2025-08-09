import { useState } from 'react';
import TodoList from './TodoList';
import TodoForm from './TodoForm'

function App() {

  const [todoList, setTodoList] = useState([]);

  function completeTodo(id) {
    const updatedTodos = todoList.map((t) => {
      if (t.id === id) {
        return { ...t, isCompleted: true };
      } else {
        return t;
      }
    });
    setTodoList(updatedTodos);
  }

  function addTodo(title) {
    const newTodo = { title: title, id: Date.now(), isCompleted: false }
    setTodoList([...todoList, newTodo]);
  }

  return (
    <div>
      <h1>My Todos</h1>
      <TodoForm onAddTodo={addTodo} />

      <TodoList list={todoList} onCompleteTodo={completeTodo} />
    </div>
  )
}

export default App
