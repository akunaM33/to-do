import { useEffect, useState } from 'react';
import TodoList from './features/TodoList/TodoList';
import TodoForm from './features/TodoForm';
import TodosViewForm from './features/TodosViewForm';

const url = `https://api.airtable.com/v0/${import.meta.env.VITE_BASE_ID}/${import.meta.env.VITE_TABLE_NAME}`;
const token = `Bearer ${import.meta.env.VITE_PAT}`;

function encodeUrl({ queryString, sortField, sortDirection }) {
  let searchQuery = '';
  if (queryString) {
    searchQuery = `&filterByFormula=SEARCH("${queryString}", +title)`
  }
  let sortQuery = `sort[0][field]=${sortField}&sort[0][direction]=${sortDirection}`;
  return encodeURI(`${url}?${sortQuery}${searchQuery}`);
}

function App() {

  const [todoList, setTodoList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [sortField, setSortField] = useState("createdTime");
  const [sortDirection, setSortDirection] = useState('desc');
  const [queryString, setQueryString] = useState('');

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
        const resp = await fetch(encodeUrl({ queryString, sortField, sortDirection }), options);
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
        });                                               console.log("Records: ", fetchedRecords);
        setTodoList([...fetchedRecords]);
      } catch (error) {
        setErrorMessage(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTodos();
  }, [queryString, sortField, sortDirection]);

  ////////////////////// TODO is Completed:  ////////////////////////////////
  const completeTodo = async (id) => {

    const updatedTodos = todoList.map((t) => {
      if (t.id === id) {
        return { ...t, isCompleted: true };
      } else {
        return t;
      }
    });
    setTodoList(updatedTodos);//UPDATE UI

    const originalTodo = todoList.find((todo) => todo.id === id);
    const payload = {
      records: [{
        id: id,
        fields: {
          title: originalTodo.title,
          isCompleted: true,
        },
      },],
    };
    const options = {
      method: "PATCH",
      headers: { "Authorization": token, "Content-Type": 'application/json', },
      body: JSON.stringify(payload),
    };

    try {
      const resp = await fetch(encodeUrl({ queryString, sortField, sortDirection }), options);
      if (!resp.ok) { throw Error(resp.message) }
      const { records } = await resp.json();
      const patchedTodo = {
        id: records[0].id,
        ...records[0].fields,
      };
      if (!records[0].fields.isCompleted) { patchedTodo.isCompleted = false; }
      setTodoList((old) => old.map(item => item.id === patchedTodo.id ? (
        { ...item, ...patchedTodo }) : (item)
      ));

    } catch (error) {
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
  }
  ///////////////////// ADD NEW TODO: /////////////////////////////
  const addTodo = async (newTodo) => {
    const payload = {
      records: [{
        fields: {
          title: newTodo,
          isCompleted: false,
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
      const resp = await fetch(encodeUrl({ queryString, sortField, sortDirection }), options);
      if (!resp.ok) {
        throw new Error(resp.message);
      }
      const { records } = await resp.json();
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
  ///////////////////////// UPDATE TODO: //////////////////////////////////
  const updateTodo = async (editedTodo) => {
    const originalTodo = todoList.find((todo) => todo.id === editedTodo.id);
    const payload = {
      records: [{
        id: editedTodo.id,
        fields: {
          title: editedTodo.title,
        },
      },],
    };
    const options = {
      method: "PATCH",
      headers: { "Authorization": token, "Content-Type": 'application/json', },
      body: JSON.stringify(payload),
    };
    try {
      setIsSaving(true);
      const resp = await fetch(encodeUrl({ queryString, sortField, sortDirection }), options);
      if (!resp.ok) { throw Error(resp.message) }
      const { records } = await resp.json();
      const patchedTodo = {
        id: records[0].id,
        ...records[0].fields,
      };
      if (!records[0].fields.isCompleted) { patchedTodo.isCompleted = false; }
      setTodoList((old) => old.map(item => item.id === patchedTodo.id ? (
        { ...item, ...patchedTodo }) : (item)
      ));

    } catch (error) {
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
  }

  return (
    <div>
      <h1>Todo List</h1>
      <TodoForm onAddTodo={addTodo} isSaving={isSaving} />

      <TodoList list={todoList}
        onCompleteTodo={completeTodo}
        onUpdateTodo={updateTodo}
        isLoading={isLoading} />
      <hr />
      <TodosViewForm
        sortField={sortField}
        setSortField={setSortField}
        sortDirection={sortDirection}
        setSortDirection={setSortDirection} 
        queryString={queryString}
        setQueryString={setQueryString}/>

      {errorMessage &&
        <div><hr /><p>{errorMessage}</p>
          <button onClick={() => setErrorMessage('')}>Dismiss</button>
        </div>
      }
    </div>
  )
}

export default App
