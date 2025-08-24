import { useEffect, useState } from 'react';
import TodoList from './features/TodoList/TodoList';
import TodoForm from './features/TodoForm';

function App() {

  const url = `https://api.airtable.com/v0/${import.meta.env.VITE_BASE_ID}/${import.meta.env.VITE_TABLE_NAME}`;
  const token = `Bearer ${import.meta.env.VITE_PAT}`;

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchTodos = async () => {
      setIsLoading(true);
      const options = {
        method: 'GET',
        headers: {
          "Authorization": token
        }
      }
      try {
        const resp = await fetch(url, options);
        if (!resp.ok) {
          throw new Error(resp.message);
        }
        const res = await resp.json();
        const fetchedRecords = res.records.map((record) => {
          const todo = {
            id: record.id,
            ...record.fields,
          }; 
          //Airtable doesn't return properties whose values are false or empty strings
          //explicity setting property to false so field exists and prevents logic bugs
          if (!todo.isCompleted) {
            todo.isCompleted = false;
          }
          return todo;
        });
        setTodoList([...fetchedRecords]);
      } catch (error) {
        setErrorMessage(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTodos();
  }, []);

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

      <TodoList list={todoList}
        onCompleteTodo={completeTodo}
        onUpdateTodo={updateTodo}
        isLoading={isLoading} />

      {errorMessage &&
        <div><hr /><p>{errorMessage}</p>
          <button onClick={() => setErrorMessage('')}>Dismiss</button>
        </div>
      }
    </div>
  )
}

export default App
