import { useState } from 'react';
import TodoList from './features/TodoList/TodoList';
import TodoForm from './features/TodoForm';

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

  function updateTodo(editedTodo) {
    const editedTodos = todoList.map((t) => {
      if (t.id === editedTodo.id) {
        return { ...editedTodo };
      } else {
        return t;
      }
    });
    setTodoList(editedTodos);
  }

  return (
    <div>
      <h1>Todo List</h1>
      <TodoForm onAddTodo={addTodo} />

      <TodoList list={todoList} onCompleteTodo={completeTodo} onUpdateTodo={updateTodo}/>
    </div>
  )
}

export default App
