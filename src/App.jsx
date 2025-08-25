import { useEffect, useState } from 'react';
import TodoList from './features/TodoList/TodoList';
import TodoForm from './features/TodoForm';

function App() {

  const url = `https://api.airtable.com/v0/${import.meta.env.VITE_BASE_ID}/${import.meta.env.VITE_TABLE_NAME}`;
  const token = `Bearer ${import.meta.env.VITE_PAT}`;

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);

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

  // 
  const addTodo = async (newTodo) => {
    const payload = {
      records: [{
        fields: {
          title: newTodo,
  //        isCompleted: false,
        }
      }],
    };
    const options = {
      method: 'POST',
      headers: {
        "Authorization": token, "Content-Type": 'application/json',
      },
      body: JSON.stringify(payload),
    };
    try {
      setIsSaving(true);
      const resp = await fetch(url, options);                //console.log("Response: ", resp);   
      if (!resp.ok) {
        throw new Error(resp.message);
      }
      const { records } = await resp.json();                  //console.log("Records: ", records);
      const savedTodo = {
        id: records[0].id,
        ...records[0].fields,
      }
      if (!records[0].fields.isCompleted) { savedTodo.isCompleted = false; }
      setTodoList([...todoList, savedTodo]);

    } catch (error) {
      console.log(error);
      setErrorMessage(error.message);
    } finally {
      setIsSaving(false);
    }
  }

  const updateTodo = async (editedTodo) => {
    const originalTodo = todoList.find((todo) => todo.id === editedTodo.id);
    const payload = {
      records: [ {
        id: editedTodo.id,
        fields: {
          title: editedTodo.title,
//          isCompleted: editedTodo.isCompleted,
        },
      }, ],
    };
    const options = {
      method: "PATCH",
      headers: {"Authorization": token, "Content-Type": 'application/json',},
      body: JSON.stringify(payload),
    };
    try {
      setIsSaving(true);
      const resp = await fetch(url, options);                         console.log("Response: ", resp);
      if (!resp.ok) { throw Error(resp.message)}
      const { records } = await resp.json();                          console.log("Records: ", records);
      const patchedTodo = {
        id: records[0].id,
        ...records[0].fields,
      };
       if (!records[0].fields.isCompleted) { patchedTodo.isCompleted = false; }
      setTodoList((old) => old.map(item => item.id === patchedTodo.id ? (
        {...item, ...patchedTodo}) : ( item )
      ));

    } catch(error) {
      console.log(error);
      setErrorMessage(`${error.message}. Reverting todo...`);
      const revertedTodos = todoList.map((t) => {
        if (t.id === editedTodo.id) { return originalTodo; }
        else { return t; }
      });
      setTodoList([...revertedTodos]);  
    
    } finally {
      setIsSaving(false);
    }
    // const editedTodos = todoList.map((t) => {
    //   if (t.id === editedTodo.id) {
    //     return { ...editedTodo };
    //   } else {
    //     return t;
    //   }
    // });
    //setTodoList(editedTodos);
  }

  return (
    <div>
      <h1>Todo List</h1>
      <TodoForm onAddTodo={addTodo} isSaving={isSaving} />

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
