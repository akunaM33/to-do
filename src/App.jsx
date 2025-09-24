import { useCallback, useEffect, useReducer, useState } from 'react';
import styles from './App.module.css';
import TodoList from './features/TodoList/TodoList';
import TodoForm from './features/TodoForm';
import TodosViewForm from './features/TodosViewForm';
import {
  reducer as todosReducer,
  actions as todoActions,
  initialState as initialTodosState,
} from './reducers/todos.reducer';

const url = `https://api.airtable.com/v0/${import.meta.env.VITE_BASE_ID}/${import.meta.env.VITE_TABLE_NAME}`;
const token = `Bearer ${import.meta.env.VITE_PAT}`;

function App() {
  const [todoState, dispatch] = useReducer(todosReducer, initialTodosState);

  const [todoList, setTodoList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [sortField, setSortField] = useState("createdTime");
  const [sortDirection, setSortDirection] = useState('desc');
  const [queryString, setQueryString] = useState('');

  const encodeUrl = useCallback(() => {
    let searchQuery = '';
    if (queryString) {
      searchQuery = `&filterByFormula=SEARCH("${queryString}", +title)`;
    }
    let sortQuery = `sort[0][field]=${sortField}&sort[0][direction]=${sortDirection}`;
    return encodeURI(`${url}?${sortQuery}${searchQuery}`);
  }, [{ queryString, sortField, sortDirection }]);

  useEffect(() => {
    const fetchTodos = async () => {
      //setIsLoading(true);
      dispatch({type: todoActions.fetchTodos})
      const options = {
        method: 'GET',
        headers: {
          "Authorization": token
        }
      }
      try {
        const resp = await fetch(encodeUrl(), options);
        if (!resp.ok) {
          throw new Error(resp.message);
        }
        const res = await resp.json();
                                                                      // console.log("Fetch Records: ", res.records);
        dispatch({type: todoActions.loadTodos, records: res.records})
      } catch (error) {
        dispatch({type: todoActions.setLoadError});
      } finally {
        setIsLoading(false);
      }
    };
    fetchTodos();
  }, [queryString, sortField, sortDirection]);

  ///////////////////// ADD NEW TODO: /////////////////////////////
  const addTodo = async (todoTitle) => {
    const payload = {
      records: [{
        fields: {
          title: todoTitle,
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
      dispatch({type: todoActions.startRequest});
      const resp = await fetch(encodeUrl(), options);
      if (!resp.ok) {
        throw new Error(resp.message);
      }
      const res = await resp.json();           
      dispatch({type: todoActions.addTodo, payload: res.records[0]});
    } catch (error) {
      dispatch({type: todoActions.setLoadError});
    } finally {
      dispatch({type: todoActions.endRequest});
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
      const resp = await fetch(encodeUrl(), options);
      if (!resp.ok) { throw Error(resp.message) }
      const res = await resp.json();
      
      dispatch({type: todoActions.updateTodo, payload: res.records[0]});
    } catch (error) {
      console.log(error);
      setErrorMessage(`${error.message}. Reverting todo...`);
      
      dispatch({type: actions.revertTodo, payload: id})
    } finally {
      setIsSaving(false);
    }
  }
   ////////////////////// TODO is Completed:  ////////////////////////////////
  const completeTodo = async (id) => {

    dispatch({type: todoActions.completeTodo, payload: id});
    
  }

  return (
    <div className={styles.app}>
      <h1>Todo List</h1>
      <TodoForm onAddTodo={addTodo} isSaving={todoState.isSaving} />

      <TodoList list={todoState.todoList}
        onCompleteTodo={completeTodo}
        onUpdateTodo={updateTodo}
        isLoading={todoState.isLoading} />
      <hr />
      <TodosViewForm
        sortField={sortField}
        setSortField={setSortField}
        sortDirection={sortDirection}
        setSortDirection={setSortDirection}
        queryString={queryString}
        setQueryString={setQueryString} />

      {errorMessage &&
        <div className={styles.err}><hr /><p>{errorMessage}</p>
          <button onClick={dispatch({type: actions.clearError})}>Dismiss</button>
        </div>
      }
    </div>
  )
}

export default App
